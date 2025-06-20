import axios from 'axios'

const API_URL = 'http://localhost:3000/api/ocr'

// 压缩图片
const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target.result
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        
        // 如果图片尺寸超过1024px，等比例缩小
        const maxSize = 1024 // 最大尺寸
        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width)
          width = maxSize
        } else if (height > maxSize) {
          width = Math.round((width * maxSize) / height)
          height = maxSize
        }
        
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        
        // 转换为base64，降低质量
        const base64 = canvas.toDataURL('image/jpeg', 0.7)
        resolve(base64.split(',')[1])
      }
      img.onerror = reject
    }
    reader.onerror = reject
  })
}

// 压缩base64图片
const compressBase64Image = (base64String) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = `data:image/jpeg;base64,${base64String}`
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let width = img.width
      let height = img.height
      
      // 如果图片尺寸超过1024px，等比例缩小
      const maxSize = 1024
      if (width > height && width > maxSize) {
        height = Math.round((height * maxSize) / width)
        width = maxSize
      } else if (height > maxSize) {
        width = Math.round((width * maxSize) / height)
        height = maxSize
      }
      
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)
      
      // 转换为base64，降低质量
      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7)
      resolve(compressedBase64.split(',')[1])
    }
    img.onerror = reject
  })
}

// 识别车牌号
export const recognizeLicensePlate = async (fileOrBase64, isBase64 = false) => {
  try {
    let base64Image
    
    if (isBase64) {
      console.log('开始压缩base64图片...')
      base64Image = await compressBase64Image(fileOrBase64)
    } else {
      console.log('开始转换图片...')
      base64Image = await compressImage(fileOrBase64)
    }
    
    console.log('图片处理完成，长度:', base64Image.length)
    
    console.log('发送车牌识别请求...')
    const response = await axios.post(`${API_URL}/license-plate`, {
      image: base64Image
    })
    console.log('车牌识别响应:', response.data)

    return response.data.plateNumber
  } catch (error) {
    console.error('车牌识别失败:', error)
    throw error
  }
}

// 识别车架号
export const recognizeVIN = async (fileOrBase64, isBase64 = false) => {
  try {
    let base64Image
    
    if (isBase64) {
      console.log('开始压缩base64图片...')
      base64Image = await compressBase64Image(fileOrBase64)
    } else {
      console.log('开始转换图片...')
      base64Image = await compressImage(fileOrBase64)
    }
    
    console.log('图片处理完成，长度:', base64Image.length)
    
    console.log('发送车架号识别请求...')
    const response = await axios.post(`${API_URL}/vin`, {
      image: base64Image
    })
    console.log('车架号识别响应:', response.data)

    return response.data.vin
  } catch (error) {
    console.error('车架号识别失败:', error)
    throw error
  }
} 