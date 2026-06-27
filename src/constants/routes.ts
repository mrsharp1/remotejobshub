export const ROUTES = {
  HOME: '/',
  MARKETPLACE: '/marketplace',
  LISTING_DETAIL: '/listing/:id',
  ABOUT: '/about',
  CONTACT: '/contact',
  PRICING: '/pricing',
  COMMUNITY: '/community',
  FAQ: '/faq',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
  SELLER: '/seller',
  ADMIN: '/admin',
} as const
export type AppRoute = typeof ROUTES[keyof typeof ROUTES]