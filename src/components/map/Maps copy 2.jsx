// import React, { useEffect, useRef } from 'react';
// import * as Cesium from 'cesium';
// import 'cesium/Build/Cesium/Widgets/widgets.css';

// // Set base URL for Cesium assets
// window.CESIUM_BASE_URL = '/node_modules/cesium/Build/Cesium/';

// const CesiumMap = () => {
//   const cesiumContainer = useRef(null);
//   const viewerRef = useRef(null);
//   const tilesetRef = useRef(null);

//   // Memoized terrain creation to prevent recreation on rerenders
//   const createTerrain = async () => {
//     return await Cesium.createWorldTerrainAsync({
//       requestWaterMask: true,
//       requestVertexNormals: true
//     });
//   };

//   // Initialize viewer and load 3D tileset
//   useEffect(() => {
//     let isMounted = true;

//     const initViewer = async () => {
//       try {
//         Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YjhlMmVkNC1hYWVjLTQxYWEtOGZhYS1iOGQyNDUxY2ZlMTUiLCJpZCI6MjY0Nzg3LCJpYXQiOjE3MzUxMTAzMzV9.tdJk1ppDaw9AEy9bFB6RBU9T3H0-xOlIqVlrjDBJGQo";

//         // Initialize subsystems in parallel
//         await Promise.all([
//           Cesium.ApproximateTerrainHeights.initialize()
//         ]);

//         const terrainProvider = await createTerrain();
//         if (!isMounted) return;

//         // Configure viewer with optimized settings
//         viewerRef.current = new Cesium.Viewer(cesiumContainer.current, {
//           terrainProvider,
//           timeline: false,
//           animation: false,
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

//         // Load 3D tileset
//         await load3DTileset();

//       } catch (error) {
//         console.error('Error initializing Cesium:', error);
//       }
//     };

//     initViewer();

//     return () => {
//       isMounted = false;
//       if (viewerRef.current && !viewerRef.current.isDestroyed()) {
//         viewerRef.current.destroy();
//       }
//     };
//   }, []);

//   const load3DTileset = async () => {
//     try {
//       const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(3048665, {
//         show: true
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

//   return (
//     <div style={{ width: '100%', height: '100vh' }}>
//       <div 
//         ref={cesiumContainer} 
//         style={{ width: '100%', height: '100%' }} 
//       />
//     </div>
//   );
// };

// export default CesiumMap;

// import React, { useEffect, useRef } from 'react';
// import * as Cesium from 'cesium';
// import 'cesium/Build/Cesium/Widgets/widgets.css';

// window.CESIUM_BASE_URL = '/node_modules/cesium/Build/Cesium/';

// const CesiumMap = () => {
//   const cesiumContainer = useRef(null);
//   const viewerRef = useRef(null);
//   const tilesetRef = useRef(null);

//   // Coordinates for your city bounding box
//   const cityRectangle = Cesium.Rectangle.fromDegrees(
//     80.550256,
//     16.411176,
//     80.570148,
//     16.424432
//   );

//   // Drain Locations (example data)
//   const drainLocations = [
//     {
//       name: "Drain A",
//       position: [80.555, 16.418],
//       status: "active", // or "blocked"
//       flowRate: "120 L/s"
//     },
//     {
//       name: "Drain B",
//       position: [80.56, 16.42],
//       status: "blocked"
//     }
//   ];

//   const createTerrain = async () => {
//     return await Cesium.createWorldTerrainAsync({
//       requestWaterMask: true,
//       requestVertexNormals: true
//     });
//   };

//   // Load 3D Tileset
//   const load3DTileset = async () => {
//     try {
//       const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(3048665, {
//         show: true
//       });

//       tileset.maximumScreenSpaceError = 2;
//       tileset.dynamicScreenSpaceError = true;

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

//   // Create water flow lines
//   const addWaterFlow = () => {
//     viewerRef.current.entities.add({
//       polyline: {
//         positions: Cesium.Cartesian3.fromDegreesArray([
//           80.555, 16.418, 0,
//           80.56, 16.42, 0,
//           80.565, 16.419, 0
//         ]),
//         material: new Cesium.PolylineGlowMaterialProperty({
//           color: Cesium.Color.fromCssColorString('#00aaff').withAlpha(0.8),
//           glowPower: 0.2
//         }),
//         width: 5,
//         clampToGround: true
//       }
//     });
//   };

//   // Add flood overlay using custom shader or polygon
//   const addFloodOverlay = () => {
//     viewerRef.current.entities.add({
//       polygon: {
//         hierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray([
//           80.555, 16.418,
//           80.56, 16.42,
//           80.565, 16.419,
//           80.56, 16.415
//         ])),
//         material: Cesium.Color.fromCssColorString('#00aaff').withAlpha(0.4),
//         height: 0,
//         outline: false
//       }
//     });
//   };

//   // Add Drainage Points
//   const addDrains = () => {
//     drainLocations.forEach(drain => {
//       const position = Cesium.Cartesian3.fromDegrees(
//         drain.position[0],
//         drain.position[1]
//       );

//       viewerRef.current.entities.add({
//         position,
//         point: {
//           color: drain.status === 'active'
//             ? Cesium.Color.green.withAlpha(0.8)
//             : Cesium.Color.red.withAlpha(0.8),
//           pixelSize: 10,
//           outlineColor: Cesium.Color.BLACK,
//           outlineWidth: 2
//         },
//         label: {
//           text: drain.status === 'active' ? drain.flowRate : 'Blocked',
//           font: '14px sans-serif',
//           horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
//           verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
//           pixelOffset: new Cesium.Cartesian2(15, 0),
//           disableDepthTestDistance: Number.POSITIVE_INFINITY
//         }
//       });
//     });
//   };

//   // Initialize Viewer
//   useEffect(() => {
//     let isMounted = true;

//     const initViewer = async () => {
//       try {
//         Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YjhlMmVkNC1hYWVjLTQxYWEtOGZhYS1iOGQyNDUxY2ZlMTUiLCJpZCI6MjY0Nzg3LCJpYXQiOjE3MzUxMTAzMzV9.tdJk1ppDaw9AEy9bFB6RBU9T3H0-xOlIqVlrjDBJGQo";

//         await Promise.all([Cesium.ApproximateTerrainHeights.initialize()]);
//         const terrainProvider = await createTerrain();

//         if (!isMounted) return;

//         viewerRef.current = new Cesium.Viewer(cesiumContainer.current, {
//           terrainProvider,
//           timeline: false,
//           animation: false,
//           sceneMode: Cesium.SceneMode.SCENE3D,
//           shouldAnimate: true,
//           imageryProvider: new Cesium.IonImageryProvider({ assetId: 3845 }),
//           creditContainer: document.createElement('div'),
//           scene3DOnly: true,
//           orderIndependentTranslucency: false,
//           shadows: false
//         });

//         viewerRef.current.scene.globe.showGroundAtmosphere = false;
//         viewerRef.current.scene.fog.enabled = false;
//         viewerRef.current.scene.skyAtmosphere.show = false;

//         // Limit view to city area
//         viewerRef.current.camera.flyTo({
//           destination: cityRectangle
//         });

//         await load3DTileset();
//         addWaterFlow();
//         addFloodOverlay();
//         addDrains();

//       } catch (error) {
//         console.error('Error initializing Cesium:', error);
//       }
//     };

//     initViewer();

//     return () => {
//       isMounted = false;
//       if (viewerRef.current && !viewerRef.current.isDestroyed()) {
//         viewerRef.current.destroy();
//       }
//     };
//   }, []);

//   return (
//     <div style={{ width: '100%', height: '100vh' }}>
//       <div ref={cesiumContainer} style={{ width: '100%', height: '100%' }} />
//     </div>
//   );
// };

// export default CesiumMap;

// import React, { useEffect, useRef, useState } from 'react';
// import * as Cesium from 'cesium';
// import 'cesium/Build/Cesium/Widgets/widgets.css';

// // Set base URL for Cesium assets
// window.CESIUM_BASE_URL = '/node_modules/cesium/Build/Cesium/';

// const CesiumMap = () => {
//   const cesiumContainer = useRef(null);
//   const viewerRef = useRef(null);
//   const tilesetRef = useRef(null);
//   const waterPrimitiveRef = useRef(null);
//   const [floodLevel, setFloodLevel] = useState(0);
//   const [drainageHoles, setDrainageHoles] = useState([]);

//   // City boundary coordinates
//   const cityBoundary = [
//     Cesium.Cartesian3.fromDegrees(80.550256, 16.415025),
//     Cesium.Cartesian3.fromDegrees(80.562938, 16.411176),
//     Cesium.Cartesian3.fromDegrees(80.570148, 16.421960),
//     Cesium.Cartesian3.fromDegrees(80.557848, 16.424432)
//   ];

//   // Sample drainage holes data (replace with your actual data)
//   const sampleDrainageHoles = [
//     {
//       id: 1,
//       position: Cesium.Cartesian3.fromDegrees(80.555, 16.418),
//       status: 'active',
//       capacity: 5000, // liters per second
//       currentFlow: 3200
//     },
//     {
//       id: 2,
//       position: Cesium.Cartesian3.fromDegrees(80.560, 16.420),
//       status: 'blocked',
//       capacity: 4000,
//       currentFlow: 0
//     },
//     // Add more drainage holes as needed
//   ];

//   useEffect(() => {
//     setDrainageHoles(sampleDrainageHoles);
//   }, []);

//   const createTerrain = async () => {
//     return await Cesium.createWorldTerrainAsync({
//       requestWaterMask: true,
//       requestVertexNormals: true
//     });
//   };

//   // Initialize viewer and load 3D tileset
//   useEffect(() => {
//     let isMounted = true;

//     const initViewer = async () => {
//       try {
//         Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YjhlMmVkNC1hYWVjLTQxYWEtOGZhYS1iOGQyNDUxY2ZlMTUiLCJpZCI6MjY0Nzg3LCJpYXQiOjE3MzUxMTAzMzV9.tdJk1ppDaw9AEy9bFB6RBU9T3H0-xOlIqVlrjDBJGQo";

//         await Promise.all([
//           Cesium.ApproximateTerrainHeights.initialize()
//         ]);

//         const terrainProvider = await createTerrain();
//         if (!isMounted) return;

//         viewerRef.current = new Cesium.Viewer(cesiumContainer.current, {
//           terrainProvider,
//           timeline: false,
//           animation: false,
//           sceneMode: Cesium.SceneMode.SCENE3D,
//           shouldAnimate: true,
//           imageryProvider: new Cesium.IonImageryProvider({ assetId: 3845 }),
//           creditContainer: document.createElement('div'),
//           scene3DOnly: true,
//           orderIndependentTranslucency: false,
//           shadows: false
//         });

//         // Configure scene
//         const scene = viewerRef.current.scene;
//         scene.globe.showGroundAtmosphere = false;
//         scene.fog.enabled = false;
//         scene.skyAtmosphere.show = false;
//         scene.globe.depthTestAgainstTerrain = true;

//         // Add city boundary polygon
//         viewerRef.current.entities.add({
//           polygon: {
//             hierarchy: cityBoundary,
//             material: Cesium.Color.BLUE.withAlpha(0.2),
//             outline: true,
//             outlineColor: Cesium.Color.BLUE,
//             height: 0,
//             extrudedHeight: 100,
//             outlineWidth: 2
//           }
//         });

//         // Load 3D tileset
//         await load3DTileset();

//         // Initialize water simulation
//         initWaterSimulation();

//         // Add drainage holes visualization
//         visualizeDrainageHoles();

//       } catch (error) {
//         console.error('Error initializing Cesium:', error);
//       }
//     };

//     initViewer();

//     return () => {
//       isMounted = false;
//       if (viewerRef.current && !viewerRef.current.isDestroyed()) {
//         viewerRef.current.destroy();
//       }
//     };
//   }, []);

//   const load3DTileset = async () => {
//     try {
//       const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(3048665, {
//         show: true
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

//   const initWaterSimulation = () => {
//     // Create a water primitive that we'll update based on flood level
//     waterPrimitiveRef.current = viewerRef.current.scene.primitives.add(
//       new Cesium.Primitive({
//         geometryInstances: new Cesium.GeometryInstance({
//           geometry: new Cesium.PolygonGeometry({
//             polygonHierarchy: new Cesium.PolygonHierarchy(cityBoundary),
//             height: 0,
//             extrudedHeight: floodLevel,
//             vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
//           }),
//           attributes: {
//             color: Cesium.ColorGeometryInstanceAttribute.fromColor(
//               Cesium.Color.BLUE.withAlpha(0.5)
//             )
//           }
//         }),
//         appearance: new Cesium.PerInstanceColorAppearance({
//           translucent: true,
//           flat: true
//         }),
//         asynchronous: false
//       })
//     );

//     // Add water flow animation
//     animateWaterFlow();
//   };

//   const animateWaterFlow = () => {
//     // This is a simplified water flow animation
//     // For a real implementation, you'd want to:
//     // 1. Sample terrain heights across the city
//     // 2. Calculate water flow paths based on gradient
//     // 3. Animate water moving along these paths
    
//     const scene = viewerRef.current.scene;
//     const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    
//     // Update water level based on flood level
//     const updateWaterLevel = () => {
//       if (waterPrimitiveRef.current) {
//         scene.primitives.remove(waterPrimitiveRef.current);
//         waterPrimitiveRef.current = scene.primitives.add(
//           new Cesium.Primitive({
//             geometryInstances: new Cesium.GeometryInstance({
//               geometry: new Cesium.PolygonGeometry({
//                 polygonHierarchy: new Cesium.PolygonHierarchy(cityBoundary),
//                 height: 0,
//                 extrudedHeight: floodLevel,
//                 vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
//               }),
//               attributes: {
//                 color: Cesium.ColorGeometryInstanceAttribute.fromColor(
//                   Cesium.Color.BLUE.withAlpha(0.5)
//                 )
//               }
//             }),
//             appearance: new Cesium.PerInstanceColorAppearance({
//               translucent: true,
//               flat: true
//             }),
//             asynchronous: false
//           })
//         );
//       }
//     };

//     // Animate water flow paths
//     const animateFlowPaths = () => {
//       // This would be replaced with actual flow path calculations
//       // For now, we'll just add some sample flow lines
//       viewerRef.current.entities.add({
//         polyline: {
//           positions: [
//             Cesium.Cartesian3.fromDegrees(80.552, 16.416),
//             Cesium.Cartesian3.fromDegrees(80.555, 16.418),
//             Cesium.Cartesian3.fromDegrees(80.558, 16.420)
//           ],
//           width: 5,
//           material: new Cesium.PolylineGlowMaterialProperty({
//             glowPower: 0.2,
//             color: Cesium.Color.CYAN
//           }),
//           clampToGround: true
//         }
//       });
//     };

//     updateWaterLevel();
//     animateFlowPaths();
//   };

//   const visualizeDrainageHoles = () => {
//     drainageHoles.forEach(hole => {
//       const color = hole.status === 'active' ? Cesium.Color.GREEN : Cesium.Color.RED;
//       const labelText = hole.status === 'active' 
//         ? `Drain ${hole.id}: ${hole.currentFlow} L/s (${Math.round((hole.currentFlow / hole.capacity) * 100)}%)`
//         : `Drain ${hole.id}: Blocked`;

//       viewerRef.current.entities.add({
//         position: hole.position,
//         point: {
//           pixelSize: 15,
//           color: color,
//           outlineColor: Cesium.Color.WHITE,
//           outlineWidth: 2
//         },
//         label: {
//           text: labelText,
//           font: '12px sans-serif',
//           style: Cesium.LabelStyle.FILL_AND_OUTLINE,
//           outlineWidth: 2,
//           verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
//           pixelOffset: new Cesium.Cartesian2(0, -10)
//         }
//       });
//     });
//   };

//   const updateFloodLevel = (level) => {
//     setFloodLevel(level);
//     animateWaterFlow();
//   };

//   return (
//     <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
//       <div 
//         ref={cesiumContainer} 
//         style={{ width: '100%', height: '100%' }} 
//       />
      
//       {/* Flood control panel */}
//       <div style={{
//         position: 'absolute',
//         top: '10px',
//         left: '10px',
//         backgroundColor: 'rgba(255,255,255,0.8)',
//         padding: '10px',
//         borderRadius: '5px',
//         zIndex: 999
//       }}>
//         <h3>Flood Simulation</h3>
//         <div>
//           <label>Flood Level (meters): </label>
//           <input 
//             type="range" 
//             min="0" 
//             max="50" 
//             value={floodLevel} 
//             onChange={(e) => updateFloodLevel(parseInt(e.target.value))}
//           />
//           <span> {floodLevel}m</span>
//         </div>
        
//         <h4>Drainage Status</h4>
//         <ul style={{ listStyle: 'none', padding: 0 }}>
//           {drainageHoles.map(hole => (
//             <li key={hole.id} style={{ color: hole.status === 'active' ? 'green' : 'red' }}>
//               Drain #{hole.id}: {hole.status.toUpperCase()} - {hole.currentFlow} L/s
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default CesiumMap;

// import React, { useEffect, useRef, useState } from 'react';
// import * as Cesium from 'cesium';
// import 'cesium/Build/Cesium/Widgets/widgets.css';

// // Set base URL for Cesium assets
// window.CESIUM_BASE_URL = '/node_modules/cesium/Build/Cesium/';

// const CesiumMap = () => {
//   const cesiumContainer = useRef(null);
//   const viewerRef = useRef(null);
//   const tilesetRef = useRef(null);
//   const waterPrimitiveRef = useRef(null);
//   const [floodLevel, setFloodLevel] = useState(0);
//   const [drainageHoles, setDrainageHoles] = useState([]);

//   // City boundary coordinates
//   const cityBoundary = [
//     Cesium.Cartesian3.fromDegrees(80.550256, 16.415025),
//     Cesium.Cartesian3.fromDegrees(80.562938, 16.411176),
//     Cesium.Cartesian3.fromDegrees(80.570148, 16.421960),
//     Cesium.Cartesian3.fromDegrees(80.557848, 16.424432)
//   ];

//   // Sample drainage holes data (replace with your actual data)
//   const sampleDrainageHoles = [
//     {
//       id: 1,
//       position: Cesium.Cartesian3.fromDegrees(80.555, 16.418),
//       status: 'active',
//       capacity: 5000, // liters per second
//       currentFlow: 3200
//     },
//     {
//       id: 2,
//       position: Cesium.Cartesian3.fromDegrees(80.560, 16.420),
//       status: 'blocked',
//       capacity: 4000,
//       currentFlow: 0
//     }
//   ];

//   useEffect(() => {
//     setDrainageHoles(sampleDrainageHoles);
//   }, []);

//   const createTerrain = async () => {
//     return await Cesium.createWorldTerrainAsync({
//       requestWaterMask: true,
//       requestVertexNormals: true
//     });
//   };

//   // Initialize viewer and load 3D tileset
//   useEffect(() => {
//     let isMounted = true;
//     const initViewer = async () => {
//       try {
//         Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YjhlMmVkNC1hYWVjLTQxYWEtOGZhYS1iOGQyNDUxY2ZlMTUiLCJpZCI6MjY0Nzg3LCJpYXQiOjE3MzUxMTAzMzV9.tdJk1ppDaw9AEy9bFB6RBU9T3H0-xOlIqVlrjDBJGQo";
//         await Promise.all([Cesium.ApproximateTerrainHeights.initialize()]);
//         const terrainProvider = await createTerrain();
//         if (!isMounted) return;

//         viewerRef.current = new Cesium.Viewer(cesiumContainer.current, {
//           terrainProvider,
//           timeline: false,
//           animation: false,
//           sceneMode: Cesium.SceneMode.SCENE3D,
//           shouldAnimate: true,
//           imageryProvider: new Cesium.IonImageryProvider({ assetId: 3845 }),
//           creditContainer: document.createElement('div'),
//           scene3DOnly: true,
//           orderIndependentTranslucency: false,
//           shadows: false
//         });

//         // Configure scene
//         const scene = viewerRef.current.scene;
//         scene.globe.showGroundAtmosphere = false;
//         scene.fog.enabled = false;
//         scene.skyAtmosphere.show = false;
//         scene.globe.depthTestAgainstTerrain = true;

//         // Load 3D tileset
//         await load3DTileset();

//         // Initialize water simulation
//         initWaterSimulation();

//         // Add drainage holes visualization
//         visualizeDrainageHoles();
//       } catch (error) {
//         console.error('Error initializing Cesium:', error);
//       }
//     };

//     initViewer();
//     return () => {
//       isMounted = false;
//       if (viewerRef.current && !viewerRef.current.isDestroyed()) {
//         viewerRef.current.destroy();
//       }
//     };
//   }, []);

//   const load3DTileset = async () => {
//     try {
//       const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(3048665, { show: true });
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

//   const initWaterSimulation = () => {
//     // Create a water primitive that we'll update based on flood level
//     waterPrimitiveRef.current = viewerRef.current.scene.primitives.add(
//       new Cesium.Primitive({
//         geometryInstances: new Cesium.GeometryInstance({
//           geometry: new Cesium.PolygonGeometry({
//             polygonHierarchy: new Cesium.PolygonHierarchy(cityBoundary),
//             height: 0,
//             extrudedHeight: floodLevel,
//             vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
//           }),
//           attributes: {
//             color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.BLUE.withAlpha(0.5))
//           }
//         }),
//         appearance: new Cesium.PerInstanceColorAppearance({
//           translucent: true,
//           flat: true
//         }),
//         asynchronous: false
//       })
//     );

//     // Add water flow animation
//     animateWaterFlow();
//   };

//   const animateWaterFlow = () => {
//     // Update water level based on flood level
//     const updateWaterLevel = () => {
//       if (waterPrimitiveRef.current) {
//         viewerRef.current.scene.primitives.remove(waterPrimitiveRef.current);
//         waterPrimitiveRef.current = viewerRef.current.scene.primitives.add(
//           new Cesium.Primitive({
//             geometryInstances: new Cesium.GeometryInstance({
//               geometry: new Cesium.PolygonGeometry({
//                 polygonHierarchy: new Cesium.PolygonHierarchy(cityBoundary),
//                 height: 0,
//                 extrudedHeight: floodLevel,
//                 vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
//               }),
//               attributes: {
//                 color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.BLUE.withAlpha(0.5))
//               }
//             }),
//             appearance: new Cesium.PerInstanceColorAppearance({
//               translucent: true,
//               flat: true
//             }),
//             asynchronous: false
//           })
//         );
//       }
//     };

//     // Animate water flow paths
//     const animateFlowPaths = () => {
//       // This would be replaced with actual flow path calculations
//       viewerRef.current.entities.add({
//         polyline: {
//           positions: [
//             Cesium.Cartesian3.fromDegrees(80.552, 16.416),
//             Cesium.Cartesian3.fromDegrees(80.555, 16.418),
//             Cesium.Cartesian3.fromDegrees(80.558, 16.420)
//           ],
//           width: 5,
//           material: new Cesium.PolylineGlowMaterialProperty({
//             glowPower: 0.2,
//             color: Cesium.Color.CYAN
//           }),
//           clampToGround: true
//         }
//       });
//     };

//     updateWaterLevel();
//     animateFlowPaths();
//   };

//   const visualizeDrainageHoles = () => {
//     drainageHoles.forEach((hole) => {
//       const color = hole.status === 'active' ? Cesium.Color.GREEN : Cesium.Color.RED;
//       const labelText = hole.status === 'active'
//         ? `Drain ${hole.id}: ${hole.currentFlow} L/s`
//         : `Drain ${hole.id}: Blocked`;

//       viewerRef.current.entities.add({
//         position: hole.position,
//         point: {
//           pixelSize: 15,
//           color: color,
//           outlineColor: Cesium.Color.WHITE,
//           outlineWidth: 2
//         },
//         label: {
//           text: labelText,
//           font: '12px sans-serif',
//           style: Cesium.LabelStyle.FILL_AND_OUTLINE,
//           outlineWidth: 2,
//           verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
//           pixelOffset: new Cesium.Cartesian2(0, -10)
//         }
//       });
//     });
//   };

//   const updateFloodLevel = () => {
//     const newFloodLevel = floodLevel + 0.005; // Increment by 5 meters
//     setFloodLevel(newFloodLevel);

//     // Update drainage water flow based on flood level
//     const updatedDrainageHoles = drainageHoles.map((hole) => {
//       if (hole.status === 'active') {
//         const newFlow = Math.min(hole.capacity, hole.currentFlow + (newFloodLevel - floodLevel) * 100); // Adjust flow rate
//         return { ...hole, currentFlow: newFlow };
//       }
//       return hole;
//     });

//     setDrainageHoles(updatedDrainageHoles);
//     animateWaterFlow();
//   };

//   return (
//     <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
//       <div ref={cesiumContainer} style={{ width: '100%', height: '100%' }} />
      
//       {/* Flood control panel */}
//       <div
//         style={{
//           position: 'absolute',
//           top: '10px',
//           left: '10px',
//           backgroundColor: 'rgba(255,255,255,0.8)',
//           padding: '10px',
//           borderRadius: '5px',
//           zIndex: 999
//         }}
//       >
//         <h3>Flood Simulation</h3>
//         <button onClick={updateFloodLevel}>Raise Water Level (5m)</button>
//         <span> Current Flood Level: {floodLevel}m</span>
//       </div>
//     </div>
//   );
// };

// export default CesiumMap;

import React, { useEffect, useRef, useState } from 'react';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

// Set base URL for Cesium assets
window.CESIUM_BASE_URL = '/node_modules/cesium/Build/Cesium/';

const CesiumMap = () => {
  const cesiumContainer = useRef(null);
  const viewerRef = useRef(null);
  const tilesetRef = useRef(null);
  const [floodLevel, setFloodLevel] = useState(0);
  const [drainageHoles, setDrainageHoles] = useState([]);
  const [isRaisingWater, setIsRaisingWater] = useState(false); // Track if water is being raised

  // City boundary coordinates
  const cityBoundary = [
    Cesium.Cartesian3.fromDegrees(80.550256, 16.415025),
    Cesium.Cartesian3.fromDegrees(80.562938, 16.411176),
    Cesium.Cartesian3.fromDegrees(80.570148, 16.421960),
    Cesium.Cartesian3.fromDegrees(80.557848, 16.424432)
  ];

  // Sample drainage holes data (replace with your actual data)
  const sampleDrainageHoles = [
    {
      id: 1,
      position: Cesium.Cartesian3.fromDegrees(80.555, 16.418),
      status: 'active',
      capacity: 5000, // liters per second
      currentFlow: 3200
    },
    {
      id: 2,
      position: Cesium.Cartesian3.fromDegrees(80.560, 16.420),
      status: 'blocked',
      capacity: 4000,
      currentFlow: 0
    }
  ];

  useEffect(() => {
    setDrainageHoles(sampleDrainageHoles);
  }, []);

  const createTerrain = async () => {
    return await Cesium.createWorldTerrainAsync({
      requestWaterMask: true,
      requestVertexNormals: true
    });
  };

  // Initialize viewer and load 3D tileset
  useEffect(() => {
    let isMounted = true;
    const initViewer = async () => {
      try {
        Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YjhlMmVkNC1hYWVjLTQxYWEtOGZhYS1iOGQyNDUxY2ZlMTUiLCJpZCI6MjY0Nzg3LCJpYXQiOjE3MzUxMTAzMzV9.tdJk1ppDaw9AEy9bFB6RBU9T3H0-xOlIqVlrjDBJGQo";
        await Promise.all([Cesium.ApproximateTerrainHeights.initialize()]);
        const terrainProvider = await createTerrain();
        if (!isMounted) return;

        viewerRef.current = new Cesium.Viewer(cesiumContainer.current, {
          terrainProvider,
          timeline: false,
          animation: false,
          sceneMode: Cesium.SceneMode.SCENE3D,
          shouldAnimate: true,
          imageryProvider: new Cesium.IonImageryProvider({ assetId: 3845 }),
          creditContainer: document.createElement('div'),
          scene3DOnly: true,
          orderIndependentTranslucency: false,
          shadows: false
        });

        // Configure scene
        const scene = viewerRef.current.scene;
        scene.globe.showGroundAtmosphere = false;
        scene.fog.enabled = false;
        scene.skyAtmosphere.show = false;
        scene.globe.depthTestAgainstTerrain = true;

        // Load 3D tileset
        await load3DTileset();

        // Initialize water simulation
        initWaterSimulation();

        // Add drainage holes visualization
        visualizeDrainageHoles();
      } catch (error) {
        console.error('Error initializing Cesium:', error);
      }
    };

    initViewer();
    return () => {
      isMounted = false;
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
      }
    };
  }, []);

  const load3DTileset = async () => {
    try {
      const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(3048665, { show: true });
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

  const initWaterSimulation = () => {
    // Create a water primitive that we'll update based on flood level
    const waterPrimitive = new Cesium.Primitive({
      geometryInstances: new Cesium.GeometryInstance({
        geometry: new Cesium.PolygonGeometry({
          polygonHierarchy: new Cesium.PolygonHierarchy(cityBoundary),
          height: 0,
          extrudedHeight: floodLevel,
          vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
        }),
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.BLUE.withAlpha(0.5))
        }
      }),
      appearance: new Cesium.PerInstanceColorAppearance({
        translucent: true,
        flat: true
      }),
      asynchronous: false
    });

    viewerRef.current.scene.primitives.add(waterPrimitive);

    // Store reference to the water primitive for updates
    viewerRef.current.waterPrimitive = waterPrimitive;
  };

  const raiseWaterSmoothly = () => {
    if (isRaisingWater) return; // Prevent multiple animations
    setIsRaisingWater(true);

    const targetFloodLevel = 2.0; // Target flood level
    const increment = 0.0002; // Increment per frame
    let currentFloodLevel = floodLevel;

    const animate = () => {
      if (currentFloodLevel >= targetFloodLevel) {
        setIsRaisingWater(false);
        return;
      }

      currentFloodLevel += increment;
      setFloodLevel(currentFloodLevel);

      // Update the water primitive's geometry
      if (viewerRef.current.waterPrimitive) {
        viewerRef.current.scene.primitives.remove(viewerRef.current.waterPrimitive);

        const updatedWaterPrimitive = new Cesium.Primitive({
          geometryInstances: new Cesium.GeometryInstance({
            geometry: new Cesium.PolygonGeometry({
              polygonHierarchy: new Cesium.PolygonHierarchy(cityBoundary),
              height: 0,
              extrudedHeight: currentFloodLevel,
              vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
            }),
            attributes: {
              color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.BLUE.withAlpha(0.5))
            }
          }),
          appearance: new Cesium.PerInstanceColorAppearance({
            translucent: true,
            flat: true
          }),
          asynchronous: false
        });

        viewerRef.current.scene.primitives.add(updatedWaterPrimitive);
        viewerRef.current.waterPrimitive = updatedWaterPrimitive;
      }

      // Continue animation until target is reached
      requestAnimationFrame(animate);
    };

    animate();
  };

  const visualizeDrainageHoles = () => {
    drainageHoles.forEach((hole) => {
      const color = hole.status === 'active' ? Cesium.Color.GREEN : Cesium.Color.RED;
      const labelText = hole.status === 'active'
        ? `Drain ${hole.id}: ${hole.currentFlow} L/s`
        : `Drain ${hole.id}: Blocked`;

      viewerRef.current.entities.add({
        position: hole.position,
        point: {
          pixelSize: 15,
          color: color,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2
        },
        label: {
          text: labelText,
          font: '12px sans-serif',
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -10)
        }
      });
    });
  };

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <div ref={cesiumContainer} style={{ width: '100%', height: '100%' }} />
      
      {/* Flood control panel */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: 'rgba(255,255,255,0.8)',
          padding: '10px',
          borderRadius: '5px',
          zIndex: 999
        }}
      >
        <h3>Flood Simulation</h3>
        <button onClick={raiseWaterSmoothly}>Raise Water Level (0 to 2m)</button>
        <span> Current Flood Level: {floodLevel.toFixed(2)}m</span>
      </div>
    </div>
  );
};

export default CesiumMap;