import { configureStore } from '@reduxjs/toolkit';
import tokenReducer from '@/core/feature/token/tokenSlice';
import userReducer from '@/core/feature/user/userSlice';
import roleReducer from '@/core/feature/role/roleSlice';
import paymentReducer from '@/core/feature/payment/paymentSlice';
import tupaiReducer from '@/core/feature/tupai/tupaiSlice';
import walletReducer from '@/core/feature/wallet/walletSlice';
import missionsReducer from '@/core/feature/missions/missionsSlice';
import kosReducer from '@/core/feature/kos/kosSlice';

export const makeStore = () =>
    configureStore({
        reducer: {
            token: tokenReducer,
            user: userReducer,
            role: roleReducer,
            payment: paymentReducer,
            tupai: tupaiReducer,
            wallet: walletReducer,
            missions: missionsReducer,
            kos: kosReducer,
        },
        devTools: process.env.NODE_ENV !== 'production',
    });

export const store = makeStore();

export default store;
