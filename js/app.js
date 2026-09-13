import {
  addLog,
  createId,
  getLogById,
  loadLogs,
  loadVehicle,
  saveVehicle,
} from "./storage.js";
import { initDesignSystem } from "./design-system/index.js";
import { ICONS, iconHtml } from "./icons.js";
import { applyTelegramChrome } from "./theme.js";

const tg = window.Telegram?.WebApp;

const screenWelcome = document.getElementById("screen-welcome");
const screenAddCar = document.getElementById("screen-add-car");
const screenJournal = document.getElementById("screen-journal");
const screenAddLog = document.getElementById("screen-add-log");
const screenLogDetail = document.getElementById("screen-log-detail");

const listEl = document.getElementById("log-list");
const emptyEl = document.getElementById("empty-state");
const headerVehicleEl = document.getElementById("header-vehicle");
const formEl = document.getElementById("add-form");
const addCarFormEl = document.getElementById("add-car-form");
const btnAdd = document.getElementById("btn-add");
const btnWelcomeAdd = document.getElementById("btn-welcome-add");
const btnAddCarBack = document.getElementById("btn-add-car-back");
const btnAddLogBack = document.getElementById("btn-add-log-back");
const btnLogDetailBack = document.getElementById("btn-log-detail-back");
const fieldDate = document.getElementById("field-date");
const fieldMileage = document.getElementById("field-mileage");
const fieldBrand = document.getElementById("field-brand");
const fieldModel = document.getElementById("field-model");
const fieldYear = document.getElementById("field-year");
const fieldCarMileage = document.getElementById("field-car-mileage");
const logDetailTitleEl = document.getElementById("log-detail-title");
const logDetailSubtitleEl = document.getElementById("log-detail-subtitle");
const logDetailDateEl = document.getElementById("log-detail-date");
const logDetailMileageEl = document.getElementById("log-detail-mileage");
const logDetailCostEl = document.getElementById("log-detail-cost");
const logDetailWorksEl = document.getElementById("log-detail-works");

/** @type {Record<string, HTMLElement | null>} */
const screens = {
  welcome: screenWelcome,
  "add-car": screenAddCar,
  journal: screenJournal,
  "add-log": screenAddLog,
  "log-detail": screenLogDetail,
};

function initTelegram() {
  applyTelegramChrome();
}

function showScreen(name) {
  for (const [key, el] of Object.entries(screens)) {
    el?.classList.toggle("hidden", key !== name);
  }
}

function formatDate(isoDate) {
  const [y, m, d] = isoDate.split("-");
  return `${d}.${m}.${y}`;
}

function formatCost(value) {
  return `${Number(value).toLocaleString("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ₽`;
}

function formatMileage(value) {
  return `${Number(value).toLocaleString("ru-RU")}`;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function formatVehicleTitle(vehicle) {
  const title = [vehicle.brand, vehicle.model].filter(Boolean).join(" ");
  return title || vehicle.brand;
}

/** @param {import("./storage.js").MaintenanceLog[]} logs */
function getLogNumberMap(logs) {
  const sorted = [...logs].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.id.localeCompare(b.id);
  });

  /** @type {Map<string, number>} */
  const map = new Map();
  sorted.forEach((log, index) => {
    map.set(log.id, index + 1);
  });
  return map;
}

function getMinLogMileage() {
  const vehicle = loadVehicle();
  if (!vehicle) return 0;

  const logs = loadLogs();
  const maxLogMileage = logs.reduce((max, log) => Math.max(max, log.mileage), 0);
  return Math.max(vehicle.mileage, maxLogMileage);
}

function renderJournalHeader() {
  const vehicle = loadVehicle();
  if (headerVehicleEl && vehicle) {
    headerVehicleEl.textContent = formatVehicleTitle(vehicle);
  }
}

function renderLogs() {
  const logs = loadLogs();
  listEl.innerHTML = "";

  emptyEl.classList.toggle("hidden", logs.length > 0);

  const numberMap = getLogNumberMap(logs);

  for (const log of logs) {
    const number = numberMap.get(log.id) ?? 0;
    const item = document.createElement("button");
    item.type = "button";
    item.className = "ds-item ds-item--link";
    item.dataset.variant = "outline";
    item.dataset.size = "sm";
    item.dataset.logId = log.id;
    item.innerHTML = `
      <span class="ds-item__media" data-variant="icon" aria-hidden="true">${iconHtml(ICONS.booklet, "lg")}</span>
      <span class="ds-item__content">
        <span class="ds-item__title">Запись ${number}</span>
        <span class="ds-item__description">${escapeHtml(formatDate(log.date))}</span>
      </span>
      <span class="ds-item__trailing">
        <span class="ds-item__amount">${escapeHtml(formatCost(log.cost))}</span>
        <span class="ds-item__chevron" aria-hidden="true">${iconHtml(ICONS.chevronRight, "sm")}</span>
      </span>
    `;
    listEl.appendChild(item);
  }
}

/** @param {import("./storage.js").MaintenanceLog} log */
function openLogDetail(log) {
  const numberMap = getLogNumberMap(loadLogs());
  const number = numberMap.get(log.id) ?? 0;

  if (logDetailTitleEl instanceof HTMLElement) {
    logDetailTitleEl.textContent = `Запись ${number}`;
  }
  if (logDetailSubtitleEl instanceof HTMLElement) {
    logDetailSubtitleEl.textContent = formatDate(log.date);
  }
  if (logDetailDateEl instanceof HTMLElement) {
    logDetailDateEl.textContent = formatDate(log.date);
  }
  if (logDetailMileageEl instanceof HTMLElement) {
    logDetailMileageEl.textContent = formatMileage(log.mileage);
  }
  if (logDetailCostEl instanceof HTMLElement) {
    logDetailCostEl.textContent = formatCost(log.cost);
  }
  if (logDetailWorksEl instanceof HTMLElement) {
    logDetailWorksEl.textContent = log.works || log.note || log.typeLabel || "";
  }

  showScreen("log-detail");
}

function resetAddLogForm() {
  const vehicle = loadVehicle();
  formEl.reset();
  fieldDate.value = new Date().toISOString().slice(0, 10);
  fieldDate.dispatchEvent(new Event("input", { bubbles: true }));
  if (fieldMileage instanceof HTMLInputElement && vehicle) {
    const minMileage = getMinLogMileage();
    fieldMileage.min = String(minMileage);
    fieldMileage.value = String(minMileage);
  }
}

function openAddLogScreen() {
  resetAddLogForm();
  showScreen("add-log");
}

function handleSubmit(event) {
  event.preventDefault();

  const formData = new FormData(formEl);
  const date = String(formData.get("date") || "");
  const mileage = Number(formData.get("mileage"));
  const cost = Number(formData.get("cost"));
  const works = String(formData.get("works") || "").trim();

  if (!date) {
    alert("Укажите дату");
    return;
  }

  const vehicle = loadVehicle();
  const minMileage = vehicle ? getMinLogMileage() : 0;

  if (!Number.isFinite(mileage) || mileage < 0) {
    alert("Укажите пробег");
    return;
  }
  if (vehicle && mileage < minMileage) {
    alert(`Пробег не может быть меньше ${minMileage.toLocaleString("ru-RU")} км`);
    return;
  }
  if (!Number.isFinite(cost) || cost < 0) {
    alert("Укажите сумму");
    return;
  }
  if (!works) {
    alert("Укажите, что было сделано");
    return;
  }

  try {
    addLog({
      id: createId(),
      date,
      mileage,
      cost,
      works,
    });
  } catch (error) {
    console.error(error);
    alert("Не удалось сохранить запись");
    return;
  }

  tg?.HapticFeedback?.notificationOccurred("success");
  showScreen("journal");
  renderLogs();
}

function setAddCarFieldError(fieldName, hasError) {
  const field = addCarFormEl?.querySelector(`[data-field="${fieldName}"]`);
  if (!(field instanceof HTMLElement)) return;

  const input = field.querySelector(".ds-input");
  const errorEl = field.querySelector("[data-field-error]");

  field.dataset.invalid = hasError ? "true" : "false";

  if (input instanceof HTMLInputElement) {
    input.toggleAttribute("aria-invalid", hasError);
  }
  if (errorEl instanceof HTMLElement) {
    errorEl.hidden = !hasError;
  }
}

function clearAddCarErrors() {
  for (const name of ["brand", "model", "year", "mileage"]) {
    setAddCarFieldError(name, false);
  }
}

function validateAddCarForm(formData) {
  let valid = true;
  const brand = String(formData.get("brand") || "").trim();
  const model = String(formData.get("model") || "").trim();
  const yearRaw = String(formData.get("year") || "").trim();
  const mileageRaw = String(formData.get("mileage") || "").trim();
  const year = yearRaw ? Number(yearRaw) : NaN;
  const mileage = mileageRaw ? Number(mileageRaw) : NaN;

  const brandValid = brand.length > 0;
  setAddCarFieldError("brand", !brandValid);
  if (!brandValid) valid = false;

  const modelValid = model.length > 0;
  setAddCarFieldError("model", !modelValid);
  if (!modelValid) valid = false;

  const yearValid =
    yearRaw !== "" && Number.isFinite(year) && year >= 1950 && year <= 2099;
  setAddCarFieldError("year", !yearValid);
  if (!yearValid) valid = false;

  const mileageValid =
    mileageRaw !== "" && Number.isFinite(mileage) && mileage >= 0;
  setAddCarFieldError("mileage", !mileageValid);
  if (!mileageValid) valid = false;

  return { valid, brand, model, year, mileage };
}

function handleAddCarSubmit(event) {
  event.preventDefault();

  const formData = new FormData(addCarFormEl);
  const result = validateAddCarForm(formData);
  if (!result.valid) return;

  saveVehicle({
    brand: result.brand,
    model: result.model,
    year: result.year,
    mileage: result.mileage,
  });
  tg?.HapticFeedback?.notificationOccurred("success");
  addCarFormEl.reset();
  clearAddCarErrors();
  renderJournalHeader();
  renderLogs();
  showScreen("journal");
}

function handleListClick(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const item = target.closest("[data-log-id]");
  if (!(item instanceof HTMLElement)) return;

  const logId = item.dataset.logId;
  if (!logId) return;

  const log = getLogById(logId);
  if (!log) return;

  openLogDetail(log);
}

function initApp() {
  const vehicle = loadVehicle();
  if (vehicle) {
    renderJournalHeader();
    renderLogs();
    showScreen("journal");
  } else {
    showScreen("welcome");
  }
}

btnWelcomeAdd?.addEventListener("click", () => {
  addCarFormEl.reset();
  clearAddCarErrors();
  showScreen("add-car");
});

btnAddCarBack?.addEventListener("click", () => {
  addCarFormEl.reset();
  clearAddCarErrors();
  showScreen("welcome");
});

for (const [fieldName, input] of [
  ["brand", fieldBrand],
  ["model", fieldModel],
  ["year", fieldYear],
  ["mileage", fieldCarMileage],
]) {
  input?.addEventListener("input", () => setAddCarFieldError(fieldName, false));
}

btnAdd?.addEventListener("click", openAddLogScreen);
btnAddLogBack?.addEventListener("click", () => {
  resetAddLogForm();
  showScreen("journal");
});
btnLogDetailBack?.addEventListener("click", () => {
  showScreen("journal");
});
formEl.addEventListener("submit", handleSubmit);
addCarFormEl.addEventListener("submit", handleAddCarSubmit);
listEl.addEventListener("click", handleListClick);

initTelegram();
initDesignSystem();
initApp();
