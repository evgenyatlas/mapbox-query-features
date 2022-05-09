import vt2geojson from '@mapbox/vt2geojson';

export async function tile2geojson(
    tile: [number, number, number],
    layers: string[],
    token: string,
    tilesetId: string
): Promise<GeoJSON.FeatureCollection> {
    return new Promise((res, rej) =>
        vt2geojson({
            uri: `https://api.mapbox.com/v4/${tilesetId}/${tile[2]}/${tile[0]}/${tile[1]}.vector.pbf?access_token=${token}`,
            layer: layers,
        },
            function (err, result) {
                if (err) return rej(err)
                res(result)
            }
        )
    )
}