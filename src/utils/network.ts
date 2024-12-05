export function getLocalIP() {
  // Default to localhost if window is not defined (SSR)
  if (typeof window === 'undefined') return '127.0.0.1';
  
  // Use the current hostname if it's an IP address
  const hostname = window.location.hostname;
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
    return hostname;
  }
  
  return '127.0.0.1';
}

export const BASE_URL = `http://${getLocalIP()}`;
export const API_PORT = 5000;
export const CLIENT_PORT = 5001;

export const API_URL = `${BASE_URL}:${API_PORT}`;
export const CLIENT_URL = `${BASE_URL}:${CLIENT_PORT}`; 