import axios, { AxiosResponse } from 'axios';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  WatchedStock,
  WatchedStockRequest,
  Alert
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Dodanie interceptora dla obsługi błędów odpowiedzi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token wygasł lub jest nieprawidłowy
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Zamiast przekierowania, wyrzuć błąd który zostanie obsłużony w komponencie
      return Promise.reject(new Error('Unauthorized - please login again'));
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export const watchlistService = {
  getWatchlist: async (): Promise<WatchedStock[]> => {
    const response: AxiosResponse<WatchedStock[]> = await api.get('/watchlist');
    return response.data;
  },

  addStock: async (stockData: WatchedStockRequest): Promise<WatchedStock> => {
    const response: AxiosResponse<WatchedStock> = await api.post('/watchlist', stockData);
    return response.data;
  },

  updateStock: async (id: number, stockData: WatchedStockRequest): Promise<WatchedStock> => {
    const response: AxiosResponse<WatchedStock> = await api.put(`/watchlist/${id}`, stockData);
    return response.data;
  },

  removeStock: async (id: number): Promise<void> => {
    await api.delete(`/watchlist/${id}`);
  }
};

export const alertService = {
  getAlerts: async (page: number = 0, size: number = 20): Promise<Alert[]> => {
    const response: AxiosResponse<Alert[]> = await api.get('/alerts', {
      params: { page, size }
    });
    return response.data;
  },

  getUnreadAlerts: async (): Promise<Alert[]> => {
    const response: AxiosResponse<Alert[]> = await api.get('/alerts/unread');
    return response.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const response: AxiosResponse<number> = await api.get('/alerts/unread/count');
    return response.data;
  },

  markAsRead: async (alertIds: number[]): Promise<void> => {
    await api.put('/alerts/mark-read', alertIds);
  }
};
