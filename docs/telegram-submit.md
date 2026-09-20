# Отправка формы в Telegram

Токен бота **нельзя** класть в `js/config.js` на GitHub Pages — только на сервере.

## Сайт по ссылке из SMS (ваш случай)

Гости открывают **обычный сайт** в Safari/Chrome. Нет `Telegram.WebApp`, нет `initData`, **`sendData` не работает**.

Нужен **вариант B**: после шага «Имя» фронт делает `POST` на ваш backend → сервер вызывает `sendMessage` в ваш чат/группу.

### Что уже во фронте

После заполнения формы (экран успеха) один раз вызывается `submitOrderToTelegram(order)`:

- текст: имя, салат, горячее, напиток (`formatOrderText` в `js/telegram-submit.js`);
- если в Telegram Mini App — в текст может добавиться `@username`.

Настройка: `js/config.js`:

```js
export const TELEGRAM_SUBMIT = {
  apiUrl: "https://ваш-домен.example/submit",
  apiSubmitKey: "длинный-секрет-из-SMS-не-угадываемый",
  useSendData: false,
};
```

`apiSubmitKey` уходит в заголовке `X-Submit-Key`, чтобы случайный человек не спамил ваш endpoint (это не замена HTTPS, но для частного праздника достаточно).

### Backend (минимум)

1. Принять `POST /submit`, `Content-Type: application/json`.
2. Проверить `X-Submit-Key === SUBMIT_KEY` (если ключ задан).
3. Взять поле `text` из тела и отправить в Telegram:

```http
POST https://api.telegram.org/bot<BOT_TOKEN>/sendMessage
{ "chat_id": "<ADMIN_CHAT_ID>", "text": "..." }
```

`ADMIN_CHAT_ID` — ваш личный id или id группы (бот должен быть в группе). Узнать id: @userinfobot или `getUpdates` после сообщения боту.

Опционально: если позже откроете тот же URL **из** Mini App, в теле есть `initData` — можно **дополнительно** проверять подпись Telegram ([документация](https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app)).

### Деплой backend

Подойдёт любой хостинг с секретами в env:

- Cloudflare Workers / Vercel Function
- VPS + Node
- свой домен с HTTPS (обязательно для продакшена с телефона)

`apiUrl` на Pages должен быть **HTTPS** (не `http://127.0.0.1`).

---

## Локальный тест (SMS-сценарий)

**Терминал 1** — статика Party Menu:

```powershell
cd E:\git\party-menu
node scripts/serve.mjs
```

**Терминал 2** — тестовый API:

```powershell
$env:SUBMIT_KEY = "dev-secret"
$env:BOT_TOKEN = "123456:ABC..."      # опционально
$env:ADMIN_CHAT_ID = "123456789"      # опционально
node scripts/telegram-submit-server.mjs
```

**`js/config.js`** (только для локальной отладки):

```js
export const TELEGRAM_SUBMIT = {
  apiUrl: "http://127.0.0.1:8787/submit",
  apiSubmitKey: "dev-secret",
  useSendData: false,
};
```

На **телефоне в той же Wi‑Fi** вместо `127.0.0.1` укажите LAN IP ПК (как в выводе `serve.mjs`), например `http://192.168.1.10:8787/submit`.

**Проверка без браузера:**

```powershell
curl -X POST http://127.0.0.1:8787/submit `
  -H "Content-Type: application/json" `
  -H "X-Submit-Key: dev-secret" `
  -d "{\"text\":\"Тест заказа\"}"
```

Пройдите форму до конца — в консоли сервера или в Telegram должно появиться сообщение.

Без `BOT_TOKEN` сервер только печатает текст в консоль (удобно проверить, что фронт стучится).

---

## Mini App внутри Telegram (не ваш случай)

### Вариант A — `WebApp.sendData`

`useSendData: true`, `apiUrl: ""`. После отправки Telegram **закрывает** приложение — экран «календарь» гость не увидит.

### Вариант B — apiUrl + initData

Как выше, но сервер проверяет `initData` вместо (или вместе с) `X-Submit-Key`.

---

## Если отправка выключена

`apiUrl` пустой и `useSendData: false` → `submitOrderToTelegram` возвращает `skipped`, заказ только в `localStorage`.
