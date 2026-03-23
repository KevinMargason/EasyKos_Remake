import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/core/store/hooks';
import * as apiService from '@/core/services/api';
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
      if (response.success) {
        dispatch(setMissions(response.data));
      }
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    }
  }, [dispatch]);

  const claimReward = useCallback(async (misiUserId) => {
    try {
      dispatch(setLoading(true));
      const response = await apiService.missions.claim({
        misi_user_id: misiUserId,
      });
      if (response.success) {
        dispatch(claimMissionReward({
          misiUserId,
          reward: response.reward || {},
        }));
      }
      return response;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    }
  }, [dispatch]);

  const claimDailyLogin = useCallback(async (userId) => {
    try {
      dispatch(setLoading(true));
      const response = await apiService.dailyLogin.claim({
        users_id: userId,
      });
      if (response.success) {
        dispatch(setDailyLoginStatus({
          success: true,
          loginLog: response.data?.login_log,
          message: response.message,
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
    fetchMissions,
    claimReward,
    claimDailyLogin,
  };
};
