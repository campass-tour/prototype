---
name: campass-reusable-components
description: Catalog of reusable components in the project and guidelines for building new reusable components.
---

# Reusable Components (Campass)

This page catalogs UI components that are reused across the app and documents responsibilities and recommended props for future reuse.

## Map-related
- `MapViewer` (`src/components/map/MapViewer.tsx`)
  - Responsibility: Top-level interactive map. Hosts TransformWrapper and Render overlays.
  - Reusability: Keep only map orchestration here. Delegate overlays, controls, and pin rendering.

- `MapOverlayLayer` (`src/components/map/MapOverlayLayer.tsx`)
  - Responsibility: Absolute-position overlay above the map image where markers/pins are rendered.

- `MapPin` (`src/components/map/MapPin.tsx`)
  - Responsibility: Render a single map pin indicator + popover/drawer content.
  - Keep presentation separate from business logic: accept `status`, `x`, `y`, `onEnterAR`, `onMessageWallClick` props.

- `UserPositionIndicator` (`src/components/map/UserPositionIndicator.tsx`)
  - Responsibility: Show the user's marker and heading. Consume `useUserPosition` hook.

## AR / Photo
- `ARModelViewer` (`src/components/photo/ARModelViewer.tsx`)
  - Responsibility: Encapsulate model-viewer usage and AR modal behaviors.

- `SummonARButton`
  - Small reusable control for AR entrance — keep visuals consistent.

## Wall / Messages
- `Danmaku` (`src/components/wall/Danmaku.tsx`)
  - Responsibility: Floating comment stream (danmaku) rendered over map.

- `MessageCard` (`src/components/wall/MessageCard.tsx`)
  - Responsibility: Present individual messages/whispers. Reusable in lists and popovers.

## UI primitives
- `src/components/ui/button.tsx` - wrap shadcn/button if present; expose common variants.

## Component design rules
- Accept typed props with minimal coupling to global state.
- Avoid importing `localStorage` directly in components — use hooks or `src/lib` adapters.
- Provide `className` passthrough and `data-*` attributes for testability.
- Export small subcomponents when necessary (e.g., `MapPin.Header`, `MapPin.Body`).

---

End of reusable components catalog.