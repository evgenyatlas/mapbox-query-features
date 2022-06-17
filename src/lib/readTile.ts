//@ts-ignore
import * as Protobuf from 'pbf';
import { VectorTile } from '@mapbox/vector-tile'
import * as zlib from 'zlib';
import { FeatureCollection, Geometries, Geometry, Feature, Properties } from '../types';

export function readTile([x, y, z]: [number, number, number], data: ArrayBuffer, layers: Array<string>) {

    if (data[0] === 0x78 && data[1] === 0x9C) {
        data = zlib.inflateSync(data)
    } else if (data[0] === 0x1F && data[1] === 0x8B) {
        data = zlib.gunzipSync(data)
    }

    const tile = new VectorTile(new Protobuf(data))

    const features: FeatureCollection<Geometry> = { type: 'FeatureCollection', features: [] }

    layers.forEach(function (layerID) {
        var layer = tile.layers[layerID];
        if (layer) {
            for (var i = 0; i < layer.length; i++) {
                const feature = layer.feature(i).toGeoJSON(x, y, z) as Feature<Geometry, Properties>
                if (!feature.properties) feature.properties = {}
                feature.properties.layer = layerID;
                features.features.push(feature);
            }
        }
    });

    return features;
}