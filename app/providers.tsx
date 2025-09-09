'use client'

import { HeroUIProvider } from '@heroui/react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </HeroUIProvider>
  )
}

// Cart context
export interface CartItem {
  id: string
  name: string
  price: number
  image?: string
  quantity: number
}

interface CartContextValue {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  increase: (id: string) => void
  decrease: (id: string) => void
  removeItem: (id: string) => void
  clear: () => void
  total: number
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cart')
      if (saved) setItems(JSON.parse(saved))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(items))
    } catch {}
  }, [items])

  const addItem: CartContextValue['addItem'] = (item, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i)
      }
      return [...prev, { ...item, quantity }]
    })
  }

  const increase: CartContextValue['increase'] = (id) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i))
  }
  const decrease: CartContextValue['decrease'] = (id) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i))
  }

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id))
  const clear = () => setItems([])
  const total = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items])

  const value = useMemo(() => ({ items, addItem, increase, decrease, removeItem, clear, total }), [items, total])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}