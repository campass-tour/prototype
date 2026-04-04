---
name: campass-react-best-practices
description: Defines and enforces best practices, coding standards, and component structure for the Campass React project. This Skill must be followed for all new features and refactoring.
---


# Campass React Project Skill

## Project Structure Example

Below is a simplified project structure to help AI agents and developers quickly locate files and understand where to add or modify code:

```
src/
  components/
    collection/
      CollectionPage.tsx
      MascotCard.tsx
      ...
    wall/
      WallPage.tsx
      Danmaku.tsx
      MessageCard.tsx
      ...
    ui/
      button.tsx
      ...
  constants/
    locations.ts
    messages.ts
  lib/
    storage.ts
    utils.ts
  pages/
    WallPage.tsx
  styles/
    style.css
  types/
    index.ts
```

> Use this structure as a reference to find the correct file locations for new features, refactors, or bug fixes.

## Purpose
This Skill defines best practices and mandatory requirements for developing features in the Campass project, a gamified campus exploration web app built with React, TypeScript, Tailwind CSS, and shadcn/ui.

## Guidelines

### 1. Use of CSS Variables
- **CSS variables are mandatory.** All colors, fonts, spacing, and radii must use CSS variables defined in `references/css-variables.css`.
- **Hardcoded style values are strictly forbidden** (e.g., `#281559` or `16px`).
- Use `var(--variable-name)` in inline styles.
- You can use the `scripts/check-hardcoded-values.sh <file-path>` script to scan for hardcoded style values in code.

### 2. Component Structure
- **Break features into small, reusable components.**
- Avoid monolithic or overly large components.
- Use `assets/component-template.tsx` as a starting template for new components.

### 3. Decoupling Logic Placement
- **Do not place logic directly in `App.tsx`.**
- Logic must be split into dedicated, single-responsibility components (e.g., `MapViewer`, `MapOverlayLayer`, `UserPositionIndicator`).
- Each independent feature (controls, overlays, markers, etc.) should be its own component where possible.

### 4. shadcn/ui & Tailwind CSS
- Prefer shadcn/ui components and Tailwind utility classes for layout and styling.
- When extending or overriding styles, always use project-defined CSS variables, never hardcoded values.

### 5. General Best Practices
- All components and logic must use TypeScript and ensure type safety.
- Keep components presentational (UI-only) where possible. Extract business logic and state management into custom hooks (`use...`).
- Prefer composition over inheritance.
- Write clear, maintainable, and well-documented code.

## Correct & Incorrect Examples

### CSS Variables
```tsx
// ✅ Correct: Uses design system variables
<div style={{ color: 'var(--color-primary)', background: 'var(--color-background)' }} />

// ❌ Incorrect: Hardcoded hex color values are forbidden
<div style={{ color: '#281559', background: '#F5F6FA' }} />
```

### Component Decomposition
```tsx
// ✅ Correct: Map logic is encapsulated in dedicated components
<MapViewer>
  <UserPositionIndicator />
  <MapOverlayLayer />
</MapViewer>

// ❌ Incorrect: All map logic and UI mixed in a large component
<App>
  {/* ...hundreds of lines of map logic here... */}
</App>
```

---
All new features and refactoring in the Campass project must reference this Skill.
