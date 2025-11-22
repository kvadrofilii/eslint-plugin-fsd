import type { Rule as EslintRule } from 'eslint'

export type FsdStructure = {
    layer: string | null
    // Поле slice не обязательное, так как можно обратиться к несуществующему индексу
    slice?: string
    structure: Array<string>
    layerLevel: number | null
}

export type RuleContextWithOptions = EslintRule.RuleContext & {
    options: Array<{
        alias?: string
    }>
}

export type Rule = EslintRule.RuleModule
