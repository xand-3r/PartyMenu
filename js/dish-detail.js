const appEl = document.querySelector(".app");
const drawerRoot = document.getElementById("dish-detail-drawer");
const imgEl = document.getElementById("dish-detail-image");
const titleEl = document.getElementById("dish-detail-title");
const descriptionEl = document.getElementById("dish-detail-description");

function openDrawer() {
  if (!(drawerRoot instanceof HTMLElement)) return;
  drawerRoot.dataset.state = "open";
  drawerRoot.setAttribute("aria-hidden", "false");
  if (appEl instanceof HTMLElement) appEl.dataset.dishDetailOpen = "true";
}

function closeDrawer() {
  if (!(drawerRoot instanceof HTMLElement)) return;
  drawerRoot.dataset.state = "closed";
  drawerRoot.setAttribute("aria-hidden", "true");
  if (appEl instanceof HTMLElement) delete appEl.dataset.dishDetailOpen;
}

/** @param {{ title: string; description: string; detailImage?: string }} dish */
export function openDishDetail(dish) {
  if (!(titleEl instanceof HTMLElement) || !(descriptionEl instanceof HTMLElement)) return;

  titleEl.textContent = dish.title;
  descriptionEl.textContent = dish.description;

  if (!(dish.detailImage && imgEl instanceof HTMLImageElement)) return;

  imgEl.src = dish.detailImage;
  imgEl.alt = dish.title;
  openDrawer();
}

/** @param {HTMLElement} item */
export function readDishFromItem(item) {
  const detailImage = item.getAttribute("data-dish-image") || undefined;
  return {
    title: item.dataset.dishTitle || item.querySelector(".ds-item__title")?.textContent?.trim() || "",
    description:
      item.dataset.dishDescription || item.querySelector(".ds-item__description")?.textContent?.trim() || "",
    detailImage,
  };
}

export function bindDishDetailPanel(panelEl) {
  if (!(panelEl instanceof HTMLElement)) return;

  panelEl.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const media = target.closest('.ds-item__media[data-variant="photo"]');
    if (!(media instanceof HTMLElement)) return;

    const item = media.closest('.ds-item--select[data-variant="radio"]');
    if (!(item instanceof HTMLElement)) return;

    event.preventDefault();
    event.stopPropagation();

    const dish = readDishFromItem(item);
    if (!dish.title || !dish.detailImage) return;
    openDishDetail(dish);
  });
}

export function initDishDetailDrawer() {
  if (!(drawerRoot instanceof HTMLElement)) return;

  drawerRoot.querySelectorAll("[data-ds-drawer-close]").forEach((el) => {
    el.addEventListener("click", () => closeDrawer());
  });

  drawerRoot.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeDrawer();
  });
}
