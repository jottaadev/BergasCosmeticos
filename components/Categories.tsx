'use client'

import type { ComponentType } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Tag, Package, Star, Heart, Eye, Palette, Brush, Sparkles, Droplets, Sun, Moon, Zap, Shield, Crown, Gem, Flower } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useCategories } from '@/hooks/useCategories'

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  Tag,
  Package,
  Star,
  Heart,
  Eye,
  Palette,
  Brush,
  Sparkles,
  Droplets,
  Sun,
  Moon,
  Zap,
  Shield,
  Crown,
  Gem,
  Flower
}

const colorMap: Record<string, { bg: string; fg: string }> = {
  blue: { bg: 'bg-blue-50', fg: 'text-blue-600' },
  green: { bg: 'bg-green-50', fg: 'text-green-600' },
  red: { bg: 'bg-red-50', fg: 'text-red-600' },
  yellow: { bg: 'bg-yellow-50', fg: 'text-yellow-600' },
  purple: { bg: 'bg-purple-50', fg: 'text-purple-600' },
  pink: { bg: 'bg-pink-50', fg: 'text-pink-600' },
  indigo: { bg: 'bg-indigo-50', fg: 'text-indigo-600' },
  gray: { bg: 'bg-gray-50', fg: 'text-gray-600' }
}

export function Categories() {
  const { categories, loading, error } = useCategories({ activeOnly: true })

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Nossas Categorias</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore nossa ampla variedade de produtos de maquiagem organizados por categoria
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Card key={idx} className="overflow-hidden">
                <div className="h-48 bg-gray-100 animate-pulse" />
                <CardContent>
                  <div className="h-5 w-48 bg-gray-100 animate-pulse rounded mb-3" />
                  <div className="h-4 w-64 bg-gray-100 animate-pulse rounded mb-4" />
                  <div className="h-10 w-full bg-gray-100 animate-pulse rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center">
            <p className="text-red-600 mb-4">Erro ao carregar categorias: {error}</p>
            <p className="text-gray-600">Tente novamente mais tarde.</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center text-gray-600">Nenhuma categoria ativa encontrada.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => {
              const Icon = iconMap[category.icon] || Tag
              const colors = colorMap[category.color] || colorMap.blue
              const href = `/produtos?category=${encodeURIComponent(category.name)}`
              return (
                <Link key={category.id} href={href} className="group block">
                  <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-[1.02]">
                    {/* Card Header com gradiente */}
                    <div className="relative h-48 overflow-hidden">
                      {category.image ? (
                        <Image 
                          src={category.image} 
                          alt={category.name} 
                          fill 
                          priority 
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px" 
                          className="object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                      ) : (
                        <div className={`w-full h-full ${colors.bg} flex items-center justify-center relative`}>
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                          <div className={`w-20 h-20 rounded-2xl bg-white/90 shadow-xl flex items-center justify-center backdrop-blur-sm`}>
                            <Icon className={`w-10 h-10 ${colors.fg}`} />
                          </div>
                        </div>
                      )}
                      
                      {/* Overlay gradiente */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      
                      {/* Badge de categoria */}
                      <div className="absolute top-4 left-4">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${colors.bg} ${colors.fg} backdrop-blur-sm border border-white/20`}>
                          {category.name}
                        </span>
                      </div>
                      
                      {/* Botão de ação */}
                      <div className="absolute top-4 right-4">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                          <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Card Content */}
                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                          {category.name}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                          {category.description}
                        </p>
                      </div>
                      
                      {/* Estatísticas ou info adicional */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${colors.fg.replace('text-', 'bg-')}`} />
                          <span className="text-xs text-gray-500 font-medium">Categoria Ativa</span>
                        </div>
                        <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors duration-300">
                          <span>Explorar</span>
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Efeito de brilho no hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}