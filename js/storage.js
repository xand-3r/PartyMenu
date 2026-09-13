const STORAGE_KEY = "mini_garage_maintenance_logs";
const VEHICLE_KEY = "mini_garage_vehicle";

/** ID, работает и по HTTP (телефон в локальной сети) */
export function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `mg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** @typedef {{ id: string, date: string, mileage: number, cost: number, works: string, type?: string, typeLabel?: string, note?: string }} MaintenanceLog */
/** @typedef {{ brand: string, model: string, year?: number, mileage: number }} Vehicle */

/** @returns {MaintenanceLog[]} */
export function loadLogs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** @param {MaintenanceLog[]} logs */
export function saveLogs(logs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

/** @param {MaintenanceLog} log */
export function addLog(log) {
  const logs = loadLogs();
  logs.unshift(log);
  saveLogs(logs);
  return logs;
}

/** @param {string} id */
export function getLogById(id) {
  return loadLogs().find((item) => item.id === id) ?? null;
}

/** @param {string} id */
export function deleteLog(id) {
  const logs = loadLogs().filter((item) => item.id !== id);
  saveLogs(logs);
  return logs;
}

/** @returns {Vehicle | null} */
export function loadVehicle() {
  try {
    const raw = localStorage.getItem(VEHICLE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.brand !== "string") return null;
    return {
      brand: parsed.brand,
      model: typeof parsed.model === "string" ? parsed.model : "",
      year: Number(parsed.year) || undefined,
      mileage: Number(parsed.mileage) || 0,
    };
  } catch {
    return null;
  }
}

/** @param {Vehicle} vehicle */
export function saveVehicle(vehicle) {
  localStorage.setItem(VEHICLE_KEY, JSON.stringify(vehicle));
}
