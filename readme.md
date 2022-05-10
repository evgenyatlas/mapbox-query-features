# mapbox-query-features

[mapbox queryRenderedFeatures](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#queryrenderedfeatures) alternative for server use (node.js)

## Example

```ts
import { queryFeatures } from 'mapbox-query-features'

const result: FeatureCollection = await queryFeatures(
    //bounding box from which we take the features 
    [30.255939960479733, 60.01106495448562, 30.272912979125973, 60.02215300039876],
    {
      zoom: 14,
      layers: ['building'],
      mapboxToken: "TOKEN"
    }
  )
/*
{
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', geometry: [Object], properties: [Object] },
    ... more
   ]
}
*/
result

```
## Installation

```sh
npm i --save mapbox-query-features
```