const express = require('express')
const router = express.Router()
const axios = require('axios')
const { validateImage } = require('../utils/validators')

// 百度OCR API配置
const API_KEY = 'rijBYArTbty3m9rnD6ana15W'
const SECRET_KEY = 'pzUlxP7VJNmfDn40LWmXAuVNlWHRNiO2'
const API_URL = 'https://aip.baidubce.com/rest/2.0/ocr/v1'

// 获取百度OCR访问令牌
const getAccessToken = async () => {
  try {
    console.log('开始获取访问令牌...')
    const tokenUrl = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${API_KEY}&client_secret=${SECRET_KEY}`
    console.log('Token URL:', tokenUrl)
    
    const response = await axios.get(tokenUrl)
    console.log('获取访问令牌成功')
    return response.data.access_token
  } catch (error) {
    console.error('获取访问令牌失败:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    })
    throw new Error('获取访问令牌失败')
  }
}

// 识别车牌号
router.post('/license-plate', async (req, res) => {
  try {
    console.log('开始车牌号识别...')
    const { image } = req.body
    
    // 验证图片数据
    const validationError = validateImage(image)
    if (validationError) {
      console.error('图片验证失败:', validationError)
      return res.status(400).json({ error: validationError })
    }

    console.log('图片数据长度:', image.length)
    const token = await getAccessToken()
    console.log('获取到访问令牌:', token)

    const response = await axios.post(
      `${API_URL}/license_plate?access_token=${token}`,
      `image=${encodeURIComponent(image)}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )

    console.log('车牌识别响应:', response.data)
    if (response.data.error_code) {
      console.error('车牌识别API错误:', response.data)
      return res.status(400).json({ error: response.data.error_msg })
    }

    const plateNumber = response.data.words_result?.number
    if (!plateNumber) {
      console.log('未识别到车牌号')
      return res.json({ plateNumber: null })
    }

    console.log('识别到车牌号:', plateNumber)
    res.json({ plateNumber })
  } catch (error) {
    console.error('车牌号识别失败:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      stack: error.stack
    })
    res.status(500).json({ error: '车牌号识别失败' })
  }
})

// 识别车架号
router.post('/vin', async (req, res) => {
  try {
    console.log('开始车架号识别...')
    const { image } = req.body
    
    // 验证图片数据
    const validationError = validateImage(image)
    if (validationError) {
      console.error('图片验证失败:', validationError)
      return res.status(400).json({ error: validationError })
    }

    console.log('图片数据长度:', image.length)
    const token = await getAccessToken()
    console.log('获取到访问令牌:', token)

    const response = await axios.post(
      `${API_URL}/vin?access_token=${token}`,
      `image=${encodeURIComponent(image)}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )

    console.log('车架号识别响应:', response.data)
    if (response.data.error_code) {
      console.error('车架号识别API错误:', response.data)
      return res.status(400).json({ error: response.data.error_msg })
    }

    const vin = response.data.words_result?.vin
    if (!vin) {
      console.log('未识别到车架号')
      return res.json({ vin: null })
    }

    console.log('识别到车架号:', vin)
    res.json({ vin })
  } catch (error) {
    console.error('车架号识别失败:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      stack: error.stack
    })
    res.status(500).json({ error: '车架号识别失败' })
  }
})

module.exports = router 