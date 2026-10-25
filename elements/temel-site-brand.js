import {
  node,
  layoutTemplate,
  svgNode,
} from "./page-essentials/layout-template.js";
import { PageEssentialElement } from "./page-essentials/page-essential-element.js";

const styles = new CSSStyleSheet();
styles.replaceSync(`
 :host {
   container-type: normal;
   font: var(--weight-bold) var(--text-5xl)/1 var(--font-ui);
   letter-spacing: var(--tracking-tight);
 }
 :host([size="display"]) { font-size: clamp(var(--text-5xl), 7cqi, 6rem); }
 .identity { display: flex; align-items: center; gap: var(--space-4); position: relative; }
 a { display: block; flex: 0 1 auto; min-inline-size: 0; max-inline-size: 100%; color: inherit; text-decoration: none; }
 a:not([href]) { display: contents; }
 .logo { display: block; min-inline-size: var(--space-2); max-inline-size: 100%; }
 .logo::slotted(:is(img, temel-picture)) { display: block; block-size: auto; max-inline-size: min(13rem, 100%); }
 :host([size="compact"]) .logo::slotted(:is(img, temel-picture)) { inline-size: var(--space-10); }
 :host([size="display"]) .logo::slotted(:is(img, temel-picture)) { inline-size: 12rem; }
 .identity:not(:has(.default.is-filled)) .logo::slotted(:is(img, temel-picture)) { inline-size: 100%; }
 .wordmark { display: block; inline-size: calc(var(--space-12) * 2); max-inline-size: 100%; block-size: auto; }
 .wordmark[hidden] { display: none; }
 :host([size="compact"]) .wordmark { inline-size: var(--space-14); }
 :host([size="display"]) .wordmark { inline-size: calc(var(--space-14) * 2); }
 :host(:state(wordmark)) .text-slot {
   position: absolute; inset: 0; opacity: 0; pointer-events: none;
 }
 :host(:state(wordmark)) .logo { display: none; }
 @media (forced-colors: active) {
   :host(:state(wordmark)) .wordmark { display: none; }
   :host(:state(wordmark)) .text-slot { position: static; opacity: 1; pointer-events: auto; }
 }
`);

const documentStyles = new CSSStyleSheet();
documentStyles.replaceSync(`
 temel-site-brand > span a {
   display: inline-flex; align-items: center; justify-content: center;
   min-inline-size: calc(var(--space-11) + var(--space-2));
   min-block-size: calc(var(--space-11) + var(--space-2));
 }
`);

const layout = layoutTemplate(
  node("div", { class: "identity" }, [
    node("a", {}, [
      svgNode(
        "svg",
        {
          class: "wordmark",
          viewBox: "0 0 160 64",
          "aria-hidden": "true",
          hidden: "",
        },
        [
          svgNode("defs", {}, [
            svgNode("mask", { id: "wordmark-mask", "mask-type": "alpha" }, [
              svgNode("image", { width: "160", height: "64" }),
            ]),
          ]),
          svgNode("rect", {
            width: "160",
            height: "64",
            fill: "currentColor",
            mask: "url(#wordmark-mask)",
          }),
        ],
      ),
      node("slot", { name: "logo" }),
    ]),
    node("slot", { class: "text-slot" }),
  ]),
  node("slot", { name: "provenance" }),
);

/** A site identity: an optional logo beside an editable name or home link. */
export class TemelSiteBrand extends PageEssentialElement {
  static temelSlots = ["logo", "", "provenance"];
  static layout = layout;
  static pageEssentialsStyles = styles;
  static observedAttributes = ["href", "wordmark"];

  connectedCallback() {
    const root = /** @type {Document | ShadowRoot} */ (this.getRootNode());
    if (!root.adoptedStyleSheets.includes(documentStyles)) {
      root.adoptedStyleSheets = [...root.adoptedStyleSheets, documentStyles];
    }
    super.connectedCallback();
  }

  handleSlotChange() {
    super.handleSlotChange();
    this.#syncDestination();
  }

  attributeChangedCallback() {
    if (this.shadowRoot.firstElementChild) this.#syncDestination();
  }

  #syncDestination() {
    const link = this.shadowRoot.querySelector("a");
    const href = this.getAttribute("href");
    const wordmark = this.getAttribute("wordmark");
    const hasWordmark = Boolean(wordmark);
    const graphic = this.shadowRoot.querySelector(".wordmark");
    const image = graphic.querySelector("image");
    const nameSlot = this.layoutSlot("");
    graphic.toggleAttribute("hidden", !hasWordmark);
    this.toggleCustomState("wordmark", hasWordmark);
    if (hasWordmark && nameSlot.parentElement !== link) link.append(nameSlot);
    else if (!hasWordmark && nameSlot.parentElement === link)
      link.after(nameSlot);
    if (hasWordmark) image.setAttribute("href", wordmark);
    else image.removeAttribute("href");
    if (href === null || (!hasWordmark && this.assignedTo("logo").length === 0))
      link.removeAttribute("href");
    else link.setAttribute("href", href);
  }
}

customElements.define(
  "temel-site-brand",
  /** @type {CustomElementConstructor} */ (
    /** @type {unknown} */ (TemelSiteBrand)
  ),
);
