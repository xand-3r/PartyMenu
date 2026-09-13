# Mini Garage Design System

CSS-порт [shadcn-css](https://github.com/BadreddineIbril/shadcn-css) + **DTCG design tokens** (канон).

## Токены

**Канон:** `tokens/*.tokens.json` → `node scripts/build-tokens.mjs` → `tokens/generated.css`

См. `tokens/README.md`

## Структура

```
design-system/
├── tokens/           ← DTCG JSON + generated.css
├── foundations/
├── components/       ← ds-* классы, переменные --semantic-* / --component-* / --primitives-*
└── index.css
```

## Иконки

[Remix Icon](https://github.com/Remix-Design/RemixIcon) — `assets/remixicon/`, хелперы `js/icons.js`.

## Подключение

```html
<link rel="stylesheet" href="design-system/index.css" />
```

## Showcase

`showcase.html` — галерея компонентов.
