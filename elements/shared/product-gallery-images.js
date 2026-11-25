/** The image projected by a web image, or a simple authored photo.
 * @param {HTMLElement | undefined} photo @returns {HTMLImageElement | null} */
export function photoFallbackImage(photo) {
  if (!photo) return null;
  return photo.localName === "temel-picture"
    ? photo.querySelector(":scope > picture > img")
    : /** @type {HTMLImageElement} */ (photo);
}

/** Product metadata uses the resolved image file rather than its HTML asset.
 * @param {HTMLElement} photo @returns {string} */
export function photoSourceUrl(photo) {
  return photoFallbackImage(photo)?.getAttribute("src") ?? "";
}

/**
 * Thumbnails use one small file from the resolved web image. Responsive delivery stays owned by
 * the web image; the gallery never copies or rewrites its picture or source set.
 * @param {HTMLElement} photo @param {HTMLImageElement} thumbnail
 * @param {{isRevealed: boolean}} presentation
 */
export function syncThumbnailImage(photo, thumbnail, presentation) {
  const image = photoFallbackImage(photo);
  const smallest = image
    ?.getAttribute("srcset")
    ?.trim()
    .split(/[\s,]+/u)[0];
  const source = presentation.isRevealed ? smallest || image?.getAttribute("src") : null;
  if (!source) thumbnail.removeAttribute("src");
  else if (thumbnail.getAttribute("src") !== source) thumbnail.setAttribute("src", source);
  thumbnail.alt = image?.alt ?? photo.getAttribute("alt") ?? "";
  thumbnail.loading = "lazy";
  thumbnail.decoding = "async";
}
