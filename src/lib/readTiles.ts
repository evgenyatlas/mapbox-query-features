//@ts-ignore
import * as Protobuf from 'pbf';
import { VectorTile } from '@mapbox/vector-tile'
import * as zlib from 'zlib';
import union from '@turf/union'
import { FeatureCollection, Geometries, Geometry, Feature, Properties, Polygon } from '../types';
import { unionPolygon } from './unionPolygon';

export function readTiles(tilesData: Array<{ tile: [number, number, number], data: ArrayBuffer }>, layers: Array<string>): FeatureCollection<Geometry> {

    const featuresMap: Record<number, Feature<Geometry, Properties>> = {}

    tilesData.forEach(({ data, tile: [x, y, z] }) => {

        if (data[0] === 0x78 && data[1] === 0x9C) {
            data = zlib.inflateSync(data)
        } else if (data[0] === 0x1F && data[1] === 0x8B) {
            data = zlib.gunzipSync(data)
        }

        const tile = new VectorTile(new Protobuf(data))

        layers.forEach(function (layerID) {
            const layer = tile.layers[layerID]
            if (layer) {
                for (var i = 0; i < layer.length; i++) {
                    let feature = layer.feature(i).toGeoJSON(x, y, z) as Feature<Geometry, Properties>

                    if (!feature.properties) feature.properties = {}
                    feature.properties.layer = layerID

                    const featureId = feature.id || Math.random()

                    //if the feature already exist, then merge them (only for polygon)
                    if (
                        featuresMap[featureId]
                        &&
                        featuresMap[featureId].geometry
                        &&
                        (
                            featuresMap[featureId].geometry.type === 'Polygon'
                            ||
                            featuresMap[featureId].geometry.type === 'MultiPolygon'
                        )
                    )
                        feature = unionPolygon(feature as Feature<Polygon>, featuresMap[featureId])

                    featuresMap[featureId] = feature
                }
            }
        })
    })

    return {
        type: 'FeatureCollection',
        features: Object.values(featuresMap)
    }
}