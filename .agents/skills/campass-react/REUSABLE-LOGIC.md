---
name: campass-reusable-logic
description: Reusable logic, hooks and utilities discovered and recommended for Campass.
---

# Reusable Logic & Hooks (Campass)

This document catalogs common logic pieces that are already implemented in the codebase or that should be extracted as reusable hooks/utilities.

## Existing utilities (to re-use or centralize)
- `src/lib/storage.ts`
  - `getUnlockedCollectibles()` — returns a Record<string, boolean> from localStorage
  - `unlockCollectible(id)` — marks an id unlocked in localStorage
  - `isCollectibleUnlocked(id)` — boolean check
  - `getUnlockedCount()` — helper
  - Recommendation: keep these functions but also expose a React hook wrapper `useUnlockedCollectibles()` in `src/hooks/useUnlockedCollectibles.ts` that exposes `{ isUnlocked(id), unlock(id), unlockedIds }` and subscribes to `storage` changes if needed.

- `src/components/map/getMarkerAndContainerCenters.ts`
  - Utility that calculates DOM centers for a marker & container. Good candidate to move into `src/lib/map.ts` along with related helpers.
  - Suggested exports: `getMarkerAndContainerCenters(markerId, containerEl)`, `computeCenterDelta(markerRect, containerRect)`.

## Suggested hooks to create
- `src/hooks/useUnlockedCollectibles.ts` — wrapper around `src/lib/storage.ts` with memoized values and events.

- `src/hooks/useUserPosition.ts` — abstract access to user location used by `UserPositionIndicator`.
  - Should support fallbacks to `src/constants/userPositionData.ts` and optionally use Geolocation API.

- `src/hooks/useMapTransform.ts` — encapsulates common TransformWrapper/TransformComponent interactions:
  - `init(ref)`, `centerOnMarker(markerId)`, `fitToBounds(bounds)`, `zoomTo(scale)`.
  - This prevents duplication of `centerUsingTransformRef` / `handleInit` logic across components.

- `src/lib/dataSources.ts` — central read/write API for app data; functions should be small adapters that currently read constants and later can switch to fetch/GraphQL without touching callers.
  - Exports: `getMessagesByLocation(locationId)`, `getLocationList()`, `getLoreById()` (adapts from `src/constants/*`).

## Best practices for these utilities
- Keep side effects inside hooks (e.g., `useEffect`) not in the pure utility functions.
- Export TypeScript types for all payloads (Message, Location, Lore) in `src/types/index.ts` and import them in utilities.
- Add unit tests for pure helpers (no DOM), e.g., `computeCenterDelta`.

---

End of reusable logic reference.