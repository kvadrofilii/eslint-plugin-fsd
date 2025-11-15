import type { Linter } from 'eslint'

export enum Layers {
    app = 'app',
    pages = 'pages',
    widgets = 'widgets',
    features = 'features',
    entities = 'entities',
    shared = 'shared',
}

export const LAYERS_MAP: Record<string, keyof typeof Layers> = {
    [Layers.app]: Layers.app,
    [Layers.pages]: Layers.pages,
    [Layers.widgets]: Layers.widgets,
    [Layers.features]: Layers.features,
    [Layers.entities]: Layers.entities,
    [Layers.shared]: Layers.shared,
} as const

export const LAYERS = Object.values(LAYERS_MAP)

export const PUBLIC_API_FILE_REGEXP: RegExp = /^.*\..*/i

export const aliasOptions = [{ alias: '~' }]

export const parserOptions: Linter.ParserOptions = {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
}
