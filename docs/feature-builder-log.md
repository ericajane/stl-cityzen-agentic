# Feature Builder Decision Log

Persistent record of decisions made during feature-builder sessions for STL Cityzen.
Entries are append-only. Reversed decisions are marked `superseded by <entry>`, never deleted.

Entry format:

```
## [feature name] — [date/turn marker]
Decision: <what was decided>
Reason: <why, in one line>
Status: confirmed | superseded by <later entry>
```

---

## Session start — Map view — 2026-10-05, turn 1

Context (not decisions; recorded so later turns can check against them):
- Log created this turn; no prior feature-builder decisions exist.
- Project constraints in force: tests in a separate `/tests` directory (.memory decision-002, owner Erica Knaup); unit tests required front and back end; null handling required; public-domain images/assets only (CLAUDE.md); coding standards in .memory/knowledge/coding-standards.md.
- Analog: `GET /api/csb-requests/stats/monthly` + `MonthlyChartComponent` (Chart.js via ng2-charts, standalone component, `CsbRequestsService`).
- `proj4` is already a dependency, used in the backend `neighborhood-lookup.service.ts` (State Plane to Web Mercator).
- srx/sry are Web Mercator (EPSG:3857), nullable. Local DB: ~196 out-of-bounds rows (162 positive srx, likely sign-flipped; 34 at 0/0).
- Open questions put to the developer: conversion location, map library, tile source/licensing, bad-coordinate handling, rendering strategy, endpoint shape, test location for existing colocated specs.

## Map view — 2026-10-06, turn 2
Decision: Use Leaflet as the map library, drawing points with `circleMarker` on a canvas renderer; do not use Leaflet's default marker PNGs.
Reason: Lightweight, BSD-2 licensed, works in Angular 17 without a wrapper; circle markers avoid non-public-domain marker images and Angular asset-path issues.
Status: confirmed

## Map view — 2026-10-06, turn 2
Decision: Use USGS National Map basemap tiles with a courtesy credit on the map; the tile URL must come from configuration, not be hardcoded.
Reason: USGS tiles are a US government work (public domain), satisfying the CLAUDE.md public-domain asset rule (OSM tiles are ODbL/CC-BY-SA); config-sourced URL per coding standards.
Status: confirmed
