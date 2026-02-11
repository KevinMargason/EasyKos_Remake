import { createSlice } from '@reduxjs/toolkit';

const getInitialUser = () => {
    if (typeof window === 'undefined') return null;
    try {
        return localStorage.getItem('user');
    } catch {
        return null;
    }
};

const getInitialUserPenpos = () => {
    if (typeof window === 'undefined') return null;
    try {
        return localStorage.getItem('userPenpos');
    } catch {
        return null;
    }
};

const initialState = {
    user: getInitialUser(),
    userPenpos: getInitialUserPenpos(),
    isLoading: false,
    error: null,
    isAuthenticated: !!getInitialUser(),
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null;
            if (typeof window !== 'undefined' && action.payload) {
                try {
                    localStorage.setItem('user', action.payload);
                } catch { }
            }
        },
        setUserPenpos: (state, action) => {
            state.userPenpos = action.payload;
            state.error = null;
            if (typeof window !== 'undefined' && action.payload) {
                try {
                    localStorage.setItem('userPenpos', JSON.stringify(action.payload));
                } catch { }
            }
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        clearUser: (state) => {
            state.user = null;
            state.userPenpos = null;
            state.isAuthenticated = false;
            state.error = null;
            if (typeof window !== 'undefined') {
                try {
                    localStorage.removeItem('user');
                    localStorage.removeItem('userPenpos');
                } catch { }
            }
        },
        logout: (state) => {
            state.user = null;
            state.userPenpos = null;
            state.isAuthenticated = false;
            state.error = null;
            state.isLoading = false;
            if (typeof window !== 'undefined') {
                try {
                    localStorage.removeItem('user');
                    localStorage.removeItem('userPenpos');
                } catch { }
            }
        },
    },
});

export const { setUser, setUserPenpos, setLoading, setError, clearUser, logout } = userSlice.actions;
export default userSlice.reducer;