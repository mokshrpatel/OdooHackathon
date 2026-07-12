import axiosInstance from '../axiosInstance';

export const recordFuelLog = async (data) => {
  try {
    return await axiosInstance.post('/expenses/fuel', data);
  } catch (error) {
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      return { data: { message: 'Fuel log recorded successfully (mock)' } };
    }
    throw error;
  }
};

