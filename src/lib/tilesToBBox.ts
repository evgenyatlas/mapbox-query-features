import { tileToBBOX } from "@mapbox/tilebelt"
import { IBbox, ITiles } from "../types"

/**
 * Returns bbox from sorted tiles
 * @param {IBbox} tiles sorted list of tiles
 * @returns IBbox
 */
export function tilesToBBox(tiles: ITiles[]): IBbox {
    const leftBottom = tileToBBOX(tiles[0])
    const rightTop = tileToBBOX(tiles[tiles.length - 1])

    return [leftBottom[0], leftBottom[1], rightTop[2], rightTop[3]]
}