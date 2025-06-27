<template>
  <div class="mobile-home">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">车辆管理</h1>
      <p class="page-subtitle">智能维修记录系统</p>
    </div>

    <!-- 核心功能卡片 -->
    <div class="main-actions">
      <div class="action-card primary" @click="$router.push('/scan')">
        <div class="action-icon">
          <el-icon size="32"><CameraFilled /></el-icon>
        </div>
        <div class="action-content">
          <h3>扫描识别</h3>
          <p>拍照识别车牌和车架号</p>
        </div>
        <div class="action-arrow">
          <el-icon><ArrowRight /></el-icon>
        </div>
      </div>

      <div class="action-card" @click="$router.push('/vehicles')">
        <div class="action-icon">
          <el-icon size="32"><Management /></el-icon>
        </div>
        <div class="action-content">
          <h3>车辆管理</h3>
          <p>查看和管理车辆信息</p>
        </div>
        <div class="action-arrow">
          <el-icon><ArrowRight /></el-icon>
        </div>
      </div>
    </div>

    <!-- 统计概览 -->
    <div class="stats-section">
      <h2 class="section-title">数据概览</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">{{ stats.totalVehicles }}</div>
          <div class="stat-label">车辆总数</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats.totalMaintenance }}</div>
          <div class="stat-label">维修记录</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats.totalWash }}</div>
          <div class="stat-label">洗车记录</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">¥{{ stats.totalRevenue }}</div>
          <div class="stat-label">总收入</div>
        </div>
      </div>
    </div>

    <!-- 快速操作 -->
    <div class="quick-section">
      <h2 class="section-title">快速操作</h2>
      <div class="quick-grid">
        <div class="quick-item" @click="$router.push('/maintenance')">
          <el-icon size="20"><Tools /></el-icon>
          <span>维修记录</span>
        </div>
        <div class="quick-item" @click="$router.push('/statistics')">
          <el-icon size="20"><TrendCharts /></el-icon>
          <span>数据统计</span>
        </div>
        <div class="quick-item" @click="handleAddVehicle">
          <el-icon size="20"><Plus /></el-icon>
          <span>添加车辆</span>
        </div>
        <div class="quick-item" @click="handleExport">
          <el-icon size="20"><Download /></el-icon>
          <span>导出数据</span>
        </div>
      </div>
    </div>

    <!-- 最近活动 -->
    <div class="recent-section" v-if="recentActivities.length > 0">
      <h2 class="section-title">最近活动</h2>
      <div class="recent-list">
        <div 
          v-for="activity in recentActivities.slice(0, 3)" 
          :key="activity.id"
          class="recent-item"
          @click="handleActivityClick(activity)"
        >
          <div class="recent-icon">
            <el-icon><Tools /></el-icon>
          </div>
          <div class="recent-content">
            <div class="recent-title">{{ activity.vehicleName }}</div>
            <div class="recent-desc">{{ activity.type }} - ¥{{ activity.cost }}</div>
          </div>
          <div class="recent-time">{{ formatTime(activity.date) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  CameraFilled, 
  Management, 
  Tools, 
  TrendCharts,
  Plus,
  Download,
  ArrowRight
} from '@element-plus/icons-vue'
import { vehicleService, maintenanceService, washService } from '../services/api'

const router = useRouter()

const stats = ref({
  totalVehicles: 0,
  totalMaintenance: 0,
  totalWash: 0,
  totalRevenue: 0
})

const recentActivities = ref([])

// 获取统计数据
const fetchStats = async () => {
  try {
    // 获取车辆总数
    const vehicles = await vehicleService.getAllVehicles()
    stats.value.totalVehicles = vehicles.length

    // 获取维修记录
    let totalMaintenance = 0
    let totalRevenue = 0
    let allMaintenanceRecords = []

    for (const vehicle of vehicles) {
      try {
        const maintenanceRecords = await maintenanceService.getMaintenanceRecords(vehicle.id)
        totalMaintenance += maintenanceRecords.length
        
        maintenanceRecords.forEach(record => {
          totalRevenue += parseFloat(record.cost) || 0
          allMaintenanceRecords.push({
            ...record,
            vehicleName: `${vehicle.brand} ${vehicle.model} (${vehicle.plate_number})`
          })
        })
      } catch (error) {
        console.error(`获取车辆 ${vehicle.id} 的维修记录失败:`, error)
      }
    }

    stats.value.totalMaintenance = totalMaintenance
    stats.value.totalRevenue = totalRevenue

    // 获取最近活动
    recentActivities.value = allMaintenanceRecords
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)

  } catch (error) {
    console.error('获取统计数据失败:', error)
    ElMessage.error('获取统计数据失败')
  }
}

// 处理添加车辆
const handleAddVehicle = () => {
  router.push('/scan')
}

// 处理导出数据
const handleExport = () => {
  ElMessage.info('导出功能开发中...')
}

// 处理活动点击
const handleActivityClick = (activity) => {
  router.push(`/maintenance/${activity.vehicle_id}`)
}

// 格式化时间
const formatTime = (dateStr) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now - date
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) {
    return '今天'
  } else if (days === 1) {
    return '昨天'
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return date.toLocaleDateString()
  }
}

onMounted(() => {
  fetchStats()
})
</script>

<style scoped>
.mobile-home {
  padding: 0;
  background: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  background: linear-gradient(135deg, var(--apple-blue), #0056CC);
  color: white;
  padding: 24px 20px;
  text-align: center;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
}

.main-actions {
  padding: 20px 16px;
  background: white;
  margin-bottom: 12px;
}

.action-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 16px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e9ecef;
}

.action-card:last-child {
  margin-bottom: 0;
}

.action-card.primary {
  background: linear-gradient(135deg, var(--apple-blue), #0056CC);
  color: white;
  border: none;
}

.action-card:active {
  transform: scale(0.98);
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
}

.action-card:not(.primary) .action-icon {
  background: var(--apple-blue);
  color: white;
}

.action-content {
  flex: 1;
}

.action-content h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.action-content p {
  font-size: 14px;
  margin: 0;
  opacity: 0.8;
}

.action-arrow {
  opacity: 0.6;
  margin-left: 8px;
}

.stats-section,
.quick-section,
.recent-section {
  background: white;
  margin-bottom: 12px;
  padding: 20px 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 16px 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.stat-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px 16px;
  text-align: center;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: var(--apple-blue);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #666666;
  font-weight: 500;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 8px;
  background: #f8f9fa;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quick-item:active {
  transform: scale(0.95);
  background: #e9ecef;
}

.quick-item .el-icon {
  color: var(--apple-blue);
  margin-bottom: 8px;
}

.quick-item span {
  font-size: 12px;
  color: #333333;
  font-weight: 500;
  text-align: center;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recent-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.recent-item:active {
  transform: scale(0.98);
  background: #e9ecef;
}

.recent-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--apple-blue);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
}

.recent-content {
  flex: 1;
}

.recent-title {
  font-size: 14px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 2px;
}

.recent-desc {
  font-size: 12px;
  color: #666666;
}

.recent-time {
  font-size: 11px;
  color: #999999;
  font-weight: 500;
}

/* 响应式优化 */
@media (max-width: 380px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
  
  .stat-card {
    padding: 16px 12px;
  }
  
  .stat-number {
    font-size: 20px;
  }
  
  .quick-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }
  
  .quick-item {
    padding: 12px 6px;
  }
  
  .quick-item span {
    font-size: 11px;
  }
}
</style> 