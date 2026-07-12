import axiosInstance from '../axiosInstance';

export const loginUser = async (credentials) => {
  return await axiosInstance.post('/auth/login', credentials);
};
