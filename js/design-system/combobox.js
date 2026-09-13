export function initComboboxes(root = document) {
  root.querySelectorAll("[data-ds-combobox]").forEach((wrap) => {
    if (wrap.dataset.dsBound) return;
    wrap.dataset.dsBound = "true";

    const trigger = wrap.querySelector("[data-ds-combobox-trigger]");
    const popover = wrap.querySelector(".ds-combobox-popover");
    const input = wrap.querySelector(".ds-combobox-input");
    const list = wrap.querySelector(".ds-combobox-list");
    const empty = wrap.querySelector(".ds-combobox-empty");
    const hiddenInput = wrap.querySelector('input[type="hidden"]');
    const items = wrap.querySelectorAll(".ds-combobox-item");

    if (!trigger || !popover || !list) return;

    let selectedValue = hiddenInput?.value ?? "";

    const filterItems = (query) => {
      const q = query.trim().toLowerCase();
      let visible = 0;

      items.forEach((item) => {
        const label = item.textContent?.trim().toLowerCase() ?? "";
        const show = !q || label.includes(q);
        item.classList.toggle("hidden", !show);
        if (show) visible += 1;
      });

      if (empty) empty.classList.toggle("hidden", visible > 0);
    };

    const close = () => {
      popover.dataset.state = "closed";
      trigger.setAttribute("aria-expanded", "false");
    };

    const open = () => {
      popover.dataset.state = "open";
      trigger.setAttribute("aria-expanded", "true");
      input?.focus();
      filterItems(input?.value ?? "");
    };

    trigger.addEventListener("click", () => {
      if (popover.dataset.state === "open") close();
      else open();
    });

    input?.addEventListener("input", () => filterItems(input.value));

    items.forEach((item) => {
      item.addEventListener("click", () => {
        const value = item.dataset.value ?? "";
        const label = item.textContent?.trim() ?? value;
        selectedValue = value;

        items.forEach((i) => i.dataset.selected = "false");
        item.dataset.selected = "true";

        if (trigger instanceof HTMLElement) {
          trigger.dataset.placeholder = "false";
          const labelNode = trigger.querySelector("[data-ds-combobox-label]");
          if (labelNode) labelNode.textContent = label;
        }

        if (hiddenInput instanceof HTMLInputElement) hiddenInput.value = value;
        close();

        wrap.dispatchEvent(
          new CustomEvent("ds-combobox-change", { detail: { value, label } })
        );
      });
    });

    document.addEventListener("click", (event) => {
      if (!wrap.contains(event.target)) close();
    });

    close();
  });
}
