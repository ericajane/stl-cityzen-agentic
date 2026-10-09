# Decision 005 - Convert SRX/SRY to WGS84 on the backend

**Date:** 2026-10-07
**Review by:** 2027-01-05
**Status:** Active
**Owner:** Erica Knaup

**Decision:** The Web Mercator (EPSG:3857) srx/sry → WGS84 lat/lng conversion for the map view happens on the backend. A new `GET /api/csb-requests/map-points` endpoint performs the conversion server-side (via `proj4`, already a root-level dependency) and returns ready-to-use `{ lat, lng, ... }` points. The frontend uses these values directly with Leaflet's `circleMarker`; no `proj4` usage is needed in the Angular app.

**Rationale:** Confirmed by the developer. This matches the existing backend-aggregation pattern already established by `getMonthlyStats`/`getGroupStats` (backend shapes and returns ready-to-consume DTOs; frontend components stay thin). It also keeps projection logic and bad-coordinate handling in one place, consistent with where `neighborhood-lookup.service.ts` already does a different State-Plane-to-Mercator conversion. It resolves the conversion-location question that was left open when decision-003 (Leaflet) was made.

**Alternatives rejected:** Client-side conversion with `proj4` in Angular, and a hybrid (backend validates/repairs, frontend converts), were both considered. Both were rejected because they would duplicate projection setup across backend and frontend and move data-correctness logic (bad-coordinate handling) out of the backend, breaking the established convention. See decision-003's "Alternatives rejected" note, which flagged this exact tradeoff as worth revisiting if conversion ended up client-side — it did not.

**Related:** decision-003 (Leaflet/circleMarker, map library), decision-006 (bad-coordinate repair policy, decided alongside this one). Session detail in `docs/feature-builder-log.md`.
