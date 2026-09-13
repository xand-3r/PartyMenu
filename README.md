# Mini Garage

Telegram Mini App — журнал обслуживания автомобиля.

**План и лог проекта** — в отдельном репозитории:  
`household-knowledge-base/notes/mini-garage/plan.md`

## Стек (волна 1)

- HTML + **design-system/** (порт [shadcn-css](https://github.com/BadreddineIbril/shadcn-css)) + Vanilla JS
- Иконки: [Remix Icon](https://github.com/Remix-Design/RemixIcon) (`assets/remixicon/`)
- localStorage
- [Telegram Web App SDK](https://telegram.org/js/telegram-web-app.js)
- GitHub Pages

## Design System

См. `design-system/README.md` — компоненты `ds-*`, **DTCG токены** (`design-system/tokens/*.tokens.json`).

После изменения токенов: `node scripts/build-tokens.mjs`

Галерея компонентов: `showcase.html`

## Локальный просмотр

```bash
node scripts/serve.mjs
```

Сервер отдаёт файлы **без кэша** (актуальные токены и CSS).

- App: http://localhost:8080
- Showcase: http://localhost:8080/showcase.html
- Typography: http://localhost:8080/typography.html

**На телефоне (та же Wi‑Fi):** после запуска сервер выведет LAN-адрес, например `http://192.168.x.x:8080/`. IP у каждого компьютера свой — смотрите вывод `node scripts/serve.mjs` или `ipconfig`.

Если порт 8080 занят старым процессом: `$env:PORT=8081; node scripts/serve.mjs`

## Деплой на GitHub Pages

1. Закоммитьте и запушьте код в `main`.
2. GitHub → **Settings** → **Pages**.
3. Source: **Deploy from branch** → `main` → `/ (root)` → Save.
4. URL: `https://xand-3r.github.io/mini-garage/`

## Привязка к боту

1. **@BotFather** → ваш бот.
2. `/setmenubutton` → текст: **Журнал**.
3. URL: `https://xand-3r.github.io/mini-garage/`

## Структура

```
index.html      — Mini App
css/            — стили
js/
  storage.js    — localStorage
  app.js        — UI и логика
```
