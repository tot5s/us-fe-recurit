<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

응답은 항상 한국어로 대답해줘. 파일 수정 및 내용 변경, 새로운 파일 추가 하게 될 경우 진행해도 될지 확인 후 진행해줘




<!-- END:nextjs-agent-rules -->

## 구현 문서 관리

- 기능 구현이나 동작 변경을 요청받으면 관련 `docs/specs/` 문서를 함께 작성하거나 갱신합니다. 관련 스펙이 없으면 `docs/specs/template.md`를 바탕으로 추가합니다.
- 구현 과정에서 승인된 아키텍처·기술 선택이 새로 생기거나 바뀌면 `docs/adr/`에 ADR을 추가하고, 기존 결정과의 관계를 기록합니다. ADR이 필요하지 않은 일반적인 구현 세부사항은 기록하지 않습니다.
- 문서 내용은 구현 결과와 일치하게 유지하고, 아직 정해지지 않은 요구사항이나 결정을 임의로 확정하지 않습니다.
