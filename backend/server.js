
// const express = require('express');
// const bodyParser = require('body-parser');
// const fs = require('fs');
// const path = require('path');
// const cors = require('cors');

// const app = express();
// const PORT = 8081;

// // Middleware
// app.use(bodyParser.json());
// app.use(cors({
//     origin: '*', // Temporarily allow all origins for debugging
//     methods: ['GET', 'POST', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));
// // Correct path to GeoJSON file using path.join()
// const geoJsonFilePath = path.join(__dirname, 'data-test.geojson');

// // Helper function to read GeoJSON file
// const readGeoJsonFile = () => {
//     try {
//         const data = fs.readFileSync(geoJsonFilePath, 'utf8');
//         return JSON.parse(data);
//     } catch (err) {
//         console.error('Error reading GeoJSON file:', err);
//         return null;
//     }
// };

// // Helper function to write GeoJSON file
// const writeGeoJsonFile = (data) => {
//     try {
//         fs.writeFileSync(geoJsonFilePath, JSON.stringify(data, null, 2));
//         return true;
//     } catch (err) {
//         console.error('Error writing GeoJSON file:', err);
//         return false;
//     }
// };

// // GET endpoint - Serve GeoJSON data
// // In your Express server, add route logging:
// app.get('/api/geojson', (req, res) => {
//     console.log('Received GET /api/geojson request'); // Add this
//     const geoJsonData = readGeoJsonFile();
    
//     if (!geoJsonData) {
//         return res.status(500).json({ error: 'Failed to read GeoJSON data' });
//     }

//     // Explicitly set content-type
//     res.setHeader('Content-Type', 'application/json');
//     res.json(geoJsonData);
// });

// // POST endpoint - Update GeoJSON data
// app.post('/api/geojson', (req, res) => {
//     const updatedGeoJson = req.body;

//     // Validate the incoming data
//     if (!updatedGeoJson || 
//         !updatedGeoJson.type || 
//         updatedGeoJson.type !== 'FeatureCollection' || 
//         !Array.isArray(updatedGeoJson.features)) {
//         return res.status(400).json({ 
//             error: 'Invalid GeoJSON format. Expected FeatureCollection' 
//         });
//     }

//     // Write the updated data
//     const success = writeGeoJsonFile(updatedGeoJson);
    
//     if (!success) {
//         return res.status(500).json({ 
//             error: 'Failed to update GeoJSON file' 
//         });
//     }

//     res.json({ 
//         message: 'GeoJSON updated successfully',
//         featuresCount: updatedGeoJson.features.length
//     });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error('Server error:', err);
//     res.status(500).json({ error: 'Internal server error' });
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
//     console.log(`GeoJSON file path: ${geoJsonFilePath}`);
// });

// const express = require('express');
// const bodyParser = require('body-parser');
// const fs = require('fs');
// const path = require('path');
// const cors = require('cors');

// const app = express();
// const PORT = 8081;

// // Middleware
// app.use(bodyParser.json());
// app.use(cors({
//     origin: '*', // Temporarily allow all origins for debugging
//     methods: ['GET', 'POST', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));

// // Correct path to GeoJSON file using path.join()
// const geoJsonFilePath = path.join(__dirname, 'data-test.geojson');
// const roads = path.join(__dirname, 'roads.geojson');
// // Helper function to read GeoJSON file
// const readGeoJsonFile = () => {
//     try {
//         const data = fs.readFileSync(geoJsonFilePath, 'utf8');
//         return JSON.parse(data);
//     } catch (err) {
//         console.error('Error reading GeoJSON file:', err);
//         return null;
//     }
// };
// const readGeoJsonFileroads = () => {
//     try {
//         const data = fs.readFileSync(roads, 'utf8');
//         return JSON.parse(data);
//     } catch (err) {
//         console.error('Error reading GeoJSON file:', err);
//         return null;
//     }
// };

// // Helper function to write GeoJSON file
// const writeGeoJsonFile = (data) => {
//     try {
//         fs.writeFileSync(geoJsonFilePath, JSON.stringify(data, null, 2));
//         return true;
//     } catch (err) {
//         console.error('Error writing GeoJSON file:', err);
//         return false;
//     }
// };

// // Generate random crowd data based on GeoJSON features
// const generateCrowdData = () => {
//     const geoJsonData = readGeoJsonFile();

//     if (!geoJsonData || !geoJsonData.features) {
//         return [];
//     }

//     return geoJsonData.features
//         .filter(feature => feature.geometry && feature.geometry.type === 'Point')
//         .map((feature, index) => {
//             const coordinates = feature.geometry.coordinates;
//             return {
//                 id: `camera-${index + 1}`,
//                 longitude: coordinates[0],
//                 latitude: coordinates[1],
//                 crowdCount: Math.floor(Math.random() * 150) + 5, // Random count between 5-155
//                 timestamp: new Date().toISOString(),
//                 locationName: feature.properties?.['@id'] || `Location ${index + 1}`
//             };
//         });
// };

// // GET endpoint - Serve GeoJSON data
// app.get('/api/geojson', (req, res) => {
//     console.log('Received GET /api/geojson request');
//     const geoJsonData = readGeoJsonFile();
    
//     if (!geoJsonData) {
//         return res.status(500).json({ error: 'Failed to read GeoJSON data' });
//     }

//     // Explicitly set content-type
//     res.setHeader('Content-Type', 'application/json');
//     res.json(geoJsonData);
// });

// app.get('/api/roads', (req, res) => {
//     console.log('Received GET /api/geojson request');
//     const geoJsonData = readGeoJsonFileroads();
    
//     if (!geoJsonData) {
//         return res.status(500).json({ error: 'Failed to read GeoJSON data' });
//     }

//     // Explicitly set content-type
//     res.setHeader('Content-Type', 'application/json');
//     res.json(geoJsonData);
// });

// // POST endpoint - Update GeoJSON data
// app.post('/api/geojson', (req, res) => {
//     const updatedGeoJson = req.body;

//     // Validate the incoming data
//     if (!updatedGeoJson || 
//         !updatedGeoJson.type || 
//         updatedGeoJson.type !== 'FeatureCollection' || 
//         !Array.isArray(updatedGeoJson.features)) {
//         return res.status(400).json({ 
//             error: 'Invalid GeoJSON format. Expected FeatureCollection' 
//         });
//     }

//     // Write the updated data
//     const success = writeGeoJsonFile(updatedGeoJson);
    
//     if (!success) {
//         return res.status(500).json({ 
//             error: 'Failed to update GeoJSON file' 
//         });
//     }

//     res.json({ 
//         message: 'GeoJSON updated successfully',
//         featuresCount: updatedGeoJson.features.length
//     });
// });

// // GET endpoint - Serve crowd data
// app.get('/api/crowd-data', (req, res) => {
//     console.log('Received GET /api/crowd-data request');
//     const crowdData = generateCrowdData();
    
//     res.setHeader('Content-Type', 'application/json');
//     res.json(crowdData);
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error('Server error:', err);
//     res.status(500).json({ error: 'Internal server error' });
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
//     console.log(`GeoJSON file path: ${geoJsonFilePath}`);
//     console.log(`Crowd data endpoint: http://localhost:${PORT}/api/crowd-data`);
// });

// const express = require('express');
// const bodyParser = require('body-parser');
// const fs = require('fs');
// const path = require('path');
// const cors = require('cors');

// const app = express();
// const PORT = process.env.PORT || 8081;

// // Middleware
// app.use(bodyParser.json({ limit: '10mb' }));
// app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
// app.use(cors({
//     origin: process.env.NODE_ENV === 'production' ? 'https://your-production-domain.com' : '*',
//     methods: ['GET', 'POST', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));


// // File paths
// const geoJsonFilePath = path.join(__dirname, 'Al_marjan_island.geojson');
// const roadsFilePath = path.join(__dirname, 'roads1.geojson');

// // Helper function to read GeoJSON files
// const readGeoJsonFile = (filePath) => {
//     try {
//         const data = fs.readFileSync(filePath, 'utf8');
//         return JSON.parse(data);
//     } catch (err) {
//         console.error(`Error reading file at ${filePath}:`, err);
//         return null;
//     }
// };

// // Helper function to write GeoJSON files
// const writeGeoJsonFile = (filePath, data) => {
//     try {
//         fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
//         return true;
//     } catch (err) {
//         console.error(`Error writing file at ${filePath}:`, err);
//         return false;
//     }
// };

// // Generate random crowd data
// const generateCrowdData = () => {
//     const geoJsonData = readGeoJsonFile(geoJsonFilePath);
//     if (!geoJsonData || !geoJsonData.features) return [];

//     return geoJsonData.features
//         .filter(feature => feature.geometry && feature.geometry.type === 'Point')
//         .map((feature, index) => ({
//             id: `camera-${index + 1}`,
//             longitude: feature.geometry.coordinates[0],
//             latitude: feature.geometry.coordinates[1],
//             crowdCount: Math.floor(Math.random() * 150) + 5,
//             timestamp: new Date().toISOString(),
//             locationName: feature.properties?.['@id'] || `Location ${index + 1}`
//         }));
// };

// // GET /api/geojson - Serve GeoJSON data
// app.get('/api/geojson', (req, res) => {
//     console.log('Received GET /api/geojson request');
//     const geoJsonData = readGeoJsonFile(geoJsonFilePath);
//     if (!geoJsonData) return res.status(500).json({ error: 'Failed to read GeoJSON data' });

//     res.json(geoJsonData);
// });

// // GET /api/roads - Serve Roads GeoJSON data
// app.get('/api/roads', (req, res) => {
//     console.log('Received GET /api/roads request');
//     const geoJsonData = readGeoJsonFile(roadsFilePath);
//     if (!geoJsonData) return res.status(500).json({ error: 'Failed to read Roads GeoJSON data' });

//     res.json(geoJsonData);
// });

// // POST /api/geojson - Append new GeoJSON features
// app.post('/api/geojson', (req, res) => {
//     const newGeoJson = req.body;

//     if (!newGeoJson || newGeoJson.type !== 'FeatureCollection' || !Array.isArray(newGeoJson.features)) {
//         return res.status(400).json({ error: 'Invalid GeoJSON format. Expected FeatureCollection' });
//     }

//     // Read existing GeoJSON data
//     const existingGeoJson = readGeoJsonFile(geoJsonFilePath);

//     if (!existingGeoJson || !Array.isArray(existingGeoJson.features)) {
//         return res.status(500).json({ error: 'Failed to read existing GeoJSON data' });
//     }

//     // Merge new features with existing ones
//     const mergedFeatures = [...existingGeoJson.features, ...newGeoJson.features];
//     const updatedGeoJson = {
//         ...existingGeoJson,
//         features: mergedFeatures
//     };

//     // Write merged data back to file
//     const success = writeGeoJsonFile(geoJsonFilePath, updatedGeoJson);
//     if (!success) return res.status(500).json({ error: 'Failed to update GeoJSON file' });

//     res.json({ message: 'GeoJSON data appended successfully', totalFeatures: mergedFeatures.length });
// });


// // GET /api/crowd-data - Serve Crowd Data
// app.get('/api/crowd-data', (req, res) => {
//     console.log('Received GET /api/crowd-data request');
//     res.json(generateCrowdData());
// });

// // Error Handling Middleware
// app.use((err, req, res, next) => {
//     console.error('Server error:', err);
//     res.status(500).json({ error: 'Internal server error' });
// });

// // Start the Server
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
//     console.log(`GeoJSON file path: ${geoJsonFilePath}`);
//     console.log(`Crowd data endpoint: http://localhost:${PORT}/api/crowd-data`);
// });


const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8081;

// Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? 'https://your-production-domain.com' 
        : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// File paths
const geoJsonFilePath = path.join(__dirname, 'Al_marjan_island.geojson');
const roadsFilePath = path.join(__dirname, 'roads1.geojson');

// Helper function to read GeoJSON files
const readGeoJsonFile = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error reading file at ${filePath}:`, err);
        return null;
    }
};

// Helper function to write GeoJSON files
const writeGeoJsonFile = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (err) {
        console.error(`Error writing file at ${filePath}:`, err);
        return false;
    }
};

// Generate random crowd data
const generateCrowdData = () => {
    const geoJsonData = readGeoJsonFile(geoJsonFilePath);
    if (!geoJsonData || !geoJsonData.features) return [];

    return geoJsonData.features
        .filter(feature => feature.geometry && feature.geometry.type === 'Point')
        .map((feature, index) => ({
            id: `camera-${index + 1}`,
            longitude: feature.geometry.coordinates[0],
            latitude: feature.geometry.coordinates[1],
            crowdCount: Math.floor(Math.random() * 150) + 5,
            timestamp: new Date().toISOString(),
            locationName: feature.properties?.['@id'] || `Location ${index + 1}`
        }));
};

// ===== Routes from First Server =====

// Serve GeoJSON data
app.get('/api/geojson', (req, res) => {
    console.log('Received GET /api/geojson request');
    const geoJsonData = readGeoJsonFile(geoJsonFilePath);
    if (!geoJsonData) return res.status(500).json({ error: 'Failed to read GeoJSON data' });
    res.json(geoJsonData);
});

// Serve Roads GeoJSON data
app.get('/api/roads', (req, res) => {
    console.log('Received GET /api/roads request');
    const geoJsonData = readGeoJsonFile(roadsFilePath);
    if (!geoJsonData) return res.status(500).json({ error: 'Failed to read Roads GeoJSON data' });
    res.json(geoJsonData);
});

// Append new GeoJSON features
app.post('/api/geojson', (req, res) => {
    const newGeoJson = req.body;

    if (!newGeoJson || newGeoJson.type !== 'FeatureCollection' || !Array.isArray(newGeoJson.features)) {
        return res.status(400).json({ error: 'Invalid GeoJSON format. Expected FeatureCollection' });
    }

    const existingGeoJson = readGeoJsonFile(geoJsonFilePath);

    if (!existingGeoJson || !Array.isArray(existingGeoJson.features)) {
        return res.status(500).json({ error: 'Failed to read existing GeoJSON data' });
    }

    const mergedFeatures = [...existingGeoJson.features, ...newGeoJson.features];
    const updatedGeoJson = {
        ...existingGeoJson,
        features: mergedFeatures
    };

    const success = writeGeoJsonFile(geoJsonFilePath, updatedGeoJson);
    if (!success) return res.status(500).json({ error: 'Failed to update GeoJSON file' });

    res.json({ message: 'GeoJSON data appended successfully', totalFeatures: mergedFeatures.length });
});

// Serve Crowd Data
app.get('/api/crowd-data', (req, res) => {
    console.log('Received GET /api/crowd-data request');
    res.json(generateCrowdData());
});

// ===== Routes from Second Server =====

// Air Quality API endpoint
app.get('/api/air-quality', async (req, res) => {
    try {
        const { lat, lng } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }

        console.log(`Fetching air quality data for lat: ${lat}, lng: ${lng}`);

        const response = await axios.get(
            `https://api.ambeedata.com/latest/by-lat-lng`, 
            {
                params: { lat, lng },
                headers: {
                    'X-API-Key': process.env.AMBEE_API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        const data = response.data;

        if (data.stations && data.stations.length > 0) {
            data.stations[0].fetchedAt = new Date().toISOString();
            console.log('✅ Real-time data fetched successfully');
        }

        res.json(data);
    } catch (error) {
        console.error('❌ Air quality API error:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Failed to fetch air quality data',
            message: error.response?.data?.message || error.message,
            statusCode: error.response?.status || 500
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        message: 'Combined API Backend is running!'
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Combined API Backend',
        endpoints: {
            health: '/health',
            airQuality: '/api/air-quality?lat=25.671704&lng=55.742820',
            geojson: '/api/geojson',
            roads: '/api/roads',
            crowdData: '/api/crowd-data'
        }
    });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start the Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📍 GeoJSON file path: ${geoJsonFilePath}`);
    console.log(`📍 Test air quality: http://localhost:${PORT}/api/air-quality?lat=25.671704&lng=55.742820`);
    console.log(`🔍 Health check: http://localhost:${PORT}/health`);
});