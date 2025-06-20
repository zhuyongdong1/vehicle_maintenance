const WashRecord = require('../models/WashRecord')
const Vehicle = require('../models/Vehicle')

// 获取指定车辆的所有洗车记录
exports.getWashRecords = async (req, res) => {
  try {
    const { vehicleId } = req.params
    const records = await WashRecord.findAll({
      where: { vehicle_id: vehicleId },
      order: [['date', 'DESC']]
    })
    res.json(records)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// 获取单条洗车记录
exports.getWashRecord = async (req, res) => {
  try {
    const { id } = req.params
    const record = await WashRecord.findByPk(id)
    if (!record) {
      return res.status(404).json({ message: '洗车记录不存在' })
    }
    res.json(record)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// 创建洗车记录
exports.createWashRecord = async (req, res) => {
  try {
    const { vehicle_id, date, count, notes } = req.body
    
    // 验证车辆是否存在
    const vehicle = await Vehicle.findByPk(vehicle_id)
    if (!vehicle) {
      return res.status(404).json({ message: '车辆不存在' })
    }

    const record = await WashRecord.create({
      vehicle_id,
      date,
      count,
      notes
    })
    res.status(201).json(record)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// 更新洗车记录
exports.updateWashRecord = async (req, res) => {
  try {
    const { id } = req.params
    const { date, count, notes } = req.body

    const record = await WashRecord.findByPk(id)
    if (!record) {
      return res.status(404).json({ message: '洗车记录不存在' })
    }

    await record.update({
      date,
      count,
      notes
    })
    res.json({ message: '洗车记录更新成功' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// 删除洗车记录
exports.deleteWashRecord = async (req, res) => {
  try {
    const { id } = req.params
    const record = await WashRecord.findByPk(id)
    if (!record) {
      return res.status(404).json({ message: '洗车记录不存在' })
    }

    await record.destroy()
    res.json({ message: '洗车记录删除成功' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
} 