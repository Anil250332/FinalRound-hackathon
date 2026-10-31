import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://finalround-hackathon-backend.onrender.com/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pulserelay_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If backend is sleeping on Render Free tier, provide clear info
    if (error.code === 'ECONNABORTED' || error.message?.includes('Network Error')) {
      console.warn('Backend server may be waking up from Render free tier sleep...');
    }
    return Promise.reject(error);
  }
);

export const checkServerHealth = async (): Promise<boolean> => {
  try {
    const healthUrl = (import.meta.env.VITE_API_URL || 'https://finalround-hackathon-backend.onrender.com').replace('/api/v1', '') + '/health';
    const res = await axios.get(healthUrl, { timeout: 8000 });
    return res.data?.status === 'healthy';
  } catch {
    return false;
  }
};
