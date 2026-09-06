# Context-Management Technique Plan: GraphQL Schema + Resolver for csb-requests Search

This plan documents where and why explicit context boundaries, proactive summarization, and (conditionally) compaction will be used during the GraphQL search session. It should be read alongside `pre-session-plan-graphql-search.md`.

## Explicit context boundaries

### Boundary A — Phase 1 (Investigation & Schema Design) → Phase 2 (Resolver Implementation)

At this boundary I will have the agent state:
- **Previous phase complete:** Investigation of the REST `/api/csb-requests` endpoint, its service/repository logic, and the `CsbRequest` shared type is done; a GraphQL schema (type, query, filter/pagination input) has been proposed and confirmed.
- **Next phase focus:** Implementing the resolver per the confirmed schema, reusing existing service/repository logic.
- **Requirements still active:** Confirmed schema shape, reuse of existing business logic, REST endpoint stays untouched, no push/deploy.
- **Requirements changed:** None yet at this boundary.
- **Information from Phase 1 that still matters:** The confirmed schema itself and its `confirmed` entry in `docs/api-design-log.md`.

**Why:** This is the handoff from design to implementation. Stating it explicitly locks in what the resolver is being built against, so the later schema change has a clear "before" to be measured against.

### Boundary B — Mid-Phase 2, at the schema shape change

At this boundary I will have the agent state:
- **Previous phase complete:** N/A — mid-phase interruption, not a phase completion. The agent should restate what the resolver currently does under the original schema before treating the new request as anything other than a revision to it.
- **Next phase focus:** Continuing resolver implementation, but under the new/changed schema shape.
- **Requirements still active:** Reuse of existing service/repository logic, REST endpoint untouched, no push/deploy — unaffected by the change.
- **Requirements changed:** The schema shape (e.g. new field, or filter input restructured) — explicitly named as superseding the Phase 1 decision.
- **Information from Phase 1 that still matters:** Whatever parts of the original schema are unaffected (e.g. the query name, pagination approach) remain valid; only the specific changed piece is superseded.

**Why:** This is the boundary the session is designed to test. Stating it explicitly is what should trigger the agent to mark the old log entry `superseded by` and adjust only the affected resolver code, rather than either ignoring the change or over-correcting and rebuilding more than necessary.

### Boundary C — Phase 2 (Resolver Implementation) → Phase 3 (Verification & Logging)

At this boundary I will have the agent state:
- **Previous phase complete:** Resolver is implemented under the final (changed) schema; REST endpoint confirmed untouched.
- **Next phase focus:** Verifying query-result equivalence with the REST endpoint and finalizing the decision log.
- **Requirements still active:** All acceptance criteria from the pre-session plan (result equivalence, REST untouched, no push/deploy).
- **Requirements changed:** None new at this boundary — confirming the Boundary B change is now the final state.
- **Information from Phase 1/2 that still matters:** Both log entries (original `confirmed`, then `superseded by`) need to be checked for accuracy in this phase, not just the code.

**Why:** Verification is only meaningful against the *current* schema, not the original plan. Restating this guards against the agent testing the resolver against a stale spec out of habit.

## Proactive summarization

**Point chosen:** Immediately after Boundary B (the schema shape change), before any further resolver code is written.

**Prompt approach:** Ask the agent to produce a summary before continuing, preserving:
- **Current goal:** Ship the GraphQL search resolver under the new schema shape.
- **Active requirements and constraints:** Reuse of existing service/repository logic, REST endpoint untouched, no push/deploy.
- **Decisions made so far:** Original schema decision (now superseded) and the new one, plus any decisions unaffected by the change (e.g. pagination approach).
- **Current state of the artifact being revised:** What the resolver currently does under the old shape vs. what still needs to change for the new one.
- **Unresolved questions:** Anything not yet confirmed about the new shape (e.g. whether the new field needs its own resolver or can be derived from existing data).
- **Next planned action:** Update the resolver/schema for the new shape, then proceed to Phase 3 verification.

**Why this point:** This is the highest-risk moment for drift — there's a partially-built resolver plus a changed schema, which is exactly where an agent might patch the type definition without checking whether the resolver logic underneath still lines up. Asking for the summary here, before more code is written, checks that the agent's understanding is still accurate before it keeps building on it.

## Compaction

No compaction is planned by default — three phases plus one schema change is not expected to fill the context window. If the session runs long (e.g. exploring multiple filter-input designs before settling on one), I will use compaction at Boundary C, once the decision log has already captured the durable facts, so nothing load-bearing is lost. Compaction will not be forced simply to demonstrate the technique.
