# Parallel Agent Session Tasks

## Session A

Branch name: feature/agent-a
Worktree directory: target-agent-a
Task: Run the unit test suite and produce a report about the statistics (number of tests run, passed, and failed, and code coverage percentage). This file, called frontend-test-report.md will live at the apps/frontend level.
Files or folders the agent may write to: apps/frontend
Files or folders the agent may read but not write to: apps/backend
Commands the agent may run: creating new files, running unit tests
Definition of done: Report is produced and contains the correct information.

## Session B

Branch name: feature/agent-b
Worktree directory: target/agent-b
Task: Run the unit test suite and produce a report about the statistics (number of tests run, passed, and failed, and code coverage percentage). This file, called backend-test-report.md will live at the apps/backend level.
Files or folders the agent may write to: apps/backend
Files or folders the agent may read but not write to: apps/frontend
Commands the agent may run: creating new files, running unit tests
Definition of done: Report is produced and contains the correct information.


