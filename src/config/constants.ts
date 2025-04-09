export const APP_CONFIG = {
  APP_NAME: 'Sistema de Agendamento de Salas',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  STORAGE_KEYS: {
    USER: 'user',
    TOKEN: 'token',
  },
  ROUTES: {
    HOME: '/',
    LOGIN: '/login',
    SIGNUP: '/signup',
    DASHBOARD: '/dashboard',
    ROOMS: '/rooms',
    ROOM_DETAILS: '/rooms/:id',
    BOOKINGS: '/bookings',
    NEW_BOOKING: '/bookings/new',
  },
  AUTH: {
    TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 horas
  },
} as const;

export const DEMO_USERS = [
  {
    id: "1",
    email: "admin@example.com",
    password: "admin123",
    name: "Admin User",
    role: "admin" as const,
  },
  {
    id: "2",
    email: "user@example.com",
    password: "user123",
    name: "Regular User",
    role: "user" as const,
  },
] as const; 