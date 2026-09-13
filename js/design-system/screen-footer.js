const FOOTER_SELECTOR = "[data-ds-screen-footer]";

/** @param {HTMLElement} footer */
function applyFooterLabels(footer) {
  const label = footer.dataset.label?.trim();
  if (!label) return;

  const button = footer.querySelector("[data-ds-screen-footer-button]");
  if (!(button instanceof HTMLButtonElement)) return;
  if (button.textContent.trim()) return;

  button.textContent = label;
}

export function initScreenFooters(root = document) {
  root.querySelectorAll(FOOTER_SELECTOR).forEach((footer) => {
    if (!(footer instanceof HTMLElement)) return;
    if (footer.dataset.dsScreenFooterBound) return;
    footer.dataset.dsScreenFooterBound = "true";
    applyFooterLabels(footer);
  });
}

/**
 * @param {HTMLElement | null} footer
 * @param {string} label
 */
export function setScreenFooterLabel(footer, label) {
  if (!(footer instanceof HTMLElement)) return;
  footer.dataset.label = label;

  const button = footer.querySelector("[data-ds-screen-footer-button]");
  if (button instanceof HTMLButtonElement) {
    button.textContent = label;
  }
}
