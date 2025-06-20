<template>
  <div class="scan-page">
    <div class="scan-container">
      <div class="scan-header">
        <h2>车辆扫描</h2>
      </div>
      
      <div class="scan-content">
        <scan-vehicle />
      </div>
    </div>
  </div>
</template>

<script setup>
import ScanVehicle from '../components/ScanVehicle.vue'
</script>

<style scoped>
.scan-page {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  /* 完全禁用水平滚动 */
  overflow-x: hidden !important;
  max-width: 100vw;
  box-sizing: border-box;
}

.scan-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 16px;
  /* 防止水平溢出 */
  overflow-x: hidden;
  box-sizing: border-box;
}

.scan-header {
  flex-shrink: 0;
  text-align: center;
  padding: 16px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 16px;
  /* 确保标题不溢出 */
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

.scan-header h2 {
  margin: 0;
  font-size: 1.5em;
  color: #ffffff;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* 防止文字溢出 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.scan-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 16px;
  /* 确保内容区域不水平滚动 */
  width: 100%;
  box-sizing: border-box;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .scan-container {
    padding: 0 8px;
    /* 移动端强制禁用水平滚动 */
    overflow-x: hidden !important;
  }
  
  .scan-header h2 {
    font-size: 1.3em;
  }
  
  .scan-content {
    padding-bottom: 8px;
    /* 移动端确保不能水平滚动 */
    overflow-x: hidden !important;
  }
}
</style> 