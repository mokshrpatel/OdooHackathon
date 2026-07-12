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
          availableVehicles: 3,
          vehiclesInMaintenance: 3,
          activeTrips: 12,
          pendingTrips: 2,
          driversOnDuty: 18,
          fleetUtilizationPercentage: 80.0
        }
      };
    }
    throw error;
  }
};

