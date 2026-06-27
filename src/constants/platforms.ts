export const PLATFORMS = {
  WEB: 'web',
  MOBILE: 'mobile',
  DESKTOP: 'desktop',
} as const
export type Platform = typeof PLATFORMS[keyof typeof PLATFORMS]