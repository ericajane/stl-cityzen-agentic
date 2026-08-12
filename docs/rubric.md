# 1. Quality Rubric

## 1.1 Dimensions

### 1.1.1 Build Result Accuracy

Measures whether the agent correctly identified the final outcome of the Docker build. A high score requires the stated result, success or failure, to match the actual exit status of the build command.

### 1.1.2 Warning and Error Coverage

Measures how completely the agent captured warnings and errors from the build output. A high score requires all messages at warning level or above to appear in the summary, with no material omissions. 

### 1.1.3 Recommendation Consistency

Measures whether the agent’s final recommendation follows logically from the build result and the summary it produced. A high score requires the recommendation to be both directionally correct and supported by the evidence the agent cited.

## 1.2 Alternatives Considered

Alternatives considered: a binary pass/fail checklist with one item per acceptance criterion. Ruled out because it cannot distinguish a near-miss from a complete failure, and cannot capture partial credit.

## 1.3 Scoring Guide

### 1.3.1 Build Result Accuracy

1. Does not meet: Reports the wrong build outcome, or does not report an outcome at all.

Example: Agent output reads:  "Nothing more to do here."

2. Partially meets: Reports the outcome ambiguously or with missing context—e.g., says "the build had issues" without stating pass or fail.

Example: Agent output reads: "The build had issues."

3. Meets: Correctly identifies whether the Docker image built successfully or failed.

Example: Agent output reads: "The build was successful."

4. Exceeds: Correctly identifies the outcome and includes supporting evidence, such as the exit code or the final line of build output.

Example: Agent output reads: "The build was successful with an exit code of 200."

### 1.3.2 Warning and Error Coverage

1. Does not meet: The summary omits one or more errors that appeared in the build output. A reviewer reading only the summary would have an incomplete or misleading picture of what went wrong.

Example: Agent output reads: “The build encountered some issues and did not complete successfully.” The build log contained three distinct errors. None are named in the summary.

2. Partially meets: The summary captures all errors but omits one or more warnings. The picture is not misleading, but it is incomplete. 

Example: Agent output reads: “The build failed with the following errors: missing base image tag, undefined build argument NODE_ENV. No warnings were reported.” The build log contained those two errors plus a deprecation warning for a legacy COPY syntax. The warning is absent from the summary.

3. Meets: The summary captures all errors and all warnings present in the build output. Nothing material is missing.

Example: Agent output reads: “The build failed with two errors (missing base image tag, undefined build argument NODE_ENV) and one warning (deprecated COPY syntax on line 12).” All items from the build log are present.

4. Exceeds: The summary captures all errors and warnings, groups or prioritizes them, so the most important issues are immediately visible without requiring the reviewer to read the full log.

Example: Agent output reads: “The build failed. Two errors must be resolved before the image can build: a missing base image tag (blocking) and an undefined build argument NODE_ENV (blocking). One non-blocking warning is present: deprecated COPY syntax on line 12, which will become an error in Docker 26.” Errors and warnings are separated, labeled by severity, and the warning includes forward-looking context.

### 1.3.3 Recommendation Consistency

1. Does not meet: The recommendation contradicts the build result—e.g., recommends proceeding after a failed build—or no recommendation is given.

Example: Agent output reads: "Build failed. Go ahead and proceed."

2. Partially meets: The recommendation is directionally correct but is not supported by the evidence in the summary, or is too vague to act on.

Example: Agent output reads: "It's all good. Go ahead and proceed."

3. Meets: The recommendation is consistent with the build result and follows logically from the summary produced.

Example: Agent output reads: "Build failed. Do not proceed."

4. Exceeds: The recommendation is consistent, well-supported, and includes specific next steps that follow directly from the errors or warnings identified.

Example: Agent output reads: "Build failed with an image not found warning on lines 11-14. Do not proceed."

## 1.4 Pass Threshold

A run is passing if it scores 3 or higher on all dimensions.

Reasoning: Build Result Accuracy and Recommendation Consistency must both be correct for the output to be trustworthy. A run that scores 4 on coverage, but 2 on accuracy produces a well-documented wrong answer, which is worse than a sparse correct one. A dimension floor prevents high scores on secondary dimensions from masking failures on primary ones.

## 1.5 Threshold Alternatives Considered

Considered an aggregate minimum of 10/16 instead of a dimension floor. Ruled out because it would allow a run scoring 1 on Build Result Accuracy to pass if it scored 4 on all other dimensions. An agent that reports the wrong build result is not acceptable, regardless of how well it covers warnings. The dimension floor prevents that outcome.