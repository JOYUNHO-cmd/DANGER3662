# growing-agent-loop

Claude(Cowork)용 범용 자기개선 작업 스킬입니다. 세 프로젝트의 원칙을 일반화해서 만들었습니다.

- [Hermes Agent](https://github.com/NousResearch/hermes-agent) — 메모리 누적 → 회고 → 스킬 생성/개선 폐쇄 루프
- [obra/superpowers](https://github.com/obra/superpowers) — 스킬 확인 필수화, 완료 전 검증, 실수 → 스킬
- [garrytan/gstack](https://github.com/garrytan/gstack) — 단계형 진행(Think→Plan→Build→Review→Reflect), taste memory

특정 코딩 프레임워크나 도구가 아니라, `SKILL.md` 하나로 이루어진 마크다운 스킬입니다. Claude(Cowork/Claude
Code 등)에서 이 폴더를 스킬로 등록하면, 관련 있는 작업을 할 때 자동으로 적용됩니다.

## 이 저장소 사용법

1. `SKILL.md`를 원하는 스킬 시스템(Claude Code의 `.claude/skills/`, 다른 에이전트의 스킬 폴더 등)에 넣습니다.
2. Claude(Cowork)에서는 이미 계정 스킬로 제안/저장되어 있다면 이 저장소는 백업/공유용 사본 역할을 합니다.

## 라이선스

원본 세 프로젝트의 원칙만 참고했을 뿐 코드를 복사하지 않았습니다. 이 문서 자체는 자유롭게 쓰고 고치세요.
