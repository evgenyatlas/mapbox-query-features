import * as request from 'request'
import { format } from 'util'
import { readTile } from './readTile'

/**
 * Get geojson from vector tile
 * @param tile tile (area) from which we take geojson
 * @param layers layer(s) on tile from which we take geojson
 * @param token mapbox token
 * @param tilesetId mapbox tileset id
 * @returns geojson feature collection
 * @description read more about api here {@link https://docs.mapbox.com/api/maps/vector-tiles/}
 */
export async function tile2geojson(
    tile: [number, number, number],
    layers: string[],
    token: string,
    tilesetId: string
): Promise<GeoJSON.FeatureCollection> {
    return new Promise((res, rej) => {
        const url = `https://api.mapbox.com/v4/${tilesetId}/${tile[2]}/${tile[0]}/${tile[1]}.vector.pbf?access_token=${token}`
        request.get({
            url,
            gzip: true,
            encoding: null
        }, function (err, response, body: ArrayBuffer) {
            if (err)
                return rej(err)
            if (response.statusCode === 401)
                return rej(new Error('Invalid Token'))
            if (response.statusCode !== 200)
                return rej(new Error(format('Error retrieving data from %s. Server responded with code: %s', JSON.stringify(url), response.statusCode)));

            res(readTile(tile, body, layers))
        });
    })
}