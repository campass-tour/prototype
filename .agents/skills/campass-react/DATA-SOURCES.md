---
name: campass-data-sources
description: Locations of current hardcoded data and recommendations to externalize them.
---

# Data Sources & Hardcoded Data

This document lists files in the repository that currently contain application data hardcoded in the source. For each file, its purpose and recommended next steps are provided.

## Current hardcoded files
- `src/constants/messages.ts`
  - Contains: `MESSAGES: Message[]` — example whispers/messages for each location.
  - Recommendation: Replace with a real backend API or a JSON file under `src/data/messages.json` and create an adapter in `src/lib/dataSources.ts`. Keep `getMessagesByLocation` adapter.

- `src/constants/locations.ts`
  - Contains: `LOCATIONS` array with `{ id, name, x, y }` coordinates.
  - Recommendation: Keep the canonical list here for now, but plan to move to a content/service endpoint. Keep the `id` canonical.

- `src/constants/lores.ts`
  - Contains: `LOCATION_LORES` — textual lore for locations.
  - Recommendation: Move text content to a `src/data` folder or a CMS; keep keys typed in `src/types`.

- `src/constants/mapPinsData.ts` (legacy)
  - Contains: `mapPinsData` — older pin list. If `LOCATIONS` is canonical, mark `mapPinsData.ts` as deprecated or remove.

- `src/constants/userPositionData.ts`
  - Contains: a default `userPosition` object used in UI mock scenarios.
  - Recommendation: Provide a `useUserPosition` hook that reads from an API or the browser Geolocation API; keep this file as a fallback mock for storybook/dev.

## Suggested migration plan
1. Create `src/lib/dataSources.ts` that exposes read functions: `getMessagesByLocation`, `getLocations`, `getLoreById`.
2. Move large/example datasets to `src/data/*.json` and import them in `dataSources` for now.
3. Replace callers to read from `dataSources` instead of directly importing `src/constants/*.ts`.

## Quick mapping (file → content summary)
- `src/constants/messages.ts` → sample `MESSAGES: Message[]` + `getMessagesByLocation`
- `src/constants/locations.ts` → `LOCATIONS: {id,name,x,y}[]`
- `src/constants/lores.ts` → `LOCATION_LORES`
- `src/constants/userPositionData.ts` → `userPosition` mock
- `src/constants/mapPinsData.ts` → legacy pin data (possible removal)

## Tools to help keep data manageable
- Use typed interfaces in `src/types/index.ts` and import them where needed.
- Add a simple JSON loader pattern in `src/lib/dataSources.ts` so the switch to remote endpoints is a single change.

---

End of data sources reference.