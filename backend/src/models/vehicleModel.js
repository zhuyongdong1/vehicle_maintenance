const pool = require('../config/database');

const VehicleModel = {
  // Function to get all vehicles
  getAllVehicles: async () => {
    try {
      const [rows] = await pool.query('SELECT * FROM vehicles');
      return rows;
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      throw error;
    }
  },

  // Function to get a vehicle by ID
  getVehicleById: async (id) => {
    try {
      const [rows] = await pool.query('SELECT * FROM vehicles WHERE id = ?', [id]);
      return rows[0]; // Assuming id is unique, return the first row
    } catch (error) {
      console.error(`Error fetching vehicle with id ${id}:`, error);
      throw error;
    }
  },

  // Function to create a new vehicle
  createVehicle: async (vehicleData) => {
    try {
      const [result] = await pool.query('INSERT INTO vehicles SET ?', vehicleData);
      return result.insertId; // Return the ID of the newly inserted vehicle
    } catch (error) {
      console.error('Error creating vehicle:', error);
      throw error;
    }
  },

  // Function to update a vehicle by ID
  updateVehicle: async (id, vehicleData) => {
    try {
      const [result] = await pool.query('UPDATE vehicles SET ? WHERE id = ?', [vehicleData, id]);
      return result.affectedRows; // Return the number of affected rows
    } catch (error) {
      console.error(`Error updating vehicle with id ${id}:`, error);
      throw error;
    }
  },

  // Function to delete a vehicle by ID
  deleteVehicle: async (id) => {
    try {
      const [result] = await pool.query('DELETE FROM vehicles WHERE id = ?', [id]);
      return result.affectedRows; // Return the number of affected rows
    } catch (error) {
      console.error(`Error deleting vehicle with id ${id}:`, error);
      throw error;
    }
  },

  // Function to get a vehicle by plate number
  getVehicleByPlateNumber: async (plateNumber) => {
    try {
      const [rows] = await pool.query('SELECT * FROM vehicles WHERE plate_number = ?', [plateNumber]);
      return rows[0]; // Return the first row if found
    } catch (error) {
      console.error(`Error fetching vehicle with plate number ${plateNumber}:`, error);
      throw error;
    }
  }
};

module.exports = VehicleModel; 