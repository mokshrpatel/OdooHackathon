import axiosInstance from '../axiosInstance';

export const getKPIs = async () => {
  return await axiosInstance.get('/dashboard/kpis');
};
