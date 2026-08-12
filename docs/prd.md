This workflow reviews a repository’s Docker setup by running the documented build command, reporting the outcome, and recommending whether the repo is ready to proceed.

Trigger: A developer invokes claude "[task prompt]" from the repo root.

Decision Events: If the Docker build succeeds, the agent summarizes any warnings and recommends
proceeding.

If the Docker build fails, the agent reports the error output and recommends
against proceeding. It does not attempt a fix.

Actions:
1. Read the repository’s documentation to identify the documented Docker build
command.

2. Run the Docker build command inside the sandbox.

3. Capture the output from the build process.

4. Evaluate the build result (success or failure).

5. Summarize any warnings or errors present in the output.

6. Produce a final recommendation, ready to proceed or not ready, with a brief
rationale.

Acceptance Criteria:
1. The agent correctly identifies whether the Docker image was built successfully or failed.

2. The summary includes all warnings and errors present in the build output; it
does not omit any.

3. The recommendation is consistent with the build result.

4. The agent did not push, publish, or deploy anything.

