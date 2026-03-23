import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/core/store/hooks';
import * as apiService from '@/core/services/api';
import { unwrapApiData, unwrapApiList } from '@/core/utils/apiResponse';
import {
  setTupai,
  setAllTupai,
  updateTupaiAfterAction,
  adoptTupai,
  setLoading,
  setError,
} from '@/core/feature/tupai/tupaiSlice';

export const useTupai = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector(state => state.tupai);

  const fetchAllTupai = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const response = await apiService.myTupai.getAll();
      const payload = unwrapApiList(response);
      dispatch(setAllTupai(payload));
      if (payload.length > 0) {
        dispatch(setTupai(payload[0]));
      }
    } catch (error) {
      dispatch(setError(error?.message || 'Gagal mengambil data tupai'));
      throw error;
    }
  }, [dispatch]);

  const fetchTupaiDetail = useCallback(async (id) => {
    try {
      dispatch(setLoading(true));
      const response = await apiService.myTupai.getDetail(id);
      dispatch(setTupai(unwrapApiData(response)));
    } catch (error) {
      dispatch(setError(error?.message || 'Gagal mengambil detail tupai'));
      throw error;
    }
  }, [dispatch]);

  const adoptNewTupai = useCallback(async (data) => {
    try {
      dispatch(setLoading(true));
      const response = await apiService.myTupai.adopt(data);
      dispatch(adoptTupai(unwrapApiData(response)));
      return response;
    } catch (error) {
      dispatch(setError(error?.message || 'Gagal mengadopsi tupai'));
      throw error;
    }
  }, [dispatch]);

  const feedTupai = useCallback(async (id) => {
    try {
      dispatch(setLoading(true));
      const response = await apiService.myTupai.feed(id);
      dispatch(updateTupaiAfterAction({
        tupai: unwrapApiData(response),
        action: 'feed',
      }));
      return response;
    } catch (error) {
      dispatch(setError(error?.message || 'Gagal memberi makan tupai'));
      throw error;
    }
  }, [dispatch]);

  const sleepTupai = useCallback(async (id) => {
    try {
      dispatch(setLoading(true));
      const response = await apiService.myTupai.sleep(id);
      dispatch(updateTupaiAfterAction({
        tupai: unwrapApiData(response),
        action: 'sleep',
      }));
      return response;
    } catch (error) {
      dispatch(setError(error?.message || 'Gagal membuat tupai tidur'));
      throw error;
    }
  }, [dispatch]);

  return {
    ...state,
    fetchAllTupai,
    fetchTupaiDetail,
    adoptNewTupai,
    feedTupai,
    sleepTupai,
  };
};
