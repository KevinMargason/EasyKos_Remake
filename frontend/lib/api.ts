import type { User, AuthResponse } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

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
      body: JSON.stringify({ no_hp, pin }),
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
      body: JSON.stringify({ nama, no_hp, pin, email, role }),
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
