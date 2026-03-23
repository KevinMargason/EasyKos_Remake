import { createSlice } from '@reduxjs/toolkit';

const normalizeRole = (role) => {
    if (role === 'owner' || role === 'admin') return 'owner';
    if (role === 'tenant' || role === 'user') return 'tenant';
    return null;
};

const initialState = {
    role: null,
    loading: false,
    error: null,
};

const roleSlice = createSlice({
    name: 'role',
    initialState,
    reducers: {
        setRole: (state, action) => {
            state.role = normalizeRole(action.payload);
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