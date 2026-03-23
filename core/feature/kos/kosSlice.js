import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  kosList: [],
  roomsList: [],
  currentKos: null,
  currentRoom: null,
  fasilitas: [],
  aturan: [],
  isLoading: false,
  error: null,
  filter: {
    gender: null,
    priceRange: null,
    region: null,
  },
};

const kosSlice = createSlice({
  name: 'kos',
  initialState,
  reducers: {
    setKosList: (state, action) => {
      state.kosList = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    setCurrentKos: (state, action) => {
      state.currentKos = action.payload;
      state.error = null;
    },

    setRoomsList: (state, action) => {
      state.roomsList = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    setCurrentRoom: (state, action) => {
      state.currentRoom = action.payload;
      state.error = null;
    },

    setFasilitas: (state, action) => {
      state.fasilitas = action.payload;
    },

    setAturan: (state, action) => {
      state.aturan = action.payload;
    },

    addKos: (state, action) => {
      state.kosList.push(action.payload);
    },

    updateKos: (state, action) => {
      const index = state.kosList.findIndex(k => k.id === action.payload.id);
      if (index !== -1) {
        state.kosList[index] = action.payload;
      }
      if (state.currentKos?.id === action.payload.id) {
        state.currentKos = action.payload;
      }
    },

    deleteKos: (state, action) => {
      state.kosList = state.kosList.filter(k => k.id !== action.payload);
      if (state.currentKos?.id === action.payload) {
        state.currentKos = null;
      }
    },

    addRoom: (state, action) => {
      state.roomsList.push(action.payload);
    },

    updateRoom: (state, action) => {
      const index = state.roomsList.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.roomsList[index] = action.payload;
      }
      if (state.currentRoom?.id === action.payload.id) {
        state.currentRoom = action.payload;
      }
    },

    deleteRoom: (state, action) => {
      state.roomsList = state.roomsList.filter(r => r.id !== action.payload);
      if (state.currentRoom?.id === action.payload) {
        state.currentRoom = null;
      }
    },

    setFilter: (state, action) => {
      state.filter = { ...state.filter, ...action.payload };
    },

    clearFilter: (state) => {
      state.filter = { gender: null, priceRange: null, region: null };
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    clearKos: (state) => {
      state.kosList = [];
      state.roomsList = [];
      state.currentKos = null;
      state.currentRoom = null;
      state.fasilitas = [];
      state.aturan = [];
      state.error = null;
    },
  },
});

export const {
  setKosList,
  setCurrentKos,
  setRoomsList,
  setCurrentRoom,
  setFasilitas,
  setAturan,
  addKos,
  updateKos,
  deleteKos,
  addRoom,
  updateRoom,
  deleteRoom,
  setFilter,
  clearFilter,
  setLoading,
  setError,
  clearKos,
} = kosSlice.actions;

export default kosSlice.reducer;
