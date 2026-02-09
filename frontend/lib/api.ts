import type {
  User,
  Room,
  Tenant,
  Payment,
  Achievement,
  Reward,
  AuthResponse,
} from './types';

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

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

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
  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(
    name: string,
    email: string,
    password: string,
    password_confirmation: string
  ): Promise<AuthResponse> {
    return this.request<AuthResponse>('/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, password_confirmation }),
    });
  }

  async logout(token: string): Promise<{ message: string }> {
    return this.request('/logout', {
      method: 'POST',
      token,
    });
  }

  async getUser(token: string): Promise<User> {
    return this.request<User>('/me', { token });
  }

  // Rooms methods
  async getRooms(token?: string): Promise<Room[]> {
    return this.request<Room[]>('/rooms', { token });
  }

  async getRoom(id: string, token?: string): Promise<Room> {
    return this.request<Room>(`/rooms/${id}`, { token });
  }

  async createRoom(data: Partial<Room>, token: string): Promise<Room> {
    return this.request<Room>('/rooms', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
  }

  async updateRoom(id: string, data: Partial<Room>, token: string): Promise<Room> {
    return this.request<Room>(`/rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    });
  }

  async deleteRoom(id: string, token: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/rooms/${id}`, {
      method: 'DELETE',
      token,
    });
  }

  // Tenants methods
  async getTenants(token?: string): Promise<Tenant[]> {
    return this.request<Tenant[]>('/tenants', { token });
  }

  async getTenant(id: string, token?: string): Promise<Tenant> {
    return this.request<Tenant>(`/tenants/${id}`, { token });
  }

  async createTenant(data: Partial<Tenant>, token: string): Promise<Tenant> {
    return this.request<Tenant>('/tenants', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
  }

  async updateTenant(id: string, data: Partial<Tenant>, token: string): Promise<Tenant> {
    return this.request<Tenant>(`/tenants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    });
  }

  async deleteTenant(id: string, token: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/tenants/${id}`, {
      method: 'DELETE',
      token,
    });
  }

  // Payments methods
  async getPayments(token?: string): Promise<Payment[]> {
    return this.request<Payment[]>('/payments', { token });
  }

  async getPayment(id: string, token?: string): Promise<Payment> {
    return this.request<Payment>(`/payments/${id}`, { token });
  }

  async createPayment(data: Partial<Payment>, token: string): Promise<Payment> {
    return this.request<Payment>('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
  }

  async updatePayment(id: string, data: Partial<Payment>, token: string): Promise<Payment> {
    return this.request<Payment>(`/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    });
  }

  // Achievements methods
  async getAchievements(token: string): Promise<Achievement[]> {
    return this.request<Achievement[]>('/achievements', { token });
  }

  // Rewards methods
  async getRewards(token: string): Promise<Reward[]> {
    return this.request<Reward[]>('/rewards', { token });
  }

  async claimReward(id: string, token: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/rewards/${id}/claim`, {
      method: 'POST',
      token,
    });
  }
}

export const api = new ApiClient(API_URL);
