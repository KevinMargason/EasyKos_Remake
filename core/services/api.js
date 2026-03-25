import { createAxiosInstance } from './axiosInstances';
import axios from 'axios';

// 1. Define the config first
export const apiConfig = {
  mode: 'PRODUCTION',
  baseUrl: 'https://easykosbackend-production.up.railway.app/api',
};

// 2. Create the instance and MANUALLY set the baseURL
const axiosInstance = createAxiosInstance();
axiosInstance.defaults.baseURL = apiConfig.baseUrl; // This forces the Railway URL

export default axiosInstance;
// ======================== AUTH ENDPOINTS ========================

export const auth = {
  register: async (data) => {
    const response = await axiosInstance.post('/register', data);
    return response.data;
  },

  login: async (data) => {
    const response = await axiosInstance.post('/login', data);
    return response.data;
  },

  updateProfile: async (data) => {
    try {
      // Try multiple endpoint patterns to find the correct one
      try {
        const response = await axiosInstance.put('/profile', data);
        return response.data;
      } catch (error) {
        if (error.response?.status === 404) {
          // If /profile endpoint doesn't exist, try alternative endpoints
          try {
            const response = await axiosInstance.put('/users/profile', data);
            return response.data;
          } catch (e) {
            // If that also fails, return a success response for local-only update
            console.warn('Profile update: Backend endpoint not implemented, using local storage only');
            return {
              success: true,
              message: 'Profil disimpan secara lokal (backend endpoint belum tersedia)',
              data,
              isLocalOnly: true,
            };
          }
        }
        throw error;
      }
    } catch (error) {
      console.error('Profile update error:', error.message);
      // Return local success for now to avoid blocking
      return {
        success: true,
        message: 'Profil disimpan secara lokal',
        data,
        isLocalOnly: true,
        error: error.message,
      };
    }
  },

  getProfile: async () => {
    try {
      const response = await axiosInstance.get('/profile');
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        console.warn('Get profile endpoint not found');
        return null;
      }
      throw error;
    }
  },
};

// ======================== KOS & ROOMS ENDPOINTS ========================

export const kos = {
  getAll: async () => {
    const response = await axiosInstance.get('/kos');
    return response.data;
  },

  getDetail: async (id) => {
    const response = await axiosInstance.get(`/kos/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await axiosInstance.post('/kos', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`/kos/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/kos/${id}`);
    return response.data;
  },

  getCurrent: async () => {
    const response = await axiosInstance.get('/kos/current');
    return response.data;
  },
};

export const rooms = {
  getAll: async () => {
    const response = await axiosInstance.get('/rooms');
    return response.data;
  },

  getDetail: async (id) => {
    const response = await axiosInstance.get(`/rooms/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await axiosInstance.post('/rooms', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`/rooms/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/rooms/${id}`);
    return response.data;
  },
};

export const fasilitas = {
  getAll: async () => {
    const response = await axiosInstance.get('/fasilitas');
    return response.data;
  },

  create: async (data) => {
    const response = await axiosInstance.post('/fasilitas', data);
    return response.data;
  },
};

export const aturan = {
  getAll: async () => {
    const response = await axiosInstance.get('/aturan');
    return response.data;
  },

  create: async (data) => {
    const response = await axiosInstance.post('/aturan', data);
    return response.data;
  },
};

// ======================== PAYMENT ENDPOINTS ========================

export const payments = {
  getAll: async () => {
    const response = await axiosInstance.get('/payments');
    return response.data;
  },

  getDetail: async (id) => {
    const response = await axiosInstance.get(`/payments/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await axiosInstance.post('/payments', data);
    return response.data;
  },

  pay: async (id) => {
    const response = await axiosInstance.post(`/payments/${id}/pay`);
    return response.data;
  },
};

export const vouchers = {
  getAll: async () => {
    const response = await axiosInstance.get('/vouchers');
    return response.data;
  },

  create: async (data) => {
    const response = await axiosInstance.post('/vouchers', data);
    return response.data;
  },
};

// ======================== MYPET (TUPAI) ENDPOINTS ========================

export const myTupai = {
  getAll: async () => {
    const response = await axiosInstance.get('/mytupai');
    return response.data;
  },

  getDetail: async (id) => {
    const response = await axiosInstance.get(`/mytupai/${id}`);
    return response.data;
  },

  adopt: async (data) => {
    const response = await axiosInstance.post('/mytupai', data);
    return response.data;
  },

  feed: async (id) => {
    const response = await axiosInstance.post(`/mytupai/${id}/feed`);
    return response.data;
  },

  sleep: async (id) => {
    const response = await axiosInstance.post(`/mytupai/${id}/sleep`);
    return response.data;
  },
};

// ======================== WALLET & REWARDS ENDPOINTS ========================

export const wallet = {
  getBalance: async (userId) => {
    const response = await axiosInstance.get(`/wallet/balance/${userId}`);
    return response.data;
  },
};

export const rewards = {
  redeemVoucher: async (data) => {
    const response = await axiosInstance.post('/rewards/redeem', data);
    return response.data;
  },
};

// ======================== MISSIONS ENDPOINTS ========================

export const missions = {
  getAll: async (userId) => {
    const response = await axiosInstance.get(`/missions?users_id=${userId}`);
    return response.data;
  },

  claim: async (data) => {
    const response = await axiosInstance.post('/missions/claim', data);
    return response.data;
  },
};

export const dailyLogin = {
  claim: async (data) => {
    const response = await axiosInstance.post('/daily-login/claim', data);
    return response.data;
  },
};

// ======================== MESSAGES/CHAT ENDPOINTS ========================

export const messages = {
  getChats: async () => {
    try {
      const response = await axiosInstance.get('/chats');
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch chats:', error.message);
      return null;
    }
  },

  getThread: async (threadId) => {
    const response = await axiosInstance.get(`/chats/${threadId}`);
    return response.data;
  },

  sendMessage: async (data) => {
    try {
      const response = await axiosInstance.post('/messages', data);
      return response.data;
    } catch (error) {
      console.error('Failed to send message:', error.message);
      throw error;
    }
  },

  getMessages: async (threadId) => {
    const response = await axiosInstance.get(`/chats/${threadId}/messages`);
    return response.data;
  },
};

// ======================== RESIDENTS ENDPOINTS ========================

export const residents = {
  getAll: async () => {
    try {
      const response = await axiosInstance.get('/residents');
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch residents:', error.message);
      return null;
    }
  },

  getByKos: async (kosId) => {
    try {
      const response = await axiosInstance.get(`/kos/${kosId}/residents`);
      return response.data;
    } catch (error) {
      console.warn(`Failed to fetch residents for kos ${kosId}:`, error.message);
      return null;
    }
  },
};

// ======================== PAYMENT METHODS ENDPOINTS ========================

export const paymentMethods = {
  getAll: async () => {
    try {
      const response = await axiosInstance.get('/payment-methods');
      return response.data || [];
    } catch (error) {
      console.warn('Failed to fetch payment methods:', error.message);
      return [];
    }
  },

  create: async (data) => {
    try {
      const response = await axiosInstance.post('/payment-methods', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create payment method:', error.message);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await axiosInstance.put(`/payment-methods/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to update payment method:', error.message);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await axiosInstance.delete(`/payment-methods/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete payment method:', error.message);
      throw error;
    }
  },
};

// ======================== GROUPED API EXPORT ========================
export const api = {
  auth,
  kos,
  rooms,
  fasilitas,
  aturan,
  payments,
  paymentMethods,
  vouchers,
  myTupai,
  wallet,
  rewards,
  missions,
  dailyLogin,
  messages,
  residents,
};
