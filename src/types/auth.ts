// Auth Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  role?: string;
  created_at?: string;
}

export interface RegisterRequest {
  email: string;
  full_name: string;
  password: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: User;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}
