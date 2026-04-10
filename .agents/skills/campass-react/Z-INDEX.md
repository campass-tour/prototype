# ImageViewer Z-Index Skill

Purpose
- Document recommended z-index variables and usage for `ImageViewer` and related overlays/modals.
- Provide concrete examples for CSS variables, Tailwind mapping, and component changes.

Background
- Different overlays (map popovers, modals, AR viewer, image viewer) must have predictable stacking.
- Centralizing z-index values avoids conflicts and makes global changes easy.

Recommended CSS variables (add to `:root` in `src/styles/style.css`)

```
/* Layering */
--z-map-pin: 10000;   /* popovers attached to map pins */
--z-modal: 20000;     /* normal modals / drawers / bottom-sheets */
--z-overlay: 30000;   /* top-most overlays: AR, ImageViewer, global overlays */
```

Guidelines
- Use `--z-map-pin` for in-map popovers and pin-related panels.
- Use `--z-modal` for ordinary modal dialogs, drawers and bottom-sheets.
- Use `--z-overlay` for UI that must sit above every modal (e.g., `ImageViewer`, AR full-screen prompt).
- Prefer CSS variable usage over hardcoded numeric `zIndex` values in components.

Example: CSS (`src/styles/style.css`)

```css
:root {
  /* ...existing vars... */
  --z-map-pin: 10000;
  --z-modal: 20000;
  --z-overlay: 30000;
}
```

Example: React component (JSX inline style)

```tsx
// Ensure portal container sits above modals
<div style={{ zIndex: 'var(--z-overlay)' }} className="fixed inset-0">
  {/* ImageViewer content */}
</div>
```

Example: replace hardcoded z in ImageViewer

```diff
- style={{ backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 11000 }}
+ style={{ backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 'var(--z-overlay)' }}
```

Tailwind integration (optional, preferred for class-based use)
- Map these variables into Tailwind `theme.extend.z` so you can use `z-map-pin`, `z-modal`, `z-overlay` classes.

Add to `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      zIndex: {
        'map-pin': 'var(--z-map-pin)',
        'modal': 'var(--z-modal)',
        'overlay': 'var(--z-overlay)',
      }
    }
  }
}
```

Then you can use `className="z-overlay"` in JSX.

Migration checklist
- Search for hardcoded `zIndex:` inline styles and Tailwind `z-*` utilities.
- Replace overlay-level `z-50`/`z-[11000]` with `style={{ zIndex: 'var(--z-modal)' }}` or `className="z-modal"` after Tailwind mapping.
- Verify map popovers use `--z-map-pin` (or keep as-is if intentionally lower).
- Run `npm run build` and manual UI tests (open map pin popover, open modal, then open ImageViewer/AR to confirm stacking).

Testing
- Build: `npm run build` (TypeScript checks + Vite build).
- Manual: on pages with map pins and message modals, open pin popover, open modal, then open ImageViewer — ImageViewer must overlay both.

Notes
- Avoid setting arbitrarily large numbers; use variables so teams can adjust one place.
- If you need more granular layers, add more variables (e.g. `--z-toast`, `--z-floating`) and map them similarly.

Author
- Created by the team to standardize overlay stacking for ImageViewer and AR components.
