import axiosInstance from '../axiosInstance';

export const createUser = async (userData) => {
  return await axiosInstance.post('/users', userData);
};
