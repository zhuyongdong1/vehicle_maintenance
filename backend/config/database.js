const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('vehicle_maintenance', 'root', '123456', {
  host: 'localhost',
  port: 3306, // MySQL默认端口
  dialect: 'mysql',
  logging: false, // 可以设置为 console.log 查看SQL日志
})

// 测试数据库连接
sequelize.authenticate()
  .then(() => {
    console.log('数据库连接成功')
  })
  .catch(err => {
    console.error('数据库连接失败:', err)
  })

module.exports = sequelize