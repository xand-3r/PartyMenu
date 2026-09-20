import { initDesignSystem } from "../vendor/ds/js/design-system/index.js";
import { setHeaderStepper } from "../vendor/ds/js/design-system/header.js";
import { FORM_STEPS } from "./menu-data.js";
import { loadOrder, patchOrder, saveOrder } from "./storage.js";
import { downloadCalendarEvent } from "./calendar.js";
import { HOME_PHOTO, SUCCESS_PHOTO } from "./photos.js";
import { applyTelegramChrome } from "./theme.js";
import { submitOrderToTelegram } from "./telegram-submit.js";
import { bindDishDetailPanel, initDishDetailDrawer } from "./dish-detail.js";

const tg = window.Telegram?.WebApp;
const SUBMIT_SESSION_KEY = "party-menu-telegram-submitted";

const screenHome = document.getElementById("screen-home");
const screenForm = document.getElementById("screen-form");
const screenSuccess = document.getElementById("screen-success");
const formHeader = document.getElementById("form-header");
const formStepHeading = document.getElementById("form-step-heading");
const formStepPanel = document.getElementById("form-step-panel");
const btnHomeStart = document.getElementById("btn-home-start");
const btnFormBack = document.getElementById("btn-form-back");
const btnFormNext = document.getElementById("btn-form-next");
const btnAddCalendar = document.getElementById("btn-add-calendar");
const btnAddPerson = document.getElementById("btn-add-person");

/** @type {Record<string, HTMLElement | null>} */
const screens = {
  home: screenHome,
  form: screenForm,
  success: screenSuccess,
};

/** @type {number} 0-based index in FORM_STEPS */
let currentStep = 0;

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function showScreen(name) {
  for (const [key, el] of Object.entries(screens)) {
    el?.classList.toggle("hidden", key !== name);
  }
}

function getStepConfig() {
  return FORM_STEPS[currentStep];
}

function updateStepperUi() {
  const step = currentStep + 1;
  if (formHeader instanceof HTMLElement) {
    formHeader.dataset.stepperCurrent = String(step);
    formHeader.dataset.stepperTotal = String(FORM_STEPS.length);
  }
  setHeaderStepper(formHeader, step, FORM_STEPS.length);
}

function getSelectedRadioValue(groupEl) {
  if (!(groupEl instanceof HTMLElement)) return "";
  const checked = groupEl.querySelector('.ds-item[data-variant="radio"][aria-checked="true"]');
  return checked instanceof HTMLElement ? checked.dataset.value || "" : "";
}

function renderRadioStep(stepKey, options, selectedId) {
  const groupId = `radio-group-${stepKey}`;
  const items = options
    .map((option) => {
      const selected = option.id === selectedId ? ' data-selected="true"' : "";
      const icon = option.icon || "ri-image-line";
      const thumbSrc = option.image ? encodeURI(option.image) : "";
      const detailSrc = encodeURI(option.imageDetail || option.image || "");
      const media = option.image
        ? `<span class="ds-item__media" data-variant="photo" aria-hidden="true">
            <img src="${escapeHtml(thumbSrc)}" alt="" width="48" height="48" loading="lazy" decoding="async" />
          </span>`
        : `<span class="ds-item__media" data-variant="icon" aria-hidden="true">
            <i class="ds-icon ds-icon--lg ${escapeHtml(icon)}" aria-hidden="true"></i>
          </span>`;
      const dishImage =
        option.image && detailSrc
          ? ` data-dish-image="${escapeHtml(detailSrc)}" data-dish-thumb="${escapeHtml(thumbSrc)}"`
          : "";
      return `
        <button
          type="button"
          class="ds-item ds-item--select"
          data-variant="radio"
          data-value="${escapeHtml(option.id)}"
          data-dish-title="${escapeHtml(option.title)}"
          data-dish-description="${escapeHtml(option.description)}"
          ${dishImage}
          ${selected}
        >
          ${media}
          <span class="ds-item__content">
            <span class="ds-item__title">${escapeHtml(option.title)}</span>
            <span class="ds-item__description">${escapeHtml(option.description)}</span>
          </span>
          <span class="ds-item__select-icon" aria-hidden="true">
            <i class="ds-icon ri-checkbox-blank-circle-line ds-item__select-icon--default" aria-hidden="true"></i>
            <i class="ds-icon ri-checkbox-circle-fill ds-item__select-icon--selected" aria-hidden="true"></i>
          </span>
        </button>
      `;
    })
    .join("");

  formStepPanel.innerHTML = `
    <div
      class="ds-item-group"
      id="${groupId}"
      data-ds-item-radio-group
      data-step-key="${stepKey}"
      aria-label="${escapeHtml(getStepConfig().heading)}"
    >
      ${items}
    </div>
  `;

  initDesignSystem(formStepPanel);
}

function renderNameStep(name) {
  formStepPanel.innerHTML = `
    <form id="name-form" class="form-step__name-form" novalidate>
      <div class="ds-field" data-field="name">
        <input
          class="ds-input"
          type="text"
          id="field-name"
          name="name"
          placeholder="Имя"
          autocomplete="name"
          value="${escapeHtml(name)}"
        />
        <p class="ds-field-error" data-field-error hidden>Укажите имя</p>
      </div>
    </form>
  `;

  const input = document.getElementById("field-name");
  input?.addEventListener("input", () => setNameFieldError(false));
}

function setNameFieldError(hasError) {
  const field = formStepPanel.querySelector('[data-field="name"]');
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

function renderCurrentStep() {
  const config = getStepConfig();
  if (!(formStepHeading instanceof HTMLElement)) return;

  formStepHeading.textContent = config.heading;
  updateStepperUi();

  const order = loadOrder();

  if (config.key === "name") {
    renderNameStep(order.name || "");
    return;
  }

  const selected = order[config.key] || "";
  renderRadioStep(config.key, config.options || [], selected);
}

function validateCurrentStep() {
  const config = getStepConfig();
  if (config.key === "name") {
    const input = document.getElementById("field-name");
    const name = input instanceof HTMLInputElement ? input.value.trim() : "";
    const valid = name.length > 0;
    setNameFieldError(!valid);
    if (!valid) return null;
    return { name };
  }

  const group = formStepPanel.querySelector("[data-ds-item-radio-group]");
  const value = getSelectedRadioValue(group);
  if (!value) {
    tg?.HapticFeedback?.notificationOccurred("error");
    return null;
  }
  return { [config.key]: value };
}

function persistStep(patch) {
  patchOrder(patch);
}

function openFormAt(stepIndex) {
  currentStep = Math.max(0, Math.min(stepIndex, FORM_STEPS.length - 1));
  renderCurrentStep();
  showScreen("form");
}

function goNext() {
  const patch = validateCurrentStep();
  if (!patch) return;

  persistStep(patch);
  tg?.HapticFeedback?.impactOccurred("light");

  if (currentStep >= FORM_STEPS.length - 1) {
    void notifyTelegram(loadOrder());
    showScreen("success");
    return;
  }

  currentStep += 1;
  renderCurrentStep();
}

function goBack() {
  if (currentStep <= 0) {
    showScreen("home");
    return;
  }
  currentStep -= 1;
  renderCurrentStep();
}

function bindHeroPhotos() {
  const home = document.getElementById("hero-photo-home");
  const success = document.getElementById("hero-photo-success");
  if (home instanceof HTMLImageElement) home.src = HOME_PHOTO;
  if (success instanceof HTMLImageElement) success.src = SUCCESS_PHOTO;
}

function isOrderComplete(order) {
  return Boolean(order.salad && order.main && order.drink && order.name?.trim());
}

/** @param {import("./storage.js").PartyOrder} order */
async function notifyTelegram(order) {
  if (!isOrderComplete(order)) return;
  const fingerprint = [order.salad, order.main, order.drink, order.name].join("|");
  if (sessionStorage.getItem(SUBMIT_SESSION_KEY) === fingerprint) return;

  const result = await submitOrderToTelegram(order);
  if (result === "error") {
    const msg = "Не удалось отправить выбор. Попробуйте позже.";
    if (tg?.showAlert) tg.showAlert(msg);
    else window.alert(msg);
    return;
  }
  if (result !== "skipped") {
    sessionStorage.setItem(SUBMIT_SESSION_KEY, fingerprint);
  }
}

function initApp() {
  const order = loadOrder();
  if (isOrderComplete(order)) {
    showScreen("success");
    return;
  }
  showScreen("home");
}

btnHomeStart?.addEventListener("click", () => openFormAt(0));
btnFormBack?.addEventListener("click", goBack);
btnFormNext?.addEventListener("click", goNext);
btnAddCalendar?.addEventListener("click", () => {
  downloadCalendarEvent(loadOrder());
  tg?.HapticFeedback?.notificationOccurred("success");
});

btnAddPerson?.addEventListener("click", () => {
  sessionStorage.removeItem(SUBMIT_SESSION_KEY);
  saveOrder({});
  currentStep = 0;
  renderCurrentStep();
  showScreen("form");
  tg?.HapticFeedback?.impactOccurred("light");
});

applyTelegramChrome();
initDesignSystem();
initDishDetailDrawer();
bindDishDetailPanel(formStepPanel);
bindHeroPhotos();
initApp();
