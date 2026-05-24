import type { ApiError } from "../types/auth";

/**
 * Parses API/network errors into user-friendly messages.
 * Centralises error handling shared by login, signup, and other mutations.
 *
 * Handles both axios error shapes and the backend's simple { error: "message" } format.
 */

export const parseApiError = (err: any, fallback: string): string => {
  if (err.code === "ERR_NETWORK" || err.message === "Network Error") {
    return "Cannot connect to server. Please check your internet connection.";
  }

  if (err.code === "ECONNABORTED") {
    return "Request timed out. Please try again.";
  }

  if (err.response?.data) {
    const data = err.response.data;

    // Backend returns { error: "message string" }
    if (typeof data.error === "string") return data.error;

    // Legacy nested format { error: { message: "..." } }
    if (data.error?.message) return data.error.message;

    // Plain string response
    if (typeof data === "string") return data;

    // Generic message field
    if (data.message) return data.message;
  }

  if (err.message) return err.message;

  return fallback;
};
