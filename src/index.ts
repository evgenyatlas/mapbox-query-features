import { pointToTile } from '@mapbox/tilebelt'
import { FeatureCollection } from 'geojson';
import { tile2geojson } from './lib/tile2geojson';

interface IOptions {
    zoom?: number
    mapboxToken: string
    layers: string[]
    tilesetId: string
}

export async function queryfeatures(
    bbox: [number, number, number, number],
    {
        zoom = 14,
        mapboxToken,
        layers,
        tilesetId = "mapbox.mapbox-streets-v8"
    }: IOptions
): Promise<GeoJSON.FeatureCollection> {

    const leftBottom = pointToTile(bbox[0], bbox[1], zoom)
    const rightBottom = pointToTile(bbox[2], bbox[3], zoom)

    const featureRequests: Array<Promise<FeatureCollection>> = []
    for (let x = leftBottom[0]; x <= rightBottom[0]; x++) {
        for (let y = leftBottom[1]; y >= rightBottom[1]; y--) {
            featureRequests.push(
                tile2geojson(
                    [x, y, zoom],
                    layers,
                    mapboxToken,
                    tilesetId
                )
            )
        }
    }

    const features = (await Promise.all(featureRequests)).flatMap(({ features }) => features)

    return {
        type: 'FeatureCollection',
        features
    }
}