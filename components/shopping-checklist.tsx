"use client"

import { useState } from "react"
import { Check, ShoppingCart } from "lucide-react"
import { CATEGORIES } from "@/lib/portfolio"
import { useCart } from "./shopping-cart"

// 인트로 — 마트 앞 오른쪽에 떠 있는 작은 쇼핑 안내 패널
export function ShoppingChecklist({
  progress,
  leaving = false,
  onStart,
}: {
  progress: number
  leaving?: boolean
  onStart?: () => void
}) {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const { items } = useCart()

  const toggle = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const shown = leaving ? 0 : progress
  const visible = shown > 0.001

  return (
    <div
      aria-hidden={!visible}
      className="pointer-events-none absolute inset-0 flex items-center justify-end px-4 sm:px-[5vw]"
    >
      <div
        className="pointer-events-auto w-full max-w-[360px] sm:w-[clamp(320px,28vw,400px)] sm:max-w-none"
        style={{
          opacity: shown,
          transform: leaving ? "translateX(32px)" : `translateY(${16 - progress * 16}px)`,
          visibility: visible ? "visible" : "hidden",
          transition: "visibility 0.6s, opacity 0.6s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <div className="max-h-[calc(100svh-2rem)] overflow-y-auto rounded-[22px] border border-mart-blue/50 bg-mart-cream-soft/95 p-5 shadow-[0_18px_40px_-16px_rgba(74,107,134,0.55)] backdrop-blur-sm sm:p-6">
          <header>
            <p className="font-display text-xs tracking-[0.3em] text-mart-blue-deep">MY PORTFOLIO</p>
            <h1 className="mt-2 break-keep font-display text-[1.65rem] leading-[1.25] text-mart-ink text-balance sm:text-[1.9rem]">
              오늘은 어떤 작업을 담아볼까요?
            </h1>
            <p className="mt-2.5 break-keep text-sm leading-relaxed text-mart-ink/70 text-pretty">
              작업을 둘러보고 마음에 드는 프로젝트를 장바구니에 담아보세요.
            </p>
          </header>

          <p className="mt-5 font-display text-xs tracking-[0.3em] text-mart-blue-deep">SHOPPING LIST</p>
          <ul className="mt-2 border-t border-dashed border-mart-blue/40">
            {CATEGORIES.map((c) => {
              const isOn = !!checked[c.anchor]
              return (
                <li key={c.anchor} className="border-b border-dashed border-mart-blue/40">
                  <button
                    type="button"
                    onClick={() => toggle(c.anchor)}
                    aria-pressed={isOn}
                    className="group flex w-full items-center gap-2.5 rounded-lg px-1 py-1.5 text-left transition-colors hover:bg-white/60"
                  >
                    <span
                      className={`flex h-[18px] w-[18px] flex-none items-center justify-center rounded-[4px] border-2 transition-colors duration-200 ${
                        isOn
                          ? "border-mart-blue-deep bg-mart-blue text-white"
                          : "border-mart-blue/60 bg-white/80 text-transparent group-hover:border-mart-blue-deep"
                      }`}
                    >
                      {isOn && (
                        <Check
                          className="h-3 w-3"
                          strokeWidth={3}
                          style={{ animation: "check-in 0.22s ease-out both" }}
                        />
                      )}
                    </span>
                    <span
                      className={`flex-1 font-display text-base tracking-wide transition-colors duration-200 ${
                        isOn ? "text-mart-blue-deep" : "text-mart-ink"
                      }`}
                    >
                      {c.introLabel ?? c.label}
                    </span>
                    <span className="font-display text-xs text-mart-ink/40">{c.no}</span>
                  </button>
                </li>
              )
            })}
          </ul>

          <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-white/70 px-3 py-2">
            <ShoppingCart className="h-4 w-4 text-mart-blue-deep" strokeWidth={2.2} aria-hidden="true" />
            <p className="font-display text-xs tracking-[0.25em] text-mart-blue-deep">CART</p>
            <p className="ml-auto whitespace-nowrap font-display text-sm text-mart-ink">{items.length} {items.length === 1 ? "PROJECT" : "PROJECTS"}</p>
          </div>

          <button
            type="button"
            onClick={onStart}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full bg-mart-blue-deep py-2.5 font-display text-base text-white shadow-[0_8px_18px_-8px_rgba(91,149,207,0.8)] transition-transform hover:brightness-105 active:scale-[0.98]"
          >
            쇼핑 시작하기 <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  )
}
