"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ShoppingChecklist } from "./shopping-checklist"
import { MartSections } from "./mart-sections"
import { MartNav } from "./mart-nav"
import { CartDock, CartProvider, type CartItem } from "./shopping-cart"
import { CATEGORIES } from "@/lib/portfolio"

// easing for a smooth "walking toward the door" feel
function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v))
}

// 크게 진열된 대표 프로젝트는 처음부터 장바구니에 한 번 담겨 있습니다.
const FEATURED_IN_CART: CartItem[] = CATEGORIES.flatMap((c) =>
  c.works
    .filter((w) => w.featured)
    .map((w) => ({ id: w.id, title: w.title, category: c.label, image: w.image, imageTop: w.thumbTop }))
)

// 인트로를 누르면 매장 안으로 들어가는 짧은 전환 시간(ms)
const ENTER_MS = 800

export function MartIntro() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const [started, setStarted] = useState(false)
  // 쇼핑을 시작하면 패널이 옆으로 빠지고, 다시 인트로로 올라오면 돌아옵니다.
  const [leaving, setLeaving] = useState(false)
  const [introOnScreen, setIntroOnScreen] = useState(true)
  const enteringRef = useRef(false)
  // 인트로 상태가 바뀔 때 매장 전체가 다시 그려지지 않도록 한 번만 만듭니다.
  const store = useMemo(() => <MartSections />, [])
  const dock = useMemo(() => <CartDock />, [])
  const nav = useMemo(() => <MartNav />, [])

  // 화면을 누르면 마트 문 쪽으로 살짝 다가가면서 매장 첫 장면으로 짧게 미끄러져 내려갑니다.
  const handleStart = () => {
    if (enteringRef.current) return
    enteringRef.current = true
    setStarted(true)
    setLeaving(true)
    setZoomed(true)
    requestAnimationFrame(() => {
      const el = scrollRef.current
      if (!el) {
        enteringRef.current = false
        return
      }
      const from = window.scrollY
      const to = el.offsetTop + el.offsetHeight
      const t0 = performance.now()
      const step = (now: number) => {
        const t = clamp((now - t0) / ENTER_MS, 0, 1)
        window.scrollTo({ top: from + (to - from) * easeInOutCubic(t), behavior: "instant" })
        if (t < 1) requestAnimationFrame(step)
        else enteringRef.current = false
      }
      requestAnimationFrame(step)
    })
  }

  const onIntroClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 쇼핑 리스트 체크 버튼은 그대로 체크만 됩니다.
    if ((e.target as HTMLElement).closest("button, a, input, label")) return
    handleStart()
  }

  useEffect(() => {
    const raf = requestAnimationFrame(() => setShown(1))
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    let raf = 0
    const update = () => {
      const el = scrollRef.current
      if (!el) return
      const box = el.getBoundingClientRect()
      setIntroOnScreen(box.bottom > window.innerHeight * 0.5)
      if (!enteringRef.current && box.top > -box.height * 0.1) {
        setLeaving(false)
        setZoomed(false)
      }
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  // 마트 앞으로 살짝 다가가는 정도만 — 큰 확대 없이 배경을 안정적으로 둡니다.
  const scale = zoomed ? 1.18 : 1
  const translateY = zoomed ? -2 : 0

  return (
    <CartProvider initialItems={FEATURED_IN_CART}>
      <div
        id="home"
        ref={scrollRef}
        onClick={onIntroClick}
        className="relative h-screen w-full cursor-pointer overflow-hidden bg-mart-sky"
      >
        <img
          src="/mart-intro.png"
          alt="형서마트 외관 - 파란 차양과 유리문이 있는 아기자기한 마트 건물"
          className="absolute inset-0 h-full w-full object-cover will-change-transform"
          style={{
            transformOrigin: "50% 60%",
            transform: `translateY(${translateY}%) scale(${scale})`,
            transition: `transform ${ENTER_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`,
          }}
        />

        <ShoppingChecklist progress={shown} leaving={leaving} onStart={handleStart} />
      </div>

      {started && (
        <>
          {store}
          {/* 매장에 들어온 뒤에만 장바구니와 코너 안내가 따라다닙니다. */}
          {dock}
          {/* 코너 안내는 인트로를 벗어난 뒤에만 보입니다. */}
          <div
            aria-hidden={introOnScreen}
            className="transition-opacity duration-300"
            style={{ opacity: introOnScreen ? 0 : 1, visibility: introOnScreen ? "hidden" : "visible" }}
          >
            {nav}
          </div>
        </>
      )}
    </CartProvider>
  )
}
