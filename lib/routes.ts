export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  USER: {
    HOME: '/user',
    MYKOS: '/user/mykos',
    CHAT: '/user/chat',
    PROFILE: '/user/profile',
    MYPET: '/user/mypet',
  },
  OWNER: {
    HOME: '/owner',
    MANAGEMENT: '/owner/management',
    CHAT: '/owner/chat',
    PROFILE: '/owner/profile',
    MYPET: '/owner/mypet',
  },
} as const;

export const AUTH_ROUTES = {
  LOGIN: ROUTES.LOGIN,
  REGISTER: ROUTES.REGISTER,
} as const;

export const ROLE_HOME = {
  user: ROUTES.USER.HOME,
  owner: ROUTES.OWNER.HOME,
} as const;

export const normalizeRole = (role: unknown) => {
  if (role === 'owner') return 'owner';
  if (role === 'user') return 'user';
  return null;
};