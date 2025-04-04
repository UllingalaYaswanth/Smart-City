// // src/App.jsx
// import React, { useState } from 'react';
// import { Map } from 'react-map-gl/maplibre';
// import DeckGL from '@deck.gl/react';
// import { Tile3DLayer } from '@deck.gl/geo-layers';
// import { CesiumIonLoader } from '@loaders.gl/3d-tiles';

// // Configuration constants
// const ION_ASSET_ID = 43978;
// const ION_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3NjEwMjA4Ni00YmVkLTQyMjgtYjRmZS1lY2M3ZWFiMmFmNTYiLCJpZCI6MjYxMzMsImlhdCI6MTY3NTM2ODY4NX0.chGkGL6DkDNv5wYJQDMzWIvi9iDoVa27dgng_5ARDmo';
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

//     if (updateAttributions) {
//       updateAttributions(tileset.credits && tileset.credits.attributions);
//     }
//   };

//   const tile3DLayer = new Tile3DLayer({
//     id: 'tile-3d-layer',
//     pointSize: 2,
//     data: TILESET_URL,
//     loader: CesiumIonLoader,
//     loadOptions: { 'cesium-ion': { accessToken: ION_TOKEN } },
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


// src/App.jsx
// import React, { useEffect, useRef, useState } from 'react';
// import * as Cesium from 'cesium';
// import 'cesium/Build/Cesium/Widgets/widgets.css';

// const CesiumViewer = () => {
//   const cesiumContainer = useRef(null);
//   const viewerRef = useRef(null);
//   const [status, setStatus] = useState('Click on the map to add an anchor point.');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [videoData, setVideoData] = useState({ url: '', title: '' });
//   const zoomThreshold = 500;
//   const tilesetRef = useRef(null);
//   const geoJsonDataSourceRef = useRef(null);

//   // Cesium Ion Token
//   Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YjhlMmVkNC1hYWVjLTQxYWEtOGZhYS1iOGQyNDUxY2ZlMTUiLCJpZCI6MjY0Nzg3LCJpYXQiOjE3MzUxMTAzMzV9.tdJk1ppDaw9AEy9bFB6RBU9T3H0-xOlIqVlrjDBJGQo";

//   // Initialize Cesium Viewer
//   useEffect(() => {
//     if (!cesiumContainer.current) return;

//     Cesium.createWorldTerrainAsync().then(terrainProvider => {
//       const viewer = new Cesium.Viewer(cesiumContainer.current, {
//         terrainProvider: terrainProvider,
//         sceneMode: Cesium.SceneMode.SCENE3D,
//       });
//       viewerRef.current = viewer;

//       load3DTileset(viewer);
//       loadGeoJsonData(viewer);

//       return () => {
//         if (viewer && !viewer.isDestroyed()) {
//           viewer.destroy();
//         }
//       };
//     });

//     return () => {
//       if (viewerRef.current && !viewerRef.current.isDestroyed()) {
//         viewerRef.current.destroy();
//       }
//     };
//   }, []);

//   // Load 3D Tileset
//   const load3DTileset = async (viewer) => {
//     try {
//       const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(3048665);
//       viewer.scene.primitives.add(tileset);
//       tilesetRef.current = tileset;
//       await viewer.zoomTo(tileset);

//       // Apply default style if exists
//       const extras = tileset.asset.extras;
//       if (extras && extras.ion && extras.ion.defaultStyle) {
//         tileset.style = new Cesium.Cesium3DTileStyle(extras.ion.defaultStyle);
//       }
//     } catch (error) {
//       console.error("Error loading 3D Tileset:", error);
//     }
//   };

//   // Load GeoJSON Data
//   const loadGeoJsonData = (viewer) => {
//     const geoJsonUrl = 'http://192.168.6.225:8082/data-test.geojson';
//     const buildingLabels = [];

//     fetch(geoJsonUrl)
//       .then(response => response.json())
//       .then(geojsonData => {
//         Cesium.GeoJsonDataSource.load(geojsonData, {
//           clampToGround: false
//         }).then(dataSource => {
//           geoJsonDataSourceRef.current = dataSource;
//           viewer.dataSources.add(dataSource);
//           const entities = dataSource.entities.values;

//           entities.forEach(entity => {
//             if (entity.polygon) {
//               const buildingName = entity.properties['@id'] || 'Unknown Building';
//               const positions = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;
//               const center = Cesium.Cartesian3.fromDegrees(
//                 Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(positions[0]).longitude),
//                 Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(positions[0]).latitude),
//                 0
//               );

//               const labelEntity = viewer.entities.add({
//                 position: center,
//                 label: {
//                   text: buildingName,
//                   font: '14px sans-serif',
//                   fillColor: Cesium.Color.WHITE,
//                   scale: 1.5,
//                   pixelOffset: new Cesium.Cartesian2(0, -30),
//                   show: false
//                 }
//               });

//               buildingLabels.push(labelEntity);
//               const height = entity.properties.height ? entity.properties.height.getValue() : 10;
//               entity.polygon.extrudedHeight = height;
//               entity.polygon.material = Cesium.Color.BLUE.withAlpha(0.6);
//               entity.polygon.outline = true;
//               entity.polygon.outlineColor = Cesium.Color.BLUE;
//             }

//             if (entity.position && entity.properties.video) {
//               const videoUrl = entity.properties.video;
//               entity.description = ` 
//                 <h3>${entity.properties['@id']}</h3>
//                 <video width="320" height="240" controls>
//                   <source src="${videoUrl}" type="video/mp4">
//                   Your browser does not support the video tag.
//                 </video>
//               `;
//             }
//           });

//           const checkZoomLevel = () => {
//             const cameraHeight = viewer.camera.positionCartographic.height;
//             buildingLabels.forEach(labelEntity => {
//               labelEntity.label.show = cameraHeight < zoomThreshold;
//             });
//           };

//           viewer.camera.changed.addEventListener(checkZoomLevel);
//           checkZoomLevel();
//           viewer.zoomTo(dataSource);
//         });
//       })
//       .catch(error => {
//         console.log(`Error loading GeoJSON file: ${error}`);
//       });
//   };

//   // Add Anchor Point
//   const addAnchorPoint = (position) => {
//     const viewer = viewerRef.current;
//     const cartographic = Cesium.Cartographic.fromCartesian(position);

//     Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, [cartographic])
//       .then(updatedPositions => {
//         const updatedCartographic = updatedPositions[0];
//         const longitude = Cesium.Math.toDegrees(updatedCartographic.longitude);
//         const latitude = Cesium.Math.toDegrees(updatedCartographic.latitude);

//         const anchorName = prompt("Enter a name for the anchor point:");
//         const videoUrl = prompt("Enter a video URL (optional):");

//         const newFeature = {
//           type: "Feature",
//           properties: {
//             "@id": anchorName || "Unnamed Anchor",
//             video: videoUrl || null
//           },
//           geometry: {
//             type: "Point",
//             coordinates: [longitude, latitude]
//           }
//         };

//         Cesium.GeoJsonDataSource.load(newFeature, {
//           clampToGround: true
//         }).then(dataSource => {
//           viewer.dataSources.add(dataSource);
//           viewer.zoomTo(dataSource);
//         });

//         updateGeoJsonOnServer(newFeature);
//       })
//       .catch(error => {
//         console.error("Error sampling terrain:", error);
//       });
//   };

//   // Update GeoJSON on Server
//   const updateGeoJsonOnServer = (updatedGeoJson) => {
//     fetch('http://localhost:8081/update-geojson', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(updatedGeoJson)
//     })
//     .then(response => response.text())
//     .then(message => {
//       console.log(message);
//     })
//     .catch(error => {
//       console.error('Error updating GeoJSON on server:', error);
//     });
//   };

//   // Toggle 3D Tileset
//   const toggleTileset = () => {
//     if (tilesetRef.current) {
//       tilesetRef.current.show = !tilesetRef.current.show;
//       setStatus(`3D Tileset is now ${tilesetRef.current.show ? 'shown' : 'hidden'}`);
//     }
//   };

//   // Toggle GeoJSON
//   const toggleGeoJson = () => {
//     if (geoJsonDataSourceRef.current) {
//       geoJsonDataSourceRef.current.show = !geoJsonDataSourceRef.current.show;
//       setStatus(`GeoJSON data is now ${geoJsonDataSourceRef.current.show ? 'shown' : 'hidden'}`);
//     }
//   };

//   // Handle Map Click
//   useEffect(() => {
//     const viewer = viewerRef.current;
//     if (!viewer) return;

//     const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
//     handler.setInputAction(event => {
//       const ray = viewer.camera.getPickRay(event.position);
//       const position = viewer.scene.globe.pick(ray, viewer.scene);

//       if (position) {
//         const pickedObject = viewer.scene.pick(event.position);
//         if (pickedObject?.id?.properties?.video) {
//           const videoUrl = pickedObject.id.properties.video.getValue();
//           const videoTitle = pickedObject.id.properties['@id'].getValue();
//           setVideoData({ url: videoUrl, title: videoTitle });
//           setModalVisible(true);
//         } else {
//           addAnchorPoint(position);
//         }
//       }
//     }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

//     return () => {
//       handler.destroy();
//     };
//   }, []);

//   return (
//     <div className="relative w-full h-full">
//       {/* Cesium Container */}
//       <div ref={cesiumContainer} className="w-full h-full" />
      
//       {/* Controls */}
//       <div className="absolute top-2 left-2 z-10 bg-white bg-opacity-80 p-2 rounded">
//         <button 
//           onClick={() => setStatus('Click on the map to add an anchor point.')}
//           className="bg-black bg-opacity-70 text-white px-3 py-1 rounded"
//         >
//           Add Anchor
//         </button>
//         <p className="mt-1 text-sm">{status}</p>
//       </div>

//       {/* Toggle Buttons */}
//       <div className="absolute top-2 right-2 z-10 flex gap-2">
//         <button 
//           onClick={toggleTileset}
//           className="bg-black bg-opacity-70 text-white px-3 py-1 rounded"
//         >
//           Toggle 3D Tileset
//         </button>
//         <button 
//           onClick={toggleGeoJson}
//           className="bg-black bg-opacity-70 text-white px-3 py-1 rounded"
//         >
//           Toggle GeoJSON
//         </button>
//       </div>

//       {/* Video Modal */}
//       {modalVisible && (
//         <div className="fixed z-50 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow-lg">
//           <span 
//             className="float-right text-xl cursor-pointer"
//             onClick={() => setModalVisible(false)}
//           >
//             &times;
//           </span>
//           <h3 className="text-lg font-bold mb-2">{videoData.title}</h3>
//           <video 
//             src={videoData.url} 
//             width="400" 
//             controls
//             className="max-w-full h-auto"
//           >
//             Your browser does not support the video tag.
//           </video>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CesiumViewer;



// src/App.jsx
// src/App.jsx
// src/App.jsx
// import React, { useEffect, useRef } from 'react';
// import * as Cesium from 'cesium';
// import 'cesium/Build/Cesium/Widgets/widgets.css';

// // Configuration constants
// const ION_ASSET_ID = 3048665;
// const ION_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YjhlMmVkNC1hYWVjLTQxYWEtOGZhYS1iOGQyNDUxY2ZlMTUiLCJpZCI6MjY0Nzg3LCJpYXQiOjE3MzUxMTAzMzV9.tdJk1ppDaw9AEy9bFB6RBU9T3H0-xOlIqVlrjDBJGQo";

// export default function App() {
//   const cesiumContainer = useRef(null);

//   useEffect(() => {
//     if (!cesiumContainer.current) return;

//     Cesium.Ion.defaultAccessToken = ION_TOKEN;
    
//     const viewer = new Cesium.Viewer(cesiumContainer.current, {
//       terrain: Cesium.Terrain.fromWorldTerrain(),
//       baseLayerPicker: false,
//       // ... other viewer options
//     });

//     // Load tileset
//     const loadTileset = async () => {
//       try {
//         const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(ION_ASSET_ID);
//         viewer.scene.primitives.add(tileset);
//         viewer.zoomTo(tileset);
//       } catch (error) {
//         console.error('Error loading tileset:', error);
//       }
//     };

//     loadTileset();

//     return () => {
//       if (!viewer.isDestroyed) {
//         viewer.destroy();
//       }
//     };
//   }, []);

//   return (
//     <div className="relative w-full h-full">
//       <div ref={cesiumContainer} className="w-full h-full" />
//     </div>
//   );
// }

// import React, { useEffect, useRef } from 'react';
// import * as Cesium from 'cesium';
// import 'cesium/Build/Cesium/Widgets/widgets.css';

// const ION_ASSET_ID = 3048665;
// const ION_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YjhlMmVkNC1hYWVjLTQxYWEtOGZhYS1iOGQyNDUxY2ZlMTUiLCJpZCI6MjY0Nzg3LCJpYXQiOjE3MzUxMTAzMzV9.tdJk1ppDaw9AEy9bFB6RBU9T3H0-xOlIqVlrjDBJGQo";

// export default function App() {
//   const cesiumContainer = useRef(null);

//   useEffect(() => {
//     if (!cesiumContainer.current) return;

//     // Set Cesium ion token
//     Cesium.Ion.defaultAccessToken = ION_TOKEN;

//     // Initialize viewer with proper terrain
//     const viewer = new Cesium.Viewer(cesiumContainer.current, {
//       terrain: Cesium.Terrain.fromWorldTerrain(),
//       baseLayerPicker: false,
//       sceneModePicker: false,
//       navigationHelpButton: false,
//       animation: false,
//       timeline: false,
//       fullscreenButton: false,
//       skyBox: false,
//       shouldAnimate: true,
//     });

//     // Remove default base layer if needed
//     viewer.imageryLayers.remove(viewer.imageryLayers.get(0));

//     // Load tileset
//     const loadTileset = async () => {
//       try {
//         const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(ION_ASSET_ID);
//         viewer.scene.primitives.add(tileset);
//         await viewer.zoomTo(tileset);
        
//         // Apply default style if available
//         if (tileset.asset?.extras?.ion?.defaultStyle) {
//           tileset.style = new Cesium.Cesium3DTileStyle(tileset.asset.extras.ion.defaultStyle);
//         }
//       } catch (error) {
//         console.error('Error loading tileset:', error);
//       }
//     };

//     loadTileset();

//     return () => {
//       if (!viewer.isDestroyed) {
//         viewer.destroy();
//       }
//     };
//   }, []);

//   return (
//     <div style={{ width: '100%', height: '100vh' }}>
//       <div ref={cesiumContainer} style={{ width: '100%', height: '100%' }} />
//     </div>
//   );
// }


// import { useEffect, useRef, useState } from 'react';
// import * as Cesium from 'cesium';
// import 'cesium/Build/Cesium/Widgets/widgets.css';

// function App() {
//   const cesiumContainerRef = useRef(null);
//   const viewerRef = useRef(null);
//   const tilesetRef = useRef(null);
//   const geoJsonDataSourceRef = useRef(null);
//   const [status, setStatus] = useState('Click on the map to add an anchor point.');
  
//   // Initialize Cesium viewer and load data
//   useEffect(() => {
//     if (!cesiumContainerRef.current) return;

//     // Grant CesiumJS access to your ion assets
//     Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YjhlMmVkNC1hYWVjLTQxYWEtOGZhYS1iOGQyNDUxY2ZlMTUiLCJpZCI6MjY0Nzg3LCJpYXQiOjE3MzUxMTAzMzV9.tdJk1ppDaw9AEy9bFB6RBU9T3H0-xOlIqVlrjDBJGQo";
    
//     // Initialize the Cesium Viewer with terrain
//     const initViewer = async () => {
//       try {
//         const terrainProvider = await Cesium.createWorldTerrainAsync();
//         const viewer = new Cesium.Viewer(cesiumContainerRef.current, {
//           terrainProvider: terrainProvider,
//           sceneMode: Cesium.SceneMode.SCENE3D,
//         });
//         viewerRef.current = viewer;
        
//         // Load 3D Tileset
//         await load3DTileset(viewer);
        
//         // Add 3D Model
//         add3DModel(viewer);
        
//         // Load GeoJSON data
//         await loadGeoJson(viewer);
        
//         // Set up click handler
//         setupClickHandler(viewer);
//       } catch (error) {
//         console.error("Error initializing Cesium:", error);
//       }
//     };
    
//     initViewer();
    
//     // Cleanup function
//     return () => {
//       if (viewerRef.current) {
//         viewerRef.current.destroy();
//       }
//     };
//   }, []);
  
//   // Load 3D Tileset from Ion Asset ID
//   const load3DTileset = async (viewer) => {
//     try {
//       const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(3048665);
//       viewer.scene.primitives.add(tileset);
//       await viewer.zoomTo(tileset);
      
//       // Apply the default style if it exists
//       const extras = tileset.asset.extras;
//       if (
//         Cesium.defined(extras) &&
//         Cesium.defined(extras.ion) &&
//         Cesium.defined(extras.ion.defaultStyle)
//       ) {
//         tileset.style = new Cesium.Cesium3DTileStyle(extras.ion.defaultStyle);
//       }
      
//       tilesetRef.current = tileset;
//     } catch (error) {
//       console.error("Error loading 3D Tileset:", error);
//     }
//   };
  
//   // Add a 3D Model to the Map
//   const add3DModel = (viewer) => {
//     const modelLongitude = -75.59777; // Example longitude
//     const modelLatitude = 40.03883;   // Example latitude
//     const modelHeight = 0;           // Height above ground
//     const modelUrl = "https://example.com/path/to/model.gltf"; // Replace with your glTF model URL
    
//     const position = Cesium.Cartesian3.fromDegrees(modelLongitude, modelLatitude, modelHeight);
//     viewer.entities.add({
//       position: position,
//       model: {
//         uri: modelUrl,
//         scale: 1.0,
//         minimumPixelSize: 128
//       }
//     });
//     viewer.zoomTo(viewer.entities);
//   };
  
//   // Load GeoJSON data
//   const loadGeoJson = async (viewer) => {
//     const zoomThreshold = 500;
//     const geoJsonUrl = 'http://192.168.6.225:8081/data-test.geojson';
    
//     try {
//       const response = await fetch(geoJsonUrl);
//       const geojsonData = await response.json();
      
//       const dataSource = await Cesium.GeoJsonDataSource.load(geojsonData, {
//         clampToGround: false
//       });
      
//       viewer.dataSources.add(dataSource);
//       geoJsonDataSourceRef.current = dataSource;
      
//       const entities = dataSource.entities.values;
//       const buildingLabels = [];
      
//       entities.forEach(entity => {
//         // For polygon features (buildings)
//         if (entity.polygon) {
//           const buildingName = entity.properties['@id'] || 'Unknown Building';
          
//           // Get the centroid of the polygon to place the label above
//           const positions = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;
//           const center = Cesium.Cartesian3.fromDegrees(
//             Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(positions[0]).longitude),
//             Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(positions[0]).latitude),
//             0
//           );
          
//           // Add the label above the building at the centroid
//           const labelEntity = viewer.entities.add({
//             position: center,
//             label: {
//               text: buildingName,
//               font: '14px sans-serif',
//               fillColor: Cesium.Color.WHITE,
//               scale: 1.5,
//               pixelOffset: new Cesium.Cartesian2(0, -30),
//               show: false
//             }
//           });
          
//           buildingLabels.push(labelEntity);
          
//           // Set height extrusion for the building
//           const height = entity.properties.height ? entity.properties.height.getValue() : 10;
//           entity.polygon.extrudedHeight = height;
//           entity.polygon.material = Cesium.Color.BLUE.withAlpha(0.6);
//           entity.polygon.outline = true;
//           entity.polygon.outlineColor = Cesium.Color.BLUE;
//         }
        
//         // For point features (anchors), add a video popup
//         if (entity.position && entity.properties.video) {
//           const videoUrl = entity.properties.video;
          
//           entity.description = `
//             <h3>${entity.properties['@id']}</h3>
//             <video width="320" height="240" controls>
//               <source src="${videoUrl}" type="video/mp4">
//               Your browser does not support the video tag.
//             </video>
//           `;
//         }
//       });
      
//       // Function to check zoom level and toggle label visibility
//       function checkZoomLevel() {
//         const cameraHeight = viewer.camera.positionCartographic.height;
//         buildingLabels.forEach(labelEntity => {
//           labelEntity.label.show = cameraHeight < zoomThreshold;
//         });
//       }
      
//       // Monitor camera movement
//       viewer.camera.changed.addEventListener(checkZoomLevel);
      
//       // Initial check
//       checkZoomLevel();
      
//       // Zoom to the entire data source
//       viewer.zoomTo(dataSource);
//     } catch (error) {
//       console.error(`Error loading GeoJSON file: ${error}`);
//     }
//   };
  
//   // Setup click handler for adding anchor points
//   const setupClickHandler = (viewer) => {
//     const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    
//     handler.setInputAction(event => {
//       const ray = viewer.camera.getPickRay(event.position);
//       const position = viewer.scene.globe.pick(ray, viewer.scene);
      
//       if (position) {
//         // Check if the click is on an existing anchor point
//         const pickedObject = viewer.scene.pick(event.position);
//         if (pickedObject && pickedObject.id && pickedObject.id.properties && pickedObject.id.properties.video) {
//           // Play video in a modal
//           const videoUrl = pickedObject.id.properties.video.getValue();
//           const videoTitle = pickedObject.id.properties['@id'].getValue();
          
//           setVideoModal({
//             visible: true,
//             title: videoTitle,
//             url: videoUrl
//           });
//         } else {
//           // Add anchor point if not on existing anchor
//           addAnchorPoint(position, viewer);
//         }
//       }
//     }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
//   };
  
//   // Function to add a new anchor point
//   const addAnchorPoint = (position, viewer) => {
//     const cartographic = Cesium.Cartographic.fromCartesian(position);
    
//     // Use sampleTerrainMostDetailed to get the exact terrain height
//     Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, [cartographic])
//       .then(updatedPositions => {
//         const updatedCartographic = updatedPositions[0];
//         const longitude = Cesium.Math.toDegrees(updatedCartographic.longitude);
//         const latitude = Cesium.Math.toDegrees(updatedCartographic.latitude);
        
//         // Confirm with the user before adding an anchor
//         const confirmAdd = confirm("Do you want to add an anchor point here?");
//         if (!confirmAdd) return;
        
//         // Prompt user for additional properties
//         const anchorName = prompt("Enter a name for the anchor point:");
//         const videoUrl = prompt("Enter a video URL (optional):");
        
//         // Create a new feature
//         const newFeature = {
//           type: "Feature",
//           properties: {
//             "@id": anchorName || "Unnamed Anchor",
//             video: videoUrl || null
//           },
//           geometry: {
//             type: "Point",
//             coordinates: [longitude, latitude]
//           }
//         };
        
//         // Add the new feature to the GeoJSON data
//         const dataSource = new Cesium.GeoJsonDataSource();
//         Cesium.GeoJsonDataSource.load(newFeature, {
//           clampToGround: true
//         }).then(dataSource => {
//           viewer.dataSources.add(dataSource);
//           viewer.zoomTo(dataSource);
//         });
        
//         // Send the updated GeoJSON data to the backend
//         updateGeoJsonOnServer(newFeature);
//       })
//       .catch(error => {
//         console.error("Error sampling terrain:", error);
//         setStatus("Error adding anchor point.");
//       });
//   };
  
//   // Function to send updated GeoJSON data to the backend
//   const updateGeoJsonOnServer = (newFeature) => {
//     fetch('http://localhost:8081/update-geojson', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(newFeature)
//     })
//     .then(response => response.text())
//     .then(message => {
//       console.log(message);
//       setStatus("Anchor point added successfully!");
//     })
//     .catch(error => {
//       console.error('Error updating GeoJSON on server:', error);
//       setStatus("Error updating server.");
//     });
//   };
  
//   // State for video modal
//   const [videoModal, setVideoModal] = useState({
//     visible: false,
//     title: '',
//     url: ''
//   });
  
//   // Toggle 3D Tileset visibility
//   const toggleTileset = () => {
//     if (tilesetRef.current) {
//       tilesetRef.current.show = !tilesetRef.current.show;
//       const status = tilesetRef.current.show ? 'shown' : 'hidden';
//       alert(`3D Tileset is now ${status}`);
//     }
//   };
  
//   // Toggle GeoJSON visibility
//   const toggleGeoJson = () => {
//     if (geoJsonDataSourceRef.current) {
//       geoJsonDataSourceRef.current.show = !geoJsonDataSourceRef.current.show;
//       const status = geoJsonDataSourceRef.current.show ? 'shown' : 'hidden';
//       alert(`GeoJSON data is now ${status}`);
//     }
//   };
  
//   // Close video modal
//   const closeVideoModal = () => {
//     setVideoModal(prev => ({...prev, visible: false}));
//   };
  
//   return (
//     <div className="relative w-full h-screen">
//       {/* Cesium Container */}
//       <div ref={cesiumContainerRef} className="w-full h-full"></div>
      
//       {/* Controls */}
//       <div className="absolute top-4 left-4 z-10 bg-white/80 p-3 rounded">
//         <button 
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors" 
//           onClick={() => setStatus('Click on the map to add an anchor point.')}
//         >
//           Add Anchor
//         </button>
//         <p className="mt-2 text-sm">{status}</p>
//       </div>
      
//       {/* Button Container */}
//       <div className="absolute top-4 right-4 z-10 flex gap-3">
//         <button 
//           className="bg-black/70 text-white px-4 py-2 rounded hover:bg-black/90 transition-colors"
//           onClick={toggleTileset}
//         >
//           Toggle 3D Tileset
//         </button>
//         <button 
//           className="bg-black/70 text-white px-4 py-2 rounded hover:bg-black/90 transition-colors"
//           onClick={toggleGeoJson}
//         >
//           Toggle GeoJSON
//         </button>
//       </div>
      
//       {/* Video Modal */}
//       {videoModal.visible && (
//         <div className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded shadow-lg border border-gray-300">
//           <span 
//             className="float-right text-xl cursor-pointer"
//             onClick={closeVideoModal}
//           >
//             &times;
//           </span>
//           <h3 className="text-lg font-semibold mb-2">{videoModal.title}</h3>
//           <video width="400" controls>
//             <source src={videoModal.url} type="video/mp4" />
//             Your browser does not support the video tag.
//           </video>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;

// import { useEffect, useRef, useState } from 'react';
// import * as Cesium from 'cesium';
// import "cesium/Build/Cesium/Widgets/widgets.css";

// // Fix missing CSS for InfoBox
// // import "./infobox-description.css";

// function App() {
//   const cesiumContainerRef = useRef(null);
//   const viewerRef = useRef(null);
//   const tilesetRef = useRef(null);
//   const geoJsonDataSourceRef = useRef(null);
//   const [status, setStatus] = useState('Click on the map to add an anchor point.');
//   const [videoModal, setVideoModal] = useState({
//     visible: false,
//     title: '',
//     url: ''
//   });
  
//   // Initialize Cesium viewer and load data
//   useEffect(() => {
//     if (!cesiumContainerRef.current) return;

//     // Grant CesiumJS access to your ion assets
//     Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YjhlMmVkNC1hYWVjLTQxYWEtOGZhYS1iOGQyNDUxY2ZlMTUiLCJpZCI6MjY0Nzg3LCJpYXQiOjE3MzUxMTAzMzV9.tdJk1ppDaw9AEy9bFB6RBU9T3H0-xOlIqVlrjDBJGQo";
    
//     // Initialize the Cesium Viewer with terrain
//     const initViewer = async () => {
//       try {
//         // Configure viewer with more options to prevent errors
//         const viewer = new Cesium.Viewer(cesiumContainerRef.current, {
//           // Using a cached terrain provider to prevent network errors
//           terrainProvider: Cesium.createWorldTerrain({
//             requestVertexNormals: true,
//             requestWaterMask: true
//           }),
//           sceneMode: Cesium.SceneMode.SCENE3D,
//           // Disable some features that might cause errors
//           imageryProvider: false,
//           baseLayerPicker: true,
//           geocoder: false,
//           animation: false,
//           timeline: false,
//           homeButton: false,
//           fullscreenButton: true,
//           infoBox: true,
//           sceneModePicker: false
//         });
        
//         // Add default imagery provider to avoid missing images
//         viewer.imageryLayers.addImageryProvider(
//           new Cesium.IonImageryProvider({ assetId: 3 })
//         );

//         // Handle renderer errors
//         viewer.scene.renderError.addEventListener(function(scene, error) {
//           console.error("Render error:", error);
//           setStatus("Render error: " + error.toString());
//         });
        
//         viewerRef.current = viewer;
        
//         // Load everything in sequence with error handling
//         try {
//           // Load 3D Tileset
//           await load3DTileset(viewer);
//         } catch (error) {
//           console.error("Error loading 3D Tileset:", error);
//           setStatus("Error loading 3D Tileset, continuing with other elements");
//         }
        
//         try {
//           // Add 3D Model
//           add3DModel(viewer);
//         } catch (error) {
//           console.error("Error adding 3D Model:", error);
//           setStatus("Error adding 3D model, continuing with other elements");
//         }
        
//         try {
//           // Load GeoJSON data
//           await loadGeoJson(viewer);
//         } catch (error) {
//           console.error("Error loading GeoJSON:", error);
//           setStatus("Error loading GeoJSON data");
//         }
        
//         // Set up click handler
//         setupClickHandler(viewer);
        
//         setStatus("Application loaded successfully. Click on the map to add an anchor point.");
//       } catch (error) {
//         console.error("Error initializing Cesium:", error);
//         setStatus("Critical error initializing Cesium viewer");
//       }
//     };
    
//     initViewer();
    
//     // Cleanup function
//     return () => {
//       if (viewerRef.current) {
//         try {
//           viewerRef.current.destroy();
//         } catch (e) {
//           console.error("Error during cleanup:", e);
//         }
//       }
//     };
//   }, []);
  
//   // Load 3D Tileset from Ion Asset ID
//   const load3DTileset = async (viewer) => {
//     try {
//       const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(3048665);
//       viewer.scene.primitives.add(tileset);
//       await viewer.zoomTo(tileset);
      
//       // Apply the default style if it exists
//       const extras = tileset.asset.extras;
//       if (
//         Cesium.defined(extras) &&
//         Cesium.defined(extras.ion) &&
//         Cesium.defined(extras.ion.defaultStyle)
//       ) {
//         tileset.style = new Cesium.Cesium3DTileStyle(extras.ion.defaultStyle);
//       }
      
//       tilesetRef.current = tileset;
//     } catch (error) {
//       console.error("Error loading 3D Tileset:", error);
//     }
//   };
  
//   // Add a 3D Model to the Map using a built-in asset instead of external URL
//   const add3DModel = (viewer) => {
//     try {
//       const modelLongitude = -75.59777; // Example longitude
//       const modelLatitude = 40.03883;   // Example latitude
//       const modelHeight = 0;           // Height above ground

//       // Use a well-known Cesium Ion asset instead of an external URL
//       // (Using the Cesium Air asset which is known to work)
//       const position = Cesium.Cartesian3.fromDegrees(modelLongitude, modelLatitude, modelHeight);
      
//       // Add a simple entity instead of a 3D model first
//       const entity = viewer.entities.add({
//         position: position,
//         point: {
//           pixelSize: 15,
//           color: Cesium.Color.BLUE,
//           outlineColor: Cesium.Color.WHITE,
//           outlineWidth: 2,
//           heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
//         },
//         label: {
//           text: 'Model Placeholder',
//           font: '14pt sans-serif',
//           style: Cesium.LabelStyle.FILL_AND_OUTLINE,
//           fillColor: Cesium.Color.WHITE,
//           outlineColor: Cesium.Color.BLACK,
//           outlineWidth: 2,
//           verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
//           pixelOffset: new Cesium.Cartesian2(0, -10),
//           heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
//         }
//       });
      
//       // Async load a real model from Cesium Ion
//       Cesium.IonResource.fromAssetId(40588) // Cesium Balloon asset
//         .then(resource => {
//           entity.model = {
//             uri: resource,
//             scale: 5.0,
//             minimumPixelSize: 64,
//             maximumScale: 20000
//           };
//           entity.point = undefined; // Remove the point once model loads
//         })
//         .catch(error => {
//           console.error("Error loading 3D model:", error);
//         });
      
//       viewer.zoomTo(entity);
//     } catch (error) {
//       console.error("Error in add3DModel:", error);
//       throw error;
//     }
//   };
  
//   // Load GeoJSON data with fallback to sample data
//   const loadGeoJson = async (viewer) => {
//     const zoomThreshold = 500;
//     const geoJsonUrl = 'http://192.168.6.225:8082/data-test.geojson';
    
//     try {
//       // Try to fetch the remote GeoJSON
//       let geojsonData;
//       try {
//         const response = await fetch(geoJsonUrl);
//         geojsonData = await response.json();
//         console.log("Successfully loaded GeoJSON from remote URL");
//       } catch (fetchError) {
//         console.warn("Failed to fetch GeoJSON from remote URL, using fallback data", fetchError);
        
//         // Fallback sample GeoJSON data
//         geojsonData = {
//           "type": "FeatureCollection",
//           "features": [
//             {
//               "type": "Feature",
//               "properties": {
//                 "@id": "Building A",
//                 "height": 30
//               },
//               "geometry": {
//                 "type": "Polygon",
//                 "coordinates": [[
//                   [-75.59777, 40.03883],
//                   [-75.59777, 40.03983],
//                   [-75.59677, 40.03983],
//                   [-75.59677, 40.03883],
//                   [-75.59777, 40.03883]
//                 ]]
//               }
//             },
//             {
//               "type": "Feature",
//               "properties": {
//                 "@id": "Anchor Point 1",
//                 "video": "https://www.w3schools.com/html/mov_bbb.mp4"
//               },
//               "geometry": {
//                 "type": "Point",
//                 "coordinates": [-75.59577, 40.03783]
//               }
//             }
//           ]
//         };
//       }
      
//       // Load the GeoJSON data into Cesium
//       const dataSource = await Cesium.GeoJsonDataSource.load(geojsonData, {
//         clampToGround: true, // Changed to true for better visibility
//         stroke: Cesium.Color.HOTPINK,
//         fill: Cesium.Color.PINK.withAlpha(0.5),
//         strokeWidth: 3
//       });
      
//       viewer.dataSources.add(dataSource);
//       geoJsonDataSourceRef.current = dataSource;
      
//       const entities = dataSource.entities.values;
//       const buildingLabels = [];
      
//       // Process each entity in the data source
//       for (let i = 0; i < entities.length; i++) {
//         const entity = entities[i];
        
//         // For polygon features (buildings)
//         if (entity.polygon) {
//           const buildingName = entity.properties && entity.properties['@id'] ? 
//             entity.properties['@id'].getValue() : 'Building ' + (i + 1);
          
//           try {
//             // Get the centroid of the polygon to place the label above
//             const positions = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;
            
//             if (positions && positions.length > 0) {
//               // Calculate centroid (simple average of vertices)
//               let centerX = 0;
//               let centerY = 0;
//               let centerZ = 0;
              
//               for (const position of positions) {
//                 centerX += position.x;
//                 centerY += position.y;
//                 centerZ += position.z;
//               }
              
//               centerX /= positions.length;
//               centerY /= positions.length;
//               centerZ /= positions.length;
              
//               const center = new Cesium.Cartesian3(centerX, centerY, centerZ);
              
//               // Add the label above the building at the centroid
//               const labelEntity = viewer.entities.add({
//                 position: center,
//                 label: {
//                   text: buildingName,
//                   font: '14px sans-serif',
//                   fillColor: Cesium.Color.WHITE,
//                   scale: 1.5,
//                   pixelOffset: new Cesium.Cartesian2(0, -30),
//                   show: false,
//                   heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
//                 }
//               });
              
//               buildingLabels.push(labelEntity);
//             }
            
//             // Set height extrusion for the building
//             let height = 10; // Default height
//             if (entity.properties && entity.properties.height) {
//               try {
//                 height = entity.properties.height.getValue();
//               } catch (e) {
//                 console.warn("Error getting height value:", e);
//               }
//             }
            
//             entity.polygon.extrudedHeight = height;
//             entity.polygon.material = Cesium.Color.BLUE.withAlpha(0.6);
//             entity.polygon.outline = true;
//             entity.polygon.outlineColor = Cesium.Color.BLUE;
//           } catch (entityError) {
//             console.error("Error processing polygon entity:", entityError);
//           }
//         }
        
//         // For point features (anchors), add a video popup
//         if (entity.position && entity.properties && entity.properties.video) {
//           try {
//             const videoUrl = entity.properties.video.getValue();
//             const entityName = entity.properties['@id'] ? 
//               entity.properties['@id'].getValue() : 'Anchor ' + (i + 1);
            
//             // Add a billboard for better visibility
//             entity.billboard = {
//               image: 'https://developers.arcgis.com/javascript/latest/sample-code/widgets-measurement3d/live/pin-red.png',
//               verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
//               heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
//               width: 32,
//               height: 32
//             };
            
//             entity.label = {
//               text: entityName,
//               font: '14px sans-serif',
//               style: Cesium.LabelStyle.FILL_AND_OUTLINE,
//               outlineWidth: 2,
//               verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
//               pixelOffset: new Cesium.Cartesian2(0, -36),
//               heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
//             };
            
//             entity.description = `
//               <h3>${entityName}</h3>
//               <video width="320" height="240" controls>
//                 <source src="${videoUrl}" type="video/mp4">
//                 Your browser does not support the video tag.
//               </video>
//             `;
//           } catch (pointError) {
//             console.error("Error processing point entity:", pointError);
//           }
//         }
//       }
      
//       // Function to check zoom level and toggle label visibility
//       function checkZoomLevel() {
//         try {
//           const cameraHeight = viewer.camera.positionCartographic.height;
//           buildingLabels.forEach(labelEntity => {
//             if (labelEntity && labelEntity.label) {
//               labelEntity.label.show = cameraHeight < zoomThreshold;
//             }
//           });
//         } catch (e) {
//           console.error("Error in checkZoomLevel:", e);
//         }
//       }
      
//       // Monitor camera movement
//       viewer.camera.changed.addEventListener(checkZoomLevel);
      
//       // Initial check
//       checkZoomLevel();
      
//       // Zoom to the entire data source
//       await viewer.zoomTo(dataSource);
      
//       return dataSource;
//     } catch (error) {
//       console.error(`Error in loadGeoJson: ${error}`);
//       throw error;
//     }
//   };
  
//   // Setup click handler for adding anchor points
//   const setupClickHandler = (viewer) => {
//     const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    
//     handler.setInputAction(event => {
//       const ray = viewer.camera.getPickRay(event.position);
//       const position = viewer.scene.globe.pick(ray, viewer.scene);
      
//       if (position) {
//         // Check if the click is on an existing anchor point
//         const pickedObject = viewer.scene.pick(event.position);
//         if (pickedObject && pickedObject.id && pickedObject.id.properties && pickedObject.id.properties.video) {
//           // Play video in a modal
//           const videoUrl = pickedObject.id.properties.video.getValue();
//           const videoTitle = pickedObject.id.properties['@id'].getValue();
          
//           setVideoModal({
//             visible: true,
//             title: videoTitle,
//             url: videoUrl
//           });
//         } else {
//           // Add anchor point if not on existing anchor
//           addAnchorPoint(position, viewer);
//         }
//       }
//     }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
//   };
  
//   // Function to add a new anchor point
//   const addAnchorPoint = (position, viewer) => {
//     try {
//       const cartographic = Cesium.Cartographic.fromCartesian(position);
      
//       // Simplified approach to get coordinates without terrain sampling which can cause errors
//       const longitude = Cesium.Math.toDegrees(cartographic.longitude);
//       const latitude = Cesium.Math.toDegrees(cartographic.latitude);
      
//       // Confirm with the user before adding an anchor
//       const confirmAdd = confirm("Do you want to add an anchor point here?");
//       if (!confirmAdd) return;
      
//       // Prompt user for additional properties
//       const anchorName = prompt("Enter a name for the anchor point:");
//       const videoUrl = prompt("Enter a video URL (optional):");
      
//       // Use sample video URL if none provided
//       const finalVideoUrl = videoUrl || "https://www.w3schools.com/html/mov_bbb.mp4";
      
//       // Create a new entity directly
//       const entity = viewer.entities.add({
//         name: anchorName || "Unnamed Anchor",
//         position: Cesium.Cartesian3.fromDegrees(longitude, latitude, 0),
//         billboard: {
//           image: 'https://developers.arcgis.com/javascript/latest/sample-code/widgets-measurement3d/live/pin-red.png',
//           verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
//           heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
//           width: 32,
//           height: 32
//         },
//         label: {
//           text: anchorName || "Unnamed Anchor",
//           font: '14px sans-serif',
//           style: Cesium.LabelStyle.FILL_AND_OUTLINE,
//           outlineWidth: 2,
//           verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
//           pixelOffset: new Cesium.Cartesian2(0, -36),
//           heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
//         },
//         properties: {
//           '@id': new Cesium.ConstantProperty(anchorName || "Unnamed Anchor"),
//           'video': new Cesium.ConstantProperty(finalVideoUrl)
//         },
//         description: `
//           <h3>${anchorName || "Unnamed Anchor"}</h3>
//           <video width="320" height="240" controls>
//             <source src="${finalVideoUrl}" type="video/mp4">
//             Your browser does not support the video tag.
//           </video>
//         `
//       });
      
//       // Create a new feature for the backend
//       const newFeature = {
//         type: "Feature",
//         properties: {
//           "@id": anchorName || "Unnamed Anchor",
//           video: finalVideoUrl
//         },
//         geometry: {
//           type: "Point",
//           coordinates: [longitude, latitude]
//         }
//       };
      
//       // Zoom to the new entity
//       viewer.zoomTo(entity);
      
//       // Update status
//       setStatus(`Added anchor point: ${anchorName || "Unnamed Anchor"}`);
      
//       // Send update to server
//       updateGeoJsonOnServer(newFeature);
//     } catch (error) {
//       console.error("Error adding anchor point:", error);
//       setStatus("Error adding anchor point");
//     }
//   };
  
//   // Function to send updated GeoJSON data to the backend
//   const updateGeoJsonOnServer = (newFeature) => {
//     fetch('http://localhost:8081/update-geojson', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(newFeature)
//     })
//     .then(response => response.text())
//     .then(message => {
//       console.log(message);
//       setStatus("Anchor point added successfully!");
//     })
//     .catch(error => {
//       console.error('Error updating GeoJSON on server:', error);
//       setStatus("Error updating server.");
//     });
//   };
  
//   // Toggle 3D Tileset visibility
//   const toggleTileset = () => {
//     if (tilesetRef.current) {
//       tilesetRef.current.show = !tilesetRef.current.show;
//       const status = tilesetRef.current.show ? 'shown' : 'hidden';
//       alert(`3D Tileset is now ${status}`);
//     }
//   };
  
//   // Toggle GeoJSON visibility
//   const toggleGeoJson = () => {
//     if (geoJsonDataSourceRef.current) {
//       geoJsonDataSourceRef.current.show = !geoJsonDataSourceRef.current.show;
//       const status = geoJsonDataSourceRef.current.show ? 'shown' : 'hidden';
//       alert(`GeoJSON data is now ${status}`);
//     }
//   };
  
//   // Close video modal
//   const closeVideoModal = () => {
//     setVideoModal(prev => ({...prev, visible: false}));
//   };
  
//   return (
//     <div className="relative w-full h-screen">
//       {/* Cesium Container */}
//       <div ref={cesiumContainerRef} className="w-full h-full"></div>
      
//       {/* Controls */}
//       <div className="absolute top-4 left-4 z-10 bg-white/80 p-3 rounded">
//         <button 
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors" 
//           onClick={() => setStatus('Click on the map to add an anchor point.')}
//         >
//           Add Anchor
//         </button>
//         <p className="mt-2 text-sm">{status}</p>
//       </div>
      
//       {/* Button Container */}
//       <div className="absolute top-4 right-4 z-10 flex gap-3">
//         <button 
//           className="bg-black/70 text-white px-4 py-2 rounded hover:bg-black/90 transition-colors"
//           onClick={toggleTileset}
//         >
//           Toggle 3D Tileset
//         </button>
//         <button 
//           className="bg-black/70 text-white px-4 py-2 rounded hover:bg-black/90 transition-colors"
//           onClick={toggleGeoJson}
//         >
//           Toggle GeoJSON
//         </button>
//       </div>
      
//       {/* Video Modal */}
//       {videoModal.visible && (
//         <div className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded shadow-lg border border-gray-300">
//           <span 
//             className="float-right text-xl cursor-pointer"
//             onClick={closeVideoModal}
//           >
//             &times;
//           </span>
//           <h3 className="text-lg font-semibold mb-2">{videoModal.title}</h3>
//           <video width="400" controls>
//             <source src={videoModal.url} type="video/mp4" />
//             Your browser does not support the video tag.
//           </video>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;

// import React, { useEffect, useRef } from 'react';
// import * as Cesium from 'cesium';
// import 'cesium/Build/Cesium/Widgets/widgets.css';

// // This is needed for Vite to properly handle Cesium assets
// window.CESIUM_BASE_URL = '/node_modules/cesium/Build/Cesium/';

// const CesiumViewer = () => {
//   const cesiumContainer = useRef(null);
//   const viewerRef = useRef(null);

//   useEffect(() => {
//     // Initialize Cesium Viewer
//     Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YjhlMmVkNC1hYWVjLTQxYWEtOGZhYS1iOGQyNDUxY2ZlMTUiLCJpZCI6MjY0Nzg3LCJpYXQiOjE3MzUxMTAzMzV9.tdJk1ppDaw9AEy9bFB6RBU9T3H0-xOlIqVlrjDBJGQo";

//     const initializeViewer = async () => {
//       try {
//         // Initialize required Cesium subsystems first
//         await Cesium.Ion.defaultAccessToken;
//         await Cesium.ApproximateTerrainHeights.initialize();

//         // Create world terrain
//         const worldTerrain = await Cesium.createWorldTerrainAsync({
//           requestWaterMask: true,
//           requestVertexNormals: true
//         });

//         // Configure viewer with proper error handling
//         viewerRef.current = new Cesium.Viewer(cesiumContainer.current, {
//           terrainProvider: worldTerrain,
//           // Disable some default behavior that can cause issues
//           timeline: false,
//           animation: false,
//           baseLayerPicker: false,
//           // Better error handling
//           imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
//             url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
//           }),
//           // Handle errors gracefully
//           sceneMode: Cesium.SceneMode.SCENE3D,
//           shouldAnimate: true,
//           creditContainer: document.createElement('div') // Hide credits to avoid DOM issues
//         });

//         // Disable default base layer if needed
//         viewerRef.current.imageryLayers.remove(viewerRef.current.imageryLayers.get(0));

//         // Load the tileset with retry logic
//         try {
//           const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(3048665);
//           viewerRef.current.scene.primitives.add(tileset);
          
//           // Apply the default style if it exists
//           const extras = tileset.asset.extras;
//           if (extras?.ion?.defaultStyle) {
//             tileset.style = new Cesium.Cesium3DTileStyle(extras.ion.defaultStyle);
//           }
          
//           await viewerRef.current.zoomTo(tileset);
//         } catch (tilesetError) {
//           console.error('Error loading tileset:', tilesetError);
//           viewerRef.current.entities.add({
//             position: Cesium.Cartesian3.fromDegrees(0, 0),
//             label: {
//               text: 'Failed to load 3D tileset',
//               font: '20px sans-serif',
//               fillColor: Cesium.Color.RED
//             }
//           });
//         }
//       } catch (error) {
//         console.error('Error initializing Cesium:', error);
//       }
//     };

//     initializeViewer();

//     return () => {
//       if (viewerRef.current && !viewerRef.current.isDestroyed()) {
//         viewerRef.current.destroy();
//       }
//     };
//   }, []);

//   return (
//     <div 
//       ref={cesiumContainer} 
//       style={{ 
//         width: '100%', 
//         height: '100vh',
//         position: 'absolute',
//         top: 0,
//         left: 0
//       }} 
//     />
//   );
// };

// export default CesiumViewer;

// import React, { useEffect, useRef } from 'react';
// import * as Cesium from 'cesium';
// import 'cesium/Build/Cesium/Widgets/widgets.css';

// // This is needed for Vite to properly handle Cesium assets
// window.CESIUM_BASE_URL = '/node_modules/cesium/Build/Cesium/';

// const CesiumViewer = () => {
//   const cesiumContainer = useRef(null);
//   const viewerRef = useRef(null);

//   useEffect(() => {
//     // Initialize Cesium Viewer
//     Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YjhlMmVkNC1hYWVjLTQxYWEtOGZhYS1iOGQyNDUxY2ZlMTUiLCJpZCI6MjY0Nzg3LCJpYXQiOjE3MzUxMTAzMzV9.tdJk1ppDaw9AEy9bFB6RBU9T3H0-xOlIqVlrjDBJGQo";

//     const initializeViewer = async () => {
//       try {
//         // Initialize required Cesium subsystems first
//         await Cesium.Ion.defaultAccessToken;
//         await Cesium.ApproximateTerrainHeights.initialize();

//         // Create world terrain
//         const worldTerrain = await Cesium.createWorldTerrainAsync({
//           requestWaterMask: true,
//           requestVertexNormals: true
//         });

//         // Configure viewer with proper imagery
//         viewerRef.current = new Cesium.Viewer(cesiumContainer.current, {
//           terrainProvider: worldTerrain,
//           timeline: false,
//           animation: false,
//           baseLayerPicker: true, // Allow user to switch base layers
//           sceneMode: Cesium.SceneMode.SCENE3D,
//           shouldAnimate: true,
//           // Use the standard Bing Maps imagery (original Cesium look)
//           imageryProvider: new Cesium.BingMapsImageryProvider({
//             url: 'https://dev.virtualearth.net',
//             key: 'Your_Bing_Maps_Key', // You may need to get a Bing Maps key
//             mapStyle: Cesium.BingMapsStyle.AERIAL
//           }),
//           creditContainer: document.createElement('div')
//         });

//         // Alternative if you don't have a Bing Maps key:
//         // Use the default Cesium World Imagery (ion imagery)
//         // viewerRef.current.imageryLayers.remove(viewerRef.current.imageryLayers.get(0));
//         // viewerRef.current.imageryLayers.addImageryProvider(
//         //   new Cesium.IonImageryProvider({ assetId: 3845 })
//         // );

//         // Load the tileset with retry logic
//         try {
//           const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(3048665);
//           viewerRef.current.scene.primitives.add(tileset);
          
//           // Apply the default style if it exists
//           const extras = tileset.asset.extras;
//           if (extras?.ion?.defaultStyle) {
//             tileset.style = new Cesium.Cesium3DTileStyle(extras.ion.defaultStyle);
//           }
          
//           await viewerRef.current.zoomTo(tileset);
//         } catch (tilesetError) {
//           console.error('Error loading tileset:', tilesetError);
//           viewerRef.current.entities.add({
//             position: Cesium.Cartesian3.fromDegrees(0, 0),
//             label: {
//               text: 'Failed to load 3D tileset',
//               font: '20px sans-serif',
//               fillColor: Cesium.Color.RED
//             }
//           });
//         }
//       } catch (error) {
//         console.error('Error initializing Cesium:', error);
//       }
//     };

//     initializeViewer();

//     return () => {
//       if (viewerRef.current && !viewerRef.current.isDestroyed()) {
//         viewerRef.current.destroy();
//       }
//     };
//   }, []);

//   return (
//     <div 
//       ref={cesiumContainer} 
//       style={{ 
//         width: '100%', 
//         height: '100vh',
//         position: 'absolute',
//         top: 0,
//         left: 0
//       }} 
//     />
//   );
// };

// export default CesiumViewer;



// import React, { useEffect, useRef, useState } from 'react';
// import * as Cesium from 'cesium';
// import 'cesium/Build/Cesium/Widgets/widgets.css';

// // This is needed for Vite to properly handle Cesium assets
// window.CESIUM_BASE_URL = '/node_modules/cesium/Build/Cesium/';

// const CesiumViewer = () => {
//   const cesiumContainer = useRef(null);
//   const viewerRef = useRef(null);
//   const tilesetRef = useRef(null);
//   const geoJsonDataSourceRef = useRef(null);
//   const [status, setStatus] = useState('Click on the map to add an anchor point.');
//   const [showVideoModal, setShowVideoModal] = useState(false);
//   const [videoUrl, setVideoUrl] = useState('');
//   const [videoTitle, setVideoTitle] = useState('');
//   const zoomThreshold = 500;
//   const geojsonDataRef = useRef({
//     type: "FeatureCollection",
//     features: []
//   });

//   useEffect(() => {
//     // Initialize Cesium Viewer
//     Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YjhlMmVkNC1hYWVjLTQxYWEtOGZhYS1iOGQyNDUxY2ZlMTUiLCJpZCI6MjY0Nzg3LCJpYXQiOjE3MzUxMTAzMzV9.tdJk1ppDaw9AEy9bFB6RBU9T3H0-xOlIqVlrjDBJGQo";

//     const initializeViewer = async () => {
//       try {
//         // Initialize required Cesium subsystems first
//         await Cesium.Ion.defaultAccessToken;
//         await Cesium.ApproximateTerrainHeights.initialize();

//         // Create world terrain
//         const worldTerrain = await Cesium.createWorldTerrainAsync({
//           requestWaterMask: true,
//           requestVertexNormals: true
//         });

//         // Configure viewer with proper imagery
//         viewerRef.current = new Cesium.Viewer(cesiumContainer.current, {
//           terrainProvider: worldTerrain,
//           timeline: false,
//           animation: false,
//           baseLayerPicker: true,
//           sceneMode: Cesium.SceneMode.SCENE3D,
//           shouldAnimate: true,
//           imageryProvider: new Cesium.BingMapsImageryProvider({
//             url: 'https://dev.virtualearth.net',
//             key: 'Your_Bing_Maps_Key',
//             mapStyle: Cesium.BingMapsStyle.AERIAL
//           }),
//           creditContainer: document.createElement('div')
//         });

//         // Load 3D Tileset
//         try {
//           const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(3048665);
//           viewerRef.current.scene.primitives.add(tileset);
//           tilesetRef.current = tileset;
          
//           // Apply the default style if it exists
//           const extras = tileset.asset.extras;
//           if (extras?.ion?.defaultStyle) {
//             tileset.style = new Cesium.Cesium3DTileStyle(extras.ion.defaultStyle);
//           }
          
//           await viewerRef.current.zoomTo(tileset);
//         } catch (tilesetError) {
//           console.error('Error loading tileset:', tilesetError);
//           viewerRef.current.entities.add({
//             position: Cesium.Cartesian3.fromDegrees(0, 0),
//             label: {
//               text: 'Failed to load 3D tileset',
//               font: '20px sans-serif',
//               fillColor: Cesium.Color.RED
//             }
//           });
//         }

//         // Load GeoJSON data
//         const geoJsonUrl = 'http://192.168.6.225:8081/data-test.geojson';
//         try {
//           const response = await fetch(geoJsonUrl);
//           const geojsonData = await response.json();
//           geojsonDataRef.current = geojsonData;
          
//           const dataSource = await Cesium.GeoJsonDataSource.load(geojsonData, {
//             clampToGround: false
//           });
          
//           geoJsonDataSourceRef.current = dataSource;
//           viewerRef.current.dataSources.add(dataSource);
          
//           const entities = dataSource.entities.values;
//           const buildingLabels = [];

//           entities.forEach(entity => {
//             // For polygon features (buildings)
//             if (entity.polygon) {
//               const buildingName = entity.properties['@id'] || 'Unknown Building';

//               // Get the centroid of the polygon to place the label above
//               const positions = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;
//               const center = Cesium.Cartesian3.fromDegrees(
//                 Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(positions[0]).longitude),
//                 Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(positions[0]).latitude),
//                 0
//               );

//               // Add the label above the building at the centroid
//               const labelEntity = viewerRef.current.entities.add({
//                 position: center,
//                 label: {
//                   text: buildingName,
//                   font: '14px sans-serif',
//                   fillColor: Cesium.Color.WHITE,
//                   scale: 1.5,
//                   pixelOffset: new Cesium.Cartesian2(0, -30),
//                   show: false
//                 }
//               });

//               buildingLabels.push(labelEntity);

//               // Set height extrusion for the building
//               const height = entity.properties.height ? entity.properties.height.getValue() : 10;
//               entity.polygon.extrudedHeight = height;
//               entity.polygon.material = Cesium.Color.BLUE.withAlpha(0.6);
//               entity.polygon.outline = true;
//               entity.polygon.outlineColor = Cesium.Color.BLUE;
//             }

//             // For point features (anchors), add a video popup
//             if (entity.position && entity.properties.video) {
//               const videoUrl = entity.properties.video;

//               entity.description = ` 
//                 <h3>${entity.properties['@id']}</h3>
//                 <video width="320" height="240" controls>
//                   <source src="${videoUrl}" type="video/mp4">
//                   Your browser does not support the video tag.
//                 </video>
//               `;
//             }
//           });

//           // Function to check zoom level and toggle label visibility
//           const checkZoomLevel = () => {
//             const cameraHeight = viewerRef.current.camera.positionCartographic.height;
//             buildingLabels.forEach(labelEntity => {
//               if (cameraHeight < zoomThreshold) {
//                 labelEntity.label.show = true;
//               } else {
//                 labelEntity.label.show = false;
//               }
//             });
//           };

//           viewerRef.current.camera.changed.addEventListener(checkZoomLevel);
//           checkZoomLevel();

//           viewerRef.current.zoomTo(dataSource);
//         } catch (error) {
//           console.error('Error loading GeoJSON:', error);
//         }

//         // Add click handler for adding anchor points
//         const handler = new Cesium.ScreenSpaceEventHandler(viewerRef.current.canvas);
//         handler.setInputAction(async (event) => {
//           const ray = viewerRef.current.camera.getPickRay(event.position);
//           const position = viewerRef.current.scene.globe.pick(ray, viewerRef.current.scene);

//           if (position) {
//             // Check if the click is on an existing anchor point
//             const pickedObject = viewerRef.current.scene.pick(event.position);
//             if (pickedObject && pickedObject.id && pickedObject.id.properties && pickedObject.id.properties.video) {
//               // Play video in a modal
//               const videoUrl = pickedObject.id.properties.video.getValue();
//               const videoTitle = pickedObject.id.properties['@id'].getValue();
//               setVideoUrl(videoUrl);
//               setVideoTitle(videoTitle);
//               setShowVideoModal(true);
//             } else {
//               // Add anchor point if not on existing anchor
//               await addAnchorPoint(position);
//             }
//           }
//         }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

//       } catch (error) {
//         console.error('Error initializing Cesium:', error);
//       }
//     };

//     initializeViewer();

//     return () => {
//       if (viewerRef.current && !viewerRef.current.isDestroyed()) {
//         viewerRef.current.destroy();
//       }
//     };
//   }, []);

//   const addAnchorPoint = async (position) => {
//     try {
//       const cartographic = Cesium.Cartographic.fromCartesian(position);
//       const updatedPositions = await Cesium.sampleTerrainMostDetailed(viewerRef.current.terrainProvider, [cartographic]);
//       const updatedCartographic = updatedPositions[0];
//       const longitude = Cesium.Math.toDegrees(updatedCartographic.longitude);
//       const latitude = Cesium.Math.toDegrees(updatedCartographic.latitude);

//       // In a real app, you might want to use a proper modal dialog here
//       const confirmAdd = window.confirm("Do you want to add an anchor point here?");
//       if (!confirmAdd) return;

//       const anchorName = prompt("Enter a name for the anchor point:");
//       const videoUrl = prompt("Enter a video URL (optional):");

//       // Create a new feature
//       const newFeature = {
//         type: "Feature",
//         properties: {
//           "@id": anchorName || "Unnamed Anchor",
//           video: videoUrl || null
//         },
//         geometry: {
//           type: "Point",
//           coordinates: [longitude, latitude]
//         }
//       };

//       // Add the new feature to the GeoJSON data
//       geojsonDataRef.current.features.push(newFeature);

//       // Add the new feature to the Cesium viewer
//       const dataSource = new Cesium.GeoJsonDataSource();
//       await Cesium.GeoJsonDataSource.load(newFeature, {
//         clampToGround: true
//       }).then(dataSource => {
//         viewerRef.current.dataSources.add(dataSource);
//         viewerRef.current.zoomTo(dataSource);
//       });

//       // Send the updated GeoJSON data to the backend
//       await updateGeoJsonOnServer(geojsonDataRef.current);
//       setStatus(`Added new anchor point: ${anchorName || 'Unnamed Anchor'}`);
//     } catch (error) {
//       console.error("Error adding anchor point:", error);
//       setStatus('Failed to add anchor point');
//     }
//   };

//   const updateGeoJsonOnServer = async (updatedGeoJson) => {
//     try {
//       const response = await fetch('http://localhost:8081/update-geojson', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(updatedGeoJson)
//       });
//       const message = await response.text();
//       console.log(message);
//     } catch (error) {
//       console.error('Error updating GeoJSON on server:', error);
//     }
//   };

//   const toggleTileset = () => {
//     if (tilesetRef.current) {
//       tilesetRef.current.show = !tilesetRef.current.show;
//       setStatus(`3D Tileset is now ${tilesetRef.current.show ? 'shown' : 'hidden'}`);
//     }
//   };

//   const toggleGeoJson = () => {
//     if (geoJsonDataSourceRef.current) {
//       geoJsonDataSourceRef.current.show = !geoJsonDataSourceRef.current.show;
//       setStatus(`GeoJSON data is now ${geoJsonDataSourceRef.current.show ? 'shown' : 'hidden'}`);
//     }
//   };

//   return (
//     <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
//       <div 
//         ref={cesiumContainer} 
//         style={{ 
//           width: '100%', 
//           height: '100%',
//           position: 'absolute',
//           top: 0,
//           left: 0
//         }} 
//       />
      
//       {/* Controls */}
//       <div style={{
//         position: 'absolute',
//         top: '10px',
//         left: '10px',
//         zIndex: 1000,
//         background: 'rgba(255, 255, 255, 0.8)',
//         padding: '10px',
//         borderRadius: '5px'
//       }}>
//         <button onClick={() => {
//           // For demo purposes, we'll just show a message
//           // In a real app, you might want to trigger the anchor point addition
//           setStatus('Click on the map to add an anchor point');
//         }}>
//           Add Anchor
//         </button>
//         <p>{status}</p>
//       </div>
      
//       {/* Toggle buttons */}
//       <div style={{
//         position: 'absolute',
//         top: '10px',
//         right: '10px',
//         zIndex: 1000,
//         display: 'flex',
//         gap: '10px'
//       }}>
//         <button 
//           onClick={toggleTileset}
//           style={{
//             backgroundColor: 'rgba(0, 0, 0, 0.7)',
//             color: 'white',
//             padding: '10px',
//             border: 'none',
//             borderRadius: '5px',
//             cursor: 'pointer'
//           }}
//         >
//           Toggle 3D Tileset
//         </button>
//         <button 
//           onClick={toggleGeoJson}
//           style={{
//             backgroundColor: 'rgba(0, 0, 0, 0.7)',
//             color: 'white',
//             padding: '10px',
//             border: 'none',
//             borderRadius: '5px',
//             cursor: 'pointer'
//           }}
//         >
//           Toggle GeoJSON
//         </button>
//       </div>
      
//       {/* Video Modal */}
//       {showVideoModal && (
//         <div style={{
//           position: 'fixed',
//           zIndex: 1001,
//           left: '50%',
//           top: '50%',
//           transform: 'translate(-50%, -50%)',
//           backgroundColor: 'white',
//           padding: '20px',
//           border: '1px solid #ccc',
//           borderRadius: '5px',
//           boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
//         }}>
//           <span 
//             style={{ float: 'right', fontSize: '20px', cursor: 'pointer' }}
//             onClick={() => setShowVideoModal(false)}
//           >
//             &times;
//           </span>
//           <h3>{videoTitle}</h3>
//           <video width="400" controls>
//             <source src={videoUrl} type="video/mp4" />
//             Your browser does not support the video tag.
//           </video>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CesiumViewer;

// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import * as Cesium from 'cesium';
// import 'cesium/Build/Cesium/Widgets/widgets.css';

// // Set base URL for Cesium assets
// window.CESIUM_BASE_URL = '/node_modules/cesium/Build/Cesium/';

// const CesiumViewer = () => {
//   const cesiumContainer = useRef(null);
//   const viewerRef = useRef(null);
//   const tilesetRef = useRef(null);
//   const geoJsonDataSourceRef = useRef(null);
//   const buildingLabelsRef = useRef([]);
//   const [status, setStatus] = useState('Click on the map to add an anchor point.');
//   const [showVideoModal, setShowVideoModal] = useState(false);
//   const [videoUrl, setVideoUrl] = useState('');
//   const [videoTitle, setVideoTitle] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const zoomThreshold = 500;

//   // Memoized terrain creation to prevent recreation on rerenders
//   const createTerrain = useCallback(async () => {
//     return await Cesium.createWorldTerrainAsync({
//       requestWaterMask: true,
//       requestVertexNormals: true
//     });
//   }, []);

//   // Initialize viewer and load data
//   useEffect(() => {
//     let isMounted = true;
//     const initViewer = async () => {
//       try {
//         Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YjhlMmVkNC1hYWVjLTQxYWEtOGZhYS1iOGQyNDUxY2ZlMTUiLCJpZCI6MjY0Nzg3LCJpYXQiOjE3MzUxMTAzMzV9.tdJk1ppDaw9AEy9bFB6RBU9T3H0-xOlIqVlrjDBJGQo";
        
//         // Initialize subsystems in parallel
//         await Promise.all([
//           Cesium.Ion.defaultAccessToken,
//           Cesium.ApproximateTerrainHeights.initialize()
//         ]);

//         const terrainProvider = await createTerrain();

//         if (!isMounted) return;

//         // Configure viewer with optimized settings
//         viewerRef.current = new Cesium.Viewer(cesiumContainer.current, {
//           terrainProvider,
//           timeline: false,
//           animation: false,
//           baseLayerPicker: true, // Disable for better performance
//           sceneMode: Cesium.SceneMode.SCENE3D,
//           shouldAnimate: true,
//           imageryProvider: new Cesium.IonImageryProvider({ assetId: 3845 }), // Default Cesium World Imagery
//           creditContainer: document.createElement('div'),
//           scene3DOnly: true, // Improve performance
//           orderIndependentTranslucency: false, // Improve performance
//           shadows: false // Improve performance
//         });

//         // Disable features we don't need for better performance
//         viewerRef.current.scene.globe.showGroundAtmosphere = false;
//         viewerRef.current.scene.fog.enabled = false;
//         viewerRef.current.scene.skyAtmosphere.show = false;

//         // Load data in parallel
//         await Promise.all([
//           load3DTileset(),
//           loadGeoJsonData()
//         ]);

//         if (isMounted) {
//           setIsLoading(false);
//         }
//       } catch (error) {
//         console.error('Error initializing Cesium:', error);
//         if (isMounted) {
//           setStatus('Failed to initialize map');
//           setIsLoading(false);
//         }
//       }
//     };

//     initViewer();

//     return () => {
//       isMounted = false;
//       if (viewerRef.current && !viewerRef.current.isDestroyed()) {
//         viewerRef.current.destroy();
//       }
//     };
//   }, [createTerrain]);

//   const load3DTileset = async () => {
//     try {
//       const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(3048665, {
//         show: false // Start with tileset hidden for better performance
//       });
      
//       // Optimize tileset performance
//       tileset.maximumScreenSpaceError = 2; // Lower quality for better performance
//       tileset.dynamicScreenSpaceError = true;
//       tileset.dynamicScreenSpaceErrorDensity = 0.00278;
//       tileset.dynamicScreenSpaceErrorFactor = 4.0;
//       tileset.dynamicScreenSpaceErrorHeightFalloff = 0.25;
      
//       viewerRef.current.scene.primitives.add(tileset);
//       tilesetRef.current = tileset;

//       // Apply default style if available
//       const extras = tileset.asset.extras;
//       if (extras?.ion?.defaultStyle) {
//         tileset.style = new Cesium.Cesium3TileStyle(extras.ion.defaultStyle);
//       }

//       await viewerRef.current.zoomTo(tileset);
//     } catch (error) {
//       console.error('Error loading 3D tileset:', error);
//       viewerRef.current.entities.add({
//         position: Cesium.Cartesian3.fromDegrees(0, 0),
//         label: {
//           text: 'Failed to load 3D tileset',
//           font: '20px sans-serif',
//           fillColor: Cesium.Color.RED
//         }
//       });
//     }
//   };

//   const loadGeoJsonData = async () => {
//     try {
//       const response = await fetch('http://192.168.6.225:8081/data-test.geojson');
//       const geojsonData = await response.json();
      
//       const dataSource = await Cesium.GeoJsonDataSource.load(geojsonData, {
//         clampToGround: false,
//         stroke: Cesium.Color.BLUE,
//         fill: Cesium.Color.BLUE.withAlpha(0.5),
//         strokeWidth: 3
//       });

//       geoJsonDataSourceRef.current = dataSource;
//       viewerRef.current.dataSources.add(dataSource);

//       // Process entities
//       const entities = dataSource.entities.values;
//       const buildingLabels = [];

//       entities.forEach(entity => {
//         if (entity.polygon) {
//           const buildingName = entity.properties['@id'] || 'Unknown Building';
//           const positions = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;
//           const center = Cesium.Cartesian3.fromDegrees(
//             Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(positions[0]).longitude),
//             Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(positions[0]).latitude),
//             0
//           );

//           const labelEntity = viewerRef.current.entities.add({
//             position: center,
//             label: {
//               text: buildingName,
//               font: '14px sans-serif',
//               fillColor: Cesium.Color.WHITE,
//               scale: 1.5,
//               pixelOffset: new Cesium.Cartesian2(0, -30),
//               show: false
//             }
//           });

//           buildingLabels.push(labelEntity);

//           const height = entity.properties.height ? entity.properties.height.getValue() : 10;
//           entity.polygon.extrudedHeight = height;
//           entity.polygon.material = Cesium.Color.BLUE.withAlpha(0.6);
//           entity.polygon.outline = true;
//           entity.polygon.outlineColor = Cesium.Color.BLUE;
//         }

//         if (entity.position && entity.properties.video) {
//           const videoUrl = entity.properties.video;
//           entity.description = `
//             <h3>${entity.properties['@id']}</h3>
//             <video width="320" height="240" controls>
//               <source src="${videoUrl}" type="video/mp4">
//               Your browser does not support the video tag.
//             </video>
//           `;
//         }
//       });

//       buildingLabelsRef.current = buildingLabels;
//       setupZoomListener();
//       await viewerRef.current.zoomTo(dataSource);
//     } catch (error) {
//       console.error('Error loading GeoJSON:', error);
//     }
//   };

//   const setupZoomListener = useCallback(() => {
//     const checkZoomLevel = () => {
//       if (!viewerRef.current) return;
//       const cameraHeight = viewerRef.current.camera.positionCartographic.height;
//       buildingLabelsRef.current.forEach(labelEntity => {
//         labelEntity.label.show = cameraHeight < zoomThreshold;
//       });
//     };

//     viewerRef.current.camera.changed.addEventListener(checkZoomLevel);
//     checkZoomLevel();
//   }, []);

//   const toggleTileset = useCallback(() => {
//     if (tilesetRef.current) {
//       tilesetRef.current.show = !tilesetRef.current.show;
//       setStatus(`3D Tileset is now ${tilesetRef.current.show ? 'visible' : 'hidden'}`);
//     }
//   }, []);

//   const toggleGeoJson = useCallback(() => {
//     if (geoJsonDataSourceRef.current) {
//       geoJsonDataSourceRef.current.show = !geoJsonDataSourceRef.current.show;
//       setStatus(`GeoJSON data is now ${geoJsonDataSourceRef.current.show ? 'visible' : 'hidden'}`);
//     }
//   }, []);

//   const handleMapClick = useCallback(async (movement) => {
//     if (!viewerRef.current) return;

//     const pickedObject = viewerRef.current.scene.pick(movement.position);
//     if (pickedObject && pickedObject.id && pickedObject.id.properties) {
//       // Handle click on existing feature
//       if (pickedObject.id.properties.video) {
//         const videoUrl = pickedObject.id.properties.video.getValue();
//         const videoTitle = pickedObject.id.properties['@id'].getValue();
//         setVideoUrl(videoUrl);
//         setVideoTitle(videoTitle);
//         setShowVideoModal(true);
//       }
//       return;
//     }

//     // Handle adding new anchor point
//     const ray = viewerRef.current.camera.getPickRay(movement.position);
//     const position = viewerRef.current.scene.globe.pick(ray, viewerRef.current.scene);
//     if (!position) return;

//     try {
//       const cartographic = Cesium.Cartographic.fromCartesian(position);
//       const [updatedCartographic] = await Cesium.sampleTerrainMostDetailed(
//         viewerRef.current.terrainProvider, 
//         [cartographic]
//       );

//       const longitude = Cesium.Math.toDegrees(updatedCartographic.longitude);
//       const latitude = Cesium.Math.toDegrees(updatedCartographic.latitude);

//       const anchorName = window.prompt("Enter a name for the anchor point:");
//       if (!anchorName) return;

//       const videoUrl = window.prompt("Enter a video URL (optional):");

//       const newFeature = {
//         type: "Feature",
//         properties: {
//           "@id": anchorName,
//           video: videoUrl || null
//         },
//         geometry: {
//           type: "Point",
//           coordinates: [longitude, latitude]
//         }
//       };

//       // Add to viewer
//       const dataSource = await Cesium.GeoJsonDataSource.load(newFeature, {
//         clampToGround: true,
//         markerColor: Cesium.Color.RED,
//         markerSymbol: '?'
//       });
      
//       viewerRef.current.dataSources.add(dataSource);
//       await viewerRef.current.zoomTo(dataSource);
      
//       setStatus(`Added new anchor point: ${anchorName}`);
//     } catch (error) {
//       console.error("Error adding anchor point:", error);
//       setStatus('Failed to add anchor point');
//     }
//   }, []);

//   // Setup click handler after viewer is initialized
//   useEffect(() => {
//     if (!viewerRef.current || isLoading) return;

//     const handler = new Cesium.ScreenSpaceEventHandler(viewerRef.current.canvas);
//     handler.setInputAction(handleMapClick, Cesium.ScreenSpaceEventType.LEFT_CLICK);

//     return () => {
//       handler.destroy();
//     };
//   }, [isLoading, handleMapClick]);

//   return (
//     <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
//       <div 
//         ref={cesiumContainer} 
//         style={{ 
//           width: '100%', 
//           height: '100%',
//           position: 'absolute',
//           top: 0,
//           left: 0
//         }} 
//       />
      
//       {isLoading && (
//         <div style={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           width: '100%',
//           height: '100%',
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           backgroundColor: 'rgba(0,0,0,0.7)',
//           zIndex: 999
//         }}>
//           <div style={{ color: 'white', fontSize: '20px' }}>Loading map...</div>
//         </div>
//       )}
      
//       {/* Controls */}
//       <div style={{
//         position: 'absolute',
//         top: '10px',
//         left: '10px',
//         zIndex: 1000,
//         background: 'rgba(255, 255, 255, 0.8)',
//         padding: '10px',
//         borderRadius: '5px'
//       }}>
//         <button onClick={() => setStatus('Click on the map to add an anchor point')}>
//           Add Anchor
//         </button>
//         <p>{status}</p>
//       </div>
      
//       {/* Toggle buttons */}
//       <div style={{
//         position: 'absolute',
//         top: '10px',
//         right: '10px',
//         zIndex: 1000,
//         display: 'flex',
//         gap: '10px'
//       }}>
//         <button 
//           onClick={toggleTileset}
//           style={{
//             backgroundColor: 'rgba(0, 0, 0, 0.7)',
//             color: 'white',
//             padding: '10px',
//             border: 'none',
//             borderRadius: '5px',
//             cursor: 'pointer'
//           }}
//         >
//           Toggle 3D Tileset
//         </button>
//         <button 
//           onClick={toggleGeoJson}
//           style={{
//             backgroundColor: 'rgba(0, 0, 0, 0.7)',
//             color: 'white',
//             padding: '10px',
//             border: 'none',
//             borderRadius: '5px',
//             cursor: 'pointer'
//           }}
//         >
//           Toggle GeoJSON
//         </button>
//       </div>
      
//       {/* Video Modal */}
//       {showVideoModal && (
//         <div style={{
//           position: 'fixed',
//           zIndex: 1001,
//           left: '50%',
//           top: '50%',
//           transform: 'translate(-50%, -50%)',
//           backgroundColor: 'white',
//           padding: '20px',
//           border: '1px solid #ccc',
//           borderRadius: '5px',
//           boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
//           width: '80%',
//           maxWidth: '600px'
//         }}>
//           <span 
//             style={{ float: 'right', fontSize: '20px', cursor: 'pointer' }}
//             onClick={() => setShowVideoModal(false)}
//           >
//             &times;
//           </span>
//           <h3>{videoTitle}</h3>
//           <video 
//             width="100%" 
//             controls
//             autoPlay
//             onEnded={() => setShowVideoModal(false)}
//           >
//             <source src={videoUrl} type="video/mp4" />
//             Your browser does not support the video tag.
//           </video>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CesiumViewer;

import SmartCityDashboard from './components/SmartCityDashboard';

function App() {
  return <SmartCityDashboard />;
}

export default App;
