import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/core/store/hooks';
import * as apiService from '@/core/services/api';
import {
  setBalance,
  updateBalance,
  setLoading,
  setError,
} from '@/core/feature/wallet/walletSlice';

export const useWallet = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector(state => state.wallet);

  const fetchBalance = useCallback(async (userId) => {
    try {
      dispatch(setLoading(true));
      const response = await apiService.wallet.getBalance(userId);
      if (response.success) {
        dispatch(setBalance(response.data));
      }
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    }
  }, [dispatch]);

  const redeemVoucher = useCallback(async (data) => {
    try {
      dispatch(setLoading(true));
      const response = await apiService.rewards.redeemVoucher(data);
      if (response.success) {
        // Update balance after redeem
        const koinSpent = data.harga_koin || 0;
        dispatch(updateBalance({ koinChange: -koinSpent }));
      }
      return response;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    }
  }, [dispatch]);

  return {
    ...state,
    fetchBalance,
    redeemVoucher,
  };
};
