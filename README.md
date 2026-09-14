# Mini Garage

Telegram Mini App — журнал обслуживания автомобиля.

**План и лог проекта** — в отдельном репозитории:  
`household-knowledge-base/notes/mini-garage/plan.md`

## Стек (волна 1)

- HTML + **design system** (git submodule) + Vanilla JS
- localStorage
- [Telegram Web App SDK](https://telegram.org/js/telegram-web-app.js)
- GitHub Pages (GitHub Actions)

## Design System

UI kit в отдельном репозитории: [xand-3r/design-system](https://github.com/xand-3r/design-system)

Подключён как submodule: `vendor/ds/`

```bash
git submodule update --init --recursive
```

- CSS: `vendor/ds/design-system/index.css`
- JS: `vendor/ds/js/design-system/index.js`
- Showcase: в репозитории design-system (`showcase.html`)

## Локальный просмотр

```bash
git submodule update --init --recursive
node scripts/serve.mjs
```

Сервер отдаёт файлы **без кэша** (актуальные токены и CSS).

- App: http://localhost:8080
- Typography: http://localhost:8080/typography.html

**На телефоне (та же Wi‑Fi):** после запуска сервер выведет LAN-адрес, например `http://192.168.x.x:8080/`.

Если порт 8080 занят: `$env:PORT=8081; node scripts/serve.mjs`

## Деплой на GitHub Pages

1. Закоммитьте и запушьте код в `main` (вместе с submodule).
2. GitHub → **Settings** → **Pages** → Source: **GitHub Actions**.
3. Workflow `.github/workflows/deploy-pages.yml` деплоит app + submodule.
4. URL: `https://xand-3r.github.io/mini-garage/`

Репозиторий `design-system` **private** — в mini-garage нужен secret **`DS_REPO_TOKEN`**:

1. GitHub → **Settings** → **Developer settings** → **Fine-grained tokens** → **Generate**
2. Repository access: только `design-system`
3. Permissions: **Contents → Read-only**
4. Скопируйте токен → mini-garage → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
5. Name: `DS_REPO_TOKEN`, Value: вставьте токен
6. **Actions** → **Deploy GitHub Pages** → **Run workflow**

## Привязка к боту

1. **@BotFather** → ваш бот.
2. `/setmenubutton` → текст: **Журнал**.
3. URL: `https://xand-3r.github.io/mini-garage/`

## Структура

```
index.html          — Mini App
vendor/ds/          — design system (submodule)
css/                — стили приложения
js/
  storage.js        — localStorage
  app.js            — UI и логика
scripts/serve.mjs   — dev server
```
