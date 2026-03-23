import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  balance: null,
  totalKoin: 0,
  totalDapat: 0,
  totalPakai: 0,
  isLoading: false,
  error: null,
  lastRefresh: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setBalance: (state, action) => {
      state.balance = action.payload;
      state.totalKoin = action.payload.total_koin || 0;
      state.totalDapat = action.payload.total_dapat || 0;
      state.totalPakai = action.payload.total_pakai || 0;
      state.isLoading = false;
      state.error = null;
      state.lastRefresh = new Date().toISOString();
    },

    updateBalance: (state, action) => {
      const { koinChange } = action.payload;
      state.totalKoin += koinChange;
      if (state.balance) {
        state.balance.total_koin = state.totalKoin;
      }
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    clearWallet: (state) => {
      state.balance = null;
      state.totalKoin = 0;
      state.totalDapat = 0;
      state.totalPakai = 0;
      state.error = null;
      state.lastRefresh = null;
    },

    refreshWallet: (state) => {
      state.isLoading = true;
    },
  },
});

export const {
  setBalance,
  updateBalance,
  setLoading,
  setError,
  clearWallet,
  refreshWallet,
} = walletSlice.actions;

export default walletSlice.reducer;
