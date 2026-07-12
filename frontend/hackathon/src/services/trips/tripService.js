import axiosInstance from '../axiosInstance';

// In-memory mock data to allow UI updates during Hackathon demonstration without backend
let mockTrips = [
  { id: 1, destination: 'New York, NY', status: 'Dispatched', vehicleId: 1, driverId: 1, departureDate: '2023-11-01' },
  { id: 2, destination: 'Los Angeles, CA', status: 'Draft', vehicleId: null, driverId: null, departureDate: '2023-11-05' },
  { id: 3, destination: 'Chicago, IL', status: 'Completed', vehicleId: 2, driverId: 2, departureDate: '2023-10-25' }
];
let nextId = 4;

export const getTrips = async () => {
  try {
    return await axiosInstance.get('/trips');
  } catch (error) {
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      return { data: [...mockTrips] };
    }
    throw error;
  }
};

export const createTrip = async (tripData) => {
  try {
    return await axiosInstance.post('/trips', tripData);
  } catch (error) {
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      const newTrip = { id: nextId++, ...tripData, status: 'Draft' };
      mockTrips.push(newTrip);
      return { data: { message: 'Trip created successfully (mock)', trip: newTrip } };
    }
    throw error;
  }
};

export const dispatchTrip = async (tripId) => {
  try {
    return await axiosInstance.patch(`/trips/${tripId}/dispatch`);
  } catch (error) {
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      mockTrips = mockTrips.map(t => t.id === tripId ? { ...t, status: 'Dispatched' } : t);
      return { data: { message: 'Trip dispatched successfully (mock)' } };
    }
    throw error;
  }
};

export const completeTrip = async (tripId, data) => {
  try {
    return await axiosInstance.patch(`/trips/${tripId}/complete`, data);
  } catch (error) {
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      mockTrips = mockTrips.map(t => t.id === tripId ? { ...t, status: 'Completed', ...data } : t);
      return { data: { message: 'Trip completed successfully (mock)' } };
    }
    throw error;
  }
};

export const cancelTrip = async (tripId) => {
  try {
    return await axiosInstance.patch(`/trips/${tripId}/cancel`);
  } catch (error) {
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      mockTrips = mockTrips.map(t => t.id === tripId ? { ...t, status: 'Cancelled' } : t);
      return { data: { message: 'Trip cancelled successfully (mock)' } };
    }
    throw error;
  }
};

