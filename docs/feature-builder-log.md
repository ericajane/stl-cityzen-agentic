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
- Project constraints in force: tests in a separate `/tests` directory (.memory decision-002, owner Erica Knaup) — [superseded 2026-10-07, turn 3: see decision-007, colocated specs are the real standard]; unit tests required front and back end; null handling required; public-domain images/assets only (CLAUDE.md); coding standards in .memory/knowledge/coding-standards.md.
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

## Map view — 2026-10-07, turn 3

Context: Investigated `neighborhood-lookup.service.ts`, the `stats/monthly`/`stats/by-group` endpoint pattern, and how srx/sry nulls and the ~196 out-of-bounds rows were (not) currently handled, before proposing options. This turn resolves 2 of the 7 turn-1 open questions: conversion location and bad-coordinate handling, plus the endpoint-shape and test-location questions below.

Decision: SRX/SRY (EPSG:3857) → WGS84 conversion happens on the backend. New `GET /api/csb-requests/map-points` endpoint (filters: neighborhood, ward, status, group, problemCode, year, month) converts server-side via `proj4` and returns `MapPoint[]` ({ requestId, lat, lng, neighborhood, ward, problemName, address, status, dateTimeInit }). Leaflet's `circleMarker` consumes lat/lng directly; zero frontend proj4 usage.
Reason: Matches the existing backend-aggregation pattern (`getMonthlyStats`/`getGroupStats` shape data server-side; frontend stays thin). Keeps projection and data-correctness logic in one place. Resolves the conversion-location question decision-003 flagged as open (OpenLayers' native EPSG:3857 support was weighed against this and not revisited, since conversion isn't happening client-side).
Status: confirmed — recorded in `.memory/project/decisions/decision-005.md`

Decision: Of the ~196 out-of-bounds srx/sry rows, the 162 sign-flipped rows (positive srx) are repaired (sign flipped back) rather than dropped. The 34 true 0/0 rows, and any null/null rows, are excluded from the `map-points` response entirely (not returned as null lat/lng).
Reason: Sign-flipped rows are mechanically recoverable — underlying location data is intact. 0/0 rows have no recoverable location; excluding them matches the existing `backfillNeighborhoods` convention of treating `srx`/`sry IS NOT NULL` as a precondition for geo operations.
Status: confirmed — recorded in `.memory/project/decisions/decision-006.md`

Decision: New `repairMercatorPoint()`/`getMapPoints()` tests were added to the existing colocated `csb-requests.service.spec.ts` (not a separate `/tests` directory).
Reason: This surfaced a direct conflict with decision-002 (separate `/tests` directory), flagged before proceeding rather than silently picked. Developer confirmed decision-002 is superseded: 100% of existing backend specs are already colocated with source, so colocation is the real established convention, not the one on record. Resolves the turn-1 open question "test location for existing colocated specs."
Status: confirmed — decision-002 marked superseded by decision-007; decision-007 recorded in `.memory/project/decisions/decision-007.md`

Implementation: `apps/backend/src/csb-requests/csb-requests.service.ts` (repairMercatorPoint, getMapPoints), `apps/backend/src/csb-requests/csb-requests.controller.ts` (GET /map-points route), `libs/shared/types/src/lib/csb-request.ts` (MapPoint type), `apps/backend/src/csb-requests/csb-requests.service.spec.ts` (new tests covering valid/sign-flipped/0,0/null coordinates and filter behavior). Verified via a standalone ts-node script against an in-memory SQLite db, since the project's own `nx test`/jest invocation currently fails on jest-preset path resolution — confirmed pre-existing and unrelated to this change via `git stash`, flagged to the developer rather than silently worked around.

Status of all 7 turn-1 open questions: map library (resolved, decision-003), rendering strategy (resolved, decision-003), tile source/licensing (resolved, decision-004), conversion location (resolved, decision-005), bad-coordinate handling (resolved, decision-006), endpoint shape (resolved — GET /api/csb-requests/map-points, proposed and confirmed this turn), test location for existing colocated specs (resolved, decision-007). All 7 are now resolved.
Remaining for map view: frontend rendering (Leaflet map component, tile layer wiring, consuming GET /map-points).
