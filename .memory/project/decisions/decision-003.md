# Decision 003 - Use Leaflet as the map view library

**Date:** 2026-10-06
**Review by:** 2027-01-04
**Status:** Active
**Owner:** Erica Knaup

**Decision:** The map view feature will use Leaflet as its map library. Request locations will be drawn with `circleMarker` on a canvas renderer; Leaflet's default marker PNGs will not be used.

**Rationale:** Confirmed by the developer during the feature-builder session for the map view. Leaflet is lightweight, BSD-2 licensed, and works in the Angular 17 frontend without a wrapper library. Canvas-rendered circle markers scale better than DOM markers for the large point counts in the CSB data, and avoid Leaflet's default marker images, which are not public domain (CLAUDE.md asset rule) and cause asset-path issues in Angular builds.

**Alternatives rejected:** OpenLayers was considered — it handles the source data's Web Mercator (EPSG:3857) coordinates natively — but rejected as heavier than the feature requires. Note: where the Web Mercator → WGS84 conversion happens (backend vs frontend) was still an open question when this decision was made; if conversion ends up in the frontend, OpenLayers' native EPSG:3857 support may be worth revisiting.

**Related:** decision-004 (tile source). Session detail in `docs/feature-builder-log.md`.
