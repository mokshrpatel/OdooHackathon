import axiosInstance from '../axiosInstance';

export const getROI = async () => {
  try {
    return await axiosInstance.get('/reports/roi');
  } catch (error) {
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      // Mock data for demo
      return {
        data: [
          {
            vehicleId: 1,
            registrationNumber: 'TRK-101',
            totalRevenue: 15000,
            operationalCost: 2000,
            acquisitionCost: 80000,
            roiPercentage: 16.25
          },
          {
            vehicleId: 2,
            registrationNumber: 'TRK-102',
            totalRevenue: 12000,
            operationalCost: 2500,
            acquisitionCost: 75000,
            roiPercentage: 12.66
          },
          {
            vehicleId: 3,
            registrationNumber: 'TRK-103',
            totalRevenue: 18000,
            operationalCost: 1500,
            acquisitionCost: 85000,
            roiPercentage: 19.41
          }
        ]
      };
    }
    throw error;
  }
};

