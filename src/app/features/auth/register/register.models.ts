export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
}

/**
 * Backend returns only status code (201).
 * This is kept for future extensibility.
 */
export interface RegisterResponse {}