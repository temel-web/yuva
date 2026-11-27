import { AnimationController } from "/@/runtime/animation-controller.js";
import { TemelElement, css, html } from "/@/runtime/temel-element.js";
import "/@/runtime/temel-provenance.js";

const SPEED_PX_PER_SEC = Object.freeze({
  slow: 42,
  normal: 76,
  fast: 124,
});

const styles = css`
  :host {
    display: block;
    container-type: inline-size;
    background: var(--accent);
    color: var(--text-on-accent);
    border-block-end: var(--border-width-thick) solid var(--border-strong);
  }

  :host([emphasis="ink"]) {
    background: var(--text-primary);
    color: var(--text-inverse);
  }

  :host([emphasis="paper"]) {
    background: var(--surface-card);
    color: var(--text-primary);
  }

  .band {
    position: relative;
    overflow: hidden;
    padding-block: var(--space-5);
  }

  .track {
    display: flex;
    align-items: center;
    inline-size: max-content;
    will-change: transform;
  }

  .unit {
    display: inline-flex;
    align-items: center;
    gap: var(--space-7);
    padding-inline-end: var(--space-7);
    white-space: nowrap;
    font: var(--weight-bold) clamp(var(--text-lg), 2.4cqi, var(--text-3xl)) / 1 var(--font-display);
    letter-spacing: var(--tracking-tight);
    text-transform: uppercase;
  }

  .glyph {
    display: inline-block;
    flex: none;
    inline-size: 0.55em;
    block-size: 0.55em;
    background: currentColor;
    transform-origin: center;
  }

  :host([emphasis="paper"]) .glyph {
    background: var(--accent);
  }

  .source {
    display: inline-flex;
    align-items: center;
  }

  .clone {
    display: inline-block;
  }

  slot {
    display: inline-block;
    min-inline-size: var(--space-7);
    min-block-size: 1em;
  }

  slot[name="provenance"] {
    display: block;
    min-inline-size: 0;
    min-block-size: 0;
  }

  ::slotted(*) {
    margin: 0;
    font: inherit;
    color: inherit;
    text-transform: inherit;
  }

  @media (forced-colors: active) {
    :host {
      border-color: CanvasText;
    }
  }
`;

const template = html`
  <div class="band">
    <div class="track">
      <div class="unit primary-unit">
        <span class="glyph" aria-hidden="true"></span>
        <span id="marquee-source" class="source"><slot></slot></span>
      </div>
      <div class="unit" aria-hidden="true">
        <span class="glyph"></span>
        <span class="clone"></span>
      </div>
      <div class="unit" aria-hidden="true">
        <span class="glyph"></span>
        <span class="clone"></span>
      </div>
      <div class="unit" aria-hidden="true">
        <span class="glyph"></span>
        <span class="clone"></span>
      </div>
    </div>
  </div>
  <slot name="provenance"></slot>
`;

/**
 * Swiss Brutalist kinetic marquee driven by AnimationController.
 * Accessibility: primary phrase lives once in the default slot; decorative repeats are aria-hidden.
 * JSON-LD: none; typographic motion band without standalone structured-data entity.
 */
export class YuvaKineticMarquee extends TemelElement(HTMLElement) {
  static observedAttributes = ["emphasis", "speed", "direction"];
  static styles = styles;
  static template = template;

  #animation;
  #band;
  #track;
  #primaryUnit;
  #clones = [];
  #glyphs = [];
  #offset = 0;
  #hovered = false;
  #currentFactor = 1;
  #onSlotChange;
  #phraseObserver = new MutationObserver(() => this.#syncClones());
  #onEnter;
  #onLeave;

  constructor() {
    super();
    this.#animation = new AnimationController({
      element: this,
      drawFrame: ({ time, delta }) => this.#drawFrame(time, delta),
    });
    this.#onSlotChange = () => this.#syncClones();
    this.#onEnter = () => {
      this.#hovered = true;
    };
    this.#onLeave = () => {
      this.#hovered = false;
    };
  }

  get animation() {
    return this.#animation;
  }

  connectedCallback() {
    super.connectedCallback();
    const root = this.shadowRoot;
    this.#band = root?.querySelector(".band") ?? null;
    this.#track = root?.querySelector(".track") ?? null;
    this.#primaryUnit = root?.querySelector(".primary-unit") ?? null;
    this.#clones = [...(root?.querySelectorAll(".clone") ?? [])];
    this.#glyphs = [...(root?.querySelectorAll(".glyph") ?? [])];
    root?.addEventListener("slotchange", this.#onSlotChange);
    // Editing text inside an assigned node does not fire slotchange.
    this.#phraseObserver.observe(this, { childList: true, characterData: true, subtree: true });
    this.#band?.addEventListener("pointerenter", this.#onEnter);
    this.#band?.addEventListener("pointerleave", this.#onLeave);
    this.#syncClones();
    this.#animation.connect();
  }

  disconnectedCallback() {
    this.shadowRoot?.removeEventListener("slotchange", this.#onSlotChange);
    this.#phraseObserver.disconnect();
    this.#band?.removeEventListener("pointerenter", this.#onEnter);
    this.#band?.removeEventListener("pointerleave", this.#onLeave);
    this.#animation.disconnect();
    super.disconnectedCallback();
  }

  onTemel() {
    super.onTemel();
    this.#syncClones();
  }

  #syncClones() {
    const slot = this.shadowRoot?.querySelector("slot:not([name])");
    const assigned = slot ? slot.assignedNodes({ flatten: true }) : [];
    const text = assigned
      .map((node) => node.textContent ?? "")
      .join(" ")
      .replace(/\s+/gu, " ")
      .trim();
    for (const clone of this.#clones) {
      if (clone.textContent !== text) clone.textContent = text;
    }
  }

  #drawFrame(time, delta) {
    if (!this.#track) return;
    if (time === 0) {
      this.#offset = 0;
      this.#currentFactor = 1;
      this.#track.style.transform = "translate3d(0px, 0px, 0px)";
      for (const glyph of this.#glyphs) {
        glyph.style.transform = "rotate(0deg)";
      }
      return;
    }

    const unitWidth = this.#primaryUnit?.getBoundingClientRect().width || 0;
    if (unitWidth <= 0) return;

    const speedName = this.getAttribute("speed") ?? "normal";
    const baseSpeed = SPEED_PX_PER_SEC[speedName] ?? SPEED_PX_PER_SEC.normal;
    const targetFactor = this.#hovered ? 0.2 : 1;
    const ease = Math.min(1, Math.max(0.05, delta * 8));
    this.#currentFactor += (targetFactor - this.#currentFactor) * ease;

    const direction = this.getAttribute("direction") === "right" ? 1 : -1;
    this.#offset = (this.#offset + direction * baseSpeed * this.#currentFactor * delta) % unitWidth;
    const x = this.#offset > 0 ? this.#offset - unitWidth : this.#offset;
    this.#track.style.transform = `translate3d(${x.toFixed(2)}px, 0px, 0px)`;

    const angle = ((time * 90 * (direction === 1 ? 1 : -1)) % 360).toFixed(1);
    for (const glyph of this.#glyphs) {
      glyph.style.transform = `rotate(${angle}deg)`;
    }
  }
}

customElements.define("yuva-kinetic-marquee", YuvaKineticMarquee);
