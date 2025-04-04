// const express = require('express');
// const bodyParser = require('body-parser');
// const fs = require('fs');
// const path = require('path');
// const cors = require('cors'); // Import the cors package

// const app = express();
// const PORT = 8081;

// // Middleware to parse JSON requests
// app.use(bodyParser.json());

// // Enable CORS for all routes
// app.use(cors({
//     origin: 'http://127.0.0.1:8000', // Allow requests from this origin
//     methods: ['GET', 'POST'],       // Allow these HTTP methods
//     allowedHeaders: ['Content-Type'] // Allow this header
// }));

// // Path to the GeoJSON file
// const geoJsonFilePath = 'C:\Users\yaswanth\Desktop\projects\geojson-OSM\react\backend\data-test.geojson';

// // Endpoint to serve the GeoJSON file
// app.get('/data-test.geojson', (req, res) => {
//     fs.readFile(geoJsonFilePath, 'utf8', (err, data) => {
//         if (err) {
//             console.error('Error reading GeoJSON file:', err);
//             return res.status(500).send('Error reading GeoJSON file');
//         }
//         res.setHeader('Content-Type', 'application/json');
//         res.send(data);
//     });
// });

// // Endpoint to update the GeoJSON file with new anchor points
// app.post('/update-geojson', (req, res) => {
//     const updatedGeoJson = req.body;

//     // Validate the incoming data
//     if (!updatedGeoJson || !Array.isArray(updatedGeoJson.features)) {
//         return res.status(400).send('Invalid GeoJSON data');
//     }

//     // Write the updated GeoJSON data to the file
//     fs.writeFile(geoJsonFilePath, JSON.stringify(updatedGeoJson, null, 2), 'utf8', (err) => {
//         if (err) {
//             console.error('Error writing to GeoJSON file:', err);
//             return res.status(500).send('Error updating GeoJSON file');
//         }
//         console.log('GeoJSON file updated successfully');
//         res.send('GeoJSON file updated successfully');
//     });
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 8081;

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: '*', // Temporarily allow all origins for debugging
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Correct path to GeoJSON file using path.join()
const geoJsonFilePath = path.join(__dirname, 'data-test.geojson');

// Helper function to read GeoJSON file
const readGeoJsonFile = () => {
    try {
        const data = fs.readFileSync(geoJsonFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading GeoJSON file:', err);
        return null;
    }
};

// Helper function to write GeoJSON file
const writeGeoJsonFile = (data) => {
    try {
        fs.writeFileSync(geoJsonFilePath, JSON.stringify(data, null, 2));
        return true;
    } catch (err) {
        console.error('Error writing GeoJSON file:', err);
        return false;
    }
};

// GET endpoint - Serve GeoJSON data
// In your Express server, add route logging:
app.get('/api/geojson', (req, res) => {
    console.log('Received GET /api/geojson request'); // Add this
    const geoJsonData = readGeoJsonFile();
    
    if (!geoJsonData) {
        return res.status(500).json({ error: 'Failed to read GeoJSON data' });
    }

    // Explicitly set content-type
    res.setHeader('Content-Type', 'application/json');
    res.json(geoJsonData);
});

// POST endpoint - Update GeoJSON data
app.post('/api/geojson', (req, res) => {
    const updatedGeoJson = req.body;

    // Validate the incoming data
    if (!updatedGeoJson || 
        !updatedGeoJson.type || 
        updatedGeoJson.type !== 'FeatureCollection' || 
        !Array.isArray(updatedGeoJson.features)) {
        return res.status(400).json({ 
            error: 'Invalid GeoJSON format. Expected FeatureCollection' 
        });
    }

    // Write the updated data
    const success = writeGeoJsonFile(updatedGeoJson);
    
    if (!success) {
        return res.status(500).json({ 
            error: 'Failed to update GeoJSON file' 
        });
    }

    res.json({ 
        message: 'GeoJSON updated successfully',
        featuresCount: updatedGeoJson.features.length
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`GeoJSON file path: ${geoJsonFilePath}`);
});