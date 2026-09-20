/**
 * Отправка заказа в Telegram.
 *
 * Сайт по SMS (обычный браузер): только apiUrl + apiSubmitKey, useSendData: false.
 * Mini App в Telegram: apiUrl + проверка initData на сервере, либо useSendData: true.
 *
 * @see docs/telegram-submit.md
 */
export const TELEGRAM_SUBMIT = {
  /** POST endpoint вашего backend (Cloudflare Worker, VPS, scripts/telegram-submit-server.mjs) */
  apiUrl: "",
  /** Общий секрет в заголовке X-Submit-Key (для сайта без Telegram initData) */
  apiSubmitKey: "",
  useSendData: false,
};
