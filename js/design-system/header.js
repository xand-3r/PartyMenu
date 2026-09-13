const HEADER_SELECTOR = "[data-ds-header]";

/**
 * @param {HTMLElement | null} header
 * @param {string} subtitle
 */
export function setHeaderSubtitle(header, subtitle) {
  if (!(header instanceof HTMLElement)) return;

  const subtitleEl = header.querySelector("[data-ds-header-subtitle]");
  if (subtitleEl instanceof HTMLElement) {
    subtitleEl.textContent = subtitle;
  }
}

/** @param {HTMLElement} header */
function applyHeaderLabels(header) {
  const title = header.dataset.title?.trim();
  const subtitle = header.dataset.subtitle?.trim();

  if (title) {
    const titleEl = header.querySelector(".ds-header__title");
    if (titleEl instanceof HTMLElement) titleEl.textContent = title;
  }

  if (subtitle) {
    setHeaderSubtitle(header, subtitle);
  }
}

export function initHeaders(root = document) {
  root.querySelectorAll(HEADER_SELECTOR).forEach((header) => {
    if (!(header instanceof HTMLElement)) return;
    if (header.dataset.dsHeaderBound) return;
    header.dataset.dsHeaderBound = "true";
    applyHeaderLabels(header);
  });
}
