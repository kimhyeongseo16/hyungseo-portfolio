"use client"

import { useEffect, useRef, useState } from "react"

type CursorMode = "open" | "grab" | "scan"

// 원본 이미지 크기와 기준점(hotspot, 원본 px). width는 화면 폭에 따라 줄어드는 CSS 폭입니다.
// 두 손은 같은 배율(HAND_SCALE)로 그려서, 눌러도 손 크기가 바뀌지 않고 손목 위치도 그대로입니다.
type CursorImage = {
  src: string
  natural: [w: number, h: number]
  hotspot: [x: number, y: number]
  width: string
  shift?: [x: number, y: number]
}

const HAND_SCALE = "clamp(0.0148px, 0.0028vw, 0.0403px)"

const IMAGES: Record<CursorMode, CursorImage> = {
  open: { src: "/cursor/hand-palm.png", natural: [1291, 1218], hotspot: [670, 192], width: `calc(1291 * ${HAND_SCALE})` },
  grab: { src: "/cursor/hand-grab.png", natural: [1254, 1254], hotspot: [657, 196], width: `calc(1254 * ${HAND_SCALE})` },
  scan: { src: "/cursor/scanner-clear.png", natural: [1536, 1024], hotspot: [395, 366], width: "clamp(43px, 8.2vw, 118px)", shift: [12, 18] },
}

const MODES: CursorMode[] = ["open", "grab", "scan"]

// 기본 마우스 커서를 가리지 않도록 손은 커서의 오른쪽 아래에 떨어져서 따라옵니다.
const OFFSET_X = 22
const OFFSET_Y = 26
// 한 프레임(60fps)마다 남은 거리의 몇 %를 따라잡을지. 작을수록 더 늦게 따라옵니다.
const FOLLOW = 0.2

function inCheckout(): boolean {
  const el = document.getElementById("checkout")
  if (!el) return false
  const rect = el.getBoundingClientRect()
  return rect.top <= window.innerHeight * 0.5 && rect.bottom > 0
}

export function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [finePointer, setFinePointer] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [checkout, setCheckout] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)")
    const sync = () => setFinePointer(media.matches)
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])

  // 마우스처럼 정밀한 포인터에서만 손을 씁니다. 터치 기기에서는 요소도 이벤트도 만들지 않습니다.
  useEffect(() => {
    if (!finePointer) return

    let zoneRaf = 0
    let followRaf = 0
    let last = 0
    let started = false
    const target = { x: 0, y: 0 }
    const pos = { x: 0, y: 0 }

    const render = () => {
      const el = rootRef.current
      if (el) el.style.transform = `translate3d(${pos.x + OFFSET_X}px, ${pos.y + OFFSET_Y}px, 0)`
    }
    const follow = (now: number) => {
      const dt = last ? Math.min(now - last, 100) : 16.7
      last = now
      const k = 1 - Math.pow(1 - FOLLOW, dt / 16.7)
      pos.x += (target.x - pos.x) * k
      pos.y += (target.y - pos.y) * k
      if (Math.abs(target.x - pos.x) < 0.1 && Math.abs(target.y - pos.y) < 0.1) {
        pos.x = target.x
        pos.y = target.y
        render()
        followRaf = 0
        last = 0
        return
      }
      render()
      followRaf = requestAnimationFrame(follow)
    }
    const aim = (e: PointerEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      if (!started) {
        started = true
        pos.x = target.x
        pos.y = target.y
        render()
      }
      if (!followRaf) followRaf = requestAnimationFrame(follow)
    }

    const updateZone = () => setCheckout(inCheckout())
    const onScroll = () => {
      cancelAnimationFrame(zoneRaf)
      zoneRaf = requestAnimationFrame(updateZone)
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      aim(e)
      setVisible(true)
    }
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      aim(e)
      setVisible(true)
      setPressed(true)
    }
    const onUp = () => setPressed(false)
    const onLeave = (e: MouseEvent) => {
      if (!e.relatedTarget) setVisible(false)
    }

    updateZone()
    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerdown", onDown)
    window.addEventListener("pointerup", onUp)
    window.addEventListener("pointercancel", onUp)
    window.addEventListener("blur", onUp)
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    document.addEventListener("mouseout", onLeave)
    return () => {
      cancelAnimationFrame(zoneRaf)
      cancelAnimationFrame(followRaf)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointerup", onUp)
      window.removeEventListener("pointercancel", onUp)
      window.removeEventListener("blur", onUp)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      document.removeEventListener("mouseout", onLeave)
    }
  }, [finePointer])

  if (!finePointer) return null

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
        const [sx, sy] = img.shift ?? [0, 0]
        return (
          <img
            key={key}
            src={img.src}
            alt=""
            draggable={false}
            data-cursor={key}
            data-active={active}
            className="pointer-events-none absolute left-0 top-0 h-auto max-w-none select-none"
            style={{
              width: img.width,
              opacity: active ? 1 : 0,
              transform: `translate(${sx}px, ${sy}px) translate(-${hx}%, -${hy}%) scale(${isScan && !active ? 0.8 : 1})`,
              transformOrigin: `${hx}% ${hy}%`,
              transition: isScan || checkout ? "opacity 160ms ease, transform 160ms ease" : "none",
            }}
          />
        )
      })}
    </div>
  )
}
