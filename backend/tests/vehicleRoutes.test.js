const request = require('supertest');
const express = require('express');

const vehicleRoutes = require('../src/routes/vehicleRoutes');
const VehicleModel = require('../src/models/vehicleModel');

jest.mock('../src/models/vehicleModel');

const app = express();
app.use(express.json());
app.use('/api/vehicles', vehicleRoutes);

describe('Vehicle Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/vehicles should return vehicle list', async () => {
    const mockVehicles = [{ id: 1, plate_number: 'ABC123' }];
    VehicleModel.getAllVehicles.mockResolvedValue(mockVehicles);

    const res = await request(app).get('/api/vehicles');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockVehicles);
  });

  test('POST /api/vehicles should create a vehicle', async () => {
    const vehicleData = { plate_number: 'XYZ789' };
    VehicleModel.createVehicle.mockResolvedValue(2);

    const res = await request(app).post('/api/vehicles').send(vehicleData);
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ id: 2, message: 'Vehicle created successfully' });
    expect(VehicleModel.createVehicle).toHaveBeenCalledWith(vehicleData);
  });
});
