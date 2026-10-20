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

// 색·소품은 공유하고, 표정·머리 장식·옷·손 자세는 역할별로 구분합니다.
export const CHARACTERS = {
  learn:  { label: '교육',        accent: '#6BBF59', prop: 'book' },
  help:   { label: '상담',        accent: '#FF8A7A', prop: 'heart' },
  work:   { label: '업무 자동화', accent: '#3FA7A0', prop: 'laptop' },
  idea:   { label: '기획·프로젝트', accent: '#5FB4F0', prop: 'bulb' },
  write:  { label: '글쓰기',      accent: '#FFB04A', prop: 'pencil' },
  create: { label: '콘텐츠 제작', accent: '#A98BEA', prop: 'camera' }
};

const C = COLORS;
const S = `stroke="${C.ink}" stroke-linejoin="round" stroke-linecap="round"`;

function body(name, accent) {
  const base = name === 'help' || name === 'learn'
    ? `<ellipse cx="120" cy="184" rx="54" ry="42" fill="${C.body}" ${S} stroke-width="6"/>`
    : `<rect x="${name === 'work' ? 66 : 78}" y="142" width="${name === 'work' ? 108 : 84}" height="84" rx="${name === 'work' ? 22 : 36}" fill="${C.body}" ${S} stroke-width="6"/>`;
  const outfits = {
    learn: `<path d="M91 151 L120 166 L149 151 L143 180 L120 169 L97 180Z" fill="${accent}" ${S} stroke-width="5"/>`,
    help: `<path d="M82 149 Q120 171 158 149 L153 172 Q120 189 87 172Z" fill="${accent}" ${S} stroke-width="5"/><path d="M140 170 L158 198 L139 204 L128 178" fill="${accent}" ${S} stroke-width="5"/>`,
    work: `<path d="M83 147 L104 150 L108 177 H134 L138 150 L158 147 V218 H83Z" fill="${accent}" ${S} stroke-width="5"/><path d="M108 192 L118 201 L137 181" stroke="${C.body}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
    idea: `<path d="M88 148 L120 173 L151 148 L153 219 H87Z" fill="${accent}" ${S} stroke-width="5"/><circle cx="120" cy="188" r="13" fill="${C.yellow}" ${S} stroke-width="4"/>`,
    write: `<path d="M97 148 V170 H143 V148 M92 171 H148 V222 H92Z" fill="${accent}" ${S} stroke-width="5"/><rect x="103" y="186" width="33" height="24" rx="6" fill="${C.body}" ${S} stroke-width="4"/>`,
    create: `<path d="M91 148 L121 165 L150 148 L146 181 L122 167 L97 181Z" fill="${accent}" ${S} stroke-width="5"/><path d="M122 169 L136 210 L151 200 L139 171" fill="${accent}" ${S} stroke-width="5"/>`
  };
  return base + outfits[name];
}

function arm(x1, y1, x2, y2) {
  return `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${C.ink}" stroke-width="32" stroke-linecap="round" fill="none"/>
    <path d="M${x1} ${y1} L${x2} ${y2}" stroke="${C.body}" stroke-width="21" stroke-linecap="round" fill="none"/>`;
}
const glove = (x, y, r0 = 14, r = r0 + 4) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.glove}" ${S} stroke-width="5"/>
    <path d="M${x - r + 5} ${y + r - 7} q${r - 5} 6 ${2 * r - 10} 0" stroke="${C.ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`;

// 소품으로 이어지는 팔은 둥글게 굽히고, 손은 기존 장갑 모양을 공유합니다.
function bentArm(d) {
  return `<path d="${d}" stroke="${C.ink}" stroke-width="32" stroke-linecap="round" fill="none"/>
    <path d="${d}" stroke="${C.body}" stroke-width="21" stroke-linecap="round" fill="none"/>`;
}

// 작은 크기에서도 구분되는 큰 소품과, 역할에 맞는 손 자세.
function prop(kind, accent) {
  switch (kind) {
    case 'book': return arm(78, 178, 68, 208) + arm(164, 178, 180, 208) + `
      <path d="M67 181 Q96 174 123 190 Q150 174 179 181 V226 Q149 219 123 236 Q97 219 67 226Z" fill="${accent}" ${S} stroke-width="6"/>
      <path d="M76 189 Q98 185 123 199 Q148 185 170 189 V217 Q147 215 123 227 Q99 215 76 217Z" fill="${C.body}"/>
      <path d="M123 191 V231 M86 199 L110 206 M136 206 L160 199" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>
      ${glove(68, 212, 9)}${glove(180, 212, 9)}`;
    case 'heart': return arm(164, 172, 155, 208) + `
      <path d="M154 158 H207 Q225 158 225 176 V191 Q225 208 207 208 H182 L164 222 L165 208 H154 Q140 208 140 191 V176 Q140 158 154 158Z" fill="${C.body}" ${S} stroke-width="5"/>
      <path d="M183 196 C158 182 162 167 172 168 Q180 168 183 176 Q188 166 196 169 C209 175 198 188 183 196Z" fill="${accent}" ${S} stroke-width="4"/>
      ${glove(151, 213, 9)}`;
    case 'laptop': return bentArm('M78 180 Q48 208 91 224') + bentArm('M164 180 Q207 208 169 224') + `
      <rect x="78" y="166" width="104" height="52" rx="9" fill="${C.screen}" ${S} stroke-width="5"/>
      <path d="M101 187 H127 V201 H154" stroke="${C.eye}" stroke-width="5" fill="none"/>
      <rect x="95" y="180" width="15" height="15" rx="4" fill="${accent}" stroke="${C.body}" stroke-width="3"/>
      <rect x="146" y="194" width="15" height="15" rx="4" fill="${C.yellow}" stroke="${C.body}" stroke-width="3"/>
      <path d="M73 218 H187 L197 235 H63Z" fill="${C.body}" ${S} stroke-width="5"/>
      <path d="M110 224 H150 M121 230 H139" stroke="${C.leafDark}" stroke-width="3" stroke-linecap="round"/>
      ${glove(91, 224, 8)}${glove(169, 224, 8)}`;
    case 'bulb': return arm(166, 177, 201, 169) + `
      <g class="ch-glow"><path d="M201 98 V87 M225 107 L233 99 M177 106 L171 98 M231 132 H237" stroke="${C.yellow}" stroke-width="5" stroke-linecap="round"/></g>
      <path d="M179 128 A23 23 0 1 1 219 143 L213 154 H190 L185 143 Q179 136 179 128Z" fill="${C.yellow}" ${S} stroke-width="5"/>
      <path d="M194 132 L201 142 L208 132 M201 142 V154" stroke="${C.ink}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <rect x="190" y="153" width="23" height="15" rx="5" fill="${accent}" ${S} stroke-width="5"/>
      ${glove(202, 177, 10)}`;
    case 'pencil': return arm(162, 174, 183, 196) + `
      <g transform="rotate(-9 89 199)">
        <rect x="43" y="166" width="87" height="63" rx="8" fill="${C.body}" ${S} stroke-width="5"/>
        <path d="M58 166 V229" stroke="${accent}" stroke-width="5"/>
        <path d="M70 182 H114 M70 195 H114 M70 208 H101" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>
      </g>
      <g transform="rotate(37 173 182)">
        <rect x="161" y="127" width="24" height="75" rx="4" fill="${accent}" ${S} stroke-width="5"/>
        <rect x="161" y="119" width="24" height="17" rx="4" fill="${C.cheek}" ${S} stroke-width="5"/>
        <path d="M161 202 L173 223 L185 202Z" fill="${C.body}" ${S} stroke-width="5"/>
        <path d="M173 143 V190" stroke="${C.yellow}" stroke-width="5" stroke-linecap="round"/>
      </g>${glove(179, 191, 10)}${glove(49, 210, 9)}`;
    case 'camera': return arm(164, 172, 187, 199) + `
      <path d="M136 173 L145 160 H171 L180 173" fill="${accent}" ${S} stroke-width="5"/>
      <rect x="112" y="173" width="107" height="58" rx="14" fill="${accent}" ${S} stroke-width="5"/>
      <circle cx="168" cy="201" r="23" fill="${C.body}" ${S} stroke-width="5"/>
      <circle cx="168" cy="201" r="14" fill="${C.screen}" ${S} stroke-width="4"/>
      <circle cx="174" cy="195" r="5" fill="${C.eye}"/>
      <rect x="124" y="183" width="13" height="9" rx="3" fill="${C.yellow}"/>
      <circle cx="202" cy="184" r="4" fill="${C.body}"/>
      ${glove(215, 207, 10)}`;
  }
  return '';
}

function eye(x, y = 98, rx = 11, ry = 14) {
  return `<g class="ch-eye"><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${C.eye}"/><circle cx="${x - 4}" cy="${y - 5}" r="4" fill="#fff"/></g>`;
}

function face(name) {
  let eyes = eye(98) + eye(142);
  let mouth = `<path d="M110 121 Q120 131 130 121" stroke="${C.eye}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
  if (name === 'help') eyes = `<g class="ch-eye"><path d="M86 102 Q98 82 110 102 M130 102 Q142 82 154 102" stroke="${C.eye}" stroke-width="7" fill="none" stroke-linecap="round"/></g>`;
  if (name === 'work') {
    eyes = `<g class="ch-eye"><rect x="86" y="91" width="22" height="17" rx="6" fill="${C.eye}"/><rect x="132" y="91" width="22" height="17" rx="6" fill="${C.eye}"/></g>`;
    mouth = `<path d="M111 121 H129" stroke="${C.eye}" stroke-width="5" stroke-linecap="round"/>`;
  }
  if (name === 'idea') {
    eyes = eye(97, 96, 10, 13) + `<path d="M142 79 L147 91 L159 96 L147 101 L142 114 L137 101 L125 96 L137 91Z" fill="${C.yellow}"/>`;
    mouth = `<ellipse cx="119" cy="122" rx="6" ry="8" fill="${C.eye}"/>`;
  }
  if (name === 'write') {
    eyes = eye(100, 104, 10, 10) + eye(144, 104, 10, 10) + `<path d="M85 86 L106 89 M134 89 L155 86" stroke="${C.eye}" stroke-width="4" stroke-linecap="round"/>`;
    mouth = `<path d="M112 123 Q123 128 132 119" stroke="${C.eye}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  }
  if (name === 'create') {
    eyes = eye(97, 96, 12, 15) + `<g class="ch-eye"><path d="M131 101 L144 91 L155 100" stroke="${C.eye}" stroke-width="7" fill="none" stroke-linecap="round"/></g>`;
    mouth = `<path d="M108 116 Q121 121 134 116 Q132 135 121 135 Q110 135 108 116Z" fill="${C.eye}"/>`;
  }
  const glasses = name === 'learn' ? `<g fill="none" stroke="${C.yellow}" stroke-width="5"><circle cx="98" cy="99" r="21"/><circle cx="142" cy="99" r="21"/><path d="M119 97 H121 M77 96 H68 M163 96 H172"/></g>` : '';
  return eyes + `<ellipse cx="81" cy="121" rx="7" ry="4" fill="${C.cheek}"/><ellipse cx="159" cy="121" rx="7" ry="4" fill="${C.cheek}"/>` + mouth + glasses;
}

function head(name, accent) {
  const tilt = {learn: -4, help: 6, work: 0, idea: -7, write: 4, create: -6}[name];
  const radius = name === 'work' ? 28 : name === 'write' ? 38 : 46;
  const accessory = {
    learn: '',
    help: `<path d="M47 99 V80 Q47 42 80 38 M160 38 Q194 43 194 80 V105" stroke="${C.ink}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M47 99 V80 Q47 42 80 38 M160 38 Q194 43 194 80 V105" stroke="${accent}" stroke-width="5" fill="none" stroke-linecap="round"/><rect x="34" y="85" width="24" height="40" rx="11" fill="${accent}" ${S} stroke-width="5"/><rect x="183" y="85" width="24" height="40" rx="11" fill="${accent}" ${S} stroke-width="5"/><path d="M195 123 Q192 143 151 141" fill="none" ${S} stroke-width="5"/><rect x="139" y="135" width="20" height="10" rx="5" fill="${accent}" ${S} stroke-width="4"/>`,
    work: `<path d="M70 57 H170" stroke="${accent}" stroke-width="9" stroke-linecap="round"/><rect x="35" y="87" width="23" height="34" rx="6" fill="${accent}" ${S} stroke-width="5"/><rect x="183" y="87" width="23" height="34" rx="6" fill="${accent}" ${S} stroke-width="5"/>`,
    idea: `<path d="M79 76 Q88 65 104 71" fill="none" stroke="${accent}" stroke-width="6" stroke-linecap="round"/>`,
    write: `<path d="M57 68 Q58 39 87 35 H148 Q178 36 184 61 L181 70Z" fill="${accent}" ${S} stroke-width="5"/><path d="M55 66 H183 Q191 79 167 80 H57Z" fill="${C.yellow}" ${S} stroke-width="5"/>`,
    create: `<path d="M52 64 Q40 44 69 31 Q104 9 154 29 Q194 34 188 55 Q173 73 52 64Z" fill="${accent}" ${S} stroke-width="5"/><path d="M62 63 Q120 48 179 57 L178 71 Q120 65 64 77Z" fill="${C.leafDark}" ${S} stroke-width="5"/>`
  };
  return `<g transform="rotate(${tilt} 120 108)">
    <circle cx="46" cy="104" r="17" fill="${accent}" ${S} stroke-width="6"/>
    <circle cx="194" cy="104" r="17" fill="${accent}" ${S} stroke-width="6"/>
    <rect x="50" y="46" width="140" height="108" rx="${radius}" fill="${C.body}" ${S} stroke-width="6"/>
    <rect x="68" y="66" width="104" height="72" rx="${name === 'work' ? 20 : 30}" fill="${C.screen}" ${S} stroke-width="5"/>
    ${face(name)}${accessory[name]}
    <path d="M120 49 V26" stroke="${C.ink}" stroke-width="11" stroke-linecap="round"/>
    <path d="M120 49 V26" stroke="${C.leafDark}" stroke-width="4" stroke-linecap="round"/>
    <path d="M118 28 C104 10 84 14 80 24 C92 36 110 36 118 28Z M122 26 C134 4 160 6 166 18 C152 34 132 36 122 26Z" fill="${C.leaf}" ${S} stroke-width="5"/>
  </g>`;
}

function gesture(name) {
  if (name === 'learn' || name === 'work') return '';
  if (name === 'help') return `${bentArm('M78 179 Q39 181 42 151 L45 124')}${glove(44, 124, 9)}`;
  if (name === 'idea') return `${arm(78, 184, 66, 157)}${glove(69, 154, 12)}<path d="M73 146 L90 134" stroke="${C.ink}" stroke-width="12" stroke-linecap="round"/><path d="M73 146 L90 134" stroke="${C.glove}" stroke-width="5" stroke-linecap="round"/>`;
  if (name === 'write') return arm(80, 182, 51, 205);
  return `<g class="ch-wave">${arm(78, 178, 42, 157)}${glove(34, 149, 13)}<path d="M26 139 L19 122 Q18 116 24 115 Q29 114 32 121 L37 135 L43 120 Q46 114 51 117 Q56 120 52 127 L44 145" fill="${C.glove}" ${S} stroke-width="5"/></g>`;
}

export function characterSVG(name, { title = '' } = {}) {
  const c = CHARACTERS[name];
  if (!c) throw new Error(`알 수 없는 캐릭터: ${name}`);
  const a = c.accent;
  const pose = gesture(name);
  return `<svg class="ch ch-${name}" viewBox="0 0 240 260" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">${title ? `<title>${title}</title>` : ''}
  <ellipse class="ch-shadow" cx="120" cy="248" rx="62" ry="8" fill="${C.ink}" fill-opacity=".18"/>
  <g class="ch-hop">
    <rect x="76" y="214" width="40" height="24" rx="12" fill="${a}" ${S} stroke-width="6" transform="rotate(${name === 'create' ? -12 : -4} 96 226)"/>
    <rect x="126" y="214" width="40" height="24" rx="12" fill="${a}" ${S} stroke-width="6" transform="rotate(${name === 'idea' ? 12 : 4} 146 226)"/>
    ${body(name, a)}
    ${head(name, a)}
    ${pose ? `${pose}\n    ` : ''}${prop(c.prop, a)}
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
export function logoSVG({ tag = true, sticker = false, framed = true } = {}) {
  const main = '#2F6B52';
  const st = sticker ? `<rect x="1" y="5" width="118" height="114" rx="36" fill="#fff"/>` : '';
  const tagEl = tag ? `
  <rect x="70" y="86" width="46" height="28" rx="10" fill="${C.ink}"/>
  <rect x="67" y="83" width="46" height="28" rx="10" fill="${C.yellow}" ${S} stroke-width="4"/>
  <text x="90" y="103.5" text-anchor="middle" font-family="'Noto Sans KR','Malgun Gothic',sans-serif" font-size="17" font-weight="900" fill="${C.ink}">1:1</text>` : '';
  const frame = framed ? `
  <rect x="11" y="21" width="98" height="92" rx="28" fill="${C.ink}"/>
  <rect x="7" y="17" width="98" height="92" rx="28" fill="${main}" ${S} stroke-width="5"/>` : '';
  return `<svg viewBox="${framed ? '0 0 120 120' : '8 0 96 98'}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">${st}${frame}
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
const STANDALONE_STYLE = `<style>.ch-hop{animation:h 2.4s ease-in-out infinite}.ch-wave{transform-box:view-box;transform-origin:78px 176px;animation:w 1.6s ease-in-out infinite}.ch-eye{transform-box:fill-box;transform-origin:center;animation:b 4.5s infinite}@keyframes h{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}@keyframes w{0%,100%{transform:rotate(0)}50%{transform:rotate(18deg)}}@keyframes b{0%,94%,100%{transform:scaleY(1)}97%{transform:scaleY(.1)}}@media(prefers-reduced-motion:reduce){*{animation:none!important}}</style>`;

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
