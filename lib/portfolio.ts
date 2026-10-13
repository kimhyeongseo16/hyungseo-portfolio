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
    summary: "리움미술관 웹사이트의 레이아웃과 인터랙션을 분석하고 직접 구현한 클론코딩 프로젝트입니다.",
    tools: ["HTML", "CSS", "jQuery"],
    details: [
      { label: "PROJECT", text: "리움미술관 웹사이트를 그대로 따라 만들기보다, 화면이 어떤 구조로 나뉘고 요소들이 어떤 규칙으로 배치되는지를 먼저 분석한 뒤 코드로 옮긴 학습 프로젝트입니다. 넓은 여백과 절제된 타이포그래피, 큰 이미지가 만드는 미술관 특유의 분위기를 유지하는 데 집중했고, HTML과 CSS로 레이아웃을 잡은 뒤 jQuery로 주요 인터랙션을 구현했습니다. 이 과정에서 디자인을 코드로 옮길 때 요소 사이의 위치 관계와 간격을 읽어내는 방법을 익혔습니다." },
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
    summary: "피트니스 브랜드 웹사이트의 이미지 중심 레이아웃과 인터랙션을 직접 구현한 클론코딩 프로젝트입니다.",
    tools: ["HTML", "CSS", "jQuery"],
    details: [
      { label: "PROJECT", text: "피트니스 브랜드 URBAN BLUE의 웹사이트를 분석하고 메인 화면을 직접 구현한 클론코딩 프로젝트입니다. 큰 이미지가 화면을 채우는 레이아웃에서 타이포그래피와 여백이 어떻게 브랜드의 역동적인 인상을 만드는지 살펴보고, 그 비율과 간격을 최대한 그대로 옮기려 했습니다. 화면 크기에 따라 이미지와 텍스트가 재배치되는 반응형 구조와 스크롤에 맞춰 움직이는 인터랙션도 jQuery로 직접 구현했습니다." },
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
    summary: "KCC 경영이념 페이지의 정보 구조와 화면을 재구성하고, 스크롤 인터랙션과 반응형 웹으로 구현한 팀 프로젝트입니다.",
    tools: ["HTML", "CSS", "JavaScript", "jQuery", "Swiper"],
    details: [
      { label: "PROJECT", text: "KCC 기업 홈페이지의 경영이념 페이지를 분석하고, 화면 구성과 정보 구조를 다시 정리해 구현한 팀 프로젝트입니다. 기업 사이트는 전달해야 할 정보가 많고 문장이 길어지기 쉽기 때문에, 원본을 그대로 옮기기보다 섹션마다 전달할 메시지를 먼저 나누고 이미지와 텍스트의 순서를 정리했습니다. 사용자가 스크롤을 따라 내려가며 경영이념의 내용을 차례로 읽을 수 있도록 섹션 사이의 전환과 여백도 함께 조정했습니다." },
      { label: "INTERACTION · RESPONSIVE", text: "인터랙션은 jQuery를 기반으로 구현했습니다. 스크롤 방향에 따라 헤더가 나타나고 숨겨지게 해 콘텐츠를 읽는 동안 화면을 가리지 않도록 했고, 스크롤에 맞춘 이미지 확대와 텍스트 인터랙션으로 기업의 메시지가 한 단계씩 드러나도록 연출했습니다. 슬라이드 영역은 Swiper로 구성했으며, 다양한 화면 크기에서도 레이아웃과 가독성이 유지되도록 반응형으로 작업했습니다." },
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
    summary: "엘리시안 웹사이트의 대형 비주얼 중심 레이아웃과 콘텐츠 구조를 분석해 구현한 클론코딩 프로젝트입니다.",
    tools: ["HTML", "CSS", "JavaScript", "Swiper"],
    details: [
      { label: "PROJECT", text: "엘리시안 웹사이트를 분석해 메인 화면을 직접 구현한 클론코딩 프로젝트입니다. 화면 전체를 채우는 대형 비주얼과 그 위에 놓인 헤더·네비게이션, 이미지와 텍스트가 번갈아 놓이는 콘텐츠 배치를 살펴보고, 스크롤을 따라 섹션이 이어지는 화면 구성을 그대로 구현하는 데 집중했습니다. 메인 비주얼 슬라이드는 Swiper로 구현하며 라이브러리를 실제 레이아웃에 맞게 적용하는 방법을 익혔습니다." },
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
    info: ["TEAM PROJECT", "RESPONSIVE"],
    overview: "친환경 캠페인의 참여를 유도하는 참여형 랜딩페이지.",
    contribution: 33,
    tools: ["Figma", "Photoshop", "HTML", "CSS"],
    summary: "친환경 캠페인의 참여를 유도하는 참여형 랜딩페이지.",
    details: [
      { label: "PROJECT STORY", text: "제주삼다수의 친환경 PET 자원순환 캠페인 참여를 유도하기 위해 기획한 참여형 랜딩페이지입니다. 친환경 메시지를 단순히 전달하는 데 그치지 않고, 사용자의 관심이 실제 캠페인 참여로 이어질 수 있도록 전체적인 콘텐츠 구성과 사용자 흐름을 설계했습니다." },
      { label: "MY CONTRIBUTION", text: "전체 콘텐츠 구성 · 서브페이지 2 기획·디자인·코딩 · 푸터" },
      { label: "TOOLS", text: "Figma · Photoshop · HTML · CSS" },
      { label: "RESPONSIVE", text: "데스크톱과 모바일 환경을 고려한 반응형 웹으로 구현했습니다." },
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
    summary: "COSRX 제품과 GANADI 캐릭터를 결합해 제품을 친근하게 소개한 상세페이지입니다. 피부 고민부터 사용 방법과 후기까지 세로 흐름에 맞춰 정보를 구성했습니다.",
    tools: ["Photoshop", "Figma", "AI Image Generation"],
    details: [
      { label: "BACKGROUND · GOAL", text: "COSRX 제품과 GANADI 캐릭터를 결합한 콜라보레이션 제품 상세페이지입니다. 기능성 스킨케어 제품은 성분과 효능 정보가 많아 처음 보는 소비자에게는 딱딱하고 거리감 있게 느껴질 수 있습니다. 그래서 친숙한 캐릭터를 함께 등장시켜 제품에 대한 거리감을 줄이고, 소비자가 부담 없이 페이지를 끝까지 읽어 내려가도록 만드는 것을 목표로 했습니다." },
      { label: "INFORMATION FLOW", text: "상세페이지는 피부 고민 → 제품 소개 → 제품 특징과 효과 → 성분 및 기능 → 사용 방법 → 사용 전/후 → 후기 순서로 구성했습니다. 소비자가 자신의 고민에 공감하는 지점에서 시작해, 제품이 그 고민을 어떻게 해결하는지와 실제 사용 방법, 사용 후의 변화를 차례로 확인하도록 해 긴 세로형 페이지에서도 계속 읽을 이유가 이어지도록 했습니다." },
      { label: "DESIGN · MARKETING", text: "하늘, 구름, 버블 같은 가벼운 비주얼 요소와 캐릭터를 활용해 제품의 산뜻한 이미지를 표현했습니다. 정보를 텍스트로 나열하기보다 캐릭터와 제품 이미지가 함께 등장하는 비주얼로 보여줘, 소비자가 제품의 특징과 사용 상황을 바로 떠올릴 수 있도록 했습니다. 캐릭터의 친근함이 제품의 첫인상을 부드럽게 만들고, 그 호감이 구매 판단에 필요한 정보로 자연스럽게 이어지도록 의도했습니다. 일부 비주얼은 AI 이미지 생성으로 제작한 뒤 Photoshop에서 다듬었습니다." },
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
    summary: "‘7 DAYS, 7 TEAS’라는 콘셉트로 일주일의 흐름과 오설록의 차를 연결한 브랜드 경험형 랜딩페이지입니다.",
    tools: ["Figma", "Photoshop", "AI Image Generation"],
    details: [
      { label: "CONCEPT", text: "오설록의 차를 하나의 제품 목록이 아니라 일주일 동안 경험하는 브랜드 이야기로 풀어낸 랜딩페이지입니다. “일주일의 모든 하루에는 그날에 어울리는 차가 있다.”라는 생각에서 출발해, 월요일부터 일요일까지 각 요일의 분위기와 감정에 맞는 차를 하나씩 연결했습니다.\n\nMONDAY — START FRESH\nTUESDAY — BRIGHT MOOD\nWEDNESDAY — PAUSE & BREATHE\nTHURSDAY — CHANGE THE FLOW\nFRIDAY — SOFT REWARD\nSATURDAY — SLOW SATURDAY\nSUNDAY — QUIET ENDING" },
      { label: "STORY FLOW", text: "7개의 제품을 카드나 그리드로 나란히 보여주면 각각의 차는 비교 대상이 될 뿐 브랜드의 이야기는 남지 않는다고 생각했습니다. 그래서 제주의 자연에서 시작해 차의 원료와 산지, 요일별 차, 후기와 UGC, 7일 참여 방법, CTA까지 하나의 긴 스토리처럼 이어지는 시네마틱한 흐름으로 구성했습니다. 사용자는 스크롤을 내리며 일주일을 보내듯 차를 만나고, 마지막에는 직접 7일 동안 차를 경험해 보는 참여로 자연스럽게 이어지도록 했습니다." },
      { label: "DESIGN", text: "디자인은 Premium Editorial과 Minimal Luxury를 방향으로 잡았습니다. 넓은 여백과 짧고 명확한 카피로 한 화면에 하나의 메시지만 남기고, 제주 차밭을 떠올리게 하는 그린과 아이보리 계열의 색감으로 차분하고 고급스러운 분위기를 유지했습니다. 제품을 앞세우기보다 차를 마시는 시간과 일상의 분위기를 먼저 보여줘, 오설록을 하나의 라이프스타일 경험으로 인식할 수 있도록 했습니다." },
      { label: "AI VISUAL DIRECTING", text: "페이지의 비주얼은 AI 이미지 생성으로 제작했지만, 이미지를 만들어 넣는 데 그치지 않았습니다. 요일별 분위기와 각 차의 특징, 브랜드의 톤에 맞는 장면을 먼저 기획하고, 프롬프트로 빛과 색감, 구도를 조정하며 원하는 비주얼이 나올 때까지 디렉팅했습니다. 이렇게 만든 이미지를 Photoshop과 Figma에서 페이지 흐름에 맞게 다듬고 배치했습니다." },
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
    summary: "독거노인의 일상과 건강을 가족이 함께 살필 수 있도록 기획한 시니어 케어 앱입니다. 큰 글씨와 단순한 구조로 어르신도 쉽게 쓸 수 있게 디자인했습니다.",
    tools: ["Figma"],
    details: [
      { label: "BACKGROUND", text: "폰손주는 혼자 생활하는 부모님의 건강과 일상을 가족이 꾸준히 확인하기 어렵다는 문제에서 출발한 시니어 케어 앱입니다. 어르신에게는 매일 쓰기 부담 없는 앱이, 가족에게는 멀리서도 안부를 확인할 수 있는 연결 창구가 되는 것을 목표로 했습니다." },
      { label: "UX · FEATURES", text: "오늘의 안부, 일정, 복약 관리, 건강 정보, 가족 연결, 긴급 SOS 기능은 어르신의 하루 흐름 안에서 실제로 어떻게 쓰일지를 기준으로 구성했습니다. 아침에 안부를 남기고, 정해진 시간에 약을 챙기고, 필요한 순간에는 SOS 버튼으로 바로 도움을 요청할 수 있도록 자주 쓰는 기능은 홈 화면에서 바로 찾을 수 있게 했습니다. 기능을 많이 넣기보다 지금 무엇을 해야 하는지 바로 알 수 있는 구조에 집중했습니다." },
      { label: "DESIGN", text: "큰 글씨와 명확한 정보 구조, 단순한 하단 네비게이션으로 작은 화면에서도 읽고 누르기 쉽게 했습니다. 부드러운 컬러와 친근한 캐릭터를 활용해 ‘관리받는다’는 느낌보다 손주와 연락하는 듯한 따뜻한 인상을 주고자 했습니다." },
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
    summary: "‘슈가·칼로리 ZERO’라는 핵심 정보를 강한 컬러와 큰 타이포그래피로 전달한 음료 광고 카드뉴스입니다.",
    tools: ["Photoshop"],
    details: [
      { label: "MESSAGE", text: "애플사이다 비니거 음료의 가장 큰 장점인 ‘슈가·칼로리 ZERO’를 SNS 피드에서 한 번에 전달하기 위한 카드뉴스입니다. 제품의 여러 특징을 나열하기보다, 가볍고 부담 없이 마실 수 있는 음료라는 한 가지 메시지에 집중했습니다." },
      { label: "DESIGN INTENT", text: "스크롤을 빠르게 넘기는 SNS 환경에서 첫 화면에 시선을 붙잡을 수 있도록 강렬한 옐로우·레드 컬러와 화면을 가득 채우는 큰 타이포그래피를 사용했습니다. ‘ZERO’라는 단어 자체를 가장 큰 그래픽 요소로 만들어, 글을 자세히 읽지 않아도 제품의 핵심 정보와 상큼한 인상이 먼저 남도록 구성했습니다." },
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
    summary: "말차와 초코의 조합을 컬러와 원료 이미지로 보여줘 맛을 바로 상상하게 만든 단백질 쉐이크 광고 그래픽입니다.",
    tools: ["Photoshop"],
    details: [
      { label: "MESSAGE", text: "단백질 쉐이크의 성분이나 영양 정보보다 말차와 초코의 조합이라는 맛의 특징을 전달하는 데 집중한 광고 그래픽입니다. 소비자가 광고를 보는 순간 맛을 떠올리고 마셔 보고 싶다는 생각이 들게 하는 것을 목표로 했습니다." },
      { label: "DESIGN INTENT", text: "말차의 그린과 초콜릿의 브라운을 메인 컬러로 사용하고, 제품과 실제 음료, 원료를 한 화면에 함께 배치했습니다. 텍스트로 맛을 설명하는 대신 원료와 음료의 질감을 직접 보여줘, 소비자가 두 가지 맛의 조합을 직관적으로 상상할 수 있도록 했습니다." },
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
    summary: "스니커즈의 역동적인 분위기를 제품 사진과 과감한 타이포그래피로 표현한 패션 그래픽입니다.",
    tools: ["Photoshop"],
    details: [
      { label: "MESSAGE", text: "제품 정보를 전달하는 광고보다는, 뉴발란스 스니커즈가 가진 젊고 자유로운 분위기를 전달하는 데 초점을 맞춘 패션 그래픽입니다. 소비자가 신발의 사양보다 이 신발을 신었을 때의 스타일과 라이프스타일을 먼저 떠올리도록 하는 것을 목표로 했습니다." },
      { label: "DESIGN INTENT", text: "블루 컬러의 제품 사진을 중심에 두고 과감한 크기와 배치의 타이포그래피를 결합해 화면에 움직임과 리듬감을 만들었습니다. 정보량은 최소화하고 이미지와 타이포가 만드는 인상만으로 브랜드의 에너지가 전달되도록 구성했습니다." },
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
    summary: "소니 α7R II의 주요 특징을 시각적 우선순위에 따라 정리한 제품 정보형 그래픽입니다.",
    tools: ["Photoshop"],
    details: [
      { label: "MESSAGE", text: "카메라처럼 사양이 많은 제품은 정보를 모두 보여주면 오히려 핵심이 흐려지기 쉽습니다. 이 작업은 소니 α7R II의 주요 특징을 골라 제품의 전문성과 성능을 빠르게 전달하기 위한 정보형 그래픽입니다." },
      { label: "DESIGN INTENT", text: "제품 이미지를 중심에 두고 핵심 정보의 시각적 우선순위를 정해, 가장 중요한 특징이 먼저 보이고 세부 정보가 뒤따르도록 배치했습니다. 전문 장비다운 절제된 톤을 유지하면서도 정보가 한눈에 정리되어 보이도록 구성해, 제품에 관심 있는 소비자가 성능을 쉽게 이해할 수 있도록 했습니다." },
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
    summary: "가방끈의 형태를 모티프로 캐주얼하고 유연한 브랜드 이미지를 표현한 로고 디자인입니다.",
    tools: ["Illustrator", "Photoshop"],
    details: [
      { label: "CONCEPT · DESIGN", text: "XAV는 가방끈의 연결된 형태를 모티프로 캐주얼하고 유연한 브랜드 이미지를 만들고자 한 로고 디자인입니다. 끊기지 않고 이어지는 끈의 선을 글자 형태에 담아 활동적이고 자유로운 움직임을 표현했고, 비비드한 블루와 옐로우로 젊고 에너지 있는 인상을 더했습니다. ‘MAKE YOUR OWN COLORFUL WAY’라는 슬로건과 함께, 로고만 보아도 일상에서 편하게 메는 캐주얼 브랜드라는 성격이 바로 전달되도록 형태와 컬러를 정리했습니다." },
    ],
    image: "/projects/design-xav.png",
    alt: "XAV 로고 - MAKE YOUR OWN COLORFUL WAY",
  },
  {
    id: "logo-shinseoul",
    title: "신서울",
    tag: "BRAND IDENTITY · LOGO · FAVICON",
    summary: "퓨전 한국풍 브랜드를 목표로 전통적인 형태를 현대적인 선으로 정리한 로고 작업입니다. 파비콘과 웹 배너까지 확장했습니다.",
    tools: ["Illustrator", "Photoshop"],
    details: [
      { label: "CONCEPT", text: "신서울은 퓨전 한국풍 브랜드 이미지를 목표로 한 온라인 쇼핑 브랜드의 로고 작업입니다. 기와지붕과 한복 고름처럼 한국적인 형태에서 모티프를 가져오되, 전통적인 모양을 그대로 옮기기보다 현대적인 선과 단순한 구조로 정리해 지금의 브랜드로 자연스럽게 읽히도록 했습니다." },
      { label: "BRAND APPLICATION", text: "로고에서 끝내지 않고 파비콘과 웹 배너까지 확장해, 브라우저 탭처럼 작은 화면부터 넓은 배너까지 여러 온라인 화면에서 브랜드 아이덴티티가 일관되게 보이도록 했습니다." },
    ],
    image: "/projects/branding-shinseoul-logo.png",
    alt: "기와지붕과 한복 고름을 형상화한 신서울 로고",
  },
  {
    id: "logo-shinseoul-favicon",
    title: "신서울 인터넷용 로고",
    tag: "BRAND IDENTITY · LOGO · FAVICON",
    summary: "웹에서 쓰기 쉽도록 정리한 작은 로고입니다. 작은 크기에서도 형태가 분명하게 보이도록 단순화했습니다.",
    tools: ["Illustrator", "Photoshop"],
    details: [
      { label: "PROJECT", text: "웹 화면에서 사용할 수 있도록 로고 이미지를 정리한 작업입니다. 파비콘이나 헤더처럼 작은 크기로 쓰일 때에도 형태가 뭉개지지 않도록 한복 저고리의 형태를 단순한 선과 면으로 정리해, 작은 화면에서도 브랜드를 바로 알아볼 수 있도록 활용성을 고려했습니다." },
    ],
    image: "/projects/branding-shinseoul-favicon.png",
    alt: "한복 저고리를 단순화한 신서울 인터넷용 작은 로고",
  },
  {
    id: "logo-phonsonju",
    title: "폰손주",
    tag: "APP BRANDING",
    summary: "시니어와 가족을 연결하는 폰손주 서비스의 의미를 친근한 형태로 표현한 앱 로고입니다.",
    tools: ["Illustrator", "Photoshop"],
    details: [
      { label: "CONCEPT", text: "시니어 케어 앱 폰손주의 앱 로고입니다. 스마트폰과 사람, 그리고 어르신과 가족 사이의 연결이라는 서비스의 핵심 의미를 친근한 형태로 담았습니다. 앱 아이콘으로 작게 보일 때에도 따뜻하고 부담 없는 인상이 전달되도록 형태를 단순하게 정리했습니다." },
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
