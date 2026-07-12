import axiosInstance from '../axiosInstance';

export const getVehicles = async () => {
  try {
    return await axiosInstance.get('/vehicles');
  } catch (error) {
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      return {
        data: [
          { id: 1, registrationNumber: 'TRK-101', nameModel: 'Volvo VNL 860', status: 'Available', mileage: 45000 },
          { id: 2, registrationNumber: 'TRK-102', nameModel: 'Freightliner Cascadia', status: 'On Trip', mileage: 120000 },
          { id: 3, registrationNumber: 'TRK-103', nameModel: 'Kenworth T680', status: 'In Shop', mileage: 85000 }
        ]
      };
    }
    throw error;
  }
};

export const getAvailableVehicles = async () => {
  try {
    return await axiosInstance.get('/vehicles/available');
  } catch (error) {
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      return { data: [{ id: 1, registrationNumber: 'TRK-101', nameModel: 'Volvo VNL 860' }] };
    }
    throw error;
  }
};

export const createVehicle = async (vehicleData) => {
  try {
    return await axiosInstance.post('/vehicles', vehicleData);
  } catch (error) {
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      return { data: { message: 'Vehicle created successfully (mock)', vehicleData } };
    }
    throw error;
  }
};

