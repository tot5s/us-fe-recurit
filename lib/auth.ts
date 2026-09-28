type TokenPayload = {
  access_token?: unknown
  accessToken?: unknown
  refresh_token?: unknown
  refreshToken?: unknown
  expires_in?: unknown
  expiresIn?: unknown
}

type AuthTokens = {
  accessToken: string
  refreshToken: string | null
  expiresAt: number
}

const REFRESH_MARGIN_MS = 30_000
const DEFAULT_ACCESS_TOKEN_LIFETIME_SECONDS = 15 * 60

let tokens: AuthTokens | null = null
let refreshInFlight: Promise<string | null> | null = null

function parseTokenPayload(payload: TokenPayload) {
  const accessToken = payload.access_token ?? payload.accessToken
  const refreshToken = payload.refresh_token ?? payload.refreshToken
  const expiresIn = payload.expires_in ?? payload.expiresIn

  if (typeof accessToken !== "string" || accessToken.length === 0) {
    throw new Error("인증 응답에 access token이 없습니다.")
  }

  return {
    accessToken,
    refreshToken: typeof refreshToken === "string" ? refreshToken : null,
    expiresInSeconds:
      typeof expiresIn === "number" && Number.isFinite(expiresIn)
        ? expiresIn
        : DEFAULT_ACCESS_TOKEN_LIFETIME_SECONDS,
  }
}

export function setAuthTokens(payload: TokenPayload) {
  const parsed = parseTokenPayload(payload)
  tokens = {
    accessToken: parsed.accessToken,
    refreshToken: parsed.refreshToken,
    expiresAt:
      Date.now() + parsed.expiresInSeconds * 1000 - REFRESH_MARGIN_MS,
  }
}

export function clearAuthTokens() {
  tokens = null
  refreshInFlight = null
}

async function refreshAccessToken(): Promise<string | null> {
  if (!tokens) return null

  try {
    const response = await fetch(
      "https://fe-assignment-api.us-insight.com/api/v1/auth/refresh",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        ...(tokens.refreshToken
          ? { body: JSON.stringify({ refreshToken: tokens.refreshToken }) }
          : {}),
      },
    )

    if (!response.ok) {
      clearAuthTokens()
      return null
    }

    const payload = (await response.json()) as TokenPayload
    const previousRefreshToken = tokens?.refreshToken ?? null
    setAuthTokens({
      ...payload,
      refreshToken:
        payload.refresh_token ?? payload.refreshToken ?? previousRefreshToken,
    })
    return tokens?.accessToken ?? null
  } catch {
    clearAuthTokens()
    return null
  }
}

export async function getAccessToken(): Promise<string | null> {
  if (!tokens) return null
  if (Date.now() < tokens.expiresAt) return tokens.accessToken

  if (!refreshInFlight) {
    refreshInFlight = refreshAccessToken().finally(() => {
      refreshInFlight = null
    })
  }

  return refreshInFlight
}

export async function fetchWithAuth(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  const accessToken = await getAccessToken()
  if (!accessToken) throw new Error("로그인이 만료되었습니다. 다시 로그인해 주세요.")

  const headers = new Headers(init.headers)
  headers.set("Authorization", `Bearer ${accessToken}`)
  return fetch(input, { ...init, headers })
}
