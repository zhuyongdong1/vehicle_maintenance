import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 车辆相关API
export const vehicleService = {
  // 获取所有车辆
  getAllVehicles: async () => {
    try {
      const response = await api.get('/vehicles');
      return response.data;
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      throw error;
    }
  },

  // 获取单个车辆
  getVehicle: async (id) => {
    try {
      const response = await api.get(`/vehicles/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching vehicle ${id}:`, error);
      throw error;
    }
  },

  // 根据车牌号获取车辆
  getVehicleByPlateNumber: async (plateNumber) => {
    try {
      console.log('根据车牌号查询车辆:', plateNumber);
      const response = await api.get('/vehicles/plate/' + encodeURIComponent(plateNumber));
      console.log('根据车牌号查询车辆响应:', response.data);
      // 后端返回的可能是单个车辆对象或null
      return response.data;
    } catch (error) {
      console.error(`根据车牌号获取车辆 (${plateNumber}) 失败:`, error);
      // 如果是404错误，表示未找到车辆，返回null
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // 创建车辆
  createVehicle: async (vehicleData) => {
    try {
      const response = await api.post('/vehicles', vehicleData);
      return response.data;
    } catch (error) {
      console.error('Error creating vehicle:', error);
      throw error;
    }
  },

  // 更新车辆
  updateVehicle: async (id, vehicleData) => {
    try {
      const response = await api.put(`/vehicles/${id}`, vehicleData);
      return response.data;
    } catch (error) {
      console.error(`Error updating vehicle ${id}:`, error);
      throw error;
    }
  },

  // 删除车辆
  deleteVehicle: async (id) => {
    try {
      const response = await api.delete(`/vehicles/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting vehicle ${id}:`, error);
      throw error;
    }
  }
};

// 维修记录相关API
export const maintenanceService = {
  getMaintenanceRecords: async (vehicleId) => {
    try {
      const response = await api.get(`/maintenance/vehicle/${vehicleId}`);
      return response.data;
    } catch (error) {
      console.error(`获取车辆 ${vehicleId} 的维护记录失败:`, error);
      throw error;
    }
  },
  getMaintenanceRecord: (id) => api.get(`/maintenance/${id}`),
  createMaintenanceRecord: async (recordData) => {
    try {
      const response = await api.post('/maintenance', recordData);
      return response.data;
    } catch (error) {
      console.error('创建维护记录失败:', error);
      throw error;
    }
  },
  updateMaintenanceRecord: async (id, recordData) => {
    try {
      const response = await api.put(`/maintenance/${id}`, recordData);
      return response.data;
    } catch (error) {
      console.error(`更新维护记录 (ID: ${id}) 失败:`, error);
      throw error;
    }
  },
  deleteMaintenanceRecord: async (id) => {
    try {
      const response = await api.delete(`/maintenance/${id}`);
      return response.data;
    } catch (error) {
      console.error(`删除维护记录 (ID: ${id}) 失败:`, error);
      throw error;
    }
  }
};

// 洗车记录相关API
export const washService = {
  getWashRecords: async (vehicleId) => {
    try {
      const response = await api.get(`/wash/vehicle/${vehicleId}`);
      return response.data;
    } catch (error) {
      console.error(`获取车辆 ${vehicleId} 的洗车记录失败:`, error);
      throw error;
    }
  },
  getWashRecord: (id) => api.get(`/wash/${id}`),
  createWashRecord: async (recordData) => {
    try {
      const response = await api.post('/wash', recordData);
      return response.data;
    } catch (error) {
      console.error('创建洗车记录失败:', error);
      throw error;
    }
  },
  updateWashRecord: (id, data) => api.put(`/wash/${id}`, data),
  deleteWashRecord: async (id) => {
    try {
      const response = await api.delete(`/wash/${id}`);
      return response.data;
    } catch (error) {
      console.error(`删除洗车记录 (ID: ${id}) 失败:`, error);
      throw error;
    }
  }
};

export default api; 