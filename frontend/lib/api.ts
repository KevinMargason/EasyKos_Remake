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
  async login(email: string, password: string) {
    return this.request<{ access_token: string; user: any }>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name: string, email: string, password: string, password_confirmation: string) {
    return this.request<{ access_token: string; user: any }>('/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, password_confirmation }),
    });
  }

  async logout(token: string) {
    return this.request('/logout', {
      method: 'POST',
      token,
    });
  }

  async getUser(token: string) {
    return this.request<any>('/me', { token });
  }

  // Rooms methods
  async getRooms(token?: string) {
    return this.request<any[]>('/rooms', { token });
  }

  async getRoom(id: string, token?: string) {
    return this.request<any>(`/rooms/${id}`, { token });
  }

  async createRoom(data: any, token: string) {
    return this.request<any>('/rooms', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
  }

  async updateRoom(id: string, data: any, token: string) {
    return this.request<any>(`/rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    });
  }

  async deleteRoom(id: string, token: string) {
    return this.request<any>(`/rooms/${id}`, {
      method: 'DELETE',
      token,
    });
  }

  // Tenants methods
  async getTenants(token?: string) {
    return this.request<any[]>('/tenants', { token });
  }

  async createTenant(data: any, token: string) {
    return this.request<any>('/tenants', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
  }

  // Payments methods
  async getPayments(token?: string) {
    return this.request<any[]>('/payments', { token });
  }

  async createPayment(data: any, token: string) {
    return this.request<any>('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
  }

  // Achievements methods
  async getAchievements(token: string) {
    return this.request<any[]>('/achievements', { token });
  }

  // Rewards methods
  async getRewards(token: string) {
    return this.request<any[]>('/rewards', { token });
  }

  async claimReward(id: string, token: string) {
    return this.request<any>(`/rewards/${id}/claim`, {
      method: 'POST',
      token,
    });
  }
}

export const api = new ApiClient(API_URL);
