"use client"

import { useEffect, useRef, useState } from "react"

type CursorMode = "open" | "grab" | "scan"

// 원본 이미지 크기와 클릭 기준점(hotspot, 원본 px). width는 화면 폭에 따라 줄어드는 CSS 폭입니다.
type CursorImage = {
  src: string
  natural: [w: number, h: number]
  hotspot: [x: number, y: number]
  width: string
}

const IMAGES: Record<CursorMode, CursorImage> = {
  open: { src: "/cursor/hand-palm.png", natural: [1312, 1199], hotspot: [668, 140], width: "clamp(32px, 6.1vw, 88px)" },
  grab: { src: "/cursor/hand-grab.png", natural: [313, 343], hotspot: [123, 74], width: "clamp(29px, 5.55vw, 80px)" },
  scan: { src: "/cursor/scanner-clear.png", natural: [1536, 1024], hotspot: [395, 366], width: "clamp(43px, 8.2vw, 118px)" },
}

const MODES: CursorMode[] = ["open", "grab", "scan"]

function inCheckout(): boolean {
  const el = document.getElementById("checkout")
  if (!el) return false
  const rect = el.getBoundingClientRect()
  return rect.top <= window.innerHeight * 0.5 && rect.bottom > 0
}

export function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [checkout, setCheckout] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)")
    const sync = () => setEnabled(media.matches)
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const html = document.documentElement
    html.classList.add("custom-cursor")

    let raf = 0
    const updateZone = () => setCheckout(inCheckout())
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(updateZone)
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      const el = rootRef.current
      if (el) el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
      setVisible(true)
    }
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse") setPressed(true)
    }
    const onUp = () => setPressed(false)
    const onLeave = (e: MouseEvent) => {
      if (!e.relatedTarget) setVisible(false)
    }

    updateZone()
    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerdown", onDown)
    window.addEventListener("pointerup", onUp)
    window.addEventListener("blur", onUp)
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    document.addEventListener("mouseout", onLeave)
    return () => {
      cancelAnimationFrame(raf)
      html.classList.remove("custom-cursor")
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointerup", onUp)
      window.removeEventListener("blur", onUp)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      document.removeEventListener("mouseout", onLeave)
    }
  }, [enabled])

  if (!enabled) return null

  const mode: CursorMode = checkout ? "scan" : pressed ? "grab" : "open"

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[2147483647]"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {MODES.map((key) => {
        const img = IMAGES[key]
        const hx = (img.hotspot[0] / img.natural[0]) * 100
        const hy = (img.hotspot[1] / img.natural[1]) * 100
        const active = key === mode
        const isScan = key === "scan"
        return (
          <img
            key={key}
            src={img.src}
            alt=""
            draggable={false}
            data-cursor={key}
            data-active={active}
            className="absolute left-0 top-0 h-auto max-w-none select-none"
            style={{
              width: img.width,
              opacity: active ? 1 : 0,
              transform: `translate(-${hx}%, -${hy}%) scale(${isScan && !active ? 0.8 : 1})`,
              transformOrigin: `${hx}% ${hy}%`,
              transition: isScan || checkout ? "opacity 160ms ease, transform 160ms ease" : "none",
            }}
          />
        )
      })}
    </div>
  )
}
