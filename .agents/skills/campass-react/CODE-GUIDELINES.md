---
name: campass-code-guidelines
description: Code generation requirements, tech stack and mandatory rules for the Campass project.
---

# Code Generation Guidelines (Campass)

These rules must be followed by AI agents and developers when generating or modifying code for this repository.

## 1) Technology Stack (use these)
- React 19 (functional components + hooks)
- TypeScript (project uses `strict: true` — *no* `any` unless explicitly reviewed)
- Vite (dev & build)
- Tailwind CSS + shadcn UI
- `react-zoom-pan-pinch` for pan/zoom behavior
- `lucide-react` for icons

## 2) Mandatory rules
- **No hardcoded design values.** Colors, spacing, radii, fonts, z-index values etc. must use CSS variables defined in `src/styles` or `skills/.../references/css-variables.css`.
  - Use the provided script to scan for hardcoded hex values: `skills/campass-react-best-practices/scripts/check-hardcoded-values.sh <file>`.
- **Type safety:** The repository is strict TypeScript. Avoid `// @ts-ignore` and `any`. Use proper interfaces and export types to `src/types/index.ts`.
- **No unused symbols:** Remove unused imports, variables and parameters. Use `npm run lint` and `npx tsc --noEmit --project tsconfig.json` (or the provided `check-ts-strict.sh`) before opening a PR.
- **Small, single-responsibility components:** Break UI into presentational components and move business logic to hooks or `src/lib` utilities.
- **Decoupling:** Keep UI, state, and side-effects separate:
  - UI components under `src/components/*` (presentational + props)
  - Hooks under `src/hooks` or `src/lib/hooks`
  - Cross-cutting utilities under `src/lib`
  - Constants under `src/constants`
- **Accessibility:** Provide `aria-*` attributes on interactive elements and ensure keyboard focus works for critical actions.
- **No direct DOM heavy usage** unless encapsulated in a small utility (e.g., `getMarkerAndContainerCenters`). Prefer refs passed via props.

## 3) Enforcements & Scripts
- Run the strict type check (CI should run this):

```bash
# verify ts strict mode and type errors
./skills/campass-react-best-practices/scripts/check-ts-strict.sh tsconfig.json

# scan for hardcoded color values
./skills/campass-react-best-practices/scripts/check-hardcoded-values.sh src/components/map/MapViewer.tsx
```

- Use `npm run lint` before committing.

## 4) File/Folder Rules
- New components: `src/components/<feature>/MyComponent.tsx` (index export optional)
- Reusable hooks/utilities: `src/hooks` or `src/lib/hooks`
- Constants/data used across the app: `src/constants/*` (JSON-like shapes, typed)
- Types: `src/types/index.ts`

## 5) Example: Forbidden vs Allowed
Bad (hardcoded color):
```tsx
<div style={{ background: '#281559' }} />
```
Good (uses design vars):
```tsx
<div style={{ background: 'var(--color-surface)' }} />
```

## 6) Notes for AI code generation
- Prefer generating typed interfaces and small helper functions.
- When outputting code, include the intended file path in a short header in comments.
- If a behavior depends on runtime data (messages, locations), default to reading from `src/constants/*` with an explicit TODO to replace with API fetch later.

---

End of Code Guidelines.