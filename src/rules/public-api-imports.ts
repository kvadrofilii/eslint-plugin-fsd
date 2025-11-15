import type { Rule } from 'eslint'
import { getImportPathWithoutAlias, isPathRelative, useFsdContextForImportFile } from '../utils'
import type { RuleContextWithOptions } from '../types'

export const publicApiImportsRule: Rule.RuleModule = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Правило запрещает импорт из слайса вне index.ts',
            recommended: true,
        },
        messages: {
            problemImport: 'Абсолютный импорт разрешен только через public API - index.ts',
        },
        fixable: 'code',
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

                // Если импорт относительный, то заканчиваем проверку
                if (isPathRelative(value)) return

                const importPath = getImportPathWithoutAlias(value, alias)
                const { layer, slice, structure } = useFsdContextForImportFile(importPath)
                if (!layer) return

                // Если сегментов в импорте больше двух, то импорт не из publicApi
                if (structure.length > 2) {
                    context.report({
                        node,
                        messageId: 'problemImport',
                        fix: (fixer) => {
                            const startsWith = alias === '' ? '' : `${alias}/`

                            return fixer.replaceText(node.source, `'${startsWith}${layer}/${slice}'`)
                        },
                    })
                }
            },
        }
    },
}
