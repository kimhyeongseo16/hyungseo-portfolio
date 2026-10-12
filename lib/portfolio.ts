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
    title: "LEEUM",
    tag: "WEB CLONE CODING",
    summary: "리움미술관 웹사이트의 레이아웃과 시각적 구성을 분석해 주요 화면을 구현한 프로젝트.",
    tools: ["HTML", "CSS", "jQuery"],
    details: [
      { label: "PROJECT OVERVIEW", text: "리움미술관 웹사이트의 레이아웃과 시각적 구성을 분석하고 주요 화면을 직접 구현했습니다." },
      { label: "FOCUS", text: "레이아웃 · 타이포그래피 · 이미지 배치 · 인터랙션" },
      { label: "MY ROLE", text: "개인 프로젝트 · 퍼블리싱" },
      { label: "WHAT I LEARNED", text: "디자인을 코드로 옮기는 과정에서 레이아웃과 요소의 위치 관계를 분석하는 경험을 쌓았습니다." },
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
    summary: "피트니스 브랜드 웹사이트의 이미지 중심 레이아웃과 인터랙션을 분석해 구현한 프로젝트.",
    tools: ["HTML", "CSS", "jQuery"],
    details: [
      { label: "PROJECT OVERVIEW", text: "피트니스 브랜드 사이트를 참고해 메인 화면의 이미지 구성과 타이포그래피, 여백, 인터랙션을 직접 구현했습니다." },
      { label: "FOCUS", text: "이미지 중심 레이아웃 · 타이포그래피 · 여백 · 인터랙션" },
      { label: "MY ROLE", text: "개인 프로젝트 · 퍼블리싱" },
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
    tag: "RESPONSIVE WEB",
    info: ["RESPONSIVE", "CONTRIBUTION 33%"],
    summary: "KCC 경영이념 페이지를 분석하고 스크롤 인터랙션과 반응형 웹을 구현한 프로젝트.",
    tools: ["HTML", "CSS", "JavaScript", "jQuery", "Swiper"],
    details: [
      { label: "PROJECT OVERVIEW", text: "KCC 경영이념 페이지를 분석하고 실제 웹사이트의 구조와 인터랙션을 구현했습니다." },
      { label: "FOCUS", text: "레이아웃, 타이포그래피, 이미지 구성, 스크롤 인터랙션과 헤더 움직임을 분석했습니다." },
      { label: "IMPLEMENTATION", text: "스크롤 방향에 따른 헤더 노출 및 숨김, 이미지 확대, 텍스트 마스킹 등의 인터랙션을 구현했습니다." },
      { label: "RESPONSIVE WEB", text: "다양한 화면 크기에 맞게 콘텐츠가 변화할 수 있도록 반응형 구조를 고려했습니다." },
      { label: "MY ROLE", text: "웹 디자인 · 퍼블리싱 · 인터랙션 구현\nTEAM PROJECT · CONTRIBUTION 33%" },
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
    summary: "엘리시안 웹사이트의 메인 비주얼과 콘텐츠 구조를 분석해 직접 구현한 클론코딩 프로젝트.",
    tools: ["HTML", "CSS", "JavaScript", "Swiper"],
    details: [
      { label: "PROJECT OVERVIEW", text: "엘리시안 웹사이트를 분석해 메인 비주얼과 콘텐츠 구조를 직접 구현했습니다." },
      { label: "FOCUS", text: "메인 비주얼 · 이미지 배치 · 콘텐츠 구조 · 슬라이드" },
      { label: "MY ROLE", text: "개인 프로젝트 · 퍼블리싱 · 인터랙션 구현" },
      { label: "WHAT I LEARNED", text: "Swiper를 활용한 슬라이드 구현과 웹사이트의 콘텐츠 구조를 분석하는 경험을 쌓았습니다." },
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
    info: ["RESPONSIVE", "CONTRIBUTION 33%"],
    overview: "친환경 캠페인의 참여부터 인증과 리워드까지\n이어지는 참여형 캠페인 랜딩페이지.",
    tools: ["Figma", "Photoshop", "HTML", "CSS"],
    details: [
      { label: "PROJECT OVERVIEW", text: "제주 삼다수의 친환경 메시지를 바탕으로 이벤트 참여부터 굿즈, 인증, Q&A, CTA까지 이어지는 캠페인 랜딩페이지를 기획하고 디자인했습니다." },
      { label: "PROJECT GOAL", text: "단순한 친환경 홍보 페이지가 아니라 사용자가 직접 참여할 수 있는 캠페인으로 구성하는 것을 목표로 했습니다." },
      { label: "CONCEPT / STRATEGY", text: "관심 → 이벤트 확인 → 참여 → 인증 → 공유 → 리워드의 흐름을 중심으로 콘텐츠를 구성했습니다." },
      { label: "DESIGN", text: "제주와 친환경 이미지를 중심으로 밝고 깨끗한 비주얼을 구성하고, 정보가 많은 캠페인 페이지에서도 사용자가 쉽게 내용을 파악할 수 있도록 섹션별 정보의 우선순위를 정리했습니다." },
      { label: "MARKETING POINT", text: "친환경이라는 메시지를 단순히 전달하는 데 그치지 않고 사용자가 실제로 참여하고 인증할 수 있는 캠페인 구조로 연결했습니다." },
      { label: "MY ROLE", text: "기획 · 웹 디자인 · 콘텐츠 구성\nTEAM PROJECT · CONTRIBUTION 33%" },
      { label: "RESPONSIVE", text: "다양한 화면 크기에서 콘텐츠의 흐름과 가독성이 유지될 수 있도록 반응형 웹을 고려했습니다." },
    ],
    team: true,
    featured: true,
    image: "/projects/samdasoo-subpage02.png",
    fullImage: "/projects/samdasoo-subpage02.png",
    thumbTop: true,
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
    summary: "프리미엄 스마트 변기의 기능과 가치를 고급스럽고 직관적으로 전달하는 제품 랜딩페이지.",
    tools: ["Photoshop", "Figma", "AI Image Generation"],
    details: [
      { label: "PROJECT OVERVIEW", text: "프리미엄 스마트 변기의 기능과 가치를 한눈에 전달하기 위한 제품 랜딩페이지를 기획하고 디자인했습니다." },
      { label: "PROJECT GOAL", text: "단순히 제품의 기능을 나열하기보다 제품을 사용함으로써 얻을 수 있는 편리함과 가치를 하나의 브랜드 경험처럼 전달하는 것을 목표로 했습니다." },
      { label: "CONCEPT / STRATEGY", text: "“비우다, 그리고 부를 쌓다.”\n\n변기라는 일상적인 제품을 프리미엄 서비스처럼 재해석하고, 제품의 기능과 가치를 시각적인 스토리로 연결했습니다." },
      { label: "DESIGN", text: "골드 컬러와 넓은 여백을 활용해 고급스러운 이미지를 구성하고, 제품 → 기능 → 가치 → CTA의 흐름으로 정보를 배치했습니다." },
      { label: "MARKETING POINT", text: "제품의 기능을 단순하게 설명하기보다 “이 제품을 사용하면 무엇이 달라지는가”에 초점을 맞춰 제품의 가치를 전달했습니다." },
      { label: "MY ROLE", text: "기획 · 디자인 · AI 이미지 제작" },
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
    summary: "캐릭터와 제품 비주얼을 결합해 제품 특징과 사용법을 친근하게 전달한 상세페이지.",
    tools: ["Photoshop", "Figma", "AI Image Generation"],
    details: [
      { label: "PROJECT OVERVIEW", text: "COSRX와 GANADI의 콜라보레이션 제품을 효과적으로 소개하기 위한 상세페이지를 기획하고 디자인했습니다." },
      { label: "PROJECT GOAL", text: "제품 정보를 한 번에 나열하지 않고 사용자가 페이지를 따라가면서 피부 고민 → 제품 → 특징 → 사용 방법 → 변화 → 후기를 자연스럽게 이해하도록 구성했습니다." },
      { label: "CONCEPT / STRATEGY", text: "하늘, 구름, 버블 등의 비주얼 요소와 캐릭터를 활용해 제품의 가볍고 산뜻한 이미지를 표현했습니다." },
      { label: "DESIGN", text: "제품과 캐릭터가 자연스럽게 연결되도록 구성하고, 정보의 흐름에 따라 비주얼과 텍스트가 이어지도록 설계했습니다." },
      { label: "MARKETING POINT", text: "소비자의 피부 고민에서 제품의 해결책으로 자연스럽게 이동하도록 콘텐츠를 구성해 제품의 필요성을 직관적으로 전달했습니다." },
      { label: "MY ROLE", text: "기획 · 상세페이지 디자인 · 비주얼 디자인 · AI 이미지 제작" },
    ],
    image: "/projects/design-cosrx.png",
    fullImage: "/projects/design-cosrx-full.jpg",
    view: "page",
    alt: "COSRX × 가나디 콜라보 세럼 상세페이지 디자인",
  },
  {
    id: "design-osulloc",
    title: "O'SULLOC — 7 DAYS, 7 TEAS",
    tag: "BRAND LANDING PAGE · CAMPAIGN",
    info: ["BRAND EXPERIENCE", "AI IMAGE"],
    summary: "일주일의 각 하루와 어울리는 차를 연결해 브랜드 경험으로 풀어낸 프리미엄 랜딩페이지.",
    tools: ["Figma", "Photoshop", "AI Image Generation"],
    details: [
      { label: "PROJECT OVERVIEW", text: "오설록의 차를 단순한 제품이 아니라 일주일의 일상 속에서 경험하는 브랜드 캠페인으로 풀어낸 랜딩페이지입니다." },
      { label: "PROJECT GOAL", text: "“일주일의 모든 하루에는 그날에 어울리는 차가 있다.”라는 콘셉트를 중심으로 사용자의 일상과 차를 연결했습니다." },
      { label: "CONCEPT / STRATEGY", text: "월요일부터 일요일까지 각각의 하루에 어울리는 차를 선정하고, 제품을 단순히 나열하지 않고 각 요일의 분위기와 감정에 맞는 차로 표현했습니다.\n\nMONDAY — START FRESH\nTUESDAY — BRIGHT MOOD\nWEDNESDAY — PAUSE & BREATHE\nTHURSDAY — CHANGE THE FLOW\nFRIDAY — SOFT REWARD\nSATURDAY — SLOW SATURDAY\nSUNDAY — QUIET ENDING" },
      { label: "DESIGN", text: "제주 자연과 차밭의 이미지를 기반으로 초록색 중심의 프리미엄한 분위기를 구성했습니다." },
      { label: "MARKETING POINT", text: "제품 자체를 강조하기보다 사용자의 일상과 제품을 연결해 차를 하나의 라이프스타일 경험으로 인식할 수 있도록 구성했습니다." },
      { label: "MY ROLE", text: "기획 · 디자인 · AI 비주얼 디렉팅 · 콘텐츠 구성" },
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
    info: ["TEAM PROJECT", "CONTRIBUTION 33%"],
    summary: "독거노인의 일상과 건강을 가족이 함께 살필 수 있도록 기획한 시니어 케어 앱.",
    tools: ["Figma"],
    details: [
      { label: "PROJECT OVERVIEW", text: "독거노인의 일상과 건강을 가족이 보다 쉽게 확인하고 소통할 수 있도록 기획한 시니어 케어 앱입니다." },
      { label: "PROBLEM", text: "혼자 생활하는 부모님의 건강과 일상을 가족이 지속적으로 확인하기 어렵다는 문제에서 시작했습니다." },
      { label: "UX GOAL", text: "시니어 사용자가 어렵게 느끼지 않도록 복잡한 기능을 줄이고 직관적인 정보 구조를 만드는 것을 목표로 했습니다." },
      { label: "DESIGN", text: "큰 글씨, 단순한 화면 구조, 직관적인 아이콘, 친근한 캐릭터와 명확한 하단 네비게이션을 활용했습니다." },
      { label: "UX POINT", text: "기능을 많이 넣기보다 사용자가 무엇을 해야 하는지 바로 이해할 수 있는 구조에 집중했습니다." },
      { label: "MY ROLE", text: "기획 · UI/UX 디자인 · 화면 구성 · 프로토타입 제작\nTEAM PROJECT · CONTRIBUTION 33%" },
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
    title: "ZERO",
    tag: "PRODUCT ADVERTISING · CARD NEWS",
    summary: "제품의 상큼하고 가벼운 이미지를 강하게 전달한 제품 광고 그래픽.",
    tools: ["Photoshop"],
    details: [
      { label: "PROJECT OVERVIEW", text: "제품의 상큼한 이미지를 강조한 카드뉴스형 광고 그래픽입니다." },
      { label: "DESIGN / MARKETING INTENT", text: "강렬한 컬러와 큰 타이포그래피를 활용해 SNS에서 제품과 핵심 메시지가 빠르게 인식되도록 구성했습니다." },
      { label: "MARKETING POINT", text: "제품의 특징을 길게 설명하기보다 강한 첫인상과 짧은 메시지를 통해 제품에 대한 관심을 유도하는 데 집중했습니다." },
      { label: "MY ROLE", text: "기획 · 디자인" },
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
      { label: "PROJECT OVERVIEW", text: "말차와 초코의 조합을 시각적으로 강조한 단백질 쉐이크 광고 그래픽입니다." },
      { label: "DESIGN / MARKETING INTENT", text: "말차의 그린 컬러와 초콜릿의 브라운 컬러를 활용하고 제품, 음료, 원료를 함께 배치해 제품의 맛과 특징을 한눈에 보여주도록 구성했습니다." },
      { label: "MARKETING POINT", text: "제품의 맛을 텍스트로만 설명하지 않고 실제 음료와 원료를 함께 보여줘 소비자가 맛을 직관적으로 상상할 수 있도록 구성했습니다." },
      { label: "MY ROLE", text: "기획 · 디자인" },
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
    summary: "제품 이미지와 타이포그래피를 활용해 역동적이고 젊은 이미지를 표현한 패션 그래픽.",
    tools: ["Photoshop"],
    details: [
      { label: "PROJECT OVERVIEW", text: "스니커즈의 역동적인 이미지를 표현하기 위한 패션 그래픽입니다." },
      { label: "DESIGN / MARKETING INTENT", text: "제품 사진과 과감한 타이포그래피를 결합해 젊고 자유로운 브랜드 이미지를 표현했습니다." },
      { label: "MARKETING POINT", text: "제품을 단순히 보여주는 것보다 제품이 가진 분위기와 라이프스타일을 시각적으로 전달하는 데 초점을 맞췄습니다." },
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
      { label: "PROJECT OVERVIEW", text: "제품 특징과 제품 이미지를 중심으로 구성한 정보형 그래픽입니다." },
      { label: "DESIGN / MARKETING INTENT", text: "제품의 전문적인 이미지를 유지하면서 핵심 정보를 시각적으로 정리해 제품의 특징과 성능이 직관적으로 전달되도록 구성했습니다." },
      { label: "MARKETING POINT", text: "모든 정보를 한 번에 보여주기보다 핵심 정보의 시각적 우선순위를 정해 제품의 전문성을 강조했습니다." },
      { label: "MY ROLE", text: "기획 · 디자인" },
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
    summary: "AI를 활용해 웹·광고·브랜드 콘텐츠에 필요한 비주얼을 제작하고 디자인에 적용한 작업.",
    tools: ["AI Image Generation", "Photoshop", "Figma"],
    details: [
      { label: "PROJECT OVERVIEW", text: "웹디자인과 그래픽 작업에 필요한 비주얼을 AI를 활용해 제작하고 Photoshop 등을 통해 후작업 및 합성을 진행했습니다." },
      { label: "PROCESS", text: "AI 이미지 생성 → 이미지 선별 → 수정 및 리터칭 → 디자인 적용" },
      { label: "APPLICATION", text: "랜딩페이지 비주얼 · 제품 이미지 · 캐릭터 · 광고 이미지 · 콘텐츠 이미지" },
      { label: "MY ROLE", text: "AI 이미지 기획 · 프롬프트 설계 · 결과물 선별 · 리터칭 및 디자인 적용" },
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
    summary: "AI를 활용해 웹·광고·브랜드 콘텐츠에 필요한 비주얼을 제작하고 디자인에 적용한 작업.",
    tools: ["AI Image Generation", "Photoshop", "Figma"],
    details: [
      { label: "PROJECT OVERVIEW", text: "웹디자인과 그래픽 작업에 필요한 비주얼을 AI를 활용해 제작하고 Photoshop 등을 통해 후작업 및 합성을 진행했습니다." },
      { label: "PROCESS", text: "AI 이미지 생성 → 이미지 선별 → 수정 및 리터칭 → 디자인 적용" },
      { label: "APPLICATION", text: "랜딩페이지 비주얼 · 제품 이미지 · 캐릭터 · 광고 이미지 · 콘텐츠 이미지" },
      { label: "MY ROLE", text: "AI 이미지 기획 · 프롬프트 설계 · 결과물 선별 · 리터칭 및 디자인 적용" },
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
    summary: "AI를 활용해 웹·광고·브랜드 콘텐츠에 필요한 비주얼을 제작하고 디자인에 적용한 작업.",
    tools: ["AI Image Generation", "Photoshop", "Figma"],
    details: [
      { label: "PROJECT OVERVIEW", text: "웹디자인과 그래픽 작업에 필요한 비주얼을 AI를 활용해 제작하고 Photoshop 등을 통해 후작업 및 합성을 진행했습니다." },
      { label: "PROCESS", text: "AI 이미지 생성 → 이미지 선별 → 수정 및 리터칭 → 디자인 적용" },
      { label: "APPLICATION", text: "랜딩페이지 비주얼 · 제품 이미지 · 캐릭터 · 광고 이미지 · 콘텐츠 이미지" },
      { label: "MY ROLE", text: "AI 이미지 기획 · 프롬프트 설계 · 결과물 선별 · 리터칭 및 디자인 적용" },
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
      { label: "PROJECT OVERVIEW", text: "캐주얼하고 젊은 브랜드 이미지를 표현하기 위한 로고 디자인입니다." },
      { label: "CONCEPT", text: "가방끈의 연결된 형태를 모티프로 활용해 유연하고 활동적인 이미지를 표현했습니다." },
      { label: "DESIGN", text: "비비드한 블루와 옐로우를 중심으로 젊고 에너지 있는 브랜드 이미지를 구성했습니다." },
      { label: "MY ROLE", text: "로고 디자인" },
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
      { label: "PROJECT OVERVIEW", text: "온라인 쇼핑 브랜드에 사용할 로고와 파비콘을 제작했습니다." },
      { label: "CONCEPT", text: "한국적인 형태를 기반으로 하되 전통적인 느낌에 머무르지 않도록 형태를 단순화하고 현대적으로 정리했습니다." },
      { label: "MY ROLE", text: "로고 디자인 · 그래픽 디자인 · 파비콘 제작" },
    ],
    image: "/projects/branding-shinseoul-logo.png",
    alt: "기와지붕과 한복 고름을 형상화한 신서울 로고",
  },
  {
    id: "logo-shinseoul-favicon",
    title: "신서울 인터넷용 로고",
    tag: "BRAND IDENTITY · LOGO · FAVICON",
    summary: "전통적인 한국의 형태를 현대적으로 재해석한 브랜드 로고와 파비콘.",
    tools: ["Illustrator", "Photoshop"],
    details: [
      { label: "PROJECT OVERVIEW", text: "온라인 쇼핑 브랜드에 사용할 로고와 파비콘을 제작했습니다." },
      { label: "CONCEPT", text: "한국적인 형태를 기반으로 하되 전통적인 느낌에 머무르지 않도록 형태를 단순화하고 현대적으로 정리했습니다." },
      { label: "MY ROLE", text: "로고 디자인 · 그래픽 디자인 · 파비콘 제작" },
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
      { label: "PROJECT OVERVIEW", text: "시니어 케어 서비스의 친근함과 가족 간 연결을 표현하기 위한 앱 로고를 제작했습니다." },
      { label: "CONCEPT", text: "스마트폰과 사람의 연결이라는 서비스의 핵심 이미지를 친근한 형태로 표현했습니다." },
      { label: "MY ROLE", text: "로고 디자인" },
    ],
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
