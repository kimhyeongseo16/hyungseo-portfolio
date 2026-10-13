"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ShoppingChecklist } from "./shopping-checklist"
import { MartSections } from "./mart-sections"
import { MartNav } from "./mart-nav"
import { CartDock, CartProvider, type CartItem } from "./shopping-cart"
import { CATEGORIES } from "@/lib/portfolio"
import { stageHeight } from "@/lib/stage-height"

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

export function MartIntro() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [started, setStarted] = useState(false)
  // 쇼핑을 시작하면 패널이 옆으로 빠지고, 다시 인트로로 올라오면 돌아옵니다.
  const [leaving, setLeaving] = useState(false)
  const [introOnScreen, setIntroOnScreen] = useState(true)
  const reachedEndRef = useRef(false)
  // 인트로 진행도가 바뀔 때 매장 전체가 다시 그려지지 않도록 한 번만 만듭니다.
  const store = useMemo(() => <MartSections />, [])
  const dock = useMemo(() => <CartDock />, [])
  const nav = useMemo(() => <MartNav />, [])

  // when the shopper "steps in", glide the page down into the aisle scene
  const handleStart = () => {
    setStarted(true)
    setLeaving(true)
    reachedEndRef.current = false
    requestAnimationFrame(() => {
      const el = scrollRef.current
      if (!el) return
      const target = el.offsetTop + el.offsetHeight
      window.scrollTo({ top: target, behavior: "smooth" })
    })
  }

  useEffect(() => {
    let raf = 0
    const update = () => {
      const el = scrollRef.current
      if (!el) return
      const total = el.offsetHeight - stageHeight()
      const p = total > 0 ? clamp(-el.getBoundingClientRect().top / total, 0, 1) : 0
      setProgress(p)
      setIntroOnScreen(el.getBoundingClientRect().bottom > window.innerHeight * 0.5)
      if (p >= 0.999) {
        reachedEndRef.current = true
      } else if (reachedEndRef.current) {
        reachedEndRef.current = false
        setLeaving(false)
      }
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

  // 마트 앞으로 천천히 다가가는 정도만 — 큰 확대 없이 배경을 안정적으로 둡니다.
  const zoom = easeInOutCubic(clamp(progress / 0.45, 0, 1))
  const scale = 1 + zoom * 0.18
  const translateY = -zoom * 2

  // 체크리스트는 아주 일찍 천천히 올라와서 끝까지 머무릅니다 — 읽을 시간을 충분히 둡니다.
  const checklist = clamp(progress / 0.12, 0, 1)

  return (
    <CartProvider initialItems={FEATURED_IN_CART}>
      <div id="home" ref={scrollRef} className="relative h-[520vh] w-full bg-mart-sky">
        {/* sticky viewport-sized stage */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
        <img
          src="/mart-intro.png"
          alt="형서마트 외관 - 파란 차양과 유리문이 있는 아기자기한 마트 건물"
          className="absolute inset-0 h-full w-full object-cover will-change-transform"
          style={{
            transformOrigin: "50% 60%",
            transform: `translateY(${translateY}%) scale(${scale})`,
          }}
          />

          <ShoppingChecklist progress={checklist} leaving={leaving} onStart={handleStart} />
        </div>
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
