const Vehicle = require('../models/Vehicle');

// GET所有车辆
const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll({ order: [['created_at', 'DESC']] });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET单个车辆 by ID
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: '车辆不存在' });
    }
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET单个车辆 by Plate Number
const getVehicleByPlateNumber = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ where: { plate_number: req.params.plateNumber } });
    if (!vehicle) {
      console.log(`未找到车牌号为 ${req.params.plateNumber} 的车辆`);
      return res.status(404).json({ message: '车辆不存在' });
    }
    console.log(`找到车牌号为 ${req.params.plateNumber} 的车辆:`, vehicle);
    res.json(vehicle);
  } catch (error) {
    console.error(`根据车牌号 ${req.params.plateNumber} 获取车辆失败:`, error);
    res.status(500).json({ message: error.message });
  }
};

// POST创建新车辆
const createVehicle = async (req, res) => {
  try {
    const { plate_number, vin, brand, model, year, owner_name, owner_phone, owner_address } = req.body;
    console.log('尝试创建车辆，数据:', { plate_number, vin, brand, model, year, owner_name, owner_phone, owner_address });
    const vehicle = await Vehicle.create({ 
      plate_number, 
      vin, 
      brand, 
      model, 
      year, 
      owner_name, 
      owner_phone, 
      owner_address 
    });
    console.log('车辆创建成功:', vehicle);
    res.status(201).json({ id: vehicle.id, message: 'Vehicle created successfully' });
  } catch (error) {
    console.error('创建车辆失败:', error);
    
    // 更好的错误处理
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: '车牌号已存在，请检查输入' });
    }
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: '数据验证失败：' + error.errors.map(e => e.message).join(', ') });
    }
    
    res.status(500).json({ message: '服务器内部错误：' + error.message });
  }
};

// PUT更新车辆 by ID
const updateVehicle = async (req, res) => {
  try {
    const { plate_number, vin, brand, model, year, owner_name, owner_phone, owner_address } = req.body;
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: '车辆不存在' });
    }
    await vehicle.update({ 
      plate_number, 
      vin, 
      brand, 
      model, 
      year, 
      owner_name, 
      owner_phone, 
      owner_address 
    });
    res.json({ message: 'Vehicle updated successfully' });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: '车牌号已存在，请检查输入' });
    }
    res.status(500).json({ message: error.message });
  }
};

// DELETE删除车辆 by ID
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: '车辆不存在' });
    }
    await vehicle.destroy();
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllVehicles,
  getVehicleById,
  getVehicleByPlateNumber,
  createVehicle,
  updateVehicle,
  deleteVehicle,
}; 