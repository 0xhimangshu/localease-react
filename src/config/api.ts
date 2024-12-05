import { API_URL } from '../utils/network';

const API_BASE_URL = import.meta.env.VITE_API_URL || API_URL;

export const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include' as RequestCredentials
};

export const api = {
  fetch: (endpoint: string, options: RequestInit = {}) => {
    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      ...apiConfig,
      headers: {
        ...apiConfig.headers,
        ...options.headers
      }
    });
  }
}; 