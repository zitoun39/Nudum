# Nudum Design System

> **Single Source of Truth for User Interface (UI), User Experience (UX), Visual Language, and Design Standards across the Nudum Platform.**
>
> **Status**: v1.0 — Filled Draft (supersedes the empty TOC skeleton)
> **Stack**: React + Vite · TypeScript · Tailwind CSS · shadcn/ui (Radix primitives)
> **Primary Language**: Arabic (RTL) · Full support: French, English (LTR)
> **Product Class**: Enterprise Modular SaaS (Water Utilities, LIMS/QMS, Enterprise Document Management)

---

# جدول المحتويات / Table of Contents

1. Introduction
2. Core Design Principles
3. Brand Identity
4. Color System
5. Typography
6. Spacing System
7. Layout System
8. Navigation
9. Component Library
10. Forms
11. Tables & Data Grids
12. Dashboards
13. Data Visualization
14. Icons & Illustrations
15. Motion & Animation
16. Accessibility
17. Localization
18. AI User Experience
19. Notifications
20. Design Tokens
21. Figma Guidelines
22. Frontend Implementation Rules
23. Design Review Checklist
24. Versioning
25. Changelog
26. Enterprise Page Patterns
27. Module Identity Guide
28. Screen Templates Library
29. Permission & Security UX Patterns
30. Error & Empty State Library
31. Component Anatomy Reference

---

## 1. Introduction

### 1.1 Purpose
This document is the single authoritative reference for every visual, interaction, and accessibility decision made across Nudum's three business modules (**Mahattati/محطتي**, **Jawdati/جودتي**, **Archivi/أرشيفي**) and the shared Core Platform. It exists so that design and engineering never re-derive the same decisions twice.

### 1.2 Scope
Covers web application UI (desktop-first, responsive down to tablet/mobile PWA), the design-token layer consumed by Tailwind, and the shadcn/ui component contracts. Does not cover marketing site design, which may follow a lighter-weight system.

### 1.3 Audience
Product designers, frontend engineers, QA (visual regression), and AI coding assistants (Claude, Copilot, Cursor) generating UI code in this repository.

### 1.4 Design Goals
- Operators in water-treatment control rooms can read critical status at a glance, including in low-light or high-glare environments.
- Lab technicians can enter dense tabular data (samples, chemical dosages) with minimal error and fast keyboard-only flows.
- Compliance/document reviewers can trust that destructive or approval actions are unambiguous.
- The system feels equally native in Arabic-RTL and French/English-LTR — never "translated," always **designed** for both directions.

### 1.5 Design Philosophy
**Clarity over decoration.** Enterprise operational software is judged on trust and speed, not visual flourish. Every color, animation, and shadow must justify itself against a functional purpose (status, hierarchy, feedback) — see `motion-meaning` and `color-not-decorative-only` in the review checklist.

---

## 2. Core Design Principles

| # | Principle | What it means in Nudum |
|---|---|---|
| 2.1 | **Simplicity** | Default to native HTML/shadcn primitives over custom widgets. One primary action per screen. |
| 2.2 | **Consistency** | One icon family (Lucide), one spacing scale (4/8px), one elevation scale across all 3 modules. |
| 2.3 | **Accessibility** | WCAG 2.1 AA is the floor, not the target, given the platform serves government/utility compliance contexts. |
| 2.4 | **Scalability** | Tokens and components must support new modules being added without redesign (module color slots are pre-reserved, see §4.5). |
| 2.5 | **Performance** | Data-table-heavy screens (LIMS samples, archive records) must stay responsive at 1,000+ rows via virtualization. |
| 2.6 | **Enterprise First** | Dense information layouts are acceptable and expected; optimize for power users doing repetitive tasks, not first-time delight. |
| 2.7 | **AI-First Experience** | AI (Nudum Copilot) is a visible, contained collaborator — never a silent background actor. Every AI-suggested action is previewable and reversible before commit (see §18.5).|

---

## 3. Brand Identity

### 3.1 Brand Personality
Precise, trustworthy, institutional, calm under pressure — closer to "control room software" than "consumer app." Confident but never flashy.

### 3.2 Tone
Direct and factual in UI copy. Avoid exclamation points, avoid cute empty-state jokes in operational modules (Mahattati/Jawdati). Archivi and onboarding flows may use a marginally warmer tone.

### 3.3 Visual Identity
- Geometric, slightly rounded sans-serif wordmark.
- Primary brand hue: **deep teal-blue** (water/trust association — see §4.1).
- Flat design with restrained elevation (no glassmorphism/neumorphism — those read as consumer-app and reduce data legibility).

### 3.4 Logo Usage
- Minimum clear space: 1× the height of the logomark on all sides.
- Minimum digital size: 24px height.
- Never recolor the logo outside the defined light/dark lockups; never place on a background with < 3:1 contrast against the logo's dominant color.

### 3.5 Branding Rules
- Module sub-brands (Mahattati/Jawdati/Archivi) each get an accent color (§4.5) but always inherit the same neutral, typography, and spacing system — sub-brand identity lives in accent color and icon only, never in a different type system or radius scale.

---

## 4. Color System

All colors are defined as **semantic tokens**, never raw hex in components (`color-semantic` rule). Values below are OKLCH-friendly HSL for Tailwind CSS variables.

### 4.1 Primary Colors
| Token | Light | Dark | Usage |
|---|---|---|---|
| `--primary` | `hsl(200 85% 32%)` (#0E6C93 teal-blue) | `hsl(200 70% 55%)` | Primary CTAs, active nav, links |
| `--primary-foreground` | `hsl(0 0% 100%)` | `hsl(210 20% 10%)` | Text/icons on primary |

### 4.2 Secondary Colors
| Token | Light | Dark | Usage |
|---|---|---|---|
| `--secondary` | `hsl(199 30% 94%)` | `hsl(210 15% 18%)` | Secondary buttons, subtle surfaces |
| `--secondary-foreground` | `hsl(200 60% 20%)` | `hsl(199 20% 90%)` | Text on secondary |
| `--accent` | `hsl(38 92% 50%)` (amber) | `hsl(38 85% 60%)` | Highlights, active filters, badges |

### 4.3 Neutral Palette
| Token | Light | Dark |
|---|---|---|
| `--background` | `hsl(0 0% 100%)` | `hsl(222 20% 9%)` |
| `--surface` | `hsl(210 20% 98%)` | `hsl(220 16% 13%)` |
| `--surface-elevated` | `hsl(0 0% 100%)` | `hsl(220 14% 16%)` |
| `--border` | `hsl(214 15% 88%)` | `hsl(216 12% 24%)` |
| `--muted-foreground` | `hsl(215 15% 40%)` | `hsl(215 12% 65%)` |
| `--foreground` | `hsl(222 30% 12%)` | `hsl(210 20% 95%)` |

### 4.4 Semantic Colors
| Token | Light | Dark | Contrast vs. background |
|---|---|---|---|
| `--success` | `hsl(142 60% 32%)` | `hsl(142 45% 55%)` | ≥ 4.5:1 |
| `--warning` | `hsl(38 92% 42%)` | `hsl(38 85% 60%)` | ≥ 4.5:1 (text always paired with icon, never color-only) |
| `--error` | `hsl(0 70% 42%)` | `hsl(0 65% 62%)` | ≥ 4.5:1 |
| `--info` | `hsl(210 80% 45%)` | `hsl(210 70% 62%)` | ≥ 4.5:1 |

All semantic colors ship with matching `-foreground`, `-surface` (10% tint background for alerts/badges), and `-border` variants.

### 4.5 Module Colors (accent-only, layered on top of the shared neutral/primary system)
| Module | Accent | Hex (light) | Association |
|---|---|---|---|
| Mahattati (محطتي) | Blue | `#1D6FA5` | Water operations |
| Jawdati (جودتي) | Green | `#2E8B57` | Quality/lab, pass states |
| Archivi (أرشيفي) | Amber/Gold | `#B8860B` (desaturated for AA) | Archive/documents |
| Core Platform | Primary teal-blue | `#0E6C93` | Shared shell, settings, admin |

Reserve **2 unused accent slots** (violet, slate-cyan) for future modules without redesigning the token structure.

### 4.6 Dark Mode
Dark mode uses desaturated, lighter tonal variants — never a simple inversion (`color-dark-mode` rule). Elevation in dark mode is communicated via lighter surface tone, not shadow (shadows are nearly invisible on dark backgrounds).

### 4.7 Light Mode
Light mode is the default for shared control-room displays (better readability on projected/shared screens). Body surfaces use `--surface` (off-white, `98%` lightness) rather than pure white to reduce glare fatigue during long shifts.

---

## 5. Typography

### 5.1 Font Families
| Role | Font | Fallback |
|---|---|---|
| Arabic UI | **IBM Plex Sans Arabic** or **Cairo** | `system-ui, "Segoe UI"` |
| Latin UI (FR/EN) | **Inter** | `system-ui, -apple-system` |
| Tabular/numeric data | **Inter** (tabular figures) or **IBM Plex Sans Arabic** numerals per locale | `monospace` fallback for codes/IDs |

Both families are selected for high x-height and clarity at small sizes in dense tables — a requirement given LIMS/archive data density. Load via `font-display: swap`, preload only the default-locale weight actually used above the fold.

### 5.2 Font Sizes (type scale, px / rem)
`12/0.75 · 14/0.875 · 16/1 (body base) · 18/1.125 · 20/1.25 · 24/1.5 · 30/1.875 · 36/2.25 · 48/3`

Body text never drops below **14px** in dense tables and never below **16px** in primary reading contexts (mobile forms) to avoid iOS auto-zoom.

### 5.3 Font Weights
`400 Regular` (body) · `500 Medium` (labels, table headers) · `600 Semibold` (card titles, section headers) · `700 Bold` (page titles only)

### 5.4 Line Heights
Body: `1.6` (slightly taller than the 1.5 default — improves Arabic diacritics/ligature legibility). Headings: `1.25`. Dense table cells: `1.4`.

### 5.5 Text Hierarchy
`Display (36–48px/700)` → `Page Title (30px/700)` → `Section Title (20px/600)` → `Card Title (16px/600)` → `Body (16px/400)` → `Secondary/Meta (14px/400, muted-foreground)` → `Caption/Label (12px/500, uppercase tracking for LTR only — avoid uppercase-tracking on Arabic, it breaks letter connection)`.

---

## 6. Spacing System

### 6.1 Base Unit
`4px` base unit, `8px` rhythm for most component spacing (Material-aligned, `spacing-scale` rule).

### 6.2 Margins
Section-level vertical rhythm: `16 / 24 / 32 / 48px` tiers depending on hierarchy depth.

### 6.3 Padding
Buttons: `8px 16px` (sm) · `10px 20px` (md, default) · `12px 24px` (lg). Cards: `16px` (compact/mobile) · `24px` (default desktop). Table cells: `12px 16px`.

### 6.4 Gap System
Flex/grid gaps follow the same 4px scale: `4 · 8 · 12 · 16 · 24 · 32px`. Form field groups use `16px` vertical gap; related inline controls use `8px`.

### 6.5 Border Radius
`--radius-sm: 6px` (badges, chips) · `--radius-md: 8px` (buttons, inputs, default) · `--radius-lg: 12px` (cards, modals) · `--radius-full: 9999px` (avatars, pills). Kept modest/institutional — avoid the very large (16px+) radii common in consumer apps.

---

## 7. Layout System

### 7.1 Grid
12-column grid on desktop, 4px gutter multiples (`24px` gutter default, `16px` on tablet, `12px` on mobile).

### 7.2 Containers
Max content width `1440px` for dashboards, `1120px` for forms/detail pages (keeps line length and form scanning reasonable per `container-width`).

### 7.3 Responsive Breakpoints
`sm 375px · md 768px · lg 1024px · xl 1440px` — matches Tailwind defaults, mobile-first (`mobile-first` rule).

### 7.4 Desktop Layout
Persistent left sidebar (RTL: right sidebar) + top bar + main content. Sidebar collapsible to icon-rail (64px) for power users on dense screens.

### 7.5 Tablet Layout
Sidebar becomes an overlay drawer triggered from the top bar; primary content goes full-width. Data tables switch to horizontal scroll with sticky first column (record identifier) rather than card-collapse, since tabular scanning matters more than card aesthetics for lab/ops users.

### 7.6 Mobile Layout
Bottom tab bar (≤5 items, `bottom-nav-limit`) for the primary module switcher; secondary navigation lives in a drawer. Tables collapse to stacked key-value cards with the record ID always visible.

---

## 8. Navigation

### 8.1 Sidebar
Structure: `Module switcher → Primary nav (icon + label, active state = accent bar + tinted background) → Settings/Admin pinned at bottom`. RTL-mirrored automatically (icons that imply direction, e.g. chevrons, must flip; icons that don't imply direction, e.g. a beaker or gauge, must not flip).

### 8.2 Top Navigation
Contains: breadcrumb/page title, global search, notification bell, AI Copilot trigger, user menu. Sticky, `56px` height desktop / `48px` mobile.

### 8.3 Breadcrumbs
Used for any hierarchy 3+ levels deep (`breadcrumb-web`), e.g. `Mahattati / Plant A / Unit 3 / Maintenance Log`. Truncate middle segments on narrow viewports, never the leaf.

### 8.4 Tabs
Used for switching views within the same record (e.g. Sample: Overview / Results / History / Attachments). Max 6 visible tabs before overflow menu.

### 8.5 Command Palette
`Ctrl/Cmd+K` global command palette for power users — search records, jump to module, trigger AI Copilot. Essential for the lab/ops audience who will use this daily and expect keyboard-first speed.

---

## 9. Component Library

Built on **shadcn/ui** (Radix primitives) — customize via Tailwind tokens only, do not fork component internals unless a genuine platform-specific need exists.

| Component | Key rules |
|---|---|
| 9.1 Buttons | Variants: `primary / secondary / outline / ghost / destructive / link`. Sizes: `sm 32px / md 40px / lg 48px` height. One primary button per view (`primary-action`). Destructive always red + confirmation dialog. |
| 9.2 Inputs | Height `40px` default, `44px` on touch/mobile. Persistent label above field (never placeholder-only, `input-helper-text`). |
| 9.3 Select | Native-feeling combobox (Radix Select), searchable when > 8 options. |
| 9.4 Checkbox | `20×20px` box, `44×44px` hit area via padding. |
| 9.5 Radio Button | Same hit-area rule as checkbox; always grouped with `fieldset`/`legend`. |
| 9.6 Switch | Used only for immediate-effect binary settings, never for form fields requiring "Save." |
| 9.7 Date Picker | Dual calendar support: Gregorian default, Hijri toggle available for AR locale (utility/government context in North Africa/MENA often requires this). |
| 9.8 Tables | See §11 in detail. |
| 9.9 Cards | `--radius-lg`, `1px` border + `--surface-elevated` background, no heavy shadow. |
| 9.10 Badges | Semantic-color-coded status pills, 12px text, always icon+text, never color-only. |
| 9.11 Alerts | Inline, dismissible where non-critical; icon + title + description, matches §4.4 semantic tokens. |
| 9.12 Dialogs | Max width `560px` (forms) or `720px` (data-heavy); always has explicit close + cancel (`escape-routes`). |
| 9.13 Drawers | Used for record quick-view and mobile nav; slide from the **inline-end** logical edge (right in LTR, left in RTL) — never hardcode `left`/`right`. |
| 9.14 Toasts | Bottom-center on mobile, bottom-inline-end on desktop; `aria-live="polite"`, auto-dismiss 5s except errors (manual dismiss). |
| 9.15 Tooltips | 200ms show delay, keyboard-focus triggers them too (`tooltip-keyboard`). |
| 9.16 Dropdowns | Radix DropdownMenu; keyboard arrow navigation required by default. |
| 9.17 Progress Indicators | Linear for determinate multi-step (wizards, uploads); circular spinner only for < 3s indeterminate waits. |
| 9.18 Empty States | Icon + one-line explanation + primary action ("No samples yet — Add your first sample"). No jokes in Mahattati/Jawdati. |
| 9.19 Loading States | Skeleton screens for anything > 300ms (`loading-states`); spinners reserved for button-level async actions. |
| 9.20 Skeletons | Match the exact shape/dimensions of the content they replace to avoid layout shift on resolve. |

---

## 10. Forms

### 10.1 Layout
Single-column for forms ≤ 8 fields (faster completion); two-column grid permitted for dense operational forms (e.g. lab sample intake) where related fields pair naturally (min/max ranges, date+time).

### 10.2 Validation
On-blur validation, not on-keystroke (`inline-validation`). Real-time only for password-strength and character-count fields.

### 10.3 Error Messages
State the cause and the fix, placed directly under the field (`error-clarity`, `error-recovery`): e.g. "Sample volume must be between 50–500 mL — enter a value in this range."

### 10.4 Help Text
Persistent helper text under complex/technical fields (chemical dosage units, tolerance ranges) — critical in a LIMS context where a placeholder disappearing on focus would hide required units.

### 10.5 Required Fields
Asterisk + `aria-required`, plus a legend at the top of long forms ("* Required field").

### 10.6 Wizards
Multi-step forms (plant onboarding, sample batch creation) show a numbered progress indicator, allow back navigation without data loss, and auto-save drafts (`form-autosave`) — lab work is frequently interrupted.

---

## 11. Tables & Data Grids

The single most-used surface in this product (LIMS samples, archive records, plant logs). Given priority.

### 11.1 Table Layout
Sticky header row, sticky first column (record ID) on horizontal scroll, zebra striping optional (off by default, available as a density-mode toggle), row height `44px` (comfortable) / `36px` (compact — for power users).

### 11.2 Sorting
Click column header to sort, `aria-sort` announced (`sortable-table`), multi-column sort via shift-click for advanced filtering scenarios (lab data).

### 11.3 Filtering
Column-level filter icons + a global filter/search bar above the table; active filters shown as removable chips.

### 11.4 Pagination
Server-side pagination above 100 rows; default page size 25/50/100 selectable. Virtualize instead of paginate for continuous-scroll views like activity/audit logs (`virtualize-lists`).

### 11.5 Bulk Actions
Checkbox column enables a contextual action bar (approve, export, archive) that appears above the table only when ≥1 row selected; bulk destructive actions always require a confirmation dialog listing the affected count.

### 11.6 Export
CSV/Excel export always available for data tables (`export-option`), respecting current filters/sort, with a clear indicator of how many rows will be exported.

---

## 12. Dashboards

### 12.1 KPI Cards
Big number + trend delta (↑/↓ with color **and** icon, never color alone) + sparkline. Consistent card height in a row.

### 12.2 Widgets
User-configurable widget grid on the Core Platform home dashboard; module dashboards (Mahattati/Jawdati/Archivi) ship fixed, curated layouts by default — operational users should not need to configure their control-room view.

### 12.3 Charts
See §13.

### 12.4 Activity Feed
Chronological, grouped by day, each entry shows actor + action + timestamp + entity link; supports `aria-live` for near-real-time operational feeds.

### 12.5 Quick Actions
Max 4 quick-action buttons per dashboard, placed top-right of the relevant section, never buried in a menu for the most common daily task (e.g. "New Sample," "New Maintenance Log").

---

## 13. Data Visualization

### 13.1 Charts
Line for trends (plant readings over time), bar for comparisons (samples per plant), donut only for ≤5 categories (`no-pie-overuse`). Colorblind-safe palettes with pattern/texture fallback for critical pass/fail distinctions (`pattern-texture`).

### 13.2 Maps
Used for plant/site geolocation views (Mahattati). Cluster markers at low zoom; status color-coded pins with icon (not color-only) for operational state.

### 13.3 Timelines
Vertical timeline for record history/audit trail (sample lifecycle, document approval chain) — critical for compliance traceability.

### 13.4 Heatmaps
Used for equipment/plant health matrices (rows = assets, columns = time) — must ship an accessible data-table alternative (`data-table` rule).

### 13.5 Status Indicators
A single shared status-token vocabulary across all modules: `Draft / Pending / In Progress / Passed / Failed / Approved / Rejected / Archived` — each with a fixed color+icon pairing reused everywhere so users don't relearn status meaning per module.

---

## 14. Icons & Illustrations

### 14.1 Icon Library
**Lucide** icons exclusively (`no-emoji-icons`, `icon-style-consistent`). No emoji anywhere in structural UI.

### 14.2 Usage Rules
Consistent `20px` (inline/table) and `24px` (nav/buttons) sizing, `1.5px` stroke weight throughout. Icons with implied direction (arrows, chevrons) auto-flip in RTL via CSS logical properties or an explicit `mirror-in-rtl` utility; icons without directional meaning (beaker, droplet, folder) never flip.

### 14.3 Illustrations
Minimal, geometric, on-brand accent-colored line illustrations reserved for onboarding and empty states — never decorative full-color illustrations that compete with operational data.

### 14.4 Empty State Graphics
Single small icon (48–64px), not a large illustration, to keep operational screens dense and serious.

---

## 15. Motion & Animation

### 15.1 Principles
Motion must express cause-and-effect, never decoration (`motion-meaning`). Given the operational audience, err toward **less** motion than a consumer product.

### 15.2 Page Transitions
Subtle fade/slide, `200ms`, `ease-out`. Disabled entirely under `prefers-reduced-motion`.

### 15.3 Component Animation
Micro-interactions `150–250ms`; dialogs/drawers `250ms` with `ease-out` enter / `ease-in` exit; animate `transform`/`opacity` only (`transform-performance`), never `width`/`height`.

### 15.4 Loading Animation
Skeleton shimmer for content loads; determinate progress bars for uploads/imports with real percentage, not a fake indeterminate bar.

---

## 16. Accessibility

### 16.1 WCAG Compliance
Target **WCAG 2.1 AA** across the platform; AAA for critical safety/compliance indicators (pass/fail lab results, alarm states).

### 16.2 Keyboard Navigation
Every action reachable by keyboard alone, logical tab order matching visual/reading order (mirrored correctly in RTL), documented shortcut list in Command Palette (§8.5).

### 16.3 Focus Management
Visible focus ring (`2px`, `--primary`, `2px` offset) on all interactive elements — never removed. Focus moves to the first invalid field after a failed submit (`focus-management`), and to the dialog title when a modal opens.

### 16.4 Screen Readers
`aria-live="polite"` for toasts/status updates; `aria-live="assertive"` reserved for critical alarms only; full label coverage for icon-only buttons (`aria-labels`).

### 16.5 Contrast
Minimum `4.5:1` body text, `3:1` large text/UI glyphs, verified for **every** semantic color pair in both light and dark mode and both AR and Latin type (Arabic script can appear lighter at the same hex value — verify separately).

### 16.6 Reduced Motion
`prefers-reduced-motion` disables all non-essential transitions; loading feedback switches to a static state-change instead of a spinner where feasible.

---

## 17. Localization

### 17.1 RTL Support
Arabic is the **default and primary** direction — the system is designed RTL-first, then mirrored for LTR, not the reverse. Use CSS logical properties (`margin-inline-start`, `padding-inline-end`) exclusively; no hardcoded `left`/`right` in component styles.

### 17.2 LTR Support
French and English render fully mirrored layouts (sidebar right→left position swap, icon direction flips per §14.2, chart axis direction, table sort-arrow orientation).

### 17.3 Arabic Rules
- Numerals: Western Arabic numerals (0–9) by default for data/compliance consistency, with an optional Eastern Arabic numeral toggle for user-facing display.
- No letter-spacing/tracking applied to Arabic text (breaks ligatures/connections).
- Line-height increased to `1.6+` for Arabic to accommodate diacritics.
- Mixed-direction strings (Arabic sentence containing a Latin product code, e.g. `عينة رقم SMP-2024-001`) use Unicode bidi isolation (`unicode-bidi: isolate`) to prevent number/code corruption.

### 17.4 English Rules
Standard LTR typographic rules per §5; French follows the same LTR rules with French-specific punctuation spacing (non-breaking space before `:`, `;`, `!`, `?`).

### 17.5 Date & Number Formats
Locale-aware formatting via `Intl.DateTimeFormat`/`Intl.NumberFormat` — never manual string concatenation. Gregorian default across locales; Hijri calendar available as a secondary display option (§9.7). Decimal separators follow locale (`,` for FR/AR contexts common in the region, `.` for EN) — always driven by the `Intl` API, never hardcoded.

---

## 18. AI User Experience

### 18.1 AI Assistant
"Nudum Copilot" is accessed via a persistent trigger in the top bar (§8.2) and Command Palette — opens as a side panel, never a full-screen takeover, so users keep operational context visible.

### 18.2 AI Panels
Fixed-width side panel (`400px` desktop, full-width drawer on mobile), visually distinct with a subtle accent-tinted background so AI-generated content is never confused with system-of-record data.

### 18.3 AI Suggestions
Presented as clearly-labeled cards ("Copilot suggests...") with a confidence/source indicator where applicable (e.g. "based on 12 similar samples"); never auto-applied.

### 18.4 AI Actions
Any AI action that would modify data requires an explicit **Preview → Confirm** step (`undo-support`/`sheet-dismiss-confirm` pattern); a visible diff or summary is shown before commit. All AI actions are logged to the audit trail like any human action.

### 18.5 AI Safety
AI never has silent write access. Destructive or compliance-sensitive actions (approving a lab result, deleting archive records) are **never** available as one-click AI actions, even with confirmation — those remain human-only actions that AI can, at most, draft or recommend.

---

## 19. Notifications

| Type | Color token | Icon | Behavior |
|---|---|---|---|
| 19.1 Success | `--success` | check-circle | Toast, auto-dismiss 5s |
| 19.2 Warning | `--warning` | alert-triangle | Toast or inline banner, auto-dismiss 8s or persistent if action required |
| 19.3 Error | `--error` | x-circle | Toast, manual dismiss only |
| 19.4 Information | `--info` | info | Toast, auto-dismiss 5s |
| 19.5 System Notifications | `--info` / `--warning` | bell | Bell-icon inbox (§8.2), persistent until read, grouped by date |

All toast types respect `toast-accessibility` (no focus stealing, `aria-live="polite"` except errors which may use `assertive`).

---

## 20. Design Tokens

Canonical token set (Tailwind CSS variables, `:root` + `.dark` overrides). This is the implementation source of truth for §4–§6 above.

```css
:root {
  /* Colors — see §4 for full light/dark table */
  --primary: 200 85% 32%;
  --primary-foreground: 0 0% 100%;
  --secondary: 199 30% 94%;
  --accent: 38 92% 50%;
  --background: 0 0% 100%;
  --surface: 210 20% 98%;
  --surface-elevated: 0 0% 100%;
  --border: 214 15% 88%;
  --foreground: 222 30% 12%;
  --muted-foreground: 215 15% 40%;
  --success: 142 60% 32%;
  --warning: 38 92% 42%;
  --error: 0 70% 42%;
  --info: 210 80% 45%;

  /* Typography */
  --font-ar: "IBM Plex Sans Arabic", "Cairo", system-ui;
  --font-latin: "Inter", system-ui;
  --text-base: 1rem;
  --leading-body: 1.6;

  /* Spacing */
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-6: 24px; --space-8: 32px; --space-12: 48px;

  /* Radius */
  --radius-sm: 6px; --radius-md: 8px; --radius-lg: 12px; --radius-full: 9999px;

  /* Shadows — restrained, institutional */
  --shadow-sm: 0 1px 2px hsl(222 30% 12% / 0.06);
  --shadow-md: 0 2px 8px hsl(222 30% 12% / 0.08);
  --shadow-lg: 0 8px 24px hsl(222 30% 12% / 0.12);

  /* Animation */
  --duration-fast: 150ms; --duration-base: 200ms; --duration-slow: 300ms;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in: cubic-bezier(0.7, 0, 0.84, 0);
}
```

### 20.1–20.6
Colors, Typography, Spacing, Radius, Shadows, and Animation tokens above are the **only** values allowed in component code — raw hex/px values in `.tsx`/`.css` fail design review (§23).

---

## 21. Figma Guidelines

### 21.1 File Structure
One master file per module (`Core Platform`, `Mahattati`, `Jawdati`, `Archivi`) plus one shared `Design System` library file that all module files consume as a linked library — never duplicate components locally.

### 21.2 Components
Every shadcn/ui component in code has a 1:1 named Figma component; variants (size, state) built as Figma component properties, not separate layers.

### 21.3 Auto Layout
100% Auto Layout for all components — no absolute positioning, so redlines/spacing match the 4/8px token scale automatically.

### 21.4 Variables
Figma Variables bound directly to the token names in §20 (e.g. Figma variable `color/primary` ↔ CSS `--primary`), with a light/dark mode pair per variable so designers toggle the same mode switch engineers use.

### 21.5 Naming Convention
`module/component/variant/state`, e.g. `jawdati/badge/status-passed/default`. Layers named in English regardless of content language to keep the file navigable for all contributors.

---

## 22. Frontend Implementation Rules

### 22.1 React
Functional components + hooks only. Co-locate component, styles (Tailwind classes), and tests. No inline styles except for truly dynamic runtime values (e.g. chart-computed positions).

### 22.2 Tailwind CSS
Use only tokens defined in §20 via the Tailwind theme config — no arbitrary value classes (`w-[173px]`) for anything covered by the spacing/color scale. `dir="rtl"`/`dir="ltr"` set at the document root; all spacing/position utilities use logical variants (`ps-4`, `me-2`) instead of `pl-4`/`mr-2`.

### 22.3 shadcn/ui
Install components via the CLI into `components/ui`, then theme via CSS variables only — avoid editing internal Radix behavior. Any deviation from default shadcn behavior must be documented inline with a comment explaining the platform-specific reason.

### 22.4 Radix UI
Rely on Radix's built-in accessibility (focus trap, `aria-*`, keyboard nav) rather than re-implementing — this is the primary reason shadcn/Radix was chosen over building custom primitives.

### 22.5 Responsive Rules
Mobile-first Tailwind breakpoints (`sm/md/lg/xl` per §7.3); test every screen at `375 / 768 / 1024 / 1440` before merge.

### 22.6 Performance Rules
Route-level code splitting per module (Mahattati/Jawdati/Archivi bundles load independently); virtualize any list/table over 50 rows (`virtualize-lists`); images via `loading="lazy"` below the fold.

---

## 23. Design Review Checklist

Before merging any UI code, verify:

**Visual**
- [ ] No raw hex/px values — tokens only (§20)
- [ ] No emoji as structural icons — Lucide only (§14.1)
- [ ] Consistent elevation scale used (§20 shadows)

**Interaction & Accessibility**
- [ ] Touch targets ≥ 44×44px, 8px+ spacing between targets
- [ ] Visible focus ring on every interactive element
- [ ] Color contrast ≥ 4.5:1 (body) / 3:1 (large/UI) verified in **both** themes and **both** AR/Latin type
- [ ] No color-only meaning — icon or text always paired
- [ ] Keyboard-only walkthrough completed

**Localization**
- [ ] Verified in Arabic RTL **and** English/French LTR
- [ ] No hardcoded `left`/`right`, `ml-`/`mr-` — logical properties only
- [ ] Directional icons flip correctly; non-directional icons do not

**Layout**
- [ ] No horizontal scroll on mobile (outside intentional tables)
- [ ] Tested at 375 / 768 / 1024 / 1440px
- [ ] Loading states use skeletons matching final content shape

**Forms & Data**
- [ ] Errors state cause + fix, anchored near field
- [ ] Destructive actions confirmed + visually separated
- [ ] Tables: sortable, filterable, exportable, virtualized if 50+ rows

---

## 24. Versioning

Semantic versioning for the design system itself (`MAJOR.MINOR.PATCH`), independent of the product's own release versioning:
- **MAJOR** — breaking token renames/removals requiring component migration.
- **MINOR** — new components, new tokens, backward-compatible additions.
- **PATCH** — value tweaks (contrast fixes, spacing corrections) with no API change.

Current version: **1.0.0** (first filled version of this document, dated 2026-07-01).

---

## 25. Changelog

| 1.0.0 | 2026-07-01 | Filled the previously empty TOC skeleton with full token values, component rules, and RTL/AR-first localization guidance, aligned to the confirmed stack (React + Vite + Tailwind + shadcn/ui) and business context (Mahattati/Jawdati/Archivi). |
| 0.1.0 | — | Initial table-of-contents skeleton (25 sections, no content). |

---

## 26. Enterprise Page Patterns

### 26.1 Dashboard Pattern
- **Purpose**: High-level telemetry, LIMS throughput metrics, and open document actions at a glance.
- **Page Hierarchy**: Topbar breadcrumbs ➔ Page Title + Quick Action Toolbar ➔ KPI Row ➔ Primary Widgets (grid-cols-8) ➔ Secondary Widgets + Activity Feed (grid-cols-4).
- **Grid Structure**: CSS Grid. 12-column system. Desktop: 8+4 split. Mobile/Tablet: Single-column stack.
- **Header**: Contains page name (e.g., "Operational Dashboard"), system-status badge, last-updated timestamp with dynamic reload button.
- **Filters**: Module-specific select dropdowns (e.g., "Select Plant," "Timeframe: Last 24 Hours"). Pinned horizontally below the header.
- **Toolbar**: Contains refresh, export PDF, and configure widgets buttons.
- **Tables**: Small, embedded list tables (max 5 rows) for "Pending Tasks" or "Recent Anomalies." Row height: `36px` (compact).
- **Cards**: Flat white containers with `--border` border, 8px padding, containing widgets.
- **KPIs**: 4 cards per row. Large numeral (32px), label (12px, muted), trend indicators (12px, red/green with Lucide arrow icon).
- **Actions**: Widget-level overflow actions (refresh, expand, delete).
- **Empty State**: Small Lucide icon, "No data available for this range," reset filters link.
- **Mobile Behaviour**: KPI cards become a swipeable horizontal carousel. Widget grid collapses to 1 column.
- **Responsive Rules**: Breakpoints: `@media (max-width: 1024px)` collapses sidebar; grids snap to single-column at `768px`.
- **Accessibility**: Cards must have semantic heading levels (`h3`). Charts must include `aria-label` description of values.
- **ASCII Wireframe**:
```text
+-------------------------------------------------------+
| Home / Dashboard                                      |
| Operational Control Summary             [Refresh] [+][|
+-------------------------------------------------------+
| [KPI 1: 94.2%]  [KPI 2: 12 PPM]  [KPI 3: 4 Warnings]  |
+-------------------------------------------------------+
| [   Main Telemetry Chart (Line)   ] | [Activity Feed] |
|                                     | - Pump 2 active |
|                                     | - Alarm cleared |
+-------------------------------------------------------+
```

### 26.2 CRUD Pattern
- **Purpose**: Creating, reading, updating, and deleting master data entities (e.g., Equipment, Users, Procedures).
- **Page Hierarchy**: Entity Header ➔ Filter bar + Actions ➔ Main Data Table ➔ Interactive Drawer (Details/Create/Edit).
- **Grid Structure**: 12-column grid. Table takes full width. Detail/Form slide-in takes 400px inline-end space.
- **Header**: Breadcrumbs (e.g. `Mahattati / Equipment`), Entity Title, Total count badge, Primary Action button (e.g., "Add Equipment").
- **Filters**: Text search input (left), status multi-select combobox, date range picker. Active filters shown as removable chips.
- **Toolbar**: Inline action triggers (Export CSV, Bulk Edit, Delete Selected).
- **Tables**: Full-width data table, sticky header. Checkbox column on the far left. Row height: `44px`.
- **Actions**: Inline hover buttons on row (`Edit`, `Delete`, `Duplicate`) and bulk action bar on select.
- **Empty State**: Compass/List Lucide icon, "No Equipment registered yet," primary action button centered.
- **Mobile Behaviour**: Filter bar collapses into a slide-up bottom sheet filter panel. Row actions collapse into a trailing dropdown trigger.
- **Accessibility**: Tables must use `caption` or `aria-label`. Checked rows must announce checked state (`aria-checked`).

### 26.3 Analytics Pattern
- **Purpose**: Detailed data drill-downs, compliance charts, and sensor telemetry analysis.
- **Page Hierarchy**: Analysis Header ➔ Filter Block ➔ Main Visualization Grid (grid-cols-12) ➔ Data Table View.
- **Grid Structure**: Flexible grid. Chart cards occupy 6 columns on desktop, 12 columns on tablet.
- **Header**: Analytics scope title, metric selector, download export options.
- **Filters**: Multi-select filter panel at the top. Allows selection of multiple parameters, date ranges, aggregation granularity (hourly/daily).
- **Toolbar**: Zoom, pan, reset zoom buttons on charts.
- **Cards**: Contain charts (Line, Bar, Scatter) with custom chart legends.
- **Actions**: Compare toggle, Export Raw Data.
- **Mobile Behaviour**: Charts scale to screen width. Horizontal scroll enabled for dense data tables.
- **Accessibility**: High-contrast chart colors (§4.4). Chart data points must be keyboard navigable. Provide alternative tabular data view link (`data-table` rule).

### 26.4 Management Pattern
- **Purpose**: Governing large collections of items requiring workflow decisions (e.g. Lab Sample approval lists).
- **Page Hierarchy**: Workflow stage tabs ➔ Grouped filter panel ➔ Grouped Card grid or Kanban deck ➔ Bottom Action Bar.
- **Grid Structure**: Kanban columns (3 columns on desktop) or list view.
- **Header**: Workflow Name, total items requiring action indicator.
- **Filters**: Assignee select, Priority level, SLA warning filters.
- **Toolbar**: Sort by SLA, switch between Kanban and List view.
- **Cards**: Workflow card showing status badge, deadline, assignee avatar, SLA progress bar.
- **Actions**: Drag-and-drop triggers, right-click context menu, bulk approve button.
- **Mobile Behaviour**: Columns become tabs; cards are full width.
- **Accessibility**: Keyboard drag-and-drop support (using arrow keys to move items between columns with live status announcement).

### 26.5 Settings Pattern
- **Purpose**: System-wide configuration, billing management, and tenant organization profile setup.
- **Page Hierarchy**: Page title ➔ Split view: Left vertical nav (3 columns) | Right settings form (9 columns) ➔ Sticky footer actions.
- **Grid Structure**: 3-9 split desktop, single column mobile settings nav.
- **Header**: "Settings", active scope indicator (e.g., "Organization Settings").
- **Filters**: None.
- **Toolbar**: Save status banner.
- **Forms**: Grouped in sections with dividers, text labels, helper text, and placeholders.
- **Actions**: Cancel (outline button) and Save Changes (primary button).
- **Empty State**: N/A.
- **Mobile Behaviour**: Navigation switches to a dropdown menu.
- **Accessibility**: Settings fields must use explicit `aria-describedby` links pointing to validation/helper text blocks.

### 26.6 Wizard Pattern
- **Purpose**: Step-by-step sequential flows (e.g., Batch sample registration, document upload workflow).
- **Page Hierarchy**: Wizard title ➔ Stepper Progress Indicator ➔ Center Form Container (max-w-xl) ➔ Navigation Footer.
- **Grid Structure**: Single column, centered layout.
- **Header**: Step title, total steps tracker (e.g., "Step 2 of 4: Parameter Specifications").
- **Stepper**: Horizontal path. Active step is highlighted in primary blue with a ripple dot. Past steps show check icon.
- **Forms**: Field validation is run inline on clicking "Next."
- **Actions**: [Back] (outline) on the left, [Next] / [Submit] (primary) on the right.
- **Mobile Behaviour**: Stepper becomes a progress bar: `Progress: 50%`.
- **Accessibility**: Wizard controls must support keyboard escape (to exit without save) and auto-save current step state.

### 26.7 Search Pattern
- **Purpose**: Deep text queries, OCR indexing, and document retrieval.
- **Page Hierarchy**: Query input box ➔ Split view: Left search filters (3 columns) | Right search results list (9 columns) ➔ Pagination.
- **Grid Structure**: 3-9 split desktop.
- **Header**: Query term title, result count, sorting selector (relevance vs date).
- **Filters**: Category facets (file type, author, date range, plant location) on the left.
- **Toolbar**: Clear all filters button.
- **Actions**: Click result to open in details drawer/viewer.
- **Empty State**: Search icon, "No results found for 'xyz' - check spelling or try other filters."
- **Mobile Behaviour**: Filters hidden inside a filter drawer button.
- **Accessibility**: Results list must use standard list tag structure (`ul`/`li`). Match words highlighted in bold must use `mark` tag.

### 26.8 AI Workspace Pattern
- **Purpose**: Chat-based assistance, regulatory reference lookups, and troubleshooting.
- **Page Hierarchy**: Side-by-side split layout: Left active record view (7 columns) | Right AI Copilot drawer (5 columns).
- **Grid Structure**: 7-5 split desktop. Splitter drag handle permitted.
- **Header**: Active record details title (left) | AI assistant title + clear chat button (right).
- **Filters**: Quick-prompts toggle buttons.
- **AI Panels**: Chat stream displaying user queries and AI responses with source citations.
- **Actions**: [Explain Data] button, [Apply Recommendation] button.
- **Mobile Behaviour**: Left view collapses. Copilot is accessed via a bottom sheet drawer.
- **Accessibility**: Chat stream must use `aria-live="polite"` for new streaming text. Focus must remain on the chat input box.

### 26.9 Reports Pattern
- **Purpose**: Scheduling and downloading PDF compliance reports.
- **Page Hierarchy**: Page title ➔ Filter bar ➔ Document grid list (grid-cols-4) ➔ Pinned actions.
- **Grid Structure**: 4-column card grid.
- **Header**: "Compliance Reports", generation scheduler modal button.
- **Filters**: Year selector, Month selector, Status filter (generated, generating, failed).
- **Cards**: Show report preview thumbnail, file size, status, download link.
- **Actions**: Download PDF, Email Report, Regenerate.
- **Mobile Behaviour**: Card grid collapses to list rows.
- **Accessibility**: Report thumbnail must have blank `alt` text or descriptive filename alt description.

### 26.10 Administration Pattern
- **Purpose**: System admin tools, user provisioning, database schema logs, tenant billing lifecycle.
- **Page Hierarchy**: Administration shell ➔ Left admin nav ➔ Status panels + Data grids.
- **Grid Structure**: Flex side nav + Grid panel.
- **Header**: "System Administration" + Admin role badge.
- **Filters**: Active/Inactive toggle, search input.
- **Actions**: Add User, Impersonate Tenant (requires MFA & audit confirmation), Block Schema.
- **Mobile Behaviour**: Admin views are restricted to desktop viewports for security and table density.
- **Accessibility**: Explicit warning screens when performing admin bypasses.

---

## 27. Module Identity Guide

### 27.1 Core Platform
- **Mission**: Orchestrate organizations, identity, workflows, search index, and central platform configurations.
- **Personality**: Neutral, stable, administrative, institutional, structural.
- **Primary Color**: Deep teal-blue (`#0E6C93`).
- **Secondary Colors**: Slate gray (`hsl(215 15% 40%)`), off-white surface (`hsl(210 20% 98%)`).
- **Visual Density**: Standard (44px heights).
- **Preferred Layouts**: 3-9 Split Settings, Command Palette.
- **Typography Emphasis**: Regular sans-serif, standard weights.
- **Icon Style**: Structural, outline (key, folder, cog, user, shield).
- **Dashboard Behaviour**: High-level widget grid containing system status metrics.
- **Card Styles**: Subtle borders, no background fills.
- **Table Behaviour**: Simple user tables, audit log logs.
- **User Expectations**: Reliability, security, administrative ease.
- **UX Principles**: Clear error messages, explicit permissions.

### 27.2 Mahattati (محطتي) — Operations Management
- **Mission**: Monitor treatment plant parameters, telemetry, and maintain physical assets.
- **Personality**: Alert, physical, industrial, industrial control room style.
- **Primary Color**: Blue (`#1D6FA5`).
- **Secondary Colors**: Alarm red, warning amber, process green.
- **Visual Density**: High (36px heights for telemetry grids).
- **Preferred Layouts**: Telemetry grid dashboard, split-view assets list.
- **Typography Emphasis**: Bold labels, tabular numerals for gauge levels.
- **Icon Style**: Mechanical, operational (activity, gauge, droplet, wrench, database).
- **Dashboard Behaviour**: Real-time charts, map markers, alert indicator row.
- **Card Styles**: Solid status indicators, dark backgrounds for telemetry logs.
- **Table Behaviour**: Live scroll, high-density sensor lists.
- **User Expectations**: Fast updates, persistent alerts, low-glare reading.
- **UX Principles**: Never hide active warnings; keep important controls within 1 click.

### 27.3 Jawdati (جودتي) — Laboratory & Quality Management
- **Mission**: Manage laboratory workflows, chemical test entries, and validate sample compliance.
- **Personality**: Scientific, precise, clinical, clean, tabular-oriented.
- **Primary Color**: Green (`#2E8B57`).
- **Secondary Colors**: Calibration orange, compliance status markers.
- **Visual Density**: Extreme (dense grid fields, custom table cell components).
- **Preferred Layouts**: Dual column input grids, nested analysis tables.
- **Typography Emphasis**: Semi-bold weights, precise decimals.
- **Icon Style**: Laboratory-themed (beaker, flask, test-tube, clipboard, award).
- **Dashboard Behaviour**: Sample backlog counters, compliance trend lines.
- **Card Styles**: Compact detail headers.
- **Table Behaviour**: Keyboard-navigable cell editing, multi-column sorting.
- **User Expectations**: Speed, numerical precision, easy calculation lookups.
- **UX Principles**: Zero-compromise numerical validations; alert immediately when values fall out of bounds.

### 27.4 Archivi (أرشيفي) — Enterprise Document Management
- **Mission**: Archive, search, and route enterprise files and official correspondence.
- **Personality**: Orderly, classical, clean, document-centric.
- **Primary Color**: Amber/Gold (`#B8860B`).
- **Secondary Colors**: Tan, warm background tints.
- **Visual Density**: Comfortable (standard height rows, document thumbnails).
- **Preferred Layouts**: Document workspace split grid, search-with-facets layout.
- **Typography Emphasis**: Medium weights, clear line lengths for reading.
- **Icon Style**: Text, document, drawer, search, tag.
- **Dashboard Behaviour**: Recent document list, workflow tasks list.
- **Card Styles**: Document card layouts containing page previews.
- **Table Behaviour**: Column filters, metadata previews.
- **User Expectations**: Accurate OCR search, clear version indicators.
- **UX Principles**: Clickable citations, explicit audit logs.

### 27.5 Nudum Copilot
- **Mission**: Assist operations and laboratory teams with contextual AI suggestions.
- **Personality**: Collaborative, intelligent, contained, supportive.
- **Primary Color**: Cyan-Teal (`hsl(190 90% 40%)`).
- **Secondary Colors**: Soft violet accents.
- **Visual Density**: Standard, text-focused.
- **Preferred Layouts**: Contextual right-hand sidebar panel.
- **Typography Emphasis**: Distinct styling for system-generated text.
- **Icon Style**: AI, sparkles, chat, help.
- **Dashboard Behaviour**: Floating panels.
- **Card Styles**: Tinted backgrounds with prominent source-citation links.
- **Table Behaviour**: Hover actions to query rows.
- **User Expectations**: Actionable advice, no hallucinations.
- **UX Principles**: Clear separation between AI and system-of-record states; human-first write control.

### 27.6 Visual Cohesion and Differentiation
- **Cohesion**: All modules share the same typography (IBM Plex Sans Arabic / Inter), layout grid (12 columns), spacing scale (4/8px multiples), border radii (`--radius-md: 8px`), and base components (buttons, dropdowns, inputs).
- **Differentiation**: Modules are visually differentiated by their signature accent color (§4.5), distinct module icons in the sidebar header, and layout visual density (High density for Mahattati/Jawdati vs. comfortable layouts for Archivi/Settings).

---

## 28. Screen Templates Library

### 28.1 Dashboard Template
- **Purpose**: Default home screen for operational modules.
- **ASCII Wireframe**:
```text
+-------------------------------------------------------+
| [Module Icon] Active Module Name     [User Menu Avatar]|
+-------------------------------------------------------+
| [ KPI Card 1 ] [ KPI Card 2 ] [ KPI Card 3 ]          |
+-------------------------------------------------------+
| +-------------------------+ +-----------------------+ |
| | Chart: Activity Line    | | List: Action Items    | |
| |                         | | - Item A   [View]     | |
| |                         | | - Item B   [View]     | |
| +-------------------------+ +-----------------------+ |
+-------------------------------------------------------+
```
- **Component Hierarchy**: `ModuleShell ➔ DashboardHeader ➔ KPIRow ➔ WidgetGrid ➔ WidgetCard (Chart / Table)`.
- **Spacing**: Main padding: `24px`. Gap between widgets: `24px`. KPI card inner padding: `16px`.
- **Grid**: Dashboard body: `grid grid-cols-12 gap-6`.
- **Responsive Behaviour**: Collapses to single-column card layouts below `1024px`.
- **States**: Loading displays skeleton cards. Empty shows empty state card.

### 28.2 List View Template
- **Purpose**: Display search results, logs, and master records in dense tables.
- **ASCII Wireframe**:
```text
+-------------------------------------------------------+
| Breadcrumbs / Page Title                [New Record]  |
+-------------------------------------------------------+
| [Search Input] [Filter A] [Filter B]      [Export CSV] |
+-------------------------------------------------------+
| [ ] Name       | Status    | Value      | Actions     |
| [ ] Record 001 | [ Passed ]| 4.2 PPM    | [Edit][...] |
| [ ] Record 002 | [ Failed ]| 12.0 PPM   | [Edit][...] |
+-------------------------------------------------------+
| Showing 1-2 of 50                         [<] Page 1 [>]|
+-------------------------------------------------------+
```
- **Component Hierarchy**: `PageHeader ➔ FilterToolbar ➔ DataTable ➔ PaginationControl`.
- **Spacing**: Table outer container padding: `24px`. Filter toolbar gap: `12px`.
- **Grid**: Table takes full viewport width.
- **Loading State**: Displays skeleton lines replacing row data cells.
- **Accessibility Notes**: Table must support keyboard navigation (`up`/`down` arrow selection, `enter` to view details).

### 28.3 Details View Template
- **Purpose**: Inspect a single record's parameters, metadata, and history.
- **ASCII Wireframe**:
```text
+-------------------------------------------------------+
| < Back to List  |  Record ID: SMP-9042   [Edit] [Del] |
+-------------------------------------------------------+
| +-------------------------+ +-----------------------+ |
| | Primary Metadata        | | History Timeline      | |
| | Status: [Passed]        | | - Approved 14:00      | |
| | Plant: Plant A          | | - Tested 12:30        | |
| +-------------------------+ +-----------------------+ |
+-------------------------------------------------------+
```
- **Component Hierarchy**: `PageHeader ➔ SplitContainer (Left: DetailsPanel, Right: SidebarTimeline)`.
- **Grid**: Left occupies 8 columns, right occupies 4 columns.
- **Responsive Behaviour**: Right side slips below left container at `768px`.
- **Accessibility Notes**: Timeline must use sequential heading structures to support screen readers.

### 28.4 Create Form Template
- **Purpose**: Inputting fresh entities.
- **Component Hierarchy**: `Header ➔ FormContainer ➔ InputFieldGroups ➔ FormActions`.
- **Grid**: Centered single-column layout (`max-w-xl`).
- **Loading State**: Disable button submit, show spinner.

### 28.5 Edit Form Template
- **Purpose**: Modifying existing master records.
- **Component Hierarchy**: Identical to Create Form, but includes a "Last Updated" warning badge and an explicit "Cancel" confirmation warning if dirty fields are present.

### 28.6 Organization Settings Template
- **Purpose**: Admin settings panel.
- **Component Hierarchy**: `SplitViewNav ➔ FormPanels`.
- **Spacing**: 3-9 grid split layout. Left navigation gap: `8px`. Right form gap: `16px`.

### 28.7 Profile Template
- **Purpose**: User configuration.
- **Component Hierarchy**: `CardContainer ➔ InputFields ➔ LanguageSelectionDropdown ➔ AvatarUpload`.
- **Grid**: Centered `max-w-lg`.

### 28.8 Administration Template
- **Purpose**: System dashboard.
- **Component Hierarchy**: `AdminShell ➔ AdminTabs ➔ StatisticsList ➔ UserTable`.
- **Grid**: Full-width administration layout.

### 28.9 Reports Template
- **Purpose**: Access and schedule PDFs.
- **Component Hierarchy**: `Header ➔ MonthSelector ➔ GridCardList ➔ DownloadButtons`.
- **Grid**: 4-column card grid.

### 28.10 Notifications Template
- **Purpose**: Pinned notifications list.
- **Component Hierarchy**: `NotificationHeader ➔ ScrollablePanel ➔ RowNotificationList`.
- **States**: Read notifications show desaturated background. Unread show accent dot.

### 28.11 Audit Logs Template
- **Purpose**: Compliance logs view.
- **Component Hierarchy**: `LogSearch ➔ VirtualizedLogList ➔ DetailModal`.
- **Grid**: Full width, tabular list.

### 28.12 Search Results Template
- **Purpose**: Display global matches.
- **Component Hierarchy**: `QueryBar ➔ FacetSidebar ➔ ResultRowsList ➔ MatchHighlights`.
- **Grid**: 3-9 split desktop grid.

### 28.13 AI Chat Template
- **Purpose**: Sidebar RAG interaction.
- **Component Hierarchy**: `ChatHeader ➔ ChatHistoryPanel ➔ CitationBubble ➔ ChatInputArea`.
- **Grid**: Fixed width `400px` container.

### 28.14 Knowledge Base Template
- **Purpose**: Reference directory.
- **Component Hierarchy**: `ExplorerSidebar ➔ DocumentPreviewContainer ➔ CategoryGrid`.
- **Grid**: comfortable layout.

---

## 29. Permission & Security UX Patterns

### 29.1 Access States
- **Read Only**:
  - Fields are displayed inside input borders but with `readOnly` attributes and a lock icon indicator. No hover transitions allowed.
  - Accent focus ring is removed. Copying text remains enabled.
- **Disabled**:
  - Actions that exist but cannot be triggered by the user in this state are greyed out (opacity 0.4), focus is skipped, and hover displays a tooltip detailing missing permissions (e.g., "Requires Operator role").
- **Hidden**:
  - Controls that the user has no role-based permission to use under any circumstance (e.g., Admin Panel link for operators) are completely omitted from the DOM to avoid UI clutter and information leaks.
- **Forbidden**:
  - Direct navigation to unauthorized URLs redirects to a standard 403 Forbidden Screen (§30).
- **Approval Required**:
  - Actions that require dual authorization (e.g., approving out-of-spec chemical limits) change the primary button action from "Approve" to "Request Approval," triggering a workflow task instead of direct DB persistence.

### 29.2 Role-Based and Scope-Based UI
- **Role-Based UI**:
  - Elements render according to active RBAC role tokens. Components check permissions before rendering.
- **Organization and Tenant Scope**:
  - Organization settings and tenant lists are only visible to `is_platform_admin = true` accounts (§ADR-0012). Tenant-scoped views dynamically mirror the active tenant schema name in the profile toolbar for validation transparency.

### 29.3 Security Actions and Destructive Flow (Soft Delete & Restore)
- **Confirmation Dialogs**:
  - Dangerous actions (e.g. archiving a sample set) trigger a modal dialog.
  - The modal title must be warning red. The primary button must read "Yes, Archive".
  - Critical destructive actions (e.g. deleting a customer account) require the user to type the record ID or name to enable the primary action button.
- **Soft Delete UX**:
  - Archiving/deleting an item marks it as `deleted_at`.
  - The item immediately disappears from standard lists, and a success toast appears with an immediate "Undo" action trigger.
- **Restore UX**:
  - Restoring is managed in the Archive Admin panel. Restorable items are listed with a circular arrow icon "Restore" button. Confirming returns the record back to standard lists.

---

## 30. Error & Empty State Library

### 30.1 System and Network Errors
- **Offline State**:
  - *Illustration*: Lucide `wifi-off` icon in warning yellow.
  - *Headline*: "No internet connection detected"
  - *Description*: "Nudum is running in local-only fallback mode. Data modifications will be queued until you are back online."
  - *Primary Action*: [Retry Connection] (primary)
  - *Secondary Action*: [Go to Offline Cache] (outline)
- **Network Error / API Failure**:
  - *Illustration*: Lucide `cloud-off` icon.
  - *Headline*: "Server connection timeout"
  - *Description*: "Unable to reach the Nudum backend API. Please wait a moment and try again."
  - *Primary Action*: [Retry]
  - *Secondary Action*: [Check Status Page]
  - *Retry Strategy*: Auto-retry backoff up to 3 times before displaying the error screen.

### 30.2 Application and Logic Errors
- **Validation Error**:
  - In-form validation displays red helper text under the input field. Form submission is disabled.
- **Conflict Error**:
  - Displayed in a modal dialog. E.g. "This record was updated by another operator at 14:02. Please copy your changes and refresh."
- **Permission Error (403)**:
  - *Illustration*: Lucide `shield-alert` in red.
  - *Headline*: "Access Denied"
  - *Description*: "You do not have the required permissions to view this resource. Contact your system administrator to request access."
  - *Primary Action*: [Return to Dashboard]

### 30.3 AI and Background Job Failures
- **AI Failure**:
  - Copilot panel displays: "AI assistant is temporarily offline. Operational calculations can still be triggered manually."
- **Background Job Failure**:
  - Document processing queue displays: "OCR extraction failed. The uploaded PDF might be corrupted or password-protected. Please re-upload a clean copy."

### 30.4 Semantic Reference Table
| Error Type | Headline | Tone of Voice | Primary Action |
|---|---|---|---|
| 404 | "Page Not Found" | Direct, administrative | [Return Home] |
| 403 | "Access Denied" | Serious, clear | [Go Back] |
| 500 | "Internal Server Error" | Apologetic, structured | [Refresh Page] |
| API Fail | "Connection Failed" | Factual | [Retry] |

---

## 31. Component Anatomy Reference

### 31.1 Button
- **Purpose**: Trigger actions, submit forms, open dialogs.
- **Anatomy**: `[Icon (optional)] [Label Text] [Chevron (optional)]`.
- **Variants**: `Primary`, `Secondary`, `Outline`, `Ghost`, `Destructive`.
- **Sizes**: `sm` (32px), `md` (40px, default), `lg` (48px).
- **States**: `Default`, `Hover`, `Active`, `Focus`, `Disabled`, `Loading` (shows loader spinner inside button container, text hidden).
- **Tokens used**: `--primary`, `--secondary`, `--radius-md`.
- **Accessibility**: Must announce role `button`. Focus ring visible.
- **Keyboard shortcuts**: `Enter` or `Space` to trigger.
- **Do**: Use clear verbs for labels ("Create", "Approve").
- **Don't**: Use generic text ("Click Here").

### 31.2 Input
- **Purpose**: Collect single-line text data.
- **Anatomy**: `[Field Label] [Required Asterisk] [Input Container [Prefix Icon] [Placeholder / Value] [Suffix Action]] [Helper/Error Text]`.
- **Variants**: `Text`, `Number`, `Password`, `Email`, `Search`.
- **Sizes**: `md` (40px), `lg` (44px).
- **States**: `Default`, `Focus` (primary blue border ring), `Disabled`, `Error` (red border).
- **Tokens used**: `--border`, `--radius-md`, `--error`.
- **Do**: Put labels above the field.
- **Don't**: Use placeholder text as a label replacement.

### 31.3 Textarea
- **Purpose**: Collect multi-line description or notes.
- **Anatomy**: Similar to input, with vertical drag handle toggle.

### 31.4 Select
- **Purpose**: Single option selection from list.
- **Anatomy**: `[Trigger Button [Selected Value] [Chevron-down]] [Dropdown Panel [Option list] [Selected Checkmark]]`.
- **Accessibility**: Keyboard arrows navigate choices. E.g. `Esc` closes menu.

### 31.5 Checkbox
- **Purpose**: Toggle binary state or choose multiple values.
- **Anatomy**: `[Box [Indicator icon]] [Label Text]`.
- **Sizes**: `20x20px` container.

### 31.6 Radio
- **Purpose**: Single choice from mutually exclusive list.
- **Anatomy**: `[Circle [Checked Inner Dot]] [Label Text]`.

### 31.7 Switch
- **Purpose**: Immediate toggle actions (e.g. Light/Dark theme).
- **Anatomy**: `[Track [Thumb]]`.

### 31.8 Card
- **Purpose**: Group related UI elements.
- **Anatomy**: `[Card Header [Title] [Description]] [Card Body] [Card Footer]`.

### 31.9 Dialog (Modal)
- **Purpose**: Heavy attention modal workflow.
- **Anatomy**: `[Overlay] [Dialog Content [Close Button] [Title] [Form Body] [Footer Actions]]`.
- **Keyboard shortcuts**: `Escape` triggers cancel. Focus is trapped.

### 31.10 Drawer
- **Purpose**: Slide-out details view from the inline-end edge.
- **Anatomy**: Similar to dialog, slides horizontally.

### 31.11 Toast
- **Purpose**: Transient notification feedback.
- **Anatomy**: `[Icon] [Message Text] [Action Trigger] [Close X]`.

### 31.12 Alert
- **Purpose**: Inline warnings or status blocks.
- **Anatomy**: `[Icon] [Title + Description] [Dismiss Button]`.

### 31.13 Badge
- **Purpose**: Small label counters or status.
- **Anatomy**: `[Text Label / Numeric Count]`.

### 31.14 Avatar
- **Purpose**: Represent active user profile.
- **Anatomy**: `[Circular Image / Fallback Initials] [Status Dot (online/offline)]`.

### 31.15 Tabs
- **Purpose**: Switch internal container views.
- **Anatomy**: `[Tab List [Tab Button [Active line highlight]]] [Active Tab Panel]`.

### 31.16 Table
- **Purpose**: Multi-column data grid lists.
- **Anatomy**: `[Table Header Row [Column Headers [Sort Arrow]]] [Table Body [Row [Cells] [Actions]]]`.

### 31.17 Sidebar
- **Purpose**: Global application navigation.
- **Anatomy**: `[Logo] [Module Switcher] [Nav Links Group] [Profile Footer Pinned]`.

### 31.18 Navbar
- **Purpose**: Header bar interface.
- **Anatomy**: `[Breadcrumbs] [Global Search Bar] [Notifications Bell] [Copilot Trigger]`.

### 31.19 Breadcrumb
- **Purpose**: Hierarchy path trail.
- **Anatomy**: `[Parent Segment] [Separator Chevron] [Child Segment]`.

### 31.20 Pagination
- **Purpose**: Table page navigation controls.
- **Anatomy**: `[Rows Per Page Selector] [Page Indicator] [Prev Button] [Next Button]`.

### 31.21 Modal
- **Purpose**: Overlay dialog blocker.

### 31.22 Tooltip
- **Purpose**: Informational micro-popups.
- **Anatomy**: `[Trigger Element] [Tooltip Panel [Bubble Text]]`.

### 31.23 Dropdown
- **Purpose**: Select action menus.
- **Anatomy**: `[Trigger Button] [Menu Panel [Action Rows]]`.

