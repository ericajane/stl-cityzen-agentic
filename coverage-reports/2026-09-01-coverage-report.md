# Frontend Unit Test Coverage Report

**Date:** 2026-09-01

## Test command

```
npx nx test frontend --code-coverage
```

The `--code-coverage` flag is **not** enabled by default in `apps/frontend/project.json`'s
`test` target (executor `@nx/jest:jest`, no `codeCoverage: true` option set), so it was
added for this run. Consider adding `"codeCoverage": true` to the `test` target options in
`apps/frontend/project.json` if you want coverage collected on every run.

Note: the project's Jest config (`apps/frontend/jest.config.ts`) does not include the
`json-summary` coverage reporter, so no `coverage/apps/frontend/coverage-summary.json` file
was produced. The figures below were taken from the Jest/Istanbul text coverage table
printed to the console for this run (backed by `coverage/apps/frontend/coverage-final.json`
and `lcov-report/`). Consider adding `json-summary` to Jest's `coverageReporters` so future
runs produce a machine-readable summary file.

## Status: ✅ PASS

- Test Suites: 7 passed, 7 total
- Tests: 88 passed, 88 total
- Snapshots: 0 total

(The console output includes several `console.error` lines from jsdom/Chart.js — e.g.
`HTMLCanvasElement.prototype.getContext` not implemented and "Failed to create chart: can't
acquire context from the given item" in `group-chart.component.spec.ts`. These are logged
warnings from Chart.js falling back gracefully in the jsdom test environment, not failed
assertions — all tests in that suite passed.)

## Coverage by file

| File | % Statements | % Branches | % Functions | % Lines | Uncovered Lines |
|---|---|---|---|---|---|
| `src/app/app.config.ts` | 0 | 100 | 100 | 0 | 2–7 |
| `src/app/app.routes.ts` | 0 | 100 | 100 | 0 | 3 |
| `src/app/app.ts` | 93.10 | 100 | 83.33 | 92.59 | 52–53 |
| `src/app/components/group-chart/group-chart.component.ts` | 100 | 100 | 100 | 100 | — |
| `src/app/components/monthly-chart/monthly-chart.component.ts` | 36.84 | 100 | 0 | 29.41 | 15–54 |
| `src/app/components/neighborhood-monthly-chart/neighborhood-monthly-chart.component.ts` | 100 | 100 | 100 | 100 | — |
| `src/app/components/results-table/results-table.component.ts` | 100 | 100 | 100 | 100 | — |
| `src/app/components/search/search.component.ts` | 100 | 100 | 100 | 100 | — |
| `src/app/constants/neighborhoods.ts` | 100 | 100 | 100 | 100 | — |
| `src/app/services/csb-requests.service.ts` | 100 | 100 | 100 | 100 | — |

## Overall frontend totals ("All files")

| % Statements | % Branches | % Functions | % Lines |
|---|---|---|---|
| 91.18 | 100 | 87.23 | 90.14 |

## Recommended areas to improve

1. **`src/app/components/monthly-chart/monthly-chart.component.ts`** — no spec file exists
   for this component at all (there is no `monthly-chart.component.spec.ts` alongside its
   `.html`/`.ts` files). This gives it 0% function coverage and only 29–37% statement/line
   coverage (only picked up incidentally via `app.ts`'s own spec). The `ngOnInit()` method,
   including both the success path (`next`, building `chartData` from `MonthlyCount[]`) and
   the error path (`error: () => (this.loading = false)`), is completely untested. This is
   the single highest-priority gap — every other chart component
   (`group-chart`, `neighborhood-monthly-chart`) already has full coverage, so this one is
   an outlier and should get a dedicated spec file mirroring those.

2. **`src/app/app.ts` (lines 52–53)** — the `error` callback inside the private
   `fetchResults()` method (`error: () => { this.loading = false; this.cdr.detectChanges(); }`)
   is not exercised. Only the success path of `search()` appears to be tested. Since this
   method is triggered from both `onSearch()` and `onPageChange()`, add a test that forces
   `csbService.search()` to error and asserts `loading` is reset and the view updates —
   this is user-facing error-handling business logic, not boilerplate.

3. **`src/app/app.config.ts`** and **`src/app/app.routes.ts`** — both sit at 0%
   statement/line coverage. These are currently trivial (`appRoutes` is an empty array, and
   `app.config.ts` just wires up providers), so this is lower priority than items 1–2.
   However, per the project roadmap (additional charts, map view, GraphQL layer) routes are
   likely to gain real logic soon — worth a baseline smoke test now (e.g. asserting
   `appConfig.providers` is populated, and `appRoutes` shape) so coverage doesn't silently
   regress once real route logic is added.

4. **Branch coverage floor** — branch coverage is already 100% project-wide, so there are
   no untested conditional paths in the strict Istanbul-branch sense. That said, the 0%
   function coverage in `monthly-chart.component.ts` (item 1) and the untested error branch
   in `app.ts` (item 2) represent the same class of risk (unexercised conditional/error
   logic) and should be treated with the same priority as branch gaps.
