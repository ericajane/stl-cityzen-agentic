# 1. Quality Rubric

## 1.1 Dimensions

### 1.1.1 Test Command Discovery Accuracy

Measures whether the agent correctly locates and uses the repository's actual documented command for running back-end unit tests, rather than guessing or substituting a different command (PRD Action #1).

### 1.1.2 Environment/Dependency Handling

Measures whether the agent correctly sets up (or accurately reports its inability to set up) whatever the back-end test suite needs to run — e.g., a database, environment variables, seed data, or external service stubs — rather than silently failing, fudging results, or reporting false test outcomes.

### 1.1.3 Test Coverage Report Accuracy

Measures whether the agent correctly identified the code coverage percentage for each component and the front end as a whole. 

### 1.1.4 Coverage Improvement Recommendation Quality

Measures whether the agent’s testing improvement recommendations follow unit testing best practices. A high score requires the recommendation to both follow best practices and be supported by the evidence the agent cited.

## 1.2 Alternatives Considered

Alternatives considered: a binary pass/fail checklist with one item per acceptance criterion. Ruled out because it cannot distinguish a near-miss from a complete failure, and cannot capture partial credit.

## 1.3 Scoring Guide

### 1.3.1 Test Command Discovery Accuracy

1. Does not meet: Agent runs an incorrect command, or attempts to guess without looking at the docs first.

Example: Agent output reads: "I will go ahead and run this one command that always works for most things."

2. Partially meets: Agent finds a command in the docs and runs it directly rather than with required flags (which can lead to inaccurate results).

Example: Agent ouput reads: "Running nx test" when it should be running "npx nx test backend".

3. Meets: Agent locates the documented test command and runs that and only that.

Example: Agent output reads: "Running the documented command npx nx test backend".

4. Exceeds: Agent meets all "Meets" criteria and notes discrepancies if found — e.g., documentation is outdated or ambiguous, and the agent flags this rather than silently picking one interpretation.

Example: Agent output reads: "Note: this script only runs unit tests, not end-to-end tests. The coverage numbers below reflect unit tests only. For full coverage numbers, please run those separately or update the documentation."

Pass threshold: Score ≥ 3. A score of 1 should be treated as putting the whole run's coverage numbers in question, since a wrong test command likely invalidates Dimension 3 as well.

### 1.3.2 Environment/Dependency Handling

1. Does not meet: Agent runs the tests without setting up the dependencies needed to run the tests (such as env vars), gets a bunch of errors, and reports the tests as failures or coverage gaps.

Example: Agent output reads: "All tests failing with 0% coverage" without having attempted to install the dependencies needed to run the tests.

2. Partially meets: The agent resolves some but not all dependencies, resulting in a partial or incomplete test run.

Example: Coverage percentages in the report show for some components but not others, or some components show 0% coverage when they should have lots.

3. Meets: Agent identifies the dependencies it needs for the test suite to run via the documentation, successfully runs it, and produces accurate coverage results. Or, if it is unable to run the test suite for some reason (e.g. unable to resolve a dependency), it reports that limitation instead of presenting invalid results as real.

Example: Agent output reads: "Unable to set up sandbox due to unresolved dependency. Tests were run individually. Results may not be accurate."

4. Exceeds: Agent meets all "Meets" criteria and is efficient/careful about it — e.g., reuses existing setup scripts documented in the repo rather than improvising, tears down or avoids polluting shared state, and explains what it set up and why.

Example: Agent output reads: "Installing someDependency via someScript per documentation."

Pass threshold: Score ≥ 3. As with Dimension 3, a score of 1 here undermines confidence in every other dimension's results for that run, since a broken environment produces meaningless coverage numbers.


### 1.3.3 Test Coverage Report Accuracy

1. Does not meet: Agent reports coverage numbers that don't match the actual test-runner output at all, or fabricates a coverage report without running the tests.

Example: Agent output reads:  "All tests are passing with 100% coverage" immediately, with no evidence of the test runner running in the container.

2. Partially meets: The report includes test coverage for some but not all components, or gives percentages without context.

Example: Agent output reads: “Test coverage is 50 percent."

3. Meets: The report includes the code coverage percentage for each component and the back end as a whole, and matches the test runner's output.

Example: Agent output reads: “Component A has 75 percent coverage, comppnent B has 25 percent coverage, and total test coverage for the application is 50 percent."

4. Exceeds: The coverage summary meets all "meets" criteria and adds useful precision, such as breaking out coverage by statements/branches/functions/lines, flagging components with 0% coverage, or noting stale/skipped test files that affect the numbers.

Example: Agent output reads: "Add a sad path test for someFunction() on line 34 in ComponentA."

Pass threshold: Score ≥ 3. Since this is a factual-accuracy dimension, a score of 1 (numbers don't match reality) should be treated as an automatic fail for the run regardless of other scores — an agent that reports the wrong numbers confidently is a bigger risk than one that reports no numbers.


### 1.3.3 Coverage Improvement Recommendation Quality

1. Does not meet: The recommendation is incorrect or nonsensical, or doesn't apply to this repo.

Example: Agent output reads: "Delete all of these tests and start over."

2. Partially meets: Agent names specific low-coverage components but recommendations are vague or not obviously grounded in best practice (e.g., "add tests here" with no indication of what to test).

Example: Agent output reads: "Some of the functions in ServiceA still need tests."

3. Meets: Agent identifies specific under-covered components/functions/services and recommends concrete test cases (e.g., edge cases, error paths, untested branches) grounded in standard unit-testing practice.

Example: Agent output reads: "In ServiceA, test the sad path of someFunction() on line 22..."

4. Exceeds: Agent meets all "Meets" criteria and prioritizes recommendations by impact/risk (e.g., "this component is both low-coverage and high-traffic/complex, address it first") or ties recommendations to specific uncovered lines/branches from the coverage report.

Example: Agent output reads: "Address ServiceA first, because it touches 4 other components and errors there could cause other components to fail."

Pass threshold: Score ≥ 3.

## 1.4 Pass Threshold

A run passes only if all three dimensions meet their individual pass thresholds (which I added at the end of the scoring guide for each dimension). 

Reasoning: A score of 1 on Environment/Dependency Handling fails the run outright, since a broken testing environment will produce meaningless coverage numbers. Likewise, a score of 1 on Test Coverage Report Accuracy fails the run outright, because faux numbers are worse than no numbers.

## 1.5 Threshold Alternatives Considered

Considered an aggregate minimum of 10/16 instead of a dimension floor. Ruled out because it would allow a run scoring 1 on Environment/Dependency Handling or Test Coverage Report Accuracy to pass if it scored 4 on all other dimensions. Being unable to properly resolve the enviroment to run tests in the first place, or giving fake coverage numbers are both automatic fail behaviors. The dimension floor prevents that outcome.