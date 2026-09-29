# 액세스 토큰 저장 및 갱신 스펙

- 상태: 구현 완료
- 작성일: 2026-09-28
- 담당: Codex

## 배경과 목적

로그인 응답으로 받은 액세스 토큰을 다른 클라이언트 API 함수에서 재사용하고, 유효기간 15분이 지난 뒤 갱신합니다.

## 범위

### 포함

- 로그인은 Next.js Route Handler를 거쳐 처리하며, refresh token은 HttpOnly 쿠키에 저장합니다.
- 액세스 토큰만 브라우저 메모리 모듈에 저장합니다.
- API 요청 시 만료 30초 전부터 갱신을 시도합니다.
- 여러 요청이 동시에 만료를 감지하면 갱신 요청을 하나로 합칩니다.
- 공통 `fetchWithAuth` 함수로 Bearer 토큰을 요청 헤더에 전달합니다.
- 브라우저 새로고침 뒤에는 HttpOnly 쿠키로 액세스 토큰을 복원합니다.

### 제외

- 로그아웃 UI 및 서버 로그아웃 API 호출

## 사용자 흐름

1. 사용자가 로그인에 성공합니다.
2. 로그인 Route Handler가 refresh token을 HttpOnly 쿠키로 설정하고 access token을 반환합니다.
3. access token은 인증 모듈 메모리에 저장됩니다.
4. 다른 클라이언트 API 함수가 `fetchWithAuth`를 사용해 API를 호출합니다.
5. 새로고침 후 또는 액세스 토큰 만료 임박 시 인증 모듈이 same-origin 갱신 Route Handler를 호출하고, 갱신된 토큰으로 요청합니다.

## 요구사항

- 응답의 `access_token` 또는 `accessToken`을 액세스 토큰으로 인식합니다.
- 로그인 응답의 `refresh_token`을 HttpOnly 쿠키에 저장하고, `refresh_expires_at` 값이 유효한 날짜 문자열이면 쿠키 만료 시각으로 반영합니다.
- 응답의 `expires_in` 또는 `expiresIn`(초)을 사용하며, 값이 없으면 15분으로 간주합니다.
- 만료 시각 30초 전에 토큰 갱신을 시작합니다.
- 브라우저의 refresh token은 `HttpOnly`, `SameSite=Lax`, 운영 환경 `Secure` 쿠키로 저장됩니다.
- Next.js 갱신 Route Handler가 쿠키의 refresh token을 외부 API의 `POST /api/v1/auth/refresh`에 전달합니다.
- 브라우저는 same-origin 경로 `/api/v1/auth/refresh`의 Next.js Route Handler를 호출합니다.
- 기본 인증 API 주소는 `https://fe-assignment-api.us-insight.com`이며 `AUTH_API_BASE_URL` 환경 변수로 변경할 수 있습니다.
- 응답은 최상위 또는 `data` 래퍼 안의 토큰 필드를 허용합니다.
- 로그인 응답의 `refresh_token`을 HttpOnly 쿠키에 저장하고, 외부 refresh API 요청에는 `refresh_token` 필드로 전달합니다.

## 예외 및 실패 처리

- 새로고침 시 쿠키가 없거나 갱신 응답이 실패하면 인증 상태를 비우고 오류를 반환합니다.
- 로그인 응답에 액세스 토큰이 없으면 인증 모듈이 오류를 발생시킵니다.
- refresh token이 만료되어 백엔드가 401을 반환하면 브라우저 쿠키도 삭제합니다.

## 완료 조건

- [x] 로그인 성공 시 refresh token을 HttpOnly 쿠키에 저장하고 access token을 메모리에 둡니다.
- [x] 다른 API 함수가 사용할 토큰 조회 및 인증 요청 함수를 제공합니다.
- [x] 새로고침 뒤 쿠키를 통해 access token을 복원합니다.
- [x] 만료 임박 또는 API 401 응답 시 갱신한 토큰으로 재시도합니다.

## 관련 자료

- [인증 모듈](../../lib/auth.ts)
- [로그인 API 함수](../../app/api/Admin.tsx)
- [로그인 Route Handler](../../app/api/auth/login/route.ts)
- [토큰 갱신 Route Handler](../../app/api/v1/auth/refresh/route.ts)
