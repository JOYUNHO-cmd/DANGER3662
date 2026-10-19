// 새싹 로봇 캐릭터 생성기 (2D 게임 스타일, 외부 이미지 없이 SVG로 직접 그림)
// - 색·소품·몸 모양은 아래 CHARACTERS 표에서 바꾸면 됩니다.
// - build.mjs가 이 파일을 불러 페이지 안에 SVG를 넣고, 단독 SVG 파일도 만듭니다.
//   단독 파일 만들기: node scripts/characters.mjs

export const COLORS = {
  ink: '#13261E',      // 외곽선·그림자
  body: '#FFFBEF',     // 몸·머리
  screen: '#1E4A39',   // 얼굴 화면
  eye: '#8FF5CF',      // 눈·입 빛
  cheek: '#FF9E8A',    // 볼터치
  leaf: '#6BBF59',     // 새싹 잎
  leafDark: '#2F6B52', // 새싹 줄기
  glove: '#FFFFFF',    // 장갑 손
  yellow: '#FFD54F'
};

// shape: round(사람을 돕는 역할) / box(일·기획) / pill(만들기·쓰기)
export const CHARACTERS = {
  learn:  { label: '교육',        shape: 'round', accent: '#6BBF59', prop: 'book' },
  help:   { label: '상담',        shape: 'round', accent: '#FF8A7A', prop: 'heart' },
  work:   { label: '업무 자동화', shape: 'box',   accent: '#3FA7A0', prop: 'laptop' },
  idea:   { label: '기획·프로젝트', shape: 'box', accent: '#5FB4F0', prop: 'bulb' },
  write:  { label: '글쓰기',      shape: 'pill',  accent: '#FFB04A', prop: 'pencil' },
  create: { label: '콘텐츠 제작', shape: 'pill',  accent: '#A98BEA', prop: 'camera' }
};

const C = COLORS;
const S = `stroke="${C.ink}" stroke-linejoin="round" stroke-linecap="round"`;

function body(shape, accent) {
  if (shape === 'round') return `<ellipse cx="120" cy="184" rx="58" ry="42" fill="${C.body}" ${S} stroke-width="6"/>
    <circle cx="120" cy="190" r="15" fill="${accent}" ${S} stroke-width="5"/>`;
  if (shape === 'box') return `<rect x="66" y="144" width="108" height="80" rx="24" fill="${C.body}" ${S} stroke-width="6"/>
    <rect x="104" y="172" width="32" height="24" rx="8" fill="${accent}" ${S} stroke-width="5"/>`;
  return `<rect x="80" y="138" width="80" height="88" rx="38" fill="${C.body}" ${S} stroke-width="6"/>
    <circle cx="120" cy="178" r="6" fill="${accent}" ${S} stroke-width="4"/>
    <circle cx="120" cy="198" r="6" fill="${accent}" ${S} stroke-width="4"/>`;
}

function arm(x1, y1, x2, y2) {
  return `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${C.ink}" stroke-width="18" stroke-linecap="round" fill="none"/>
    <path d="M${x1} ${y1} L${x2} ${y2}" stroke="${C.body}" stroke-width="7" stroke-linecap="round" fill="none"/>`;
}
const glove = (x, y, r = 14) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.glove}" ${S} stroke-width="5"/>
    <path d="M${x - r + 5} ${y + r - 7} q${r - 5} 6 ${2 * r - 10} 0" stroke="${C.ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`;

// 소품과 소품을 든 손 (오른쪽 팔)
function prop(kind, accent) {
  switch (kind) {
    case 'book': return arm(164, 172, 172, 200) + `
      <path d="M144 182 L178 190 L212 182 L212 216 L178 224 L144 216 Z" fill="${C.glove}" ${S} stroke-width="5"/>
      <path d="M178 190 V224" stroke="${C.ink}" stroke-width="4"/>
      <path d="M152 194 l18 4 M152 204 l18 4 M186 198 l18 -4 M186 208 l18 -4" stroke="${accent}" stroke-width="4" stroke-linecap="round"/>
      ${glove(176, 214, 12)}`;
    case 'heart': return arm(164, 172, 176, 196) + `
      <rect x="146" y="150" width="70" height="50" rx="18" fill="${C.glove}" ${S} stroke-width="5"/>
      <path d="M160 197 l-6 16 l20 -13" fill="${C.glove}" ${S} stroke-width="5"/>
      <path d="M158 196 h22" stroke="${C.glove}" stroke-width="6"/>
      <path d="M181 186 c-14 -9 -16 -17 -10 -21 c4 -3 9 -1 10 3 c1 -4 6 -6 10 -3 c6 4 4 12 -10 21z" fill="${accent}" ${S} stroke-width="4"/>
      ${glove(160, 206, 12)}`;
    case 'laptop': return arm(164, 172, 176, 206) + `
      <rect x="146" y="168" width="62" height="42" rx="7" fill="${C.leafDark}" ${S} stroke-width="5"/>
      <circle cx="177" cy="189" r="9" fill="${C.yellow}" ${S} stroke-width="4"/>
      <circle cx="177" cy="189" r="3" fill="${C.ink}"/>
      <rect x="136" y="208" width="82" height="12" rx="6" fill="${C.body}" ${S} stroke-width="5"/>
      ${glove(160, 212, 11)}`;
    case 'bulb': return arm(166, 170, 192, 170) + `
      <g class="ch-glow"><path d="M192 104 v-12 M220 116 l9 -8 M164 116 l-9 -8 M230 140 h12 M154 140 h-12" stroke="${C.yellow}" stroke-width="6" stroke-linecap="round"/></g>
      <circle cx="192" cy="136" r="22" fill="${C.yellow}" ${S} stroke-width="5"/>
      <path d="M186 140 q6 -10 12 0" stroke="${C.ink}" stroke-width="3" fill="none"/>
      <rect x="182" y="154" width="20" height="14" rx="4" fill="${accent}" ${S} stroke-width="5"/>
      ${glove(192, 172, 13)}`;
    case 'pencil': return arm(162, 172, 174, 194) + `
      <rect x="150" y="174" width="50" height="50" rx="8" fill="${C.glove}" ${S} stroke-width="5"/>
      <path d="M160 190 h30 M160 202 h30 M160 214 h18" stroke="${accent}" stroke-width="4" stroke-linecap="round"/>
      <g transform="rotate(35 204 182)">
        <rect x="196" y="140" width="16" height="48" rx="3" fill="${C.yellow}" ${S} stroke-width="5"/>
        <rect x="196" y="134" width="16" height="10" rx="3" fill="${C.cheek}" ${S} stroke-width="5"/>
        <path d="M196 188 l8 16 l8 -16 z" fill="${C.body}" ${S} stroke-width="5"/>
      </g>
      ${glove(176, 196, 12)}`;
    case 'camera': return arm(164, 172, 168, 200) + `
      <rect x="160" y="160" width="20" height="12" rx="4" fill="${C.leafDark}" ${S} stroke-width="5"/>
      <rect x="144" y="168" width="70" height="48" rx="12" fill="${C.leafDark}" ${S} stroke-width="5"/>
      <circle cx="182" cy="192" r="16" fill="${C.body}" ${S} stroke-width="5"/>
      <circle cx="182" cy="192" r="7" fill="${C.ink}"/>
      <circle cx="185" cy="189" r="2.5" fill="${C.glove}"/>
      <circle cx="204" cy="176" r="4" fill="${C.cheek}" ${S} stroke-width="3"/>
      ${glove(150, 206, 12)}`;
  }
  return '';
}

export function characterSVG(name, { title = '' } = {}) {
  const c = CHARACTERS[name];
  if (!c) throw new Error(`알 수 없는 캐릭터: ${name}`);
  const a = c.accent;
  return `<svg class="ch ch-${name}" viewBox="0 0 240 260" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">${title ? `<title>${title}</title>` : ''}
  <ellipse class="ch-shadow" cx="120" cy="248" rx="62" ry="8" fill="${C.ink}" fill-opacity=".18"/>
  <g class="ch-hop">
    <rect x="78" y="214" width="38" height="24" rx="12" fill="${a}" ${S} stroke-width="6"/>
    <rect x="124" y="214" width="38" height="24" rx="12" fill="${a}" ${S} stroke-width="6"/>
    ${body(c.shape, a)}
    <g class="ch-wave">${arm(74, 172, 44, 136)}${glove(40, 130, 15)}</g>
    <path d="M120 50 V26" stroke="${C.ink}" stroke-width="12" stroke-linecap="round"/>
    <path d="M120 50 V26" stroke="${C.leafDark}" stroke-width="5" stroke-linecap="round"/>
    <g class="ch-sprout">
      <path d="M118 28 C104 10 84 14 80 24 C92 36 110 36 118 28 Z" fill="${C.leaf}" ${S} stroke-width="5"/>
      <path d="M122 26 C134 4 160 6 166 18 C152 34 132 36 122 26 Z" fill="${C.leaf}" ${S} stroke-width="5"/>
    </g>
    <circle cx="46" cy="104" r="17" fill="${a}" ${S} stroke-width="6"/>
    <circle cx="194" cy="104" r="17" fill="${a}" ${S} stroke-width="6"/>
    <rect x="50" y="46" width="140" height="108" rx="46" fill="${C.body}" ${S} stroke-width="6"/>
    <rect x="68" y="66" width="104" height="72" rx="30" fill="${C.screen}" ${S} stroke-width="5"/>
    <g class="ch-eye"><ellipse cx="98" cy="98" rx="12" ry="15" fill="${C.eye}"/><circle cx="94" cy="92" r="4.5" fill="#fff"/><circle cx="102" cy="104" r="2.2" fill="#fff"/></g>
    <g class="ch-eye"><ellipse cx="142" cy="98" rx="12" ry="15" fill="${C.eye}"/><circle cx="138" cy="92" r="4.5" fill="#fff"/><circle cx="146" cy="104" r="2.2" fill="#fff"/></g>
    <ellipse cx="82" cy="122" rx="8" ry="5" fill="${C.cheek}"/>
    <ellipse cx="158" cy="122" rx="8" ry="5" fill="${C.cheek}"/>
    <path d="M110 120 Q120 130 130 120" stroke="${C.eye}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <path d="M72 64 q10 -10 26 -12" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>
    ${prop(c.prop, a)}
  </g>
</svg>`;
}

// 로고·파비콘용 머리만 있는 버전
export function headSVG({ sticker = false } = {}) {
  const st = sticker ? `<rect x="2" y="2" width="96" height="96" rx="30" fill="#fff"/>` : '';
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">${st}
  <path d="M50 26 V12" stroke="${C.ink}" stroke-width="8" stroke-linecap="round"/>
  <path d="M49 14 C42 4 30 6 28 12 C34 19 44 19 49 14Z M51 13 C57 1 71 3 74 9 C67 18 56 19 51 13Z" fill="${C.leaf}" ${S} stroke-width="4"/>
  <circle cx="14" cy="58" r="9" fill="${C.leaf}" ${S} stroke-width="4"/>
  <circle cx="86" cy="58" r="9" fill="${C.leaf}" ${S} stroke-width="4"/>
  <rect x="14" y="24" width="72" height="62" rx="26" fill="${C.body}" ${S} stroke-width="5"/>
  <rect x="24" y="36" width="52" height="38" rx="16" fill="${C.screen}" ${S} stroke-width="4"/>
  <ellipse cx="39" cy="53" rx="6" ry="7.5" fill="${C.eye}"/><circle cx="37" cy="50" r="2.2" fill="#fff"/>
  <ellipse cx="61" cy="53" rx="6" ry="7.5" fill="${C.eye}"/><circle cx="59" cy="50" r="2.2" fill="#fff"/>
  <path d="M45 64 Q50 69 55 64" stroke="${C.eye}" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>`;
}

// 로고(엠블럼): 초록 둥근 배지 + 로봇 얼굴 + 새싹 + 노란 1:1 꼬리표
// tag:false → 파비콘처럼 작은 곳용 / sticker:true → 초록·어두운 바탕용 흰 테두리
export function logoSVG({ tag = true, sticker = false } = {}) {
  const main = '#2F6B52';
  const st = sticker ? `<rect x="1" y="5" width="118" height="114" rx="36" fill="#fff"/>` : '';
  const tagEl = tag ? `
  <rect x="70" y="86" width="46" height="28" rx="10" fill="${C.ink}"/>
  <rect x="67" y="83" width="46" height="28" rx="10" fill="${C.yellow}" ${S} stroke-width="4"/>
  <text x="90" y="103.5" text-anchor="middle" font-family="'Noto Sans KR','Malgun Gothic',sans-serif" font-size="17" font-weight="900" fill="${C.ink}">1:1</text>` : '';
  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">${st}
  <rect x="11" y="21" width="98" height="92" rx="28" fill="${C.ink}"/>
  <rect x="7" y="17" width="98" height="92" rx="28" fill="${main}" ${S} stroke-width="5"/>
  <circle cx="20" cy="62" r="8" fill="${C.yellow}" ${S} stroke-width="4"/>
  <circle cx="92" cy="62" r="8" fill="${C.yellow}" ${S} stroke-width="4"/>
  <rect x="22" y="32" width="68" height="60" rx="24" fill="${C.body}" ${S} stroke-width="4.5"/>
  <rect x="30" y="41" width="52" height="40" rx="16" fill="${C.screen}" ${S} stroke-width="3.5"/>
  <ellipse cx="45" cy="59" rx="6" ry="7.5" fill="${C.eye}"/><circle cx="43" cy="56" r="2.3" fill="#fff"/>
  <ellipse cx="67" cy="59" rx="6" ry="7.5" fill="${C.eye}"/><circle cx="65" cy="56" r="2.3" fill="#fff"/>
  <path d="M50 70 Q56 75 62 70" stroke="${C.eye}" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M56 33 V14" stroke="${C.ink}" stroke-width="9" stroke-linecap="round"/>
  <path d="M56 33 V14" stroke="${C.leafDark}" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M55 16 C47 4 33 6 31 13 C38 21 49 22 55 16Z M57 15 C64 1 80 3 83 10 C75 20 63 21 57 15Z" fill="${C.leaf}" ${S} stroke-width="4"/>${tagEl}
</svg>`;
}

// 단독 SVG 파일 (움직임 포함) 만들기
const STANDALONE_STYLE = `<style>.ch-hop{animation:h 2.4s ease-in-out infinite}.ch-wave{transform-box:view-box;transform-origin:74px 172px;animation:w 1.6s ease-in-out infinite}.ch-eye{transform-box:fill-box;transform-origin:center;animation:b 4.5s infinite}@keyframes h{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}@keyframes w{0%,100%{transform:rotate(0)}50%{transform:rotate(18deg)}}@keyframes b{0%,94%,100%{transform:scaleY(1)}97%{transform:scaleY(.1)}}@media(prefers-reduced-motion:reduce){*{animation:none!important}}</style>`;

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('characters.mjs')) {
  const { mkdir, writeFile } = await import('node:fs/promises');
  const path = (await import('node:path')).default;
  const { fileURLToPath } = await import('node:url');
  const root = fileURLToPath(new URL('../', import.meta.url));
  const dir = path.join(root, 'src/assets/characters-game');
  await mkdir(dir, { recursive: true });
  for (const name of Object.keys(CHARACTERS)) {
    await writeFile(path.join(dir, `${name}.svg`), characterSVG(name).replace('aria-hidden="true" focusable="false">', `>${STANDALONE_STYLE}`), 'utf8');
  }
  await writeFile(path.join(dir, 'logo.svg'), logoSVG(), 'utf8');
  await writeFile(path.join(dir, 'logo-sticker.svg'), logoSVG({ sticker: true }), 'utf8');
  await writeFile(path.join(dir, 'logo-icon.svg'), logoSVG({ tag: false }), 'utf8');
  console.log('완료: src/assets/characters-game/ 에 캐릭터 SVG 6종과 로고를 만들었습니다.');
}
