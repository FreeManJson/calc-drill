export const ROUTES = {
  top: '/',
  settings: '/settings',
  play: '/play',
  score: '/score',
  result: '/result',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
