/** @param {HTMLElement} content */
function applyViewportSize(content) {
  const vv = window.visualViewport;
  if (!vv) {
    content.style.removeProperty("top");
    content.style.removeProperty("height");
    content.style.removeProperty("max-height");
    delete document.body.dataset.keyboardOpen;
    return;
  }

  content.style.top = `${vv.offsetTop}px`;
  content.style.height = `${vv.height}px`;
  content.style.maxHeight = `${vv.height}px`;

  const keyboardOpen = window.innerHeight - vv.height - vv.offsetTop > 50;
  document.body.dataset.keyboardOpen = keyboardOpen ? "true" : "false";

  if (vv.offsetTop !== 0) {
    window.scrollTo(0, 0);
  }
}

/** @param {HTMLElement} content */
function resetViewportSize(content) {
  content.style.removeProperty("top");
  content.style.removeProperty("height");
  content.style.removeProperty("max-height");
  delete document.body.dataset.keyboardOpen;
}

/** @param {HTMLElement} root */
function updateViewportDrawer(root) {
  if (root.dataset.state !== "open") return;

  const content = root.querySelector('.ds-drawer-content[data-size="fill"]');
  if (!(content instanceof HTMLElement)) return;

  applyViewportSize(content);
}

/** @param {HTMLElement} root */
function resetViewportDrawer(root) {
  const content = root.querySelector('.ds-drawer-content[data-size="fill"]');
  if (content instanceof HTMLElement) resetViewportSize(content);
}

/**
 * @param {HTMLElement | null} root
 * @returns {() => void}
 */
export function bindViewportDrawer(root) {
  if (!(root instanceof HTMLElement)) return () => {};

  const update = () => updateViewportDrawer(root);

  window.visualViewport?.addEventListener("resize", update);
  window.visualViewport?.addEventListener("scroll", update);
  window.addEventListener("orientationchange", update);

  return update;
}

/** @param {HTMLElement | null} root */
export function syncViewportDrawer(root) {
  if (!(root instanceof HTMLElement)) return;
  if (root.dataset.state === "open") updateViewportDrawer(root);
  else resetViewportDrawer(root);
}

/** @param {HTMLElement | null} root */
export function scheduleViewportDrawerSync(root) {
  if (!(root instanceof HTMLElement)) return;
  syncViewportDrawer(root);
  requestAnimationFrame(() => syncViewportDrawer(root));
  setTimeout(() => syncViewportDrawer(root), 100);
  setTimeout(() => syncViewportDrawer(root), 350);
}
