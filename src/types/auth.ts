// Auth Types

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

// --- Request Types ---

export interface RegisterRequest {
  email: string;
  full_name: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

// --- Response Types ---

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

export type RegisterResponse = AuthResponse;
export type LoginResponse = AuthResponse;

export interface RefreshResponse {
  access_token: string;
  refresh_token: string;
}

export interface MessageResponse {
  message: string;
}

export interface ApiError {
  error: string;
}
