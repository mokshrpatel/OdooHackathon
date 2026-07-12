import axiosInstance from '../axiosInstance';

export const recordGeneralExpense = async (data) => {
  return await axiosInstance.post('/expenses/general', data);
};
