import axiosInstance from '../axiosInstance';

export const getDrivers = async () => {
  try {
    return await axiosInstance.get('/drivers');
  } catch (error) {
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      return {
        data: [
          { id: 1, name: 'John Doe', licenseNumber: 'DL-12345', status: 'Available', rating: 4.8 },
          { id: 2, name: 'Jane Smith', licenseNumber: 'DL-67890', status: 'On Trip', rating: 4.9 },
          { id: 3, name: 'Mike Johnson', licenseNumber: 'DL-34567', status: 'Off Duty', rating: 4.5 }
        ]
      };
    }
    throw error;
  }
};

export const getAvailableDrivers = async () => {
  try {
    return await axiosInstance.get('/drivers/available');
  } catch (error) {
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      return { data: [{ id: 1, name: 'John Doe', licenseNumber: 'DL-12345' }] };
    }
    throw error;
  }
};

export const createDriver = async (driverData) => {
  try {
    return await axiosInstance.post('/drivers', driverData);
  } catch (error) {
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      return { data: { message: 'Driver registered successfully (mock)' } };
    }
    throw error;
  }
};

