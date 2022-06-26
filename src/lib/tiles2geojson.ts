import * as request from 'request'
import { format } from 'util'
import { FeatureCollection, Geometry } from '../types'
import { readTiles } from './readTiles'

/**
 * Get geojson from vector tiles
 * @param tiles tiles (area) from which we take geojson
 * @param layers layer(s) on tile from which we take geojson
 * @param token mapbox token
 * @param tilesetId mapbox tileset id
 * @returns geojson feature collection
 * @description read more about api here {@link https://docs.mapbox.com/api/maps/vector-tiles/}
 */
export async function tiles2geojson(
    tiles: Array<[number, number, number]>,
    layers: string[],
    token: string,
    tilesetId: string
): Promise<FeatureCollection<Geometry>> {

    const tilesData = await Promise.all(
        tiles.map(tile => tile2data(tile, token, tilesetId))
    )

    return readTiles(tilesData, layers)
}

async function tile2data(tile: [number, number, number], token: string, tilesetId: string): Promise<{ tile: [number, number, number], data: ArrayBuffer }> {
    return new Promise((res, rej) => {
        const url = `https://api.mapbox.com/v4/${tilesetId}/${tile[2]}/${tile[0]}/${tile[1]}.vector.pbf?access_token=${token}`
        request.get({
            url,
            gzip: true,
            encoding: null
        }, function (err, response, data: ArrayBuffer) {
            if (err)
                return rej(err)
            if (response.statusCode === 401)
                return rej(new Error('Invalid Token'))
            if (response.statusCode !== 200)
                return rej(new Error(format('Error retrieving data from %s. Server responded with code: %s', JSON.stringify(url), response.statusCode)));

            res({ tile, data })
        });
    })
}