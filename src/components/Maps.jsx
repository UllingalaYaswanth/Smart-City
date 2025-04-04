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
  const buildingLabelsRef = useRef([]);
  const [status, setStatus] = useState('Click on the map to add an anchor point.');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
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
          baseLayerPicker: true, // Disable for better performance
          sceneMode: Cesium.SceneMode.SCENE3D,
          shouldAnimate: true,
          imageryProvider: new Cesium.IonImageryProvider({ assetId: 3845 }), // Default Cesium World Imagery
          creditContainer: document.createElement('div'),
          scene3DOnly: true, // Improve performance
          orderIndependentTranslucency: false, // Improve performance
          shadows: false // Improve performance
        });

        // Disable features we don't need for better performance
        viewerRef.current.scene.globe.showGroundAtmosphere = false;
        viewerRef.current.scene.fog.enabled = false;
        viewerRef.current.scene.skyAtmosphere.show = false;

        // Load data in parallel
        await Promise.all([
          load3DTileset(),
          loadGeoJsonData()
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
        show: false // Start with tileset hidden for better performance
      });
      
      // Optimize tileset performance
      tileset.maximumScreenSpaceError = 2; // Lower quality for better performance
      tileset.dynamicScreenSpaceError = true;
      tileset.dynamicScreenSpaceErrorDensity = 0.00278;
      tileset.dynamicScreenSpaceErrorFactor = 4.0;
      tileset.dynamicScreenSpaceErrorHeightFalloff = 0.25;
      
      viewerRef.current.scene.primitives.add(tileset);
      tilesetRef.current = tileset;

      // Apply default style if available
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
      // Fetch from backend API instead of direct file URL
      const response = await fetch('http://localhost:8081/api/geojson');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const geojsonData = await response.json();
      console.log("geojon data",geojsonData)
      const dataSource = await Cesium.GeoJsonDataSource.load(geojsonData, {
        clampToGround: false,
        stroke: Cesium.Color.BLUE,
        fill: Cesium.Color.BLUE.withAlpha(0.5),
        strokeWidth: 3
      });

      geoJsonDataSourceRef.current = dataSource;
      viewerRef.current.dataSources.add(dataSource);

      // Process entities
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
      // Show error message on the map
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

  const setupZoomListener = useCallback(() => {
    const checkZoomLevel = () => {
      if (!viewerRef.current) return;
      const cameraHeight = viewerRef.current.camera.positionCartographic.height;
      buildingLabelsRef.current.forEach(labelEntity => {
        labelEntity.label.show = cameraHeight < zoomThreshold;
      });
    };

    viewerRef.current.camera.changed.addEventListener(checkZoomLevel);
    checkZoomLevel();
  }, []);

  const toggleTileset = useCallback(() => {
    if (tilesetRef.current) {
      tilesetRef.current.show = !tilesetRef.current.show;
      setStatus(`3D Tileset is now ${tilesetRef.current.show ? 'visible' : 'hidden'}`);
    }
  }, []);

  const toggleGeoJson = useCallback(() => {
    if (geoJsonDataSourceRef.current) {
      geoJsonDataSourceRef.current.show = !geoJsonDataSourceRef.current.show;
      setStatus(`GeoJSON data is now ${geoJsonDataSourceRef.current.show ? 'visible' : 'hidden'}`);
    }
  }, []);

  const handleMapClick = useCallback(async (movement) => {
    if (!viewerRef.current) return;

    const pickedObject = viewerRef.current.scene.pick(movement.position);
    if (pickedObject && pickedObject.id && pickedObject.id.properties) {
      // Handle click on existing feature
      if (pickedObject.id.properties.video) {
        const videoUrl = pickedObject.id.properties.video.getValue();
        const videoTitle = pickedObject.id.properties['@id'].getValue();
        setVideoUrl(videoUrl);
        setVideoTitle(videoTitle);
        setShowVideoModal(true);
      }
      return;
    }

    // Handle adding new anchor point
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

      // Create new feature
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

      // First add to viewer
      const dataSource = await Cesium.GeoJsonDataSource.load(newFeature, {
        clampToGround: true,
        markerColor: Cesium.Color.RED,
        markerSymbol: '?'
      });
      
      viewerRef.current.dataSources.add(dataSource);
      await viewerRef.current.zoomTo(dataSource);
      
      // Then update backend
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

        // Reload data to ensure consistency
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

  // Setup click handler after viewer is initialized
  useEffect(() => {
    if (!viewerRef.current || isLoading) return;

    const handler = new Cesium.ScreenSpaceEventHandler(viewerRef.current.canvas);
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
        gap: '10px'
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