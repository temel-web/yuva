# Yuva Evening Rooms Design System

This directory is the organization-owned Design System artifact. Provisioning seeds one complete
system, after which owners may evolve their Organisation system. Core owns lint and its separate
canonical comparison reference; Simi has no Design System or lint authority.
The shipped `styles.css` defines scoped public custom properties, `fonts.css` owns the shipped
local font-face declarations, and `icons.css` owns the local icon styling foundation. Organisation
owners may add any valid local CSS. The Temel application owns a separate Design System for its interface.

## Contract

- The public custom-property vocabulary is exactly the 284 names listed below.
- Light+ and Dark+ semantic values use native `light-dark()` resolution. The browser owns the
  active scheme; an isolated preview may set `color-scheme` locally.
- Instrument Sans, Instrument Serif, and JetBrains Mono are pinned local WOFF2 assets from Fontsource 5.3.0.
- `icons.css` defines the local icon styling foundation.
- The shipped `styles.css` uses implicit `@scope` blocks for its custom-property declarations.
- `fonts.css` provides the reference system's local `@font-face` declarations.
- Consumers load `styles.css` directly; no build, bundling, compilation, or `dist/` copy is part of
  the Design System contract.
- No file in this artifact loads a runtime font, icon, stylesheet, or script from the network.

Core lint validates this complete artifact. An organization may add or divide arbitrary valid
local CSS when every file remains reachable from `styles.css`, `fonts.css`, or `icons.css`. CSS is
the editable source of truth, with no token manifest, component JSON, or editor-only model.

This artifact shares the public contract with the application Design System but has separate
ownership. No build or validation step copies the application artifact or requires byte identity.

## Source provenance

The CSS variable names began with the Temel reference artifact. Yuva uses the Evening rooms visual direction.
Status and syntax colors remain distinct from the brand palette.

The export's Google Fonts import was replaced with pinned local Fontsource packages. Its remote icon
dependency was replaced with local CSS foundations. Its `data-theme` selectors were replaced with
native scheme resolution while preserving the Light+ and Dark+ values.

Third-party terms are included under `licenses/`:

- Source Sans 3 — SIL Open Font License 1.1;
- JetBrains Mono — SIL Open Font License 1.1.

The local Inter and Source Serif 4 variable Latin font assets are also available. Their faces are
registered in `fonts.css`, their files are under `fonts/`, and their SIL Open Font License 1.1
texts are retained under `licenses/`. Registration does not change the Default font variables;
themes such as the Page Essentials example themes select these faces explicitly.

The Retail 2 theme also selects Noto Sans, Noto Serif, and Noto Sans Mono. Their complete local variable font faces, language subsets, and SIL Open Font License 1.1 texts are retained in this artifact.

Missing files, unresolved variables, or missing fonts are invalid artifact errors. Consumers do not
select a substitute artifact or remote asset.

## Public CSS variables

The following 284 names are the complete public vocabulary. Exact values remain authoritative in
`styles.css`.

### Fonts

`--font-display`, `--font-mono`, `--font-ui`

### Palette

`--amber-500`, `--amber-600`, `--amber-700`, `--blue-100`, `--blue-200`, `--blue-300`,
`--blue-400`, `--blue-500`, `--blue-600`, `--blue-700`, `--dp-attribute`, `--dp-comment`,
`--dp-constant`, `--dp-control`, `--dp-function`, `--dp-keyword`, `--dp-number`, `--dp-operator`,
`--dp-string`, `--dp-tag`, `--dp-type`, `--dp-variable`, `--gray-0`, `--gray-20`, `--gray-40`,
`--gray-60`, `--gray-80`, `--gray-100`, `--gray-150`, `--gray-200`, `--gray-250`, `--gray-300`,
`--gray-350`, `--gray-400`, `--gray-450`, `--gray-500`, `--gray-550`, `--gray-600`, `--gray-650`,
`--gray-700`, `--gray-750`, `--gray-800`, `--gray-850`, `--gray-900`, `--gray-950`, `--gray-1000`,
`--gray-ink`, `--gray-ink-2`, `--gray-input-border`, `--green-400`, `--green-500`, `--green-600`,
`--green-700`, `--lp-attribute`, `--lp-comment`, `--lp-constant`, `--lp-control`, `--lp-function`,
`--lp-keyword`, `--lp-number`, `--lp-operator`, `--lp-string`, `--lp-tag`, `--lp-type`,
`--lp-variable`, `--purple-400`, `--purple-500`, `--red-400`, `--red-500`, `--red-600`,
`--selection-dark`, `--selection-light`

### Semantic Light+/Dark+ theme

`--brand-center`, `--brand-edge`, `--accent`, `--accent-hover`, `--accent-press`, `--accent-subtle`, `--accent-text`,
`--background-color`, `--border-default`, `--border-focus`, `--border-input`, `--border-strong`, `--border-subtle`,
`--comment-highlight`, `--comment-highlight-active`, `--comment-rail`, `--diff-added-bg`,
`--diff-added-text`, `--diff-modified`, `--diff-removed-bg`, `--diff-removed-text`,
`--scrollbar-thumb`, `--scrollbar-thumb-hover`, `--status-error`, `--status-error-bg`,
`--status-info`, `--status-info-bg`, `--status-success`, `--status-success-bg`, `--status-warning`,
`--status-warning-bg`, `--surface-active`, `--surface-card`, `--surface-editor`, `--surface-hover`,
`--surface-inline-code`, `--surface-input`, `--surface-overlay`, `--surface-panel`,
`--surface-raised`, `--surface-scrim`, `--surface-selected`, `--surface-sidebar`,
`--surface-statusbar`, `--surface-titlebar`, `--syntax-attribute`, `--syntax-comment`,
`--syntax-constant`, `--syntax-control`, `--syntax-function`, `--syntax-keyword`, `--syntax-number`,
`--syntax-operator`, `--syntax-string`, `--syntax-tag`, `--syntax-type`, `--syntax-variable`,
`--text-code`, `--text-inverse`, `--text-link`, `--text-link-hover`, `--text-muted`,
`--text-on-accent`, `--text-primary`, `--text-secondary`, `--workflow-approved`,
`--workflow-approved-bg`, `--workflow-changes`, `--workflow-changes-bg`, `--workflow-draft`,
`--workflow-draft-bg`, `--workflow-published`, `--workflow-published-bg`, `--workflow-review`,
`--workflow-review-bg`, `--workflow-scheduled`, `--workflow-scheduled-bg`

### Button presentation

`--button-background`, `--button-background-active`, `--button-background-hover`,
`--button-border-color`, `--button-border-color-active`, `--button-border-color-hover`,
`--button-color`, `--button-font`, `--button-min-block-size`, `--button-padding-block`,
`--button-padding-inline`

### Typography

`--leading-body`, `--leading-code`, `--leading-loose`, `--leading-snug`, `--leading-tight`,
`--leading-ui`, `--text-2xl`, `--text-2xs`, `--text-3xl`, `--text-4xl`, `--text-5xl`, `--text-6xl`,
`--text-lg`, `--text-md`, `--text-sm`, `--text-ui`, `--text-xl`, `--text-xs`, `--tracking-caps`,
`--tracking-normal`, `--tracking-snug`, `--tracking-tight`, `--tracking-wide`, `--type-body`,
`--type-caption`, `--type-code`, `--type-code-editor`, `--type-display`, `--type-heading`,
`--type-title`, `--type-ui`, `--type-ui-strong`, `--weight-bold`, `--weight-light`,
`--weight-medium`, `--weight-regular`, `--weight-semibold`

### Spacing

`--gap-inline`, `--gap-section`, `--gap-stack`, `--pad-card`, `--pad-control-x`, `--pad-control-y`,
`--pad-panel`, `--pad-row-x`, `--space-0`, `--space-1`, `--space-2`, `--space-3`,
`--space-4`, `--space-5`, `--space-6`, `--space-7`, `--space-8`, `--space-9`, `--space-10`,
`--space-11`, `--space-12`, `--space-13`, `--space-14`

### Canvas

`--canvas-widths`

### Radius and borders

`--border-style`, `--border-width`, `--border-width-thick`, `--focus-ring-offset`, `--focus-ring-width`,
`--radius-lg`, `--radius-md`, `--radius-none`, `--radius-pill`, `--radius-sm`, `--radius-xs`,
`--rail-width`

### Elevation

`--blur-overlay`, `--scrim`, `--shadow-dialog`, `--shadow-drag`, `--shadow-menu`, `--shadow-none`,
`--shadow-row`, `--shadow-widget`

### Motion

`--dur-base`, `--dur-fast`, `--dur-instant`, `--dur-slow`, `--dur-slowest`, `--ease-in`,
`--ease-linear`, `--ease-out`, `--ease-standard`, `--transition-control`, `--transition-overlay`

### Layout

`--h-control`, `--h-control-lg`, `--h-control-sm`, `--h-row`, `--h-row-comfortable`,
`--h-statusbar`, `--h-tab`, `--h-titlebar`, `--h-toolbar`, `--size-avatar`, `--size-avatar-lg`,
`--size-avatar-sm`, `--size-icon`, `--size-icon-lg`, `--size-icon-sm`, `--w-activitybar`,
`--w-dialog`, `--w-dialog-lg`, `--w-dialog-sm`, `--w-menu-min`, `--w-panel-right`, `--w-sidebar`,
`--w-sidebar-min`, `--z-base`, `--z-dialog`, `--z-menu`, `--z-popover`, `--z-sticky`, `--z-toast`

## Yuva identity

Evening rooms gives Yuva a home-store identity: a plaster ground, plum text and panels, one saffron accent, local Instrument Serif headings, Instrument Sans body copy, squared imagery, generous spacing, restrained elevation, and short transitions. The dark scheme uses plum surfaces with the same saffron accent. A three-pixel focus outline remains separate from selection. Earlier local font assets and licenses are retained. The store is authored in English, French, and German. Publication is a separate step.
