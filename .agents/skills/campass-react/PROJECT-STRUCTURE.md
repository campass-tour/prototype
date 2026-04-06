---
name: campass-project-structure
description: Recommended project structure and where to place new code.
---

# Project Structure & Where New Code Should Go

Use the following structure as the canonical reference for new files, components, hooks, and utilities.

```
src/
  components/        # small presentational + domain components
    map/
    wall/
    collection/
    photo/
    ui/
  hooks/             # reusable React hooks (useX)
  lib/               # pure utilities and adapters (no hooks)
    map.ts            # map-specific helpers
    storage.ts        # localStorage adapters
    dataSources.ts    # central data access layer
  constants/         # typed constant data (messages, locations, lores)
  pages/             # top-level page components used by router
  styles/            # global css, css-variables
  types/             # shared TypeScript types and interfaces
  assets/            # images, icons, models
  tests/             # unit and integration tests
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