# Yuva

This repository contains browser-ready web content managed with ordinary Git and Temel. It has no build step. Runtime modules, author modules, and Design Systems remain native
files and are served exactly as authored.

Yuva is a local demonstration store with 88 real Amazon Berkeley Objects products. Prices are
illustrative. Nothing is for sale. A custom element's definition supplies shared behavior and appearance. Files in
`templates/` supply default content to instances in that folder's content hierarchy; nearer
templates override individual slots. Content written directly in an instance overrides that slot
locally. These files have no ongoing connection to the Temel organization repository.

## Local store

The running site is [Yuva locally](http://yuva.localhost:32125/). Build tools and browser tests live
in the Temel product repository under `scripts/yuva/`; this content checkout contains no development tooling.

- `index.html`: a room study, audience variations, staggered product picks, and an illustrated category index.
- `seating/`, `tables/`, `lighting/`, `rugs/`, `decor/`, `bedroom/`: category pages.
- `products/<category>/<slug>.html`: product sources with short names from the
  catalog, all inheriting `products/page.html`.
- Related products are queries in the category's product template. Product headings are plain
  text; the separate product-path field supplies navigation and cart identity.
- `cart/`: browser-owned cart.
- `campaigns/winter.html`: winter campaign.
- `header.html`, `footer.html`, `templates/`, `data/lists.html`: shared content.
- `products/<category>/<slug>.html`: authoritative product facts and original media IDs.
- `prices.json`: the price-service response fetched by product views and the cart.
- Each product HTML stores Product JSON-LD with its USD offer for initial HTML delivery. Opening
  the product refreshes that metadata from fetched prices, and Editor saves preserve it.
- `assets/products/`: four photographs and one spin atlas per product.

The footer credits the official dataset, its CC BY 4.0 license, and the image conversions.
The published demonstration store is [Yuva](https://yuva.demo.temel.page/).
