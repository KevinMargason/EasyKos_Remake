import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  payments: [],
  vouchers: [],
  currentPayment: null,
  isLoading: false,
  error: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setPayments: (state, action) => {
      state.payments = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    setCurrentPayment: (state, action) => {
      state.currentPayment = action.payload;
      state.error = null;
    },

    setVouchers: (state, action) => {
      state.vouchers = action.payload;
      state.error = null;
    },

    addPayment: (state, action) => {
      state.payments.push(action.payload);
    },

    updatePayment: (state, action) => {
      const index = state.payments.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.payments[index] = action.payload;
      }
      if (state.currentPayment?.id === action.payload.id) {
        state.currentPayment = action.payload;
      }
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    clearPayments: (state) => {
      state.payments = [];
      state.currentPayment = null;
      state.error = null;
    },
  },
});

export const {
  setPayments,
  setCurrentPayment,
  setVouchers,
  addPayment,
  updatePayment,
  setLoading,
  setError,
  clearPayments,
} = paymentSlice.actions;

export default paymentSlice.reducer;
