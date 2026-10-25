/** @typedef {{name: string, description: string, images: string[], brand: string,
 * pageHref: string, usdPrice: number, notice: string}} ProductFacts */

/** Serialize the persisted USD snapshot using URLs relative to the delivered page.
 * @param {ProductFacts} facts @returns {string} */
export function productStructuredData(facts) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: facts.name,
    description: facts.description,
    image: facts.images,
    brand: { "@type": "Brand", name: facts.brand },
    offers: [
      {
        "@type": "Offer",
        priceCurrency: "USD",
        price: facts.usdPrice,
        url: facts.pageHref,
        description: facts.notice,
      },
    ],
  }).replace(/</gu, "\\u003c");
}
