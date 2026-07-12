import axiosInstance from '../axiosInstance';

export const recordFuelLog = async (data) => {
  return await axiosInstance.post('/expenses/fuel', data);
};
