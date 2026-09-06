# Context-Management Technique Plan: Chart by Problem Type

This plan documents where and why explicit context boundaries, proactive summarization, and (conditionally) compaction will be used during the problem-type chart session. It should be read alongside `pre-session-plan-problem-type-chart.md`.

## Explicit context boundaries

### Boundary A — Phase 1 (Investigation & Plan) → Phase 2 (Implementation)

At this boundary I will have the agent state:
- **Previous phase complete:** Investigation of the existing `/api/csb-requests/stats/monthly` endpoint and Chart.js component is done; a plan for the problem-type chart (endpoint shape, grouping, chart type) has been proposed and confirmed.
- **Next phase focus:** Implementing the backend endpoint (if needed) and the frontend chart component per the confirmed plan.
- **Requirements still active:** Grouping by `group` field, chart type as agreed in Phase 1, consistency with the existing monthly-stats pattern, no push/deploy.
- **Requirements changed:** None yet at this boundary.
- **Information from Phase 1 that still matters:** The confirmed plan itself (chart type, grouping logic, endpoint shape) and the fact that it's logged in `docs/feature-builder-log.md` as `confirmed`.

**Why:** This is the first real handoff from "reading and deciding" to "writing code." Stating it explicitly forces the plan to be nailed down before implementation starts, so any later change has a clear "before" state to be compared against.

### Boundary B — Mid-Phase 2, at the chart-type/style change

At this boundary I will have the agent state:
- **Previous phase complete:** N/A — this is a mid-phase interruption, not a phase completion. I'll make sure the agent doesn't treat it as a fresh task by having it restate what was already built so far under the old chart type.
- **Next phase focus:** Continuing implementation, but under the new chart type/visual style instead of the original one.
- **Requirements still active:** Grouping logic, endpoint shape, consistency with existing patterns, no push/deploy — none of these are affected by the change.
- **Requirements changed:** Chart type/visual style — explicitly named as superseding the Phase 1 decision.
- **Information from Phase 1 that still matters:** The grouping/aggregation logic and endpoint design remain valid; only the visual rendering choice changes.

**Why:** This is the boundary the whole session is designed to test. Stating it explicitly is what should trigger the agent to mark the old log entry `superseded by` rather than quietly overwrite it, and it's the clearest evidence of whether the agent is actually tracking what changed versus what didn't.

### Boundary C — Phase 2 (Implementation) → Phase 3 (Verification & Logging)

At this boundary I will have the agent state:
- **Previous phase complete:** Backend endpoint and frontend chart component are implemented under the final (changed) chart-type requirement.
- **Next phase focus:** Verifying against acceptance criteria and finalizing the decision log.
- **Requirements still active:** All acceptance criteria from the pre-session plan (correct data, correct final chart type, no push/deploy).
- **Requirements changed:** None new at this boundary — confirming the changed requirement from Boundary B is now the final state, not something still in flux.
- **Information from Phase 1/2 that still matters:** Both log entries (original `confirmed`, then `superseded by`) need to be checked for accuracy in this phase, not just the code.

**Why:** Verification is only meaningful if it's checked against the *current* requirement, not the original plan. Restating this here guards against the agent quietly verifying against the stale Phase 1 spec out of habit.

## Proactive summarization

**Point chosen:** Immediately after Boundary B (the chart-type change), before any further code is written.

**Prompt approach:** Ask the agent to produce a summary before continuing, preserving:
- **Current goal:** Ship the problem-type chart under the new chart type/style.
- **Active requirements and constraints:** Grouping logic, endpoint shape, no push/deploy, consistency with existing patterns.
- **Decisions made so far:** Original chart-type decision (now superseded) and the new one, plus the grouping/endpoint decisions that are unaffected.
- **Current state of the artifact being revised:** What's already implemented under the old chart type vs. what still needs to change for the new one.
- **Unresolved questions:** Anything not yet confirmed about the new chart type (e.g. color scheme, legend behavior).
- **Next planned action:** Update/replace the chart-rendering code to the new type, then proceed to Phase 3.

**Why this point:** This is the highest-risk moment in the session for drift — there's partially-built code plus a changed spec, which is exactly the situation where an agent might silently patch over the old implementation without fully accounting for what changed and what didn't. Asking for the summary here, before more code is written, is a checkpoint against building on a muddled understanding.

## Compaction

No compaction is planned by default for this session — three phases plus one requirement change is not expected to fill the context window. If the session runs long (e.g. the developer explores several implementation dead-ends in Phase 2), I will use compaction at Boundary C, once the decision log has already captured the durable facts, so nothing load-bearing is lost to compaction. Compaction will not be forced simply to demonstrate the technique.
