import { DEV_CREDENTIALS, DEV_MODE_ENABLED, DEV_USER } from "../config/devCredentials";
import type {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
} from "../types/auth";
import api from "./api";

export const authService = {
  /**
   * Register a new user
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>("/auth/register", data);
    return response.data;
  },

  /**
   * Check if credentials are dev credentials (for testing without backend)
   */
  isDevCredentials: (email: string, password: string): boolean => {
    if (!DEV_MODE_ENABLED) return false;
    return email === DEV_CREDENTIALS.email && password === DEV_CREDENTIALS.password;
  },

  /**
   * Login user and get tokens
   * First checks for dev credentials, then calls backend
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    // Check if dev credentials are being used
    if (authService.isDevCredentials(data.email, data.password)) {
      console.log("🔧 Dev login detected - bypassing backend");
      // Return a mock response with dev user and tokens
      return {
        access_token: "dev-token-" + Math.random().toString(36).substr(2, 9),
        refresh_token: "dev-refresh-" + Math.random().toString(36).substr(2, 9),
        expires_at: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        user: DEV_USER,
      };
    }

    // Otherwise, use backend authentication
    const response = await api.post<LoginResponse>("/auth/login", data);
    return response.data;
  },
};

export default authService;
