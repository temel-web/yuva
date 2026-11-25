# Design System: Yuva

## Overview

**Direction: "Evening rooms"**

Yuva pairs full-width room photography with plum panels, tall serif headings, and one saffron
accent. Product cutouts sit on a toned stage; room photographs fill their frame. The organization
owned [styles.css](design-system/styles.css), [fonts.css](design-system/fonts.css), and the native
custom element modules are the source of truth. This document describes what they implement.

## Colors

Semantic roles keep their canonical names and resolve through native `light-dark()`.

- **Ground** (`background-color`): plaster `#efedea`; dark scheme `#1b1020`.
- **Ink** (`text-primary`, `text-secondary`, `text-muted`): plum `#2a1830`, `#5b4860`, `#65526a`;
  dark scheme bone `#f4efe7`, `#d9cddd`, `#cdbfd2`.
- **Accent** (`accent`, `accent-hover`, `accent-press`): saffron `#e8a91e` with plum text
  (`text-on-accent`). Saffron is a fill, never body text on the plaster ground; `accent-text` is
  `#6b4a00` in light and `#f2c14e` in dark.
- **Panel** (`surface-panel`): `#e3e0da` in light and plum `#2a1830` in dark.
- **Photo stage**: `light-dark(#e3e0da, #d8d3cb)`, written literally in the product card, product
  page, and cart line. It stays light in both schemes so cutouts can blend into it.

**Plum fields.** The demo strip, the hero panel, the returning-visitor band, and the footer set
`color-scheme: dark` on themselves, so the same roles give a plum field with bone text in a light
page. Use this instead of inventing dark-only colors.

## Typography

- **Display**: Instrument Serif, regular weight only, with its italic. Headings use tight leading
  (0.94 to 1) and `-0.01em` tracking. Do not embolden it.
- **Text and controls**: Instrument Sans, variable 400 to 700.
- Both are local WOFF2 files from Fontsource 5.3.0 under the SIL Open Font License 1.1; license
  texts are in `design-system/licenses/`.

## Photography

- A **cutout** on white is shown contained with padding and `mix-blend-mode: multiply`, so its
  white background takes the stage color.
- A **room photograph** is shown with `object-fit: cover` and no blend.
- `elements/shared/photograph-kind.js` tells them apart from the image's corners when it loads; the
  product card and product page set a `room` custom state from it.

## Layout

- **Home hero** (`temel-hero layout="study"`): the photograph spans the page at 21:9 from a 48rem
  container (4:3 below), and the copy sits on a plum panel over its lower trailing corner. Below
  48rem the panel stacks above the photograph. The figure's caption can sit over the photograph
  with `caption-placement="overlay"`.
- **Product grid** (`yuva-product-grid`): an introduction row above an even grid. `layout="spread"`
  leads with the first product across two rows and widens the fifth, from a 62rem container.
- **Category cards** (`temel-cards columns="3"`): photograph, serif name, one line of text; the
  whole card is the link.
- **Product page**: toned stage with a thumbnail rail, the Photos / 360° switch above it, and
  labelled fact rows beside it.
- **Cart**: a receipt with Item, Price, Quantity, and Total columns from a 46rem container, and a
  serif subtotal.

## Shapes and motion

Controls, stages, and panels are square. Hover scales a product photograph slightly; reduced
motion removes transitions. Keyboard focus is a separate outline (`border-focus`).

## Do and don't

- **Do** use the semantic roles and let `color-scheme` resolve them.
- **Do** keep product photographs real and their facts as authored.
- **Don't** put saffron text on the plaster ground or add a second accent.
- **Don't** add new public custom properties to the design system.
