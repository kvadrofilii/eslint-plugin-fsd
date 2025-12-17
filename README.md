# @michael-yakovlev/eslint-plugin-fsd

Этот плагин для ESLint содержит правила Feature-Sliced Design.

## Установка

Установите плагин выполнив команду в терминале:

```sh
npm install @michael-yakovlev/eslint-plugin-fsd --save-dev
```

## Использование

Добавьте плагин в файл конфигурации `eslint.config.ts`:

```ts
import { defineConfig } from 'eslint/config'
import pluginFsd from '@michael-yakovlev/eslint-plugin-fsd'

export default defineConfig([pluginFsd.configs.recommended])
```

Использование алиасов:

```ts
import { defineConfig } from 'eslint/config'
import pluginFsd from '@michael-yakovlev/eslint-plugin-fsd'

export default defineConfig([
    {
        ...pluginFsd.configs.recommended,
        rules: {
            'eslint-plugin-fsd/path-checker': ['error', { alias: '~' }],
            'eslint-plugin-fsd/layer-imports': ['error', { alias: '~' }],
            'eslint-plugin-fsd/public-api-imports': ['error', { alias: '~' }],
        },
    },
])
```

Добавление файлов Vue для проверки:

```ts
import { defineConfig } from 'eslint/config'
import pluginFsd from '@michael-yakovlev/eslint-plugin-fsd'

export default defineConfig([
    {
        ...pluginFsd.configs.recommended,
        files: ['**/*.?([cm])[jt]s?(x)', '**/*.vue'],
    },
])
```
