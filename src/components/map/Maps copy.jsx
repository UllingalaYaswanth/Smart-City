// // // import React, { useEffect, useRef, useState, useCallback } from 'react';
// // // import * as Cesium from 'cesium';
// // // import 'cesium/Build/Cesium/Widgets/widgets.css';

// // // // Set base URL for Cesium assets
// // // window.CESIUM_BASE_URL = '/node_modules/cesium/Build/Cesium/';

// // // const Maps = () => {
// // //   const cesiumContainer = useRef(null);
// // //   const viewerRef = useRef(null);
// // //   const tilesetRef = useRef(null);
// // //   const geoJsonDataSourceRef = useRef(null);
// // //   const buildingLabelsRef = useRef([]);
// // //   const [status, setStatus] = useState('Click on the map to add an anchor point.');
// // //   const [showVideoModal, setShowVideoModal] = useState(false);
// // //   const [videoUrl, setVideoUrl] = useState('');
// // //   const [videoTitle, setVideoTitle] = useState('');
// // //   const [isLoading, setIsLoading] = useState(true);
// // //   const zoomThreshold = 500;

// // //   // Memoized terrain creation to prevent recreation on rerenders
// // //   const createTerrain = useCallback(async () => {
// // //     return await Cesium.createWorldTerrainAsync({
// // //       requestWaterMask: true,
// // //       requestVertexNormals: true
// // //     });
// // //   }, []);

// // //   // Initialize viewer and load data
// // //   useEffect(() => {
// // //     let isMounted = true;
// // //     const initViewer = async () => {
// // //       try {
// // //         Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YjhlMmVkNC1hYWVjLTQxYWEtOGZhYS1iOGQyNDUxY2ZlMTUiLCJpZCI6MjY0Nzg3LCJpYXQiOjE3MzUxMTAzMzV9.tdJk1ppDaw9AEy9bFB6RBU9T3H0-xOlIqVlrjDBJGQo";
        
// // //         // Initialize subsystems in parallel
// // //         await Promise.all([
// // //           Cesium.Ion.defaultAccessToken,
// // //           Cesium.ApproximateTerrainHeights.initialize()
// // //         ]);

// // //         const terrainProvider = await createTerrain();

// // //         if (!isMounted) return;

// // //         // Configure viewer with optimized settings
// // //         viewerRef.current = new Cesium.Viewer(cesiumContainer.current, {
// // //           terrainProvider,
// // //           timeline: false,
// // //           animation: false,
// // //           baseLayerPicker: true, // Disable for better performance
// // //           sceneMode: Cesium.SceneMode.SCENE3D,
// // //           shouldAnimate: true,
// // //           imageryProvider: new Cesium.IonImageryProvider({ assetId: 3845 }), // Default Cesium World Imagery
// // //           creditContainer: document.createElement('div'),
// // //           scene3DOnly: true, // Improve performance
// // //           orderIndependentTranslucency: false, // Improve performance
// // //           shadows: false // Improve performance
// // //         });

// // //         // Disable features we don't need for better performance
// // //         viewerRef.current.scene.globe.showGroundAtmosphere = false;
// // //         viewerRef.current.scene.fog.enabled = false;
// // //         viewerRef.current.scene.skyAtmosphere.show = false;

// // //         // Load data in parallel
// // //         await Promise.all([
// // //           load3DTileset(),
// // //           loadGeoJsonData()
// // //         ]);

// // //         if (isMounted) {
// // //           setIsLoading(false);
// // //         }
// // //       } catch (error) {
// // //         console.error('Error initializing Cesium:', error);
// // //         if (isMounted) {
// // //           setStatus('Failed to initialize map');
// // //           setIsLoading(false);
// // //         }
// // //       }
// // //     };

// // //     initViewer();

// // //     return () => {
// // //       isMounted = false;
// // //       if (viewerRef.current && !viewerRef.current.isDestroyed()) {
// // //         viewerRef.current.destroy();
// // //       }
// // //     };
// // //   }, [createTerrain]);

// // //   const load3DTileset = async () => {
// // //     try {
// // //       const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(3048665, {
// // //         show: false // Start with tileset hidden for better performance
// // //       });
      
// // //       // Optimize tileset performance
// // //       tileset.maximumScreenSpaceError = 2; // Lower quality for better performance
// // //       tileset.dynamicScreenSpaceError = true;
// // //       tileset.dynamicScreenSpaceErrorDensity = 0.00278;
// // //       tileset.dynamicScreenSpaceErrorFactor = 4.0;
// // //       tileset.dynamicScreenSpaceErrorHeightFalloff = 0.25;
      
// // //       viewerRef.current.scene.primitives.add(tileset);
// // //       tilesetRef.current = tileset;

// // //       // Apply default style if available
// // //       const extras = tileset.asset.extras;
// // //       if (extras?.ion?.defaultStyle) {
// // //         tileset.style = new Cesium.Cesium3TileStyle(extras.ion.defaultStyle);
// // //       }

// // //       await viewerRef.current.zoomTo(tileset);
// // //     } catch (error) {
// // //       console.error('Error loading 3D tileset:', error);
// // //       viewerRef.current.entities.add({
// // //         position: Cesium.Cartesian3.fromDegrees(0, 0),
// // //         label: {
// // //           text: 'Failed to load 3D tileset',
// // //           font: '20px sans-serif',
// // //           fillColor: Cesium.Color.RED
// // //         }
// // //       });
// // //     }
// // //   };

// // //   const loadGeoJsonData = async () => {
// // //     try {
// // //       // Fetch from backend API instead of direct file URL
// // //       const response = await fetch('http://localhost:8081/api/geojson');
// // //       if (!response.ok) {
// // //         throw new Error(`HTTP error! status: ${response.status}`);
// // //       }
// // //       const geojsonData = await response.json();
// // //       console.log("geojon data",geojsonData)
// // //       const dataSource = await Cesium.GeoJsonDataSource.load(geojsonData, {
// // //         clampToGround: false,
// // //         stroke: Cesium.Color.BLUE,
// // //         fill: Cesium.Color.BLUE.withAlpha(0.5),
// // //         strokeWidth: 3
// // //       });

// // //       geoJsonDataSourceRef.current = dataSource;
// // //       viewerRef.current.dataSources.add(dataSource);

// // //       // Process entities
// // //       const entities = dataSource.entities.values;
// // //       const buildingLabels = [];

// // //       entities.forEach(entity => {
// // //         if (entity.polygon) {
// // //           const buildingName = entity.properties['@id'] || 'Unknown Building';
// // //           const positions = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;
// // //           const center = Cesium.Cartesian3.fromDegrees(
// // //             Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(positions[0]).longitude),
// // //             Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(positions[0]).latitude),
// // //             0
// // //           );

// // //           const labelEntity = viewerRef.current.entities.add({
// // //             position: center,
// // //             label: {
// // //               text: buildingName,
// // //               font: '14px sans-serif',
// // //               fillColor: Cesium.Color.WHITE,
// // //               scale: 1.5,
// // //               pixelOffset: new Cesium.Cartesian2(0, -30),
// // //               show: false
// // //             }
// // //           });

// // //           buildingLabels.push(labelEntity);

// // //           const height = entity.properties.height ? entity.properties.height.getValue() : 10;
// // //           entity.polygon.extrudedHeight = height;
// // //           entity.polygon.material = Cesium.Color.BLUE.withAlpha(0.6);
// // //           entity.polygon.outline = true;
// // //           entity.polygon.outlineColor = Cesium.Color.BLUE;
// // //         }

// // //         if (entity.position && entity.properties.video) {
// // //           const videoUrl = entity.properties.video;
// // //           entity.description = `
// // //             <h3>${entity.properties['@id']}</h3>
// // //             <video width="320" height="240" controls>
// // //               <source src="${videoUrl}" type="video/mp4">
// // //               Your browser does not support the video tag.
// // //             </video>
// // //           `;
// // //         }
// // //       });

// // //       buildingLabelsRef.current = buildingLabels;
// // //       setupZoomListener();
// // //       await viewerRef.current.zoomTo(dataSource);
// // //     } catch (error) {
// // //       console.error('Error loading GeoJSON:', error);
// // //       // Show error message on the map
// // //       viewerRef.current.entities.add({
// // //         position: Cesium.Cartesian3.fromDegrees(0, 0),
// // //         label: {
// // //           text: 'Failed to load GeoJSON data',
// // //           font: '20px sans-serif',
// // //           fillColor: Cesium.Color.RED
// // //         }
// // //       });
// // //     }
// // //   };

// // //   const setupZoomListener = useCallback(() => {
// // //     const checkZoomLevel = () => {
// // //       if (!viewerRef.current) return;
// // //       const cameraHeight = viewerRef.current.camera.positionCartographic.height;
// // //       buildingLabelsRef.current.forEach(labelEntity => {
// // //         labelEntity.label.show = cameraHeight < zoomThreshold;
// // //       });
// // //     };

// // //     viewerRef.current.camera.changed.addEventListener(checkZoomLevel);
// // //     checkZoomLevel();
// // //   }, []);

// // //   const toggleTileset = useCallback(() => {
// // //     if (tilesetRef.current) {
// // //       tilesetRef.current.show = !tilesetRef.current.show;
// // //       setStatus(`3D Tileset is now ${tilesetRef.current.show ? 'visible' : 'hidden'}`);
// // //     }
// // //   }, []);

// // //   const toggleGeoJson = useCallback(() => {
// // //     if (geoJsonDataSourceRef.current) {
// // //       geoJsonDataSourceRef.current.show = !geoJsonDataSourceRef.current.show;
// // //       setStatus(`GeoJSON data is now ${geoJsonDataSourceRef.current.show ? 'visible' : 'hidden'}`);
// // //     }
// // //   }, []);

// // //   const handleMapClick = useCallback(async (movement) => {
// // //     if (!viewerRef.current) return;

// // //     const pickedObject = viewerRef.current.scene.pick(movement.position);
// // //     if (pickedObject && pickedObject.id && pickedObject.id.properties) {
// // //       // Handle click on existing feature
// // //       if (pickedObject.id.properties.video) {
// // //         const videoUrl = pickedObject.id.properties.video.getValue();
// // //         const videoTitle = pickedObject.id.properties['@id'].getValue();
// // //         setVideoUrl(videoUrl);
// // //         setVideoTitle(videoTitle);
// // //         setShowVideoModal(true);
// // //       }
// // //       return;
// // //     }

// // //     // Handle adding new anchor point
// // //     const ray = viewerRef.current.camera.getPickRay(movement.position);
// // //     const position = viewerRef.current.scene.globe.pick(ray, viewerRef.current.scene);
// // //     if (!position) return;

// // //     try {
// // //       const cartographic = Cesium.Cartographic.fromCartesian(position);
// // //       const [updatedCartographic] = await Cesium.sampleTerrainMostDetailed(
// // //         viewerRef.current.terrainProvider, 
// // //         [cartographic]
// // //       );

// // //       const longitude = Cesium.Math.toDegrees(updatedCartographic.longitude);
// // //       const latitude = Cesium.Math.toDegrees(updatedCartographic.latitude);

// // //       const anchorName = window.prompt("Enter a name for the anchor point:");
// // //       if (!anchorName) return;

// // //       const videoUrl = window.prompt("Enter a video URL (optional):");

// // //       // Create new feature
// // //       const newFeature = {
// // //         type: "Feature",
// // //         properties: {
// // //           "@id": anchorName,
// // //           video: videoUrl || null
// // //         },
// // //         geometry: {
// // //           type: "Point",
// // //           coordinates: [longitude, latitude]
// // //         }
// // //       };

// // //       // First add to viewer
// // //       const dataSource = await Cesium.GeoJsonDataSource.load(newFeature, {
// // //         clampToGround: true,
// // //         markerColor: Cesium.Color.RED,
// // //         markerSymbol: '?'
// // //       });
      
// // //       viewerRef.current.dataSources.add(dataSource);
// // //       await viewerRef.current.zoomTo(dataSource);
      
// // //       // Then update backend
// // //       try {
// // //         const response = await fetch('http://localhost:8081/api/geojson', {
// // //           method: 'POST',
// // //           headers: {
// // //             'Content-Type': 'application/json',
// // //           },
// // //           body: JSON.stringify({
// // //             type: "FeatureCollection",
// // //             features: [...geoJsonDataSourceRef.current.entities.values.map(e => ({
// // //               type: "Feature",
// // //               properties: e.properties.getValue(),
// // //               geometry: e.position ? {
// // //                 type: "Point",
// // //                 coordinates: [
// // //                   Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(e.position.getValue()).longitude),
// // //                   Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(e.position.getValue()).latitude)
// // //                 ]
// // //               } : null
// // //             })), newFeature]
// // //           })
// // //         });

// // //         if (!response.ok) {
// // //           throw new Error('Failed to update backend');
// // //         }

// // //         // Reload data to ensure consistency
// // //         await loadGeoJsonData();
// // //         setStatus(`Added new anchor point: ${anchorName}`);
// // //       } catch (error) {
// // //         console.error("Error updating backend:", error);
// // //         setStatus('Added point locally but failed to save to backend');
// // //       }
// // //     } catch (error) {
// // //       console.error("Error adding anchor point:", error);
// // //       setStatus('Failed to add anchor point');
// // //     }
// // //   }, []);

// // //   // Setup click handler after viewer is initialized
// // //   useEffect(() => {
// // //     if (!viewerRef.current || isLoading) return;

// // //     const handler = new Cesium.ScreenSpaceEventHandler(viewerRef.current.canvas);
// // //     handler.setInputAction(handleMapClick, Cesium.ScreenSpaceEventType.LEFT_CLICK);

// // //     return () => {
// // //       handler.destroy();
// // //     };
// // //   }, [isLoading, handleMapClick]);

// // //   return (
// // //     <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
// // //       <div 
// // //         ref={cesiumContainer} 
// // //         style={{ 
// // //           width: '100%', 
// // //           height: '100%',
// // //           position: 'absolute',
// // //           top: 0,
// // //           left: 0
// // //         }} 
// // //       />
      
// // //       {isLoading && (
// // //         <div style={{
// // //           position: 'absolute',
// // //           top: 0,
// // //           left: 0,
// // //           width: '100%',
// // //           height: '100%',
// // //           display: 'flex',
// // //           justifyContent: 'center',
// // //           alignItems: 'center',
// // //           backgroundColor: 'rgba(0,0,0,0.7)',
// // //           zIndex: 999
// // //         }}>
// // //           <div style={{ color: 'white', fontSize: '20px' }}>Loading map...</div>
// // //         </div>
// // //       )}
      
// // //       {/* Controls */}
// // //       <div style={{
// // //         position: 'absolute',
// // //         top: '10px',
// // //         left: '10px',
// // //         zIndex: 1000,
// // //         background: 'rgba(255, 255, 255, 0.8)',
// // //         padding: '10px',
// // //         borderRadius: '5px'
// // //       }}>
// // //         <button onClick={() => setStatus('Click on the map to add an anchor point')}>
// // //           Add Anchor
// // //         </button>
// // //         <p>{status}</p>
// // //       </div>
      
// // //       {/* Toggle buttons */}
// // //       <div style={{
// // //         position: 'absolute',
// // //         top: '60px',
// // //         right: '10px',
// // //         zIndex: 1000,
// // //         display: 'flex',
// // //         gap: '10px'
// // //       }}>
// // //         <button 
// // //           onClick={toggleTileset}
// // //           style={{
// // //             backgroundColor: 'rgba(0, 0, 0, 0.7)',
// // //             color: 'white',
// // //             padding: '10px',
// // //             border: 'none',
// // //             borderRadius: '5px',
// // //             cursor: 'pointer'
// // //           }}
// // //         >
// // //           Toggle 3D Tileset
// // //         </button>
// // //         <button 
// // //           onClick={toggleGeoJson}
// // //           style={{
// // //             backgroundColor: 'rgba(0, 0, 0, 0.7)',
// // //             color: 'white',
// // //             padding: '10px',
// // //             border: 'none',
// // //             borderRadius: '5px',
// // //             cursor: 'pointer'
// // //           }}
// // //         >
// // //           Toggle GeoJSON
// // //         </button>
// // //       </div>
      
// // //       {/* Video Modal */}
// // //       {showVideoModal && (
// // //         <div style={{
// // //           position: 'fixed',
// // //           zIndex: 1001,
// // //           left: '50%',
// // //           top: '50%',
// // //           transform: 'translate(-50%, -50%)',
// // //           backgroundColor: 'white',
// // //           padding: '20px',
// // //           border: '1px solid #ccc',
// // //           borderRadius: '5px',
// // //           boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
// // //           width: '80%',
// // //           maxWidth: '600px'
// // //         }}>
// // //           <span 
// // //             style={{ float: 'right', fontSize: '20px', cursor: 'pointer' }}
// // //             onClick={() => setShowVideoModal(false)}
// // //           >
// // //             &times;
// // //           </span>
// // //           <h3>{videoTitle}</h3>
// // //           <video 
// // //             width="100%" 
// // //             controls
// // //             autoPlay
// // //             onEnded={() => setShowVideoModal(false)}
// // //           >
// // //             <source src={videoUrl} type="video/mp4" />
// // //             Your browser does not support the video tag.
// // //           </video>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default Maps;

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
// //   const heatmapDataSourceRef = useRef(null);
// //   const buildingLabelsRef = useRef([]);
// //   const [status, setStatus] = useState('Click on the map to add an anchor point.');
// //   const [showVideoModal, setShowVideoModal] = useState(false);
// //   const [videoUrl, setVideoUrl] = useState('');
// //   const [videoTitle, setVideoTitle] = useState('');
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [showHeatmap, setShowHeatmap] = useState(false);
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
// //           loadGeoJsonData(),
// //           loadHeatmapData()
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

// //   // Load heatmap data based on crowd density
// //   const loadHeatmapData = async () => {
// //     try {
// //       // Fetch crowd data from backend
// //       const response = await fetch('http://localhost:8081/api/crowd-data');
// //       if (!response.ok) {
// //         throw new Error(`HTTP error! status: ${response.status}`);
// //       }
      
// //       const crowdData = await response.json();
      
// //       // Create a new data source for heatmap
// //       const heatmapDataSource = new Cesium.CustomDataSource('heatmap');
      
// //       // Process each camera point with crowd data
// //       crowdData.forEach(camera => {
// //         const { longitude, latitude, crowdCount } = camera;
        
// //         // Calculate heatmap color based on crowd count
// //         const intensity = Math.min(crowdCount / 100, 1); // Normalize to 0-1 range
// //         const color = Cesium.Color.fromHsl(
// //           (1 - intensity) * 0.6, // Hue (blue to red)
// //           1, // Saturation
// //           0.5 + intensity * 0.5, // Lightness
// //           0.7 // Alpha
// //         );
        
// //         // Create a point for the heatmap
// //         heatmapDataSource.entities.add({
// //           position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
// //           point: {
// //             pixelSize: 20 + intensity * 30, // Bigger for more crowd
// //             color: color,
// //             outlineColor: Cesium.Color.WHITE.withAlpha(0.3),
// //             outlineWidth: 1,
// //             show: showHeatmap
// //           },
// //           properties: {
// //             crowdCount: crowdCount,
// //             cameraId: camera.id
// //           }
// //         });
        
// //         // Optionally add a label showing the count
// //         if (crowdCount > 50) {
// //           heatmapDataSource.entities.add({
// //             position: Cesium.Cartesian3.fromDegrees(longitude, latitude, 10),
// //             label: {
// //               text: crowdCount.toString(),
// //               font: '12px sans-serif',
// //               fillColor: Cesium.Color.WHITE,
// //               outlineColor: Cesium.Color.BLACK,
// //               outlineWidth: 2,
// //               style: Cesium.LabelStyle.FILL_AND_OUTLINE,
// //               verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
// //               pixelOffset: new Cesium.Cartesian2(0, -10),
// //               show: showHeatmap && viewerRef.current?.camera.positionCartographic.height < 1000
// //             }
// //           });
// //         }
// //       });
      
// //       // Add to viewer
// //       viewerRef.current.dataSources.add(heatmapDataSource);
// //       heatmapDataSourceRef.current = heatmapDataSource;
      
// //     } catch (error) {
// //       console.error('Error loading heatmap data:', error);
// //       viewerRef.current.entities.add({
// //         position: Cesium.Cartesian3.fromDegrees(0, 0),
// //         label: {
// //           text: 'Failed to load crowd heatmap',
// //           font: '20px sans-serif',
// //           fillColor: Cesium.Color.RED
// //         }
// //       });
// //     }
// //   };

// //   const toggleHeatmap = useCallback(async () => {
// //     const newShowState = !showHeatmap;
// //     setShowHeatmap(newShowState);
    
// //     if (heatmapDataSourceRef.current) {
// //       heatmapDataSourceRef.current.entities.values.forEach(entity => {
// //         if (entity.point) entity.point.show = newShowState;
// //         if (entity.label) entity.label.show = newShowState;
// //       });
// //     } else {
// //       // Load data if not already loaded
// //       await loadHeatmapData();
// //     }
    
// //     setStatus(`Heatmap is now ${newShowState ? 'visible' : 'hidden'}`);
// //   }, [showHeatmap]);

// //   const setupZoomListener = useCallback(() => {
// //     const checkZoomLevel = () => {
// //       if (!viewerRef.current) return;
// //       const cameraHeight = viewerRef.current.camera.positionCartographic.height;
// //       buildingLabelsRef.current.forEach(labelEntity => {
// //         labelEntity.label.show = cameraHeight < zoomThreshold;
// //       });
      
// //       // Update heatmap labels visibility
// //       if (heatmapDataSourceRef.current) {
// //         heatmapDataSourceRef.current.entities.values.forEach(entity => {
// //           if (entity.label) {
// //             entity.label.show = showHeatmap && cameraHeight < 1000;
// //           }
// //         });
// //       }
// //     };

// //     viewerRef.current.camera.changed.addEventListener(checkZoomLevel);
// //     checkZoomLevel();
// //   }, [showHeatmap]);

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
// //         <button 
// //           onClick={toggleHeatmap}
// //           style={{
// //             backgroundColor: showHeatmap ? 'rgba(255, 100, 0, 0.9)' : 'rgba(0, 0, 0, 0.7)',
// //             color: 'white',
// //             padding: '10px',
// //             border: 'none',
// //             borderRadius: '5px',
// //             cursor: 'pointer'
// //           }}
// //         >
// //           {showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}
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
// //   const roadsDataSourceRef = useRef(null);
// //   const heatmapDataSourceRef = useRef(null);
// //   const buildingLabelsRef = useRef([]);
// //   const [status, setStatus] = useState('Click on the map to add an anchor point.');
// //   const [showVideoModal, setShowVideoModal] = useState(false);
// //   const [videoUrl, setVideoUrl] = useState('');
// //   const [videoTitle, setVideoTitle] = useState('');
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [showHeatmap, setShowHeatmap] = useState(false);
// //   const [showRoads, setShowRoads] = useState(true);
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
// //           loadGeoJsonData(),
// //           loadRoadsData(),
// //           loadHeatmapData()
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
// //       tileset.maximumScreenSpaceError = 2;
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

// //   const loadRoadsData = async () => {
// //     try {
// //       // Fetch roads data from backend API
// //       const response = await fetch('http://localhost:8081/api/roads');
// //       if (!response.ok) {
// //         throw new Error(`HTTP error! status: ${response.status}`);
// //       }
// //       const roadsData = await response.json();
      
// //       // Create a new data source for roads
// //       const roadsDataSource = await Cesium.GeoJsonDataSource.load(roadsData, {
// //         clampToGround: true,
// //         stroke: Cesium.Color.GRAY,
// //         strokeWidth: 3
// //       });

// //       // Style the roads based on their type
// //       const entities = roadsDataSource.entities.values;
// //       entities.forEach(entity => {
// //         if (entity.polyline) {
// //           // Customize road appearance based on highway type
// //           const highwayType = entity.properties.highway?.getValue();
          
// //           let color = Cesium.Color.GRAY;
// //           let width = 3;
          
// //           switch(highwayType) {
// //             case 'motorway':
// //               color = Cesium.Color.RED;
// //               width = 5;
// //               break;
// //             case 'trunk':
// //               color = Cesium.Color.ORANGE;
// //               width = 4.5;
// //               break;
// //             case 'primary':
// //               color = Cesium.Color.YELLOW;
// //               width = 4;
// //               break;
// //             case 'secondary':
// //               color = Cesium.Color.GREEN;
// //               width = 3.5;
// //               break;
// //             case 'tertiary':
// //               color = Cesium.Color.BLUE;
// //               width = 3;
// //               break;
// //             case 'residential':
// //               color = Cesium.Color.WHITE;
// //               width = 2;
// //               break;
// //             default:
// //               color = Cesium.Color.GRAY;
// //               width = 2;
// //           }
          
// //           entity.polyline.material = color;
// //           entity.polyline.width = width;
// //         }
// //       });

// //       roadsDataSourceRef.current = roadsDataSource;
// //       viewerRef.current.dataSources.add(roadsDataSource);
// //       return roadsDataSource;
// //     } catch (error) {
// //       console.error('Error loading roads data:', error);
// //       viewerRef.current.entities.add({
// //         position: Cesium.Cartesian3.fromDegrees(0, 0),
// //         label: {
// //           text: 'Failed to load roads data',
// //           font: '20px sans-serif',
// //           fillColor: Cesium.Color.RED
// //         }
// //       });
// //       return null;
// //     }
// //   };

// //   // Load heatmap data based on crowd density
// //   const loadHeatmapData = async () => {
// //     try {
// //       // Fetch crowd data from backend
// //       const response = await fetch('http://localhost:8081/api/crowd-data');
// //       if (!response.ok) {
// //         throw new Error(`HTTP error! status: ${response.status}`);
// //       }
      
// //       const crowdData = await response.json();
      
// //       // Create a new data source for heatmap
// //       const heatmapDataSource = new Cesium.CustomDataSource('heatmap');
      
// //       // Process each camera point with crowd data
// //       crowdData.forEach(camera => {
// //         const { longitude, latitude, crowdCount } = camera;
        
// //         // Calculate heatmap color based on crowd count
// //         const intensity = Math.min(crowdCount / 100, 1); // Normalize to 0-1 range
// //         const color = Cesium.Color.fromHsl(
// //           (1 - intensity) * 0.6, // Hue (blue to red)
// //           1, // Saturation
// //           0.5 + intensity * 0.5, // Lightness
// //           0.7 // Alpha
// //         );
        
// //         // Create a point for the heatmap
// //         heatmapDataSource.entities.add({
// //           position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
// //           point: {
// //             pixelSize: 20 + intensity * 30, // Bigger for more crowd
// //             color: color,
// //             outlineColor: Cesium.Color.WHITE.withAlpha(0.3),
// //             outlineWidth: 1,
// //             show: showHeatmap
// //           },
// //           properties: {
// //             crowdCount: crowdCount,
// //             cameraId: camera.id
// //           }
// //         });
        
// //         // Optionally add a label showing the count
// //         if (crowdCount > 50) {
// //           heatmapDataSource.entities.add({
// //             position: Cesium.Cartesian3.fromDegrees(longitude, latitude, 10),
// //             label: {
// //               text: crowdCount.toString(),
// //               font: '12px sans-serif',
// //               fillColor: Cesium.Color.WHITE,
// //               outlineColor: Cesium.Color.BLACK,
// //               outlineWidth: 2,
// //               style: Cesium.LabelStyle.FILL_AND_OUTLINE,
// //               verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
// //               pixelOffset: new Cesium.Cartesian2(0, -10),
// //               show: showHeatmap && viewerRef.current?.camera.positionCartographic.height < 1000
// //             }
// //           });
// //         }
// //       });
      
// //       // Add to viewer
// //       viewerRef.current.dataSources.add(heatmapDataSource);
// //       heatmapDataSourceRef.current = heatmapDataSource;
      
// //     } catch (error) {
// //       console.error('Error loading heatmap data:', error);
// //       viewerRef.current.entities.add({
// //         position: Cesium.Cartesian3.fromDegrees(0, 0),
// //         label: {
// //           text: 'Failed to load crowd heatmap',
// //           font: '20px sans-serif',
// //           fillColor: Cesium.Color.RED
// //         }
// //       });
// //     }
// //   };

// //   const toggleHeatmap = useCallback(async () => {
// //     const newShowState = !showHeatmap;
// //     setShowHeatmap(newShowState);
    
// //     if (heatmapDataSourceRef.current) {
// //       heatmapDataSourceRef.current.entities.values.forEach(entity => {
// //         if (entity.point) entity.point.show = newShowState;
// //         if (entity.label) entity.label.show = newShowState;
// //       });
// //     } else {
// //       // Load data if not already loaded
// //       await loadHeatmapData();
// //     }
    
// //     setStatus(`Heatmap is now ${newShowState ? 'visible' : 'hidden'}`);
// //   }, [showHeatmap]);

// //   const toggleRoads = useCallback(async () => {
// //     const newShowState = !showRoads;
// //     setShowRoads(newShowState);
    
// //     if (roadsDataSourceRef.current) {
// //       roadsDataSourceRef.current.show = newShowState;
// //     } else {
// //       // Load data if not already loaded
// //       await loadRoadsData();
// //     }
    
// //     setStatus(`Roads are now ${newShowState ? 'visible' : 'hidden'}`);
// //   }, [showRoads]);

// //   const setupZoomListener = useCallback(() => {
// //     const checkZoomLevel = () => {
// //       if (!viewerRef.current) return;
// //       const cameraHeight = viewerRef.current.camera.positionCartographic.height;
// //       buildingLabelsRef.current.forEach(labelEntity => {
// //         labelEntity.label.show = cameraHeight < zoomThreshold;
// //       });
      
// //       // Update heatmap labels visibility
// //       if (heatmapDataSourceRef.current) {
// //         heatmapDataSourceRef.current.entities.values.forEach(entity => {
// //           if (entity.label) {
// //             entity.label.show = showHeatmap && cameraHeight < 1000;
// //           }
// //         });
// //       }
// //     };

// //     viewerRef.current.camera.changed.addEventListener(checkZoomLevel);
// //     checkZoomLevel();
// //   }, [showHeatmap]);

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
// //         <button 
// //           onClick={toggleRoads}
// //           style={{
// //             backgroundColor: showRoads ? 'rgba(100, 100, 100, 0.9)' : 'rgba(0, 0, 0, 0.7)',
// //             color: 'white',
// //             padding: '10px',
// //             border: 'none',
// //             borderRadius: '5px',
// //             cursor: 'pointer'
// //           }}
// //         >
// //           {showRoads ? 'Hide Roads' : 'Show Roads'}
// //         </button>
// //         <button 
// //           onClick={toggleHeatmap}
// //           style={{
// //             backgroundColor: showHeatmap ? 'rgba(255, 100, 0, 0.9)' : 'rgba(0, 0, 0, 0.7)',
// //             color: 'white',
// //             padding: '10px',
// //             border: 'none',
// //             borderRadius: '5px',
// //             cursor: 'pointer'
// //           }}
// //         >
// //           {showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}
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
// //   const roadsDataSourceRef = useRef(null);
// //   const heatmapDataSourceRef = useRef(null);
// //   const buildingLabelsRef = useRef([]);
// //   const vehiclesRef = useRef([]);
// //   const vehicleEntitiesRef = useRef([]);
// //   const [status, setStatus] = useState('Click on the map to add an anchor point.');
// //   const [showVideoModal, setShowVideoModal] = useState(false);
// //   const [videoUrl, setVideoUrl] = useState('');
// //   const [videoTitle, setVideoTitle] = useState('');
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [showHeatmap, setShowHeatmap] = useState(false);
// //   const [showRoads, setShowRoads] = useState(true);
// //   const [showVehicles, setShowVehicles] = useState(true);
// //   const zoomThreshold = 500;

// //   // Memoized terrain creation to prevent recreation on rerenders
// //   const createTerrain = useCallback(async () => {
// //     return await Cesium.createWorldTerrainAsync({
// //       requestWaterMask: true,
// //       requestVertexNormals: true
// //     });
// //   }, []);

// //   // Setup click handler after viewer is initialized


// //   // Helper function to compute orientation between two positions
// //   const computeOrientation = (startPosition, endPosition) => {
// //     // Get the direction vector
// //     const direction = Cesium.Cartesian3.subtract(
// //       endPosition, 
// //       startPosition, 
// //       new Cesium.Cartesian3()
// //     );
// //     Cesium.Cartesian3.normalize(direction, direction);
    
// //     // Compute the rotation matrix
// //     const rotationMatrix = new Cesium.Matrix3();
    
// //     // Assume the up direction is approximately the ellipsoid surface normal at the position
// //     const up = Cesium.Cartesian3.normalize(
// //       startPosition, 
// //       new Cesium.Cartesian3()
// //     );
    
// //     // Get the right vector
// //     const right = Cesium.Cartesian3.cross(
// //       direction, 
// //       up, 
// //       new Cesium.Cartesian3()
// //     );
// //     Cesium.Cartesian3.normalize(right, right);
    
// //     // Recompute up to ensure orthogonality
// //     Cesium.Cartesian3.cross(
// //       right, 
// //       direction, 
// //       up
// //     );
// //     Cesium.Cartesian3.normalize(up, up);
    
// //     // Set the rotation matrix columns
// //     Cesium.Matrix3.setColumn(rotationMatrix, 0, right, rotationMatrix);
// //     Cesium.Matrix3.setColumn(rotationMatrix, 1, up, rotationMatrix);
// //     Cesium.Matrix3.setColumn(rotationMatrix, 2, Cesium.Cartesian3.negate(direction, new Cesium.Cartesian3()), rotationMatrix);
    
// //     // Convert to quaternion
// //     return Cesium.Quaternion.fromRotationMatrix(rotationMatrix);
// //   };

// //   // Animation loop for vehicles
// //   const animateVehicles = useCallback(() => {
// //     if (!viewerRef.current || vehiclesRef.current.length === 0) return;
    
// //     // Get the current time
// //     const now = Cesium.JulianDate.now();
// //     const elapsed = 0.05; // Fixed time step (adjust as needed)
    
// //     // Update each vehicle position
// //     vehiclesRef.current.forEach((vehicle, index) => {
// //       const vehicleEntity = vehicleEntitiesRef.current[index];
// //       if (!vehicleEntity || vehicleEntity.isDestroyed()) return;
      
// //       // Get current position index
// //       let currentIndex = vehicle.currentIndex;
// //       const positions = vehicle.positions;
      
// //       if (currentIndex >= positions.length - 1) {
// //         // Reached the end of the path, reset to beginning
// //         vehicle.currentIndex = 0;
// //         currentIndex = 0;
// //       }
      
// //       // Get current and next positions
// //       const currentPosition = positions[currentIndex];
// //       const nextPosition = positions[currentIndex + 1];
      
// //       // Calculate distance between current and next position
// //       const distance = Cesium.Cartesian3.distance(currentPosition, nextPosition);
      
// //       // Calculate how far to move based on speed and elapsed time
// //       const moveDistance = (vehicle.speed * elapsed) / 1000;
// //       const moveFraction = moveDistance / distance;
      
// //       if (moveFraction >= 1.0) {
// //         // Move to next segment
// //         vehicle.currentIndex = currentIndex + 1;
// //         vehicleEntity.position = nextPosition;
        
// //         // If not at the end of the path, calculate new orientation
// //         if (vehicle.currentIndex < positions.length - 1) {
// //           const newNextPosition = positions[vehicle.currentIndex + 1];
// //           vehicleEntity.orientation = computeOrientation(nextPosition, newNextPosition);
// //         }
// //       } else {
// //         // Interpolate position along segment
// //         const newPosition = Cesium.Cartesian3.lerp(
// //           currentPosition,
// //           nextPosition,
// //           moveFraction,
// //           new Cesium.Cartesian3()
// //         );
        
// //         vehicleEntity.position = newPosition;
        
// //         // Set orientation to face the direction of movement
// //         vehicleEntity.orientation = computeOrientation(currentPosition, nextPosition);
// //       }
// //     });
    
// //     // Request next animation frame
// //     if (showVehicles && !viewerRef.current.isDestroyed()) {
// //       requestAnimationFrame(animateVehicles);
// //     }
// //   }, [showVehicles]);

// //   // Add vehicles to the map
// //   const loadAndAnimateVehicles = useCallback(async () => {
// //     try {
// //       if (!viewerRef.current || !roadsDataSourceRef.current) return;
      
// //       // Clear any existing vehicles
// //       vehicleEntitiesRef.current.forEach(entity => {
// //         if (entity && !entity.isDestroyed()) {
// //           viewerRef.current.entities.remove(entity);
// //         }
// //       });
// //       vehicleEntitiesRef.current = [];
      
// //       // Get road paths from the roads data source
// //       const roadEntities = roadsDataSourceRef.current.entities.values;
// //       const suitableRoads = roadEntities.filter(entity => {
// //         const highwayType = entity.properties?.highway?.getValue();
// //         // Filter for major roads only
// //         return entity.polyline && ['motorway', 'trunk', 'primary', 'secondary'].includes(highwayType);
// //       });
      
// //       if (suitableRoads.length === 0) {
// //         console.warn('No suitable roads found for vehicle animation');
// //         setStatus('No suitable roads found for vehicles');
// //         return;
// //       }
      
// //       // Create vehicles with randomized properties
// //       const vehicles = [];
// //       const numVehicles = Math.min(20, suitableRoads.length * 2); // Limit the number of vehicles
      
// //       for (let i = 0; i < numVehicles; i++) {
// //         // Pick a random road
// //         const roadIndex = Math.floor(Math.random() * suitableRoads.length);
// //         const road = suitableRoads[roadIndex];
        
// //         // Get polyline positions
// //         const positions = road.polyline.positions.getValue();
// //         if (positions.length < 2) continue;
        
// //         // Randomly decide direction (forward or backward)
// //         const isForward = Math.random() > 0.5;
// //         const orderedPositions = isForward ? positions : [...positions].reverse();
        
// //         // Create a vehicle object
// //         const vehicle = {
// //           roadEntity: road,
// //           positions: orderedPositions,
// //           speed: 50 + Math.random() * 50, // Random speed between 50-100 units
// //           currentIndex: 0,
// //           direction: isForward ? 1 : -1,
// //           type: Math.random() > 0.7 ? 'truck' : 'car', // 30% trucks, 70% cars
// //           color: Cesium.Color.fromRandom({ alpha: 1.0 })
// //         };
        
// //         vehicles.push(vehicle);
// //       }
      
// //       vehiclesRef.current = vehicles;
      
// //       // Create model entities for vehicles
// //       for (let i = 0; i < vehicles.length; i++) {
// //         const vehicle = vehicles[i];
// //         let modelUrl = '/models/car.glb'; // Default car model
// //         let scale = 2.0;
        
// //         if (vehicle.type === 'truck') {
// //           modelUrl = '/models/car.glb'; // Use the same model but we'll scale it differently
// //           scale = 3.0;
// //         }
        
// //         // Initial position (first point on the path)
// //         const initialPosition = vehicle.positions[0];
        
// //         // Calculate initial orientation
// //         let orientation;
// //         if (vehicle.positions.length > 1) {
// //           const startPosition = vehicle.positions[0];
// //           const nextPosition = vehicle.positions[1];
          
// //           // Create orientation from start position to next position
// //           orientation = computeOrientation(startPosition, nextPosition);
// //         }
        
// //         const vehicleEntity = viewerRef.current.entities.add({
// //           position: initialPosition,
// //           orientation: orientation,
// //           model: {
// //             uri: modelUrl,
// //             scale: scale,
// //             minimumPixelSize: 32,
// //             maximumScale: 20,
// //             color: vehicle.color,
// //             show: showVehicles
// //           },
// //           properties: {
// //             vehicleId: i,
// //             vehicleType: vehicle.type,
// //             speed: vehicle.speed
// //           }
// //         });
        
// //         vehicleEntitiesRef.current.push(vehicleEntity);
// //       }
      
// //       // Start animation loop
// //       animateVehicles();
// //       setStatus(`Added ${vehicles.length} vehicles to the map`);
      
// //     } catch (error) {
// //       console.error('Error loading vehicles:', error);
// //       setStatus('Failed to load vehicles');
// //     }
// //   }, [showVehicles, animateVehicles]);

// //   // Toggle vehicles
// //   const toggleVehicles = useCallback(() => {
// //     const newShowState = !showVehicles;
// //     setShowVehicles(newShowState);
    
// //     // Update visibility of existing vehicles
// //     vehicleEntitiesRef.current.forEach(entity => {
// //       if (entity && !entity.isDestroyed() && entity.model) {
// //         entity.model.show = newShowState;
// //       }
// //     });
    
// //     if (newShowState && vehicleEntitiesRef.current.length === 0) {
// //       // Load vehicles if toggling on and none exist
// //       loadAndAnimateVehicles();
// //     } else if (newShowState && vehicleEntitiesRef.current.length > 0) {
// //       // Restart animation if toggling on and vehicles exist
// //       animateVehicles();
// //     }
    
// //     setStatus(`Vehicles are now ${newShowState ? 'visible' : 'hidden'}`);
// //   }, [showVehicles, loadAndAnimateVehicles, animateVehicles]);

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
// //           loadGeoJsonData(),
// //           loadRoadsData(),
// //           loadHeatmapData()
// //         ]);

// //         // Initialize vehicles after roads are loaded
// //         if (showVehicles) {
// //           await loadAndAnimateVehicles();
// //         }

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
// //   }, [createTerrain, loadAndAnimateVehicles, showVehicles]);

// //   const load3DTileset = async () => {
// //     try {
// //       const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(3048665, {
// //         show: false // Start with tileset hidden for better performance
// //       });
      
// //       // Optimize tileset performance
// //       tileset.maximumScreenSpaceError = 2;
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

// //   const loadRoadsData = async () => {
// //     try {
// //       // Fetch roads data from backend API
// //       const response = await fetch('http://localhost:8081/api/roads');
// //       if (!response.ok) {
// //         throw new Error(`HTTP error! status: ${response.status}`);
// //       }
// //       const roadsData = await response.json();
      
// //       // Create a new data source for roads
// //       const roadsDataSource = await Cesium.GeoJsonDataSource.load(roadsData, {
// //         clampToGround: true,
// //         stroke: Cesium.Color.GRAY,
// //         strokeWidth: 3
// //       });

// //       // Style the roads based on their type
// //       const entities = roadsDataSource.entities.values;
// //       entities.forEach(entity => {
// //         if (entity.polyline) {
// //           // Customize road appearance based on highway type
// //           const highwayType = entity.properties.highway?.getValue();
          
// //           let color = Cesium.Color.GRAY;
// //           let width = 3;
          
// //           switch(highwayType) {
// //             case 'motorway':
// //               color = Cesium.Color.RED;
// //               width = 5;
// //               break;
// //             case 'trunk':
// //               color = Cesium.Color.ORANGE;
// //               width = 4.5;
// //               break;
// //             case 'primary':
// //               color = Cesium.Color.YELLOW;
// //               width = 4;
// //               break;
// //             case 'secondary':
// //               color = Cesium.Color.GREEN;
// //               width = 3.5;
// //               break;
// //             case 'tertiary':
// //               color = Cesium.Color.BLUE;
// //               width = 3;
// //               break;
// //             case 'residential':
// //               color = Cesium.Color.WHITE;
// //               width = 2;
// //               break;
// //             default:
// //               color = Cesium.Color.GRAY;
// //               width = 2;
// //           }
          
// //           entity.polyline.material = color;
// //           entity.polyline.width = width;
// //         }
// //       });

// //       roadsDataSourceRef.current = roadsDataSource;
// //       viewerRef.current.dataSources.add(roadsDataSource);
// //       return roadsDataSource;
// //     } catch (error) {
// //       console.error('Error loading roads data:', error);
// //       viewerRef.current.entities.add({
// //         position: Cesium.Cartesian3.fromDegrees(0, 0),
// //         label: {
// //           text: 'Failed to load roads data',
// //           font: '20px sans-serif',
// //           fillColor: Cesium.Color.RED
// //         }
// //       });
// //       return null;
// //     }
// //   };

// //   // Load heatmap data based on crowd density
// //   const loadHeatmapData = async () => {
// //     try {
// //       // Fetch crowd data from backend
// //       const response = await fetch('http://localhost:8081/api/crowd-data');
// //       if (!response.ok) {
// //         throw new Error(`HTTP error! status: ${response.status}`);
// //       }
      
// //       const crowdData = await response.json();
      
// //       // Create a new data source for heatmap
// //       const heatmapDataSource = new Cesium.CustomDataSource('heatmap');
      
// //       // Process each camera point with crowd data
// //       crowdData.forEach(camera => {
// //         const { longitude, latitude, crowdCount } = camera;
        
// //         // Calculate heatmap color based on crowd count
// //         const intensity = Math.min(crowdCount / 100, 1); // Normalize to 0-1 range
// //         const color = Cesium.Color.fromHsl(
// //           (1 - intensity) * 0.6, // Hue (blue to red)
// //           1, // Saturation
// //           0.5 + intensity * 0.5, // Lightness
// //           0.7 // Alpha
// //         );
        
// //         // Create a point for the heatmap
// //         heatmapDataSource.entities.add({
// //           position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
// //           point: {
// //             pixelSize: 20 + intensity * 30, // Bigger for more crowd
// //             color: color,
// //             outlineColor: Cesium.Color.WHITE.withAlpha(0.3),
// //             outlineWidth: 1,
// //             show: showHeatmap
// //           },
// //           properties: {
// //             crowdCount: crowdCount,
// //             cameraId: camera.id
// //           }
// //         });
        
// //         // Optionally add a label showing the count
// //         if (crowdCount > 50) {
// //           heatmapDataSource.entities.add({
// //             position: Cesium.Cartesian3.fromDegrees(longitude, latitude, 10),
// //             label: {
// //               text: crowdCount.toString(),
// //               font: '12px sans-serif',
// //               fillColor: Cesium.Color.WHITE,
// //               outlineColor: Cesium.Color.BLACK,
// //               outlineWidth: 2,
// //               style: Cesium.LabelStyle.FILL_AND_OUTLINE,
// //               verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
// //               pixelOffset: new Cesium.Cartesian2(0, -10),
// //               show: showHeatmap && viewerRef.current?.camera.positionCartographic.height < 1000
// //             }
// //           });
// //         }
// //       });
      
// //       // Add to viewer
// //       viewerRef.current.dataSources.add(heatmapDataSource);
// //       heatmapDataSourceRef.current = heatmapDataSource;
      
// //     } catch (error) {
// //       console.error('Error loading heatmap data:', error);
// //       viewerRef.current.entities.add({
// //         position: Cesium.Cartesian3.fromDegrees(0, 0),
// //         label: {
// //           text: 'Failed to load crowd heatmap',
// //           font: '20px sans-serif',
// //           fillColor: Cesium.Color.RED
// //         }
// //       });
// //     }
// //   };

// //   const toggleHeatmap = useCallback(async () => {
// //     const newShowState = !showHeatmap;
// //     setShowHeatmap(newShowState);
    
// //     if (heatmapDataSourceRef.current) {
// //       heatmapDataSourceRef.current.entities.values.forEach(entity => {
// //         if (entity.point) entity.point.show = newShowState;
// //         if (entity.label) entity.label.show = newShowState;
// //       });
// //     } else {
// //       // Load data if not already loaded
// //       await loadHeatmapData();
// //     }
    
// //     setStatus(`Heatmap is now ${newShowState ? 'visible' : 'hidden'}`);
// //   }, [showHeatmap]);

// //   const toggleRoads = useCallback(async () => {
// //     const newShowState = !showRoads;
// //     setShowRoads(newShowState);
    
// //     if (roadsDataSourceRef.current) {
// //       roadsDataSourceRef.current.show = newShowState;
      
// //       // Update vehicles when roads visibility changes
// //       if (newShowState && showVehicles) {
// //         await loadAndAnimateVehicles();
// //       }
// //     } else {
// //       // Load data if not already loaded
// //       await loadRoadsData();
// //       if (newShowState && showVehicles) {
// //         await loadAndAnimateVehicles();
// //       }
// //     }
    
// //     setStatus(`Roads are now ${newShowState ? 'visible' : 'hidden'}`);
// //   }, [showRoads, showVehicles, loadAndAnimateVehicles]);

// //   const setupZoomListener = useCallback(() => {
// //     const checkZoomLevel = () => {
// //       if (!viewerRef.current) return;
// //       const cameraHeight = viewerRef.current.camera.positionCartographic.height;
// //       buildingLabelsRef.current.forEach(labelEntity => {
// //         labelEntity.label.show = cameraHeight < zoomThreshold;
// //       });
      
// //       // Update heatmap labels visibility
// //       if (heatmapDataSourceRef.current) {
// //         heatmapDataSourceRef.current.entities.values.forEach(entity => {
// //           if (entity.label) {
// //             entity.label.show = showHeatmap && cameraHeight < 1000;
// //           }
// //         });
// //       }
// //     };

// //     viewerRef.current.camera.changed.addEventListener(checkZoomLevel);
// //     checkZoomLevel();
// //   }, [showHeatmap]);

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
// //         <button 
// //           onClick={toggleRoads}
// //           style={{
// //             backgroundColor: showRoads ? 'rgba(100, 100, 100, 0.9)' : 'rgba(0, 0, 0, 0.7)',
// //             color: 'white',
// //             padding: '10px',
// //             border: 'none',
// //             borderRadius: '5px',
// //             cursor: 'pointer'
// //           }}
// //         >
// //           {showRoads ? 'Hide Roads' : 'Show Roads'}
// //         </button>
// //         <button 
// //           onClick={toggleHeatmap}
// //           style={{
// //             backgroundColor: showHeatmap ? 'rgba(255, 100, 0, 0.9)' : 'rgba(0, 0, 0, 0.7)',
// //             color: 'white',
// //             padding: '10px',
// //             border: 'none',
// //             borderRadius: '5px',
// //             cursor: 'pointer'
// //           }}
// //         >
// //           {showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}
// //         </button>
// //         <button 
// //           onClick={toggleVehicles}
// //           style={{
// //             backgroundColor: showVehicles ? 'rgba(0, 255, 0, 0.9)' : 'rgba(0, 0, 0, 0.7)',
// //             color: 'white',
// //             padding: '10px',
// //             border: 'none',
// //             borderRadius: '5px',
// //             cursor: 'pointer'
// //           }}
// //         >
// //           {showVehicles ? 'Hide Vehicles' : 'Show Vehicles'}
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
// //   const roadsDataSourceRef = useRef(null);
// //   const heatmapDataSourceRef = useRef(null);
// //   const buildingLabelsRef = useRef([]);
// //   const vehiclesRef = useRef([]);
// //   const [status, setStatus] = useState('Click on the map to add an anchor point.');
// //   const [showVideoModal, setShowVideoModal] = useState(false);
// //   const [videoUrl, setVideoUrl] = useState('');
// //   const [videoTitle, setVideoTitle] = useState('');
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [showHeatmap, setShowHeatmap] = useState(false);
// //   const [showRoads, setShowRoads] = useState(true);
// //   const [showVehicles, setShowVehicles] = useState(true);
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
// //           baseLayerPicker: true,
// //           sceneMode: Cesium.SceneMode.SCENE3D,
// //           shouldAnimate: true,
// //           imageryProvider: new Cesium.IonImageryProvider({ assetId: 3845 }),
// //           creditContainer: document.createElement('div'),
// //           scene3DOnly: true,
// //           orderIndependentTranslucency: false,
// //           shadows: false
// //         });

// //         // Disable features we don't need for better performance
// //         viewerRef.current.scene.globe.showGroundAtmosphere = false;
// //         viewerRef.current.scene.fog.enabled = false;
// //         viewerRef.current.scene.skyAtmosphere.show = false;

// //         // Load data in parallel
// //         await Promise.all([
// //           load3DTileset(),
// //           loadGeoJsonData(),
// //           loadRoadsData(),
// //           loadHeatmapData()
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
// //         show: false
// //       });
      
// //       tileset.maximumScreenSpaceError = 2;
// //       tileset.dynamicScreenSpaceError = true;
// //       tileset.dynamicScreenSpaceErrorDensity = 0.00278;
// //       tileset.dynamicScreenSpaceErrorFactor = 4.0;
// //       tileset.dynamicScreenSpaceErrorHeightFalloff = 0.25;
      
// //       viewerRef.current.scene.primitives.add(tileset);
// //       tilesetRef.current = tileset;

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
// //       const response = await fetch('http://localhost:8081/api/geojson');
// //       if (!response.ok) {
// //         throw new Error(`HTTP error! status: ${response.status}`);
// //       }
// //       const geojsonData = await response.json();
      
// //       const dataSource = await Cesium.GeoJsonDataSource.load(geojsonData, {
// //         clampToGround: false,
// //         stroke: Cesium.Color.BLUE,
// //         fill: Cesium.Color.BLUE.withAlpha(0.5),
// //         strokeWidth: 3
// //       });

// //       geoJsonDataSourceRef.current = dataSource;
// //       viewerRef.current.dataSources.add(dataSource);

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

// //   const loadRoadsData = async () => {
// //     try {
// //       const response = await fetch('http://localhost:8081/api/roads');
// //       if (!response.ok) {
// //         throw new Error(`HTTP error! status: ${response.status}`);
// //       }
// //       const roadsData = await response.json();
      
// //       const roadsDataSource = await Cesium.GeoJsonDataSource.load(roadsData, {
// //         clampToGround: true,
// //         stroke: Cesium.Color.GRAY,
// //         strokeWidth: 3
// //       });

// //       const entities = roadsDataSource.entities.values;
// //       entities.forEach(entity => {
// //         if (entity.polyline) {
// //           const highwayType = entity.properties.highway?.getValue();
          
// //           let color = Cesium.Color.GRAY;
// //           let width = 3;
          
// //           switch(highwayType) {
// //             case 'motorway':
// //               color = Cesium.Color.RED;
// //               width = 5;
// //               break;
// //             case 'trunk':
// //               color = Cesium.Color.ORANGE;
// //               width = 4.5;
// //               break;
// //             case 'primary':
// //               color = Cesium.Color.YELLOW;
// //               width = 4;
// //               break;
// //             case 'secondary':
// //               color = Cesium.Color.GREEN;
// //               width = 3.5;
// //               break;
// //             case 'tertiary':
// //               color = Cesium.Color.BLUE;
// //               width = 3;
// //               break;
// //             case 'residential':
// //               color = Cesium.Color.WHITE;
// //               width = 2;
// //               break;
// //             default:
// //               color = Cesium.Color.GRAY;
// //               width = 2;
// //           }
          
// //           entity.polyline.material = color;
// //           entity.polyline.width = width;
// //         }
// //       });

// //       roadsDataSourceRef.current = roadsDataSource;
// //       viewerRef.current.dataSources.add(roadsDataSource);
// //       return roadsDataSource;
// //     } catch (error) {
// //       console.error('Error loading roads data:', error);
// //       viewerRef.current.entities.add({
// //         position: Cesium.Cartesian3.fromDegrees(0, 0),
// //         label: {
// //           text: 'Failed to load roads data',
// //           font: '20px sans-serif',
// //           fillColor: Cesium.Color.RED
// //         }
// //       });
// //       return null;
// //     }
// //   };

// //   const loadHeatmapData = async () => {
// //     try {
// //       const response = await fetch('http://localhost:8081/api/crowd-data');
// //       if (!response.ok) {
// //         throw new Error(`HTTP error! status: ${response.status}`);
// //       }
      
// //       const crowdData = await response.json();
// //       const heatmapDataSource = new Cesium.CustomDataSource('heatmap');
      
// //       crowdData.forEach(camera => {
// //         const { longitude, latitude, crowdCount } = camera;
// //         const intensity = Math.min(crowdCount / 100, 1);
// //         const color = Cesium.Color.fromHsl(
// //           (1 - intensity) * 0.6,
// //           1,
// //           0.5 + intensity * 0.5,
// //           0.7
// //         );
        
// //         heatmapDataSource.entities.add({
// //           position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
// //           point: {
// //             pixelSize: 20 + intensity * 30,
// //             color: color,
// //             outlineColor: Cesium.Color.WHITE.withAlpha(0.3),
// //             outlineWidth: 1,
// //             show: showHeatmap
// //           },
// //           properties: {
// //             crowdCount: crowdCount,
// //             cameraId: camera.id
// //           }
// //         });
        
// //         if (crowdCount > 50) {
// //           heatmapDataSource.entities.add({
// //             position: Cesium.Cartesian3.fromDegrees(longitude, latitude, 10),
// //             label: {
// //               text: crowdCount.toString(),
// //               font: '12px sans-serif',
// //               fillColor: Cesium.Color.WHITE,
// //               outlineColor: Cesium.Color.BLACK,
// //               outlineWidth: 2,
// //               style: Cesium.LabelStyle.FILL_AND_OUTLINE,
// //               verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
// //               pixelOffset: new Cesium.Cartesian2(0, -10),
// //               show: showHeatmap && viewerRef.current?.camera.positionCartographic.height < 1000
// //             }
// //           });
// //         }
// //       });
      
// //       viewerRef.current.dataSources.add(heatmapDataSource);
// //       heatmapDataSourceRef.current = heatmapDataSource;
      
// //     } catch (error) {
// //       console.error('Error loading heatmap data:', error);
// //       viewerRef.current.entities.add({
// //         position: Cesium.Cartesian3.fromDegrees(0, 0),
// //         label: {
// //           text: 'Failed to load crowd heatmap',
// //           font: '20px sans-serif',
// //           fillColor: Cesium.Color.RED
// //         }
// //       });
// //     }
// //   };

// //   const addMovingVehicles = useCallback(async () => {
// //     if (!viewerRef.current || !roadsDataSourceRef.current) return;

// //     // Clear existing vehicles
// //     vehiclesRef.current.forEach(vehicle => {
// //       viewerRef.current.entities.remove(vehicle);
// //     });
// //     vehiclesRef.current = [];

// //     // Get all road entities
// //     const roadEntities = roadsDataSourceRef.current.entities.values;
// //     const roads = [];

// //     roadEntities.forEach(entity => {
// //       if (entity.polyline) {
// //         const positions = entity.polyline.positions.getValue();
// //         roads.push({
// //           positions: positions,
// //           type: entity.properties?.highway?.getValue() || 'residential'
// //         });
// //       }
// //     });

// //     // Vehicle configurations
// //     const vehicleTypes = [
// //       { model: '/models/car.glb', scale: 1.0, speed: 0.5 },
// //       { model: '/models/bus.glb', scale: 1.5, speed: 0.3 },
// //       { model: '/models/truck.glb', scale: 1.8, speed: 0.4 }
// //     ];

// //     // Create random vehicles
// //     for (let i = 0; i < 20; i++) {
// //       const road = roads[Math.floor(Math.random() * roads.length)];
// //       if (!road || road.positions.length < 2) continue;

// //       const vehicleType = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];

// //       const vehicle = viewerRef.current.entities.add({
// //         name: `Vehicle ${i + 1}`,
// //         position: road.positions[0],
// //         model: {
// //           uri: vehicleType.model,
// //           minimumPixelSize: 32,
// //           maximumScale: 20000,
// //           scale: vehicleType.scale
// //         },
// //         path: {
// //           resolution: 1,
// //           material: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
// //           width: 3,
// //           leadTime: 0,
// //           trailTime: 60
// //         }
// //       });

// //       vehicle.roadPositions = road.positions;
// //       vehicle.currentPositionIndex = 0;
// //       vehicle.speed = vehicleType.speed * (0.8 + Math.random() * 0.4);
// //       vehicle.roadType = road.type;

// //       vehiclesRef.current.push(vehicle);
// //     }

// //     // Animation function
// //     const animateVehicles = () => {
// //       if (!viewerRef.current) return;

// //       const now = Cesium.JulianDate.now();
      
// //       vehiclesRef.current.forEach(vehicle => {
// //         if (!vehicle.roadPositions || vehicle.roadPositions.length < 2) return;

// //         const positions = vehicle.roadPositions;
// //         const nextIndex = (vehicle.currentPositionIndex + 1) % positions.length;
// //         const currentPos = positions[vehicle.currentPositionIndex];
// //         const nextPos = positions[nextIndex];
        
// //         const direction = Cesium.Cartesian3.subtract(nextPos, currentPos, new Cesium.Cartesian3());
// //         const distance = Cesium.Cartesian3.magnitude(direction);
// //         const normalizedDirection = Cesium.Cartesian3.normalize(direction, new Cesium.Cartesian3());
        
// //         const movement = Cesium.Cartesian3.multiplyByScalar(
// //           normalizedDirection, 
// //           vehicle.speed * 0.1,
// //           new Cesium.Cartesian3()
// //         );
        
// //         const newPosition = Cesium.Cartesian3.add(
// //           vehicle.position.getValue(now), 
// //           movement, 
// //           new Cesium.Cartesian3()
// //         );
// //         vehicle.position = newPosition;
        
// //         vehicle.orientation = Cesium.Quaternion.fromHeadingPitchRoll(
// //           new Cesium.HeadingPitchRoll(
// //             Math.atan2(direction.y, direction.x),
// //             0,
// //             0
// //           )
// //         );
        
// //         const distanceToNext = Cesium.Cartesian3.distance(newPosition, nextPos);
// //         if (distanceToNext < 10) {
// //           vehicle.currentPositionIndex = nextIndex;
// //         }
// //       });
      
// //       requestAnimationFrame(animateVehicles);
// //     };

// //     animateVehicles();
// //   }, [roadsDataSourceRef.current]);

// //   useEffect(() => {
// //     if (!isLoading && showRoads && showVehicles && roadsDataSourceRef.current) {
// //       addMovingVehicles();
// //     }
// //   }, [isLoading, showRoads, showVehicles, addMovingVehicles]);

// //   const toggleHeatmap = useCallback(async () => {
// //     const newShowState = !showHeatmap;
// //     setShowHeatmap(newShowState);
    
// //     if (heatmapDataSourceRef.current) {
// //       heatmapDataSourceRef.current.entities.values.forEach(entity => {
// //         if (entity.point) entity.point.show = newShowState;
// //         if (entity.label) entity.label.show = newShowState;
// //       });
// //     } else {
// //       await loadHeatmapData();
// //     }
    
// //     setStatus(`Heatmap is now ${newShowState ? 'visible' : 'hidden'}`);
// //   }, [showHeatmap]);

// //   const toggleRoads = useCallback(async () => {
// //     const newShowState = !showRoads;
// //     setShowRoads(newShowState);
    
// //     if (roadsDataSourceRef.current) {
// //       roadsDataSourceRef.current.show = newShowState;
// //       if (newShowState && showVehicles) {
// //         await addMovingVehicles();
// //       }
// //     } else {
// //       await loadRoadsData();
// //       if (newShowState && showVehicles) {
// //         await addMovingVehicles();
// //       }
// //     }
    
// //     setStatus(`Roads are now ${newShowState ? 'visible' : 'hidden'}`);
// //   }, [showRoads, showVehicles, addMovingVehicles]);

// //   const toggleVehicles = useCallback(async () => {
// //     const newShowState = !showVehicles;
// //     setShowVehicles(newShowState);
    
// //     if (newShowState && roadsDataSourceRef.current?.show) {
// //       await addMovingVehicles();
// //     } else {
// //       vehiclesRef.current.forEach(vehicle => {
// //         viewerRef.current.entities.remove(vehicle);
// //       });
// //       vehiclesRef.current = [];
// //     }
    
// //     setStatus(`Vehicles are now ${newShowState ? 'visible' : 'hidden'}`);
// //   }, [showVehicles]);

// //   const setupZoomListener = useCallback(() => {
// //     const checkZoomLevel = () => {
// //       if (!viewerRef.current) return;
// //       const cameraHeight = viewerRef.current.camera.positionCartographic.height;
// //       buildingLabelsRef.current.forEach(labelEntity => {
// //         labelEntity.label.show = cameraHeight < zoomThreshold;
// //       });
      
// //       if (heatmapDataSourceRef.current) {
// //         heatmapDataSourceRef.current.entities.values.forEach(entity => {
// //           if (entity.label) {
// //             entity.label.show = showHeatmap && cameraHeight < 1000;
// //           }
// //         });
// //       }
// //     };

// //     viewerRef.current.camera.changed.addEventListener(checkZoomLevel);
// //     checkZoomLevel();
// //   }, [showHeatmap]);

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
// //       if (pickedObject.id.properties.video) {
// //         const videoUrl = pickedObject.id.properties.video.getValue();
// //         const videoTitle = pickedObject.id.properties['@id'].getValue();
// //         setVideoUrl(videoUrl);
// //         setVideoTitle(videoTitle);
// //         setShowVideoModal(true);
// //       }
// //       return;
// //     }

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

// //       const dataSource = await Cesium.GeoJsonDataSource.load(newFeature, {
// //         clampToGround: true,
// //         markerColor: Cesium.Color.RED,
// //         markerSymbol: '?'
// //       });
      
// //       viewerRef.current.dataSources.add(dataSource);
// //       await viewerRef.current.zoomTo(dataSource);
      
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
// //         gap: '10px',
// //         flexDirection: 'column'
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
// //         <button 
// //           onClick={toggleRoads}
// //           style={{
// //             backgroundColor: showRoads ? 'rgba(100, 100, 100, 0.9)' : 'rgba(0, 0, 0, 0.7)',
// //             color: 'white',
// //             padding: '10px',
// //             border: 'none',
// //             borderRadius: '5px',
// //             cursor: 'pointer'
// //           }}
// //         >
// //           {showRoads ? 'Hide Roads' : 'Show Roads'}
// //         </button>
// //         <button 
// //           onClick={toggleVehicles}
// //           style={{
// //             backgroundColor: showVehicles ? 'rgba(50, 150, 200, 0.9)' : 'rgba(0, 0, 0, 0.7)',
// //             color: 'white',
// //             padding: '10px',
// //             border: 'none',
// //             borderRadius: '5px',
// //             cursor: 'pointer'
// //           }}
// //         >
// //           {showVehicles ? 'Hide Vehicles' : 'Show Vehicles'}
// //         </button>
// //         <button 
// //           onClick={toggleHeatmap}
// //           style={{
// //             backgroundColor: showHeatmap ? 'rgba(255, 100, 0, 0.9)' : 'rgba(0, 0, 0, 0.7)',
// //             color: 'white',
// //             padding: '10px',
// //             border: 'none',
// //             borderRadius: '5px',
// //             cursor: 'pointer'
// //           }}
// //         >
// //           {showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}
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


// // import React, { useEffect, useRef, useState } from 'react';
// // import * as Cesium from 'cesium';
// // import 'cesium/Build/Cesium/Widgets/widgets.css';
// // import HeatmapLayer from './HeatmapLayer';
// // import RoadsLayer from './RoadsLayer';
// // import VehiclesLayer from './VehiclesLayer';
// // import GeoJSONLayer from './GeoJSONLayer';
// // import TilesetLayer from './TilesetLayer';
// // import ControlsPanel from './ControlsPanel';

// // // Set base URL for Cesium assets
// // window.CESIUM_BASE_URL = '/node_modules/cesium/Build/Cesium/';

// // const Maps = () => {
// //   const cesiumContainer = useRef(null);
// //   const viewerRef = useRef(null);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [status, setStatus] = useState('Click on the map to add an anchor point.');

// //   // Initialize viewer
// //   useEffect(() => {
// //     let isMounted = true;
// //     const initViewer = async () => {
// //       try {
// //         Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YjhlMmVkNC1hYWVjLTQxYWEtOGZhYS1iOGQyNDUxY2ZlMTUiLCJpZCI6MjY0Nzg3LCJpYXQiOjE3MzUxMTAzMzV9.tdJk1ppDaw9AEy9bFB6RBU9T3H0-xOlIqVlrjDBJGQo";
        
// //         await Cesium.Ion.defaultAccessToken;
// //         await Cesium.ApproximateTerrainHeights.initialize();

// //         if (!isMounted) return;

// //         viewerRef.current = new Cesium.Viewer(cesiumContainer.current, {
// //           timeline: false,
// //           animation: false,
// //           baseLayerPicker: true,
// //           sceneMode: Cesium.SceneMode.SCENE3D,
// //           shouldAnimate: true,
// //           imageryProvider: new Cesium.IonImageryProvider({ assetId: 3845 }),
// //           creditContainer: document.createElement('div'),
// //           scene3DOnly: true,
// //           orderIndependentTranslucency: false,
// //           shadows: false
// //         });

// //         viewerRef.current.scene.globe.showGroundAtmosphere = false;
// //         viewerRef.current.scene.fog.enabled = false;
// //         viewerRef.current.scene.skyAtmosphere.show = false;

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
// //   }, []);

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
// //         <div style={loadingOverlayStyle}>
// //           <div style={{ color: 'white', fontSize: '20px' }}>Loading map...</div>
// //         </div>
// //       )}
      
// //       {!isLoading && viewerRef.current && (
// //         <>
// //           <GeoJSONLayer viewer={viewerRef.current} setStatus={setStatus} />
// //           <TilesetLayer viewer={viewerRef.current} setStatus={setStatus} />
// //           <RoadsLayer viewer={viewerRef.current} setStatus={setStatus} />
// //           <VehiclesLayer viewer={viewerRef.current} setStatus={setStatus} />
// //           <HeatmapLayer viewer={viewerRef.current} setStatus={setStatus} />
          
// //           <ControlsPanel 
// //             setStatus={setStatus}
// //             viewer={viewerRef.current}
// //           />
// //         </>
// //       )}
// //     </div>
// //   );
// // };

// // const loadingOverlayStyle = {
// //   position: 'absolute',
// //   top: 0,
// //   left: 0,
// //   width: '100%',
// //   height: '100%',
// //   display: 'flex',
// //   justifyContent: 'center',
// //   alignItems: 'center',
// //   backgroundColor: 'rgba(0,0,0,0.7)',
// //   zIndex: 999
// // };

// // export default Maps;

// // import React, { useEffect, useRef, useState } from 'react';
// // import * as Cesium from 'cesium';
// // import 'cesium/Build/Cesium/Widgets/widgets.css';
// // import HeatmapLayer from './HeatmapLayer';
// // import RoadsLayer from './RoadsLayer';
// // import VehiclesLayer from './VehiclesLayer';
// // import GeoJSONLayer from './GeoJSONLayer';
// // import TilesetLayer from './TilesetLayer';
// // import ControlsPanel from './ControlsPanel';

// // // Set base URL for Cesium assets
// // window.CESIUM_BASE_URL = '/node_modules/cesium/Build/Cesium/';

// // const Maps = () => {
// //   const cesiumContainer = useRef(null);
// //   const viewerRef = useRef(null);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [status, setStatus] = useState('Click on the map to add an anchor point.');
// //   const [activeLayers, setActiveLayers] = useState({
// //     tileset: false,
// //     geojson: false,
// //     roads: false,
// //     vehicles: false,
// //     heatmap: false
// //   });

// //   // Initialize viewer
// //   useEffect(() => {
// //     let isMounted = true;
// //     const initViewer = async () => {
// //       try {
// //         Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YjhlMmVkNC1hYWVjLTQxYWEtOGZhYS1iOGQyNDUxY2ZlMTUiLCJpZCI6MjY0Nzg3LCJpYXQiOjE3MzUxMTAzMzV9.tdJk1ppDaw9AEy9bFB6RBU9T3H0-xOlIqVlrjDBJGQo";
        
// //         await Cesium.Ion.defaultAccessToken;
// //         await Cesium.ApproximateTerrainHeights.initialize();

// //         if (!isMounted) return;

// //         viewerRef.current = new Cesium.Viewer(cesiumContainer.current, {
// //           timeline: false,
// //           animation: false,
// //           baseLayerPicker: true,
// //           sceneMode: Cesium.SceneMode.SCENE3D,
// //           shouldAnimate: true,
// //           imageryProvider: new Cesium.IonImageryProvider({ assetId: 3845 }),
// //           creditContainer: document.createElement('div'),
// //           scene3DOnly: true,
// //           orderIndependentTranslucency: false,
// //           shadows: false
// //         });

// //         viewerRef.current.scene.globe.showGroundAtmosphere = false;
// //         viewerRef.current.scene.fog.enabled = false;
// //         viewerRef.current.scene.skyAtmosphere.show = false;

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
// //   }, []);

// //   const handleLayerToggle = (layerName) => {
// //     setActiveLayers(prev => ({
// //       ...prev,
// //       [layerName]: !prev[layerName]
// //     }));
// //     setStatus(`${layerName} layer ${!activeLayers[layerName] ? 'enabled' : 'disabled'}`);
// //   };
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
// //         <div style={loadingOverlayStyle}>
// //           <div style={{ color: 'white', fontSize: '20px' }}>Loading map...</div>
// //         </div>
// //       )}
      
// //       {!isLoading && viewerRef.current && (
// //         <>
// //           {activeLayers.geojson && <GeoJSONLayer viewer={viewerRef.current} setStatus={setStatus} />}
// //           {activeLayers.tileset && <TilesetLayer viewer={viewerRef.current} setStatus={setStatus} />}
// //           {activeLayers.roads && <RoadsLayer viewer={viewerRef.current} setStatus={setStatus} />}
// //           {activeLayers.vehicles && <VehiclesLayer viewer={viewerRef.current} setStatus={setStatus} />}
// //           {activeLayers.heatmap && <HeatmapLayer viewer={viewerRef.current} setStatus={setStatus} />}
          
// //           // In your Maps component, update the ControlsPanel usage:
// //           <ControlsPanel 
// //             activeLayers={activeLayers}
// //             onToggleLayer={handleLayerToggle}
// //             status={status}  // Pass the status text instead of setStatus function
// //             viewer={viewerRef.current}
// //           />
// //         </>
// //       )}
// //     </div>
// //   );
// // };

// // const loadingOverlayStyle = {
// //   position: 'absolute',
// //   top: 0,
// //   left: 0,
// //   width: '100%',
// //   height: '100%',
// //   display: 'flex',
// //   justifyContent: 'center',
// //   alignItems: 'center',
// //   backgroundColor: 'rgba(0,0,0,0.7)',
// //   zIndex: 999
// // };

// // export default Maps;

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
// //   const roadsDataSourceRef = useRef(null);
// //   const heatmapDataSourceRef = useRef(null);
// //   const buildingLabelsRef = useRef([]);
// //   const vehiclesRef = useRef([]);
// //   const [status, setStatus] = useState('Click on the map to add an anchor point.');
// //   const [showVideoModal, setShowVideoModal] = useState(false);
// //   const [videoUrl, setVideoUrl] = useState('');
// //   const [videoTitle, setVideoTitle] = useState('');
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [showHeatmap, setShowHeatmap] = useState(false);
// //   const [showRoads, setShowRoads] = useState(true);
// //   const [showVehicles, setShowVehicles] = useState(true);
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
// //           baseLayerPicker: true,
// //           sceneMode: Cesium.SceneMode.SCENE3D,
// //           shouldAnimate: true,
// //           imageryProvider: new Cesium.IonImageryProvider({ assetId: 3845 }),
// //           creditContainer: document.createElement('div'),
// //           scene3DOnly: true,
// //           orderIndependentTranslucency: false,
// //           shadows: false
// //         });

// //         // Disable features we don't need for better performance
// //         viewerRef.current.scene.globe.showGroundAtmosphere = false;
// //         viewerRef.current.scene.fog.enabled = false;
// //         viewerRef.current.scene.skyAtmosphere.show = false;

// //         // Load data in parallel
// //         await Promise.all([
// //           load3DTileset(),
// //           loadGeoJsonData(),
// //           loadRoadsData(),
// //           loadHeatmapData()
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
// //         show: false
// //       });
      
// //       tileset.maximumScreenSpaceError = 2;
// //       tileset.dynamicScreenSpaceError = true;
// //       tileset.dynamicScreenSpaceErrorDensity = 0.00278;
// //       tileset.dynamicScreenSpaceErrorFactor = 4.0;
// //       tileset.dynamicScreenSpaceErrorHeightFalloff = 0.25;
      
// //       viewerRef.current.scene.primitives.add(tileset);
// //       tilesetRef.current = tileset;

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
// //       const response = await fetch('http://localhost:8081/api/geojson');
// //       if (!response.ok) {
// //         throw new Error(`HTTP error! status: ${response.status}`);
// //       }
// //       const geojsonData = await response.json();
      
// //       const dataSource = await Cesium.GeoJsonDataSource.load(geojsonData, {
// //         clampToGround: false,
// //         stroke: Cesium.Color.BLUE,
// //         fill: Cesium.Color.BLUE.withAlpha(0.5),
// //         strokeWidth: 3
// //       });

// //       geoJsonDataSourceRef.current = dataSource;
// //       viewerRef.current.dataSources.add(dataSource);

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

// //   const loadRoadsData = async () => {
// //     try {
// //       const response = await fetch('http://localhost:8081/api/roads');
// //       if (!response.ok) {
// //         throw new Error(`HTTP error! status: ${response.status}`);
// //       }
// //       const roadsData = await response.json();
      
// //       const roadsDataSource = await Cesium.GeoJsonDataSource.load(roadsData, {
// //         clampToGround: true,
// //         stroke: Cesium.Color.GRAY,
// //         strokeWidth: 3
// //       });

// //       const entities = roadsDataSource.entities.values;
// //       entities.forEach(entity => {
// //         if (entity.polyline) {
// //           const highwayType = entity.properties.highway?.getValue();
          
// //           let color = Cesium.Color.GRAY;
// //           let width = 3;
          
// //           switch(highwayType) {
// //             case 'motorway':
// //               color = Cesium.Color.RED;
// //               width = 5;
// //               break;
// //             case 'trunk':
// //               color = Cesium.Color.ORANGE;
// //               width = 4.5;
// //               break;
// //             case 'primary':
// //               color = Cesium.Color.YELLOW;
// //               width = 4;
// //               break;
// //             case 'secondary':
// //               color = Cesium.Color.GREEN;
// //               width = 3.5;
// //               break;
// //             case 'tertiary':
// //               color = Cesium.Color.BLUE;
// //               width = 3;
// //               break;
// //             case 'residential':
// //               color = Cesium.Color.WHITE;
// //               width = 2;
// //               break;
// //             default:
// //               color = Cesium.Color.GRAY;
// //               width = 2;
// //           }
          
// //           entity.polyline.material = color;
// //           entity.polyline.width = width;
// //         }
// //       });

// //       roadsDataSourceRef.current = roadsDataSource;
// //       viewerRef.current.dataSources.add(roadsDataSource);
// //       return roadsDataSource;
// //     } catch (error) {
// //       console.error('Error loading roads data:', error);
// //       viewerRef.current.entities.add({
// //         position: Cesium.Cartesian3.fromDegrees(0, 0),
// //         label: {
// //           text: 'Failed to load roads data',
// //           font: '20px sans-serif',
// //           fillColor: Cesium.Color.RED
// //         }
// //       });
// //       return null;
// //     }
// //   };

// //   // const loadHeatmapData = async () => {
// //   //   try {
// //   //     const response = await fetch('http://localhost:8081/api/crowd-data');
// //   //     if (!response.ok) {
// //   //       throw new Error(`HTTP error! status: ${response.status}`);
// //   //     }
      
// //   //     const crowdData = await response.json();
// //   //     const heatmapDataSource = new Cesium.CustomDataSource('heatmap');
      
// //   //     crowdData.forEach(camera => {
// //   //       const { longitude, latitude, crowdCount } = camera;
// //   //       const intensity = Math.min(crowdCount / 100, 1);
// //   //       const color = Cesium.Color.fromHsl(
// //   //         (1 - intensity) * 0.6,
// //   //         1,
// //   //         0.5 + intensity * 0.5,
// //   //         0.7
// //   //       );
        
// //   //       heatmapDataSource.entities.add({
// //   //         position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
// //   //         point: {
// //   //           pixelSize: 20 + intensity * 30,
// //   //           color: color,
// //   //           outlineColor: Cesium.Color.WHITE.withAlpha(0.3),
// //   //           outlineWidth: 1,
// //   //           show: showHeatmap
// //   //         },
// //   //         properties: {
// //   //           crowdCount: crowdCount,
// //   //           cameraId: camera.id
// //   //         }
// //   //       });
        
// //   //       if (crowdCount > 50) {
// //   //         heatmapDataSource.entities.add({
// //   //           position: Cesium.Cartesian3.fromDegrees(longitude, latitude, 10),
// //   //           label: {
// //   //             text: crowdCount.toString(),
// //   //             font: '12px sans-serif',
// //   //             fillColor: Cesium.Color.WHITE,
// //   //             outlineColor: Cesium.Color.BLACK,
// //   //             outlineWidth: 2,
// //   //             style: Cesium.LabelStyle.FILL_AND_OUTLINE,
// //   //             verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
// //   //             pixelOffset: new Cesium.Cartesian2(0, -10),
// //   //             show: showHeatmap && viewerRef.current?.camera.positionCartographic.height < 1000
// //   //           }
// //   //         });
// //   //       }
// //   //     });
      
// //   //     viewerRef.current.dataSources.add(heatmapDataSource);
// //   //     heatmapDataSourceRef.current = heatmapDataSource;
      
// //   //   } catch (error) {
// //   //     console.error('Error loading heatmap data:', error);
// //   //     viewerRef.current.entities.add({
// //   //       position: Cesium.Cartesian3.fromDegrees(0, 0),
// //   //       label: {
// //   //         text: 'Failed to load crowd heatmap',
// //   //         font: '20px sans-serif',
// //   //         fillColor: Cesium.Color.RED
// //   //       }
// //   //     });
// //   //   }
// //   // };

// //   // const loadHeatmapData = async () => {
// //   //   try {
// //   //     const response = await fetch('http://localhost:8081/api/crowd-data');
// //   //     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
// //   //     const crowdData = await response.json();
      
// //   //     // Clear previous heatmap if it exists
// //   //     if (heatmapDataSourceRef.current) {
// //   //       viewerRef.current.dataSources.remove(heatmapDataSourceRef.current);
// //   //     }
  
// //   //     // Create a new imagery layer for the heatmap
// //   //     const heatmapProvider = new Cesium.SingleTileImageryProvider({
// //   //       url: generateHeatmapImage(crowdData),
// //   //       rectangle: Cesium.Rectangle.fromDegrees(-180, -90, 180, 90)
// //   //     });
  
// //   //     // Add the heatmap layer to the viewer
// //   //     const heatmapLayer = viewerRef.current.imageryLayers.addImageryProvider(heatmapProvider);
// //   //     heatmapLayer.alpha = 0.7; // Set transparency
// //   //     heatmapLayer.show = showHeatmap;
      
// //   //     // Store reference to the layer
// //   //     heatmapDataSourceRef.current = heatmapLayer;
  
// //   //   } catch (error) {
// //   //     console.error('Error loading heatmap data:', error);
// //   //     // Show error message
// //   //   }
// //   // };
  
// //   const loadHeatmapData = async () => {
// //     try {
// //       const response = await fetch('http://localhost:8081/api/crowd-data');
// //       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
// //       const crowdData = await response.json();
      
// //       // Clear previous heatmap if it exists
// //       if (heatmapDataSourceRef.current) {
// //         viewerRef.current.dataSources.remove(heatmapDataSourceRef.current);
// //         heatmapDataSourceRef.current = null;
// //       }
  
// //       // Create a heatmap imagery layer
// //       const heatmapCanvas = createHeatmapCanvas(crowdData);
// //       const heatmapProvider = new Cesium.SingleTileImageryProvider({
// //         url: heatmapCanvas.toDataURL('image/png'),
// //         rectangle: Cesium.Rectangle.fromDegrees(-180, -90, 180, 90)
// //       });
  
// //       // Add the heatmap layer
// //       const heatmapLayer = viewerRef.current.imageryLayers.addImageryProvider(heatmapProvider, 1);
// //       heatmapLayer.alpha = 0.7;
// //       heatmapLayer.show = showHeatmap;
// //       heatmapDataSourceRef.current = heatmapLayer;
  
// //     } catch (error) {
// //       console.error('Error loading heatmap data:', error);
// //       viewerRef.current.entities.add({
// //         position: Cesium.Cartesian3.fromDegrees(0, 0),
// //         label: {
// //           text: 'Failed to load heatmap data',
// //           font: '20px sans-serif',
// //           fillColor: Cesium.Color.RED
// //         }
// //       });
// //     }
// //   };
  
// //   const createHeatmapCanvas = (data) => {
// //     const canvas = document.createElement('canvas');
// //     canvas.width = 1024;
// //     canvas.height = 1024;
// //     const ctx = canvas.getContext('2d');
    
// //     // Create gradient similar to Google Maps
// //     const gradient = {
// //       0.0: 'rgba(0, 255, 0, 0)',     // Green (transparent)
// //       0.2: 'rgba(0, 255, 0, 0.5)',   // Green
// //       0.5: 'rgba(255, 255, 0, 0.8)',  // Yellow
// //       0.8: 'rgba(255, 165, 0, 0.9)',  // Orange
// //       1.0: 'rgba(255, 0, 0, 1.0)'     // Red
// //     };
  
// //     // Draw each heat point with radial gradient
// //     data.forEach(point => {
// //       const intensity = Math.min(point.crowdCount / 100, 1);
// //       const x = (point.longitude + 180) / 360 * canvas.width;
// //       const y = (90 - point.latitude) / 180 * canvas.height;
// //       const radius = 20 + (intensity * 30);
      
// //       const grd = ctx.createRadialGradient(x, y, 0, x, y, radius);
// //       for (const pos in gradient) {
// //         grd.addColorStop(parseFloat(pos), gradient[pos]);
// //       }
      
// //       ctx.fillStyle = grd;
// //       ctx.beginPath();
// //       ctx.arc(x, y, radius, 0, 2 * Math.PI);
// //       ctx.fill();
// //     });
  
// //     return canvas;
// //   };
  
// //   const toggleHeatmap = useCallback(async () => {
// //     const newShowState = !showHeatmap;
// //     setShowHeatmap(newShowState);
    
// //     if (heatmapDataSourceRef.current) {
// //       heatmapDataSourceRef.current.show = newShowState;
// //     } else {
// //       await loadHeatmapData();
// //     }
    
// //     setStatus(`Heatmap is now ${newShowState ? 'visible' : 'hidden'}`);
// //   }, [showHeatmap]);

// //   // Helper function to generate heatmap image
// //   const generateHeatmapImage = (data) => {
// //     // Create a canvas to draw the heatmap
// //     const canvas = document.createElement('canvas');
// //     canvas.width = 512;
// //     canvas.height = 512;
// //     const ctx = canvas.getContext('2d');
    
// //     // Create gradient for heatmap colors
// //     const gradient = {
// //       0.0: 'rgba(0, 255, 0, 0)',     // Green (low)
// //       0.25: 'rgba(0, 255, 0, 0.5)',  // Green
// //       0.5: 'rgba(255, 255, 0, 0.7)', // Yellow
// //       0.75: 'rgba(255, 165, 0, 0.8)',// Orange
// //       1.0: 'rgba(255, 0, 0, 0.9)'    // Red (high)
// //     };
    
// //     // Draw heatmap points
// //     data.forEach(point => {
// //       const intensity = Math.min(point.crowdCount / 100, 1);
// //       const x = (point.longitude + 180) / 360 * canvas.width;
// //       const y = (90 - point.latitude) / 180 * canvas.height;
// //       const radius = 15 + (intensity * 30);
      
// //       // Create radial gradient for each point
// //       const grd = ctx.createRadialGradient(x, y, 0, x, y, radius);
// //       for (const pos in gradient) {
// //         grd.addColorStop(parseFloat(pos), gradient[pos]);
// //       }
      
// //       ctx.fillStyle = grd;
// //       ctx.beginPath();
// //       ctx.arc(x, y, radius, 0, 2 * Math.PI);
// //       ctx.fill();
// //     });
    
// //     return canvas.toDataURL('image/png');
// //   };
  
// //   // const toggleHeatmap = useCallback(async () => {
// //   //   const newShowState = !showHeatmap;
// //   //   setShowHeatmap(newShowState);
    
// //   //   if (heatmapDataSourceRef.current) {
// //   //     heatmapDataSourceRef.current.show = newShowState;
// //   //   } else {
// //   //     await loadHeatmapData();
// //   //   }
    
// //   //   setStatus(`Heatmap is now ${newShowState ? 'visible' : 'hidden'}`);
// //   // }, [showHeatmap]);

// //   const addMovingVehicles = useCallback(async () => {
// //     if (!viewerRef.current || !roadsDataSourceRef.current) return;
  
// //     // Clear existing vehicles
// //     vehiclesRef.current.forEach(vehicle => {
// //       viewerRef.current.entities.remove(vehicle);
// //     });
// //     vehiclesRef.current = [];
  
// //     // Get all road entities
// //     const roadEntities = roadsDataSourceRef.current.entities.values;
// //     const roads = [];
  
// //     // Pre-process road positions to include terrain heights
// //     for (const entity of roadEntities) {
// //       if (entity.polyline) {
// //         const positions = entity.polyline.positions.getValue();
        
// //         // Sample terrain for all road points
// //         const cartographics = positions.map(pos => 
// //           Cesium.Cartographic.fromCartesian(pos)
// //         );
        
// //         try {
// //           const updatedPositions = await Cesium.sampleTerrainMostDetailed(
// //             viewerRef.current.terrainProvider,
// //             cartographics
// //           );
          
// //           const terrainAdjustedPositions = updatedPositions.map(cartographic => 
// //             Cesium.Cartesian3.fromRadians(
// //               cartographic.longitude,
// //               cartographic.latitude,
// //               cartographic.height + 0.5 // Add 0.5m to ensure vehicle is above ground
// //             )
// //           );
          
// //           roads.push({
// //             positions: terrainAdjustedPositions,
// //             type: entity.properties?.highway?.getValue() || 'residential'
// //           });
// //         } catch (error) {
// //           console.error("Error sampling road terrain:", error);
// //           roads.push({
// //             positions: positions,
// //             type: entity.properties?.highway?.getValue() || 'residential'
// //           });
// //         }
// //       }
// //     }
  
// //     // Vehicle configurations
// //     const vehicleTypes = [
// //       { model: '/models/car.glb', scale: 1.0, speed: 0.005 },
// //       { model: '/models/car.glb', scale: 1.5, speed: 0.005 },
// //       { model: '/models/car.glb', scale: 1.8, speed: 0.005 }
// //     ];
  
// //     // Create random vehicles
// //     for (let i = 0; i < 20; i++) {
// //       const road = roads[Math.floor(Math.random() * roads.length)];
// //       if (!road || road.positions.length < 2) continue;
  
// //       const vehicleType = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
  
// //       const vehicle = viewerRef.current.entities.add({
// //         name: `Vehicle ${i + 1}`,
// //         position: road.positions[0],
// //         model: {
// //           uri: vehicleType.model,
// //           minimumPixelSize: 32,
// //           maximumScale: 20000,
// //           scale: vehicleType.scale
// //         }
// //       });
  
// //       vehicle.roadPositions = road.positions;
// //       vehicle.currentPositionIndex = 0;
// //       vehicle.speed = vehicleType.speed * (0.8 + Math.random() * 0.4);
// //       vehicle.roadType = road.type;
// //       vehicle.targetPositionIndex = 1; // Start moving toward the next point
  
// //       vehiclesRef.current.push(vehicle);
// //     }
  
// //     // Animation function
// //     const animateVehicles = () => {
// //       if (!viewerRef.current) return;
  
// //       const now = Cesium.JulianDate.now();
      
// //       vehiclesRef.current.forEach(vehicle => {
// //         if (!vehicle.roadPositions || vehicle.roadPositions.length < 2) return;
  
// //         const currentTargetIndex = vehicle.targetPositionIndex;
// //         const currentPos = vehicle.position.getValue(now);
// //         const targetPos = vehicle.roadPositions[currentTargetIndex];
        
// //         // Calculate direction to target
// //         const direction = Cesium.Cartesian3.subtract(targetPos, currentPos, new Cesium.Cartesian3());
// //         const distance = Cesium.Cartesian3.magnitude(direction);
        
// //         if (distance < 2) {
// //           // Reached target point, move to next
// //           vehicle.targetPositionIndex = (currentTargetIndex + 1) % vehicle.roadPositions.length;
// //           return;
// //         }
        
// //         const normalizedDirection = Cesium.Cartesian3.normalize(direction, new Cesium.Cartesian3());
// //         const movement = Cesium.Cartesian3.multiplyByScalar(
// //           normalizedDirection, 
// //           Math.min(vehicle.speed, distance), // Don't overshoot target
// //           new Cesium.Cartesian3()
// //         );
        
// //         const newPosition = Cesium.Cartesian3.add(currentPos, movement, new Cesium.Cartesian3());
        
// //         // Adjust vehicle position and orientation
// //         vehicle.position = newPosition;
        
// //         // Calculate heading (yaw) from direction vector
// //         const heading = Math.atan2(direction.y, direction.x);
        
// //         // Calculate pitch based on terrain slope
// //         let pitch = 0;
// //         if (currentTargetIndex > 0) {
// //           const prevPos = vehicle.roadPositions[currentTargetIndex - 1];
// //           const verticalChange = targetPos.z - prevPos.z;
// //           const horizontalDistance = Cesium.Cartesian3.distance(
// //             new Cesium.Cartesian3(prevPos.x, prevPos.y, 0),
// //             new Cesium.Cartesian3(targetPos.x, targetPos.y, 0)
// //           );
// //           pitch = Math.atan2(verticalChange, horizontalDistance);
// //         }
        
// //         vehicle.orientation = Cesium.Quaternion.fromHeadingPitchRoll(
// //           new Cesium.HeadingPitchRoll(heading, pitch, 0)
// //         );
// //       });
      
// //       requestAnimationFrame(animateVehicles);
// //     };
  
// //     animateVehicles();
// //   }, [roadsDataSourceRef.current]);

// //   useEffect(() => {
// //     if (!isLoading && showRoads && showVehicles && roadsDataSourceRef.current) {
// //       addMovingVehicles();
// //     }
// //   }, [isLoading, showRoads, showVehicles, addMovingVehicles]);

// //   // const toggleHeatmap = useCallback(async () => {
// //   //   const newShowState = !showHeatmap;
// //   //   setShowHeatmap(newShowState);
    
// //   //   if (heatmapDataSourceRef.current) {
// //   //     heatmapDataSourceRef.current.entities.values.forEach(entity => {
// //   //       if (entity.point) entity.point.show = newShowState;
// //   //       if (entity.label) entity.label.show = newShowState;
// //   //     });
// //   //   } else {
// //   //     await loadHeatmapData();
// //   //   }
    
// //   //   setStatus(`Heatmap is now ${newShowState ? 'visible' : 'hidden'}`);
// //   // }, [showHeatmap]);

// //   const toggleRoads = useCallback(async () => {
// //     const newShowState = !showRoads;
// //     setShowRoads(newShowState);
    
// //     if (roadsDataSourceRef.current) {
// //       roadsDataSourceRef.current.show = newShowState;
// //       if (newShowState && showVehicles) {
// //         await addMovingVehicles();
// //       }
// //     } else {
// //       await loadRoadsData();
// //       if (newShowState && showVehicles) {
// //         await addMovingVehicles();
// //       }
// //     }
    
// //     setStatus(`Roads are now ${newShowState ? 'visible' : 'hidden'}`);
// //   }, [showRoads, showVehicles, addMovingVehicles]);

// //   const toggleVehicles = useCallback(async () => {
// //     const newShowState = !showVehicles;
// //     setShowVehicles(newShowState);
    
// //     if (newShowState && roadsDataSourceRef.current?.show) {
// //       await addMovingVehicles();
// //     } else {
// //       vehiclesRef.current.forEach(vehicle => {
// //         viewerRef.current.entities.remove(vehicle);
// //       });
// //       vehiclesRef.current = [];
// //     }
    
// //     setStatus(`Vehicles are now ${newShowState ? 'visible' : 'hidden'}`);
// //   }, [showVehicles]);

// //   const setupZoomListener = useCallback(() => {
// //     const checkZoomLevel = () => {
// //       if (!viewerRef.current) return;
// //       const cameraHeight = viewerRef.current.camera.positionCartographic.height;
// //       buildingLabelsRef.current.forEach(labelEntity => {
// //         labelEntity.label.show = cameraHeight < zoomThreshold;
// //       });
      
// //       if (heatmapDataSourceRef.current) {
// //         heatmapDataSourceRef.current.entities.values.forEach(entity => {
// //           if (entity.label) {
// //             entity.label.show = showHeatmap && cameraHeight < 1000;
// //           }
// //         });
// //       }
// //     };

// //     viewerRef.current.camera.changed.addEventListener(checkZoomLevel);
// //     checkZoomLevel();
// //   }, [showHeatmap]);

// //   const toggleTileset = useCallback(() => {
// //     if (tilesetRef.current) {
// //       tilesetRef.current.show = !tilesetRef.current.show;
// //       setStatus(`3D Tileset is now ${tilesetRef.current.show ? 'visible' : 'hidden'}`);
// //     }
// //   }, []);

// //   const toggleGeoJson = useCallback(() => {
// //     if (geoJsonDataSourceRef.current) {
// //       const isVisible = !geoJsonDataSourceRef.current.show;
// //       geoJsonDataSourceRef.current.show = isVisible;
// //       setStatus(`GeoJSON data is now ${isVisible ? 'visible' : 'hidden'}`);
  
// //       // Toggle building labels visibility
// //       buildingLabelsRef.current.forEach(label => {
// //         label.show = isVisible;  // Sync visibility
// //       });
// //     }
// //   }, []);
  

// //   const handleMapClick = useCallback(async (movement) => {
// //     if (!viewerRef.current) return;

// //     const pickedObject = viewerRef.current.scene.pick(movement.position);
// //     if (pickedObject && pickedObject.id && pickedObject.id.properties) {
// //       if (pickedObject.id.properties.video) {
// //         const videoUrl = pickedObject.id.properties.video.getValue();
// //         const videoTitle = pickedObject.id.properties['@id'].getValue();
// //         setVideoUrl(videoUrl);
// //         setVideoTitle(videoTitle);
// //         setShowVideoModal(true);
// //       }
// //       return;
// //     }

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

// //       const dataSource = await Cesium.GeoJsonDataSource.load(newFeature, {
// //         clampToGround: true,
// //         markerColor: Cesium.Color.RED,
// //         markerSymbol: '?'
// //       });
      
// //       viewerRef.current.dataSources.add(dataSource);
// //       await viewerRef.current.zoomTo(dataSource);
      
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

// //   useEffect(() => {
// //     if (!viewerRef.current || isLoading) return;
  
// //     const { canvas, scene, entities } = viewerRef.current;
// //     if (!canvas || !scene || !entities) return;  // Prevent undefined errors
  
// //     const handler = new Cesium.ScreenSpaceEventHandler(canvas);
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
// //         gap: '10px',
// //         flexDirection: 'column'
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
// //         <button 
// //           onClick={toggleRoads}
// //           style={{
// //             backgroundColor: showRoads ? 'rgba(100, 100, 100, 0.9)' : 'rgba(0, 0, 0, 0.7)',
// //             color: 'white',
// //             padding: '10px',
// //             border: 'none',
// //             borderRadius: '5px',
// //             cursor: 'pointer'
// //           }}
// //         >
// //           {showRoads ? 'Hide Roads' : 'Show Roads'}
// //         </button>
// //         <button 
// //           onClick={toggleVehicles}
// //           style={{
// //             backgroundColor: showVehicles ? 'rgba(50, 150, 200, 0.9)' : 'rgba(0, 0, 0, 0.7)',
// //             color: 'white',
// //             padding: '10px',
// //             border: 'none',
// //             borderRadius: '5px',
// //             cursor: 'pointer'
// //           }}
// //         >
// //           {showVehicles ? 'Hide Vehicles' : 'Show Vehicles'}
// //         </button>
// //         <button 
// //           onClick={toggleHeatmap}
// //           style={{
// //             backgroundColor: showHeatmap ? 'rgba(255, 100, 0, 0.9)' : 'rgba(0, 0, 0, 0.7)',
// //             color: 'white',
// //             padding: '10px',
// //             border: 'none',
// //             borderRadius: '5px',
// //             cursor: 'pointer'
// //           }}
// //         >
// //           {showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}
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
// //   const roadsDataSourceRef = useRef(null);
// //   const heatmapDataSourceRef = useRef(null);
// //   const buildingLabelsRef = useRef([]);
// //   const vehiclesRef = useRef([]);
// //   const [status, setStatus] = useState('Click on the map to add an anchor point.');
// //   const [showVideoModal, setShowVideoModal] = useState(false);
// //   const [videoUrl, setVideoUrl] = useState('');
// //   const [videoTitle, setVideoTitle] = useState('');
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [showHeatmap, setShowHeatmap] = useState(false);
// //   const [showRoads, setShowRoads] = useState(true);
// //   const [showVehicles, setShowVehicles] = useState(true);
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
// //           baseLayerPicker: true,
// //           sceneMode: Cesium.SceneMode.SCENE3D,
// //           shouldAnimate: true,
// //           imageryProvider: new Cesium.IonImageryProvider({ assetId: 3845 }),
// //           creditContainer: document.createElement('div'),
// //           scene3DOnly: true,
// //           orderIndependentTranslucency: false,
// //           shadows: false
// //         });

// //         // Disable features we don't need for better performance
// //         viewerRef.current.scene.globe.showGroundAtmosphere = false;
// //         viewerRef.current.scene.fog.enabled = false;
// //         viewerRef.current.scene.skyAtmosphere.show = false;

// //         // Load data in parallel
// //         await Promise.all([
// //           load3DTileset(),
// //           loadGeoJsonData(),
// //           loadRoadsData(),
// //           loadHeatmapData()
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
// //         show: false
// //       });
      
// //       tileset.maximumScreenSpaceError = 2;
// //       tileset.dynamicScreenSpaceError = true;
// //       tileset.dynamicScreenSpaceErrorDensity = 0.00278;
// //       tileset.dynamicScreenSpaceErrorFactor = 4.0;
// //       tileset.dynamicScreenSpaceErrorHeightFalloff = 0.25;
      
// //       viewerRef.current.scene.primitives.add(tileset);
// //       tilesetRef.current = tileset;

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
// //       const response = await fetch('http://localhost:8081/api/geojson');
// //       if (!response.ok) {
// //         throw new Error(`HTTP error! status: ${response.status}`);
// //       }
// //       const geojsonData = await response.json();
      
// //       const dataSource = await Cesium.GeoJsonDataSource.load(geojsonData, {
// //         clampToGround: false,
// //         stroke: Cesium.Color.BLUE,
// //         fill: Cesium.Color.BLUE.withAlpha(0.5),
// //         strokeWidth: 3
// //       });

// //       geoJsonDataSourceRef.current = dataSource;
// //       viewerRef.current.dataSources.add(dataSource);

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

// //   const loadRoadsData = async () => {
// //     try {
// //       const response = await fetch('http://localhost:8081/api/roads');
// //       if (!response.ok) {
// //         throw new Error(`HTTP error! status: ${response.status}`);
// //       }
// //       const roadsData = await response.json();
      
// //       const roadsDataSource = await Cesium.GeoJsonDataSource.load(roadsData, {
// //         clampToGround: true,
// //         stroke: Cesium.Color.GRAY,
// //         strokeWidth: 3
// //       });

// //       const entities = roadsDataSource.entities.values;
// //       entities.forEach(entity => {
// //         if (entity.polyline) {
// //           const highwayType = entity.properties.highway?.getValue();
          
// //           let color = Cesium.Color.GRAY;
// //           let width = 3;
          
// //           switch(highwayType) {
// //             case 'motorway':
// //               color = Cesium.Color.RED;
// //               width = 5;
// //               break;
// //             case 'trunk':
// //               color = Cesium.Color.ORANGE;
// //               width = 4.5;
// //               break;
// //             case 'primary':
// //               color = Cesium.Color.YELLOW;
// //               width = 4;
// //               break;
// //             case 'secondary':
// //               color = Cesium.Color.GREEN;
// //               width = 3.5;
// //               break;
// //             case 'tertiary':
// //               color = Cesium.Color.BLUE;
// //               width = 3;
// //               break;
// //             case 'residential':
// //               color = Cesium.Color.WHITE;
// //               width = 2;
// //               break;
// //             default:
// //               color = Cesium.Color.GRAY;
// //               width = 2;
// //           }
          
// //           entity.polyline.material = color;
// //           entity.polyline.width = width;
// //         }
// //       });

// //       roadsDataSourceRef.current = roadsDataSource;
// //       viewerRef.current.dataSources.add(roadsDataSource);
// //       return roadsDataSource;
// //     } catch (error) {
// //       console.error('Error loading roads data:', error);
// //       viewerRef.current.entities.add({
// //         position: Cesium.Cartesian3.fromDegrees(0, 0),
// //         label: {
// //           text: 'Failed to load roads data',
// //           font: '20px sans-serif',
// //           fillColor: Cesium.Color.RED
// //         }
// //       });
// //       return null;
// //     }
// //   };

// //   const loadHeatmapData = async () => {
// //     try {
// //       const response = await fetch('http://localhost:8081/api/crowd-data');
// //       if (!response.ok) {
// //         throw new Error(`HTTP error! status: ${response.status}`);
// //       }
      
// //       const crowdData = await response.json();
// //       const heatmapDataSource = new Cesium.CustomDataSource('heatmap');
      
// //       crowdData.forEach(camera => {
// //         const { longitude, latitude, crowdCount } = camera;
// //         const intensity = Math.min(crowdCount / 100, 1);
// //         const color = Cesium.Color.fromHsl(
// //           (1 - intensity) * 0.6,
// //           1,
// //           0.5 + intensity * 0.5,
// //           0.7
// //         );
        
// //         heatmapDataSource.entities.add({
// //           position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
// //           point: {
// //             pixelSize: 20 + intensity * 30,
// //             color: color,
// //             outlineColor: Cesium.Color.WHITE.withAlpha(0.3),
// //             outlineWidth: 1,
// //             show: showHeatmap
// //           },
// //           properties: {
// //             crowdCount: crowdCount,
// //             cameraId: camera.id
// //           }
// //         });
        
// //         if (crowdCount > 50) {
// //           heatmapDataSource.entities.add({
// //             position: Cesium.Cartesian3.fromDegrees(longitude, latitude, 10),
// //             label: {
// //               text: crowdCount.toString(),
// //               font: '12px sans-serif',
// //               fillColor: Cesium.Color.WHITE,
// //               outlineColor: Cesium.Color.BLACK,
// //               outlineWidth: 2,
// //               style: Cesium.LabelStyle.FILL_AND_OUTLINE,
// //               verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
// //               pixelOffset: new Cesium.Cartesian2(0, -10),
// //               show: showHeatmap && viewerRef.current?.camera.positionCartographic.height < 1000
// //             }
// //           });
// //         }
// //       });
      
// //       viewerRef.current.dataSources.add(heatmapDataSource);
// //       heatmapDataSourceRef.current = heatmapDataSource;
      
// //     } catch (error) {
// //       console.error('Error loading heatmap data:', error);
// //       viewerRef.current.entities.add({
// //         position: Cesium.Cartesian3.fromDegrees(0, 0),
// //         label: {
// //           text: 'Failed to load crowd heatmap',
// //           font: '20px sans-serif',
// //           fillColor: Cesium.Color.RED
// //         }
// //       });
// //     }
// //   };

// //   const addMovingVehicles = useCallback(async () => {
// //     if (!viewerRef.current || !roadsDataSourceRef.current) return;
  
// //     // Clear existing vehicles
// //     vehiclesRef.current.forEach(vehicle => {
// //       viewerRef.current.entities.remove(vehicle);
// //     });
// //     vehiclesRef.current = [];
  
// //     // Get all road entities
// //     const roadEntities = roadsDataSourceRef.current.entities.values;
// //     const roads = [];
  
// //     // Pre-process road positions to include terrain heights
// //     for (const entity of roadEntities) {
// //       if (entity.polyline) {
// //         const positions = entity.polyline.positions.getValue();
        
// //         // Sample terrain for all road points
// //         const cartographics = positions.map(pos => 
// //           Cesium.Cartographic.fromCartesian(pos)
// //         );
        
// //         try {
// //           const updatedPositions = await Cesium.sampleTerrainMostDetailed(
// //             viewerRef.current.terrainProvider,
// //             cartographics
// //           );
          
// //           const terrainAdjustedPositions = updatedPositions.map(cartographic => 
// //             Cesium.Cartesian3.fromRadians(
// //               cartographic.longitude,
// //               cartographic.latitude,
// //               cartographic.height + 0.5 // Add 0.5m to ensure vehicle is above ground
// //             )
// //           );
          
// //           roads.push({
// //             positions: terrainAdjustedPositions,
// //             type: entity.properties?.highway?.getValue() || 'residential'
// //           });
// //         } catch (error) {
// //           console.error("Error sampling road terrain:", error);
// //           roads.push({
// //             positions: positions,
// //             type: entity.properties?.highway?.getValue() || 'residential'
// //           });
// //         }
// //       }
// //     }
  
// //     // Vehicle configurations
// //     const vehicleTypes = [
// //       { model: '/models/car.glb', scale: 1.0, speed: 0.005 },
// //       { model: '/models/car.glb', scale: 1.5, speed: 0.005 },
// //       { model: '/models/car.glb', scale: 1.8, speed: 0.005 }
// //     ];
  
// //     // Create random vehicles
// //     for (let i = 0; i < 20; i++) {
// //       const road = roads[Math.floor(Math.random() * roads.length)];
// //       if (!road || road.positions.length < 2) continue;
  
// //       const vehicleType = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
  
// //       const vehicle = viewerRef.current.entities.add({
// //         name: `Vehicle ${i + 1}`,
// //         position: road.positions[0],
// //         model: {
// //           uri: vehicleType.model,
// //           minimumPixelSize: 32,
// //           maximumScale: 20000,
// //           scale: vehicleType.scale
// //         }
// //       });
  
// //       vehicle.roadPositions = road.positions;
// //       vehicle.currentPositionIndex = 0;
// //       vehicle.speed = vehicleType.speed * (0.8 + Math.random() * 0.4);
// //       vehicle.roadType = road.type;
// //       vehicle.targetPositionIndex = 1; // Start moving toward the next point
  
// //       vehiclesRef.current.push(vehicle);
// //     }
  
// //     // Animation function
// //     const animateVehicles = () => {
// //       if (!viewerRef.current) return;
  
// //       const now = Cesium.JulianDate.now();
      
// //       vehiclesRef.current.forEach(vehicle => {
// //         if (!vehicle.roadPositions || vehicle.roadPositions.length < 2) return;
  
// //         const currentTargetIndex = vehicle.targetPositionIndex;
// //         const currentPos = vehicle.position.getValue(now);
// //         const targetPos = vehicle.roadPositions[currentTargetIndex];
        
// //         // Calculate direction to target
// //         const direction = Cesium.Cartesian3.subtract(targetPos, currentPos, new Cesium.Cartesian3());
// //         const distance = Cesium.Cartesian3.magnitude(direction);
        
// //         if (distance < 2) {
// //           // Reached target point, move to next
// //           vehicle.targetPositionIndex = (currentTargetIndex + 1) % vehicle.roadPositions.length;
// //           return;
// //         }
        
// //         const normalizedDirection = Cesium.Cartesian3.normalize(direction, new Cesium.Cartesian3());
// //         const movement = Cesium.Cartesian3.multiplyByScalar(
// //           normalizedDirection, 
// //           Math.min(vehicle.speed, distance), // Don't overshoot target
// //           new Cesium.Cartesian3()
// //         );
        
// //         const newPosition = Cesium.Cartesian3.add(currentPos, movement, new Cesium.Cartesian3());
        
// //         // Adjust vehicle position and orientation
// //         vehicle.position = newPosition;
        
// //         // Calculate heading (yaw) from direction vector
// //         const heading = Math.atan2(direction.y, direction.x);
        
// //         // Calculate pitch based on terrain slope
// //         let pitch = 0;
// //         if (currentTargetIndex > 0) {
// //           const prevPos = vehicle.roadPositions[currentTargetIndex - 1];
// //           const verticalChange = targetPos.z - prevPos.z;
// //           const horizontalDistance = Cesium.Cartesian3.distance(
// //             new Cesium.Cartesian3(prevPos.x, prevPos.y, 0),
// //             new Cesium.Cartesian3(targetPos.x, targetPos.y, 0)
// //           );
// //           pitch = Math.atan2(verticalChange, horizontalDistance);
// //         }
        
// //         vehicle.orientation = Cesium.Quaternion.fromHeadingPitchRoll(
// //           new Cesium.HeadingPitchRoll(heading, pitch, 0)
// //         );
// //       });
      
// //       requestAnimationFrame(animateVehicles);
// //     };
  
// //     animateVehicles();
// //   }, [roadsDataSourceRef.current]);

// //   useEffect(() => {
// //     if (!isLoading && showRoads && showVehicles && roadsDataSourceRef.current) {
// //       addMovingVehicles();
// //     }
// //   }, [isLoading, showRoads, showVehicles, addMovingVehicles]);

// //   const toggleHeatmap = useCallback(async () => {
// //     const newShowState = !showHeatmap;
// //     setShowHeatmap(newShowState);
    
// //     if (heatmapDataSourceRef.current) {
// //       heatmapDataSourceRef.current.entities.values.forEach(entity => {
// //         if (entity.point) entity.point.show = newShowState;
// //         if (entity.label) entity.label.show = newShowState;
// //       });
// //     } else {
// //       await loadHeatmapData();
// //     }
    
// //     setStatus(`Heatmap is now ${newShowState ? 'visible' : 'hidden'}`);
// //   }, [showHeatmap]);

// //   const toggleRoads = useCallback(async () => {
// //     const newShowState = !showRoads;
// //     setShowRoads(newShowState);
    
// //     if (roadsDataSourceRef.current) {
// //       roadsDataSourceRef.current.show = newShowState;
// //       if (newShowState && showVehicles) {
// //         await addMovingVehicles();
// //       }
// //     } else {
// //       await loadRoadsData();
// //       if (newShowState && showVehicles) {
// //         await addMovingVehicles();
// //       }
// //     }
    
// //     setStatus(`Roads are now ${newShowState ? 'visible' : 'hidden'}`);
// //   }, [showRoads, showVehicles, addMovingVehicles]);

// //   const toggleVehicles = useCallback(async () => {
// //     const newShowState = !showVehicles;
// //     setShowVehicles(newShowState);
    
// //     if (newShowState && roadsDataSourceRef.current?.show) {
// //       await addMovingVehicles();
// //     } else {
// //       vehiclesRef.current.forEach(vehicle => {
// //         viewerRef.current.entities.remove(vehicle);
// //       });
// //       vehiclesRef.current = [];
// //     }
    
// //     setStatus(`Vehicles are now ${newShowState ? 'visible' : 'hidden'}`);
// //   }, [showVehicles]);

// //   const setupZoomListener = useCallback(() => {
// //     const checkZoomLevel = () => {
// //       if (!viewerRef.current) return;
// //       const cameraHeight = viewerRef.current.camera.positionCartographic.height;
// //       buildingLabelsRef.current.forEach(labelEntity => {
// //         labelEntity.label.show = cameraHeight < zoomThreshold;
// //       });
      
// //       if (heatmapDataSourceRef.current) {
// //         heatmapDataSourceRef.current.entities.values.forEach(entity => {
// //           if (entity.label) {
// //             entity.label.show = showHeatmap && cameraHeight < 1000;
// //           }
// //         });
// //       }
// //     };

// //     viewerRef.current.camera.changed.addEventListener(checkZoomLevel);
// //     checkZoomLevel();
// //   }, [showHeatmap]);

// //   const toggleTileset = useCallback(() => {
// //     if (tilesetRef.current) {
// //       tilesetRef.current.show = !tilesetRef.current.show;
// //       setStatus(`3D Tileset is now ${tilesetRef.current.show ? 'visible' : 'hidden'}`);
// //     }
// //   }, []);

// //   const toggleGeoJson = useCallback(() => {
// //     if (geoJsonDataSourceRef.current) {
// //       const isVisible = !geoJsonDataSourceRef.current.show;
// //       geoJsonDataSourceRef.current.show = isVisible;
// //       setStatus(`GeoJSON data is now ${isVisible ? 'visible' : 'hidden'}`);
  
// //       // Toggle building labels visibility
// //       buildingLabelsRef.current.forEach(label => {
// //         label.show = isVisible;  // Sync visibility
// //       });
// //     }
// //   }, []);
  

// //   const handleMapClick = useCallback(async (movement) => {
// //     if (!viewerRef.current) return;

// //     const pickedObject = viewerRef.current.scene.pick(movement.position);
// //     if (pickedObject && pickedObject.id && pickedObject.id.properties) {
// //       if (pickedObject.id.properties.video) {
// //         const videoUrl = pickedObject.id.properties.video.getValue();
// //         const videoTitle = pickedObject.id.properties['@id'].getValue();
// //         setVideoUrl(videoUrl);
// //         setVideoTitle(videoTitle);
// //         setShowVideoModal(true);
// //       }
// //       return;
// //     }

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

// //       const dataSource = await Cesium.GeoJsonDataSource.load(newFeature, {
// //         clampToGround: true,
// //         markerColor: Cesium.Color.RED,
// //         markerSymbol: '?'
// //       });
      
// //       viewerRef.current.dataSources.add(dataSource);
// //       await viewerRef.current.zoomTo(dataSource);
      
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

// //   useEffect(() => {
// //     if (!viewerRef.current || isLoading) return;
  
// //     const { canvas, scene, entities } = viewerRef.current;
// //     if (!canvas || !scene || !entities) return;  // Prevent undefined errors
  
// //     const handler = new Cesium.ScreenSpaceEventHandler(canvas);
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
// //         gap: '10px',
// //         flexDirection: 'column'
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
// //         <button 
// //           onClick={toggleRoads}
// //           style={{
// //             backgroundColor: showRoads ? 'rgba(100, 100, 100, 0.9)' : 'rgba(0, 0, 0, 0.7)',
// //             color: 'white',
// //             padding: '10px',
// //             border: 'none',
// //             borderRadius: '5px',
// //             cursor: 'pointer'
// //           }}
// //         >
// //           {showRoads ? 'Hide Roads' : 'Show Roads'}
// //         </button>
// //         <button 
// //           onClick={toggleVehicles}
// //           style={{
// //             backgroundColor: showVehicles ? 'rgba(50, 150, 200, 0.9)' : 'rgba(0, 0, 0, 0.7)',
// //             color: 'white',
// //             padding: '10px',
// //             border: 'none',
// //             borderRadius: '5px',
// //             cursor: 'pointer'
// //           }}
// //         >
// //           {showVehicles ? 'Hide Vehicles' : 'Show Vehicles'}
// //         </button>
// //         <button 
// //           onClick={toggleHeatmap}
// //           style={{
// //             backgroundColor: showHeatmap ? 'rgba(255, 100, 0, 0.9)' : 'rgba(0, 0, 0, 0.7)',
// //             color: 'white',
// //             padding: '10px',
// //             border: 'none',
// //             borderRadius: '5px',
// //             cursor: 'pointer'
// //           }}
// //         >
// //           {showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}
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
// //   const roadsDataSourceRef = useRef(null);
// //   const heatmapDataSourceRef = useRef(null);
// //   const buildingLabelsRef = useRef([]);
// //   const vehiclesRef = useRef([]);
// //   const [status, setStatus] = useState('Click on the map to add an anchor point.');
// //   const [showVideoModal, setShowVideoModal] = useState(false);
// //   const [videoUrl, setVideoUrl] = useState('');
// //   const [videoTitle, setVideoTitle] = useState('');
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [showHeatmap, setShowHeatmap] = useState(false);
// //   const [showRoads, setShowRoads] = useState(true);
// //   const [showVehicles, setShowVehicles] = useState(true);
// //   const [heatmapIntensity, setHeatmapIntensity] = useState(1.0);
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
// //           baseLayerPicker: true,
// //           sceneMode: Cesium.SceneMode.SCENE3D,
// //           shouldAnimate: true,
// //           imageryProvider: new Cesium.IonImageryProvider({ assetId: 3845 }),
// //           creditContainer: document.createElement('div'),
// //           scene3DOnly: true,
// //           orderIndependentTranslucency: false,
// //           shadows: false
// //         });

// //         // Disable features we don't need for better performance
// //         viewerRef.current.scene.globe.showGroundAtmosphere = false;
// //         viewerRef.current.scene.fog.enabled = false;
// //         viewerRef.current.scene.skyAtmosphere.show = false;

// //         // Load data in parallel
// //         await Promise.all([
// //           load3DTileset(),
// //           loadGeoJsonData(),
// //           loadRoadsData(),
// //           loadHeatmapData()
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
// //         show: false
// //       });
      
// //       tileset.maximumScreenSpaceError = 2;
// //       tileset.dynamicScreenSpaceError = true;
// //       tileset.dynamicScreenSpaceErrorDensity = 0.00278;
// //       tileset.dynamicScreenSpaceErrorFactor = 4.0;
// //       tileset.dynamicScreenSpaceErrorHeightFalloff = 0.25;
      
// //       viewerRef.current.scene.primitives.add(tileset);
// //       tilesetRef.current = tileset;

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
// //       const response = await fetch('http://localhost:8081/api/geojson');
// //       if (!response.ok) {
// //         throw new Error(`HTTP error! status: ${response.status}`);
// //       }
// //       const geojsonData = await response.json();
      
// //       const dataSource = await Cesium.GeoJsonDataSource.load(geojsonData, {
// //         clampToGround: false,
// //         stroke: Cesium.Color.BLUE,
// //         fill: Cesium.Color.BLUE.withAlpha(0.5),
// //         strokeWidth: 3
// //       });

// //       geoJsonDataSourceRef.current = dataSource;
// //       viewerRef.current.dataSources.add(dataSource);

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

// //   const loadRoadsData = async () => {
// //     try {
// //       const response = await fetch('http://localhost:8081/api/roads');
// //       if (!response.ok) {
// //         throw new Error(`HTTP error! status: ${response.status}`);
// //       }
// //       const roadsData = await response.json();
      
// //       const roadsDataSource = await Cesium.GeoJsonDataSource.load(roadsData, {
// //         clampToGround: true,
// //         stroke: Cesium.Color.GRAY,
// //         strokeWidth: 3
// //       });

// //       const entities = roadsDataSource.entities.values;
// //       entities.forEach(entity => {
// //         if (entity.polyline) {
// //           const highwayType = entity.properties.highway?.getValue();
          
// //           let color = Cesium.Color.GRAY;
// //           let width = 3;
          
// //           switch(highwayType) {
// //             case 'motorway':
// //               color = Cesium.Color.RED;
// //               width = 5;
// //               break;
// //             case 'trunk':
// //               color = Cesium.Color.ORANGE;
// //               width = 4.5;
// //               break;
// //             case 'primary':
// //               color = Cesium.Color.YELLOW;
// //               width = 4;
// //               break;
// //             case 'secondary':
// //               color = Cesium.Color.GREEN;
// //               width = 3.5;
// //               break;
// //             case 'tertiary':
// //               color = Cesium.Color.BLUE;
// //               width = 3;
// //               break;
// //             case 'residential':
// //               color = Cesium.Color.WHITE;
// //               width = 2;
// //               break;
// //             default:
// //               color = Cesium.Color.GRAY;
// //               width = 2;
// //           }
          
// //           entity.polyline.material = color;
// //           entity.polyline.width = width;
// //         }
// //       });

// //       roadsDataSourceRef.current = roadsDataSource;
// //       viewerRef.current.dataSources.add(roadsDataSource);
// //       return roadsDataSource;
// //     } catch (error) {
// //       console.error('Error loading roads data:', error);
// //       viewerRef.current.entities.add({
// //         position: Cesium.Cartesian3.fromDegrees(0, 0),
// //         label: {
// //           text: 'Failed to load roads data',
// //           font: '20px sans-serif',
// //           fillColor: Cesium.Color.RED
// //         }
// //       });
// //       return null;
// //     }
// //   };

// //   // const loadHeatmapData = async () => {
// //   //   try {
// //   //     const response = await fetch('http://localhost:8081/api/crowd-data');
// //   //     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
// //   //     const crowdData = await response.json();
// //   //     const heatmapDataSource = new Cesium.CustomDataSource('heatmap');
  
// //   //     // Sample data if API fails - use this for testing
// //   //     const testData = [
// //   //       { longitude: -74.0060, latitude: 40.7128, crowdCount: 80 },  // Lower Manhattan
// //   //       { longitude: -73.935242, latitude: 40.730610, crowdCount: 60 }, // East Village
// //   //       { longitude: -73.989308, latitude: 40.741895, crowdCount: 70 }, // Flatiron
// //   //       { longitude: -73.9855, latitude: 40.7580, crowdCount: 90 }, // Times Square
// //   //       { longitude: -73.9772, latitude: 40.7527, crowdCount: 50 }, // Midtown
// //   //     ];
  
// //   //     const displayData = crowdData.length > 0 ? crowdData : testData;
  
// //   //     // Normalize data and prepare heat points
// //   //     const maxCount = Math.max(...displayData.map(d => d.crowdCount), 100);
// //   //     const heatPoints = displayData.map(point => ({
// //   //       lon: point.longitude,
// //   //       lat: point.latitude,
// //   //       intensity: point.crowdCount / maxCount
// //   //     }));
  
// //   //     // Visualization parameters (adjust these as needed)
// //   //     const BASE_RADIUS = 100; // meters
// //   //     const BASE_BLUR = 50;    // meters
// //   //     const MAX_OPACITY = 0.8;
  
// //   //     heatPoints.forEach(point => {
// //   //       const radius = BASE_RADIUS * point.intensity;
// //   //       const blur = BASE_BLUR * point.intensity;
        
// //   //       // Main heat circle
// //   //       heatmapDataSource.entities.add({
// //   //         position: Cesium.Cartesian3.fromDegrees(point.lon, point.lat),
// //   //         ellipse: {
// //   //           semiMinorAxis: radius,
// //   //           semiMajorAxis: radius,
// //   //           material: new Cesium.ColorMaterialProperty(
// //   //             Cesium.Color.fromHsl(
// //   //               0.4 * (1 - point.intensity), // Hue (red to yellow)
// //   //               1.0,                         // Saturation
// //   //               0.5,                         // Lightness
// //   //               MAX_OPACITY * point.intensity // Opacity
// //   //             )
// //   //           ),
// //   //           outline: false,
// //   //           height: 0,
// //   //           show: showHeatmap
// //   //         }
// //   //       });
  
// //   //       // Blur effect (outer circle)
// //   //       heatmapDataSource.entities.add({
// //   //         position: Cesium.Cartesian3.fromDegrees(point.lon, point.lat),
// //   //         ellipse: {
// //   //           semiMinorAxis: radius + blur,
// //   //           semiMajorAxis: radius + blur,
// //   //           material: new Cesium.ColorMaterialProperty(
// //   //             Cesium.Color.fromHsl(
// //   //               0.4 * (1 - point.intensity),
// //   //               1.0,
// //   //               0.5,
// //   //               MAX_OPACITY * 0.3 * point.intensity
// //   //             )
// //   //           ),
// //   //           outline: false,
// //   //           height: 0,
// //   //           show: showHeatmap
// //   //         }
// //   //       });
// //   //     });
  
// //   //     // Add to viewer and zoom to data
// //   //     viewerRef.current.dataSources.add(heatmapDataSource);
// //   //     heatmapDataSourceRef.current = heatmapDataSource;
      
// //   //     // Zoom to show all heat points
// //   //     const positions = heatPoints.map(p => 
// //   //       Cesium.Cartesian3.fromDegrees(p.lon, p.lat)
// //   //     );
// //   //     viewerRef.current.camera.flyToBoundingSphere(
// //   //       new Cesium.BoundingSphere.fromPoints(positions)
// //   //     );
  
// //   //   } catch (error) {
// //   //     console.error('Error loading heatmap:', error);
      
// //   //     // Fallback visualization
// //   //     viewerRef.current.entities.add({
// //   //       position: Cesium.Cartesian3.fromDegrees(-73.9855, 40.7580),
// //   //       label: {
// //   //         text: 'Heatmap Data Unavailable',
// //   //         font: '20px sans-serif',
// //   //         fillColor: Cesium.Color.RED,
// //   //         showBackground: true,
// //   //         backgroundColor: Cesium.Color.WHITE.withAlpha(0.7)
// //   //       }
// //   //     });
// //   //   }
// //   // };
 
// // const loadHeatmapData = async () => {
// //   try {
// //     const response = await fetch('http://localhost:8081/api/crowd-data');
// //     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
// //     const crowdData = await response.json();
// //     const heatmapDataSource = new Cesium.CustomDataSource('heatmap');

// //     // Sample data if API fails - use this for testing
// //     const testData = [
// //       { 
// //         longitude: -74.0060, 
// //         latitude: 40.7128, 
// //         crowdCount: 80,
// //         locationName: "Lower Manhattan",
// //         timestamp: "2023-05-15T14:30:00Z",
// //         cameraId: "CAM001"
// //       },
// //       { 
// //         longitude: -73.935242, 
// //         latitude: 40.730610, 
// //         crowdCount: 60,
// //         locationName: "East Village",
// //         timestamp: "2023-05-15T14:35:00Z",
// //         cameraId: "CAM002"
// //       },
// //       // Add more test data points as needed
// //     ];

// //     const displayData = crowdData.length > 0 ? crowdData : testData;

// //     // Normalize data and prepare heat points
// //     const maxCount = Math.max(...displayData.map(d => d.crowdCount), 100);
// //     const heatPoints = displayData.map(point => ({
// //       lon: point.longitude,
// //       lat: point.latitude,
// //       intensity: point.crowdCount / maxCount,
// //       metadata: point // Store all original data
// //     }));

// //     // Visualization parameters
// //     const BASE_RADIUS = 100; // meters
// //     const BASE_BLUR = 50;    // meters
// //     const MAX_OPACITY = 0.8;

// //     heatPoints.forEach(point => {
// //       const radius = BASE_RADIUS * point.intensity;
// //       const blur = BASE_BLUR * point.intensity;
      
// //       // Main heat circle
// //       const entity = heatmapDataSource.entities.add({
// //         position: Cesium.Cartesian3.fromDegrees(point.lon, point.lat),
// //         ellipse: {
// //           semiMinorAxis: radius,
// //           semiMajorAxis: radius,
// //           material: new Cesium.ColorMaterialProperty(
// //             Cesium.Color.fromHsl(
// //               0.4 * (1 - point.intensity),
// //               1.0,
// //               0.5,
// //               MAX_OPACITY * point.intensity
// //             )
// //           ),
// //           outline: false,
// //           height: 0,
// //           show: showHeatmap
// //         },
// //         properties: {
// //           crowdCount: point.metadata.crowdCount,
// //           location: point.metadata.locationName || "Unknown Location",
// //           timestamp: point.metadata.timestamp || "Unknown Time",
// //           cameraId: point.metadata.cameraId || "N/A",
// //           intensity: point.intensity
// //         }
// //       });

// //       // Add description for click interaction
// //       entity.description = new Cesium.CallbackProperty(() => {
// //         return `
// //           <div style="padding: 10px; max-width: 300px;">
// //             <h3>${entity.properties.location.getValue()}</h3>
// //             <p><strong>Crowd Count:</strong> ${entity.properties.crowdCount.getValue()}</p>
// //             <p><strong>Time:</strong> ${new Date(entity.properties.timestamp.getValue()).toLocaleString()}</p>
// //             <p><strong>Camera ID:</strong> ${entity.properties.cameraId.getValue()}</p>
// //             <p><strong>Intensity:</strong> ${(entity.properties.intensity.getValue() * 100).toFixed(1)}%</p>
// //           </div>
// //         `;
// //       }, false);

// //       // Blur effect (outer circle)
// //       heatmapDataSource.entities.add({
// //         position: Cesium.Cartesian3.fromDegrees(point.lon, point.lat),
// //         ellipse: {
// //           semiMinorAxis: radius + blur,
// //           semiMajorAxis: radius + blur,
// //           material: new Cesium.ColorMaterialProperty(
// //             Cesium.Color.fromHsl(
// //               0.4 * (1 - point.intensity),
// //               1.0,
// //               0.5,
// //               MAX_OPACITY * 0.3 * point.intensity
// //             )
// //           ),
// //           outline: false,
// //           height: 0,
// //           show: showHeatmap
// //         }
// //       });

// //       // Add label for high-density areas
// //       if (point.intensity > 0.5) {
// //         heatmapDataSource.entities.add({
// //           position: Cesium.Cartesian3.fromDegrees(point.lon, point.lat, 10),
// //           label: {
// //             text: `${point.metadata.crowdCount} people`,
// //             font: '14px sans-serif',
// //             fillColor: Cesium.Color.WHITE,
// //             outlineColor: Cesium.Color.BLACK,
// //             outlineWidth: 2,
// //             style: Cesium.LabelStyle.FILL_AND_OUTLINE,
// //             verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
// //             pixelOffset: new Cesium.Cartesian2(0, -10),
// //             show: showHeatmap && viewerRef.current?.camera.positionCartographic.height < 1000
// //           }
// //         });
// //       }
// //     });

// //     viewerRef.current.dataSources.add(heatmapDataSource);
// //     heatmapDataSourceRef.current = heatmapDataSource;
    
// //     // Zoom to show all heat points
// //     const positions = heatPoints.map(p => 
// //       Cesium.Cartesian3.fromDegrees(p.lon, p.lat)
// //     );
// //     viewerRef.current.camera.flyToBoundingSphere(
// //       new Cesium.BoundingSphere.fromPoints(positions)
// //     );

// //     // Enable click interaction
// //     viewerRef.current.screenSpaceEventHandler.setInputAction((movement) => {
// //       const pickedObject = viewerRef.current.scene.pick(movement.position);
// //       if (pickedObject && pickedObject.id && pickedObject.id.properties) {
// //         const properties = pickedObject.id.properties;
// //         setStatus(
// //           `${properties.location.getValue()}: ${properties.crowdCount.getValue()} people`
// //         );
// //       }
// //     }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

// //   } catch (error) {
// //     console.error('Error loading heatmap:', error);
    
// //     // Fallback visualization
// //     viewerRef.current.entities.add({
// //       position: Cesium.Cartesian3.fromDegrees(-73.9855, 40.7580),
// //       label: {
// //         text: 'Heatmap Data Unavailable',
// //         font: '20px sans-serif',
// //         fillColor: Cesium.Color.RED,
// //         showBackground: true,
// //         backgroundColor: Cesium.Color.WHITE.withAlpha(0.7)
// //       }
// //     });
// //   }
// // };

// //   const getHeatmapColor = (intensity) => {
// //     // Adjust these values to match your desired color scheme
// //     if (intensity > 0.7) return Cesium.Color.RED;
// //     if (intensity > 0.4) return Cesium.Color.ORANGE;
// //     return Cesium.Color.YELLOW;
// //   };



// //   const addMovingVehicles = useCallback(async () => {
// //     if (!viewerRef.current || !roadsDataSourceRef.current) return;
  
// //     // Clear existing vehicles
// //     vehiclesRef.current.forEach(vehicle => {
// //       viewerRef.current.entities.remove(vehicle);
// //     });
// //     vehiclesRef.current = [];
  
// //     // Get all road entities
// //     const roadEntities = roadsDataSourceRef.current.entities.values;
// //     const roads = [];
  
// //     // Pre-process road positions to include terrain heights
// //     for (const entity of roadEntities) {
// //       if (entity.polyline) {
// //         const positions = entity.polyline.positions.getValue();
        
// //         // Sample terrain for all road points
// //         const cartographics = positions.map(pos => 
// //           Cesium.Cartographic.fromCartesian(pos)
// //         );
        
// //         try {
// //           const updatedPositions = await Cesium.sampleTerrainMostDetailed(
// //             viewerRef.current.terrainProvider,
// //             cartographics
// //           );
          
// //           const terrainAdjustedPositions = updatedPositions.map(cartographic => 
// //             Cesium.Cartesian3.fromRadians(
// //               cartographic.longitude,
// //               cartographic.latitude,
// //               cartographic.height + 0.5 // Add 0.5m to ensure vehicle is above ground
// //             )
// //           );
          
// //           roads.push({
// //             positions: terrainAdjustedPositions,
// //             type: entity.properties?.highway?.getValue() || 'residential'
// //           });
// //         } catch (error) {
// //           console.error("Error sampling road terrain:", error);
// //           roads.push({
// //             positions: positions,
// //             type: entity.properties?.highway?.getValue() || 'residential'
// //           });
// //         }
// //       }
// //     }
  
// //     // Vehicle configurations
// //     const vehicleTypes = [
// //       { model: '/models/car.glb', scale: 1.0, speed: 0.005 },
// //       { model: '/models/car.glb', scale: 1.5, speed: 0.005 },
// //       { model: '/models/car.glb', scale: 1.8, speed: 0.005 }
// //     ];
  
// //     // Create random vehicles
// //     for (let i = 0; i < 20; i++) {
// //       const road = roads[Math.floor(Math.random() * roads.length)];
// //       if (!road || road.positions.length < 2) continue;
  
// //       const vehicleType = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
  
// //       const vehicle = viewerRef.current.entities.add({
// //         name: `Vehicle ${i + 1}`,
// //         position: road.positions[0],
// //         model: {
// //           uri: vehicleType.model,
// //           minimumPixelSize: 32,
// //           maximumScale: 20000,
// //           scale: vehicleType.scale
// //         }
// //       });
  
// //       vehicle.roadPositions = road.positions;
// //       vehicle.currentPositionIndex = 0;
// //       vehicle.speed = vehicleType.speed * (0.8 + Math.random() * 0.4);
// //       vehicle.roadType = road.type;
// //       vehicle.targetPositionIndex = 1; // Start moving toward the next point
  
// //       vehiclesRef.current.push(vehicle);
// //     }
  
// //     // Animation function
// //     const animateVehicles = () => {
// //       if (!viewerRef.current) return;
  
// //       const now = Cesium.JulianDate.now();
      
// //       vehiclesRef.current.forEach(vehicle => {
// //         if (!vehicle.roadPositions || vehicle.roadPositions.length < 2) return;
  
// //         const currentTargetIndex = vehicle.targetPositionIndex;
// //         const currentPos = vehicle.position.getValue(now);
// //         const targetPos = vehicle.roadPositions[currentTargetIndex];
        
// //         // Calculate direction to target
// //         const direction = Cesium.Cartesian3.subtract(targetPos, currentPos, new Cesium.Cartesian3());
// //         const distance = Cesium.Cartesian3.magnitude(direction);
        
// //         if (distance < 2) {
// //           // Reached target point, move to next
// //           vehicle.targetPositionIndex = (currentTargetIndex + 1) % vehicle.roadPositions.length;
// //           return;
// //         }
        
// //         const normalizedDirection = Cesium.Cartesian3.normalize(direction, new Cesium.Cartesian3());
// //         const movement = Cesium.Cartesian3.multiplyByScalar(
// //           normalizedDirection, 
// //           Math.min(vehicle.speed, distance), // Don't overshoot target
// //           new Cesium.Cartesian3()
// //         );
        
// //         const newPosition = Cesium.Cartesian3.add(currentPos, movement, new Cesium.Cartesian3());
        
// //         // Adjust vehicle position and orientation
// //         vehicle.position = newPosition;
        
// //         // Calculate heading (yaw) from direction vector
// //         const heading = Math.atan2(direction.y, direction.x);
        
// //         // Calculate pitch based on terrain slope
// //         let pitch = 0;
// //         if (currentTargetIndex > 0) {
// //           const prevPos = vehicle.roadPositions[currentTargetIndex - 1];
// //           const verticalChange = targetPos.z - prevPos.z;
// //           const horizontalDistance = Cesium.Cartesian3.distance(
// //             new Cesium.Cartesian3(prevPos.x, prevPos.y, 0),
// //             new Cesium.Cartesian3(targetPos.x, targetPos.y, 0)
// //           );
// //           pitch = Math.atan2(verticalChange, horizontalDistance);
// //         }
        
// //         vehicle.orientation = Cesium.Quaternion.fromHeadingPitchRoll(
// //           new Cesium.HeadingPitchRoll(heading, pitch, 0)
// //         );
// //       });
      
// //       requestAnimationFrame(animateVehicles);
// //     };
  
// //     animateVehicles();
// //   }, [roadsDataSourceRef.current]);

// //   useEffect(() => {
// //     if (!isLoading && showRoads && showVehicles && roadsDataSourceRef.current) {
// //       addMovingVehicles();
// //     }
// //   }, [isLoading, showRoads, showVehicles, addMovingVehicles]);

// //   const toggleHeatmap = useCallback(async () => {
// //     const newShowState = !showHeatmap;
// //     setShowHeatmap(newShowState);
    
// //     if (heatmapDataSourceRef.current) {
// //       // Toggle visibility of all heatmap entities
// //       heatmapDataSourceRef.current.entities.values.forEach(entity => {
// //         if (entity.ellipse) entity.ellipse.show = newShowState;
// //         if (entity.label) entity.label.show = newShowState;
// //       });
// //     } else if (newShowState) {
// //       // Only load heatmap data if we're turning it on
// //       await loadHeatmapData();
// //     }
    
// //     setStatus(`Heatmap is now ${newShowState ? 'visible' : 'hidden'}`);
// //   }, [showHeatmap, loadHeatmapData]);

// //   const toggleRoads = useCallback(async () => {
// //     const newShowState = !showRoads;
// //     setShowRoads(newShowState);
    
// //     if (roadsDataSourceRef.current) {
// //       roadsDataSourceRef.current.show = newShowState;
// //       if (newShowState && showVehicles) {
// //         await addMovingVehicles();
// //       }
// //     } else {
// //       await loadRoadsData();
// //       if (newShowState && showVehicles) {
// //         await addMovingVehicles();
// //       }
// //     }
    
// //     setStatus(`Roads are now ${newShowState ? 'visible' : 'hidden'}`);
// //   }, [showRoads, showVehicles, addMovingVehicles]);

// //   const toggleVehicles = useCallback(async () => {
// //     const newShowState = !showVehicles;
// //     setShowVehicles(newShowState);
    
// //     if (newShowState && roadsDataSourceRef.current?.show) {
// //       await addMovingVehicles();
// //     } else {
// //       vehiclesRef.current.forEach(vehicle => {
// //         viewerRef.current.entities.remove(vehicle);
// //       });
// //       vehiclesRef.current = [];
// //     }
    
// //     setStatus(`Vehicles are now ${newShowState ? 'visible' : 'hidden'}`);
// //   }, [showVehicles]);

// //   const setupZoomListener = useCallback(() => {
// //     const checkZoomLevel = () => {
// //       if (!viewerRef.current) return;
// //       const cameraHeight = viewerRef.current.camera.positionCartographic.height;
// //       buildingLabelsRef.current.forEach(labelEntity => {
// //         labelEntity.label.show = cameraHeight < zoomThreshold;
// //       });
      
// //       if (heatmapDataSourceRef.current) {
// //         heatmapDataSourceRef.current.entities.values.forEach(entity => {
// //           if (entity.label) {
// //             entity.label.show = showHeatmap && cameraHeight < 1000;
// //           }
// //         });
// //       }
// //     };

// //     viewerRef.current.camera.changed.addEventListener(checkZoomLevel);
// //     checkZoomLevel();
// //   }, [showHeatmap]);

// //   const toggleTileset = useCallback(() => {
// //     if (tilesetRef.current) {
// //       tilesetRef.current.show = !tilesetRef.current.show;
// //       setStatus(`3D Tileset is now ${tilesetRef.current.show ? 'visible' : 'hidden'}`);
// //     }
// //   }, []);

// //   const toggleGeoJson = useCallback(() => {
// //     if (geoJsonDataSourceRef.current) {
// //       const isVisible = !geoJsonDataSourceRef.current.show;
// //       geoJsonDataSourceRef.current.show = isVisible;
// //       setStatus(`GeoJSON data is now ${isVisible ? 'visible' : 'hidden'}`);
  
// //       // Toggle building labels visibility
// //       buildingLabelsRef.current.forEach(label => {
// //         label.show = isVisible;  // Sync visibility
// //       });
// //     }
// //   }, []);

// //   const handleMapClick = useCallback(async (movement) => {
// //     if (!viewerRef.current) return;

// //     const pickedObject = viewerRef.current.scene.pick(movement.position);
// //     if (pickedObject && pickedObject.id && pickedObject.id.properties) {
// //       if (pickedObject.id.properties.video) {
// //         const videoUrl = pickedObject.id.properties.video.getValue();
// //         const videoTitle = pickedObject.id.properties['@id'].getValue();
// //         setVideoUrl(videoUrl);
// //         setVideoTitle(videoTitle);
// //         setShowVideoModal(true);
// //       }
// //       return;
// //     }

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

// //       const dataSource = await Cesium.GeoJsonDataSource.load(newFeature, {
// //         clampToGround: true,
// //         markerColor: Cesium.Color.RED,
// //         markerSymbol: '?'
// //       });
      
// //       viewerRef.current.dataSources.add(dataSource);
// //       await viewerRef.current.zoomTo(dataSource);
      
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

// //   useEffect(() => {
// //     if (!viewerRef.current || isLoading) return;
  
// //     const { canvas, scene, entities } = viewerRef.current;
// //     if (!canvas || !scene || !entities) return;  // Prevent undefined errors
  
// //     const handler = new Cesium.ScreenSpaceEventHandler(canvas);
// //     handler.setInputAction(handleMapClick, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  
// //     return () => {
// //       handler.destroy();
// //     };
// //   }, [isLoading, handleMapClick]);

// //   return (
// //     <div style={{ position: 'relative', width: '100%', height: '90vh' }}>
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
// //         gap: '10px',
// //         flexDirection: 'column'
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
// //         <button 
// //           onClick={toggleRoads}
// //           style={{
// //             backgroundColor: showRoads ? 'rgba(100, 100, 100, 0.9)' : 'rgba(0, 0, 0, 0.7)',
// //             color: 'white',
// //             padding: '10px',
// //             border: 'none',
// //             borderRadius: '5px',
// //             cursor: 'pointer'
// //           }}
// //         >
// //           {showRoads ? 'Hide Roads' : 'Show Roads'}
// //         </button>
// //         <button 
// //           onClick={toggleVehicles}
// //           style={{
// //             backgroundColor: showVehicles ? 'rgba(50, 150, 200, 0.9)' : 'rgba(0, 0, 0, 0.7)',
// //             color: 'white',
// //             padding: '10px',
// //             border: 'none',
// //             borderRadius: '5px',
// //             cursor: 'pointer'
// //           }}
// //         >
// //           {showVehicles ? 'Hide Vehicles' : 'Show Vehicles'}
// //         </button>
// //         <button 
// //           onClick={toggleHeatmap}
// //           style={{
// //             backgroundColor: showHeatmap ? 'rgba(255, 100, 0, 0.9)' : 'rgba(0, 0, 0, 0.7)',
// //             color: 'white',
// //             padding: '10px',
// //             border: 'none',
// //             borderRadius: '5px',
// //             cursor: 'pointer'
// //           }}
// //         >
// //           {showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}
// //         </button>
// //       </div>
      
// //       {/* Heatmap Legend */}
// //       <div style={{
// //         position: 'absolute',
// //         bottom: '20px',
// //         left: '10px',
// //         zIndex: 1000,
// //         background: 'rgba(255, 255, 255, 0.8)',
// //         padding: '10px',
// //         borderRadius: '5px'
// //       }}>
// //         <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Heatmap Legend</div>
// //         <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
// //           <div style={{
// //             width: '20px',
// //             height: '20px',
// //             backgroundColor: Cesium.Color.fromHsl(0.3, 1, 0.5).toCssColorString(),
// //             marginRight: '5px'
// //           }}></div>
// //           <span>Low Density</span>
// //         </div>
// //         <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
// //           <div style={{
// //             width: '20px',
// //             height: '20px',
// //             backgroundColor: Cesium.Color.fromHsl(0.15, 1, 0.5).toCssColorString(),
// //             marginRight: '5px'
// //           }}></div>
// //           <span>Medium Density</span>
// //         </div>
// //         <div style={{ display: 'flex', alignItems: 'center' }}>
// //           <div style={{
// //             width: '20px',
// //             height: '20px',
// //             backgroundColor: Cesium.Color.fromHsl(0.0, 1, 0.5).toCssColorString(),
// //             marginRight: '5px'
// //           }}></div>
// //           <span>High Density</span>
// //         </div>
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
//   const roadsDataSourceRef = useRef(null);
//   const heatmapDataSourceRef = useRef(null);
//   const buildingLabelsRef = useRef([]);
//   const vehiclesRef = useRef([]);
//   const [status, setStatus] = useState('Click on the map to add an anchor point.');
//   const [showVideoModal, setShowVideoModal] = useState(false);
//   const [videoUrl, setVideoUrl] = useState('');
//   const [videoTitle, setVideoTitle] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [showHeatmap, setShowHeatmap] = useState(false);
//   const [showRoads, setShowRoads] = useState(true);
//   const [showVehicles, setShowVehicles] = useState(true);
//   const [heatmapIntensity, setHeatmapIntensity] = useState(1.0);
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
//           baseLayerPicker: true,
//           sceneMode: Cesium.SceneMode.SCENE3D,
//           shouldAnimate: true,
//           imageryProvider: new Cesium.IonImageryProvider({ assetId: 3845 }),
//           creditContainer: document.createElement('div'),
//           scene3DOnly: true,
//           orderIndependentTranslucency: false,
//           shadows: false
//         });

//         // Disable features we don't need for better performance
//         viewerRef.current.scene.globe.showGroundAtmosphere = false;
//         viewerRef.current.scene.fog.enabled = false;
//         viewerRef.current.scene.skyAtmosphere.show = false;

//         // Load data in parallel
//         await Promise.all([
//           load3DTileset(),
//           loadGeoJsonData(),
//           loadRoadsData(),
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
//         show: false
//       });
      
//       tileset.maximumScreenSpaceError = 2;
//       tileset.dynamicScreenSpaceError = true;
//       tileset.dynamicScreenSpaceErrorDensity = 0.00278;
//       tileset.dynamicScreenSpaceErrorFactor = 4.0;
//       tileset.dynamicScreenSpaceErrorHeightFalloff = 0.25;
      
//       viewerRef.current.scene.primitives.add(tileset);
//       tilesetRef.current = tileset;

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
//       const response = await fetch('http://localhost:8081/api/geojson');
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const geojsonData = await response.json();
      
//       const dataSource = await Cesium.GeoJsonDataSource.load(geojsonData, {
//         clampToGround: false,
//         stroke: Cesium.Color.BLUE,
//         fill: Cesium.Color.BLUE.withAlpha(0.5),
//         strokeWidth: 3
//       });

//       geoJsonDataSourceRef.current = dataSource;
//       viewerRef.current.dataSources.add(dataSource);

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

//   const loadRoadsData = async () => {
//     try {
//       const response = await fetch('http://localhost:8081/api/roads');
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const roadsData = await response.json();
      
//       const roadsDataSource = await Cesium.GeoJsonDataSource.load(roadsData, {
//         clampToGround: true,
//         stroke: Cesium.Color.GRAY,
//         strokeWidth: 3
//       });

//       const entities = roadsDataSource.entities.values;
//       entities.forEach(entity => {
//         if (entity.polyline) {
//           const highwayType = entity.properties.highway?.getValue();
          
//           let color = Cesium.Color.GRAY;
//           let width = 3;
          
//           switch(highwayType) {
//             case 'motorway':
//               color = Cesium.Color.RED;
//               width = 5;
//               break;
//             case 'trunk':
//               color = Cesium.Color.ORANGE;
//               width = 4.5;
//               break;
//             case 'primary':
//               color = Cesium.Color.YELLOW;
//               width = 4;
//               break;
//             case 'secondary':
//               color = Cesium.Color.GREEN;
//               width = 3.5;
//               break;
//             case 'tertiary':
//               color = Cesium.Color.BLUE;
//               width = 3;
//               break;
//             case 'residential':
//               color = Cesium.Color.WHITE;
//               width = 2;
//               break;
//             default:
//               color = Cesium.Color.GRAY;
//               width = 2;
//           }
          
//           entity.polyline.material = color;
//           entity.polyline.width = width;
//         }
//       });

//       roadsDataSourceRef.current = roadsDataSource;
//       viewerRef.current.dataSources.add(roadsDataSource);
//       return roadsDataSource;
//     } catch (error) {
//       console.error('Error loading roads data:', error);
//       viewerRef.current.entities.add({
//         position: Cesium.Cartesian3.fromDegrees(0, 0),
//         label: {
//           text: 'Failed to load roads data',
//           font: '20px sans-serif',
//           fillColor: Cesium.Color.RED
//         }
//       });
//       return null;
//     }
//   };

//   const loadHeatmapData = async () => {
//     try {
//       const response = await fetch('http://localhost:8081/api/crowd-data');
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
//       const crowdData = await response.json();
//       const heatmapDataSource = new Cesium.CustomDataSource('heatmap');

//       // Sample data if API fails - use this for testing
//       const testData = [
//         { 
//           longitude: -74.0060, 
//           latitude: 40.7128, 
//           crowdCount: 80,
//           locationName: "Lower Manhattan",
//           timestamp: "2023-05-15T14:30:00Z",
//           cameraId: "CAM001"
//         },
//         { 
//           longitude: -73.935242, 
//           latitude: 40.730610, 
//           crowdCount: 60,
//           locationName: "East Village",
//           timestamp: "2023-05-15T14:35:00Z",
//           cameraId: "CAM002"
//         },
//       ];

//       const displayData = crowdData.length > 0 ? crowdData : testData;

//       // Normalize data and prepare heat points
//       const maxCount = Math.max(...displayData.map(d => d.crowdCount), 100);
//       const heatPoints = displayData.map(point => ({
//         lon: point.longitude,
//         lat: point.latitude,
//         intensity: point.crowdCount / maxCount,
//         metadata: point // Store all original data
//       }));

//       // Visualization parameters
//       const BASE_RADIUS = 100; // meters
//       const BASE_BLUR = 50;    // meters
//       const MAX_OPACITY = 0.8;

//       heatPoints.forEach(point => {
//         const radius = BASE_RADIUS * point.intensity;
//         const blur = BASE_BLUR * point.intensity;
        
//         // Main heat circle
//         const entity = heatmapDataSource.entities.add({
//           position: Cesium.Cartesian3.fromDegrees(point.lon, point.lat),
//           ellipse: {
//             semiMinorAxis: radius,
//             semiMajorAxis: radius,
//             material: new Cesium.ColorMaterialProperty(
//               Cesium.Color.fromHsl(
//                 0.4 * (1 - point.intensity),
//                 1.0,
//                 0.5,
//                 MAX_OPACITY * point.intensity
//               )
//             ),
//             outline: false,
//             height: 0,
//             show: showHeatmap
//           },
//           properties: {
//             crowdCount: point.metadata.crowdCount,
//             location: point.metadata.locationName || "Unknown Location",
//             timestamp: point.metadata.timestamp || "Unknown Time",
//             cameraId: point.metadata.cameraId || "N/A",
//             intensity: point.intensity
//           }
//         });

//         // Add description for click interaction
//         entity.description = new Cesium.CallbackProperty(() => {
//           return `
//             <div style="padding: 10px; max-width: 300px;">
//               <h3>${entity.properties.location.getValue()}</h3>
//               <p><strong>Crowd Count:</strong> ${entity.properties.crowdCount.getValue()}</p>
//               <p><strong>Time:</strong> ${new Date(entity.properties.timestamp.getValue()).toLocaleString()}</p>
//               <p><strong>Camera ID:</strong> ${entity.properties.cameraId.getValue()}</p>
//               <p><strong>Intensity:</strong> ${(entity.properties.intensity.getValue() * 100).toFixed(1)}%</p>
//             </div>
//           `;
//         }, false);

//         // Blur effect (outer circle)
//         heatmapDataSource.entities.add({
//           position: Cesium.Cartesian3.fromDegrees(point.lon, point.lat),
//           ellipse: {
//             semiMinorAxis: radius + blur,
//             semiMajorAxis: radius + blur,
//             material: new Cesium.ColorMaterialProperty(
//               Cesium.Color.fromHsl(
//                 0.4 * (1 - point.intensity),
//                 1.0,
//                 0.5,
//                 MAX_OPACITY * 0.3 * point.intensity
//               )
//             ),
//             outline: false,
//             height: 0,
//             show: showHeatmap
//           }
//         });

//         // Add label for high-density areas
//         if (point.intensity > 0.5) {
//           heatmapDataSource.entities.add({
//             position: Cesium.Cartesian3.fromDegrees(point.lon, point.lat, 10),
//             label: {
//               text: `${point.metadata.crowdCount} people`,
//               font: '14px sans-serif',
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

//       viewerRef.current.dataSources.add(heatmapDataSource);
//       heatmapDataSourceRef.current = heatmapDataSource;
      
//       // Zoom to show all heat points
//       const positions = heatPoints.map(p => 
//         Cesium.Cartesian3.fromDegrees(p.lon, p.lat)
//       );
//       viewerRef.current.camera.flyToBoundingSphere(
//         new Cesium.BoundingSphere.fromPoints(positions)
//       );

//       // Enable click interaction
//       viewerRef.current.screenSpaceEventHandler.setInputAction((movement) => {
//         const pickedObject = viewerRef.current.scene.pick(movement.position);
//         if (pickedObject && pickedObject.id && pickedObject.id.properties) {
//           const properties = pickedObject.id.properties;
//           setStatus(
//             `${properties.location.getValue()}: ${properties.crowdCount.getValue()} people`
//           );
//         }
//       }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

//     } catch (error) {
//       console.error('Error loading heatmap:', error);
      
//       // Fallback visualization
//       viewerRef.current.entities.add({
//         position: Cesium.Cartesian3.fromDegrees(-73.9855, 40.7580),
//         label: {
//           text: 'Heatmap Data Unavailable',
//           font: '20px sans-serif',
//           fillColor: Cesium.Color.RED,
//           showBackground: true,
//           backgroundColor: Cesium.Color.WHITE.withAlpha(0.7)
//         }
//       });
//     }
//   };

//   const getHeatmapColor = (intensity) => {
//     // Adjust these values to match your desired color scheme
//     if (intensity > 0.7) return Cesium.Color.RED;
//     if (intensity > 0.4) return Cesium.Color.ORANGE;
//     return Cesium.Color.YELLOW;
//   };

//   const addMovingVehicles = useCallback(async () => {
//     if (!viewerRef.current || !roadsDataSourceRef.current) return;
  
//     // Clear existing vehicles
//     vehiclesRef.current.forEach(vehicle => {
//       viewerRef.current.entities.remove(vehicle);
//     });
//     vehiclesRef.current = [];
  
//     // Get all road entities
//     const roadEntities = roadsDataSourceRef.current.entities.values;
//     const roads = [];
  
//     // Pre-process road positions to include terrain heights
//     for (const entity of roadEntities) {
//       if (entity.polyline) {
//         const positions = entity.polyline.positions.getValue();
        
//         // Sample terrain for all road points
//         const cartographics = positions.map(pos => 
//           Cesium.Cartographic.fromCartesian(pos)
//         );
        
//         try {
//           const updatedPositions = await Cesium.sampleTerrainMostDetailed(
//             viewerRef.current.terrainProvider,
//             cartographics
//           );
          
//           const terrainAdjustedPositions = updatedPositions.map(cartographic => 
//             Cesium.Cartesian3.fromRadians(
//               cartographic.longitude,
//               cartographic.latitude,
//               cartographic.height + 0.5 // Add 0.5m to ensure vehicle is above ground
//             )
//           );
          
//           roads.push({
//             positions: terrainAdjustedPositions,
//             type: entity.properties?.highway?.getValue() || 'residential'
//           });
//         } catch (error) {
//           console.error("Error sampling road terrain:", error);
//           roads.push({
//             positions: positions,
//             type: entity.properties?.highway?.getValue() || 'residential'
//           });
//         }
//       }
//     }
  
//     // Vehicle configurations
//     const vehicleTypes = [
//       { model: '/models/car.glb', scale: 1.0, speed: 0.005 },
//       { model: '/models/car.glb', scale: 1.5, speed: 0.005 },
//       { model: '/models/car.glb', scale: 1.8, speed: 0.005 }
//     ];
  
//     // Create random vehicles
//     for (let i = 0; i < 20; i++) {
//       const road = roads[Math.floor(Math.random() * roads.length)];
//       if (!road || road.positions.length < 2) continue;
  
//       const vehicleType = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
  
//       const vehicle = viewerRef.current.entities.add({
//         name: `Vehicle ${i + 1}`,
//         position: road.positions[0],
//         model: {
//           uri: vehicleType.model,
//           minimumPixelSize: 32,
//           maximumScale: 20000,
//           scale: vehicleType.scale
//         }
//       });
  
//       vehicle.roadPositions = road.positions;
//       vehicle.currentPositionIndex = 0;
//       vehicle.speed = vehicleType.speed * (0.8 + Math.random() * 0.4);
//       vehicle.roadType = road.type;
//       vehicle.targetPositionIndex = 1; // Start moving toward the next point
  
//       vehiclesRef.current.push(vehicle);
//     }
  
//     // Animation function
//     const animateVehicles = () => {
//       if (!viewerRef.current) return;
  
//       const now = Cesium.JulianDate.now();
      
//       vehiclesRef.current.forEach(vehicle => {
//         if (!vehicle.roadPositions || vehicle.roadPositions.length < 2) return;
  
//         const currentTargetIndex = vehicle.targetPositionIndex;
//         const currentPos = vehicle.position.getValue(now);
//         const targetPos = vehicle.roadPositions[currentTargetIndex];
        
//         // Calculate direction to target
//         const direction = Cesium.Cartesian3.subtract(targetPos, currentPos, new Cesium.Cartesian3());
//         const distance = Cesium.Cartesian3.magnitude(direction);
        
//         if (distance < 2) {
//           // Reached target point, move to next
//           vehicle.targetPositionIndex = (currentTargetIndex + 1) % vehicle.roadPositions.length;
//           return;
//         }
        
//         const normalizedDirection = Cesium.Cartesian3.normalize(direction, new Cesium.Cartesian3());
//         const movement = Cesium.Cartesian3.multiplyByScalar(
//           normalizedDirection, 
//           Math.min(vehicle.speed, distance), // Don't overshoot target
//           new Cesium.Cartesian3()
//         );
        
//         const newPosition = Cesium.Cartesian3.add(currentPos, movement, new Cesium.Cartesian3());
        
//         // Adjust vehicle position and orientation
//         vehicle.position = newPosition;
        
//         // Calculate heading (yaw) from direction vector
//         const heading = Math.atan2(direction.y, direction.x);
        
//         // Calculate pitch based on terrain slope
//         let pitch = 0;
//         if (currentTargetIndex > 0) {
//           const prevPos = vehicle.roadPositions[currentTargetIndex - 1];
//           const verticalChange = targetPos.z - prevPos.z;
//           const horizontalDistance = Cesium.Cartesian3.distance(
//             new Cesium.Cartesian3(prevPos.x, prevPos.y, 0),
//             new Cesium.Cartesian3(targetPos.x, targetPos.y, 0)
//           );
//           pitch = Math.atan2(verticalChange, horizontalDistance);
//         }
        
//         vehicle.orientation = Cesium.Quaternion.fromHeadingPitchRoll(
//           new Cesium.HeadingPitchRoll(heading, pitch, 0)
//         );
//       });
      
//       requestAnimationFrame(animateVehicles);
//     };
  
//     animateVehicles();
//   }, [roadsDataSourceRef.current]);

//   useEffect(() => {
//     if (!isLoading && showRoads && showVehicles && roadsDataSourceRef.current) {
//       addMovingVehicles();
//     }
//   }, [isLoading, showRoads, showVehicles, addMovingVehicles]);

//   const toggleHeatmap = useCallback(async () => {
//     const newShowState = !showHeatmap;
//     setShowHeatmap(newShowState);
    
//     if (heatmapDataSourceRef.current) {
//       // Toggle visibility of all heatmap entities
//       heatmapDataSourceRef.current.entities.values.forEach(entity => {
//         if (entity.ellipse) entity.ellipse.show = newShowState;
//         if (entity.label) entity.label.show = newShowState;
//       });
//     } else if (newShowState) {
//       // Only load heatmap data if we're turning it on
//       await loadHeatmapData();
//     }
    
//     setStatus(`Heatmap is now ${newShowState ? 'visible' : 'hidden'}`);
//   }, [showHeatmap, loadHeatmapData]);

//   const toggleRoads = useCallback(async () => {
//     const newShowState = !showRoads;
//     setShowRoads(newShowState);
    
//     if (roadsDataSourceRef.current) {
//       roadsDataSourceRef.current.show = newShowState;
//       if (newShowState && showVehicles) {
//         await addMovingVehicles();
//       }
//     } else {
//       await loadRoadsData();
//       if (newShowState && showVehicles) {
//         await addMovingVehicles();
//       }
//     }
    
//     setStatus(`Roads are now ${newShowState ? 'visible' : 'hidden'}`);
//   }, [showRoads, showVehicles, addMovingVehicles]);

//   const toggleVehicles = useCallback(async () => {
//     const newShowState = !showVehicles;
//     setShowVehicles(newShowState);
    
//     if (newShowState && roadsDataSourceRef.current?.show) {
//       await addMovingVehicles();
//     } else {
//       vehiclesRef.current.forEach(vehicle => {
//         viewerRef.current.entities.remove(vehicle);
//       });
//       vehiclesRef.current = [];
//     }
    
//     setStatus(`Vehicles are now ${newShowState ? 'visible' : 'hidden'}`);
//   }, [showVehicles]);

//   const setupZoomListener = useCallback(() => {
//     const checkZoomLevel = () => {
//       if (!viewerRef.current) return;
//       const cameraHeight = viewerRef.current.camera.positionCartographic.height;
//       buildingLabelsRef.current.forEach(labelEntity => {
//         labelEntity.label.show = cameraHeight < zoomThreshold;
//       });
      
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
//       const isVisible = !geoJsonDataSourceRef.current.show;
//       geoJsonDataSourceRef.current.show = isVisible;
//       setStatus(`GeoJSON data is now ${isVisible ? 'visible' : 'hidden'}`);
  
//       // Toggle building labels visibility
//       buildingLabelsRef.current.forEach(label => {
//         label.show = isVisible;  // Sync visibility
//       });
//     }
//   }, []);

//   const handleMapClick = useCallback(async (movement) => {
//     if (!viewerRef.current) return;

//     const pickedObject = viewerRef.current.scene.pick(movement.position);
//     if (pickedObject && pickedObject.id && pickedObject.id.properties) {
//       if (pickedObject.id.properties.video) {
//         const videoUrl = pickedObject.id.properties.video.getValue();
//         const videoTitle = pickedObject.id.properties['@id'].getValue();
//         setVideoUrl(videoUrl);
//         setVideoTitle(videoTitle);
//         setShowVideoModal(true);
//       }
//       return;
//     }

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

//       const dataSource = await Cesium.GeoJsonDataSource.load(newFeature, {
//         clampToGround: true,
//         markerColor: Cesium.Color.RED,
//         markerSymbol: '?'
//       });
      
//       viewerRef.current.dataSources.add(dataSource);
//       await viewerRef.current.zoomTo(dataSource);
      
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

//   useEffect(() => {
//     if (!viewerRef.current || isLoading) return;
  
//     const { canvas, scene, entities } = viewerRef.current;
//     if (!canvas || !scene || !entities) return;  // Prevent undefined errors
  
//     const handler = new Cesium.ScreenSpaceEventHandler(canvas);
//     handler.setInputAction(handleMapClick, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  
//     return () => {
//       handler.destroy();
//     };
//   }, [isLoading, handleMapClick]);

//   return (
//     <div className="relative w-full h-[90vh]">
//       <div 
//         ref={cesiumContainer} 
//         className="w-full h-full absolute top-0 left-0"
//       />
      
//       {isLoading && (
//         <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-70 z-[999]">
//           <div className="text-white text-xl">Loading map...</div>
//         </div>
//       )}
      
//       {/* Controls */}
//       <div className="absolute top-2 left-2 z-[1000] bg-white bg-opacity-80 p-2 rounded">
//         <button 
//           onClick={() => setStatus('Click on the map to add an anchor point')}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
//         >
//           Add Anchor
//         </button>
//         <p className="mt-1">{status}</p>
//       </div>
      
//       {/* Toggle buttons */}
//       <div className="absolute top-14 right-2 z-[1000] flex flex-col gap-2">
//         <button 
//           onClick={toggleTileset}
//           className="bg-black bg-opacity-70 text-white p-2 rounded cursor-pointer"
//         >
//           Toggle 3D Tileset
//         </button>
//         <button 
//           onClick={toggleGeoJson}
//           className="bg-black bg-opacity-70 text-white p-2 rounded cursor-pointer"
//         >
//           Toggle GeoJSON
//         </button>
//         <button 
//           onClick={toggleRoads}
//           className={`${showRoads ? 'bg-gray-500 bg-opacity-90' : 'bg-black bg-opacity-70'} text-white p-2 rounded cursor-pointer`}
//         >
//           {showRoads ? 'Hide Roads' : 'Show Roads'}
//         </button>
//         <button 
//           onClick={toggleVehicles}
//           className={`${showVehicles ? 'bg-blue-500 bg-opacity-90' : 'bg-black bg-opacity-70'} text-white p-2 rounded cursor-pointer`}
//         >
//           {showVehicles ? 'Hide Vehicles' : 'Show Vehicles'}
//         </button>
//         <button 
//           onClick={toggleHeatmap}
//           className={`${showHeatmap ? 'bg-orange-500 bg-opacity-90' : 'bg-black bg-opacity-70'} text-white p-2 rounded cursor-pointer`}
//         >
//           {showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}
//         </button>
//       </div>
      
//       {/* Heatmap Legend */}
//       {showHeatmap && (
//         <div className="absolute bottom-5 left-2 z-[1000] bg-white bg-opacity-80 p-2 rounded">
//           <div className="font-bold mb-1">Heatmap Legend</div>
//           <div className="flex items-center mb-1">
//             <div 
//               className="w-5 h-5 mr-1"
//               style={{ backgroundColor: Cesium.Color.fromHsl(0.3, 1, 0.5).toCssColorString() }}
//             ></div>
//             <span>Low Density</span>
//           </div>
//           <div className="flex items-center mb-1">
//             <div 
//               className="w-5 h-5 mr-1"
//               style={{ backgroundColor: Cesium.Color.fromHsl(0.15, 1, 0.5).toCssColorString() }}
//             ></div>
//             <span>Medium Density</span>
//           </div>
//           <div className="flex items-center">
//             <div 
//               className="w-5 h-5 mr-1"
//               style={{ backgroundColor: Cesium.Color.fromHsl(0.0, 1, 0.5).toCssColorString() }}
//             ></div>
//             <span>High Density</span>
//           </div>
//         </div>
//       )}
//       {/* Video Modal */}
//       {showVideoModal && (
//         <div className="fixed z-[1001] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-5 border border-gray-300 rounded shadow-lg w-[80%] max-w-[600px]">
//           <span 
//             className="float-right text-xl cursor-pointer"
//             onClick={() => setShowVideoModal(false)}
//           >
//             &times;
//           </span>
//           <h3 className="text-xl font-bold mb-3">{videoTitle}</h3>
//           <video 
//             className="w-full" 
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



import React, { useEffect, useRef, useState } from 'react';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

// Set base URL for Cesium assets
window.CESIUM_BASE_URL = '/node_modules/cesium/Build/Cesium/';

const Maps = () => {
  const cesiumContainer = useRef(null);
  const viewerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeShapePoints, setActiveShapePoints] = useState([]);
  const [activeShape, setActiveShape] = useState(null);
  const [tileset, setTileset] = useState(null);
  const [clippingPolygons, setClippingPolygons] = useState([]);
  const drawingHandlerRef = useRef(null);

  // Initialize the viewer and load the tileset
  useEffect(() => {
    let isMounted = true;
    
    const initViewer = async () => {
      try {
        Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YjhlMmVkNC1hYWVjLTQxYWEtOGZhYS1iOGQyNDUxY2ZlMTUiLCJpZCI6MjY0Nzg3LCJpYXQiOjE3MzUxMTAzMzV9.tdJk1ppDaw9AEy9bFB6RBU9T3H0-xOlIqVlrjDBJGQo";
        
        await Cesium.Ion.defaultAccessToken;
        await Cesium.ApproximateTerrainHeights.initialize();

        const terrainProvider = await Cesium.createWorldTerrainAsync({
          requestWaterMask: true,
          requestVertexNormals: true
        });

        if (!isMounted) return;

        // Configure minimal viewer
        viewerRef.current = new Cesium.Viewer(cesiumContainer.current, {
          terrainProvider,
          timeline: false,
          animation: false,
          baseLayerPicker: false,
          sceneMode: Cesium.SceneMode.SCENE3D,
          shouldAnimate: true,
          imageryProvider: new Cesium.IonImageryProvider({ assetId: 3845 }),
          creditContainer: document.createElement('div'),
          scene3DOnly: true,
          orderIndependentTranslucency: false,
          shadows: false
        });

        // Disable unnecessary features
        viewerRef.current.scene.globe.showGroundAtmosphere = false;
        viewerRef.current.scene.fog.enabled = false;
        viewerRef.current.scene.skyAtmosphere.show = false;

        // Load the tileset
        const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(3048665, {
          show: true
        });
        
        // Performance optimizations
        tileset.maximumScreenSpaceError = 2;
        tileset.dynamicScreenSpaceError = true;
        tileset.dynamicScreenSpaceErrorDensity = 0.00278;
        tileset.dynamicScreenSpaceErrorFactor = 4.0;
        tileset.dynamicScreenSpaceErrorHeightFalloff = 0.25;
        
        viewerRef.current.scene.primitives.add(tileset);
        setTileset(tileset);
        
        await viewerRef.current.zoomTo(tileset);

        if (isMounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error initializing Cesium:', error);
        if (isMounted) {
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
      if (drawingHandlerRef.current) {
        drawingHandlerRef.current.destroy();
      }
    };
  }, []);

  // Handle drawing interactions
  useEffect(() => {
    if (!viewerRef.current || !isDrawing) {
      if (drawingHandlerRef.current) {
        drawingHandlerRef.current.destroy();
        drawingHandlerRef.current = null;
      }
      return;
    }

    const handler = new Cesium.ScreenSpaceEventHandler(viewerRef.current.scene.canvas);
    drawingHandlerRef.current = handler;
    
    // Mouse movement - update the preview shape
    handler.setInputAction((movement) => {
      const ray = viewerRef.current.camera.getPickRay(movement.endPosition);
      const position = viewerRef.current.scene.globe.pick(ray, viewerRef.current.scene);
      
      if (position) {
        const cartographic = Cesium.Cartographic.fromCartesian(position);
        const longitude = Cesium.Math.toDegrees(cartographic.longitude);
        const latitude = Cesium.Math.toDegrees(cartographic.latitude);
        
        const newPoints = [...activeShapePoints, { longitude, latitude }];
        
        // Update preview shape
        if (activeShape) {
          viewerRef.current.entities.remove(activeShape);
        }
        
        if (newPoints.length > 1) {
          const shape = viewerRef.current.entities.add({
            polygon: {
              hierarchy: new Cesium.PolygonHierarchy(
                newPoints.map(pos => Cesium.Cartesian3.fromDegrees(pos.longitude, pos.latitude))
              ),
              material: Cesium.Color.YELLOW.withAlpha(0.3),
              outline: true,
              outlineColor: Cesium.Color.YELLOW,
              outlineWidth: 2,
            }
          });
          setActiveShape(shape);
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // Left click - add a point to the shape
    handler.setInputAction((click) => {
      const ray = viewerRef.current.camera.getPickRay(click.position);
      const position = viewerRef.current.scene.globe.pick(ray, viewerRef.current.scene);
      
      if (position) {
        const cartographic = Cesium.Cartographic.fromCartesian(position);
        const longitude = Cesium.Math.toDegrees(cartographic.longitude);
        const latitude = Cesium.Math.toDegrees(cartographic.latitude);
        
        setActiveShapePoints(prev => [...prev, { longitude, latitude }]);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // Right click - complete the shape
    handler.setInputAction(() => {
      completeDrawing();
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

    return () => {
      if (handler) {
        handler.destroy();
      }
    };
  }, [isDrawing, activeShapePoints, activeShape]);

  const startDrawing = () => {
    setIsDrawing(true);
    setActiveShapePoints([]);
    
    if (activeShape) {
      viewerRef.current.entities.remove(activeShape);
      setActiveShape(null);
    }
  };

  const cancelDrawing = () => {
    setIsDrawing(false);
    setActiveShapePoints([]);
    if (activeShape) {
      viewerRef.current.entities.remove(activeShape);
      setActiveShape(null);
    }
  };

  const completeDrawing = () => {
    setIsDrawing(false);
    if (activeShapePoints.length < 3) {
      cancelDrawing();
      return;
    }
    
    // Create a clipping polygon from the drawn shape
    const polygon = new Cesium.PolygonHierarchy(
      activeShapePoints.map(pos => Cesium.Cartesian3.fromDegrees(pos.longitude, pos.latitude))
    );
    
    setClippingPolygons(prev => [...prev, polygon]);
    updateTilesetStyle([...clippingPolygons, polygon]);
    
    // Change the drawing color to indicate this is a completed deletion area
    if (activeShape) {
      viewerRef.current.entities.remove(activeShape);
      const finalizedShape = viewerRef.current.entities.add({
        polygon: {
          hierarchy: polygon,
          material: Cesium.Color.RED.withAlpha(0.3),
          outline: true,
          outlineColor: Cesium.Color.RED,
          outlineWidth: 2,
        }
      });
      setActiveShape(finalizedShape);
    }
    
    setActiveShapePoints([]);
  };

  const updateTilesetStyle = (polygons) => {
    if (!tileset) return;
    
    // Create a style that hides features inside any of the clipping polygons
    tileset.style = new Cesium.Cesium3DTileStyle({
      show: {
        evaluate: (feature) => {
          const position = feature.getProperty('position') || 
                          feature.getProperty('Position') || 
                          feature.position;
          
          if (!position) return true;
          
          const cartographic = Cesium.Cartographic.fromCartesian(position);
          const point = Cesium.Cartesian3.fromRadians(
            cartographic.longitude, 
            cartographic.latitude, 
            cartographic.height
          );
          
          // Check if position is inside any clipping polygon
          for (const polygon of polygons) {
            if (Cesium.PolygonPipeline.pointInPolygon(point, polygon.positions)) {
              return false; // Hide this feature
            }
          }
          
          return true; // Show this feature
        }
      }
    });
  };

  const deleteSelectedArea = () => {
    if (!activeShape) return;
    
    // Remove the selected shape from the clipping polygons
    const shapeHierarchy = activeShape.polygon.hierarchy.getValue();
    const newPolygons = clippingPolygons.filter(poly => 
      !Cesium.PolygonPipeline.positionsEqual(poly.positions, shapeHierarchy.positions)
    );
    
    setClippingPolygons(newPolygons);
    updateTilesetStyle(newPolygons);
    
    // Remove the entity
    viewerRef.current.entities.remove(activeShape);
    setActiveShape(null);
  };

  const clearAllDeletions = () => {
    setClippingPolygons([]);
    if (tileset) {
      tileset.style = null; // Reset to original style
    }
    
    // Remove all drawn shapes
    const entities = viewerRef.current.entities.values;
    for (let i = entities.length - 1; i >= 0; i--) {
      if (entities[i].polygon) {
        viewerRef.current.entities.remove(entities[i]);
      }
    }
    
    setActiveShape(null);
  };

  return (
    <div className="relative w-full h-[90vh]">
      <div 
        ref={cesiumContainer} 
        className="w-full h-full absolute top-0 left-0"
      />
      
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-70 z-[999]">
          <div className="text-white text-xl">Loading map...</div>
        </div>
      )}
      
      {/* Editing Controls */}
      <div className="absolute top-4 left-4 z-50 bg-white p-2 rounded shadow-lg">
        <button 
          onClick={startDrawing}
          className={`${isDrawing ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-500 hover:bg-blue-600'} text-white font-bold py-2 px-4 rounded mr-2`}
          disabled={isLoading}
        >
          {isDrawing ? "Drawing..." : "Select Area"}
        </button>
        
        {isDrawing && (
          <>
            <button 
              onClick={completeDrawing}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Complete
            </button>
            <button 
              onClick={cancelDrawing}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
          </>
        )}
        
        <button 
          onClick={deleteSelectedArea}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-2 block w-full"
          disabled={!activeShape}
        >
          Delete Selected
        </button>
        
        <button 
          onClick={clearAllDeletions}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mt-2 block w-full"
          disabled={clippingPolygons.length === 0}
        >
          Reset All Deletions
        </button>
        
        {isDrawing && (
          <div className="mt-2 text-sm text-gray-600">
            Click to add points, right-click to finish
          </div>
        )}
      </div>
    </div>
  );
};

export default Maps;