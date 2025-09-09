import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Buscar produto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Erro ao buscar produto:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar produto
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Criar objeto de dados apenas com os campos fornecidos
    const updateData: any = {}
    
    if (body.name !== undefined) updateData.name = body.name
    if (body.description !== undefined) updateData.description = body.description
    if (body.price !== undefined) updateData.price = parseFloat(body.price)
    if (body.category !== undefined) updateData.category = body.category
    if (body.brand !== undefined) updateData.brand = body.brand
    if (body.image !== undefined) updateData.image = body.image
    if (body.images !== undefined) updateData.images = body.images
    if (body.features !== undefined) updateData.features = JSON.stringify(body.features)
    if (body.inStock !== undefined) updateData.inStock = body.inStock
    if (body.featured !== undefined) updateData.featured = body.featured

    // Validar limite de no máximo 3 produtos em destaque ao ativar featured
    if (body.featured === true) {
      const featuredCount = await prisma.product.count({
        where: { featured: true, NOT: { id: params.id } }
      })
      if (featuredCount >= 3) {
        return NextResponse.json(
          { error: 'Limite de 3 produtos em destaque atingido' },
          { status: 400 }
        )
      }
    }

    // Se não há dados para atualizar, retornar erro
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'Nenhum campo fornecido para atualização' },
        { status: 400 }
      )
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Erro ao atualizar produto:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar produto
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.product.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Produto deletado com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar produto:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
