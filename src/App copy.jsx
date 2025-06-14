// import SmartCityDashboard from './components/SmartCityDashboard';

// function App() {
//   return <SmartCityDashboard />;
// }

// export default App;



import { useEffect, useRef } from 'react';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YjhlMmVkNC1hYWVjLTQxYWEtOGZhYS1iOGQyNDUxY2ZlMTUiLCJpZCI6MjY0Nzg3LCJpYXQiOjE3MzUxMTAzMzV9.tdJk1ppDaw9AEy9bFB6RBU9T3H0-xOlIqVlrjDBJGQo';

const CesiumViewer = () => {
  const viewerRef = useRef(null);

  useEffect(() => {
    const initCesium = async () => {
      const terrainProvider = await Cesium.createWorldTerrainAsync();

      const viewer = new Cesium.Viewer(viewerRef.current, {
        terrainProvider,
        baseLayerPicker: true,
        timeline: false,
        animation: false
      });

      // Load KML
      Cesium.KmlDataSource.load('http://192.168.6.225:8082/al_marjan.kml', {
        camera: viewer.scene.camera,
        canvas: viewer.scene.canvas
      }).then(ds => viewer.dataSources.add(ds)).catch(console.error);

      // Load Polygon GeoJSON
      Cesium.GeoJsonDataSource.load('http://192.168.6.225:8082/Al_marjan_island.geojson', {
        clampToGround: false
      }).then(geoJsonData => {
        viewer.dataSources.add(geoJsonData);
        for (const entity of geoJsonData.entities.values) {
          if (Cesium.defined(entity.polygon)) {
            entity.polygon.extrudedHeight = 20;
            entity.polygon.material = Cesium.Color.DODGERBLUE.withAlpha(0.7);
            entity.polygon.outline = true;
            entity.polygon.outlineColor = Cesium.Color.WHITE;
          }
        }
        viewer.flyTo(geoJsonData);
      }).catch(console.error);

      // Load Roads
      Cesium.GeoJsonDataSource.load('http://192.168.6.225:8082/al_marjan_roads.geojson', {
        clampToGround: true
      }).then(roadsData => {
        viewer.dataSources.add(roadsData);
        for (const road of roadsData.entities.values) {
          if (Cesium.defined(road.polyline)) {
            road.polyline.width = 3;
            road.polyline.material = Cesium.Color.YELLOW;
          }
        }
      }).catch(console.error);
    };

    initCesium();
  }, []);

  return <div ref={viewerRef} className="w-full h-screen" />;
};

export default CesiumViewer;
