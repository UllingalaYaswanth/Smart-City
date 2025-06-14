// // import React, { useEffect, useRef, useState, useCallback } from 'react';
// // import * as Cesium from 'cesium';
// // import 'cesium/Build/Cesium/Widgets/widgets.css';

// // // Set base URL for Cesium assets
// // window.CESIUM_BASE_URL = '/node_modules/cesium/Build/Cesium/';

// // const Maps = () => {
// //   const cesiumContainer = useRef(null);
// //   const viewerRef = useRef(null);
// //   const tilesetRef = useRef(null);
// //   const geoJsonDataSourceRef = useRef(null);
// //   const buildingLabelsRef = useRef([]);
// //   const [status, setStatus] = useState('Click on the map to add an anchor point.');
// //   const [showVideoModal, setShowVideoModal] = useState(false);
// //   const [videoUrl, setVideoUrl] = useState('');
// //   const [videoTitle, setVideoTitle] = useState('');
// //   const [isLoading, setIsLoading] = useState(true);
// //   const zoomThreshold = 500;

// //   // Memoized terrain creation to prevent recreation on rerenders
// //   const createTerrain = useCallback(async () => {
// //     return await Cesium.createWorldTerrainAsync({
// //       requestWaterMask: true,
// //       requestVertexNormals: true
// //     });
// //   }, []);

// //   // Initialize viewer and load data
// //   useEffect(() => {
// //     let isMounted = true;
// //     const initViewer = async () => {
// //       try {
// //         Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YjhlMmVkNC1hYWVjLTQxYWEtOGZhYS1iOGQyNDUxY2ZlMTUiLCJpZCI6MjY0Nzg3LCJpYXQiOjE3MzUxMTAzMzV9.tdJk1ppDaw9AEy9bFB6RBU9T3H0-xOlIqVlrjDBJGQo";
        
// //         // Initialize subsystems in parallel
// //         await Promise.all([
// //           Cesium.Ion.defaultAccessToken,
// //           Cesium.ApproximateTerrainHeights.initialize()
// //         ]);

// //         const terrainProvider = await createTerrain();

// //         if (!isMounted) return;

// //         // Configure viewer with optimized settings
// //         viewerRef.current = new Cesium.Viewer(cesiumContainer.current, {
// //           terrainProvider,
// //           timeline: false,
// //           animation: false,
// //           baseLayerPicker: true, // Disable for better performance
// //           sceneMode: Cesium.SceneMode.SCENE3D,
// //           shouldAnimate: true,
// //           imageryProvider: new Cesium.IonImageryProvider({ assetId: 3845 }), // Default Cesium World Imagery
// //           creditContainer: document.createElement('div'),
// //           scene3DOnly: true, // Improve performance
// //           orderIndependentTranslucency: false, // Improve performance
// //           shadows: false // Improve performance
// //         });

// //         // Disable features we don't need for better performance
// //         viewerRef.current.scene.globe.showGroundAtmosphere = false;
// //         viewerRef.current.scene.fog.enabled = false;
// //         viewerRef.current.scene.skyAtmosphere.show = false;

// //         // Load data in parallel
// //         await Promise.all([
// //           load3DTileset(),
// //           loadGeoJsonData()
// //         ]);

// //         if (isMounted) {
// //           setIsLoading(false);
// //         }
// //       } catch (error) {
// //         console.error('Error initializing Cesium:', error);
// //         if (isMounted) {
// //           setStatus('Failed to initialize map');
// //           setIsLoading(false);
// //         }
// //       }
// //     };

// //     initViewer();

// //     return () => {
// //       isMounted = false;
// //       if (viewerRef.current && !viewerRef.current.isDestroyed()) {
// //         viewerRef.current.destroy();
// //       }
// //     };
// //   }, [createTerrain]);

// //   const load3DTileset = async () => {
// //     try {
// //       const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(3048665, {
// //         show: false // Start with tileset hidden for better performance
// //       });
      
// //       // Optimize tileset performance
// //       tileset.maximumScreenSpaceError = 2; // Lower quality for better performance
// //       tileset.dynamicScreenSpaceError = true;
// //       tileset.dynamicScreenSpaceErrorDensity = 0.00278;
// //       tileset.dynamicScreenSpaceErrorFactor = 4.0;
// //       tileset.dynamicScreenSpaceErrorHeightFalloff = 0.25;
      
// //       viewerRef.current.scene.primitives.add(tileset);
// //       tilesetRef.current = tileset;

// //       // Apply default style if available
// //       const extras = tileset.asset.extras;
// //       if (extras?.ion?.defaultStyle) {
// //         tileset.style = new Cesium.Cesium3TileStyle(extras.ion.defaultStyle);
// //       }

// //       await viewerRef.current.zoomTo(tileset);
// //     } catch (error) {
// //       console.error('Error loading 3D tileset:', error);
// //       viewerRef.current.entities.add({
// //         position: Cesium.Cartesian3.fromDegrees(0, 0),
// //         label: {
// //           text: 'Failed to load 3D tileset',
// //           font: '20px sans-serif',
// //           fillColor: Cesium.Color.RED
// //         }
// //       });
// //     }
// //   };

// //   const loadGeoJsonData = async () => {
// //     try {
// //       // Fetch from backend API instead of direct file URL
// //       const response = await fetch('http://localhost:8081/api/geojson');
// //       if (!response.ok) {
// //         throw new Error(`HTTP error! status: ${response.status}`);
// //       }
// //       const geojsonData = await response.json();
// //       console.log("geojon data",geojsonData)
// //       const dataSource = await Cesium.GeoJsonDataSource.load(geojsonData, {
// //         clampToGround: false,
// //         stroke: Cesium.Color.BLUE,
// //         fill: Cesium.Color.BLUE.withAlpha(0.5),
// //         strokeWidth: 3
// //       });

// //       geoJsonDataSourceRef.current = dataSource;
// //       viewerRef.current.dataSources.add(dataSource);

// //       // Process entities
// //       const entities = dataSource.entities.values;
// //       const buildingLabels = [];

// //       entities.forEach(entity => {
// //         if (entity.polygon) {
// //           const buildingName = entity.properties['@id'] || 'Unknown Building';
// //           const positions = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;
// //           const center = Cesium.Cartesian3.fromDegrees(
// //             Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(positions[0]).longitude),
// //             Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(positions[0]).latitude),
// //             0
// //           );

// //           const labelEntity = viewerRef.current.entities.add({
// //             position: center,
// //             label: {
// //               text: buildingName,
// //               font: '14px sans-serif',
// //               fillColor: Cesium.Color.WHITE,
// //               scale: 1.5,
// //               pixelOffset: new Cesium.Cartesian2(0, -30),
// //               show: false
// //             }
// //           });

// //           buildingLabels.push(labelEntity);

// //           const height = entity.properties.height ? entity.properties.height.getValue() : 10;
// //           entity.polygon.extrudedHeight = height;
// //           entity.polygon.material = Cesium.Color.BLUE.withAlpha(0.6);
// //           entity.polygon.outline = true;
// //           entity.polygon.outlineColor = Cesium.Color.BLUE;
// //         }

// //         if (entity.position && entity.properties.video) {
// //           const videoUrl = entity.properties.video;
// //           entity.description = `
// //             <h3>${entity.properties['@id']}</h3>
// //             <video width="320" height="240" controls>
// //               <source src="${videoUrl}" type="video/mp4">
// //               Your browser does not support the video tag.
// //             </video>
// //           `;
// //         }
// //       });

// //       buildingLabelsRef.current = buildingLabels;
// //       setupZoomListener();
// //       await viewerRef.current.zoomTo(dataSource);
// //     } catch (error) {
// //       console.error('Error loading GeoJSON:', error);
// //       // Show error message on the map
// //       viewerRef.current.entities.add({
// //         position: Cesium.Cartesian3.fromDegrees(0, 0),
// //         label: {
// //           text: 'Failed to load GeoJSON data',
// //           font: '20px sans-serif',
// //           fillColor: Cesium.Color.RED
// //         }
// //       });
// //     }
// //   };

// //   const setupZoomListener = useCallback(() => {
// //     const checkZoomLevel = () => {
// //       if (!viewerRef.current) return;
// //       const cameraHeight = viewerRef.current.camera.positionCartographic.height;
// //       buildingLabelsRef.current.forEach(labelEntity => {
// //         labelEntity.label.show = cameraHeight < zoomThreshold;
// //       });
// //     };

// //     viewerRef.current.camera.changed.addEventListener(checkZoomLevel);
// //     checkZoomLevel();
// //   }, []);

// //   const toggleTileset = useCallback(() => {
// //     if (tilesetRef.current) {
// //       tilesetRef.current.show = !tilesetRef.current.show;
// //       setStatus(`3D Tileset is now ${tilesetRef.current.show ? 'visible' : 'hidden'}`);
// //     }
// //   }, []);

// //   const toggleGeoJson = useCallback(() => {
// //     if (geoJsonDataSourceRef.current) {
// //       geoJsonDataSourceRef.current.show = !geoJsonDataSourceRef.current.show;
// //       setStatus(`GeoJSON data is now ${geoJsonDataSourceRef.current.show ? 'visible' : 'hidden'}`);
// //     }
// //   }, []);

// //   const handleMapClick = useCallback(async (movement) => {
// //     if (!viewerRef.current) return;

// //     const pickedObject = viewerRef.current.scene.pick(movement.position);
// //     if (pickedObject && pickedObject.id && pickedObject.id.properties) {
// //       // Handle click on existing feature
// //       if (pickedObject.id.properties.video) {
// //         const videoUrl = pickedObject.id.properties.video.getValue();
// //         const videoTitle = pickedObject.id.properties['@id'].getValue();
// //         setVideoUrl(videoUrl);
// //         setVideoTitle(videoTitle);
// //         setShowVideoModal(true);
// //       }
// //       return;
// //     }

// //     // Handle adding new anchor point
// //     const ray = viewerRef.current.camera.getPickRay(movement.position);
// //     const position = viewerRef.current.scene.globe.pick(ray, viewerRef.current.scene);
// //     if (!position) return;

// //     try {
// //       const cartographic = Cesium.Cartographic.fromCartesian(position);
// //       const [updatedCartographic] = await Cesium.sampleTerrainMostDetailed(
// //         viewerRef.current.terrainProvider, 
// //         [cartographic]
// //       );

// //       const longitude = Cesium.Math.toDegrees(updatedCartographic.longitude);
// //       const latitude = Cesium.Math.toDegrees(updatedCartographic.latitude);

// //       const anchorName = window.prompt("Enter a name for the anchor point:");
// //       if (!anchorName) return;

// //       const videoUrl = window.prompt("Enter a video URL (optional):");

// //       // Create new feature
// //       const newFeature = {
// //         type: "Feature",
// //         properties: {
// //           "@id": anchorName,
// //           video: videoUrl || null
// //         },
// //         geometry: {
// //           type: "Point",
// //           coordinates: [longitude, latitude]
// //         }
// //       };

// //       // First add to viewer
// //       const dataSource = await Cesium.GeoJsonDataSource.load(newFeature, {
// //         clampToGround: true,
// //         markerColor: Cesium.Color.RED,
// //         markerSymbol: '?'
// //       });
      
// //       viewerRef.current.dataSources.add(dataSource);
// //       await viewerRef.current.zoomTo(dataSource);
      
// //       // Then update backend
// //       try {
// //         const response = await fetch('http://localhost:8081/api/geojson', {
// //           method: 'POST',
// //           headers: {
// //             'Content-Type': 'application/json',
// //           },
// //           body: JSON.stringify({
// //             type: "FeatureCollection",
// //             features: [...geoJsonDataSourceRef.current.entities.values.map(e => ({
// //               type: "Feature",
// //               properties: e.properties.getValue(),
// //               geometry: e.position ? {
// //                 type: "Point",
// //                 coordinates: [
// //                   Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(e.position.getValue()).longitude),
// //                   Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(e.position.getValue()).latitude)
// //                 ]
// //               } : null
// //             })), newFeature]
// //           })
// //         });

// //         if (!response.ok) {
// //           throw new Error('Failed to update backend');
// //         }

// //         // Reload data to ensure consistency
// //         await loadGeoJsonData();
// //         setStatus(`Added new anchor point: ${anchorName}`);
// //       } catch (error) {
// //         console.error("Error updating backend:", error);
// //         setStatus('Added point locally but failed to save to backend');
// //       }
// //     } catch (error) {
// //       console.error("Error adding anchor point:", error);
// //       setStatus('Failed to add anchor point');
// //     }
// //   }, []);

// //   // Setup click handler after viewer is initialized
// //   useEffect(() => {
// //     if (!viewerRef.current || isLoading) return;

// //     const handler = new Cesium.ScreenSpaceEventHandler(viewerRef.current.canvas);
// //     handler.setInputAction(handleMapClick, Cesium.ScreenSpaceEventType.LEFT_CLICK);

// //     return () => {
// //       handler.destroy();
// //     };
// //   }, [isLoading, handleMapClick]);

// //   return (
// //     <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
// //       <div 
// //         ref={cesiumContainer} 
// //         style={{ 
// //           width: '100%', 
// //           height: '100%',
// //           position: 'absolute',
// //           top: 0,
// //           left: 0
// //         }} 
// //       />
      
// //       {isLoading && (
// //         <div style={{
// //           position: 'absolute',
// //           top: 0,
// //           left: 0,
// //           width: '100%',
// //           height: '100%',
// //           display: 'flex',
// //           justifyContent: 'center',
// //           alignItems: 'center',
// //           backgroundColor: 'rgba(0,0,0,0.7)',
// //           zIndex: 999
// //         }}>
// //           <div style={{ color: 'white', fontSize: '20px' }}>Loading map...</div>
// //         </div>
// //       )}
      
// //       {/* Controls */}
// //       <div style={{
// //         position: 'absolute',
// //         top: '10px',
// //         left: '10px',
// //         zIndex: 1000,
// //         background: 'rgba(255, 255, 255, 0.8)',
// //         padding: '10px',
// //         borderRadius: '5px'
// //       }}>
// //         <button onClick={() => setStatus('Click on the map to add an anchor point')}>
// //           Add Anchor
// //         </button>
// //         <p>{status}</p>
// //       </div>
      
// //       {/* Toggle buttons */}
// //       <div style={{
// //         position: 'absolute',
// //         top: '60px',
// //         right: '10px',
// //         zIndex: 1000,
// //         display: 'flex',
// //         gap: '10px'
// //       }}>
// //         <button 
// //           onClick={toggleTileset}
// //           style={{
// //             backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //             color: 'white',
// //             padding: '10px',
// //             border: 'none',
// //             borderRadius: '5px',
// //             cursor: 'pointer'
// //           }}
// //         >
// //           Toggle 3D Tileset
// //         </button>
// //         <button 
// //           onClick={toggleGeoJson}
// //           style={{
// //             backgroundColor: 'rgba(0, 0, 0, 0.7)',
// //             color: 'white',
// //             padding: '10px',
// //             border: 'none',
// //             borderRadius: '5px',
// //             cursor: 'pointer'
// //           }}
// //         >
// //           Toggle GeoJSON
// //         </button>
// //       </div>
      
// //       {/* Video Modal */}
// //       {showVideoModal && (
// //         <div style={{
// //           position: 'fixed',
// //           zIndex: 1001,
// //           left: '50%',
// //           top: '50%',
// //           transform: 'translate(-50%, -50%)',
// //           backgroundColor: 'white',
// //           padding: '20px',
// //           border: '1px solid #ccc',
// //           borderRadius: '5px',
// //           boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
// //           width: '80%',
// //           maxWidth: '600px'
// //         }}>
// //           <span 
// //             style={{ float: 'right', fontSize: '20px', cursor: 'pointer' }}
// //             onClick={() => setShowVideoModal(false)}
// //           >
// //             &times;
// //           </span>
// //           <h3>{videoTitle}</h3>
// //           <video 
// //             width="100%" 
// //             controls
// //             autoPlay
// //             onEnded={() => setShowVideoModal(false)}
// //           >
// //             <source src={videoUrl} type="video/mp4" />
// //             Your browser does not support the video tag.
// //           </video>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default Maps;

// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import * as Cesium from 'cesium';
// import 'cesium/Build/Cesium/Widgets/widgets.css';

// // Set base URL for Cesium assets
// window.CESIUM_BASE_URL = '/node_modules/cesium/Build/Cesium/';

// const Maps = () => {
//   const cesiumContainer = useRef(null);
//   const viewerRef = useRef(null);
//   const tilesetRef = useRef(null);
//   const geoJsonDataSourceRef = useRef(null);
//   const heatmapDataSourceRef = useRef(null);
//   const buildingLabelsRef = useRef([]);
//   const [status, setStatus] = useState('Click on the map to add an anchor point.');
//   const [showVideoModal, setShowVideoModal] = useState(false);
//   const [videoUrl, setVideoUrl] = useState('');
//   const [videoTitle, setVideoTitle] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [showHeatmap, setShowHeatmap] = useState(false);
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
//           loadGeoJsonData(),
//           loadHeatmapData()
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
//       // Fetch from backend API instead of direct file URL
//       const response = await fetch('http://localhost:8081/api/geojson');
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const geojsonData = await response.json();
//       console.log("geojon data",geojsonData)
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
//       // Show error message on the map
//       viewerRef.current.entities.add({
//         position: Cesium.Cartesian3.fromDegrees(0, 0),
//         label: {
//           text: 'Failed to load GeoJSON data',
//           font: '20px sans-serif',
//           fillColor: Cesium.Color.RED
//         }
//       });
//     }
//   };

//   // Load heatmap data based on crowd density
//   const loadHeatmapData = async () => {
//     try {
//       // Fetch crowd data from backend
//       const response = await fetch('http://localhost:8081/api/crowd-data');
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const crowdData = await response.json();
      
//       // Create a new data source for heatmap
//       const heatmapDataSource = new Cesium.CustomDataSource('heatmap');
      
//       // Process each camera point with crowd data
//       crowdData.forEach(camera => {
//         const { longitude, latitude, crowdCount } = camera;
        
//         // Calculate heatmap color based on crowd count
//         const intensity = Math.min(crowdCount / 100, 1); // Normalize to 0-1 range
//         const color = Cesium.Color.fromHsl(
//           (1 - intensity) * 0.6, // Hue (blue to red)
//           1, // Saturation
//           0.5 + intensity * 0.5, // Lightness
//           0.7 // Alpha
//         );
        
//         // Create a point for the heatmap
//         heatmapDataSource.entities.add({
//           position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
//           point: {
//             pixelSize: 20 + intensity * 30, // Bigger for more crowd
//             color: color,
//             outlineColor: Cesium.Color.WHITE.withAlpha(0.3),
//             outlineWidth: 1,
//             show: showHeatmap
//           },
//           properties: {
//             crowdCount: crowdCount,
//             cameraId: camera.id
//           }
//         });
        
//         // Optionally add a label showing the count
//         if (crowdCount > 50) {
//           heatmapDataSource.entities.add({
//             position: Cesium.Cartesian3.fromDegrees(longitude, latitude, 10),
//             label: {
//               text: crowdCount.toString(),
//               font: '12px sans-serif',
//               fillColor: Cesium.Color.WHITE,
//               outlineColor: Cesium.Color.BLACK,
//               outlineWidth: 2,
//               style: Cesium.LabelStyle.FILL_AND_OUTLINE,
//               verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
//               pixelOffset: new Cesium.Cartesian2(0, -10),
//               show: showHeatmap && viewerRef.current?.camera.positionCartographic.height < 1000
//             }
//           });
//         }
//       });
      
//       // Add to viewer
//       viewerRef.current.dataSources.add(heatmapDataSource);
//       heatmapDataSourceRef.current = heatmapDataSource;
      
//     } catch (error) {
//       console.error('Error loading heatmap data:', error);
//       viewerRef.current.entities.add({
//         position: Cesium.Cartesian3.fromDegrees(0, 0),
//         label: {
//           text: 'Failed to load crowd heatmap',
//           font: '20px sans-serif',
//           fillColor: Cesium.Color.RED
//         }
//       });
//     }
//   };

//   const toggleHeatmap = useCallback(async () => {
//     const newShowState = !showHeatmap;
//     setShowHeatmap(newShowState);
    
//     if (heatmapDataSourceRef.current) {
//       heatmapDataSourceRef.current.entities.values.forEach(entity => {
//         if (entity.point) entity.point.show = newShowState;
//         if (entity.label) entity.label.show = newShowState;
//       });
//     } else {
//       // Load data if not already loaded
//       await loadHeatmapData();
//     }
    
//     setStatus(`Heatmap is now ${newShowState ? 'visible' : 'hidden'}`);
//   }, [showHeatmap]);

//   const setupZoomListener = useCallback(() => {
//     const checkZoomLevel = () => {
//       if (!viewerRef.current) return;
//       const cameraHeight = viewerRef.current.camera.positionCartographic.height;
//       buildingLabelsRef.current.forEach(labelEntity => {
//         labelEntity.label.show = cameraHeight < zoomThreshold;
//       });
      
//       // Update heatmap labels visibility
//       if (heatmapDataSourceRef.current) {
//         heatmapDataSourceRef.current.entities.values.forEach(entity => {
//           if (entity.label) {
//             entity.label.show = showHeatmap && cameraHeight < 1000;
//           }
//         });
//       }
//     };

//     viewerRef.current.camera.changed.addEventListener(checkZoomLevel);
//     checkZoomLevel();
//   }, [showHeatmap]);

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

//       // Create new feature
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

//       // First add to viewer
//       const dataSource = await Cesium.GeoJsonDataSource.load(newFeature, {
//         clampToGround: true,
//         markerColor: Cesium.Color.RED,
//         markerSymbol: '?'
//       });
      
//       viewerRef.current.dataSources.add(dataSource);
//       await viewerRef.current.zoomTo(dataSource);
      
//       // Then update backend
//       try {
//         const response = await fetch('http://localhost:8081/api/geojson', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             type: "FeatureCollection",
//             features: [...geoJsonDataSourceRef.current.entities.values.map(e => ({
//               type: "Feature",
//               properties: e.properties.getValue(),
//               geometry: e.position ? {
//                 type: "Point",
//                 coordinates: [
//                   Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(e.position.getValue()).longitude),
//                   Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(e.position.getValue()).latitude)
//                 ]
//               } : null
//             })), newFeature]
//           })
//         });

//         if (!response.ok) {
//           throw new Error('Failed to update backend');
//         }

//         // Reload data to ensure consistency
//         await loadGeoJsonData();
//         setStatus(`Added new anchor point: ${anchorName}`);
//       } catch (error) {
//         console.error("Error updating backend:", error);
//         setStatus('Added point locally but failed to save to backend');
//       }
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
//         top: '60px',
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
//         <button 
//           onClick={toggleHeatmap}
//           style={{
//             backgroundColor: showHeatmap ? 'rgba(255, 100, 0, 0.9)' : 'rgba(0, 0, 0, 0.7)',
//             color: 'white',
//             padding: '10px',
//             border: 'none',
//             borderRadius: '5px',
//             cursor: 'pointer'
//           }}
//         >
//           {showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}
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

// export default Maps;



// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import * as Cesium from 'cesium';
// import 'cesium/Build/Cesium/Widgets/widgets.css';

// // Set base URL for Cesium assets
// window.CESIUM_BASE_URL = '/node_modules/cesium/Build/Cesium/';

// const Maps = () => {
//   const cesiumContainer = useRef(null);
//   const viewerRef = useRef(null);
//   const tilesetRef = useRef(null);
//   const geoJsonDataSourceRef = useRef(null);
//   const vehiclesRef = useRef([]);
//   const [status, setStatus] = useState('Loading map...');
//   const [showVideoModal, setShowVideoModal] = useState(false);
//   const [videoUrl, setVideoUrl] = useState('');
//   const [videoTitle, setVideoTitle] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [vehicleCount, setVehicleCount] = useState(20);
//   const [showRoads, setShowRoads] = useState(false);
//   const zoomThreshold = 500;

//   // Initialize Cesium viewer
//   const initViewer = useCallback(async () => {
//     try {
//       Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YjhlMmVkNC1hYWVjLTQxYWEtOGZhYS1iOGQyNDUxY2ZlMTUiLCJpZCI6MjY0Nzg3LCJpYXQiOjE3MzUxMTAzMzV9.tdJk1ppDaw9AEy9bFB6RBU9T3H0-xOlIqVlrjDBJGQo";
      
//       await Promise.all([
//         Cesium.Ion.defaultAccessToken,
//         Cesium.ApproximateTerrainHeights.initialize()
//       ]);

//       const terrainProvider = await Cesium.createWorldTerrainAsync({
//         requestWaterMask: true,
//         requestVertexNormals: true
//       });

//       viewerRef.current = new Cesium.Viewer(cesiumContainer.current, {
//         terrainProvider,
//         timeline: false,
//         animation: false,
//         baseLayerPicker: false,
//         sceneMode: Cesium.SceneMode.SCENE3D,
//         shouldAnimate: true,
//         imageryProvider: new Cesium.IonImageryProvider({ assetId: 3845 }),
//         creditContainer: document.createElement('div'),
//         scene3DOnly: true,
//         orderIndependentTranslucency: false,
//         shadows: false
//       });

//       viewerRef.current.scene.globe.showGroundAtmosphere = false;
//       viewerRef.current.scene.fog.enabled = false;
//       viewerRef.current.scene.skyAtmosphere.show = false;

//       await Promise.all([
//         load3DTileset(),
//         loadGeoJsonData()
//       ]);

//       setIsLoading(false);
//       setStatus('Click on the map to add an anchor point.');
//     } catch (error) {
//       console.error('Error initializing Cesium:', error);
//       setStatus('Failed to initialize map');
//       setIsLoading(false);
//     }
//   }, []);

//   // Load 3D tileset
//   const load3DTileset = async () => {
//     try {
//       const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(3048665, {
//         show: true,
//         maximumScreenSpaceError: 2
//       });
      
//       viewerRef.current.scene.primitives.add(tileset);
//       tilesetRef.current = tileset;
//       await viewerRef.current.zoomTo(tileset);
//     } catch (error) {
//       console.error('Error loading 3D tileset:', error);
//     }
//   };

//   // Load GeoJSON data
//   const loadGeoJsonData = async () => {
//     try {
//       const response = await fetch('http://localhost:8081/api/geojson');
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
//       const geojsonData = await response.json();
//       const dataSource = await Cesium.GeoJsonDataSource.load(geojsonData, {
//         clampToGround: true,
//         stroke: Cesium.Color.BLUE,
//         fill: Cesium.Color.BLUE.withAlpha(0.5),
//         strokeWidth: 3
//       });

//       geoJsonDataSourceRef.current = dataSource;
//       viewerRef.current.dataSources.add(dataSource);
//       await viewerRef.current.zoomTo(dataSource);
//     } catch (error) {
//       console.error('Error loading GeoJSON:', error);
//     }
//   };

//   // Calculate polygon perimeter
//   const calculatePolygonPerimeter = (positions) => {
//     let perimeter = 0;
//     for (let i = 0; i < positions.length; i++) {
//       const nextIndex = (i + 1) % positions.length;
//       perimeter += Cesium.Cartesian3.distance(positions[i], positions[nextIndex]);
//     }
//     return perimeter;
//   };

//   // Extract paths from polygon features
//   const extractPathsFromPolygons = useCallback(() => {
//     if (!geoJsonDataSourceRef.current) return [];
    
//     const paths = [];
//     const entities = geoJsonDataSourceRef.current.entities.values;

//     entities.forEach(entity => {
//       if (entity.polygon && !entity.properties?.building) {
//         const hierarchy = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now());
//         const positions = hierarchy.positions;
        
//         if (positions.length < 2) return;
        
//         const polygonArea = Cesium.PolygonGeometry.computeArea(positions);
//         const polygonLength = calculatePolygonPerimeter(positions);
//         const lengthToWidthRatio = polygonLength / Math.sqrt(polygonArea);
        
//         if (lengthToWidthRatio > 4) {
//           const path = [];
//           for (let i = 0; i < positions.length; i++) {
//             path.push(positions[i]);
//             if (i < positions.length - 1) {
//               const midPoint = new Cesium.Cartesian3();
//               Cesium.Cartesian3.lerp(positions[i], positions[(i + 1) % positions.length], 0.5, midPoint);
//               path.push(midPoint);
//             }
//           }
          
//           paths.push({
//             positions: path,
//             isClosed: true,
//             originalEntity: entity
//           });
//         }
//       }
//     });

//     return paths;
//   }, []);

//   // Generate vehicles
//   const generateVehicles = useCallback(() => {
//     if (!viewerRef.current) return;

//     vehiclesRef.current.forEach(vehicle => {
//       viewerRef.current.entities.remove(vehicle.entity);
//     });
//     vehiclesRef.current = [];

//     const roadPaths = extractPathsFromPolygons();
//     if (roadPaths.length === 0) {
//       console.warn("No suitable road paths found");
//       return;
//     }

//     for (let i = 0; i < vehicleCount; i++) {
//       const path = roadPaths[Math.floor(Math.random() * roadPaths.length)];
//       const type = ['car', 'bus', 'truck'][Math.floor(Math.random() * 3)];
//       const color = Cesium.Color.fromRandom({
//         red: [0.1, 0.8],
//         green: [0.1, 0.8],
//         blue: [0.1, 0.8],
//         alpha: 1.0
//       });

//       const vehicle = viewerRef.current.entities.add({
//         name: `${type}-${i}`,
//         position: new Cesium.CallbackProperty(() => {
//           return vehiclesRef.current[i]?.currentPosition || path.positions[0];
//         }, false),
//         model: {
//           uri: `/models/${type}.glb`,
//           minimumPixelSize: 32,
//           maximumScale: 64,
//           color: color,
//           silhouetteColor: color.withAlpha(0.5),
//           silhouetteSize: 1
//         },
//         orientation: new Cesium.CallbackProperty(() => {
//           const vehicleData = vehiclesRef.current[i];
//           if (!vehicleData?.direction) return Cesium.Quaternion.IDENTITY;
//           return Cesium.Quaternion.fromHeadingPitchRoll(
//             new Cesium.HeadingPitchRoll(
//               Math.atan2(vehicleData.direction.y, vehicleData.direction.x),
//               0,
//               0
//             )
//           );
//         }, false),
//         path: {
//           show: showRoads,
//           width: 2,
//           material: new Cesium.PolylineGlowMaterialProperty({
//             glowPower: 0.1,
//             color: color.withAlpha(0.3)
//           }),
//           positions: new Cesium.CallbackProperty(() => path.positions, false)
//         }
//       });

//       const startIndex = Math.floor(Math.random() * path.positions.length);
//       vehiclesRef.current.push({
//         entity: vehicle,
//         path: path.positions,
//         currentPosition: new Cesium.Cartesian3(),
//         currentIndex: startIndex,
//         direction: new Cesium.Cartesian3(),
//         speed: 0.5 + Math.random() * 2.0,
//         progress: 0,
//         isMovingForward: Math.random() > 0.5
//       });
//       Cesium.Cartesian3.clone(path.positions[startIndex], vehiclesRef.current[i].currentPosition);
//     }
//   }, [vehicleCount, extractPathsFromPolygons, showRoads]);

//   // Move vehicles along paths
//   const moveVehicles = useCallback(() => {
//     if (!viewerRef.current) return;

//     vehiclesRef.current.forEach((vehicle, index) => {
//       if (!vehicle.path || vehicle.path.length < 2) return;

//       let nextIndex;
//       if (vehicle.isMovingForward) {
//         nextIndex = (vehicle.currentIndex + 1) % vehicle.path.length;
//       } else {
//         nextIndex = (vehicle.currentIndex - 1 + vehicle.path.length) % vehicle.path.length;
//       }

//       const currentPos = vehicle.path[vehicle.currentIndex];
//       const nextPos = vehicle.path[nextIndex];

//       Cesium.Cartesian3.subtract(nextPos, currentPos, vehicle.direction);
//       Cesium.Cartesian3.normalize(vehicle.direction, vehicle.direction);

//       vehicle.progress += 0.01 * vehicle.speed;
//       Cesium.Cartesian3.lerp(
//         currentPos,
//         nextPos,
//         vehicle.progress,
//         vehicle.currentPosition
//       );

//       if (vehicle.progress >= 1.0) {
//         vehicle.currentIndex = nextIndex;
//         vehicle.progress = 0;
        
//         if ((vehicle.currentIndex === 0 || 
//              vehicle.currentIndex === vehicle.path.length - 1) &&
//             Math.random() < 0.3) {
//           vehicle.isMovingForward = !vehicle.isMovingForward;
//         }
//       }
//     });

//     requestAnimationFrame(moveVehicles);
//   }, []);

//   // Initialize on mount
//   useEffect(() => {
//     initViewer();
//     return () => {
//       if (viewerRef.current && !viewerRef.current.isDestroyed()) {
//         viewerRef.current.destroy();
//       }
//     };
//   }, [initViewer]);

//   // Start vehicle movement when data loads
//   useEffect(() => {
//     if (!isLoading && geoJsonDataSourceRef.current) {
//       generateVehicles();
//       moveVehicles();
//     }
//   }, [isLoading, generateVehicles, moveVehicles]);

//   // Handle map clicks
//   const handleMapClick = useCallback((movement) => {
//     if (!viewerRef.current) return;

//     const pickedObject = viewerRef.current.scene.pick(movement.position);
//     if (pickedObject?.id?.properties?.video) {
//       const videoUrl = pickedObject.id.properties.video;
//       const videoTitle = pickedObject.id.properties['@id'];
//       setVideoUrl(videoUrl);
//       setVideoTitle(videoTitle);
//       setShowVideoModal(true);
//       return;
//     }
//   }, []);

//   // Setup click handler
//   useEffect(() => {
//     if (!viewerRef.current || isLoading) return;

//     const handler = new Cesium.ScreenSpaceEventHandler(viewerRef.current.canvas);
//     handler.setInputAction(handleMapClick, Cesium.ScreenSpaceEventType.LEFT_CLICK);

//     return () => handler.destroy();
//   }, [isLoading, handleMapClick]);

//   return (
//     <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
//       <div ref={cesiumContainer} style={{ width: '100%', height: '100%' }} />
      
//       {isLoading && (
//         <div style={styles.loadingOverlay}>
//           <div style={styles.loadingText}>Loading map...</div>
//         </div>
//       )}
      
//       <div style={styles.controls}>
//         <button onClick={() => setStatus('Click on the map to add an anchor point')}>
//           Add Anchor
//         </button>
//         <p>{status}</p>
//       </div>
      
//       <div style={styles.toggleButtons}>
//         <button onClick={() => setShowRoads(!showRoads)} style={styles.toggleButton}>
//           {showRoads ? 'Hide Roads' : 'Show Roads'}
//         </button>
        
//         <div style={styles.vehicleControls}>
//           <h4>Vehicle Controls</h4>
//           <div style={styles.sliderContainer}>
//             <span>Count:</span>
//             <input 
//               type="range" 
//               min="5" 
//               max="100" 
//               value={vehicleCount}
//               onChange={(e) => setVehicleCount(parseInt(e.target.value))}
//             />
//             <span>{vehicleCount}</span>
//           </div>
//           <button onClick={generateVehicles} style={styles.regenerateButton}>
//             Regenerate Vehicles
//           </button>
//         </div>
//       </div>
      
//       {showVideoModal && (
//         <div style={styles.videoModal}>
//           <span style={styles.closeButton} onClick={() => setShowVideoModal(false)}>
//             &times;
//           </span>
//           <h3>{videoTitle}</h3>
//           <video width="100%" controls autoPlay>
//             <source src={videoUrl} type="video/mp4" />
//           </video>
//         </div>
//       )}
//     </div>
//   );
// };

// const styles = {
//   loadingOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: '100%',
//     height: '100%',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     zIndex: 999
//   },
//   loadingText: {
//     color: 'white',
//     fontSize: '20px'
//   },
//   controls: {
//     position: 'absolute',
//     top: '10px',
//     left: '10px',
//     zIndex: 1000,
//     background: 'rgba(255, 255, 255, 0.8)',
//     padding: '10px',
//     borderRadius: '5px'
//   },
//   toggleButtons: {
//     position: 'absolute',
//     top: '60px',
//     right: '10px',
//     zIndex: 1000,
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '10px'
//   },
//   toggleButton: {
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     color: 'white',
//     padding: '10px',
//     border: 'none',
//     borderRadius: '5px',
//     cursor: 'pointer'
//   },
//   vehicleControls: {
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     padding: '10px',
//     borderRadius: '5px',
//     color: 'white'
//   },
//   sliderContainer: {
//     display: 'flex',
//     gap: '10px',
//     alignItems: 'center',
//     margin: '5px 0'
//   },
//   regenerateButton: {
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     color: 'white',
//     padding: '5px 10px',
//     border: 'none',
//     borderRadius: '3px',
//     cursor: 'pointer',
//     marginTop: '5px',
//     width: '100%'
//   },
//   videoModal: {
//     position: 'fixed',
//     zIndex: 1001,
//     left: '50%',
//     top: '50%',
//     transform: 'translate(-50%, -50%)',
//     backgroundColor: 'white',
//     padding: '20px',
//     border: '1px solid #ccc',
//     borderRadius: '5px',
//     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
//     width: '80%',
//     maxWidth: '600px'
//   },
//   closeButton: {
//     float: 'right',
//     fontSize: '20px',
//     cursor: 'pointer'
//   }
// };

// export default Maps;

// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import * as Cesium from 'cesium';
// import 'cesium/Build/Cesium/Widgets/widgets.css';

// // Set base URL for Cesium assets
// window.CESIUM_BASE_URL = '/node_modules/cesium/Build/Cesium/';

// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   static getDerivedStateFromError(error) {
//     return { hasError: true };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error("ErrorBoundary caught:", error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return <div style={styles.errorFallback}>Map failed to load. Please try refreshing the page.</div>;
//     }
//     return this.props.children;
//   }
// }

// const Maps = () => {
//   const cesiumContainer = useRef(null);
//   const viewerRef = useRef(null);
//   const tilesetRef = useRef(null);
//   const geoJsonDataSourceRef = useRef(null);
//   const vehiclesRef = useRef([]);
//   const [status, setStatus] = useState('Loading map...');
//   const [showVideoModal, setShowVideoModal] = useState(false);
//   const [videoUrl, setVideoUrl] = useState('');
//   const [videoTitle, setVideoTitle] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [vehicleCount, setVehicleCount] = useState(20);
//   const [showRoads, setShowRoads] = useState(false);
//   const zoomThreshold = 500;

//   // Calculate polygon perimeter
//   const calculatePolygonPerimeter = (positions) => {
//     let perimeter = 0;
//     for (let i = 0; i < positions.length; i++) {
//       const nextIndex = (i + 1) % positions.length;
//       perimeter += Cesium.Cartesian3.distance(positions[i], positions[nextIndex]);
//     }
//     return perimeter;
//   };

//   // Calculate polygon area using geodesic approach
//   const calculatePolygonArea = (positions) => {
//     if (positions.length < 3) return 0;
    
//     const cartographics = positions.map(pos => 
//       Cesium.Cartographic.fromCartesian(pos)
//     );
    
//     let area = 0;
//     const ellipsoid = Cesium.Ellipsoid.WGS84;
    
//     for (let i = 0; i < cartographics.length; i++) {
//       const j = (i + 1) % cartographics.length;
//       const p1 = cartographics[i];
//       const p2 = cartographics[j];
      
//       const geodesic = new Cesium.EllipsoidGeodesic(p1, p2);
//       const segmentArea = geodesic.surfaceArea;
//       area += segmentArea;
//     }
    
//     return Math.abs(area);
//   };

//   const createDummyPaths = useCallback(() => {
//     if (!viewerRef.current) return [];
    
//     // Get the current camera position to create paths near the visible area
//     const cameraPosition = viewerRef.current.camera.positionCartographic;
//     const centerLongitude = Cesium.Math.toDegrees(cameraPosition.longitude);
//     const centerLatitude = Cesium.Math.toDegrees(cameraPosition.latitude);
    
//     // Create 4 dummy paths in a grid pattern
//     const dummyPaths = [];
//     const gridSize = 0.002; // Degrees (~200m at equator)
    
//     for (let i = 0; i < 4; i++) {
//       const startLon = centerLongitude + (i % 2) * gridSize;
//       const startLat = centerLatitude + Math.floor(i / 2) * gridSize;
      
//       const positions = [];
//       // Create a straight path with 3 segments
//       for (let j = 0; j < 4; j++) {
//         const lon = startLon + j * gridSize / 3;
//         const lat = startLat;
//         positions.push(
//           Cesium.Cartesian3.fromDegrees(lon, lat)
//         );
//       }
      
//       dummyPaths.push({
//         positions,
//         isClosed: false,
//         originalEntity: null
//       });
//     }
    
//     return dummyPaths;
//   }, []);

//   // Extract paths from polygon features
//   const extractPathsFromPolygons = useCallback(() => {
//     if (!geoJsonDataSourceRef.current || !viewerRef.current) {
//       return createDummyPaths();
//     }
    
//     const paths = [];
//     const entities = geoJsonDataSourceRef.current.entities.values;

//     entities.forEach(entity => {
//       if (entity.polygon && !entity.properties?.building) {
//         try {
//           const hierarchy = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now());
//           const positions = hierarchy.positions;
          
//           if (positions.length < 2) return;
          
//           const polygonArea = calculatePolygonArea(positions);
//           const polygonLength = calculatePolygonPerimeter(positions);
//           const lengthToWidthRatio = polygonLength / Math.sqrt(polygonArea);
          
//           if (lengthToWidthRatio > 4) {
//             const path = [];
//             for (let i = 0; i < positions.length; i++) {
//               path.push(positions[i]);
//               if (i < positions.length - 1) {
//                 const midPoint = new Cesium.Cartesian3();
//                 Cesium.Cartesian3.lerp(
//                   positions[i], 
//                   positions[(i + 1) % positions.length], 
//                   0.5, 
//                   midPoint
//                 );
//                 path.push(midPoint);
//               }
//             }
            
//             paths.push({
//               positions: path,
//               isClosed: true,
//               originalEntity: entity
//             });
//           }
//         } catch (error) {
//           console.error('Error processing polygon:', error);
//         }
//       }
//     });

//     // If no roads found, use dummy paths
//     if (paths.length === 0) {
//       setStatus('No roads detected - using demo paths');
//       return createDummyPaths();
//     }

//     return paths;
//   }, [createDummyPaths]);

//   // Generate vehicles
//   const generateVehicles = useCallback(() => {
//     if (!viewerRef.current) return;

//     // Clear existing vehicles
//     vehiclesRef.current.forEach(vehicle => {
//       viewerRef.current.entities.remove(vehicle.entity);
//     });
//     vehiclesRef.current = [];

//     const roadPaths = extractPathsFromPolygons();
//     if (roadPaths.length === 0) {
//       console.warn("No suitable road paths found");
//       setStatus('No roads detected for vehicle simulation');
//       return;
//     }

//     for (let i = 0; i < vehicleCount; i++) {
//       const path = roadPaths[Math.floor(Math.random() * roadPaths.length)];
//       const type = ['car', 'bus', 'truck'][Math.floor(Math.random() * 3)];
//       const color = Cesium.Color.fromRandom({
//         red: [0.1, 0.8],
//         green: [0.1, 0.8],
//         blue: [0.1, 0.8],
//         alpha: 1.0
//       });

//       // Create position with explicit height (0 for terrain, 10 for above ground)
//       const position = new Cesium.CallbackProperty(() => {
//         const pos = vehiclesRef.current[i]?.currentPosition;
//         if (!pos) return path.positions[0];
        
//         // Clone position and set height to 10 meters above ground
//         const newPos = Cesium.Cartesian3.clone(pos);
//         const cartographic = Cesium.Cartographic.fromCartesian(newPos);
//         cartographic.height = 10; // 10 meters above ground
//         return Cesium.Cartographic.toCartesian(cartographic);
//       }, false);

//       // Create vehicle entity with proper model configuration
//       const vehicle = viewerRef.current.entities.add({
//         name: `${type}-${i}`,
//         position: position,
//         model: {
//           uri: `/models/${type}.glb`,
//           minimumPixelSize: 32,
//           maximumScale: 64,
//           color: color,
//           silhouetteColor: color.withAlpha(0.5),
//           silhouetteSize: 1,
//           heightReference: Cesium.HeightReference.NONE, // Disable terrain clamping
//           runAnimations: false
//         },
//         orientation: new Cesium.CallbackProperty(() => {
//           const vehicleData = vehiclesRef.current[i];
//           if (!vehicleData?.direction) return Cesium.Quaternion.IDENTITY;
          
//           return Cesium.Quaternion.fromHeadingPitchRoll(
//             new Cesium.HeadingPitchRoll(
//               Math.atan2(vehicleData.direction.y, vehicleData.direction.x),
//               0,
//               0
//             )
//           );
//         }, false)
//       });

//       // Initialize movement data
//       const startIndex = Math.floor(Math.random() * path.positions.length);
//       const startPos = path.positions[startIndex];
      
//       // Set initial position with height
//       const cartographic = Cesium.Cartographic.fromCartesian(startPos);
//       cartographic.height = 10; // 10 meters above ground
//       const elevatedPos = Cesium.Cartographic.toCartesian(cartographic);
      
//       vehiclesRef.current.push({
//         entity: vehicle,
//         path: path.positions,
//         currentPosition: elevatedPos,
//         currentIndex: startIndex,
//         direction: new Cesium.Cartesian3(),
//         speed: 0.5 + Math.random() * 2.0,
//         progress: 0,
//         isMovingForward: Math.random() > 0.5
//       });
//     }
//   }, [vehicleCount, extractPathsFromPolygons]);

//   // Updated vehicle movement with proper height handling
//   const moveVehicles = useCallback(() => {
//     if (!viewerRef.current) return;

//     vehiclesRef.current.forEach((vehicle, index) => {
//       if (!vehicle.path || vehicle.path.length < 2) return;

//       let nextIndex;
//       if (vehicle.isMovingForward) {
//         nextIndex = (vehicle.currentIndex + 1) % vehicle.path.length;
//       } else {
//         nextIndex = (vehicle.currentIndex - 1 + vehicle.path.length) % vehicle.path.length;
//       }

//       const currentPos = vehicle.path[vehicle.currentIndex];
//       const nextPos = vehicle.path[nextIndex];

//       Cesium.Cartesian3.subtract(nextPos, currentPos, vehicle.direction);
//       Cesium.Cartesian3.normalize(vehicle.direction, vehicle.direction);

//       vehicle.progress += 0.01 * vehicle.speed;
      
//       // Calculate intermediate position
//       const groundPos = new Cesium.Cartesian3();
//       Cesium.Cartesian3.lerp(
//         currentPos,
//         nextPos,
//         vehicle.progress,
//         groundPos
//       );
      
//       // Set height to 10 meters above ground
//       const cartographic = Cesium.Cartographic.fromCartesian(groundPos);
//       cartographic.height = 10;
//       const elevatedPos = Cesium.Cartographic.toCartesian(cartographic);
      
//       Cesium.Cartesian3.clone(elevatedPos, vehicle.currentPosition);

//       if (vehicle.progress >= 1.0) {
//         vehicle.currentIndex = nextIndex;
//         vehicle.progress = 0;
        
//         if ((vehicle.currentIndex === 0 || 
//              vehicle.currentIndex === vehicle.path.length - 1) &&
//             Math.random() < 0.3) {
//           vehicle.isMovingForward = !vehicle.isMovingForward;
//         }
//       }
//     });

//     requestAnimationFrame(moveVehicles);
//   }, []);

//   // Load 3D tileset
//   const load3DTileset = async () => {
//     try {
//       if (!viewerRef.current) {
//         throw new Error('Viewer not initialized');
//       }

//       const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(3048665, {
//         show: true,
//         maximumScreenSpaceError: 2
//       });
      
//       viewerRef.current.scene.primitives.add(tileset);
//       tilesetRef.current = tileset;
      
//       try {
//         await viewerRef.current.zoomTo(tileset);
//       } catch (zoomError) {
//         console.warn('Could not zoom to tileset:', zoomError);
//       }
//     } catch (error) {
//       console.error('Error loading 3D tileset:', error);
      
//       if (viewerRef.current) {
//         viewerRef.current.entities.add({
//           position: Cesium.Cartesian3.fromDegrees(0, 0),
//           label: {
//             text: '3D Tileset failed to load',
//             font: '20px sans-serif',
//             fillColor: Cesium.Color.RED
//           }
//         });
//       }
//     }
//   };

//   // Load GeoJSON data
//   const loadGeoJsonData = async () => {
//     try {
//       const response = await fetch('http://localhost:8081/api/geojson');
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
//       const geojsonData = await response.json();
//       const dataSource = await Cesium.GeoJsonDataSource.load(geojsonData, {
//         clampToGround: true,
//         stroke: Cesium.Color.BLUE,
//         fill: Cesium.Color.BLUE.withAlpha(0.5),
//         strokeWidth: 3
//       });

//       geoJsonDataSourceRef.current = dataSource;
//       viewerRef.current.dataSources.add(dataSource);
      
//       try {
//         await viewerRef.current.zoomTo(dataSource);
//       } catch (zoomError) {
//         console.warn('Could not zoom to GeoJSON data:', zoomError);
//       }
//     } catch (error) {
//       console.error('Error loading GeoJSON:', error);
      
//       if (viewerRef.current) {
//         viewerRef.current.entities.add({
//           position: Cesium.Cartesian3.fromDegrees(0, 0),
//           label: {
//             text: 'GeoJSON data failed to load',
//             font: '20px sans-serif',
//             fillColor: Cesium.Color.RED
//           }
//         });
//       }
//     }
//   };

//   // Initialize Cesium viewer
//   const initViewer = useCallback(async () => {
//     try {
//       Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YjhlMmVkNC1hYWVjLTQxYWEtOGZhYS1iOGQyNDUxY2ZlMTUiLCJpZCI6MjY0Nzg3LCJpYXQiOjE3MzUxMTAzMzV9.tdJk1ppDaw9AEy9bFB6RBU9T3H0-xOlIqVlrjDBJGQo";
      
//       await Cesium.ApproximateTerrainHeights.initialize();

//       // Create viewer first
//       viewerRef.current = new Cesium.Viewer(cesiumContainer.current, {
//         timeline: false,
//         animation: false,
//         baseLayerPicker: false,
//         sceneMode: Cesium.SceneMode.SCENE3D,
//         shouldAnimate: true,
//         imageryProvider: new Cesium.IonImageryProvider({ assetId: 3845 }),
//         creditContainer: document.createElement('div'),
//         scene3DOnly: true,
//         orderIndependentTranslucency: false,
//         shadows: false
//       });

//       // Then load terrain
//       viewerRef.current.terrainProvider = await Cesium.createWorldTerrainAsync({
//         requestWaterMask: true,
//         requestVertexNormals: true
//       });

//       viewerRef.current.scene.globe.showGroundAtmosphere = false;
//       viewerRef.current.scene.fog.enabled = false;
//       viewerRef.current.scene.skyAtmosphere.show = false;

//       // Load data sequentially
//       await load3DTileset();
//       await loadGeoJsonData();

//       setIsLoading(false);
//       setStatus('Click on the map to add an anchor point.');
//     } catch (error) {
//       console.error('Error initializing Cesium:', error);
//       setStatus('Failed to initialize map');
//       setIsLoading(false);
      
//       if (viewerRef.current) {
//         viewerRef.current.entities.add({
//           position: Cesium.Cartesian3.fromDegrees(0, 0),
//           label: {
//             text: 'Map initialization failed',
//             font: '20px sans-serif',
//             fillColor: Cesium.Color.RED
//           }
//         });
//       }
//     }
//   }, []);

//   // Initialize on mount
//   useEffect(() => {
//     initViewer();
//     return () => {
//       if (viewerRef.current && !viewerRef.current.isDestroyed()) {
//         viewerRef.current.destroy();
//       }
//     };
//   }, [initViewer]);

//   // Start vehicle movement when data loads
//   useEffect(() => {
//     if (!isLoading && geoJsonDataSourceRef.current) {
//       generateVehicles();
//       moveVehicles();
//     }
//   }, [isLoading, generateVehicles, moveVehicles]);

//   // Handle map clicks
//   const handleMapClick = useCallback((movement) => {
//     if (!viewerRef.current) return;

//     const pickedObject = viewerRef.current.scene.pick(movement.position);
//     if (pickedObject?.id?.properties?.video) {
//       const videoUrl = pickedObject.id.properties.video;
//       const videoTitle = pickedObject.id.properties['@id'];
//       setVideoUrl(videoUrl);
//       setVideoTitle(videoTitle);
//       setShowVideoModal(true);
//       return;
//     }
//   }, []);

//   // Setup click handler
//   useEffect(() => {
//     if (!viewerRef.current || isLoading) return;

//     const handler = new Cesium.ScreenSpaceEventHandler(viewerRef.current.canvas);
//     handler.setInputAction(handleMapClick, Cesium.ScreenSpaceEventType.LEFT_CLICK);

//     return () => handler.destroy();
//   }, [isLoading, handleMapClick]);

//   return (
//     <ErrorBoundary>
//       <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
//         <div ref={cesiumContainer} style={{ width: '100%', height: '100%' }} />
        
//         {isLoading && (
//           <div style={styles.loadingOverlay}>
//             <div style={styles.loadingText}>Loading map...</div>
//           </div>
//         )}
        
//         <div style={styles.controls}>
//           <button onClick={() => setStatus('Click on the map to add an anchor point')}>
//             Add Anchor
//           </button>
//           <p>{status}</p>
//         </div>
        
//         <div style={styles.toggleButtons}>
//           <button 
//             onClick={() => setShowRoads(!showRoads)} 
//             style={styles.toggleButton(showRoads)}
//           >
//             {showRoads ? 'Hide Roads' : 'Show Roads'}
//           </button>
          
//           <div style={styles.vehicleControls}>
//             <h4>Vehicle Controls</h4>
//             <div style={styles.sliderContainer}>
//               <span>Count:</span>
//               <input 
//                 type="range" 
//                 min="5" 
//                 max="100" 
//                 value={vehicleCount}
//                 onChange={(e) => setVehicleCount(parseInt(e.target.value))}
//               />
//               <span>{vehicleCount}</span>
//             </div>
//             <button 
//               onClick={generateVehicles} 
//               style={styles.regenerateButton}
//             >
//               Regenerate Vehicles
//             </button>
//           </div>
//         </div>
        
//         {showVideoModal && (
//           <div style={styles.videoModal}>
//             <span 
//               style={styles.closeButton} 
//               onClick={() => setShowVideoModal(false)}
//             >
//               &times;
//             </span>
//             <h3>{videoTitle}</h3>
//             <video 
//               width="100%" 
//               controls 
//               autoPlay
//               onEnded={() => setShowVideoModal(false)}
//             >
//               <source src={videoUrl} type="video/mp4" />
//               Your browser does not support the video tag.
//             </video>
//           </div>
//         )}
//       </div>
//     </ErrorBoundary>
//   );
// };

// const styles = {
//   errorFallback: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     backgroundColor: 'rgba(255, 0, 0, 0.2)',
//     padding: '20px',
//     borderRadius: '5px',
//     border: '1px solid red',
//     color: 'red',
//     fontSize: '18px',
//     textAlign: 'center'
//   },
//   loadingOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: '100%',
//     height: '100%',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     zIndex: 999
//   },
//   loadingText: {
//     color: 'white',
//     fontSize: '20px'
//   },
//   controls: {
//     position: 'absolute',
//     top: '10px',
//     left: '10px',
//     zIndex: 1000,
//     background: 'rgba(255, 255, 255, 0.8)',
//     padding: '10px',
//     borderRadius: '5px'
//   },
//   toggleButtons: {
//     position: 'absolute',
//     top: '60px',
//     right: '10px',
//     zIndex: 1000,
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '10px'
//   },
//   toggleButton: (active) => ({
//     backgroundColor: active ? 'rgba(255, 100, 0, 0.9)' : 'rgba(0, 0, 0, 0.7)',
//     color: 'white',
//     padding: '10px',
//     border: 'none',
//     borderRadius: '5px',
//     cursor: 'pointer'
//   }),
//   vehicleControls: {
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     padding: '10px',
//     borderRadius: '5px',
//     color: 'white'
//   },
//   sliderContainer: {
//     display: 'flex',
//     gap: '10px',
//     alignItems: 'center',
//     margin: '5px 0'
//   },
//   regenerateButton: {
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     color: 'white',
//     padding: '5px 10px',
//     border: 'none',
//     borderRadius: '3px',
//     cursor: 'pointer',
//     marginTop: '5px',
//     width: '100%'
//   },
//   videoModal: {
//     position: 'fixed',
//     zIndex: 1001,
//     left: '50%',
//     top: '50%',
//     transform: 'translate(-50%, -50%)',
//     backgroundColor: 'white',
//     padding: '20px',
//     border: '1px solid #ccc',
//     borderRadius: '5px',
//     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
//     width: '80%',
//     maxWidth: '600px'
//   },
//   closeButton: {
//     float: 'right',
//     fontSize: '20px',
//     cursor: 'pointer'
//   }
// };

// export default Maps;


// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import * as Cesium from 'cesium';
// import 'cesium/Build/Cesium/Widgets/widgets.css';

// // Set base URL for Cesium assets
// window.CESIUM_BASE_URL = '/node_modules/cesium/Build/Cesium/';

// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   static getDerivedStateFromError(error) {
//     return { hasError: true };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error("ErrorBoundary caught:", error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return <div style={styles.errorFallback}>Map failed to load. Please try refreshing the page.</div>;
//     }
//     return this.props.children;
//   }
// }

// const Maps = () => {
//   const cesiumContainer = useRef(null);
//   const viewerRef = useRef(null);
//   const tilesetRef = useRef(null);
//   const geoJsonDataSourceRef = useRef(null);
//   const vehiclesRef = useRef([]);
//   const [status, setStatus] = useState('Loading map...');
//   const [showVideoModal, setShowVideoModal] = useState(false);
//   const [videoUrl, setVideoUrl] = useState('');
//   const [videoTitle, setVideoTitle] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [vehicleCount, setVehicleCount] = useState(20);
//   const [showRoads, setShowRoads] = useState(false);
//   const zoomThreshold = 500;

//   // Calculate polygon perimeter
//   const calculatePolygonPerimeter = (positions) => {
//     let perimeter = 0;
//     for (let i = 0; i < positions.length; i++) {
//       const nextIndex = (i + 1) % positions.length;
//       perimeter += Cesium.Cartesian3.distance(positions[i], positions[nextIndex]);
//     }
//     return perimeter;
//   };

//   // Calculate polygon area using geodesic approach
//   const calculatePolygonArea = (positions) => {
//     if (positions.length < 3) return 0;
    
//     const cartographics = positions.map(pos => 
//       Cesium.Cartographic.fromCartesian(pos)
//     );
    
//     let area = 0;
//     const ellipsoid = Cesium.Ellipsoid.WGS84;
    
//     for (let i = 0; i < cartographics.length; i++) {
//       const j = (i + 1) % cartographics.length;
//       const p1 = cartographics[i];
//       const p2 = cartographics[j];
      
//       const geodesic = new Cesium.EllipsoidGeodesic(p1, p2);
//       const segmentArea = geodesic.surfaceArea;
//       area += segmentArea;
//     }
    
//     return Math.abs(area);
//   };

//   const createDummyPaths = useCallback(() => {
//     if (!viewerRef.current) return [];
    
//     const cameraPosition = viewerRef.current.camera.positionCartographic;
//     const centerLongitude = Cesium.Math.toDegrees(cameraPosition.longitude);
//     const centerLatitude = Cesium.Math.toDegrees(cameraPosition.latitude);
    
//     const dummyPaths = [];
//     const gridSize = 0.002;
    
//     for (let i = 0; i < 4; i++) {
//       const startLon = centerLongitude + (i % 2) * gridSize;
//       const startLat = centerLatitude + Math.floor(i / 2) * gridSize;
      
//       const positions = [];
//       for (let j = 0; j < 4; j++) {
//         const lon = startLon + j * gridSize / 3;
//         const lat = startLat;
//         positions.push(
//           Cesium.Cartesian3.fromDegrees(lon, lat)
//         );
//       }
      
//       dummyPaths.push({
//         positions,
//         isClosed: false,
//         originalEntity: null
//       });
//     }
    
//     return dummyPaths;
//   }, []);

//   const extractPathsFromPolygons = useCallback(() => {
//     if (!geoJsonDataSourceRef.current || !viewerRef.current) {
//       return createDummyPaths();
//     }
    
//     const paths = [];
//     const entities = geoJsonDataSourceRef.current.entities.values;

//     entities.forEach(entity => {
//       if (entity.polygon && !entity.properties?.building) {
//         try {
//           const hierarchy = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now());
//           const positions = hierarchy.positions;
          
//           if (positions.length < 2) return;
          
//           const polygonArea = calculatePolygonArea(positions);
//           const polygonLength = calculatePolygonPerimeter(positions);
//           const lengthToWidthRatio = polygonLength / Math.sqrt(polygonArea);
          
//           if (lengthToWidthRatio > 4) {
//             const path = [];
//             for (let i = 0; i < positions.length; i++) {
//               path.push(positions[i]);
//               if (i < positions.length - 1) {
//                 const midPoint = new Cesium.Cartesian3();
//                 Cesium.Cartesian3.lerp(
//                   positions[i], 
//                   positions[(i + 1) % positions.length], 
//                   0.5, 
//                   midPoint
//                 );
//                 path.push(midPoint);
//               }
//             }
            
//             paths.push({
//               positions: path,
//               isClosed: true,
//               originalEntity: entity
//             });
//           }
//         } catch (error) {
//           console.error('Error processing polygon:', error);
//         }
//       }
//     });

//     if (paths.length === 0) {
//       setStatus('No roads detected - using demo paths');
//       return createDummyPaths();
//     }

//     return paths;
//   }, [createDummyPaths]);

//   const generateVehicles = useCallback(() => {
//     console.log('Generating vehicles...');
//     if (!viewerRef.current) {
//       console.error('Viewer not available');
//       return;
//     }

//     // Clear existing vehicles
//     vehiclesRef.current.forEach(vehicle => {
//       viewerRef.current.entities.remove(vehicle.entity);
//     });
//     vehiclesRef.current = [];

//     const roadPaths = extractPathsFromPolygons();
//     console.log('Found paths:', roadPaths.length);
//     if (roadPaths.length === 0) {
//       console.warn("No suitable road paths found");
//       setStatus('No roads detected for vehicle simulation');
//       return;
//     }

//     for (let i = 0; i < vehicleCount; i++) {
//       const path = roadPaths[Math.floor(Math.random() * roadPaths.length)];
//       const type = ['car', 'bus', 'truck'][Math.floor(Math.random() * 3)];
//       const color = Cesium.Color.fromRandom({
//         red: [0.1, 0.8],
//         green: [0.1, 0.8],
//         blue: [0.1, 0.8],
//         alpha: 1.0
//       });

//       // Create position with explicit height
//       const position = new Cesium.CallbackProperty(() => {
//         const pos = vehiclesRef.current[i]?.currentPosition;
//         if (!pos) return path.positions[0];
        
//         const newPos = Cesium.Cartesian3.clone(pos);
//         const cartographic = Cesium.Cartographic.fromCartesian(newPos);
//         cartographic.height = 10;
//         return Cesium.Cartographic.toCartesian(cartographic);
//       }, false);

//       // Create debug point
//       viewerRef.current.entities.add({
//         position: position,
//         point: {
//           pixelSize: 5,
//           color: Cesium.Color.RED,
//           outlineColor: Cesium.Color.WHITE,
//           outlineWidth: 1
//         }
//       });

//       // Create vehicle entity with fallback
//       const vehicle = viewerRef.current.entities.add({
//         name: `${type}-${i}`,
//         position: position,
//         model: {
//           uri: `/models/${type}.glb`,
//           minimumPixelSize: 32,
//           maximumScale: 64,
//           color: color,
//           heightReference: Cesium.HeightReference.NONE,
//           runAnimations: false,
//           error: () => {
//             console.error(`Failed to load model for ${type}-${i}`);
//             viewerRef.current.entities.remove(vehicle);
//             vehiclesRef.current[i].entity = viewerRef.current.entities.add({
//               name: `${type}-${i}-fallback`,
//               position: position,
//               box: {
//                 dimensions: new Cesium.Cartesian3(5, 2, 2),
//                 material: color
//               },
//               orientation: new Cesium.CallbackProperty(() => {
//                 const vehicleData = vehiclesRef.current[i];
//                 if (!vehicleData?.direction) return Cesium.Quaternion.IDENTITY;
                
//                 return Cesium.Quaternion.fromHeadingPitchRoll(
//                   new Cesium.HeadingPitchRoll(
//                     Math.atan2(vehicleData.direction.y, vehicleData.direction.x),
//                     0,
//                     0
//                   )
//                 );
//               }, false)
//             });
//           }
//         },
//         orientation: new Cesium.CallbackProperty(() => {
//           const vehicleData = vehiclesRef.current[i];
//           if (!vehicleData?.direction) return Cesium.Quaternion.IDENTITY;
          
//           return Cesium.Quaternion.fromHeadingPitchRoll(
//             new Cesium.HeadingPitchRoll(
//               Math.atan2(vehicleData.direction.y, vehicleData.direction.x),
//               0,
//               0
//             )
//           );
//         }, false)
//       });

//       // Initialize movement data
//       const startIndex = Math.floor(Math.random() * path.positions.length);
//       const startPos = path.positions[startIndex];
      
//       const cartographic = Cesium.Cartographic.fromCartesian(startPos);
//       cartographic.height = 10;
//       const elevatedPos = Cesium.Cartographic.toCartesian(cartographic);
      
//       vehiclesRef.current.push({
//         entity: vehicle,
//         path: path.positions,
//         currentPosition: elevatedPos,
//         currentIndex: startIndex,
//         direction: new Cesium.Cartesian3(),
//         speed: 0.5 + Math.random() * 2.0,
//         progress: 0,
//         isMovingForward: Math.random() > 0.5
//       });
//     }
//   }, [vehicleCount, extractPathsFromPolygons]);

//   const moveVehicles = useCallback(() => {
//     if (!viewerRef.current) return;

//     vehiclesRef.current.forEach((vehicle, index) => {
//       if (!vehicle.path || vehicle.path.length < 2) return;

//       let nextIndex;
//       if (vehicle.isMovingForward) {
//         nextIndex = (vehicle.currentIndex + 1) % vehicle.path.length;
//       } else {
//         nextIndex = (vehicle.currentIndex - 1 + vehicle.path.length) % vehicle.path.length;
//       }

//       const currentPos = vehicle.path[vehicle.currentIndex];
//       const nextPos = vehicle.path[nextIndex];

//       Cesium.Cartesian3.subtract(nextPos, currentPos, vehicle.direction);
//       Cesium.Cartesian3.normalize(vehicle.direction, vehicle.direction);

//       vehicle.progress += 0.01 * vehicle.speed;
      
//       const groundPos = new Cesium.Cartesian3();
//       Cesium.Cartesian3.lerp(
//         currentPos,
//         nextPos,
//         vehicle.progress,
//         groundPos
//       );
      
//       const cartographic = Cesium.Cartographic.fromCartesian(groundPos);
//       cartographic.height = 10;
//       const elevatedPos = Cesium.Cartographic.toCartesian(cartographic);
      
//       Cesium.Cartesian3.clone(elevatedPos, vehicle.currentPosition);

//       if (vehicle.progress >= 1.0) {
//         vehicle.currentIndex = nextIndex;
//         vehicle.progress = 0;
        
//         if ((vehicle.currentIndex === 0 || 
//              vehicle.currentIndex === vehicle.path.length - 1) &&
//             Math.random() < 0.3) {
//           vehicle.isMovingForward = !vehicle.isMovingForward;
//         }
//       }
//     });

//     requestAnimationFrame(moveVehicles);
//   }, []);

//   const load3DTileset = async () => {
//     try {
//       if (!viewerRef.current) {
//         throw new Error('Viewer not initialized');
//       }

//       const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(3048665, {
//         show: true,
//         maximumScreenSpaceError: 2
//       });
      
//       viewerRef.current.scene.primitives.add(tileset);
//       tilesetRef.current = tileset;
      
//       try {
//         await viewerRef.current.zoomTo(tileset);
//       } catch (zoomError) {
//         console.warn('Could not zoom to tileset:', zoomError);
//       }
//     } catch (error) {
//       console.error('Error loading 3D tileset:', error);
      
//       if (viewerRef.current) {
//         viewerRef.current.entities.add({
//           position: Cesium.Cartesian3.fromDegrees(0, 0),
//           label: {
//             text: '3D Tileset failed to load',
//             font: '20px sans-serif',
//             fillColor: Cesium.Color.RED
//           }
//         });
//       }
//     }
//   };

//   const loadGeoJsonData = async () => {
//     try {
//       const response = await fetch('http://localhost:8081/api/geojson');
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
//       const geojsonData = await response.json();
//       const dataSource = await Cesium.GeoJsonDataSource.load(geojsonData, {
//         clampToGround: true,
//         stroke: Cesium.Color.BLUE,
//         fill: Cesium.Color.BLUE.withAlpha(0.5),
//         strokeWidth: 3
//       });

//       geoJsonDataSourceRef.current = dataSource;
//       viewerRef.current.dataSources.add(dataSource);
      
//       try {
//         await viewerRef.current.zoomTo(dataSource);
//       } catch (zoomError) {
//         console.warn('Could not zoom to GeoJSON data:', zoomError);
//       }
//     } catch (error) {
//       console.error('Error loading GeoJSON:', error);
      
//       if (viewerRef.current) {
//         viewerRef.current.entities.add({
//           position: Cesium.Cartesian3.fromDegrees(0, 0),
//           label: {
//             text: 'GeoJSON data failed to load',
//             font: '20px sans-serif',
//             fillColor: Cesium.Color.RED
//           }
//         });
//       }
//     }
//   };

//   const initViewer = useCallback(async () => {
//     try {
//       Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YjhlMmVkNC1hYWVjLTQxYWEtOGZhYS1iOGQyNDUxY2ZlMTUiLCJpZCI6MjY0Nzg3LCJpYXQiOjE3MzUxMTAzMzV9.tdJk1ppDaw9AEy9bFB6RBU9T3H0-xOlIqVlrjDBJGQo";
      
//       await Cesium.ApproximateTerrainHeights.initialize();

//       viewerRef.current = new Cesium.Viewer(cesiumContainer.current, {
//         timeline: false,
//         animation: false,
//         baseLayerPicker: false,
//         sceneMode: Cesium.SceneMode.SCENE3D,
//         shouldAnimate: true,
//         imageryProvider: new Cesium.IonImageryProvider({ assetId: 3845 }),
//         creditContainer: document.createElement('div'),
//         scene3DOnly: true,
//         orderIndependentTranslucency: false,
//         shadows: false
//       });

//       viewerRef.current.terrainProvider = await Cesium.createWorldTerrainAsync({
//         requestWaterMask: true,
//         requestVertexNormals: true
//       });

//       viewerRef.current.scene.globe.showGroundAtmosphere = false;
//       viewerRef.current.scene.fog.enabled = false;
//       viewerRef.current.scene.skyAtmosphere.show = false;

//       await load3DTileset();
//       await loadGeoJsonData();

//       setIsLoading(false);
//       setStatus('Click on the map to add an anchor point.');
//     } catch (error) {
//       console.error('Error initializing Cesium:', error);
//       setStatus('Failed to initialize map');
//       setIsLoading(false);
      
//       if (viewerRef.current) {
//         viewerRef.current.entities.add({
//           position: Cesium.Cartesian3.fromDegrees(0, 0),
//           label: {
//             text: 'Map initialization failed',
//             font: '20px sans-serif',
//             fillColor: Cesium.Color.RED
//           }
//         });
//       }
//     }
//   }, []);

//   useEffect(() => {
//     initViewer();
//     return () => {
//       if (viewerRef.current && !viewerRef.current.isDestroyed()) {
//         viewerRef.current.destroy();
//       }
//     };
//   }, [initViewer]);

//   useEffect(() => {
//     if (!isLoading && geoJsonDataSourceRef.current && tilesetRef.current) {
//       const timer = setTimeout(() => {
//         generateVehicles();
//         moveVehicles();
//       }, 1000);
      
//       return () => clearTimeout(timer);
//     }
//   }, [isLoading, generateVehicles, moveVehicles]);

//   const handleMapClick = useCallback((movement) => {
//     if (!viewerRef.current) return;

//     const pickedObject = viewerRef.current.scene.pick(movement.position);
//     if (pickedObject?.id?.properties?.video) {
//       const videoUrl = pickedObject.id.properties.video;
//       const videoTitle = pickedObject.id.properties['@id'];
//       setVideoUrl(videoUrl);
//       setVideoTitle(videoTitle);
//       setShowVideoModal(true);
//       return;
//     }
//   }, []);

//   useEffect(() => {
//     if (!viewerRef.current || isLoading) return;

//     const handler = new Cesium.ScreenSpaceEventHandler(viewerRef.current.canvas);
//     handler.setInputAction(handleMapClick, Cesium.ScreenSpaceEventType.LEFT_CLICK);

//     return () => handler.destroy();
//   }, [isLoading, handleMapClick]);

//   return (
//     <ErrorBoundary>
//       <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
//         <div ref={cesiumContainer} style={{ width: '100%', height: '100%' }} />
        
//         {isLoading && (
//           <div style={styles.loadingOverlay}>
//             <div style={styles.loadingText}>Loading map...</div>
//           </div>
//         )}
        
//         <div style={styles.controls}>
//           <button onClick={() => setStatus('Click on the map to add an anchor point')}>
//             Add Anchor
//           </button>
//           <p>{status}</p>
//         </div>
        
//         <div style={styles.toggleButtons}>
//           <button 
//             onClick={() => setShowRoads(!showRoads)} 
//             style={styles.toggleButton(showRoads)}
//           >
//             {showRoads ? 'Hide Roads' : 'Show Roads'}
//           </button>
          
//           <div style={styles.vehicleControls}>
//             <h4>Vehicle Controls</h4>
//             <div style={styles.sliderContainer}>
//               <span>Count:</span>
//               <input 
//                 type="range" 
//                 min="5" 
//                 max="100" 
//                 value={vehicleCount}
//                 onChange={(e) => setVehicleCount(parseInt(e.target.value))}
//               />
//               <span>{vehicleCount}</span>
//             </div>
//             <button 
//               onClick={generateVehicles} 
//               style={styles.regenerateButton}
//             >
//               Regenerate Vehicles
//             </button>
//           </div>
//         </div>
        
//         {showVideoModal && (
//           <div style={styles.videoModal}>
//             <span 
//               style={styles.closeButton} 
//               onClick={() => setShowVideoModal(false)}
//             >
//               &times;
//             </span>
//             <h3>{videoTitle}</h3>
//             <video 
//               width="100%" 
//               controls 
//               autoPlay
//               onEnded={() => setShowVideoModal(false)}
//             >
//               <source src={videoUrl} type="video/mp4" />
//               Your browser does not support the video tag.
//             </video>
//           </div>
//         )}
//       </div>
//     </ErrorBoundary>
//   );
// };

// const styles = {
//   errorFallback: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     backgroundColor: 'rgba(255, 0, 0, 0.2)',
//     padding: '20px',
//     borderRadius: '5px',
//     border: '1px solid red',
//     color: 'red',
//     fontSize: '18px',
//     textAlign: 'center'
//   },
//   loadingOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: '100%',
//     height: '100%',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     zIndex: 999
//   },
//   loadingText: {
//     color: 'white',
//     fontSize: '20px'
//   },
//   controls: {
//     position: 'absolute',
//     top: '10px',
//     left: '10px',
//     zIndex: 1000,
//     background: 'rgba(255, 255, 255, 0.8)',
//     padding: '10px',
//     borderRadius: '5px'
//   },
//   toggleButtons: {
//     position: 'absolute',
//     top: '60px',
//     right: '10px',
//     zIndex: 1000,
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '10px'
//   },
//   toggleButton: (active) => ({
//     backgroundColor: active ? 'rgba(255, 100, 0, 0.9)' : 'rgba(0, 0, 0, 0.7)',
//     color: 'white',
//     padding: '10px',
//     border: 'none',
//     borderRadius: '5px',
//     cursor: 'pointer'
//   }),
//   vehicleControls: {
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     padding: '10px',
//     borderRadius: '5px',
//     color: 'white'
//   },
//   sliderContainer: {
//     display: 'flex',
//     gap: '10px',
//     alignItems: 'center',
//     margin: '5px 0'
//   },
//   regenerateButton: {
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     color: 'white',
//     padding: '5px 10px',
//     border: 'none',
//     borderRadius: '3px',
//     cursor: 'pointer',
//     marginTop: '5px',
//     width: '100%'
//   },
//   videoModal: {
//     position: 'fixed',
//     zIndex: 1001,
//     left: '50%',
//     top: '50%',
//     transform: 'translate(-50%, -50%)',
//     backgroundColor: 'white',
//     padding: '20px',
//     border: '1px solid #ccc',
//     borderRadius: '5px',
//     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
//     width: '80%',
//     maxWidth: '600px'
//   },
//   closeButton: {
//     float: 'right',
//     fontSize: '20px',
//     cursor: 'pointer'
//   }
// };

// export default Maps;



// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import * as Cesium from 'cesium';
// import 'cesium/Build/Cesium/Widgets/widgets.css';

// // Set base URL for Cesium assets
// window.CESIUM_BASE_URL = '/node_modules/cesium/Build/Cesium/';

// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   static getDerivedStateFromError(error) {
//     return { hasError: true };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error("ErrorBoundary caught:", error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return <div style={styles.errorFallback}>Map failed to load. Please try refreshing the page.</div>;
//     }
//     return this.props.children;
//   }
// }

// const Maps = () => {
//   const cesiumContainer = useRef(null);
//   const viewerRef = useRef(null);
//   const tilesetRef = useRef(null);
//   const geoJsonDataSourceRef = useRef(null);
//   const vehiclesRef = useRef([]);
//   const [status, setStatus] = useState('Loading map...');
//   const [showVideoModal, setShowVideoModal] = useState(false);
//   const [videoUrl, setVideoUrl] = useState('');
//   const [videoTitle, setVideoTitle] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [vehicleCount, setVehicleCount] = useState(5); // Start with fewer vehicles for debugging
//   const [showRoads, setShowRoads] = useState(false);
//   const [debugMode, setDebugMode] = useState(true); // Added debug mode
//   const zoomThreshold = 500;

//   // Debug function to log viewer state
//   const logViewerState = useCallback(() => {
//     if (!viewerRef.current) {
//       console.log('Viewer not initialized');
//       return;
//     }
    
//     console.log('Viewer state:', {
//       terrain: viewerRef.current.terrainProvider,
//       scene: viewerRef.current.scene,
//       entities: viewerRef.current.entities.values.length,
//       dataSources: viewerRef.current.dataSources.length,
//       primitives: viewerRef.current.scene.primitives.length
//     });
//   }, []);

//   // Calculate polygon perimeter
//   const calculatePolygonPerimeter = (positions) => {
//     let perimeter = 0;
//     for (let i = 0; i < positions.length; i++) {
//       const nextIndex = (i + 1) % positions.length;
//       perimeter += Cesium.Cartesian3.distance(positions[i], positions[nextIndex]);
//     }
//     return perimeter;
//   };

//   // Calculate polygon area
//   const calculatePolygonArea = (positions) => {
//     if (positions.length < 3) return 0;
//     return Cesium.PolygonGeometry.computeArea(positions);
//   };

//   const createDummyPaths = useCallback(() => {
//     console.log('Creating dummy paths');
//     if (!viewerRef.current) return [];
    
//     // Use a fixed location if camera position isn't available
//     const centerLongitude = -75.59777;
//     const centerLatitude = 40.03883;
    
//     const dummyPaths = [];
//     const gridSize = 0.002;
    
//     for (let i = 0; i < 4; i++) {
//       const startLon = centerLongitude + (i % 2) * gridSize;
//       const startLat = centerLatitude + Math.floor(i / 2) * gridSize;
      
//       const positions = [];
//       for (let j = 0; j < 4; j++) {
//         const lon = startLon + j * gridSize / 3;
//         const lat = startLat;
//         positions.push(
//           Cesium.Cartesian3.fromDegrees(lon, lat, 10) // Explicit height of 10 meters
//         );
//       }
      
//       dummyPaths.push({
//         positions,
//         isClosed: false,
//         originalEntity: null
//       });
//     }
    
//     return dummyPaths;
//   }, []);

//   const extractPathsFromPolygons = useCallback(() => {
//     console.log('Extracting paths from polygons');
//     if (!geoJsonDataSourceRef.current || !viewerRef.current) {
//       console.log('Using dummy paths');
//       return createDummyPaths();
//     }
    
//     const paths = [];
//     const entities = geoJsonDataSourceRef.current.entities.values;

//     entities.forEach(entity => {
//       if (entity.polygon) {
//         try {
//           const hierarchy = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now());
//           const positions = hierarchy.positions;
          
//           if (positions.length < 2) return;
          
//           // Create path from polygon positions
//           const path = [];
//           for (let i = 0; i < positions.length; i++) {
//             const cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
//             cartographic.height = 10; // Set height to 10 meters
//             path.push(Cesium.Cartographic.toCartesian(cartographic));
//           }
          
//           paths.push({
//             positions: path,
//             isClosed: true,
//             originalEntity: entity
//           });
//         } catch (error) {
//           console.error('Error processing polygon:', error);
//         }
//       }
//     });

//     if (paths.length === 0) {
//       console.log('No paths found in GeoJSON, using dummy paths');
//       setStatus('No roads detected - using demo paths');
//       return createDummyPaths();
//     }

//     console.log(`Found ${paths.length} paths`);
//     return paths;
//   }, [createDummyPaths]);

//   const generateVehicles = useCallback(() => {
//     console.log('Generating vehicles...');
//     if (!viewerRef.current) {
//       console.error('Viewer not available');
//       return;
//     }

//     // Clear existing vehicles
//     vehiclesRef.current.forEach(vehicle => {
//       viewerRef.current.entities.remove(vehicle.entity);
//     });
//     vehiclesRef.current = [];

//     const roadPaths = extractPathsFromPolygons();
//     console.log('Found paths:', roadPaths.length);
//     if (roadPaths.length === 0) {
//       console.warn("No suitable road paths found");
//       setStatus('No roads detected for vehicle simulation');
//       return;
//     }

//     // Log first path positions for debugging
//     if (roadPaths.length > 0 && roadPaths[0].positions) {
//       console.log('First path positions:', roadPaths[0].positions.map(p => {
//         const carto = Cesium.Cartographic.fromCartesian(p);
//         return {
//           lon: Cesium.Math.toDegrees(carto.longitude),
//           lat: Cesium.Math.toDegrees(carto.latitude),
//           height: carto.height
//         };
//       }));
//     }

//     for (let i = 0; i < vehicleCount; i++) {
//       const path = roadPaths[Math.floor(Math.random() * roadPaths.length)];
//       const type = ['car', 'bus', 'truck'][Math.floor(Math.random() * 3)];
//       const color = Cesium.Color.fromRandom({
//         red: [0.1, 0.8],
//         green: [0.1, 0.8],
//         blue: [0.1, 0.8],
//         alpha: 1.0
//       });

//       // Create position property
//       const position = new Cesium.CallbackProperty(() => {
//         const vehicleData = vehiclesRef.current[i];
//         if (!vehicleData?.currentPosition) return path.positions[0];
//         return vehicleData.currentPosition;
//       }, false);

//       // Create debug point
//       if (debugMode) {
//         viewerRef.current.entities.add({
//           name: `debug-point-${i}`,
//           position: position,
//           point: {
//             pixelSize: 10,
//             color: Cesium.Color.RED,
//             outlineColor: Cesium.Color.WHITE,
//             outlineWidth: 2
//           },
//           label: {
//             text: `Veh-${i}`,
//             font: '14px sans-serif',
//             fillColor: Cesium.Color.WHITE,
//             outlineColor: Cesium.Color.BLACK,
//             outlineWidth: 2,
//             style: Cesium.LabelStyle.FILL_AND_OUTLINE,
//             verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
//             pixelOffset: new Cesium.Cartesian2(0, -10)
//           }
//         });
//       }

//       // Create vehicle entity
//       const vehicle = viewerRef.current.entities.add({
//         name: `${type}-${i}`,
//         position: position,
//         model: {
//           uri: `https://assets.agi.com/models/vehicles/${type}.glb`, // Using online models for testing
//           minimumPixelSize: 64,
//           maximumScale: 200,
//           color: color,
//           heightReference: Cesium.HeightReference.NONE,
//           runAnimations: false,
//           error: (error) => {
//             console.error(`Failed to load model for ${type}-${i}:`, error);
//             // Fallback to box
//             viewerRef.current.entities.remove(vehicle);
//             vehiclesRef.current[i].entity = viewerRef.current.entities.add({
//               name: `${type}-${i}-fallback`,
//               position: position,
//               box: {
//                 dimensions: new Cesium.Cartesian3(8, 4, 3),
//                 material: color
//               },
//               orientation: new Cesium.CallbackProperty(() => {
//                 const vehicleData = vehiclesRef.current[i];
//                 if (!vehicleData?.direction) return Cesium.Quaternion.IDENTITY;
//                 return Cesium.Quaternion.fromHeadingPitchRoll(
//                   new Cesium.HeadingPitchRoll(
//                     Cesium.Math.PI_OVER_TWO + Math.atan2(vehicleData.direction.y, vehicleData.direction.x),
//                     0,
//                     0
//                   )
//                 );
//               }, false)
//             });
//           }
//         },
//         orientation: new Cesium.CallbackProperty(() => {
//           const vehicleData = vehiclesRef.current[i];
//           if (!vehicleData?.direction) return Cesium.Quaternion.IDENTITY;
//           return Cesium.Quaternion.fromHeadingPitchRoll(
//             new Cesium.HeadingPitchRoll(
//               Cesium.Math.PI_OVER_TWO + Math.atan2(vehicleData.direction.y, vehicleData.direction.x),
//               0,
//               0
//             )
//           );
//         }, false)
//       });

//       // Initialize movement data
//       const startIndex = Math.floor(Math.random() * path.positions.length);
//       const startPos = path.positions[startIndex];
      
//       vehiclesRef.current.push({
//         entity: vehicle,
//         path: path.positions,
//         currentPosition: Cesium.Cartesian3.clone(startPos),
//         currentIndex: startIndex,
//         direction: new Cesium.Cartesian3(),
//         speed: 5 + Math.random() * 10, // Faster speed for visibility
//         progress: 0,
//         isMovingForward: Math.random() > 0.5
//       });
//     }

//     console.log(`Generated ${vehicleCount} vehicles`);
//     logViewerState();
//   }, [vehicleCount, extractPathsFromPolygons, debugMode, logViewerState]);

//   const moveVehicles = useCallback(() => {
//     if (!viewerRef.current) return;

//     vehiclesRef.current.forEach((vehicle, index) => {
//       if (!vehicle.path || vehicle.path.length < 2) return;

//       let nextIndex;
//       if (vehicle.isMovingForward) {
//         nextIndex = (vehicle.currentIndex + 1) % vehicle.path.length;
//       } else {
//         nextIndex = (vehicle.currentIndex - 1 + vehicle.path.length) % vehicle.path.length;
//       }

//       const currentPos = vehicle.path[vehicle.currentIndex];
//       const nextPos = vehicle.path[nextIndex];

//       Cesium.Cartesian3.subtract(nextPos, currentPos, vehicle.direction);
//       Cesium.Cartesian3.normalize(vehicle.direction, vehicle.direction);

//       vehicle.progress += 0.005 * vehicle.speed;
      
//       const newPos = new Cesium.Cartesian3();
//       Cesium.Cartesian3.lerp(
//         currentPos,
//         nextPos,
//         vehicle.progress,
//         newPos
//       );
      
//       Cesium.Cartesian3.clone(newPos, vehicle.currentPosition);

//       if (vehicle.progress >= 1.0) {
//         vehicle.currentIndex = nextIndex;
//         vehicle.progress = 0;
        
//         // Randomly change direction at path ends
//         if ((vehicle.currentIndex === 0 || 
//              vehicle.currentIndex === vehicle.path.length - 1) &&
//             Math.random() < 0.3) {
//           vehicle.isMovingForward = !vehicle.isMovingForward;
//         }
//       }
//     });

//     requestAnimationFrame(moveVehicles);
//   }, []);

//   // Load 3D tileset
//   const load3DTileset = async () => {
//     try {
//       if (!viewerRef.current) {
//         throw new Error('Viewer not initialized');
//       }

//       const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(3048665, {
//         show: true,
//         maximumScreenSpaceError: 2
//       });
      
//       viewerRef.current.scene.primitives.add(tileset);
//       tilesetRef.current = tileset;
      
//       try {
//         await viewerRef.current.zoomTo(tileset);
//       } catch (zoomError) {
//         console.warn('Could not zoom to tileset:', zoomError);
//       }
//     } catch (error) {
//       console.error('Error loading 3D tileset:', error);
      
//       if (viewerRef.current) {
//         viewerRef.current.entities.add({
//           position: Cesium.Cartesian3.fromDegrees(0, 0),
//           label: {
//             text: '3D Tileset failed to load',
//             font: '20px sans-serif',
//             fillColor: Cesium.Color.RED
//           }
//         });
//       }
//     }
//   };

//   // Load GeoJSON data
//   const loadGeoJsonData = async () => {
//     try {
//       // Fallback to local GeoJSON if server fails
//       let geojsonData;
//       try {
//         const response = await fetch('http://localhost:8081/api/geojson');
//         if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//         geojsonData = await response.json();
//       } catch (fetchError) {
//         console.warn('Using fallback GeoJSON data');
//         geojsonData = {
//           type: "FeatureCollection",
//           features: [
//             {
//               type: "Feature",
//               properties: {},
//               geometry: {
//                 type: "Polygon",
//                 coordinates: [[
//                   [-75.6, 40.04],
//                   [-75.59, 40.04],
//                   [-75.59, 40.03],
//                   [-75.6, 40.03],
//                   [-75.6, 40.04]
//                 ]]
//               }
//             }
//           ]
//         };
//       }

//       const dataSource = await Cesium.GeoJsonDataSource.load(geojsonData, {
//         clampToGround: true,
//         stroke: Cesium.Color.BLUE.withAlpha(0.7),
//         fill: Cesium.Color.BLUE.withAlpha(0.3),
//         strokeWidth: 3
//       });

//       geoJsonDataSourceRef.current = dataSource;
//       viewerRef.current.dataSources.add(dataSource);
      
//       try {
//         await viewerRef.current.zoomTo(dataSource);
//       } catch (zoomError) {
//         console.warn('Could not zoom to GeoJSON data:', zoomError);
//       }
//     } catch (error) {
//       console.error('Error loading GeoJSON:', error);
      
//       if (viewerRef.current) {
//         viewerRef.current.entities.add({
//           position: Cesium.Cartesian3.fromDegrees(0, 0),
//           label: {
//             text: 'GeoJSON data failed to load',
//             font: '20px sans-serif',
//             fillColor: Cesium.Color.RED
//           }
//         });
//       }
//     }
//   };

//   const initViewer = useCallback(async () => {
//     try {
//       Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YjhlMmVkNC1hYWVjLTQxYWEtOGZhYS1iOGQyNDUxY2ZlMTUiLCJpZCI6MjY0Nzg3LCJpYXQiOjE3MzUxMTAzMzV9.tdJk1ppDaw9AEy9bFB6RBU9T3H0-xOlIqVlrjDBJGQo";
      
//       await Cesium.ApproximateTerrainHeights.initialize();

//       viewerRef.current = new Cesium.Viewer(cesiumContainer.current, {
//         timeline: false,
//         animation: false,
//         baseLayerPicker: false,
//         sceneMode: Cesium.SceneMode.SCENE3D,
//         shouldAnimate: true,
//         imageryProvider: new Cesium.IonImageryProvider({ assetId: 3845 }),
//         creditContainer: document.createElement('div'),
//         scene3DOnly: true,
//         orderIndependentTranslucency: false,
//         shadows: true, // Enabled shadows for better visualization
//         terrainShadows: Cesium.ShadowMode.RECEIVE_ONLY
//       });

//       viewerRef.current.terrainProvider = await Cesium.createWorldTerrainAsync({
//         requestWaterMask: true,
//         requestVertexNormals: true
//       });

//       viewerRef.current.scene.globe.showGroundAtmosphere = true;
//       viewerRef.current.scene.fog.enabled = true;
//       viewerRef.current.scene.skyAtmosphere.show = true;
//       viewerRef.current.scene.sun.show = true;
//       viewerRef.current.scene.moon.show = true;

//       // Add basic lighting
//       viewerRef.current.scene.light = new Cesium.DirectionalLight({
//         direction: new Cesium.Cartesian3(0.5, -1.0, -0.5),
//         intensity: 2.0
//       });

//       // Add simple building for testing if tileset fails
//       viewerRef.current.entities.add({
//         name: 'Test Building',
//         position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883, 0),
//         box: {
//           dimensions: new Cesium.Cartesian3(100, 100, 50),
//           material: Cesium.Color.BLUE.withAlpha(0.5)
//         }
//       });

//       await load3DTileset();
//       await loadGeoJsonData();

//       setIsLoading(false);
//       setStatus('Map loaded. Generating vehicles...');
//       logViewerState();
//     } catch (error) {
//       console.error('Error initializing Cesium:', error);
//       setStatus('Failed to initialize map');
//       setIsLoading(false);
      
//       if (viewerRef.current) {
//         viewerRef.current.entities.add({
//           position: Cesium.Cartesian3.fromDegrees(0, 0),
//           label: {
//             text: 'Map initialization failed',
//             font: '20px sans-serif',
//             fillColor: Cesium.Color.RED
//           }
//         });
//       }
//     }
//   }, [logViewerState]);

//   useEffect(() => {
//     initViewer();
//     return () => {
//       if (viewerRef.current && !viewerRef.current.isDestroyed()) {
//         viewerRef.current.destroy();
//       }
//     };
//   }, [initViewer]);

//   useEffect(() => {
//     if (!isLoading && geoJsonDataSourceRef.current) {
//       console.log('Data loaded, generating vehicles...');
//       const timer = setTimeout(() => {
//         generateVehicles();
//         moveVehicles();
//       }, 1000);
      
//       return () => clearTimeout(timer);
//     }
//   }, [isLoading, generateVehicles, moveVehicles]);

//   const handleMapClick = useCallback((movement) => {
//     if (!viewerRef.current) return;

//     const pickedObject = viewerRef.current.scene.pick(movement.position);
//     if (pickedObject) {
//       console.log('Clicked object:', pickedObject.id?.name || 'unknown');
//       if (pickedObject.id?.properties?.video) {
//         const videoUrl = pickedObject.id.properties.video;
//         const videoTitle = pickedObject.id.properties['@id'];
//         setVideoUrl(videoUrl);
//         setVideoTitle(videoTitle);
//         setShowVideoModal(true);
//       }
//     } else {
//       const ray = viewerRef.current.camera.getPickRay(movement.position);
//       const position = viewerRef.current.scene.globe.pick(ray, viewerRef.current.scene);
//       if (position) {
//         const cartographic = Cesium.Cartographic.fromCartesian(position);
//         console.log('Clicked position:', {
//           lon: Cesium.Math.toDegrees(cartographic.longitude),
//           lat: Cesium.Math.toDegrees(cartographic.latitude),
//           height: cartographic.height
//         });
//       }
//     }
//   }, []);

//   useEffect(() => {
//     if (!viewerRef.current || isLoading) return;

//     const handler = new Cesium.ScreenSpaceEventHandler(viewerRef.current.canvas);
//     handler.setInputAction(handleMapClick, Cesium.ScreenSpaceEventType.LEFT_CLICK);

//     return () => handler.destroy();
//   }, [isLoading, handleMapClick]);

//   return (
//     <ErrorBoundary>
//       <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
//         <div ref={cesiumContainer} style={{ width: '100%', height: '100%' }} />
        
//         {isLoading && (
//           <div style={styles.loadingOverlay}>
//             <div style={styles.loadingText}>Loading map...</div>
//           </div>
//         )}
        
//         <div style={styles.controls}>
//           <button onClick={() => {
//             logViewerState();
//             generateVehicles();
//           }}>
//             Debug Viewer
//           </button>
//           <p>{status}</p>
//         </div>
        
//         <div style={styles.toggleButtons}>
//           <button 
//             onClick={() => setShowRoads(!showRoads)} 
//             style={styles.toggleButton(showRoads)}
//           >
//             {showRoads ? 'Hide Roads' : 'Show Roads'}
//           </button>
          
//           <div style={styles.vehicleControls}>
//             <h4>Vehicle Controls</h4>
//             <div style={styles.sliderContainer}>
//               <span>Count:</span>
//               <input 
//                 type="range" 
//                 min="1" 
//                 max="20" 
//                 value={vehicleCount}
//                 onChange={(e) => setVehicleCount(parseInt(e.target.value))}
//               />
//               <span>{vehicleCount}</span>
//             </div>
//             <button 
//               onClick={generateVehicles} 
//               style={styles.regenerateButton}
//             >
//               Regenerate Vehicles
//             </button>
//             <button 
//               onClick={() => setDebugMode(!debugMode)} 
//               style={styles.toggleButton(debugMode)}
//             >
//               {debugMode ? 'Disable Debug' : 'Enable Debug'}
//             </button>
//           </div>
//         </div>
        
//         {showVideoModal && (
//           <div style={styles.videoModal}>
//             <span 
//               style={styles.closeButton} 
//               onClick={() => setShowVideoModal(false)}
//             >
//               &times;
//             </span>
//             <h3>{videoTitle}</h3>
//             <video 
//               width="100%" 
//               controls 
//               autoPlay
//               onEnded={() => setShowVideoModal(false)}
//             >
//               <source src={videoUrl} type="video/mp4" />
//               Your browser does not support the video tag.
//             </video>
//           </div>
//         )}
//       </div>
//     </ErrorBoundary>
//   );
// };

// const styles = {
//   errorFallback: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     backgroundColor: 'rgba(255, 0, 0, 0.2)',
//     padding: '20px',
//     borderRadius: '5px',
//     border: '1px solid red',
//     color: 'red',
//     fontSize: '18px',
//     textAlign: 'center'
//   },
//   loadingOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: '100%',
//     height: '100%',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     zIndex: 999
//   },
//   loadingText: {
//     color: 'white',
//     fontSize: '20px'
//   },
//   controls: {
//     position: 'absolute',
//     top: '10px',
//     left: '10px',
//     zIndex: 1000,
//     background: 'rgba(255, 255, 255, 0.8)',
//     padding: '10px',
//     borderRadius: '5px',
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '5px'
//   },
//   toggleButtons: {
//     position: 'absolute',
//     top: '60px',
//     right: '10px',
//     zIndex: 1000,
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '10px'
//   },
//   toggleButton: (active) => ({
//     backgroundColor: active ? 'rgba(255, 100, 0, 0.9)' : 'rgba(0, 0, 0, 0.7)',
//     color: 'white',
//     padding: '10px',
//     border: 'none',
//     borderRadius: '5px',
//     cursor: 'pointer'
//   }),
//   vehicleControls: {
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     padding: '10px',
//     borderRadius: '5px',
//     color: 'white'
//   },
//   sliderContainer: {
//     display: 'flex',
//     gap: '10px',
//     alignItems: 'center',
//     margin: '5px 0'
//   },
//   regenerateButton: {
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     color: 'white',
//     padding: '5px 10px',
//     border: 'none',
//     borderRadius: '3px',
//     cursor: 'pointer',
//     marginTop: '5px',
//     width: '100%'
//   },
//   videoModal: {
//     position: 'fixed',
//     zIndex: 1001,
//     left: '50%',
//     top: '50%',
//     transform: 'translate(-50%, -50%)',
//     backgroundColor: 'white',
//     padding: '20px',
//     border: '1px solid #ccc',
//     borderRadius: '5px',
//     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
//     width: '80%',
//     maxWidth: '600px'
//   },
//   closeButton: {
//     float: 'right',
//     fontSize: '20px',
//     cursor: 'pointer'
//   }
// };

// export default Maps;


import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

// Set base URL for Cesium assets
window.CESIUM_BASE_URL = '/node_modules/cesium/Build/Cesium/';

const Maps = () => {
  const cesiumContainer = useRef(null);
  const viewerRef = useRef(null);
  const tilesetRef = useRef(null);
  const geoJsonDataSourceRef = useRef(null);
  const roadsDataSourceRef = useRef(null);
  const heatmapDataSourceRef = useRef(null);
  const buildingLabelsRef = useRef([]);
  const vehiclesRef = useRef([]);
  const [status, setStatus] = useState('Click on the map to add an anchor point.');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showRoads, setShowRoads] = useState(true);
  const [showVehicles, setShowVehicles] = useState(true);
  const zoomThreshold = 500;

  // Memoized terrain creation to prevent recreation on rerenders
  const createTerrain = useCallback(async () => {
    return await Cesium.createWorldTerrainAsync({
      requestWaterMask: true,
      requestVertexNormals: true
    });
  }, []);

  // Initialize viewer and load data
  useEffect(() => {
    let isMounted = true;
    const initViewer = async () => {
      try {
        Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YjhlMmVkNC1hYWVjLTQxYWEtOGZhYS1iOGQyNDUxY2ZlMTUiLCJpZCI6MjY0Nzg3LCJpYXQiOjE3MzUxMTAzMzV9.tdJk1ppDaw9AEy9bFB6RBU9T3H0-xOlIqVlrjDBJGQo";
        
        // Initialize subsystems in parallel
        await Promise.all([
          Cesium.Ion.defaultAccessToken,
          Cesium.ApproximateTerrainHeights.initialize()
        ]);

        const terrainProvider = await createTerrain();

        if (!isMounted) return;

        // Configure viewer with optimized settings
        viewerRef.current = new Cesium.Viewer(cesiumContainer.current, {
          terrainProvider,
          timeline: false,
          animation: false,
          baseLayerPicker: true,
          sceneMode: Cesium.SceneMode.SCENE3D,
          shouldAnimate: true,
          imageryProvider: new Cesium.IonImageryProvider({ assetId: 3845 }),
          creditContainer: document.createElement('div'),
          scene3DOnly: true,
          orderIndependentTranslucency: false,
          shadows: false
        });

        // Disable features we don't need for better performance
        viewerRef.current.scene.globe.showGroundAtmosphere = false;
        viewerRef.current.scene.fog.enabled = false;
        viewerRef.current.scene.skyAtmosphere.show = false;

        // Load data in parallel
        await Promise.all([
          load3DTileset(),
          loadGeoJsonData(),
          loadRoadsData(),
          loadHeatmapData()
        ]);

        if (isMounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error initializing Cesium:', error);
        if (isMounted) {
          setStatus('Failed to initialize map');
          setIsLoading(false);
        }
      }
    };

    initViewer();

    return () => {
      isMounted = false;
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
      }
    };
  }, [createTerrain]);

  const load3DTileset = async () => {
    try {
      const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(3048665, {
        show: false
      });
      
      tileset.maximumScreenSpaceError = 2;
      tileset.dynamicScreenSpaceError = true;
      tileset.dynamicScreenSpaceErrorDensity = 0.00278;
      tileset.dynamicScreenSpaceErrorFactor = 4.0;
      tileset.dynamicScreenSpaceErrorHeightFalloff = 0.25;
      
      viewerRef.current.scene.primitives.add(tileset);
      tilesetRef.current = tileset;

      const extras = tileset.asset.extras;
      if (extras?.ion?.defaultStyle) {
        tileset.style = new Cesium.Cesium3TileStyle(extras.ion.defaultStyle);
      }

      await viewerRef.current.zoomTo(tileset);
    } catch (error) {
      console.error('Error loading 3D tileset:', error);
      viewerRef.current.entities.add({
        position: Cesium.Cartesian3.fromDegrees(0, 0),
        label: {
          text: 'Failed to load 3D tileset',
          font: '20px sans-serif',
          fillColor: Cesium.Color.RED
        }
      });
    }
  };

  const loadGeoJsonData = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/geojson');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const geojsonData = await response.json();
      
      const dataSource = await Cesium.GeoJsonDataSource.load(geojsonData, {
        clampToGround: false,
        stroke: Cesium.Color.BLUE,
        fill: Cesium.Color.BLUE.withAlpha(0.5),
        strokeWidth: 3
      });

      geoJsonDataSourceRef.current = dataSource;
      viewerRef.current.dataSources.add(dataSource);

      const entities = dataSource.entities.values;
      const buildingLabels = [];

      entities.forEach(entity => {
        if (entity.polygon) {
          const buildingName = entity.properties['@id'] || 'Unknown Building';
          const positions = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;
          const center = Cesium.Cartesian3.fromDegrees(
            Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(positions[0]).longitude),
            Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(positions[0]).latitude),
            0
          );

          const labelEntity = viewerRef.current.entities.add({
            position: center,
            label: {
              text: buildingName,
              font: '14px sans-serif',
              fillColor: Cesium.Color.WHITE,
              scale: 1.5,
              pixelOffset: new Cesium.Cartesian2(0, -30),
              show: false
            }
          });

          buildingLabels.push(labelEntity);

          const height = entity.properties.height ? entity.properties.height.getValue() : 10;
          entity.polygon.extrudedHeight = height;
          entity.polygon.material = Cesium.Color.BLUE.withAlpha(0.6);
          entity.polygon.outline = true;
          entity.polygon.outlineColor = Cesium.Color.BLUE;
        }

        if (entity.position && entity.properties.video) {
          const videoUrl = entity.properties.video;
          entity.description = `
            <h3>${entity.properties['@id']}</h3>
            <video width="320" height="240" controls>
              <source src="${videoUrl}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          `;
        }
      });

      buildingLabelsRef.current = buildingLabels;
      setupZoomListener();
      await viewerRef.current.zoomTo(dataSource);
    } catch (error) {
      console.error('Error loading GeoJSON:', error);
      viewerRef.current.entities.add({
        position: Cesium.Cartesian3.fromDegrees(0, 0),
        label: {
          text: 'Failed to load GeoJSON data',
          font: '20px sans-serif',
          fillColor: Cesium.Color.RED
        }
      });
    }
  };

  const loadRoadsData = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/roads');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const roadsData = await response.json();
      
      const roadsDataSource = await Cesium.GeoJsonDataSource.load(roadsData, {
        clampToGround: true,
        stroke: Cesium.Color.GRAY,
        strokeWidth: 3
      });

      const entities = roadsDataSource.entities.values;
      entities.forEach(entity => {
        if (entity.polyline) {
          const highwayType = entity.properties.highway?.getValue();
          
          let color = Cesium.Color.GRAY;
          let width = 3;
          
          switch(highwayType) {
            case 'motorway':
              color = Cesium.Color.RED;
              width = 5;
              break;
            case 'trunk':
              color = Cesium.Color.ORANGE;
              width = 4.5;
              break;
            case 'primary':
              color = Cesium.Color.YELLOW;
              width = 4;
              break;
            case 'secondary':
              color = Cesium.Color.GREEN;
              width = 3.5;
              break;
            case 'tertiary':
              color = Cesium.Color.BLUE;
              width = 3;
              break;
            case 'residential':
              color = Cesium.Color.WHITE;
              width = 2;
              break;
            default:
              color = Cesium.Color.GRAY;
              width = 2;
          }
          
          entity.polyline.material = color;
          entity.polyline.width = width;
        }
      });

      roadsDataSourceRef.current = roadsDataSource;
      viewerRef.current.dataSources.add(roadsDataSource);
      return roadsDataSource;
    } catch (error) {
      console.error('Error loading roads data:', error);
      viewerRef.current.entities.add({
        position: Cesium.Cartesian3.fromDegrees(0, 0),
        label: {
          text: 'Failed to load roads data',
          font: '20px sans-serif',
          fillColor: Cesium.Color.RED
        }
      });
      return null;
    }
  };

  const loadHeatmapData = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/crowd-data');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const crowdData = await response.json();
      const heatmapDataSource = new Cesium.CustomDataSource('heatmap');
      
      crowdData.forEach(camera => {
        const { longitude, latitude, crowdCount } = camera;
        const intensity = Math.min(crowdCount / 100, 1);
        const color = Cesium.Color.fromHsl(
          (1 - intensity) * 0.6,
          1,
          0.5 + intensity * 0.5,
          0.7
        );
        
        heatmapDataSource.entities.add({
          position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
          point: {
            pixelSize: 20 + intensity * 30,
            color: color,
            outlineColor: Cesium.Color.WHITE.withAlpha(0.3),
            outlineWidth: 1,
            show: showHeatmap
          },
          properties: {
            crowdCount: crowdCount,
            cameraId: camera.id
          }
        });
        
        if (crowdCount > 50) {
          heatmapDataSource.entities.add({
            position: Cesium.Cartesian3.fromDegrees(longitude, latitude, 10),
            label: {
              text: crowdCount.toString(),
              font: '12px sans-serif',
              fillColor: Cesium.Color.WHITE,
              outlineColor: Cesium.Color.BLACK,
              outlineWidth: 2,
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              pixelOffset: new Cesium.Cartesian2(0, -10),
              show: showHeatmap && viewerRef.current?.camera.positionCartographic.height < 1000
            }
          });
        }
      });
      
      viewerRef.current.dataSources.add(heatmapDataSource);
      heatmapDataSourceRef.current = heatmapDataSource;
      
    } catch (error) {
      console.error('Error loading heatmap data:', error);
      viewerRef.current.entities.add({
        position: Cesium.Cartesian3.fromDegrees(0, 0),
        label: {
          text: 'Failed to load crowd heatmap',
          font: '20px sans-serif',
          fillColor: Cesium.Color.RED
        }
      });
    }
  };

  const addMovingVehicles = useCallback(async () => {
    if (!viewerRef.current || !roadsDataSourceRef.current) return;
  
    // Clear existing vehicles
    vehiclesRef.current.forEach(vehicle => {
      viewerRef.current.entities.remove(vehicle);
    });
    vehiclesRef.current = [];
  
    // Get all road entities
    const roadEntities = roadsDataSourceRef.current.entities.values;
    const roads = [];
  
    // Pre-process road positions to include terrain heights
    for (const entity of roadEntities) {
      if (entity.polyline) {
        const positions = entity.polyline.positions.getValue();
        
        // Sample terrain for all road points
        const cartographics = positions.map(pos => 
          Cesium.Cartographic.fromCartesian(pos)
        );
        
        try {
          const updatedPositions = await Cesium.sampleTerrainMostDetailed(
            viewerRef.current.terrainProvider,
            cartographics
          );
          
          const terrainAdjustedPositions = updatedPositions.map(cartographic => 
            Cesium.Cartesian3.fromRadians(
              cartographic.longitude,
              cartographic.latitude,
              cartographic.height + 0.5 // Add 0.5m to ensure vehicle is above ground
            )
          );
          
          roads.push({
            positions: terrainAdjustedPositions,
            type: entity.properties?.highway?.getValue() || 'residential'
          });
        } catch (error) {
          console.error("Error sampling road terrain:", error);
          roads.push({
            positions: positions,
            type: entity.properties?.highway?.getValue() || 'residential'
          });
        }
      }
    }
  
    // Vehicle configurations
    const vehicleTypes = [
      { model: '/models/car.glb', scale: 1.0, speed: 0.005 },
      { model: '/models/car.glb', scale: 1.5, speed: 0.005 },
      { model: '/models/car.glb', scale: 1.8, speed: 0.005 }
    ];
  
    // Create random vehicles
    for (let i = 0; i < 20; i++) {
      const road = roads[Math.floor(Math.random() * roads.length)];
      if (!road || road.positions.length < 2) continue;
  
      const vehicleType = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
  
      const vehicle = viewerRef.current.entities.add({
        name: `Vehicle ${i + 1}`,
        position: road.positions[0],
        model: {
          uri: vehicleType.model,
          minimumPixelSize: 32,
          maximumScale: 20000,
          scale: vehicleType.scale
        }
      });
  
      vehicle.roadPositions = road.positions;
      vehicle.currentPositionIndex = 0;
      vehicle.speed = vehicleType.speed * (0.8 + Math.random() * 0.4);
      vehicle.roadType = road.type;
      vehicle.targetPositionIndex = 1; // Start moving toward the next point
  
      vehiclesRef.current.push(vehicle);
    }
  
    // Animation function
    const animateVehicles = () => {
      if (!viewerRef.current) return;
  
      const now = Cesium.JulianDate.now();
      
      vehiclesRef.current.forEach(vehicle => {
        if (!vehicle.roadPositions || vehicle.roadPositions.length < 2) return;
  
        const currentTargetIndex = vehicle.targetPositionIndex;
        const currentPos = vehicle.position.getValue(now);
        const targetPos = vehicle.roadPositions[currentTargetIndex];
        
        // Calculate direction to target
        const direction = Cesium.Cartesian3.subtract(targetPos, currentPos, new Cesium.Cartesian3());
        const distance = Cesium.Cartesian3.magnitude(direction);
        
        if (distance < 2) {
          // Reached target point, move to next
          vehicle.targetPositionIndex = (currentTargetIndex + 1) % vehicle.roadPositions.length;
          return;
        }
        
        const normalizedDirection = Cesium.Cartesian3.normalize(direction, new Cesium.Cartesian3());
        const movement = Cesium.Cartesian3.multiplyByScalar(
          normalizedDirection, 
          Math.min(vehicle.speed, distance), // Don't overshoot target
          new Cesium.Cartesian3()
        );
        
        const newPosition = Cesium.Cartesian3.add(currentPos, movement, new Cesium.Cartesian3());
        
        // Adjust vehicle position and orientation
        vehicle.position = newPosition;
        
        // Calculate heading (yaw) from direction vector
        const heading = Math.atan2(direction.y, direction.x);
        
        // Calculate pitch based on terrain slope
        let pitch = 0;
        if (currentTargetIndex > 0) {
          const prevPos = vehicle.roadPositions[currentTargetIndex - 1];
          const verticalChange = targetPos.z - prevPos.z;
          const horizontalDistance = Cesium.Cartesian3.distance(
            new Cesium.Cartesian3(prevPos.x, prevPos.y, 0),
            new Cesium.Cartesian3(targetPos.x, targetPos.y, 0)
          );
          pitch = Math.atan2(verticalChange, horizontalDistance);
        }
        
        vehicle.orientation = Cesium.Quaternion.fromHeadingPitchRoll(
          new Cesium.HeadingPitchRoll(heading, pitch, 0)
        );
      });
      
      requestAnimationFrame(animateVehicles);
    };
  
    animateVehicles();
  }, [roadsDataSourceRef.current]);

  useEffect(() => {
    if (!isLoading && showRoads && showVehicles && roadsDataSourceRef.current) {
      addMovingVehicles();
    }
  }, [isLoading, showRoads, showVehicles, addMovingVehicles]);

  const toggleHeatmap = useCallback(async () => {
    const newShowState = !showHeatmap;
    setShowHeatmap(newShowState);
    
    if (heatmapDataSourceRef.current) {
      heatmapDataSourceRef.current.entities.values.forEach(entity => {
        if (entity.point) entity.point.show = newShowState;
        if (entity.label) entity.label.show = newShowState;
      });
    } else {
      await loadHeatmapData();
    }
    
    setStatus(`Heatmap is now ${newShowState ? 'visible' : 'hidden'}`);
  }, [showHeatmap]);

  const toggleRoads = useCallback(async () => {
    const newShowState = !showRoads;
    setShowRoads(newShowState);
    
    if (roadsDataSourceRef.current) {
      roadsDataSourceRef.current.show = newShowState;
      if (newShowState && showVehicles) {
        await addMovingVehicles();
      }
    } else {
      await loadRoadsData();
      if (newShowState && showVehicles) {
        await addMovingVehicles();
      }
    }
    
    setStatus(`Roads are now ${newShowState ? 'visible' : 'hidden'}`);
  }, [showRoads, showVehicles, addMovingVehicles]);

  const toggleVehicles = useCallback(async () => {
    const newShowState = !showVehicles;
    setShowVehicles(newShowState);
    
    if (newShowState && roadsDataSourceRef.current?.show) {
      await addMovingVehicles();
    } else {
      vehiclesRef.current.forEach(vehicle => {
        viewerRef.current.entities.remove(vehicle);
      });
      vehiclesRef.current = [];
    }
    
    setStatus(`Vehicles are now ${newShowState ? 'visible' : 'hidden'}`);
  }, [showVehicles]);

  const setupZoomListener = useCallback(() => {
    const checkZoomLevel = () => {
      if (!viewerRef.current) return;
      const cameraHeight = viewerRef.current.camera.positionCartographic.height;
      buildingLabelsRef.current.forEach(labelEntity => {
        labelEntity.label.show = cameraHeight < zoomThreshold;
      });
      
      if (heatmapDataSourceRef.current) {
        heatmapDataSourceRef.current.entities.values.forEach(entity => {
          if (entity.label) {
            entity.label.show = showHeatmap && cameraHeight < 1000;
          }
        });
      }
    };

    viewerRef.current.camera.changed.addEventListener(checkZoomLevel);
    checkZoomLevel();
  }, [showHeatmap]);

  const toggleTileset = useCallback(() => {
    if (tilesetRef.current) {
      tilesetRef.current.show = !tilesetRef.current.show;
      setStatus(`3D Tileset is now ${tilesetRef.current.show ? 'visible' : 'hidden'}`);
    }
  }, []);

  const toggleGeoJson = useCallback(() => {
    if (geoJsonDataSourceRef.current) {
      const isVisible = !geoJsonDataSourceRef.current.show;
      geoJsonDataSourceRef.current.show = isVisible;
      setStatus(`GeoJSON data is now ${isVisible ? 'visible' : 'hidden'}`);
  
      // Toggle building labels visibility
      buildingLabelsRef.current.forEach(label => {
        label.show = isVisible;  // Sync visibility
      });
    }
  }, []);
  

  const handleMapClick = useCallback(async (movement) => {
    if (!viewerRef.current) return;

    const pickedObject = viewerRef.current.scene.pick(movement.position);
    if (pickedObject && pickedObject.id && pickedObject.id.properties) {
      if (pickedObject.id.properties.video) {
        const videoUrl = pickedObject.id.properties.video.getValue();
        const videoTitle = pickedObject.id.properties['@id'].getValue();
        setVideoUrl(videoUrl);
        setVideoTitle(videoTitle);
        setShowVideoModal(true);
      }
      return;
    }

    const ray = viewerRef.current.camera.getPickRay(movement.position);
    const position = viewerRef.current.scene.globe.pick(ray, viewerRef.current.scene);
    if (!position) return;

    try {
      const cartographic = Cesium.Cartographic.fromCartesian(position);
      const [updatedCartographic] = await Cesium.sampleTerrainMostDetailed(
        viewerRef.current.terrainProvider, 
        [cartographic]
      );

      const longitude = Cesium.Math.toDegrees(updatedCartographic.longitude);
      const latitude = Cesium.Math.toDegrees(updatedCartographic.latitude);

      const anchorName = window.prompt("Enter a name for the anchor point:");
      if (!anchorName) return;

      const videoUrl = window.prompt("Enter a video URL (optional):");

      const newFeature = {
        type: "Feature",
        properties: {
          "@id": anchorName,
          video: videoUrl || null
        },
        geometry: {
          type: "Point",
          coordinates: [longitude, latitude]
        }
      };

      const dataSource = await Cesium.GeoJsonDataSource.load(newFeature, {
        clampToGround: true,
        markerColor: Cesium.Color.RED,
        markerSymbol: '?'
      });
      
      viewerRef.current.dataSources.add(dataSource);
      await viewerRef.current.zoomTo(dataSource);
      
      try {
        const response = await fetch('http://localhost:8081/api/geojson', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: "FeatureCollection",
            features: [...geoJsonDataSourceRef.current.entities.values.map(e => ({
              type: "Feature",
              properties: e.properties.getValue(),
              geometry: e.position ? {
                type: "Point",
                coordinates: [
                  Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(e.position.getValue()).longitude),
                  Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(e.position.getValue()).latitude)
                ]
              } : null
            })), newFeature]
          })
        });

        if (!response.ok) {
          throw new Error('Failed to update backend');
        }

        await loadGeoJsonData();
        setStatus(`Added new anchor point: ${anchorName}`);
      } catch (error) {
        console.error("Error updating backend:", error);
        setStatus('Added point locally but failed to save to backend');
      }
    } catch (error) {
      console.error("Error adding anchor point:", error);
      setStatus('Failed to add anchor point');
    }
  }, []);

  useEffect(() => {
    if (!viewerRef.current || isLoading) return;
  
    const { canvas, scene, entities } = viewerRef.current;
    if (!canvas || !scene || !entities) return;  // Prevent undefined errors
  
    const handler = new Cesium.ScreenSpaceEventHandler(canvas);
    handler.setInputAction(handleMapClick, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  
    return () => {
      handler.destroy();
    };
  }, [isLoading, handleMapClick]);
  
  

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div 
        ref={cesiumContainer} 
        style={{ 
          width: '100%', 
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0
        }} 
      />
      
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.7)',
          zIndex: 999
        }}>
          <div style={{ color: 'white', fontSize: '20px' }}>Loading map...</div>
        </div>
      )}
      
      {/* Controls */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.8)',
        padding: '10px',
        borderRadius: '5px'
      }}>
        <button onClick={() => setStatus('Click on the map to add an anchor point')}>
          Add Anchor
        </button>
        <p>{status}</p>
      </div>
      
      {/* Toggle buttons */}
      <div style={{
        position: 'absolute',
        top: '60px',
        right: '10px',
        zIndex: 1000,
        display: 'flex',
        gap: '10px',
        flexDirection: 'column'
      }}>
        <button 
          onClick={toggleTileset}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '10px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Toggle 3D Tileset
        </button>
        <button 
          onClick={toggleGeoJson}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '10px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Toggle GeoJSON
        </button>
        <button 
          onClick={toggleRoads}
          style={{
            backgroundColor: showRoads ? 'rgba(100, 100, 100, 0.9)' : 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '10px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {showRoads ? 'Hide Roads' : 'Show Roads'}
        </button>
        <button 
          onClick={toggleVehicles}
          style={{
            backgroundColor: showVehicles ? 'rgba(50, 150, 200, 0.9)' : 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '10px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {showVehicles ? 'Hide Vehicles' : 'Show Vehicles'}
        </button>
        <button 
          onClick={toggleHeatmap}
          style={{
            backgroundColor: showHeatmap ? 'rgba(255, 100, 0, 0.9)' : 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '10px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}
        </button>
      </div>
      
      {/* Video Modal */}
      {showVideoModal && (
        <div style={{
          position: 'fixed',
          zIndex: 1001,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          width: '80%',
          maxWidth: '600px'
        }}>
          <span 
            style={{ float: 'right', fontSize: '20px', cursor: 'pointer' }}
            onClick={() => setShowVideoModal(false)}
          >
            &times;
          </span>
          <h3>{videoTitle}</h3>
          <video 
            width="100%" 
            controls
            autoPlay
            onEnded={() => setShowVideoModal(false)}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
};

export default Maps;
