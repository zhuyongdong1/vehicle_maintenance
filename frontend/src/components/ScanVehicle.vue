<template>
  <div class="mobile-scan">
    <!-- 页面标题 -->
    <div class="scan-header">
      <h1 class="page-title">车辆扫描</h1>
      <p class="page-subtitle">拍照识别车牌和车架号</p>
    </div>

    <!-- 扫描按钮区域 -->
    <div class="scan-actions" v-if="!scanResult">
      <div class="camera-section">
        <div class="camera-button" @click="takePhoto" v-if="isMobile">
          <div class="camera-icon">
            <el-icon size="48"><CameraFilled /></el-icon>
          </div>
          <h3>拍照扫描</h3>
          <p>对准车牌或车架号拍照</p>
        </div>

        <div class="gallery-button" @click="selectFromGallery" v-if="isMobile">
          <div class="gallery-icon">
            <el-icon size="48"><Picture /></el-icon>
          </div>
          <h3>从相册选择</h3>
          <p>选择已有的照片</p>
        </div>

        <!-- 桌面端上传 -->
        <div class="upload-section" v-if="!isMobile">
          <el-upload
            class="upload-area"
            :show-file-list="false"
            :before-upload="() => false"
            accept="image/*"
            @change="handleImageChange"
          >
            <div class="upload-content">
              <el-icon size="48"><CameraFilled /></el-icon>
              <h3>选择图片文件</h3>
              <p>支持车牌和车架号识别</p>
            </div>
          </el-upload>
        </div>
      </div>

      <div class="divider">
        <span>或者</span>
      </div>

      <div class="manual-section">
        <el-button 
          type="default" 
          size="large" 
          @click="showManualInput"
          class="manual-btn"
        >
          <el-icon><Edit /></el-icon>
          手动输入车辆信息
        </el-button>
      </div>
    </div>

    <!-- 扫描结果 -->
    <div v-if="scanResult" class="scan-result">
      <div class="result-header">
        <el-icon size="32" color="#00C851"><CheckCircleFilled /></el-icon>
        <h3>识别完成</h3>
      </div>
      
      <div class="result-content">
        <div class="result-item">
          <label>车牌号</label>
          <div class="result-value" :class="{ success: scanResult.plateNumber !== '未识别到车牌号' }">
            {{ scanResult.plateNumber }}
          </div>
        </div>
        
        <div class="result-item" v-if="scanResult.vin">
          <label>车架号</label>
          <div class="result-value" :class="{ success: scanResult.vin !== '未识别到车架号' }">
            {{ scanResult.vin }}
          </div>
        </div>
      </div>
      
      <div class="result-actions">
        <el-button size="large" @click="scanResult = null">
          重新扫描
        </el-button>
        <el-button type="primary" size="large" @click="viewVehicleRecords">
          查看记录
        </el-button>
      </div>
    </div>

    <!-- 使用提示 -->
    <div class="tips-section" v-if="!scanResult">
      <h3>使用提示</h3>
      <div class="tips-list">
        <div class="tip-item">
          <el-icon color="var(--apple-blue)"><Aim /></el-icon>
          <span>确保车牌清晰可见，光线充足</span>
        </div>
        <div class="tip-item">
          <el-icon color="var(--apple-blue)"><Picture /></el-icon>
          <span>尽量从正面角度拍摄</span>
        </div>
        <div class="tip-item">
          <el-icon color="var(--apple-blue)"><Lightning /></el-icon>
          <span>AI智能识别，快速准确</span>
        </div>
      </div>
    </div>

    <!-- 手动输入对话框 -->
    <el-dialog
      v-model="manualInputVisible"
      title="手动输入车辆信息"
      :width="isMobile ? '90%' : '600px'"
      class="mobile-dialog"
    >
      <el-form 
        :model="manualInputForm" 
        :rules="formRules"
        ref="formRef"
        label-position="top"
        class="mobile-form"
      >
        <el-form-item label="车牌号" prop="plateNumber">
          <el-input 
            v-model="manualInputForm.plateNumber" 
            placeholder="请输入车牌号"
            size="large"
          />
        </el-form-item>
        
        <el-form-item label="车架号" prop="vin">
          <el-input 
            v-model="manualInputForm.vin" 
            placeholder="请输入车架号（可选）"
            size="large"
          />
        </el-form-item>
        
        <el-form-item label="品牌" prop="brand">
          <el-input 
            v-model="manualInputForm.brand" 
            placeholder="请输入车辆品牌"
            size="large"
          />
        </el-form-item>
        
        <el-form-item label="型号" prop="model">
          <el-input 
            v-model="manualInputForm.model" 
            placeholder="请输入车辆型号"
            size="large"
          />
        </el-form-item>
        
        <el-form-item label="年份" prop="year">
          <el-input-number 
            v-model="manualInputForm.year" 
            :min="1900" 
            :max="2030"
            size="large"
            controls-position="right"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="车主姓名" prop="ownerName">
          <el-input 
            v-model="manualInputForm.ownerName" 
            placeholder="请输入车主姓名（可选）"
            size="large"
          />
        </el-form-item>
        
        <el-form-item label="联系电话" prop="ownerPhone">
          <el-input 
            v-model="manualInputForm.ownerPhone" 
            placeholder="请输入联系电话（可选）"
            size="large"
          />
        </el-form-item>
        
        <el-form-item label="联系地址" prop="ownerAddress">
          <el-input 
            v-model="manualInputForm.ownerAddress" 
            placeholder="请输入联系地址（可选）"
            size="large"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button size="large" @click="manualInputVisible = false">
            取消
          </el-button>
          <el-button 
            type="primary" 
            size="large" 
            @click="handleManualInputSubmit" 
            :loading="submitting"
          >
            确定添加
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { recognizeLicensePlate, recognizeVIN } from '../services/ocr'
import { 
  CameraFilled, 
  Edit, 
  CheckCircleFilled,
  Picture,
  Aim,
  Lightning
} from '@element-plus/icons-vue'
import { vehicleService } from '../services/api'
import { Camera } from '@capacitor/camera'
import { Capacitor } from '@capacitor/core'

const router = useRouter()
const scanResult = ref(null)
const manualInputVisible = ref(false)
const submitting = ref(false)
const formRef = ref()
const isMobile = ref(false)

const manualInputForm = ref({
  plateNumber: '',
  vin: '',
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  ownerName: '',
  ownerPhone: '',
  ownerAddress: ''
})

const formRules = {
  plateNumber: [
    { required: true, message: '请输入车牌号', trigger: 'blur' }
  ],
  ownerPhone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
}

onMounted(() => {
  isMobile.value = Capacitor.isNativePlatform()
})

// 使用Capacitor相机拍照
const takePhoto = async () => {
  try {
    if (!Capacitor.isNativePlatform()) {
      ElMessage.warning('相机功能仅在移动设备上可用')
      return
    }

    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: Camera.CameraResultType.Base64,
      source: Camera.CameraSource.Camera
    })

    await processImage(image.base64String)
  } catch (error) {
    console.error('拍照失败:', error)
    ElMessage.error('拍照失败，请重试')
  }
}

// 从相册选择图片
const selectFromGallery = async () => {
  try {
    if (!Capacitor.isNativePlatform()) {
      ElMessage.warning('相册功能仅在移动设备上可用')
      return
    }

    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: Camera.CameraResultType.Base64,
      source: Camera.CameraSource.Photos
    })

    await processImage(image.base64String)
  } catch (error) {
    console.error('选择图片失败:', error)
    ElMessage.error('选择图片失败，请重试')
  }
}

// 处理桌面端文件选择
const handleImageChange = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const base64 = e.target.result.split(',')[1]
    processImage(base64)
  }
  reader.readAsDataURL(file.raw)
}

// 处理图片识别
const processImage = async (base64String) => {
  try {
    ElMessage.info('正在识别中...')
    
    const [plateNumber, vin] = await Promise.all([
      recognizeLicensePlate(base64String, true),
      recognizeVIN(base64String, true)
    ])
    
    scanResult.value = {
      plateNumber: plateNumber || '未识别到车牌号',
      vin: vin || '未识别到车架号'
    }
    
    if (plateNumber) {
      await handleVehicleRecognition(plateNumber, vin)
    } else {
      ElMessage.warning('未能识别到有效车牌号')
    }
  } catch (error) {
    console.error('图片识别失败:', error)
    ElMessage.error('图片识别失败')
  }
}

// 处理车辆识别结果
const handleVehicleRecognition = async (plateNumber, vin) => {
  try {
    console.log('识别到车牌号:', plateNumber)
    const vehicle = await vehicleService.getVehicleByPlateNumber(plateNumber)
    
    if (vehicle) {
      ElMessage.success('找到车辆记录')
    } else {
      ElMessage.info('未找到该车辆记录，可以添加新车辆')
    }
  } catch (error) {
    console.error('查询车辆记录失败:', error)
  }
}

// 显示手动输入
const showManualInput = () => {
  manualInputForm.value = {
    plateNumber: '',
    vin: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    ownerName: '',
    ownerPhone: '',
    ownerAddress: ''
  }
  manualInputVisible.value = true
}

// 提交手动输入表单
const handleManualInputSubmit = async () => {
  if (!formRef.value) return
  
  try {
    const valid = await formRef.value.validate()
    if (!valid) return
    
    submitting.value = true
    
    const vehicleData = {
      plate_number: manualInputForm.value.plateNumber,
      vin: manualInputForm.value.vin,
      brand: manualInputForm.value.brand || '未知',
      model: manualInputForm.value.model || '未知',
      year: manualInputForm.value.year || new Date().getFullYear(),
      owner_name: manualInputForm.value.ownerName,
      owner_phone: manualInputForm.value.ownerPhone,
      owner_address: manualInputForm.value.ownerAddress || ''
    }

    console.log('正在创建新车辆:', vehicleData)
    const response = await vehicleService.createVehicle(vehicleData)
    console.log('创建车辆响应:', response)

    if (response && response.id) {
      ElMessage.success('车辆信息已添加')
      manualInputVisible.value = false
      router.push({ name: 'Maintenance', params: { vehicleId: response.id } })
    } else {
      ElMessage.error('创建车辆失败，请重试')
    }

  } catch (error) {
    console.error('手动输入提交失败:', error)
    
    if (error.response && error.response.data && error.response.data.message) {
      ElMessage.error(error.response.data.message)
    } else if (error.message) {
      ElMessage.error('创建车辆失败：' + error.message)
    } else {
      ElMessage.error('处理手动输入时发生错误')
    }
  } finally {
    submitting.value = false
  }
}

// 查看车辆记录
const viewVehicleRecords = async () => {
  if (!scanResult.value.plateNumber || scanResult.value.plateNumber === '未识别到车牌号') {
    ElMessage.warning('未识别到有效车牌号')
    return
  }

  try {
    console.log('尝试根据车牌号查询车辆:', scanResult.value.plateNumber)
    const vehicle = await vehicleService.getVehicleByPlateNumber(scanResult.value.plateNumber)

    if (vehicle) {
      ElMessage.success('找到车辆记录，正在跳转...')
      router.push({ name: 'Maintenance', params: { vehicleId: vehicle.id } })
    } else {
      ElMessage.info('未找到该车辆记录。您可以手动添加车辆信息。')
      manualInputForm.value.plateNumber = scanResult.value.plateNumber
      manualInputForm.value.vin = scanResult.value.vin !== '未识别到车架号' ? scanResult.value.vin : ''
      manualInputForm.value.brand = ''
      manualInputForm.value.model = ''
      manualInputForm.value.year = new Date().getFullYear()
      manualInputForm.value.ownerName = ''
      manualInputForm.value.ownerPhone = ''
      manualInputForm.value.ownerAddress = ''
      manualInputVisible.value = true
    }
  } catch (error) {
    console.error('查询车辆记录失败:', error)
    ElMessage.error('查询车辆记录失败')
  }
}
</script>

<style scoped>
.mobile-scan {
  padding: 0;
  background: #f5f5f5;
  min-height: 100vh;
}

.scan-header {
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

.scan-actions {
  padding: 20px 16px;
}

.camera-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.camera-button,
.gallery-button {
  background: white;
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 2px solid transparent;
}

.camera-button:active,
.gallery-button:active {
  transform: scale(0.98);
  border-color: var(--apple-blue);
}

.camera-icon,
.gallery-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: linear-gradient(135deg, var(--apple-blue), #0056CC);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.gallery-icon {
  background: linear-gradient(135deg, #FF6B35, #F7931E);
}

.camera-button h3,
.gallery-button h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 8px 0;
}

.camera-button p,
.gallery-button p {
  font-size: 14px;
  color: #666666;
  margin: 0;
}

.upload-section {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.upload-area :deep(.el-upload) {
  width: 100%;
}

.upload-content {
  padding: 40px 20px;
  text-align: center;
  border: 2px dashed #e0e0e0;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-content:hover {
  border-color: var(--apple-blue);
}

.upload-content .el-icon {
  color: var(--apple-blue);
  margin-bottom: 16px;
}

.upload-content h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 8px 0;
}

.upload-content p {
  font-size: 14px;
  color: #666666;
  margin: 0;
}

.divider {
  text-align: center;
  margin: 24px 0;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e0e0e0;
}

.divider span {
  background: #f5f5f5;
  padding: 0 16px;
  color: #666666;
  font-size: 14px;
  position: relative;
}

.manual-section {
  text-align: center;
}

.manual-btn {
  width: 100%;
  height: 56px;
  font-size: 16px;
  font-weight: 500;
}

.scan-result {
  background: white;
  margin: 16px;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.result-header {
  text-align: center;
  margin-bottom: 24px;
}

.result-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 8px 0 0 0;
}

.result-content {
  margin-bottom: 24px;
}

.result-item {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 12px;
}

.result-item:last-child {
  margin-bottom: 0;
}

.result-item label {
  display: block;
  font-size: 12px;
  color: #666666;
  font-weight: 500;
  margin-bottom: 8px;
}

.result-value {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
}

.result-value.success {
  color: #00C851;
}

.result-actions {
  display: flex;
  gap: 12px;
}

.result-actions .el-button {
  flex: 1;
  height: 48px;
  font-size: 16px;
}

.tips-section {
  background: white;
  margin: 16px;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.tips-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 16px 0;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 10px;
}

.tip-item span {
  font-size: 14px;
  color: #333333;
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
  .scan-actions {
    padding: 16px 12px;
  }
  
  .camera-button,
  .gallery-button {
    padding: 20px 16px;
  }
  
  .camera-icon,
  .gallery-icon {
    width: 64px;
    height: 64px;
    border-radius: 16px;
  }
  
  .camera-icon .el-icon,
  .gallery-icon .el-icon {
    font-size: 32px;
  }
}
</style>