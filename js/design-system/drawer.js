export function initDrawers(root = document) {
  root.querySelectorAll("[data-ds-drawer]").forEach((rootEl) => {
    if (rootEl.dataset.dsBound) return;
    rootEl.dataset.dsBound = "true";

    const trigger = rootEl.querySelector("[data-ds-drawer-trigger]");
    const closeEls = rootEl.querySelectorAll("[data-ds-drawer-close]");
    const overlay = rootEl.querySelector(".ds-drawer-overlay");

    const open = () => {
      rootEl.dataset.state = "open";
      document.body.style.overflow = "hidden";
    };

    const close = () => {
      rootEl.dataset.state = "closed";
      document.body.style.overflow = "";
    };

    trigger?.addEventListener("click", open);
    overlay?.addEventListener("click", close);
    closeEls.forEach((el) => el.addEventListener("click", close));

    rootEl.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });

    if (!rootEl.dataset.state) {
      rootEl.dataset.state = "closed";
    }
  });
}
