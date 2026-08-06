# Frontend Unit Test Report

**Generated:** 2026-08-06
**Command:** `npx nx test frontend --coverage`
**Test runner:** Jest (`jest-preset-angular`)

## Summary

| Metric | Result |
| --- | --- |
| Test Suites | 7 passed, 7 total |
| Tests | 88 passed, 88 total |
| Failures | 0 |
| Snapshots | 0 total |
| Run time | ~8.8 s |

All 88 tests across 7 test suites passed. No failures.

> Note: `group-chart.component.spec.ts` logs expected `console.error` output ("Not implemented: HTMLCanvasElement.prototype.getContext" / "Failed to create chart: can't acquire context from the given item"). This comes from Chart.js attempting to acquire a `<canvas>` 2D context in the jsdom test environment, which does not implement canvas rendering. The affected tests still pass — the errors are logged but non-fatal.

## Code Coverage

Overall coverage (statements / branches / functions / lines):

| Metric | Coverage |
| --- | --- |
| Statements | 91.18% |
| Branches | 100% |
| Functions | 87.23% |
| Lines | 90.14% |

### Coverage by file

| File | % Stmts | % Branch | % Funcs | % Lines | Uncovered Lines |
| --- | --- | --- | --- | --- | --- |
| `app/app.config.ts` | 0% | 100% | 100% | 0% | 2-7 |
| `app/app.routes.ts` | 0% | 100% | 100% | 0% | 3 |
| `app/app.ts` | 93.1% | 100% | 83.33% | 92.59% | 52-53 |
| `app/components/group-chart/group-chart.component.ts` | 100% | 100% | 100% | 100% | — |
| `app/components/monthly-chart/monthly-chart.component.ts` | 36.84% | 100% | 0% | 29.41% | 15-54 |
| `app/components/neighborhood-monthly-chart/neighborhood-monthly-chart.component.ts` | 100% | 100% | 100% | 100% | — |
| `app/components/results-table/results-table.component.ts` | 100% | 100% | 100% | 100% | — |
| `app/components/search/search.component.ts` | 100% | 100% | 100% | 100% | — |
| `app/constants/neighborhoods.ts` | 100% | 100% | 100% | 100% | — |
| `app/services/csb-requests.service.ts` | 100% | 100% | 100% | 100% | — |

### Gaps

- `app.config.ts` and `app.routes.ts` have no coverage (0%) — these are Angular bootstrap/route configuration files with no dedicated spec files.
- `monthly-chart.component.ts` has significantly lower coverage (36.84% statements / 0% functions) than the rest of the codebase, indicating it lacks a spec file or has an incomplete one.
