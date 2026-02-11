import { configureStore } from '@reduxjs/toolkit';
import tokenReducer from '@/core/feature/token/tokenSlice';
import userReducer from '@/core/feature/user/userSlice';
import roleReducer from '@/core/feature/role/roleSlice';

export const makeStore = () =>
    configureStore({
        reducer: {
            token: tokenReducer,
            user: userReducer,
            role: roleReducer,
        },
        devTools: process.env.NODE_ENV !== 'production',
    });

export const store = makeStore();

export default store;
