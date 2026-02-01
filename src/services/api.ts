import axios from "axios";
import { storage, StorageKeys } from "../utils/storage";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

// Log the API base URL for debugging
console.log("[API] Base URL:", API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor - attach auth token and log requests
api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
      data: config.data,
    });

    try {
      const token = storage.getItem(StorageKeys.USER_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn("[API] Failed to get token from storage:", error);
    }
    return config;
  },
  (error) => {
    console.error("[API] Request error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor - log responses and handle errors
api.interceptors.response.use(
  (response) => {
    console.log(`[API] Response ${response.status}:`, response.data);
    return response;
  },
  (error) => {
    console.error("[API] Error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      code: error.code,
    });

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      storage.removeItem(StorageKeys.USER_TOKEN);
      storage.removeItem(StorageKeys.USER_REFRESH_TOKEN);
    }
    return Promise.reject(error);
  },
);

export default api;
