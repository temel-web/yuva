# Yuva

A demonstration home-goods store built with [Temel](https://temel.page/) and managed in Git. View the live site at [yuva.demo.temel.page](https://yuva.demo.temel.page/).

Yuva includes 88 real products with photography, 360° spin views, audience variations, translations, and a browser-only cart. Prices are illustrative; nothing is for sale.

## Repository layout

- **Storefront:** `index.html`, category pages (`seating/`, `tables/`, `lighting/`, `rugs/`, `decor/`, `bedroom/`), `campaigns/winter.html`, and `cart/`
- **Catalog:** 88 products under `products/<category>/<slug>.html`, `prices.json`, and media under `assets/products/`
- **Translations:** `de/`, `fr/`, and `fr-ch/`
- **Shared content:** `header.html`, `footer.html`, `templates/`, and `data/lists.html`
- **Components & design:** `elements/`, `import.library.js` (adopted `@temel` elements), `design-system/` (see [DESIGN.md](DESIGN.md)), and `themes/`

## Credits

- Product data and photography: [Amazon Berkeley Objects](https://amazon-berkeley-objects.s3.amazonaws.com/index.html) ([CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)), resized and converted.
- Fonts: bundled WOFF2 fonts under the SIL Open Font License 1.1 (`design-system/licenses/`).
