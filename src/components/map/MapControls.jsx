import React from 'react';

const MapControls = ({ layers, onToggleLayer, status }) => {
  return (
    <>
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.8)',
        padding: '10px',
        borderRadius: '5px'
      }}>
        <p>{status}</p>
      </div>
      
      <div style={{
        position: 'absolute',
        top: '60px',
        right: '10px',
        zIndex: 1000,
        display: 'flex',
        gap: '10px',
        flexDirection: 'column'
      }}>
        <button 
          onClick={() => onToggleLayer('showTileset')}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '10px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {layers.showTileset ? 'Hide 3D Tileset' : 'Show 3D Tileset'}
        </button>
        <button 
          onClick={() => onToggleLayer('showGeoJson')}
          style={{
            backgroundColor: layers.showGeoJson ? 'rgba(0, 100, 200, 0.9)' : 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '10px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {layers.showGeoJson ? 'Hide GeoJSON' : 'Show GeoJSON'}
        </button>
        <button 
          onClick={() => onToggleLayer('showRoads')}
          style={{
            backgroundColor: layers.showRoads ? 'rgba(100, 100, 100, 0.9)' : 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '10px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {layers.showRoads ? 'Hide Roads' : 'Show Roads'}
        </button>
        <button 
          onClick={() => onToggleLayer('showVehicles')}
          disabled={!layers.showRoads}
          style={{
            backgroundColor: layers.showVehicles ? 'rgba(50, 150, 200, 0.9)' : 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '10px',
            border: 'none',
            borderRadius: '5px',
            cursor: layers.showRoads ? 'pointer' : 'not-allowed',
            opacity: layers.showRoads ? 1 : 0.6
          }}
        >
          {layers.showVehicles ? 'Hide Vehicles' : 'Show Vehicles'}
        </button>
        <button 
          onClick={() => onToggleLayer('showHeatmap')}
          style={{
            backgroundColor: layers.showHeatmap ? 'rgba(255, 100, 0, 0.9)' : 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '10px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {layers.showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}
        </button>
      </div>
    </>
  );
};

export default MapControls;