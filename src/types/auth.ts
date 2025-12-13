import { User, UserRole } from './user';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  university?: string;
  department?: string;
}

