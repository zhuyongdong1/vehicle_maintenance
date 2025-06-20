const sequelize = require('../config/database')
const Vehicle = require('./Vehicle')
const MaintenanceRecord = require('./MaintenanceRecord')
const WashRecord = require('./WashRecord')

// 定义模型关联关系
Vehicle.hasMany(MaintenanceRecord, { foreignKey: 'vehicle_id' })
MaintenanceRecord.belongsTo(Vehicle, { foreignKey: 'vehicle_id' })

Vehicle.hasMany(WashRecord, { foreignKey: 'vehicle_id' })
WashRecord.belongsTo(Vehicle, { foreignKey: 'vehicle_id' })

const syncDatabase = async () => {
  try {
    // 临时关闭外键检查（MySQL）
    console.log('尝试关闭外键检查...')
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;')
    console.log('外键检查已关闭。')

    // 使用 alter: true 会尝试修改现有表结构
    console.log('开始数据库同步 (alter: true)...')
    await sequelize.sync({ alter: true })
    console.log('数据库同步成功')

  } catch (error) {
    console.error('数据库同步失败:', error)
    // 即使同步失败，也要尝试重新开启外键检查
  } finally {
    // 重新开启外键检查
    try {
      console.log('尝试重新开启外键检查...')
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;')
      console.log('外键检查已重新开启。')
    } catch (finallyError) {
      console.error('重新开启外键检查失败:', finallyError)
    }
  }
}

module.exports = {
  sequelize,
  Vehicle,
  MaintenanceRecord,
  WashRecord,
  syncDatabase
} 