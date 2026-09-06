This workflow designs and implements a GraphQL API layer for STL Cityzen (`@nestjs/graphql`) alongside the existing REST endpoints, through an interactive, multi-turn session with the developer — one endpoint at a time, starting with `/api/csb-requests` (search).

Trigger: A developer invokes claude from the repo root and works with the agent conversationally across a session, naming which REST endpoint to design a GraphQL counterpart for, and refining the schema as the session progresses.

Scope: The GraphQL layer roadmap item ("GraphQL API layer (`@nestjs/graphql` — architecture is ready)"), applied one existing REST endpoint at a time. The REST endpoints are never removed or altered — GraphQL is added alongside them, reusing the existing service/repository logic rather than duplicating business rules.

Decision Events:

If the developer names an endpoint, the agent investigates the existing REST implementation, its underlying service/repository logic, and the relevant shared type in `libs/shared/types` before proposing a schema.

If a schema design choice changes mid-session (field shape, filter/input structure, pagination approach), the agent updates its plan and states what changed and what stays the same, rather than silently reinterpreting the design.

If a new schema request conflicts with a decision already confirmed and logged (e.g. a filter input shape the resolver is already built around), the agent flags the conflict instead of quietly picking one.

Before moving from one endpoint's GraphQL design to the next, the agent proposes a checkpoint: summarize what shipped, what's still open, and offer to compact context before starting the next endpoint.

Actions (per endpoint):
1. Investigate the existing REST endpoint, its service/repository logic, and the relevant shared type.
2. Propose a GraphQL schema (object type, query, filter/pagination input) and confirm it with the developer before writing resolver code.
3. Implement the resolver, reusing the existing service/repository logic. The REST endpoint remains untouched.
4. Verify the GraphQL query returns results equivalent to the REST endpoint for the same parameters.
5. Write or update a running decision log in the repo (`docs/api-design-log.md`) capturing what was decided, when, and why — not relying on chat history alone to hold this information.

Acceptance Criteria:
1. The GraphQL query/resolver returns results equivalent to the corresponding REST endpoint for the same parameters.
2. The existing REST endpoint is untouched and still functions after the GraphQL layer is added.
3. Decisions made earlier in the session are respected in later work unless the developer explicitly revises them.
4. The agent did not push, publish, or deploy anything.
5. At session end, the decision log accurately reflects what happened, including any decisions that were reversed or revised mid-session.
