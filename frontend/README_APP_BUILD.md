# 车辆维修记录APP - 移动端构建指南

## 🚀 构建准备

### 1. 环境要求

#### Android开发环境
- **Java Development Kit (JDK) 11 或更高版本**
- **Android Studio** (推荐最新版本)
- **Android SDK** (API 21+，对应Android 5.0+)

#### iOS开发环境 (仅限macOS)
- **Xcode 14+**
- **iOS 12.0+**
- **Apple Developer Account** (用于真机测试和发布)

### 2. 检查Capacitor配置

确保 `capacitor.config.js` 配置正确：

```javascript
const config = {
  appId: 'com.vehiclemaintenance.app',
  appName: '车辆维修记录',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};
```

## 📱 构建步骤

### 第一步：构建Web应用

```bash
# 在frontend目录下执行
npm run build
```

### 第二步：同步到移动平台

```bash
# 同步所有平台
npm run sync

# 或者分别同步
npx cap sync android
npx cap sync ios
```

### 第三步：添加平台（首次）

如果还没有添加平台，需要先添加：

```bash
# 添加Android平台
npx cap add android

# 添加iOS平台（仅限macOS）
npx cap add ios
```

## 🔧 Android构建

### 方法1：使用Android Studio（推荐）

1. **打开项目**
   ```bash
   npm run open:android
   # 或者
   npx cap open android
   ```

2. **在Android Studio中**
   - 等待Gradle同步完成
   - 连接Android设备或启动模拟器
   - 点击 "Run" 按钮或使用快捷键 `Ctrl+R` (Windows/Linux) / `Cmd+R` (macOS)

3. **生成APK**
   - Build → Build Bundle(s) / APK(s) → Build APK(s)
   - APK位置：`android/app/build/outputs/apk/debug/app-debug.apk`

### 方法2：命令行构建

```bash
# 直接运行到设备
npm run android

# 或者使用Capacitor命令
npx cap run android
```

## 🍎 iOS构建（仅限macOS）

### 使用Xcode

1. **打开项目**
   ```bash
   npm run open:ios
   # 或者
   npx cap open ios
   ```

2. **在Xcode中**
   - 选择开发团队（需要Apple Developer Account）
   - 选择目标设备或模拟器
   - 点击 "Run" 按钮或使用快捷键 `Cmd+R`

3. **Archive构建（发布用）**
   - Product → Archive
   - 选择分发方式（App Store、Ad Hoc等）

## 🎨 自定义APP图标和启动屏幕

### 1. 准备图标资源

创建以下尺寸的PNG图标：
- **1024x1024** (iOS App Store)
- **512x512** (Android Play Store)
- **192x192** (Android高密度)
- **96x96** (Android中密度)
- **48x48** (Android低密度)

### 2. 使用Capacitor Assets工具

```bash
# 安装assets工具
npm install @capacitor/assets --save-dev

# 将1024x1024的图标放在 public/icon.png
# 然后运行
npx @capacitor/assets generate --iconBackgroundColor '#667eea' --iconBackgroundColorDark '#667eea'
```

### 3. 手动配置（可选）

将图标文件放在：
- Android: `android/app/src/main/res/`
- iOS: `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

## 🔧 调试技巧

### 1. Chrome DevTools调试

```bash
# Android设备连接电脑后
# 在Chrome浏览器中访问：chrome://inspect
```

### 2. 查看应用日志

```bash
# Android日志
npx cap run android -l

# iOS日志
npx cap run ios -l
```

### 3. 实时重载

```bash
# 启动开发服务器
npm run dev

# 在另一个终端中同步
npx cap sync

# 修改capacitor.config.js添加：
server: {
  url: 'http://localhost:5173',
  cleartext: true
}
```

## 📦 发布准备

### Android发布

1. **生成签名密钥**
   ```bash
   keytool -genkey -v -keystore my-app-key.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias my-app-key
   ```

2. **配置签名**
   在 `android/app/build.gradle` 中配置签名信息

3. **生成生产APK/AAB**
   ```bash
   cd android
   ./gradlew assembleRelease
   # 或生成AAB包
   ./gradlew bundleRelease
   ```

### iOS发布

1. **配置证书和描述文件**
   - 在Apple Developer Portal创建App ID
   - 创建分发证书和描述文件
   - 在Xcode中配置签名

2. **Archive和上传**
   - Product → Archive
   - 使用Organizer上传到App Store Connect

## 🎯 性能优化建议

1. **网络请求优化**
   - 确保后端API支持HTTPS
   - 配置合适的超时时间
   - 添加离线缓存机制

2. **图片优化**
   - 压缩图片资源
   - 使用WebP格式（如果支持）
   - 实现图片懒加载

3. **包大小优化**
   - 移除未使用的依赖
   - 代码分割和树摇
   - 启用Vite的生产优化

## 🔧 常见问题解决

### 1. 构建失败

```bash
# 清理并重新构建
npm run build
npx cap sync
```

### 2. 插件不工作

```bash
# 检查插件是否正确安装
npx cap doctor

# 重新同步
npx cap sync
```

### 3. 权限问题

在 `android/app/src/main/AndroidManifest.xml` 中添加必要权限：

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

## 📞 技术支持

如果遇到问题，可以：
1. 查看 [Capacitor官方文档](https://capacitorjs.com/docs)
2. 检查控制台错误信息
3. 使用Chrome DevTools调试Web层
4. 查看原生层日志

---

**祝您构建成功！** 🎉 