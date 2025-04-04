// import React, { useEffect, useRef, useState } from 'react';
// import * as Cesium from 'cesium';
// import 'cesium/Build/Cesium/Widgets/widgets.css';

// const CesiumViewer = () => {
//   const cesiumContainer = useRef(null);
//   const viewerRef = useRef(null);
//   const [status, setStatus] = useState('Click on the map to add an anchor point.');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [videoData, setVideoData] = useState({ url: '', title: '' });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Configuration
//   const zoomThreshold = 500;
//   const ION_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YjhlMmVkNC1hYWVjLTQxYWEtOGZhYS1iOGQyNDUxY2ZlMTUiLCJpZCI6MjY0Nzg3LCJpYXQiOjE3MzUxMTAzMzV9.tdJk1ppDaw9AEy9bFB6RBU9T3H0-xOlIqVlrjDBJGQo"; // Replace with your token
//   const ION_ASSET_ID = 3048665;
//   const GEOJSON_URL = 'http://192.168.6.225:8082/data-test.geojson';

//   useEffect(() => {
//     if (!cesiumContainer.current) return;

//     try {
//       // Set base path for Cesium assets
//       window.CESIUM_BASE_URL = '/node_modules/cesium/Build/Cesium/';

//       // Initialize Cesium
//       Cesium.Ion.defaultAccessToken = ION_TOKEN;

//       const initializeViewer = async () => {
//         const viewer = new Cesium.Viewer(cesiumContainer.current, {
//           terrain: await Cesium.Terrain.fromWorldTerrain(),
//           sceneMode: Cesium.SceneMode.SCENE3D,
//           baseLayerPicker: false,
//           animation: false,
//           timeline: false,
//           fullscreenButton: false,
//           vrButton: false,
//           geocoder: false,
//           homeButton: false,
//           infoBox: false,
//           sceneModePicker: false,
//           selectionIndicator: false,
//           navigationHelpButton: false,
//           navigationInstructionsInitiallyVisible: false,
//           creditContainer: document.createElement('div') // Hide default credits
//         });

//         viewerRef.current = viewer;

//         // Load 3D tileset
//         try {
//           const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(ION_ASSET_ID);
//           viewer.scene.primitives.add(tileset);
//           await viewer.zoomTo(tileset);
//         } catch (tilesetError) {
//           console.error("Error loading 3D tileset:", tilesetError);
//         }

//         // Load GeoJSON data
//         try {
//           const geoJsonData = await fetchGeoJson(GEOJSON_URL);
//           const dataSource = await Cesium.GeoJsonDataSource.load(geoJsonData, {
//             clampToGround: false
//           });
//           viewer.dataSources.add(dataSource);
//           processGeoJsonEntities(dataSource.entities, viewer);
//           await viewer.zoomTo(dataSource);
//         } catch (geoJsonError) {
//           console.error("Error loading GeoJSON:", geoJsonError);
//         }

//         // Set up event handlers
//         setupEventHandlers(viewer);

//         setLoading(false);
//       };

//       initializeViewer();

//       return () => {
//         if (viewerRef.current && !viewerRef.current.isDestroyed()) {
//           viewerRef.current.destroy();
//         }
//       };
//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//     }
//   }, []);

//   const fetchGeoJson = async (url) => {
//     const response = await fetch(url);
//     if (!response.ok) throw new Error('Failed to fetch GeoJSON');
//     return await response.json();
//   };

//   const processGeoJsonEntities = (entities, viewer) => {
//     const buildingLabels = [];
    
//     entities.values.forEach(entity => {
//       if (entity.polygon) {
//         // Process buildings
//         const buildingName = entity.properties['@id'] || 'Unknown Building';
//         const positions = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;
//         const center = Cesium.Cartesian3.fromDegrees(
//           Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(positions[0]).longitude),
//           Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(positions[0]).latitude),
//           0
//         );

//         const labelEntity = viewer.entities.add({
//           position: center,
//           label: {
//             text: buildingName,
//             font: '14px sans-serif',
//             fillColor: Cesium.Color.WHITE,
//             scale: 1.5,
//             pixelOffset: new Cesium.Cartesian2(0, -30),
//             show: false
//           }
//         });

//         buildingLabels.push(labelEntity);
//         const height = entity.properties.height ? entity.properties.height.getValue() : 10;
//         entity.polygon.extrudedHeight = height;
//         entity.polygon.material = Cesium.Color.BLUE.withAlpha(0.6);
//         entity.polygon.outline = true;
//         entity.polygon.outlineColor = Cesium.Color.BLUE;
//       }

//       if (entity.position && entity.properties.video) {
//         // Process video anchors
//         const videoUrl = entity.properties.video;
//         entity.description = ` 
//           <h3>${entity.properties['@id']}</h3>
//           <video width="320" height="240" controls>
//             <source src="${videoUrl}" type="video/mp4">
//             Your browser does not support the video tag.
//           </video>
//         `;
//       }
//     });

//     // Set up zoom level handler
//     const checkZoomLevel = () => {
//       const cameraHeight = viewer.camera.positionCartographic.height;
//       buildingLabels.forEach(labelEntity => {
//         labelEntity.label.show = cameraHeight < zoomThreshold;
//       });
//     };

//     viewer.camera.changed.addEventListener(checkZoomLevel);
//     checkZoomLevel();
//   };

//   const setupEventHandlers = (viewer) => {
//     const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    
//     handler.setInputAction(event => {
//       const ray = viewer.camera.getPickRay(event.position);
//       const position = viewer.scene.globe.pick(ray, viewer.scene);

//       if (position) {
//         const pickedObject = viewer.scene.pick(event.position);
//         if (pickedObject?.id?.properties?.video) {
//           // Show video modal
//           const videoUrl = pickedObject.id.properties.video.getValue();
//           const videoTitle = pickedObject.id.properties['@id'].getValue();
//           setVideoData({ url: videoUrl, title: videoTitle });
//           setModalVisible(true);
//         } else {
//           // Add new anchor point
//           addAnchorPoint(position, viewer);
//         }
//       }
//     }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
//   };

//   const addAnchorPoint = async (position, viewer) => {
//     try {
//       const cartographic = Cesium.Cartographic.fromCartesian(position);
//       const updatedPositions = await Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, [cartographic]);
//       const updatedCartographic = updatedPositions[0];
//       const longitude = Cesium.Math.toDegrees(updatedCartographic.longitude);
//       const latitude = Cesium.Math.toDegrees(updatedCartographic.latitude);

//       const anchorName = prompt("Enter a name for the anchor point:");
//       if (!anchorName) return;

//       const videoUrl = prompt("Enter a video URL (optional):");

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
//         clampToGround: true
//       });
//       viewer.dataSources.add(dataSource);
//       viewer.zoomTo(dataSource);

//       await updateGeoJsonOnServer(newFeature);
//     } catch (error) {
//       console.error("Error adding anchor point:", error);
//       setStatus("Failed to add anchor point");
//     }
//   };

//   const updateGeoJsonOnServer = async (newFeature) => {
//     try {
//       const response = await fetch('http://localhost:8081/update-geojson', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(newFeature)
//       });
      
//       if (!response.ok) throw new Error('Server error');
//       setStatus("Anchor point added successfully");
//     } catch (error) {
//       console.error('Error updating GeoJSON:', error);
//       setStatus("Failed to save anchor point");
//     }
//   };

//   if (loading) return (
//     <div className="flex items-center justify-center h-full">
//       <div className="text-center p-8 bg-white bg-opacity-90 rounded-lg shadow-lg">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
//         <p className="text-lg font-semibold">Loading Cesium Viewer...</p>
//       </div>
//     </div>
//   );

//   if (error) return (
//     <div className="flex items-center justify-center h-full">
//       <div className="text-center p-8 bg-red-100 rounded-lg max-w-md">
//         <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Map</h2>
//         <p className="text-red-800 mb-4">{error}</p>
//         <button 
//           onClick={() => window.location.reload()}
//           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//         >
//           Try Again
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="relative w-full h-full">
//       {/* Cesium Container */}
//       <div ref={cesiumContainer} className="w-full h-full" />
      
//       {/* UI Controls */}
//       <div className="absolute top-2 left-2 z-10 bg-white bg-opacity-90 p-3 rounded shadow">
//         <button 
//           className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
//           onClick={() => setStatus('Ready to add anchor points')}
//         >
//           Add Anchor
//         </button>
//         <p className="mt-2 text-sm text-gray-700">{status}</p>
//       </div>

//       {/* Video Modal */}
//       {modalVisible && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
//             <div className="flex justify-between items-center border-b p-4">
//               <h3 className="text-lg font-semibold">{videoData.title}</h3>
//               <button 
//                 onClick={() => setModalVisible(false)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 &times;
//               </button>
//             </div>
//             <div className="p-4">
//               <video 
//                 src={videoData.url} 
//                 controls
//                 className="w-full"
//                 autoPlay
//               >
//                 Your browser does not support the video tag.
//               </video>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CesiumViewer;

import React, { useEffect, useRef } from 'react';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

// This is needed for Vite to properly handle Cesium assets
window.CESIUM_BASE_URL = '/node_modules/cesium/Build/Cesium/';

const CesiumViewer = () => {
  const cesiumContainer = useRef(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    // Initialize Cesium Viewer
    Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YjhlMmVkNC1hYWVjLTQxYWEtOGZhYS1iOGQyNDUxY2ZlMTUiLCJpZCI6MjY0Nzg3LCJpYXQiOjE3MzUxMTAzMzV9.tdJk1ppDaw9AEy9bFB6RBU9T3H0-xOlIqVlrjDBJGQo";

    const initializeViewer = async () => {
      try {
        // Initialize required Cesium subsystems first
        await Cesium.Ion.defaultAccessToken;
        await Cesium.ApproximateTerrainHeights.initialize();

        // Create world terrain
        const worldTerrain = await Cesium.createWorldTerrainAsync({
          requestWaterMask: true,
          requestVertexNormals: true
        });

        // Configure viewer with proper imagery
        viewerRef.current = new Cesium.Viewer(cesiumContainer.current, {
          terrainProvider: worldTerrain,
          timeline: false,
          animation: false,
          baseLayerPicker: true, // Allow user to switch base layers
          sceneMode: Cesium.SceneMode.SCENE3D,
          shouldAnimate: true,
          // Use the standard Bing Maps imagery (original Cesium look)
          imageryProvider: new Cesium.BingMapsImageryProvider({
            url: 'https://dev.virtualearth.net',
            key: 'Your_Bing_Maps_Key', // You may need to get a Bing Maps key
            mapStyle: Cesium.BingMapsStyle.AERIAL
          }),
          creditContainer: document.createElement('div')
        });

        // Alternative if you don't have a Bing Maps key:
        // Use the default Cesium World Imagery (ion imagery)
        // viewerRef.current.imageryLayers.remove(viewerRef.current.imageryLayers.get(0));
        // viewerRef.current.imageryLayers.addImageryProvider(
        //   new Cesium.IonImageryProvider({ assetId: 3845 })
        // );

        // Load the tileset with retry logic
        try {
          const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(3048665);
          viewerRef.current.scene.primitives.add(tileset);
          
          // Apply the default style if it exists
          const extras = tileset.asset.extras;
          if (extras?.ion?.defaultStyle) {
            tileset.style = new Cesium.Cesium3DTileStyle(extras.ion.defaultStyle);
          }
          
          await viewerRef.current.zoomTo(tileset);
        } catch (tilesetError) {
          console.error('Error loading tileset:', tilesetError);
          viewerRef.current.entities.add({
            position: Cesium.Cartesian3.fromDegrees(0, 0),
            label: {
              text: 'Failed to load 3D tileset',
              font: '20px sans-serif',
              fillColor: Cesium.Color.RED
            }
          });
        }
      } catch (error) {
        console.error('Error initializing Cesium:', error);
      }
    };

    initializeViewer();

    return () => {
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
      }
    };
  }, []);

  return (
    <div 
      ref={cesiumContainer} 
      style={{ 
        width: '100%', 
        height: '100vh',
        position: 'absolute',
        top: 0,
        left: 0
      }} 
    />
  );
};

export default CesiumViewer;