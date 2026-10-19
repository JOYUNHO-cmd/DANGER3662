# AI 1:1 교육·컨설팅 홈페이지

찾아가는 1:1 AI 교육과 가게·회사 업무 자동화 안내 사이트입니다. 2D 게임 스타일(굵은 외곽선, 큰 글씨, 새싹 로봇 캐릭터)로 만들었습니다.

## 배포 (Netlify)
- `netlify.toml`에 설정되어 있어 저장소만 연결하면 됩니다. 공개 폴더는 `dist`, 빌드 명령은 없습니다.

## 내용 고치기
1. `src/pages/*.html`(본문) 또는 `src/assets/styles.css`(디자인)를 고칩니다.
2. `node scripts/build.mjs` 실행 → `dist/`가 새로 만들어집니다.
3. `node scripts/check.mjs`로 링크·구조를 검사합니다.
4. 바뀐 `src`와 `dist`를 함께 올리면 Netlify가 자동으로 다시 배포합니다.

- 전화·카카오톡·이메일·사업자번호: `scripts/build.mjs` 맨 위 `CONTACT`
- 색: `src/assets/styles.css` 맨 위 `:root`
- 캐릭터·로고: `scripts/characters.mjs` (`node scripts/characters.mjs`로 단독 SVG 생성)
- 글꼴: Noto Sans KR (SIL Open Font License, `dist/assets/fonts/OFL.txt`)
- 내 컴퓨터에서 미리보기: `start-preview.cmd` 실행 후 http://127.0.0.1:4173
