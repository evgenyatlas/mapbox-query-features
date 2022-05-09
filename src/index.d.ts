declare module '@mapbox/tilebelt' {
    export function pointToTile(lon: number, lat: number, zoom: number): [number, number, number];
}
