This workflow extends STL Cityzen's data visualization features — new charts and the map view — through an interactive, multi-turn session with the developer, rather than a single prompt-and-done invocation.

Trigger: A developer invokes claude from the repo root and works with the agent conversationally across a session, naming which feature to build and refining requirements as the session progresses.

Scope: Frontend visualization features listed on the project roadmap:
- Chart by ward
- Chart by problem type
- Year-over-year comparison chart
- Map view (requires SRX/SRY → WGS84 coordinate conversion)

Decision Events:

If the developer names a feature, the agent investigates existing patterns (e.g. how the `/api/csb-requests/stats/monthly` endpoint and its Chart.js component are built) before writing new code, so new features stay consistent with the existing one.

If requirements change mid-feature (chart type, grouping, color scheme, library choice), the agent updates its plan and states what changed and what stays the same, rather than silently reinterpreting the request.

If a new feature request conflicts with a decision made earlier in the session (e.g. an aggregation approach chosen for the ward chart), the agent flags the conflict instead of quietly picking one.

Before moving from one feature to the next, the agent proposes a checkpoint: it summarizes what shipped, what's still open, and offers to compact context before starting the next feature.

Actions (per feature):
1. Investigate the relevant backend and frontend code for the nearest existing analog.
2. Propose a short implementation plan and confirm it with the developer before writing code.
3. Implement the backend endpoint, if needed, and the frontend integration.
4. Verify the feature against its acceptance criteria.
5. Write or update a running decision log in the repo capturing what was decided, when, and why — not relying on chat history alone to hold this information.

Acceptance Criteria:
1. Each shipped feature matches the developer's current requirements, not requirements that were superseded earlier in the session.
2. Decisions made earlier in the session are respected in later work unless the developer explicitly revises them.
3. The agent did not push, publish, or deploy anything.
4. At session end, the decision log accurately reflects what happened, including any decisions that were reversed or revised mid-session.