import { Polygon } from "@turf/helpers";
import union from "@turf/union";
import { Feature, Geometry, MultiPolygon, Properties } from "../types";

export function unionPolygon(feature1: Feature<Polygon | MultiPolygon>, feature2: Feature<Polygon | MultiPolygon>): Feature<Geometry, Properties> {

    const feature = union(feature1, feature2)

    if (!feature) throw new Error('feature cannot be merged')

    if (!feature.properties)
        feature.properties = {}

    feature.id = feature1.id
    feature.properties = Object.assign(feature1.properties || {}, feature2.properties || {})


    return feature
}