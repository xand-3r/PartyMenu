/** Remix Icon class map for maintenance log types */
export const TYPE_ICONS = {
  oil: "ri-oil-line",
  filters: "ri-filter-3-line",
  tires: "ri-steering-2-line",
  brakes: "ri-disc-line",
  other: "ri-tools-line",
};

export const ICONS = {
  add: "ri-add-line",
  addCircleFill: "ri-add-circle-fill",
  back: "ri-arrow-left-line",
  car: "ri-car-line",
  delete: "ri-delete-bin-line",
  close: "ri-close-line",
  chevronDown: "ri-arrow-down-s-line",
  garage: "ri-home-gear-line",
  calendar: "ri-calendar-line",
  mileage: "ri-dashboard-3-line",
  cost: "ri-money-dollar-circle-line",
  log: "ri-file-list-3-line",
  booklet: "ri-booklet-fill",
  chevronRight: "ri-arrow-right-s-line",
};

/** @param {string} remixClass e.g. ri-add-line */
export function iconHtml(remixClass, size = "sm") {
  return `<i class="ds-icon ds-icon--${size} ${remixClass}" aria-hidden="true"></i>`;
}

/** @param {string} type */
export function typeIconClass(type) {
  return TYPE_ICONS[type] ?? ICONS.garage;
}
