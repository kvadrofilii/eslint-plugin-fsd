import type { Rule } from 'eslint'

export type LiteralNodeValue = string | number | bigint | boolean | RegExp | null

export type FsdStructure = {
    layer: string | null
    // Поле slice не обязательное, так как можно обратиться к несуществующему индексу
    slice?: string
    structure: Array<string>
    layerLevel: number | null
}

export type RuleContextWithOptions = Rule.RuleContext & {
    options: Array<{
        alias?: string
    }>
}
