# Design Tokens (DTCG — канон)

## Источник правды

| Файл | Слой |
|------|------|
| `primitives.tokens.json` | Примитивы (цвета, spacing, typography) |
| `semantic.tokens.json` | Семантика (surface, text, border…) |
| `component.tokens.json` | Компоненты (button primary/secondary…) |

Экспорт из Figma (tokens-bruecke), spec: [DTCG 2025.10](https://www.designtokens.org/tr/2025.10/format/).

## Сборка CSS

После правки JSON:

```bash
node scripts/build-tokens.mjs
```

Генерирует **`generated.css`** — все `--primitives-*`, `--semantic-*`, `--component-*`.

В CSS компонентов используются **только эти имена** (без промежуточных алиасов).

## Workflow

1. Обновить `*.tokens.json` (из Figma / Desktop)
2. `node scripts/build-tokens.mjs`
3. Проверить `showcase.html` и приложение

Не редактировать `generated.css` вручную.
