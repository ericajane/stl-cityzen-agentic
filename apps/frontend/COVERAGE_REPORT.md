# Frontend Test Coverage Report

**Command run:** `npx nx test frontend --coverage` (documented `test` target in `apps/frontend/project.json`, executor `@nx/jest:jest`)

**Result:** ✅ All tests passed — 7 test suites, 88 tests, 0 failures.

## Overall frontend coverage

| Metric | Coverage |
|---|---|
| Statements | 91.18% |
| Branches | 100% |
| Functions | 87.23% |
| Lines | 90.14% |

## Coverage by file/component

| File | % Stmts | % Branch | % Funcs | % Lines | Uncovered lines |
|---|---|---|---|---|---|
| `app.ts` | 93.10% | 100% | 83.33% | 92.59% | 52-53 |
| `app.config.ts` | 0% | 100% | 100% | 0% | 2-7 |
| `app.routes.ts` | 0% | 100% | 100% | 0% | 3 |
| `components/group-chart/group-chart.component.ts` | 100% | 100% | 100% | 100% | — |
| `components/monthly-chart/monthly-chart.component.ts` | 36.84% | 100% | 0% | 29.41% | 15-54 |
| `components/neighborhood-monthly-chart/neighborhood-monthly-chart.component.ts` | 100% | 100% | 100% | 100% | — |
| `components/results-table/results-table.component.ts` | 100% | 100% | 100% | 100% | — |
| `components/search/search.component.ts` | 100% | 100% | 100% | 100% | — |
| `constants/neighborhoods.ts` | 100% | 100% | 100% | 100% | — |
| `services/csb-requests.service.ts` | 100% | 100% | 100% | 100% | — |

## Prioritized recommendations

### 1. `monthly-chart.component.ts` — no spec file exists (highest priority)

This is the only component in the app with **zero dedicated tests**. All other chart components (`group-chart`, `neighborhood-monthly-chart`) have their own `.spec.ts`; this one doesn't, which is why `ngOnInit` (its only method) shows **0% function coverage** — it has literally never been invoked in a test.

Add `apps/frontend/src/app/components/monthly-chart/monthly-chart.component.spec.ts` covering:
- **Success path**: mock `csbService.getMonthlyStats()` to emit a sample `MonthlyCount[]` (e.g. 2-3 months), assert `chartData.labels` and `chartData.datasets[0].data` are built correctly from `label`/`count`, and `loading` becomes `false`.
- **Error path** (currently untested, line 54): mock `getMonthlyStats()` with `throwError(...)`, assert `loading` becomes `false` and `chartData`/`monthlyData` remain in a safe default state (no unhandled exception).
- **Empty-array edge case**: `getMonthlyStats()` emits `[]` — assert the component renders without error and produces empty `labels`/`data` arrays (this is currently only incidentally exercised via `app.spec.ts`'s mock, and only if the `charts` tab is ever activated with change detection, which it isn't today — see #2).
- **Null/undefined data per CLAUDE.md null-handling guidance**: confirm what `CsbRequestsService.getMonthlyStats()` can actually emit (its own spec already covers this at the service layer), and add a component-level test asserting graceful handling if a malformed/empty response reaches `data.map(...)` — this is the one branch in the codebase where an unguarded `.map()` runs directly on service output.

### 2. `app.ts` — error branch of `fetchResults()` untested (lines 52-53)

`app.spec.ts` only ever mocks `CsbRequestsService.search()` with `of(...)` (success). The `error` callback passed to `.subscribe({...})` in `fetchResults()` (called from both `onSearch()` and `onPageChange()`) has never run.

Add a test case:
```ts
it('resets loading on search error', () => {
  mockService.search.mockReturnValue(throwError(() => new Error('network error')));
  component.onSearch({ page: 1, pageSize: 25 });
  expect(component.loading).toBe(false);
});
```
This also indirectly exercises `cdr.detectChanges()` on the error path, which is currently only called on the success path.

### 3. `app.config.ts` / `app.routes.ts` — 0% coverage (low priority)

Both files are pure bootstrap/DI configuration with no conditional logic — `app.config.ts` just registers providers, and `app.routes.ts` is currently an empty `Route[]`. They're never imported by any spec (only by `main.ts`), which is why they show 0%.

Writing unit tests for these today would just assert static array/object shapes and wouldn't catch real regressions. Recommend either:
- Excluding them from `collectCoverageFrom` in `apps/frontend/jest.config.ts` (the same way `*.module.ts` and `main.ts` are already excluded), so the coverage number reflects only files with real logic, **or**
- Once `appRoutes` gains actual routes with guards/resolvers, add tests at that point (not before — there's no logic to test yet).
