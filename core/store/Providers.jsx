"use client";

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Provider } from 'react-redux';
import { setRole } from '@/core/feature/role/roleSlice';
import { setToken } from '@/core/feature/token/tokenSlice';
import { setUser, setUserPenpos } from '@/core/feature/user/userSlice';
import { store } from './store';

export default function Providers({ children }) {
    return (
        <Provider store={store}>
            <AuthHydrator>{children}</AuthHydrator>
        </Provider>
    );
}

function AuthHydrator({ children }) {
    const dispatch = useDispatch();

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                dispatch(setUser(JSON.parse(storedUser)));
            }
        } catch {
            // Ignore invalid stored user state.
        }

        try {
            const storedRole = localStorage.getItem('role');
            if (storedRole) {
                dispatch(setRole(storedRole));
            }
        } catch {
            // Ignore invalid stored role state.
        }

        try {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                dispatch(setToken(storedToken));
            }
        } catch {
            // Ignore invalid stored token state.
        }

        try {
            const storedUserPenpos = localStorage.getItem('userPenpos');
            if (storedUserPenpos) {
                dispatch(setUserPenpos(JSON.parse(storedUserPenpos)));
            }
        } catch {
            // Ignore invalid stored userPenpos state.
        }
    }, [dispatch]);

    return <>{children}</>;
}
