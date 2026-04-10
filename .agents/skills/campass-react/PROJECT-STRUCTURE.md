---
name: campass-project-structure
description: Recommended project structure and where to place new code.
---

# Project Structure & Where New Code Should Go

Use the following structure as the canonical reference for new files, components, hooks, and utilities.

```
src/
  components/        # Small presentational + domain components, organized by feature
    map/
    wall/
    collection/
    photo/
    ui/
    common/
    profile/
  hooks/             # Reusable React hooks (useX)
  lib/               # Pure utility functions and adapters (no hooks)
    dataSources.ts    # Central data access layer
    mapConverter.ts   # Map data conversion helpers
    mapUtils.ts       # Map utility functions
    storage.ts        # localStorage adapters
    utils.ts          # General utility functions
  constants/         # Typed constant data (messages, locations, lores, map config, etc.)
    locations.ts
    lores.ts
    mapConfig.ts
    messages.ts
    userPositionData.ts
  data/              # Static JSON data files for app content
    clues.json
    locationAssets.json
    locations.json
    lores.json
    messages.json
    userPosition.json
    users.json
  pages/             # Top-level page components used by router
    CollectionPage.tsx
    MapPage.tsx
    ProfilePage.tsx
    WallPage.tsx
  styles/            # Global CSS and CSS variables
    style.css
    wall-compose-btn.css
  types/             # Shared TypeScript types and interfaces (index.ts, model-viewer.d.ts)
    index.ts
    model-viewer.d.ts
  assets/            # Images, icons, models (static resources only)
    clues/
    icon/
    image/
    model/
  tests/             # Unit and integration tests (if not colocated with modules)
```

## Where to put new code
- New UI components: `src/components/<feature>/` (e.g., `src/components/map/NewPin.tsx`).
- New hooks: `src/hooks/` (e.g., `src/hooks/useMapTransform.ts`).
- Shared utilities: `src/lib/` (pure functions, no React hooks).
- Feature data that represents domain constants: `src/constants/`.
- Types for domain models: `src/types/index.ts`.

## Naming conventions
- Files: `PascalCase` for components (`MapPin.tsx`), `kebab-case` or `camelCase` for utilities (`map-utils.ts` or `computeDelta.ts`).
- Hooks: `useSomething.ts` (e.g., `useUnlockedCollectibles.ts`).

## Tests
- Place unit tests next to the module or in `src/tests/` depending on scope (project prefers unit tests next to modules with `.test.ts` suffix).

## CI/Checks
- CI should run `npx tsc --noEmit --project tsconfig.json`, `npm run lint`, and `node ./skills/campass-react-best-practices/scripts/check-hardcoded-values.sh` on changed files.

---

End of project structure guidance.