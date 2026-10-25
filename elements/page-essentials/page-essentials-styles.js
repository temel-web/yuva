import {
  PAGE_BAR_ELEMENT_TAGS,
  PAGE_BLOCK_ELEMENT_TAGS,
  PAGE_ESSENTIAL_ELEMENT_TAGS,
} from "./page-essential-element-tags.js";

/**
 * Band padding per `padding` value. Each level scales with the band's width and reaches its full
 * Design System spacing from about 800px, so narrow screens keep room for content.
 */
const SPACIOUS_PADDING = "clamp(var(--space-7), 5%, var(--space-11))";
const BLOCK_PADDINGS = Object.freeze(
  [
    ["none", "var(--space-0)", null],
    ["compact", "clamp(var(--space-5), 2.5%, var(--space-7))"],
    ["comfortable", "clamp(var(--space-7), 4%, var(--space-9))"],
    ["spacious", SPACIOUS_PADDING],
  ].map(([name, padding, length = padding]) => [name, padding, length]),
);
const CONTENT_WIDTHS = Object.freeze([
  ["wide", "80rem"],
  ["reading", "48rem"],
]);
const SURFACED =
  ':is([surface="muted"], [surface="outlined"], [surface="raised"], [surface="accent"])';
const BLOCKS = `:where(${PAGE_BLOCK_ELEMENT_TAGS.join(", ")})`;
const BARS = `:is(${PAGE_BAR_ELEMENT_TAGS.join(", ")})`;
const LANDMARK_BLOCKS = `:is(header, main, footer, temel-elements) > ${BLOCKS}`;
const ESSENTIALS = `:where(${PAGE_ESSENTIAL_ELEMENT_TAGS.join(", ")})`;

/** Inline padding that keeps the band full-bleed while its content centers within `measure`. */
function centeredInlinePadding(padding, measure) {
  const centered = `(100% - ${measure}) / 2`;
  return padding === null ? `calc(${centered})` : `max(${padding}, ${centered})`;
}

/** Padding, width, and inset-card rules for one padding context. */
function paddingContextRules(selector, padding, length) {
  const inner = length === null ? "var(--space-7)" : `max(${length}, var(--space-7))`;
  const barPadding = length === null ? padding : `calc(${length} / 2)`;
  const rules = [
    `${selector}:not(${SURFACED}) { padding: ${padding}; }`,
    `${selector}:not(${SURFACED})${BARS} { padding-block: ${barPadding}; }`,
    `${selector}${SURFACED} { padding: ${inner}; }`,
    `${selector}${SURFACED}${BARS} { padding-block: calc(${inner} / 2); }`,
  ];
  for (const [width, measure] of CONTENT_WIDTHS) {
    rules.push(
      `${selector}:not(${SURFACED})[width="${width}"] { padding-inline: ${centeredInlinePadding(length, measure)}; }`,
    );
  }
  return rules;
}

/** A surfaced block directly inside a landmark becomes an inset card: band padding becomes margin. */
function insetCardRules(selector, padding, length) {
  const rules = [`${selector}${SURFACED} { margin: ${padding}; }`];
  for (const [width, measure] of CONTENT_WIDTHS) {
    rules.push(
      `${selector}${SURFACED}[width="${width}"] { margin-inline: ${centeredInlinePadding(length, measure)}; max-inline-size: none; }`,
    );
  }
  return rules;
}

function blockContractRules() {
  const rules = [
    `${BLOCKS}:is([color-scheme="light"], [color-scheme="dark"]) { background-color: var(--background-color); }`,
    `${BLOCKS}${SURFACED} { border-radius: var(--radius-lg); }`,
    `${BLOCKS}[surface="muted"] { background-color: var(--surface-panel); }`,
    `${BLOCKS}[surface="outlined"] { border: var(--border-width) var(--border-style) var(--border-default); }`,
    `${BLOCKS}[surface="raised"] { background-color: var(--surface-raised); border: var(--border-width) var(--border-style) var(--border-subtle); box-shadow: var(--shadow-widget); }`,
    `${BLOCKS}[surface="accent"] { background-color: var(--accent-subtle); }`,
    `${BLOCKS}${SURFACED}:is([width="wide"], [width="reading"]) { margin-inline: auto; }`,
    `${BLOCKS}${SURFACED}[width="wide"] { max-inline-size: 80rem; }`,
    `${BLOCKS}${SURFACED}[width="reading"] { max-inline-size: 48rem; }`,
    ...paddingContextRules(`${BLOCKS}:not([padding])`, "var(--space-0)", null),
    ...paddingContextRules(`${LANDMARK_BLOCKS}:not([padding])`, SPACIOUS_PADDING, SPACIOUS_PADDING),
    ...insetCardRules(`${LANDMARK_BLOCKS}:not([padding])`, SPACIOUS_PADDING, SPACIOUS_PADDING),
  ];
  for (const [name, padding, length] of BLOCK_PADDINGS) {
    rules.push(...paddingContextRules(`${BLOCKS}[padding="${name}"]`, padding, length));
    rules.push(...insetCardRules(`${LANDMARK_BLOCKS}[padding="${name}"]`, padding, length));
  }
  rules.push(
    `${BLOCKS}[background="muted"] { background-color: var(--surface-panel); }`,
    `${BLOCKS}[background="accent"] { background-color: var(--accent-subtle); }`,
    `${BLOCKS}[background="glow"] {
      background-image:
        radial-gradient(90% 120% at 0% 0%, color-mix(in srgb, var(--brand-center) 20%, transparent), transparent 60%),
        radial-gradient(80% 110% at 100% 100%, color-mix(in srgb, var(--brand-edge) 16%, transparent), transparent 60%);
    }`,
  );
  return rules.join("\n");
}

/** Shared typography, introduction, focus, and canonical Design System presentation. */
export const pageEssentialsFoundationStyles = new CSSStyleSheet();
pageEssentialsFoundationStyles.replaceSync(`
  :host {
    box-sizing: border-box;
    color: var(--text-primary);
    container-type: inline-size;
    display: block;
    font: var(--weight-regular) var(--text-lg)/var(--leading-body) var(--font-ui);
    min-inline-size: 0;
    overflow-wrap: anywhere;
  }
  :host([hidden]) { display: none; }
  :host([color-scheme="light"]) { color-scheme: light; }
  :host([color-scheme="dark"]) { color-scheme: dark; }
  :host(:is([color-scheme="light"], [color-scheme="dark"])) { background-color: var(--background-color); }
  :host(${SURFACED}) { border-radius: var(--radius-lg); padding: var(--space-9); }
  :host([surface="muted"]) { background-color: var(--surface-panel); }
  :host([surface="outlined"]) { border: var(--border-width) var(--border-style) var(--border-default); }
  :host([surface="raised"]) {
    background-color: var(--surface-raised); box-shadow: var(--shadow-widget);
    border: var(--border-width) var(--border-style) var(--border-subtle);
  }
  :host([surface="accent"]) { background-color: var(--accent-subtle); }
  *, *::before, *::after { box-sizing: border-box; }
  slot { display: block; min-inline-size: var(--space-2); min-block-size: var(--space-2); }
  slot::slotted(*) { box-sizing: border-box; max-inline-size: 100%; }
  slot.text-slot::slotted(*) {
    color: inherit; font: inherit; letter-spacing: inherit; margin: 0; text-wrap: inherit;
  }
  slot[name="provenance"] { display: contents; min-block-size: 0; font: var(--type-caption); }
  .introduction { display: grid; justify-items: stretch; min-inline-size: 0; }
  .eyebrow {
    color: var(--accent-text); font: var(--weight-semibold) var(--text-sm)/var(--leading-ui) var(--font-ui);
    letter-spacing: var(--tracking-caps);
  }
  .heading {
    font: var(--weight-regular) clamp(var(--text-3xl), 4cqi, var(--text-5xl))/var(--leading-tight) var(--font-display);
    letter-spacing: var(--tracking-tight); text-wrap: balance;
  }
  .summary {
    color: var(--text-secondary); font-size: clamp(var(--text-lg), 1.8cqi, var(--text-xl));
    max-inline-size: 62ch;
  }
  .introduction > slot.eyebrow.is-filled ~ slot.heading.is-filled { margin-block-start: var(--space-5); }
  .introduction > slot.is-filled ~ slot.summary.is-filled { margin-block-start: var(--space-7); }
  :host(:state(introduced)) .introduction { margin-block-end: var(--space-10); }
  .caption, .credit {
    color: var(--text-secondary); font: var(--weight-regular) var(--text-sm)/var(--leading-body) var(--font-ui);
  }
  slot::slotted(a) { color: var(--text-link); text-underline-offset: .2em; }
  slot::slotted(a:hover) { color: var(--text-link-hover); }
  :focus-visible, slot::slotted(:focus-visible) {
    outline: var(--focus-ring-width) solid var(--border-focus);
    outline-offset: var(--focus-ring-offset);
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { scroll-behavior: auto; transition: none; animation: none; }
  }
  @media (forced-colors: active) { :host { border-color: CanvasText; } }
`);

/**
 * Document-level rules: the block contract, which depends on the block's parent landmark, and
 * native rich-text descendants inside document Slots, which shadow `::slotted` cannot reach.
 */
export const pageEssentialsDocumentStyles = new CSSStyleSheet();
pageEssentialsDocumentStyles.replaceSync(`
  ${blockContractRules()}
  ${ESSENTIALS} > :where(div, p, span, h1, h2, h3, h4, cite, strong) a {
    color: var(--text-link); text-underline-offset: .2em;
  }
  ${ESSENTIALS} > :where(div, p, span, h1, h2, h3, h4, cite, strong) a:hover { color: var(--text-link-hover); }
  ${ESSENTIALS} > :where(div, p, span, h1, h2, h3, h4, cite, strong) :focus-visible {
    outline: var(--focus-ring-width) solid var(--border-focus); outline-offset: var(--focus-ring-offset);
  }
  ${ESSENTIALS} > div :where(p, ul, ol) { margin-block: 0 var(--space-7); }
  ${ESSENTIALS} > div > :last-child { margin-block-end: 0; }
  ${ESSENTIALS} > div :where(ul, ol) { padding-inline-start: var(--space-10); }
  ${ESSENTIALS} > div li + li { margin-block-start: var(--space-4); }
  ${ESSENTIALS} > div li > p { margin-block-end: 0; }
  ${ESSENTIALS} > div li::marker { color: var(--accent-text); }
  ${ESSENTIALS} > div :where(h2, h3, h4, h5, h6) {
    color: var(--text-primary); font-family: var(--font-display); font-weight: var(--weight-semibold);
    line-height: var(--leading-tight); letter-spacing: var(--tracking-tight); text-wrap: balance;
    margin-block: var(--space-10) var(--space-6);
  }
  ${ESSENTIALS} > div h2 { font-size: var(--text-3xl); }
  ${ESSENTIALS} > div h3 { font-size: var(--text-2xl); }
  ${ESSENTIALS} > div :where(h4, h5, h6) { font-size: var(--text-xl); }
  ${ESSENTIALS} > div > :where(h2, h3, h4, h5, h6):first-child { margin-block-start: 0; }
  temel-announcement:not([tone="subtle"], [tone="muted"]) {
    background-color: var(--accent); color: var(--text-on-accent);
  }
  temel-announcement[tone="subtle"] { background-color: var(--accent-subtle); color: var(--text-primary); }
  temel-announcement[tone="muted"] { background-color: var(--surface-panel); color: var(--text-primary); }
  temel-announcement > p a {
    color: inherit; font-weight: var(--weight-semibold); text-decoration: underline;
    text-underline-offset: .2em;
  }
  temel-announcement > p a:focus-visible { outline-color: currentColor; }
  temel-site-brand > span a { color: inherit; text-decoration: none; }
  temel-site-brand > span a:hover { text-decoration: underline; }
  temel-content-card > :where(h2, h3, h4) a {
    color: inherit; text-decoration-color: transparent; text-underline-offset: .2em;
    transition: text-decoration-color var(--dur-base) var(--ease-out);
  }
  temel-content-card > :where(h2, h3, h4) a:hover { text-decoration-color: currentColor; }
  temel-content-card[link="card"] { position: relative; }
  temel-content-card[link="card"] > :where(h2, h3, h4) a::after {
    content: ""; position: absolute; inset: 0; border-radius: inherit;
  }
  temel-content-card[link="card"] > :where(h2, h3, h4) a:focus-visible { outline: none; }
  temel-content-card[link="card"]:has(> :where(h2, h3, h4) a:focus-visible) {
    outline: var(--focus-ring-width) solid var(--border-focus); outline-offset: var(--focus-ring-offset);
  }
  temel-content-card[link="card"] > :is(temel-action-group, div, span) :is(a, button),
  temel-content-card[link="card"] > temel-action-group { position: relative; z-index: 1; }
  temel-content-card${SURFACED}:has(a[href]):hover { border-color: var(--border-strong); box-shadow: var(--shadow-menu); }
  temel-content-card > temel-figure > :is(img, picture > img, temel-picture > picture > img, temel-media) {
    transition: transform var(--dur-slowest) var(--ease-out);
  }
  @media (prefers-reduced-motion: no-preference) {
    temel-content-card:has(a[href]):hover > temel-figure > :is(img, picture > img, temel-picture > picture > img) {
      transform: scale(1.03);
    }
  }
  temel-pricing-plan > div ul { list-style: none; padding-inline-start: 0; }
  temel-pricing-plan > div ul li { padding-inline-start: calc(1em + var(--space-5)); position: relative; }
  temel-pricing-plan > div ul li::before {
    content: ""; position: absolute; inset-inline-start: 0; inset-block-start: calc((1lh - 1em) / 2);
    inline-size: 1em; block-size: 1em; background: var(--accent-text);
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='m5 12.5 4.5 4.5L19 7.5' fill='none' stroke='black' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center / contain no-repeat;
  }
  temel-figure > picture > img { display: block; inline-size: 100%; block-size: auto; object-fit: inherit; }
  temel-figure[ratio]:not([ratio="auto"]) > picture > img { block-size: 100%; }
  temel-site-header:state(menu) > temel-site-nav::part(links) {
    flex-direction: column; align-items: start; gap: var(--space-5);
  }
  :is(temel-page, body) > header:has(temel-site-header[position="sticky"]) {
    position: sticky; inset-block-start: 0; z-index: var(--z-sticky);
    background: color-mix(in srgb, var(--background-color) 88%, transparent);
    backdrop-filter: var(--blur-overlay) saturate(1.4);
  }
  :is(temel-page, body):has(> header temel-site-header[position="sticky"]) :is(main, footer) [id] {
    scroll-margin-block-start: calc(var(--space-14) + var(--space-13));
  }
`);

/** Adopt the document-level rules once into the root that renders an element. */
export function adoptPageEssentialsDocumentStyles(root) {
  if (root.adoptedStyleSheets.includes(pageEssentialsDocumentStyles)) return;
  root.adoptedStyleSheets = [...root.adoptedStyleSheets, pageEssentialsDocumentStyles];
}
