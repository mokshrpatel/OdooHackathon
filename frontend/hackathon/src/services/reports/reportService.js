import axiosInstance from '../axiosInstance';

export const getROI = async () => {
  return await axiosInstance.get('/reports/roi');
};
