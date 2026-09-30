# Decision 001 - Introduce custom DateTime scalar

**Date:** 09-07-2026
**Review by:** 12-26-2026
**Status:** Active
**Owner:** Erica Knaup

**Decision:** It was decided to retype 5 nullable date fields as a custom `DateTime` GraphQL scalar. These were previously typed as plain `String`. The affected fields are on `CsbRequestType`: `dateCancelled`, `dateInvtDone`, `dateTimeClosed`, `dateTimeInit`, and `prjCompleteDate`.

**Rationale:** This change was made at the developer's explicit request after Phase 1 shipped, following an investigation that found `tools/ingest-csv.ts` and `csb-sync.service.ts` populate these fields with raw, unvalidated date strings pulled from two different upstream sources (the CSV export and the Open311 API) with no guaranteed common format. A strict built-in scalar would reject any value it couldn't parse, so a lenient custom `DateTime` scalar was introduced to accept these inconsistent formats without erroring, while still giving API consumers a distinct, semantically correct date type.

**Alternatives rejected:** The built-in `GraphQLISODateTime` scalar was considered but rejected because it throws on any unparseable value — given the inconsistent upstream formats, a single malformed row could have turned into a hard error for the entire `csbRequests` query.
