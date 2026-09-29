# ADR (Architecture Decision Record)

ADR은 아키텍처나 기술 선택처럼 이후 구현에도 영향을 주는 결정을 맥락과 함께 기록합니다. 작은 구현 세부사항이나 일회성 작업은 ADR로 남기지 않습니다.

## 작성 규칙

- 파일명은 `NNNN-짧은-결정명.md` 형식으로 작성합니다. 번호는 기존 문서 중 가장 큰 번호에 1을 더합니다.
- 상태는 `제안`, `승인`, `대체됨`, `철회` 중 하나로 기록합니다.
- 승인된 결정을 바꿀 때 기존 문서를 덮어쓰지 않습니다. 새 ADR을 작성하고 이전 ADR에 대체된 문서 링크를 남깁니다.
- 새 ADR은 [`template.md`](./template.md)를 복사해 시작합니다.

## 결정 목록

- [0001. 클라이언트 메모리에서 토큰 관리](./0001-client-memory-token-refresh.md)
- [0002. HttpOnly 쿠키와 BFF로 refresh token 관리](./0002-refresh-token-http-only-cookie.md)
