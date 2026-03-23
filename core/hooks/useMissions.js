import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/core/store/hooks';
import * as apiService from '@/core/services/api';
import { unwrapApiData, unwrapApiList } from '@/core/utils/apiResponse';
import {
  setMissions,
  claimMissionReward,
  setDailyLoginStatus,
  setLoading,
  setError,
} from '@/core/feature/missions/missionsSlice';

export const useMissions = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector(state => state.missions);

  const fetchMissions = useCallback(async (userId) => {
    try {
      dispatch(setLoading(true));
      const response = await apiService.missions.getAll(userId);
      dispatch(setMissions(unwrapApiList(response)));
    } catch (error) {
      dispatch(setError(error?.message || 'Gagal mengambil misi'));
      throw error;
    }
  }, [dispatch]);

  const claimReward = useCallback(async (misiUserId) => {
    try {
      dispatch(setLoading(true));
      const response = await apiService.missions.claim({
        misi_user_id: misiUserId,
      });
      dispatch(claimMissionReward({
        misiUserId,
        reward: unwrapApiData(response)?.reward || response?.reward || {},
      }));
      return response;
    } catch (error) {
      dispatch(setError(error?.message || 'Gagal klaim reward'));
      throw error;
    }
  }, [dispatch]);

  const claimDailyLogin = useCallback(async (userId) => {
    try {
      dispatch(setLoading(true));
      const response = await apiService.dailyLogin.claim({
        users_id: userId,
      });
      const payload = unwrapApiData(response);
      if (payload) {
        dispatch(setDailyLoginStatus({
          success: true,
          loginLog: payload?.login_log,
          message: payload?.message || response?.message,
        }));
      }
      return response;
    } catch (error) {
      dispatch(setError(error?.message || 'Gagal klaim daily login'));
      throw error;
    }
  }, [dispatch]);

  return {
    ...state,
    fetchMissions,
    claimReward,
    claimDailyLogin,
  };
};
