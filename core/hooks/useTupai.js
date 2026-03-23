import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/core/store/hooks';
import * as apiService from '@/core/services/api';
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
      if (response.success) {
        dispatch(setAllTupai(response.data));
        if (response.data && response.data.length > 0) {
          dispatch(setTupai(response.data[0]));
        }
      }
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    }
  }, [dispatch]);

  const fetchTupaiDetail = useCallback(async (id) => {
    try {
      dispatch(setLoading(true));
      const response = await apiService.myTupai.getDetail(id);
      if (response.success) {
        dispatch(setTupai(response.data));
      }
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    }
  }, [dispatch]);

  const adoptNewTupai = useCallback(async (data) => {
    try {
      dispatch(setLoading(true));
      const response = await apiService.myTupai.adopt(data);
      if (response.success) {
        dispatch(adoptTupai(response.data));
      }
      return response;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    }
  }, [dispatch]);

  const feedTupai = useCallback(async (id) => {
    try {
      dispatch(setLoading(true));
      const response = await apiService.myTupai.feed(id);
      if (response.success) {
        dispatch(updateTupaiAfterAction({
          tupai: response.data,
          action: 'feed',
        }));
      }
      return response;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    }
  }, [dispatch]);

  const sleepTupai = useCallback(async (id) => {
    try {
      dispatch(setLoading(true));
      const response = await apiService.myTupai.sleep(id);
      if (response.success) {
        dispatch(updateTupaiAfterAction({
          tupai: response.data,
          action: 'sleep',
        }));
      }
      return response;
    } catch (error) {
      dispatch(setError(error.message));
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
