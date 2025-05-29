
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

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8081;

// Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 'https://your-production-domain.com' : '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


// File paths
const geoJsonFilePath = path.join(__dirname, 'data-test.geojson');
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

// GET /api/geojson - Serve GeoJSON data
app.get('/api/geojson', (req, res) => {
    console.log('Received GET /api/geojson request');
    const geoJsonData = readGeoJsonFile(geoJsonFilePath);
    if (!geoJsonData) return res.status(500).json({ error: 'Failed to read GeoJSON data' });

    res.json(geoJsonData);
});

// GET /api/roads - Serve Roads GeoJSON data
app.get('/api/roads', (req, res) => {
    console.log('Received GET /api/roads request');
    const geoJsonData = readGeoJsonFile(roadsFilePath);
    if (!geoJsonData) return res.status(500).json({ error: 'Failed to read Roads GeoJSON data' });

    res.json(geoJsonData);
});

// POST /api/geojson - Update GeoJSON data
// POST /api/geojson - Append new GeoJSON features
app.post('/api/geojson', (req, res) => {
    const newGeoJson = req.body;

    if (!newGeoJson || newGeoJson.type !== 'FeatureCollection' || !Array.isArray(newGeoJson.features)) {
        return res.status(400).json({ error: 'Invalid GeoJSON format. Expected FeatureCollection' });
    }

    // Read existing GeoJSON data
    const existingGeoJson = readGeoJsonFile(geoJsonFilePath);

    if (!existingGeoJson || !Array.isArray(existingGeoJson.features)) {
        return res.status(500).json({ error: 'Failed to read existing GeoJSON data' });
    }

    // Merge new features with existing ones
    const mergedFeatures = [...existingGeoJson.features, ...newGeoJson.features];
    const updatedGeoJson = {
        ...existingGeoJson,
        features: mergedFeatures
    };

    // Write merged data back to file
    const success = writeGeoJsonFile(geoJsonFilePath, updatedGeoJson);
    if (!success) return res.status(500).json({ error: 'Failed to update GeoJSON file' });

    res.json({ message: 'GeoJSON data appended successfully', totalFeatures: mergedFeatures.length });
});


// GET /api/crowd-data - Serve Crowd Data
app.get('/api/crowd-data', (req, res) => {
    console.log('Received GET /api/crowd-data request');
    res.json(generateCrowdData());
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`GeoJSON file path: ${geoJsonFilePath}`);
    console.log(`Crowd data endpoint: http://localhost:${PORT}/api/crowd-data`);
});
