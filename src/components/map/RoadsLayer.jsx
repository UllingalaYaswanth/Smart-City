import React, { useEffect, useRef } from 'react';
import * as Cesium from 'cesium';

const RoadsLayer = ({ viewer, visible, onStatusChange }) => {
  const dataSourceRef = useRef(null);

  useEffect(() => {
    if (!viewer) return;

    const loadRoadsData = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/roads');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const roadsData = await response.json();
        
        const roadsDataSource = await Cesium.GeoJsonDataSource.load(roadsData, {
          clampToGround: true,
          stroke: Cesium.Color.GRAY,
          strokeWidth: 3
        });

        const entities = roadsDataSource.entities.values;
        entities.forEach(entity => {
          if (entity.polyline) {
            const highwayType = entity.properties.highway?.getValue();
            
            let color = Cesium.Color.GRAY;
            let width = 3;
            
            switch(highwayType) {
              case 'motorway':
                color = Cesium.Color.RED;
                width = 5;
                break;
              case 'trunk':
                color = Cesium.Color.ORANGE;
                width = 4.5;
                break;
              case 'primary':
                color = Cesium.Color.YELLOW;
                width = 4;
                break;
              case 'secondary':
                color = Cesium.Color.GREEN;
                width = 3.5;
                break;
              case 'tertiary':
                color = Cesium.Color.BLUE;
                width = 3;
                break;
              case 'residential':
                color = Cesium.Color.WHITE;
                width = 2;
                break;
              default:
                color = Cesium.Color.GRAY;
                width = 2;
            }
            
            entity.polyline.material = color;
            entity.polyline.width = width;
          }
        });

        dataSourceRef.current = roadsDataSource;
        viewer.dataSources.add(roadsDataSource);
        onStatusChange('Roads data loaded successfully');
      } catch (error) {
        console.error('Error loading roads data:', error);
        onStatusChange('Failed to load roads data');
      }
    };

    loadRoadsData();

    return () => {
      if (dataSourceRef.current) {
        viewer.dataSources.remove(dataSourceRef.current);
      }
    };
  }, [viewer, onStatusChange]);

  useEffect(() => {
    if (dataSourceRef.current) {
      dataSourceRef.current.show = visible;
    }
  }, [visible]);

  return null;
};

export default RoadsLayer;