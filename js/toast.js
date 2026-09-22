const HIDE_MS = 2800;

/** @type {ReturnType<typeof setTimeout> | null} */
let hideTimer = null;

function ensureToastEl() {
  const app = document.querySelector(".app");
  let el = document.getElementById("app-toast");
  if (el instanceof HTMLElement) return el;

  el = document.createElement("div");
  el.id = "app-toast";
  el.className = "app-toast";
  el.setAttribute("role", "status");
  el.setAttribute("aria-live", "polite");
  el.hidden = true;
  (app instanceof HTMLElement ? app : document.body).appendChild(el);
  return el;
}

/** @param {string} message */
export function showToast(message) {
  const el = ensureToastEl();
  el.textContent = message;
  el.hidden = false;
  el.dataset.state = "show";

  if (hideTimer) clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    el.dataset.state = "hide";
    hideTimer = setTimeout(() => {
      el.hidden = true;
      hideTimer = null;
    }, 200);
  }, HIDE_MS);
}
