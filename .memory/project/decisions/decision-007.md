# Decision 007 - Colocate test files with source (supersedes decision-002)

**Date:** 2026-10-07
**Review by:** 2027-01-05
**Status:** Active
**Owner:** Erica Knaup

**Decision:** Test files are colocated alongside their corresponding source files (e.g. `csb-requests.service.spec.ts` next to `csb-requests.service.ts`), not organized in a separate `/tests` directory. This supersedes decision-002.

**Rationale:** Confirmed by the developer after the discrepancy was surfaced during map-view backend work: 100% of existing backend spec files (`csb-requests.service.spec.ts`, `neighborhood-lookup.service.spec.ts`, `csb-sync.service.spec.ts`, and others) are already colocated with their source, and no `/tests` directory exists anywhere in the repo. Decision-002 recorded an organizational preference that was never actually implemented in the codebase; colocation is the real, established convention, so the record now reflects actual practice rather than an aspirational one that every new feature would otherwise have to silently violate or awkwardly reconcile.

**Alternatives rejected:** Moving all existing colocated specs (and the new map-point tests) into a `/tests` directory to comply with decision-002 as originally written — rejected as unnecessary churn to match a preference that was never enforced in practice, with no technical reason given for the original preference beyond organizational taste.

**Related:** decision-002 (original separate-`/tests`-directory decision, now superseded). Session detail in `docs/feature-builder-log.md`.
