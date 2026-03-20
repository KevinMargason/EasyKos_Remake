import { createSlice } from '@reduxjs/toolkit';

const getTokenFromCookie = () => {
    if (typeof document === 'undefined') return null;
    try {
        const tokenFromCookie = document.cookie
            ?.split('; ')
            ?.find((c) => c.startsWith('token='))
            ?.split('=')[1];
        return tokenFromCookie ? decodeURIComponent(tokenFromCookie) : null;
    } catch {
        return null;
    }
};

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

const getInitialToken = () => {
    if (typeof window === 'undefined') return null;
    try {
        const tokenFromCookie = getTokenFromCookie();
        const tokenFromLocalStorage = localStorage.getItem('token');
        
        if (!tokenFromCookie && tokenFromLocalStorage) {
            clearAuthLocalStorage();
            return null;
        }
        
        return tokenFromCookie || tokenFromLocalStorage;
    } catch {
        return null;
    }
};

const initialState = {
    token: getInitialToken(),
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