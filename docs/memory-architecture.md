# Memory Architecture
## What this workflow needs to remember

1. Decisions and their status (confirmed/superceded)
2. Cross-feature continuity
3. Investigation findings about the existing codebase
4. Human-authored standing constraints
5. The codebase itself

## Layer 1: Project memory directory

- **Scope:** Project-scoped. This memory is for this repository only.
- **Write Permissions:** The agent has append-only write access during a session - new entries only. This is to preserve an auditable trail of why decisions were made.
- **Pruning Policy:** Effectively none, by design the spec is explicit that superseded entries are marked, not deleted. This is for developer knowledge purposes.
- **Entry Fields:** Decision, Reason, Status, Owner, Review-by. Owner is the developer accountable for the decision and who must be consulted before it is reversed or superseded — added after a 2026-09-29 review found decision entries had no accountable party on record.

## Layer 2: Knowledge files
- **Scope:** Repo-specific, but broader than one feature - a distilled, currently-true summary of codebase patterns discovered during investigation steps. For example, a knowledge file that captures design patterns and shared types, or a file that contains code quality standards.
- **Write Permissions:** Read only, agent cannot write to them.
- **Pruning Policy:** None from the agent's side — pruning/updating is a human editorial action (normal git-tracked edits to feature-builder.md/README.md), not something this memory system manages.
## Layer 3: Indexed reference documents
- **Scope:** Larger or infrequently-needed material, consulted through the index only when a specific feature calls for it rather than loaded every session — full repository source, git/PR history, and any older specs or docs not central to the four roadmap features (e.g., the ingest script, the CSB API sync logic, historical CSV schema quirks pre-dating this workflow).
- **Write Permissions:** Read-only from the memory system's perspective — same as before. The agent's actual writes to source files happen in the "Implement" step, which is the deliverable, not memory.
- **Pruning Policy:** Never pruned. Treated as a stable, human-maintained corpus and kept indefinitely; removal is a manual, human-initiated action only.
## Allocation decision table
| Information         | Layer | Reason                          |

|-------------------|-------------|--------------------------------|

| "Chose stacked bar for ward chart, superseded by grouped bar"     | 1 (decision-log)    | Needs history/audit trail — Layer 2's read-only model has no write path for the agent at all, and this is agent-derived, not human-authored          |

| "Ward chart shipped, map view deferred"     | 1 (status)    | Evolving, agent-owned, resumption-focused — exactly Layer 1's new definition          |

| "Stats endpoint currently shaped like X"     | 1 (investigation-cache)    | Discovered by the agent, expected to drift — fails Layer 2's "human-maintained" test even though it's stable-ish in practice          |

| "Never push/publish/deploy"; "shared types live in libs/shared/types"     | 2     | Human-authored constraint, not something investigation produces or the agent should ever silently revise          |

| Full source of stats/monthly endpoint    | 3    | Ground truth, too large/detailed to duplicate into memory, consult live via existing tools          |

## Alternatives considered
- One log file per feature as opposed to a master log with section. This might be something worth doing as the codebase grows, but for now, one log file keeps a consistent view across features.
- A vector/embedding index for Layer 3. Rejected for now given repo size and existing Grep/Glob tools, but might be worth pursing later if the codebase grows.
