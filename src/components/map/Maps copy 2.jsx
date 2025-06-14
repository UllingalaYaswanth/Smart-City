



import React, { useEffect, useRef, useState, useCallback } from 'react';

const IntegratedTrafficSystem = () => {
  const cesiumContainerRef = useRef(null);
  const viewerRef = useRef(null);
  const tilesetRef = useRef(null);
  const geoJsonDataSourceRef = useRef(null);
  const roadsDataSourceRef = useRef(null);
  const heatmapDataSourceRef = useRef(null);
  const buildingLabelsRef = useRef([]);
  const trafficIntervalsRef = useRef({});
  const heatmapEntitiesRef = useRef([]);
  
  // State for dashboard and features
  const [vehicleCount, setVehicleCount] = useState(0);
  const [dotVehicleCount, setDotVehicleCount] = useState(0);
  const [greenLightCount, setGreenLightCount] = useState(0);
  const [redLightCount, setRedLightCount] = useState(0);
  const [accidentCount, setAccidentCount] = useState(0);
  const [activeAccidents, setActiveAccidents] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [roadData, setRoadData] = useState(null);
  const [status, setStatus] = useState('System initializing...');
  
  // Feature toggles
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showRoads, setShowRoads] = useState(true);
  const [showTrafficSystem, setShowTrafficSystem] = useState(true);
  const [showGeoJson, setShowGeoJson] = useState(true);
  const [show3DTileset, setShow3DTileset] = useState(true);

  // Configuration
  const config = {
    maxVehicles: 8,
    maxDotVehicles: 12,
    vehicleSpawnRate: 3000,
    dotVehicleSpawnRate: 2000,
    maxAccidents: 4,
    maxTrafficLights: 15
  };

  const zoomThreshold = 500;

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

  // Extract and validate road paths
  const extractRoadPaths = (geojson) => {
    const mainRoads = [];
    const sideRoads = [];
    
    try {
      geojson.features.forEach(feature => {
        if (!feature.geometry) return;
        
        const isMainRoad = feature.properties?.highway === 'primary' || 
                          feature.properties?.highway === 'secondary' ||
                          feature.properties?.highway === 'trunk';
        
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
      return { mainRoads: mainRoads.slice(0, 20), sideRoads: sideRoads.slice(0, 30) };
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
        window.Cesium.Cartesian3.fromDegrees(coord[0], coord[1], 2)
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
      const speed = 4 + Math.random() * 8;
      
      const positionData = createFullPathProperty(coordinates, startTime, speed);
      if (!positionData) return;

      updateVehicleCount(1);

      const entity = viewer.entities.add({
        name: `Ambulance-${Date.now()}`,
        position: positionData.positionProperty,
        point: {
          pixelSize: 12,
          color: window.Cesium.Color.RED,
          outlineColor: window.Cesium.Color.WHITE,
          outlineWidth: 2,
          show: true,
          heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND
        },
        label: {
          text: 'Ambulance',
          font: '16px sans-serif',
          pixelOffset: new window.Cesium.Cartesian2(0, -20),
          show: true
        }
      });

      // Try to load 3D model, fallback to point if fails
      try {
        entity.model = {
          uri: 'http://192.168.6.225:8082/ambulance.glb',
          scale: 0.8,
          minimumPixelSize: 12,
          maximumScale: 100
        };
        entity.orientation = new window.Cesium.VelocityOrientationProperty(positionData.positionProperty);
        
        entity.model.readyPromise.then(() => {
          entity.point.show = false; // Hide point when model loads
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
      const speed = 4 + Math.random() * 6;
      
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
        window.Cesium.Color.PINK
      ];

      const entity = viewer.entities.add({
        name: `Vehicle-${Date.now()}`,
        position: positionData.positionProperty,
        point: {
          pixelSize: 8,
          color: colors[Math.floor(Math.random() * colors.length)],
          outlineColor: window.Cesium.Color.WHITE,
          outlineWidth: 1,
          heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND,
          show: true
        },
        label: {
          text: '🚗',
          font: '12px sans-serif',
          pixelOffset: new window.Cesium.Cartesian2(0, -15),
          show: true
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

      const cartesianPos = window.Cesium.Cartesian3.fromDegrees(position[0], position[1], 5);
      
      const entity = viewer.entities.add({
        name: `TrafficLight-${Date.now()}`,
        position: cartesianPos,
        point: {
          pixelSize: 12,
          color: window.Cesium.Color.RED,
          show: true,
          heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND
        },
        label: {
          text: "🚦 RED",
          font: '12px sans-serif',
          fillColor: window.Cesium.Color.RED,
          outlineColor: window.Cesium.Color.BLACK,
          outlineWidth: 2,
          style: window.Cesium.LabelStyle.FILL_AND_OUTLINE,
          verticalOrigin: window.Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new window.Cesium.Cartesian2(0, -40),
          show: true
        }
      });

      // Try to load 3D model, fallback to point if fails
      try {
        entity.model = {
          uri: 'http://192.168.6.225:8082/traffic-light.glb',
          scale: 0.6,
          minimumPixelSize: 16
        };
        
        entity.model.readyPromise.then(() => {
          entity.point.show = false; // Hide point when model loads
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
          entity.label.fillColor = isGreen ? window.Cesium.Color.LIME : window.Cesium.Color.WHITE;
          entity.point.color = isGreen ? window.Cesium.Color.GREEN : window.Cesium.Color.RED;
          
          if (isGreen && !wasGreen) {
            updateLightStatus(1, -1);
          } else if (!isGreen && wasGreen) {
            updateLightStatus(-1, 1);
          }
          
          const nextCycleTime = isGreen ? 
            (8000 + Math.random() * 4000) : 
            (5000 + Math.random() * 3000);
          
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

  // Create accident marker
  const createAccident = (viewer, position) => {
    try {
      if (!viewer || viewer.isDestroyed() || !showTrafficSystem) return;
      if (accidentCount >= config.maxAccidents) return;
      if (!validateCoordinate(position)) return;

      const entity = viewer.entities.add({
        name: `Accident-${Date.now()}`,
        position: window.Cesium.Cartesian3.fromDegrees(position[0], position[1], 3),
        ellipse: {
          semiMinorAxis: 15,
          semiMajorAxis: 15,
          material: window.Cesium.Color.RED.withAlpha(0.6),
          heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND
        },
        point: {
          pixelSize: 16,
          color: window.Cesium.Color.ORANGE,
          outlineColor: window.Cesium.Color.RED,
          outlineWidth: 3,
          heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND,
          show: true
        },
        label: {
          text: '⚠️ HAZARD',
          font: '14px sans-serif',
          fillColor: window.Cesium.Color.RED,
          outlineColor: window.Cesium.Color.WHITE,
          outlineWidth: 2,
          style: window.Cesium.LabelStyle.FILL_AND_OUTLINE,
          verticalOrigin: window.Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new window.Cesium.Cartesian2(0, -30),
          show: true
        }
      });

      setActiveAccidents(prev => [...prev, { position, entity }]);
      updateAccidentCount(1);

      setTimeout(() => {
        try {
          if (viewer && !viewer.isDestroyed() && viewer.entities.contains(entity)) {
            viewer.entities.remove(entity);
            setActiveAccidents(prev => prev.filter(a => a.entity !== entity));
            updateAccidentCount(-1);
          }
        } catch (error) {
          console.warn("Error removing accident:", error);
        }
      }, 25000);

    } catch (error) {
      console.error("Error creating accident:", error);
    }
  };

  // Create realistic Google Maps style heatmap
  const createRealisticHeatmap = (crowdData) => {
    try {
      if (!viewerRef.current || !crowdData) {
        console.warn("Cannot create heatmap: missing viewer or data");
        return;
      }

      // Clear existing heatmap entities first
      heatmapEntitiesRef.current.forEach(entity => {
        if (viewerRef.current && viewerRef.current.entities.contains(entity)) {
          viewerRef.current.entities.remove(entity);
        }
      });
      heatmapEntitiesRef.current = [];

      console.log("Creating realistic heatmap with", crowdData.length, "data points");

      // Create gradient heatmap circles like Google Maps
      crowdData.forEach((camera, index) => {
        const { longitude, latitude, crowdCount } = camera;
        const intensity = Math.min(crowdCount / 100, 1);
        
        // Create multiple concentric circles for gradient effect
        const radiusSteps = [20, 22, 15, 23, 25];
        const alphaSteps = [0.15, 0.25, 0.4, 0.6, 0.8];
        
        radiusSteps.forEach((radius, stepIndex) => {
          // Color based on intensity: green -> yellow -> orange -> red
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
              name: `Heatmap-${index}-${stepIndex}`,
              position: window.Cesium.Cartesian3.fromDegrees(longitude, latitude, 0.5),
              ellipse: {
                semiMinorAxis: radius * (0.5 + intensity * 0.5),
                semiMajorAxis: radius * (0.5 + intensity * 0.5),
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

        // Add center point with crowd count for high-density areas
        if (crowdCount > 30) {
          try {
            const centerEntity = viewerRef.current.entities.add({
              name: `HeatmapCenter-${index}`,
              position: window.Cesium.Cartesian3.fromDegrees(longitude, latitude, 2),
              point: {
                pixelSize: 8 + intensity * 12,
                color: window.Cesium.Color.WHITE,
                outlineColor: window.Cesium.Color.BLACK,
                outlineWidth: 2,
                heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND,
                show: true
              },
              label: {
                text: crowdCount.toString(),
                font: '14px bold sans-serif',
                fillColor: window.Cesium.Color.WHITE,
                outlineColor: window.Cesium.Color.BLACK,
                outlineWidth: 2,
                style: window.Cesium.LabelStyle.FILL_AND_OUTLINE,
                pixelOffset: new window.Cesium.Cartesian2(0, -25),
                scale: 0.9,
                show: true
              }
            });

            heatmapEntitiesRef.current.push(centerEntity);
          } catch (labelError) {
            console.warn("Failed to create heatmap label:", labelError);
          }
        }
      });

      console.log("Realistic heatmap created successfully with", heatmapEntitiesRef.current.length, "entities");
      
      // Update zoom listener to handle label visibility
      if (viewerRef.current && viewerRef.current.camera) {
        const updateLabels = () => {
          const cameraHeight = viewerRef.current.camera.positionCartographic.height;
          heatmapEntitiesRef.current.forEach(entity => {
            if (entity.label && entity.name.includes('HeatmapCenter')) {
              entity.label.show = cameraHeight < 3000;
            }
          });
        };
        
        // Initial update
        updateLabels();
        
        // Add to camera change listener
        viewerRef.current.camera.changed.addEventListener(updateLabels);
      }
      
    } catch (error) {
      console.error("Error creating realistic heatmap:", error);
    }
  };

  // Load 3D tileset
  const load3DTileset = async () => {
    try {
      if (!window.Cesium || !viewerRef.current) return null;
      
      console.log("Loading 3D tileset...");
      const tileset = await window.Cesium.Cesium3DTileset.fromIonAssetId(3048665);
      
      tileset.maximumScreenSpaceError = 2;
      tileset.show = show3DTileset;
      
      viewerRef.current.scene.primitives.add(tileset);
      tilesetRef.current = tileset;

      const extras = tileset.asset.extras;
      if (extras?.ion?.defaultStyle) {
        tileset.style = new window.Cesium.Cesium3DTileStyle(extras.ion.defaultStyle);
      }

      console.log("3D tileset loaded successfully");
      return tileset;
    } catch (error) {
      console.error('Error loading 3D tileset:', error);
      return null;
    }
  };

  // Load GeoJSON data
  const loadGeoJsonData = async () => {
    try {
      if (!window.Cesium || !viewerRef.current) return null;
      
      console.log("Loading GeoJSON data...");
      const response = await fetch('http://192.168.6.225:8081/api/geojson');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const geojsonData = await response.json();
      
      const dataSource = await window.Cesium.GeoJsonDataSource.load(geojsonData, {
        clampToGround: false,
        stroke: window.Cesium.Color.BLUE,
        fill: window.Cesium.Color.BLUE.withAlpha(0.5),
        strokeWidth: 3
      });

      dataSource.show = showGeoJson;
      geoJsonDataSourceRef.current = dataSource;
      viewerRef.current.dataSources.add(dataSource);

      const entities = dataSource.entities.values;
      const buildingLabels = [];

      entities.forEach(entity => {
        if (entity.polygon) {
          const buildingName = entity.properties?.['@id']?.getValue() || 'Unknown Building';
          const positions = entity.polygon.hierarchy.getValue(window.Cesium.JulianDate.now()).positions;
          
          if (positions && positions.length > 0) {
            const center = window.Cesium.Cartesian3.fromDegrees(
              window.Cesium.Math.toDegrees(window.Cesium.Cartographic.fromCartesian(positions[0]).longitude),
              window.Cesium.Math.toDegrees(window.Cesium.Cartographic.fromCartesian(positions[0]).latitude),
              0
            );

            const labelEntity = viewerRef.current.entities.add({
              position: center,
              label: {
                text: buildingName,
                font: '14px sans-serif',
                fillColor: window.Cesium.Color.WHITE,
                scale: 1.5,
                pixelOffset: new window.Cesium.Cartesian2(0, -30),
                show: false
              }
            });

            buildingLabels.push(labelEntity);
          }

          const height = entity.properties?.height?.getValue() || 10;
          entity.polygon.extrudedHeight = height;
          entity.polygon.material = window.Cesium.Color.BLUE.withAlpha(0.6);
          entity.polygon.outline = true;
          entity.polygon.outlineColor = window.Cesium.Color.BLUE;
        }

        if (entity.position && entity.properties?.video) {
          const videoUrl = entity.properties.video.getValue();
          entity.description = `
            <h3>${entity.properties['@id']?.getValue() || 'Video'}</h3>
            <video width="320" height="240" controls>
              <source src="${videoUrl}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          `;
        }
      });

      buildingLabelsRef.current = buildingLabels;
      console.log("GeoJSON data loaded successfully");
      return dataSource;
    } catch (error) {
      console.error('Error loading GeoJSON:', error);
      return null;
    }
  };

  // Load roads data
  const loadRoadsData = async () => {
    try {
      if (!window.Cesium || !viewerRef.current) return null;
      
      console.log("Loading roads data...");
      const response = await fetch('http://192.168.6.225:8081/api/roads');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const roadsData = await response.json();
      
      const roadsDataSource = await window.Cesium.GeoJsonDataSource.load(roadsData, {
        clampToGround: true,
        stroke: window.Cesium.Color.YELLOW,
        strokeWidth: 3
      });

      const entities = roadsDataSource.entities.values;
      entities.forEach(entity => {
        if (entity.polyline) {
          const highwayType = entity.properties?.highway?.getValue();
          
          let color = window.Cesium.Color.GRAY;
          let width = 3;
          
          switch(highwayType) {
            case 'motorway':
              color = window.Cesium.Color.RED;
              width = 5;
              break;
            case 'trunk':
              color = window.Cesium.Color.ORANGE;
              width = 4.5;
              break;
            case 'primary':
              color = window.Cesium.Color.YELLOW;
              width = 4;
              break;
            case 'secondary':
              color = window.Cesium.Color.GREEN;
              width = 3.5;
              break;
            case 'tertiary':
              color = window.Cesium.Color.BLUE;
              width = 3;
              break;
            case 'residential':
              color = window.Cesium.Color.WHITE;
              width = 2;
              break;
            default:
              color = window.Cesium.Color.GRAY;
              width = 2;
          }
          
          entity.polyline.material = color;
          entity.polyline.width = width;
        }
      });

      roadsDataSource.show = showRoads;
      roadsDataSourceRef.current = roadsDataSource;
      viewerRef.current.dataSources.add(roadsDataSource);
      
      // Extract road coordinates for traffic system
      const roadCoordinates = extractRoadPaths(roadsData);
      setRoadData(roadCoordinates);
      
      console.log("Roads data loaded successfully");
      return roadsDataSource;
    } catch (error) {
      console.error('Error loading roads data:', error);
      return null;
    }
  };

  // Load heatmap data
  const loadHeatmapData = async () => {
    try {
      if (!window.Cesium || !viewerRef.current) return null;
      
      console.log("Loading heatmap data...");
      
      // Try to fetch from API, if fails use mock data
      let crowdData;
      try {
        const response = await fetch('http://192.168.6.225:8081/api/crowd-data');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        crowdData = await response.json();
      } catch (fetchError) {
        console.warn("Failed to fetch crowd data from API, using mock data:", fetchError);
        // Generate mock crowd data for demonstration
        crowdData = [
          { longitude: -74.006, latitude: 40.7128, crowdCount: 5, id: 1 }, // NYC
          { longitude: -74.007, latitude: 40.7130, crowdCount: 1, id: 2 },
          { longitude: -74.008, latitude: 40.7125, crowdCount: 45, id: 3 },
          { longitude: -74.005, latitude: 40.7135, crowdCount: 95, id: 4 },
          { longitude: -74.009, latitude: 40.7120, crowdCount: 5, id: 5 },
          { longitude: -74.004, latitude: 40.7140, crowdCount: 25, id: 6 },
          { longitude: -74.010, latitude: 40.7115, crowdCount: 15, id: 7 },
          { longitude: -74.003, latitude: 40.7145, crowdCount: 1, id: 8 }
        ];
      }
      
      // Store crowd data for toggle functionality
      window.crowdDataCache = crowdData;
      
      // Create realistic heatmap if should be shown
      if (showHeatmap) {
        createRealisticHeatmap(crowdData);
      }
      
      console.log("Heatmap data loaded successfully with", crowdData.length, "points");
      return crowdData;
    } catch (error) {
      console.error('Error loading heatmap data:', error);
      return null;
    }
  };

  // Setup traffic spawning
  const setupTrafficSpawning = () => {
    if (!roadData || !showTrafficSystem || !viewerRef.current) return;

    console.log("Setting up traffic spawning...");
    
    // Clear existing intervals
    Object.values(trafficIntervalsRef.current).forEach(interval => {
      if (interval) clearInterval(interval);
    });
    trafficIntervalsRef.current = {};

    // Add traffic lights at strategic points
    const allRoads = [...roadData.mainRoads, ...roadData.sideRoads];
    let lightCount = 0;
    
    allRoads.forEach(road => {
      if (lightCount >= config.maxTrafficLights) return;
      
      const positions = [0, Math.floor(road.length / 2), road.length - 1];
      positions.forEach(index => {
        if (lightCount < config.maxTrafficLights && road[index]) {
          createTrafficLight(viewerRef.current, road[index]);
          lightCount++;
        }
      });
    });

    // Set up ambulance spawning
    trafficIntervalsRef.current.ambulances = setInterval(() => {
      try {
        if (!viewerRef.current || viewerRef.current.isDestroyed() || !showTrafficSystem) return;
        
        if (vehicleCount < config.maxVehicles && roadData) {
          const useMainRoad = Math.random() < 0.8 && roadData.mainRoads.length > 0;
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

    // Set up dot vehicle spawning
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

    // Set up accident generation
    trafficIntervalsRef.current.accidents = setInterval(() => {
      try {
        if (!viewerRef.current || viewerRef.current.isDestroyed() || !showTrafficSystem) return;
        
        if (Math.random() < 0.3 && accidentCount < config.maxAccidents && roadData) {
          const allRoads = [...roadData.mainRoads, ...roadData.sideRoads];
          if (allRoads.length > 0) {
            const randomRoad = allRoads[Math.floor(Math.random() * allRoads.length)];
            const randomIndex = Math.floor(Math.random() * randomRoad.length);
            createAccident(viewerRef.current, randomRoad[randomIndex]);
          }
        }
      } catch (error) {
        console.error("Error in accident generation:", error);
      }
    }, 15000);

    console.log("Traffic spawning setup complete");
  };

  // Setup zoom listener
  const setupZoomListener = useCallback(() => {
    if (!viewerRef.current) return;
    
    const checkZoomLevel = () => {
      if (!viewerRef.current) return;
      const cameraHeight = viewerRef.current.camera.positionCartographic.height;
      
      buildingLabelsRef.current.forEach(labelEntity => {
        if (labelEntity && labelEntity.label) {
          labelEntity.label.show = cameraHeight < zoomThreshold && showGeoJson;
        }
      });
      
      // Update heatmap labels based on zoom
      heatmapEntitiesRef.current.forEach(entity => {
        if (entity.label && entity.name.includes('HeatmapCenter')) {
          entity.label.show = showHeatmap && cameraHeight < 2000;
        }
      });
    };

    viewerRef.current.camera.changed.addEventListener(checkZoomLevel);
    checkZoomLevel();
  }, [showHeatmap, showGeoJson]);

  // Handle map click
  const handleMapClick = useCallback(async (movement) => {
    if (!viewerRef.current) return;

    const pickedObject = viewerRef.current.scene.pick(movement.position);
    if (pickedObject && pickedObject.id && pickedObject.id.properties) {
      if (pickedObject.id.properties.video) {
        const videoUrl = pickedObject.id.properties.video.getValue();
        const videoTitle = pickedObject.id.properties['@id']?.getValue() || 'Video';
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
      const cartographic = window.Cesium.Cartographic.fromCartesian(position);
      const longitude = window.Cesium.Math.toDegrees(cartographic.longitude);
      const latitude = window.Cesium.Math.toDegrees(cartographic.latitude);

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

      const dataSource = await window.Cesium.GeoJsonDataSource.load(newFeature, {
        clampToGround: true,
        markerColor: window.Cesium.Color.RED,
        markerSymbol: '?'
      });
      
      viewerRef.current.dataSources.add(dataSource);
      await viewerRef.current.zoomTo(dataSource);
      
      setStatus(`Added new anchor point: ${anchorName}`);
    } catch (error) {
      console.error("Error adding anchor point:", error);
      setStatus('Failed to add anchor point');
    }
  }, []);

  // Toggle functions with proper state management
  const toggleHeatmap = useCallback(async () => {
    const newShowState = !showHeatmap;
    setShowHeatmap(newShowState);
    
    try {
      if (newShowState) {
        // Show heatmap
        console.log("Showing heatmap...");
        
        // Use cached data if available, otherwise load fresh
        let crowdData = window.crowdDataCache;
        if (!crowdData) {
          await loadHeatmapData();
          crowdData = window.crowdDataCache;
        }
        
        if (crowdData) {
          createRealisticHeatmap(crowdData);
          setStatus("Crowd Heatmap activated - Showing real-time density");
        } else {
          setStatus("Failed to load heatmap data");
        }
      } else {
        // Hide heatmap
        console.log("Hiding heatmap...");
        heatmapEntitiesRef.current.forEach(entity => {
          if (viewerRef.current && viewerRef.current.entities.contains(entity)) {
            viewerRef.current.entities.remove(entity);
          }
        });
        heatmapEntitiesRef.current = [];
        setStatus("Crowd Heatmap deactivated");
      }
    } catch (error) {
      console.error("Error toggling heatmap:", error);
      setStatus("Error toggling heatmap");
    }
    
    console.log(`Heatmap toggle completed. New state: ${newShowState}`);
  }, [showHeatmap]);

  const toggleRoads = useCallback(() => {
    const newShowState = !showRoads;
    setShowRoads(newShowState);
    
    if (roadsDataSourceRef.current) {
      roadsDataSourceRef.current.show = newShowState;
      console.log(`Roads visibility set to: ${newShowState}`);
    }
    
    setStatus(`Roads are now ${newShowState ? 'visible' : 'hidden'}`);
  }, [showRoads]);

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
            entity.name.includes('Accident')
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
    
    setStatus(`Traffic System is now ${newShowState ? 'active' : 'inactive'}`);
  }, [showTrafficSystem, roadData]);

  const toggleTileset = useCallback(() => {
    const newShowState = !show3DTileset;
    setShow3DTileset(newShowState);
    
    if (tilesetRef.current) {
      tilesetRef.current.show = newShowState;
      console.log(`3D Tileset visibility set to: ${newShowState}`);
    }
    
    setStatus(`3D Buildings are now ${newShowState ? 'visible' : 'hidden'}`);
  }, [show3DTileset]);

  const toggleGeoJson = useCallback(() => {
    const newShowState = !showGeoJson;
    setShowGeoJson(newShowState);
    
    if (geoJsonDataSourceRef.current) {
      geoJsonDataSourceRef.current.show = newShowState;
      console.log(`GeoJSON visibility set to: ${newShowState}`);
      
      // Toggle building labels visibility
      buildingLabelsRef.current.forEach(label => {
        if (label && label.label) {
          label.show = newShowState;
        }
      });
    }
    
    setStatus(`GeoJSON data is now ${newShowState ? 'visible' : 'hidden'}`);
  }, [showGeoJson]);

  // Initialize Cesium - Single instance only
  useEffect(() => {
    let isMounted = true;

    const loadCesium = () => {
      return new Promise((resolve, reject) => {
        if (window.Cesium) {
          resolve();
          return;
        }

        // Prevent multiple script loading
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

        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'https://cesium.com/downloads/cesiumjs/releases/1.117/Build/Cesium/Widgets/widgets.css';
        document.head.appendChild(cssLink);

        const script = document.createElement('script');
        script.src = 'https://cesium.com/downloads/cesiumjs/releases/1.117/Build/Cesium/Cesium.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const initializeCesium = async () => {
      try {
        if (!isMounted) return;
        
        setStatus('Loading Cesium...');
        await loadCesium();
        
        if (!isMounted) return;

        window.Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YjhlMmVkNC1hYWVjLTQxYWEtOGZhYS1iOGQyNDUxY2ZlMTUiLCJpZCI6MjY0Nzg3LCJpYXQiOjE3MzUxMTAzMzV9.tdJk1ppDaw9AEy9bFB6RBU9T3H0-xOlIqVlrjDBJGQo";
        
        // Destroy existing viewer if it exists
        if (viewerRef.current && !viewerRef.current.isDestroyed()) {
          viewerRef.current.destroy();
        }

        if (!isMounted || !cesiumContainerRef.current) return;
        
        setStatus('Creating viewer...');
        const viewer = new window.Cesium.Viewer(cesiumContainerRef.current, {
          shouldAnimate: true,
          timeline: true,
          animation: true,
          baseLayerPicker: false,
          fullscreenButton: true,
          geocoder: false,
          homeButton: true,
          sceneModePicker: false,
          navigationHelpButton: false
        });

        if (!isMounted) {
          viewer.destroy();
          return;
        }

        viewerRef.current = viewer;
        setStatus('Loading data sources...');

        // Load all data sources sequentially to avoid conflicts
        const tileset = await load3DTileset();
        if (!isMounted) return;
        
        const geoJson = await loadGeoJsonData();
        if (!isMounted) return;
        
        const roads = await loadRoadsData();
        if (!isMounted) return;
        
        // Load heatmap data but don't show initially
        const heatmap = await loadHeatmapData();
        if (!isMounted) return;

        // Setup zoom listener after all data is loaded
        setupZoomListener();

        // Zoom to tileset if available
        if (tileset) {
          await viewer.zoomTo(tileset);
        }

        if (!isMounted) return;

        setStatus('System ready - Click to add anchors');
        setIsLoaded(true);
        
        console.log("Cesium initialization complete - Single instance");

      } catch (error) {
        console.error("Failed to initialize Cesium:", error);
        if (isMounted) {
          setStatus('Failed to initialize system');
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
    <div className="relative w-full h-screen bg-black overflow-hidden">
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
        <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gray-900 bg-opacity-95 p-8 rounded-lg text-center border border-blue-500">
            <div className="text-white text-2xl font-bold mb-4">
              🌍 Loading Integrated Traffic System
            </div>
            <div className="text-blue-300 mb-4 font-medium">
              {status}
            </div>
            <div className="mt-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </div>
      )}

      {/* Controls Panel */}
      <div className="absolute top-4 right-4 bg-gray-900 bg-opacity-95 text-white font-sans p-4 rounded-xl z-[1000] max-w-xs shadow-2xl border border-gray-600">
        <h3 className="text-lg font-bold mb-4 text-center border-b border-gray-600 pb-2">
          🎛️ System Controls
        </h3>
        
        <div className="space-y-2">
          <button 
            onClick={toggleTileset}
            className={`w-full p-3 rounded-lg font-semibold transition-all text-sm ${
              show3DTileset 
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            🏢 {show3DTileset ? 'Hide' : 'Show'} 3D Buildings
          </button>
          
          <button 
            onClick={toggleGeoJson}
            className={`w-full p-3 rounded-lg font-semibold transition-all text-sm ${
              showGeoJson 
                ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            📍 {showGeoJson ? 'Hide' : 'Show'} GeoJSON Data
          </button>
          
          <button 
            onClick={toggleRoads}
            className={`w-full p-3 rounded-lg font-semibold transition-all text-sm ${
              showRoads 
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
            🔥 {showHeatmap ? 'Hide' : 'Show'} Crowd Heatmap
          </button>
          
          <button 
            onClick={toggleTrafficSystem}
            className={`w-full p-3 rounded-lg font-semibold transition-all text-sm ${
              showTrafficSystem 
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            🚨 {showTrafficSystem ? 'Disable' : 'Enable'} Traffic System
          </button>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-600">
          <div className="text-xs text-gray-400">
            <div className="font-semibold text-white mb-1">Status:</div>
            <div className="text-green-400">{status}</div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Traffic Dashboard */}
      {showTrafficSystem && (
        <div className="absolute top-4 left-4 bg-gray-900 bg-opacity-95 text-white font-sans p-6 rounded-xl z-[1000] max-w-sm shadow-2xl border border-gray-600">
          <h3 className="text-xl font-bold mt-0 mb-6 text-center border-b border-gray-600 pb-3">
            🚑 Emergency Traffic Control
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-800 to-blue-900 p-4 rounded-lg border border-blue-600">
              <div className="text-blue-300 text-sm font-semibold">Ambulances</div>
              <div className="text-3xl font-bold">{vehicleCount}</div>
              <div className="text-xs text-blue-200">🚑 Emergency Vehicles</div>
            </div>
            <div className="bg-gradient-to-br from-purple-800 to-purple-900 p-4 rounded-lg border border-purple-600">
              <div className="text-purple-300 text-sm font-semibold">Vehicles</div>
              <div className="text-3xl font-bold">{dotVehicleCount}</div>
              <div className="text-xs text-purple-200">🚗 Regular Traffic</div>
            </div>
            <div className="bg-gradient-to-br from-green-800 to-green-900 p-4 rounded-lg border border-green-600">
              <div className="text-green-300 text-sm font-semibold">Green Lights</div>
              <div className="text-3xl font-bold">{greenLightCount}</div>
              <div className="text-xs text-green-200">🟢 Go Signal</div>
            </div>
            <div className="bg-gradient-to-br from-red-800 to-red-900 p-4 rounded-lg border border-red-600">
              <div className="text-red-300 text-sm font-semibold">Red Lights</div>
              <div className="text-3xl font-bold">{redLightCount}</div>
              <div className="text-xs text-red-200">🔴 Stop Signal</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-orange-800 to-orange-900 p-4 rounded-lg border border-orange-600">
              <div className="text-orange-300 text-sm font-semibold">Accidents</div>
              <div className="text-3xl font-bold">{accidentCount}</div>
              <div className="text-xs text-orange-200">⚠️ Active Incidents</div>
            </div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-600">
              <div className="text-gray-300 text-sm font-semibold">Total Traffic</div>
              <div className="text-3xl font-bold">{vehicleCount + dotVehicleCount}</div>
              <div className="text-xs text-gray-200">🚦 All Vehicles</div>
            </div>
          </div>
          
          <div className="border-t border-gray-600 pt-4">
            <h4 className="text-lg font-bold mb-3 text-red-400">🚨 Emergency Incidents</h4>
            <div className="max-h-40 overflow-y-auto bg-gray-800 bg-opacity-50 rounded-lg p-3 border border-gray-700">
              {activeAccidents.length === 0 ? (
                <div className="text-green-400 text-center py-3">
                  ✅ All Clear - No Active Incidents
                </div>
              ) : (
                activeAccidents.map((acc, index) => (
                  <div key={index} className="bg-red-900 bg-opacity-40 p-3 rounded mb-2 border-l-4 border-red-500">
                    <div className="font-semibold text-red-300">🚨 Incident #{index + 1}</div>
                    <div className="text-sm text-gray-300">Location: Road Network</div>
                    <div className="text-xs text-red-400 mt-1">⏱️ Emergency Response Active</div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-600">
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
              <div>
                <div className="font-semibold text-white">System Status</div>
                <div>{isLoaded ? '🟢 Online' : '🟡 Loading'}</div>
              </div>
              <div>
                <div className="font-semibold text-white">Data Source</div>
                <div>{roadData ? '🗺️ Live Roads' : '⏳ Loading'}</div>
              </div>
              <div>
                <div className="font-semibold text-white">Traffic Types</div>
                <div>🚑 Emergency + 🚗 Civilian</div>
              </div>
              <div>
                <div className="font-semibold text-white">Capacity</div>
                <div>{config.maxVehicles + config.maxDotVehicles} vehicles</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Anchor Instructions */}
      <div className="absolute bottom-4 left-4 bg-gray-900 bg-opacity-90 text-white p-4 rounded-lg z-[1000] max-w-[300px] border border-gray-600">
        <div className="text-sm">
          <div className="font-semibold mb-2">📍 Interactive Features:</div>
          <div className="text-xs text-gray-300">
            • Click anywhere to add anchor points<br/>
            • Click on video markers to play content<br/>
            • Use control panel to toggle layers<br/>
            • Zoom in/out for detailed views<br/>
            • Traffic system spawns vehicles automatically<br/>
            • Heatmap shows realistic crowd density
          </div>
        </div>
      </div>
      
      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[1002]">
          <div className="bg-white p-6 rounded-lg max-w-[90%] max-h-[90%] overflow-auto">
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

export default IntegratedTrafficSystem;