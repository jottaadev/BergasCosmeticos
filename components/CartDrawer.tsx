'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useCart } from '@/app/providers'
import { Button } from '@/components/ui/button'
import { X, Trash2 } from 'lucide-react'

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, removeItem, total, clear, increase, decrease } = useCart()
  const shopPhone = '5511953552882'

  const handleCheckoutWhatsApp = () => {
    if (items.length === 0) return
    const lines = items.map(i => `• ${i.name} x${i.quantity} — R$ ${(i.price * i.quantity).toFixed(2)}`)
    const totalLine = `Total: R$ ${total.toFixed(2)}`
    const header = 'Olá! Quero finalizar meu pedido:'
    const message = [header, '', ...lines, '', totalLine].join('\n')
    const url = `https://wa.me/${shopPhone}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [open])

  if (!mounted) return null

  return createPortal(
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}>
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-xl transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Sua Sacola</h2>
          <button onClick={onClose} className="p-2 rounded hover:bg-gray-100" aria-label="Fechar"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-gray-600">Sua sacola está vazia.</div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 items-center border rounded-lg p-3">
                {item.image && (
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                )}
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{item.name}</div>
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <button onClick={() => decrease(item.id)} className="w-6 h-6 rounded border flex items-center justify-center hover:bg-gray-50">-</button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <button onClick={() => increase(item.id)} className="w-6 h-6 rounded border flex items-center justify-center hover:bg-gray-50">+</button>
                  </div>
                  <div className="text-sm font-semibold">R$ {(item.price * item.quantity).toFixed(2)}</div>
                </div>
                <button onClick={() => removeItem(item.id)} className="p-2 rounded hover:bg-gray-100" aria-label="Remover">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
          </div>
        </div>
        <div className="p-4 border-t space-y-3 sticky bottom-0 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Total</span>
            <span className="text-xl font-semibold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={clear}>Limpar</Button>
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={handleCheckoutWhatsApp}>Finalizar</Button>
          </div>
        </div>
      </aside>
    </div>,
    document.body
  )
}


