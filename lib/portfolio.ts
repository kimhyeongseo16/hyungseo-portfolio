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

export type ProjectDetail = { label: string; text: string }

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
  // 진열대 카드에 붙는 한 줄 소개
  summary?: string
  // 상세 화면의 케이스 스터디 (PROJECT OVERVIEW / GOAL / MY ROLE ...)
  details?: ProjectDetail[]
  tools?: string[] // CODING
  process?: ProcessStep[] // AI 활용 과정
  processGroups?: ProcessGroup[] // AI 활용 과정 (묶음 단위)
  link?: string
  originalUrl?: string // 클론 코딩 원본 사이트
  siteUrl?: string // 내가 만든 사이트
  prototypeUrl?: string // 피그마 프로토타입
  // 클릭했을 때 보여주는 방식 — page: 완성 페이지 전체 / image: 작품 이미지만 크게
  view?: "page" | "image"
  contribution?: number
  // 세로로 긴 페이지 원본은 진열대 카드에서 위쪽부터 보여줍니다.
  thumbTop?: boolean
  // 코너 안에서 따로, 크게 진열하는 대표 프로젝트
  featured?: boolean
  // 같은 코너 안에서 진열 결을 다르게 할 때만 사용
  kind?: ZoneKind
  // 진열대 카드에 과정 썸네일을 붙이지 않고, 상세 화면의 과정을 가운데 정렬합니다.
  processCentered?: boolean
  // 영상 작업 — public/ 아래 영상 경로. 상세 화면에서 재생합니다.
  video?: string
  // 진열대 카드에 대표 장면으로 보여줄 영상 위치(초)
  videoCover?: number
  // 대표 장면 위에 작품 이름과 함께 얹는 짧은 대표 문구
  tagline?: string
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
  // 코너 전체를 한 번만 소개하는 글 — 작품 개수에는 들어가지 않습니다.
  intro?: CategoryIntro
}

export type CategoryIntro = {
  text: string
  process?: string[]
  tools?: string[]
  // 소개 카드 맨 위 제목 — 있으면 체크리스트형 소개 카드로 그립니다.
  title?: string
  listLabel?: string
  list?: string[]
  // 카드 맨 아래에 작품 개수(예: 04 WORKS)를 표시합니다.
  showCount?: boolean
}

export const CODING_PROJECTS: CodingProject[] = [
  {
    id: "coding-leeum",
    group: "clone",
    image: "/projects/coding01.png",
    alt: "리움미술관 홈페이지 클론 코딩 화면",
    title: "LEEUM",
    tag: "WEB CLONE CODING",
    summary: "리움미술관 웹사이트의 레이아웃과 시각적 구성을 분석해 주요 화면을 구현한 클론코딩 프로젝트.",
    tools: ["HTML", "CSS", "jQuery"],
    details: [
      { label: "PROJECT OVERVIEW", text: "리움미술관 웹사이트의 레이아웃과 이미지, 타이포그래피, 인터랙션을 분석하고 HTML·CSS·jQuery를 활용해 주요 화면을 직접 구현했습니다." },
    ],
    originalUrl: "https://www.leeumhoam.org/leeum",
    siteUrl: "https://kimhyeongseo16.github.io/leeum/",
  },
  {
    id: "coding-urbanblue",
    group: "clone",
    image: "/projects/coding02.png",
    alt: "URBANBLUE FITNESS 홈페이지 클론 코딩 화면",
    title: "URBAN BLUE",
    tag: "WEB CLONE CODING",
    summary: "이미지 중심의 피트니스 브랜드 웹사이트 레이아웃과 인터랙션을 분석해 구현한 클론코딩 프로젝트.",
    tools: ["HTML", "CSS", "jQuery"],
    details: [
      { label: "PROJECT OVERVIEW", text: "이미지 중심의 레이아웃과 타이포그래피, 여백, 인터랙션을 분석하고 HTML·CSS·jQuery를 활용해 주요 화면을 구현했습니다." },
    ],
    originalUrl: "https://urbanblue-fitness.com/",
    siteUrl: "https://kimhyeongseo16.github.io/URBANBLUE/",
  },
  {
    id: "coding-kcc",
    group: "clone",
    image: "/projects/coding03.png",
    alt: "KCC 경영이념 페이지 클론 코딩 화면",
    title: "KCC",
    tag: "RESPONSIVE WEB · TEAM PROJECT",
    info: ["TEAM PROJECT", "RESPONSIVE"],
    summary: "KCC 경영이념 페이지를 분석하고 스크롤 인터랙션과 반응형 웹을 구현한 프로젝트.",
    tools: ["HTML", "CSS", "JavaScript", "jQuery", "Swiper"],
    details: [
      { label: "PROJECT STORY", text: "KCC 경영이념 페이지의 구조와 인터랙션을 분석하고, 실제 웹 화면에서 주요 움직임을 직접 구현한 프로젝트입니다. 스크롤 방향에 따라 변화하는 헤더와 이미지 확대, 텍스트 전환 등의 인터랙션을 구현하며 단순히 화면을 따라 만드는 것보다 사용자의 스크롤 흐름에 맞춰 콘텐츠가 어떻게 변화하는지를 이해하는 데 집중했습니다. 다양한 화면 크기에서도 콘텐츠의 흐름이 유지되도록 반응형 구조를 함께 고려했습니다." },
      { label: "MY CONTRIBUTION", text: "기업운영 파트 웹 디자인 · 퍼블리싱 · 스크롤 인터랙션 구현" },
    ],
    team: true,
    originalUrl: "https://www.kccworld.co.kr/about-kcc/management.do",
    siteUrl: "https://kimhyeongseo16.github.io/kcc/",
  },
  {
    id: "coding-elysian",
    group: "clone",
    image: "/projects/coding04.png",
    alt: "엘리시안 강촌 홈페이지 클론 코딩 화면",
    title: "ELYSIAN",
    tag: "WEB CLONE CODING",
    summary: "엘리시안 웹사이트의 메인 비주얼과 콘텐츠 구조를 분석해 구현한 클론코딩 프로젝트.",
    tools: ["HTML", "CSS", "JavaScript", "Swiper"],
    details: [
      { label: "PROJECT OVERVIEW", text: "메인 비주얼과 이미지 배치, 콘텐츠 구조, 슬라이드 등을 분석하고 웹 화면으로 직접 구현했습니다." },
    ],
    originalUrl: "https://www.elysian.co.kr/home",
    siteUrl: "https://kimhyeongseo16.github.io/elysian/",
  },
]

// CODING — 팀으로 만든 웹 프로젝트
export const WEB_PROJECTS: Work[] = [
  {
    id: "coding-samdasoo",
    title: "JEJU SAMDASOO",
    tag: "ECO CAMPAIGN · WEB DESIGN",
    info: ["TEAM PROJECT", "TEAM LEAD", "RESPONSIVE"],
    overview: "제주삼다수의 친환경 캠페인 참여를 유도하는 참여형 랜딩페이지.",
    contribution: 33,
    tools: ["Figma", "Photoshop", "HTML", "CSS"],
    summary: "제주삼다수의 친환경 캠페인 참여를 유도하는 참여형 랜딩페이지.",
    details: [
      { label: "PROJECT STORY", text: "제주삼다수의 친환경 PET 자원순환 캠페인 참여를 유도하기 위해 기획한 참여형 랜딩페이지입니다. 친환경 메시지를 단순히 전달하는 데 그치지 않고, 사용자의 관심이 실제 캠페인 참여로 이어질 수 있도록 전체적인 콘텐츠 구성과 사용자 흐름을 설계했습니다." },
      { label: "MY CONTRIBUTION", text: "팀 리더 · 전체 콘텐츠 구성 · 서브페이지 2 기획·디자인·코딩 · 푸터" },
      { label: "TOOLS", text: "Figma · Photoshop · HTML · CSS" },
    ],
    team: true,
    featured: true,
    image: "/projects/samdasoo-subpage02.png",
    fullImage: "/projects/samdasoo-subpage02.png",
    thumbTop: true,
    view: "page",
    alt: "버려짐의 끝에서 새로운 시작이 탄생합니다 - 제주 삼다수 서브페이지 02",
    siteUrl: "https://rjh3217.github.io/samdasuuu/index.html",
  },
]

export const DESIGN_WORKS: Work[] = [
  {
    id: "design-alchetoilet",
    title: "AlcheToilet",
    tag: "PREMIUM LANDING PAGE · CONCEPT BRANDING",
    info: ["AI IMAGE", "LANDING PAGE"],
    summary: "프리미엄 스마트 변기의 가치를 고급스럽게 전달한 제품 랜딩페이지.",
    tools: ["Photoshop", "Figma", "AI Image Generation"],
    details: [
      { label: "PROJECT STORY", text: "프리미엄 스마트 변기를 단순한 생활 제품이 아닌 하나의 프리미엄 브랜드 경험으로 보여주기 위해 기획한 제품 랜딩페이지입니다. “비우다, 그리고 부를 쌓다.”라는 콘셉트를 중심으로 변기라는 일상적인 제품을 새로운 시각으로 재해석하고, 제품의 기능을 단순히 나열하기보다 사용자가 얻을 수 있는 편리함과 가치로 연결했습니다. 골드 컬러와 넓은 여백을 활용해 고급스러운 이미지를 구축하고, 제품 → 기능 → 가치 → CTA의 흐름으로 제품의 매력을 전달했습니다." },
    ],
    image: "/projects/design-alchetoilet.png",
    fullImage: "/projects/design-alchetoilet-full.jpg",
    view: "page",
    alt: "금빛 비데 제품을 강조한 AlcheToilet 랜딩페이지 디자인",
  },
  {
    id: "design-cosrx",
    title: "COSRX × GANADI",
    tag: "PRODUCT DETAIL PAGE · WEB DESIGN",
    info: ["PRODUCT", "CHARACTER", "AI IMAGE"],
    summary: "캐릭터와 제품 비주얼을 결합해 제품의 특징을 친근하게 전달한 상세페이지.",
    tools: ["Photoshop", "Figma", "AI Image Generation"],
    details: [
      { label: "PROJECT STORY", text: "COSRX와 GANADI의 콜라보레이션 제품을 소비자가 쉽고 친근하게 이해할 수 있도록 기획한 제품 상세페이지입니다. 제품 정보를 단순히 나열하기보다 피부 고민에서 제품의 특징과 사용 방법, 사용 후 변화와 후기까지 자연스럽게 이어지도록 구성해 제품이 필요한 이유를 먼저 이해하고 제품의 장점으로 연결되도록 했습니다. 캐릭터와 하늘, 구름, 버블 등의 비주얼을 활용해 제품의 산뜻하고 친근한 이미지를 만들고, 제품과 콘텐츠가 자연스럽게 연결되도록 구성했습니다." },
    ],
    image: "/projects/design-cosrx.png",
    fullImage: "/projects/design-cosrx-full.jpg",
    view: "page",
    alt: "COSRX × 가나디 콜라보 세럼 상세페이지 디자인",
  },
  {
    id: "design-osulloc",
    title: "O'SULLOC",
    tag: "BRAND LANDING PAGE · CAMPAIGN",
    info: ["BRAND EXPERIENCE", "AI IMAGE"],
    summary: "일주일의 하루와 차를 연결해 하나의 브랜드 경험으로 풀어낸 프리미엄 랜딩페이지.",
    tools: ["Figma", "Photoshop", "AI Image Generation"],
    details: [
      { label: "PROJECT STORY", text: "오설록의 차를 단순한 제품이 아니라 일주일의 일상 속에서 경험하는 브랜드로 보여주기 위해 기획한 랜딩페이지입니다. “일주일의 모든 하루에는 그날에 어울리는 차가 있다.”라는 콘셉트를 중심으로 월요일부터 일요일까지 각자의 분위기와 감정에 어울리는 차를 연결했습니다. 제품을 7개의 카드처럼 나열하기보다 사용자가 스크롤을 따라가며 하루하루를 보내듯 차를 만나도록 구성해, 차를 하나의 라이프스타일 경험으로 인식할 수 있도록 했습니다. 제주 자연과 차밭의 이미지를 기반으로 프리미엄한 분위기를 만들고, 짧은 카피와 긴 이미지 흐름을 활용해 브랜드의 감성을 자연스럽게 전달했습니다." },
    ],
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
    contribution: 33,
    info: ["TEAM PROJECT", "TEAM LEAD"],
    summary: "가족의 안부와 돌봄을 더 가깝게 연결하는 시니어 케어 앱.",
    tools: ["Figma"],
    details: [
      { label: "PROJECT STORY", text: "혼자 생활하는 어르신의 일상과 건강을 가족이 함께 살필 수 있도록 기획한 시니어 케어 앱입니다. 멀리 있는 가족이 부모님의 안부와 일상을 쉽게 확인할 수 있도록 하면서도, 시니어 사용자가 앱을 어렵게 느끼지 않도록 단순한 정보 구조와 직관적인 화면을 설계하는 데 초점을 맞췄습니다. 큰 글씨와 명확한 아이콘, 친근한 캐릭터를 활용해 필요한 정보를 빠르게 이해할 수 있도록 하고, 가족과 어르신 사이의 연결이라는 서비스의 가치를 UI에 자연스럽게 담았습니다." },
      { label: "MY CONTRIBUTION", text: "팀 리더 · 기획 · UI/UX 디자인 · 화면 구성 · 프로토타입 제작" },
    ],
    image: "/projects/app-phonsonju.png",
    alt: "시니어 돌봄 앱 폰손주의 대표 화면",
    prototypeUrl:
      "https://www.figma.com/proto/YruJ1qNyBZ3HEYVTwa1XOH/2%EC%A1%B0_%EC%95%B1%EB%94%94%EC%9E%90%EC%9D%B8?node-id=56-64&m=draw&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=56%3A64&t=EW5oOqYFUhlyC5p1-1",
  },
]

export const CARD_NEWS_WORKS: Work[] = [
  {
    id: "cardnews-applecider",
    title: "클룹 애사비소다",
    tag: "PRODUCT ADVERTISING · CARD NEWS",
    summary: "제품의 상큼하고 가벼운 이미지를 강하게 전달한 제품 광고 그래픽.",
    tools: ["Photoshop"],
    details: [
      { label: "PROJECT STORY", text: "제품의 특징을 SNS에서 빠르게 인식할 수 있도록 강렬한 컬러와 큰 타이포그래피를 활용해 첫인상을 강조한 광고 그래픽입니다. 제품의 정보를 길게 설명하기보다 짧고 명확한 메시지와 시각적인 주목도를 통해 제품에 대한 관심을 유도하는 데 초점을 맞췄습니다." },
    ],
    kind: "cardnews",
    view: "image",
    image: "/projects/cardnews-applecider.jpg",
    alt: "슈가 칼로리 ZERO 애플사이다 비니거 음료 카드뉴스",
  },
  {
    id: "cardnews-gogodan",
    title: "Protein Shake",
    tag: "PRODUCT ADVERTISING",
    summary: "말차와 초코의 조합을 시각적으로 강조한 제품 광고 그래픽.",
    tools: ["Photoshop"],
    details: [
      { label: "PROJECT STORY", text: "말차와 초코의 조합을 소비자가 이미지만 보고도 직관적으로 떠올릴 수 있도록 구성한 단백질 쉐이크 광고 그래픽입니다. 말차의 그린 컬러와 초콜릿의 브라운 컬러를 활용하고 제품, 음료, 원료를 함께 배치해 맛과 특징을 시각적으로 전달했습니다. 제품 설명을 읽기 전에 먼저 맛과 식감을 상상할 수 있도록 구성해 광고를 본 뒤 직접 먹어보고 싶은 인상을 만드는 데 초점을 맞췄습니다." },
    ],
    kind: "cardnews",
    view: "image",
    image: "/projects/cardnews-gogodan.jpg",
    alt: "고고단 말차초코쿠키 단백질 쉐이크 카드뉴스",
  },
  {
    id: "cardnews-newbalance",
    title: "New Balance",
    tag: "FASHION GRAPHIC",
    summary: "제품 이미지와 타이포그래피를 활용해 역동적인 브랜드 이미지를 표현한 패션 그래픽.",
    tools: ["Photoshop"],
    details: [
      { label: "PROJECT STORY", text: "스니커즈가 가진 역동적인 분위기와 젊은 이미지를 시각적으로 전달하기 위해 제품 사진과 과감한 타이포그래피를 결합한 그래픽입니다. 제품 자체를 단순히 보여주는 것보다 제품이 가진 분위기와 라이프스타일을 함께 전달하는 데 초점을 맞췄습니다." },
    ],
    kind: "cardnews",
    view: "image",
    image: "/projects/cardnews-newbalance.jpg",
    alt: "파란색 뉴발란스 스니커즈 카드뉴스",
  },
  {
    id: "cardnews-sony",
    title: "Sony α7R II",
    tag: "PRODUCT INFORMATION GRAPHIC",
    summary: "제품의 주요 특징과 이미지를 중심으로 정보를 전달한 제품 그래픽.",
    tools: ["Photoshop"],
    details: [
      { label: "PROJECT STORY", text: "제품의 전문적인 이미지를 유지하면서 핵심 정보를 빠르게 파악할 수 있도록 제품 이미지와 주요 특징의 시각적 우선순위를 정리한 정보형 그래픽입니다. 많은 정보를 한꺼번에 보여주기보다 핵심 내용을 중심으로 구성해 제품의 성능과 전문적인 이미지를 효과적으로 전달하는 데 초점을 맞췄습니다." },
    ],
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
    summary: "삼다수 캠페인 페이지에 들어갈 업사이클링 굿즈 이미지를 AI로 제작하고 페이지에 적용한 작업입니다.",
    tools: ["AI Image Generation", "Photoshop", "Figma"],
    details: [
      { label: "PURPOSE", text: "제주삼다수 캠페인 랜딩페이지의 굿즈 섹션에 사용할 비주얼을 AI로 제작한 작업입니다. 페트병 업사이클링이라는 캠페인 주제를 실제로 갖고 싶은 굿즈로 보여줘, 사용자가 참여의 보상을 구체적으로 떠올릴 수 있도록 하는 것이 목적이었습니다." },
      { label: "PROCESS", text: "재활용 소재 키링과 비즈 팔찌 등 업사이클링 굿즈를 레퍼런스로 모은 뒤, 삼다수의 블루 컬러와 로고가 자연스럽게 담기도록 프롬프트를 조정해 핀 배지, 키링, 보틀, 실팔찌 이미지를 생성했습니다. 결과물 중 캠페인 톤에 맞는 이미지를 선별하고 Photoshop에서 리터칭한 뒤 굿즈 섹션에 적용했습니다." },
    ],
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
    summary: "AlcheToilet 랜딩페이지의 골드 변기와 보석 오브제 비주얼을 AI로 제작해 적용한 작업입니다.",
    tools: ["AI Image Generation", "Photoshop", "Figma"],
    details: [
      { label: "PURPOSE", text: "AlcheToilet 랜딩페이지의 ‘변기를 프리미엄 자산처럼 보이게 한다’는 콘셉트를 실제 이미지로 구현하기 위한 작업입니다. 일반적인 제품 사진으로는 표현하기 어려운 과장된 고급스러움을 만들기 위해 AI 이미지 생성을 활용했습니다." },
      { label: "PROCESS", text: "블랙·골드 톤의 럭셔리 랜딩페이지를 레퍼런스로 분위기를 정한 뒤, 벨벳 위 골드 변기, 내부 구조를 투시한 제품 컷, 루비·에메랄드·골드바 오브제를 각각 생성했습니다. 재질과 조명이 페이지 전체에서 통일되어 보이도록 결과물을 선별하고 Photoshop에서 합성·보정해 히어로와 각 섹션에 배치했습니다." },
    ],
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
    summary: "폰손주 앱의 할머니·할아버지 캐릭터를 AI로 제작해 앱 화면에 적용한 작업입니다.",
    tools: ["AI Image Generation", "Photoshop", "Figma"],
    details: [
      { label: "PURPOSE", text: "시니어 케어 앱 폰손주의 친근한 인상을 만들기 위해 앱에 등장할 할머니·할아버지 캐릭터를 AI로 제작한 작업입니다. 어르신 사용자가 앱을 딱딱한 관리 도구가 아니라 따뜻한 서비스로 느낄 수 있도록 캐릭터의 표정과 분위기를 중요하게 보았습니다." },
      { label: "PROCESS", text: "아이콘 스타일과 캐릭터 일러스트 레퍼런스를 바탕으로 앱의 부드러운 컬러와 어울리는 캐릭터 이미지를 생성하고, 여러 결과물 중 표정과 스타일이 일관된 이미지를 선별했습니다. 이후 Photoshop에서 다듬어 앱 화면의 비주얼 요소로 적용했습니다." },
    ],
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
    title: "XAV",
    tag: "BRAND IDENTITY · LOGO DESIGN",
    summary: "가방끈을 모티프로 캐주얼하고 유연한 브랜드 이미지를 표현한 로고 디자인.",
    tools: ["Illustrator", "Photoshop"],
    details: [
      { label: "PROJECT STORY", text: "캐주얼하고 젊은 브랜드 이미지를 표현하기 위해 가방끈의 연결된 형태를 모티프로 활용한 로고 디자인입니다. 비비드한 블루와 옐로우를 사용해 활동적이고 에너지 있는 인상을 만들고, 로고 자체에서 브랜드의 가볍고 유연한 이미지를 느낄 수 있도록 구성했습니다." },
    ],
    image: "/projects/design-xav.png",
    alt: "XAV 로고 - MAKE YOUR OWN COLORFUL WAY",
  },
  {
    id: "logo-shinseoul",
    title: "신서울",
    tag: "BRAND IDENTITY · LOGO · FAVICON",
    summary: "전통적인 한국의 형태를 현대적으로 재해석한 브랜드 로고와 파비콘.",
    tools: ["Illustrator", "Photoshop"],
    details: [
      { label: "PROJECT STORY", text: "온라인 쇼핑 브랜드의 아이덴티티를 만들기 위해 한국적인 형태를 바탕으로 로고와 파비콘을 제작했습니다. 전통적인 이미지를 그대로 사용하는 대신 형태를 단순화하고 현대적인 선과 구조로 정리해, 한국적인 인상과 온라인 브랜드에 어울리는 세련된 이미지를 함께 표현했습니다." },
    ],
    image: "/projects/branding-shinseoul-logo.png",
    alt: "기와지붕과 한복 고름을 형상화한 신서울 로고",
  },
  {
    id: "logo-shinseoul-favicon",
    title: "신세계",
    tag: "WEB GRAPHIC",
    summary: "웹사이트에서 활용하기 쉽도록 기존 로고 이미지를 정리한 그래픽 작업.",
    tools: ["Photoshop"],
    details: [
      { label: "PROJECT STORY", text: "웹사이트에서 사용할 수 있도록 기존 로고 이미지를 정리하고 작은 화면에서도 활용하기 쉬운 형태로 보정했습니다." },
    ],
    image: "/projects/branding-shinseoul-favicon.png",
    alt: "한복 저고리를 단순화한 신서울 인터넷용 작은 로고",
  },
  {
    id: "logo-phonsonju",
    title: "폰손주",
    tag: "APP BRANDING",
    summary: "시니어와 가족을 연결하는 서비스의 의미를 시각적으로 표현한 앱 로고.",
    tools: ["Illustrator", "Photoshop"],
    details: [
      { label: "PROJECT STORY", text: "폰손주 서비스가 가진 친근함과 가족 간의 연결을 시각적으로 표현하기 위해 제작한 앱 로고입니다. 서비스의 이름과 성격을 쉽게 떠올릴 수 있도록 사람과 스마트폰의 연결을 친근한 형태로 단순화했습니다." },
      { label: "WORK", text: "로고 디자인" },
    ],
    image: "/projects/branding-phonsonju-logo.png",
    alt: "시니어 돌봄 앱 폰손주 로고",
  },
]

// 영상 · 모션 작업 — 작품을 추가하면 VIDEO 코너가 GRAPHIC 다음에 자동으로 나타납니다.
export const VIDEO_WORKS: Work[] = [
  {
    id: "video-magic-show",
    title: "THE MAGIC SHOW",
    tag: "MOTION GRAPHICS · PROMOTIONAL VIDEO",
    tagline: "7 MAGIC, 7 MOMENTS",
    video: "/videos/THE MAGIC SHOW.mp4",
    videoCover: 18,
    tools: ["After Effects"],
    details: [
      {
        label: "PROJECT STORY",
        text: "〈더 매직쇼〉 마지막 우승자 7인의 공연을 소개하는 모션 콘텐츠입니다. 각 마술사가 가진 특징적인 퍼포먼스를 하나씩 영상으로 옮겨, 서로 다른 마술과 각자의 개성이 한 편의 콘텐츠 안에서 보여지도록 구성했습니다.",
      },
      {
        label: "MARKETING POINT",
        text: "공연에 대한 설명을 길게 전달하기보다 마술 자체의 시각적인 임팩트를 앞세워, 시청자가 짧은 시간 안에 공연의 볼거리를 직관적으로 느끼고 실제 공연에 대한 관심으로 이어질 수 있도록 구성했습니다.",
      },
      { label: "MY CONTRIBUTION", text: "영상 기획 · 모션그래픽 제작" },
    ],
  },
  {
    id: "video-sandwich",
    title: "SANDWICH PROMOTION",
    tag: "PRODUCT PROMOTION · MOTION GRAPHICS",
    tagline: "A NEW BITE",
    video: "/videos/SANDWICH PROMOTION.mp4",
    videoCover: 56,
    tools: ["After Effects"],
    details: [
      {
        label: "PROJECT STORY",
        text: "샌드위치 가게의 새로운 메뉴를 홍보하기 위해 제작한 제품 프로모션 영상입니다. 제품의 형태와 재료가 가진 특징을 시각적으로 보여주면서, 짧은 영상 안에서도 어떤 메뉴인지 직관적으로 인식할 수 있도록 구성했습니다.",
      },
      {
        label: "MARKETING POINT",
        text: "제품 정보를 단순하게 설명하기보다 먹음직스러운 제품 이미지와 움직임을 중심으로 시선을 끌고, 짧은 시간 안에 신메뉴에 대한 관심을 유도하는 광고 콘텐츠로 표현했습니다.",
      },
      { label: "MY CONTRIBUTION", text: "영상 기획 · 모션그래픽 제작" },
    ],
  },
  {
    id: "video-chiikawa",
    title: "CHIIKAWA",
    tag: "SHORT-FORM CONTENT · TEAM PROJECT",
    tagline: "A LITTLE STORY",
    team: true,
    video: "/videos/chiikawa.mp4",
    videoCover: 12,
    tools: ["Premiere Pro"],
    details: [
      {
        label: "PROJECT STORY",
        text: "꼬꼬무와 같은 짧은 이야기형 콘텐츠의 형식을 참고해, 먼작귀 캐릭터를 소개하는 애니메이션 콘텐츠로 제작했습니다. 짧은 시간 안에 캐릭터의 특징과 상황이 자연스럽게 전달되도록 이야기의 흐름을 구성했습니다.",
      },
      {
        label: "MARKETING POINT",
        text: "캐릭터를 단순하게 소개하는 방식보다 짧은 쇼츠 형식과 귀여운 캐릭터를 활용해 처음 보는 사람도 자연스럽게 콘텐츠에 관심을 갖고 끝까지 시청할 수 있도록 구성했습니다.",
      },
      { label: "MY CONTRIBUTION", text: "콘텐츠 구성 · 영상 편집" },
    ],
  },
  {
    id: "video-3d-animation",
    title: "3D ANIMATION",
    tag: "3D ANIMATION · TEAM PROJECT",
    tagline: "FROM MODEL TO MOTION",
    team: true,
    video: "/videos/3d-animation.mp4",
    videoCover: 12,
    tools: ["Maya", "After Effects"],
    details: [
      {
        label: "PROJECT STORY",
        text: "팀원들과 함께 제작한 3D 애니메이션 프로젝트입니다. 3D 캐릭터와 공간을 제작하고 하나의 영상 콘텐츠로 완성했으며, 제작 과정에서 여러 단계의 작업에 참여해 최종 영상까지 완성했습니다.",
      },
      { label: "MY CONTRIBUTION", text: "모델링 · 리깅 · 라이팅 · 렌더링 · After Effects 후반 작업" },
    ],
  },
]

const VIDEO_CATEGORY: Category = {
  no: "06",
  anchor: "video",
  label: "VIDEO / MOTION",
  navLabel: "VIDEO",
  sub: "영상 · 모션 코너",
  tone: "pink",
  kind: "design",
  flow: "rail",
  background: "/mart/design-corner.png",
  works: VIDEO_WORKS,
  intro: {
    title: "VIDEO / MOTION",
    text: "움직임으로 이야기를 만들고,\n콘텐츠의 매력을 전달합니다.",
    listLabel: "VIDEO CONTENT",
    list: ["영상 기획", "영상 편집", "모션그래픽", "애니메이션"],
    showCount: true,
  },
}

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
    label: "AI CONTENT",
    navLabel: "AI",
    introLabel: "AI",
    sub: "AI 작업 코너",
    tone: "blue",
    kind: "ai",
    flow: "rail",
    background: "/mart/coding-corner.png",
    works: AI_WORKS,
    intro: {
      text: "AI를 디자인 작업의 보조 도구로 활용해 브랜드 이미지, 제품 비주얼, 캐릭터 등 다양한 콘텐츠를 제작했습니다. 단순 이미지 생성에 그치지 않고 프로젝트의 콘셉트와 목적에 맞는 결과물을 만들고, Photoshop과 Figma를 활용해 실제 디자인에 적용했습니다.",
      process: ["콘셉트 설정", "AI 이미지 생성", "결과물 선별 및 수정", "디자인 적용"],
      tools: ["AI Image Generation", "Photoshop", "Figma"],
    },
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
  ...(VIDEO_WORKS.length > 0 ? [VIDEO_CATEGORY] : []),
]
