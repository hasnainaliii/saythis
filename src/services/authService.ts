import type {
  AuthResponse,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  MessageResponse,
  RefreshResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  VerifyEmailRequest,
} from "../types/auth";
import api from "./api";

export const authService = {
  /**
   * Register a new user
   * Returns user + access_token + refresh_token (auto-login)
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>("/auth/register", data);
    return response.data;
  },

  /**
   * Login user with email + password
   * Returns user + access_token + refresh_token
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", data);
    return response.data;
  },

  /**
   * Refresh access token using refresh token
   * Old refresh token is invalidated (rotation)
   */
  refreshTokens: async (refreshToken: string): Promise<RefreshResponse> => {
    const response = await api.post<RefreshResponse>("/auth/refresh", {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  /**
   * Verify email using one-time token from verification email
   */
  verifyEmail: async (token: string): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>("/auth/verify-email", {
      token,
    });
    return response.data;
  },

  /**
   * Send password reset email
   * Always returns 200 OK regardless of whether email exists (anti-enumeration)
   */
  forgotPassword: async (email: string): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>("/auth/forgot-password", {
      email,
    });
    return response.data;
  },

  /**
   * Reset password using one-time token from reset email
   */
  resetPassword: async (
    token: string,
    password: string,
  ): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>("/auth/reset-password", {
      token,
      password,
    });
    return response.data;
  },
};

export default authService;
