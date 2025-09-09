'use client'

import { useState, useEffect, useMemo } from 'react'
import { Navbar } from '@/components/Navbar'
import { useProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  X, 
  Package,
  Star,
  CheckCircle,
  RefreshCw,
  Copy,
  Tag,
  ToggleLeft,
  ToggleRight
} from 'lucide-react'
import { Input, Select, SelectItem, Button as HButton } from '@heroui/react'
import { ImageUploader } from '@/components/ImageUploader'
import { Card, CardContent } from '@/components/ui/card'

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

interface ProductFormData {
  name: string
  description: string
  price: number
  category: string
  brand: string
  image: string
  inStock: boolean
  featured: boolean
  features?: string[]
}

interface Category {
  id: string
  name: string
  description: string
  icon: string
  image?: string
  color: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface CategoryFormData {
  name: string
  description: string
  icon: string
  image?: string
  color: string
  isActive: boolean
}

export default function AdminPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'createdAt'>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  
  // Estados para categorias
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products')

  const { 
    products, 
    loading, 
    error, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    refetch
  } = useProducts({
    search: debouncedSearch || undefined,
    category: filterCategory !== 'all' ? filterCategory : undefined
  })

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleActive: toggleCategoryActive,
    refetch: refetchCategories
  } = useCategories()

  // Debounce de busca
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 300)
    return () => clearTimeout(id)
  }, [searchTerm])

  // Ordenar produtos (memo)
  const sortedProducts = useMemo(() => {
    const arr = [...products]
    return arr.sort((a, b) => {
      let aValue: any = (a as any)[sortBy]
      let bValue: any = (b as any)[sortBy]

      if (sortBy === 'price') {
        aValue = Number(aValue)
        bValue = Number(bValue)
      } else if (sortBy === 'createdAt') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      } else {
        aValue = String(aValue).toLowerCase()
        bValue = String(bValue).toLowerCase()
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }, [products, sortBy, sortOrder])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const showSuccess = (message: string) => {
    setSuccessMessage(message)
    setShowSuccessMessage(true)
    setTimeout(() => {
      setShowSuccessMessage(false)
    }, 3000)
  }

  const showError = (message: string) => {
    setErrorMessage(message)
    setShowErrorMessage(true)
    setTimeout(() => {
      setShowErrorMessage(false)
    }, 3500)
  }

  const handleCreateProduct = () => {
    console.log('Criando produto...')
    setEditingProduct(null)
    setIsModalOpen(true)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleDelete = async (productId: string) => {
    if (confirm('Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.')) {
      try {
        await deleteProduct(productId)
        showSuccess('Produto excluído com sucesso!')
      } catch (error) {
        console.error('Erro ao deletar produto:', error)
        showError('Erro ao deletar produto')
      }
    }
  }

  const handleDuplicate = async (product: Product) => {
    try {
      const duplicatedProduct = {
        name: `${product.name} (Cópia)`,
        description: product.description,
        price: product.price,
        category: product.category,
        brand: product.brand,
        image: product.image,
        images: product.images,
        inStock: product.inStock,
        featured: false
      }
      
      await createProduct(duplicatedProduct)
      showSuccess('Produto duplicado com sucesso!')
    } catch (error) {
      console.error('Erro ao duplicar produto:', error)
      showError('Erro ao duplicar produto')
    }
  }

  const handleSave = async (productData: ProductFormData) => {
    setIsSubmitting(true)
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData)
        showSuccess('Produto atualizado com sucesso!')
      } else {
        await createProduct({
          ...productData,
          images: JSON.stringify([productData.image])
        })
        showSuccess('Produto criado com sucesso!')
      }
      setIsModalOpen(false)
      setEditingProduct(null)
      refetch()
    } catch (error) {
      console.error('Erro ao salvar produto:', error)
      const message = error instanceof Error ? error.message : 'Erro ao salvar produto. Tente novamente.'
      showError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
    setIsSubmitting(false)
  }

  const handleRefresh = async () => {
    try {
      await refetch()
      showSuccess('Lista atualizada!')
    } catch (error) {
      console.error('Erro ao atualizar:', error)
    }
  }

  const handleToggleFeatured = async (product: Product) => {
    try {
      const isActivating = !product.featured
      if (isActivating) {
        const currentFeatured = products.filter(p => p.featured).length
        if (currentFeatured >= 3) {
          showError('Você já possui 3 produtos em destaque. Remova um antes de adicionar outro.')
          return
        }
      }
      await updateProduct(product.id, { featured: !product.featured })
      showSuccess(`Produto ${!product.featured ? 'adicionado aos' : 'removido dos'} destaques!`)
    } catch (error) {
      console.error('Erro ao atualizar produto:', error)
      const message = error instanceof Error ? error.message : 'Erro ao atualizar produto'
      showError(message)
    }
  }

  const handleToggleStock = async (product: Product) => {
    try {
      await updateProduct(product.id, { inStock: !product.inStock })
      showSuccess(`Produto ${!product.inStock ? 'adicionado ao' : 'removido do'} estoque!`)
    } catch (error) {
      console.error('Erro ao atualizar produto:', error)
      showError('Erro ao atualizar produto')
    }
  }

  // Funções para categorias
  const handleCreateCategory = () => {
    setEditingCategory(null)
    setIsCategoryModalOpen(true)
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setIsCategoryModalOpen(true)
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (confirm('Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.')) {
      try {
        await deleteCategory(categoryId)
        showSuccess('Categoria excluída com sucesso!')
      } catch (error) {
        console.error('Erro ao deletar categoria:', error)
        showError('Erro ao deletar categoria')
      }
    }
  }

  const handleSaveCategory = async (categoryData: CategoryFormData) => {
    setIsSubmitting(true)
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryData)
        showSuccess('Categoria atualizada com sucesso!')
      } else {
        await createCategory(categoryData)
        showSuccess('Categoria criada com sucesso!')
      }
      setIsCategoryModalOpen(false)
      setEditingCategory(null)
      refetchCategories()
    } catch (error) {
      console.error('Erro ao salvar categoria:', error)
      showError('Erro ao salvar categoria. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false)
    setEditingCategory(null)
    setIsSubmitting(false)
  }

  const handleToggleCategoryActive = async (category: Category) => {
    try {
      await toggleCategoryActive(category.id)
      showSuccess(`Categoria ${!category.isActive ? 'ativada' : 'desativada'} com sucesso!`)
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error)
      showError('Erro ao atualizar categoria')
    }
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
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="text-2xl font-semibold text-red-600 mb-4">Erro ao carregar produtos</div>
            <div className="text-gray-600 mb-6">{error}</div>
            <button 
              onClick={handleRefresh}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar removida no painel admin */}
      
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 text-green-600">✓</div>
              <span className="text-green-800 font-medium">{successMessage}</span>
            </div>
          </div>
        </div>
      )}
      {showErrorMessage && (
        <div className="fixed top-20 right-4 z-50">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 text-red-600">⚠</div>
              <span className="text-red-800 font-medium">{errorMessage}</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
            <p className="text-gray-600 mt-2">Gerencie seus produtos e categorias</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <HButton variant="bordered" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </HButton>
            <HButton variant="bordered" onClick={activeTab === 'products' ? handleCreateProduct : handleCreateCategory}>
              <Plus className="w-4 h-4 mr-2" />
              {activeTab === 'products' ? 'Criar Produto' : 'Criar Categoria'}
            </HButton>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('products')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'products'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4" />
                  <span>Produtos</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'categories'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4" />
                  <span>Categorias</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{products.length}</div>
                <div className="text-gray-600">Total de Produtos</div>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {products.filter(p => p.inStock).length}
                </div>
                <div className="text-gray-600">Em Estoque</div>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {products.filter(p => p.featured).length}
                </div>
                <div className="text-gray-600">Em Destaque</div>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {categories.length}
                </div>
                <div className="text-gray-600">Categorias</div>
              </div>
              <Tag className="w-8 h-8 text-purple-500" />
            </div>
            </CardContent>
          </Card>
        </div>

        {/* Conteúdo baseado na aba ativa */}
        {activeTab === 'products' ? (
          <>
            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="flex flex-col lg:flex-row items-start gap-6">
            <div className="flex flex-col w-full lg:w-[320px]">
              <label className="text-sm font-medium text-gray-700 mb-1">Buscar</label>
              <Input
                type="text"
                placeholder="Digite o nome, marca..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="w-full"
                variant="bordered"
                size="md"
                classNames={{
                  input: 'outline-none focus:outline-none',
                  inputWrapper: 'outline-none focus:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent'
                }}
              />
            </div>
            <div className="flex flex-col w-full lg:w-[260px]">
              <label className="text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <Select
                selectedKeys={new Set([filterCategory || 'all'])}
                onSelectionChange={(keys: any) => {
                  const value = Array.from(keys as Set<string>)[0] as string
                  setFilterCategory(value)
                }}
                className="w-full"
                variant="bordered"
                size="md"
                placeholder="Todas as categorias"
              >
                <SelectItem key="all">Todas as categorias</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.name}>{category.name}</SelectItem>
                ))}
              </Select>
            </div>
            <div className="flex flex-col w-full lg:w-[220px]">
              <label className="text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
              <Select
                selectedKeys={new Set([sortBy])}
                onSelectionChange={(keys: any) => {
                  const value = Array.from(keys as Set<string>)[0] as 'name' | 'price' | 'createdAt'
                  setSortBy(value)
                }}
                className="w-full"
                variant="bordered"
                size="md"
                placeholder="Selecione"
              >
                <SelectItem key="name">Nome</SelectItem>
                <SelectItem key="price">Preço</SelectItem>
                <SelectItem key="createdAt">Data de Criação</SelectItem>
              </Select>
            </div>
            <div className="flex flex-col w-full lg:w-auto lg:ml-auto">
              <label className="text-sm font-medium text-gray-700 mb-1 opacity-0 select-none">Ordem</label>
              <HButton
                variant="bordered"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                size="md"
                className="w-full lg:w-auto h-[44px]"
              >
                {sortOrder === 'asc' ? '↑' : '↓'} {sortOrder === 'asc' ? 'Crescente' : 'Decrescente'}
              </HButton>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUTO</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CATEGORIA</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PREÇO</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ESTOQUE</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DESTAQUE</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CRIADO EM</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AÇÕES</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl">📦</span>
                        </div>
                        <p className="text-lg font-medium mb-2">Nenhum produto encontrado</p>
                        <p className="text-sm mb-4">
                          {searchTerm || filterCategory !== 'all' 
                            ? 'Tente ajustar os filtros de busca' 
                            : 'Comece criando seu primeiro produto!'
                          }
                        </p>
                        <button
                          onClick={handleCreateProduct}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
                        >
                          <span>+</span>
                          <span>Criar Primeiro Produto</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg"
                              onError={(e) => {
                                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAzNkMzMC42Mjc0IDM2IDM2IDMwLjYyNzQgMzYgMjRDMzYgMTcuMzcyNiAzMC42Mjc0IDEyIDI0IDEyQzE3LjM3MjYgMTIgMTIgMTcuMzcyNiAxMiAyNEMxMiAzMC42Mjc0IDE3LjM3MjYgMzYgMjQgMzZaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0yNCAyOEMyNS42NTY5IDI4IDI3IDI2LjY1NjkgMjcgMjVDMjcgMjMuMzQzMSAyNS42NTY5IDIyIDI0IDIyQzIyLjM0MzEgMjIgMjEgMjMuMzQzMSAyMSAyNUMyMSAyNi42NTY5IDIyLjM0MzEgMjggMjQgMjhaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K'
                              }}
                            />
                            {product.featured && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                                <Star className="w-2 h-2 text-white" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-600">{product.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.inStock 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.inStock ? 'Em estoque' : 'Fora de estoque'}
                          </span>
                          <button
                            onClick={() => handleToggleStock(product)}
                            className="p-1 hover:bg-gray-100 rounded"
                            title={product.inStock ? 'Remover do estoque' : 'Adicionar ao estoque'}
                          >
                            {product.inStock ? <X className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={product.featured}
                              onChange={() => handleToggleFeatured(product)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                          </label>
                          <button
                            onClick={() => handleToggleFeatured(product)}
                            className="p-1 hover:bg-gray-100 rounded"
                            title={product.featured ? 'Remover dos destaques' : 'Adicionar aos destaques'}
                          >
                            <Star className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(product.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => window.open(`/produto/${product.id}`, '_blank')}
                            className="p-2 hover:bg-gray-100 rounded"
                            title="Visualizar produto"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 hover:bg-gray-100 rounded"
                            title="Editar produto"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDuplicate(product)}
                            className="p-2 hover:bg-gray-100 rounded"
                            title="Duplicar produto"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 hover:bg-red-100 rounded text-red-600"
                            title="Excluir produto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

            {/* Product Modal */}
            {isModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {editingProduct ? 'Editar Produto' : 'Criar Novo Produto'}
                      </h2>
                      <button
                        onClick={handleCloseModal}
                        disabled={isSubmitting}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <ProductForm
                      product={editingProduct}
                      onSave={handleSave}
                      onCancel={handleCloseModal}
                      isSubmitting={isSubmitting}
                      availableCategories={categories.filter(c => c.isActive)}
                      featuredLimitReached={products.filter(p => p.featured).length >= 3}
                      onShowError={(msg: string) => showError(msg)}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Categories Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CATEGORIA</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DESCRIÇÃO</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CRIADA EM</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AÇÕES</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categories.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <div className="text-gray-500">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                              <Tag className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-lg font-medium mb-2">Nenhuma categoria encontrada</p>
                            <p className="text-sm mb-4">Comece criando sua primeira categoria!</p>
                            <button
                              onClick={handleCreateCategory}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Criar Primeira Categoria</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      categories.map((category) => (
                        <tr key={category.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <div className={`${getBgColorClass(category.color)} w-10 h-10 rounded-lg flex items-center justify-center`}>
                                <Tag className={`${getTextColorClass(category.color)} w-5 h-5`} />
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">{category.name}</div>
                                <div className="text-sm text-gray-500">Ícone: {category.icon}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate">
                              {category.description}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                category.isActive 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {category.isActive ? 'Ativa' : 'Inativa'}
                              </span>
                              <button
                                onClick={() => handleToggleCategoryActive(category)}
                                className="p-1 hover:bg-gray-100 rounded"
                                title={category.isActive ? 'Desativar categoria' : 'Ativar categoria'}
                              >
                                {category.isActive ? <ToggleRight className="w-3 h-3" /> : <ToggleLeft className="w-3 h-3" />}
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatDate(category.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => handleEditCategory(category)}
                                className="p-2 hover:bg-gray-100 rounded"
                                title="Editar categoria"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(category.id)}
                                className="p-2 hover:bg-red-100 rounded text-red-600"
                                title="Excluir categoria"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Category Modal */}
            {isCategoryModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {editingCategory ? 'Editar Categoria' : 'Criar Nova Categoria'}
                      </h2>
                      <button
                        onClick={handleCloseCategoryModal}
                        disabled={isSubmitting}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <CategoryForm
                      category={editingCategory}
                      onSave={handleSaveCategory}
                      onCancel={handleCloseCategoryModal}
                      isSubmitting={isSubmitting}
                      onShowError={(msg: string) => showError(msg)}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// Componente do formulário de produto
function getBgColorClass(color: string) {
  switch (color) {
    case 'blue': return 'bg-blue-100'
    case 'green': return 'bg-green-100'
    case 'red': return 'bg-red-100'
    case 'yellow': return 'bg-yellow-100'
    case 'purple': return 'bg-purple-100'
    case 'pink': return 'bg-pink-100'
    case 'indigo': return 'bg-indigo-100'
    case 'gray': return 'bg-gray-100'
    default: return 'bg-gray-100'
  }
}

function getTextColorClass(color: string) {
  switch (color) {
    case 'blue': return 'text-blue-600'
    case 'green': return 'text-green-600'
    case 'red': return 'text-red-600'
    case 'yellow': return 'text-yellow-600'
    case 'purple': return 'text-purple-600'
    case 'pink': return 'text-pink-600'
    case 'indigo': return 'text-indigo-600'
    case 'gray': return 'text-gray-600'
    default: return 'text-gray-600'
  }
}

function ProductForm({ 
  product, 
  onSave, 
  onCancel,
  isSubmitting,
  availableCategories,
  featuredLimitReached,
  onShowError
}: { 
  product: Product | null
  onSave: (data: ProductFormData) => void
  onCancel: () => void
  isSubmitting: boolean
  availableCategories: Category[]
  featuredLimitReached: boolean
  onShowError: (message: string) => void
}) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    category: product?.category || '',
    brand: product?.brand || '',
    image: product?.image || '',
    inStock: product?.inStock !== undefined ? product.inStock : true,
    featured: product?.featured !== undefined ? product.featured : false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [imagePreview, setImagePreview] = useState<string>('')

  const [expanded, setExpanded] = useState<{ basics: boolean; description: boolean; pricing: boolean; media: boolean; features: boolean; settings: boolean }>({
    basics: true,
    description: true,
    pricing: true,
    media: true,
    features: true,
    settings: true
  })

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || 0,
        category: product.category || '',
        brand: product.brand || '',
        image: product.image || '',
        inStock: product.inStock !== undefined ? product.inStock : true,
        featured: product.featured !== undefined ? product.featured : false
      })
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: '',
        brand: '',
        image: '',
        inStock: true,
        featured: false
      })
    }
    setErrors({})
  }, [product])

  useEffect(() => {
    setImagePreview(formData.image)
  }, [formData.image])

  const categoryOptions = availableCategories.map(c => c.name)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nome do produto é obrigatório'
    } else if (formData.name.length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres'
    }

    if (!formData.brand.trim()) {
      newErrors.brand = 'Marca é obrigatória'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória'
    } else if (formData.description.length < 10) {
      newErrors.description = 'Descrição deve ter pelo menos 10 caracteres'
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Preço deve ser maior que zero'
    } else if (formData.price > 10000) {
      newErrors.price = 'Preço não pode ser maior que R$ 10.000'
    }

    if (!formData.category) {
      newErrors.category = 'Categoria é obrigatória'
    }

    if (!formData.image.trim()) {
      newErrors.image = 'Imagem é obrigatória'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (validateForm()) {
      onSave({
        ...formData,
        features
      })
    }
  }

  const handleImageChange = (value: string) => {
    setFormData({ ...formData, image: value })
  }

  const [featuresInput, setFeaturesInput] = useState<string>('')
  const [features, setFeatures] = useState<string[]>([])
  const addFeature = () => {
    const v = featuresInput.trim()
    if (!v) return
    setFeatures(prev => [...prev, v])
    setFeaturesInput('')
  }
  const removeFeature = (idx: number) => setFeatures(prev => prev.filter((_, i) => i !== idx))

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <button type="button" onClick={() => setExpanded(prev => ({ ...prev, basics: !prev.basics }))} className="w-full flex items-center justify-between px-5 py-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center"><span className="mr-2">📦</span>Informações Básicas</h3>
          <span className="text-gray-500">{expanded.basics ? '−' : '+'}</span>
        </button>
        {expanded.basics && (
          <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto *</label>
              <input type="text" placeholder="Digite o nome do produto" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} disabled={isSubmitting} className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marca *</label>
              <input type="text" placeholder="Digite a marca" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} disabled={isSubmitting} className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.brand ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <button type="button" onClick={() => setExpanded(prev => ({ ...prev, description: !prev.description }))} className="w-full flex items-center justify-between px-5 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Descrição</h3>
          <span className="text-gray-500">{expanded.description ? '−' : '+'}</span>
        </button>
        {expanded.description && (
          <div className="px-5 pb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição do Produto *</label>
            <textarea placeholder="Descreva as características, benefícios e detalhes do produto..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} disabled={isSubmitting} rows={4} className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.description ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <button type="button" onClick={() => setExpanded(prev => ({ ...prev, pricing: !prev.pricing }))} className="w-full flex items-center justify-between px-5 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Preço e Categoria</h3>
          <span className="text-gray-500">{expanded.pricing ? '−' : '+'}</span>
        </button>
        {expanded.pricing && (
          <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço *</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">R$</span>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  value={formData.price > 0 ? formData.price : ''} 
                  onChange={(e) => {
                    const value = e.target.value
                    if (value === '') {
                      setFormData({ ...formData, price: 0 })
                    } else {
                      const numValue = parseFloat(value)
                      if (!isNaN(numValue)) {
                        setFormData({ ...formData, price: numValue })
                      }
                    }
                  }} 
                  disabled={isSubmitting} 
                  step="0.01" 
                  min="0.01" 
                  max="10000" 
                  className={`w-full pl-8 pr-3 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.price ? 'border-red-500' : 'border-gray-300'}`} 
                />
              </div>
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} disabled={isSubmitting} className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.category ? 'border-red-500' : 'border-gray-300'}`}>
                <option value="">Selecione uma categoria</option>
                {categoryOptions.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <button type="button" onClick={() => setExpanded(prev => ({ ...prev, media: !prev.media }))} className="w-full flex items-center justify-between px-5 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Imagem do Produto</h3>
          <span className="text-gray-500">{expanded.media ? '−' : '+'}</span>
        </button>
        {expanded.media && (
          <div className="px-5 pb-5">
            <ImageUploader 
              label="Imagem do Produto" 
              value={formData.image} 
              onChange={handleImageChange} 
              disabled={isSubmitting} 
            />
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <button type="button" onClick={() => setExpanded(prev => ({ ...prev, features: !prev.features }))} className="w-full flex items-center justify-between px-5 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Características</h3>
          <span className="text-gray-500">{expanded.features ? '−' : '+'}</span>
        </button>
        {expanded.features && (
          <div className="px-5 pb-5">
            <div className="flex gap-2 mb-3">
              <input type="text" placeholder="Ex.: Longa duração" value={featuresInput} onChange={(e) => setFeaturesInput(e.target.value)} disabled={isSubmitting} className="flex-1 px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <button type="button" onClick={addFeature} className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Adicionar</button>
            </div>
            {features.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {features.map((f, i) => (
                  <li key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2">
                    {f}
                    <button type="button" onClick={() => removeFeature(i)} className="text-gray-500 hover:text-red-600">×</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <button type="button" onClick={() => setExpanded(prev => ({ ...prev, settings: !prev.settings }))} className="w-full flex items-center justify-between px-5 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Configurações</h3>
          <span className="text-gray-500">{expanded.settings ? '−' : '+'}</span>
        </button>
        {expanded.settings && (
          <div className="px-5 pb-5 space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Em Estoque</div>
                <div className="text-sm text-gray-600">Produto disponível para venda</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={formData.inStock} onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })} disabled={isSubmitting} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-400"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Produto em Destaque</div>
                <div className="text-sm text-gray-600">
                  Aparecerá na seção de destaques
                  {featuredLimitReached && !formData.featured && (
                    <span className="ml-2 text-red-600 font-medium">(Limite de 3 atingido)</span>
                  )}
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={formData.featured} onChange={(e) => {
                  const value = e.target.checked
                  if (value && featuredLimitReached && !formData.featured) {
                    onShowError('Você já possui 3 produtos em destaque. Remova um antes de adicionar outro.')
                    return
                  }
                  setFormData({ ...formData, featured: value })
                }} disabled={isSubmitting} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <button type="button" onClick={onCancel} disabled={isSubmitting} className="px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2">
          {isSubmitting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
          <span>{isSubmitting ? 'Salvando...' : (product ? 'Atualizar' : 'Criar')} Produto</span>
        </button>
      </div>
    </form>
  )
}

// Componente do formulário de categoria
function CategoryForm({ 
  category, 
  onSave, 
  onCancel,
  isSubmitting,
  onShowError
}: { 
  category: Category | null
  onSave: (data: CategoryFormData) => void
  onCancel: () => void
  isSubmitting: boolean
  onShowError: (message: string) => void
}) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: category?.name || '',
    description: category?.description || '',
    icon: category?.icon || 'Tag',
    image: category?.image || '',
    color: category?.color || 'blue',
    isActive: category?.isActive !== undefined ? category.isActive : true
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [expanded, setExpanded] = useState<{ basics: boolean; appearance: boolean; settings: boolean }>({ basics: true, appearance: true, settings: true })

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        icon: category.icon || 'Tag',
        image: category.image || '',
        color: category.color || 'blue',
        isActive: category.isActive !== undefined ? category.isActive : true
      })
    } else {
      setFormData({
        name: '',
        description: '',
        icon: 'Tag',
        image: '',
        color: 'blue',
        isActive: true
      })
    }
    setErrors({})
  }, [category])

  const iconOptions = [
    'Tag', 'Package', 'Star', 'Heart', 'Eye', 'Palette', 'Brush', 'Sparkles',
    'Droplets', 'Sun', 'Moon', 'Zap', 'Shield', 'Crown', 'Gem', 'Flower'
  ]

  const colorOptions = [
    { value: 'blue', label: 'Azul', class: 'bg-blue-100 text-blue-800' },
    { value: 'green', label: 'Verde', class: 'bg-green-100 text-green-800' },
    { value: 'red', label: 'Vermelho', class: 'bg-red-100 text-red-800' },
    { value: 'yellow', label: 'Amarelo', class: 'bg-yellow-100 text-yellow-800' },
    { value: 'purple', label: 'Roxo', class: 'bg-purple-100 text-purple-800' },
    { value: 'pink', label: 'Rosa', class: 'bg-pink-100 text-pink-800' },
    { value: 'indigo', label: 'Índigo', class: 'bg-indigo-100 text-indigo-800' },
    { value: 'gray', label: 'Cinza', class: 'bg-gray-100 text-gray-800' }
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nome da categoria é obrigatório'
    } else if (formData.name.length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória'
    } else if (formData.description.length < 5) {
      newErrors.description = 'Descrição deve ter pelo menos 5 caracteres'
    }

    if (!formData.image) {
      newErrors.image = 'Imagem é obrigatória'
    }

    if (!formData.color) {
      newErrors.color = 'Cor é obrigatória'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (validateForm()) {
      onSave(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <button type="button" onClick={() => setExpanded(prev => ({ ...prev, basics: !prev.basics }))} className="w-full flex items-center justify-between px-5 py-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center"><Tag className="w-5 h-5 mr-2" />Informações Básicas</h3>
          <span className="text-gray-500">{expanded.basics ? '−' : '+'}</span>
        </button>
        {expanded.basics && (
          <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Categoria *</label>
              <input type="text" placeholder="Digite o nome da categoria" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} disabled={isSubmitting} className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <ImageUploader label="Imagem da Categoria" value={formData.image} onChange={(url) => setFormData({ ...formData, image: url })} disabled={isSubmitting} />
            </div>
            {/* Ícone removido do painel conforme solicitação */}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <button type="button" onClick={() => setExpanded(prev => ({ ...prev, appearance: !prev.appearance }))} className="w-full flex items-center justify-between px-5 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Aparência</h3>
          <span className="text-gray-500">{expanded.appearance ? '−' : '+'}</span>
        </button>
        {expanded.appearance && (
          <div className="px-5 pb-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">Cor do Tema *</label>
            <div className="grid grid-cols-4 gap-3">
              {colorOptions.map(color => (
                <label key={color.value} className={`relative cursor-pointer rounded-lg p-3 border-2 transition-all ${formData.color === color.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="color" value={color.value} checked={formData.color === color.value} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="sr-only" />
                  <div className="text-center">
                    <div className={`w-8 h-8 rounded-full mx-auto mb-2 ${color.class}`}></div>
                    <div className="text-sm font-medium text-gray-900">{color.label}</div>
                  </div>
                </label>
              ))}
            </div>
            {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color}</p>}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <button type="button" onClick={() => setExpanded(prev => ({ ...prev, settings: !prev.settings }))} className="w-full flex items-center justify-between px-5 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Configurações</h3>
          <span className="text-gray-500">{expanded.settings ? '−' : '+'}</span>
        </button>
        {expanded.settings && (
          <div className="px-5 pb-5 flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Categoria Ativa</div>
              <div className="text-sm text-gray-600">Categoria visível na loja</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} disabled={isSubmitting} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-400"></div>
            </label>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <button type="button" onClick={onCancel} disabled={isSubmitting} className="px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2">
          {isSubmitting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
          <span>{isSubmitting ? 'Salvando...' : (category ? 'Atualizar' : 'Criar')} Categoria</span>
        </button>
      </div>
    </form>
  )
}