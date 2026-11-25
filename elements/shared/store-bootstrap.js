import { registerTemelSignals } from "/@/runtime/variation-signals.js";
import { CURRENCIES, setCurrency } from "./store-preferences.js";

const VISIT_KEY = "yuva.visited.v1";
const SESSION_KEY = "yuva.audience.v1";
const AUDIENCES = Object.freeze([
  "new-users",
  "returning-users",
  "mobile-users",
  "tablet-users",
  "desktop-users",
]);

/** Initialize visitor preferences and one lifecycle/device audience path for this document. */
export function initializeStore() {
  registerTemelSignals();
  const parameters = new URL(location.href).searchParams;
  const currency = parameters.get("currency");
  if (currency && CURRENCIES.includes(currency)) {
    try {
      setCurrency(currency);
    } catch {}
  }
  const signals = document.createElement("temel-signals");
  document.body.append(signals);
  const lifecycle = visitAudience();
  const mobile = matchMedia("(pointer: coarse) and (max-width: 47.99rem)");
  const tablet = matchMedia(
    "(pointer: coarse) and (min-width: 48rem) and (max-width: 74.99rem)",
  );
  let override = null;
  try {
    override = audienceOverride(parameters.get("audience"));
  } catch {
    override = null;
  }
  function updateFlags() {
    const device = mobile.matches
      ? "mobile-users"
      : tablet.matches
        ? "tablet-users"
        : "desktop-users";
    signals.replaceFlags(override ?? [lifecycle, device]);
  }
  updateFlags();
  mobile.addEventListener("change", updateFlags);
  tablet.addEventListener("change", updateFlags);
  addEventListener("pagehide", function releaseSignals(event) {
    if (event.persisted) return;
    mobile.removeEventListener("change", updateFlags);
    tablet.removeEventListener("change", updateFlags);
    removeEventListener("pagehide", releaseSignals);
  });
}

function visitAudience() {
  try {
    let visited = localStorage.getItem(VISIT_KEY);
    if (visited !== null && visited !== "1") {
      localStorage.removeItem(VISIT_KEY);
      visited = null;
    }
    let session = sessionStorage.getItem(SESSION_KEY);
    if (session !== null && !["new-users", "returning-users"].includes(session)) {
      sessionStorage.removeItem(SESSION_KEY);
      session = null;
    }
    const audience =
      session ?? (visited === "1" ? "returning-users" : "new-users");
    sessionStorage.setItem(SESSION_KEY, audience);
    localStorage.setItem(VISIT_KEY, "1");
    return audience;
  } catch {
    return "new-users";
  }
}

function audienceOverride(value) {
  if (value === null) return null;
  const flags = value.split(",");
  if (
    !flags.every((flag) => AUDIENCES.includes(flag)) ||
    new Set(flags).size !== flags.length
  ) {
    throw new Error("Use catalog audience IDs separated by commas.");
  }
  const lifecycles = flags.filter((flag) =>
    ["new-users", "returning-users"].includes(flag),
  );
  const devices = flags.filter((flag) => !lifecycles.includes(flag));
  if (lifecycles.length !== 1 || devices.length > 1)
    throw new Error(
      "Choose one lifecycle audience and at most one device audience.",
    );
  return flags;
}
