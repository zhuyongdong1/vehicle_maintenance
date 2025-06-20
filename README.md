# 车辆维修记录管理系统

一个专为汽车修理店打造的现代化车辆维修记录管理系统，集成移动端应用，提供完整的客户车辆信息管理和维修记录追踪功能。

## ✨ 功能特色

### 📱 移动优先设计
- 响应式界面，完美适配手机、平板和桌面端
- 原生Android应用支持，使用Capacitor技术
- 优化的移动端用户体验

### 🚗 车辆管理
- 车辆信息录入和编辑
- 车牌号和车架号管理
- 车辆品牌、型号、年份等详细信息
- **客户联系方式管理**：车主姓名、手机号、联系地址
- 手机号格式验证，确保联系方式准确性
- 车辆与客户信息一体化管理

### 🔧 维修记录
- 详细的维修项目记录
- 维修费用和工时统计
- 维修位置和日期追踪
- 多种维修类型支持（保养、维修、检查等）

### 🧽 洗车服务
- 洗车记录管理
- 洗车类型和费用统计
- 服务历史追踪

### 📊 数据统计分析
- **经营总览**：车辆总数、维修记录数、洗车次数、总收入
- **时间趋势**：月度收入趋势图，维修类型分布
- **客户排行**：按收入排序的客户榜单
- **智能分析**：收入警告、经营建议
- **详细统计**：按维修位置、月份的详细数据分析

### 🔒 数据安全
- **100%数据库存储**：所有数据存储在MySQL数据库中
- **无本地存储依赖**：避免数据丢失风险
- **多设备数据同步**：同一数据源，多端访问
- **事务支持**：MySQL提供完整的ACID事务保证
- **数据完整性保证**：通过数据库约束确保数据一致性

### 📷 智能扫描
- 集成相机功能，支持拍照记录
- 车牌识别能力（OCR）
- 快速信息录入

## 🛠 技术栈

### 前端技术
- **Vue 3** - 现代化的渐进式JavaScript框架
- **Element Plus** - 企业级UI组件库
- **Vue Router** - 官方路由管理器
- **Pinia** - 轻量级状态管理
- **Vite** - 快速的构建工具
- **Capacitor** - 跨平台移动应用开发框架

### 后端技术
- **Node.js** - JavaScript运行时环境
- **Express.js** - 快速、开放、极简的Web框架
- **Sequelize** - 现代TypeScript和Node.js ORM
- **MySQL** - 可靠的关系型数据库
- **Cors** - 跨域资源共享中间件

### 移动端
- **Capacitor** - 原生移动应用开发
- **Android SDK** - Android应用打包和发布

## 📦 项目结构

```
车辆维修记录/
├── frontend/                 # 前端Vue应用
│   ├── src/
│   │   ├── components/      # 可复用组件
│   │   ├── views/           # 页面视图
│   │   │   ├── Home.vue     # 首页仪表板
│   │   │   ├── Vehicles.vue # 车辆管理
│   │   │   ├── Maintenance.vue # 维修记录
│   │   │   ├── Statistics.vue # 数据统计
│   │   │   └── Scan.vue     # 扫描识别
│   │   ├── services/        # API服务
│   │   ├── router/          # 路由配置
│   │   ├── stores/          # 状态管理
│   │   └── utils/           # 工具函数
│   ├── android/             # Android应用配置
│   ├── capacitor.config.ts  # Capacitor配置
│   └── package.json         # 前端依赖
├── backend/                  # 后端Node.js应用
│   ├── models/              # 数据模型
│   │   ├── Vehicle.js       # 车辆模型
│   │   ├── MaintenanceRecord.js # 维修记录模型
│   │   └── WashRecord.js    # 洗车记录模型
│   ├── routes/              # API路由
│   ├── controllers/         # 控制器
│   ├── config/              # 配置文件
│   ├── app.js               # 应用入口
│   └── package.json         # 后端依赖
└── README.md                # 项目文档
```

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0
- MySQL >= 5.7
- Android Studio（用于移动端开发）

### 安装步骤

1. **克隆项目**
```bash
git clone [项目地址]
cd 车辆维修记录
```

2. **配置数据库**
```bash
# 启动MySQL服务
brew services start mysql
# 或在Linux上：sudo systemctl start mysql

# 创建数据库
mysql -u root -p -e "CREATE DATABASE vehicle_maintenance CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

3. **安装依赖**
```bash
# 安装根目录依赖
npm install

# 安装前端依赖
cd frontend
npm install

# 安装后端依赖
cd ../backend
npm install
```

4. **启动后端服务**
```bash
cd backend
npm run dev
```
后端服务将在 `http://localhost:3000` 启动

5. **启动前端开发服务器**
```bash
cd frontend
npm run dev
```
前端应用将在 `http://localhost:5173` 启动

### 📱 移动端部署

1. **构建Web应用**
```bash
cd frontend
npm run build
```

2. **同步到移动端**
```bash
npm run sync
```

3. **在Android Studio中打开项目**
```bash
npm run open:android
```

4. **构建移动端应用**
```bash
npm run build:mobile
```

## 📖 使用指南

### 基本操作流程

1. **添加车辆信息**
   - 进入"车辆管理"页面
   - 点击"添加车辆"按钮
   - 填写车牌号、车架号、车主姓名、联系电话等信息
   - 系统会验证手机号格式，确保联系方式准确

2. **记录维修服务**
   - 选择对应车辆
   - 添加维修记录
   - 填写维修类型、费用、日期等信息

3. **客户联系管理**
   - 在车辆列表中快速查看车主联系方式
   - 维修完成后可立即联系车主
   - 统一管理客户信息，提升服务效率

4. **查看统计分析**
   - 进入"数据统计"页面
   - 查看收入趋势、客户排行等
   - 分析经营数据，优化服务

### API接口

#### 车辆管理
- `GET /api/vehicles` - 获取车辆列表（包含客户联系方式）
- `POST /api/vehicles` - 添加新车辆（支持客户信息）
- `PUT /api/vehicles/:id` - 更新车辆信息（包含客户联系方式）
- `DELETE /api/vehicles/:id` - 删除车辆
- `GET /api/vehicles/plate/:plateNumber` - 根据车牌号查询车辆

#### 维修记录
- `GET /api/maintenance/:vehicleId` - 获取车辆维修记录
- `POST /api/maintenance` - 添加维修记录
- `PUT /api/maintenance/:id` - 更新维修记录
- `DELETE /api/maintenance/:id` - 删除维修记录

#### 洗车记录
- `GET /api/wash/vehicle/:vehicleId` - 获取洗车记录
- `POST /api/wash` - 添加洗车记录
- `DELETE /api/wash/:id` - 删除洗车记录

#### OCR识别
- `POST /api/ocr/license-plate` - 车牌号识别
- `POST /api/ocr/vin` - 车架号识别

## 🎯 核心特性详解

### 客户联系方式管理
系统集成了完整的客户联系方式管理功能：

- **车主信息录入**：车主姓名（必填）、联系电话（必填）、联系地址（可选）
- **手机号验证**：自动验证中国大陆手机号格式，确保联系方式准确
- **一体化显示**：车辆列表直接显示车主姓名和联系电话
- **快速联系**：维修完成后可一键查看和联系车主
- **数据完整性**：客户信息与车辆信息统一管理，避免信息孤岛

### 数据安全与存储
系统采用企业级数据库为中心的设计理念：

- **MySQL数据库**：所有数据存储在后端MySQL数据库中
- **零本地存储**：不使用localStorage、sessionStorage等浏览器存储
- **防数据丢失**：应用卸载、缓存清理不会影响数据安全
- **多设备同步**：不同设备访问相同的数据源，数据实时同步
- **专业备份**：使用MySQL专业备份工具确保数据安全

### 数据统计分析
系统提供多维度的数据分析功能：

- **经营概览**：实时显示车辆总数、服务记录、总收入等关键指标
- **收入趋势**：月度收入变化趋势图，帮助了解业务发展情况
- **服务分析**：不同维修类型的收入占比和频次统计
- **客户价值**：按收入排序的客户榜单，识别重要客户
- **智能提醒**：基于历史数据的收入预警和经营建议

### 移动端优化
- 针对移动设备优化的界面布局
- 原生应用级别的用户体验
- 相机集成和图片处理
- 触控优化的操作交互
- Android应用打包和分发支持

## 📊 项目状态

### 🎉 已完成功能（约95%完成度）
- ✅ **车辆管理**：完整的车辆信息和客户联系方式管理
- ✅ **维修记录**：详细的维修项目记录和费用管理
- ✅ **洗车服务**：洗车记录管理和统计
- ✅ **数据统计**：多维度的经营数据分析和可视化
- ✅ **扫描识别**：车牌号和车架号OCR识别
- ✅ **移动端支持**：Android应用打包和部署
- ✅ **数据安全**：MySQL企业级数据库，无数据丢失风险

### 🔄 可扩展功能
- 📝 用户权限管理（多用户支持）
- 📤 数据导出功能（Excel/PDF）
- 📊 更多报表格式
- 🔔 维修提醒和通知
- ☁️ 云端数据同步

## 💡 使用建议

### 适用场景
- **小型汽修店**：日常车辆维修记录管理
- **洗车服务点**：洗车记录和客户管理
- **个人维修工作室**：简单高效的客户车辆管理
- **4S店服务部门**：补充现有系统的移动端管理

### 数据备份建议
```bash
# 备份MySQL数据库
mysqldump -u root -p vehicle_maintenance > backup/backup_$(date +%Y%m%d_%H%M%S).sql

# 恢复数据库
mysql -u root -p vehicle_maintenance < backup/backup_20241210_143022.sql

# 查看数据库大小
mysql -u root -p -e "SELECT ROUND(SUM(data_length + index_length) / 1024 / 1024, 1) AS 'DB Size in MB' FROM information_schema.tables WHERE table_schema='vehicle_maintenance';"
```

## 🤝 贡献

欢迎提交Issue和Pull Request来帮助改进项目。

## 📄 许可证

本项目采用 MIT 许可证。详见 LICENSE 文件。

## 📞 技术支持

如有问题或建议，请通过以下方式联系：

- 提交 GitHub Issue
- 发送邮件至：[您的邮箱地址]

---

## 🌟 项目亮点

- 🎯 **专业定制**：专为汽修行业打造，贴合实际业务需求
- 📱 **移动优先**：支持Android应用，随时随地管理业务
- 🔒 **数据安全**：MySQL企业级数据库，零数据丢失风险
- 💡 **简单易用**：直观的界面设计，学习成本低
- 📊 **智能分析**：丰富的数据统计，助力经营决策
- 🚀 **即用即部署**：开箱即用，快速上手

> **为汽车修理店量身定制的现代化管理系统，集客户管理、维修记录、数据分析于一体，让车辆维修记录管理变得简单高效！**

**🎉 立即开始使用，体验高效的车辆维修管理！** 