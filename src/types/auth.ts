export interface AuthLoginResponse {
  token: string;
  refreshToken?: string;
  user?: Record<string, any>;
}

export interface AuthUser {
  id?: string;
  email?: string;
  name?: string;
  [key: string]: any;
}
