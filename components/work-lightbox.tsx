"use client"

import { useEffect, useState } from "react"
import type { ProcessGroup, Work } from "@/lib/portfolio"

// 상세 화면의 케이스 스터디 — PROJECT OVERVIEW / GOAL / MY ROLE ...
function ProjectDetails({
  work,
  withTools = false,
  clampFirst = false,
}: {
  work: Work
  withTools?: boolean
  // 모바일에서 첫 문단을 몇 줄만 먼저 보여주고, 나머지는 펼쳐서 읽습니다.
  clampFirst?: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  if (!work.details || work.details.length === 0) return null
  return (
    <dl className="space-y-5">
      {work.details.map((item, i) => (
        <div key={item.label} className={i > 0 ? "border-t border-dashed border-mart-blue/30 pt-5" : ""}>
          <dt className="font-display text-sm tracking-widest text-mart-blue-deep">{item.label}</dt>
          <dd
            className={`mt-2 whitespace-pre-line break-keep font-sans leading-[1.8] text-mart-ink/85 ${
              i === 0 ? "text-base sm:text-[17px]" : "text-[15px]"
            } ${i === 0 && clampFirst && !expanded ? "max-sm:line-clamp-5" : ""}`}
          >
            {item.text}
          </dd>
          {i === 0 && clampFirst && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-1 font-display text-sm tracking-wide text-mart-blue-deep underline underline-offset-4 sm:hidden"
            >
              {expanded ? "접기 ↑" : "더 읽기 ↓"}
            </button>
          )}
        </div>
      ))}
      {withTools && work.tools && work.tools.length > 0 && !work.details.some((d) => d.label === "TOOLS") && (
        <div className="border-t border-dashed border-mart-blue/30 pt-5">
          <dt className="font-display text-sm tracking-widest text-mart-blue-deep">TOOLS</dt>
          <dd className="mt-2 font-sans text-[15px] leading-[1.8] text-mart-ink/85">{work.tools.join(" · ")}</dd>
        </div>
      )}
    </dl>
  )
}

// 상세 링크가 없는 작품은 사이트 안에서 원본 이미지를 크게 봅니다.
export function hasProjectLink(work: Work): boolean {
  return Boolean(work.link && work.link !== "#")
}

const LINK_BASE =
  "inline-flex min-h-[52px] flex-col justify-center rounded-2xl px-5 py-2 transition-opacity hover:opacity-85"
const PRIMARY_LINK = `${LINK_BASE} bg-mart-blue-deep text-white`
const LIGHT_LINK = `${LINK_BASE} border border-mart-blue-deep/40 bg-white text-mart-ink`
const SECONDARY_LINK =
  "inline-flex min-h-[44px] items-center rounded-full border border-mart-ink/25 bg-white/80 px-5 font-display text-base text-mart-ink/80 transition-colors hover:bg-white"

// 분류나 태그에 TEAM PROJECT가 이미 적혀 있으면 작은 태그를 겹쳐 붙이지 않습니다.
export function showTeamTag(work: Work): boolean {
  return Boolean(work.team) && !work.tag?.includes("TEAM PROJECT") && !work.info?.includes("TEAM PROJECT")
}

export function TeamTag() {
  return (
    <span className="rounded-full border border-mart-blue-deep/40 bg-white/70 px-2.5 py-0.5 font-display text-xs tracking-widest text-mart-blue-deep">
      TEAM PROJECT
    </span>
  )
}

function LinkLabel({ label }: { label: string }) {
  return <span className="font-display text-lg leading-tight tracking-wide">{label} ↗</span>
}

function CloseButton({ onClose, dark = false }: { onClose: () => void; dark?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="닫기"
      className={`shrink-0 rounded-full border px-4 py-2 font-display text-base transition-colors ${
        dark
          ? "border-white/30 bg-mart-ink/70 text-white/90 hover:bg-mart-ink"
          : "border-mart-ink/20 text-mart-ink/70 hover:bg-mart-cream"
      }`}
    >
      닫기 ✕
    </button>
  )
}

// 완성 작품 뷰어 — 페이지 전체(page) 또는 작품 이미지(image)만 가운데에 크게 보여줍니다.
function FocusViewer({ work, onClose }: { work: Work; onClose: () => void }) {
  const page = work.view === "page"
  const source = page ? work.fullImage ?? work.image : work.image

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${work.title} 작품 보기`}
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-mart-ink/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <p className="truncate rounded-full bg-mart-ink/70 px-4 py-1.5 font-display text-base text-white/85">
          {work.title}
        </p>
        <CloseButton onClose={onClose} dark />
      </div>

      <div className="flex flex-col">
      {work.details && work.details.length > 0 && (
        <div className={`flex justify-center px-3 pb-6 sm:px-6 ${page ? "" : "max-sm:order-2"}`}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[min(94vw,900px)] rounded-3xl bg-mart-cream-soft px-5 py-5 sm:px-8 sm:py-7"
          >
            {work.tag && (
              <p className="mb-4 font-display text-sm tracking-widest text-mart-blue-deep sm:mb-5">{work.tag}</p>
            )}
            <ProjectDetails work={work} withTools clampFirst={page} />
          </div>
        </div>
      )}

      <div
        className={`flex justify-center px-3 pb-10 sm:px-6 ${
          page ? "" : "min-h-[calc(100%-4rem)] items-center max-sm:order-1 max-sm:min-h-0 max-sm:pb-4"
        }`}
      >
        {source &&
          (page ? (
            <img
              src={source}
              alt={work.alt ?? work.title}
              onClick={(e) => e.stopPropagation()}
              className="block h-auto w-auto max-w-[min(94vw,1100px)] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)]"
            />
          ) : (
            <ImageFrame key={source} src={source} alt={work.alt ?? work.title} />
          ))}
      </div>
      </div>
    </div>
  )
}

// 작품 이미지 뷰어 — 모든 작품이 같은 크기의 보기 영역에 원본 비율 그대로 담깁니다.
// 아주 긴 이미지는 작게 줄이지 않고 폭에 맞춘 뒤 영역 안에서 세로로 스크롤합니다.
function ImageFrame({ src, alt }: { src: string; alt: string }) {
  const [tall, setTall] = useState(false)

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`h-[min(84vh,900px)] w-[min(90vw,900px)] rounded-3xl bg-white/[0.06] p-3 max-sm:h-auto sm:p-5 ${
        tall ? "overflow-y-auto overscroll-contain" : ""
      }`}
    >
      <img
        src={src}
        alt={alt}
        onLoad={(e) => setTall(e.currentTarget.naturalHeight > e.currentTarget.naturalWidth * 1.6)}
        className={tall ? "block h-auto w-full" : "block h-full w-full object-contain max-sm:h-auto"}
      />
    </div>
  )
}

// AI 작업 과정 — 레퍼런스 묶음 → 만든 에셋 묶음 → 최종 적용(가장 크게)
// 한 줄 안의 이미지는 원본 비율만큼 폭을 나눠 높이를 맞추고, 자르지 않습니다.
function ProcessGroups({ groups, centered = false }: { groups: ProcessGroup[]; centered?: boolean }) {
  return (
    <ol>
      {groups.map((group, i) => {
        const final = group.layout === "final"
        // 레퍼런스·에셋은 한 줄 높이를 제한해 최종 적용보다 작게 보이도록 합니다.
        const defaultHeight = group.layout === "collage" ? 340 : 300
        const maxWidth = group.layout === "collage" ? 760 : 880
        return (
          <li key={group.label}>
            {i > 0 && (
              <p aria-hidden="true" className="py-5 text-center font-display text-2xl leading-none text-mart-blue-deep/45">
                ↓
              </p>
            )}
            <section
              className={
                final
                  ? "rounded-[28px] bg-mart-blue-deep/[0.08] p-4 sm:p-6"
                  : "border-t border-dashed border-mart-blue/40 pt-6"
              }
            >
              <h3 className={`flex items-baseline gap-3 font-display text-mart-ink ${centered ? "justify-center" : ""}`}>
                <span className="text-lg text-mart-ink/35">{String(i + 1).padStart(2, "0")}</span>
                <span className={`tracking-wide ${final ? "text-2xl sm:text-3xl" : "text-xl"}`}>{group.label}</span>
              </h3>
              <div className="mt-4 space-y-3">
                {group.rows.map((row, r) => {
                  const sum = row.reduce((acc, img) => acc + img.ratio, 0)
                  const rowHeight = group.rowHeights?.[r]
                  const width = final
                    ? rowHeight
                      ? `min(100%, ${Math.round(rowHeight * sum)}px)`
                      : sum < 1
                        ? "min(100%, 760px)"
                        : "100%"
                    : `min(100%, ${Math.round(Math.min(maxWidth, (rowHeight ?? defaultHeight) * sum))}px)`
                  return (
                    <div key={row[0].src} className={`flex gap-3 ${final || centered ? "mx-auto" : ""}`} style={{ width }}>
                      {row.map((img) => (
                        <img
                          key={img.src}
                          src={img.src}
                          alt={img.alt}
                          loading="lazy"
                          style={{ flex: `${img.ratio / sum} 1 0%` }}
                          className={`h-auto min-w-0 ${final ? "rounded-2xl shadow-[0_24px_48px_-28px_rgba(20,30,40,0.7)]" : "rounded-xl"}`}
                        />
                      ))}
                    </div>
                  )
                })}
              </div>
            </section>
          </li>
        )
      })}
    </ol>
  )
}

export function WorkLightbox({
  work,
  onClose,
  transparent = false,
  corner,
}: {
  work: Work
  onClose: () => void
  // 투명 배경 원본(로고 등)은 흰 판을 덧대지 않습니다.
  transparent?: boolean
  // 어떤 코너에서 꺼낸 작업인지
  corner?: string
}) {
  // 랜딩·상세처럼 세로로 긴 작업은 전체 이미지를 이어서 볼 수 있습니다.
  const [showFull, setShowFull] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  if (work.view) return <FocusViewer work={work} onClose={onClose} />

  // 세로로 긴 페이지 원본은 처음부터 페이지 전체를 이어서 보여줍니다.
  const tallPage = Boolean(work.thumbTop)
  const source = (showFull || tallPage) && work.fullImage ? work.fullImage : work.image
  const canToggle = Boolean(work.fullImage && work.fullImage !== work.image)
  const hasTools = Boolean(work.tools && work.tools.length > 0)
  const hasLinks = Boolean(
    work.originalUrl || work.siteUrl || work.prototypeUrl || hasProjectLink(work)
  )
  const hasDetails = Boolean(work.details && work.details.length > 0)
  const hasSide = hasTools || hasLinks || hasDetails
  const groups = work.processGroups ?? []

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${work.title} 작품 상세`}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-mart-ink/85 px-3 py-4 backdrop-blur-sm sm:px-6 sm:py-8"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-[min(94vw,1120px)] flex-col overflow-hidden rounded-3xl bg-mart-cream-soft shadow-[0_40px_80px_-24px_rgba(20,30,40,0.8)]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4 px-6 py-5 sm:px-8">
          <div className="min-w-0">
            {corner && (
              <p className="font-display text-sm tracking-[0.3em] text-mart-ink/45">{corner}</p>
            )}
            <h2 className="mt-1 font-display text-3xl leading-tight text-mart-ink sm:text-4xl">{work.title}</h2>
            {(work.tag || work.team) && (
              <p className="mt-1.5 flex flex-wrap items-center gap-2 font-display text-base tracking-wide text-mart-blue-deep">
                {work.tag}
                {showTeamTag(work) && <TeamTag />}
              </p>
            )}
            {work.info && work.info.length > 0 && (
              <ul className="mt-2.5 flex flex-wrap gap-2">
                {work.info.map((item) => (
                  <li
                    key={item}
                    className="rounded-xl border border-mart-blue-deep/35 bg-white/80 px-4 py-1.5 font-display text-base tracking-wide text-mart-ink"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <CloseButton onClose={onClose} />
        </header>

        {/* 본문 — 큰 이미지도 모달 안에서만 스크롤됩니다. */}
        <div
          className={`min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-7 sm:px-8 ${
            groups.length > 0 ? "max-sm:flex max-sm:flex-col" : ""
          }`}
        >
          {(groups.length === 0 || hasSide) && (
          <div
            className={`grid gap-8 ${groups.length > 0 ? "max-sm:order-2 max-sm:mt-8" : ""} ${
              hasSide && groups.length === 0
                ? tallPage
                  ? "lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]"
                  : "lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]"
                : ""
            }`}
          >
            {/* 큰 대표 이미지 — 원본 비율 그대로 */}
            {groups.length === 0 && (
            <div className="min-w-0">
              <div
                className={`flex justify-center rounded-2xl p-3 ${transparent ? "bg-white/60" : "bg-white"}`}
              >
                {source ? (
                  <img
                    src={source}
                    alt={work.alt ?? work.title}
                    className={
                      tallPage
                        ? "h-auto w-full"
                        : showFull
                          ? "h-auto w-full max-w-[760px] object-contain"
                          : "max-h-[58vh] w-auto max-w-full object-contain"
                    }
                  />
                ) : (
                  <p className="py-20 font-display text-xl text-mart-ink/40">{work.title}</p>
                )}
              </div>

              {canToggle && (
                <button
                  type="button"
                  onClick={() => setShowFull((v) => !v)}
                  className={`${SECONDARY_LINK} mt-4`}
                >
                  {showFull ? "미리보기로 돌아가기" : "전체 이미지 보기 ↓"}
                </button>
              )}
            </div>
            )}

            {hasSide && (
              <div className="min-w-0 space-y-6 lg:sticky lg:top-0 lg:self-start">
                {hasLinks && (
                  <div className="flex flex-wrap gap-3">
                    {work.siteUrl && (
                      <a href={work.siteUrl} target="_blank" rel="noreferrer" className={PRIMARY_LINK}>
                        <LinkLabel label="MY SITE" />
                      </a>
                    )}
                    {work.originalUrl && (
                      <a href={work.originalUrl} target="_blank" rel="noreferrer" className={LIGHT_LINK}>
                        <LinkLabel label="ORIGINAL SITE" />
                      </a>
                    )}
                    {work.prototypeUrl && (
                      <a href={work.prototypeUrl} target="_blank" rel="noreferrer" className={PRIMARY_LINK}>
                        <LinkLabel label="FIGMA" />
                      </a>
                    )}
                    {hasProjectLink(work) && (
                      <a href={work.link} target="_blank" rel="noreferrer" className={PRIMARY_LINK}>
                        <LinkLabel label="VIEW SITE" />
                      </a>
                    )}
                  </div>
                )}

                <ProjectDetails work={work} />

                {hasTools && (
                  <div className="flex flex-wrap items-center gap-2 border-t border-dashed border-mart-blue/40 pt-5">
                    <span className="font-display text-sm tracking-widest text-mart-blue-deep">사용 툴</span>
                    {work.tools?.map((tool) => (
                      <span
                        key={tool}
                        className="rounded-full bg-mart-blue/20 px-3 py-1 font-mono text-sm text-mart-ink/85"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          )}

          {groups.length > 0 && (
            <div className={`${hasSide ? "mt-8" : ""} max-sm:order-1 max-sm:mt-0`}>
              <ProcessGroups groups={groups} centered={work.processCentered} />
            </div>
          )}

          {/* 작업 과정 — AI 활용: 레퍼런스 → 생성 → 편집 → 최종 */}
          {work.process && work.process.length > 0 && (
            <div className="mt-9 border-t border-dashed border-mart-blue/40 pt-7">
              <p className="font-display text-sm tracking-[0.3em] text-mart-blue-deep">
                REFERENCE → AI GENERATION → EDITING → FINAL
              </p>
              <ol className="mt-5 grid gap-5 sm:grid-cols-2">
                {work.process.map((step, i) => (
                  <li key={step.image}>
                    <p className="font-display text-xl text-mart-ink">
                      <span className="mr-2 text-mart-ink/35">{String(i + 1).padStart(2, "0")}</span>
                      {step.stage}
                    </p>
                    <img
                      src={step.image}
                      alt={step.alt}
                      loading="lazy"
                      className="mt-2 h-auto w-full rounded-2xl bg-white object-contain"
                    />
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
