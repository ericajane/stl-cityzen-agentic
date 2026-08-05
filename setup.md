# Agent Container Setup — stl-cityzen

## Build

```bash
docker build -t stl-cityzen-agent .
```

## Run

```bash
docker run -it --rm \
  --name stl-cityzen-agent \
  -v "$(pwd)":/workspace \
  -v stl-cityzen-node-modules:/workspace/node_modules \
  -v "$(pwd)/.env.agent":/workspace/.env:ro \
  -v stl-cityzen-claude-auth:/claude-auth \
  stl-cityzen-agentic-agent
```

Before the first run, copy `.env.agent.example` to `.env.agent` (it's gitignored, sits next to your real `.env`, and holds only mock values — see comments in that file for why).

### What each mount does and why

| Mount | Purpose |
|---|---|
| `$(pwd):/workspace` | The actual project — bind mount, so agent edits land on your host repo and persist after the container exits. |
| `stl-cityzen-node-modules:/workspace/node_modules` | Named volume, **not** a bind mount. On first run it's empty, so Docker copies the Linux-built `node_modules` already baked into the image at that path — this is what keeps the container from inheriting your Mac-built native binaries (`better-sqlite3`, `sass-embedded-darwin-arm64`) from the host bind mount. After that it persists across container restarts, so you're not reinstalling every time. |
| `$(pwd)/.env.agent:/workspace/.env:ro` | Overlays just the `.env` file with mock secrets, read-only, so the agent never sees your real `CSB_API_KEY` or `JWT_SECRET` even though the rest of the repo is mounted. |
| `stl-cityzen-claude-auth:/claude-auth` | Named volume so Claude Code's login credential survives container restarts (per the entrypoint script's save/restore logic), without writing it to the bind-mounted project folder. |

### What's ephemeral vs persistent

- **Persistent (survives container exit):** everything under `/workspace` via the bind mount (your actual source), the `node_modules` volume, the `claude-auth` volume.
- **Ephemeral (gone on exit):** anything the agent writes to `/tmp`, and the container's own root filesystem layer — so temp downloads or scratch files the agent creates outside `/workspace` disappear, which is what you want for build cruft.

## Verify the filesystem boundary

Inside the container:

```bash
ls /workspace          # should show apps/, libs/, data/, package.json, etc.
ls /root /home 2>&1     # should NOT show your host home directory contents
cat /workspace/.env     # should show mock values, not your real CSB_API_KEY/JWT_SECRET
```

## Smoke test

Prompt given to the agent:

> Summarize this repo's structure and write the summary to /workspace/agent-summary.md

Terminal output:

```
[ PASTE YOUR ACTUAL SMOKE-TEST OUTPUT HERE ]
```

After exiting the container, confirm `agent-summary.md` exists on the host at the project root, and that nothing appeared outside `/workspace` (no stray host files touched).

---

## Security decisions 

**What local services does the project expect?**
None as external services — everything runs in-process. The backend uses `better-sqlite3` against a local file (`data/csb.db`), no Postgres/Redis/etc. to stand up separately.

**What environment variables or credentials does the project reference?**
`CSB_API_KEY`, `CSB_API_BASE_URL`, `DATA_YEAR_FROM`, `JWT_SECRET`, `JWT_EXPIRES_IN` (from `.env.example`).

**Which of those credentials can be mocked, replaced with test values, or omitted?**
`CSB_API_KEY` and `JWT_SECRET` are mocked (see `.env.agent.example`) — no test in the repo hits the live CSB API or checks a JWT against a specific real secret. `CSB_API_BASE_URL`, `DATA_YEAR_FROM`, and `JWT_EXPIRES_IN` aren't sensitive and are kept as their real (non-secret) values.

**What is the smallest folder you can safely mount for the agent?**
The whole repo root — Nx workspaces share config (`nx.json`, `tsconfig.base.json`) across `apps/` and `libs/`, so mounting a subfolder would break the build graph. The boundary is enforced at the *file* level instead: `.env` is overlaid with a mock copy rather than narrowing the mount.

**Does the agent need network access for this task?**
Yes, but only because Claude Code itself needs to reach Anthropic's API to run at all — not because the app under test needs it. The app's own live-API integration (`POST /api/csb-requests/sync`) is out of scope for the agent's default tasks.

**What install, test, and build commands does this repo already define?**
- Install: `npm ci --legacy-peer-deps` (matches `.github/workflows/ci.yml`)
- Test: `npx nx test backend`, `npx nx test frontend` (Jest)
- Build: `npx nx build backend`, `npx nx build frontend`
- Lint: `npx nx run-many -t lint`
- Data ingest (not part of default CI): `npx nx run backend:ingest`

**What runtime, package manager, and development tools does the container need?**
Node 20 (pinned to match CI), npm, TypeScript/Nx toolchain (installed via `npm ci`), plus `build-essential`/`python3` as a fallback in case `better-sqlite3`'s prebuilt binary isn't available for the container's platform.
