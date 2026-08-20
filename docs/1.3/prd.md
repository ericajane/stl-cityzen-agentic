This workflow reviews a repository’s front end unit tests by running the documented test command, reporting the code coverage percentage for each component, and recommending areas to increase code coverage.

Trigger: A developer invokes claude "[task prompt]" from the repo root.

Decision Events: If all tests are passing, the agent produces a code coverage report.

If there are failing unit tests, it reports each failing test and directs the developer to fix them before invoking this task again. It does not attempt a fix.

Actions:
1. Read the repository’s documentation to identify the documented command to run unit tests.

2. Run the front end unit test suite inside the sandbox.

3. Capture the code coverage percentage for each component.

4. Capture the code coverage percentage for the front end as a whole.

5. Produce recommendations to improve code coverage.

Acceptance Criteria:
1. The agent correctly identifies the code coverage percentage for all components.

2. The agent correctly identifies the code coverage percentage for the front end as a whole.

3. The recommendations for coverage improvement are consistent with unit testing best practices.

4. The agent did not push, publish, or deploy anything.

