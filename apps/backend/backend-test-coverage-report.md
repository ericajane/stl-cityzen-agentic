# Backend Test Coverage Report

**Package:** `apps/backend` (NestJS) — back-end only. Front-end code and tests are out of scope.
**Command run:** `npx nx test backend --coverage` (the documented test command per `AGENTS.md`; run in-sandbox only)
**Date:** 2026-08-20

## Test result

✅ **All tests passed** — 8 suites, 99 tests, 0 failures.

```
Test Suites: 8 passed, 8 total
Tests:       99 passed, 99 total
```

Suites: `auth.controller`, `auth.service`, `jwt-auth.guard`, `csb-api.service`, `csb-sync.service`, `csb-requests.controller`, `csb-requests.service`, `neighborhood-lookup.service`.

> Note: coverage is measured against `collectCoverageFrom` in `jest.config.ts`, which excludes `src/main.ts` and all `*.module.ts` files.

## Coverage by component

| Component / file | % Stmts | % Branch | % Funcs | % Lines |
|---|---:|---:|---:|---:|
| **app** | | | | |
| `app/app.controller.ts` | 0 | 100 | 0 | 0 |
| `app/app.service.ts` | 0 | 100 | 0 | 0 |
| **auth** | | | | |
| `auth/auth.controller.ts` | 100 | 100 | 100 | 100 |
| `auth/auth.service.ts` | 100 | 100 | 100 | 100 |
| `auth/jwt-auth.guard.ts` | 100 | 100 | 100 | 100 |
| **csb-api** | | | | |
| `csb-api/csb-api.service.ts` | 100 | 71.42 | 100 | 100 |
| `csb-api/csb-sync.service.ts` | 94.33 | 97.36 | 90 | 93.87 |
| **csb-requests** | | | | |
| `csb-requests/csb-requests.controller.ts` | 90.9 | 57.14 | 85.71 | 90 |
| `csb-requests/csb-requests.service.ts` | 78.76 | 70.68 | 75 | 74.69 |
| **neighborhoods** | | | | |
| `neighborhoods/neighborhood-lookup.service.ts` | 98.05 | 80.76 | 100 | 98.83 |
| **Overall back-end** | **88.97** | **81.21** | **85.48** | **89.15** |

## Recommendations to improve coverage (prioritized)

### 1. `csb-requests/csb-requests.service.ts` — 74.69% lines, 70.68% branch (biggest gap, core module)
This is the app's central query service and the largest uncovered surface. Uncovered lines: **19–24, 71–111**.

- **`normalizeNeighborhood()` (lines 19–24) — untested null/junk handling.** Per the CLAUDE.md null-handling guideline this is exactly the kind of logic to test. Add unit cases for: `null`/`undefined`/empty input → `null`; whitespace collapsing (`"5 1"` → `"51"`); the `o`→`0` fixup (`"56o"` → `null` after range check, `"1o"` → `"10"`); non-numeric (`"abc"`) → `null`; out-of-range (`"0"`, `"100"`) → `null`; zero-padding (`"1"` → `"01"`).
- **`onModuleInit()` + `migrateNeighborhoods()` (lines 71–111) — completely untested startup path.** Add tests over an in-memory SQLite DB seeded with messy neighborhood values, asserting: empty-DB vs populated-DB log branch; that migration normalizes distinct values and only updates rows that actually change (the `normalized !== neighborhood` branch); and the `changed > 0` log branch vs the no-op case.
- **`search()` branch coverage.** Many filter branches (`year`, `month`, `dateFrom`, `dateTo`, `problemCode`, and the `keyword` LIKE clause) and the pagination offset math appear only partially exercised. Add cases covering each filter independently, combined filters, and empty-params (no `WHERE`) to close the branch gaps.

### 2. `csb-requests/csb-requests.controller.ts` — 57.14% branch (lowest branch coverage)
Uncovered lines: **109–110** (`backfillNeighborhoods` endpoint returns `{ updated }`). Low branch % also points to the `DefaultValuePipe`/`yearRaw || undefined`, `monthRaw || undefined`, and `Math.min(pageSize, 100)` normalizations being untested.

- Add a controller test for `POST /backfill-neighborhoods` asserting it calls the service and wraps the count as `{ updated }`.
- Add cases exercising the query-param defaulting/clamping: `year=0`/`month=0` → `undefined`; `pageSize > 100` clamped to 100; default `page`/`pageSize` when omitted.

### 3. `csb-api/csb-api.service.ts` — 71.42% branch
Statements/functions/lines are 100%, but branches at **lines 51 and 87–89** are uncovered:

- **`fetchSince()` default parameter (`to: Date = new Date()`)** — add a test that calls `fetchSince(from)` without a `to` argument.
- **`fetchWindow()` non-array response branch (line 87):** `Array.isArray(response.data) ? … : []` — add a test where the mocked HTTP response `data` is a non-array (e.g. `null` or an object) and assert it returns `[]`. (The error/`catch` path already appears exercised by the logged "Network error" test.)

### 4. `csb-api/csb-sync.service.ts` — 93.87% lines
Uncovered lines **30–32**: the `@Cron` `scheduledSync()` wrapper.

- Add a test that calls `scheduledSync()` directly with `sync()` mocked, asserting it delegates to `sync()` and emits the start/complete log lines. This closes the scheduled-entry-point gap without waiting on the cron trigger.

### 5. `neighborhoods/neighborhood-lookup.service.ts` — 80.76% branch
Uncovered line **83**: the polygon-**hole** exclusion branch (`raycast` returning true for an interior ring → point rejected).

- Add a `pointInPolygon`/`lookup` test with a polygon that has a hole, using a point that falls inside the outer ring **but inside the hole**, and assert it is excluded (`lookup` → `null`). Also add a point clearly outside all polygons to cover the `lookup` "no match → null" return.

### 6. `app/app.controller.ts` & `app/app.service.ts` — 0%
These are the Nx scaffold "Hello API" placeholders. Two trivial options:

- If they're kept, add a one-line spec each (`getData()` returns `{ message: 'Hello API' }`) — cheap 0→100% wins that lift the overall aggregate.
- If they're dead scaffolding, delete them (and their module wiring) so they stop dragging the aggregate down.

### Suggested priority order
1. `csb-requests.service.ts` (largest gap + core logic + null-handling per CLAUDE.md)
2. `csb-requests.controller.ts` (lowest branch coverage, easy wins)
3. `csb-api.service.ts` non-array/default-param branches
4. `csb-sync.service.ts` scheduled-sync wrapper
5. `neighborhood-lookup.service.ts` hole/no-match branches
6. `app.*` scaffold — test or delete
