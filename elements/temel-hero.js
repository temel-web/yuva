import { PageEssentialElement } from "./page-essentials/page-essential-element.js";
import { node, layoutTemplate } from "./page-essentials/layout-template.js";

const styles = new CSSStyleSheet();
styles.replaceSync(`
 :host([height="viewport"]) { min-block-size: 100svh; }
 .layout { display: grid; gap: var(--space-10); align-items: center; }
 .layout:has(> .media:not(.is-filled)) { gap: 0; }
 .copy { display: grid; gap: var(--space-8); justify-items: start; min-inline-size: 0; }
 .introduction { inline-size: 100%; }
 :host .introduction > slot.text-slot, :host .copy > slot.actions { display: block; }
 :host(:state(introduced)) .introduction { margin-block-end: 0; }
 .heading {
   font: var(--weight-semibold) clamp(var(--text-4xl), 6.4cqi, 6rem)/1.02 var(--font-ui);
   letter-spacing: -0.035em; max-inline-size: 15ch; text-wrap: balance;
 }
 .summary { font-size: var(--text-lg); line-height: var(--leading-body); max-inline-size: none; }
 .actions { justify-self: stretch; }
 .layout:not(:has(.media.is-filled)) .heading { max-inline-size: none; }
 :host([layout="centered"]) .copy { justify-items: center; text-align: center; }
 :host([layout="centered"]) :is(.introduction, .heading, .summary) { justify-self: center; margin-inline: auto; }
 :host([layout="centered"]) .actions { justify-self: center; }
 :host([layout="study"]) .introduction { position: relative; }
 :host([layout="study"]) .introduction > slot.eyebrow:not(.is-filled) { position: absolute; }
 :host([layout="masthead"]) .heading { max-inline-size: 12ch; }
 @container (min-width: 48rem) {
   :host([layout="split"]) .layout { grid-template-columns: minmax(0, 4fr) minmax(0, 5fr); gap: var(--space-12); }
   :host([layout="masthead"]) .layout {
     grid-template-columns: repeat(12, minmax(0, 1fr)); gap: var(--space-8); align-items: start;
   }
   :host([layout="masthead"]) :is(.copy, .introduction) { display: contents; }
   :host([layout="masthead"]) .heading {
     grid-column: 1 / -1; grid-row: 1; z-index: 1; padding-block-end: var(--space-8);
     font-size: clamp(var(--text-6xl), 7.4cqi, 6rem); max-inline-size: 22ch;
   }
   :host([layout="masthead"]) .eyebrow { grid-column: 1 / -1; }
   :host([layout="masthead"]) .summary { grid-column: 1 / 4; grid-row: 2; }
   :host([layout="masthead"]) .actions { grid-column: 1 / 4; grid-row: 3; align-self: start; }
   :host([layout="masthead"]) .media {
     grid-column: 4 / -1; grid-row: 2 / 4;
   }
   :host([layout="study"]) .layout {
     grid-template-columns: minmax(0, 4fr) minmax(0, 5fr); gap: var(--space-8); align-items: start;
   }
   :host([layout="study"]) .heading {
     font-size: clamp(var(--text-5xl), 5.4cqi, var(--text-6xl)); max-inline-size: 15ch;
   }
   :host([layout="study"]) .layout > slot.media { display: block; min-inline-size: 0; }
   :host([layout="study"]) .layout:not(:has(.media.is-filled)) { grid-template-columns: minmax(0, 1fr); }
   :host([layout="masthead"]) .layout:not(:has(.media.is-filled)) .heading { grid-column: 1 / -1; }
 }
 @container (min-width: 62rem) {
   :host([layout="study"]) .layout { column-gap: var(--space-10); }
 }
 @media (prefers-reduced-motion: no-preference) {
   @supports (animation-timeline: view()) {
     :host([layout="study"]) .layout:has(.media.is-filled) .media:not(:has(> slot)) {
       animation: room-study linear both; animation-timeline: view();
       animation-range: entry 0% exit 100%;
     }
   }
 }
 @keyframes room-study { from { translate: 0 var(--space-4); } to { translate: 0 calc(-1 * var(--space-8)); } }
`);

const layout = layoutTemplate(
  node("div", { class: "layout" }, [
    node("div", { class: "copy" }, [
      node("div", { class: "introduction", part: "introduction" }, [
        node("slot", { name: "eyebrow", class: "text-slot" }),
        node("slot", { name: "heading", class: "text-slot" }),
        node("slot", { name: "summary", class: "text-slot" }),
      ]),
      node("slot", { name: "actions" }),
    ]),
    node("slot", { name: "media" }),
  ]),
  node("slot", { name: "provenance" }),
);

/** An opening room study with grouped copy beside a distinct lead photograph. */
export class TemelHero extends PageEssentialElement {
  static temelSlots = [
    "eyebrow",
    "heading",
    "summary",
    "actions",
    "media",
    "provenance",
  ];
  static introductionSlots = Object.freeze(["eyebrow", "heading", "summary"]);
  static layout = layout;
  static pageEssentialsStyles = styles;
}

customElements.define("temel-hero", TemelHero);
