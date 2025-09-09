'use client'

// import { Button } from '@nextui-org/react'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-start justify-center overflow-hidden pt-16 md:pt-24 pb-12">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-2000"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4">
            Descubra sua{' '}
            <span className="gradient-text">
              beleza única
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Explore nossa coleção exclusiva de produtos de maquiagem de alta qualidade, 
            cuidadosamente selecionados para realçar sua beleza natural.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/produtos">
              <Button className="px-8 py-6 text-lg gap-2 bg-blue-600 hover:bg-blue-700">
                Explorar Produtos
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/categorias">
              <Button
                variant="outline"
                className="px-8 py-6 text-lg border-blue-600 text-blue-700 relative overflow-hidden group"
              >
                <span className="relative z-10">Ver Categorias</span>
                <span className="pointer-events-none absolute inset-0 bg-blue-600/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Button>
            </Link>
          </div>

          {/* Stats removidos */}
        </div>
      </div>
    </section>
  )
}
