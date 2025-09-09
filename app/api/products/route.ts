import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar todos os produtos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryParam = searchParams.get('category') || searchParams.get('categoria')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const limitParam = searchParams.get('limit')

    let whereClause: any = {}

    if (categoryParam && categoryParam !== 'all') {
      whereClause.category = categoryParam
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (featured === 'true') {
      whereClause.featured = true
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      // Quando buscando destaques, limitar a no máximo 3 itens
      take: featured === 'true' ? 3 : (limitParam ? Math.min(parseInt(limitParam, 10) || 0, 100) : undefined)
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar novo produto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar limite de no máximo 3 produtos em destaque
    if (body.featured === true) {
      const featuredCount = await prisma.product.count({ where: { featured: true } })
      if (featuredCount >= 3) {
        return NextResponse.json(
          { error: 'Limite de 3 produtos em destaque atingido' },
          { status: 400 }
        )
      }
    }

    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: parseFloat(body.price),
        category: body.category,
        brand: body.brand,
        image: body.image,
        images: body.images || JSON.stringify([body.image]),
        features: body.features ? JSON.stringify(body.features) : null,
        inStock: body.inStock !== undefined ? body.inStock : true,
        featured: body.featured !== undefined ? body.featured : false
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar produto:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
