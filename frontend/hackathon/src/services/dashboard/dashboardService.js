import axiosInstance from '../axiosInstance';

export const getKPIs = async () => {
  try {
    return await axiosInstance.get('/dashboard/kpis');
  } catch (error) {
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      // Mock data for demo since backend is offline
      return {
        data: {
          activeVehicles: 24,
          totalVehicles: 30,
          onDutyDrivers: 18,
          totalDrivers: 25,
          activeTrips: 12,
          pendingMaintenance: 3,
        }
      };
    }
    throw error;
  }
};

