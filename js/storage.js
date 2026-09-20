const STORAGE_KEY = "party-menu-order-v1";

/** @typedef {{ salad?: string; main?: string; drink?: string; name?: string }} PartyOrder */

/** @returns {PartyOrder} */
export function loadOrder() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const data = JSON.parse(raw);
    return typeof data === "object" && data !== null ? data : {};
  } catch {
    return {};
  }
}

/** @param {PartyOrder} order */
export function saveOrder(order) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
}

/** @param {Partial<PartyOrder>} patch */
export function patchOrder(patch) {
  const next = { ...loadOrder(), ...patch };
  saveOrder(next);
  return next;
}
