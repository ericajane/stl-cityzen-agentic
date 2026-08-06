# Backend Unit Test Report

_Generated on 2026-08-06_

## Summary

| Metric        | Value       |
| ------------- | ----------- |
| Test suites   | 8 passed, 8 total |
| Tests run     | 99          |
| Tests passed  | 99          |
| Tests failed  | 0           |
| Snapshots     | 0           |

All 99 backend unit tests passed across 8 test suites. There were no failures.

## Code Coverage

Overall coverage across the backend source (`src/**/*.ts`, excluding `main.ts` and NestJS `*.module.ts` files):

| Metric      | Coverage | Covered / Total |
| ----------- | -------- | --------------- |
| Statements  | 88.97%   | 355 / 399       |
| Branches    | 81.21%   | 134 / 165       |
| Functions   | 85.48%   | 53 / 62         |
| Lines       | 89.15%   | 296 / 332       |

### Per-file coverage

| File | % Stmts | % Branch | % Funcs | % Lines |
| ---- | ------- | -------- | ------- | ------- |
| src/app/app.controller.ts | 0 | 100 | 0 | 0 |
| src/app/app.service.ts | 0 | 100 | 0 | 0 |
| src/auth/auth.controller.ts | 100 | 100 | 100 | 100 |
| src/auth/auth.service.ts | 100 | 100 | 100 | 100 |
| src/auth/jwt-auth.guard.ts | 100 | 100 | 100 | 100 |
| src/csb-api/csb-api.service.ts | 100 | 71.42 | 100 | 100 |
| src/csb-api/csb-sync.service.ts | 94.33 | 97.36 | 90 | 93.87 |
| src/csb-requests/csb-requests.controller.ts | 90.9 | 57.14 | 85.71 | 90 |
| src/csb-requests/csb-requests.service.ts | 78.76 | 70.68 | 75 | 74.69 |
| src/neighborhoods/neighborhood-lookup.service.ts | 98.05 | 80.76 | 100 | 98.83 |
| **Total** | **88.97** | **81.21** | **85.48** | **89.15** |

## How this was generated

The suite was run from the workspace root with:

```
npx nx test backend --coverage
```

Notes:
- `src/app/app.controller.ts` and `src/app/app.service.ts` currently have 0% coverage — these are the default scaffolded files and have no accompanying tests.
- `src/csb-requests/csb-requests.service.ts` has the lowest coverage among tested files (74.69% lines) and is the best candidate for additional test coverage.
