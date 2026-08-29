## Run 001 -- 8-20-2026 -- Baseline

Task: Produce a unit test code coverage report for the back end.

Full prompt: 

Working from the repo root:

1. Check the repository's documentation (README, CONTRIBUTING, or package.json
   scripts) to find the documented command for running back-end unit tests.
   Use that exact command — do not guess or substitute a different one.

2. Run that command inside this sandbox only. Do not push, publish, deploy,
   or take any action that affects the remote repository or any external
   service.

3. If any tests fail: stop and report each failing test by name with its
   error message. Tell me to fix them and re-run this task. Do not attempt
   to fix the failing tests yourself.

4. If all tests pass, produce a code coverage report as a markdown table
   showing the coverage percentage for each component, plus the overall
   back-end coverage percentage.

5. Give concrete, prioritized recommendations to improve coverage — name
   specific low-coverage components/files and the kinds of test cases
   they're missing (e.g., edge cases, error paths, untested branches).
   Avoid generic advice not tied to this repo's actual gaps.

6. Scope: only evaluate the back-end package. Ignore front-end code and
   tests entirely. "Component" here means individual back-end
   components/modules (e.g., NestJS components, files), not the back-end
   package as a whole — you'll report the back-end aggregate separately
   in step 4.

7. Save the report to an .md file at the apps/backend level.

Rubric Scores:

| Dimension         | Score (1-4) | Notes                          |

|-------------------|-------------|--------------------------------|

| Test Command Discovery Accuracy     | 4     | Found and executed the correct command and gave me its reason why.          |

| Environment/Dependency Handling     | 4     | Installed the correct dependencies to run the test and also warned me of deprecations.            |

| Test Coverage Report Accuracy     | 4     | Results matched test runner output and were clearly labeled, and components with 0% coverage were specifically called out.          |

| Coverage Improvement Recommendation Quality     | 4     | Prioritized well and gave concrete suggestions in line with unit testing best practices.          |



| Total         | 12     | Pass threshold: per dimension (see rubric)    |

Measurements:

- Cycle time: 4 minutes 8 seconds

- Review latency: 8 minutes

- Cost per run: $1.21 (5.1k in / 7.6k out)


Pass/Fail: Pass


Observations: 

What it did well: It prioritized very well, in the same order I would have. It even explained the why behind the order - it correctly reasoned that a certain component was a "central hub" that touches all the other ones, and the coverage gaps there should be prioritized first. It was also very specific and concrete.

Where it fell short: Nothing stood out to me from this run as an area for improvement, except the cost seemed a little high compared to other runs. Perhaps later in this course we will learn to fine tune things to reduce this?
 

Changes made: None. This is the baseline run.

Changelog from merge: 
55a9bf3 (HEAD -> main) Merge branch 'feature/task-2'
38e19a4 (origin/feature/task-2, feature/task-2) backend coverage report generated
8e26d8f (feature/task-1) frontend coverage report generated
8b111aa (origin/main, origin/feature/task-1, origin/HEAD) deleted old file
709e608 Preparing for Module 1 Lab


