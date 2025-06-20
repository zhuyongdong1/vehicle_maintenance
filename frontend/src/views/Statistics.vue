<template>
  <div class="statistics-mobile">
    <!-- 头部标题 -->
    <div class="header-section">
      <h2>数据统计</h2>
      <div class="refresh-btn" @click="fetchAllData">
        <el-icon><Refresh /></el-icon>
      </div>
    </div>

    <!-- 核心数据概览 -->
    <div class="overview-section">
      <div class="overview-card">
        <div class="overview-title">今日概览</div>
        <div class="overview-grid">
          <div class="overview-item">
            <div class="overview-number">{{ overviewStats.totalVehicles }}</div>
            <div class="overview-label">服务车辆</div>
          </div>
          <div class="overview-item">
            <div class="overview-number">{{ overviewStats.totalMaintenance }}</div>
            <div class="overview-label">维修次数</div>
          </div>
          <div class="overview-item">
            <div class="overview-number">¥{{ overviewStats.totalRevenue.toLocaleString() }}</div>
            <div class="overview-label">总收入</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 本月数据 -->
    <div class="month-section">
      <div class="section-card">
        <div class="section-title">
          <el-icon><Calendar /></el-icon>
          <span>本月统计</span>
        </div>
        <div class="month-stats">
          <div class="month-row">
            <span class="month-label">维修服务</span>
            <span class="month-value primary">{{ monthStats.maintenance }}次</span>
          </div>
          <div class="month-row">
            <span class="month-label">营业收入</span>
            <span class="month-value success">¥{{ monthStats.revenue.toLocaleString() }}</span>
          </div>
          <div class="month-row">
            <span class="month-label">洗车服务</span>
            <span class="month-value info">{{ monthStats.wash }}次</span>
          </div>
          <div class="month-row">
            <span class="month-label">平均收入</span>
            <span class="month-value warning">¥{{ monthStats.avgRevenue }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 收入趋势 -->
    <div class="trend-section">
      <div class="section-card">
        <div class="section-title">
          <el-icon><TrendCharts /></el-icon>
          <span>收入趋势</span>
          <el-select v-model="selectedYear" size="small" class="year-select">
            <el-option 
              v-for="year in availableYears" 
              :key="year" 
              :label="year" 
              :value="year"
            />
          </el-select>
        </div>
        <div class="trend-chart">
          <div class="chart-header">{{ selectedYear }}年月度收入</div>
          <div class="chart-bars">
            <div 
              v-for="(month, index) in monthlyData" 
              :key="index"
              class="chart-bar"
              :class="{ active: month.cost > 0 }"
            >
              <div 
                class="bar-fill" 
                :style="{ height: getBarHeight(month.cost) + '%' }"
              ></div>
              <div class="bar-month">{{ month.month }}月</div>
              <div class="bar-amount" v-if="month.cost > 0">¥{{ month.cost }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 服务类型 -->
    <div class="service-section">
      <div class="section-card">
        <div class="section-title">
          <el-icon><PieChart /></el-icon>
          <span>服务类型分析</span>
        </div>
        <div class="service-list">
          <div 
            v-for="(item, index) in maintenanceTypes" 
            :key="index"
            class="service-item"
          >
            <div class="service-info">
              <div 
                class="service-dot" 
                :style="{ backgroundColor: getColor(index) }"
              ></div>
              <span class="service-name">{{ item.type }}</span>
            </div>
            <div class="service-stats">
              <span class="service-count">{{ item.count }}次</span>
              <span class="service-percent">{{ item.percentage }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 客户排行 -->
    <div class="ranking-section">
      <div class="section-card">
        <div class="section-title">
          <el-icon><Trophy /></el-icon>
          <span>客户贡献排行</span>
        </div>
        <div class="ranking-list">
          <div 
            v-for="(vehicle, index) in vehicleRanking.slice(0, 5)" 
            :key="vehicle.id"
            class="ranking-item"
            :class="{ top: index < 3 }"
          >
            <div class="ranking-badge" :class="getRankClass(index)">
              {{ index + 1 }}
            </div>
            <div class="ranking-info">
              <div class="vehicle-plate">{{ vehicle.plate_number }}</div>
              <div class="vehicle-info">{{ vehicle.brand }} {{ vehicle.model }}</div>
            </div>
            <div class="ranking-revenue">
              <div class="revenue-amount">¥{{ vehicle.totalRevenue.toLocaleString() }}</div>
              <div class="revenue-count">{{ vehicle.maintenanceCount }}次</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 最近活动 -->
    <div class="activity-section">
      <div class="section-card">
        <div class="section-title">
          <el-icon><Clock /></el-icon>
          <span>最近活动</span>
        </div>
        <div class="activity-list">
          <div 
            v-for="record in recentMaintenance.slice(0, 5)" 
            :key="record.id"
            class="activity-item"
          >
            <div class="activity-date">{{ formatActivityDate(record.date) }}</div>
            <div class="activity-info">
              <div class="activity-vehicle">{{ record.vehicleName }}</div>
              <div class="activity-type">{{ record.type }}</div>
            </div>
            <div class="activity-amount">¥{{ record.cost }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据洞察 -->
    <div class="insights-section" v-if="revenueAnalysis.length > 0">
      <div class="section-card">
        <div class="section-title">
          <el-icon><DataAnalysis /></el-icon>
          <span>数据洞察</span>
        </div>
        <div class="insights-list">
          <div 
            v-for="insight in revenueAnalysis.slice(0, 3)" 
            :key="insight.vehicleId"
            class="insight-item"
            :class="insight.level"
          >
            <div class="insight-icon">
              <el-icon v-if="insight.level === 'high'"><TrendCharts /></el-icon>
              <el-icon v-else><DataLine /></el-icon>
            </div>
            <div class="insight-content">
              <div class="insight-title">{{ insight.vehicleName }}</div>
              <div class="insight-desc">{{ insight.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部占位 -->
    <div class="bottom-spacer"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  ArrowRight as Car, 
  Setting as Tools, 
  Sunny, 
  Money, 
  WarningFilled, 
  Warning,
  Refresh,
  Calendar,
  TrendCharts,
  PieChart,
  Trophy,
  Clock,
  DataAnalysis,
  DataLine
} from '@element-plus/icons-vue'
import { vehicleService, maintenanceService, washService } from '../services/api'

// 响应式数据
const vehicles = ref([])
const allMaintenanceRecords = ref([])
const allWashRecords = ref([])
const selectedYear = ref(new Date().getFullYear())
const loading = ref(false)

// 总体统计数据
const overviewStats = computed(() => {
  const totalRevenue = allMaintenanceRecords.value.reduce((sum, record) => {
    const cost = parseFloat(record.cost) || 0
    return sum + cost
  }, 0)
  const totalWash = allWashRecords.value.reduce((sum, record) => sum + (record.count || 0), 0)
  
  return {
    totalVehicles: vehicles.value.length,
    totalMaintenance: allMaintenanceRecords.value.length,
    totalWash: totalWash,
    totalRevenue: totalRevenue
  }
})

// 可选年份
const availableYears = computed(() => {
  const years = new Set()
  allMaintenanceRecords.value.forEach(record => {
    if (record.date) {
      years.add(new Date(record.date).getFullYear())
    }
  })
  return Array.from(years).sort((a, b) => b - a)
})

// 月度数据
const monthlyData = computed(() => {
  const monthData = Array.from({ length: 12 }, (_, i) => ({ 
    month: i + 1, 
    cost: 0, 
    count: 0 
  }))
  
  allMaintenanceRecords.value.forEach(record => {
    if (record.date) {
      const date = new Date(record.date)
      if (date.getFullYear() === selectedYear.value) {
        const month = date.getMonth()
        monthData[month].cost += parseFloat(record.cost) || 0
        monthData[month].count += 1
      }
    }
  })
  
  return monthData
})

// 维修类型统计
const maintenanceTypes = computed(() => {
  const typeMap = new Map()
  const total = allMaintenanceRecords.value.length
  
  allMaintenanceRecords.value.forEach(record => {
    const type = record.type || '其他'
    typeMap.set(type, (typeMap.get(type) || 0) + 1)
  })
  
  return Array.from(typeMap.entries())
    .map(([type, count]) => ({
      type,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6) // 显示前6种类型
})

// 车辆排行
const vehicleRanking = computed(() => {
  return vehicles.value.map(vehicle => {
    const vehicleRecords = allMaintenanceRecords.value.filter(
      record => record.vehicle_id === vehicle.id
    )
    const totalRevenue = vehicleRecords.reduce((sum, record) => {
      const cost = parseFloat(record.cost) || 0
      return sum + cost
    }, 0)
    
    return {
      ...vehicle,
      totalRevenue,
      maintenanceCount: vehicleRecords.length
    }
  })
  .sort((a, b) => b.totalRevenue - a.totalRevenue)
  .slice(0, 8) // 显示前8名
})

// 最近维修记录
const recentMaintenance = computed(() => {
  return allMaintenanceRecords.value
    .map(record => {
      const vehicle = vehicles.value.find(v => v.id === record.vehicle_id)
      return {
        ...record,
        vehicleName: vehicle ? vehicle.plate_number : '未知车辆'
      }
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6) // 显示最近6条记录
})

// 维修地点统计
const locationStats = computed(() => {
  const locationMap = new Map()
  const total = allMaintenanceRecords.value.length
  
  allMaintenanceRecords.value.forEach(record => {
    const location = record.location || '其他'
    locationMap.set(location, (locationMap.get(location) || 0) + 1)
  })
  
  const maxCount = Math.max(...Array.from(locationMap.values()))
  
  return Array.from(locationMap.entries())
    .map(([name, count]) => ({
      name,
      count,
      percentage: maxCount > 0 ? Math.round((count / maxCount) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5) // 显示前5个地点
})

// 本月统计
const monthStats = computed(() => {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  
  const monthRecords = allMaintenanceRecords.value.filter(record => {
    if (!record.date) return false
    const date = new Date(record.date)
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear
  })
  
  const monthWash = allWashRecords.value.filter(record => {
    if (!record.date) return false
    const date = new Date(record.date)
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear
  }).reduce((sum, record) => sum + (record.count || 0), 0)
  
  const totalRevenue = monthRecords.reduce((sum, record) => {
    const cost = parseFloat(record.cost) || 0
    return sum + cost
  }, 0)
  const avgRevenue = monthRecords.length > 0 ? Math.round(totalRevenue / monthRecords.length) : 0
  
  return {
    maintenance: monthRecords.length,
    revenue: totalRevenue,
    wash: monthWash,
    avgRevenue
  }
})

// 收入分析
const revenueAnalysis = computed(() => {
  const analysis = []
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  vehicles.value.forEach(vehicle => {
    const vehicleRecords = allMaintenanceRecords.value.filter(
      record => record.vehicle_id === vehicle.id
    )
    
    if (vehicleRecords.length === 0) return
    
    // 计算月平均收入
    const totalRevenue = vehicleRecords.reduce((sum, record) => {
      const cost = parseFloat(record.cost) || 0
      return sum + cost
    }, 0)
    const avgMonthlyRevenue = totalRevenue / Math.max(vehicleRecords.length, 1)
    
    // 本月收入
    const thisMonthRevenue = vehicleRecords
      .filter(record => {
        if (!record.date) return false
        const date = new Date(record.date)
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear
      })
      .reduce((sum, record) => {
        const cost = parseFloat(record.cost) || 0
        return sum + cost
      }, 0)
    
    // 收入分析逻辑
    if (thisMonthRevenue > avgMonthlyRevenue * 2 && thisMonthRevenue > 1000) {
      analysis.push({
        vehicleId: vehicle.id,
        vehicleName: vehicle.plate_number,
        level: 'high',
        description: `本月收入表现优秀，为平均收入的${Math.round(thisMonthRevenue / avgMonthlyRevenue)}倍`
      })
    } else if (thisMonthRevenue > avgMonthlyRevenue * 1.5 && thisMonthRevenue > 500) {
      analysis.push({
        vehicleId: vehicle.id,
        vehicleName: vehicle.plate_number,
        level: 'medium',
        description: `本月收入良好，高于平均水平`
      })
    }
    
    // 维修频率分析
    const recentRecords = vehicleRecords.filter(record => {
      if (!record.date) return false
      const date = new Date(record.date)
      const threeMonthsAgo = new Date()
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
      return date >= threeMonthsAgo
    })
    
    if (recentRecords.length >= 5) {
      analysis.push({
        vehicleId: vehicle.id,
        vehicleName: vehicle.plate_number,
        level: 'medium',
        description: `近3个月维修频次较高，是稳定客户`
      })
    }
  })
  
  return analysis.slice(0, 4) // 最多显示4个分析结果
})

// 工具函数
const getBarHeight = (cost) => {
  const maxCost = Math.max(...monthlyData.value.map(m => m.cost))
  return maxCost > 0 ? (cost / maxCost) * 80 : 0
}

const getColor = (index) => {
  const colors = [
    '#409EFF', '#67C23A', '#E6A23C', '#F56C6C', 
    '#909399', '#C71585', '#FF6347', '#32CD32'
  ]
  return colors[index % colors.length]
}

const formatActivityDate = (dateString) => {
  if (!dateString) return '未知'
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return '今天'
  } else if (diffDays === 1) {
    return '昨天'
  } else if (diffDays < 7) {
    return `${diffDays}天前`
  } else {
    return `${date.getMonth() + 1}/${date.getDate()}`
  }
}

const getRankClass = (index) => {
  if (index === 0) return 'gold'
  if (index === 1) return 'silver'
  if (index === 2) return 'bronze'
  return 'normal'
}

// 数据获取函数
const fetchAllData = async () => {
  loading.value = true
  try {
    // 并行获取所有数据
    const [vehiclesData, maintenanceData, washData] = await Promise.allSettled([
      vehicleService.getAllVehicles(),
      getAllMaintenanceRecords(),
      getAllWashRecords()
    ])
    
    // 处理车辆数据
    if (vehiclesData.status === 'fulfilled') {
      vehicles.value = vehiclesData.value || []
    } else {
      console.error('获取车辆数据失败:', vehiclesData.reason)
    }
    
    // 处理维修记录数据
    if (maintenanceData.status === 'fulfilled') {
      allMaintenanceRecords.value = maintenanceData.value || []
    } else {
      console.error('获取维修记录失败:', maintenanceData.reason)
    }
    
    // 处理洗车记录数据
    if (washData.status === 'fulfilled') {
      allWashRecords.value = washData.value || []
    } else {
      console.error('获取洗车记录失败:', washData.reason)
    }
    
  } catch (error) {
    console.error('获取统计数据失败:', error)
    ElMessage.error('获取统计数据失败')
  } finally {
    loading.value = false
  }
}

// 获取所有维修记录
const getAllMaintenanceRecords = async () => {
  try {
    const vehicles = await vehicleService.getAllVehicles()
    const allRecords = []
    
    // 为每辆车获取维修记录
    for (const vehicle of vehicles) {
      try {
        const records = await maintenanceService.getMaintenanceRecords(vehicle.id)
        allRecords.push(...records)
      } catch (error) {
        console.error(`获取车辆 ${vehicle.id} 的维修记录失败:`, error)
      }
    }
    
    return allRecords
  } catch (error) {
    console.error('获取所有维修记录失败:', error)
    return []
  }
}

// 获取所有洗车记录
const getAllWashRecords = async () => {
  try {
    const vehicles = await vehicleService.getAllVehicles()
    const allRecords = []
    
    // 为每辆车获取洗车记录
    for (const vehicle of vehicles) {
      try {
        const records = await washService.getWashRecords(vehicle.id)
        allRecords.push(...records)
      } catch (error) {
        console.error(`获取车辆 ${vehicle.id} 的洗车记录失败:`, error)
      }
    }
    
    return allRecords
  } catch (error) {
    console.error('获取所有洗车记录失败:', error)
    return []
  }
}

// 页面加载时获取数据
onMounted(() => {
  // 设置默认年份
  if (availableYears.value.length > 0) {
    selectedYear.value = availableYears.value[0]
  }
  
  fetchAllData()
})
</script>

<style scoped>
.statistics-mobile {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-section h2 {
  margin: 0;
  color: #303133;
  font-size: 1.5rem;
  line-height: 50px;
}

.refresh-btn {
  cursor: pointer;
  color: #409eff;
  font-size: 14px;
}

.overview-section {
  margin-bottom: 24px;
}

.overview-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.overview-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.overview-item {
  text-align: center;
}

.overview-number {
  font-size: 32px;
  font-weight: bold;
  color: #303133;
  line-height: 1;
  margin-bottom: 4px;
}

.overview-label {
  color: #909399;
  font-size: 14px;
}

.month-section {
  margin-bottom: 24px;
}

.section-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
}

.month-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.month-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.month-label {
  color: #606266;
  font-size: 14px;
}

.month-value {
  font-weight: 600;
  color: #303133;
  font-size: 16px;
}

.primary {
  color: #409eff;
}

.success {
  color: #67c23a;
}

.info {
  color: #909399;
}

.warning {
  color: #f56c6c;
}

.trend-section {
  margin-bottom: 24px;
}

.trend-chart {
  height: 280px;
  padding: 20px;
}

.chart-header {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
  text-align: center;
}

.chart-bars {
  flex: 1;
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 8px;
  padding: 0 10px;
}

.chart-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100px;
}

.bar-fill {
  width: 100%;
  background: linear-gradient(to top, #409eff, #66b1ff);
  border-radius: 4px 4px 0 0;
  min-height: 4px;
  transition: height 0.3s ease;
}

.bar-month {
  font-size: 12px;
  color: #606266;
  margin-top: 8px;
}

.bar-amount {
  font-size: 10px;
  color: #909399;
  margin-top: 2px;
}

.service-section {
  margin-bottom: 24px;
}

.service-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 10px;
}

.service-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.service-info {
  flex: 1;
}

.service-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  flex-shrink: 0;
}

.service-name {
  flex: 1;
  font-size: 14px;
  color: #303133;
}

.service-stats {
  text-align: right;
}

.ranking-section {
  margin-bottom: 24px;
}

.ranking-list {
  max-height: 280px;
  overflow-y: auto;
  padding: 0 10px;
}

.ranking-item {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.ranking-item:hover {
  background: #e1f3ff;
}

.ranking-badge {
  width: 32px;
  height: 32px;
  background: #409eff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  margin-right: 12px;
}

.ranking-badge.gold {
  background: linear-gradient(135deg, #ffd700, #ffb000);
}

.ranking-badge.silver {
  background: linear-gradient(135deg, #c0c0c0, #999999);
}

.ranking-badge.bronze {
  background: linear-gradient(135deg, #cd7f32, #b87333);
}

.ranking-info {
  flex: 1;
}

.vehicle-plate {
  font-weight: 600;
  color: #303133;
  margin-bottom: 2px;
}

.vehicle-info {
  font-size: 12px;
  color: #909399;
}

.ranking-revenue {
  text-align: right;
}

.activity-section {
  margin-bottom: 24px;
}

.activity-list {
  max-height: 280px;
  overflow-y: auto;
  padding: 0 10px;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  background: #f8f9fa;
  border-radius: 8px;
  gap: 12px;
}

.activity-date {
  font-size: 12px;
  color: #409eff;
  font-weight: 500;
  min-width: 40px;
}

.activity-info {
  flex: 1;
}

.activity-vehicle {
  font-weight: 500;
  color: #303133;
  margin-bottom: 2px;
}

.activity-type {
  font-size: 12px;
  color: #606266;
}

.activity-amount {
  font-weight: 600;
  color: #e6a23c;
}

.insights-section {
  margin-bottom: 24px;
}

.insights-list {
  max-height: 280px;
  overflow-y: auto;
  padding: 0 10px;
}

.insight-item {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 8px;
  gap: 12px;
}

.insight-icon {
  color: #409eff;
}

.insight-content {
  flex: 1;
}

.insight-title {
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.insight-desc {
  font-size: 12px;
  color: #606266;
  line-height: 1.4;
}

.bottom-spacer {
  height: 20px;
}

.year-select {
  width: 80px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-section {
    margin-bottom: 16px;
  }

  .header-section h2 {
    font-size: 1.5rem;
    line-height: 50px;
  }

  .overview-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .section-card {
    padding: 16px;
  }

  .section-title {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 16px;
  }

  .section-title span {
    margin-top: 8px;
  }

  .month-stats {
    padding: 0 10px;
  }

  .month-row {
    padding: 12px 0;
  }

  .month-label {
    font-size: 14px;
  }

  .month-value {
    font-size: 18px;
  }

  .trend-chart {
    height: 300px;
    padding: 16px;
  }

  .chart-header {
    font-size: 14px;
    margin-bottom: 16px;
  }

  .chart-bars {
    gap: 2px;
    padding: 0 5px;
  }

  .bar-fill {
    height: 10px;
  }

  .bar-month {
    font-size: 10px;
    margin-top: 6px;
  }

  .bar-amount {
    font-size: 8px;
  }

  .service-list {
    padding: 0 5px;
  }

  .service-item {
    padding: 10px;
    font-size: 13px;
  }

  .ranking-list {
    max-height: 300px;
    padding: 0 5px;
  }

  .ranking-item {
    padding: 12px;
    margin-bottom: 8px;
  }

  .ranking-badge {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }

  .vehicle-plate {
    font-size: 15px;
  }

  .vehicle-info {
    font-size: 12px;
  }

  .activity-list {
    max-height: 300px;
    padding: 0 5px;
  }

  .activity-item {
    padding: 12px;
    margin-bottom: 8px;
  }

  .activity-date {
    font-size: 10px;
  }

  .activity-vehicle {
    font-size: 15px;
  }

  .activity-type {
    font-size: 12px;
  }

  .activity-amount {
    font-size: 16px;
  }

  .insights-list {
    padding: 0 5px;
  }

  .insight-item {
    padding: 14px;
    margin-bottom: 10px;
  }

  .insight-icon {
    color: #409eff;
  }

  .insight-title {
    font-size: 15px;
  }

  .insight-desc {
    font-size: 13px;
    line-height: 1.5;
  }

  .bottom-spacer {
    height: 10px;
  }
}

/* 超小屏幕优化 */
@media (max-width: 480px) {
  .statistics-mobile {
    padding: 4px;
  }

  .header-section {
    margin-bottom: 16px;
  }

  .header-section h2 {
    font-size: 1.5rem;
    line-height: 50px;
  }

  .overview-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .section-card {
    padding: 12px;
  }

  .section-title {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 16px;
  }

  .section-title span {
    margin-top: 8px;
  }

  .month-stats {
    padding: 0 5px;
  }

  .month-row {
    padding: 14px 0;
  }

  .month-label {
    font-size: 14px;
  }

  .month-value {
    font-size: 18px;
  }

  .trend-chart {
    height: 280px;
    padding: 12px;
  }

  .chart-header {
    font-size: 14px;
    margin-bottom: 16px;
  }

  .chart-bars {
    gap: 2px;
    padding: 0 5px;
  }

  .bar-fill {
    height: 10px;
  }

  .bar-month {
    font-size: 10px;
    margin-top: 6px;
  }

  .bar-amount {
    font-size: 8px;
  }

  .service-list {
    padding: 0 5px;
  }

  .service-item {
    padding: 10px;
    font-size: 13px;
  }

  .ranking-list {
    max-height: 300px;
    padding: 0 5px;
  }

  .ranking-item {
    padding: 12px;
    margin-bottom: 8px;
  }

  .ranking-badge {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }

  .vehicle-plate {
    font-size: 15px;
  }

  .vehicle-info {
    font-size: 12px;
  }

  .activity-list {
    max-height: 300px;
    padding: 0 5px;
  }

  .activity-item {
    padding: 12px;
    margin-bottom: 8px;
  }

  .activity-date {
    font-size: 10px;
  }

  .activity-vehicle {
    font-size: 15px;
  }

  .activity-type {
    font-size: 12px;
  }

  .activity-amount {
    font-size: 16px;
  }

  .insights-list {
    padding: 0 5px;
  }

  .insight-item {
    padding: 14px;
    margin-bottom: 10px;
  }

  .insight-icon {
    color: #409eff;
  }

  .insight-title {
    font-size: 15px;
  }

  .insight-desc {
    font-size: 13px;
    line-height: 1.5;
  }

  .bottom-spacer {
    height: 10px;
  }
}
</style> 