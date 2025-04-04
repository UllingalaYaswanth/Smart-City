// src/App.jsx
import React, { useState } from 'react';
import { Map } from 'react-map-gl/maplibre';
import DeckGL from '@deck.gl/react';
import { Tile3DLayer } from '@deck.gl/geo-layers';
import { CesiumIonLoader } from '@loaders.gl/3d-tiles';

// Configuration constants
const ION_ASSET_ID = 43978;
const ION_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3NjEwMjA4Ni00YmVkLTQyMjgtYjRmZS1lY2M3ZWFiMmFmNTYiLCJpZCI6MjYxMzMsImlhdCI6MTY3NTM2ODY4NX0.chGkGL6DkDNv5wYJQDMzWIvi9iDoVa27dgng_5ARDmo';
const TILESET_URL = `https://assets.ion.cesium.com/${ION_ASSET_ID}/tileset.json`;

const INITIAL_VIEW_STATE = {
  latitude: 40,
  longitude: -75,
  pitch: 45,
  maxPitch: 60,
  bearing: 0,
  minZoom: 2,
  maxZoom: 30,
  zoom: 17
};

export default function App({
  mapStyle = 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json',
  updateAttributions
}) {
  const [initialViewState, setInitialViewState] = useState(INITIAL_VIEW_STATE);

  const onTilesetLoad = (tileset) => {
    // Recenter view to cover the new tileset
    const { cartographicCenter, zoom } = tileset;
    setInitialViewState({
      ...INITIAL_VIEW_STATE,
      longitude: cartographicCenter[0],
      latitude: cartographicCenter[1],
      zoom
    });

    if (updateAttributions) {
      updateAttributions(tileset.credits && tileset.credits.attributions);
    }
  };

  const tile3DLayer = new Tile3DLayer({
    id: 'tile-3d-layer',
    pointSize: 2,
    data: TILESET_URL,
    loader: CesiumIonLoader,
    loadOptions: { 'cesium-ion': { accessToken: ION_TOKEN } },
    onTilesetLoad
  });

  return (
    <div className="relative w-full h-full">
      <DeckGL
        layers={[tile3DLayer]}
        initialViewState={initialViewState}
        controller={true}
        className="w-full h-full"
      >
        <Map 
          reuseMaps 
          mapStyle={mapStyle} 
          className="w-full h-full"
        />
      </DeckGL>
    </div>
  );
}

export function renderToDOM(container) {
  const root = createRoot(container);
  root.render(<App />);
}


// import React, { useState } from 'react';
// import { Map } from 'react-map-gl/maplibre';
// import DeckGL from '@deck.gl/react';
// import { Tile3DLayer } from '@deck.gl/geo-layers';
// import { CesiumIonLoader } from '@loaders.gl/3d-tiles';

// // Updated configuration constants
// const ION_ASSET_ID = 3048665;
// const ION_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YjhlMmVkNC1hYWVjLTQxYWEtOGZhYS1iOGQyNDUxY2ZlMTUiLCJpZCI6MjY0Nzg3LCJpYXQiOjE3MzUxMTAzMzV9.tdJk1ppDaw9AEy9bFB6RBU9T3H0-xOlIqVlrjDBJGQo';
// const TILESET_URL = `https://assets.ion.cesium.com/${ION_ASSET_ID}/tileset.json`;

// const INITIAL_VIEW_STATE = {
//   latitude: 40,
//   longitude: -75,
//   pitch: 45,
//   maxPitch: 60,
//   bearing: 0,
//   minZoom: 2,
//   maxZoom: 30,
//   zoom: 17
// };

// export default function App({
//   mapStyle = 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json',
//   updateAttributions
// }) {
//   const [initialViewState, setInitialViewState] = useState(INITIAL_VIEW_STATE);

//   const onTilesetLoad = (tileset) => {
//     // Recenter view to cover the new tileset
//     const { cartographicCenter, zoom } = tileset;
//     setInitialViewState({
//       ...INITIAL_VIEW_STATE,
//       longitude: cartographicCenter[0],
//       latitude: cartographicCenter[1],
//       zoom
//     });

//     // Apply default style if available
//     const extras = tileset.asset?.extras;
//     if (extras?.ion?.defaultStyle) {
//       tileset.style = extras.ion.defaultStyle;
//     }

//     if (updateAttributions) {
//       updateAttributions(tileset.credits && tileset.credits.attributions);
//     }
//   };

//   const tile3DLayer = new Tile3DLayer({
//     id: 'tile-3d-layer',
//     pointSize: 2,
//     data: TILESET_URL,
//     loader: CesiumIonLoader,
//     loadOptions: { 
//       'cesium-ion': { 
//         accessToken: ION_TOKEN 
//       } 
//     },
//     onTilesetLoad
//   });

//   return (
//     <div className="relative w-full h-full">
//       <DeckGL
//         layers={[tile3DLayer]}
//         initialViewState={initialViewState}
//         controller={true}
//         className="w-full h-full"
//       >
//         <Map 
//           reuseMaps 
//           mapStyle={mapStyle} 
//           className="w-full h-full"
//         />
//       </DeckGL>
//     </div>
//   );
// }

// export function renderToDOM(container) {
//   const root = createRoot(container);
//   root.render(<App />);
// }

// import React, { useState, useEffect, useMemo } from 'react';
// import { Map } from 'react-map-gl/maplibre';
// import DeckGL from '@deck.gl/react';
// import { Tile3DLayer } from '@deck.gl/geo-layers';
// import { CesiumIonLoader } from '@loaders.gl/3d-tiles';
// import { createRoot } from 'react-dom/client';

// // Configuration constants
// const ION_ASSET_ID = 3048665;
// const ION_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YjhlMmVkNC1hYWVjLTQxYWEtOGZhYS1iOGQyNDUxY2ZlMTUiLCJpZCI6MjY0Nzg3LCJpYXQiOjE3MzUxMTAzMzV9.tdJk1ppDaw9AEy9bFB6RBU9T3H0-xOlIqVlrjDBJGQo';
// const TILESET_URL = `https://assets.ion.cesium.com/${ION_ASSET_ID}/tileset.json`;

// const INITIAL_VIEW_STATE = {
//   latitude: 40,
//   longitude: -75,
//   pitch: 45,
//   maxPitch: 60,
//   bearing: 0,
//   minZoom: 2,
//   maxZoom: 30,
//   zoom: 17
// };

// export default function App() {
//   const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
//   const [tilesetLoaded, setTilesetLoaded] = useState(false);


//   const tile3DLayer = useMemo(() => new Tile3DLayer({
//     id: 'tile-3d-layer',
//     pointSize: 2,
//     data: TILESET_URL,
//     loader: CesiumIonLoader,
//     loadOptions: { 
//       'cesium-ion': { 
//         accessToken: ION_TOKEN 
//       } 
//     },
//     onTilesetLoad: (tileset) => {
//       const { cartographicCenter, zoom } = tileset;
//       setViewState({
//         ...INITIAL_VIEW_STATE,
//         longitude: cartographicCenter[0],
//         latitude: cartographicCenter[1],
//         zoom
//       });

//       // Apply default style if available
//       if (tileset.asset?.extras?.ion?.defaultStyle) {
//         tileset.style = tileset.asset.extras.ion.defaultStyle;
//       }
      
//       setTilesetLoaded(true);
//     },
//     onError: (error) => {
//       console.error('Error loading 3D tiles:', error);
//     }
//   }), []);

//   return (
//     <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
//       <DeckGL
//         layers={[tile3DLayer]}
//         initialViewState={viewState}
//         viewState={viewState}
//         controller={true}
//         onViewStateChange={({ viewState }) => setViewState(viewState)}
//       >
//         <Map 
//           reuseMaps 
//           mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json" 
//         />
//       </DeckGL>
//       {!tilesetLoaded && (
//         <div style={{
//           position: 'absolute',
//           top: 10,
//           left: 10,
//           padding: 10,
//           background: 'white',
//           zIndex: 100
//         }}>
//           Loading 3D tileset...
//         </div>
//       )}
//     </div>
//   );
// }

// export function renderToDOM(container) {
//   const root = createRoot(container || document.getElementById('root'));
//   root.render(
//     <React.StrictMode>
//       <App />
//     </React.StrictMode>
//   );
// }