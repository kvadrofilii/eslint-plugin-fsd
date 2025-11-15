import nodePath from 'node:path'
import { LAYERS, LAYERS_MAP, type Layers } from './constants'
import type { Rule } from 'eslint'
import type { FsdStructure } from './types'

/**
 * Проверяет является ли путь относительным
 * @param {string} path
 * @returns {boolean}
 */
export function isPathRelative(path: string): boolean {
    return path === '.' || path.startsWith('./') || path.startsWith('../')
}

/**
 * Проверяет содержит ли путь один из слоев FSD
 * @param {string} path
 * @returns {boolean}
 */
export function isFsdLayer(path: string): boolean {
    return Boolean(LAYERS_MAP[path])
}

/**
 * Возвращает название слоя
 * @param {string} path
 * @returns {Layers | null}
 */
export function getLayer(path: string): Layers | null {
    return isFsdLayer(path) ? (path as Layers) : null
}

/**
 * Возвращает числовое значение слоя
 * @param {Layers} layer
 * @returns {number}
 */
export function getLayerLevel(layer: Layers): number {
    return LAYERS.indexOf(layer)
}

/**
 * Возвращает полный путь до файла
 * @param {string} context
 * @returns {string}
 */
export function getCurrentPath(context: Rule.RuleContext): string {
    return context.physicalFilename ? context.physicalFilename : context.filename
}

/**
 * Возвращает импорт без алиаса
 * @param {string} importPath
 * @param {string} alias
 * @returns {string}
 */
export function getImportPathWithoutAlias(importPath: string, alias: string): string {
    return alias === '' ? importPath : importPath.replace(`${alias}/`, '')
}

/**
 * Возвращает название слоя, название слайса и полный путь от слоя до импортируемого файла
 * @param {string} importPath
 * @returns {FsdStructure}
 */
export function useFsdContextForImportFile(importPath: string): FsdStructure {
    // Разбиваю путь на массив строк
    const currentPathArray = importPath.split(nodePath.sep)

    const layer = getLayer(currentPathArray[0])
    const layerLevel = layer === null ? null : getLayerLevel(layer)

    return { layer, slice: currentPathArray[1], layerLevel, structure: currentPathArray }
}

/**
 * Возвращает название слоя, название слайса и полный путь от слоя до текущего файла
 * @param {string} filePath
 * @returns {FsdStructure}
 */
export function useFsdContextForCurrentFile(filePath: string): FsdStructure {
    // Разбиваю путь на массив строк
    const currentPathArray = filePath.split(nodePath.sep)

    // Получаю номер позиции директории 'src'
    const srcPosition = currentPathArray.lastIndexOf('src')
    const structure = currentPathArray.slice(srcPosition + 1)

    const layer = getLayer(structure[0])
    const layerLevel = layer === null ? null : getLayerLevel(layer)

    return { layer, slice: structure[1], layerLevel, structure }
}
