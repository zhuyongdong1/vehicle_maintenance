const express = require('express')
const router = express.Router()
const washController = require('../controllers/washController')

// 获取指定车辆的所有洗车记录
router.get('/vehicle/:vehicleId', washController.getWashRecords)

// 获取单条洗车记录
router.get('/:id', washController.getWashRecord)

// 创建洗车记录
router.post('/', washController.createWashRecord)

// 更新洗车记录
router.put('/:id', washController.updateWashRecord)

// 删除洗车记录
router.delete('/:id', washController.deleteWashRecord)

module.exports = router 