import { TemelElement, css, html } from "/@/runtime/temel-element.js";
import "/@/runtime/temel-provenance.js";

const LISTS = new Map([
  [
    "categories",
    {
      title: "Categories",
      summary:
        "The main groups for furniture and decor, from seating and tables to lighting, rugs, and bedroom storage. Choose the group that best describes the product.",
    },
  ],
  [
    "brands",
    {
      title: "Brands",
      summary:
        "The brand names used across the catalog. A shared list keeps the same brand written consistently on every product. Choose the name that matches the product's brand.",
    },
  ],
  [
    "colors",
    {
      title: "Colors & finishes",
      summary:
        "Colors, wood tones, and surface finishes, including single shades and combinations such as Black/Antique Brass. Choose the label that describes the product's appearance.",
    },
  ],
  [
    "materials",
    {
      title: "Materials",
      summary:
        "What a product is made from: wood, metal, glass, textiles, and mixed materials. Detailed entries retain the full construction or upholstery description. Choose the entry that matches the material specification.",
    },
  ],
]);

const styles = css`
  :host {
    display: block;
    container-type: inline-size;
    box-sizing: border-box;
    padding: var(--space-9);
    color: var(--text-primary);
    font: var(--type-ui);
  }
  main { max-inline-size: 70rem; margin-inline: auto; }
  header { display: grid; gap: var(--space-4); padding-block-end: var(--space-9); }
  h1 { margin: 0; font: var(--type-title); }
  p { margin: 0; max-inline-size: 80ch; color: var(--text-secondary); line-height: var(--leading-body); }
  nav { display: flex; flex-wrap: wrap; gap: var(--space-4) var(--space-8); }
  a { color: var(--text-secondary); text-decoration: underline; text-underline-offset: .2em; padding-block: var(--space-2); }
  a:hover { color: var(--text-link-hover); }
  :focus-visible { outline: var(--focus-ring-width) solid var(--border-focus); outline-offset: var(--focus-ring-offset); }
  section { padding-block: var(--space-9); border-block-start: var(--border-width) solid var(--border-subtle); scroll-margin-block-start: var(--space-7); }
  .title { display: flex; flex-wrap: wrap; align-items: baseline; gap: var(--space-6); margin-block-end: var(--space-3); }
  h2 { margin: 0; font: var(--type-heading); }
  .count { color: var(--text-muted); font: var(--type-caption); }
  section p { margin-block-end: var(--space-7); }
  slot { display: block; min-inline-size: 0; }
  ::slotted(temel-data-list) { box-sizing: border-box; inline-size: 100%; margin: 0; }
  @container (max-width: 25rem) { main { padding: 0; } }
  @media (pointer: coarse) { a { min-block-size: 44px; display: inline-flex; align-items: center; } }
`;

const layout = html`
  <main>
    <header>
      <h1 id="product-lists">Product lists</h1>
      <p>
        Shared choices for categories, brands, colors and finishes, and materials. Keep product
        details consistent wherever the same values are selected.
      </p>
      <nav aria-labelledby="product-lists"></nav>
    </header>
    <div class="entries"></div>
    <slot name="provenance"></slot>
  </main>
`;

const navLinkTemplate = html`<a></a>`;

const sectionTemplate = html`
  <section>
    <div class="title">
      <h2 tabindex="-1"></h2>
      <span class="count"></span>
    </div>
    <p></p>
    <slot></slot>
  </section>
`;

/**
 * A dedicated product-list app. Fixed application copy and layout live in shadow DOM;
 * only the actual list data persists in light DOM. Headings name the navigation and
 * sections. This editing app represents no schema.org entity and emits no JSON-LD.
 */
export class YuvaDataLists extends TemelElement(HTMLElement) {
  static temelSlots = ["", "provenance"];

  #surface;
  #entries;
  #sectionByList = new Map();
  #events = null;

  constructor() {
    super();
    this.#surface = this.attachShadow({
      mode: "open",
      slotAssignment: "manual",
    });
    this.#surface.adoptedStyleSheets = [styles];
    const fragment = /** @type {DocumentFragment} */ (
      layout.content.cloneNode(true)
    );
    const nav = fragment.querySelector("nav");
    for (const [id, details] of LISTS) {
      const link = /** @type {HTMLAnchorElement} */ (
        navLinkTemplate.content.firstElementChild.cloneNode(true)
      );
      link.href = `#${id}`;
      link.dataset.listId = id;
      link.textContent = details.title;
      nav.append(link);
    }
    this.#entries = fragment.querySelector(".entries");
    fragment
      .querySelector('slot[name="provenance"]')
      .replaceWith(this.temelSlot("provenance"));
    this.#surface.append(fragment);
  }

  connectedCallback() {
    super.connectedCallback();
    this.#events = new AbortController();
    this.#surface.addEventListener(
      "click",
      this.handleNavigationClick.bind(this),
      { signal: this.#events.signal },
    );
    // The Editor reports edited lists; the element does not observe its own content.
    this.addEventListener("temel-changed", this.handleListsChange.bind(this), {
      signal: this.#events.signal,
    });
    this.#syncLists();
  }

  disconnectedCallback() {
    this.#events?.abort();
    super.disconnectedCallback();
  }

  onTemel() {
    this.#syncLists();
  }

  handleListsChange() {
    this.#syncLists();
  }

  handleNavigationClick(event) {
    const link = event.target.closest?.("a[data-list-id]");
    if (!link) return;
    event.preventDefault();
    const record = [...this.#sectionByList.entries()].find(
      ([list]) => list.id === link.dataset.listId,
    )?.[1];
    record?.section.scrollIntoView({ block: "start" });
    record?.heading.focus({ preventScroll: true });
  }

  #syncLists() {
    const lists = [...this.children].filter(
      (child) => child.localName === "temel-data-list",
    );
    for (const [list, record] of this.#sectionByList) {
      if (lists.includes(list)) continue;
      record.section.remove();
      this.#sectionByList.delete(list);
    }
    for (const [index, list] of lists.entries()) {
      let record = this.#sectionByList.get(list);
      if (!record) {
        record = this.#createSection(index);
        this.#sectionByList.set(list, record);
      }
      const details = LISTS.get(list.id);
      record.heading.textContent = details?.title ?? list.id;
      record.summary.textContent = details?.summary ?? "";
      const count = [...list.children].filter(
        (child) => child.localName === "data" && !child.hidden,
      ).length;
      record.count.textContent = `${count} entries`;
      record.section.hidden = list.hidden;
      const current = this.#entries.children[index] ?? null;
      if (current !== record.section)
        this.#entries.insertBefore(record.section, current);
      if (record.slot.assignedElements()[0] !== list) record.slot.assign(list);
    }
    const provenance = this.#surface.querySelector('slot[name="provenance"]');
    provenance.assign(
      ...[...this.children].filter(
        (child) => child.getAttribute("slot") === "provenance",
      ),
    );
  }

  #createSection(index) {
    const fragment = /** @type {DocumentFragment} */ (
      sectionTemplate.content.cloneNode(true)
    );
    const section = fragment.querySelector("section");
    const heading = section.querySelector("h2");
    heading.id = `list-heading-${index}`;
    section.setAttribute("aria-labelledby", heading.id);
    const count = section.querySelector(".count");
    const summary = section.querySelector("p");
    const slot = this.temelSlot("");
    section.querySelector("slot").replaceWith(slot);
    return { section, heading, count, summary, slot };
  }
}

customElements.define("yuva-data-lists", YuvaDataLists);
