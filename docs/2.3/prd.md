This workflow builds STL Cityzen's frontend visualization features — chart by ward, chart by problem type, year-over-year comparison chart, and map view (requiring SRX/SRY → WGS84 coordinate conversion) — through an interactive, multi-turn session with the developer, one feature at a time.

Trigger: A developer invokes claude from the repo root and works with the agent conversationally across a session, naming which roadmap visualization feature to build, refine, or discuss, switching between features and revising requirements as the session progresses.

Scope: The frontend visualization roadmap items (chart by ward, chart by problem type, year-over-year comparison chart, map view). Each feature is built one at a time; the agent must stay coherent across changing requirements and feature switches rather than treating each turn as a one-shot request.

Decision Events:

Before doing anything else in a session, the agent checks for `docs/feature-builder-log.md` and creates it if missing — this is the persistent record of what was decided and why, since chat history alone can't be relied upon to hold it.

If a real decision is made (chart type, grouping, library choice, aggregation approach), the agent appends an entry to the decision log rather than relying on conversation history to hold it.

If a new plan conflicts with an earlier confirmed decision (e.g. a different aggregation style than what was used for an existing chart), the agent flags the conflict explicitly and asks which should win, rather than silently picking one.

If a later decision reverses an earlier one, the agent marks the earlier entry as superseded rather than deleting it.

Before starting a new feature, the agent proposes a checkpoint: summarize what shipped, note anything open or deferred, and offer to compact/summarize context — it does not start the next feature until the developer confirms.

Actions (per feature):
1. Investigate the nearest existing analog (e.g. the `/api/csb-requests/stats/monthly` endpoint and its Chart.js frontend component) before writing any code, so the new feature stays structurally consistent with what's already there.
2. Propose a short plan (endpoint shape, chart library usage, grouping logic) and confirm it with the developer before writing code.
3. Check the decision log for conflicts with the proposed plan before implementing.
4. Implement: backend endpoint changes first if needed, then frontend integration.
5. Verify the feature against its acceptance criteria before considering it done.
6. Log the decision(s) made during this feature in `docs/feature-builder-log.md`.

Acceptance Criteria:
1. The shipped feature matches the developer's current requirements, not a superseded version.
2. Decisions made earlier in the session were respected unless explicitly revised by the developer.
3. Nothing was pushed, published, or deployed.
4. `docs/feature-builder-log.md` accurately reflects what happened, including any reversed or revised decisions.
