export const AUTH_API_BASE_URL =
  process.env.AUTH_API_BASE_URL ?? "https://fe-assignment-api.us-insight.com"

export type AuthTokenPayload = {
  access_token?: unknown
  accessToken?: unknown
  refresh_token?: unknown
  refreshToken?: unknown
  refresh_expires_at?: unknown
  expires_in?: unknown
  expiresIn?: unknown
}

export function unwrapAuthPayload(value: unknown): AuthTokenPayload | null {
  if (!value || typeof value !== "object") return null

  const wrapped = value as { data?: unknown }
  const payload = wrapped.data ?? value
  return payload && typeof payload === "object"
    ? (payload as AuthTokenPayload)
    : null
}

export function getAccessToken(payload: AuthTokenPayload) {
  const token = payload.access_token ?? payload.accessToken
  return typeof token === "string" && token.length > 0 ? token : null
}

export function getRefreshToken(payload: AuthTokenPayload) {
  const token = payload.refresh_token ?? payload.refreshToken
  return typeof token === "string" && token.length > 0 ? token : null
}

export function getRefreshExpiresAt(payload: AuthTokenPayload) {
  if (typeof payload.refresh_expires_at !== "string") return undefined

  const timestamp = Date.parse(payload.refresh_expires_at)
  return Number.isNaN(timestamp) ? undefined : new Date(timestamp)
}

export function getExpiresIn(payload: AuthTokenPayload) {
  const seconds = payload.expires_in ?? payload.expiresIn
  return typeof seconds === "number" && Number.isFinite(seconds)
    ? seconds
    : 15 * 60
}
