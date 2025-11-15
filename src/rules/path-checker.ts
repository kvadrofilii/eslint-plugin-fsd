import {
    getCurrentPath,
    getImportPathWithoutAlias,
    isPathRelative,
    useFsdContextForCurrentFile,
    useFsdContextForImportFile,
} from '../utils'
import type { Rule } from 'eslint'
import { Layers } from '../constants'
import type { RuleContextWithOptions } from '../types'

export const pathCheckerRule: Rule.RuleModule = {
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
        const { options } = context
        const alias: string = options[0]?.alias || ''

        return {
            ImportDeclaration(node) {
                const value = node.source.value

                if (!value || typeof value !== 'string') return

                // Если импорт относительный, то заканчиваю проверку
                if (isPathRelative(value)) return

                const importPath = getImportPathWithoutAlias(value, alias)
                const { layer: importPathLayer, slice: importPathSlice } = useFsdContextForImportFile(importPath)
                if (!importPathLayer || !importPathSlice) return

                const currentPath = getCurrentPath(context)
                const { layer: currentPathLayer, slice: currentPathSlice } = useFsdContextForCurrentFile(currentPath)
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
