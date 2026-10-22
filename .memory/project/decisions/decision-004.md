# Decision 004 - Use USGS National Map basemap tiles for the map view

**Date:** 2026-10-06
**Review by:** 2027-01-04
**Status:** Active
**Owner:** Erica Knaup

**Decision:** The map view will use USGS National Map basemap tiles, with a courtesy credit shown on the map. The tile URL must come from configuration, not be hardcoded.

**Rationale:** Confirmed by the developer during the feature-builder session for the map view. CLAUDE.md requires public domain images and assets. USGS tiles are a US government work and therefore public domain. Sourcing the URL from configuration follows the coding standard against hardcoded paths.

**Alternatives rejected:** OpenStreetMap tiles were considered for their familiar street-map look, but rejected because they are ODbL/CC-BY-SA licensed (not public domain), require on-map attribution, and OSM's tile usage policy discourages heavy application traffic.

**Related:** decision-003 (map library). Session detail in `docs/feature-builder-log.md`.
