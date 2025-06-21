const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const vehicleRoutes = require('./routes/vehicles')
const maintenanceRoutes = require('./routes/maintenance')
const washRoutes = require('./routes/wash')
const ocrRoutes = require('./routes/ocr')
const { syncDatabase } = require('./models')

const app = express()
const port = process.env.PORT || 3000

// 添加请求日志中间件 (请求到达时触发)
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`)
  next()
})

app.use(cors())
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

// 添加日志，检查请求是否通过body-parser
app.use((req, res, next) => {
  console.log(`Request after body-parser: ${req.method} ${req.url}, Body:`, req.body)
  next()
})

// 注册路由
app.use('/api/vehicles', vehicleRoutes)
app.use('/api/maintenance', maintenanceRoutes)
app.use('/api/wash', washRoutes)
app.use('/api/ocr', ocrRoutes)

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('全局错误处理捕获到错误:', err)
  res.status(err.status || 500).json({
    error: err.message || '服务器内部错误',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  })
})

// 启动服务器前同步数据库
syncDatabase().then(() => {
  app.listen(port, () => {
    console.log(`服务器运行在端口 ${port}`)
  })
}).catch(error => {
  console.error('数据库同步失败:', error)
})

module.exports = app 
