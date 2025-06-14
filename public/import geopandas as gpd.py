import geopandas as gpd

# Load GeoJSON
gdf = gpd.read_file(r"C:\Users\yaswanth\Desktop\smart-city_v2\smart-city\public\manhole_deck.geojson")

# Remove points within 10 meters of each other (requires metric CRS)
gdf = gdf.drop_duplicates(keep="first", subset=["geometry"], ignore_index=True)

# Save cleaned file
gdf.to_file("cleaned_output.geojson", driver="GeoJSON")