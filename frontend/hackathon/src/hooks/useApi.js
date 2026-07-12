import { useState, useCallback } from 'react';

/**
 * Custom hook to handle API requests with loading, error, and data states.
 * @param {Function} apiFunc - The API function (from services) to be called.
 */
const useApi = (apiFunc) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      // Execute the API function which should return the response
      const response = await apiFunc(...args);
      // Usually axios wraps data in response.data, but this depends on how the service is written
      const responseData = response.data !== undefined ? response.data : response;
      setData(responseData);
      return responseData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  return { data, loading, error, execute, setError };
};

export default useApi;
