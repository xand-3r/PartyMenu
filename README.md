# Party Menu

Telegram Mini App — выбор меню на праздник (салат, горячее, напиток, имя) и добавление события в календарь.

## Стек

- HTML + **design system** (git submodule) + Vanilla JS
- localStorage
- [Telegram Web App SDK](https://telegram.org/js/telegram-web-app.js)
- GitHub Pages (GitHub Actions)

## Design System

UI kit: [xand-3r/design-system](https://github.com/xand-3r/design-system)

Подключён как submodule: `vendor/ds/`

```bash
git submodule update --init --recursive
```

Локально, если submodule ещё не инициализирован, dev-сервер подхватывает соседний клон `../design-system` (или путь из `DS_ROOT`).

## Локальный просмотр

```bash
git submodule update --init --recursive
node scripts/serve.mjs
```

- App: http://localhost:8080/

Другой путь к design-system:

```powershell
$env:DS_ROOT="E:\git\design-system"; node scripts/serve.mjs
```

## Экраны

1. **Главная** — фото приглашения (`assets/images/`, последний по имени) и кнопка «Я пойду»
2. **Шаг 1** — салат (`ds-item` radio)
3. **Шаг 2** — горячее
4. **Шаг 3** — напиток
5. **Шаг 4** — имя
6. **Успех** — то же фото + «Добавить в календарь» (файл `.ics`)

## Отправка формы в Telegram

Сайт для гостей по **SMS** (не Mini App): backend + `apiUrl` и `apiSubmitKey` в `js/config.js`. Локальный тест: `node scripts/telegram-submit-server.mjs`. Подробно: [docs/telegram-submit.md](docs/telegram-submit.md).

## Деплой

Как в Mini Garage: workflow `.github/workflows/deploy-pages.yml`, secret `DS_REPO_TOKEN` для private submodule.

## Структура

```
index.html
assets/images/      — приглашение и другие фото
vendor/ds/          — design system (submodule)
css/app.css
js/
  app.js
  menu-data.js
  storage.js
  calendar.js
  photos.js
scripts/serve.mjs
```
