type TokenPayload = {
  access_token?: unknown
  accessToken?: unknown
  expires_in?: unknown
  expiresIn?: unknown
}

type AuthTokens = {
  accessToken: string
  expiresAt: number
}

const REFRESH_MARGIN_MS = 30_000
const DEFAULT_ACCESS_TOKEN_LIFETIME_SECONDS = 15 * 60

let tokens: AuthTokens | null = null
let refreshInFlight: Promise<string | null> | null = null

function tokenFields(payload: TokenPayload) {
  const accessToken = payload.access_token ?? payload.accessToken
  const expiresIn = payload.expires_in ?? payload.expiresIn

  if (typeof accessToken !== "string" || accessToken.length === 0) {
    throw new Error("인증 응답에 access token이 없습니다.")
  }

  return {
    accessToken,
    expiresInSeconds:
      typeof expiresIn === "number" && Number.isFinite(expiresIn)
        ? expiresIn
        : DEFAULT_ACCESS_TOKEN_LIFETIME_SECONDS,
  }
}

export function setAuthTokens(payload: TokenPayload) {
  const parsed = tokenFields(payload)
  tokens = {
    accessToken: parsed.accessToken,
    expiresAt:
      Date.now() + parsed.expiresInSeconds * 1000 - REFRESH_MARGIN_MS,
  }
}

export function clearAuthTokens() {
  tokens = null
  refreshInFlight = null
}

async function requestNewAccessToken(): Promise<string | null> {
  try {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "same-origin",
      cache: "no-store",
    })

    if (!response.ok) {
      clearAuthTokens()
      return null
    }

    const result = (await response.json()) as {
      data?: TokenPayload
    } & TokenPayload
    const payload = result.data ?? result
    setAuthTokens(payload)
    return tokens?.accessToken ?? null
  } catch {
    clearAuthTokens()
    return null
  }
}

function refreshAccessToken() {
  if (!refreshInFlight) {
    refreshInFlight = requestNewAccessToken().finally(() => {
      refreshInFlight = null
    })
  }

  return refreshInFlight
}

export async function getAccessToken(): Promise<string | null> {
  if (tokens && Date.now() < tokens.expiresAt) return tokens.accessToken
  return refreshAccessToken()
}

export async function fetchWithAuth(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  const accessToken = await getAccessToken()
  if (!accessToken) throw new Error("로그인이 만료되었습니다. 다시 로그인해 주세요.")

  const makeRequest = (token: string) => {
    const headers = new Headers(init.headers)
    headers.set("Authorization", `Bearer ${token}`)
    return fetch(input, { ...init, headers })
  }

  const response = await makeRequest(accessToken)
  if (response.status !== 401) return response

  // 다른 요청이 이미 토큰을 갱신했으면 그 토큰으로 재시도합니다.
  const refreshedToken =
    tokens?.accessToken && tokens.accessToken !== accessToken
      ? tokens.accessToken
      : await refreshAccessToken()

  if (!refreshedToken) return response
  return makeRequest(refreshedToken)
}
