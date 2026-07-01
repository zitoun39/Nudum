# Nudum — Design System Foundation Implementation Plan (Milestone 2)

This plan defines the engineering design and implementation steps for **Nudum's Design System Foundation** inside `packages/ui`.

The objective is to establish a token-driven, highly accessible (WCAG AA), theme-supportive layout and typography primitive system, complete with Storybook verification and design system documentation.

---

## User Review Required

> [!IMPORTANT]
> **Tailwind CSS Variable Integration Strategy**
> We are mapping all Tailwind theme values (colors, spacing, shadows, radius) to CSS variables defined in HSL format. This matches the standard `shadcn/ui` variable pattern, enabling runtime theme switches (Light/Dark) without rebuilding CSS assets or duplicating stylesheets.

> [!WARNING]
> **No Application-Level Features**
> This milestone implements ONLY visual tokens, layouts, icons, hooks, and basic primitives. No application forms, page layouts, database logic, or business assets will be introduced.

---

## Open Questions

> [!NOTE]
> **Design Density Configuration**
> For LIMS/QMS views (Jawdati) and plant operation dashboards (Mahattati), design density must be highly compact. We will build semantic height and padding tokens that support high-density variants via a dynamic property (`density="compact" | "cozy"`).

---

## Proposed Changes

---

### [Component Name] Shared UI Library Configuration (`packages/ui`)

#### [MODIFY] [packages/ui/package.json](file:///D:/Nudum/packages/ui/package.json)

- Add Storybook dependencies: `storybook`, `@storybook/react`, `@storybook/react-vite`, `@storybook/addon-essentials`, `@storybook/addon-a11y`, `@storybook/addon-interactions`, `@storybook/blocks`, `prop-types`.
- Add styling dependencies: `tailwindcss`, `autoprefixer`, `postcss`, `clsx`, `tailwind-merge`.
- Add icons dependency: `lucide-react`.
- Configure stories scripts: `"storybook": "storybook dev -p 6006"`, `"build-storybook": "storybook build"`.

#### [NEW] [packages/ui/tailwind.config.js](file:///D:/Nudum/packages/ui/tailwind.config.js)

Tailwind configurations mapping classes to dynamic CSS variable indices:

```javascript
const { spacing } = require("./src/tokens/spacing");
const { radius } = require("./src/tokens/radius");

module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        }
      },
      borderRadius: radius,
      spacing: spacing
    }
  },
  plugins: [require("tailwindcss-rtl")]
};
```

#### [NEW] [packages/ui/postcss.config.js](file:///D:/Nudum/packages/ui/postcss.config.js)

Standard CSS compilation pipeline.

---

### [Component Name] Design Tokens Definition

#### [NEW] [packages/ui/src/tokens/colors.ts](file:///D:/Nudum/packages/ui/src/tokens/colors.ts)

Audits and holds base HSL color palettes and theme structures (Primary, Secondary, Accent, Success, Warning, Info, Danger).

#### [NEW] [packages/ui/src/tokens/typography.ts](file:///D:/Nudum/packages/ui/src/tokens/typography.ts)

Declares font weights, tracking scales, and modular font size indices.

#### [NEW] [packages/ui/src/tokens/spacing.ts](file:///D:/Nudum/packages/ui/src/tokens/spacing.ts)

Establishes the base 8px responsive spacing grid constraints.

#### [NEW] [packages/ui/src/tokens/radius.ts](file:///D:/Nudum/packages/ui/src/tokens/radius.ts)

Declares radius mappings (`--radius-sm`, `--radius-md`, `--radius-lg`).

#### [NEW] [packages/ui/src/tokens/shadows.ts](file:///D:/Nudum/packages/ui/src/tokens/shadows.ts)

Defines enterprise shadow elevations.

#### [NEW] [packages/ui/src/tokens/motion.ts](file:///D:/Nudum/packages/ui/src/tokens/motion.ts)

Defines transition times (fast: 150ms, normal: 300ms) and standard ease variables (`cubic-bezier`).

#### [NEW] [packages/ui/src/tokens/zindex.ts](file:///D:/Nudum/packages/ui/src/tokens/zindex.ts)

Defines depth layer parameters (dropdown: 1000, modal: 2000, tooltip: 3000).

#### [NEW] [packages/ui/src/tokens/breakpoints.ts](file:///D:/Nudum/packages/ui/src/tokens/breakpoints.ts)

Contains responsive size thresholds.

---

### [Component Name] Theme Definition & Global Styles

#### [NEW] [packages/ui/src/styles/global.css](file:///D:/Nudum/packages/ui/src/styles/global.css)

Injects Tailwind base settings and maps CSS custom properties inside `:root`, `[data-theme="light"]`, and `[data-theme="dark"]` scopes.

#### [NEW] [packages/ui/src/themes/light.ts](file:///D:/Nudum/packages/ui/src/themes/light.ts)

Light theme variable dictionary mapping.

#### [NEW] [packages/ui/src/themes/dark.ts](file:///D:/Nudum/packages/ui/src/themes/dark.ts)

Dark theme variable dictionary mapping.

---

### [Component Name] Layout & Box Primitives

#### [NEW] [packages/ui/src/components/Box.tsx](file:///D:/Nudum/packages/ui/src/components/Box.tsx)

Core element wrapper handling padding, margin, width, and responsive flex sizing mappings.

#### [NEW] [packages/ui/src/components/Stack.tsx](file:///D:/Nudum/packages/ui/src/components/Stack.tsx)

Responsive flex-direction wrapper handling gap scale properties (`direction="row" | "column"`).

#### [NEW] [packages/ui/src/components/Grid.tsx](file:///D:/Nudum/packages/ui/src/components/Grid.tsx)

CSS Grid layout wrapper supporting dynamic templates (`columns={12}`).

#### [NEW] [packages/ui/src/components/Flex.tsx](file:///D:/Nudum/packages/ui/src/components/Flex.tsx)

Responsive flex containers with align and justify utility inputs.

#### [NEW] [packages/ui/src/components/Spacer.tsx](file:///D:/Nudum/packages/ui/src/components/Spacer.tsx)

Auto-filling structural spacer.

#### [NEW] [packages/ui/src/components/Separator.tsx](file:///D:/Nudum/packages/ui/src/components/Separator.tsx)

Horizontal or vertical divider matching RTL-safe boundary properties.

#### [NEW] [packages/ui/src/components/AspectRatio.tsx](file:///D:/Nudum/packages/ui/src/components/AspectRatio.tsx)

Forces images or map panels to stick to fixed ratios (16:9, 4:3).

#### [NEW] [packages/ui/src/components/Center.tsx](file:///D:/Nudum/packages/ui/src/components/Center.tsx)

Aligns children vertically and horizontally inside containers.

---

### [Component Name] Accessibility Hooks & Utilities

#### [NEW] [packages/ui/src/hooks/usePrefersReducedMotion.ts](file:///D:/Nudum/packages/ui/src/hooks/usePrefersReducedMotion.ts)

Enforces a11y guidelines by checking browser reduced motion queries.

---

### [Component Name] Tree-shakeable Icon System

#### [NEW] [packages/ui/src/icons/index.ts](file:///D:/Nudum/packages/ui/src/icons/index.ts)

Wraps Lucide-react and provides clear SVG interfaces to render tree-shakeable iconography.

---

### [Component Name] Storybook Configurations

#### [NEW] [packages/ui/.storybook/main.ts](file:///D:/Nudum/packages/ui/.storybook/main.ts)

Configures story loaders, vite bundler setup, and a11y addons.

#### [NEW] [packages/ui/.storybook/preview.ts](file:///D:/Nudum/packages/ui/.storybook/preview.ts)

Injects global styles and defines theme toggle parameters.

---

## Verification Plan

### Storybook Dev Server

- Verify components render cleanly in Storybook:
  ```bash
  pnpm --filter @nudum/ui storybook
  ```

### Build & Compilation Checks

- Verify packages build and export declarations cleanly:
  ```bash
  pnpm --filter @nudum/ui build
  ```
- Run typechecks and lints:
  ```bash
  pnpm run verify
  ```
