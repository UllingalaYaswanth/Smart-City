import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CloudRain, Cloudy, Eye, EyeOff, X, Droplets, Wind, Thermometer, ChevronDown, ChevronUp, MapPin, RefreshCw, AlertCircle } from 'lucide-react';

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
  const roadHeatmapEntitiesRef = useRef([]);
  const cctvEntitiesRef = useRef([]);
  
  // Weather system refs
  const weatherLayersRef = useRef({});
  const particleSystemsRef = useRef([]);
  
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
  const [showRoadHeatmap, setShowRoadHeatmap] = useState(false);
  const [showRoads, setShowRoads] = useState(true);
  const [showTrafficSystem, setShowTrafficSystem] = useState(true);
  const [showBuildings, setShowBuildings] = useState(true);
  const [showKML, setShowKML] = useState(true);
  
  // Weather system state
  const [showWeatherSystem, setShowWeatherSystem] = useState(false);
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [activeWeatherLayer, setActiveWeatherLayer] = useState(null);
  const [weatherStatus, setWeatherStatus] = useState({});

  // Air Quality Monitor state
  const [showAirQuality, setShowAirQuality] = useState(false);
  const [aqiData, setAqiData] = useState(null);
  const [loadingAQI, setLoadingAQI] = useState(false);
  const [aqiError, setAqiError] = useState(null);
  const [showPollutants, setShowPollutants] = useState(false);
  const [lastAQIUpdate, setLastAQIUpdate] = useState(null);

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
  const OPEN_WEATHER_MAP_API_KEY = '5e820f5f55643db715ba8679d2eae8a9';

  // Default location - Al Marjan Island coordinates
  const defaultLocation = {
    lat: 25.6720,
    lng: 55.7475,
    name: "Al Marjan Island"
  };

  // Weather layer configuration
  const weatherLayers = {
    precipitation: {
      name: 'Rain',
      url: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${OPEN_WEATHER_MAP_API_KEY}`,
      color: 'rgba(0, 150, 255, 0.7)',
      particleColor: '#333333',
      icon: <CloudRain size={20} />,
      unit: 'mm'
    },
    clouds: {
      name: 'Clouds',
      url: `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${OPEN_WEATHER_MAP_API_KEY}`,
      color: 'rgba(200, 200, 200, 0.7)',
      particleColor: '#ffffff',
      icon: <Cloudy size={20} />,
      unit: '%'
    }
  };

  // Calculate bounds for Al Marjan Island
  const BOUNDS = {
    west: 55.732803,
    south: 25.660526,
    east: 55.762157,
    north: 25.684352,
    centerLat: 25.6720,
    centerLon: 55.7475
  };

  // Air Quality Functions
  const fetchAQIData = useCallback(async () => {
    setLoadingAQI(true);
    setAqiError(null);
    
    try {
      // Try to call backend API first
      const backendUrl = 'http://192.168.6.225:8081/api/air-quality';
      
      try {
        const response = await fetch(`${backendUrl}?lat=${defaultLocation.lat}&lng=${defaultLocation.lng}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Real-time Air Quality Data from backend:', data);
          
          if (data && data.stations && data.stations.length > 0) {
            setAqiData(data);
            setLastAQIUpdate(new Date().toLocaleTimeString());
            setAqiError(null);
            return;
          }
        }
      } catch (backendError) {
        console.log('Backend API not available, using simulated data');
      }
      
      // If backend fails, generate realistic simulated data
      throw new Error('Backend API not available');
      
    } catch (apiError) {
      console.log('Using simulated real-time data');
      
      // Generate realistic demo data that simulates real-time updates
      const generateRealisticData = () => {
        const baseValues = {
          CO: 0.158,
          NO2: 6.732,
          OZONE: 61.107,
          PM10: 110.264,
          PM25: 35.122,
          SO2: 3.049
        };
        
        // Add time-based and random variations to simulate real data changes
        const timeOfDay = new Date().getHours();
        const isRushHour = (timeOfDay >= 7 && timeOfDay <= 9) || (timeOfDay >= 17 && timeOfDay <= 19);
        const rushHourMultiplier = isRushHour ? 1.3 : 1.0;
        
        // Add slight random variations (±15% variation)
        const variation = () => 0.85 + Math.random() * 0.3;
        
        const currentData = {
          CO: baseValues.CO * variation() * rushHourMultiplier,
          NO2: baseValues.NO2 * variation() * rushHourMultiplier,
          OZONE: baseValues.OZONE * variation(),
          PM10: baseValues.PM10 * variation() * (isRushHour ? 1.2 : 1.0),
          PM25: baseValues.PM25 * variation() * (isRushHour ? 1.2 : 1.0),
          SO2: baseValues.SO2 * variation()
        };
        
        // Calculate AQI based on PM2.5 and PM10 (simplified US EPA calculation)
        const calculateAQI = (concentration, pollutant) => {
          const breakpoints = {
            PM25: [[0, 12], [12.1, 35.4], [35.5, 55.4], [55.5, 150.4], [150.5, 250.4], [250.5, 350.4]],
            PM10: [[0, 54], [55, 154], [155, 254], [255, 354], [355, 424], [425, 504]]
          };
          
          const aqiRanges = [[0, 50], [51, 100], [101, 150], [151, 200], [201, 300], [301, 400]];
          
          const ranges = breakpoints[pollutant];
          if (!ranges) return 50;
          
          for (let i = 0; i < ranges.length; i++) {
            if (concentration >= ranges[i][0] && concentration <= ranges[i][1]) {
              const [cLow, cHigh] = ranges[i];
              const [aqiLow, aqiHigh] = aqiRanges[i];
              return Math.round(((aqiHigh - aqiLow) / (cHigh - cLow)) * (concentration - cLow) + aqiLow);
            }
          }
          return 400; // Hazardous
        };
        
        const pm25_aqi = calculateAQI(currentData.PM25, 'PM25');
        const pm10_aqi = calculateAQI(currentData.PM10, 'PM10');
        const calculatedAQI = Math.max(pm25_aqi, pm10_aqi);
        
        const getCategory = (aqi) => {
          if (aqi <= 50) return 'Good';
          if (aqi <= 100) return 'Moderate';
          if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
          if (aqi <= 200) return 'Unhealthy';
          if (aqi <= 300) return 'Very Unhealthy';
          return 'Hazardous';
        };
        
        return {
          message: 'success',
          stations: [
            {
              ...currentData,
              updatedAt: new Date().toISOString(),
              AQI: calculatedAQI,
              aqiInfo: {
                pollutant: calculatedAQI === pm25_aqi ? 'PM2.5' : 'PM10',
                concentration: calculatedAQI === pm25_aqi ? currentData.PM25 : currentData.PM10,
                category: getCategory(calculatedAQI)
              },
              city: 'Al Marjan Island',
              countryCode: 'AE',
              division: 'Ras Al Khaimah',
              lat: 25.6720,
              lng: 55.7475,
              placeName: 'Air Quality Monitor Station',
              postalCode: '73408',
              state: 'Ras Al Khaimah'
            }
          ]
        };
      };
      
      const simulatedData = generateRealisticData();
      setAqiData(simulatedData);
      setLastAQIUpdate(new Date().toLocaleTimeString());
      setAqiError('Offline Mode - Connect your backend API for real-time data');
    } finally {
      setLoadingAQI(false);
    }
  }, []);

  const getAQILevel = (aqi) => {
    if (aqi <= 50) return { level: 'Good', color: 'bg-green-500', textColor: 'text-green-600' };
    if (aqi <= 100) return { level: 'Moderate', color: 'bg-yellow-500', textColor: 'text-yellow-600' };
    if (aqi <= 150) return { level: 'Unhealthy for Sensitive Groups', color: 'bg-orange-500', textColor: 'text-orange-600' };
    if (aqi <= 200) return { level: 'Unhealthy', color: 'bg-red-500', textColor: 'text-red-600' };
    if (aqi <= 300) return { level: 'Very Unhealthy', color: 'bg-purple-500', textColor: 'text-purple-600' };
    return { level: 'Hazardous', color: 'bg-red-800', textColor: 'text-red-800' };
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const toggleAirQuality = useCallback(async () => {
    const newShowState = !showAirQuality;
    setShowAirQuality(newShowState);
    setShowTrafficSystem(!newShowState);
    if (newShowState) {
      await fetchAQIData();
      setStatus("Air Quality Monitor activated - Real-time environmental data");
    } else {
      setAqiData(null);
      setStatus("Air Quality Monitor deactivated");
    }
  }, [showAirQuality, fetchAQIData]);

  // Auto-refresh AQI data
  useEffect(() => {
    if (!showAirQuality) return;
    
    const aqiInterval = setInterval(fetchAQIData, 5 * 60 * 1000); // Refresh every 5 minutes
    
    return () => clearInterval(aqiInterval);
  }, [showAirQuality, fetchAQIData]);

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

  // Weather Functions
  const fetchWeatherData = useCallback(async (lat, lon) => {
    setIsLoadingWeather(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_MAP_API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Weather data not available');
      }
      
      const data = await response.json();
      
      const isInAllowedArea = lat >= 25.65 && lat <= 25.69 && lon >= 55.73 && lon <= 55.77;
      
      if (!isInAllowedArea) {
        return {
          city: 'Unknown Area',
          lat: lat.toFixed(6),
          lon: lon.toFixed(6),
          temperature: 'N/A',
          description: 'Access Restricted',
          windSpeed: 'N/A',
          windDirection: 'N/A',
          humidity: 'N/A',
          pressure: 'N/A',
          visibility: 'N/A',
          rain: 0,
          snow: 0,
          clouds: 'N/A',
          uvIndex: 'N/A',
          feelsLike: 'N/A'
        };
      }
      
      return {
        city: data.name || 'Al Marjan Island',
        lat: lat.toFixed(6),
        lon: lon.toFixed(6),
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        windSpeed: Math.round(data.wind.speed * 3.6),
        windDirection: data.wind.deg || 0,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        visibility: data.visibility ? Math.round(data.visibility / 1000) : 'N/A',
        rain: data.rain ? (data.rain['1h'] || data.rain['3h'] || 0) : 0,
        snow: data.snow ? (data.snow['1h'] || data.snow['3h'] || 0) : 0,
        clouds: data.clouds.all,
        uvIndex: 'N/A',
        feelsLike: Math.round(data.main.feels_like)
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return {
        city: 'Al Marjan Island',
        lat: lat.toFixed(6),
        lon: lon.toFixed(6),
        temperature: 'N/A',
        description: 'Data unavailable',
        windSpeed: 'N/A',
        windDirection: 'N/A',
        humidity: 'N/A',
        pressure: 'N/A',
        visibility: 'N/A',
        rain: 0,
        snow: 0,
        clouds: 'N/A',
        uvIndex: 'N/A',
        feelsLike: 'N/A'
      };
    } finally {
      setIsLoadingWeather(false);
    }
  }, []);

  // Create cloud PNG image
  const createCloudPNG = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 40;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    
    ctx.beginPath();
    ctx.arc(20, 25, 15, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(35, 25, 18, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(50, 25, 12, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(28, 15, 10, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(42, 15, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    const gradient = ctx.createRadialGradient(35, 25, 0, 35, 25, 25);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.6)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(35, 25, 20, 0, 2 * Math.PI);
    ctx.fill();
    
    return canvas.toDataURL();
  }, []);

  // Create rain cloud PNG image
  const createRainCloudPNG = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 40;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'rgba(90, 85, 85, 0.9)';
    
    ctx.beginPath();
    ctx.arc(20, 25, 15, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(35, 25, 18, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(50, 25, 12, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(28, 15, 10, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(42, 15, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    const gradient = ctx.createRadialGradient(35, 25, 0, 35, 25, 25);
    gradient.addColorStop(0, 'rgba(40, 40, 40, 1)');
    gradient.addColorStop(0.7, 'rgba(80, 80, 80, 0.8)');
    gradient.addColorStop(1, 'rgba(120, 120, 120, 0.4)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(35, 25, 20, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.strokeStyle = 'rgba(200, 200, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(25, 20);
    ctx.lineTo(30, 30);
    ctx.lineTo(27, 35);
    ctx.stroke();
    
    return canvas.toDataURL();
  }, []);

  // Compute emitter matrix for weather particles
  const computeEmitterMatrix = useCallback((scale, heightOffset, windDirection = 0) => {
    if (!window.Cesium) return null;
    
    const position = window.Cesium.Cartesian3.fromDegrees(
      BOUNDS.centerLon,
      BOUNDS.centerLat,
      heightOffset ? 800 : 200
    );
    
    const hpr = new window.Cesium.HeadingPitchRoll(
      window.Cesium.Math.toRadians(windDirection),
      0,
      0
    );
    
    const orientation = window.Cesium.Transforms.headingPitchRollQuaternion(position, hpr);
    const modelMatrix = window.Cesium.Matrix4.fromTranslationQuaternionRotationScale(
      position,
      orientation,
      new window.Cesium.Cartesian3(scale, scale, scale)
    );
    
    return modelMatrix;
  }, []);

  // Create animated particle system
  const createAnimatedParticleSystem = useCallback((layerKey, layerConfig, weatherData) => {
    if (!viewerRef.current || !window.Cesium) return null;

    const particleLife = 8.0;
    const particleSpeed = 1.0;
    let emissionRate = 30.0;
    const radius = 3000;
    const windDirection = weatherData?.windDirection || 45;

    if (layerKey === 'precipitation' && weatherData) {
      const rainIntensity = weatherData.rain || 0;
      emissionRate = Math.max(15, Math.min(80, rainIntensity * 15));
    } else if (layerKey === 'clouds' && weatherData) {
      const cloudCoverage = weatherData.clouds || 0;
      emissionRate = Math.max(10, Math.min(60, cloudCoverage * 0.6));
    }

    let particleSystem;
    const particleColor = window.Cesium.Color.fromCssColorString(layerConfig.particleColor).withAlpha(0.8);

    switch (layerKey) {
      case 'precipitation':
        particleSystem = viewerRef.current.scene.primitives.add(
          new window.Cesium.ParticleSystem({
            image: createRainCloudPNG(),
            startColor: particleColor,
            endColor: particleColor.withAlpha(0.2),
            startScale: 1.0,
            endScale: 1.5,
            minimumParticleLife: particleLife * 0.8,
            maximumParticleLife: particleLife * 1.5,
            minimumSpeed: particleSpeed * 0.5,
            maximumSpeed: particleSpeed * 1.2,
            imageSize: new window.Cesium.Cartesian2(64, 40),
            emissionRate: emissionRate,
            lifetime: 20.0,
            emitter: new window.Cesium.CircleEmitter(radius),
            emitterModelMatrix: computeEmitterMatrix(1.0, true, windDirection),
            updateCallback: (particle, dt) => {
              const time = window.Cesium.getTimestamp() * 0.001;
              const windStrength = (weatherData?.windSpeed || 5) * 0.1;
              
              const windX = Math.cos(window.Cesium.Math.toRadians(windDirection)) * windStrength * dt;
              const windY = Math.sin(window.Cesium.Math.toRadians(windDirection)) * windStrength * dt;
              
              const turbulence = Math.sin(time * 2 + particle.age * 3) * 0.3;
              
              particle.position = window.Cesium.Cartesian3.add(
                particle.position,
                new window.Cesium.Cartesian3(
                  windX + turbulence * dt,
                  windY + turbulence * dt * 0.5,
                  -0.5 * dt
                ),
                new window.Cesium.Cartesian3()
              );
            }
          })
        );
        break;

      case 'clouds':
        particleSystem = viewerRef.current.scene.primitives.add(
          new window.Cesium.ParticleSystem({
            image: createCloudPNG(),
            startColor: particleColor,
            endColor: particleColor.withAlpha(0.3),
            startScale: 0.8,
            endScale: 2.0,
            minimumParticleLife: particleLife * 1.5,
            maximumParticleLife: particleLife * 2.5,
            minimumSpeed: particleSpeed * 0.2,
            maximumSpeed: particleSpeed * 0.5,
            imageSize: new window.Cesium.Cartesian2(64, 40),
            emissionRate: emissionRate,
            lifetime: 25.0,
            emitter: new window.Cesium.CircleEmitter(radius * 0.8),
            emitterModelMatrix: computeEmitterMatrix(1.0, true, windDirection),
            updateCallback: (particle, dt) => {
              const time = window.Cesium.getTimestamp() * 0.001;
              const windStrength = (weatherData?.windSpeed || 3) * 0.05;
              
              const windX = Math.cos(window.Cesium.Math.toRadians(windDirection)) * windStrength * dt;
              const windY = Math.sin(window.Cesium.Math.toRadians(windDirection)) * windStrength * dt;
              
              const float = Math.sin(time * 0.3 + particle.age) * 0.2;
              
              particle.position = window.Cesium.Cartesian3.add(
                particle.position,
                new window.Cesium.Cartesian3(
                  windX + float * dt * 0.3,
                  windY + float * dt * 0.2,
                  Math.sin(time * 0.1 + particle.age * 0.5) * 0.1 * dt
                ),
                new window.Cesium.Cartesian3()
              );
            }
          })
        );
        break;

      default:
        return null;
    }

    particleSystemsRef.current.push(particleSystem);
    return particleSystem;
  }, [createCloudPNG, createRainCloudPNG, computeEmitterMatrix]);

  // Set weather layer
  const setWeatherLayer = useCallback(async (layerKey) => {
    if (!window.Cesium || !viewerRef.current) return;

    // Clear all existing layers
    Object.keys(weatherLayersRef.current).forEach(key => {
      const { imageryLayer, particleSystem } = weatherLayersRef.current[key];
      
      if (imageryLayer && viewerRef.current) {
        viewerRef.current.scene.imageryLayers.remove(imageryLayer);
      }
      
      if (particleSystem && viewerRef.current) {
        viewerRef.current.scene.primitives.remove(particleSystem);
        const index = particleSystemsRef.current.indexOf(particleSystem);
        if (index > -1) {
          particleSystemsRef.current.splice(index, 1);
        }
      }
    });
    weatherLayersRef.current = {};
    setWeatherStatus({});

    if (!layerKey) {
      setActiveWeatherLayer(null);
      return;
    }

    setActiveWeatherLayer(layerKey);
    setWeatherStatus(prev => ({ ...prev, [layerKey]: 'loading' }));

    try {
      const layerConfig = weatherLayers[layerKey];
      
      // Add tile layer
      const imageryProvider = new window.Cesium.UrlTemplateImageryProvider({
        url: layerConfig.url,
        maximumLevel: 18,
        credit: 'Weather data by OpenWeatherMap',
        rectangle: window.Cesium.Rectangle.fromDegrees(
          BOUNDS.west - 0.01,
          BOUNDS.south - 0.01,
          BOUNDS.east + 0.01,
          BOUNDS.north + 0.01
        )
      });

      const imageryLayer = viewerRef.current.scene.imageryLayers.addImageryProvider(imageryProvider);
      imageryLayer.alpha = 0.4;
      imageryLayer.show = true;

      // Refresh weather data before creating particles
      const weather = await fetchWeatherData(BOUNDS.centerLat, BOUNDS.centerLon);
      setWeatherInfo(weather);

      // Add animated particle system
      const particleSystem = createAnimatedParticleSystem(layerKey, layerConfig, weather);

      weatherLayersRef.current[layerKey] = { imageryLayer, particleSystem };
      setWeatherStatus(prev => ({ ...prev, [layerKey]: 'active' }));

    } catch (error) {
      console.error(`Error loading ${layerKey} layer:`, error);
      setWeatherStatus(prev => ({ ...prev, [layerKey]: 'error' }));
    }
  }, [weatherLayers, createAnimatedParticleSystem, fetchWeatherData]);

  // Toggle weather system
  const toggleWeatherSystem = useCallback(async () => {
    const newShowState = !showWeatherSystem;
    setShowWeatherSystem(newShowState);
    
    if (newShowState) {
      // Load initial weather data
      const weather = await fetchWeatherData(BOUNDS.centerLat, BOUNDS.centerLon);
      setWeatherInfo(weather);
      setStatus("Weather System activated - Select weather layers");
    } else {
      // Clear all weather layers and particles
      Object.keys(weatherLayersRef.current).forEach(key => {
        const { imageryLayer, particleSystem } = weatherLayersRef.current[key];
        
        if (imageryLayer && viewerRef.current) {
          viewerRef.current.scene.imageryLayers.remove(imageryLayer);
        }
        
        if (particleSystem && viewerRef.current) {
          viewerRef.current.scene.primitives.remove(particleSystem);
        }
      });
      
      // Clear particle systems
      particleSystemsRef.current.forEach(particleSystem => {
        if (viewerRef.current && !viewerRef.current.isDestroyed()) {
          viewerRef.current.scene.primitives.remove(particleSystem);
        }
      });
      particleSystemsRef.current = [];
      
      weatherLayersRef.current = {};
      setActiveWeatherLayer(null);
      setWeatherStatus({});
      setWeatherInfo(null);
      setStatus("Weather System deactivated");
    }
  }, [showWeatherSystem, fetchWeatherData]);

  // Auto-refresh weather data
  useEffect(() => {
    if (!showWeatherSystem) return;
    
    const fetchInitialWeatherData = async () => {
      const weather = await fetchWeatherData(BOUNDS.centerLat, BOUNDS.centerLon);
      setWeatherInfo(weather);
    };

    fetchInitialWeatherData();
    
    const weatherInterval = setInterval(fetchInitialWeatherData, 10 * 60 * 1000);
    
    return () => clearInterval(weatherInterval);
  }, [showWeatherSystem, fetchWeatherData]);

  // Create road traffic heatmap
  const createRoadTrafficHeatmap = (roadTrafficData) => {
    try {
      if (!viewerRef.current || !roadTrafficData) {
        console.warn("Cannot create road heatmap: missing viewer or data");
        return;
      }

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
          if (intensity < 0.3) {
            baseColor = window.Cesium.Color.BLUE;
          } else if (intensity < 0.6) {
            baseColor = window.Cesium.Color.YELLOW;
          } else if (intensity < 0.8) {
            baseColor = window.Cesium.Color.ORANGE;
          } else {
            baseColor = window.Cesium.Color.RED;
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
        position: window.Cesium.Cartesian3.fromDegrees(position[0], position[1], 5),
        billboard: {
          image: "/images/cctv-camera.png",
          width: 28,
          height: 28,
          heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND,
          color: window.Cesium.Color.RED.withAlpha(0.9),
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

  // Navigate to accident location
  const navigateToAccident = useCallback(async (accident) => {
    if (!viewerRef.current || !accident.position) return;
    
    try {
      const [longitude, latitude] = accident.position;
      const destination = window.Cesium.Cartesian3.fromDegrees(longitude, latitude, 300);
      
      await viewerRef.current.camera.flyTo({
        destination: destination,
        duration: 2.5,
        maximumHeight: 1000
      });
      
      if (accident.entity && viewerRef.current.entities.contains(accident.entity)) {
        const originalColor = accident.entity.ellipse.material;
        
        accident.entity.ellipse.material = window.Cesium.Color.YELLOW.withAlpha(0.8);
        setTimeout(() => {
          if (accident.entity && viewerRef.current && viewerRef.current.entities.contains(accident.entity)) {
            accident.entity.ellipse.material = originalColor;
          }
        }, 1500);
      }
      
      setStatus(`Navigated to ${accident.accidentId} - Incident Location`);
    } catch (error) {
      console.error("Error navigating to accident:", error);
      setStatus("Failed to navigate to incident");
    }
  }, []);

  // Enhanced accident creation with CCTV camera
  const createAccident = (viewer, position) => {
    try {
      if (!viewer || viewer.isDestroyed() || !showTrafficSystem) return;
      if (accidentCount >= config.maxAccidents) return;
      if (!validateCoordinate(position)) return;

      const accidentId = `ACC-${Date.now()}`;
      const timestamp = new Date().toLocaleTimeString();

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

      const cctvCamera = createAccidentCCTV(position, accidentId);

      setActiveAccidents(prev => [...prev, { 
        position, 
        entity, 
        cctvCamera, 
        accidentId,
        timestamp,
        coordinates: `${position[1].toFixed(6)}, ${position[0].toFixed(6)}`
      }]);
      updateAccidentCount(1);

      setTimeout(() => {
        try {
          if (viewer && !viewer.isDestroyed() && viewer.entities.contains(entity)) {
            viewer.entities.remove(entity);
            
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
        { longitude: 55.741800, latitude: 25.673200, trafficDensity: 3, roadType: "residential", id: 10, location: "Service Road" }
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
    }, 40000);

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
        
        setStatus(`Added anchor point: ${anchorName} and saved to backend`);
        
        // Zoom to the new anchor point
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
    
    setStatus(`Island Roads are now ${newShowState ? 'visible' : 'hidden'}`);
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
      anchorDataSourceRef.current.show// Toggle anchor points with buildings
    if (anchorDataSourceRef.current) {
      anchorDataSourceRef.current.show = newShowState;
    }
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
    setShowAirQuality(false); // Disable air quality when traffic is toggled
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
        
        const anchors = await loadAnchorData();
        if (!isMounted) return;
        
        const heatmap = await loadHeatmapData();
        if (!isMounted) return;

        const roadHeatmap = await loadRoadHeatmapData();
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
      
      // Clear particle systems
      particleSystemsRef.current.forEach(particleSystem => {
        if (viewerRef.current && !viewerRef.current.isDestroyed()) {
          viewerRef.current.scene.primitives.remove(particleSystem);
        }
      });
      particleSystemsRef.current = [];
      
      // Clean up weather layers
      Object.keys(weatherLayersRef.current).forEach(key => {
        const { imageryLayer, particleSystem } = weatherLayersRef.current[key];
        
        if (imageryLayer && viewerRef.current && !viewerRef.current.isDestroyed()) {
          viewerRef.current.scene.imageryLayers.remove(imageryLayer);
        }
        
        if (particleSystem && viewerRef.current && !viewerRef.current.isDestroyed()) {
          viewerRef.current.scene.primitives.remove(particleSystem);
        }
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
  }, []);

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

          <button 
            onClick={toggleWeatherSystem}
            disabled={!isLoaded}
            className={`w-full p-3 rounded-lg font-semibold transition-all text-sm ${
              !isLoaded 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : showWeatherSystem 
                ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            🌤️ {showWeatherSystem ? 'Disable' : 'Enable'} Weather System
          </button>

          <button 
            onClick={toggleAirQuality}
            disabled={!isLoaded}
            className={`w-full p-3 rounded-lg font-semibold transition-all text-sm ${
              !isLoaded 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : showAirQuality 
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            🌬️ {showAirQuality ? 'Disable' : 'Enable'} Air Quality Monitor
          </button>
          
        </div>
        
        <div className="mt-4 pt-3 border-t border-blue-600">
          <div className="text-xs text-gray-400">
            <div className="font-semibold text-white mb-1">Status:</div>
            <div className="text-green-400">{status}</div>
          </div>
         
          {showWeatherSystem && weatherInfo && (
            <div className="text-xs text-gray-400 mt-2">
              <div className="font-semibold text-white mb-1">Weather:</div>
              <div className="text-green-400">{weatherInfo.temperature}°C - {weatherInfo.description}</div>
            </div>
          )}
          {showAirQuality && aqiData && aqiData.stations && aqiData.stations[0] && (
            <div className="text-xs text-gray-400 mt-2">
              <div className="font-semibold text-white mb-1">Air Quality:</div>
              <div className={`${getAQILevel(aqiData.stations[0].AQI).textColor.replace('text-', 'text-')}`}>
                AQI: {aqiData.stations[0].AQI} - {getAQILevel(aqiData.stations[0].AQI).level}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Weather Layer Control Buttons */}
      {showWeatherSystem && (
        <div className="absolute top-4 left-4 bg-gray-900 bg-opacity-95 text-white font-sans p-4 rounded-xl z-[1000] shadow-2xl border border-blue-600">
          <h3 className="text-lg font-bold mb-4 text-center border-b border-blue-600 pb-2">
            🌤️ Weather Controls
          </h3>
          
          <div className="flex gap-3 mb-4">
            {Object.entries(weatherLayers).map(([key, layer]) => (
              <button
                key={key}
                onClick={() => setWeatherLayer(key)}
                className={`p-3 rounded-lg transition-all ${
                  activeWeatherLayer === key 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg' 
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
                title={layer.name}
              >
                {layer.icon}
              </button>
            ))}
            <button
              onClick={() => setWeatherLayer(null)}
              className="p-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-all"
              title="Clear Weather Layer"
            >
              <X size={20} />
            </button>
          </div>

          {activeWeatherLayer && (
            <div className="text-xs text-gray-400">
              <div className="font-semibold text-white mb-1">Active Layer:</div>
              <div className="text-blue-400">{weatherLayers[activeWeatherLayer].name}</div>
            </div>
          )}
        </div>
      )}

      {/* Air Quality Display Panel */}
      {showAirQuality && (
        <div className="absolute top-[500px] left-4 transform -translate-y-1/2 bg-gray-900 bg-opacity-95 text-white font-sans p-4 rounded-xl z-[1000] max-w-md shadow-2xl border border-blue-600">
          {loadingAQI ? (
            <div className="flex items-center space-x-4">
              <RefreshCw className="animate-spin w-6 h-6 text-blue-500" />
              <span className="text-lg font-medium">Loading air quality data...</span>
            </div>
          ) : (
            <>
              {aqiError && (
                <div className="mb-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-3 py-2 rounded-lg text-sm flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{aqiError}</span>
                </div>
              )}

              {aqiData && aqiData.stations && aqiData.stations[0] && (
                <div>
                  <div className="mb-4">
                    <h2 className="text-sm text-gray-300 uppercase tracking-wide">
                      TODAY, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </h2>
                    <div className="flex items-center mt-1">
                      <div className={`w-2 h-2 rounded-full mr-2 ${aqiError ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                      <span className="text-xs text-gray-400">
                        {aqiError ? 'Offline Mode' : 'Live Data'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-3 h-3 rounded-full ${getAQILevel(aqiData.stations[0].AQI).color}`}></div>
                    <div>
                      <span className="text-4xl font-bold text-white">{aqiData.stations[0].AQI}</span>
                      <span className={`ml-2 text-sm font-medium ${getAQILevel(aqiData.stations[0].AQI).textColor}`}>
                        {getAQILevel(aqiData.stations[0].AQI).level} AQI
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-medium text-gray-300 mb-1">{aqiData.stations[0].city}</h3>
                    <p className="text-sm text-gray-400">
                      Data time: {formatTime(aqiData.stations[0].updatedAt)}
                    </p>
                    {lastAQIUpdate && (
                      <p className="text-xs text-gray-500">
                        Last refresh: {lastAQIUpdate}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => setShowPollutants(!showPollutants)}
                    className="w-full flex items-center justify-between text-blue-400 hover:text-blue-300 font-medium py-2 transition-colors"
                  >
                    <span>View Pollutants</span>
                    {showPollutants ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {/* Pollutants Details */}
                  {showPollutants && (
                    <div className="mt-4 space-y-3 border-t border-gray-600 pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-800 bg-opacity-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-400 uppercase tracking-wide">PM2.5</div>
                          <div className="text-lg font-semibold text-white">{aqiData.stations[0].PM25?.toFixed(1)}</div>
                          <div className="text-xs text-gray-400">μg/m³</div>
                        </div>
                        <div className="bg-gray-800 bg-opacity-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-400 uppercase tracking-wide">PM10</div>
                          <div className="text-lg font-semibold text-white">{aqiData.stations[0].PM10?.toFixed(1)}</div>
                          <div className="text-xs text-gray-400">μg/m³</div>
                        </div>
                        <div className="bg-gray-800 bg-opacity-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-400 uppercase tracking-wide">NO2</div>
                          <div className="text-lg font-semibold text-white">{aqiData.stations[0].NO2?.toFixed(1)}</div>
                          <div className="text-xs text-gray-400">μg/m³</div>
                        </div>
                        <div className="bg-gray-800 bg-opacity-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-400 uppercase tracking-wide">O3</div>
                          <div className="text-lg font-semibold text-white">{aqiData.stations[0].OZONE?.toFixed(1)}</div>
                          <div className="text-xs text-gray-400">μg/m³</div>
                        </div>
                        <div className="bg-gray-800 bg-opacity-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-400 uppercase tracking-wide">CO</div>
                          <div className="text-lg font-semibold text-white">{aqiData.stations[0].CO?.toFixed(3)}</div>
                          <div className="text-xs text-gray-400">mg/m³</div>
                        </div>
                        <div className="bg-gray-800 bg-opacity-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-400 uppercase tracking-wide">SO2</div>
                          <div className="text-lg font-semibold text-white">{aqiData.stations[0].SO2?.toFixed(1)}</div>
                          <div className="text-xs text-gray-400">μg/m³</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Manual Refresh Button */}
                  <div className="mt-4 pt-4 border-t border-gray-600">
                    <button
                      onClick={fetchAQIData}
                      disabled={loadingAQI}
                      className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-colors disabled:opacity-50 w-full"
                    >
                      <RefreshCw className={`w-4 h-4 ${loadingAQI ? 'animate-spin' : ''}`} />
                      <div>
                        <div className="font-medium text-sm">
                          {loadingAQI ? 'Refreshing...' : 'Refresh data'}
                        </div>
                        <div className="text-xs text-gray-500">
                          Click to update AQI data
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
      
      {/* Enhanced Traffic Dashboard for Island */}
      {showTrafficSystem && (
        <div className="absolute bottom-4 left-4 bg-gray-900 bg-opacity-95 text-white font-sans p-6 rounded-xl z-[1000] max-w-sm shadow-2xl border border-blue-600">
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
              <div className="text-3xl font-bold">7</div>
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
                  <div 
                    key={index} 
                    className="bg-orange-900 bg-opacity-40 p-3 rounded mb-2 border-l-4 border-orange-500 cursor-pointer hover:bg-orange-800 hover:bg-opacity-60 transition-all duration-200"
                    onClick={() => navigateToAccident(acc)}
                    title="Click to navigate to incident location"
                  >
                    <div className="font-semibold text-orange-300">🚨 Island Incident #{index + 1}</div>
                    <div className="text-sm text-gray-300">ID: {acc.accidentId}</div>
                    <div className="text-xs text-gray-400">📍 {acc.coordinates}</div>
                    <div className="text-xs text-blue-400 mt-1">⏰ {acc.timestamp}</div>
                    <div className="text-xs text-red-400 mt-1">📹 CCTV Camera Active</div>
                    <div className="text-xs text-orange-400 mt-1">⏱️ Response Dispatched</div>
                    <div className="text-xs text-green-400 mt-1 font-semibold">👆 Click to Navigate</div>
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

      {/* Weather Info Panel with Status Indicators */}
      {showWeatherSystem && weatherInfo && (
        <div className="absolute bottom-4 right-4 bg-gray-900 bg-opacity-95 text-white font-sans p-4 rounded-xl z-[1000] max-w-sm shadow-2xl border border-blue-600">
          <div className="flex items-center mb-3">
            <h3 className="text-lg font-bold text-white">
              Al Marjan Island
            </h3>
            <span className="ml-auto text-xs opacity-80">
              {isLoadingWeather ? 'Updating...' : `${weatherInfo.lat}, ${weatherInfo.lon}`}
            </span>
          </div>
          
          {weatherInfo.city !== 'Unknown Area' ? (
            <>
              {/* Main Weather Display */}
              <div className="flex items-center mb-3 p-3 bg-gray-800 bg-opacity-50 rounded-lg">
                <div className="text-2xl font-bold mr-4">
                  {weatherInfo.temperature}°C
                </div>
                <div>
                  <div className="text-sm font-medium capitalize">
                    {weatherInfo.description}
                  </div>
                  <div className="text-xs opacity-80">
                    Feels like {weatherInfo.feelsLike}°C
                  </div>
                </div>
              </div>
              
              {/* Weather Details Grid */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="flex items-center p-2 bg-gray-800 bg-opacity-30 rounded">
                  <Wind size={14} className="mr-2 text-green-400" />
                  <span className="text-xs">Wind: {weatherInfo.windSpeed} km/h</span>
                </div>
                
                <div className="flex items-center p-2 bg-gray-800 bg-opacity-30 rounded">
                  <Droplets size={14} className="mr-2 text-blue-400" />
                  <span className="text-xs">Humidity: {weatherInfo.humidity}%</span>
                </div>
                
                <div className="flex items-center p-2 bg-gray-800 bg-opacity-30 rounded">
                  <CloudRain size={14} className="mr-2 text-blue-400" />
                  <span className="text-xs">Rain: {weatherInfo.rain > 0 ? `${weatherInfo.rain}mm` : 'None'}</span>
                </div>
                
                <div className="flex items-center p-2 bg-gray-800 bg-opacity-30 rounded">
                  <Cloudy size={14} className="mr-2 text-gray-400" />
                  <span className="text-xs">Clouds: {weatherInfo.clouds}%</span>
                </div>
              </div>

              {/* Active Layer Status */}
              {activeWeatherLayer === 'precipitation' && (
                <div className={`mt-3 p-3 rounded-lg text-xs text-center ${
                  weatherInfo.rain === 0 
                    ? 'bg-yellow-900 bg-opacity-40 border border-yellow-700' 
                    : 'bg-blue-900 bg-opacity-40 border border-blue-700'
                }`}>
                  {weatherInfo.rain === 0 ? (
                    <>
                      <div className="mb-1">⚠️ No Active Precipitation</div>
                      <div className="opacity-80">Rain particles disabled - Current rainfall: 0mm</div>
                    </>
                  ) : (
                    <>
                      <div className="mb-1">🌧️ Rain Particles Active</div>
                      <div className="opacity-80">Current rainfall: {weatherInfo.rain}mm/h • Wind: {weatherInfo.windSpeed}km/h</div>
                    </>
                  )}
                </div>
              )}
              
              {activeWeatherLayer === 'clouds' && (
                <div className={`mt-3 p-3 rounded-lg text-xs text-center ${
                  weatherInfo.clouds <= 20 
                    ? 'bg-yellow-900 bg-opacity-40 border border-yellow-700' 
                    : 'bg-gray-700 bg-opacity-40 border border-gray-600'
                }`}>
                  {weatherInfo.clouds <= 20 ? (
                    <>
                      <div className="mb-1">⚠️ Low Cloud Coverage</div>
                      <div className="opacity-80">Cloud particles minimal - Coverage: {weatherInfo.clouds}%</div>
                    </>
                  ) : (
                    <>
                      <div className="mb-1">☁️ Cloud Particles Active</div>
                      <div className="opacity-80">Cloud coverage: {weatherInfo.clouds}% • Wind: {weatherInfo.windSpeed}km/h</div>
                    </>
                  )}
                </div>
              )}

              {/* Data Refresh Info */}
              <div className="mt-3 p-2 bg-gray-800 bg-opacity-30 rounded text-xs text-center opacity-70">
                🔄 Auto-refresh: Every 10 minutes • Last: {new Date().toLocaleTimeString()}
              </div>
            </>
          ) : (
            <div className="text-center p-4 text-red-400">
              <p className="mb-2">🔒 Access Restricted</p>
              <p className="text-sm opacity-80">Weather data only available for Al Marjan Island</p>
            </div>
          )}
        </div>
      )}      
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