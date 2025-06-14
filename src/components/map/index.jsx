import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import {
  GeoJSONLayer,
  RoadsLayer,
  HeatmapLayer,
  VehiclesLayer,
  MapControls,
  VideoModal
} from './components/Map';

// Set base URL for Cesium assets
window.CESIUM_BASE_URL = '/node_modules/cesium/Build/Cesium/';

const Maps = () => {
  const cesiumContainer = useRef(null);
  const viewerRef = useRef(null);
  const [status, setStatus] = useState('Click on the map to add an anchor point.');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [layers, setLayers] = useState({
    showHeatmap: false,
    showRoads: true,
    showVehicles: true,
    showTileset: true,
    showGeoJson: true
  });

  // Memoized terrain creation
  const createTerrain = useCallback(async () => {
    return await Cesium.createWorldTerrainAsync({
      requestWaterMask: true,
      requestVertexNormals: true
    });
  }, []);

  // Initialize viewer
  useEffect(() => {
    let isMounted = true;
    const initViewer = async () => {
      try {
        Cesium.Ion.defaultAccessToken = "your-token-here";
        
        await Promise.all([
          Cesium.Ion.defaultAccessToken,
          Cesium.ApproximateTerrainHeights.initialize()
        ]);

        const terrainProvider = await createTerrain();

        if (!isMounted) return;

        // Configure viewer
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

        viewerRef.current.scene.globe.showGroundAtmosphere = false;
        viewerRef.current.scene.fog.enabled = false;
        viewerRef.current.scene.skyAtmosphere.show = false;

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

  const handleMapClick = useCallback((movement) => {
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

    // Rest of the click handling logic...
  }, []);

  useEffect(() => {
    if (!viewerRef.current || isLoading) return;
  
    const { canvas } = viewerRef.current;
    if (!canvas) return;
  
    const handler = new Cesium.ScreenSpaceEventHandler(canvas);
    handler.setInputAction(handleMapClick, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  
    return () => {
      handler.destroy();
    };
  }, [isLoading, handleMapClick]);

  const toggleLayer = (layerName) => {
    setLayers(prev => ({
      ...prev,
      [layerName]: !prev[layerName]
    }));
    setStatus(`${layerName} is now ${!layers[layerName] ? 'visible' : 'hidden'}`);
  };

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
      
      {!isLoading && viewerRef.current && (
        <>
          <GeoJSONLayer 
            viewer={viewerRef.current} 
            visible={layers.showGeoJson} 
            onStatusChange={setStatus}
          />
          <RoadsLayer 
            viewer={viewerRef.current} 
            visible={layers.showRoads} 
            onStatusChange={setStatus}
          />
          <HeatmapLayer 
            viewer={viewerRef.current} 
            visible={layers.showHeatmap} 
            onStatusChange={setStatus}
          />
          <VehiclesLayer 
            viewer={viewerRef.current} 
            visible={layers.showVehicles && layers.showRoads} 
            onStatusChange={setStatus}
          />
        </>
      )}
      
      <MapControls 
        layers={layers}
        onToggleLayer={toggleLayer}
        status={status}
      />
      
      <VideoModal 
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        videoUrl={videoUrl}
        videoTitle={videoTitle}
      />
    </div>
  );
};

export default Maps;