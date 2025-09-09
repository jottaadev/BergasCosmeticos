'use client'

import { Categories } from '@/components/Categories'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export default function CategoriasPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Categories />
      </div>
      <Footer />
    </div>
  )
}



