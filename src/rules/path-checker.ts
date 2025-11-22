import { Layers } from '../constants'
import { getSourcePath, isPathRelative, usePathWithoutAlias } from '../fs'
import { useFsdContext } from '../fsd'
import type { Rule, RuleContextWithOptions } from '../types'

export const pathCheckerRule: Rule = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Правило запрещает абсолютные импорты в рамках одного слайса',
            recommended: true,
        },
        messages: {
            notRelative: 'В рамках одного слайса не должно быть абсолютных импортов',
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
                const value = node.source.value

                if (!value || typeof value !== 'string') return

                // Если импорт относительный, то заканчиваю проверку
                if (isPathRelative(value)) return

                const { pathWithoutAlias: importPath } = usePathWithoutAlias(value, context)
                const { layer: importPathLayer, slice: importPathSlice } = useFsdContext(importPath)
                if (!importPathLayer || !importPathSlice) return

                const sourcePath = getSourcePath(context)
                const { layer: currentPathLayer, slice: currentPathSlice } = useFsdContext(sourcePath)
                if (!currentPathLayer || !currentPathSlice) return

                // Исключаю слой 'shared'
                if (importPathLayer === Layers.shared && currentPathLayer === Layers.shared) return

                if (currentPathSlice === importPathSlice && currentPathLayer === importPathLayer) {
                    context.report({ node, messageId: 'notRelative' })
                }
            },
        }
    },
}
