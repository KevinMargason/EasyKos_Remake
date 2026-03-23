import { useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/core/store/hooks';
import * as apiService from '@/core/services/api';
import {
  setPayments,
  setCurrentPayment,
  setVouchers,
  addPayment,
  updatePayment,
  setLoading,
  setError,
} from '@/core/feature/payment/paymentSlice';

export const usePayments = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector(state => state.payment);
  const [paymentMethods, setPaymentMethods] = useState([]);

  const fetchPayments = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const response = await apiService.payments.getAll();
      if (response.success) {
        dispatch(setPayments(response.data));
      }
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    }
  }, [dispatch]);

  const fetchPaymentDetail = useCallback(async (id) => {
    try {
      dispatch(setLoading(true));
      const response = await apiService.payments.getDetail(id);
      if (response.success) {
        dispatch(setCurrentPayment(response.data));
      }
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    }
  }, [dispatch]);

  const createPayment = useCallback(async (data) => {
    try {
      dispatch(setLoading(true));
      const response = await apiService.payments.create(data);
      if (response.success) {
        dispatch(addPayment(response.data));
      }
      return response;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    }
  }, [dispatch]);

  const paymentProcess = useCallback(async (id) => {
    try {
      dispatch(setLoading(true));
      const response = await apiService.payments.pay(id);
      if (response.success) {
        dispatch(updatePayment(response.data));
      }
      return response;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    }
  }, [dispatch]);

  const fetchVouchers = useCallback(async () => {
    try {
      const response = await apiService.vouchers.getAll();
      if (response.success) {
        dispatch(setVouchers(response.data));
      }
    } catch (error) {
      dispatch(setError(error.message));
    }
  }, [dispatch]);

  const createVoucher = useCallback(async (data) => {
    try {
      const response = await apiService.vouchers.create(data);
      return response;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    }
  }, [dispatch]);

  // Payment Methods Functions
  const fetchPaymentMethods = useCallback(async () => {
    try {
      const response = await apiService.paymentMethods.getAll();
      setPaymentMethods(response || []);
      return response || [];
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
      setPaymentMethods([]);
      return [];
    }
  }, []);

  const createPaymentMethod = useCallback(async (data) => {
    try {
      const response = await apiService.paymentMethods.create(data);
      // Refresh payment methods list after creating
      await fetchPaymentMethods();
      return response;
    } catch (error) {
      console.error('Failed to create payment method:', error);
      throw error;
    }
  }, [fetchPaymentMethods]);

  const deletePaymentMethod = useCallback(async (id) => {
    try {
      const response = await apiService.paymentMethods.delete(id);
      // Refresh payment methods list after deleting
      await fetchPaymentMethods();
      return response;
    } catch (error) {
      console.error('Failed to delete payment method:', error);
      throw error;
    }
  }, [fetchPaymentMethods]);

  return {
    ...state,
    paymentMethods,
    fetchPayments,
    fetchPaymentDetail,
    createPayment,
    paymentProcess,
    fetchVouchers,
    createVoucher,
    fetchPaymentMethods,
    createPaymentMethod,
    deletePaymentMethod,
  };
};
