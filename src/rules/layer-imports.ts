import { Layers } from '../constants'
import { getImportPath, getSourcePath } from '../fs'
import { useFsdContext } from '../fsd'
import type { Rule, RuleContextWithOptions } from '../types'

export const layerImportsRule: Rule = {
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
        return {
            ImportDeclaration(node) {
                const sourcePath = getSourcePath(context)
                const currentFsdContext = useFsdContext(sourcePath)
                if (!currentFsdContext.layer || currentFsdContext.layerLevel === null) return

                const value = node.source.value
                if (!value || typeof value !== 'string') return

                const importPath = getImportPath(sourcePath, value, context)
                const importFsdContext = useFsdContext(importPath)
                if (!importFsdContext.layer || importFsdContext.layerLevel === null) return

                // Исключаю импорты внутри слоя 'app'
                if (importFsdContext.layer === Layers.app && currentFsdContext.layer === Layers.app) return
                // Исключаю импорты внутри слоя 'shared'
                if (importFsdContext.layer === Layers.shared && currentFsdContext.layer === Layers.shared) return

                if (
                    currentFsdContext.layerLevel >= importFsdContext.layerLevel &&
                    currentFsdContext.slice !== importFsdContext.slice
                ) {
                    context.report({ node: node, messageId: 'notRelative' })
                }
            },
        }
    },
}
