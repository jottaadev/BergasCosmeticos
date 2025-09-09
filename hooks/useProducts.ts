import { useState, useEffect } from 'react'

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
  updatedAt: string
}

interface UseProductsOptions {
  category?: string
  search?: string
  featured?: boolean
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams()
        // Fallback: usa categoria da URL se não vier via options
        let effectiveCategory = options.category
        if (!effectiveCategory && typeof window !== 'undefined') {
          const sp = new URLSearchParams(window.location.search)
          effectiveCategory = sp.get('category') || sp.get('categoria') || undefined
        }
        if (effectiveCategory) params.append('category', effectiveCategory)
        if (options.search) params.append('search', options.search)
        if (options.featured !== undefined) params.append('featured', options.featured.toString())
        // limite padrão para evitar carregar demasiados itens em listagens
        if (!options.featured && !params.has('limit')) params.append('limit', '50')

        const response = await fetch(`/api/products?${params.toString()}`)
        
        if (!response.ok) {
          throw new Error('Erro ao carregar produtos')
        }

        const data = await response.json()
        // Filtro de segurança no cliente: se categoria foi solicitada, filtra localmente
        const finalData = effectiveCategory
          ? (Array.isArray(data) ? data.filter((p: Product) => p.category === effectiveCategory) : data)
          : data
        setProducts(finalData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
        console.error('Erro ao buscar produtos:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [options.category, options.search, options.featured, reloadKey])

  const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        let message = 'Erro ao criar produto'
        try {
          const data = await response.json()
          if (data?.error) message = data.error
        } catch (_) {}
        throw new Error(message)
      }

      const newProduct = await response.json()
      setProducts(prev => [newProduct, ...prev])
      return newProduct
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar produto')
      throw err
    }
  }

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        let message = 'Erro ao atualizar produto'
        try {
          const data = await response.json()
          if (data?.error) message = data.error
        } catch (_) {}
        throw new Error(message)
      }

      const updatedProduct = await response.json()
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p))
      return updatedProduct
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar produto')
      throw err
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar produto')
      }

      setProducts(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar produto')
      throw err
    }
  }

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch: () => setReloadKey(prev => prev + 1)
  }
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/products/${id}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Produto não encontrado')
          } else {
            throw new Error('Erro ao carregar produto')
          }
          return
        }

        const data = await response.json()
        setProduct(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
        console.error('Erro ao buscar produto:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  return { product, loading, error }
}
