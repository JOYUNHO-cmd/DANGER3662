import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { checkOriginals } from './check.mjs';

// 공개 가능한 합성 자료만 사용하며, 개인 기획 원문은 검사 파일에 포함하지 않습니다.
const source = Buffer.from('회귀 검사용 합성 원문\n');
const expectedSourceHash = createHash('sha256').update(source).digest('hex');
const rows = Array.from({ length: 11 }, (_, stage) => `| **${stage}단계** | 테스트 과정 ${stage} | 테스트 목표 ${stage} |`);
const plan = ['| 단계 | 과정 | 교육 목표와 실습 예시 |', '|---|---|---|', ...rows].join('\n');
const education = Array.from({ length: 11 }, (_, stage) =>
  `<details data-course-stage="${stage}"><summary><span class="stage-number">${stage}</span><span>테스트 과정 ${stage}</span></summary><div><p>테스트 목표 ${stage}</p></div></details>`).join('\n');

function run({ planText = plan, sourceBytes = source, html = education, readError } = {}) {
  return checkOriginals({
    root: path.resolve('synthetic-fixture'),
    education: html,
    expectedSourceHash,
    read: async file => {
      if (readError) throw Object.assign(new Error('합성 읽기 오류'), { code: readError });
      const value = path.basename(file) === 'CODEX_HANDOFF.md' ? sourceBytes : planText;
      if (value === null) throw Object.assign(new Error('파일 없음'), { code: 'ENOENT' });
      return Buffer.from(value);
    }
  });
}

test('없는 원문 파일은 통과로 표시하지 않고 각각 건너뛴다', async () => {
  const result = await run({ planText: null, sourceBytes: null });
  assert.deepEqual(result.map(item => item.status), ['skipped', 'skipped']);
  assert.match(result[0].message, /docs\/02_APPROVED_PLAN\.md 파일 없음/);
  assert.match(result[1].message, /CODEX_HANDOFF\.md 파일 없음/);
});

test('굵은 단계 표기와 일치하는 원문 해시를 확인한다', async () => {
  assert.deepEqual((await run()).map(item => item.status), ['passed', 'passed']);
});

test('일반 단계 표기도 같은 표로 확인한다', async () => {
  assert.equal((await run({ planText: plan.replaceAll('**', '') }))[0].status, 'passed');
});

for (const [name, planText] of [
  ['빈 문서', ''],
  ['단계 표 없음', '| 다른 항목 | 설명 |\n|---|---|\n| 항목 | 내용 |'],
  ['단계 누락', rows.slice(0, 10).join('\n')],
  ['단계 순서 변경', [rows[1], rows[0], ...rows.slice(2)].join('\n')],
  ['단계 중복', [...rows, rows[10]].join('\n')],
  ['잘못된 굵은 표기', plan.replace('**0단계**', '**0단계')],
  ['잘못된 열 개수', plan.replace('| 테스트 목표 0 |', '| 테스트 목표 0 | 추가 열 |')],
  ['빈 목표', plan.replace('테스트 목표 0', '')]
]) {
  test(`${name}: 원문 대조 실패로 처리한다`, async () => {
    const [result] = await run({ planText });
    assert.equal(result.status, 'failed');
    assert.match(result.message, /형식·누락·순서 오류/);
  });
}

test('제목이 다른 위치에 남아 있어도 해당 단계 제목이 다르면 실패한다', async () => {
  const html = `${education.replace('테스트 과정 3', '변경된 과정')}<p>테스트 과정 3</p>`;
  const [result] = await run({ html });
  assert.equal(result.status, 'failed');
  assert.equal(result.message, '3단계 원문 제목/목표 불일치');
});

test('목표가 보충 문단에 남아 있어도 해당 단계의 첫 목표가 다르면 실패한다', async () => {
  const html = education.replace('<p>테스트 목표 6</p>', '<p>변경된 목표</p><p>테스트 목표 6</p>');
  const [result] = await run({ html });
  assert.equal(result.status, 'failed');
  assert.equal(result.message, '6단계 원문 제목/목표 불일치');
});

test('다른 단계로 제목과 목표를 맞바꾸어도 실패한다', async () => {
  const html = education.replaceAll('과정 1<', '과정 TEMP<').replaceAll('과정 2<', '과정 1<').replaceAll('과정 TEMP<', '과정 2<')
    .replaceAll('목표 1<', '목표 TEMP<').replaceAll('목표 2<', '목표 1<').replaceAll('목표 TEMP<', '목표 2<');
  const [result] = await run({ html });
  assert.equal(result.status, 'failed');
  assert.match(result.message, /1단계 원문 제목\/목표 불일치/);
  assert.match(result.message, /2단계 원문 제목\/목표 불일치/);
});

test('HTML 엔터티와 마크업은 표시되는 텍스트로 비교한다', async () => {
  const planText = plan.replace('테스트 과정 0', '문서 & 자료').replace('테스트 목표 0', '직접 배우기');
  const html = education.replace('테스트 과정 0', '문서 &amp; 자료').replace('테스트 목표 0', '<strong>직접</strong>\n배우기');
  assert.equal((await run({ planText, html }))[0].status, 'passed');
});

test('보존 원문이 달라지면 해시 대조가 실패한다', async () => {
  const result = await run({ sourceBytes: Buffer.from('다른 원문') });
  assert.equal(result[1].status, 'failed');
  assert.equal(result[1].message, '보존 원문 해시 불일치');
});

for (const readError of ['EACCES', 'EISDIR', 'EIO']) {
  test(`${readError} 읽기 오류는 건너뛰지 않고 실패한다`, async () => {
    const result = await run({ readError });
    assert.deepEqual(result.map(item => item.status), ['failed', 'failed']);
    assert.ok(result.every(item => item.message.includes(`읽기 실패 (${readError})`)));
  });
}
