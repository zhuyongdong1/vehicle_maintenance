const MaintenanceRecord = require('../models/MaintenanceRecord')
const Vehicle = require('../models/Vehicle')

// 获取指定车辆的所有维修记录
exports.getMaintenanceRecords = async (req, res) => {
  try {
    const { vehicleId } = req.params
    const records = await MaintenanceRecord.findAll({
      where: { vehicle_id: vehicleId },
      order: [['date', 'DESC']]
    })
    res.json(records)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// 获取单条维修记录
exports.getMaintenanceRecord = async (req, res) => {
  try {
    const { id } = req.params
    const record = await MaintenanceRecord.findByPk(id)
    if (!record) {
      return res.status(404).json({ message: '维修记录不存在' })
    }
    res.json(record)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// 创建维修记录
exports.createMaintenanceRecord = async (req, res) => {
  try {
    const { vehicle_id, date, type, cost, location, description } = req.body
    
    // 验证车辆是否存在
    const vehicle = await Vehicle.findByPk(vehicle_id)
    if (!vehicle) {
      return res.status(404).json({ message: '车辆不存在' })
    }

    const record = await MaintenanceRecord.create({
      vehicle_id,
      date,
      type,
      cost,
      location,
      description
    })
    res.status(201).json(record)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// 更新维修记录
exports.updateMaintenanceRecord = async (req, res) => {
  try {
    const { id } = req.params
    const { date, type, cost, location, description } = req.body

    const record = await MaintenanceRecord.findByPk(id)
    if (!record) {
      return res.status(404).json({ message: '维修记录不存在' })
    }

    await record.update({
      date,
      type,
      cost,
      location,
      description
    })
    res.json({ message: '维修记录更新成功' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// 删除维修记录
exports.deleteMaintenanceRecord = async (req, res) => {
  try {
    const { id } = req.params
    const record = await MaintenanceRecord.findByPk(id)
    if (!record) {
      return res.status(404).json({ message: '维修记录不存在' })
    }

    await record.destroy()
    res.json({ message: '维修记录删除成功' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
} 