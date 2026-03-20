import { AUTH_ROUTES } from '@/lib/routes';

export const setupInterceptorsTo = (axiosInstance, options = {}) => {
    const { onUnauthorized, disableErrorToast = false } = options;

    axiosInstance.interceptors.request.use(
        (config) => {
            try {
                if (typeof window !== 'undefined') {
                    const tokenFromCookie = document.cookie
                        ?.split('; ')
                        ?.find((c) => c.startsWith('token='))
                        ?.split('=')[1];
                    const token = tokenFromCookie || localStorage.getItem('token');
                    if (token && !config.headers?.Authorization) {
                        config.headers = {
                            ...config.headers,
                            Authorization: `Bearer ${decodeURIComponent(token)}`,
                        };
                    }
                }
            } catch { }
            return config;
        },
        (error) => Promise.reject(error)
    );

    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            const status = error?.response?.status;
            if (status === 401) {
                if (typeof window !== 'undefined') {
                    const isLoginPage =
                        window.location.pathname === AUTH_ROUTES.LOGIN ||
                        window.location.pathname === AUTH_ROUTES.REGISTER;
                    const isLoginRequest = error?.config?.url?.includes('/auth/login') || error?.config?.url?.includes('api/auth/login');
                    
                    if (!isLoginPage && !isLoginRequest) {
                        try {
                            localStorage.removeItem('token');
                            localStorage.removeItem('role');
                            localStorage.removeItem('user');
                            localStorage.removeItem('user_id');
                            localStorage.removeItem('userPenpos');
                            document.cookie = 'token=; path=/; max-age=0';
                        } catch { }
                        if (onUnauthorized) onUnauthorized();
                        else window.location.replace(AUTH_ROUTES.LOGIN);
                    }
                }
            }
            return Promise.reject(error);
        }
    );

    return axiosInstance;
};

export const createHandleRequest = () => {
    return async (promise) => {
        try {
            const res = await promise;
            return res;
        } catch (err) {
            throw err;
        }
    };
};
