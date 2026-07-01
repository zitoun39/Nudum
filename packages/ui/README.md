# Nudum Design System Library (`@nudum/ui`)

This library forms the foundational user interface primitives and tokens for the Nudum platform.

## 1. Directory Structure

```text
packages/ui/
├── postcss.config.js       ← CSS plugins compiler
├── tailwind.config.js      ← Tailwind theme override
├── package.json            ← Storybook scripts & packages
├── src/
│   ├── index.ts            ← Exports all modules
│   ├── styles/
│   │   └── global.css      ← Global stylesheet and HSL base properties
│   ├── tokens/             ← Core variables (Spacing, Colors, Radius, Typography, Shadows)
│   │   ├── colors.ts
│   │   ├── spacing.ts
│   │   ├── radius.ts
│   │   ├── typography.ts
│   │   ├── shadows.ts
│   │   ├── motion.ts
│   │   ├── zindex.ts
│   │   └── breakpoints.ts
│   ├── themes/             ← Theme dictionaries (light, dark)
│   │   ├── light.ts
│   │   └── dark.ts
│   ├── components/         ← Layout Primitives
│   │   ├── Box.tsx
│   │   ├── Stack.tsx
│   │   ├── Flex.tsx
│   │   ├── Grid.tsx
│   │   ├── Spacer.tsx
│   │   ├── Separator.tsx
│   │   ├── AspectRatio.tsx
│   │   └── Center.tsx
│   ├── hooks/              ← Custom hooks
│   │   └── usePrefersReducedMotion.ts
│   └── icons/              ← Tree-shakeable icons
│       └── index.ts
```

---

## 2. Design Tokens Philosophy

Tokens are organized into:

- **Spacing scale**: Derived in multiples of 8px (xs = 4px, sm = 8px, md = 16px, lg = 24px, xl = 32px, 2xl = 48px, 3xl = 64px, 4xl = 96px).
- **Radius scale**: Declares rounded limits (`radius-sm` = 4px, `radius-md` = 6px, `radius-lg` = 8px).
- **Z-Index layers**: Isolates layout depths (sticky = 100, overlay = 1000, modal = 1400, toast = 1600).
- **Motion Durations & Easings**: Governs animations (fast = 150ms for micro-hovers, normal = 300ms for drawer collapses).

---

## 3. Dynamic Theme System

We use CSS Variables in HSL format inside [`packages/ui/src/styles/global.css`](file:///D:/Nudum/packages/ui/src/styles/global.css):

- Light Theme variables load inside `:root` and `[data-theme="light"]`.
- Dark Theme variables load inside `[data-theme="dark"]` and `.dark` blocks.

Tailwind is configured to read these variables directly:

```javascript
background: "hsl(var(--background))";
primary: "hsl(var(--primary))";
```

This enables dynamic runtime theme switches without reloading assets.

---

## 4. Accessibility Strategy

- **Reduced Motion**: We check system preferences using the `usePrefersReducedMotion` hook. Under reduced motion settings, transitions and animations are skipped or cross-faded.
- **Keyboard Navigation**: All interaction primitives specify focus outlines matching `ring-ring` and `focus-visible:ring-2` to ensure high contrast, keyboard-focusable visual feedback.
- **Contrast Requirements**: Palettes adhere to WCAG 2.1 AA parameters. Text-to-background contrast matches 4.5:1.
