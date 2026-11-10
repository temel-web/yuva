---
name: Yuva
description: Room studies with generous photography, weighty sans-serif headings, and quiet object inspection.
colors:
  accent: "light-dark(#ad2b1a, #ffb9a6)"
  accent-hover: "light-dark(#902113, #ffcebd)"
  accent-press: "light-dark(#72190f, #fba48d)"
  accent-subtle: "light-dark(#f8dfd7, #502b30)"
  accent-text: "light-dark(#972415, #ffb9a6)"
  background-color: "light-dark(#faf7f1, #211825)"
  text-primary: "light-dark(#2e1c34, #fff6ee)"
  text-secondary: "light-dark(#5d405f, #e2cfe5)"
  text-muted: "light-dark(#684e66, #cdb5d1)"
  text-on-accent: "light-dark(#ffffff, #2e1c34)"
  text-link: "light-dark(#972415, #ffb9a6)"
  text-link-hover: "light-dark(#72190f, #ffdbc9)"
  surface-hover: "light-dark(#f1e3db, #4a374a)"
  surface-active: "light-dark(#e7cdc1, #5a414b)"
  surface-selected: "light-dark(#f8dfd7, #502b30)"
  surface-input: "light-dark(#fffcf8, #332738)"
  surface-overlay: "light-dark(#fffcf8, #332738)"
  surface-panel: "light-dark(#e5d9f1, #392c45)"
  surface-raised: "light-dark(#fffcf8, #332738)"
  border-default: "light-dark(#b6a3b3, #7c6b82)"
  border-subtle: "light-dark(#ddd0d0, #514457)"
  border-strong: "light-dark(#7b6676, #b19cb7)"
  border-focus: "light-dark(#683f93, #d6bbf8)"
typography:
  display:
    fontFamily: '"Source Sans 3", "Noto Sans", ui-sans-serif, system-ui, sans-serif'
    fontSize: "clamp(40px, 6.4cqi, 6rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  headline:
    fontFamily: '"Source Sans 3", "Noto Sans", ui-sans-serif, system-ui, sans-serif'
    fontSize: "clamp(28px, 4cqi, 50px)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  title:
    fontFamily: '"Source Serif 4", "Noto Serif", ui-serif, Georgia, serif'
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.3
  object-title:
    fontFamily: '"Source Sans 3", "Noto Sans", ui-sans-serif, system-ui, sans-serif'
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: '"Source Sans 3", "Noto Sans", ui-sans-serif, system-ui, sans-serif'
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: '"Source Sans 3", "Noto Sans", ui-sans-serif, system-ui, sans-serif'
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.4
  caption:
    fontFamily: '"Source Sans 3", "Noto Sans", ui-sans-serif, system-ui, sans-serif'
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.4
  price:
    fontFamily: '"Source Serif 4", "Noto Serif", ui-serif, Georgia, serif'
    fontSize: "28px"
    fontWeight: 400
    lineHeight: 1.3
rounded:
  radius-none: "0"
  radius-xs: "0px"
  radius-sm: "2px"
  radius-lg: "2px"
spacing:
  space-0: "0"
  space-1: "2px"
  space-2: "4px"
  space-3: "6px"
  space-4: "8px"
  space-5: "10px"
  space-6: "12px"
  space-7: "16px"
  space-8: "28px"
  space-9: "36px"
  space-10: "44px"
  space-11: "48px"
  space-12: "64px"
  space-13: "80px"
  space-14: "96px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.text-on-accent}"
    typography: "{typography.label}"
    rounded: "{rounded.radius-none}"
    padding: "12px 16px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
  button-primary-active:
    backgroundColor: "{colors.accent-press}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.radius-none}"
    padding: "12px 16px"
    height: "48px"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.radius-none}"
    padding: "12px 8px"
    height: "48px"
  add-to-cart:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.text-on-accent}"
    rounded: "{rounded.radius-none}"
    padding: "10px 28px"
    height: "48px"
    width: "100%"
  quantity-input:
    backgroundColor: "{colors.surface-input}"
    textColor: "{colors.text-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.radius-none}"
    padding: "8px 12px"
    height: "44px"
    width: "4rem"
  currency-choice:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.radius-sm}"
    padding: "8px 12px"
    height: "48px"
  currency-choice-selected:
    backgroundColor: "{colors.surface-selected}"
  product-card:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    typography: "{typography.object-title}"
    rounded: "{rounded.radius-none}"
  gallery-mode:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.radius-none}"
    padding: "8px 12px"
    height: "44px"
  gallery-mode-selected:
    backgroundColor: "{colors.surface-selected}"
---

# Design System: Yuva

## Overview

**Creative North Star: "Room studies"**

Room studies gives Yuva generous photographic space, weighty sans-serif headings, and a quiet
setting for inspecting furniture and home objects. Cream and plum frame the photography; rust
marks the principal actions. Flat surfaces, square imagery, fine dividers, and restrained motion
keep the objects and authored text legible.

This document extracts the implemented storefront. The organization-owned
[styles.css](design-system/styles.css), [fonts.css](design-system/fonts.css), and native custom
element modules remain the source of truth. Frontmatter records their observed values and selected
component presentations; it does not replace the canonical Design System or create new public CSS
variables. The Room studies homepage is one expression of these foundations. Its grouped hero copy,
distinct lead photograph, and unequal featured objects are not mandatory layouts for every custom
element.
Component `height` entries record the source minimum block size, allowing labels to wrap or grow.

**Key Characteristics:**

- Generous photography and contained product images with their original proportions.
- Source Sans 3 for the storefront's principal headings, body copy, and controls.
- Source Serif 4 retained for selected prices, cart titles, and totals.
- Square actions, quiet dividers, and filled selection states with separate focus outlines.
- Content-responsive layouts and motion that respects reduced-motion preferences.

## Colors

The retained Orchid Gallery palette pairs warm cream, plum text, and rust actions; dark mode uses
plum surfaces, pale text, and coral actions. The frontmatter preserves native `light-dark()` values
with light first and dark second. Its color keys correspond directly to the same `--` CSS names.

### Primary

- **Rust / coral action** (`accent`, `accent-hover`, `accent-press`): the first emphasized action
  and add-to-cart command, with distinct hover and pressed colors.
- **Rust / coral text** (`accent-text`, `text-link`, `text-link-hover`): caption links, disclosure
  indicators, and interactive text.
- **Warm / plum selection** (`accent-subtle`, `surface-selected`): selected currency, current
  category, gallery mode, and selected thumbnails.

### Secondary

- **Orchid / plum panel** (`surface-panel`): the existing muted block presentation. It is an
  available surface variant, not the required background of every storefront section.
- **Violet focus** (`border-focus`): keyboard focus and selected thumbnail borders.

### Neutral

- **Cream / deep plum** (`background-color`): the page field and header index panel.
- **Plum / warm white text** (`text-primary`): headings, object names, facts, and controls.
- **Secondary plum / pale orchid** (`text-secondary`, `text-muted`): supporting descriptions,
  metadata, captions, and the demonstration notice.
- **Action contrast** (`text-on-accent`): labels on the emphasized command.
- **Warm / plum state surfaces** (`surface-hover`, `surface-active`): feedback on quiet and
  outlined controls.
- **Light / plum fields** (`surface-input`, `surface-raised`): quantity entry and available
  raised block variants.
- **Fine / strong strokes** (`border-subtle`, `border-default`, `border-strong`): separators,
  control boundaries, and outlined states.

Product photo stages and thumbnails use literal `white` in the custom element source in both
schemes. This keeps the licensed object photography on its existing white field; it is not a new
semantic token. The sidecar's synthesized tonal ramps are swatch previews only, not UI colors.

**The Color Scheme Rule.** Consume the existing semantic CSS roles and let `color-scheme` resolve
their `light-dark()` values.

## Typography

**Display and Body Font:** Source Sans 3, with the `--font-ui` fallback stack in frontmatter.
**Supporting Serif Font:** Source Serif 4, with the `--font-display` fallback stack in frontmatter.

The storefront's main headings override the retained serif `--type-display` foundation with
Source Sans 3. The sans is dense and direct at display sizes; regular serif prices and cart totals
provide a quieter contrast. Local variable WOFF2 faces are registered with `font-display: swap`.

### Hierarchy

- **Display:** the hero uses the `display` role. At a container width of at least 48rem, the study
  heading uses `clamp(50px, 5.4cqi, 68px)` with a 15ch measure; the masthead retains
  `clamp(68px, 7.4cqi, 6rem)`. Both preserve the same weight, leading, and tracking.
  The footer's large closing heading uses `clamp(40px, 6cqi, 6rem)`.
- **Headline:** product pages, collection introductions, Cards, and FAQ introductions use the
  `headline` role. Their titles wrap rather than truncate.
- **Object title:** product-card names use `object-title`; metadata and price share the heading
  grid without forcing long names onto one line.
- **Title and price:** `title` corresponds to `--type-title`; the product-page price uses `price`.
  Monetary values use tabular numerals. Product-card prices use regular `--type-ui` instead.
- **Body:** `body` corresponds to `--type-body`. Hero summaries use their available column width
  and wrap naturally on smaller screens, with or without media.
  The product collection summary is capped at 60ch, illustrated-row body text at 33ch, and FAQ
  answers at 66ch.
- **Label and caption:** `label` corresponds to `--type-ui-strong`; `caption` corresponds to
  `--type-caption`. Add-to-cart's default large size uses 16px semibold text with 1.4 leading.

## Layout

Shared Page Essentials blocks expose `width="wide"` (80rem) and `width="reading"` (48rem).
Comfortable inset padding is `clamp(16px, 4%, 36px)`; spacious inset padding is
`clamp(16px, 5%, 48px)`. Inline padding also centers content inside the selected measure. The
spacing entries retain the exact `--space-*` scale: tight control gaps, wider content gaps, and
generous section separation use the same source properties.

The homepage study hero keeps heading, summary, and actions grouped beside the lead photograph on
4fr / 5fr tracks from 48rem. The heading stays inside the copy column. The column gap is
`--space-8`, increasing to `--space-10` from 62rem; the copy grid uses `--space-8` between its
introduction and actions. An unfilled eyebrow remains measurable and stays out of flow. Below
48rem, heading, summary, actions, and photograph remain in their vertical reading sequence. A
study without filled media uses one column.

Product grids use one column initially and two from a 20rem container. Introduced collections use
`--space-9` top and `--space-12` bottom padding, with `--space-8` between the introduction and
products. Their headings are capped at 22ch and summaries at 60ch. From 36rem to below 62rem,
filled heading and summary Slots sit beside one another on 2fr / 3fr tracks with a `--space-9`
column gap. At 62rem, the introduction stacks in a sticky side rail beside unequal 3fr / 2fr
product columns, and even products are offset by `--space-13`. An unintroduced collection uses
three columns at that threshold and four at 76rem unless `columns="3"` is authored. These are
existing variants of `yuva-product-grid`, not a general grid mandate. Illustrated category rows
switch to three text / image / body columns at 36rem; ordinary Cards keep their separate
collection grid variants.

Product inspection changes at 52rem: a 1.5fr / 1fr media-and-copy layout replaces the stacked
layout, and thumbnails move to a 4rem side rail. The Photos / 360° mode controls precede the stage
in DOM order at every width. The gallery stage remains portrait (4 / 5); photographs use contain
fitting. Cart lines change from a 6rem image plus copy to a 10rem image, copy, and total at 42rem.

The header and footer use the generated Yuva wordmark from `assets/branding/yuva-logo.png`.
Its transparent shape follows `--text-primary`, so the same artwork remains legible in both
color schemes. The authored site name supplies the home link's accessible name. Forced colors
shows that text name in place of the artwork.

The responsive header uses a compact Menu, centered Yuva identity, and Cart below a 40rem container.
Currency and theme controls follow category links inside the expanded compact panel. From 40rem,
the brand and visitor controls form the first row, with six visible category links beneath a fine
divider. From 68rem, brand, categories, preferences, and Cart share one row. Preferences precede
Cart so the cart destination stays at the trailing edge. At 40rem and below, the compact Menu and
Cart labels are visually hidden while their accessible names remain. The source's canvas widths
are 320px, 390px, 768px, 1024px, 1200px, 1280px, and 1440px; they are authoring widths, not
universal breakpoints.

**The Reading Order Rule.** Preserve the implemented DOM sequence when a layout changes; gallery
mode controls precede the image or spin stage at every width.

## Elevation & Depth

The principal storefront is flat. Space, photography, fine strokes, and filled selected states
create hierarchy. Product cards and the expanded header index have no resting shadow. Existing
Page Essentials surface and figure variants retain optional elevation; those variants do not
make the current product-card treatment raised.

Top-layer content uses `--surface-overlay` with `--text-primary` and a `--border-default`
boundary. This separates menus, popovers, and dialogs from the page field in both color schemes.
Compact menus use `--shadow-menu`; larger confirmations and dialogs use `--shadow-dialog`.
Nonmodal popovers keep the page available for browsing. The existing `--surface-scrim` role is
reserved for modal layers that block background interaction.

### Shadow Vocabulary

- **`--shadow-widget`** (`0 2px 4px light-dark(#2e1c3408, #00000024)`): existing raised blocks.
- **`--shadow-menu`** (`0 12px 24px light-dark(#2e1c341a, #00000066)`): the existing surfaced
  linked content-card hover treatment.
- **`--shadow-dialog`** (`0 20px 48px light-dark(#2e1c3426, #00000080)`): larger top-layer
  confirmations and dialogs, and the optional elevated figure frame.

## Shapes

Actions, add-to-cart commands, gallery modes, quantity controls, and product photo stages are
square. The retained `--radius-sm` and `--radius-lg` roles are barely rounded and still serve
native shell controls and explicit surfaced variants. `shape="pill"` remains an authored
action-group option; the implemented store uses the square presentation. Dividers and control
borders use the existing single-pixel stroke. Focus remains an outline rather than a permanent
selection rail.

## Components

### Buttons

Commands are square, readable, and explicit about state. `temel-action-group` wraps native links
and buttons, with 48px minimum block size and padding from `--space-6` / `--space-7`. Its
`emphasis="primary-first"` variant gives the first action the accent fill; subsequent links are
quiet and underlined. Optional arrow indicators move diagonally by `--space-1` on hover when
motion is permitted. `yuva-add-to-cart` uses the shared size and accent / outline / quiet variants,
fills its available width, and changes its plus indicator to a check after success. The default
large size is 48px minimum block size with `--space-5` / `--space-8` padding. While saving, the
command displays the authored “Adding…” label and an interrupted-circle indicator (700ms linear
rotation), and disables activation to prevent duplicate additions. Reduced motion removes the
indicator animation. Authored disabled commands retain their usual label.

Success opens a native nonmodal `popover="auto"` at the lower trailing viewport corner. Its square
surface uses `--surface-overlay`, a `--border-default` boundary, `--space-8` padding, and
`--shadow-dialog`; its width and height are bounded by the viewport.
The authored “Added to your cart.” heading names
the confirmation. The photo and title come from the owning product or product card; the product
quantity and total count beside “View cart” reflect the saved cart. “Keep browsing” and Escape
close it and return focus to the command; outside activation light-dismisses it without taking
focus. Entry and exit use opacity and a `--space-7` vertical translation over `--dur-slowest`
with `--ease-out`, including discrete display and overlay transitions. Reduced motion removes
these transitions. Authored errors remain visible below the command; the successful status
announcement is visually hidden so it does not shift the page layout.

The authoring toolbar exposes Ready, Adding, Confirmation, and Error states so every label can
be edited in the shared template. The public `status` property draws those states without cart
writes, requests, focus movement, or changes to saved HTML. Confirmation is shown inline for this
presentation; actual additions still open the native popover. The button and confirmation keep
their accessible names from authored text Slots. A standalone command without an owning product
retains its Ready appearance while native disabled semantics prevent cart activation. Explicitly
authored disabled commands remain dimmed. Disabled button surfaces pass pointer clicks to the host
so the canvas can select the custom element. This command adds no JSON-LD.

### Chips

Currency choices are native buttons, grouped with a small `--space-1` gap. The selected choice
uses `surface-selected` and bold text; selection is expressed by `aria-pressed`. This is the
observed chip-like choice pattern, not a new tag or badge component.

### Cards / Containers

Product cards use a transparent container and a white portrait photo field (4 / 5), with contained
photography padded by `--space-8`. The name and price follow on a baseline-aligned grid; brand
and category appear below in caption text. Below an 18rem container the heading grid becomes one
column. With motion permitted, hover or focus within scales the photo to 1.04. Illustrated
category rows use a separate native `temel-content-card` presentation, with dividers between rows
and an optional small upward media movement on hover. Card links keep visible keyboard focus.

### Inputs / Fields

The cart quantity field is a native number input (minimum 1, step 1), square, 4rem wide, with
centered tabular numerals. Its built-in spinner is hidden because the adjacent minus and plus
buttons provide adjustment; native arrow-key adjustment remains available. The field has a
44px minimum block size. It uses `surface-input`, the shared control border and font, and the
existing focus outline. Quantity and removal operations expose authored status text; pending
controls are disabled. Quantity validity uses the browser's native validity presentation and the
authored error Slot. There is no extracted custom error-color recipe.

The cart shows one authored loading status while product documents are fetched. Product rows
appear only when their details are ready, retaining saved order as later rows arrive. Loading,
missing, and failed states never expose repository paths. Unavailable items retain explicit removal;
failed reads also offer retry. Retry moves keyboard focus to the loading status, then to the loaded
quantity control. The status needs no additional accessible name, and the cart emits no JSON-LD.

### Navigation

The header pairs a bold Source Sans 3 identity with six directly accessible category destinations
on medium and large screens. Category links use the UI text size, 48px minimum targets, hover fill,
and selected fill with stronger text. Currency and theme controls sit together before the Cart
link. The Cart link uses an outlined bag and a plain live quantity. Counts below 1000 remain exact;
larger counts use compact `Intl.NumberFormat` while accessible text retains the full quantity.
Keyboard order follows the visible rows: brand, preferences, Cart, then categories in the two-row
layout; brand, categories, preferences, and Cart in the single row. A layout transition preserves
the focused control, returning focus to Menu when that control moves into a closed compact panel.

On small screens, Menu, brand, and Cart remain visible. The open menu contains large category links
followed by currency and theme controls, has bounded viewport height, and scrolls when needed.
Escape closes it and returns focus to Menu; outside activation and category activation also close
it. The menu entry animates from `--space-4` above over `--dur-slow` with `--ease-out` only when
motion is permitted. Editor canvas clicks retain ordinary selection behavior.

### Product Inspection

Photos / 360° view are quiet mode buttons with a selected fill and stronger bottom edge. Selected
photo thumbnails use the focus-color border. The user can select photographs, step the 36-frame
turntable, drag it, or use left / right keys on its canvas. Play / pause remains an explicit
control; offscreen and reduced-motion behavior are owned by the existing animation controller.
The authored display name leads the page, while the original catalogue title remains available
below the product information. Facts, demonstration notice, and actions remain readable.

### Disclosures and Motion

FAQ items use native `details` / `summary`, generous row padding, and plus / minus SVG indicators.
Their open content changes block size over `--dur-slowest` with `--ease-out`; reduced motion
removes those transitions. The study hero has one progressive scroll-linked photograph movement
from `--space-4` down to `--space-8` up, using a linear view timeline from entry to exit. It runs
only when `animation-timeline: view()` is supported and reduced motion is not requested.

**The Reduced Motion Rule.** Decorative transforms, menu entry, and disclosure transitions are
removed when reduced motion is requested; reading, gallery selection, and manual inspection remain
available.

## Do's and Don'ts

### Do:

- **Do** consume the canonical semantic CSS properties and native color-scheme resolution.
- **Do** use the observed sans-serif storefront heading roles while retaining serif prices and
  cart typography where the component source uses them.
- **Do** keep product photographs contained and preserve their white inspection field in both
  color schemes.
- **Do** keep keyboard focus visible and separate from filled selected states.
- **Do** preserve responsive DOM order, authored text, Slots, references, and manual gallery
  controls when extending a component.
- **Do** respect reduced motion and keep the complete reading and interaction sequence available.

### Don't:

- **Don't** turn the homepage's paired copy and photograph, sticky introduction, or 3fr / 2fr
  stagger into a required layout for every reusable custom element.
- **Don't** substitute new colors or inferred swatch ramps for the canonical CSS values.
- **Don't** replace real product photographs or authored facts with decorative substitutes.
- **Don't** make selection depend on a persistent side rail or keyboard focus depend on animation.
- **Don't** promote dormant eyebrow styling or unrelated library variants into the storefront's
  required visual grammar.
