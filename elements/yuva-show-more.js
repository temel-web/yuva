import { css, html } from "/@/runtime/temel-element.js";
import { StoreElement } from "./shared/store-element.js";
import {
  buttonSizeVariables,
  buttonVariantVariables,
} from "/@temel/elements/page-essentials/page-essential-element.js";

const styles = css`
  :host { display: grid; justify-items: center; gap: var(--space-3); padding-block-start: var(--space-6); }
  :host([hidden]) { display: none; }
  button { ${buttonSizeVariables("l")} ${buttonVariantVariables("outline")} }
  :host(.loading) button { cursor: progress; opacity: 0.6; }
  .error { margin: 0; color: var(--text-muted); }
  :host(:not(.error)) .error { display: none; }
`;

/**
 * Shows more results of the query that contains it. The query loads the next batch when the button
 * is activated, marks this element `loading` meanwhile and `error` after a failed load, and hides it
 * when no results remain.
 */
export class YuvaShowMore extends StoreElement {
  static preferenceTopics = Object.freeze([]);
  static styles = [...super.styles, styles];
  static template = html`
    <button type="button"><slot></slot></button>
    <p class="error status"><slot name="error"></slot></p>
    <slot name="provenance"></slot>
  `;
}
customElements.define("yuva-show-more", YuvaShowMore);
