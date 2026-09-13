import { initCheckboxes } from "./checkbox.js";
import { initDateInputs } from "./date-input.js";
import { initComboboxes } from "./combobox.js";
import { initDrawers } from "./drawer.js";
import { initSelects } from "./select.js";
import { initHeaders } from "./header.js";
import { initScreenFooters } from "./screen-footer.js";
import { initSwitches } from "./switch.js";

export function initDesignSystem(root = document) {
  initCheckboxes(root);
  initDateInputs(root);
  initHeaders(root);
  initSwitches(root);
  initDrawers(root);
  initSelects(root);
  initComboboxes(root);
  initScreenFooters(root);
}
