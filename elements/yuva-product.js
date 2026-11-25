import { node } from "./shared/store-element.js";
import { PricedStoreElement } from "./shared/priced-store-element.js";
import {
  PRODUCT_FIELDS,
  productAmount,
  productPageHref,
  productPath,
  showPrice,
} from "./shared/product-fields.js";
import "./yuva-spin-viewer.js";
import "./yuva-add-to-cart.js";
import { productStructuredData } from "./shared/product-structured-data.js";
import { isRoomPhotograph } from "./shared/photograph-kind.js";
import {
  photoFallbackImage,
  photoSourceUrl,
  syncThumbnailImage,
} from "./shared/product-gallery-images.js";

/** Product source, visitor gallery, illustrative prices, and structured product facts. */
export class YuvaProduct extends PricedStoreElement {
  static preferenceTopics = Object.freeze(["currency"]);
  static temelSlots = [
    ...PRODUCT_FIELDS,
    "display-name",
    "summary",
    "description",
    "color",
    "material",
    "dimensions",
    "color-label",
    "material-label",
    "dimensions-label",
    "gallery",
    "spin",
    "spin-label",
    "photos-label",
    "action",
    "notice",
    "provenance",
  ];
  #titleSlot;
  #heading;
  #catalogue;
  #preview;
  #thumbnails;
  #spin;
  #photosButton;
  #spinButton;
  #factByName = new Map();
  #selectedImage = 0;
  #isSpinSelected = false;
  #images = [];
  #thumbnailByImage = new Map();
  #photoStyles = new CSSStyleSheet();
  #visibleImageChildIndex;
  #photoStyleRoot;
  #gallerySubscriptions;
  #mainImage;
  #imagePaintFrame;
  #isMainImagePainted = false;
  #visibleThumbnails = new Set();
  #revealedThumbnails = new WeakSet();
  #photoByThumbnail = new WeakMap();
  #thumbnailObserver = new IntersectionObserver(this.handleThumbnailVisibilityChange.bind(this));

  constructor() {
    super();
    this.#titleSlot = this.temelSlot("title");
    const heading = node("header", { class: "heading" }, [
      this.temelSlot("display-name"),
      this.#titleSlot,
      node("div", { class: "meta" }, [this.temelSlot("brand"), this.temelSlot("category")]),
    ]);
    this.#heading = heading;
    const media = this.#createMedia();
    const copy = this.#createCopy();
    this.shadowRoot.append(
      node("article", {}, [heading, media, copy]),
      this.temelSlot("provenance"),
    );
    this.shadowRoot.addEventListener("click", this.handleGalleryClick.bind(this));
    this.addStyles(`
      :host { padding: var(--space-9) max(clamp(var(--space-7), 4%, var(--space-11)), calc((100% - 80rem) / 2)) var(--space-13); }
      article { display: grid; gap: var(--space-8); align-items: start; }
      .heading { display: grid; gap: var(--space-6); }
      .media { min-inline-size: 0; display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--space-6); }
      .preview { position: relative; isolation: isolate; background: light-dark(#e3e0da, #d8d3cb); aspect-ratio: 4 / 5; overflow: clip; }
      .preview > slot { display: block; position: absolute; inset: 0; pointer-events: none; }
      .preview > slot::slotted(:is(img, temel-picture)) { display: none; position: absolute; inset: 0; box-sizing: border-box; inline-size: 100%; block-size: 100%; object-fit: contain; padding: clamp(var(--space-8), 8cqi, var(--space-12)); mix-blend-mode: multiply; pointer-events: auto; }
      :host(:state(room)) .preview > slot::slotted(:is(img, temel-picture)) { object-fit: cover; padding: 0; mix-blend-mode: normal; }
      .thumbnails { display: grid; grid-template-columns: repeat(4, minmax(0, 5rem)); gap: var(--space-4); margin-block: 0; align-content: start; }
      .thumbnails button { aspect-ratio: 1; min-block-size: 0; overflow: clip; padding: 0; background: light-dark(#e3e0da, #d8d3cb); border-color: transparent; border-width: var(--border-width-thick); border-radius: 0; }
      .thumbnails button[aria-pressed="true"] { border-color: var(--text-primary); }
      .thumbnails img { display: block; inline-size: 100%; block-size: 100%; aspect-ratio: 1; object-fit: cover; mix-blend-mode: multiply; }
      .thumbnails img:not([src]) { opacity: 0; }
      .modes { display: flex; flex-wrap: wrap; gap: 0; }
      .modes button { display: inline-flex; align-items: center; gap: var(--space-4); border-radius: 0; background: transparent; border-color: var(--text-primary); padding-inline: var(--space-7); }
      .modes button + button { border-inline-start: 0; }
      .modes button[aria-pressed="true"] { background: var(--text-primary); color: var(--background-color); }
      .modes button[value="spin"]::before { content: ""; inline-size: var(--size-icon-lg); block-size: var(--size-icon-lg); background: currentColor; mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 12c0-2.2 4-4 9-4s9 1.8 9 4-4 4-9 4'/%3E%3Cpath d='m9 13 3 3-3 3'/%3E%3C/svg%3E") center / contain no-repeat; }
      .copy { display: grid; gap: var(--space-7); min-inline-size: 0; }
      .copy > slot, .heading > slot, .catalogue > slot, .fact slot { display: block; min-inline-size: var(--space-1); min-block-size: var(--space-1); }
      .catalogue { color: var(--text-muted); font: var(--type-caption); padding-block-start: var(--space-7); border-block-start: var(--border-width) solid var(--border-subtle); }
      .catalogue > slot::slotted(*) { font: inherit; margin: 0; }
      .meta { order: -1; display: flex; flex-wrap: wrap; gap: var(--space-6); font: var(--weight-medium) var(--text-ui)/var(--leading-ui) var(--font-ui); color: var(--text-secondary); }
      .heading > slot::slotted(:is([slot="title"], [slot="display-name"])) { margin: 0; font: var(--weight-regular) clamp(var(--text-4xl), 6.4cqi, 5rem)/0.96 var(--font-display); letter-spacing: -0.01em; text-wrap: balance; }
      ::slotted([slot="summary"]) { font: var(--weight-regular) var(--text-xl)/var(--leading-body) var(--font-ui); color: var(--text-primary); max-inline-size: 46ch; }
      ::slotted([slot="notice"]) { font: var(--type-ui); font-size: var(--text-sm); color: var(--text-muted); }
      .price { font: var(--weight-regular) var(--text-4xl)/1 var(--font-display); font-variant-numeric: tabular-nums; }
      .facts { display: grid; margin: 0; border-block-start: var(--border-width) solid var(--text-primary); }
      .fact { display: grid; grid-template-columns: minmax(7rem, 1fr) minmax(0, 2.4fr); gap: var(--space-7); padding-block: var(--space-6); border-block-end: var(--border-width) solid var(--border-subtle); }
      .fact dt { color: var(--text-secondary); }
      .fact dd { margin: 0; }
      .fact dd > slot::slotted(*) { margin: 0; }
      @container (min-width: 52rem) {
        article { grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr); grid-template-rows: auto 1fr; column-gap: var(--space-12); row-gap: var(--space-8); }
        .media { grid-column: 1; grid-row: 1 / span 2; }
        .media { grid-template-columns: 4.5rem minmax(0, 1fr); align-items: start; }
        .preview, .spin-stage { grid-column: 2; grid-row: 2; }
        .thumbnails { grid-column: 1; grid-row: 2; grid-template-columns: minmax(0, 1fr); }
        .modes { grid-column: 2; grid-row: 1; }
        .heading { grid-column: 2; grid-row: 1; padding-block-start: var(--space-11); }
        .copy { grid-column: 2; grid-row: 2; }
      }
    `);
    this.shadowRoot.adoptedStyleSheets = [...this.shadowRoot.adoptedStyleSheets, this.#photoStyles];
  }

  connectedCallback() {
    this.#gallerySubscriptions = new AbortController();
    this.#photoStyleRoot = this.getRootNode();
    this.#photoStyleRoot.adoptedStyleSheets = [
      ...this.#photoStyleRoot.adoptedStyleSheets,
      this.#photoStyles,
    ];
    super.connectedCallback();
  }

  disconnectedCallback() {
    this.#gallerySubscriptions.abort();
    this.#thumbnailObserver.disconnect();
    cancelAnimationFrame(this.#imagePaintFrame);
    this.#visibleThumbnails.clear();
    this.#mainImage = null;
    this.#isMainImagePainted = false;
    this.#photoStyleRoot.adoptedStyleSheets = this.#photoStyleRoot.adoptedStyleSheets.filter(
      (sheet) => sheet !== this.#photoStyles,
    );
    super.disconnectedCallback();
  }

  #createMedia() {
    this.#preview = node("div", { class: "preview" }, [
      this.temelSlot("image"),
      this.temelSlot("gallery"),
    ]);
    this.#thumbnails = node("div", { class: "thumbnails" });
    this.#spin = node("div", { class: "spin-stage", hidden: "" }, [this.temelSlot("spin")]);
    this.#photosButton = node("button", { type: "button", value: "photos" }, [
      this.temelSlot("photos-label"),
    ]);
    this.#spinButton = node("button", { type: "button", value: "spin" }, [
      this.temelSlot("spin-label"),
    ]);
    return node("div", { class: "media" }, [
      node("div", { class: "modes" }, [this.#photosButton, this.#spinButton]),
      this.#preview,
      this.#spin,
      this.#thumbnails,
    ]);
  }

  #createCopy() {
    this.#catalogue = node("div", { class: "catalogue" });
    return node("div", { class: "copy" }, [
      this.temelSlot("summary"),
      node("output", { class: "price", "data-price": "" }),
      this.temelSlot("action"),
      this.temelSlot("notice"),
      node(
        "dl",
        { class: "facts" },
        ["color", "material", "dimensions"].map(this.#createFact, this),
      ),
      this.temelSlot("description"),
      this.#catalogue,
    ]);
  }

  /** One labelled fact row; rows without an authored value stay hidden. @param {string} name */
  #createFact(name) {
    const row = node("div", { class: "fact" }, [
      node("dt", {}, [this.temelSlot(`${name}-label`)]),
      node("dd", {}, [this.temelSlot(name)]),
    ]);
    this.#factByName.set(name, row);
    return row;
  }

  get selectedImage() {
    return this.#selectedImage;
  }
  set selectedImage(index) {
    if (!Number.isInteger(index) || index < 0 || index >= this.#images.length)
      throw new RangeError("Select an available product image.");
    this.#selectedImage = index;
    this.#isSpinSelected = false;
    this.#renderGallery();
    this.dispatchEvent(
      new CustomEvent("gallery-change", {
        bubbles: true,
        composed: true,
        detail: { selectedImage: index },
      }),
    );
  }

  update() {
    const hasDisplayName = Boolean(this.text("display-name"));
    const titleOwner = hasDisplayName ? this.#catalogue : this.#heading;
    if (this.#titleSlot.parentElement !== titleOwner) titleOwner.append(this.#titleSlot);
    this.#catalogue.hidden = !hasDisplayName;
    for (const [name, row] of this.#factByName) row.hidden = !this.text(name);
    this.#images = Array.from(
      this.querySelectorAll(
        ":scope > :is(img, temel-picture)[slot='image'], :scope > :is(img, temel-picture)[slot='gallery']",
      ),
    );
    if (this.#selectedImage >= this.#images.length) this.#selectedImage = 0;
    this.#syncThumbnails();
    this.#renderGallery();
    this.#watchMainImage();
    showPrice(this);
    const action = this.querySelector(":scope > yuva-add-to-cart");
    if (action) {
      action.productPath = productPath(this);
      action.productSummary = {
        title: this.text("display-name") || this.text("title"),
        image: this.field("image"),
      };
      action.update();
    }
    this.#writeStructuredData();
  }

  #syncThumbnails() {
    for (const [image, button] of this.#thumbnailByImage) {
      if (this.#images.includes(image)) continue;
      button.remove();
      this.#thumbnailObserver.unobserve(button);
      this.#visibleThumbnails.delete(button);
      this.#thumbnailByImage.delete(image);
    }
    for (const [index, image] of this.#images.entries()) {
      let button = this.#thumbnailByImage.get(image);
      if (!button) {
        button = node("button", { type: "button" }, [node("img")]);
        this.#thumbnailByImage.set(image, button);
        this.#photoByThumbnail.set(button, image);
      }
      syncThumbnailImage(image, button.querySelector("img"), {
        isRevealed: this.#revealedThumbnails.has(button),
      });
      if (this.isConnected && !this.#revealedThumbnails.has(button)) {
        this.#thumbnailObserver.observe(button);
      }
      button.value = String(index);
      const current = this.#thumbnails.children[index];
      if (current !== button) this.#thumbnails.insertBefore(button, current ?? null);
    }
  }

  #watchMainImage() {
    if (!this.isConnected) return;
    const image = photoFallbackImage(this.#images[0]);
    if (!image || image === this.#mainImage) return;
    this.#mainImage = image;
    const options = { signal: this.#gallerySubscriptions.signal };
    image.addEventListener("load", this.handleMainImageLoad.bind(this), options);
    image.addEventListener("error", this.handleMainImageLoad.bind(this), options);
    if (image.complete) this.handleMainImageLoad();
  }

  async handleMainImageLoad() {
    const image = this.#mainImage;
    try {
      await image.decode();
    } catch {
      // A failed main photo must still leave the other gallery choices available.
    }
    if (!this.isConnected || image !== this.#mainImage) return;
    cancelAnimationFrame(this.#imagePaintFrame);
    this.#imagePaintFrame = requestAnimationFrame(this.handleMainImageDecodeFrame.bind(this));
  }

  handleMainImageDecodeFrame() {
    // Leave a complete paint frame after decoding before requesting secondary images.
    this.#imagePaintFrame = requestAnimationFrame(this.handleThumbnailRevealFrame.bind(this));
  }

  handleThumbnailRevealFrame() {
    this.#imagePaintFrame = requestAnimationFrame(this.handleMainImagePaint.bind(this));
  }

  handleMainImagePaint() {
    this.#isMainImagePainted = true;
    for (const button of this.#visibleThumbnails) this.#revealThumbnail(button);
  }

  handleThumbnailVisibilityChange(entries) {
    for (const entry of entries) {
      if (!entry.isIntersecting) {
        this.#visibleThumbnails.delete(entry.target);
        continue;
      }
      this.#visibleThumbnails.add(entry.target);
      if (this.#isMainImagePainted) this.#revealThumbnail(entry.target);
    }
  }

  #revealThumbnail(button) {
    syncThumbnailImage(this.#photoByThumbnail.get(button), button.querySelector("img"), {
      isRevealed: true,
    });
    this.#revealedThumbnails.add(button);
    this.#thumbnailObserver.unobserve(button);
    this.#visibleThumbnails.delete(button);
  }

  #renderGallery() {
    const image = this.#images[this.#selectedImage];
    const childIndex = Array.from(this.children).indexOf(image) + 1;
    if (childIndex !== this.#visibleImageChildIndex) {
      if (this.#visibleImageChildIndex !== undefined) {
        this.setState(`photo-${this.#visibleImageChildIndex}`, false);
      }
      this.setState(`photo-${childIndex}`, true);
      this.#photoStyles.replaceSync(
        `.preview > slot::slotted(:is(img, temel-picture):nth-child(${childIndex})) { display: block; }
         yuva-product > temel-picture[slot="gallery"] { display: none; }
         yuva-product:state(photo-${childIndex}) > temel-picture:nth-child(${childIndex}) { display: block; }
         yuva-product > temel-picture[slot="gallery"] { inline-size: 100%; block-size: 100%; object-fit: contain; }
         yuva-product:state(room) > temel-picture[slot="gallery"] { object-fit: cover; }
         yuva-product > [slot="dimensions"] p { margin: 0; }
         yuva-product > [slot="description"] :is(ul, ol) { margin: 0; padding-inline-start: 1.2em; }
         yuva-product > [slot="description"] li + li { margin-block-start: var(--space-3); }`,
      );
      this.#visibleImageChildIndex = childIndex;
    }
    this.#showPhotographKind();
    for (const [index, image] of this.#images.entries()) {
      this.#thumbnailByImage
        .get(image)
        .setAttribute("aria-pressed", String(index === this.#selectedImage));
    }
    this.#preview.hidden = this.#isSpinSelected;
    this.#thumbnails.hidden = this.#isSpinSelected;
    this.#spin.hidden = !this.#isSpinSelected;
    this.#photosButton.setAttribute("aria-pressed", String(!this.#isSpinSelected));
    this.#spinButton.setAttribute("aria-pressed", String(this.#isSpinSelected));
    this.setState("spin", this.#isSpinSelected);
  }
  /** A room photograph fills the stage; a cutout on white sits inside it. */
  #showPhotographKind() {
    const photograph = photoFallbackImage(this.#images[this.#selectedImage]);
    const isDecoded = Boolean(photograph?.complete && photograph.naturalWidth > 0);
    this.setState("room", isDecoded && isRoomPhotograph(photograph));
    if (!photograph || isDecoded) return;
    photograph.addEventListener("load", this.handlePhotographLoad.bind(this), { once: true });
  }
  handlePhotographLoad() {
    this.#showPhotographKind();
  }
  handleGalleryClick(event) {
    const button = event.composedPath().find((entry) => entry instanceof HTMLButtonElement);
    if (!button) return;
    if (button.value === "spin" || button.value === "photos") {
      this.#isSpinSelected = button.value === "spin";
      this.#renderGallery();
    } else if (button.parentElement === this.#thumbnails) this.selectedImage = Number(button.value);
  }
  #writeStructuredData() {
    const name = authoredText(this, "title");
    const scripts = Array.from(
      this.querySelectorAll(':scope > script[type="application/ld+json"]'),
    );
    if (!name) {
      for (const script of scripts) script.remove();
      return;
    }
    const usdPrice = productAmount(this, "usd");
    if (usdPrice === null) return;
    const source = productStructuredData({
      name,
      description: authoredText(this, "summary"),
      images: this.#images.map(photoSourceUrl),
      brand: this.text("brand"),
      pageHref: productPageHref(this),
      usdPrice,
      notice: this.text("notice"),
    });
    const script = scripts[0] ?? node("script", { type: "application/ld+json" });
    if (script.textContent !== source) script.textContent = source;
    if (script.parentElement !== this) this.append(script);
    for (const duplicate of scripts.slice(1)) duplicate.remove();
  }
}

/** Structured text follows the browser's whitespace collapse. @param {YuvaProduct} host @param {string} slot */
function authoredText(host, slot) {
  return (
    host.querySelector(`:scope > [slot='${slot}']`)?.textContent.trim().replace(/\s+/gu, " ") ?? ""
  );
}
customElements.define("yuva-product", YuvaProduct);
