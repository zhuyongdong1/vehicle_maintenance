const express = require('express')
const router = express.Router()
const maintenanceController = require('../controllers/maintenanceController')

// 获取指定车辆的所有维修记录
router.get('/vehicle/:vehicleId', maintenanceController.getMaintenanceRecords)

// 获取单条维修记录
router.get('/:id', maintenanceController.getMaintenanceRecord)

// 创建维修记录
router.post('/', maintenanceController.createMaintenanceRecord)

// 更新维修记录
router.put('/:id', maintenanceController.updateMaintenanceRecord)

// 删除维修记录
router.delete('/:id', maintenanceController.deleteMaintenanceRecord)

module.exports = router 