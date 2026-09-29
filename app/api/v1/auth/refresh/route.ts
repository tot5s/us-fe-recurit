import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import {
  AUTH_API_BASE_URL,
  getAccessToken,
  getExpiresIn,
  getRefreshExpiresAt,
  getRefreshToken,
  unwrapAuthPayload,
} from "@/lib/auth-server"

const REFRESH_COOKIE = "us_refresh_token"
const REFRESH_COOKIE_PATH = "/api/v1/auth/refresh"

export async function POST() {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value

  if (!refreshToken) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 })
  }

  let upstream: Response
  try {
    upstream = await fetch(`${AUTH_API_BASE_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
      cache: "no-store",
    })
  } catch {
    return NextResponse.json({ message: "인증 서버에 연결할 수 없습니다." }, { status: 502 })
  }

  let body: unknown
  try {
    body = await upstream.json()
  } catch {
    return NextResponse.json({ message: "인증 서버 응답을 읽을 수 없습니다." }, { status: 502 })
  }

  if (!upstream.ok) {
    const response = NextResponse.json(body, { status: upstream.status })
    if (upstream.status === 401) {
      response.cookies.set(REFRESH_COOKIE, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: REFRESH_COOKIE_PATH,
        maxAge: 0,
      })
    }
    return response
  }

  const payload = unwrapAuthPayload(body)
  const accessToken = payload && getAccessToken(payload)

  if (!payload || !accessToken) {
    return NextResponse.json(
      { message: "갱신 응답에 access token이 없습니다." },
      { status: 502 },
    )
  }

  const response = NextResponse.json({
    data: {
      access_token: accessToken,
      expires_in: getExpiresIn(payload),
    },
  })
  const rotatedRefreshToken = getRefreshToken(payload)
  if (rotatedRefreshToken) {
    response.cookies.set(REFRESH_COOKIE, rotatedRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: REFRESH_COOKIE_PATH,
      expires: getRefreshExpiresAt(payload),
    })
  }

  return response
}
