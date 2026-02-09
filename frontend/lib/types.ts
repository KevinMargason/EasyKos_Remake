// Type definitions for EasyKos API

export interface User {
  id: string;
  name: string;
  email: string;
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  room_number: string;
  room_type: string;
  floor: number;
  capacity: number;
  price: number;
  facilities?: string[];
  status: 'available' | 'occupied' | 'maintenance';
  description?: string;
  images?: string[];
  created_at: string;
  updated_at: string;
}

export interface Tenant {
  id: string;
  user_id?: string;
  room_id: string;
  full_name: string;
  email: string;
  phone: string;
  id_card_number?: string;
  emergency_contact?: string;
  start_date: string;
  end_date?: string;
  status: 'active' | 'inactive' | 'moved_out';
  notes?: string;
  created_at: string;
  updated_at: string;
  room?: Room;
  user?: User;
}

export interface Payment {
  id: string;
  tenant_id: string;
  amount: number;
  payment_type: 'rent' | 'utilities' | 'deposit' | 'other';
  payment_method: 'cash' | 'bank_transfer' | 'e-wallet';
  payment_date: string;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  notes?: string;
  receipt_image?: string;
  created_at: string;
  updated_at: string;
  tenant?: Tenant;
}

export interface Achievement {
  id: string;
  user_id: string;
  title: string;
  description: string;
  icon?: string;
  points: number;
  criteria?: Record<string, any>;
  unlocked_at?: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  points_required: number;
  reward_type: 'discount' | 'free_month' | 'upgrade' | 'gift';
  value: string;
  available: boolean;
  image?: string;
  created_at: string;
  updated_at: string;
}

export interface ClaimedReward {
  id: string;
  user_id: string;
  reward_id: string;
  claimed_at: string;
  status: 'claimed' | 'used' | 'expired';
  expires_at?: string;
  created_at: string;
  updated_at: string;
  user?: User;
  reward?: Reward;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
