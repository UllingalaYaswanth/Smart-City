import React, { useEffect, useRef } from 'react';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

// Set base URL for Cesium assets
window.CESIUM_BASE_URL = '/node_modules/cesium/Build/Cesium/';

const Maps = () => {
  const cesiumContainer = useRef(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    // Set your Cesium ion access token
    Cesium.Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YjhlMmVkNC1hYWVjLTQxYWEtOGZhYS1iOGQyNDUxY2ZlMTUiLCJpZCI6MjY0Nzg3LCJpYXQiOjE3MzUxMTAzMzV9.tdJk1ppDaw9AEy9bFB6RBU9T3H0-xOlIqVlrjDBJGQo";

    // Initialize Cesium Viewer
    viewerRef.current = new Cesium.Viewer(cesiumContainer.current, {
      terrain: Cesium.Terrain.fromWorldTerrain(),
      shouldAnimate: true,
      baseLayerPicker: true,
      imageryProvider: new Cesium.IonImageryProvider({ assetId: 1 }),
    });

    const viewer = viewerRef.current;

    // Replace this URL with your public GeoJSON file
    const geoJsonUrl = 'http://192.168.6.225:8082/pipeline_deck.geojson'; 

    // Load GeoJSON data
    viewer.dataSources.add(
      Cesium.GeoJsonDataSource.load(geoJsonUrl, {
        stroke: Cesium.Color.RED,
        fill: Cesium.Color.BLUE.withAlpha(0.5),
        strokeWidth: 2,
        point: {
          color: Cesium.Color.SKYBLUE,
          pixelSize: 8,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
        },
        onEachFeature: (feature, dataSource) => {
          if (feature.properties && feature.properties.name) {
            dataSource.entities.add({
              position: Cesium.Rectangle.center(dataSource.rectangle),
              label: {
                text: feature.properties.name,
                font: '14px sans-serif',
                fillColor: Cesium.Color.WHITE,
                backgroundColor: Cesium.Color.BLACK,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2,
                showBackground: true,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, -15),
              },
            });
          }
        },
      })
    );

    return () => {
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen">
      {/* Cesium Viewer Container */}
      <div
        ref={cesiumContainer}
        className="absolute inset-0"
      />
    </div>
  );
};

export default Maps;