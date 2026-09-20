/** Читает канонические CSS-переменные из generated.css / runtime.css */
export function token(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** Синхронизирует шапку Telegram Mini App с DTCG токенами */
export function applyTelegramChrome() {
  const surface = token("--semantic-color-surface-neutral-base") || "#ffffff";

  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta instanceof HTMLMetaElement) {
    themeMeta.content = surface;
  }

  const tg = window.Telegram?.WebApp;
  if (!tg) return;

  tg.ready();
  tg.expand();

  const bg = token("--semantic-color-background-base");

  if (bg && tg.setBackgroundColor) tg.setBackgroundColor(bg);
  if (surface && tg.setHeaderColor) tg.setHeaderColor(surface);
  if (surface && tg.setBottomBarColor) tg.setBottomBarColor(surface);
}
