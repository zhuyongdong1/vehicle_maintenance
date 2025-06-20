const express = require('express')
const router = express.Router()
const Vehicle = require('../models/Vehicle')
const vehicleController = require('../controllers/vehicleController')

// 获取所有车辆
router.get('/', vehicleController.getAllVehicles)

// 获取单个车辆
router.get('/:id', vehicleController.getVehicleById)

// 获取单个车辆 by Plate Number
router.get('/plate/:plateNumber', vehicleController.getVehicleByPlateNumber)

// 新增车辆
router.post('/', (req, res, next) => {
  console.log('接收到创建车辆的请求')
  vehicleController.createVehicle(req, res, next)
})

// 更新车辆
router.put('/:id', vehicleController.updateVehicle)

// 删除车辆
router.delete('/:id', vehicleController.deleteVehicle)

module.exports = router 
