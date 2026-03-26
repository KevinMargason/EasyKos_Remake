import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/core/store/hooks';
import * as apiService from '@/core/services/api';
import { unwrapApiData } from '@/core/utils/apiResponse';
import {
  setTupai,
  adoptTupai,
  setLoading,
  setError,
} from '@/core/feature/tupai/tupaiSlice';

export const useTupai = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector(state => state.tupai);

  const fetchAllTupai = useCallback(async () => {
    dispatch(setLoading(true));
    const payload = state.tupai ? [state.tupai] : [];
    dispatch({ type: 'tupai/setAllTupai', payload });
    if (state.tupai) {
      dispatch(setTupai(state.tupai));
    }
    dispatch(setLoading(false));
    return { success: true, data: payload };
  }, [dispatch]);

  const fetchTupaiDetail = useCallback(async (id) => {
    dispatch(setLoading(true));
    const currentTupai = state.tupai && String(state.tupai.id) === String(id) ? state.tupai : null;
    if (currentTupai) {
      dispatch(setTupai(currentTupai));
    }
    dispatch(setLoading(false));
    return { success: true, data: currentTupai };
  }, [dispatch, state.tupai]);

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
    dispatch(setLoading(true));
    const currentTupai = state.tupai && String(state.tupai.id) === String(id) ? state.tupai : null;

    if (!currentTupai) {
      dispatch(setLoading(false));
      return { success: false, message: 'Tupai tidak ditemukan' };
    }

    const nextTupai = {
      ...currentTupai,
      level_lapar: Math.min(100, Number(currentTupai.level_lapar || 0) + 30),
      xp: Number(currentTupai.xp || 0) + 10,
      terakhir_makan: new Date().toISOString(),
      status: 'normal',
    };

    dispatch(setTupai(nextTupai));
    dispatch({
      type: 'tupai/updateTupaiAfterAction',
      payload: { tupai: nextTupai, action: 'feed' },
    });
    dispatch(setLoading(false));
    return { success: true, data: nextTupai };
  }, [dispatch, state.tupai]);

  const sleepTupai = useCallback(async (id) => {
    dispatch(setLoading(true));
    const currentTupai = state.tupai && String(state.tupai.id) === String(id) ? state.tupai : null;

    if (!currentTupai) {
      dispatch(setLoading(false));
      return { success: false, message: 'Tupai tidak ditemukan' };
    }

    const nextTupai = {
      ...currentTupai,
      status: 'sleeping',
      terakhir_tidur: new Date().toISOString(),
      tidur_sampai: new Date(Date.now() + 60 * 60000).toISOString(),
    };

    dispatch(setTupai(nextTupai));
    dispatch({
      type: 'tupai/updateTupaiAfterAction',
      payload: { tupai: nextTupai, action: 'sleep' },
    });
    dispatch(setLoading(false));
    return { success: true, data: nextTupai };
  }, [dispatch, state.tupai]);

  return {
    ...state,
    fetchAllTupai,
    fetchTupaiDetail,
    adoptNewTupai,
    feedTupai,
    sleepTupai,
  };
};
