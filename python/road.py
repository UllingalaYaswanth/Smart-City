import osmnx as ox
import geopandas as gpd
from shapely.geometry import Polygon

# Define the coordinates of the polygon
coordinates = [
    [80.55418090565183, 16.417437906338876],
    [80.56719515929757, 16.41362792800963],
    [80.57153324384586, 16.42659776148797],
    [80.5586880064813, 16.428489123237384],
    [80.5541792689292, 16.417440511939446]
]

# Create a Polygon from the coordinates
polygon = Polygon(coordinates)

# Download road network within the polygon
G = ox.graph_from_polygon(polygon, network_type='all')

# Convert to GeoDataFrame
gdf = ox.graph_to_gdfs(G, nodes=False, edges=True)

# Save as GeoJSON
gdf.to_file("roads1.geojson", driver="GeoJSON")

print("roads.geojson has been saved!")
