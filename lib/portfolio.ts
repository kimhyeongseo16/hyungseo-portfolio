// ─── 형서마트 상품(작품) 데이터 ───
// 작품을 추가하려면 해당 카테고리의 works 배열에 항목만 추가하면
// 진열대 / 장바구니 / 영수증에 자동으로 반영됩니다.
// 이미지는 public/ 아래 경로를 image에 적습니다 (예: "/projects/design01.png").

// AI 활용 코너 — 레퍼런스 → AI 생성 → 편집/보정 → 최종 결과물
export type ProcessStep = {
  stage: string
  image: string
  alt: string
}

// AI 작업 과정을 묶음 단위로 보여줄 때 — 레퍼런스 묶음 → 만든 에셋 묶음 → 최종 적용
export type ProcessGroup = {
  label: string
  // collage: 레퍼런스 묶음 / collection: 만든 에셋 묶음 / final: 가장 크게 보여주는 최종 적용
  layout: "collage" | "collection" | "final"
  // 한 줄에 함께 놓을 이미지끼리 묶습니다. ratio = 원본 가로 / 세로
  rows: ProcessImage[][]
  // 줄별 최대 높이(px) — 원본이 작은 이미지를 과하게 키우지 않을 때 사용
  rowHeights?: number[]
}

export type ProcessImage = { src: string; alt: string; ratio: number }

export type Work = {
  id: string
  title: string
  image?: string
  // 클릭 확대에서 보여줄 전체 이미지 (랜딩·상세처럼 세로로 긴 작업)
  fullImage?: string
  alt?: string
  // 작은 태그 (CLONE CODING / LANDING PAGE / APP DESIGN / LOGO ...)
  tag?: string
  // 꼭 필요한 짧은 정보만 (TEAM PROJECT / SUB PAGE 02 / Contribution 33%)
  info?: string[]
  // 팀으로 진행한 프로젝트 — 분류 옆에 작은 TEAM PROJECT 태그로 표시
  team?: boolean
  // 대표 프로젝트 카드에 붙는 짧은 프로젝트 개요
  overview?: string
  tools?: string[] // CODING
  process?: ProcessStep[] // AI 활용 과정
  processGroups?: ProcessGroup[] // AI 활용 과정 (묶음 단위)
  link?: string
  originalUrl?: string // 클론 코딩 원본 사이트
  siteUrl?: string // 내가 만든 사이트
  prototypeUrl?: string // 피그마 프로토타입
  // 클릭했을 때 보여주는 방식 — page: 완성 페이지 전체 / image: 작품 이미지만 크게
  view?: "page" | "image"
  // 세로로 긴 페이지 원본은 진열대 카드에서 위쪽부터 보여줍니다.
  thumbTop?: boolean
  // 코너 안에서 따로, 크게 진열하는 대표 프로젝트
  featured?: boolean
  // 같은 코너 안에서 진열 결을 다르게 할 때만 사용
  kind?: ZoneKind
  // 진열대 카드에 과정 썸네일을 붙이지 않고, 상세 화면의 과정을 가운데 정렬합니다.
  processCentered?: boolean
}

// CODING 코너 안에서 작업의 성격을 구분합니다.
export type CodingGroupId = "clone"

export const CODING_GROUPS: { id: CodingGroupId; label: string; sub: string }[] = [
  { id: "clone", label: "CLONE CODING", sub: "실제 사이트를 보고 직접 구현한 작업" },
]

// 클론 코딩 작품은 원본 사이트와 내가 만든 사이트 링크가 필수
export type CodingProject = Work & {
  group: CodingGroupId
  alt: string
  tag: string
  tools: string[]
  originalUrl: string
  siteUrl: string
}

export type Tone = "blue" | "pink" | "yellow" | "green"

// 코너별 진열·상세의 결 — 어떤 항목을 어떤 움직임으로 펼칠지
export type ZoneKind = "coding" | "design" | "cardnews" | "ai" | "logo"

// 코너 안에서 작품을 펼치는 방식 — 가로로 흐르거나(rail), 2열 그리드로 놓거나(grid)
export type CornerFlow = "rail" | "grid"

export type Category = {
  no: string
  // 우측 미니 네비게이션 / 스크롤 이동에 쓰는 앵커 id
  anchor: string
  label: string
  // 우측 미니 네비게이션에 짧게 표기하는 이름
  navLabel: string
  // 인트로 쇼핑 리스트에 표기하는 이름 (없으면 label)
  introLabel?: string
  sub: string
  tone: Tone
  kind: ZoneKind
  flow: CornerFlow
  background: string
  works: Work[]
  // 대표 프로젝트(featured)를 따로 진열할 때, 진열대 쪽 작업 묶음의 이름
  railLabel?: string
}

export const CODING_PROJECTS: CodingProject[] = [
  {
    id: "coding-leeum",
    group: "clone",
    image: "/projects/coding01.png",
    alt: "리움미술관 홈페이지 클론 코딩 화면",
    tag: "CLONE CODING",
    title: "LEEUM",
    tools: ["HTML", "CSS", "JavaScript"],
    originalUrl: "https://www.leeumhoam.org/leeum",
    siteUrl: "https://kimhyeongseo16.github.io/leeum/",
  },
  {
    id: "coding-urbanblue",
    group: "clone",
    image: "/projects/coding02.png",
    alt: "URBANBLUE FITNESS 홈페이지 클론 코딩 화면",
    tag: "CLONE CODING",
    title: "URBAN BLUE",
    tools: ["HTML", "CSS", "JavaScript"],
    originalUrl: "https://urbanblue-fitness.com/",
    siteUrl: "https://kimhyeongseo16.github.io/URBANBLUE/",
  },
  {
    id: "coding-kcc",
    group: "clone",
    image: "/projects/coding03.png",
    alt: "KCC 경영이념 페이지 클론 코딩 화면",
    tag: "CLONE CODING",
    title: "KCC",
    team: true,
    tools: ["HTML", "CSS", "jQuery"],
    originalUrl: "https://www.kccworld.co.kr/about-kcc/management.do",
    siteUrl: "https://kimhyeongseo16.github.io/kcc/",
  },
  {
    id: "coding-elysian",
    group: "clone",
    image: "/projects/coding04.png",
    alt: "엘리시안 강촌 홈페이지 클론 코딩 화면",
    tag: "CLONE CODING",
    title: "ELYSIAN",
    tools: ["HTML", "CSS", "JavaScript"],
    originalUrl: "https://www.elysian.co.kr/home",
    siteUrl: "https://kimhyeongseo16.github.io/elysian/",
  },
]

// CODING — 팀으로 만든 웹 프로젝트
export const WEB_PROJECTS: Work[] = [
  {
    id: "coding-samdasoo",
    title: "JEJU SAMDASOO",
    info: ["SUB PAGE 02", "CONTRIBUTION 33%"],
    team: true,
    overview:
      "제주삼다수의 친환경 캠페인을 주제로\n업사이클링 굿즈와 참여 이벤트를\n하나의 서브페이지로 구성했습니다.",
    featured: true,
    image: "/projects/samdasoo-subpage02.png",
    fullImage: "/projects/samdasoo-subpage02.png",
    thumbTop: true,
    alt: "버려짐의 끝에서 새로운 시작이 탄생합니다 - 제주 삼다수 서브페이지 02",
    tools: ["HTML", "CSS", "JavaScript"],
    siteUrl: "https://rjh3217.github.io/samdasuuu/index.html",
  },
]

export const DESIGN_WORKS: Work[] = [
  {
    id: "design-alchetoilet",
    title: "AlcheToilet",
    tag: "WEB DESIGN · LANDING PAGE",
    image: "/projects/design-alchetoilet.png",
    fullImage: "/projects/design-alchetoilet-full.jpg",
    view: "page",
    alt: "금빛 비데 제품을 강조한 AlcheToilet 랜딩페이지 디자인",
  },
  {
    id: "design-cosrx",
    title: "COSRX × GANADI",
    tag: "WEB DESIGN · DETAIL PAGE",
    image: "/projects/design-cosrx.png",
    fullImage: "/projects/design-cosrx-full.jpg",
    view: "page",
    alt: "COSRX × 가나디 콜라보 세럼 상세페이지 디자인",
  },
  {
    id: "design-osulloc",
    title: "O'SULLOC — 7 DAYS, 7 TEAS",
    tag: "WEB DESIGN · LANDING PAGE",
    image: "/projects/design-osulloc-full.png",
    fullImage: "/projects/design-osulloc-full.png",
    thumbTop: true,
    view: "page",
    alt: "오설록 7 DAYS, 7 TEAS 랜딩페이지 디자인",
  },
  {
    id: "design-phonsonju",
    title: "폰손주",
    tag: "APP DESIGN · UI/UX",
    info: ["TEAM PROJECT", "Contribution 33%"],
    image: "/projects/app-phonsonju.png",
    alt: "시니어 돌봄 앱 폰손주의 대표 화면",
    prototypeUrl:
      "https://www.figma.com/proto/YruJ1qNyBZ3HEYVTwa1XOH/2%EC%A1%B0_%EC%95%B1%EB%94%94%EC%9E%90%EC%9D%B8?node-id=56-64&m=draw&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=56%3A64&t=EW5oOqYFUhlyC5p1-1",
  },
]

export const CARD_NEWS_WORKS: Work[] = [
  {
    id: "cardnews-applecider",
    title: "애플사이다 비니거 ZERO",
    kind: "cardnews",
    view: "image",
    image: "/projects/cardnews-applecider.jpg",
    alt: "슈가 칼로리 ZERO 애플사이다 비니거 음료 카드뉴스",
  },
  {
    id: "cardnews-gogodan",
    title: "고고단 단백질 쉐이크",
    kind: "cardnews",
    view: "image",
    image: "/projects/cardnews-gogodan.jpg",
    alt: "고고단 말차초코쿠키 단백질 쉐이크 카드뉴스",
  },
  {
    id: "cardnews-newbalance",
    title: "NEW BALANCE",
    kind: "cardnews",
    view: "image",
    image: "/projects/cardnews-newbalance.jpg",
    alt: "파란색 뉴발란스 스니커즈 카드뉴스",
  },
  {
    id: "cardnews-sony",
    title: "SONY A7R II",
    kind: "cardnews",
    view: "image",
    image: "/projects/cardnews-sony.jpg",
    alt: "소니 A7R II 카메라 카드뉴스",
  },
]

// AI 활용 — 결과물만이 아니라 만들어 가는 과정을 함께 보여줍니다.
export const AI_WORKS: Work[] = [
  {
    id: "ai-samdasoo-goods",
    title: "삼다수 업사이클링 굿즈 비주얼",
    tag: "AI IMAGE · 제품 비주얼",
    kind: "ai",
    image: "/projects/ai/goods-gen-01.jpg",
    alt: "AI로 만든 삼다수 페트 업사이클링 키링 비주얼",
    processGroups: [
      {
        label: "REFERENCE",
        layout: "collage",
        rows: [[
          { src: "/projects/ai/samdasoo-ref-bananamilk.png", alt: "바나나맛우유 용기를 재활용한 키링 레퍼런스", ratio: 1466 / 824 },
          { src: "/projects/ai/samdasoo-ref-bracelet.png", alt: "파란 비즈 팔찌 레퍼런스", ratio: 877 / 877 },
          { src: "/projects/ai/samdasoo-ref-keyring.png", alt: "재활용 소재 컬러 키링 레퍼런스", ratio: 652 / 652 },
        ]],
      },
      {
        label: "AI GENERATED / EDITED ASSETS",
        layout: "collection",
        rows: [
          [
            { src: "/projects/ai/samdasoo-asset-pins.png", alt: "제주 삼다수 핀 배지 세트", ratio: 1085 / 1351 },
            { src: "/projects/ai/samdasoo-asset-keyrings.png", alt: "제주 삼다수 재활용 페트 키링", ratio: 1798 / 1042 },
          ],
          [
            { src: "/projects/ai/samdasoo-asset-bottle.png", alt: "제주 삼다수 보틀", ratio: 1292 / 1292 },
            { src: "/projects/ai/samdasoo-asset-bracelet.png", alt: "제주 삼다수 재활용 실팔찌", ratio: 1148 / 1042 },
          ],
        ],
      },
      {
        label: "FINAL APPLICATION",
        layout: "final",
        rows: [
          [{ src: "/projects/ai/samdasoo-final-app.png", alt: "생성한 에셋을 적용한 제주 삼다수 웹페이지 굿즈 섹션", ratio: 1920 / 1707 }],
        ],
      },
    ],
  },
  {
    id: "ai-alchetoilet-visual",
    title: "AlcheToilet 제품 비주얼",
    tag: "AI IMAGE · 랜딩 히어로",
    kind: "ai",
    image: "/projects/ai/toilet-gen-02.jpg",
    alt: "AI로 만든 골드 비데 제품 비주얼",
    processGroups: [
      {
        label: "REFERENCE",
        layout: "collage",
        rows: [
          [
            { src: "/projects/ai/alche-ref-01.jpg", alt: "블랙 톤 럭셔리 카 렌털 랜딩페이지 레퍼런스", ratio: 1200 / 2285 },
            { src: "/projects/ai/alche-ref-02.jpg", alt: "블랙·골드 톤 자동차 랩핑 랜딩페이지 레퍼런스", ratio: 1200 / 2411 },
          ],
        ],
      },
      {
        label: "AI GENERATED / EDITED ASSETS",
        layout: "collection",
        rows: [
          [
            { src: "/projects/ai/alche-asset-gold-toilet.png", alt: "벨벳 위 골드 비데 제품 이미지", ratio: 2133 / 898 },
            { src: "/projects/ai/alche-asset-xray-toilet.png", alt: "내부 구조를 투시한 비데 이미지", ratio: 1193 / 794 },
          ],
          [{ src: "/projects/ai/alche-asset-ruby-swirl.png", alt: "벨벳 위 루비 오브제와 보석들", ratio: 2620 / 962 }],
          [
            { src: "/projects/ai/alche-asset-goldbar.png", alt: "골드바", ratio: 359 / 478 },
            { src: "/projects/ai/alche-asset-emerald.png", alt: "에메랄드", ratio: 359 / 359 },
            { src: "/projects/ai/alche-asset-ruby.png", alt: "루비 오브제", ratio: 522 / 522 },
          ],
        ],
      },
      {
        label: "FINAL APPLICATION",
        layout: "final",
        rows: [[{ src: "/projects/ai/alche-final-landing.png", alt: "AI 에셋을 적용한 AlcheToilet 랜딩페이지 전체", ratio: 1920 / 10039 }]],
      },
    ],
  },  {
    id: "ai-phonsonju-visual",
    title: "폰손주 캐릭터 비주얼",
    tag: "AI IMAGE · CHARACTER",
    kind: "ai",
    image: "/projects/ai/phonsonju-asset-02.png",
    alt: "AI로 만든 폰손주 할머니·할아버지 캐릭터",
    processCentered: true,
    processGroups: [
      {
        label: "REFERENCE",
        layout: "collage",
        rowHeights: [200],
        rows: [
          [
            { src: "/projects/ai/phonsonju-ref-01.png", alt: "아이콘 스타일 레퍼런스", ratio: 153 / 98 },
            { src: "/projects/ai/phonsonju-ref-02.png", alt: "컬러풀한 캐릭터 카드 레퍼런스", ratio: 95 / 177 },
            { src: "/projects/ai/phonsonju-ref-03.png", alt: "캐릭터 일러스트 레퍼런스 시트", ratio: 99 / 181 },
          ],
        ],
      },
      {
        label: "AI GENERATED / EDITED ASSETS",
        layout: "collection",
        rowHeights: [420],
        rows: [
          [
            { src: "/projects/ai/phonsonju-asset-01.png", alt: "AI로 만든 캐릭터 비주얼 화면", ratio: 64 / 128 },
            { src: "/projects/ai/phonsonju-asset-02.png", alt: "AI로 만든 할머니·할아버지 캐릭터", ratio: 265 / 212 },
            { src: "/projects/ai/phonsonju-asset-03.png", alt: "AI 캐릭터를 적용한 비주얼 01", ratio: 107 / 219 },
            { src: "/projects/ai/phonsonju-asset-04.png", alt: "AI 캐릭터를 적용한 비주얼 02", ratio: 146 / 300 },
          ],
        ],
      },
    ],
  },
]

// 로고 · 그래픽 작업 전시
export const LOGO_WORKS: Work[] = [
  {
    id: "logo-xav",
    title: "XAV 로고",
    tag: "LOGO DESIGN · BRAND IDENTITY",
    image: "/projects/design-xav.png",
    alt: "XAV 로고 - MAKE YOUR OWN COLORFUL WAY",
  },
  {
    id: "logo-shinseoul",
    title: "신서울 로고",
    tag: "LOGO DESIGN · BRAND IDENTITY",
    image: "/projects/branding-shinseoul-logo.png",
    alt: "기와지붕과 한복 고름을 형상화한 신서울 로고",
  },
  {
    id: "logo-shinseoul-favicon",
    title: "신서울 인터넷용 로고",
    tag: "SMALL LOGO · BRAND IDENTITY",
    image: "/projects/branding-shinseoul-favicon.png",
    alt: "한복 저고리를 단순화한 신서울 인터넷용 작은 로고",
  },
  {
    id: "logo-phonsonju",
    title: "폰손주 로고",
    tag: "APP LOGO · BRAND IDENTITY",
    image: "/projects/branding-phonsonju-logo.png",
    alt: "시니어 돌봄 앱 폰손주 로고",
  },
]

// 마트 동선 — 위에서 아래로 한 코너씩 지나갑니다.
export const CATEGORIES: Category[] = [
  {
    no: "01",
    anchor: "coding-clone",
    label: "CODING",
    navLabel: "CODING",
    sub: "코딩 코너",
    tone: "blue",
    kind: "coding",
    flow: "rail",
    background: "/mart/coding-corner.png",
    railLabel: "CLONE CODING",
    works: [...CODING_PROJECTS, ...WEB_PROJECTS],
  },
  {
    no: "02",
    anchor: "design",
    label: "DESIGN",
    navLabel: "DESIGN",
    sub: "디자인 코너",
    tone: "pink",
    kind: "design",
    flow: "grid",
    background: "/mart/design-corner.png",
    works: DESIGN_WORKS,
  },
  {
    no: "03",
    anchor: "cardnews",
    label: "CARD NEWS",
    navLabel: "CARD NEWS",
    sub: "카드뉴스 코너",
    tone: "yellow",
    kind: "cardnews",
    flow: "rail",
    background: "/mart/card-news-corner.png",
    works: CARD_NEWS_WORKS,
  },
  {
    no: "04",
    anchor: "ai",
    label: "AI 활용",
    navLabel: "AI",
    introLabel: "AI",
    sub: "AI 작업 코너",
    tone: "blue",
    kind: "ai",
    flow: "rail",
    background: "/mart/coding-corner.png",
    works: AI_WORKS,
  },
  {
    no: "05",
    anchor: "graphic",
    label: "GRAPHIC DESIGN",
    navLabel: "GRAPHIC",
    sub: "로고 · 그래픽 코너",
    tone: "green",
    kind: "logo",
    flow: "rail",
    background: "/mart/branding-corner.png",
    works: LOGO_WORKS,
  },
]
