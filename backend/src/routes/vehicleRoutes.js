const express = require('express');
const router = express.Router();
const VehicleController = require('../controllers/vehicleController');

// Get all vehicles
router.get('/', VehicleController.getAllVehicles);

// Get a vehicle by plate number
router.get('/plate/:plateNumber', VehicleController.getVehicleByPlateNumber);

// Get a single vehicle by ID
router.get('/:id', VehicleController.getVehicleById);

// Create a new vehicle
router.post('/', VehicleController.createVehicle);

// Update a vehicle by ID
router.put('/:id', VehicleController.updateVehicle);

// Delete a vehicle by ID
router.delete('/:id', VehicleController.deleteVehicle);

module.exports = router; 