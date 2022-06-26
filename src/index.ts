import { bboxToTiles } from './lib/bboxToTiles';
import { tiles2geojson } from './lib/tiles2geojson';
import { tilesToBBox } from './lib/tilesToBBox';
import { FeatureCollection, IBbox, Geometry } from './types';

interface IOptions {
    zoom?: number
    mapboxToken: string
    layers: string[]
    tilesetId?: string
}

/**
 * @description Alternative to {@link https://docs.mapbox.com/mapbox-gl-js/api/map/#map#queryrenderedfeatures queryRenderedFeatures}  for the server
 * @param bbox bounding box from which we take the features
 * @param {IOptions} options.zoom zoom 
 * @param {IOptions} options.mapboxToken mapbox token
 * @param {IOptions} options.layers layers
 * @param {IOptions} options.tilesetId mapbox tileset id
 * @returns 
 */
export async function queryFeatures(
    bbox: IBbox,
    {
        zoom = 14,
        mapboxToken,
        layers,
        tilesetId = "mapbox.mapbox-streets-v8",
    }: IOptions
): Promise<FeatureCollection<Geometry> & { bbox: IBbox }> {

    //Get the list of tiles that are inside bbox
    const tiles = bboxToTiles(bbox, zoom)
    //Make a feature request for each tile
    // const featureRequests: Array<Promise<FeatureCollection<Geometry>>> = tiles.map(tile => );
    // const features = (await Promise.all(featureRequests)).flatMap(({ features }) => features)

    return {
        type: 'FeatureCollection',
        //waiting for all requests
        //flatten the array of feature collections
        //to get all features in one featurecollection
        features: (await tiles2geojson(tiles, layers, mapboxToken, tilesetId)).features,
        bbox: tilesToBBox(tiles)
    }
}
export { bboxToTiles } from './lib/bboxToTiles';
export * from './types'