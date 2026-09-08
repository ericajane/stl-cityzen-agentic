# API Design Log

Persistent record of GraphQL schema/resolver decisions made alongside the existing REST API.
Entries are never deleted — superseded decisions are marked as such and a new entry is added.

---

## csb-requests search — 2026-09-07 (initial design)

Decision: Use code-first `@nestjs/graphql` (decorator-based classes), not schema-first SDL.
Reason: Matches this codebase's existing TS/decorator conventions (NestJS controllers/services already use decorators); no existing `.graphql` SDL files to build from.
Status: confirmed

Decision: Define GraphQL types (`CsbRequestType`, `CsbRequestSearchInput`, `CsbRequestSearchResultType`) as new backend-only classes, not by adding GraphQL decorators to the shared `@org/types` interfaces in `libs/shared/types`.
Reason: `@org/types` is plain TypeScript shared by both Angular frontend and Nest backend; adding GraphQL decorators there would leak a backend-only dependency into the frontend build.
Status: confirmed

Decision: `CsbRequestType` mirrors `CsbRequest` field-for-field (same camelCase names). Nullable fields (`dateCancelled`, `dateInvtDone`, `dateTimeClosed`, `dateTimeInit`, `prjCompleteDate`, `srx`, `sry`) are nullable in the schema; all other fields are non-null, matching the `| null` unions (or lack thereof) in the shared `CsbRequest` interface exactly.
Reason: Preserve null-handling parity with REST/the underlying SQLite data — no silent coercion of null to empty string or 0.
Status: confirmed

Decision: Date fields (`dateCancelled`, `dateInvtDone`, `dateTimeClosed`, `dateTimeInit`, `prjCompleteDate`) are typed as plain GraphQL `String`, not a `DateTime`/`GraphQLISODateTime` custom scalar.
Reason: Keep GraphQL output byte-for-byte comparable to REST for verification during this first endpoint; introducing a DateTime scalar is a real design choice better made deliberately later, not implicitly now.
Status: superseded by "csb-requests search — 2026-09-07 (DateTime scalar)" entry below

Decision: `srx`/`sry` map to GraphQL `Float`, nullable.
Reason: Matches `number | null` in the shared `CsbRequest` interface.
Status: confirmed

Decision: Single flat input type `CsbRequestSearchInput`, mirroring `CsbRequestSearchParams` 1:1 (filters and pagination fields together in one input), all fields optional.
Reason: Matches how REST/the service already treats search params as one cohesive bag (`CsbRequestSearchParams`); avoids introducing a `filter` + `pagination` split the resolver would have to reassemble, with no corresponding concept in the existing service layer.
Status: confirmed

Decision: Pagination defaults/caps (`page` default 1, `pageSize` default 25, capped at 100) are enforced in the resolver, mirroring the controller's `DefaultValuePipe`/`Math.min` logic exactly.
Reason: Keep REST and GraphQL behavior identical for the same inputs.
Status: confirmed

Decision: Query is named `csbRequests`, takes a single optional `input: CsbRequestSearchInput` argument, returns non-null `CsbRequestSearchResult` (`{ data: [CsbRequest!]!, total: Int!, page: Int!, pageSize: Int! }`).
Reason: Single-argument shape keeps the resolver a thin pass-through to `CsbRequestsService.search()`; name reads naturally as "the CSB requests query" analogous to the REST resource path.
Status: confirmed

Decision: Resolver (`CsbRequestsResolver`) injects and calls the existing `CsbRequestsService.search()` directly — no new service or repository logic, no duplication of SQL/filtering logic.
Reason: Required by the project's GraphQL rollout approach: reuse existing business logic rather than duplicating it per transport layer.
Status: confirmed

Decision: Add `@nestjs/graphql`, `@nestjs/apollo`, `@apollo/server`, and `graphql` as new dependencies; wire `GraphQLModule.forRoot<ApolloDriverConfig>()` (code-first, Apollo driver) into `AppModule`. GraphQL is served at `/graphql`, separate from the existing `/api` REST prefix — no changes to REST routing/global prefix.
Reason: No GraphQL package previously existed in this repo; Apollo is the standard/default NestJS GraphQL driver pairing. Keeping `/graphql` separate from `/api` avoids any collision with or change to existing REST routes.
Status: confirmed

Decision: The auto-generated schema file `apps/backend/src/schema.gql` is committed to the repo, not gitignored.
Reason: Developer preference — useful as a reviewable, versioned artifact of the GraphQL contract, similar in spirit to documenting REST endpoints in README.
Status: confirmed

Decision: New resolver gets a Jest spec (`csb-requests.resolver.spec.ts`) mirroring the existing `csb-requests.controller.spec.ts` pattern (mocked `CsbRequestsService`), covering: forwarding of input fields, default/cap behavior for `page`/`pageSize`, and handling of an undefined/empty input.
Reason: Per project guideline (CLAUDE.md) to add unit tests for new functionality; mirrors existing test conventions in this module.
Status: confirmed

Decision: The existing REST endpoint (`CsbRequestsController.search` / `GET /api/csb-requests`) is left completely unchanged; the GraphQL resolver is additive, registered in the existing `CsbRequestsModule` alongside the controller.
Reason: Required by project rules — REST endpoints must keep working unchanged while GraphQL is added alongside.
Status: confirmed

---

## csb-requests search — 2026-09-07 (implementation notes)

Decision: In addition to the four packages originally proposed (`@nestjs/graphql`, `@nestjs/apollo`, `@apollo/server`, `graphql`), also installed `@as-integrations/express5` as a direct dependency, and pinned `graphql` to `^16.11.0` (not `^17`) rather than the latest major.
Reason: `@nestjs/apollo`'s Express integration requires `@as-integrations/express5` explicitly (this app uses `@nestjs/platform-express`) — Apollo throws a runtime "package is missing" error at startup without it. Separately, `@apollo/server@5.5.1`'s peer dependency requires `graphql@^16.11.0` specifically (not `^17`, despite `@nestjs/graphql`/`@nestjs/apollo` themselves accepting either) — using `graphql@17` would violate that peer constraint.
Status: confirmed

Decision: All nullable fields on `CsbRequestType` (the four/five date fields) use an explicit `@Field(() => String, { nullable: true })` rather than the bare `@Field({ nullable: true })` used initially.
Reason: Code-first `@nestjs/graphql` infers field type from TypeScript's `design:type` reflection metadata, which cannot represent a union type like `string | null` — TS emits `Object` for it, causing a runtime `UndefinedTypeError` at schema-build time. Explicit type functions were required; `srx`/`sry` already used this pattern in the original proposal (`() => Float`) but the string-typed nullable fields were missed initially and fixed once caught during verification.
Status: confirmed

Decision: Installed npm packages using `--legacy-peer-deps`.
Reason: The repo's existing dependency tree already has a pre-existing, unrelated peer conflict between `jest@30` (used by the workspace) and `@angular-devkit/build-angular@17.3.17` (which peer-wants `jest@^29`) — confirmed via a dry-run `npm install` on a clean checkout before any GraphQL packages were added. `node_modules` was clearly already installed under a relaxed peer-dependency mode; the same flag was used for consistency rather than introducing a new resolution strategy.
Status: confirmed

Decision: Verified GraphQL vs REST equivalence manually against a seeded scratch SQLite database (not committed, not the real `data/csb.db`) covering: no filters, `keyword`, combined `neighborhood`+`status`, `year`+`month`, `pageSize` cap at 100, and `page`/`pageSize` pagination — plus records with null date fields and null `srx`/`sry`. All REST and GraphQL responses matched byte-for-byte (aside from JSON key ordering).
Reason: Fulfills the "GraphQL query returns results equivalent to REST for the same parameters" acceptance criterion; nulls specifically exercised per CLAUDE.md's null-handling guideline.
Status: confirmed

---

## csb-requests search — 2026-09-07 (DateTime scalar)

Decision: Introduce a custom lenient `DateTime` GraphQL scalar and apply it to the five nullable date fields on `CsbRequestType` (`dateCancelled`, `dateInvtDone`, `dateTimeClosed`, `dateTimeInit`, `prjCompleteDate`), replacing the plain `String` typing used previously.
Reason: Developer request, made explicitly after Phase 1 shipped. Investigation found that `tools/ingest-csv.ts` and `csb-sync.service.ts` store these date fields as raw, unvalidated strings from two different upstream sources (CSV export, Open311 API) with no guaranteed common format — so a strict built-in `GraphQLISODateTime` scalar (which throws on any unparseable value) risked turning a single malformed row into a hard error for the entire `csbRequests` query.
Status: confirmed — supersedes the "date fields stay plain String, defer DateTime scalar" entry above

Decision: The custom scalar parses valid date/datetime strings and serializes them to ISO 8601 output. For any value that fails to parse, it falls back to returning the original raw string unchanged (not `null`, not a thrown `GraphQLError`) and logs a warning server-side.
Reason: Explicit developer choice (Option A of two proposed): never let one bad row 500 the whole query; make the degradation visible in logs rather than silent data loss (returning null) or a hard failure.
Status: confirmed

Decision: This is a GraphQL-only presentation-layer change. `CsbRequestsService.search()`, the SQLite schema/data, and the REST endpoint (`GET /api/csb-requests`) are untouched and continue to return raw, unformatted date strings exactly as stored — verified unchanged after this change.
Reason: Required by project rules — REST must keep working unchanged; the scalar only affects how the existing string values are serialized when read through the GraphQL layer.
Status: confirmed

Decision: `srx`/`sry` (`Float`) and all other non-date fields are unaffected by this change.
Reason: Out of scope — this revision only concerns the five nullable date-string fields called out by the developer.
Status: confirmed

Decision: The five date fields on `CsbRequestType` use `@Field(() => Date, { nullable: true })` (TypeScript's built-in `Date` as the type-function reference), not `@Field(() => DateTimeScalar, ...)` referencing the scalar class directly.
Reason: Implementation correction found during verification — `@nestjs/graphql`'s `@Scalar(name, () => Date)` decorator registers the custom scalar keyed by the TS type its type-function returns (`Date` in this case), and the schema builder resolves `@Field(() => Date)` references to that registered scalar. Referencing the `DateTimeScalar` class directly as the field's type function caused a `CannotDetermineOutputTypeError` at startup. The underlying property values remain plain `string | null` at runtime (never actual `Date` instances) — `Date` here is only the lookup key the framework's documented custom-scalar pattern expects, not a runtime type claim.
Status: confirmed

Decision: Verified the scalar's behavior end-to-end against the running server (built output, not just unit tests): a record with a valid `date_time_init` string serializes to ISO 8601 via GraphQL while REST returns the same record's raw string unchanged; a record with a deliberately malformed `date_time_init` ("NOT-A-REAL-DATE") returns unchanged via both REST and GraphQL (no 500, no null substitution), with a "Could not parse date value..." warning logged server-side tagged `[DateTimeScalar]`. A combined query returning both records together confirmed the malformed row does not affect the well-formed rows in the same response.
Reason: Fulfills the "never let one bad row 500 the whole query" requirement and the "GraphQL query returns results equivalent to REST" acceptance criterion for the changed fields specifically.
Status: confirmed

Decision: Added `date-time.scalar.spec.ts` covering `serialize`, `parseValue`, and `parseLiteral` for: null/undefined input, valid ISO date strings, valid date-time strings, a common non-ISO format (`MM/DD/YYYY`), and multiple malformed/garbled strings — asserting both the fallback return value and that `Logger.warn` was called (or correctly not called for null/valid input).
Reason: Per project guideline (CLAUDE.md) to add unit tests for new functionality, with explicit coverage of both the valid-parse path and the malformed-string fallback path per the developer's request.
Status: confirmed
