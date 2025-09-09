'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/app/providers'
import { CartDrawer } from '@/components/CartDrawer'

export function Navbar() {
  const { items } = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center relative">
        {/* Botão menu (mobile) - alinhado à esquerda */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" aria-label="Abrir menu" onClick={() => setIsMenuOpen(v => !v)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Links principais (desktop) - centralizados */}
        <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          <Link href="/" className="text-gray-700 hover:text-gray-900 transition-colors">Início</Link>
          <Link href="/produtos" className="text-gray-700 hover:text-gray-900 transition-colors">Produtos</Link>
          <Link href="/categorias" className="text-gray-700 hover:text-gray-900 transition-colors">Categorias</Link>
          <Link href="/contato" className="text-gray-700 hover:text-gray-900 transition-colors">Contato</Link>
        </div>

        {/* Carrinho - alinhado à direita */}
        <div className="ml-auto">
          <Button variant="ghost" size="icon" aria-label="Carrinho" onClick={() => setIsCartOpen(true)} className="relative">
            <ShoppingBag className="w-5 h-5" />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] rounded-full px-1.5 py-0.5">{items.length}</span>
            )}
          </Button>
        </div>
      </div>

      {/* Navegação mobile */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="max-w-7xl mx-auto px-4 py-3 grid gap-2">
            <Link href="/" className="py-2 text-gray-700 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>Início</Link>
            <Link href="/produtos" className="py-2 text-gray-700 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>Produtos</Link>
            <Link href="/categorias" className="py-2 text-gray-700 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>Categorias</Link>
            <Link href="/contato" className="py-2 text-gray-700 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>Contato</Link>
          </div>
        </div>
      )}

      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  )}
