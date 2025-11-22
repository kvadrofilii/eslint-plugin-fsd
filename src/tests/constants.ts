import type { Linter } from 'eslint'

export const aliasOptions = [{ alias: '~' }]

export const parserOptions: Linter.ParserOptions = {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
}
