import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  missions: [],
  completedMissions: [],
  claimedMissions: [],
  dailyLoginStatus: null,
  isLoading: false,
  error: null,
};

const missionsSlice = createSlice({
  name: 'missions',
  initialState,
  reducers: {
    setMissions: (state, action) => {
      state.missions = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    addCompletedMission: (state, action) => {
      const mission = action.payload;
      if (!state.completedMissions.find(m => m.id === mission.id)) {
        state.completedMissions.push(mission);
      }
      const index = state.missions.findIndex(m => m.id === mission.id);
      if (index !== -1) {
        state.missions[index] = mission;
      }
    },

    claimMissionReward: (state, action) => {
      const { misiUserId, reward } = action.payload;
      const missionIndex = state.missions.findIndex(m => m.misi_user_id === misiUserId);
      if (missionIndex !== -1) {
        state.missions[missionIndex].is_claimed = true;
        state.claimedMissions.push({
          id: misiUserId,
          reward,
          claimedAt: new Date().toISOString(),
        });
      }
    },

    setDailyLoginStatus: (state, action) => {
      state.dailyLoginStatus = action.payload;
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    clearMissions: (state) => {
      state.missions = [];
      state.completedMissions = [];
      state.claimedMissions = [];
      state.dailyLoginStatus = null;
      state.error = null;
    },
  },
});

export const {
  setMissions,
  addCompletedMission,
  claimMissionReward,
  setDailyLoginStatus,
  setLoading,
  setError,
  clearMissions,
} = missionsSlice.actions;

export default missionsSlice.reducer;
