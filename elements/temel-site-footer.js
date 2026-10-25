import { node, layoutTemplate } from "./page-essentials/layout-template.js";
import { PageEssentialElement } from "./page-essentials/page-essential-element.js";

const styles = new CSSStyleSheet();
styles.replaceSync(`
 :host { border-block-start: var(--border-width) var(--border-style) var(--border-default); }
 .closing { display: grid; gap: var(--space-9); }
 :host(:state(introduced)) .introduction { margin-block-end: 0; }
 .message, .invitation { display: grid; align-content: end; min-inline-size: 0; }
 .heading { font: var(--weight-semibold) clamp(var(--text-4xl), 6cqi, 6rem)/1.02 var(--font-ui); letter-spacing: -0.035em; max-inline-size: 18ch; }
 .summary { max-inline-size: 36ch; }
 .actions.is-filled { margin-block-start: var(--space-8); }
 .note { color: var(--text-secondary); font: var(--type-caption); }
 .note.is-filled { margin-block-start: var(--space-5); }
 .closing:not(:has(.is-filled)), .closing:not(:has(.is-filled)) > * { display: flex; gap: 0; }
 .closing:not(:has(.is-filled)) :is(.message, .invitation, slot) { flex: 1; }
 :host(:state(introduced)) .closing {
   border-block-end: var(--border-width) solid var(--border-default); margin-block-end: var(--space-10);
   padding-block-end: var(--space-10);
 }
 .links { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr)); gap: var(--space-9); }
 .base {
   display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
   gap: var(--space-6) var(--space-9); margin-block-start: var(--space-9);
 }
 .colophon { color: var(--text-secondary); font: var(--type-caption); max-inline-size: 64ch; }
 .links { padding-block: var(--space-6); }
 .links::slotted(temel-site-nav) { min-inline-size: 0; }
 .base { align-items: start; border-block-start: var(--border-width) solid var(--border-default); padding-block-start: var(--space-8); }
 @container (min-width: 42rem) {
   .closing { grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); gap: var(--space-12); align-items: end; }
   .invitation { padding-block-end: var(--space-3); }
 }
`);

const layout = layoutTemplate(
  node("div", { class: "closing" }, [
    node("div", { class: "message introduction", part: "introduction" }, [
      node("slot", { name: "eyebrow", class: "text-slot" }),
      node("slot", { name: "heading", class: "text-slot" }),
    ]),
    node("div", { class: "invitation" }, [
      node("slot", { name: "summary", class: "text-slot" }),
      node("slot", { name: "actions" }),
      node("slot", { name: "note", class: "text-slot" }),
    ]),
  ]),
  node("slot", { name: "links" }),
  node("div", { class: "base" }, [
    node("slot", { name: "brand" }),
    node("slot", { name: "colophon", class: "text-slot" }),
  ]),
  node("slot", { name: "provenance" }),
);

/** The site's closing band: an optional invitation, navigation groups, identity, and credits. */
export class TemelSiteFooter extends PageEssentialElement {
  static temelSlots = [
    "eyebrow",
    "heading",
    "summary",
    "actions",
    "note",
    "links",
    "brand",
    "colophon",
    "provenance",
  ];
  static introductionSlots = Object.freeze(["eyebrow", "heading", "summary", "note"]);
  static layout = layout;
  static pageEssentialsStyles = styles;
}

customElements.define(
  "temel-site-footer",
  /** @type {CustomElementConstructor} */ (/** @type {unknown} */ (TemelSiteFooter)),
);
