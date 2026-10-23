import { mkdir, readFile, writeFile, copyFile, readdir } from 'node:fs/promises';
import { characterSVG, logoSVG } from './characters.mjs';

// 사이트 주소 — 도메인을 연결하면 여기만 바꾸고 다시 빌드하세요.
const SITE_URL = 'https://danger3662.pages.dev';

// 연락 방법 — 바뀌면 여기만 고치고 node scripts/build.mjs 실행
const CONTACT = {
  tel: 'tel:01098828882',
  telText: '010-9882-8882',
  kakao: 'https://open.kakao.com/o/sAi9HdTi',
  mail: 'Danger3662@naver.com',
  bizNo: '862-57-00848'
};
const telLink = (cls = '', label = `전화 ${CONTACT.telText}`) => `<a class="${cls}" href="${CONTACT.tel}">${label}</a>`;
const kakaoLink = (cls = '', label = '카카오톡 상담') => `<a class="${cls}" href="${CONTACT.kakao}" target="_blank" rel="noopener">${label}<span class="visually-hidden"> (새 창)</span></a>`;
// 페이지 본문에서 {{TEL_BUTTON}} {{KAKAO_BUTTON}} {{TEL}} {{TEL_TEXT}} {{KAKAO}} 자리를 채웁니다.
function fillContact(html) {
  return html
    .replaceAll('{{TEL_BUTTON}}', telLink('button button-call'))
    .replaceAll('{{KAKAO_BUTTON}}', kakaoLink('button button-secondary button-kakao'))
    .replaceAll('{{TEL_TEXT}}', CONTACT.telText)
    .replaceAll('{{TEL}}', CONTACT.tel)
    .replaceAll('{{KAKAO}}', CONTACT.kakao)
    .replaceAll('{{MAIL_TEXT}}', CONTACT.mail)
    .replaceAll('{{MAIL}}', `mailto:${CONTACT.mail}`);
}
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const pages = [
  ['index', '홈', 'AI가 낯설어도, 내 속도로 시작하는 방문 1:1 교육과 가게·회사 업무 자동화 안내입니다.'],
  ['education', '1:1 AI 교육', '시작 준비 0단계부터 맞춤 프로젝트 10단계까지, 필요한 목표부터 함께 배우는 방문 교육 안내입니다.'],
  ['business', '가게·회사 업무 자동화', '우리 업무를 살펴보고 필요한 작은 개선부터 시험하는 맞춤 구축 안내입니다.'],
  ['examples', '수업·제작 사례', '실제 고객 사례와 구분한 교육·제작 시연 예시를 확인하세요.'],
  ['guide', '진행 방법·비용', '방문 교육과 업무 자동화의 진행 순서, 준비물, 비용 결정 기준을 확인하세요.'],
  ['contact', '상담 신청', '전화·카카오톡으로 AI 1:1 교육과 가게·회사 업무 자동화 상담을 신청하세요.']
];

function shell(id, title, description, content) {
  const navigation = pages.slice(1).map(([slug, label]) => `<a href="${slug}.html"${id === slug ? ' aria-current="page"' : ''}${slug === 'contact' ? ' class="nav-contact"' : ''}>${label}${slug === 'contact' ? '<span aria-hidden="true"> ↗</span>' : ''}</a>`).join('\n');
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'none'; form-action 'none'; base-uri 'none'; object-src 'none'">
  <title>${title} | AI 1:1 교육·컨설팅</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${SITE_URL}/${id === 'index' ? '' : id + '.html'}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="ko_KR">
  <meta property="og:site_name" content="AI 1:1 교육·컨설팅">
  <meta property="og:title" content="${title} | AI 1:1 교육·컨설팅">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${SITE_URL}/${id === 'index' ? '' : id + '.html'}">
  <meta property="og:image" content="${SITE_URL}/assets/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="assets/fonts.css">
  <link rel="stylesheet" href="assets/styles.css">
  <script src="assets/app.js" defer></script>
</head>
<body data-page="${id}">
  <a class="skip-link" href="#main">본문 바로가기</a>
  <div class="draft-bar"><div class="container"><span><span class="draft-dot" aria-hidden="true"></span>찾아가는 1:1 AI 교육 · 업무 자동화</span><span class="top-contact">${telLink('', `☎ ${CONTACT.telText}`)}${kakaoLink('', '카카오톡 상담')}</span><button class="motion-toggle" id="motion-toggle" type="button" aria-pressed="false" hidden>캐릭터 움직이기</button></div></div>
  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="index.html" aria-label="AI 1:1 교육·컨설팅, 홈으로"><span class="brand-symbol" aria-hidden="true">${logoSVG({ tag: false })}</span><span class="brand-name">AI <b class="brand-hl">1:1</b> 교육·컨설팅<small>방문 교육 · 업무 자동화</small></span></a>
      <button class="menu-toggle" id="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav"><span id="menu-label">메뉴 열기</span> <span aria-hidden="true">☰</span></button>
      <nav id="primary-nav" aria-label="주 메뉴">${navigation}</nav>
    </div>
  </header>
  <main id="main" tabindex="-1">${content}</main>
  <footer class="site-footer">
    <div class="container footer-main"><div><a class="footer-brand" href="index.html"><span class="footer-logo" aria-hidden="true">${logoSVG({ sticker: true, tag: false })}</span>AI 1:1 교육·컨설팅</a><p>지금 필요한 것부터, 내 속도로 함께합니다.</p></div><div class="footer-actions">${telLink('button button-call')}${kakaoLink('button button-secondary button-kakao')}<a class="text-link" href="contact.html">상담 안내 보기 <span aria-hidden="true">↗</span></a></div></div>
    <div class="container footer-info"><span>대표 연락처 ${telLink('', CONTACT.telText)} · ${kakaoLink('', '카카오톡 오픈채팅')} · 이메일 <a href="mailto:${CONTACT.mail}">${CONTACT.mail}</a></span><span>방문 지역 · 어디든 방문 가능</span><span>사업자등록번호 ${CONTACT.bizNo}</span></div>
    <div class="container footer-bottom"><span>© 2026 AI 1:1 교육·컨설팅</span><a href="guide.html#pending">준비물·방문 조건 보기</a></div>
  </footer>
  <nav class="quick-contact" aria-label="바로 상담">${telLink('qc-call', '전화 상담')}${kakaoLink('qc-kakao', '카카오톡 상담')}</nav>
</body>
</html>\n`;
}

// 첫 화면 캐릭터는 배경 원판 없이, 상세 소개 캐릭터에만 원판을 넣습니다.
function inlineMascots(html) {
  return html.replace(/<span class="([^"]*)" data-mascot="(\w+)" aria-hidden="true"><\/span>/g, (_, cls, name) => {
    const big = /\b(hero-mascot|intro-mascot)\b/.test(cls);
    const disc = /\bintro-mascot\b/.test(cls);
    return `<span class="${cls}${big ? ' mascot-stage' : ''}" aria-hidden="true">${disc ? '<span class="mascot-disc"></span>' : ''}${characterSVG(name)}</span>`;
  });
}

await mkdir(path.join(root, 'dist/assets/fonts'), { recursive: true });
await writeFile(path.join(root, 'src/assets/favicon.svg'), logoSVG({ tag: false }), 'utf8');
await writeFile(path.join(root, 'src/assets/hero-logo.svg'), logoSVG({ tag: false, framed: false }), 'utf8');
for (const [id, title, description] of pages) {
  const content = await readFile(path.join(root, `src/pages/${id}.html`), 'utf8');
  await writeFile(path.join(root, `dist/${id}.html`), shell(id, title, description, fillContact(inlineMascots(content))).replaceAll(' xmlns="http://www.w3.org/2000/svg"', ''), 'utf8');
}
for (const name of ['styles.css', 'fonts.css', 'app.js', 'favicon.svg', 'hero-logo.svg']) {
  await copyFile(path.join(root, `src/assets/${name}`), path.join(root, `dist/assets/${name}`));
}
await writeFile(path.join(root, 'dist/robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`, 'utf8');
const today = new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10); // 한국 날짜
await writeFile(path.join(root, 'dist/sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(([id]) => `  <url><loc>${SITE_URL}/${id === 'index' ? '' : id + '.html'}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`, 'utf8');
try { await copyFile(path.join(root, 'src/assets/og-image.png'), path.join(root, 'dist/assets/og-image.png')); } catch {}
console.log('완료: dist/에 6개 한국어 정적 페이지를 만들었습니다.');

// 글꼴(Noto Sans KR, SIL OFL)은 사이트 안에 포함 — 외부 연결 없이 동작
// 글꼴 파일은 dist/assets/fonts 에 한 벌만 둡니다. (src/assets/fonts 가 있으면 그것으로 갱신)
const fontSrc = path.join(root, 'src/assets/fonts');
const fontFiles = await readdir(fontSrc).catch(() => []);
for (const name of fontFiles) await copyFile(path.join(fontSrc, name), path.join(root, 'dist/assets/fonts', name));
