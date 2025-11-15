import type { Rule } from 'eslint'
import {
    getCurrentPath,
    getImportPathWithoutAlias,
    isPathRelative,
    useFsdContextForCurrentFile,
    useFsdContextForImportFile,
} from '../utils'
import type { RuleContextWithOptions } from '../types'
import { Layers } from '../constants'

export const layerImportsRule: Rule.RuleModule = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Правило запрещает нарушать порядок импортов между слоями',
            recommended: true,
        },
        messages: {
            notRelative: 'Слой может импортировать в себя только нижележащие слои',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    alias: {
                        type: 'string',
                    },
                },
            },
        ],
    },
    create(context: RuleContextWithOptions) {
        const { options } = context
        const alias: string = options[0]?.alias || ''

        return {
            ImportDeclaration(node) {
                const value = node.source.value

                if (!value || typeof value !== 'string') return

                // Если импорт относительный, то заканчиваю проверку
                if (isPathRelative(value)) return
                const importPath = getImportPathWithoutAlias(value, alias)
                //console.log(importPath)
                const importFsdContext = useFsdContextForImportFile(importPath)
                if (!importFsdContext.layer || importFsdContext.layerLevel === null) return

                const currentPath = getCurrentPath(context)
                const currentFsdContext = useFsdContextForCurrentFile(currentPath)
                if (!currentFsdContext.layer || currentFsdContext.layerLevel === null) return

                // Исключаю импорты внутри слоя 'app'
                if (importFsdContext.layer === Layers.app && currentFsdContext.layer === Layers.app) return
                // Исключаю импорты внутри слоя 'shared'
                if (importFsdContext.layer === Layers.shared && currentFsdContext.layer === Layers.shared) return

                if (currentFsdContext.layerLevel >= importFsdContext.layerLevel) {
                    context.report({ node: node, messageId: 'notRelative' })
                }
            },
        }
    },
}
