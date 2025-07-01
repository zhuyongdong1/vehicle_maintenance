const express = require('express');
const vehicleRoutes = require('./src/routes/vehicleRoutes');
const maintenanceRoutes = require('./routes/maintenance');
const washRoutes = require('./routes/wash');
const ocrRoutes = require('./routes/ocr');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Simple test route
app.get('/', (req, res) => {
  res.send('Vehicle Maintenance Backend is running!');
});

// Add vehicle routes
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/wash', washRoutes);
app.use('/api/ocr', ocrRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 