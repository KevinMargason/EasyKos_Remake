import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/core/store/hooks';
import * as apiService from '@/core/services/api';
import {
  setKosList,
  setCurrentKos,
  setRoomsList,
  setCurrentRoom,
  setFasilitas,
  setAturan,
  setLoading,
  setError,
} from '@/core/feature/kos/kosSlice';

export const useKos = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector(state => state.kos);

  const fetchKos = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const response = await apiService.kos.getAll();
      if (response.success) {
        dispatch(setKosList(response.data));
      }
    } catch (error) {
      dispatch(setError(error.message));
    }
  }, [dispatch]);

  const fetchKosDetail = useCallback(async (id) => {
    try {
      dispatch(setLoading(true));
      const response = await apiService.kos.getDetail(id);
      if (response.success) {
        dispatch(setCurrentKos(response.data));
      }
    } catch (error) {
      dispatch(setError(error.message));
    }
  }, [dispatch]);

  const fetchRooms = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const response = await apiService.rooms.getAll();
      if (response.success) {
        dispatch(setRoomsList(response.data));
      }
    } catch (error) {
      dispatch(setError(error.message));
    }
  }, [dispatch]);

  const fetchRoomDetail = useCallback(async (id) => {
    try {
      dispatch(setLoading(true));
      const response = await apiService.rooms.getDetail(id);
      if (response.success) {
        dispatch(setCurrentRoom(response.data));
      }
    } catch (error) {
      dispatch(setError(error.message));
    }
  }, [dispatch]);

  const fetchFasilitas = useCallback(async () => {
    try {
      const response = await apiService.fasilitas.getAll();
      if (response.success) {
        dispatch(setFasilitas(response.data));
      }
    } catch (error) {
      dispatch(setError(error.message));
    }
  }, [dispatch]);

  const fetchAturan = useCallback(async () => {
    try {
      const response = await apiService.aturan.getAll();
      if (response.success) {
        dispatch(setAturan(response.data));
      }
    } catch (error) {
      dispatch(setError(error.message));
    }
  }, [dispatch]);

  const fetchCurrentKos = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const response = await apiService.kos.getCurrent();
      if (response.success || response.data) {
        dispatch(setCurrentKos(response.data || response));
      } else {
        dispatch(setError('Gagal mengambil data kos saat ini'));
      }
    } catch (error) {
      dispatch(setError(error.message));
    }
  }, [dispatch]);

  return {
    ...state,
    fetchKos,
    fetchKosDetail,
    fetchRooms,
    fetchRoomDetail,
    fetchFasilitas,
    fetchAturan,
    fetchCurrentKos,
  };
};
