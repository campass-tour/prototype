---
name: campass-data-sources
description: Locations of current hardcoded data and recommendations to externalize them.
---

# Data Sources & Hardcoded Data
This document summarizes where the app's data currently lives (JSON + constants), how the code reads it today, and recommended next steps to make the data easier to maintain or replace with a backend service.

## Current Status Overview

- Runtime data sources are centralized in `src/data/*.json` (development/offline sample data), loaded and queried via the adapter `src/lib/dataSources.ts`.
- The `src/constants/*` directory exposes convenient constants/wrappers (such as `LOCATIONS`, `MESSAGES`, `getLoreById`, `getLocationData`), which internally call methods from `src/lib/dataSources.ts`.
- Components typically import data directly from `src/constants` (e.g., `MapPin` uses `getLocationData`), and use `import.meta.glob` to resolve filenames in `locationAssets` to URLs as needed.

Below is a detailed explanation and recommendations based on the current codebase (`src/lib/dataSources.ts` + `src/data/*.json`).

## Main Files and Responsibilities (Current)

- `src/lib/dataSources.ts` — Adapter Layer (Current Implementation)
  - Imports data from `src/data/*.json` (messages, locations, lores, userPosition, locationAssets, etc.) and exports query functions:
    - `getMessages()`, `getMessagesByLocation(locationId)`
    - `getLocations()`, `getLocationById(id)`
    - `getLoreById(id)`
    - `getUserPosition()`
    - `getLocationAssetsById(id)`
  - Extra behavior: If data contains GPS but not x/y, uses `convertGpsToImageCoordinates()` to convert GPS coordinates to image percentage coordinates (for map image positioning).

- `src/data/*.json` — Raw Sample Data for Development
  - `locations.json`: List of locations (id, name, x/y or gps, lv)
  - `messages.json`: Location messages/whispers (id, locationId, content, author, likes, timestamp, imageUrl, etc.)
  - `lores.json`: Location descriptions/lore (id, title, content)
  - `locationAssets.json`: Static asset filenames for each location (icon, image, model, mascotName) — note these are filenames or relative paths; components must resolve them to actual URLs using `import.meta.glob`
  - `userPosition.json`: User position for development/testing (gps or x/y)

- `src/constants/*.ts` — Simple Exports/Wrappers
  - For example, `src/constants/locations.ts` exposes `LOCATIONS = getLocations()` and `getLocationData(id)` (providing components with resolved `image/icon/model` filenames).
  - `src/constants/messages.ts` exposes `MESSAGES` and `getMessagesByLocation`, but the actual data still comes from `src/lib/dataSources.ts`.

## How to Resolve Asset Files in Components

Many components (such as `LockedContent`, `MapPin`) resolve filenames in `locationAssets` to usable URLs at runtime:

Example (common project pattern):

```ts
// Inside a component
const imageModules = import.meta.glob('../../assets/image/*', { eager: true, import: 'default', query: '?url' }) as Record<string, string>;
const fileName = 'cb-image.png';
const matchKey = Object.keys(imageModules).find(k => k.endsWith(fileName));
const url = matchKey ? imageModules[matchKey] : '/fallback.png';
```

Thus, `locationAssets.json` stores filenames (or asset relative paths), not final URLs; components are responsible for resolving filenames to bundled asset URLs (this is also a common Vite pattern).

## Recommendations and Migration Path

Short-term (immediate)
- Keep `src/data/*.json` as development sample data, and centralize all reads in `src/lib/dataSources.ts` (already in place). This allows future replacement with a remote API by only changing the adapter.
- Keep wrappers in `src/constants/*` lightweight (current state is good), and avoid duplicating the same data in multiple places.
- Only store filenames in `locationAssets.json`; document in README or comments that any new asset must also be placed in `src/assets/...` and registered in `locationAssets.json`.

Mid-term (1–2 iterations)
- Refactor `src/lib/dataSources.ts` to support switchable data sources: support both `local` (current JSON) and `remote` (fetch from backend API). For example:

```ts
// Simple example
let useRemote = false;
export async function initDataSource(config) { useRemote = config.remote; }
export async function getLocations() {
  if (useRemote) return fetch('/api/locations').then(r=>r.json());
  return locationsFromJson;
}
```

- Add/complete type definitions in `src/types/index.ts` (Location, Message, LocationLore, UserPosition) and share them between the adapter and components.

Long-term (production)
- Migrate to a real backend/content service (CMS or REST/GraphQL), with the backend returning resolved coordinates and asset paths (or CDN URLs).
- Keep the `dataSources` adapter layer: the frontend only calls `getLocations()` etc., without caring whether data is local or remote.

## Maintenance and Common Notes

- Asset naming: `image`/`icon`/`model` in `locationAssets.json` should match filenames in `src/assets/...`; case must match when using `import.meta.glob` in components.
- Coordinate priority: If both `x/y` (image percentage) and `gps` exist in `locations.json`, components/adapters should prefer `x/y`; if only `gps` is provided, use `convertGpsToImageCoordinates()` for a one-time conversion and cache the result.
- Avoid importing `src/data/*.json` directly in multiple places (should only be read by `dataSources`), making it easier to switch to a remote service in the future.

## Quick Mapping (File → Description)

- `src/data/locations.json` — List of locations (id, name, x/y or gps, lv)
- `src/data/messages.json` — Location messages/whispers (sample data for development and UI testing)
- `src/data/lores.json` — Lore/description text for each location
- `src/data/locationAssets.json` — Asset filenames for locations (icon/image/model/mascotName)
- `src/data/userPosition.json` — User position for development (gps or x/y)
- `src/lib/dataSources.ts` — Reads JSON and exposes API (getLocations/getMessages/getLoreById/...), includes GPS→image coordinate conversion logic
- `src/constants/*.ts` — Constant/wrapper exports, internally use `dataSources` (so components don't depend directly on dataSources)

## Testing/Validation Recommendations

1. Local development: Run `npm run dev` and open the page to confirm the map, popups, and ImageViewer can all load content from `src/data`.
2. Build validation: Run `npm run build` (can be run in CI) to ensure `src/lib/dataSources.ts` builds correctly and `import.meta.glob` resolves asset files.
3. Migration validation: If switching to a remote API, provide a `useRemote` switch in `dataSources` and use the same type responses for end-to-end comparison tests.


---

End of data sources reference.