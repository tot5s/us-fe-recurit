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

export async function POST(request: Request) {
  let credentials: { email?: unknown; password?: unknown }

  try {
    credentials = await request.json()
  } catch {
    return NextResponse.json({ message: "잘못된 로그인 요청입니다." }, { status: 400 })
  }

  let upstream: Response
  try {
    upstream = await fetch(`${AUTH_API_BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
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
    return NextResponse.json(body, { status: upstream.status })
  }

  const payload = unwrapAuthPayload(body)
  const accessToken = payload && getAccessToken(payload)
  const refreshToken = payload && getRefreshToken(payload)

  if (!payload || !accessToken || !refreshToken) {
    return NextResponse.json(
      { message: "로그인 응답에 access token 또는 refresh token이 없습니다." },
      { status: 502 },
    )
  }

  const response = NextResponse.json({
    data: {
      access_token: accessToken,
      expires_in: getExpiresIn(payload),
    },
  })

  response.cookies.set(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: REFRESH_COOKIE_PATH,
    expires: getRefreshExpiresAt(payload),
  })

  return response
}
