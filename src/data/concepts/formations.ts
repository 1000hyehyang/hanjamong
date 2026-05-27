export interface FormationExample {
  hanja: string;
  hint: string;
}

export interface FormationConcept {
  id: string;
  name: string;
  description: string;
  examples: FormationExample[];
}

export const formationConcepts: FormationConcept[] = [
  {
    id: "pictograph",
    name: "상형",
    description: "사물의 모양을 본떠 만든 글자이다.",
    examples: [
      { hanja: "日", hint: "해 일" },
      { hanja: "月", hint: "달 월" },
      { hanja: "木", hint: "나무 목" },
    ],
  },
  {
    id: "indicative",
    name: "지사",
    description: "눈에 보이지 않는 추상적인 뜻을 점이나 선 같은 기호로 나타낸 글자이다.",
    examples: [
      { hanja: "上", hint: "위 상" },
      { hanja: "一", hint: "한 일" },
      { hanja: "本", hint: "근본 본" },
    ],
  },
  {
    id: "compound",
    name: "회의",
    description: "뜻을 가진 둘 이상의 글자를 합쳐 새로운 뜻을 만든 글자이다.",
    examples: [
      { hanja: "林", hint: "수풀 림" },
      { hanja: "明", hint: "밝을 명" },
      { hanja: "休", hint: "쉴 휴" },
    ],
  },
  {
    id: "pictophonetic",
    name: "형성",
    description: "뜻을 나타내는 부분과 소리를 나타내는 부분을 합쳐 만든 글자이다.",
    examples: [
      { hanja: "清", hint: "맑을 청" },
      { hanja: "河", hint: "물 하" },
      { hanja: "情", hint: "뜻 정" },
    ],
  },
  {
    id: "transfer",
    name: "전주",
    description: "본래의 뜻에서 뜻이나 음이 바뀌거나 넓어져 서로 통하는 뜻으로 쓰이게 된 글자이다.",
    examples: [
      { hanja: "樂", hint: "풍류 악" },
    ],
  },
  {
    id: "phonetic-loan",
    name: "가차",
    description: "본래 글자의 뜻과 관계없이 소리만 빌려 다른 뜻을 나타낸 글자이다.",
    examples: [
      { hanja: "弗", hint: "아닐 불" },
    ],
  },
];