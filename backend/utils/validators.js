// 验证图片数据
const validateImage = (image) => {
  if (!image) {
    return '未提供图片数据';
  }
  if (typeof image !== 'string') {
    return '图片数据格式错误';
  }
  if (image.length > 4 * 1024 * 1024) { // 4MB
    return '图片数据过大';
  }
  return null;
};

module.exports = {
  validateImage
}; 