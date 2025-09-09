'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { useProduct } from '@/hooks/useProducts'
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
  images: string // JSON string com array de URLs
  inStock: boolean
  featured: boolean
}

export default function ProductPage() {
  const params = useParams()
  const [selectedImage, setSelectedImage] = useState(0)
  
  const { product, loading, error } = useProduct(params.id as string)
  const { addItem } = useCart()

  // Função para obter as imagens do produto de forma segura
  const getProductImages = (product: Product): string[] => {
    try {
      return JSON.parse(product.images)
    } catch {
      // Se houver erro no parse, retorna array com a imagem principal
      return [product.image]
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const handleAdd = () => {
    if (!product) return
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image })
    toast.success('Produto adicionado à sacola!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-600">Carregando produto...</div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-600 mb-4">
              {error || 'Produto não encontrado'}
            </div>
            <Link 
              href="/" 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Voltar ao início
            </Link>
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
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-blue-600">Início</Link>
          <span>/</span>
          <Link href="/produtos" className="hover:text-blue-600">Produtos</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Imagens do produto */}
          <div>
            <div className="mb-4">
              <img
                src={getProductImages(product)[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
            </div>
            <div className="flex space-x-2">
              {getProductImages(product).map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Informações do produto */}
          <div>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <Link
                  href={`/produtos?category=${encodeURIComponent(product.category)}`}
                  className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded hover:bg-blue-200 transition-colors"
                >
                  {product.category}
                </Link>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600">(4.8) • 127 avaliações</span>
              </div>

              <div className="text-3xl font-bold text-gray-900 mb-6">
                {formatPrice(product.price)}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Descrição</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Características</h3>
              <ul className="space-y-2 text-gray-600">
                {(function() {
                  try {
                    const feats = JSON.parse((product as any).features || '[]') as string[]
                    if (!Array.isArray(feats) || feats.length === 0) return <li>• Sem características informadas</li>
                    return feats.map((f, idx) => <li key={idx}>• {f}</li>)
                  } catch { return <li>• Sem características informadas</li> }
                })()}
              </ul>
            </div>

            <div className="border-t border-gray-200 my-8"></div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Disponibilidade:</span>
                <span className={`text-sm font-medium px-2.5 py-0.5 rounded ${
                  product.inStock 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.inStock ? 'Em estoque' : 'Fora de estoque'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Marca:</span>
                <span className="text-sm font-medium">{product.brand}</span>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <button
                onClick={handleAdd}
                disabled={!product.inStock}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                  product.inStock
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {product.inStock ? 'Adicionar à sacola' : 'Produto indisponível'}
              </button>
              
              <Link
                href="/produtos"
                className="w-full py-3 px-6 rounded-lg font-semibold text-blue-600 border-2 border-blue-600 hover:bg-blue-50 transition-colors inline-block text-center"
              >
                Voltar aos Produtos
              </Link>
            </div>
          </div>
        </div>

        {/* Produtos relacionados (ocultos por enquanto) */}
        {false && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Produtos Relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Conteúdo dinâmico será implementado quando houver dados reais */}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}