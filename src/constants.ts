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
