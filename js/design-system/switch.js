export function initSwitches(root = document) {
  root.querySelectorAll("[data-ds-switch]").forEach((el) => {
    if (!(el instanceof HTMLInputElement) || el.type !== "checkbox") return;
    if (el.dataset.dsBound) return;
    el.dataset.dsBound = "true";
    el.classList.add("ds-switch");
    el.setAttribute("role", "switch");

    const sync = () => {
      el.dataset.state = el.checked ? "checked" : "unchecked";
    };

    el.addEventListener("change", sync);
    sync();
  });
}
