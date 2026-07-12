import axiosInstance from '../axiosInstance';

export const getNotifications = async () => {
  try {
    return await axiosInstance.get('/notifications');
  } catch (error) {
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      return {
        data: [
          { id: 1, title: 'Trip Dispatched', message: 'Trip to New York, NY is now en route.', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), read: false, type: 'info' },
          { id: 2, title: 'Maintenance Alert', message: 'Vehicle TRK-103 requires immediate engine inspection.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), read: false, type: 'warning' },
          { id: 3, title: 'Expense Logged', message: 'Fuel fill-up of $150.00 logged by Driver Mike Johnson.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), read: true, type: 'success' }
        ]
      };
    }
    throw error;
  }
};

export const markAsRead = async (notificationId) => {
  try {
    return await axiosInstance.patch(`/notifications/${notificationId}/read`);
  } catch (error) {
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      return { data: { message: 'Notification marked as read (mock)' } };
    }
    throw error;
  }
};
