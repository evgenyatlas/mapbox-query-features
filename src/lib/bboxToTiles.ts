import { pointToTile } from '@mapbox/tilebelt'
import { IBbox, ITiles } from "../types"

/**
 * Сonvert bbox to list of tiles
 * @param bbox bbox
 * @param zoom Specifies the tile's zoom level, as described in the {@link https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames Slippy Map Tilenames specification}. 
 * @returns list of tiles that are inside bbox
 */
export function bboxToTiles(bbox: IBbox, zoom: number): ITiles[] {
    const leftBottom = pointToTile(bbox[0], bbox[1], zoom)
    const rightBottom = pointToTile(bbox[2], bbox[3], zoom)
    const tiles: ITiles[] = []
    for (let x = leftBottom[0]; x <= rightBottom[0]; x++) {
        for (let y = leftBottom[1]; y >= rightBottom[1]; y--) {
            tiles.push([x, y, zoom])
        }
    }
    return tiles
}