# stl-cityzen is a Node/TypeScript Nx monorepo (Angular frontend, NestJS
# backend, SQLite via better-sqlite3) — not the Python project the course
# template assumes, so we base on Node instead of Python and drop the
# requirements.txt step entirely.
#
# Node 20 chosen to match .github/workflows/ci.yml (actions/setup-node
# pins node-version: 20), so "works in the container" == "works in CI".
FROM node:20-bookworm-slim

WORKDIR /workspace

# build-essential + python3: better-sqlite3 is a native addon. Most of the
# time npm pulls a prebuilt binary for linux/x64, but if that ever misses
# (e.g. a future bump, or an arm64 host), npm falls back to compiling from
# source via node-gyp, which needs these. git/bash/curl/ca-certificates are
# general agent tooling; nano/procps are debugging QoL, same as the course
# template.
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    curl \
    git \
    bash \
    ca-certificates \
    nano \
    procps \
    && rm -rf /var/lib/apt/lists/*

# Install Claude Code
RUN npm install -g @anthropic-ai/claude-code

# Install OpenCode
RUN npm install -g opencode-ai

# --- Dependency layer -------------------------------------------------
# Copy only the manifest files first (better layer caching: this layer only
# rebuilds when dependencies change, not on every source edit) and run a
# clean, reproducible install matching CI's flags exactly.
#
# This bakes node_modules into the IMAGE at /workspace/node_modules, built
# fresh on Linux. We deliberately do NOT copy the rest of the source here —
# app code is bind-mounted at `docker run` time instead, so the agent's
# edits land directly on the host repo.
#
# Why bake node_modules into the image instead of installing it at
# container start: this repo's committed node_modules folder was built on
# macOS (e.g. sass-embedded-darwin-arm64, and better-sqlite3's compiled
# binary) — those binaries won't load on Linux. If we just bind-mount the
# host folder as-is, /workspace/node_modules inside the container would be
# the broken Mac copy. Baking a Linux-built copy into the image, combined
# with the node_modules *named volume* in the run command (see setup.md),
# means Docker auto-populates that volume from this image layer on first
# run, the volume then shadows whatever node_modules the bind mount would
# have provided, and no npm install (i.e. no network) is needed at runtime.
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Claude Code configuration: default settings + status line
RUN mkdir -p /root/.claude
COPY settings.json /root/.claude/settings.json
COPY statusline.sh /root/.claude/statusline.sh
RUN chmod +x /root/.claude/statusline.sh

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Student shell quality-of-life improvements
RUN echo 'export PS1="stl-cityzen-agentic-agent:\\w# "' >> /root/.bashrc && \
    echo 'alias ll="ls -alF"' >> /root/.bashrc && \
    echo 'alias la="ls -A"' >> /root/.bashrc && \
    echo 'alias l="ls -CF"' >> /root/.bashrc

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["/bin/bash"]
