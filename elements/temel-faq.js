import { node, layoutTemplate } from "./page-essentials/layout-template.js";
import { PageEssentialElement } from "./page-essentials/page-essential-element.js";

import "./temel-faq-item.js";

const styles = new CSSStyleSheet();
styles.replaceSync(`
 .heading { font: var(--weight-semibold) clamp(var(--text-3xl), 4cqi, var(--text-5xl))/1.05 var(--font-ui); letter-spacing: -0.03em; }
 .layout { display: grid; column-gap: var(--space-11); }
 .default { display: grid; border-block-start: var(--border-width) var(--border-style) var(--border-default); }
 .actions.is-filled { margin-block-start: var(--space-10); }
 @container (min-width: 48rem) {
   :host([layout="split"]) .layout { grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); align-items: start; }
   :host([layout="split"]) .introduction { grid-column: 1; grid-row: 1 / span 2; margin-block-end: 0; }
   :host([layout="split"]) :is(.default, .actions) { grid-column: 2; }
 }
`);

const layout = layoutTemplate(
  node("div", { class: "layout" }, [
    node("div", { class: "introduction", part: "introduction" }, [
      node("slot", { name: "eyebrow", class: "text-slot" }),
      node("slot", { name: "heading", class: "text-slot" }),
      node("slot", { name: "summary", class: "text-slot" }),
    ]),
    node("slot"),
    node("slot", { name: "actions" }),
  ]),
  node("slot", { name: "provenance" }),
);

/** A band of frequently asked questions, each a native disclosure, with its introduction. */
export class TemelFaq extends PageEssentialElement {
  static temelSlots = ["eyebrow", "heading", "summary", "", "actions", "provenance"];
  static introductionSlots = Object.freeze(["eyebrow", "heading", "summary"]);
  static layout = layout;
  static pageEssentialsStyles = styles;
}

customElements.define(
  "temel-faq",
  /** @type {CustomElementConstructor} */ (/** @type {unknown} */ (TemelFaq)),
);
