import axiosInstance from '../axiosInstance';

export const getMaintenanceRecords = async () => {
  try {
    return await axiosInstance.get('/maintenance');
  } catch (error) {
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      return {
        data: [
          { id: 1, vehicleId: 1, description: 'Oil Change', status: 'Pending', date: '2023-11-10' },
          { id: 2, vehicleId: 2, description: 'Tire Replacement', status: 'In Progress', date: '2023-11-12' },
          { id: 3, vehicleId: 3, description: 'Engine Tune-up', status: 'Completed', date: '2023-10-30' }
        ]
      };
    }
    throw error;
  }
};

export const createMaintenanceRecord = async (data) => {
  try {
    return await axiosInstance.post('/maintenance', data);
  } catch (error) {
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      return { data: { message: 'Maintenance record created successfully (mock)' } };
    }
    throw error;
  }
};

export const closeMaintenanceRecord = async (maintenanceId) => {
  try {
    return await axiosInstance.patch(`/maintenance/${maintenanceId}/close`);
  } catch (error) {
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      return { data: { message: 'Maintenance record closed successfully (mock)' } };
    }
    throw error;
  }
};
