import { isPathRelative, usePathWithoutAlias } from '../fs'
import { useFsdContext } from '../fsd'
import type { Rule, RuleContextWithOptions } from '../types'

export const publicApiImportsRule: Rule = {
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
        return {
            ImportDeclaration(node) {
                const value = node.source.value
                if (!value || typeof value !== 'string') return

                // Если импорт относительный, то заканчиваем проверку
                if (isPathRelative(value)) return

                const { pathWithoutAlias: importPath, alias } = usePathWithoutAlias(value, context)
                const { layer, slice, structure } = useFsdContext(importPath)
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
