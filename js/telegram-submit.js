import { SALADS, MAINS, DRINKS } from "./menu-data.js";
import { TELEGRAM_SUBMIT } from "./config.js";

const tg = window.Telegram?.WebApp;

/** @param {import("./menu-data.js").MenuOption[]} options @param {string} id */
function labelFor(options, id) {
  return options.find((o) => o.id === id)?.title ?? id;
}

/** @param {import("./storage.js").PartyOrder} order */
export function formatOrderText(order) {
  const lines = [
    "🎉 Новый выбор меню",
    "",
    `Имя: ${order.name ?? "—"}`,
    `Салат: ${labelFor(SALADS, order.salad ?? "")}`,
    `Горячее: ${labelFor(MAINS, order.main ?? "")}`,
    `Напиток: ${labelFor(DRINKS, order.drink ?? "")}`,
  ];

  const user = tg?.initDataUnsafe?.user;
  if (user) {
    const handle = user.username ? `@${user.username}` : "—";
    lines.push("", `Telegram: ${handle} (id ${user.id})`);
  }

  return lines.join("\n");
}

/** @param {import("./storage.js").PartyOrder} order */
function buildPayload(order) {
  return {
    type: "party-menu-order",
    text: formatOrderText(order),
    order: {
      name: order.name,
      salad: order.salad,
      main: order.main,
      drink: order.drink,
    },
    initData: tg?.initData ?? "",
  };
}

/**
 * @param {import("./storage.js").PartyOrder} order
 * @returns {Promise<"api" | "sendData" | "skipped" | "error">}
 */
export async function submitOrderToTelegram(order) {
  const payload = buildPayload(order);

  if (TELEGRAM_SUBMIT.apiUrl) {
    /** @type {Record<string, string>} */
    const headers = { "Content-Type": "application/json" };
    if (TELEGRAM_SUBMIT.apiSubmitKey) {
      headers["X-Submit-Key"] = TELEGRAM_SUBMIT.apiSubmitKey;
    }
    try {
      const res = await fetch(TELEGRAM_SUBMIT.apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        console.error("submit api", res.status, await res.text());
        return "error";
      }
      return "api";
    } catch (err) {
      console.error(err);
      return "error";
    }
  }

  if (TELEGRAM_SUBMIT.useSendData && tg?.sendData) {
    tg.sendData(JSON.stringify(payload));
    return "sendData";
  }

  return "skipped";
}
