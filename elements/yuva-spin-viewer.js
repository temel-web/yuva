import { AnimationController } from "/@/runtime/animation-controller.js";
import { StoreElement, node } from "./shared/store-element.js";

const SPIN_ATLAS_PATH_PATTERN = /^\/(?!\/)[a-z0-9/._-]+\.webp$/u;

/** A lazy 36-frame turntable with one owned animation clock. */
export class YuvaSpinViewer extends StoreElement {
  static preferenceTopics = Object.freeze([]);
  static temelSlots = [
    "",
    "previous",
    "next",
    "pause",
    "play",
    "loading",
    "error",
    "provenance",
  ];
  static observedAttributes = ["src"];
  #canvas;
  #context;
  #image = null;
  #frame = 0;
  #phase = 0;
  #dragX = null;
  #loadId = 0;
  #loadedSrc = "";
  #status;
  #toggle;
  #controlSubscriptions;
  #animation = new AnimationController({
    element: this,
    drawFrame: this.drawFrame.bind(this),
  });
  #motionPreference = this.ownerDocument.defaultView.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );
  #visibility = new IntersectionObserver(
    this.handleVisibilityChange.bind(this),
  );

  constructor() {
    super();
    this.#canvas = node("canvas", {
      width: "320",
      height: "405",
      tabindex: "0",
      "aria-labelledby": "spin-label",
    });
    this.#context = this.#canvas.getContext("2d");
    this.#toggle = node("button", { type: "button", value: "toggle" });
    this.#status = node("div", { role: "status", class: "status" });
    const controls = node("div", { class: "controls" }, [
      node("button", { type: "button", value: "previous" }, [
        this.temelSlot("previous"),
      ]),
      this.#toggle,
      node("button", { type: "button", value: "next" }, [
        this.temelSlot("next"),
      ]),
    ]);
    this.shadowRoot.append(
      node("span", { id: "spin-label" }, [this.temelSlot("")]),
      this.#canvas,
      controls,
      this.#status,
      this.temelSlot("provenance"),
    );
    this.shadowRoot.addEventListener(
      "click",
      this.handleControlClick.bind(this),
    );
    this.#canvas.addEventListener(
      "keydown",
      this.handleCanvasKeydown.bind(this),
    );
    this.#canvas.addEventListener(
      "pointerdown",
      this.handleCanvasPointerdown.bind(this),
    );
    this.#canvas.addEventListener(
      "pointermove",
      this.handleCanvasPointermove.bind(this),
    );
    this.#canvas.addEventListener(
      "pointerup",
      this.handleCanvasPointerup.bind(this),
    );
    this.#canvas.addEventListener(
      "pointercancel",
      this.handleCanvasPointerup.bind(this),
    );
    this.#animation.pause("unloaded");
    this.addStyles(`
      canvas { display: block; inline-size: 100%; max-block-size: 65vh; object-fit: contain; aspect-ratio: 320 / 405; touch-action: pan-y; cursor: grab; background: white; }
      .controls { display: flex; gap: var(--space-4); justify-content: center; margin-block: var(--space-6); }
      #spin-label { display: block; font: var(--type-caption); color: var(--text-muted); margin-block-end: var(--space-4); }
    `);
  }

  get animation() {
    return this.#animation;
  }
  get selectedFrame() {
    return this.#frame;
  }
  connectedCallback() {
    super.connectedCallback();
    this.#animation.connect();
    this.#visibility.observe(this);
    this.#controlSubscriptions = new AbortController();
    const options = { signal: this.#controlSubscriptions.signal };
    document.addEventListener(
      "visibilitychange",
      this.handleAnimationStateChange.bind(this),
      options,
    );
    this.#motionPreference.addEventListener(
      "change",
      this.handleAnimationStateChange.bind(this),
      options,
    );
  }
  disconnectedCallback() {
    this.#loadId += 1;
    this.#visibility.disconnect();
    this.#controlSubscriptions.abort();
    this.#animation.disconnect();
    this.#image = null;
    this.#loadedSrc = "";
    this.#animation.pause("unloaded");
    super.disconnectedCallback();
  }
  attributeChangedCallback() {
    if (this.isConnected) this.#visibility.observe(this);
  }
  update() {
    this.#syncToggle();
  }

  handleAnimationStateChange() {
    this.#syncToggle();
  }

  async handleVisibilityChange(entries) {
    if (!entries.some((entry) => entry.isIntersecting)) {
      this.#animation.pause("offscreen");
      this.#syncToggle();
      return;
    }
    this.#animation.resume("offscreen");
    this.#syncToggle();
    const src = this.getAttribute("src");
    if (!src || src === this.#loadedSrc) return;
    await this.#loadAtlas(src);
  }

  async #loadAtlas(src) {
    if (!SPIN_ATLAS_PATH_PATTERN.test(src)) {
      this.#status.replaceChildren(this.temelSlot("error"));
      return;
    }
    const loadId = ++this.#loadId;
    this.#loadedSrc = src;
    this.#animation.pause("unloaded");
    this.#status.replaceChildren(this.temelSlot("loading"));
    const image = new Image();
    image.src = src;
    try {
      await image.decode();
      if (!this.isConnected || loadId !== this.#loadId) return;
      this.#image = image;
      this.#status.replaceChildren();
      this.#animation.resume("unloaded");
      this.#animation.redraw();
      this.#syncToggle();
    } catch (cause) {
      if (!this.isConnected || loadId !== this.#loadId) return;
      this.#status.replaceChildren(this.temelSlot("error"));
      this.dispatchEvent(
        new CustomEvent("spin-error", {
          bubbles: true,
          composed: true,
          detail: cause,
        }),
      );
    }
  }

  drawFrame({ delta }) {
    if (!this.#image) return;
    this.#phase = (this.#phase + delta * 4) % 36;
    this.#frame = Math.floor(this.#phase);
    const cellWidth = this.#image.width / 6;
    const cellHeight = this.#image.height / 6;
    this.#context.drawImage(
      this.#image,
      (this.#frame % 6) * cellWidth,
      Math.floor(this.#frame / 6) * cellHeight,
      cellWidth,
      cellHeight,
      0,
      0,
      320,
      405,
    );
  }
  #turn(amount) {
    this.#animation.pause("interaction");
    this.#phase = (this.#frame + amount + 36) % 36;
    this.#animation.redraw();
    this.#syncToggle();
  }
  #syncToggle() {
    if (!this.#toggle) return;
    this.#toggle.replaceChildren(
      this.temelSlot(this.#animation.isPlaying ? "pause" : "play"),
    );
    this.#toggle.disabled = !this.#image;
    this.setState("playing", this.#animation.isPlaying);
  }
  handleControlClick(event) {
    const button = event
      .composedPath()
      .find((entry) => entry instanceof HTMLButtonElement);
    if (!button) return;
    if (button.value === "previous") this.#turn(-1);
    else if (button.value === "next") this.#turn(1);
    else {
      if (this.#animation.isPlaying) this.#animation.pause("interaction");
      else this.#animation.resume("interaction");
      this.#syncToggle();
    }
  }
  handleCanvasKeydown(event) {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    this.#turn(event.key === "ArrowLeft" ? -1 : 1);
  }
  handleCanvasPointerdown(event) {
    this.#dragX = event.clientX;
    this.#canvas.setPointerCapture(event.pointerId);
    this.#animation.pause("interaction");
    this.#syncToggle();
  }
  handleCanvasPointermove(event) {
    if (this.#dragX === null) return;
    const steps = Math.trunc((event.clientX - this.#dragX) / 10);
    if (steps === 0) return;
    this.#dragX = event.clientX;
    this.#turn(steps);
  }
  handleCanvasPointerup(event) {
    this.#dragX = null;
    if (this.#canvas.hasPointerCapture(event.pointerId))
      this.#canvas.releasePointerCapture(event.pointerId);
  }
}
customElements.define("yuva-spin-viewer", YuvaSpinViewer);
