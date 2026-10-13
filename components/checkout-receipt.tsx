"use client"

import { useEffect, useRef, useState } from "react"

// 스킬 아이콘 시트 — 원본 이미지를 그대로 쓰고, 아이콘 영역만 같은 크기의 창으로 보여줍니다.
type SkillSheet = { src: string; width: number }
const SHEET_MAIN: SkillSheet = { src: "/checkout/skills-sheet.png", width: 660 }
const SHEET_EXTRA: SkillSheet = { src: "/checkout/skills-sheet-extra.png", width: 660 }

// 아이콘이 원본 시트에서 차지하는 영역(px) — 이 영역의 긴 변을 기준으로 모두 같은 크기로 보여줍니다.
type Skill = { name: string; sheet: SkillSheet; box: [x0: number, y0: number, x1: number, y1: number] }
type SkillGroup = { label: string; skills: Skill[] }

// 중요도 순서: 디자인 → 영상/콘텐츠 → 웹 → 기타
const SKILL_GROUPS: SkillGroup[] = [
  {
    label: "DESIGN",
    skills: [
      { name: "Photoshop", sheet: SHEET_MAIN, box: [266, 268, 393, 391] },
      { name: "Illustrator", sheet: SHEET_MAIN, box: [46, 498, 173, 621] },
      { name: "Figma", sheet: SHEET_MAIN, box: [500, 266, 599, 393] },
    ],
  },
  {
    label: "VIDEO · CONTENT",
    skills: [
      { name: "Premiere Pro", sheet: SHEET_MAIN, box: [266, 498, 393, 621] },
      { name: "After Effects", sheet: SHEET_MAIN, box: [46, 268, 173, 391] },
      { name: "Clip Studio", sheet: SHEET_MAIN, box: [487, 496, 612, 623] },
    ],
  },
  {
    label: "WEB",
    skills: [
      { name: "HTML", sheet: SHEET_MAIN, box: [76, 36, 152, 144] },
      { name: "CSS", sheet: SHEET_MAIN, box: [284, 36, 374, 163] },
      { name: "jQuery", sheet: SHEET_EXTRA, box: [489, 37, 610, 163] },
    ],
  },
  {
    label: "ETC",
    skills: [
      { name: "Maya", sheet: SHEET_EXTRA, box: [266, 42, 393, 157] },
      { name: "Notion", sheet: SHEET_MAIN, box: [489, 36, 610, 163] },
      { name: "GitHub", sheet: SHEET_EXTRA, box: [46, 38, 173, 161] },
    ],
  },
]

const WHAT_I_DO = ["WEB DESIGN", "UI · UX DESIGN", "GRAPHIC DESIGN", "CONTENT DESIGN", "VIDEO EDITING", "AI CONTENT"]

// 바코드 막대 굵기(px) — 홀수 번째는 막대, 짝수 번째는 빈칸
const BARCODE = [2, 1, 1, 2, 3, 1, 1, 1, 2, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 1, 2, 2, 1, 1, 3, 1, 2, 1, 1, 2, 2, 3, 1, 1, 2, 1, 1, 2, 3, 1, 1, 2, 1, 2, 2, 1, 3, 1, 1, 2]

// 출력기 원본(2097×750)에서 종이가 나오는 슬롯 바로 아래 위치
const PRINTER_W = 2097
const SLOT_Y = 390

const PAPER = "#fdf8ec"
const INK = "#33536f"

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v))
}

function SkillIcon({ skill }: { skill: Skill }) {
  const { sheet } = skill
  const [x0, y0, x1, y1] = skill.box
  const size = Math.max(x1 - x0, y1 - y0) * 1.04
  const left = (x0 + x1) / 2 - size / 2
  const top = (y0 + y1) / 2 - size / 2
  return (
    <li className="flex min-w-0 flex-col items-center gap-0.5 text-center">
      <span className="block w-full max-w-[44px] rounded-lg bg-white p-1 shadow-[0_2px_6px_-2px_rgba(51,83,111,0.18)] sm:max-w-[58px] sm:p-2">
        <span className="relative block aspect-square w-full overflow-hidden">
          <img
            src={sheet.src}
            alt={skill.name}
            className="absolute max-w-none"
            style={{
              width: `${(sheet.width / size) * 100}%`,
              left: `${(-left / size) * 100}%`,
              top: `${(-top / size) * 100}%`,
            }}
          />
        </span>
      </span>
      <span className="break-keep font-sans text-[9px] font-medium leading-tight tracking-tight sm:text-[11px] sm:tracking-normal">{skill.name}</span>
    </li>
  )
}

function Divider() {
  return (
    <div className="my-8 flex items-center gap-3" aria-hidden="true">
      <span className="h-0 flex-1 border-t-2 border-dashed border-mart-blue/35" />
      <span className="text-xs text-mart-pink">♥</span>
      <span className="h-0 flex-1 border-t-2 border-dashed border-mart-blue/35" />
    </div>
  )
}

function SectionTitle({ children, className = "" }: { children: string; className?: string }) {
  return (
    <p className={`flex items-center gap-2 font-display text-base tracking-[0.28em] text-mart-blue-deep sm:text-xl ${className}`}>
      <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-mart-pink" />
      {children}
    </p>
  )
}

function Receipt() {
  return (
    <div
      className="px-6 pb-14 pt-10 sm:px-14 sm:pb-16 sm:pt-12"
      style={{
        color: INK,
        backgroundColor: PAPER,
        backgroundImage: "repeating-linear-gradient(0deg, rgba(91,149,207,0.035) 0 1px, transparent 1px 5px)",
        clipPath:
          "polygon(0 0, 100% 0, 100% calc(100% - 10px), 97.5% 100%, 95% calc(100% - 10px), 92.5% 100%, 90% calc(100% - 10px), 87.5% 100%, 85% calc(100% - 10px), 82.5% 100%, 80% calc(100% - 10px), 77.5% 100%, 75% calc(100% - 10px), 72.5% 100%, 70% calc(100% - 10px), 67.5% 100%, 65% calc(100% - 10px), 62.5% 100%, 60% calc(100% - 10px), 57.5% 100%, 55% calc(100% - 10px), 52.5% 100%, 50% calc(100% - 10px), 47.5% 100%, 45% calc(100% - 10px), 42.5% 100%, 40% calc(100% - 10px), 37.5% 100%, 35% calc(100% - 10px), 32.5% 100%, 30% calc(100% - 10px), 27.5% 100%, 25% calc(100% - 10px), 22.5% 100%, 20% calc(100% - 10px), 17.5% 100%, 15% calc(100% - 10px), 12.5% 100%, 10% calc(100% - 10px), 7.5% 100%, 5% calc(100% - 10px), 2.5% 100%, 0 100%)",
      }}
    >
      {/* PROFILE */}
      <SectionTitle>PROFILE</SectionTitle>
      <div className="mt-4 flex items-center justify-center gap-3 sm:gap-8">
        <img src="/checkout/profile-character-wave.png" alt="김형서 캐릭터" className="block h-auto w-[88px] shrink-0 sm:w-44" />
        <div className="min-w-0">
          <p className="whitespace-nowrap font-display text-[1.05rem] leading-tight sm:text-[2.1rem] sm:tracking-wide">KIM HYEONG SEO</p>
          <dl className="mt-2.5 space-y-2 sm:mt-4 sm:space-y-3">
            <div>
              <dt className="font-display text-[10px] tracking-[0.25em] opacity-60 sm:text-xs">EMAIL</dt>
              <dd className="break-all font-sans text-sm font-medium sm:text-lg">
                <a href="mailto:gudtj1991@naver.com" className="underline-offset-4 hover:underline">
                  gudtj1991@naver.com
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-display text-[10px] tracking-[0.25em] opacity-60 sm:text-xs">PHONE</dt>
              <dd className="font-sans text-sm font-medium sm:text-lg">010.2470.9536</dd>
            </div>
            <div>
              <dt className="font-display text-[10px] tracking-[0.25em] opacity-60 sm:text-xs">EDUCATION</dt>
              <dd className="break-keep font-sans text-sm leading-snug sm:text-lg">
                <span className="block font-medium">대구대학교</span>
                <span className="block">영상·애니메이션·디자인 전공</span>
                <span className="block opacity-75">졸업</span>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <Divider />

      {/* SKILLS */}
      <SectionTitle className="max-sm:tracking-[0.22em]">SKILLS</SectionTitle>
      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-5 max-sm:-mx-3 sm:gap-x-10 sm:gap-y-6">
        {SKILL_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="mb-2 whitespace-nowrap font-display text-[11px] tracking-[0.12em] opacity-55 sm:text-xs sm:tracking-[0.16em]">{group.label}</p>
            <ul className="grid grid-cols-3 gap-x-1 sm:gap-x-3">
              {group.skills.map((skill) => (
                <SkillIcon key={skill.name} skill={skill} />
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Divider />

      {/* WHAT I DO */}
      <SectionTitle>WHAT I DO</SectionTitle>
      <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3.5 sm:gap-x-8">
        {WHAT_I_DO.map((item) => (
          <li key={item} className="flex items-center gap-1.5 sm:gap-2.5">
            <span
              aria-hidden="true"
              className="grid h-4 w-4 shrink-0 place-items-center rounded-md bg-mart-blue-deep text-[10px] leading-none text-white sm:h-5 sm:w-5 sm:text-[11px]"
            >
              ✓
            </span>
            <span className="whitespace-nowrap font-display text-[13px] leading-snug sm:text-xl sm:tracking-wide">{item}</span>
          </li>
        ))}
      </ul>

      <Divider />

      {/* FINAL MESSAGE */}
      <div className="text-center">
        <p className="break-keep font-display text-[1.3rem] leading-snug sm:text-[2.4rem]">
          <span className="bg-[linear-gradient(transparent_62%,rgba(247,205,216,0.75)_62%)] px-1">디자인으로 시선을 끌고,</span>
          <br />
          <span className="bg-[linear-gradient(transparent_62%,rgba(247,205,216,0.75)_62%)] px-1">콘텐츠로 마음을 움직입니다.</span>
        </p>
        <p className="mt-8 font-display text-xl tracking-[0.35em] text-mart-blue-deep">
          THANK YOU <span className="tracking-normal text-[#f2a7bb]">♡</span>
        </p>
        <div aria-hidden="true" className="mx-auto mt-5 flex h-12 w-max items-stretch">
          {BARCODE.map((w, i) => (
            <span key={i} style={{ width: `${w + 0.5}px`, backgroundColor: i % 2 === 0 ? INK : "transparent" }} />
          ))}
        </div>
      </div>
    </div>
  )
}

// 계산대 화면 위에서 출력기가 나타나고, 슬롯에서 영수증이 위 → 아래로 출력됩니다.
export function ReceiptPrintStage({ onDim }: { onDim: (dim: number) => void }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const paperRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState({ hold: 0, printerTop: 0, printerIn: 0, revealed: 0, paperH: 0 })

  useEffect(() => {
    let raf = 0
    const update = () => {
      const wrap = wrapRef.current
      const paper = paperRef.current
      if (!wrap || !paper) return
      const vh = window.innerHeight
      const s = -wrap.getBoundingClientRect().top
      const paperH = paper.offsetHeight
      // 출력기가 화면에 머무는 동안(hold) 종이가 화면 아래 끝까지 출력됩니다.
      const printerTop = vh * 0.16
      const slotTop = printerTop + paper.offsetTop
      const firstRun = Math.max(vh - slotTop - 24, 0)
      const printStart = vh * 0.85
      const hold = printStart + firstRun
      const dim = clamp(s / (vh * 0.5), 0, 1)
      const printerIn = clamp((s - vh * 0.3) / (vh * 0.4), 0, 1)
      const revealed = clamp(s - printStart, 0, paperH)
      setState({ hold, printerTop, printerIn, revealed, paperH })
      onDim(dim)
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    update()
    const ro = new ResizeObserver(onScroll)
    if (paperRef.current) ro.observe(paperRef.current)
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [onDim])

  const { hold, printerTop, printerIn, revealed, paperH } = state

  return (
    <div
      ref={wrapRef}
      className="relative w-full overflow-x-clip"
      style={{ paddingBottom: `calc(30vh - ${printerTop}px)` }}
    >
      <div style={{ height: printerTop }} />
      <div
        className="sticky mx-auto w-[min(100vw,1100px)] max-sm:w-[128vw] max-sm:ml-[-14vw] will-change-transform"
        style={{ top: printerTop, transform: `translateY(${(1 - printerIn) * 28}px)`, opacity: printerIn }}
      >
        <img src="/checkout/printer.png" alt="영수증 출력기" className="relative block h-auto w-full" />
        <div
          ref={paperRef}
          className="relative z-10 mx-auto w-[64%]"
          style={{
            marginTop: `${(-(750 - SLOT_Y) / PRINTER_W) * 100}%`,
            clipPath: `inset(0 -40px ${Math.max(paperH - revealed, 0)}px -40px)`,
          }}
        >
          <div className="drop-shadow-[0_8px_14px_rgba(20,30,40,0.16)]">
            <Receipt />
          </div>
        </div>
      </div>
      <div style={{ height: hold }} />
    </div>
  )
}
