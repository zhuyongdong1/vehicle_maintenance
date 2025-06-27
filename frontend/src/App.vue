<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  House, 
  CameraFilled, 
  Management, 
  Tools, 
  TrendCharts 
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const menuItems = [
  { key: 'home', label: '首页', icon: House, path: '/' },
  { key: 'scan', label: '扫描', icon: CameraFilled, path: '/scan' },
  { key: 'vehicles', label: '车辆', icon: Management, path: '/vehicles' },
  { key: 'maintenance', label: '维修', icon: Tools, path: '/maintenance' },
  { key: 'statistics', label: '统计', icon: TrendCharts, path: '/statistics' }
]

const getActiveKey = () => {
  const currentPath = route.path
  if (currentPath === '/') return 'home'
  if (currentPath.startsWith('/scan')) return 'scan'
  if (currentPath.startsWith('/vehicles')) return 'vehicles'
  if (currentPath.startsWith('/maintenance')) return 'maintenance'
  if (currentPath.startsWith('/statistics')) return 'statistics'
  return 'home'
}

const handleMenuClick = (item) => {
  if (route.path !== item.path) {
    router.push(item.path)
  }
}
</script>

<template>
  <el-config-provider>
    <div class="mobile-app">
      <!-- 主要内容区域 -->
      <main class="main-content">
        <div class="content-wrapper">
          <router-view></router-view>
        </div>
      </main>
      
      <!-- 底部导航栏 -->
      <nav class="bottom-nav">
        <div 
          v-for="item in menuItems" 
          :key="item.key"
          class="nav-item"
          :class="{ active: getActiveKey() === item.key }"
          @click="handleMenuClick(item)"
        >
          <el-icon class="nav-icon">
            <component :is="item.icon" />
          </el-icon>
          <span class="nav-label">{{ item.label }}</span>
        </div>
      </nav>
    </div>
  </el-config-provider>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  overflow-x: hidden;
  font-family: var(--apple-font-family);
  background: #f5f5f5;
}

#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.mobile-app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

/* 主要内容区域 */
.main-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.content-wrapper {
  min-height: 100%;
  padding: 16px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
}

/* 底部导航栏 */
.bottom-nav {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 8px 0;
  padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px));
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 60px;
  position: relative;
}

.nav-item:active {
  transform: scale(0.95);
}

.nav-icon {
  font-size: 24px;
  color: #666666;
  margin-bottom: 4px;
  transition: all 0.2s ease;
}

.nav-label {
  font-size: 11px;
  color: #666666;
  font-weight: 500;
  transition: all 0.2s ease;
  text-align: center;
}

.nav-item.active .nav-icon {
  color: var(--apple-blue);
  transform: scale(1.1);
}

.nav-item.active .nav-label {
  color: var(--apple-blue);
  font-weight: 600;
}

.nav-item.active {
  background: rgba(0, 122, 255, 0.1);
}

/* Element Plus 组件样式覆盖 */
.el-card {
  border: none;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  background: #ffffff;
  margin-bottom: 16px;
}

.el-button {
  border-radius: 12px;
  font-weight: 500;
  padding: 12px 20px;
  border: none;
  font-size: 16px;
}

.el-button--primary {
  background: var(--apple-blue);
  color: #ffffff;
}

.el-button--primary:hover,
.el-button--primary:focus {
  background: #0056CC;
}

.el-button--default {
  background: #f8f9fa;
  color: #333333;
}

.el-input__wrapper {
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: none;
  border: 1px solid #e0e0e0;
}

.el-dialog {
  border-radius: 16px;
  margin: 20px;
  width: calc(100% - 40px) !important;
  max-width: 500px;
}

.el-form-item__label {
  font-weight: 500;
  color: #333333;
}

/* 页面标题样式 */
.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 20px;
  text-align: center;
}

/* 卡片样式 */
.mobile-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 16px;
}

/* 响应式和安全区域适配 */
@supports (padding: max(0px)) {
  .bottom-nav {
    padding-bottom: max(8px, env(safe-area-inset-bottom));
  }
  
  .content-wrapper {
    padding-bottom: max(16px, env(safe-area-inset-bottom));
  }
}

/* iPhone X 及以上设备的安全区域适配 */
@media screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .bottom-nav {
    padding-bottom: 34px;
  }
}

@media screen and (device-width: 414px) and (device-height: 896px) {
  .bottom-nav {
    padding-bottom: 34px;
  }
}

/* 防止选中文本 */
.nav-item {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* 触摸反馈 */
.nav-item:active {
  background: rgba(0, 122, 255, 0.2);
}
</style>
