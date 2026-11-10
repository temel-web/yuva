import { AnimationController } from "/@/runtime/animation-controller.js";
import { TemelElement } from "/@/runtime/temel-element.js";
import "/@/runtime/temel-provenance.js";

const livingPaperStyles = new CSSStyleSheet();
livingPaperStyles.replaceSync(`
  :host { display: block; position: relative; inline-size: 567px; max-inline-size: 100%; min-inline-size: 0; }
  :host([hidden]) { display: none; }
  figure { margin: 0; }
  .stage { position: relative; aspect-ratio: 567 / 339; }
  .artwork { position: absolute; inset: 0 auto auto 0; inline-size: 567px; block-size: 339px; transform-origin: 0 0; }
  canvas { display: block; inline-size: 567px; block-size: 339px; }
  .sheet, .annotation { position: absolute; inset: 0 auto auto 0; transform-origin: 0 0; }
  .copy { position: absolute; left: -216px; top: -76px; width: 435px; min-height: 146px;
    display: flex; flex-direction: column; justify-content: space-between; gap: 8px; }
  slot.text, figcaption slot { display: block; min-height: 1lh; overflow-wrap: anywhere;
    text-align: left; }
  slot::slotted(*) { margin: 0; color: inherit; font: inherit; letter-spacing: inherit; }
  .heading { font: 500 46px/1.14 "Inter", sans-serif; color: #292634; }
  .eyebrow { font: 500 10px/1.4 "JetBrains Mono", monospace; color: #70647f; }
  .body { font: 400 13px/1.4 "Inter", sans-serif; color: #696572; }
  :host slot.annotation { width: 156px; text-align: center;
    transform-origin: 78px 7px; font: 500 10px/1.4 "JetBrains Mono", monospace; color: #51435f; }
  figcaption { padding: 8px 12px; background: #f3edfb; color: #51435f;
    font: 400 12px/1.4 "Inter", sans-serif; }
`);

/** Decorative Canvas with authored figure text and caption; no duplicate Canvas name or JSON-LD. */
export class LivingPaper extends TemelElement(HTMLElement) {
  static temelSlots = ["", "eyebrow", "body", "annotation", "caption", "provenance"];
  #animation;
  #context;
  #sheet;
  #annotation;
  #caption;
  #artwork;
  #resizeObserver = new ResizeObserver(this.handleArtworkResize.bind(this));

  constructor() {
    super();
    const root = this.attachShadow({ mode: "open" });
    root.adoptedStyleSheets = [livingPaperStyles];
    const canvas = this.ownerDocument.createElement("canvas");
    canvas.width = Math.round(567 * devicePixelRatio);
    canvas.height = Math.round(339 * devicePixelRatio);
    canvas.setAttribute("aria-hidden", "true");
    this.#context = canvas.getContext("2d");
    if (!this.#context) throw new Error("Living Paper needs a Canvas 2D context.");
    this.#context.scale(canvas.width / 567, canvas.height / 339);
    this.#sheet = this.ownerDocument.createElement("div");
    this.#sheet.className = "sheet";
    this.#annotation = this.ownerDocument.createElement("div");
    this.#annotation.className = "annotation";
    this.#caption = this.ownerDocument.createElement("figcaption");
    const stage = this.ownerDocument.createElement("div");
    stage.className = "stage";
    this.#artwork = this.ownerDocument.createElement("div");
    this.#artwork.className = "artwork";
    this.#artwork.append(canvas, this.#sheet, this.#annotation);
    stage.append(this.#artwork);
    const figure = this.ownerDocument.createElement("figure");
    figure.append(stage, this.#caption);
    root.append(figure, this.temelSlot("provenance"));
    this.#animation = new AnimationController({
      element: this,
      drawFrame: this.#drawFrame.bind(this),
    });
  }

  get animation() {
    return this.#animation;
  }

  connectedCallback() {
    super.connectedCallback();
    this.#resizeObserver.observe(this);
    this.#animation.connect();
  }

  disconnectedCallback() {
    this.#resizeObserver.disconnect();
    this.#animation.disconnect();
    super.disconnectedCallback();
  }

  /** @param {ResizeObserverEntry[]} entries */
  handleArtworkResize(entries) {
    this.#artwork.style.scale = String(entries[0].contentRect.width / 567);
  }

  onTemel() {
    const copy = this.ownerDocument.createElement("div");
    copy.className = "copy";
    for (const [name, className] of [
      ["eyebrow", "eyebrow"],
      ["", "heading"],
      ["body", "body"],
    ]) {
      const slot = this.temelSlot(name);
      slot.className = `text ${className}`;
      copy.append(slot);
    }
    this.#sheet.replaceChildren(copy);
    const annotation = this.temelSlot("annotation");
    annotation.className = "text annotation";
    this.#annotation.replaceChildren(annotation);
    this.#caption.replaceChildren(this.temelSlot("caption"));
    this.#animation.redraw();
  }

  #drawFrame({ time }) {
    const c = this.#context;
    c.clearRect(0, 0, 567, 339);
    drawPaper(c, time);
    drawRibbon(c, time, "upper");
    drawRibbon(c, time, "lower");
    drawOrbits(c, time);
    drawStars(c, time);
    drawGrain(c);
    drawSheet(c, time);
    this.#sheet.style.transform = `translate(283.5px, ${185 + Math.sin(time * 0.55) * 4}px) rotate(${-0.048 + Math.sin(time * 0.29) * 0.009}rad)`;
    this.#annotation.style.transform = `translate(364px, ${42 + Math.sin(time * 0.44) * 3}px) rotate(0.055rad)`;
  }
}

function drawPaper(c, time) {
  const paper = c.createLinearGradient(0, 0, 567, 339);
  paper.addColorStop(0, "#f3edfb");
  paper.addColorStop(0.55, "#e9e2f5");
  paper.addColorStop(1, "#eeeaf6");
  c.fillStyle = paper;
  c.fillRect(0, 0, 567, 339);
  drawGlow(c, {
    x: 430 + Math.sin(time * 0.17) * 28,
    y: 35,
    radius: 220,
    color: "rgba(197,175,235,0.42)",
  });
  drawGlow(c, {
    x: 65,
    y: 300 + Math.cos(time * 0.22) * 18,
    radius: 180,
    color: "rgba(247,212,176,0.38)",
  });
}

function drawGlow(c, { x, y, radius, color }) {
  const wash = c.createRadialGradient(x, y, 0, x, y, radius);
  wash.addColorStop(0, color);
  wash.addColorStop(1, "rgba(255,255,255,0)");
  c.fillStyle = wash;
  c.fillRect(0, 0, 567, 339);
}

function ribbonPoint(time, u, v, edge) {
  const isLower = edge === "lower";
  const phase = time * 0.24 + (isLower ? 2.4 : 0);
  const wave = Math.sin(u * 5.8 + phase);
  const fold = Math.cos(u * 9.2 - phase * 0.7);
  const middle = isLower ? 315 : 38;
  return [
    -65 + 710 * u,
    middle + wave * (isLower ? 30 : 36) + fold * 8 + v * (26 + 16 * Math.sin(u * 3.8 + 1.2)),
  ];
}

function traceRibbon(c, time, edge, { v, direction = "forward" }) {
  for (let i = 0; i <= 80; i++) {
    const u = direction === "reverse" ? 1 - i / 80 : i / 80;
    const p = ribbonPoint(time, u, v, edge);
    if (i === 0 && direction === "forward") c.moveTo(p[0], p[1]);
    else c.lineTo(p[0], p[1]);
  }
}

function drawRibbon(c, time, edge) {
  const isLower = edge === "lower";
  const silk = c.createLinearGradient(0, isLower ? 339 : 0, 567, isLower ? 180 : 130);
  silk.addColorStop(0, isLower ? "rgba(208,154,112,0.24)" : "rgba(137,104,194,0.06)");
  silk.addColorStop(0.46, "rgba(153,117,209,0.31)");
  silk.addColorStop(1, "rgba(107,82,168,0.12)");
  c.beginPath();
  traceRibbon(c, time, edge, { v: -1 });
  traceRibbon(c, time, edge, { v: 1, direction: "reverse" });
  c.closePath();
  c.fillStyle = silk;
  c.fill();
  for (let line = 0; line < 19; line++) {
    c.beginPath();
    traceRibbon(c, time, edge, { v: -1 + line / 9 });
    c.strokeStyle = line % 6 === 0 ? "rgba(104,73,156,0.29)" : "rgba(130,99,180,0.12)";
    c.lineWidth = line % 6 === 0 ? 0.8 : 0.55;
    c.stroke();
  }
}

function drawOrbits(c, time) {
  c.save();
  c.translate(76 + 8 * Math.sin(time * 0.19), 156 + 10 * Math.cos(time * 0.16));
  c.rotate(-0.38 + Math.sin(time * 0.13) * 0.14);
  for (let line = 0; line < 5; line++) {
    c.beginPath();
    c.ellipse(0, 0, 58 + line * 7, 101 + line * 6, 0, 0, Math.PI * 2);
    c.strokeStyle = line === 0 ? "rgba(90,65,130,0.42)" : "rgba(129,101,173,0.11)";
    c.lineWidth = 0.7;
    c.stroke();
  }
  c.restore();
}

function drawStar(c, { x, y, size, rotation }) {
  c.save();
  c.translate(x, y);
  c.rotate(rotation);
  c.beginPath();
  c.moveTo(0, -size);
  c.quadraticCurveTo(size * 0.16, -size * 0.16, size, 0);
  c.quadraticCurveTo(size * 0.16, size * 0.16, 0, size);
  c.quadraticCurveTo(-size * 0.16, size * 0.16, -size, 0);
  c.quadraticCurveTo(-size * 0.16, -size * 0.16, 0, -size);
  c.fillStyle = "#aa8054";
  c.fill();
  c.restore();
}

function drawStars(c, time) {
  drawStar(c, {
    x: 140 + Math.cos(time * 0.28) * 12,
    y: 32 + Math.sin(time * 0.28) * 9,
    size: 5,
    rotation: time * 0.08,
  });
  drawStar(c, {
    x: 475 + Math.sin(time * 0.21) * 14,
    y: 306 + Math.cos(time * 0.21) * 7,
    size: 4,
    rotation: -time * 0.09,
  });
  for (let i = 0; i < 9; i++) {
    const p = ribbonPoint(
      time,
      (i / 9 + time * 0.008) % 1,
      Math.sin(i * 2.3) * 0.65,
      i % 2 === 0 ? "lower" : "upper",
    );
    c.beginPath();
    c.arc(p[0], p[1], i % 3 === 0 ? 2.2 : 1.3, 0, Math.PI * 2);
    c.fillStyle = i % 3 === 0 ? "rgba(116,81,171,0.6)" : "rgba(255,255,255,0.85)";
    c.fill();
  }
}

function drawGrain(c) {
  c.fillStyle = "rgba(79,52,109,0.055)";
  for (let i = 0; i < 340; i++) {
    const a = Math.sin(i * 127.1 + 0.7) * 43758.5453;
    const b = Math.sin(i * 269.5 + 1.9) * 43758.5453;
    c.fillRect((a - Math.floor(a)) * 567, (b - Math.floor(b)) * 339, 0.7, 0.7);
  }
}

function drawSheet(c, time) {
  c.save();
  c.translate(442, 49 + Math.sin(time * 0.44) * 3);
  c.rotate(0.055);
  c.fillStyle = "#e1d8ed";
  c.fillRect(-83, -16, 166, 32);
  c.restore();
  c.save();
  c.translate(283.5, 185 + Math.sin(time * 0.55) * 4);
  c.rotate(-0.048 + Math.sin(time * 0.29) * 0.009);
  c.shadowColor = "rgba(65, 39, 100, 0.17)";
  c.shadowBlur = 20;
  c.shadowOffsetY = 9;
  c.beginPath();
  c.roundRect(-242, -99, 484, 198, 8);
  c.fillStyle = "#fbfaf7";
  c.fill();
  c.shadowColor = "transparent";
  c.strokeStyle = "#d9d0e3";
  c.lineWidth = 1;
  c.stroke();
  c.restore();
}

customElements.define("living-paper", LivingPaper);
