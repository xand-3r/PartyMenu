/** @param {string} isoDate YYYY-MM-DD */
function formatDateDisplay(isoDate) {
  const [y, m, d] = isoDate.split("-");
  if (!y || !m || !d) return "";
  return `${d}.${m}.${y}`;
}

/** @param {HTMLInputElement} input */
function syncDateInputDisplay(input) {
  const wrapper = input.closest("[data-ds-date-input]");
  const display = wrapper?.querySelector("[data-ds-date-display]");
  if (!(display instanceof HTMLElement)) return;

  const placeholder = input.dataset.placeholder || "дд.мм.гггг";
  if (input.value) {
    display.textContent = formatDateDisplay(input.value);
    display.dataset.hasValue = "true";
  } else {
    display.textContent = placeholder;
    display.dataset.hasValue = "false";
  }
}

export function initDateInputs(root = document) {
  root.querySelectorAll("[data-ds-date-input]").forEach((wrapper) => {
    const input = wrapper.querySelector('input[type="date"]');
    if (!(input instanceof HTMLInputElement)) return;
    if (input.dataset.dsDateBound) return;
    input.dataset.dsDateBound = "true";

    const sync = () => syncDateInputDisplay(input);
    input.addEventListener("input", sync);
    input.addEventListener("change", sync);
    sync();
  });
}
