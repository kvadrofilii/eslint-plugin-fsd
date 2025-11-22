import type { Rule } from 'eslint'
import nodePath from 'node:path'
import type { RuleContextWithOptions } from './types'

/**
 * Проверяет является ли путь относительным
 * @param {string} path
 * @returns {boolean}
 */
export function isPathRelative(path: string): boolean {
    return path === '.' || path.startsWith('./') || path.startsWith('../')
}

/**
 * Возвращает полный путь до файла
 * @param {string} context
 * @returns {string}
 */
export function getSourcePath(context: Rule.RuleContext): string {
    return context.physicalFilename ? context.physicalFilename : context.filename
}

/**
 * Возвращает путь к src директории, содержащемуся в переданном пути
 * @param {string} path
 * @returns {string}
 */
export function getProjectSourceRoot(path: string): string {
    const lastIndex = path.lastIndexOf('src')

    return path.slice(0, lastIndex + 'src'.length)
}

/**
 * Возвращает путь без алиаса и алиас
 * @param {string} path
 * @param {RuleContextWithOptions} context
 * @returns {{pathWithoutAlias: string, alias: string}}
 */
export function usePathWithoutAlias(
    path: string,
    context: RuleContextWithOptions,
): { pathWithoutAlias: string; alias: string } {
    const { options } = context
    const alias: string = options[0]?.alias || ''
    const pathWithoutAlias = alias === '' ? path : path.replace(`${alias}/`, '')

    return { pathWithoutAlias, alias }
}

/**
 * Формирует полный путь импортируемого значения
 * @param {string} sourcePath
 * @param {string} importPath
 * @param {RuleContextWithOptions} context
 */
export function getImportPath(sourcePath: string, importPath: string, context: RuleContextWithOptions) {
    const { pathWithoutAlias } = usePathWithoutAlias(importPath, context)

    // Если путь относительный
    if (isPathRelative(importPath)) {
        const sourceDirname = nodePath.dirname(sourcePath)
        return nodePath.resolve(sourceDirname, pathWithoutAlias)
    }

    const projectSourceRoot = getProjectSourceRoot(sourcePath)

    return nodePath.join(projectSourceRoot, pathWithoutAlias)
}
