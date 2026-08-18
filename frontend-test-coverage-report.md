# Frontend Unit Test Coverage Report

**Command run:** `npx nx test frontend --coverage` (documented in `setup.md` as the frontend test command: `npx nx test frontend`)

**Result:** All tests passed — 7 test suites, 88 tests, 0 failures.

> Note: the test run prints several `console.error` lines about jsdom's canvas ("Not implemented: HTMLCanvasElement.prototype.getContext") and Chart.js failing to acquire a canvas context. These come from `GroupChartComponent`/`ng2-charts` running in a jsdom environment without a canvas polyfill — they are pre-existing test-environment noise, not test failures, and every assertion in those specs still passed.

## Coverage by component/file

| File | % Statements | % Branch | % Functions | % Lines | Uncovered lines |
|---|---|---|---|---|---|
| `app.config.ts` | 0.00% | 100% | 100% | 0.00% | 2-7 |
| `app.routes.ts` | 0.00% | 100% | 100% | 0.00% | 3 |
| `app.ts` | 93.10% | 100% | 83.33% | 92.59% | 52-53 |
| `components/group-chart/group-chart.component.ts` | 100% | 100% | 100% | 100% | — |
| `components/monthly-chart/monthly-chart.component.ts` | 36.84% | 100% | 0.00% | 29.41% | 15-54 |
| `components/neighborhood-monthly-chart/neighborhood-monthly-chart.component.ts` | 100% | 100% | 100% | 100% | — |
| `components/results-table/results-table.component.ts` | 100% | 100% | 100% | 100% | — |
| `components/search/search.component.ts` | 100% | 100% | 100% | 100% | — |
| `constants/neighborhoods.ts` | 100% | 100% | 100% | 100% | — |
| `services/csb-requests.service.ts` | 100% | 100% | 100% | 100% | — |

### Overall frontend coverage

| Statements | Branches | Functions | Lines |
|---|---|---|---|
| **91.18%** | **100%** | **87.23%** | **90.14%** |

## Recommendations (prioritized)

1. **`monthly-chart.component.ts` — no spec file exists at all (highest priority).** This is the single biggest coverage gap: 0% of its functions are exercised, and `ngOnInit` (lines 15-54) — the only real logic in the component — never runs under test. Compare with `neighborhood-monthly-chart.component.spec.ts` and `group-chart.component.spec.ts`, which cover the same "chart component wraps `CsbRequestsService`" pattern at 100%; that's a ready-made template. Add `monthly-chart.component.spec.ts` covering:
   - **Success path:** mock `getMonthlyStats()` to return a `MonthlyCount[]`, call `ngOnInit`/`detectChanges`, and assert `monthlyData`, `chartData.labels`, and `chartData.datasets[0].data` are populated correctly from the mocked data, and `loading` becomes `false`.
   - **Error path:** mock `getMonthlyStats()` to return `throwError(() => new Error(...))` and assert `loading` becomes `false` and `monthlyData`/`chartData` are left at their initial empty state (the `error` callback only flips `loading`, so also verify it doesn't throw and doesn't touch `monthlyData`/`chartData`).
   - **Empty-data edge case:** `getMonthlyStats()` returning `[]` — assert `chartData.labels`/`datasets[0].data` end up as empty arrays rather than `undefined`.

2. **`app.ts` lines 52-53 — untested error branch in `fetchResults()`.** `app.spec.ts` only exercises the success path of `search()` (`onSearch()` tests all use `of(...)`). Add a test that makes `mockService.search` return `throwError(() => new Error('...'))` and asserts:
   - `loading` ends up `false`.
   - `result` is left unchanged (not overwritten with an error value).
   - `cdr.detectChanges()` is still invoked in the error branch (this is what actually re-renders the "no results" / loading-cleared UI state — a regression here would silently freeze the UI on a failed search).

3. **`app.config.ts` and `app.routes.ts` — 0% coverage, lower priority.** These are pure DI/bootstrap wiring with no branching logic today (`app.routes.ts` is just an empty `Route[]`), so they're lower-value than 1 and 2. Two reasonable options:
   - If routes are expected to stay empty/trivial, exclude them from `collectCoverageFrom` in `apps/frontend/jest.config.ts` (same way `*.module.ts` and `main.ts` are already excluded), since there's no meaningful behavior to assert.
   - If routes are expected to grow (the roadmap in `README.md` mentions future chart/map views, which will likely need real routes), add a minimal test now asserting `appRoutes` has the expected shape, so the very first real route added is forced to come with a test. Once `appRoutes` has real entries, also add a smoke test for `app.config.ts` asserting `appConfig.providers` includes the router/HTTP/chart providers, so a future accidental deletion of a provider fails a test instead of shipping silently.

No other files need attention — `group-chart`, `neighborhood-monthly-chart`, `results-table`, `search`, `neighborhoods` (constants), and `csb-requests.service` are all at 100% across every metric.
