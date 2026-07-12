import axiosInstance from '../axiosInstance';

export const getVehicles = async () => {
  return await axiosInstance.get('/vehicles');
};

export const getAvailableVehicles = async () => {
  return await axiosInstance.get('/vehicles/available');
};

export const createVehicle = async (vehicleData) => {
  return await axiosInstance.post('/vehicles', vehicleData);
};
