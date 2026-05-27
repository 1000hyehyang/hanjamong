export interface StrokeOrderExample {
  hanja: string;
  hint: string;
}

export interface StrokeOrderRule {
  id: number;
  title?: string;
  description: string;
  examples?: StrokeOrderExample[];
}

export const strokeOrderRules: StrokeOrderRule[] = [
  {
    id: 1,
    title: "상하 구조",
    description: "위에서 아래로 쓴다.",
    examples: [{ hanja: "元", hint: "으뜸 원" }],
  },
  {
    id: 2,
    title: "좌우 구조",
    description: "왼쪽에서 오른쪽으로 쓴다.",
    examples: [{ hanja: "川", hint: "내 천" }],
  },
  {
    id: 3,
    title: "좌우 대칭",
    description: "좌우가 대칭될 때는 가운데 획을 먼저 쓰고, 왼쪽·오른쪽 순서로 쓴다.",
    examples: [{ hanja: "水", hint: "물 수" }],
  },
  {
    id: 4,
    title: "가로획 우선",
    description: "가로획과 세로획이 교차할 때는 보통 가로획을 먼저 긋는다.",
    examples: [{ hanja: "古", hint: "옛 고" }],
  },
  {
    id: 5,
    title: "가운데를 꿰뚫는 획",
    description: "가운데를 꿰뚫는 획은 나중에 긋는다.",
    examples: [{ hanja: "車", hint: "수레 차" }],
  },
  {
    id: 6,
    title: "허리를 끊는 획",
    description: "글자의 허리를 가로지르는 획은 나중에 긋는다.",
    examples: [{ hanja: "世", hint: "세상 세" }],
  },
  {
    id: 7,
    title: "받침",
    description: "받침처럼 아래에서 받치는 획은 나중에 긋는다.",
    examples: [{ hanja: "逃", hint: "도망할 도" }],
  },
  {
    id: 8,
    title: "오른쪽 위 점",
    description: "오른쪽 위의 점은 맨 마지막에 찍는다.",
    examples: [{ hanja: "犬", hint: "개 견" }],
  },
  {
    id: 9,
    title: "내외 구조",
    description: "몸과 안이 있을 때는 몸을 먼저 쓰고, 안쪽을 쓴 뒤 닫는다.",
    examples: [{ hanja: "同", hint: "한가지 동" }],
  },
  {
    id: 10,
    title: "삐침과 파임",
    description: "삐침과 파임이 만나면 삐침을 먼저 쓴다.",
    examples: [{ hanja: "父", hint: "아비 부" }],
  },
  {
    id: 11,
    title: "짧은 삐침 우선",
    description: "왼쪽 삐침이 짧고 가로획이 길면 삐침을 먼저 쓴다.",
    examples: [{ hanja: "右", hint: "오른 우" }],
  },
  {
    id: 12,
    title: "가로획 우선",
    description: "왼쪽 삐침이 길고 가로획이 짧으면 가로획을 먼저 쓴다.",
    examples: [{ hanja: "左", hint: "왼 좌" }],
  },
  {
    id: 13,
    title: "아래를 감싸는 획",
    description: "아래를 감싸는 획은 나중에 쓴다.",
    examples: [{ hanja: "也", hint: "어조사 야" }],
  },
];
