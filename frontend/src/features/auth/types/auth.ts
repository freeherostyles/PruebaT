export const UserRole = {
  ADMIN: 'ADMIN',
  EXECUTIVE: 'EXECUTIVE',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}

export interface AuthProfileResponse extends AuthUser {
  isActive: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}
