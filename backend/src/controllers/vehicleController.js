const VehicleModel = require('../models/vehicleModel');

const VehicleController = {
  // Get all vehicles
  getAllVehicles: async (req, res) => {
    try {
      const vehicles = await VehicleModel.getAllVehicles();
      res.json(vehicles);
    } catch (error) {
      console.error('Error in getAllVehicles controller:', error);
      res.status(500).send('Internal Server Error');
    }
  },

  // Get a single vehicle by ID
  getVehicleById: async (req, res) => {
    const vehicleId = req.params.id;
    try {
      const vehicle = await VehicleModel.getVehicleById(vehicleId);
      if (vehicle) {
        res.json(vehicle);
      } else {
        res.status(404).send('Vehicle not found');
      }
    } catch (error) {
      console.error(`Error in getVehicleById controller for id ${vehicleId}:`, error);
      res.status(500).send('Internal Server Error');
    }
  },

  // Create a new vehicle
  createVehicle: async (req, res) => {
    const vehicleData = req.body;
    try {
      const newVehicleId = await VehicleModel.createVehicle(vehicleData);
      res.status(201).json({ id: newVehicleId, message: 'Vehicle created successfully' });
    } catch (error) {
      console.error('Error in createVehicle controller:', error);
      res.status(500).send('Internal Server Error');
    }
  },

  // Update a vehicle by ID
  updateVehicle: async (req, res) => {
    const vehicleId = req.params.id;
    const vehicleData = req.body;
    try {
      const affectedRows = await VehicleModel.updateVehicle(vehicleId, vehicleData);
      if (affectedRows > 0) {
        res.json({ message: 'Vehicle updated successfully' });
      } else {
        res.status(404).send('Vehicle not found');
      }
    } catch (error) {
      console.error(`Error in updateVehicle controller for id ${vehicleId}:`, error);
      res.status(500).send('Internal Server Error');
    }
  },

  // Delete a vehicle by ID
  deleteVehicle: async (req, res) => {
    const vehicleId = req.params.id;
    try {
      const affectedRows = await VehicleModel.deleteVehicle(vehicleId);
      if (affectedRows > 0) {
        res.json({ message: 'Vehicle deleted successfully' });
      } else {
        res.status(404).send('Vehicle not found');
      }
    } catch (error) {
      console.error(`Error in deleteVehicle controller for id ${vehicleId}:`, error);
      res.status(500).send('Internal Server Error');
    }
  },

  // Get a vehicle by plate number
  getVehicleByPlateNumber: async (req, res) => {
    const plateNumber = decodeURIComponent(req.params.plateNumber);
    console.log('查询车牌号:', plateNumber);
    try {
      const vehicle = await VehicleModel.getVehicleByPlateNumber(plateNumber);
      if (vehicle) {
        res.json(vehicle);
      } else {
        res.status(404).json({ message: 'Vehicle not found' });
      }
    } catch (error) {
      console.error(`Error in getVehicleByPlateNumber controller for plate ${plateNumber}:`, error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

module.exports = VehicleController; 