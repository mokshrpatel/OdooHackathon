import axiosInstance from '../axiosInstance';

export const getGeneralExpenses = async () => {
  try {
    return await axiosInstance.get('/expenses/general');
  } catch (error) {
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      return {
        data: [
          { id: 1, type: 'Insurance', amount: 1500, date: '2023-11-01', description: 'Monthly Fleet Insurance' },
          { id: 2, type: 'Permits', amount: 300, date: '2023-11-05', description: 'State Transport Permits' },
          { id: 3, type: 'Office', amount: 150, date: '2023-11-10', description: 'Office Supplies' }
        ]
      };
    }
    throw error;
  }
};

export const logExpense = async (data) => {
  try {
    return await axiosInstance.post('/expenses', { ...data, expenseType: 'GENERAL' });
  } catch (error) {
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      return { data: { message: 'Expense logged successfully (mock)' } };
    }
    throw error;
  }
};

export const getAllExpenses = async () => {
  try {
    return await axiosInstance.get('/expenses');
  } catch (error) {
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      return {
        data: [
          { id: 1, expenseType: 'Fuel', amount: 150.00, date: '2023-11-01', vehicleId: 1, fuelLiters: 120 },
          { id: 2, expenseType: 'Maintenance', amount: 800.00, date: '2023-11-05', vehicleId: 2, description: 'Tire replacement' },
          { id: 3, expenseType: 'Permits', amount: 120.00, date: '2023-11-10', vehicleId: null, description: 'State permits' }
        ]
      };
    }
    throw error;
  }
};
