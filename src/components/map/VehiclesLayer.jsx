import React, { useEffect, useRef } from 'react';
import * as Cesium from 'cesium';

const VehiclesLayer = ({ viewer, visible, onStatusChange }) => {
  const vehiclesRef = useRef([]);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (!viewer || !visible) return;

    const addMovingVehicles = async () => {
      try {
        // Find roads data source
        let roadsDataSource;
        for (let i = 0; i < viewer.dataSources.length; i++) {
          if (viewer.dataSources.get(i).name === 'Roads') {
            roadsDataSource = viewer.dataSources.get(i);
            break;
          }
        }

        if (!roadsDataSource) {
          onStatusChange('No roads data found for vehicles');
          return;
        }

        // Clear existing vehicles
        vehiclesRef.current.forEach(vehicle => {
          viewer.entities.remove(vehicle);
        });
        vehiclesRef.current = [];

        // Process road positions
        const roadEntities = roadsDataSource.entities.values;
        const roads = [];

        for (const entity of roadEntities) {
          if (entity.polyline) {
            const positions = entity.polyline.positions.getValue();
            const cartographics = positions.map(pos => 
              Cesium.Cartographic.fromCartesian(pos)
            );
            
            try {
              const updatedPositions = await Cesium.sampleTerrainMostDetailed(
                viewer.terrainProvider,
                cartographics
              );
              
              const terrainAdjustedPositions = updatedPositions.map(cartographic => 
                Cesium.Cartesian3.fromRadians(
                  cartographic.longitude,
                  cartographic.latitude,
                  cartographic.height + 0.5
                )
              );
              
              roads.push({
                positions: terrainAdjustedPositions,
                type: entity.properties?.highway?.getValue() || 'residential'
              });
            } catch (error) {
              roads.push({
                positions: positions,
                type: entity.properties?.highway?.getValue() || 'residential'
              });
            }
          }
        }

        // Create vehicles
        const vehicleTypes = [
          { model: '/models/car.glb', scale: 1.0, speed: 0.005 },
          { model: '/models/car.glb', scale: 1.5, speed: 0.005 },
          { model: '/models/car.glb', scale: 1.8, speed: 0.005 }
        ];

        for (let i = 0; i < 20; i++) {
          const road = roads[Math.floor(Math.random() * roads.length)];
          if (!road || road.positions.length < 2) continue;

          const vehicleType = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
          const vehicle = viewer.entities.add({
            name: `Vehicle ${i + 1}`,
            position: road.positions[0],
            model: {
              uri: vehicleType.model,
              minimumPixelSize: 32,
              maximumScale: 20000,
              scale: vehicleType.scale
            }
          });

          vehicle.roadPositions = road.positions;
          vehicle.currentPositionIndex = 0;
          vehicle.speed = vehicleType.speed * (0.8 + Math.random() * 0.4);
          vehicle.roadType = road.type;
          vehicle.targetPositionIndex = 1;

          vehiclesRef.current.push(vehicle);
        }

        // Start animation
        const animateVehicles = () => {
          const now = Cesium.JulianDate.now();
          
          vehiclesRef.current.forEach(vehicle => {
            if (!vehicle.roadPositions || vehicle.roadPositions.length < 2) return;

            const currentTargetIndex = vehicle.targetPositionIndex;
            const currentPos = vehicle.position.getValue(now);
            const targetPos = vehicle.roadPositions[currentTargetIndex];
            
            const direction = Cesium.Cartesian3.subtract(targetPos, currentPos, new Cesium.Cartesian3());
            const distance = Cesium.Cartesian3.magnitude(direction);
            
            if (distance < 2) {
              vehicle.targetPositionIndex = (currentTargetIndex + 1) % vehicle.roadPositions.length;
              return;
            }
            
            const normalizedDirection = Cesium.Cartesian3.normalize(direction, new Cesium.Cartesian3());
            const movement = Cesium.Cartesian3.multiplyByScalar(
              normalizedDirection, 
              Math.min(vehicle.speed, distance),
              new Cesium.Cartesian3()
            );
            
            const newPosition = Cesium.Cartesian3.add(currentPos, movement, new Cesium.Cartesian3());
            vehicle.position = newPosition;
            
            const heading = Math.atan2(direction.y, direction.x);
            let pitch = 0;
            if (currentTargetIndex > 0) {
              const prevPos = vehicle.roadPositions[currentTargetIndex - 1];
              const verticalChange = targetPos.z - prevPos.z;
              const horizontalDistance = Cesium.Cartesian3.distance(
                new Cesium.Cartesian3(prevPos.x, prevPos.y, 0),
                new Cesium.Cartesian3(targetPos.x, targetPos.y, 0)
              );
              pitch = Math.atan2(verticalChange, horizontalDistance);
            }
            
            vehicle.orientation = Cesium.Quaternion.fromHeadingPitchRoll(
              new Cesium.HeadingPitchRoll(heading, pitch, 0)
            );
          });
          
          animationFrameRef.current = requestAnimationFrame(animateVehicles);
        };

        animateVehicles();
        onStatusChange('Vehicles added successfully');

      } catch (error) {
        console.error("Error adding vehicles:", error);
        onStatusChange('Failed to add vehicles');
      }
    };

    addMovingVehicles();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      vehiclesRef.current.forEach(vehicle => {
        viewer.entities.remove(vehicle);
      });
      vehiclesRef.current = [];
    };
  }, [viewer, visible, onStatusChange]);

  return null;
};

export default VehiclesLayer;