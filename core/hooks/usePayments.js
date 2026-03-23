import { useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/core/store/hooks';
import * as apiService from '@/core/services/api';
import { unwrapApiData, unwrapApiList } from '@/core/utils/apiResponse';
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
      dispatch(setPayments(unwrapApiList(response)));
    } catch (error) {
      dispatch(setError(error?.message || 'Gagal mengambil daftar pembayaran'));
      throw error;
    }
  }, [dispatch]);

  const fetchPaymentDetail = useCallback(async (id) => {
    try {
      dispatch(setLoading(true));
      const response = await apiService.payments.getDetail(id);
      dispatch(setCurrentPayment(unwrapApiData(response)));
    } catch (error) {
      dispatch(setError(error?.message || 'Gagal mengambil detail pembayaran'));
      throw error;
    }
  }, [dispatch]);

  const createPayment = useCallback(async (data) => {
    try {
      dispatch(setLoading(true));
      const response = await apiService.payments.create(data);
      dispatch(addPayment(unwrapApiData(response)));
      return response;
    } catch (error) {
      dispatch(setError(error?.message || 'Gagal membuat pembayaran'));
      throw error;
    }
  }, [dispatch]);

  const paymentProcess = useCallback(async (id) => {
    try {
      dispatch(setLoading(true));
      const response = await apiService.payments.pay(id);
      dispatch(updatePayment(unwrapApiData(response)));
      return response;
    } catch (error) {
      dispatch(setError(error?.message || 'Gagal memproses pembayaran'));
      throw error;
    }
  }, [dispatch]);

  const fetchVouchers = useCallback(async () => {
    try {
      const response = await apiService.vouchers.getAll();
      dispatch(setVouchers(unwrapApiList(response)));
    } catch (error) {
      dispatch(setError(error?.message || 'Gagal mengambil voucher'));
    }
  }, [dispatch]);

  const createVoucher = useCallback(async (data) => {
    try {
      const response = await apiService.vouchers.create(data);
      return response;
    } catch (error) {
      dispatch(setError(error?.message || 'Gagal membuat voucher'));
      throw error;
    }
  }, [dispatch]);

  // Payment Methods Functions
  const fetchPaymentMethods = useCallback(async () => {
    try {
      const response = await apiService.paymentMethods.getAll();
      const list = unwrapApiList(response);
      setPaymentMethods(list);
      return list;
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
