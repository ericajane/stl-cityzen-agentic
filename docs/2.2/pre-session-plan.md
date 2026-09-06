# Pre-Session Plan: GraphQL Schema + Resolver for csb-requests Search

## Task

Design and implement a GraphQL schema and resolver for the existing `/api/csb-requests` search endpoint, per the roadmap item "GraphQL API layer (`@nestjs/graphql` — architecture is ready)." The REST endpoint stays in place; this adds a GraphQL query alongside it, reusing the existing service/repository logic rather than duplicating it.

## Agent

`api-design-agent` subagent (`.claude/agents/api-design-agent.md`). Interactive, multi-turn agent scoped to designing and implementing STL Cityzen's GraphQL layer one endpoint at a time, with a persistent decision log at `docs/api-design-log.md` and required checkpoints between endpoints.

## Phases

### Phase 1 — Investigation & Schema Design
**Work:** Read the existing `/api/csb-requests` REST endpoint, its underlying service/repository logic, and the `CsbRequest` shared type. Propose a GraphQL schema: object type, query, and filter/pagination input shape.

**Rules/scope:**
- Read-only. No schema or resolver code is written in this phase.
- The proposed schema must be stated explicitly and confirmed before implementation begins.
- The confirmed schema decision must be written to `docs/api-design-log.md` as `confirmed`.

### Phase 2 — Resolver Implementation
**Work:** Implement the resolver per the confirmed Phase 1 schema, reusing the existing service/repository logic.

**Rules/scope:**
- Only implement what was confirmed in Phase 1 — no unrequested schema additions.
- The existing REST endpoint must remain untouched and functional throughout.
- If the confirmed schema changes mid-phase (see below), the agent must flag the conflict against the logged decision before proceeding, not silently reinterpret it.
- No push, publish, or deploy actions.

### Phase 3 — Verification & Logging
**Work:** Verify the GraphQL query returns results equivalent to the REST endpoint for the same parameters. Finalize the decision log and propose the checkpoint before ending the session.

**Rules/scope:**
- The decision log must reflect what actually happened, including anything superseded in Phase 2.
- The agent proposes a summary of what shipped and what's still open before the session closes.

## Where a requirement will change

After the Phase 1 schema is confirmed and logged (e.g. a flat filter input matching the REST query params), mid-Phase 2 — once the resolver is mostly wired up — a schema shape change will be introduced: e.g. adding a `coordinates` field to the type, or restructuring the filter input from flat to nested. This is introduced deliberately once the resolver already depends on the original shape, so the agent has to decide how much of the already-written resolver code needs to change and reconcile it against the logged Phase 1 decision, rather than treating it as a fresh design.

## Artifact/decision revisited later

The Phase 1 log entry in `docs/api-design-log.md` describing the originally confirmed schema shape. When the shape change is introduced in Phase 2, this entry should be marked `superseded by <new entry>` rather than edited away or ignored — this is the specific behavior the session is designed to test.

## Evidence to evaluate the session

- **`docs/api-design-log.md`** — confirms whether the agent logged the original schema decision, then correctly marked it superseded rather than silently overwriting or ignoring it.
- **`git diff`** on the resolver/schema code — confirms the final implementation matches the *changed* schema, not the original plan.
- **Session transcript** — confirms whether the agent explicitly flagged the conflict between the new schema request and the logged Phase 1 decision, versus quietly complying without acknowledgment.
- **GraphQL query test (e.g. via introspection/playground)** — confirms the query returns results equivalent to the REST endpoint for the same parameters, under the final schema.
- **`git log` / `git status`** — confirms nothing was pushed, published, or deployed, and that the REST endpoint file is unchanged.
