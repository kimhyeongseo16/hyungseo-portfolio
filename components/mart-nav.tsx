"use client"

// 화면 오른쪽에 조용히 붙는 작은 코너 안내 — 지금 있는 코너를 알려주고, 누르면 그 코너로 이동합니다.

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

  return (
    <nav
      aria-label="코너 바로가기"
      // 얇은 세로 목차 — 작품 영역(오른쪽 --nav-space)만 차지하고 카드 위로 넘어오지 않습니다.
      className="fixed right-0 top-1/2 z-40 w-4 -translate-y-1/2 sm:w-[8.25rem]"
    >
      <ul className="flex flex-col gap-2.5 border-l border-mart-ink/15 bg-mart-cream/55 py-3 pl-[4px] pr-[4px] backdrop-blur-[2px] sm:pl-2.5 sm:pr-4">
        {STOPS.map((stop) => {
          const on = active === stop.anchor
          return (
            <li key={stop.anchor}>
              <button
                type="button"
                onClick={() => go(stop.anchor)}
                aria-current={on ? "true" : undefined}
                aria-label={`${stop.label} 코너로 이동`}
                className="group flex w-full items-center justify-start gap-2 text-left"
              >
                <span
                  aria-hidden="true"
                  className={`block h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${
                    on ? "bg-mart-blue-deep" : "bg-mart-ink/30 group-hover:bg-mart-ink/55"
                  }`}
                />
                <span
                  className={`hidden font-display text-xs leading-none tracking-[0.06em] transition-colors sm:inline ${
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
