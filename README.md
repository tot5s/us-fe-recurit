# US FE Recruit

채용 서비스 프론트엔드 프로젝트입니다.

## 문서

- [구현 스펙](./docs/specs/README.md): 기능 요구사항과 사용자 흐름을 기록합니다.
- [ADR](./docs/adr/README.md): 아키텍처 및 기술 의사결정의 맥락과 결과를 기록합니다.

## 개발 환경

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

## 구현된 URL 경로

| URL 경로 | 화면 및 동작 |
| --- | --- |
| `/` | 로그인 화면(`/login`)으로 이동 |
| `/login` | 로그인 |
| `/login/signUp` | 회원가입 |
| `/notice/contents` | 콘텐츠 목록 및 검색·페이지 이동 |
| `/notice/contents/write` | 콘텐츠 작성·수정 (`?id={contentId}` 지정 시 기존 콘텐츠 수정) |
| `/notice/setalerts` | 알람 목록 및 페이지 이동 |
| `/notice/setalerts/write` | 알람 작성·수정 (`?content_id={contentId}`로 콘텐츠 연결, `?notification_id={notificationId}`로 알람 수정) |

## 구현 스펙

| 스펙 | 주요 구현 내용 |
| --- | --- |
| [메인 경로 로그인 이동](./docs/specs/2026-09-main-route-login.md) | `/` 접속 시 로그인 화면으로 이동 |
| [인증 토큰 갱신](./docs/specs/2026-09-auth-token-refresh.md) | 액세스 토큰 저장 및 만료 후 갱신 |
| [콘텐츠 임시 저장](./docs/specs/2026-09-content-draft-autosave.md) | 로컬 스토리지 임시 저장, 자동 저장 및 이어 쓰기 |
| [콘텐츠 목록 수정 화면 이동](./docs/specs/2026-09-content-list-edit-navigation.md) | 목록 행에서 콘텐츠 수정 화면으로 이동 |
| [콘텐츠 목록 상태 유지](./docs/specs/2026-09-content-list-query-state.md) | 페이지·카테고리·상태 query string 유지 및 역순 번호 표시 |
| [콘텐츠 발행 및 알람 설정](./docs/specs/2026-09-content-publish-required-fields.md) | 필수값 검사, 콘텐츠 발행 및 알람 설정 |
| [알람 목록 조회](./docs/specs/2026-09-notification-list.md) | 알람 목록 조회, 페이지 상태와 발송 결과 표시 |
| [알람 작성](./docs/specs/2026-09-notification-write.md) | 알람 작성·수정과 필수 항목 검증 |

## 문서 작성 기준

기능 단위의 동작과 완료 조건은 스펙에, 여러 기능이나 시스템에 장기적으로 영향을 주는 기술 선택은 ADR에 기록합니다. 구현 중 요구사항이나 결정이 달라지면 관련 문서도 함께 갱신합니다.
