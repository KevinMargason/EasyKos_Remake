import type { User, AuthResponse } from './types';

// For environment variables in Next.js
declare var process: {
  env: {
    NODE_ENV: 'development' | 'production' | 'test';
    NEXT_PUBLIC_API_URL?: string;
  };
};

const DEFAULT_API_URL = process.env.NODE_ENV === 'production'
  ? 'https://easykosbackend-production.up.railway.app/api'
  : 'http://localhost:8000/api';

const ensureApiSuffix = (url: string): string => {
  const trimmedUrl = url.trim().replace(/\/+$/, '');
  return /\/api$/i.test(trimmedUrl) ? trimmedUrl : `${trimmedUrl}/api`;
};

const API_URL = ensureApiSuffix(process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL);

interface RequestOptions extends RequestInit {
  token?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { token, ...fetchOptions } = options;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (options.headers && typeof options.headers === 'object' && !Array.isArray(options.headers)) {
      Object.assign(headers, options.headers);
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth methods
  async login(no_hp: string, pin: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/login', {
      method: 'POST',
      body: JSON.stringify({ no_hp, password: pin }),
    });
  }

  async register(
    nama: string,
    no_hp: string,
    pin: string,
    email: string | null,
    role: 'owner' | 'tenant' | 'admin'
  ): Promise<AuthResponse> {
    return this.request<AuthResponse>('/register', {
      method: 'POST',
      body: JSON.stringify({ nama, no_hp, password: pin, email, role }),
    });
  }

  async logout(token: string): Promise<{ status: string; message: string }> {
    return this.request('/logout', {
      method: 'POST',
      token,
    });
  }

  async getUser(token: string): Promise<{ status: string; data: { user: User } }> {
    return this.request('/me', { token });
  }
}

export const api = new ApiClient(API_URL);
