// Type definitions for EasyKos API

export interface User {
  id: string | number;
  name?: string;
  nama?: string;
  email: string;
  no_hp: string;
  role: 'owner' | 'tenant' | 'admin';
  monthly_subs?: number;
  created_at?: string;
  updated_at?: string;
  pin?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: User;
  };
  user?: User;
  access_token?: string;
  token_type?: string;
}

export interface ApiError {
  success: false;
  message: string;
  data?: Record<string, string[]>;
}

// ======================== KOS & ROOMS ========================

export interface Kos {
  id: number;
  nama: string;
  alamat: string;
  jumlah_kamar: number;
  gender: 'Putra' | 'Putri' | 'Campur';
  rating?: number;
  region_idregion?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Room {
  id: number;
  kos_id: number;
  nomor_kamar: string;
  ukuran_kamar: string;
  harga: number;
  listrik: 'token' | 'pasca_bayar' | 'tidak_ada';
  users_id?: number | null;
  kos?: Kos;
  created_at?: string;
  updated_at?: string;
}

export interface Fasilitas {
  id: number;
  nama_fasilitas: string;
  kategori: 'privat' | 'publik';
  status: boolean;
  created_at?: string;
}

export interface Aturan {
  id: number;
  nama_aturan: string;
  deskripsi?: string;
  created_at?: string;
}

// ======================== PAYMENTS ========================

export interface Payment {
  id: number;
  rooms_id: number;
  tenant: number;
  jenis_pembayaran: 'bulanan' | 'tahunan';
  nominal: number;
  status: 'PAID' | 'UNPAID';
  invoice_number?: string;
  voucher_id?: number | null;
  duedate?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Voucher {
  id: number;
  kode: string;
  nominal_diskon: number;
  expired: string;
  created_at?: string;
  updated_at?: string;
}

// ======================== MYPET (TUPAI) ========================

export interface MyTupai {
  id: number;
  nama: string;
  level: number;
  xp: number;
  status: 'happy' | 'sleeping' | 'hungry';
  level_lapar: number;
  level_stamina: number;
  terakhir_makan?: string;
  terakhir_tidur?: string;
  tidur_sampai?: string;
  users_id: number;
  created_at?: string;
  updated_at?: string;
}

// ======================== WALLET & REWARDS ========================

export interface Wallet {
  id: number;
  users_id: number;
  total_koin: number;
  total_dapat: number;
  total_pakai: number;
  created_at?: string;
  updated_at?: string;
}

export interface Reward {
  id: number;
  users_id: number;
  voucher_id: number;
  harga_koin: number;
  status: 'success' | 'pending' | 'failed';
  created_at?: string;
}

// ======================== MISSIONS ========================

export interface Mission {
  id: string;
  misi_user_id: string;
  nama_misi: string;
  deskripsi?: string;
  reward_coin: number;
  reward_xp: number;
  is_completed: boolean;
  is_claimed: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DailyLoginLog {
  id: number;
  users_id: number;
  login_date: string;
  koin_didapat: number;
  streak_sekarang: number;
  created_at?: string;
}

// ======================== API RESPONSES ========================

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  access_token?: string;
  token_type?: string;
}
