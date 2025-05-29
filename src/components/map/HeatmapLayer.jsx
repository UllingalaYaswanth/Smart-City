import React, { useEffect, useRef } from 'react';
import * as Cesium from 'cesium';

const HeatmapLayer = ({ viewer, visible, onStatusChange }) => {
  const dataSourceRef = useRef(null);

  useEffect(() => {
    if (!viewer) return;

    const loadHeatmapData = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/crowd-data');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const crowdData = await response.json();
        const heatmapDataSource = new Cesium.CustomDataSource('heatmap');
        
        crowdData.forEach(camera => {
          const { longitude, latitude, crowdCount } = camera;
          const intensity = Math.min(crowdCount / 100, 1);
          const color = Cesium.Color.fromHsl(
            (1 - intensity) * 0.6,
            1,
            0.5 + intensity * 0.5,
            0.7
          );
          
          heatmapDataSource.entities.add({
            position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
            point: {
              pixelSize: 20 + intensity * 30,
              color: color,
              outlineColor: Cesium.Color.WHITE.withAlpha(0.3),
              outlineWidth: 1,
              show: visible
            },
            properties: {
              crowdCount: crowdCount,
              cameraId: camera.id
            }
          });
          
          if (crowdCount > 50) {
            heatmapDataSource.entities.add({
              position: Cesium.Cartesian3.fromDegrees(longitude, latitude, 10),
              label: {
                text: crowdCount.toString(),
                font: '12px sans-serif',
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, -10),
                show: visible && viewer.camera.positionCartographic.height < 1000
              }
            });
          }
        });
        
        viewer.dataSources.add(heatmapDataSource);
        dataSourceRef.current = heatmapDataSource;
        onStatusChange('Heatmap data loaded successfully');
      } catch (error) {
        console.error('Error loading heatmap data:', error);
        onStatusChange('Failed to load heatmap data');
      }
    };

    loadHeatmapData();

    return () => {
      if (dataSourceRef.current) {
        viewer.dataSources.remove(dataSourceRef.current);
      }
    };
  }, [viewer, visible, onStatusChange]);

  return null;
};

export default HeatmapLayer;