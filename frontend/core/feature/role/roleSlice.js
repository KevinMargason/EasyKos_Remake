import { createSlice } from '@reduxjs/toolkit';

const getInitialRole = () => {
    if (typeof window === 'undefined') return null;
    try {
        return localStorage.getItem('role');
    } catch {
        return null;
    }
};

const initialState = {
    role: getInitialRole(),
    loading: false,
    error: null,
};

const roleSlice = createSlice({
    name: 'role',
    initialState,
    reducers: {
        setRole: (state, action) => {
            state.role = action.payload || null;
            if (typeof window !== 'undefined') {
                try {
                    if (state.role) localStorage.setItem('role', state.role);
                    else localStorage.removeItem('role');
                } catch { }
            }
        },
        clearRole: (state) => {
            state.role = null;
            if (typeof window !== 'undefined') {
                try { localStorage.removeItem('role'); } catch { }
            }
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const {
    setRole,
    clearRole,
    setLoading,
    setError,
    clearError,
} = roleSlice.actions;

export default roleSlice.reducer;