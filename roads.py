import osmnx as ox

# Define the place name
place_name = "Al Marjan Island, Ras Al Khaimah, United Arab Emirates"

# Download the road network
graph = ox.graph_from_place(place_name, network_type='all')

# Convert to GeoDataFrame
nodes, edges = ox.graph_to_gdfs(graph)

# Save to GeoJSON
edges.to_file("al_marjan_roads.geojson", driver='GeoJSON')
