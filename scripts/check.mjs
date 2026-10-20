import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

const SOURCE_SHA256 = '0BEBACC08689EEEA5CDDAFF8329959250934126F0097E12F6D32CC74A40BF123';

function htmlText(html) {
  const entities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
  return html.replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]+>/g, '')
    .replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (match, entity) => {
      if (!entity.startsWith('#')) return entities[entity.toLowerCase()];
      const code = entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : Number(entity.slice(1));
      return code <= 0x10FFFF ? String.fromCodePoint(code) : match;
    }).replace(/\s+/g, ' ').trim();
}

// 공개 저장소에는 없는 개인 기획 문서는 누락과 읽기 실패를 구분합니다.
// read와 expectedSourceHash는 원문을 포함하지 않는 회귀 검사에서만 주입합니다.
export async function checkOriginals({ root, education, read = readFile, expectedSourceHash = SOURCE_SHA256 }) {
  const results = [];
  async function compare(file, label, verify) {
    let contents;
    try {
      contents = await read(path.join(root, file));
    } catch (error) {
      results.push({
        status: error.code === 'ENOENT' ? 'skipped' : 'failed',
        message: error.code === 'ENOENT'
          ? `${label}: ${file} 파일 없음`
          : `${label}: ${file} 읽기 실패 (${error.code || error.message})`
      });
      return;
    }
    const problems = verify(contents);
    results.push({ status: problems.length ? 'failed' : 'passed', message: problems.length ? problems.join('\n') : label });
  }

  await compare('docs/02_APPROVED_PLAN.md', '11단계 원문 제목·목표 대조', contents => {
    const rows = contents.toString('utf8').split(/\r?\n/)
      .filter(line => /^\s*\|/.test(line))
      .map(line => line.trim().replace(/^\||\|$/g, '').split('|').map(cell => cell.trim()))
      .filter(cells => /\d+\s*단계/.test(cells[0]))
      .map(cells => {
        const label = /^(?:\*\*(\d+)단계\*\*|(\d+)단계)$/.exec(cells[0]);
        return { stage: label ? Number(label[1] ?? label[2]) : NaN, cells };
      });
    if (rows.length !== 11 || rows.some(({ stage, cells }, index) => stage !== index || cells.length !== 3 || !cells[1] || !cells[2])) {
      return ['기획 원문: 0~10단계 표의 형식·누락·순서 오류'];
    }
    const steps = new Map([...education.matchAll(/<details\b[^>]*\bdata-course-stage="(\d+)"[^>]*>([\s\S]*?)<\/details>/g)]
      .map(match => [Number(match[1]), match[2]]));
    return rows.flatMap(({ stage, cells }) => {
      const body = steps.get(stage) || '';
      const summary = /<summary\b[^>]*>([\s\S]*?)<\/summary>/.exec(body);
      const title = htmlText((summary?.[1] || '').replace(/<span\b[^>]*class="[^"]*\bstage-number\b[^"]*"[^>]*>[\s\S]*?<\/span>/g, ''));
      const afterSummary = summary ? body.slice(summary.index + summary[0].length) : '';
      const goal = htmlText(/<p\b[^>]*>([\s\S]*?)<\/p>/.exec(afterSummary)?.[1] || '');
      return title === cells[1] && goal === cells[2] ? [] : [`${stage}단계 원문 제목/목표 불일치`];
    });
  });
  await compare('CODEX_HANDOFF.md', '보존 원문 SHA-256 대조', contents => {
    const hash = createHash('sha256').update(contents).digest('hex').toUpperCase();
    return hash === expectedSourceHash.toUpperCase() ? [] : ['보존 원문 해시 불일치'];
  });
  return results;
}

async function main() {
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
    const siteUrl = 'https://incomparable-axolotl-f5e6ab.netlify.app';
    const stripped = allowedExternal.reduce((text, url) => text.replaceAll(`href="${url}"`, ''), html).replaceAll(siteUrl, '');
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
  const app = await readFile(path.join(root, 'dist/assets/app.js'), 'utf8');
  check(!/\bfetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|indexedDB|document\.cookie|console\./.test(app), '폼 전송/저장/로그 코드 발견');
  const contact = docs.get('contact.html');
  check(!/<form\b/.test(contact), '상담 페이지에 입력 양식이 남아 있음');
  if (failures.length) console.error(failures.join('\n'));
  else console.log(`통과: 6페이지 / ${references}개 링크·리소스 참조 / 0~10단계 구성 / 상담 페이지 양식 없음·저장 코드 없음 검사`);

  const originals = await checkOriginals({ root, education });
  const labels = { passed: '통과', skipped: '건너뜀', failed: '실패' };
  for (const result of originals) {
    const output = `${labels[result.status]}: ${result.message}`;
    if (result.status === 'failed') console.error(output);
    else console.log(output);
  }
  if (failures.length || originals.some(result => result.status === 'failed')) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await main();
}
