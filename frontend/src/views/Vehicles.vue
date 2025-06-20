<template>
  <div class="mobile-vehicles">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">车辆管理</h1>
      <div class="header-actions">
        <el-button 
          type="primary" 
          @click="showAddDialog"
          class="add-btn"
        >
          <el-icon><Plus /></el-icon>
          添加车辆
        </el-button>
      </div>
    </div>

    <!-- 搜索栏 -->
    <div class="search-section">
      <el-input
        v-model="searchQuery"
        placeholder="搜索车牌号、品牌或车主"
        size="large"
        clearable
        @input="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <!-- 车辆列表 -->
    <div class="vehicles-list" v-loading="loading">
      <div v-if="filteredVehicles.length === 0 && !loading" class="empty-state">
        <div class="empty-icon">
          <el-icon size="48"><Management /></el-icon>
        </div>
        <h3>暂无车辆记录</h3>
        <p>点击上方按钮添加第一辆车</p>
      </div>

      <div v-else class="vehicle-cards">
        <div 
          v-for="vehicle in filteredVehicles" 
          :key="vehicle.id"
          class="vehicle-card"
          @click="viewVehicleDetails(vehicle)"
        >
          <div class="card-header">
            <div class="plate-number">{{ vehicle.plate_number }}</div>
            <div class="actions" @click.stop>
              <el-dropdown trigger="click">
                <el-button text>
                  <el-icon><More /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="editVehicle(vehicle)">
                      <el-icon><Edit /></el-icon> 编辑
                    </el-dropdown-item>
                    <el-dropdown-item @click="viewMaintenance(vehicle)">
                      <el-icon><Tools /></el-icon> 维修记录
                    </el-dropdown-item>
                    <el-dropdown-item @click="deleteVehicle(vehicle)" divided>
                      <el-icon><Delete /></el-icon> 删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>

          <div class="card-content">
            <div class="vehicle-info">
              <div class="info-item">
                <span class="label">品牌型号</span>
                <span class="value">{{ vehicle.brand }} {{ vehicle.model }}</span>
              </div>
              <div class="info-item" v-if="vehicle.year">
                <span class="label">年份</span>
                <span class="value">{{ vehicle.year }}年</span>
              </div>
              <div class="info-item" v-if="vehicle.owner_name">
                <span class="label">车主</span>
                <span class="value">{{ vehicle.owner_name }}</span>
              </div>
              <div class="info-item" v-if="vehicle.owner_phone">
                <span class="label">电话</span>
                <span class="value">{{ vehicle.owner_phone }}</span>
              </div>
            </div>
          </div>

          <div class="card-footer">
            <div class="stats">
              <span class="stat-item">
                <el-icon><Tools /></el-icon>
                {{ vehicleStats[vehicle.id]?.maintenanceCount || 0 }} 次维修
              </span>
              <span class="stat-item">
                <el-icon><Money /></el-icon>
                ¥{{ vehicleStats[vehicle.id]?.totalCost || 0 }}
              </span>
            </div>
            <div class="date">
              添加于 {{ formatDate(vehicle.created_at) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑车辆对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditing ? '编辑车辆' : '添加车辆'"
      :width="isMobile ? '90%' : '500px'"
      class="mobile-dialog"
    >
      <el-form 
        :model="vehicleForm" 
        :rules="formRules"
        ref="formRef"
        label-position="top"
        class="mobile-form"
      >
        <el-form-item label="车牌号" prop="plate_number">
          <el-input 
            v-model="vehicleForm.plate_number" 
            placeholder="请输入车牌号"
            size="large"
          />
        </el-form-item>
        
        <el-form-item label="车架号" prop="vin">
          <el-input 
            v-model="vehicleForm.vin" 
            placeholder="请输入车架号（可选）"
            size="large"
          />
        </el-form-item>
        
        <el-form-item label="品牌" prop="brand">
          <el-input 
            v-model="vehicleForm.brand" 
            placeholder="请输入车辆品牌"
            size="large"
          />
        </el-form-item>
        
        <el-form-item label="型号" prop="model">
          <el-input 
            v-model="vehicleForm.model" 
            placeholder="请输入车辆型号"
            size="large"
          />
        </el-form-item>
        
        <el-form-item label="年份" prop="year">
          <el-input-number 
            v-model="vehicleForm.year" 
            :min="1900" 
            :max="2030"
            size="large"
            controls-position="right"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="车主姓名" prop="owner_name">
          <el-input 
            v-model="vehicleForm.owner_name" 
            placeholder="请输入车主姓名（可选）"
            size="large"
          />
        </el-form-item>
        
        <el-form-item label="联系电话" prop="owner_phone">
          <el-input 
            v-model="vehicleForm.owner_phone" 
            placeholder="请输入联系电话（可选）"
            size="large"
          />
        </el-form-item>
        
        <el-form-item label="联系地址" prop="owner_address">
          <el-input 
            v-model="vehicleForm.owner_address" 
            placeholder="请输入联系地址（可选）"
            size="large"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button size="large" @click="dialogVisible = false">
            取消
          </el-button>
          <el-button 
            type="primary" 
            size="large" 
            @click="handleSubmit" 
            :loading="submitting"
          >
            {{ isEditing ? '更新' : '添加' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Plus, 
  Search, 
  Management, 
  More, 
  Edit, 
  Tools, 
  Delete,
  Money
} from '@element-plus/icons-vue'
import { vehicleService, maintenanceService } from '../services/api'

const router = useRouter()
const loading = ref(false)
const dialogVisible = ref(false)
const isEditing = ref(false)
const submitting = ref(false)
const searchQuery = ref('')
const vehicles = ref([])
const vehicleStats = ref({})
const formRef = ref()
const isMobile = ref(true)

const vehicleForm = ref({
  plate_number: '',
  vin: '',
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  owner_name: '',
  owner_phone: '',
  owner_address: ''
})

const formRules = {
  plate_number: [
    { required: true, message: '请输入车牌号', trigger: 'blur' }
  ],
  brand: [
    { required: true, message: '请输入车辆品牌', trigger: 'blur' }
  ],
  model: [
    { required: true, message: '请输入车辆型号', trigger: 'blur' }
  ],
  owner_phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
}

// 过滤后的车辆列表
const filteredVehicles = computed(() => {
  if (!searchQuery.value) return vehicles.value
  
  const query = searchQuery.value.toLowerCase()
  return vehicles.value.filter(vehicle => 
    vehicle.plate_number.toLowerCase().includes(query) ||
    vehicle.brand.toLowerCase().includes(query) ||
    vehicle.model.toLowerCase().includes(query) ||
    (vehicle.owner_name && vehicle.owner_name.toLowerCase().includes(query))
  )
})

// 获取车辆列表
const fetchVehicles = async () => {
  try {
    loading.value = true
    const response = await vehicleService.getAllVehicles()
    vehicles.value = response || []
    
    // 获取每辆车的统计信息
    await fetchVehicleStats()
  } catch (error) {
    console.error('获取车辆列表失败:', error)
    ElMessage.error('获取车辆列表失败')
  } finally {
    loading.value = false
  }
}

// 获取车辆统计信息
const fetchVehicleStats = async () => {
  const stats = {}
  
  for (const vehicle of vehicles.value) {
    try {
      const maintenanceRecords = await maintenanceService.getMaintenanceRecords(vehicle.id)
      stats[vehicle.id] = {
        maintenanceCount: maintenanceRecords.length,
        totalCost: maintenanceRecords.reduce((sum, record) => sum + (parseFloat(record.cost) || 0), 0)
      }
    } catch (error) {
      stats[vehicle.id] = { maintenanceCount: 0, totalCost: 0 }
    }
  }
  
  vehicleStats.value = stats
}

// 搜索处理
const handleSearch = () => {
  // 搜索是响应式的，不需要额外处理
}

// 显示添加对话框
const showAddDialog = () => {
  isEditing.value = false
  vehicleForm.value = {
    plate_number: '',
    vin: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    owner_name: '',
    owner_phone: '',
    owner_address: ''
  }
  dialogVisible.value = true
}

// 编辑车辆
const editVehicle = (vehicle) => {
  isEditing.value = true
  vehicleForm.value = { ...vehicle }
  dialogVisible.value = true
}

// 查看车辆详情
const viewVehicleDetails = (vehicle) => {
  router.push(`/maintenance/${vehicle.id}`)
}

// 查看维修记录
const viewMaintenance = (vehicle) => {
  router.push(`/maintenance/${vehicle.id}`)
}

// 删除车辆
const deleteVehicle = async (vehicle) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除车辆 ${vehicle.plate_number} 吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    await vehicleService.deleteVehicle(vehicle.id)
    ElMessage.success('删除成功')
    await fetchVehicles()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除车辆失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    const valid = await formRef.value.validate()
    if (!valid) return
    
    submitting.value = true
    
    if (isEditing.value) {
      await vehicleService.updateVehicle(vehicleForm.value.id, vehicleForm.value)
      ElMessage.success('更新成功')
    } else {
      await vehicleService.createVehicle(vehicleForm.value)
      ElMessage.success('添加成功')
    }
    
    dialogVisible.value = false
    await fetchVehicles()
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error(isEditing.value ? '更新失败' : '添加失败')
  } finally {
    submitting.value = false
  }
}

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString()
}

onMounted(() => {
  fetchVehicles()
})
</script>

<style scoped>
.mobile-vehicles {
  padding: 0;
  background: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  background: linear-gradient(135deg, #007AFF, #0056CC);
  color: white;
  padding: 20px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.add-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 12px;
  padding: 8px 16px;
}

.add-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.search-section {
  padding: 16px;
  background: white;
  border-bottom: 1px solid #f0f0f0;
}

.vehicles-list {
  padding: 16px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.empty-icon {
  color: #c0c4cc;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 18px;
  color: #666666;
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 14px;
  color: #999999;
  margin: 0;
}

.vehicle-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.vehicle-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
}

.vehicle-card:active {
  transform: scale(0.98);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px 12px 20px;
  border-bottom: 1px solid #f5f5f5;
}

.plate-number {
  font-size: 20px;
  font-weight: 700;
  color: #007AFF;
}

.actions {
  color: #666666;
}

.card-content {
  padding: 16px 20px;
}

.vehicle-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-item .label {
  font-size: 12px;
  color: #666666;
  font-weight: 500;
}

.info-item .value {
  font-size: 14px;
  color: #333333;
  font-weight: 500;
}

.card-footer {
  padding: 12px 20px 16px 20px;
  background: #f8f9fa;
  border-top: 1px solid #f0f0f0;
}

.stats {
  display: flex;
  gap: 16px;
  margin-bottom: 8px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666666;
}

.stat-item .el-icon {
  font-size: 14px;
}

.date {
  font-size: 11px;
  color: #999999;
}

.mobile-dialog {
  border-radius: 16px;
}

.mobile-form {
  padding: 0;
}

.mobile-form .el-form-item {
  margin-bottom: 20px;
}

.mobile-form .el-form-item__label {
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 8px;
}

.dialog-footer {
  display: flex;
  gap: 12px;
  padding: 0;
  margin-top: 20px;
}

.dialog-footer .el-button {
  flex: 1;
  height: 48px;
  font-size: 16px;
}

/* 响应式优化 */
@media (max-width: 380px) {
  .page-header {
    padding: 16px 12px;
  }
  
  .page-title {
    font-size: 20px;
  }
  
  .add-btn {
    padding: 6px 12px;
    font-size: 14px;
  }
  
  .search-section {
    padding: 12px;
  }
  
  .vehicles-list {
    padding: 12px;
  }
  
  .vehicle-cards {
    gap: 8px;
  }
  
  .card-header {
    padding: 12px 16px 8px 16px;
  }
  
  .plate-number {
    font-size: 18px;
  }
  
  .card-content {
    padding: 12px 16px;
  }
  
  .card-footer {
    padding: 8px 16px 12px 16px;
  }
}
</style> 