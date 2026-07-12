import axiosInstance from '../axiosInstance';

export const getDrivers = async () => {
  return await axiosInstance.get('/drivers');
};

export const getAvailableDrivers = async () => {
  return await axiosInstance.get('/drivers/available');
};

export const createDriver = async (driverData) => {
  return await axiosInstance.post('/drivers', driverData);
};
