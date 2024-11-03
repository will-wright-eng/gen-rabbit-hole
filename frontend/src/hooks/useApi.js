import { useState, useCallback } from 'react';
import { apiClient } from '../lib/api-client';

export function useApi(endpoint, options = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(async (body = null, customOptions = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const method = customOptions.method || options.method || 'GET';
      const requestOptions = { ...options, ...customOptions };
      
      let response;
      switch (method.toUpperCase()) {
        case 'POST':
          response = await apiClient.post(endpoint, body, requestOptions);
          break;
        case 'PUT':
          response = await apiClient.put(endpoint, body, requestOptions);
          break;
        case 'DELETE':
          response = await apiClient.delete(endpoint, requestOptions);
          break;
        default:
          response = await apiClient.get(endpoint, requestOptions);
      }
      
      setData(response);
      return response;
    } catch (err) {
      setError(err);
      if (options.fallbackData) {
        console.warn('Using fallback data due to API error:', err);
        setData(options.fallbackData);
        return options.fallbackData;
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, options]);

  return { data, error, isLoading, execute };
}
