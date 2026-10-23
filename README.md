# AI 1:1 교육·컨설팅 홈페이지

찾아가는 1:1 AI 교육과 가게·회사 업무 자동화 안내 사이트입니다. 2D 게임 스타일(굵은 외곽선, 큰 글씨, 새싹 로봇 캐릭터)로 만들었습니다.

## 배포 (Cloudflare Pages)
- 공개 주소: https://danger3662.pages.dev/
- `.github/workflows/cloudflare-pages.yml`이 `main` 브랜치에 push할 때 실행됩니다. 빌드, 사이트 검사, 검사 코드 테스트를 모두 통과하면 기존 Cloudflare Pages 프로젝트 `danger3662`에 `dist`를 배포합니다.
- GitHub 저장소의 Settings → Secrets and variables → Actions에 `CLOUDFLARE_API_TOKEN`과 `CLOUDFLARE_ACCOUNT_ID`가 필요합니다. 토큰에는 해당 Cloudflare 계정의 Cloudflare Pages Edit 권한을 부여합니다. 토큰 값은 코드나 문서에 저장하지 않습니다.
- GitHub의 Actions → Deploy Cloudflare Pages에서 성공 여부와 오류를 확인하거나 Run workflow로 다시 배포할 수 있습니다. 실패하면 기존 공개 사이트가 유지됩니다.
- 기존 직접 업로드 프로젝트와 주소를 유지하기 위해 GitHub Actions를 사용합니다. Cloudflare의 Git 연결로 프로젝트를 새로 만들 필요가 없습니다.
- 기존 Netlify용 `netlify.toml`은 보존합니다.

## 내용 고치기
1. `src/pages/*.html`(본문) 또는 `src/assets/styles.css`(디자인)를 고칩니다.
2. `node scripts/build.mjs` 실행 → `dist/`가 새로 만들어집니다.
3. `node scripts/check.mjs`로 링크·구조를 검사합니다.
4. 수정본을 GitHub `main`에 올리면 자동 검사 후 Cloudflare에 배포됩니다. Actions에서 `dist`를 다시 생성하므로 소스 변경을 빠뜨리지 마세요. 글꼴은 `dist/assets/fonts`에 보관되어 있으므로 해당 폴더를 삭제하지 않습니다.

- 검사 코드 자체의 회귀 검사: `npm test` 또는 `node scripts/check.test.mjs`.
- `node scripts/check.mjs`는 페이지·링크·교육과정 구성 검사와 원문 대조 결과를 따로 표시합니다. 공개 저장소에 없는 `docs/02_APPROVED_PLAN.md`와 `CODEX_HANDOFF.md`의 대조는 `건너뜀`으로 표시하며, 파일을 읽을 수 없거나 내용이 다르면 실패합니다. 개인 기획 원문을 공개 저장소에 추가할 필요는 없습니다.

- 전화·카카오톡·이메일·사업자번호: `scripts/build.mjs` 맨 위 `CONTACT`
- 색: `src/assets/styles.css` 맨 위 `:root`
- 캐릭터·로고: `scripts/characters.mjs` (`node scripts/characters.mjs`로 단독 SVG 생성)
- 글꼴: Noto Sans KR (SIL Open Font License, `dist/assets/fonts/OFL.txt`)
- 내 컴퓨터에서 미리보기: `start-preview.cmd` 실행 후 http://127.0.0.1:4173
