export const ROLES = {
  ADMIN: 'admin',
  SELLER: 'seller',
  BUYER: 'buyer',
  GUEST: 'guest',
} as const
export type UserRole = (typeof ROLES)[keyof typeof ROLES]
