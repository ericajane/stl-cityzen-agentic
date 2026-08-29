## Run 001 -- 8-15-2026 -- Baseline

Task: Produce a unit test code coverage report for the front end.

Full prompt: 

Working from the repo root:

1. Check the repository's documentation (README, CONTRIBUTING, or package.json
   scripts) to find the documented command for running front-end unit tests.
   Use that exact command — do not guess or substitute a different one.

2. Run that command inside this sandbox only. Do not push, publish, deploy,
   or take any action that affects the remote repository or any external
   service.

3. If any tests fail: stop and report each failing test by name with its
   error message. Tell me to fix them and re-run this task. Do not attempt
   to fix the failing tests yourself.

4. If all tests pass, produce a code coverage report as a markdown table
   showing the coverage percentage for each component, plus the overall
   front-end coverage percentage.

5. Give concrete, prioritized recommendations to improve coverage — name
   specific low-coverage components/files and the kinds of test cases
   they're missing (e.g., edge cases, error paths, untested branches).
   Avoid generic advice not tied to this repo's actual gaps.

6. Scope: only evaluate the front-end package. Ignore back-end code and
   tests entirely. "Component" here means individual front-end
   components/modules (e.g., Angular components, files), not the front-end
   package as a whole — you'll report the front-end aggregate separately
   in step 4.

Rubric Scores:

| Dimension         | Score (1-4) | Notes                          |

|-------------------|-------------|--------------------------------|

| Process Discipline & Scope Adherence     | 4     | Granted, all tests were passing in this run, but it not publish or push anything it wasn't supposed to. It also gave me a breakdown at the end on which commands it ran (e.g. "Command used: npx nx test frontend --coverage") which is helpful for a sanity check.          |

| Test Coverage Report Accuracy     | 4     | All coverage percentages reported matched the output from the test runner, and were clearly labeled by component. Coverage was further broken down into lines covered and functions covered, which was helpful.            |

| Coverage Improvement Recommendation Quality     | 3     | While the recommendations follow best practices, and the agent even picked up on some unit testing nuances (such as which components to prioritize), it fell short of being as specific as I wanted it to be (for example, it didn't refer to specific lines of code).          |

| Total         | [11 / 12]     | Pass threshold: per dimension (see rubric)    |

Measurements:

- Cycle time: 1 minute 58 seconds

- Review latency: 19 minutes

- Cost per run: $0.56 (6.0k in / 4.9k out)


Pass/Fail: Pass


Observations: 

What it did well: It seemed to be able to prioritize where to increase coverage very well, and seemed to understand unit testing nuances, like there's just not much use in unit testing certain boilerplate functions. It was also accurate, as the results in the report matched the output of the test runner.


Where it fell short: It championed brevity over detail when it came to the coverage improvement recommendations, and did not refer to specific lines in the code. I also had a hard time reading the report in the terminal, as there were /usage statistics interspersed throughout. However, that can be remedied in the next run by instructing the agent to save the report to an .md file.
 

Changes made: None. This is the baseline run.

## Run 002 -- 8-17-2026 

Task: Produce a unit test code coverage report for the front end.

Full prompt: 

Working from the repo root:

1. Check the repository's documentation (README, CONTRIBUTING, or package.json
   scripts) to find the documented command for running front-end unit tests.
   Use that exact command — do not guess or substitute a different one.

2. Run that command inside this sandbox only. Do not push, publish, deploy,
   or take any action that affects the remote repository or any external
   service.

3. If any tests fail: stop and report each failing test by name with its
   error message. Tell me to fix them and re-run this task. Do not attempt
   to fix the failing tests yourself.

4. If all tests pass, produce a code coverage report as a markdown table
   showing the coverage percentage for each component, plus the overall
   front-end coverage percentage.

5. Give concrete, prioritized recommendations to improve coverage — name
   specific low-coverage components/files and the kinds of test cases
   they're missing (e.g., edge cases, error paths, untested branches).
   Avoid generic advice not tied to this repo's actual gaps.

6. Scope: only evaluate the front-end package. Ignore back-end code and
   tests entirely. "Component" here means individual front-end
   components/modules (e.g., Angular components, files), not the front-end
   package as a whole — you'll report the front-end aggregate separately
   in step 4.

7. Save the report to an .md file at the repo root.

Rubric Scores:

| Dimension         | Score (1-4) | Notes                          |

|-------------------|-------------|--------------------------------|

| Process Discipline & Scope Adherence     | 4     | It didn't do anything it wasn't supposed to do, and this time, even reassured me with an occasional "per your instructions". Report generated and saved at repo root.            |

| Test Coverage Report Accuracy     | 4     | The percentages reported were correct and match the test runner output.            |

| Coverage Improvement Recommendation Quality     | 4     | I did get a specific code line reference this time, and it again did a good job recognizing boilerplate-y functions that we don't need to test.            |

| Total         | 12 / 12     | Pass threshold: per dimension (see rubric)   |

Measurements:

- Cycle time: 2 minutes 12 seconds

- Review latency: 6 minutes

- Cost per run: $0.51 (5.9k in / 5.8k out)


Pass/Fail: Pass


Observations: 

What it did well: This time, even though I didn't instruct it do, the report DID mention a specific line of code. Also, instructing the agent to save the report to an .md file makes the report SO much easier to read and evaluate for accuracy, and this likely played a role in reducing the review time from 19 minutes to 6 minutes. 

Where it fell short: Still only 1 specific code reference, but that can be fixed with further iteration.


Changes made: Added a last step to the workflow (Step 7) to save the report as an .md file.

## Run 003 -- 8-20-2026 

Task: Produce a unit test code coverage report for the front end.

Full prompt: 

Working from the repo root:

1. Check the repository's documentation (README, CONTRIBUTING, or package.json
   scripts) to find the documented command for running front-end unit tests.
   Use that exact command — do not guess or substitute a different one.

2. Run that command inside this sandbox only. Do not push, publish, deploy,
   or take any action that affects the remote repository or any external
   service.

3. If any tests fail: stop and report each failing test by name with its
   error message. Tell me to fix them and re-run this task. Do not attempt
   to fix the failing tests yourself.

4. If all tests pass, produce a code coverage report as a markdown table
   showing the coverage percentage for each component, plus the overall
   front-end coverage percentage.

5. Give concrete, prioritized recommendations to improve coverage — name
   specific low-coverage components/files and the kinds of test cases
   they're missing (e.g., edge cases, error paths, untested branches).
   Avoid generic advice not tied to this repo's actual gaps.

6. Scope: only evaluate the front-end package. Ignore back-end code and
   tests entirely. "Component" here means individual front-end
   components/modules (e.g., Angular components, files), not the front-end
   package as a whole — you'll report the front-end aggregate separately
   in step 4.

7. Save the report to an .md file at the apps/frontend level.

Rubric Scores:

| Dimension         | Score (1-4) | Notes                          |

|-------------------|-------------|--------------------------------|

| Process Discipline & Scope Adherence     | 4     | Everything was as expected. Again, I have not yet intentionally broken a test to see how that is handled, but perhaps in a future run.            |

| Test Coverage Report Accuracy     | 4     | All coverage percentages reflected those in the test runner, and were correctly labeled.            |

| Coverage Improvement Recommendation Quality     | 3     | Identified the most pressing coverage gaps and gave specific lines of code. However, with this run, the agent recommended that I test boilerplate code that it, until now, has recommended I not test.          |

| Total         | 11 / 12     | Pass threshold: per dimension (see rubric)   |

Measurements:

- Cycle time: 6 minutes 45 seconds

- Review latency: 5 minutes

- Cost per run: $0.77 (5.7k in / 12.5k out)


Pass/Fail: Pass


Observations: 

What it did well: This was a good run and got into much more detail this time, referring to specific lines of code, and even providing snippets of test code.

Where it fell short: The only downfall was recommending I test a boilerplate function in the app.ts file to increase coverage (though it did correctly note that this is very low-impact/low-priority.). 


Changes made: The only change made between Run 002 (last run from previous exercise) and Run 003 was an instruction to save the report file at the apps/frontend level as opposed to the repo level, as the other agent will be handling the backend report and it made sense that the reports should live in the appropriate places.

Changelog from merge: 
8e26d8f (HEAD -> main, feature/task-1) frontend coverage report generated
8b111aa (origin/main, origin/feature/task-2, origin/feature/task-1, origin/HEAD, feature/task-2) deleted old file
709e608 Preparing for Module 1 Lab
91c0612 frontend test report generated - Run 002
ae7db10 preparing for run 2

