/** Canonical `--button-*` values for command sizes and variants. */
export const BUTTON_SIZES = Object.freeze(["s", "m", "l", "xl", "xxl"]);
export const BUTTON_VARIANTS = Object.freeze(["accent", "outline", "quiet"]);

const BUTTON_SIZE_VARIABLES = Object.freeze({
  s: `
    --button-font: var(--weight-semibold) var(--text-xs)/var(--leading-ui) var(--font-ui);
    --button-min-block-size: var(--h-control-sm);
    --button-padding-block: var(--space-2);
    --button-padding-inline: var(--space-4);
  `,
  m: `
    --button-font: var(--type-ui-strong);
    --button-min-block-size: var(--h-control);
    --button-padding-block: var(--space-4);
    --button-padding-inline: var(--space-6);
  `,
  l: `
    --button-font: var(--weight-semibold) var(--text-md)/var(--leading-ui) var(--font-ui);
    --button-min-block-size: var(--space-11);
    --button-padding-block: var(--space-5);
    --button-padding-inline: var(--space-8);
  `,
  xl: `
    --button-font: var(--weight-semibold) var(--text-lg)/var(--leading-ui) var(--font-ui);
    --button-min-block-size: var(--space-12);
    --button-padding-block: var(--space-6);
    --button-padding-inline: var(--space-9);
  `,
  xxl: `
    --button-font: var(--weight-semibold) var(--text-xl)/var(--leading-ui) var(--font-ui);
    --button-min-block-size: var(--space-13);
    --button-padding-block: var(--space-7);
    --button-padding-inline: var(--space-10);
  `,
});

const BUTTON_VARIANT_VARIABLES = Object.freeze({
  accent: `
    --button-background: var(--accent);
    --button-background-hover: var(--accent-hover);
    --button-background-active: var(--accent-press);
    --button-border-color: var(--accent);
    --button-border-color-hover: var(--accent-hover);
    --button-border-color-active: var(--accent-press);
    --button-color: var(--text-on-accent);
  `,
  outline: `
    --button-background: transparent;
    --button-background-hover: var(--surface-hover);
    --button-background-active: var(--surface-active);
    --button-border-color: var(--border-default);
    --button-border-color-hover: var(--border-strong);
    --button-border-color-active: var(--border-strong);
    --button-color: var(--text-primary);
  `,
  quiet: `
    --button-background: transparent;
    --button-background-hover: var(--surface-hover);
    --button-background-active: var(--surface-active);
    --button-border-color: transparent;
    --button-border-color-hover: transparent;
    --button-border-color-active: transparent;
    --button-color: var(--text-primary);
  `,
});

/** @param {string} size @returns {string} */
export function buttonSizeVariables(size) {
  if (!Object.hasOwn(BUTTON_SIZE_VARIABLES, size)) {
    throw new Error(`Button size variables are unavailable for "${size}".`);
  }
  return BUTTON_SIZE_VARIABLES[size];
}

/** @param {string} variant @returns {string} */
export function buttonVariantVariables(variant) {
  if (!Object.hasOwn(BUTTON_VARIANT_VARIABLES, variant)) {
    throw new Error(`Button variant variables are unavailable for "${variant}".`);
  }
  return BUTTON_VARIANT_VARIABLES[variant];
}
