import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = fileURLToPath(new URL('../', import.meta.url));
const pages = ['index', 'education', 'business', 'examples', 'guide', 'contact'];
const docs = new Map();
const failures = [];
let references = 0;
const check = (condition, message) => { if (!condition) failures.push(message); };
for (const page of pages) {
  const html = await readFile(path.join(root, `dist/${page}.html`), 'utf8');
  docs.set(`${page}.html`, html);
  check(/<html lang="ko">/.test(html), `${page}: 한국어 문서 설정 누락`);
  check((html.match(/<h1[\s>]/g) || []).length === 1, `${page}: H1 개수 오류`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(x => x[1]);
  check(new Set(ids).size === ids.length, `${page}: 중복 ID`);
  check(html.includes("connect-src 'none'") && html.includes("form-action 'none'"), `${page}: 외부 전송 차단 누락`);
  const allowedExternal = ['tel:01098828882', 'https://open.kakao.com/o/sAi9HdTi', 'mailto:Danger3662@naver.com'];
  const stripped = allowedExternal.reduce((text, url) => text.replaceAll(`href="${url}"`, ''), html);
  check(!/https?:\/\/|\btel:|\bmailto:/.test(stripped), `${page}: 예상하지 않은 외부 주소`);
}
for (const [file, html] of docs) {
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    if (/^(?:https?:|tel:|mailto:)/.test(match[1])) continue;
    references++;
    const target = new URL(match[1], `http://local/${file}`);
    const targetFile = target.pathname.slice(1);
    try { await access(path.join(root, 'dist', targetFile)); }
    catch { failures.push(`${file}: 없는 파일 ${match[1]}`); continue; }
    if (target.hash) {
      const targetHtml = docs.get(targetFile);
      check(targetHtml?.includes(`id="${decodeURIComponent(target.hash.slice(1))}"`), `${file}: 없는 구역 ${match[1]}`);
    }
  }
}
const education = docs.get('education.html');
const stages = [...education.matchAll(/data-course-stage="(\d+)"/g)].map(x => Number(x[1]));
check(stages.length === 11 && stages.every((stage, index) => stage === index), '0~10단계 누락/순서 오류');
// 기획 문서(docs/, CODEX_HANDOFF.md)는 공개 저장소에 올리지 않으므로, 있을 때만 대조합니다.
const plan = await readFile(path.join(root, 'docs/02_APPROVED_PLAN.md'), 'utf8').catch(() => '');
for (const row of plan.split(/\r?\n/).filter(row => /^\| \d+단계 \|/.test(row))) {
  const cells = row.split('|').map(cell => cell.trim());
  check(education.includes(cells[2]) && education.includes(cells[3]), `${cells[1]} 원문 제목/목표 불일치`);
}
const app = await readFile(path.join(root, 'dist/assets/app.js'), 'utf8');
check(!/\bfetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|indexedDB|document\.cookie|console\./.test(app), '폼 전송/저장/로그 코드 발견');
const contact = docs.get('contact.html');
check(!/<form\b/.test(contact), '상담 페이지에 입력 양식이 남아 있음');
const source = await readFile(path.join(root, 'CODEX_HANDOFF.md')).catch(() => null);
if (source) {
  const hash = createHash('sha256').update(source).digest('hex').toUpperCase();
  check(hash === '0BEBACC08689EEEA5CDDAFF8329959250934126F0097E12F6D32CC74A40BF123', '보존 원문 해시 불일치');
}
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
else console.log(`통과: 6페이지 / ${references}개 링크·리소스 참조 / 11단계 원문 / 상담 페이지 양식 없음·저장 코드 없음 검사 / 원문 SHA-256`);
