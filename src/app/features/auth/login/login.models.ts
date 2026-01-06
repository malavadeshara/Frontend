export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Adjust field names if your backend differs
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
}