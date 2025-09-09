import { useState, useEffect } from 'react'

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

interface UseCategoriesOptions {
  activeOnly?: boolean
}

export function useCategories(options: UseCategoriesOptions = {}) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/categories')
      
      if (!response.ok) {
        throw new Error('Erro ao carregar categorias')
      }
      
      const data = await response.json()
      
      let filteredCategories = data
      if (options.activeOnly) {
        filteredCategories = data.filter((cat: Category) => cat.isActive)
      }
      
      setCategories(filteredCategories)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const createCategory = async (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao criar categoria')
      }

      const newCategory = await response.json()
      setCategories(prev => [...prev, newCategory])
      return newCategory
    } catch (err) {
      throw err
    }
  }

  const updateCategory = async (id: string, categoryData: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao atualizar categoria')
      }

      const updatedCategory = await response.json()
      setCategories(prev => 
        prev.map(cat => cat.id === id ? updatedCategory : cat)
      )
      return updatedCategory
    } catch (err) {
      throw err
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao excluir categoria')
      }

      setCategories(prev => prev.filter(cat => cat.id !== id))
    } catch (err) {
      throw err
    }
  }

  const toggleActive = async (id: string) => {
    const category = categories.find(cat => cat.id === id)
    if (!category) return

    try {
      await updateCategory(id, { isActive: !category.isActive })
    } catch (err) {
      throw err
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleActive,
    refetch: fetchCategories
  }
}
