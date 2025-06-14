import React, { useEffect, useRef, useState, useCallback } from 'react';

const EnhancedIslandSystem = () => {
  const cesiumContainerRef = useRef(null);
  const viewerRef = useRef(null);
  const kmlDataSourceRef = useRef(null);
  const buildingsDataSourceRef = useRef(null);
  const roadsDataSourceRef = useRef(null);
  const anchorDataSourceRef = useRef(null);
  const buildingLabelsRef = useRef([]);
  const trafficIntervalsRef = useRef({});
  const heatmapEntitiesRef = useRef([]);
  const roadHeatmapEntitiesRef = useRef([]); // New ref for road heatmaps
  const cctvEntitiesRef = useRef([]); // New ref for CCTV cameras
  
  // State for dashboard and features
  const [vehicleCount, setVehicleCount] = useState(0);
  const [dotVehicleCount, setDotVehicleCount] = useState(0);
  const [greenLightCount, setGreenLightCount] = useState(0);
  const [redLightCount, setRedLightCount] = useState(0);
  const [accidentCount, setAccidentCount] = useState(0);
  const [activeAccidents, setActiveAccidents] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [roadData, setRoadData] = useState(null);
  const [anchorData, setAnchorData] = useState([]);
  const [status, setStatus] = useState('System initializing...');
  
  // Feature toggles
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showRoadHeatmap, setShowRoadHeatmap] = useState(false); // New toggle for road heatmap
  const [showRoads, setShowRoads] = useState(true);
  const [showTrafficSystem, setShowTrafficSystem] = useState(true);
  const [showBuildings, setShowBuildings] = useState(true);
  const [showKML, setShowKML] = useState(true);

  // Configuration
  const config = {
    maxVehicles: 12,
    maxDotVehicles: 18,
    vehicleSpawnRate: 2500,
    dotVehicleSpawnRate: 1800,
    maxAccidents: 6,
    maxTrafficLights: 20
  };

  const zoomThreshold = 500;
  const BACKEND_URL = 'http://192.168.6.225:8081/api/geojson';

  // Helper functions for traffic system
  const updateVehicleCount = (change) => {
    setVehicleCount(prev => Math.max(0, prev + change));
  };

  const updateDotVehicleCount = (change) => {
    setDotVehicleCount(prev => Math.max(0, prev + change));
  };

  const updateAccidentCount = (change) => {
    setAccidentCount(prev => Math.max(0, prev + change));
  };

  const updateLightStatus = (greenChange, redChange) => {
    setGreenLightCount(prev => Math.max(0, prev + greenChange));
    setRedLightCount(prev => Math.max(0, prev + redChange));
  };

  // Safe coordinate validation
  const validateCoordinate = (coord) => {
    return coord && 
           Array.isArray(coord) && 
           coord.length >= 2 && 
           isFinite(coord[0]) && 
           isFinite(coord[1]) &&
           Math.abs(coord[0]) <= 180 && 
           Math.abs(coord[1]) <= 90;
  };

  // Create road traffic heatmap (similar to tourist heatmap but for traffic density)
  const createRoadTrafficHeatmap = (roadTrafficData) => {
    try {
      if (!viewerRef.current || !roadTrafficData) {
        console.warn("Cannot create road heatmap: missing viewer or data");
        return;
      }

      // Clear existing road heatmap entities
      roadHeatmapEntitiesRef.current.forEach(entity => {
        if (viewerRef.current && viewerRef.current.entities.contains(entity)) {
          viewerRef.current.entities.remove(entity);
        }
      });
      roadHeatmapEntitiesRef.current = [];

      console.log("Creating road traffic heatmap with", roadTrafficData.length, "data points");

      roadTrafficData.forEach((location, index) => {
        const { longitude, latitude, trafficDensity, roadType } = location;
        const intensity = Math.min(trafficDensity / 100, 1);
        
        const radiusSteps = [80, 60, 40, 25, 15];
        const alphaSteps = [0.1, 0.2, 0.3, 0.5, 0.7];
        
        radiusSteps.forEach((radius, stepIndex) => {
          let baseColor;
          // Traffic density color scheme
          if (intensity < 0.3) {
            baseColor = window.Cesium.Color.BLUE; // Low traffic
          } else if (intensity < 0.6) {
            baseColor = window.Cesium.Color.YELLOW; // Medium traffic
          } else if (intensity < 0.8) {
            baseColor = window.Cesium.Color.ORANGE; // High traffic
          } else {
            baseColor = window.Cesium.Color.RED; // Heavy traffic/congestion
          }

          const color = baseColor.withAlpha(alphaSteps[stepIndex] * intensity);

          try {
            const entity = viewerRef.current.entities.add({
              name: `RoadHeatmap-${index}-${stepIndex}`,
              position: window.Cesium.Cartesian3.fromDegrees(longitude, latitude, 0),
              ellipse: {
                semiMinorAxis: radius * (0.5 + intensity * 0.5),
                semiMajorAxis: radius * (0.5 + intensity * 0.5),
                material: color,
                heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND,
                outline: false,
                show: true
              }
            });

            roadHeatmapEntitiesRef.current.push(entity);
          } catch (entityError) {
            console.warn("Failed to create road heatmap entity:", entityError);
          }
        });

        // Add traffic density labels for high traffic areas
        if (trafficDensity > 50) {
          try {
            const centerEntity = viewerRef.current.entities.add({
              name: `RoadHeatmapCenter-${index}`,
              position: window.Cesium.Cartesian3.fromDegrees(longitude, latitude, 0),
              point: {
                pixelSize: 8 + intensity * 12,
                color: window.Cesium.Color.WHITE,
                outlineColor: window.Cesium.Color.BLACK,
                outlineWidth: 2,
                heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND,
                show: true
              },
              label: {
                text: `🚗 ${Math.round(trafficDensity)}%`,
                font: '14px bold sans-serif',
                fillColor: window.Cesium.Color.WHITE,
                outlineColor: window.Cesium.Color.BLACK,
                outlineWidth: 2,
                style: window.Cesium.LabelStyle.FILL_AND_OUTLINE,
                pixelOffset: new window.Cesium.Cartesian2(0, -25),
                scale: 0.9,
                show: true,
                heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND
              }
            });

            roadHeatmapEntitiesRef.current.push(centerEntity);
          } catch (labelError) {
            console.warn("Failed to create road heatmap label:", labelError);
          }
        }
      });

      console.log("Road traffic heatmap created successfully with", roadHeatmapEntitiesRef.current.length, "entities");
      
    } catch (error) {
      console.error("Error creating road traffic heatmap:", error);
    }
  };

  // Create CCTV camera at accident location
  const createAccidentCCTV = (position, accidentId) => {
    try {
      if (!viewerRef.current || !validateCoordinate(position)) return null;

      // Generate sample video URL for the accident CCTV
      const sampleVideoUrls = [
        'http://192.168.6.225:8082/accident-cctv-1.mp4',
        'http://192.168.6.225:8082/accident-cctv-2.mp4',
        'http://192.168.6.225:8082/accident-cctv-3.mp4',
        'http://192.168.6.225:8082/emergency-response.mp4',
        'http://192.168.6.225:8082/traffic-incident.mp4'
      ];
      
      const videoUrl = sampleVideoUrls[Math.floor(Math.random() * sampleVideoUrls.length)];
      const cctvName = `Accident CCTV ${accidentId}`;

      const cctvEntity = viewerRef.current.entities.add({
        name: `AccidentCCTV-${accidentId}`,
        position: window.Cesium.Cartesian3.fromDegrees(position[0], position[1], 5), // Slightly elevated
        billboard: {
          image: "/images/cctv-camera.png", // Using same CCTV icon
          width: 28,
          height: 28,
          heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND,
          color: window.Cesium.Color.RED.withAlpha(0.9), // Red tint for accident CCTV
          scale: 1.2
        },
        label: {
          text: cctvName,
          font: '14px sans-serif',
          fillColor: window.Cesium.Color.RED,
          outlineColor: window.Cesium.Color.WHITE,
          outlineWidth: 2,
          style: window.Cesium.LabelStyle.FILL_AND_OUTLINE,
          pixelOffset: new window.Cesium.Cartesian2(0, -35),
          heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND,
          show: true
        },
        properties: {
          name: cctvName,
          video: videoUrl,
          type: "accident_cctv",
          accidentId: accidentId,
          created_at: new Date().toISOString()
        }
      });

      // Add description with video
      cctvEntity.description = `
        <h3>${cctvName}</h3>
        <p>Emergency Response Camera</p>
        <p>Location: Al Marjan Island</p>
        <video width="320" height="240" controls>
          <source src="${videoUrl}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      `;

      cctvEntitiesRef.current.push(cctvEntity);
      console.log(`Created CCTV camera for accident ${accidentId}`);
      
      return cctvEntity;
    } catch (error) {
      console.error("Error creating accident CCTV:", error);
      return null;
    }
  };

  // Load anchor points from backend
  const loadAnchorData = async () => {
    try {
      if (!window.Cesium || !viewerRef.current) return null;
      
      console.log("Loading anchor points from backend...");
      
      const response = await fetch(BACKEND_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const geoJsonData = await response.json();
      console.log("Received anchor data:", geoJsonData);
      
      const anchorFeatures = geoJsonData.features || [];
      setAnchorData(anchorFeatures);
      
      if (anchorFeatures.length > 0) {
        const anchorGeoJson = {
          type: "FeatureCollection",
          features: anchorFeatures
        };
        
        const anchorDataSource = await window.Cesium.GeoJsonDataSource.load(anchorGeoJson, {
          clampToGround: true
        });
        
        const entities = anchorDataSource.entities.values;
        for (let i = 0; i < entities.length; i++) {
          const entity = entities[i];
          
          entity.point = undefined;
          entity.billboard = undefined;
          
          entity.billboard = {
            image: "/images/cctv-camera.png",
            width: 32,
            height: 32,
            heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND
          };
          
          const anchorName = entity.properties?.name?.getValue() || 
                           entity.properties?.['@id']?.getValue() || 
                           `Anchor ${i + 1}`;
          
          entity.label = {
            text: anchorName,
            font: '16px sans-serif',
            fillColor: window.Cesium.Color.WHITE,
            outlineColor: window.Cesium.Color.BLACK,
            outlineWidth: 2,
            style: window.Cesium.LabelStyle.FILL_AND_OUTLINE,
            pixelOffset: new window.Cesium.Cartesian2(0, -40),
            heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND
          };
          
          const videoUrl = entity.properties?.video?.getValue();
          if (videoUrl) {
            entity.description = `
              <h3>${anchorName}</h3>
              <video width="320" height="240" controls>
                <source src="${videoUrl}" type="video/mp4">
                Your browser does not support the video tag.
              </video>
            `;
          }
        }
        
        anchorDataSource.show = showBuildings;
        anchorDataSourceRef.current = anchorDataSource;
        viewerRef.current.dataSources.add(anchorDataSource);
        
        console.log(`Loaded ${anchorFeatures.length} anchor points from backend`);
        return anchorDataSource;
      }
      
      return null;
    } catch (error) {
      console.error('Error loading anchor data from backend:', error);
      return null;
    }
  };

  // Save anchor point to backend
  const saveAnchorToBackend = async (anchorFeature) => {
    try {
      console.log("Saving anchor point to backend:", anchorFeature);
      
      const updatedFeatures = [...anchorData, anchorFeature];
      
      const geoJsonCollection = {
        type: "FeatureCollection",
        features: updatedFeatures
      };
      
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(geoJsonCollection)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("Backend response:", result);
      
      setAnchorData(updatedFeatures);
      
      return true;
    } catch (error) {
      console.error("Error saving to backend:", error);
      throw error;
    }
  };

  // Extract and validate road paths
  const extractRoadPaths = (geojson) => {
    const mainRoads = [];
    const sideRoads = [];
    
    try {
      geojson.features.forEach(feature => {
        if (!feature.geometry) return;
        
        const isMainRoad = feature.properties?.highway === 'primary' || 
                          feature.properties?.highway === 'secondary' ||
                          feature.properties?.highway === 'trunk' ||
                          feature.properties?.type === 'main';
        
        let coordinates = [];
        
        if (feature.geometry.type === "LineString") {
          coordinates = [feature.geometry.coordinates];
        } else if (feature.geometry.type === "MultiLineString") {
          coordinates = feature.geometry.coordinates;
        }
        
        coordinates.forEach(coordArray => {
          const validCoords = coordArray.filter(validateCoordinate).slice(0, 50);
          
          if (validCoords.length >= 2) {
            if (isMainRoad) {
              mainRoads.push(validCoords);
            } else {
              sideRoads.push(validCoords);
            }
          }
        });
      });
      
      console.log(`Extracted ${mainRoads.length} main roads and ${sideRoads.length} side roads`);
      return { mainRoads: mainRoads.slice(0, 25), sideRoads: sideRoads.slice(0, 40) };
    } catch (error) {
      console.error("Error extracting road paths:", error);
      return { mainRoads: [], sideRoads: [] };
    }
  };

  // Create enhanced position property for full path traversal
  const createFullPathProperty = (coordinates, startTime, speed) => {
    try {
      if (!coordinates || coordinates.length < 2) {
        throw new Error("Insufficient coordinates");
      }

      const validCoords = coordinates.filter(validateCoordinate);
      
      if (validCoords.length < 2) {
        throw new Error("Not enough valid coordinates");
      }

      const property = new window.Cesium.SampledPositionProperty();
      const positions = validCoords.map(coord => 
        window.Cesium.Cartesian3.fromDegrees(coord[0], coord[1], 0)
      );

      let totalDistance = 0;
      const distances = [];
      
      for (let i = 1; i < positions.length; i++) {
        const dist = window.Cesium.Cartesian3.distance(positions[i - 1], positions[i]);
        if (isFinite(dist) && dist > 0) {
          distances.push(dist);
          totalDistance += dist;
        } else {
          distances.push(0);
        }
      }

      if (totalDistance <= 0) {
        throw new Error("Invalid total distance");
      }

      const duration = totalDistance / speed;
      if (!isFinite(duration) || duration <= 0) {
        throw new Error("Invalid duration");
      }

      let accumulatedTime = 0;
      property.addSample(startTime, positions[0]);
      
      for (let i = 1; i < positions.length; i++) {
        if (distances[i - 1] > 0) {
          const segmentTime = (distances[i - 1] / totalDistance) * duration;
          accumulatedTime += segmentTime;
          const time = window.Cesium.JulianDate.addSeconds(startTime, accumulatedTime, new window.Cesium.JulianDate());
          property.addSample(time, positions[i]);
        }
      }

      return { positionProperty: property, duration };
    } catch (error) {
      console.error("Error creating full path property:", error);
      return null;
    }
  };

  // Spawn ambulance with 3D model
  const spawnAmbulance = (viewer, coordinates) => {
    try {
      if (!viewer || viewer.isDestroyed() || !showTrafficSystem) return;
      if (vehicleCount >= config.maxVehicles) return;
      if (!coordinates || coordinates.length < 2) return;

      const startTime = window.Cesium.JulianDate.now();
      const speed = 5 + Math.random() * 8;
      
      const positionData = createFullPathProperty(coordinates, startTime, speed);
      if (!positionData) return;

      updateVehicleCount(1);

      const entity = viewer.entities.add({
        name: `Ambulance-${Date.now()}`,
        position: positionData.positionProperty,
        point: {
          pixelSize: 14,
          color: window.Cesium.Color.RED,
          outlineColor: window.Cesium.Color.WHITE,
          outlineWidth: 2,
          show: true,
          heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND
        },
        label: {
          text: '🚑',
          font: '18px sans-serif',
          pixelOffset: new window.Cesium.Cartesian2(0, -25),
          show: true,
          heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND
        }
      });

      try {
        entity.model = {
          uri: 'http://192.168.6.225:8082/ambulance.glb',
          scale: 1.0,
          minimumPixelSize: 16,
          maximumScale: 100
        };
        entity.orientation = new window.Cesium.VelocityOrientationProperty(positionData.positionProperty);
        
        entity.model.readyPromise.then(() => {
          entity.point.show = false;
          entity.label.show = false;
        }).catch(() => {
          console.warn("Ambulance model failed to load, using point representation");
        });
      } catch (error) {
        console.warn("Error setting up 3D model, using point:", error);
      }

      const cleanupTime = (positionData.duration + 5) * 1000;
      setTimeout(() => {
        try {
          if (viewer && !viewer.isDestroyed() && viewer.entities.contains(entity)) {
            viewer.entities.remove(entity);
            updateVehicleCount(-1);
          }
        } catch (error) {
          console.warn("Error removing ambulance:", error);
        }
      }, cleanupTime);

    } catch (error) {
      console.error("Error spawning ambulance:", error);
    }
  };

  // Spawn dot vehicles for regular traffic
  const spawnDotVehicle = (viewer, coordinates) => {
    try {
      if (!viewer || viewer.isDestroyed() || !showTrafficSystem) return;
      if (dotVehicleCount >= config.maxDotVehicles) return;
      if (!coordinates || coordinates.length < 2) return;

      const startTime = window.Cesium.JulianDate.now();
      const speed = 3 + Math.random() * 6;
      
      const positionData = createFullPathProperty(coordinates, startTime, speed);
      if (!positionData) return;

      updateDotVehicleCount(1);

      const colors = [
        window.Cesium.Color.BLUE,
        window.Cesium.Color.GREEN,
        window.Cesium.Color.PURPLE,
        window.Cesium.Color.ORANGE,
        window.Cesium.Color.CYAN,
        window.Cesium.Color.YELLOW,
        window.Cesium.Color.PINK,
        window.Cesium.Color.MAGENTA
      ];

      const entity = viewer.entities.add({
        name: `Vehicle-${Date.now()}`,
        position: positionData.positionProperty,
        point: {
          pixelSize: 10,
          color: colors[Math.floor(Math.random() * colors.length)],
          outlineColor: window.Cesium.Color.WHITE,
          outlineWidth: 1,
          heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND,
          show: true
        },
        label: {
          text: '🚗',
          font: '14px sans-serif',
          pixelOffset: new window.Cesium.Cartesian2(0, -18),
          show: true,
          heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND
        }
      });

      const cleanupTime = (positionData.duration + 3) * 1000;
      setTimeout(() => {
        try {
          if (viewer && !viewer.isDestroyed() && viewer.entities.contains(entity)) {
            viewer.entities.remove(entity);
            updateDotVehicleCount(-1);
          }
        } catch (error) {
          console.warn("Error removing dot vehicle:", error);
        }
      }, cleanupTime);

    } catch (error) {
      console.error("Error spawning dot vehicle:", error);
    }
  };

  // Create working traffic light
  const createTrafficLight = (viewer, position) => {
    try {
      if (!viewer || viewer.isDestroyed() || !showTrafficSystem) return;
      if (!validateCoordinate(position)) return;

      const cartesianPos = window.Cesium.Cartesian3.fromDegrees(position[0], position[1], 0);
      
      const entity = viewer.entities.add({
        name: `TrafficLight-${Date.now()}`,
        position: cartesianPos,
        point: {
          pixelSize: 14,
          color: window.Cesium.Color.RED,
          show: true,
          heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND
        },
        label: {
          text: "🚦 RED",
          font: '14px sans-serif',
          fillColor: window.Cesium.Color.RED,
          outlineColor: window.Cesium.Color.BLACK,
          outlineWidth: 2,
          style: window.Cesium.LabelStyle.FILL_AND_OUTLINE,
          verticalOrigin: window.Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new window.Cesium.Cartesian2(0, -45),
          show: true,
          heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND
        }
      });

      try {
        entity.model = {
          uri: 'http://192.168.6.225:8082/traffic-light.glb',
          scale: 0.8,
          minimumPixelSize: 18
        };
        
        entity.model.readyPromise.then(() => {
          entity.point.show = false;
        }).catch(() => {
          console.warn("Traffic light model failed to load, using point representation");
        });
      } catch (error) {
        console.warn("Error setting up traffic light 3D model, using point:", error);
      }

      let isGreen = false;
      let isDestroyed = false;
      
      entity.isGreen = isGreen;
      updateLightStatus(0, 1);

      const cycleLight = () => {
        try {
          if (isDestroyed || viewer.isDestroyed() || !viewer.entities.contains(entity) || !showTrafficSystem) {
            return;
          }
          
          const wasGreen = isGreen;
          isGreen = !isGreen;
          entity.isGreen = isGreen;
          
          entity.label.text = isGreen ? "🚦 GREEN" : "🚦 RED";
          entity.label.fillColor = isGreen ? window.Cesium.Color.LIME : window.Cesium.Color.RED;
          entity.point.color = isGreen ? window.Cesium.Color.GREEN : window.Cesium.Color.RED;
          
          if (isGreen && !wasGreen) {
            updateLightStatus(1, -1);
          } else if (!isGreen && wasGreen) {
            updateLightStatus(-1, 1);
          }
          
          const nextCycleTime = isGreen ? 
            (7000 + Math.random() * 4000) : 
            (4000 + Math.random() * 3000);
          
          setTimeout(cycleLight, nextCycleTime);
        } catch (error) {
          console.warn("Error cycling traffic light:", error);
        }
      };
      
      const initialDelay = Math.random() * 5000 + 1000;
      setTimeout(cycleLight, initialDelay);

      entity.destroy = () => {
        isDestroyed = true;
        if (entity.isGreen) {
          updateLightStatus(-1, 0);
        } else {
          updateLightStatus(0, -1);
        }
      };

      return entity;

    } catch (error) {
      console.error("Error creating traffic light:", error);
    }
  };

  // Enhanced accident creation with CCTV camera
  const createAccident = (viewer, position) => {
    try {
      if (!viewer || viewer.isDestroyed() || !showTrafficSystem) return;
      if (accidentCount >= config.maxAccidents) return;
      if (!validateCoordinate(position)) return;

      const accidentId = `ACC-${Date.now()}`;

      const entity = viewer.entities.add({
        name: `Accident-${Date.now()}`,
        position: window.Cesium.Cartesian3.fromDegrees(position[0], position[1], 0),
        ellipse: {
          semiMinorAxis: 20,
          semiMajorAxis: 20,
          material: window.Cesium.Color.RED.withAlpha(0.6),
          heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND
        },
        point: {
          pixelSize: 18,
          color: window.Cesium.Color.ORANGE,
          outlineColor: window.Cesium.Color.RED,
          outlineWidth: 3,
          heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND,
          show: true
        },
        label: {
          text: '⚠️ INCIDENT',
          font: '16px sans-serif',
          fillColor: window.Cesium.Color.RED,
          outlineColor: window.Cesium.Color.WHITE,
          outlineWidth: 2,
          style: window.Cesium.LabelStyle.FILL_AND_OUTLINE,
          verticalOrigin: window.Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new window.Cesium.Cartesian2(0, -35),
          show: true,
          heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND
        }
      });

      // Create CCTV camera at accident location
      const cctvCamera = createAccidentCCTV(position, accidentId);

      setActiveAccidents(prev => [...prev, { position, entity, cctvCamera, accidentId }]);
      updateAccidentCount(1);

      setTimeout(() => {
        try {
          if (viewer && !viewer.isDestroyed() && viewer.entities.contains(entity)) {
            viewer.entities.remove(entity);
            
            // Remove associated CCTV camera
            if (cctvCamera && viewer.entities.contains(cctvCamera)) {
              viewer.entities.remove(cctvCamera);
              cctvEntitiesRef.current = cctvEntitiesRef.current.filter(cam => cam !== cctvCamera);
            }
            
            setActiveAccidents(prev => prev.filter(a => a.entity !== entity));
            updateAccidentCount(-1);
          }
        } catch (error) {
          console.warn("Error removing accident:", error);
        }
      }, 30000);

    } catch (error) {
      console.error("Error creating accident:", error);
    }
  };

  // Create realistic Google Maps style heatmap for Al Marjan Island
  const createRealisticHeatmap = (crowdData) => {
    try {
      if (!viewerRef.current || !crowdData) {
        console.warn("Cannot create heatmap: missing viewer or data");
        return;
      }

      heatmapEntitiesRef.current.forEach(entity => {
        if (viewerRef.current && viewerRef.current.entities.contains(entity)) {
          viewerRef.current.entities.remove(entity);
        }
      });
      heatmapEntitiesRef.current = [];

      console.log("Creating Al Marjan Island heatmap with", crowdData.length, "data points");

      crowdData.forEach((location, index) => {
        const { longitude, latitude, crowdCount } = location;
        const intensity = Math.min(crowdCount / 120, 1);
        
        const radiusSteps = [100, 75, 50, 30, 18];
        const alphaSteps = [0.12, 0.22, 0.35, 0.55, 0.75];
        
        radiusSteps.forEach((radius, stepIndex) => {
          let baseColor;
          if (intensity < 0.25) {
            baseColor = window.Cesium.Color.GREEN;
          } else if (intensity < 0.5) {
            baseColor = window.Cesium.Color.YELLOW;
          } else if (intensity < 0.75) {
            baseColor = window.Cesium.Color.ORANGE;
          } else {
            baseColor = window.Cesium.Color.RED;
          }

          const color = baseColor.withAlpha(alphaSteps[stepIndex] * intensity);

          try {
            const entity = viewerRef.current.entities.add({
              name: `IslandHeatmap-${index}-${stepIndex}`,
              position: window.Cesium.Cartesian3.fromDegrees(longitude, latitude, 0),
              ellipse: {
                semiMinorAxis: radius * (0.4 + intensity * 0.6),
                semiMajorAxis: radius * (0.4 + intensity * 0.6),
                material: color,
                heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND,
                outline: false,
                show: true
              }
            });

            heatmapEntitiesRef.current.push(entity);
          } catch (entityError) {
            console.warn("Failed to create heatmap entity:", entityError);
          }
        });

        if (crowdCount > 40) {
          try {
            const centerEntity = viewerRef.current.entities.add({
              name: `IslandHeatmapCenter-${index}`,
              position: window.Cesium.Cartesian3.fromDegrees(longitude, latitude, 0),
              point: {
                pixelSize: 10 + intensity * 15,
                color: window.Cesium.Color.WHITE,
                outlineColor: window.Cesium.Color.BLACK,
                outlineWidth: 2,
                heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND,
                show: true
              },
              label: {
                text: crowdCount.toString(),
                font: '16px bold sans-serif',
                fillColor: window.Cesium.Color.WHITE,
                outlineColor: window.Cesium.Color.BLACK,
                outlineWidth: 2,
                style: window.Cesium.LabelStyle.FILL_AND_OUTLINE,
                pixelOffset: new window.Cesium.Cartesian2(0, -30),
                scale: 1.0,
                show: true,
                heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND
              }
            });

            heatmapEntitiesRef.current.push(centerEntity);
          } catch (labelError) {
            console.warn("Failed to create heatmap label:", labelError);
          }
        }
      });

      console.log("Al Marjan Island heatmap created successfully with", heatmapEntitiesRef.current.length, "entities");
      
    } catch (error) {
      console.error("Error creating Al Marjan Island heatmap:", error);
    }
  };

  // Load KML data
  const loadKMLData = async () => {
    try {
      if (!window.Cesium || !viewerRef.current) return null;
      
      console.log("Loading KML data...");
      const kmlUrl = 'http://192.168.6.225:8082/al_marjan.kml';
      
      const kmlDataSource = await window.Cesium.KmlDataSource.load(kmlUrl, {
        camera: viewerRef.current.scene.camera,
        canvas: viewerRef.current.scene.canvas
      });
      
      kmlDataSource.show = showKML;
      kmlDataSourceRef.current = kmlDataSource;
      viewerRef.current.dataSources.add(kmlDataSource);
      
      console.log("KML data loaded successfully");
      return kmlDataSource;
    } catch (error) {
      console.error('Error loading KML:', error);
      return null;
    }
  };

  // Load Buildings GeoJSON data
  const loadBuildingsData = async () => {
    try {
      if (!window.Cesium || !viewerRef.current) return null;
      
      console.log("Loading Buildings data...");
      const geoJsonUrl = 'http://192.168.6.225:8082/Al_marjan_island.geojson';
      
      const geoJsonData = await window.Cesium.GeoJsonDataSource.load(geoJsonUrl, {
        clampToGround: false
      });

      geoJsonData.show = showBuildings;
      buildingsDataSourceRef.current = geoJsonData;
      viewerRef.current.dataSources.add(geoJsonData);

      const defaultHeight = 25;
      const entities = geoJsonData.entities.values;
      const buildingLabels = [];
      
      for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        if (window.Cesium.defined(entity.polygon)) {
          entity.polygon.extrudedHeight = new window.Cesium.ConstantProperty(defaultHeight);
          entity.polygon.material = window.Cesium.Color.DODGERBLUE.withAlpha(0.8);
          entity.polygon.outline = true;
          entity.polygon.outlineColor = window.Cesium.Color.WHITE;
          
          const buildingName = entity.properties?.name?.getValue() || `Building ${i + 1}`;
          const positions = entity.polygon.hierarchy.getValue(window.Cesium.JulianDate.now()).positions;
          
          if (positions && positions.length > 0) {
            const center = window.Cesium.BoundingSphere.fromPoints(positions).center;
            
            const labelEntity = viewerRef.current.entities.add({
              position: center,
              label: {
                text: buildingName,
                font: '16px sans-serif',
                fillColor: window.Cesium.Color.WHITE,
                scale: 1.2,
                pixelOffset: new window.Cesium.Cartesian2(0, -35),
                show: false
              }
            });

            buildingLabels.push(labelEntity);
          }
        }
      }

      buildingLabelsRef.current = buildingLabels;
      console.log("Buildings data loaded successfully");
      return geoJsonData;
    } catch (error) {
      console.error('Error loading Buildings GeoJSON:', error);
      return null;
    }
  };

  // Load roads data
  const loadRoadsData = async () => {
    try {
      if (!window.Cesium || !viewerRef.current) return null;
      
      console.log("Loading roads data...");
      const roadsGeoJsonUrl = 'http://192.168.6.225:8082/al_marjan_roads.geojson';
      
      const roadsData = await window.Cesium.GeoJsonDataSource.load(roadsGeoJsonUrl, {
        clampToGround: true
      });

      const roads = roadsData.entities.values;
      for (let i = 0; i < roads.length; i++) {
        const road = roads[i];
        if (window.Cesium.defined(road.polyline)) {
          const roadType = road.properties?.type?.getValue() || 'default';
          
          let color = window.Cesium.Color.YELLOW;
          let width = 4;
          
          switch(roadType) {
            case 'main':
            case 'primary':
              color = window.Cesium.Color.RED;
              width = 6;
              break;
            case 'secondary':
              color = window.Cesium.Color.ORANGE;
              width = 5;
              break;
            case 'residential':
              color = window.Cesium.Color.WHITE;
              width = 3;
              break;
            default:
              color = window.Cesium.Color.YELLOW;
              width = 4;
          }
          
          road.polyline.width = width;
          road.polyline.material = color;
        }
      }

      roadsData.show = showRoads;
      roadsDataSourceRef.current = roadsData;
      viewerRef.current.dataSources.add(roadsData);
      
      // Extract road coordinates for traffic system
      const roadCoordinates = extractRoadPaths({
        features: roads.map(road => ({
          geometry: {
            type: "LineString",
            coordinates: road.polyline ? 
              road.polyline.positions.getValue().map(pos => {
                const cartographic = window.Cesium.Cartographic.fromCartesian(pos);
                return [
                  window.Cesium.Math.toDegrees(cartographic.longitude),
                  window.Cesium.Math.toDegrees(cartographic.latitude)
                ];
              }) : []
          },
          properties: road.properties ? {
            highway: road.properties.type?.getValue() || 'residential',
            type: road.properties.type?.getValue() || 'residential'
          } : {}
        }))
      });
      setRoadData(roadCoordinates);
      
      console.log("Roads data loaded successfully");
      return roadsData;
    } catch (error) {
      console.error('Error loading Roads GeoJSON:', error);
      return null;
    }
  };

  // Load heatmap data for Al Marjan Island
  const loadHeatmapData = async () => {
    try {
      if (!window.Cesium || !viewerRef.current) return null;
      
      console.log("Loading Al Marjan Island heatmap data...");
      
      // Generate realistic crowd data for Al Marjan Island (UAE coordinates)
      const islandCrowdData = [
        { longitude: 55.749223, latitude: 25.661129, crowdCount: 95, id: 1, location: "Beach Resort Area" },
        { longitude: 55.747815, latitude: 25.664525, crowdCount: 75, id: 2, location: "Marina" },
        { longitude: 55.744293, latitude: 25.667957, crowdCount: 85, id: 3, location: "Hotel Complex" },
        { longitude: 55.744668, latitude: 25.669040, crowdCount: 65, id: 4, location: "Shopping Center" },
        { longitude: 55.745011, latitude: 25.670133, crowdCount: 45, id: 5, location: "Residential Area" },
        { longitude: 55.744496, latitude: 25.672734, crowdCount: 55, id: 6, location: "Restaurant District" },
        { longitude: 55.740387, latitude: 25.671941, crowdCount: 35, id: 7, location: "Parking Area" },
        { longitude: 55.740051, latitude: 25.677859, crowdCount: 105, id: 8, location: "Water Sports Center" },
        { longitude: 55.749514, latitude: 25.680132, crowdCount: 25, id: 9, location: "Service Area" },
        { longitude: 55.745855, latitude: 25.679668, crowdCount: 85, id: 10, location: "Event Venue" }
      ];

      // Store crowd data for toggle functionality
      window.islandCrowdDataCache = islandCrowdData;
      // Create realistic heatmap if should be shown
      if (showHeatmap) {
        createRealisticHeatmap(islandCrowdData);
      }
      
      console.log("Al Marjan Island heatmap data loaded successfully with", islandCrowdData.length, "points");
      return islandCrowdData;
    } catch (error) {
      console.error('Error loading Al Marjan Island heatmap data:', error);
      return null;
    }
  };

  // Load road traffic heatmap data
  const loadRoadHeatmapData = async () => {
    try {
      if (!window.Cesium || !viewerRef.current) return null;
      
      console.log("Loading road traffic heatmap data...");
      
      // Generate realistic road traffic data for Al Marjan Island
      const roadTrafficData = [
        { longitude: 55.748851, latitude: 25.661430, trafficDensity: 85, roadType: "main", id: 1, location: "Main Entrance" },
        { longitude: 55.747899, latitude: 25.662283, trafficDensity: 70, roadType: "primary", id: 2, location: "Resort Access Road" },
        { longitude: 55.745320, latitude: 25.664693, trafficDensity: 60, roadType: "secondary", id: 3, location: "Marina Boulevard" },
        { longitude: 55.743179, latitude: 25.668717, trafficDensity: 45, roadType: "residential", id: 4, location: "Hotel District" },
        { longitude: 55.742888, latitude: 25.671068, trafficDensity: 55, roadType: "secondary", id: 5, location: "Shopping Area" },
        { longitude: 55.739396, latitude: 25.677447, trafficDensity: 75, roadType: "main", id: 6, location: "Water Sports Hub" },
        { longitude: 55.742215, latitude: 25.680780, trafficDensity: 40, roadType: "residential", id: 7, location: "North Beach Road" },
        { longitude: 55.744500, latitude: 25.669500, trafficDensity: 90, roadType: "main", id: 8, location: "Central Boulevard" },
        { longitude: 55.746200, latitude: 25.675300, trafficDensity: 65, roadType: "secondary", id: 9, location: "Event Center Access" },
        { longitude: 55.741800, latitude: 25.673200, trafficDensity: 30, roadType: "residential", id: 10, location: "Service Road" }
      ];

      // Store road traffic data for toggle functionality
      window.roadTrafficDataCache = roadTrafficData;
      
      // Create road heatmap if should be shown
      if (showRoadHeatmap) {
        createRoadTrafficHeatmap(roadTrafficData);
      }
      
      console.log("Road traffic heatmap data loaded successfully with", roadTrafficData.length, "points");
      return roadTrafficData;
    } catch (error) {
      console.error('Error loading road traffic heatmap data:', error);
      return null;
    }
  };

  // Setup traffic spawning
  const setupTrafficSpawning = () => {
    if (!roadData || !showTrafficSystem || !viewerRef.current) return;

    console.log("Setting up Al Marjan Island traffic spawning...");
    
    // Clear existing intervals
    Object.values(trafficIntervalsRef.current).forEach(interval => {
      if (interval) clearInterval(interval);
    });
    trafficIntervalsRef.current = {};

    // Hardcoded traffic light coordinates for Al Marjan Island
    const trafficLightCoordinates = [
      [55.748851, 25.661430],
      [55.747899, 25.662283],
      [55.747780, 25.662246],
      [55.745320, 25.664693],
      [55.745198, 25.664653],
      [55.743179, 25.668717],
      [55.743046, 25.668797],
      [55.742888, 25.671068],
      [55.739396, 25.677447],
      [55.739512, 25.677370],
      [55.742215, 25.680780],
      [55.742289, 25.681081],
      [55.742585, 25.681006],
    ];

    // Create traffic lights at hardcoded coordinates only
    let lightCount = 0;
    trafficLightCoordinates.forEach(coords => {
      if (lightCount < config.maxTrafficLights && validateCoordinate(coords)) {
        createTrafficLight(viewerRef.current, coords);
        lightCount++;
      }
    });

    console.log(`Created ${lightCount} hardcoded traffic lights at specified coordinates`);

    // Set up ambulance spawning with full highway traversal
    trafficIntervalsRef.current.ambulances = setInterval(() => {
      try {
        if (!viewerRef.current || viewerRef.current.isDestroyed() || !showTrafficSystem) return;
        
        if (vehicleCount < config.maxVehicles && roadData) {
          const useMainRoad = Math.random() < 5.8 && roadData.mainRoads.length > 0;
          const roads = useMainRoad ? roadData.mainRoads : roadData.sideRoads;
          
          if (roads.length > 0) {
            const randomRoad = roads[Math.floor(Math.random() * roads.length)];
            spawnAmbulance(viewerRef.current, randomRoad);
          }
        }
      } catch (error) {
        console.error("Error in ambulance spawning:", error);
      }
    }, config.vehicleSpawnRate);

    // Set up dot vehicle spawning with full paths
    trafficIntervalsRef.current.dotVehicles = setInterval(() => {
      try {
        if (!viewerRef.current || viewerRef.current.isDestroyed() || !showTrafficSystem) return;
        
        if (dotVehicleCount < config.maxDotVehicles && roadData) {
          const useMainRoad = Math.random() < 0.6 && roadData.mainRoads.length > 0;
          const roads = useMainRoad ? roadData.mainRoads : roadData.sideRoads;
          
          if (roads.length > 0) {
            const randomRoad = roads[Math.floor(Math.random() * roads.length)];
            spawnDotVehicle(viewerRef.current, randomRoad);
          }
        }
      } catch (error) {
        console.error("Error in dot vehicle spawning:", error);
      }
    }, config.dotVehicleSpawnRate);

    // Set up accident generation at middle sections of roads
    trafficIntervalsRef.current.accidents = setInterval(() => {
      try {
        if (!viewerRef.current || viewerRef.current.isDestroyed() || !showTrafficSystem) return;
        
        if (Math.random() < 0.25 && accidentCount < config.maxAccidents && roadData) {
          const allRoads = [...roadData.mainRoads, ...roadData.sideRoads];
          if (allRoads.length > 0) {
            const randomRoad = allRoads[Math.floor(Math.random() * allRoads.length)];
            // Place accidents in middle sections, not at intersections
            const middleRange = Math.floor(randomRoad.length * 0.3);
            const startIndex = Math.floor(randomRoad.length * 0.35);
            const randomIndex = startIndex + Math.floor(Math.random() * middleRange);
            const safeIndex = Math.min(randomIndex, randomRoad.length - 1);
            createAccident(viewerRef.current, randomRoad[safeIndex]);
          }
        }
      } catch (error) {
        console.error("Error in accident generation:", error);
      }
    }, 30000);

    console.log("Al Marjan Island traffic spawning setup complete - Hardcoded traffic lights, full highway traversal");
  };

  // Setup zoom listener
  const setupZoomListener = useCallback(() => {
    if (!viewerRef.current) return;
    
    const checkZoomLevel = () => {
      if (!viewerRef.current) return;
      const cameraHeight = viewerRef.current.camera.positionCartographic.height;
      
      buildingLabelsRef.current.forEach(labelEntity => {
        if (labelEntity && labelEntity.label) {
          labelEntity.label.show = cameraHeight < zoomThreshold && showBuildings;
        }
      });
      
      // Update heatmap labels based on zoom
      heatmapEntitiesRef.current.forEach(entity => {
        if (entity.label && entity.name.includes('IslandHeatmapCenter')) {
          entity.label.show = showHeatmap && cameraHeight < 2500;
        }
      });

      // Update road heatmap labels based on zoom
      roadHeatmapEntitiesRef.current.forEach(entity => {
        if (entity.label && entity.name.includes('RoadHeatmapCenter')) {
          entity.label.show = showRoadHeatmap && cameraHeight < 2000;
        }
      });
    };

    viewerRef.current.camera.changed.addEventListener(checkZoomLevel);
    checkZoomLevel();
  }, [showHeatmap, showRoadHeatmap, showBuildings]);

  // Enhanced handle map click with CCTV camera support
  const handleMapClick = useCallback(async (movement) => {
    if (!viewerRef.current) return;

    const pickedObject = viewerRef.current.scene.pick(movement.position);
    if (pickedObject && pickedObject.id) {
      // Handle clicks on anchor points (regular CCTV cameras)
      if (pickedObject.id.properties) {
        if (pickedObject.id.properties.video) {
          const videoUrl = pickedObject.id.properties.video.getValue();
          const videoTitle = pickedObject.id.properties['@id']?.getValue() || 
                           pickedObject.id.properties.name?.getValue() || 'Video';
          setVideoUrl(videoUrl);
          setVideoTitle(videoTitle);
          setShowVideoModal(true);
          return;
        }
      }

      // Handle clicks on accident CCTV cameras
      if (pickedObject.id.name && pickedObject.id.name.includes('AccidentCCTV')) {
        const videoUrl = pickedObject.id.properties?.video?.getValue();
        const videoTitle = pickedObject.id.properties?.name?.getValue() || 'Accident CCTV';
        if (videoUrl) {
          setVideoUrl(videoUrl);
          setVideoTitle(videoTitle);
          setShowVideoModal(true);
          return;
        }
      }
    }

    const ray = viewerRef.current.camera.getPickRay(movement.position);
    const position = viewerRef.current.scene.globe.pick(ray, viewerRef.current.scene);
    if (!position) return;

    try {
      const cartographic = window.Cesium.Cartographic.fromCartesian(position);
      
      // Sample terrain for accurate height
      const [updatedCartographic] = await window.Cesium.sampleTerrainMostDetailed(
        viewerRef.current.terrainProvider,
        [cartographic]
      );
      
      const longitude = window.Cesium.Math.toDegrees(updatedCartographic.longitude);
      const latitude = window.Cesium.Math.toDegrees(updatedCartographic.latitude);
      
      console.log(`Clicked coordinates: ${longitude}, ${latitude}`);
      
      const anchorName = window.prompt("Enter a name for the anchor point:");
      if (!anchorName) return;

      const videoUrl = window.prompt("Enter a video URL (optional):");

      // Create new anchor feature for backend
      const newAnchorFeature = {
        type: "Feature",
        properties: {
          "@id": anchorName,
          name: anchorName,
          video: videoUrl || null,
          type: "anchor_point",
          created_at: new Date().toISOString()
        },
        geometry: {
          type: "Point",
          coordinates: [longitude, latitude]
        }
      };

      try {
        // Save to backend first
        setStatus('Saving anchor point to backend...');
        await saveAnchorToBackend(newAnchorFeature);
        
        // Reload anchor data to refresh the display
        await loadAnchorData();
        
        setStatus(`Island Roads are now ${newShowState ? 'visible' : 'hidden'}`);
        const newPosition = window.Cesium.Cartesian3.fromDegrees(longitude, latitude, 100);
        await viewerRef.current.camera.flyTo({
          destination: newPosition,
          duration: 2.0
        });
        
      } catch (backendError) {
        console.error("Error saving to backend:", backendError);
        
        // Fallback: create locally if backend fails
        const localAnchorEntity = viewerRef.current.entities.add({
          position: window.Cesium.Cartesian3.fromDegrees(longitude, latitude, 0),
          billboard: {
            image: "/images/cctv-camera.png",
            width: 32,
            height: 32,
            heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND
          },
          label: {
            text: anchorName,
            font: '16px sans-serif',
            fillColor: window.Cesium.Color.WHITE,
            outlineColor: window.Cesium.Color.BLACK,
            outlineWidth: 2,
            style: window.Cesium.LabelStyle.FILL_AND_OUTLINE,
            pixelOffset: new window.Cesium.Cartesian2(0, -40),
            heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND
          },
          properties: {
            name: anchorName,
            video: videoUrl || null,
            type: "anchor_point"
          }
        });
        
        if (videoUrl) {
          localAnchorEntity.description = `
            <h3>${anchorName}</h3>
            <video width="320" height="240" controls>
              <source src="${videoUrl}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          `;
        }
        
        await viewerRef.current.zoomTo(localAnchorEntity);
        setStatus(`Added anchor point locally: ${anchorName} (Backend save failed)`);
      }
      
    } catch (error) {
      console.error("Error adding anchor point:", error);
      setStatus('Failed to add anchor point');
    }
  }, [anchorData]);

  // Toggle functions with proper state management
  const toggleHeatmap = useCallback(async () => {
    const newShowState = !showHeatmap;
    setShowHeatmap(newShowState);
    
    try {
      if (newShowState) {
        console.log("Showing Al Marjan Island heatmap...");
        
        let crowdData = window.islandCrowdDataCache;
        if (!crowdData) {
          await loadHeatmapData();
          crowdData = window.islandCrowdDataCache;
        }
        
        if (crowdData) {
          createRealisticHeatmap(crowdData);
          setStatus("Island Crowd Heatmap activated - Showing tourist density");
        } else {
          setStatus("Failed to load heatmap data");
        }
      } else {
        console.log("Hiding Al Marjan Island heatmap...");
        heatmapEntitiesRef.current.forEach(entity => {
          if (viewerRef.current && viewerRef.current.entities.contains(entity)) {
            viewerRef.current.entities.remove(entity);
          }
        });
        heatmapEntitiesRef.current = [];
        setStatus("Island Crowd Heatmap deactivated");
      }
    } catch (error) {
      console.error("Error toggling heatmap:", error);
      setStatus("Error toggling heatmap");
    }
  }, [showHeatmap]);

  // New toggle function for road heatmap
  const toggleRoadHeatmap = useCallback(async () => {
    const newShowState = !showRoadHeatmap;
    setShowRoadHeatmap(newShowState);
    
    try {
      if (newShowState) {
        console.log("Showing road traffic heatmap...");
        
        let roadTrafficData = window.roadTrafficDataCache;
        if (!roadTrafficData) {
          await loadRoadHeatmapData();
          roadTrafficData = window.roadTrafficDataCache;
        }
        
        if (roadTrafficData) {
          createRoadTrafficHeatmap(roadTrafficData);
          setStatus("Road Traffic Heatmap activated - Showing traffic density");
        } else {
          setStatus("Failed to load road traffic data");
        }
      } else {
        console.log("Hiding road traffic heatmap...");
        roadHeatmapEntitiesRef.current.forEach(entity => {
          if (viewerRef.current && viewerRef.current.entities.contains(entity)) {
            viewerRef.current.entities.remove(entity);
          }
        });
        roadHeatmapEntitiesRef.current = [];
        setStatus("Road Traffic Heatmap deactivated");
      }
    } catch (error) {
      console.error("Error toggling road heatmap:", error);
      setStatus("Error toggling road heatmap");
    }
  }, [showRoadHeatmap]);

  const toggleRoads = useCallback(() => {
    const newShowState = !showRoads;
    setShowRoads(newShowState);
    
    if (roadsDataSourceRef.current) {
      roadsDataSourceRef.current.show = newShowState;
    }
    
    setStatus(`Added anchor point: ${anchorName} and saved to backend`);
  }, [showRoads]);

  const toggleBuildings = useCallback(() => {
    const newShowState = !showBuildings;
    setShowBuildings(newShowState);
    
    // Toggle buildings
    if (buildingsDataSourceRef.current) {
      buildingsDataSourceRef.current.show = newShowState;
      
      buildingLabelsRef.current.forEach(label => {
        if (label && label.label) {
          label.show = newShowState;
        }
      });
    }
    
    // Toggle anchor points with buildings
    if (anchorDataSourceRef.current) {
      anchorDataSourceRef.current.show = newShowState;
    }
    
    setStatus(`Island Buildings and Anchor Points are now ${newShowState ? 'visible' : 'hidden'}`);
  }, [showBuildings]);

  const toggleKML = useCallback(() => {
    const newShowState = !showKML;
    setShowKML(newShowState);
    
    if (kmlDataSourceRef.current) {
      kmlDataSourceRef.current.show = newShowState;
    }
    
    setStatus(`KML Data is now ${newShowState ? 'visible' : 'hidden'}`);
  }, [showKML]);

  const toggleTrafficSystem = useCallback(() => {
    const newShowState = !showTrafficSystem;
    setShowTrafficSystem(newShowState);
    
    if (!newShowState) {
      // Clear all traffic-related entities
      if (viewerRef.current) {
        const entitiesToRemove = [];
        viewerRef.current.entities.values.forEach(entity => {
          if (entity.name && (
            entity.name.includes('Ambulance') || 
            entity.name.includes('Vehicle') || 
            entity.name.includes('TrafficLight') ||
            entity.name.includes('Accident') ||
            entity.name.includes('AccidentCCTV')
          )) {
            entitiesToRemove.push(entity);
          }
        });
        
        entitiesToRemove.forEach(entity => {
          viewerRef.current.entities.remove(entity);
        });
      }
      
      // Clear intervals
      Object.values(trafficIntervalsRef.current).forEach(interval => {
        if (interval) clearInterval(interval);
      });
      trafficIntervalsRef.current = {};
      
      // Clear CCTV entities
      cctvEntitiesRef.current = [];
      
      // Reset counters
      setVehicleCount(0);
      setDotVehicleCount(0);
      setGreenLightCount(0);
      setRedLightCount(0);
      setAccidentCount(0);
      setActiveAccidents([]);
    } else {
      // Restart traffic system
      if (roadData) {
        setupTrafficSpawning();
      }
    }
    
    setStatus(`Island Traffic System is now ${newShowState ? 'active' : 'inactive'}`);
  }, [showTrafficSystem, roadData]);

  // Initialize Cesium for Al Marjan Island
  useEffect(() => {
    let isMounted = true;

    const loadCesium = async () => {
      // Add Cesium CSS
      if (!document.querySelector('link[href*="widgets.css"]')) {
        const link = document.createElement('link');
        link.href = 'https://cesium.com/downloads/cesiumjs/releases/1.119/Build/Cesium/Widgets/widgets.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }

      // Load Cesium script
      if (!window.Cesium) {
        await new Promise((resolve, reject) => {
          if (document.querySelector('script[src*="cesium"]')) {
            const checkCesium = () => {
              if (window.Cesium) {
                resolve();
              } else {
                setTimeout(checkCesium, 100);
              }
            };
            checkCesium();
            return;
          }

          const script = document.createElement('script');
          script.src = 'https://cesium.com/downloads/cesiumjs/releases/1.119/Build/Cesium/Cesium.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
    };

    const initializeCesium = async () => {
      try {
        if (!isMounted) return;
        
        setStatus('Loading Cesium for Al Marjan Island...');
        await loadCesium();
        
        if (!isMounted) return;

        const Cesium = window.Cesium;
        
        // Set Ion access token
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YjhlMmVkNC1hYWVjLTQxYWEtOGZhYS1iOGQyNDUxY2ZlMTUiLCJpZCI6MjY0Nzg3LCJpYXQiOjE3MzUxMTAzMzV9.tdJk1ppDaw9AEy9bFB6RBU9T3H0-xOlIqVlrjDBJGQo';

        // Destroy existing viewer if it exists
        if (viewerRef.current && !viewerRef.current.isDestroyed()) {
          viewerRef.current.destroy();
        }

        if (!isMounted || !cesiumContainerRef.current) return;
        
        setStatus('Creating Al Marjan Island viewer...');
        
        const terrainProvider = await Cesium.createWorldTerrainAsync();
        
        const viewer = new Cesium.Viewer(cesiumContainerRef.current, {
          terrainProvider: terrainProvider,
          baseLayerPicker: true,
          timeline: false,
          animation: false,
          shouldAnimate: true
        });

        if (!isMounted) {
          viewer.destroy();
          return;
        }

        viewerRef.current = viewer;
        setStatus('Loading Al Marjan Island data...');

        // Load all data sources sequentially
        const kml = await loadKMLData();
        if (!isMounted) return;
        
        const buildings = await loadBuildingsData();
        if (!isMounted) return;
        
        const roads = await loadRoadsData();
        if (!isMounted) return;
        
        const anchors = await loadAnchorData(); // Load anchor points from backend
        if (!isMounted) return;
        
        const heatmap = await loadHeatmapData();
        if (!isMounted) return;

        const roadHeatmap = await loadRoadHeatmapData(); // Load road traffic heatmap
        if (!isMounted) return;

        // Setup zoom listener after all data is loaded
        setupZoomListener();

        // Fly to Al Marjan Island
        if (buildings) {
          await viewer.flyTo(buildings);
        } else {
          // Fallback coordinates for Al Marjan Island
          viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(55.6920, 25.4245, 2000),
            duration: 3
          });
        }

        if (!isMounted) return;

        setStatus('Al Marjan Island System ready - Click to add anchor points');
        setIsLoaded(true);
        
        console.log("Al Marjan Island system initialization complete");

      } catch (error) {
        console.error("Failed to initialize Al Marjan Island system:", error);
        if (isMounted) {
          setStatus('Failed to initialize Al Marjan Island system');
          setIsLoaded(true);
        }
      }
    };

    initializeCesium();

    return () => {
      isMounted = false;
      // Clear intervals
      Object.values(trafficIntervalsRef.current).forEach(interval => {
        if (interval) clearInterval(interval);
      });
      
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        try {
          viewerRef.current.entities.removeAll();
          viewerRef.current.dataSources.removeAll();
          viewerRef.current.destroy();
        } catch (error) {
          console.error("Error during cleanup:", error);
        }
      }
    };
  }, []); // Empty dependency array to run only once

  // Setup traffic spawning when road data is available
  useEffect(() => {
    if (roadData && showTrafficSystem && isLoaded) {
      setupTrafficSpawning();
    }
  }, [roadData, showTrafficSystem, isLoaded]);

  // Setup click handler
  useEffect(() => {
    if (!viewerRef.current || !isLoaded) return;

    const handler = new window.Cesium.ScreenSpaceEventHandler(viewerRef.current.canvas);
    handler.setInputAction(handleMapClick, window.Cesium.ScreenSpaceEventType.LEFT_CLICK);

    return () => {
      if (handler && !handler.isDestroyed()) {
        handler.destroy();
      }
    };
  }, [isLoaded, handleMapClick]);

  return (
    <div className="relative w-full h-screen bg-blue-900 overflow-hidden">
      {/* Single Cesium Container - Full Screen */}
      <div 
        ref={cesiumContainerRef} 
        className="absolute inset-0 w-full h-full"
        style={{ 
          width: '100%', 
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1
        }} 
      />
      
      {/* Loading indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-blue-900 bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-gray-900 bg-opacity-95 p-8 rounded-lg text-center border border-blue-500">
            <div className="text-white text-2xl font-bold mb-4">
              🏝️ Loading Al Marjan Island System
            </div>
            <div className="text-blue-300 mb-4 font-medium">
              {status}
            </div>
            <div className="mt-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Control Panel */}
      <div className="absolute top-4 right-4 bg-gray-900 bg-opacity-95 text-white font-sans p-4 rounded-xl z-[1000] max-w-xs shadow-2xl border border-blue-600">
        <h3 className="text-lg font-bold mb-4 text-center border-b border-blue-600 pb-2">
          🏝️ Al Marjan Island Controls
        </h3>
        
        <div className="space-y-2">
          <button 
            onClick={toggleKML}
            disabled={!isLoaded}
            className={`w-full p-3 rounded-lg font-semibold transition-all text-sm ${
              !isLoaded 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : showKML 
                ? 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            🗺️ {showKML ? 'Hide' : 'Show'} KML Data
          </button>
          
          <button 
            onClick={toggleBuildings}
            disabled={!isLoaded}
            className={`w-full p-3 rounded-lg font-semibold transition-all text-sm ${
              !isLoaded 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : showBuildings 
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            🏢 {showBuildings ? 'Hide' : 'Show'} Buildings & Anchors
          </button>
          
          <button 
            onClick={toggleRoads}
            disabled={!isLoaded}
            className={`w-full p-3 rounded-lg font-semibold transition-all text-sm ${
              !isLoaded 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : showRoads 
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            🛣️ {showRoads ? 'Hide' : 'Show'} Roads
          </button>
          
          <button 
            onClick={toggleHeatmap}
            disabled={!isLoaded}
            className={`w-full p-3 rounded-lg font-semibold transition-all text-sm ${
              !isLoaded 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : showHeatmap 
                ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            🔥 {showHeatmap ? 'Hide' : 'Show'} Tourist Heatmap
          </button>

          <button 
            onClick={toggleRoadHeatmap}
            disabled={!isLoaded}
            className={`w-full p-3 rounded-lg font-semibold transition-all text-sm ${
              !isLoaded 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : showRoadHeatmap 
                ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            🚗 {showRoadHeatmap ? 'Hide' : 'Show'} Road Traffic Heatmap
          </button>
          
          <button 
            onClick={toggleTrafficSystem}
            disabled={!isLoaded}
            className={`w-full p-3 rounded-lg font-semibold transition-all text-sm ${
              !isLoaded 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : showTrafficSystem 
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            🚨 {showTrafficSystem ? 'Disable' : 'Enable'} Traffic System
          </button>
        </div>
        
        <div className="mt-4 pt-3 border-t border-blue-600">
          <div className="text-xs text-gray-400">
            <div className="font-semibold text-white mb-1">Status:</div>
            <div className="text-green-400">{status}</div>
          </div>
          <div className="text-xs text-gray-400 mt-2">
            <div className="font-semibold text-white mb-1">Anchor Points:</div>
            <div className="text-blue-400">{anchorData.length} saved to backend</div>
          </div>
          <div className="text-xs text-gray-400 mt-2">
            <div className="font-semibold text-white mb-1">CCTV Cameras:</div>
            <div className="text-red-400">{cctvEntitiesRef.current.length} accident cameras</div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Traffic Dashboard for Island */}
      {showTrafficSystem && (
        <div className="absolute top-4 left-4 bg-gray-900 bg-opacity-95 text-white font-sans p-6 rounded-xl z-[1000] max-w-sm shadow-2xl border border-blue-600">
          <h3 className="text-xl font-bold mt-0 mb-6 text-center border-b border-blue-600 pb-3">
            🏝️ Island Traffic Control
          </h3>
          
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="bg-gradient-to-br from-red-800 to-red-900 p-4 rounded-lg border border-red-600">
              <div className="text-red-300 text-sm font-semibold">Emergency</div>
              <div className="text-3xl font-bold">{vehicleCount}</div>
              <div className="text-xs text-red-200">🚑 Ambulances</div>
            </div>
            <div className="bg-gradient-to-br from-blue-800 to-blue-900 p-4 rounded-lg border border-blue-600">
              <div className="text-blue-300 text-sm font-semibold">Vehicles</div>
              <div className="text-3xl font-bold">{dotVehicleCount}</div>
              <div className="text-xs text-blue-200">🚗 Tourist Cars</div>
            </div>
            <div className="bg-gradient-to-br from-green-800 to-green-900 p-4 rounded-lg border border-green-600">
              <div className="text-green-300 text-sm font-semibold">Green Lights</div>
              <div className="text-3xl font-bold">{greenLightCount}</div>
              <div className="text-xs text-green-200">🟢 Active</div>
            </div>
            <div className="bg-gradient-to-br from-red-800 to-red-900 p-4 rounded-lg border border-red-600">
              <div className="text-red-300 text-sm font-semibold">Red Lights</div>
              <div className="text-3xl font-bold">{redLightCount}</div>
              <div className="text-xs text-red-200">🔴 Active</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-orange-800 to-orange-900 p-4 rounded-lg border border-orange-600">
              <div className="text-orange-300 text-sm font-semibold">Incidents</div>
              <div className="text-3xl font-bold">{accidentCount}</div>
              <div className="text-xs text-orange-200">⚠️ Active</div>
            </div>
            <div className="bg-gradient-to-br from-purple-800 to-purple-900 p-4 rounded-lg border border-purple-600">
              <div className="text-purple-300 text-sm font-semibold">CCTV Cams</div>
              <div className="text-3xl font-bold">{cctvEntitiesRef.current.length}</div>
              <div className="text-xs text-purple-200">📹 Monitoring</div>
            </div>
          </div>
          
          <div className="border-t border-blue-600 pt-4">
            <h4 className="text-lg font-bold mb-3 text-orange-400">🚨 Island Incidents</h4>
            <div className="max-h-40 overflow-y-auto bg-gray-800 bg-opacity-50 rounded-lg p-3 border border-gray-700">
              {activeAccidents.length === 0 ? (
                <div className="text-green-400 text-center py-3">
                  ✅ Island Clear - No Active Incidents
                </div>
              ) : (
                activeAccidents.map((acc, index) => (
                  <div key={index} className="bg-orange-900 bg-opacity-40 p-3 rounded mb-2 border-l-4 border-orange-500">
                    <div className="font-semibold text-orange-300">🚨 Island Incident #{index + 1}</div>
                    <div className="text-sm text-gray-300">Location: Al Marjan Island Road</div>
                    <div className="text-xs text-red-400 mt-1">📹 CCTV Camera Active</div>
                    <div className="text-xs text-orange-400 mt-1">⏱️ Response Dispatched</div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-blue-600">
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
              <div>
                <div className="font-semibold text-white">Island Status</div>
                <div>{isLoaded ? '🟢 Online' : '🟡 Loading'}</div>
              </div>
              <div>
                <div className="font-semibold text-white">Data Source</div>
                <div>{roadData ? '🗺️ Island Roads' : '⏳ Loading'}</div>
              </div>
              <div>
                <div className="font-semibold text-white">Traffic Types</div>
                <div>🚑 Emergency + 🚗 Tourist</div>
              </div>
              <div>
                <div className="font-semibold text-white">CCTV Network</div>
                <div>📹 Auto-Deploy at Incidents</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Island Instructions */}
      <div className="absolute bottom-4 left-4 bg-gray-900 bg-opacity-90 text-white p-4 rounded-lg z-[1000] max-w-[380px] border border-blue-600">
        <div className="text-sm">
          <div className="font-semibold mb-2">🏝️ Al Marjan Island Features:</div>
          <div className="text-xs text-gray-300">
            • Click anywhere to add anchor points (saved to backend)<br/>
            • Click CCTV cameras for video popups<br/>
            • KML data shows detailed island features<br/>
            • Buildings with 3D extrusion and labels<br/>
            • Color-coded road network<br/>
            • Tourist heatmap shows crowd density<br/>
            • Road traffic heatmap shows congestion<br/>
            • Real-time traffic simulation<br/>
            • Emergency vehicle tracking<br/>
            • Auto CCTV deployment at accidents<br/>
            • Interactive video anchors with clickable cameras<br/>
            • Anchor points toggle with buildings<br/>
            • Backend integration for persistent data
          </div>
        </div>
      </div>
      
      
      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[1002]">
          <div className="bg-white p-6 rounded-lg max-w-[50%] max-h-[90%] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-black">{videoTitle}</h3>
              <button 
                onClick={() => setShowVideoModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <video 
              width="100%" 
              height="400"
              controls
              autoPlay
              onEnded={() => setShowVideoModal(false)}
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedIslandSystem;
