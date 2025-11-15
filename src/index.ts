import type { ESLint, Linter, Rule } from 'eslint'
import { name as pluginName, version } from '../package.json'
import { layerImportsRule } from './rules/layer-imports'
import { pathCheckerRule } from './rules/path-checker'
import { publicApiImportsRule } from './rules/public-api-imports'

const rules = {
    'path-checker': pathCheckerRule,
    'layer-imports': layerImportsRule,
    'public-api-imports': publicApiImportsRule,
} satisfies Record<string, Rule.RuleModule>

const basicRuleConfigs = {
    [`${pluginName}/path-checker`]: 'error',
    [`${pluginName}/layer-imports`]: 'error',
    [`${pluginName}/public-api-imports`]: 'error',
} as const satisfies Linter.RulesRecord

const recommendedConfig = {
    name: `${pluginName}/recommended`,
    rules: basicRuleConfigs,
} satisfies Linter.Config

// Base Plugin Object
const plugin_ = {
    meta: { name: pluginName, version },
    rules,
} satisfies ESLint.Plugin

const configs = {
    recommended: {
        ...recommendedConfig,
        plugins: {
            [pluginName]: plugin_,
        },
    },
} satisfies Record<string, Linter.Config>

const plugin = plugin_ as typeof plugin_ & {
    configs: typeof configs
}

plugin.configs = configs

export default plugin
