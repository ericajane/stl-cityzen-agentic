# Decision 006 - Repair sign-flipped srx values; drop true 0/0 rows

**Date:** 2026-10-07
**Review by:** 2027-01-05
**Status:** Active
**Owner:** Erica Knaup

**Decision:** For the map view's backend coordinate conversion (decision-005), bad srx/sry values are handled as follows: the 162 known sign-flipped rows (positive srx, which is impossible for St. Louis — always west of the prime meridian) are repaired by flipping the sign back before conversion, rather than being dropped. The 34 true 0/0 rows (not a real location) are excluded from the `map-points` response entirely. Null/null rows are also excluded.

**Rationale:** Confirmed by the developer. The sign-flipped rows are mechanically recoverable — the underlying location data is intact, only the sign is wrong — so dropping them would needlessly lose ~162 valid points. The 0/0 rows have no recoverable location information, so there's nothing to plot; excluding them (rather than returning `lat: null`) matches the existing convention in `backfillNeighborhoods`, which already treats `srx`/`sry IS NOT NULL` as a precondition for any geo-dependent operation.

**Alternatives rejected:** Dropping all ~196 bad rows uniformly (simpler, but throws away ~162 recoverable points). Returning `null` lat/lng for unrecoverable rows instead of omitting them (rejected — a map has nothing meaningful to render for a null point, and no other geo endpoint in the codebase returns nulls for unmappable coordinates).

**Related:** decision-005 (conversion location, decided alongside this one). Session detail in `docs/feature-builder-log.md`.
