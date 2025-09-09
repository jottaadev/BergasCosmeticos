'use client'

import { Heart, ShoppingCart, Eye } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useProducts } from '@/hooks/useProducts'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCart } from '@/app/providers'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  brand: string
  image: string
  images: string
  inStock: boolean
  featured: boolean
  createdAt: string
}

export function FeaturedProducts() {
  const { products, loading, error } = useProducts({ featured: true })
  const { addItem } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const handleWhatsApp = (product: Product) => {
    const message = `Olá! Gostaria de saber mais sobre o produto: ${product.name} - ${formatPrice(product.price)}`
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Produtos em Destaque</h2>
            <p className="text-xl text-gray-600">Carregando...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[0,1,2].map(i => (
              <div key={i} className="animate-pulse bg-white rounded-lg shadow p-4 h-[500px]">
                <div className="bg-gray-200 h-64 w-full rounded" />
                <div className="mt-4 h-6 bg-gray-200 rounded w-3/4" />
                <div className="mt-2 h-4 bg-gray-200 rounded w-full" />
                <div className="mt-2 h-4 bg-gray-200 rounded w-5/6" />
                <div className="mt-6 grid grid-cols-2 gap-2">
                  <div className="h-10 bg-gray-200 rounded" />
                  <div className="h-10 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Produtos em Destaque</h2>
            <p className="text-xl text-red-600">Erro ao carregar produtos: {error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Produtos em Destaque</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descubra nossa seleção especial de produtos que estão fazendo sucesso
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center text-gray-600">
            Nenhum produto em destaque no momento.
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 items-stretch">
          {products.slice(0, 3).map((product) => (
            <Card key={product.id} className="hover:shadow-md transition-shadow min-h-[500px]">
              <div className="relative h-64">
                <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px" className="object-cover rounded-t-lg" />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {product.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <Button variant="ghost" size="icon" className="bg-white/80 backdrop-blur-sm hover:bg-white">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                <CardDescription className="line-clamp-2">{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                  <span className="text-sm text-gray-500">{product.brand}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-0 mt-auto">
                <div className="grid grid-cols-2 gap-2 w-full">
                  <Button asChild variant="outline" className="w-full h-10 min-w-0">
                    <Link href={`/produto/${product.id}`} className="inline-flex items-center justify-center w-full gap-2 leading-none">
                      <Eye className="w-6 h-6 shrink-0" strokeWidth={2.25} />
                      Ver Detalhes
                    </Link>
                  </Button>
                  <Button onClick={() => { addItem({ id: product.id, name: product.name, price: product.price, image: product.image }); toast.success('Produto adicionado à sacola!') }} className="w-full bg-blue-600 hover:bg-blue-700 h-10 min-w-0 inline-flex items-center justify-center gap-2 leading-none">
                    <ShoppingCart className="w-6 h-6 shrink-0" strokeWidth={2.25} />
                    Adicionar
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
        )}

        <div className="text-center mt-12">
          <Link href="/produtos">
            <Button variant="outline" className="px-8 py-6 text-lg">Ver Todos os Produtos</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}