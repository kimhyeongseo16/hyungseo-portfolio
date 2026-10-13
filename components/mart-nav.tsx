"use client"

// 코너 안내 — 데스크톱은 화면 오른쪽 세로 목차, 모바일은 화면 위 가로 목차입니다.
// 지금 있는 코너를 알려주고, 누르면 그 코너로 이동합니다.

import { useCallback, useEffect, useRef, useState } from "react"
import { CATEGORIES } from "@/lib/portfolio"

const STOPS: { anchor: string; label: string }[] = [
  ...CATEGORIES.map((c) => ({ anchor: c.anchor, label: c.navLabel })),
  { anchor: "checkout", label: "CHECKOUT" },
]

const SCROLL_MS = 480

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

export function MartNav() {
  const [active, setActive] = useState(STOPS[0].anchor)
  // 이동 중에는 현재 위치 계산을 멈춰 화면이 흔들리지 않게 합니다.
  const movingRef = useRef(false)
  const animRef = useRef(0)
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    let raf = 0
    const update = () => {
      if (movingRef.current) return
      const middle = window.innerHeight / 2
      let nearest = STOPS[0].anchor
      let best = Number.POSITIVE_INFINITY
      for (const stop of STOPS) {
        const el = document.getElementById(stop.anchor)
        if (!el) continue
        const box = el.getBoundingClientRect()
        const distance = box.top > middle ? box.top - middle : box.bottom < middle ? middle - box.bottom : 0
        if (distance < best) {
          best = distance
          nearest = stop.anchor
        }
      }
      setActive(nearest)
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

  // 짧고 한 번만 실행되는 부드러운 이동 (연타해도 겹치지 않습니다)
  const go = useCallback((anchor: string) => {
    const el = document.getElementById(anchor)
    if (!el) return
    cancelAnimationFrame(animRef.current)
    const start = window.scrollY
    const target = Math.max(0, Math.min(start + el.getBoundingClientRect().top, document.body.scrollHeight - window.innerHeight))
    const startedAt = performance.now()
    movingRef.current = true
    setActive(anchor)
    const step = (now: number) => {
      const t = Math.min((now - startedAt) / SCROLL_MS, 1)
      window.scrollTo(0, start + (target - start) * easeOutCubic(t))
      if (t < 1) {
        animRef.current = requestAnimationFrame(step)
      } else {
        movingRef.current = false
      }
    }
    animRef.current = requestAnimationFrame(step)
  }, [])

  useEffect(() => () => cancelAnimationFrame(animRef.current), [])

  // 모바일 가로 목차에서는 지금 코너 항목이 화면 안에 보이도록 옆으로 밀어 줍니다.
  useEffect(() => {
    const list = listRef.current
    if (!list || list.scrollWidth <= list.clientWidth) return
    const item = list.querySelector<HTMLElement>(`[data-anchor="${active}"]`)
    if (!item) return
    list.scrollTo({ left: item.offsetLeft - (list.clientWidth - item.offsetWidth) / 2, behavior: "smooth" })
  }, [active])

  return (
    <nav
      aria-label="코너 바로가기"
      // 데스크톱: 얇은 세로 목차 — 작품 영역(오른쪽 --nav-space)만 차지하고 카드 위로 넘어오지 않습니다.
      // 모바일: 화면 위에 붙는 가로 목차 — 넘치는 항목은 손가락으로 옆으로 밀어 봅니다.
      className="fixed inset-x-0 top-0 z-40 sm:inset-x-auto sm:right-0 sm:top-1/2 sm:w-[8.25rem] sm:-translate-y-1/2"
    >
      <ul
        ref={listRef}
        className="mart-nav-scroll flex overflow-x-auto border-b border-mart-ink/15 bg-mart-cream/95 px-1.5 pt-[env(safe-area-inset-top)] sm:flex-col sm:overflow-visible sm:border-b-0 sm:border-l sm:bg-mart-cream/55 sm:px-0 sm:py-[7px] sm:backdrop-blur-[2px]"
      >
        {STOPS.map((stop) => {
          const on = active === stop.anchor
          return (
            <li key={stop.anchor} className="shrink-0">
              {/* 글자 둘레의 줄 전체가 버튼이라 넓게 눌러도 이동합니다. */}
              <button
                type="button"
                data-anchor={stop.anchor}
                onClick={() => go(stop.anchor)}
                aria-current={on ? "true" : undefined}
                aria-label={`${stop.label} 코너로 이동`}
                className="group flex items-center justify-start gap-1.5 whitespace-nowrap px-2.5 py-3 text-left sm:w-full sm:gap-2 sm:py-[5px] sm:pl-2.5 sm:pr-4"
              >
                <span
                  aria-hidden="true"
                  className={`block h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${
                    on ? "bg-mart-blue-deep" : "bg-mart-ink/30 group-hover:bg-mart-ink/55"
                  }`}
                />
                <span
                  className={`font-display text-xs leading-none tracking-[0.06em] transition-colors ${
                    on ? "text-mart-blue-deep" : "text-mart-ink/60 group-hover:text-mart-ink"
                  }`}
                >
                  {stop.label}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
