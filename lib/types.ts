// Type definitions for EasyKos API

export interface User {
  id: string;
  nama: string;
  no_hp: string;
  email?: string | null;
  role: 'owner' | 'user';
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  status: 'success' | 'error';
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiError {
  status: 'error';
  message: string;
  errors?: Record<string, string[]>;
}
