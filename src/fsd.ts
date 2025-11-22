import nodePath from 'node:path'
import { LAYERS, LAYERS_MAP, type Layers } from './constants'
import type { FsdStructure } from './types'

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
 * Возвращает название слоя, название слайса и полный путь от слоя до текущего файла
 * @param {string} path
 * @returns {FsdStructure}
 */
export function useFsdContext(path: string): FsdStructure {
    // Разбиваю путь на массив строк
    const currentPathArray = path.split(nodePath.sep)

    // Получаю номер позиции директории 'src'
    const srcPosition = currentPathArray.lastIndexOf('src')
    const structure = currentPathArray.slice(srcPosition + 1)

    const layer = getLayer(structure[0])
    const layerLevel = layer === null ? null : getLayerLevel(layer)

    return { layer, slice: structure[1], layerLevel, structure }
}
