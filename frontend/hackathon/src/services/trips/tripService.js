import axiosInstance from '../axiosInstance';

export const createTrip = async (tripData) => {
  return await axiosInstance.post('/trips', tripData);
};

export const dispatchTrip = async (tripId) => {
  return await axiosInstance.patch(`/trips/${tripId}/dispatch`);
};

export const completeTrip = async (tripId, data) => {
  return await axiosInstance.patch(`/trips/${tripId}/complete`, data);
};

export const cancelTrip = async (tripId) => {
  return await axiosInstance.patch(`/trips/${tripId}/cancel`);
};
