import {
  createLayoutTemplate,
  PageEssentialElement,
} from "./page-essentials/page-essential-element.js";

const styles = new CSSStyleSheet();
styles.replaceSync(`
 :host { display: grid; gap: var(--space-7); align-content: start; }
 .heading {
   font: var(--weight-semibold) var(--text-2xl)/var(--leading-snug) var(--font-display);
   letter-spacing: var(--tracking-tight);
 }
 .player {
   display: flex; align-items: center; gap: var(--space-6);
   background: var(--surface-panel); border: var(--border-width) var(--border-style) var(--border-subtle);
   border-radius: var(--radius-pill); padding: var(--space-3) var(--space-5) var(--space-3) var(--space-3);
 }
 .disc {
   flex: none; inline-size: var(--space-12); block-size: var(--space-12); border-radius: var(--radius-pill);
   background:
     radial-gradient(circle, var(--surface-panel) 0 14%, transparent 15%),
     conic-gradient(from 30deg, var(--accent), var(--brand-edge), var(--accent), var(--brand-edge), var(--accent));
   box-shadow: var(--shadow-widget);
 }
 @keyframes disc-spin { to { rotate: 1turn; } }
 @media (prefers-reduced-motion: no-preference) {
   .disc.is-playing { animation: disc-spin 4s linear infinite; }
 }
 audio { display: block; flex: 1 1 auto; inline-size: 100%; min-inline-size: 0; }
 .default { color: var(--text-secondary); }
 @container (max-width: 24rem) { .disc { display: none; } .player { padding: var(--space-3); } }
`);

const layout = createLayoutTemplate(
  '<slot name="heading" class="text-slot"></slot><div data-player></div><slot class="text-slot"></slot><slot name="provenance"></slot>',
);

/** Browser-native audio playback with an authored title and listening notes. */
export class TemelAudioPlayer extends PageEssentialElement {
  static temelSlots = ["heading", "", "provenance"];
  static layout = layout;
  static pageEssentialsStyles = styles;
  static observedAttributes = ["src"];
  #audio = document.createElement("audio");
  #disc = document.createElement("div");
  #player = document.createElement("div");

  constructor() {
    super();
    this.#audio.controls = true;
    this.#audio.preload = "metadata";
    this.#disc.className = "disc";
    this.#disc.setAttribute("aria-hidden", "true");
    for (const type of ["play", "pause", "ended"]) {
      this.#audio.addEventListener(type, this.handleAudioPlayback.bind(this));
    }
    this.#player.className = "player";
    this.#player.append(this.#disc, this.#audio);
  }

  /** The persistent player keeps playback while Slots and variations re-render. */
  onTemel() {
    super.onTemel();
    this.shadowRoot.querySelector("[data-player]").replaceWith(this.#player);
    this.#syncSource();
  }

  attributeChangedCallback() {
    this.#syncSource();
  }

  handleSlotChange() {
    super.handleSlotChange();
    this.#audio.ariaLabelledByElements = this.assignedTo("heading");
  }

  handleAudioPlayback() {
    this.#disc.classList.toggle("is-playing", !this.#audio.paused);
  }

  disconnectedCallback() {
    this.#audio.pause();
    super.disconnectedCallback();
  }

  #syncSource() {
    const source = this.getAttribute("src");
    if (source === this.#audio.getAttribute("src")) return;
    if (source) this.#audio.setAttribute("src", source);
    else this.#audio.removeAttribute("src");
  }
}

customElements.define(
  "temel-audio-player",
  /** @type {CustomElementConstructor} */ (/** @type {unknown} */ (TemelAudioPlayer)),
);
