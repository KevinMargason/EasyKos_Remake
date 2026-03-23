import { createSlice } from '@reduxjs/toolkit';

const clearAuthLocalStorage = () => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        localStorage.removeItem('user_id');
        localStorage.removeItem('userPenpos');
    } catch {
    }
};

const initialState = {
    token: null,
    isLoading: false,
    error: null,
};

const setCookie = (name, value, maxAgeSeconds) => {
    if (typeof document === 'undefined') return;
    const parts = [
        `${name}=${encodeURIComponent(value)}`,
        'path=/',
    ];
    if (maxAgeSeconds && Number.isFinite(maxAgeSeconds)) {
        parts.push(`max-age=${Math.max(0, Math.floor(maxAgeSeconds))}`);
    }
    document.cookie = parts.join('; ');
};

const deleteCookie = (name) => {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=; path=/; max-age=0`;
};

const tokenSlice = createSlice({
    name: 'token',
    initialState,
    reducers: {
        setToken: (state, action) => {
            const payload = action.payload;
            const token = typeof payload === 'string' ? payload : payload?.token;
            const expiresIn = typeof payload === 'object' ? payload?.expiresIn : undefined;
            state.token = token || null;
            if (typeof window !== 'undefined' && token) {
                try { localStorage.setItem('token', token); } catch { }
                setCookie('token', token, expiresIn);
            }
        },
        clearToken: (state) => {
            state.token = null;
            if (typeof window !== 'undefined') {
                try { localStorage.removeItem('token'); } catch { }
                deleteCookie('token');
            }
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setToken, clearToken, setLoading, setError } = tokenSlice.actions;
export default tokenSlice.reducer;