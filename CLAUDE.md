<!-- nx configuration start-->

# App purpose

- This app enables users to query recent data (2025 - present) from the St. Louis City Citizen Service Bureau by address, ward, month, and several other parameters. Eventually users will be able to create charts with the data.

# Development Guidelines

- Add unit tests for each new piece of functionality added on both the front and back ends.

- Be mindful to check for null values where appropriate to make sure those are correctly handled. If they are not handled correctly, fix it.

# Images and Other Assets

- Please use public domain images. We don't want copyright problems!

# Git Guidelines

- Never push directly to main. Offer to create a new branch from main instead

# Agent Instructions

## Memory Configuration

At the start of every session, read .memory/project/MEMORY_INDEX.md
to orient yourself. Then read any active entries listed there that
are relevant to the current task.

Before making any significant decision or observing something worth
remembering across sessions, check the index for an existing entry
on the same topic. Update existing entries rather than creating
duplicates.

### Memory layers

- .memory/project/ — Read on startup via MEMORY_INDEX.md. You may
 write new entries here when a significant decision is made or
 project state changes.

- .memory/knowledge/ — Read-only. Consult before making any decision
 that touches coding standards or architectural constraints. Never
 attempt to write to this directory.

- .memory/reference/ — Read-only. Query by keyword for relevant
 excerpts when you need background context. Do not read the entire
 directory.

### Write policy

Before writing a new memory entry, check MEMORY_INDEX.md for an
existing entry on the same topic. Update existing entries rather
than creating new ones. Never write anything classified as
Confidential or Secret to any memory layer.

### Stale memory policy

If a memory entry's review date has passed, flag it in your session
output and ask for human confirmation before acting on it.

### Scope verification

Read SCOPE.md at the root of .memory/ on startup. If it does not
match this project, halt and report the mismatch before doing
anything else.
<!-- nx configuration end-->
