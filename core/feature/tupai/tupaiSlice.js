import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tupai: null,
  allTupai: [],
  isLoading: false,
  error: null,
  lastAction: null,
  lastActionTime: null,
};

const tupaiSlice = createSlice({
  name: 'tupai',
  initialState,
  reducers: {
    setTupai: (state, action) => {
      state.tupai = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    setAllTupai: (state, action) => {
      state.allTupai = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    updateTupaiAfterAction: (state, action) => {
      const { tupai, action: actionName } = action.payload;
      state.tupai = tupai;
      state.lastAction = actionName;
      state.lastActionTime = new Date().toISOString();
      
      const index = state.allTupai.findIndex(t => t.id === tupai.id);
      if (index !== -1) {
        state.allTupai[index] = tupai;
      }
    },

    adoptTupai: (state, action) => {
      state.tupai = action.payload;
      state.allTupai.push(action.payload);
      state.isLoading = false;
      state.error = null;
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    clearTupai: (state) => {
      state.tupai = null;
      state.allTupai = [];
      state.lastAction = null;
      state.lastActionTime = null;
      state.error = null;
    },
  },
});

export const {
  setTupai,
  setAllTupai,
  updateTupaiAfterAction,
  adoptTupai,
  setLoading,
  setError,
  clearTupai,
} = tupaiSlice.actions;

export default tupaiSlice.reducer;
