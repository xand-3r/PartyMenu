export function initSelects(root = document) {
  root.querySelectorAll("[data-ds-select]").forEach((wrap) => {
    if (wrap.dataset.dsBound) return;
    wrap.dataset.dsBound = "true";

    const trigger = wrap.querySelector(".ds-select-trigger");
    const content = wrap.querySelector(".ds-select-content");
    const valueEl = wrap.querySelector("[data-ds-select-value]");
    const hiddenInput = wrap.querySelector('input[type="hidden"]');
    const items = wrap.querySelectorAll(".ds-select-item");

    if (!trigger || !content) return;

    const close = () => {
      content.dataset.state = "closed";
      trigger.setAttribute("aria-expanded", "false");
    };

    const open = () => {
      content.dataset.state = "open";
      trigger.setAttribute("aria-expanded", "true");
    };

    trigger.addEventListener("click", () => {
      const isOpen = content.dataset.state === "open";
      if (isOpen) close();
      else open();
    });

    items.forEach((item) => {
      item.addEventListener("click", () => {
        if (item.dataset.disabled === "true") return;

        const value = item.dataset.value ?? item.textContent?.trim() ?? "";
        const label = item.textContent?.trim() ?? value;

        items.forEach((i) => i.dataset.selected = "false");
        item.dataset.selected = "true";

        if (valueEl) valueEl.textContent = label;
        if (hiddenInput instanceof HTMLInputElement) hiddenInput.value = value;

        trigger.dataset.placeholder = "false";
        close();
        wrap.dispatchEvent(
          new CustomEvent("ds-select-change", { detail: { value, label } })
        );
      });
    });

    document.addEventListener("click", (event) => {
      if (!wrap.contains(event.target)) close();
    });

    close();
  });
}
