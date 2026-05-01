/**
 * Development/Debug Credentials
 * These are used for testing the app without backend connectivity
 * Remove or disable these in production
 */

export const DEV_CREDENTIALS = {
  email: "dev@saythis.com",
  password: "dev123456",
};

export const DEV_USER = {
  id: "dev-user-001",
  email: "dev@saythis.com",
  full_name: "Development User",
  role: "user",
  created_at: new Date().toISOString(),
};

/**
 * Enable dev mode login
 * Set to false to disable dev credentials
 */
export const DEV_MODE_ENABLED = true;
