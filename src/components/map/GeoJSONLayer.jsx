import React, { useEffect, useRef, useState } from 'react';
import * as Cesium from 'cesium';

const GeoJSONLayer = ({ viewer, visible, onStatusChange }) => {
  const dataSourceRef = useRef(null);
  const buildingLabelsRef = useRef([]);
  const zoomThreshold = 500;

  useEffect(() => {
    if (!viewer) return;

    const loadGeoJsonData = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/geojson');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const geojsonData = await response.json();
        
        const dataSource = await Cesium.GeoJsonDataSource.load(geojsonData, {
          clampToGround: false,
          stroke: Cesium.Color.BLUE,
          fill: Cesium.Color.BLUE.withAlpha(0.5),
          strokeWidth: 3
        });

        dataSourceRef.current = dataSource;
        viewer.dataSources.add(dataSource);

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

            const labelEntity = viewer.entities.add({
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
        await viewer.zoomTo(dataSource);
        onStatusChange('GeoJSON data loaded successfully');
      } catch (error) {
        console.error('Error loading GeoJSON:', error);
        onStatusChange('Failed to load GeoJSON data');
      }
    };

    const setupZoomListener = () => {
      const checkZoomLevel = () => {
        const cameraHeight = viewer.camera.positionCartographic.height;
        buildingLabelsRef.current.forEach(labelEntity => {
          labelEntity.label.show = cameraHeight < zoomThreshold;
        });
      };

      viewer.camera.changed.addEventListener(checkZoomLevel);
      checkZoomLevel();
    };

    loadGeoJsonData();

    return () => {
      if (dataSourceRef.current) {
        viewer.dataSources.remove(dataSourceRef.current);
      }
      buildingLabelsRef.current.forEach(label => {
        viewer.entities.remove(label);
      });
    };
  }, [viewer, onStatusChange]);

  useEffect(() => {
    if (dataSourceRef.current) {
      dataSourceRef.current.show = visible;
      buildingLabelsRef.current.forEach(label => {
        label.show = visible;
      });
    }
  }, [visible]);

  return null;
};

export default GeoJSONLayer;