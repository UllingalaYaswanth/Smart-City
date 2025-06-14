import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Map } from 'react-map-gl/maplibre';
import { AmbientLight, PointLight, LightingEffect } from '@deck.gl/core';
import { DeckGL } from '@deck.gl/react';
import { PolygonLayer, GeoJsonLayer } from '@deck.gl/layers';
import { TripsLayer } from '@deck.gl/geo-layers';
import { animate } from 'popmotion';
import { PathLayer } from '@deck.gl/layers';

// Source data URLs
const DATA_URL = {
  MANHOLES: 'manhole_deck.geojson',
  TRIPS: 'pipeline_deck.geojson',
  OSM_BUILDINGS: 'buildings_deck.geojson',
  CENTROIDS: 'centroid.geojson',
  CONNECTIONS: 'road_connnect_deck.geojson'
};

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0
});

const pointLight = new PointLight({
  color: [255, 255, 255],
  intensity: 2.0,
  position: [-74.05, 40.7, 8000]
});

const lightingEffect = new LightingEffect({ ambientLight, pointLight });

const DEFAULT_THEME = {
  buildingColor: [74, 80, 87],
  trailColor0: [253, 128, 93],
  trailColor1: [23, 184, 190],
  material: {
    ambient: 0.1,
    diffuse: 0.6,
    shininess: 32,
    specularColor: [60, 64, 70]
  },
  effects: [lightingEffect]
};

const INITIAL_VIEW_STATE = {
  longitude: 55.7511,
  latitude: 25.6627,
  zoom: 17,
  pitch: 45,
  bearing: 0
};

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json'; 

const landCover = [
  [
    [-74.0, 40.7],
    [-74.02, 40.7],
    [-74.02, 40.72],
    [-74.0, 40.72]
  ]
];

export default function App({
  buildings = DATA_URL.OSM_BUILDINGS,
  trips = DATA_URL.TRIPS,
  trailLength = 180,
  initialViewState = INITIAL_VIEW_STATE,
  mapStyle = MAP_STYLE,
  theme = DEFAULT_THEME,
  loopLength = 1800,
  animationSpeed = 1
}) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const animation = animate({
      from: 0,
      to: loopLength,
      duration: (loopLength * 60) / animationSpeed,
      repeat: Infinity,
      onUpdate: setTime
    });
    return () => animation.stop();
  }, [loopLength, animationSpeed]);

  const pipelinePathLayer = new PathLayer({
    id: 'pipeline-path',
    data: DATA_URL.TRIPS,
    pickable: true,
    widthScale: 2,
    widthMinPixels: 2,
    getPath: d => d.geometry.coordinates[0], // because it's MultiLineString
    getColor: [0, 255, 255],
    getWidth: 3,
    parameters: {
      depthTest: false
    },
    getTooltip: ({ object }) =>
      `Flowrate: ${object.properties.flowrate} m³/s\nStatus: ${object.properties.status}`
  });

  const layers = [
    new PolygonLayer({
      id: 'ground',
      data: landCover,
      getPolygon: f => f,
      stroked: false,
      getFillColor: [0, 0, 0, 0]
    }),
    new TripsLayer({
      id: 'sewer-pipes',
      data: trips,
      getPath: d => d.geometry.coordinates,
      getTimestamps: d => {
        const flowrate = d.properties.flowrate || 1;
        return Array.from({ length: d.geometry.coordinates.length }, (_, i) => i * (10 / flowrate));
      },
      getColor: d =>
        d.properties.status === 'blocked' ? [255, 0, 0] : [0, 150, 255],
      opacity: 0.6,
      widthMinPixels: 3,
      trailLength,
      currentTime: time,
      shadowEnabled: false
    }),
    new PolygonLayer({
      id: 'buildings',
      data: buildings,
      extruded: true,
      wireframe: false,
      opacity: 0.5,
      getPolygon: f => f.polygon,
      getElevation: f => f.height,
      getFillColor: theme.buildingColor,
      material: theme.material
    }),
    new GeoJsonLayer({
      id: 'manholes',
      data: DATA_URL.MANHOLES,
      pickable: true,
      pointRadiusMinPixels: 6,
      getFillColor: d => {
        const s = d.properties.status;
        return s === 'blocked' ? [255, 0, 0] : s === 'maintenance_due' ? [255, 165, 0] : [0, 200, 0];
      },
      getTooltip: ({ object }) => object && `Manhole: ${object.properties.manhole_id}\nStatus: ${object.properties.status}`
    }),
    new GeoJsonLayer({
      id: 'building-centroids',
      data: DATA_URL.CENTROIDS,
      pointRadiusMinPixels: 5,
      getFillColor: [255, 255, 0],
      getRadius: 4,
      pickable: true,
      getTooltip: ({ object }) =>
        object && `Centroid\nName: ${object.properties.name || 'N/A'}\nOSM ID: ${object.properties.osm_id || 'N/A'}`
    }),
    new GeoJsonLayer({
      id: 'centroid-sewer-connections',
      data: DATA_URL.CONNECTIONS,
      stroked: true,
      getLineColor: [0, 255, 255],
      getLineWidth: 2,
      lineWidthMinPixels: 2,
      pickable: true,
      getTooltip: ({ object }) =>
        object && `Connection\nFrom: ${object.properties.from}\nTo: ${object.properties.to}`
    })
  ];

  return (
    <DeckGL
      layers={layers}
      effects={theme.effects}
      initialViewState={initialViewState}
      controller={true}
    >
      <Map reuseMaps mapStyle={mapStyle} />
    </DeckGL>
  );
}

export function renderToDOM(container) {
  createRoot(container).render(<App />);
}