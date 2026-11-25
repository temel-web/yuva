import { TemelElement } from "/@/runtime/temel-element.js";
import "/@/runtime/temel-provenance.js";

const UNITS = ["days", "hours", "minutes", "seconds"];
const UNIT_SECONDS = [86400, 3600, 60, 1];
const DEADLINE_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/u;

const template = document.createElement("template");
template.innerHTML = `
  <section class="banner" aria-labelledby="countdown-heading">
    <div id="countdown-heading" class="heading"><slot></slot></div>
    <div class="timer" role="timer" aria-labelledby="countdown-heading">
      <div class="unit"><span class="number"></span><span class="unit-label"><slot name="days"></slot></span></div>
      <span class="separator" aria-hidden="true">:</span>
      <div class="unit"><span class="number"></span><span class="unit-label"><slot name="hours"></slot></span></div>
      <span class="separator" aria-hidden="true">:</span>
      <div class="unit"><span class="number"></span><span class="unit-label"><slot name="minutes"></slot></span></div>
      <span class="separator" aria-hidden="true">:</span>
      <div class="unit"><span class="number"></span><span class="unit-label"><slot name="seconds"></slot></span></div>
    </div>
    <time class="deadline"><slot name="deadline-label"></slot></time>
  </section>
  <slot name="provenance"></slot>
`;

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    display: block;
    container-type: inline-size;
    background: var(--surface-panel);
    border-block: var(--border-width) solid var(--border-subtle);
    border-block-start: var(--border-width-thick) solid var(--accent);
    color: var(--text-primary);
  }
  .banner {
    display: grid;
    justify-items: center;
    align-items: center;
    gap: var(--space-6);
    box-sizing: border-box;
    padding: var(--space-7) max(clamp(var(--space-7), 4%, var(--space-11)), calc((100% - 80rem) / 2));
    text-align: center;
    overflow-wrap: anywhere;
  }
  .heading {
    font: var(--weight-regular) clamp(var(--text-xl), 2.4cqi, var(--text-2xl)) / var(--leading-snug) var(--font-display);
    letter-spacing: var(--tracking-snug);
    color: var(--text-primary);
    text-wrap: balance;
  }
  .deadline {
    font: var(--weight-medium) var(--text-xs) / var(--leading-ui) var(--font-mono);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    color: var(--text-secondary);
  }
  .timer {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: var(--space-1);
    font-family: var(--font-mono);
  }
  .unit {
    display: grid;
    justify-items: center;
    gap: var(--space-2);
    min-inline-size: 0;
    padding: var(--space-3) var(--space-2);
    background: var(--surface-raised);
    border: var(--border-width) solid var(--border-subtle);
    border-radius: var(--radius-xs);
  }
  .number {
    font-size: var(--text-xl);
    font-weight: var(--weight-semibold);
    line-height: var(--leading-tight);
    font-variant-numeric: tabular-nums;
    color: var(--accent-text);
  }
  .separator {
    font-size: var(--text-lg);
    font-weight: var(--weight-medium);
    line-height: var(--leading-tight);
    color: var(--text-muted);
    padding-inline: 0;
  }
  .unit-label {
    font-family: var(--font-ui);
    font-size: var(--text-2xs);
    font-weight: var(--weight-medium);
    line-height: var(--leading-ui);
    letter-spacing: var(--tracking-caps);
    text-transform: uppercase;
    color: var(--text-muted);
  }
  slot {
    display: block;
    min-inline-size: var(--space-3);
    min-block-size: 1em;
  }
  slot[name="provenance"] {
    display: block;
    min-inline-size: 0;
    min-block-size: 0;
  }
  @container (min-width: 24rem) {
    .timer {
      gap: var(--space-2);
    }
    .unit {
      min-inline-size: 3.75ch;
      padding: var(--space-3) var(--space-4);
    }
    .number {
      font-size: var(--text-2xl);
    }
    .separator {
      font-size: var(--text-xl);
      padding-inline: var(--space-1);
    }
  }
  @container (min-width: 48rem) {
    .banner {
      grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
      gap: var(--space-7);
    }
    .heading {
      justify-self: start;
      text-align: start;
    }
    .deadline {
      justify-self: end;
      text-align: end;
    }
    .timer {
      gap: var(--space-3);
    }
    .unit {
      min-inline-size: 4.5ch;
      padding: var(--space-4) var(--space-5);
    }
    .number {
      font-size: var(--text-3xl);
    }
  }
  @media (forced-colors: active) {
    :host {
      border-color: CanvasText;
    }
    .unit {
      border-color: CanvasText;
    }
  }
`);

/** Count down to an authored deadline without announcing each tick. */
export class YuvaCountdownBanner extends TemelElement(HTMLElement) {
  static observedAttributes = ["deadline"];
  static temelSlots = ["", "deadline-label", ...UNITS, "provenance"];

  #deadline;
  #unitSlots;
  #headingSlot;
  #deadlineSlot;
  #provenanceSlot;
  #values;
  #timeoutId = undefined;

  constructor() {
    super();
    const root = this.attachShadow({ mode: "open" });
    root.adoptedStyleSheets = [styles];
    root.append(template.content.cloneNode(true));
    this.#deadline = /** @type {HTMLTimeElement} */ (root.querySelector(".deadline"));
    this.#values = [...root.querySelectorAll(".number")];
    this.#headingSlot = /** @type {HTMLSlotElement} */ (root.querySelector(".heading > slot"));
    this.#deadlineSlot = /** @type {HTMLSlotElement} */ (root.querySelector(".deadline > slot"));
    this.#provenanceSlot = /** @type {HTMLSlotElement} */ (
      root.querySelector('slot[name="provenance"]')
    );
    const labelSlots = [...root.querySelectorAll(".unit-label > slot")];
    this.#unitSlots = UNITS.map((unitName, index) => ({
      unitName,
      slot: /** @type {HTMLSlotElement} */ (labelSlots[index]),
    }));
  }

  connectedCallback() {
    super.connectedCallback();
    this.#update();
  }

  disconnectedCallback() {
    clearTimeout(this.#timeoutId);
    this.#timeoutId = undefined;
    super.disconnectedCallback();
  }

  attributeChangedCallback() {
    if (this.isConnected) this.#update();
  }

  onTemel() {
    this.#headingSlot = replaceSlot(this.#headingSlot, this.temelSlot(""));
    this.#deadlineSlot = replaceSlot(this.#deadlineSlot, this.temelSlot("deadline-label"));
    for (const entry of this.#unitSlots) {
      entry.slot = replaceSlot(entry.slot, this.temelSlot(entry.unitName));
    }
    this.#provenanceSlot = replaceSlot(this.#provenanceSlot, this.temelSlot("provenance"));
  }

  #update() {
    clearTimeout(this.#timeoutId);
    this.#timeoutId = undefined;
    const deadline = this.getAttribute("deadline") ?? "";
    const timestampMs = DEADLINE_PATTERN.test(deadline) ? Date.parse(deadline) : NaN;
    if (!Number.isFinite(timestampMs)) {
      this.#deadline.removeAttribute("datetime");
      for (const value of this.#values) value.textContent = "";
      return;
    }
    this.#deadline.dateTime = deadline;
    const remainingMs = Math.max(0, timestampMs - Date.now());
    let remainingSeconds = Math.ceil(remainingMs / 1000);
    for (const [index, unitSeconds] of UNIT_SECONDS.entries()) {
      const count = Math.floor(remainingSeconds / unitSeconds);
      this.#values[index].textContent = String(count).padStart(2, "0");
      remainingSeconds %= unitSeconds;
    }
    if (remainingMs > 0) {
      this.#timeoutId = setTimeout(this.#update.bind(this), remainingMs % 1000 || 1000);
    }
  }
}

/** @param {HTMLSlotElement} current @param {HTMLSlotElement} next */
function replaceSlot(current, next) {
  current.replaceWith(next);
  return next;
}

customElements.define("yuva-countdown-banner", YuvaCountdownBanner);
