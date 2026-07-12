import axiosInstance from '../axiosInstance';

export const createMaintenanceRecord = async (data) => {
  return await axiosInstance.post('/maintenance', data);
};

export const closeMaintenanceRecord = async (maintenanceId) => {
  return await axiosInstance.patch(`/maintenance/${maintenanceId}/close`);
};
