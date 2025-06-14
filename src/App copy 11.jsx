import React, { useState, useEffect } from 'react';
import { Map } from 'react-map-gl/maplibre';
import { AmbientLight, PointLight, LightingEffect } from '@deck.gl/core';
import { DeckGL } from '@deck.gl/react';
import { PolygonLayer, GeoJsonLayer } from '@deck.gl/layers';
import { TripsLayer } from '@deck.gl/geo-layers';
import { LineLayer, PathLayer } from '@deck.gl/layers';

// Data URLs
const DATA_URLS = {
  PIPELINE: 'http://192.168.6.225:8082/pipeline_deck.geojson',
  MANHOLE: 'http://192.168.6.225:8082/manhole_deck.geojson',
  CENTROID: 'http://192.168.6.225:8082/centroid.geojson'
};

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0
});

const pointLight = new PointLight({
  color: [255, 255, 255],
  intensity: 2.0,
  position: [55.7511, 25.6627, 8000]
});

const lightingEffect = new LightingEffect({ ambientLight, pointLight });

const INITIAL_VIEW_STATE = {
  longitude: 55.7511,
  latitude: 25.6627,
  zoom: 13,
  pitch: 45,
  bearing: 0
};

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json';

export default function App() {
  const [time, setTime] = useState(0);
  const [pipelineData, setPipelineData] = useState(null);
  const [manholeData, setManholeData] = useState(null);
  const [centroidData, setCentroidData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const animate = () => {
      setTime(t => (t + 0.5) % 180);
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        const [pipelineResponse, manholeResponse, centroidResponse] = await Promise.all([
          fetch(DATA_URLS.PIPELINE),
          fetch(DATA_URLS.MANHOLE),
          fetch(DATA_URLS.CENTROID)
        ]);

        if (!pipelineResponse.ok || !manholeResponse.ok || !centroidResponse.ok) {
          throw new Error('Failed to fetch one or more data files');
        }

        const [pipeline, manhole, centroid] = await Promise.all([
          pipelineResponse.json(),
          manholeResponse.json(),
          centroidResponse.json()
        ]);

        setPipelineData(pipeline);
        setManholeData(manhole);
        setCentroidData(centroid);
        setLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Create connection lines between manholes based on pipeline from/to data
  const createConnectionLines = () => {
    if (!pipelineData || !manholeData) return [];
    
    const connections = [];
    const manholeMap = {};
    
    // Create a map of manhole IDs to coordinates
    manholeData.features.forEach(manhole => {
      const manholeId = manhole.properties.manhole_id || manhole.properties.id;
      if (manholeId) {
        manholeMap[manholeId] = manhole.geometry.coordinates;
      }
    });

    // Create connection lines
    pipelineData.features.forEach(pipeline => {
      const fromId = pipeline.properties.from_id;
      const toId = pipeline.properties.to_id;
      const fromCoord = manholeMap[fromId];
      const toCoord = manholeMap[toId];
      
      if (fromCoord && toCoord) {
        connections.push({
          from: fromCoord,
          to: toCoord,
          properties: {
            from_id: fromId,
            to_id: toId,
            flowrate: pipeline.properties.flowrate,
            status: pipeline.properties.status,
            name: pipeline.properties.name
          }
        });
      }
    });
    
    return connections;
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#1a1a1a',
        color: 'white',
        fontSize: '18px'
      }}>
        Loading GeoJSON data...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#1a1a1a',
        color: 'white',
        fontSize: '18px',
        textAlign: 'center'
      }}>
        <div style={{ color: '#ff6b6b', marginBottom: '10px' }}>Error loading data:</div>
        <div>{error}</div>
        <div style={{ fontSize: '14px', marginTop: '20px', color: '#ccc' }}>
          Please check that the URLs are accessible and contain valid GeoJSON data.
        </div>
      </div>
    );
  }

  if (!pipelineData || !manholeData || !centroidData) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#1a1a1a',
        color: 'white',
        fontSize: '18px'
      }}>
        No data available
      </div>
    );
  }

  const connectionLines = createConnectionLines();

  const layers = [
    // Pipeline paths with animated water flow
    new TripsLayer({
      id: 'pipeline-water-flow',
      data: pipelineData.features,
      getPath: d => {
        // Handle both MultiLineString and LineString geometries
        if (d.geometry.type === 'MultiLineString') {
          return d.geometry.coordinates[0];
        } else if (d.geometry.type === 'LineString') {
          return d.geometry.coordinates;
        }
        return [];
      },
      getTimestamps: d => {
        const flowrate = d.properties.flowrate || 1;
        let coords;
        if (d.geometry.type === 'MultiLineString') {
          coords = d.geometry.coordinates[0];
        } else if (d.geometry.type === 'LineString') {
          coords = d.geometry.coordinates;
        } else {
          return [];
        }
        // Create timestamps based on flowrate - higher flowrate = faster animation
        return coords.map((_, i) => i * (400 / flowrate));
      },
      getColor: d => {
        switch(d.properties.status) {
          case 'blocked': return [255, 0, 0, 200]; // Red for blocked
          case 'maintenance_due': return [255, 165, 0, 200]; // Orange for maintenance
          default: return [0, 150, 255, 200]; // Blue for normal
        }
      },
      opacity: 0.8,
      widthMinPixels: 4,
      trailLength: 60,
      currentTime: time,
      shadowEnabled: false,
      pickable: true,
      getTooltip: ({ object }) => object && 
        `Pipeline: ${object.properties.name || 'Unnamed'}\n` +
        `Flow Rate: ${object.properties.flowrate || 'N/A'} m³/s\n` +
        `Status: ${object.properties.status || 'N/A'}\n` +
        `From: ${object.properties.from_id || 'N/A'}\n` +
        `To: ${object.properties.to_id || 'N/A'}`
    }),

    // Static pipeline paths (underlying structure)
    new PathLayer({
      id: 'pipeline-structure',
      data: pipelineData.features,
      getPath: d => {
        if (d.geometry.type === 'MultiLineString') {
          return d.geometry.coordinates[0];
        } else if (d.geometry.type === 'LineString') {
          return d.geometry.coordinates;
        }
        return [];
      },
      getColor: d => d.properties.status === 'blocked' ? [100, 0, 0, 100] : [0, 100, 150, 100],
      getWidth: 2,
      widthMinPixels: 2,
      pickable: true
    }),

    // Connection lines between manholes
    new LineLayer({
      id: 'manhole-connections',
      data: connectionLines,
      getSourcePosition: d => d.from,
      getTargetPosition: d => d.to,
      getColor: d => {
        switch(d.properties.status) {
          case 'blocked': return [255, 100, 100, 150];
          case 'maintenance_due': return [255, 200, 100, 150];
          default: return [100, 200, 255, 150];
        }
      },
      getWidth: d => Math.max(2, d.properties.flowrate || 1),
      pickable: true,
      getTooltip: ({ object }) => object && 
        `Connection: ${object.properties.from_id} → ${object.properties.to_id}\n` +
        `Flow Rate: ${object.properties.flowrate} m³/s\n` +
        `Status: ${object.properties.status}`
    }),

    // Manholes
    new GeoJsonLayer({
      id: 'manholes',
      data: manholeData,
      pickable: true,
      pointRadiusMinPixels: 8,
      pointRadiusMaxPixels: 20,
      getPointRadius: 0.5,
      getFillColor: d => {
        const status = d.properties.status;
        switch(status) {
          case 'blocked': return [255, 0, 0, 255];
          case 'maintenance_due': return [255, 165, 0, 255];
          default: return [0, 255, 0, 255];
        }
      },
      // getLineColor: [255, 255, 255, 255],
      // getLineWidth: 2,
      lineWidthMinPixels: 2,
      getTooltip: ({ object }) => object && 
        `Manhole: ${object.properties.manhole_id || object.properties.id || 'N/A'}\n` +
        `Status: ${object.properties.status || 'N/A'}`
    }),

    // Building centroids
    new GeoJsonLayer({
      id: 'building-centroids',
      data: centroidData,
      pointRadiusMinPixels: 6,
      pointRadiusMaxPixels: 15,
      getPointRadius: 0.5,
      getFillColor: [255, 255, 0, 200],
      getLineColor: [255, 255, 255, 255],
      getLineWidth: 0.5,
      pickable: true,
      getTooltip: ({ object }) => object && 
        `Building: ${object.properties.name || 'Unnamed'}\n` +
        `Type: ${object.properties.type || 'N/A'}\n` +
        `OSM ID: ${object.properties.osm_id || 'N/A'}`
    })
  ];

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <DeckGL
        layers={layers}
        effects={[lightingEffect]}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
      >
        <Map reuseMaps mapStyle={MAP_STYLE} />
      </DeckGL>
      
      {/* Control Panel */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '14px',
        maxWidth: '300px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#00ccff' }}>Sewer Pipeline System</h3>
        <div style={{ marginBottom: '8px' }}>
          <span style={{ color: '#00ff00' }}>●</span> Normal Manholes
        </div>
        <div style={{ marginBottom: '8px' }}>
          <span style={{ color: '#ffa500' }}>●</span> Maintenance Due
        </div>
        <div style={{ marginBottom: '8px' }}>
          <span style={{ color: '#ff0000' }}>●</span> Blocked
        </div>
        <div style={{ marginBottom: '8px' }}>
          <span style={{ color: '#ffff00' }}>●</span> Buildings
        </div>
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#ccc' }}>
          • Animated trails show water flow direction<br/>
          • Line thickness indicates flow rate<br/>
          • Click on elements for details
        </div>
      </div>
    </div>
  );
}