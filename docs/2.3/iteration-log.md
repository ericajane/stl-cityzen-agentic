## Run 001 -- 10-04-2026 -- Baseline

Agent: `feature-builder.md`
Version: 1.0
Task description: Work with the developer in a multi-turn session to build the map view feature.

Memory system description: Fresh session with no pasted memory.

Results:
- Rubric Scores:

| Dimension         | Score (1-4) | Notes                          |

|-------------------|-------------|--------------------------------|

| Accuracy     | 4     | At no point did it misremember anything or record false information.          |

| Task Adherence     | 3     | There was a point when the agent brought up something I'd rejected in a previous session, which tells me I need to record "Alternatives Considered" more concretely.      |

| Coherence     | 3     | I noticed a diversion at one point between the .memory/project/decision logs and the agent's own log. This tells me I need to consider reconfiguring the agent to use the memory system as the single source of truth.          |

| Total         | 10/12    | Pass threshold: 10/12    |

- Observations:

The system worked well in that at no point were any hallucinations recorded, and it found and read all of the memory system files, and those are where they should be. What I can improve on is integrating the agents themselves with the memory system, and using that as a single source of truth. 

Git log:

1772fab (HEAD -> feature/map-view) docs: require feature-builder to record decisions in project memory
fa38192 memory: record map view library and tile source decisions
934d6ba (origin/main, origin/HEAD, memory/init-directory-structure, main) Merge pull request #3 from ericajane/memory/init-directory-structure
c285cc4 (origin/memory/init-directory-structure) Merge pull request #2 from ericajane/main
05d083b memory structure added
4c0e149 memory: remove vague code-formatting entry from coding standards
9a5fcd6 memory: add decision ownership and fix vague rationale
