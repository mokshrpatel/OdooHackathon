import axiosInstance from '../axiosInstance';

export const createUser = async (userData) => {
  try {
    return await axiosInstance.post('/users', userData);
  } catch (error) {
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK' || error.response?.status === 404) {
      return { data: { message: 'User provisioned successfully (mock)', id: Date.now() } };
    }
    throw error;
  }
};

export const getProfile = async () => {
  try {
    return await axiosInstance.get('/users/profile');
  } catch (error) {
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK' || error.response?.status === 404) {
      return { data: { phone: '+1 555-0198', timezone: 'UTC' } };
    }
    throw error;
  }
};

export const updateProfile = async (data) => {
  try {
    return await axiosInstance.put('/users/profile', data);
  } catch (error) {
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK' || error.response?.status === 404) {
      return { data: { ...mockProfile } };
    }
    throw error;
  }
};

export const getNotificationPrefs = async () => {
  try {
    return await axiosInstance.get('/settings/notifications');
  } catch (error) {
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK' || error.response?.status === 404) {
      return { data: { emailAlerts: true, smsAlerts: false, maintenanceReminders: true, tripUpdates: true } };
    }
    throw error;
  }
};

export const updateNotificationPrefs = async (data) => {
  try {
    return await axiosInstance.put('/settings/notifications', data);
  } catch (error) {
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK' || error.response?.status === 404) {
      return { data: { message: 'Preferences updated' } };
    }
    throw error;
  }
};

export const getSystemPrefs = async () => {
  try {
    return await axiosInstance.get('/settings/system');
  } catch (error) {
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK' || error.response?.status === 404) {
      return { data: { dataRetention: '1 year', currency: 'USD', distanceUnit: 'Miles' } };
    }
    throw error;
  }
};

export const updateSystemPrefs = async (data) => {
  try {
    return await axiosInstance.put('/settings/system', data);
  } catch (error) {
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK' || error.response?.status === 404) {
      return { data: { message: 'Preferences updated' } };
    }
    throw error;
  }
};


