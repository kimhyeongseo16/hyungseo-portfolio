"use client"

// 형서마트 진열 — 위에서 아래로 한 코너씩 지나가며, 코너 안에서는 작업물이 가로로 흘러갑니다.

import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react"
import { CATEGORIES, type Category, type Tone, type Work, type ZoneKind } from "@/lib/portfolio"
import { TeamTag, WorkLightbox } from "@/components/work-lightbox"
import { useCart } from "@/components/shopping-cart"
import { ReceiptPrintStage } from "@/components/checkout-receipt"

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v))
}

// 화면에 들어올 때 한 번만 나타나는 연출 (계속 움직이지 않습니다)
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return { ref, shown }
}

// 섹션을 지나가는 정도(0 → 1). 통로의 캐릭터 이동과 코너의 가로 흐름에 씁니다.
function useSectionProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [p, setP] = useState(0)

  useEffect(() => {
    let raf = 0
    const update = () => {
      const el = ref.current
      if (!el) return
      const total = el.offsetHeight - window.innerHeight
      setP(total > 0 ? clamp(-el.getBoundingClientRect().top / total, 0, 1) : 0)
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return { ref, p }
}

const TONES: Record<Tone, { badge: string; board: string }> = {
  blue: { badge: "bg-mart-blue-deep text-white", board: "border-mart-blue-deep" },
  pink: { badge: "bg-mart-pink text-mart-ink", board: "border-mart-pink" },
  yellow: { badge: "bg-mart-yellow text-mart-ink", board: "border-mart-yellow" },
  green: { badge: "bg-mart-green text-mart-ink", board: "border-mart-green" },
}

function PriceTag({ no, tone }: { no: string; tone: Tone }) {
  return (
    <span
      className={`absolute -left-2 -top-2 z-10 rounded-full px-3 py-1 font-display text-sm tracking-widest shadow-[0_8px_16px_-10px_rgba(74,107,134,0.9)] ${TONES[tone].badge}`}
    >
      NO.{no}
    </span>
  )
}

function ProcessStrip({ work }: { work: Work }) {
  if (work.processGroups) {
    if (work.kind !== "ai" || work.processCentered) return null
    return (
      <ol className="mt-4 grid grid-cols-[1fr_1fr_1.6fr] gap-2">
        {work.processGroups.map((group, i) => (
          <li key={group.label} className="min-w-0">
            <div className="flex h-[88px] items-center justify-center overflow-hidden rounded-lg bg-white">
              <img src={group.rows[0][0].src} alt={group.rows[0][0].alt} className="h-full w-full object-contain" />
            </div>
            <p className="mt-1 font-display text-xs leading-snug tracking-wide text-mart-blue-deep">
              <span className="mr-1 text-mart-ink/40">{i + 1}</span>
              {group.label}
            </p>
          </li>
        ))}
      </ol>
    )
  }
  if (!work.process) return null
  return (
    <ol className="mt-4 grid grid-cols-4 gap-2">
      {work.process.map((step, i) => (
        <li key={step.image} className="min-w-0">
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-white">
            <img src={step.image} alt={step.alt} className="h-full w-full object-contain" />
          </div>
          <p className="mt-1 truncate font-display text-xs tracking-wide text-mart-blue-deep">
            <span className="mr-1 text-mart-ink/40">{i + 1}</span>
            {step.stage}
          </p>
        </li>
      ))}
    </ol>
  )
}

function WorkCard({
  work,
  no,
  kind,
  tone,
  onOpen,
  delay,
  shown,
}: {
  work: Work
  no: string
  kind: ZoneKind
  tone: Tone
  onOpen: () => void
  delay: number
  shown: boolean
}) {
  const transparent = kind === "logo"
  // 카드뉴스는 작품 이미지만 진열합니다.
  const imageOnly = kind === "cardnews"

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`${work.title} 자세히 보기`}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onOpen()
        }
      }}
      className="group relative h-full cursor-pointer rounded-[24px] border border-mart-blue-deep/20 bg-mart-cream-soft/95 p-4 shadow-[0_22px_40px_-28px_rgba(74,107,134,0.9)] transition-shadow duration-200 hover:shadow-[0_30px_52px_-24px_rgba(74,107,134,0.95)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mart-blue-deep"
      style={{
        transform: shown ? undefined : "translateY(18px)",
        opacity: shown ? 1 : 0,
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      <PriceTag no={no} tone={tone} />

      {/* 대표 이미지 — 프레임 높이는 통일하되 원본 비율 그대로 담습니다. */}
      <div
        className={`relative flex ${
          imageOnly ? "aspect-square w-full" : "h-[clamp(190px,24vw,280px)]"
        } items-center justify-center overflow-hidden rounded-[18px] ${
          transparent ? "bg-white/70" : "bg-white"
        }`}
      >
        {work.image ? (
          <img
            src={work.image}
            alt={work.alt ?? work.title}
            loading="lazy"
            className={`h-full w-full transition-[filter,transform] duration-200 group-hover:scale-[1.02] group-hover:blur-[2px] ${
              imageOnly ? "object-contain" : work.thumbTop ? "object-cover object-top" : "object-contain p-3"
            }`}
          />
        ) : (
          <span className="font-display text-xl text-mart-ink/40">{work.title}</span>
        )}

        {/* 클릭할 수 있는 카드라는 걸 분명히 — 데스크톱 hover, 모바일에서는 카드 전체가 버튼입니다. */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 hidden items-center justify-center bg-mart-ink/35 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 sm:flex`}
        >
          <span className="rounded-full bg-mart-cream-soft px-5 py-2 font-display text-base tracking-wide text-mart-ink shadow-[0_10px_22px_-12px_rgba(0,0,0,0.8)]">
            자세히 보기 →
          </span>
        </span>
      </div>

      {!imageOnly && (
        <div className="px-1 pb-1 pt-4">
          {(work.tag || work.team) && (
            <p className="flex flex-wrap items-center gap-2 font-display text-sm tracking-widest text-mart-blue-deep">
              {work.tag}
              {work.team && <TeamTag />}
            </p>
          )}
          <h3 className="mt-1.5 font-display text-[1.7rem] leading-tight text-mart-ink sm:text-3xl">{work.title}</h3>
          {work.info && work.info.length > 0 && (
            <ul className="mt-2.5 flex flex-wrap gap-2">
              {work.info.map((item) => (
                <li
                  key={item}
                  className="rounded-full bg-mart-blue/20 px-3 py-1 font-display text-sm tracking-wide text-mart-ink/80"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}

          <ProcessStrip work={work} />

          <p className="mt-4 font-display text-base text-mart-blue-deep">
            <span className="underline-offset-4 group-hover:underline">
              {work.view === "page" ? "클릭하면 전체 페이지 보기" : "클릭하면 상세 보기"} · 장바구니에 담김
            </span>
          </p>
        </div>
      )}
    </article>
  )
}

// 대표 프로젝트 — 클론 코딩과 따로, 큰 이미지와 핵심 정보만 진열합니다.
function FeaturedCard({
  work,
  tone,
  delay,
  shown,
}: {
  work: Work
  tone: Tone
  delay: number
  shown: boolean
}) {
  return (
    <article
      className="relative grid h-full gap-6 rounded-[24px] border border-mart-blue-deep/20 bg-mart-cream-soft/95 p-4 shadow-[0_22px_40px_-28px_rgba(74,107,134,0.9)] sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] sm:items-start sm:gap-8 sm:p-5"
      style={{
        transform: shown ? undefined : "translateY(18px)",
        opacity: shown ? 1 : 0,
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      <span
        className={`absolute -left-2 -top-2 z-10 rounded-full px-3 py-1 font-display text-sm tracking-widest shadow-[0_8px_16px_-10px_rgba(74,107,134,0.9)] ${TONES[tone].badge}`}
      >
        FEATURED
      </span>

      {/* 대표 이미지 — 높이는 원본 비율이 정하고, 위부터 아래까지 전체를 보여줍니다. */}
      <div className="relative overflow-hidden rounded-[18px] bg-white">
        {work.image && (
          <img src={work.image} alt={work.alt ?? work.title} loading="lazy" className="block h-auto w-full" />
        )}
      </div>

      <div className="flex min-w-0 flex-col justify-between gap-10 px-1 pb-1 max-sm:order-first sm:sticky sm:top-[14vh] sm:min-h-[70vh] sm:py-2">
        <div>
          {(work.tag || work.team) && (
            <p className="flex flex-wrap items-center gap-2 font-display text-sm tracking-widest text-mart-blue-deep">
              {work.tag}
              {work.team && <TeamTag />}
            </p>
          )}
          <h3 className="mt-3 font-display text-[2.6rem] leading-[1.05] text-mart-ink lg:text-5xl">
            {work.title.split(" ").map((word) => (
              <span key={word} className="block">
                {word}
              </span>
            ))}
          </h3>
          {work.info && work.info.length > 0 && (
            <p className="mt-6 flex flex-wrap gap-x-2 font-display text-[17px] tracking-wide text-mart-ink">
              {work.info.map((item, i, list) => (
                <span key={item} className="whitespace-nowrap">
                  {item}
                  {i < list.length - 1 && <span className="ml-2 text-mart-ink/50">·</span>}
                </span>
              ))}
            </p>
          )}
          {work.tools && work.tools.length > 0 && (
            <p className="mt-2 font-display text-base tracking-wide text-mart-ink/70">{work.tools.join(" · ")}</p>
          )}
        </div>

        {work.overview && (
          <div className="border-t border-dashed border-mart-blue/40 pt-6">
            <p className="font-display text-sm tracking-widest text-mart-blue-deep">PROJECT OVERVIEW</p>
            <p className="mt-3 max-w-[26em] break-keep font-sans text-[15px] leading-[1.8] text-mart-ink/85 sm:text-base lg:whitespace-pre-line">
              {work.overview}
            </p>
          </div>
        )}

        {(work.siteUrl || work.originalUrl) && (
          <div className="flex flex-wrap items-center gap-3">
            {work.siteUrl && (
              <a
                href={work.siteUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full bg-mart-blue-deep px-8 py-3 font-display text-lg tracking-wide text-white shadow-[0_10px_22px_-8px_rgba(91,149,207,0.85)] transition-opacity hover:opacity-90"
              >
                MY SITE ↗
              </a>
            )}
            {work.originalUrl && (
              <a
                href={work.originalUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full border border-mart-blue-deep/40 bg-white px-6 py-2.5 font-display text-base tracking-wide text-mart-ink transition-colors hover:bg-mart-cream-soft"
              >
                ORIGINAL SITE ↗
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

// 코너 안내판 — 스크롤에 따라 크기가 변하지 않습니다.
function CornerSign({ category }: { category: Category }) {
  const tone = TONES[category.tone]
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex gap-16">
        <span className="h-8 w-px bg-mart-ink/25" />
        <span className="h-8 w-px bg-mart-ink/25" />
      </div>
      <div
        className={`rounded-2xl border bg-mart-cream-soft px-8 py-3.5 shadow-[0_16px_28px_-20px_rgba(74,107,134,0.9)] max-sm:px-5 ${tone.board}`}
      >
        <div className="flex items-center justify-center gap-3">
          <span className={`rounded-md px-3 py-0.5 font-display text-2xl leading-none ${tone.badge}`}>
            {category.no}
          </span>
          <span className="whitespace-nowrap font-display text-[1.75rem] tracking-wide text-mart-ink sm:text-5xl">{category.label}</span>
        </div>
      </div>
    </div>
  )
}

// 캐릭터는 기울거나 좌우로 흔들리지 않고 제자리에서 위아래로만 통통 뜁니다.
const HOP = "animate-[hop_1.8s_ease-in-out_infinite]"

// 코너를 안내하는 캐릭터 — 늘 같은 정면 캐릭터, 크기 고정.
function GuideCharacter({ className = "", size = "w-[min(30vw,170px)]" }: { className?: string; size?: string }) {
  return (
    <div className={`pointer-events-none flex justify-center ${className}`}>
      <img
        src="/cart-character.png"
        alt="카트를 밀며 코너를 둘러보는 형서 캐릭터"
        loading="lazy"
        className={`${size} ${HOP} shrink-0 drop-shadow-[0_16px_18px_rgba(74,107,134,0.25)]`}
      />
    </div>
  )
}

// 코너 배경 — 작품이 잘 읽히도록 매장 사진 위에 크림색 베일을 덧댑니다.
function CornerBackdrop({ src }: { src: string }) {
  return (
    <>
      <img src={src} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
      <div aria-hidden="true" className="absolute inset-0 bg-mart-cream/78" />
    </>
  )
}

type CardsProps = {
  category: Category
  shown: boolean
  onOpen: (work: Work) => void
}

function renderCards({ category, shown, onOpen }: CardsProps) {
  return category.works.map((work, i) =>
    work.featured ? (
      <FeaturedCard
        key={work.id}
        work={work}
        tone={category.tone}
        delay={i * 90}
        shown={shown}
      />
    ) : (
    <WorkCard
      key={work.id}
      work={work}
      no={String(i + 1).padStart(2, "0")}
      kind={work.kind ?? category.kind}
      tone={category.tone}
      onOpen={() => onOpen(work)}
      delay={i * 90}
      shown={shown}
    />
    )
  )
}

// 가로로 흐르는 코너 — 세로로 스크롤하면 진열대가 옆으로 지나갑니다. (모바일은 세로로 쌓입니다)
function RailCorner({ category, onOpen }: { category: Category; onOpen: (w: Work) => void }) {
  const { ref, p } = useSectionProgress<HTMLElement>()
  const railRef = useRef<HTMLDivElement>(null)
  const { ref: revealRef, shown } = useReveal<HTMLDivElement>()
  const { ref: featuredRef, shown: featuredShown } = useReveal<HTMLDivElement>()
  const railWorks = category.works.filter((w) => !w.featured)
  const featuredWorks = category.works.filter((w) => w.featured)

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    // 좁은 화면에서는 억지로 가로 이동시키지 않습니다.
    if (!window.matchMedia("(min-width: 640px)").matches) return
    const max = rail.scrollWidth - rail.clientWidth
    if (max <= 0) return
    // 코너를 지나가는 동안 진열대가 왼쪽으로 흘러갑니다.
    rail.scrollLeft = clamp((p - 0.15) / 0.7, 0, 1) * max
  }, [p])

  return (
    <div id={category.anchor}>
    <section
      ref={ref}
      aria-label={`${category.label} 코너`}
      className="relative w-full sm:h-[var(--corner-h)]"
      style={{ "--corner-h": `${90 + railWorks.length * 42}vh` } as CSSProperties}
    >
      <div className="sticky top-0 flex h-screen w-full flex-col justify-center overflow-hidden max-sm:static max-sm:h-auto max-sm:py-16">
        <CornerBackdrop src={category.background} />

        <div ref={revealRef} className="relative w-full max-sm:mx-auto max-sm:w-[calc(100%-32px)] max-sm:max-w-[430px]">
          <CornerSign category={category} />

          {featuredWorks.length > 0 && category.railLabel && (
            <p className="mt-[4vh] pl-[max(5vw,1.25rem)] font-display text-lg tracking-[0.2em] text-mart-blue-deep max-sm:pl-0">
              {category.railLabel}
            </p>
          )}

          <div
            ref={railRef}
            // 오른쪽 안내 영역(--nav-space)은 비워 두고, 진열대는 그 앞에서 잘립니다.
            className="mt-[5vh] mr-[var(--nav-space)] flex gap-7 overflow-x-auto pb-3 pl-[max(5vw,1.25rem)] pr-6 pt-3 [scrollbar-width:none] max-sm:mr-0 max-sm:flex-col max-sm:items-stretch max-sm:overflow-visible max-sm:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {renderCards({ category: { ...category, works: railWorks }, shown, onOpen }).map((card, i) => (
              <div key={railWorks[i].id} className="w-[min(78vw,420px)] shrink-0 max-sm:w-full">
                {card}
              </div>
            ))}
          </div>

          {/* 모바일에서는 카드 아래에서 캐릭터가 함께 걸어갑니다. */}
          <GuideCharacter className="mt-[6vh] hidden max-sm:flex" />
        </div>

        {/* 데스크톱 — 코너마다 캐릭터가 통로 오른쪽 끝을 따라 걷습니다. (카드 영역 밖) */}
        <GuideCharacter
          // 작품 카드 바깥, 화면 맨 오른쪽을 따라 걷고 안내 목차 뒤로 지나갑니다.
          className="absolute bottom-[12vh] right-3 z-0 max-sm:hidden"
          size="w-[min(11vw,104px)]"
        />
      </div>
    </section>

    {/* 대표 프로젝트 — 진열대 흐름과 분리해, 따로 크게 진열합니다. */}
    {featuredWorks.length > 0 && (
      <section aria-label={`${category.label} 대표 프로젝트`} className="relative w-full py-[10vh]">
        <CornerBackdrop src={category.background} />
        <div ref={featuredRef} className="relative mr-[var(--nav-space)] pl-[max(5vw,1.25rem)] pr-6 max-sm:mx-auto max-sm:w-[calc(100%-32px)] max-sm:max-w-[430px] max-sm:px-0">
          <div className="mx-auto flex max-w-[1100px] items-center gap-4">
            <p className="font-display text-lg tracking-[0.2em] text-mart-blue-deep">FEATURED PROJECT</p>
            <span aria-hidden="true" className="h-px flex-1 border-t border-dashed border-mart-blue-deep/40" />
          </div>
          {featuredWorks.map((work, i) => (
            <div key={work.id} className="mx-auto mt-8 max-w-[1100px]">
              <FeaturedCard
                work={work}
                tone={category.tone}
                delay={i * 90}
                shown={featuredShown}
              />
            </div>
          ))}
        </div>
      </section>
    )}
    </div>
  )
}

// 그리드 코너 — DESIGN처럼 작품을 나란히 두고 보는 코너입니다.
function GridCorner({ category, onOpen }: { category: Category; onOpen: (w: Work) => void }) {
  const { ref, shown } = useReveal<HTMLDivElement>()
  const count = category.works.length
  const columns = count <= 1 ? "grid-cols-1 mx-auto max-w-[760px]" : "grid-cols-1 sm:grid-cols-2"

  return (
    <section id={category.anchor} aria-label={`${category.label} 코너`} className="relative w-full">
      <CornerBackdrop src={category.background} />

      <div ref={ref} className="relative mx-auto w-full max-w-[1180px] px-5 py-[12vh] pr-[var(--nav-space)] max-sm:py-16 max-sm:w-[calc(100%-32px)] max-sm:max-w-[430px] max-sm:px-0 sm:px-8 sm:pr-[var(--nav-space)]">
        <CornerSign category={category} />

        <div className={`mt-[7vh] grid gap-10 sm:gap-12 ${columns}`}>
          {renderCards({ category, shown, onOpen }).map((card, i) => (
            <div
              key={category.works[i].id}
              // 3개짜리 코너(DESIGN)는 두 개 → 가운데 하나로 내려 놓습니다.
              className={count === 3 && i === 2 ? "sm:col-span-2 sm:mx-auto sm:w-[calc(50%-1.5rem)]" : ""}
            >
              {card}
            </div>
          ))}
        </div>

        <GuideCharacter className="mt-[7vh]" />
      </div>
    </section>
  )
}

function CornerZone({ category }: { category: Category }) {
  const [open, setOpen] = useState<Work | null>(null)
  const { add } = useCart()

  // 작품을 열어보면 그 작업이 장바구니에 담깁니다. (같은 작품은 한 번만)
  const openWork = (work: Work) => {
    setOpen(work)
    add({ id: work.id, title: work.title, category: category.label, image: work.image, imageTop: work.thumbTop })
  }

  return (
    <>
      {category.flow === "rail" ? (
        <RailCorner category={category} onOpen={openWork} />
      ) : (
        <GridCorner category={category} onOpen={openWork} />
      )}

      {open && (
        <WorkLightbox
          work={open}
          corner={`${category.no} ${category.label}`}
          transparent={(open.kind ?? category.kind) === "logo"}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  )
}

// 코너와 코너 사이 — 같은 매장 통로를 위에서 아래로 충분히 걸어 내려갑니다.
function Passage() {
  const { ref, p } = useSectionProgress<HTMLElement>()
  return (
    <section ref={ref} aria-hidden="true" className="relative h-[250vh] w-full bg-mart-cream max-sm:h-auto">
      <div className="sticky top-0 h-screen w-full overflow-hidden max-sm:static max-sm:h-[56vh]">
        <img src="/mart/vertical-passage.png" alt="" className="absolute inset-0 h-full w-full object-cover" />
        {/* 캐릭터는 크기를 바꾸지 않고 통로를 따라 천천히 아래로 걸어갑니다. */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 w-[min(30vw,210px)] will-change-transform max-sm:top-1/2 max-sm:![transform:translate(-50%,-50%)] max-sm:!opacity-100"
          style={{
            transform: `translate(-50%, ${4 + p * 66}vh)`,
            opacity: clamp(p * 14, 0, 1) * clamp((1 - p) * 14, 0, 1),
          }}
        >
          <img
            src="/cart-character.png"
            alt=""
            className={`block h-auto w-full ${HOP} drop-shadow-[0_18px_20px_rgba(74,107,134,0.28)]`}
          />
        </div>
      </div>
    </section>
  )
}

// 벨트 위를 오른쪽 → 왼쪽으로 지나가는 작업들 (담은 작업의 대표 이미지)
function ConveyorBelt() {
  const { items } = useCart()
  if (items.length === 0) {
    return (
      <p className="pointer-events-none absolute inset-x-0 top-[56%] text-center font-display text-base text-white/80 sm:text-lg">
        작품을 클릭해 담으면 이 벨트 위로 올라옵니다.
      </p>
    )
  }

  // 끊기지 않고 흐르도록 같은 줄을 두 번 이어 붙입니다.
  const lane = [...items, ...items]

  return (
    <div className="pointer-events-none absolute inset-x-0 top-[45%] h-[29%] overflow-hidden">
      <div
        className="flex h-full w-max items-center gap-[2vw] will-change-transform"
        style={{ animation: `belt-flow ${Math.max(14, items.length * 5)}s linear infinite` }}
      >
        {lane.map((item, i) => (
          <figure
            key={`${item.id}-${i}`}
            className="flex h-full w-[clamp(84px,9vw,140px)] flex-col items-center justify-center"
          >
            <div className="flex h-[70%] w-full items-center justify-center overflow-hidden rounded-md bg-white p-1 shadow-[0_10px_18px_-8px_rgba(0,0,0,0.85)]">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className={`h-full w-full ${item.imageTop ? "object-cover object-top" : "object-contain"}`}
                />
              ) : (
                <span className="px-1 text-center font-display text-xs text-mart-ink">{item.title}</span>
              )}
            </div>
            <figcaption className="mt-1 w-full truncate rounded bg-mart-cream-soft/95 px-1 py-0.5 text-center font-display text-[11px] text-mart-ink sm:text-xs">
              {item.title}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}

// 계산대 — ① 계산대 전체 장면으로 다가가고, ② 벨트 앞에 도착해 담은 작업을 올립니다.
function CheckoutZone() {
  const { ref, p } = useSectionProgress<HTMLDivElement>()
  const [dim, setDim] = useState(0)

  // ① 계산대까지 걸어가는 구간 → ② 벨트 장면으로 전환
  const approach = clamp(p / 0.34, 0, 1)
  const toBelt = clamp((p - 0.42) / 0.16, 0, 1)
  const beltIn = clamp((p - 0.5) / 0.3, 0, 1)

  return (
    <section id="checkout" aria-label="계산대" className="relative w-full bg-mart-cream">
      <div className="relative w-full">
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-mart-cream">
          {/* ① 계산대 전체 장면 — 캐릭터가 계산대로 걸어갑니다. */}
          <div className="absolute inset-0" style={{ opacity: 1 - toBelt }}>
            <img
              src="/mart/checkout-scene.png"
              alt="형서마트 계산대 전경"
              className="absolute inset-0 h-full w-full object-cover will-change-transform"
              style={{ transform: `scale(${1.02 + approach * 0.06})` }}
            />
            <div
              className="pointer-events-none absolute bottom-[4vh] left-1/2 w-[min(26vw,180px)] will-change-transform"
              style={{ transform: `translate(-50%, ${(1 - approach) * 36}vh)` }}
            >
              <img
                src="/cart-character.png"
                alt="계산대로 다가가는 형서 캐릭터"
                className={`block h-auto w-full ${HOP} drop-shadow-[0_18px_20px_rgba(74,107,134,0.3)]`}
              />
            </div>
          </div>

          {/* ② 벨트 장면 — 담은 작업이 계산대 벨트 위를 지나갑니다. */}
          <div className="absolute inset-0 flex flex-col justify-end" style={{ opacity: toBelt }}>
            <img
              src="/mart/checkout-scene.png"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover opacity-35 blur-[3px]"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-mart-cream/55" />
            {/* 좁은 화면에서는 벨트가 띠처럼 얇아지지 않도록 가로로 넓게 잡고 가운데를 보여줍니다. */}
            <div
              className="relative w-full origin-bottom will-change-transform max-sm:w-[240%] max-sm:self-center"
              style={{ transform: `translateY(${(1 - beltIn) * 14}%) scale(${1.02 + beltIn * 0.16})` }}
            >
              <div className="relative">
                <img
                  src="/mart/checkout-counter.png"
                  alt="검은 컨베이어 벨트가 놓인 마트 계산대"
                  className="block h-auto w-full"
                />
                {/* 담은 작업은 벨트 안쪽에만 올라가 계산대를 가리지 않습니다. */}
                <ConveyorBelt />
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 top-[5vh] z-20 text-center">
            <span className="inline-block rounded-full border border-mart-blue-deep/50 bg-mart-cream-soft/90 px-6 py-1.5 font-display text-xl tracking-wide text-mart-ink sm:text-2xl">
              CHECKOUT
            </span>
          </div>

          {/* 계산이 끝나면 계산대 화면이 천천히 어두워지고, 그 위로 영수증이 출력됩니다. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-30 bg-black/40 backdrop-blur-[3px]"
            style={{ opacity: dim }}
          />
        </div>

        <div className="relative z-10 -mt-[100vh]">
          <div ref={ref} className="h-[330vh]" />
          <ReceiptPrintStage onDim={setDim} />
        </div>
      </div>
    </section>
  )
}

export function MartSections() {
  return (
    <>
      {CATEGORIES.map((category, index) => (
        <Fragment key={category.anchor}>
          {index > 0 && <Passage />}
          <CornerZone category={category} />
        </Fragment>
      ))}
      <Passage />
      <CheckoutZone />
    </>
  )
}
