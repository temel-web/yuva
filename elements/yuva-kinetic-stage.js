import { AnimationController } from "/@/runtime/animation-controller.js";
import { TemelElement, css, html } from "/@/runtime/temel-element.js";
import "/@/runtime/temel-provenance.js";

const TEMPO_RATE = Object.freeze({
  measured: 0.55,
  brisk: 1,
  hyper: 1.7,
});

const styles = css`
  :host {
    display: block;
    container-type: inline-size;
    background: var(--background-color);
    color: var(--text-primary);
    border-block-start: var(--border-width-thick) solid var(--accent);
    border-block-end: var(--border-width-thick) solid var(--border-strong);
  }

  .stage {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    margin-inline: auto;
    max-inline-size: 90rem;
    box-sizing: border-box;
    border-inline: var(--border-width) solid var(--border-strong);
  }

  .copy-pane {
    display: grid;
    align-content: space-between;
    gap: var(--space-8);
    padding: var(--space-8) var(--space-7);
    background: var(--background-color);
    border-block-end: var(--border-width) solid var(--border-strong);
  }

  .meta-bar {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    padding-block-end: var(--space-5);
    border-block-end: var(--border-width) solid var(--border-strong);
    font: var(--weight-semibold) var(--text-xs) / var(--leading-ui) var(--font-mono);
    letter-spacing: var(--tracking-caps);
    text-transform: uppercase;
    color: var(--accent-text);
  }

  .pulse-dot {
    inline-size: var(--space-5);
    block-size: var(--space-5);
    flex: none;
    background: var(--accent);
    border: var(--border-width) solid var(--border-strong);
    transform-origin: center;
  }

  .heading-wrap {
    font: var(--weight-bold) clamp(2.75rem, 8.5cqi, 6.25rem) / 0.9 var(--font-display);
    letter-spacing: var(--tracking-tight);
    text-transform: uppercase;
    color: var(--text-primary);
    text-wrap: balance;
    overflow-wrap: anywhere;
  }

  .summary-wrap {
    max-inline-size: 46ch;
    padding-inline-start: var(--space-6);
    border-inline-start: var(--border-width-thick) solid var(--accent);
    font: var(--type-body);
    color: var(--text-secondary);
  }

  .actions-wrap {
    padding-block-start: var(--space-3);
  }

  .art-pane {
    position: relative;
    display: grid;
    place-items: center;
    padding: var(--space-7);
    background: var(--surface-panel);
    overflow: hidden;
    min-block-size: 20rem;
  }

  .art-frame {
    position: relative;
    inline-size: 100%;
    max-inline-size: 34rem;
    aspect-ratio: 1 / 1;
    background: var(--surface-card);
    border: var(--border-width) solid var(--border-strong);
    box-shadow: var(--shadow-menu);
    overflow: hidden;
    touch-action: pan-y;
  }

  svg {
    display: block;
    inline-size: 100%;
    block-size: 100%;
  }

  .grid-line {
    stroke: var(--border-subtle);
    stroke-width: 1.5;
  }

  :host([grid="sparse"]) .grid-extra {
    opacity: 0;
  }

  .grid-strong {
    stroke: var(--border-strong);
    stroke-width: 2.5;
  }

  .accent-fill {
    fill: var(--accent);
  }

  .accent-stroke {
    stroke: var(--accent);
    stroke-width: 3;
    fill: none;
  }

  .ink-fill {
    fill: var(--text-primary);
  }

  .ink-stroke {
    stroke: var(--text-primary);
    stroke-width: 3;
    fill: none;
  }

  .paper-fill {
    fill: var(--surface-card);
  }

  ::slotted(*) {
    margin: 0;
  }

  ::slotted([slot^="heading"]) {
    margin: 0;
    font: inherit;
    letter-spacing: inherit;
    line-height: inherit;
    text-transform: inherit;
  }

  ::slotted([slot^="summary"]) {
    margin: 0;
    font: inherit;
    color: inherit;
  }

  slot {
    display: block;
    min-inline-size: var(--space-4);
    min-block-size: 1em;
  }

  slot[name="provenance"] {
    display: block;
    min-inline-size: 0;
    min-block-size: 0;
  }

  @container (min-width: 48rem) {
    .stage {
      grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
    }

    .copy-pane {
      padding: var(--space-11) var(--space-9);
      border-block-end: none;
      border-inline-end: var(--border-width) solid var(--border-strong);
    }

    .art-pane {
      padding: var(--space-9);
      min-block-size: 32rem;
    }
  }

  @media (forced-colors: active) {
    :host,
    .stage,
    .copy-pane,
    .meta-bar,
    .art-frame {
      border-color: CanvasText;
      box-shadow: none;
    }
  }
`;

const template = html`
  <section class="stage" aria-labelledby="stage-heading">
    <div class="copy-pane">
      <div class="meta-bar">
        <span class="pulse-dot" aria-hidden="true"></span>
        <slot name="meta"></slot>
      </div>
      <div id="stage-heading" class="heading-wrap">
        <slot name="heading"></slot>
      </div>
      <div class="summary-wrap">
        <slot name="summary"></slot>
      </div>
      <div class="actions-wrap">
        <slot name="actions"></slot>
      </div>
    </div>
    <div class="art-pane">
      <div class="art-frame">
        <svg viewBox="0 0 400 400" aria-hidden="true" focusable="false">
          <g class="grid-layer">
            <line class="grid-line" x1="80" y1="0" x2="80" y2="400"></line>
            <line class="grid-line grid-extra" x1="160" y1="0" x2="160" y2="400"></line>
            <line class="grid-line" x1="240" y1="0" x2="240" y2="400"></line>
            <line class="grid-line grid-extra" x1="320" y1="0" x2="320" y2="400"></line>
            <line class="grid-line" x1="0" y1="80" x2="400" y2="80"></line>
            <line class="grid-line grid-extra" x1="0" y1="160" x2="400" y2="160"></line>
            <line class="grid-line" x1="0" y1="240" x2="400" y2="240"></line>
            <line class="grid-line grid-extra" x1="0" y1="320" x2="400" y2="320"></line>
          </g>
          <g class="bars-layer">
            <rect class="ink-fill" x="24" y="42" width="144" height="18"></rect>
            <rect class="accent-fill" x="196" y="42" width="84" height="18"></rect>
            <rect class="ink-fill" x="96" y="340" width="180" height="18"></rect>
            <rect class="accent-fill" x="24" y="340" width="52" height="18"></rect>
          </g>
          <g class="orbital-ring" transform="translate(200 200)">
            <circle class="ink-stroke" cx="0" cy="0" r="118" stroke-dasharray="28 14 8 14"></circle>
            <circle class="accent-stroke" cx="0" cy="0" r="82" stroke-dasharray="56 20"></circle>
            <rect class="ink-stroke" x="-52" y="-52" width="104" height="104"></rect>
          </g>
          <g class="pendulum-slab" transform="translate(200 200)">
            <rect class="accent-fill" x="-78" y="-14" width="156" height="28"></rect>
            <rect class="paper-fill" x="-10" y="-10" width="20" height="20"></rect>
          </g>
          <g class="crosshair-group" transform="translate(200 200)">
            <line class="grid-strong" x1="-175" y1="0" x2="175" y2="0"></line>
            <line class="grid-strong" x1="0" y1="-175" x2="0" y2="175"></line>
            <circle class="ink-fill" cx="0" cy="0" r="10"></circle>
            <circle class="paper-fill" cx="0" cy="0" r="4"></circle>
          </g>
          <g class="satellites">
            <rect class="ink-fill sat-a" x="0" y="0" width="24" height="24"></rect>
            <circle class="accent-fill sat-b" cx="0" cy="0" r="15"></circle>
            <rect class="ink-stroke sat-c" x="0" y="0" width="32" height="32"></rect>
          </g>
        </svg>
      </div>
    </div>
  </section>
  <slot name="provenance"></slot>
`;

/**
 * Swiss Brutalist kinetic hero stage with AnimationController-driven SVG motion.
 * Accessibility: section landmark labelled by the authored heading slot; SVG artwork is aria-hidden.
 * JSON-LD: none; presentation hero block without standalone structured-data entity.
 */
export class YuvaKineticStage extends TemelElement(HTMLElement) {
  static observedAttributes = ["tempo", "grid"];
  static styles = styles;
  static template = template;

  #animation;
  #artFrame;
  #pulseDot;
  #barsLayer;
  #orbitalRing;
  #pendulumSlab;
  #crosshair;
  #satA;
  #satB;
  #satC;
  #targetX = 0;
  #targetY = 0;
  #pointerX = 0;
  #pointerY = 0;
  #onPointerMove;
  #onPointerLeave;

  constructor() {
    super();
    this.#animation = new AnimationController({
      element: this,
      drawFrame: ({ time, delta }) => this.#drawFrame(time, delta),
    });
    this.#onPointerMove = (event) => {
      if (!this.#artFrame) return;
      const rect = this.#artFrame.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      this.#targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      this.#targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    this.#onPointerLeave = () => {
      this.#targetX = 0;
      this.#targetY = 0;
    };
  }

  get animation() {
    return this.#animation;
  }

  connectedCallback() {
    super.connectedCallback();
    const root = this.shadowRoot;
    this.#artFrame = root?.querySelector(".art-frame") ?? null;
    this.#pulseDot = root?.querySelector(".pulse-dot") ?? null;
    this.#barsLayer = root?.querySelector(".bars-layer") ?? null;
    this.#orbitalRing = root?.querySelector(".orbital-ring") ?? null;
    this.#pendulumSlab = root?.querySelector(".pendulum-slab") ?? null;
    this.#crosshair = root?.querySelector(".crosshair-group") ?? null;
    this.#satA = root?.querySelector(".sat-a") ?? null;
    this.#satB = root?.querySelector(".sat-b") ?? null;
    this.#satC = root?.querySelector(".sat-c") ?? null;
    this.#artFrame?.addEventListener("pointermove", this.#onPointerMove);
    this.#artFrame?.addEventListener("pointerleave", this.#onPointerLeave);
    this.#animation.connect();
  }

  disconnectedCallback() {
    this.#artFrame?.removeEventListener("pointermove", this.#onPointerMove);
    this.#artFrame?.removeEventListener("pointerleave", this.#onPointerLeave);
    this.#animation.disconnect();
    super.disconnectedCallback();
  }

  #drawFrame(time, delta) {
    const tempo = this.getAttribute("tempo") ?? "brisk";
    const rate = TEMPO_RATE[tempo] ?? TEMPO_RATE.brisk;
    const t = time * rate;
    const step = Math.min(1, Math.max(0.05, delta * 8));
    if (time === 0) {
      this.#pointerX = 0;
      this.#pointerY = 0;
    } else {
      this.#pointerX += (this.#targetX - this.#pointerX) * step;
      this.#pointerY += (this.#targetY - this.#pointerY) * step;
    }

    const px = this.#pointerX * 26;
    const py = this.#pointerY * 26;
    const ringDeg = (t * 28) % 360;
    const slabDeg = Math.sin(t * 1.45) * 38 + this.#pointerX * 12;
    const barShift = Math.sin(t * 1.1) * 28;
    const pulseScale = 1 + Math.sin(t * 3.2) * 0.22;

    if (this.#pulseDot) {
      this.#pulseDot.style.transform = `scale(${pulseScale.toFixed(3)}) rotate(${((t * 45) % 360).toFixed(1)}deg)`;
    }
    if (this.#barsLayer) {
      this.#barsLayer.setAttribute("transform", `translate(${barShift.toFixed(2)} 0)`);
    }
    if (this.#orbitalRing) {
      this.#orbitalRing.setAttribute(
        "transform",
        `translate(${(200 + px * 0.45).toFixed(2)} ${(200 + py * 0.45).toFixed(2)}) rotate(${ringDeg.toFixed(2)})`,
      );
    }
    if (this.#pendulumSlab) {
      this.#pendulumSlab.setAttribute(
        "transform",
        `translate(${(200 - px * 0.35).toFixed(2)} ${(200 - py * 0.35).toFixed(2)}) rotate(${slabDeg.toFixed(2)})`,
      );
    }
    if (this.#crosshair) {
      this.#crosshair.setAttribute(
        "transform",
        `translate(${(200 + px).toFixed(2)} ${(200 + py).toFixed(2)})`,
      );
    }

    const ax = 200 + Math.cos(t * 1.2) * 134 - 12;
    const ay = 200 + Math.sin(t * 1.2) * 134 - 12;
    if (this.#satA) {
      this.#satA.setAttribute(
        "transform",
        `translate(${ax.toFixed(2)} ${ay.toFixed(2)}) rotate(${((-t * 60) % 360).toFixed(1)} 12 12)`,
      );
    }

    const bx = 200 + Math.cos(-t * 1.7 + 1.4) * 98;
    const by = 200 + Math.sin(-t * 1.7 + 1.4) * 98;
    if (this.#satB) {
      this.#satB.setAttribute("transform", `translate(${bx.toFixed(2)} ${by.toFixed(2)})`);
    }

    const cx = 200 + Math.cos(t * 0.85 + 3.5) * 150 - 16;
    const cy = 200 + Math.sin(t * 0.85 + 3.5) * 150 - 16;
    if (this.#satC) {
      this.#satC.setAttribute(
        "transform",
        `translate(${cx.toFixed(2)} ${cy.toFixed(2)}) rotate(${((t * 42) % 360).toFixed(1)} 16 16)`,
      );
    }
  }
}

customElements.define("yuva-kinetic-stage", YuvaKineticStage);
