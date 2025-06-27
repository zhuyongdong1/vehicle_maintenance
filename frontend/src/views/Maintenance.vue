<template>
  <div class="mobile-maintenance">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">维修记录</h1>
        <el-button 
          type="primary" 
          @click="showAddRecord"
          class="add-btn"
        >
          <el-icon><Plus /></el-icon>
          添加记录
        </el-button>
      </div>
    </div>

    <!-- 车辆选择 -->
    <div class="vehicle-section">
      <el-select
        v-model="selectedVehicleId"
        placeholder="选择车辆"
        size="large"
        @change="handleVehicleChange"
        class="vehicle-select"
      >
        <el-option
          v-for="vehicle in vehicles"
          :key="vehicle.id"
          :label="`${vehicle.plate_number} - ${vehicle.brand} ${vehicle.model}`"
          :value="vehicle.id"
        />
      </el-select>
    </div>

    <!-- 车辆信息卡片 -->
    <div v-if="selectedVehicle" class="vehicle-info-card">
      <div class="vehicle-plate">{{ selectedVehicle.plate_number }}</div>
      <div class="vehicle-details">
        <div class="detail-item">
          <span class="label">品牌型号</span>
          <span class="value">{{ selectedVehicle.brand }} {{ selectedVehicle.model }}</span>
        </div>
        <div class="detail-item" v-if="selectedVehicle.year">
          <span class="label">年份</span>
          <span class="value">{{ selectedVehicle.year }}年</span>
        </div>
        <div class="detail-item" v-if="selectedVehicle.owner_name">
          <span class="label">车主</span>
          <span class="value">{{ selectedVehicle.owner_name }}</span>
        </div>
      </div>
      <div class="vehicle-stats">
        <div class="stat-item">
          <span class="stat-number">{{ maintenanceRecords.length }}</span>
          <span class="stat-label">维修次数</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">¥{{ totalCost }}</span>
          <span class="stat-label">总费用</span>
        </div>
      </div>
    </div>

    <!-- 维修记录列表 -->
    <div class="records-section" v-if="selectedVehicle">
      <div v-if="maintenanceRecords.length === 0" class="empty-state">
        <div class="empty-icon">
          <el-icon size="48"><Tools /></el-icon>
        </div>
        <h3>暂无维修记录</h3>
        <p>点击上方按钮添加第一条记录</p>
      </div>

      <div v-else class="records-list">
        <div 
          v-for="record in maintenanceRecords" 
          :key="record.id"
          class="record-card"
        >
          <div class="record-header">
            <div class="record-type">{{ record.type }}</div>
            <div class="record-actions" @click.stop>
              <el-dropdown trigger="click">
                <el-button text>
                  <el-icon><More /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="editRecord(record)">
                      <el-icon><Edit /></el-icon> 编辑
                    </el-dropdown-item>
                    <el-dropdown-item @click="deleteRecord(record)" divided>
                      <el-icon><Delete /></el-icon> 删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>

          <div class="record-content">
            <div class="record-info">
              <div class="info-row">
                <span class="label">日期</span>
                <span class="value">{{ formatDate(record.date) }}</span>
              </div>
              <div class="info-row">
                <span class="label">费用</span>
                <span class="value cost">¥{{ record.cost }}</span>
              </div>
              <div class="info-row" v-if="record.location">
                <span class="label">地点</span>
                <span class="value">{{ record.location }}</span>
              </div>
              <div class="info-row" v-if="record.description">
                <span class="label">描述</span>
                <span class="value description">{{ record.description }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 无车辆选择时的提示 -->
    <div v-else class="no-vehicle-state">
      <div class="empty-icon">
        <el-icon size="48"><Management /></el-icon>
      </div>
      <h3>请先选择车辆</h3>
      <p>从上方下拉菜单中选择要查看的车辆</p>
    </div>

    <!-- 添加/编辑记录对话框 -->
    <el-dialog
      v-model="recordDialogVisible"
      :title="isEditingRecord ? '编辑维修记录' : '添加维修记录'"
      :width="isMobile ? '90%' : '500px'"
      class="mobile-dialog"
    >
      <el-form 
        :model="recordForm" 
        :rules="recordRules"
        ref="recordFormRef"
        label-position="top"
        class="mobile-form"
      >
        <el-form-item label="维修日期" prop="date">
          <el-date-picker
            v-model="recordForm.date"
            type="date"
            placeholder="选择日期"
            size="large"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="维修类型" prop="type">
          <el-input 
            v-model="recordForm.type" 
            placeholder="如：保养、轮胎更换、发动机维修等"
            size="large"
          />
        </el-form-item>
        
        <el-form-item label="维修费用" prop="cost">
          <el-input-number 
            v-model="recordForm.cost" 
            :min="0"
            :precision="2"
            size="large"
            style="width: 100%"
            placeholder="0.00"
          />
        </el-form-item>
        
        <el-form-item label="维修地点" prop="location">
          <el-input 
            v-model="recordForm.location" 
            placeholder="请输入维修地点（可选）"
            size="large"
          />
        </el-form-item>
        
        <el-form-item label="维修描述" prop="description">
          <el-input 
            v-model="recordForm.description" 
            type="textarea"
            :rows="3"
            placeholder="请输入维修详细描述（可选）"
            resize="none"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button size="large" @click="recordDialogVisible = false">
            取消
          </el-button>
          <el-button 
            type="primary" 
            size="large" 
            @click="handleRecordSubmit" 
            :loading="submitting"
          >
            {{ isEditingRecord ? '更新' : '添加' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Plus, 
  Tools, 
  Management, 
  More, 
  Edit, 
  Delete 
} from '@element-plus/icons-vue'
import { vehicleService, maintenanceService } from '../services/api'

const route = useRoute()
const vehicles = ref([])
const selectedVehicleId = ref(null)
const selectedVehicle = ref(null)
const maintenanceRecords = ref([])
const recordDialogVisible = ref(false)
const isEditingRecord = ref(false)
const submitting = ref(false)
const recordFormRef = ref()
const isMobile = ref(true)

const recordForm = ref({
  date: null,
  type: '',
  cost: 0,
  location: '',
  description: ''
})

const recordRules = {
  date: [
    { required: true, message: '请选择维修日期', trigger: 'change' }
  ],
  type: [
    { required: true, message: '请输入维修类型', trigger: 'blur' }
  ],
  cost: [
    { required: true, message: '请输入维修费用', trigger: 'blur' }
  ]
}

// 计算总费用
const totalCost = computed(() => {
  return maintenanceRecords.value.reduce((sum, record) => {
    return sum + (parseFloat(record.cost) || 0)
  }, 0)
})

// 获取车辆列表
const fetchVehicles = async () => {
  try {
    const response = await vehicleService.getAllVehicles()
    vehicles.value = response || []
    
    // 如果URL中有vehicleId参数，自动选择该车辆
    const vehicleIdFromRoute = route.params.vehicleId
    if (vehicleIdFromRoute) {
      selectedVehicleId.value = parseInt(vehicleIdFromRoute)
    } else if (vehicles.value.length > 0) {
      selectedVehicleId.value = vehicles.value[0].id
    }
  } catch (error) {
    console.error('获取车辆列表失败:', error)
    ElMessage.error('获取车辆列表失败')
  }
}

// 获取维修记录
const fetchMaintenanceRecords = async (vehicleId) => {
  if (!vehicleId) return
  
  try {
    const records = await maintenanceService.getMaintenanceRecords(vehicleId)
    maintenanceRecords.value = records || []
  } catch (error) {
    console.error('获取维修记录失败:', error)
    ElMessage.error('获取维修记录失败')
    maintenanceRecords.value = []
  }
}

// 处理车辆切换
const handleVehicleChange = (vehicleId) => {
  if (vehicleId) {
    selectedVehicle.value = vehicles.value.find(v => v.id === vehicleId)
    fetchMaintenanceRecords(vehicleId)
  } else {
    selectedVehicle.value = null
    maintenanceRecords.value = []
  }
}

// 显示添加记录对话框
const showAddRecord = () => {
  if (!selectedVehicleId.value) {
    ElMessage.warning('请先选择车辆')
    return
  }
  
  isEditingRecord.value = false
  recordForm.value = {
    date: new Date(),
    type: '',
    cost: 0,
    location: '',
    description: ''
  }
  recordDialogVisible.value = true
}

// 编辑记录
const editRecord = (record) => {
  isEditingRecord.value = true
  recordForm.value = {
    id: record.id,
    date: new Date(record.date),
    type: record.type,
    cost: parseFloat(record.cost),
    location: record.location || '',
    description: record.description || ''
  }
  recordDialogVisible.value = true
}

// 删除记录
const deleteRecord = async (record) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除这条维修记录吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    await maintenanceService.deleteMaintenanceRecord(record.id)
    ElMessage.success('删除成功')
    await fetchMaintenanceRecords(selectedVehicleId.value)
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除维修记录失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 提交记录表单
const handleRecordSubmit = async () => {
  if (!recordFormRef.value) return
  
  try {
    const valid = await recordFormRef.value.validate()
    if (!valid) return
    
    submitting.value = true
    
    const recordData = {
      vehicle_id: selectedVehicleId.value,
      date: recordForm.value.date.toISOString().split('T')[0],
      type: recordForm.value.type,
      cost: recordForm.value.cost,
      location: recordForm.value.location || '',
      description: recordForm.value.description || ''
    }
    
    if (isEditingRecord.value) {
      await maintenanceService.updateMaintenanceRecord(recordForm.value.id, recordData)
      ElMessage.success('更新成功')
    } else {
      await maintenanceService.createMaintenanceRecord(recordData)
      ElMessage.success('添加成功')
    }
    
    recordDialogVisible.value = false
    await fetchMaintenanceRecords(selectedVehicleId.value)
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error(isEditingRecord.value ? '更新失败' : '添加失败')
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

// 监听选中车辆变化
watch(selectedVehicleId, (newVehicleId) => {
  if (newVehicleId) {
    handleVehicleChange(newVehicleId)
  }
})

onMounted(() => {
  fetchVehicles()
})
</script>

<style scoped>
.mobile-maintenance {
  padding: 0;
  background: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  background: linear-gradient(135deg, var(--apple-blue), #0056CC);
  color: white;
  padding: 20px 16px;
}

.header-content {
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

.vehicle-section {
  padding: 16px;
  background: white;
  border-bottom: 1px solid #f0f0f0;
}

.vehicle-select {
  width: 100%;
}

.vehicle-info-card {
  background: white;
  margin: 16px;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.vehicle-plate {
  font-size: 24px;
  font-weight: 700;
  color: var(--apple-blue);
  margin-bottom: 16px;
  text-align: center;
}

.vehicle-details {
  margin-bottom: 16px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-item .label {
  font-size: 14px;
  color: #666666;
  font-weight: 500;
}

.detail-item .value {
  font-size: 14px;
  color: #333333;
  font-weight: 500;
}

.vehicle-stats {
  display: flex;
  justify-content: space-around;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
  margin-top: 16px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: var(--apple-blue);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #666666;
}

.records-section {
  padding: 16px;
}

.empty-state,
.no-vehicle-state {
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

.empty-state h3,
.no-vehicle-state h3 {
  font-size: 18px;
  color: #666666;
  margin: 0 0 8px 0;
}

.empty-state p,
.no-vehicle-state p {
  font-size: 14px;
  color: #999999;
  margin: 0;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.record-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px 12px 20px;
  border-bottom: 1px solid #f5f5f5;
}

.record-type {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
}

.record-actions {
  color: #666666;
}

.record-content {
  padding: 16px 20px;
}

.record-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.info-row .label {
  font-size: 14px;
  color: #666666;
  font-weight: 500;
  min-width: 60px;
}

.info-row .value {
  font-size: 14px;
  color: #333333;
  flex: 1;
  text-align: right;
}

.info-row .value.cost {
  color: #ff6b35;
  font-weight: 600;
}

.info-row .value.description {
  text-align: left;
  margin-left: 16px;
  color: #666666;
  line-height: 1.4;
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
  
  .vehicle-section {
    padding: 12px;
  }
  
  .vehicle-info-card {
    margin: 12px;
    padding: 16px;
  }
  
  .vehicle-plate {
    font-size: 20px;
  }
  
  .records-section {
    padding: 12px;
  }
  
  .records-list {
    gap: 8px;
  }
  
  .record-header {
    padding: 12px 16px 8px 16px;
  }
  
  .record-type {
    font-size: 16px;
  }
  
  .record-content {
    padding: 12px 16px;
  }
  
  .vehicle-stats {
    padding: 12px;
  }
  
  .stat-number {
    font-size: 18px;
  }
}
</style> 