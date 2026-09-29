# 0002. HttpOnly 쿠키와 BFF로 refresh token 관리

- 상태: 승인
- 작성일: 2026-09-28
- 결정일: 2026-09-28
- 대체한 ADR: [0001. 클라이언트 메모리에서 토큰 관리](./0001-client-memory-token-refresh.md)

## 맥락

메모리에 저장한 토큰은 브라우저 새로고침 시 사라집니다. refresh token을 `localStorage`에 두면 자바스크립트에서 읽을 수 있으므로, 새로고침 후 토큰 복원과 refresh token 비노출이 필요합니다.

## 고려한 선택지

### 선택지 1: 브라우저 저장소에 refresh token 보관

- 장점: 구현이 단순하고 새로고침 후 복원하기 쉽습니다.
- 단점: 브라우저 자바스크립트에서 읽을 수 있어 XSS에 노출됩니다.

### 선택지 2: Next.js Route Handler와 HttpOnly 쿠키

- 장점: refresh token을 브라우저 자바스크립트에서 읽지 못하게 하고, 서버가 갱신 요청을 중계합니다.
- 단점: 인증 요청이 BFF를 거치며 Route Handler와 쿠키 정책을 관리해야 합니다.

## 결정

로그인과 토큰 갱신을 Next.js Route Handler에서 외부 인증 API로 중계합니다. Route Handler는 refresh token을 `HttpOnly`, `SameSite=Lax` 쿠키에 저장하고 access token만 반환합니다. 브라우저 인증 모듈은 access token만 메모리에 보관하며, 새로고침 시 same-origin 갱신 Route Handler를 호출해 access token을 복원합니다.

## 결과

- refresh token은 브라우저 스크립트에서 직접 조회할 수 없습니다.
- access token은 클라이언트 메모리에 있으므로 브라우저 JavaScript 실행 중 XSS 위험까지 제거되는 것은 아닙니다.
- 외부 API의 확인된 필드 계약에 따라 `POST /api/v1/auth/refresh` 요청 본문에 `refresh_token`을 전달합니다.
- 기본 API 주소는 `https://fe-assignment-api.us-insight.com`이며 `AUTH_API_BASE_URL`로 설정을 덮어쓸 수 있습니다.

## 참고 자료

- [액세스 토큰 저장 및 갱신 스펙](../specs/2026-09-auth-token-refresh.md)
- [Next.js 인증 가이드](https://nextjs.org/docs/app/guides/authentication)
