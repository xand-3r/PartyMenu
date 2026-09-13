export function initCheckboxes(root = document) {
  root.querySelectorAll("[data-ds-checkbox]").forEach((el) => {
    if (!(el instanceof HTMLInputElement) || el.type !== "checkbox") return;
    if (el.dataset.dsBound) return;
    el.dataset.dsBound = "true";

    const sync = () => {
      el.dataset.state = el.checked ? "checked" : "unchecked";
    };

    el.addEventListener("change", sync);
    sync();
  });
}
