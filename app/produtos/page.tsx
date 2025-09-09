'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Heart, ShoppingCart, Eye } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { useProducts } from '@/hooks/useProducts'
import { Input, Select, SelectItem } from '@heroui/react'
import { useCart } from '@/app/providers'
import toast from 'react-hot-toast'
import { useCategories } from '@/hooks/useCategories'

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  brand: string
  image: string
  images?: string // JSON string com array de URLs (opcional)
  featured: boolean
  inStock: boolean
}

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [sortBy, setSortBy] = useState('name')

  const { products, loading, error } = useProducts({
    search: searchTerm || undefined,
    category: filterCategory !== 'all' ? filterCategory : undefined
  })
  const { addItem } = useCart()
  const { categories: backendCategories, loading: catsLoading } = useCategories({ activeOnly: true })

  const categories = useMemo(() => backendCategories.map(c => c.name), [backendCategories])

  // Ler categoria do query param (?category= ou ?categoria=)
  useEffect(() => {
    const c = searchParams.get('category') || searchParams.get('categoria')
    if (c) setFilterCategory(c)
  }, [searchParams])

  // Caso a categoria do estado não exista mais no backend, voltar para 'all'
  useEffect(() => {
    if (filterCategory !== 'all' && categories.length > 0 && !categories.includes(filterCategory)) {
      setFilterCategory('all')
    }
  }, [categories, filterCategory])

  // Sincronizar seleção de categoria na URL
  useEffect(() => {
    const params = new URLSearchParams()
    if (filterCategory && filterCategory !== 'all') params.set('category', filterCategory)
    if (searchTerm) params.set('search', searchTerm)
    const query = params.toString()
    router.replace(`${pathname}${query ? `?${query}` : ''}`, { scroll: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCategory])

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'name':
      default:
        return a.name.localeCompare(b.name)
    }
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <div className="text-2xl font-semibold text-gray-600 mt-4">Carregando produtos...</div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="text-2xl font-semibold text-red-600">Erro ao carregar produtos: {error}</div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Nossos Produtos</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descubra nossa coleção completa de produtos de maquiagem de alta qualidade
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-8 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                variant="bordered"
                size="md"
                className="w-full"
                classNames={{
                  input: 'outline-none focus:outline-none',
                  inputWrapper: 'outline-none focus:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent'
                }}
              />
            </div>
            <div className="w-full md:w-64">
              <Select
                selectedKeys={new Set([filterCategory || 'all'])}
                onSelectionChange={(keys: any) => {
                  const value = Array.from(keys as Set<string>)[0] as string
                  setFilterCategory(value)
                }}
                variant="bordered"
                size="md"
                placeholder="Todas as categorias"
                className="w-full"
              >
                <SelectItem key="all">Todas as categorias</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category}>{category}</SelectItem>
                ))}
              </Select>
            </div>
            <div className="w-full md:w-48">
              <Select
                selectedKeys={new Set([sortBy])}
                onSelectionChange={(keys: any) => {
                  const value = Array.from(keys as Set<string>)[0] as string
                  setSortBy(value)
                }}
                variant="bordered"
                size="md"
                placeholder="Ordenar por"
                className="w-full"
              >
                <SelectItem key="name">Nome A-Z</SelectItem>
                <SelectItem key="price-low">Preço: Menor</SelectItem>
                <SelectItem key="price-high">Preço: Maior</SelectItem>
              </Select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
              <div className="relative h-64">
                <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 300px" className="object-cover" />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {product.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white/90 transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
                {product.featured && (
                  <div className="absolute bottom-4 left-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Destaque
                    </span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-sm text-gray-500">{product.brand}</span>
                </div>
              </div>
              <div className="p-6 pt-0 mt-auto">
                <div className="flex gap-2 w-full">
                  <Link
                    href={`/produto/${product.id}`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-center hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Ver Detalhes</span>
                  </Link>
                  <button
                    onClick={() => {
                      addItem({ id: product.id, name: product.name, price: product.price, image: product.image })
                      toast.success('Produto adicionado à sacola!')
                    }}
                    disabled={!product.inStock}
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                      product.inStock 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{product.inStock ? 'Adicionar' : 'Indisponível'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-2xl font-semibold text-gray-600 mb-4">
              Nenhum produto encontrado
            </div>
            <p className="text-gray-500 mb-6">
              Tente ajustar os filtros para encontrar o que você procura
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setFilterCategory('all')
                setSortBy('name')
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}