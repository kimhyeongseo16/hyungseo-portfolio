"use client"

// 장바구니 — 마트를 돌며 마음에 든 작업을 담아 두고, 계산대에서 그대로 계산됩니다.

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"

// 계산대 컨베이어 벨트에는 담은 작품의 대표 이미지가 그대로 올라갑니다.
export type CartItem = { id: string; title: string; category: string; image?: string; imageTop?: boolean }

type CartValue = {
  items: CartItem[]
  has: (id: string) => boolean
  // 작품을 열어보면 담기는 동작 — 같은 작품을 다시 열어도 한 번만 담깁니다.
  add: (item: CartItem) => void
  remove: (id: string) => void
  clear: () => void
  // 방금 담긴 작업 — 카트 아이콘이 잠깐 반응합니다.
  lastAdded: string | null
}

const CartContext = createContext<CartValue | null>(null)

export function CartProvider({ children, initialItems = [] }: { children: ReactNode; initialItems?: CartItem[] }) {
  const [items, setItems] = useState<CartItem[]>(initialItems)
  const [lastAdded, setLastAdded] = useState<string | null>(null)

  const add = useCallback((item: CartItem) => {
    setItems((cur) => {
      if (cur.some((c) => c.id === item.id)) return cur
      setLastAdded(item.id)
      window.setTimeout(() => setLastAdded((v) => (v === item.id ? null : v)), 900)
      return [...cur, item]
    })
  }, [])

  const remove = useCallback((id: string) => setItems((cur) => cur.filter((c) => c.id !== id)), [])
  const clear = useCallback(() => setItems([]), [])

  const value = useMemo<CartValue>(
    () => ({
      items,
      has: (id) => items.some((c) => c.id === id),
      add,
      remove,
      clear,
      lastAdded,
    }),
    [items, add, remove, clear, lastAdded]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>")
  return ctx
}

// 화면 왼쪽 아래에 고정되는 작은 장바구니 (작품을 가리지 않도록 작게, 열었을 때만 목록)
export function CartDock() {
  const { items, remove, lastAdded } = useCart()
  const [open, setOpen] = useState(false)

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-40 flex flex-col items-start gap-2 md:bottom-6 md:left-6">
      {open && items.length > 0 && (
        <div className="pointer-events-auto w-[min(72vw,230px)] rounded-2xl border border-mart-blue-deep/25 bg-mart-cream-soft/95 p-3 shadow-[0_18px_34px_-18px_rgba(74,107,134,0.7)] backdrop-blur-sm">
          <p className="mb-1.5 font-display text-sm tracking-widest text-mart-blue-deep">담은 작업</p>
          <ul className="max-h-[36vh] space-y-1 overflow-y-auto">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-2">
                <span className="min-w-0 truncate font-sans text-sm text-mart-ink/85">
                  <span className="mr-1 text-[11px] tracking-widest text-mart-ink/40">{item.category}</span>
                  {item.title}
                </span>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  aria-label={`${item.title} 장바구니에서 빼기`}
                  className="shrink-0 rounded-full px-1.5 font-mono text-xs text-mart-ink/45 transition-colors hover:text-mart-ink"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`장바구니 ${items.length}개 담김`}
        className="pointer-events-auto flex items-center gap-2 rounded-full border border-mart-blue-deep/30 bg-mart-cream-soft/95 py-2 pl-2.5 pr-4 shadow-[0_14px_26px_-16px_rgba(74,107,134,0.8)] backdrop-blur-sm transition-transform duration-300"
        style={{ transform: lastAdded ? "scale(1.07)" : "scale(1)" }}
      >
        {/* 기존 캐릭터 일러스트를 그대로 축소해 아이콘으로 씁니다 */}
        <img src="/cart-character.png" alt="" aria-hidden="true" className="h-9 w-9 object-contain object-bottom" />
        <span className="font-display text-base text-mart-ink">
          장바구니 <span className="text-mart-blue-deep">{items.length}</span>
        </span>
      </button>
    </div>
  )
}
