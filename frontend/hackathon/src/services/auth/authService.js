import axiosInstance from '../axiosInstance';

export const loginUser = async (credentials) => {
  // Mock login for demo credentials to bypass Network Error when backend is offline
  if (credentials.email === 'manager@transitops.com' && credentials.password === 'securepassword123') {
    return {
      data: {
        token: 'demo-token-manager-12345',
        user: { id: 1, email: 'manager@transitops.com', role: 'Fleet Manager', name: 'Demo Manager' }
      }
    };
  }
  
  if (credentials.email === 'dispatcher_02@transitops.com' && credentials.password === 'temporaryPassword123') {
    return {
      data: {
        token: 'demo-token-dispatcher-67890',
        user: { id: 2, email: 'dispatcher_02@transitops.com', role: 'Dispatcher', name: 'Demo Dispatcher' }
      }
    };
  }

  if (credentials.email === 'safety@transitops.com' && credentials.password === 'safetyfirst123') {
    return {
      data: {
        token: 'demo-token-safety-11223',
        user: { id: 3, email: 'safety@transitops.com', role: 'Safety Officer', name: 'Demo Safety Officer' }
      }
    };
  }

  try {
    const response = await axiosInstance.post('/auth/login', credentials);
    if (response?.data?.user?.role) {
      const roleMapping = {
        'FLEETMANAGER': 'Fleet Manager',
        'DISPATCHER': 'Dispatcher',
        'SAFETYOFFICER': 'Safety Officer'
      };
      response.data.user.role = roleMapping[response.data.user.role] || response.data.user.role;
    }
    return response;
  } catch (error) {
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      const customError = new Error('Network Error');
      customError.response = {
        data: { message: 'Unable to connect to the server. Please check your network connection or try demo credentials.' }
      };
      throw customError;
    }
    throw error;
  }
};
