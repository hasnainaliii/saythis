import type { ApiError } from "../types/auth";

/**
 * Parses API/network errors into user-friendly messages.
 * Centralises error handling shared by login, signup, and other mutations.
 */

export const parseApiError = (err: any, fallback: string): string => {
  if (err.code === "ERR_NETWORK" || err.message === "Network Error") {
    return "Cannot connect to server. Please check your internet connection.";
  }

  if (err.code === "ECONNABORTED") {
    return "Request timed out. Please try again.";
  }

  if (err.response?.data) {
    const apiError = err.response.data as ApiError;
    if (apiError?.error?.message) return apiError.error.message;
    if (typeof err.response.data === "string") return err.response.data;
    if (err.response.data.message) return err.response.data.message;
  }

  if (err.message) return err.message;

  return fallback;
};
