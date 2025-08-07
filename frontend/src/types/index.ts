export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  username: string;
  email: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface WatchedStock {
  id: number;
  symbol: string;
  minPrice?: number;
  maxPrice?: number;
  createdAt: string;
  active: boolean;
}

export interface WatchedStockRequest {
  symbol: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface Alert {
  id: number;
  symbol: string;
  currentPrice: number;
  thresholdPrice: number;
  alertType: 'MIN_PRICE_EXCEEDED' | 'MAX_PRICE_EXCEEDED';
  triggeredAt: string;
  read: boolean;
}

export interface ApiError {
  message: string;
  status: number;
}
