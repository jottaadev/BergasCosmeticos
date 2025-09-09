import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar categorias de exemplo
  const categories = [
    {
      name: 'Batom',
      description: 'Texturas matte, cremosa e brilho para todos os estilos',
      icon: 'Heart',
      image: 'https://images.unsplash.com/photo-1585238341647-7995b8cfb6fe?w=900&h=600&fit=crop',
      color: 'pink',
      isActive: true,
    },
    {
      name: 'Sombras',
      description: 'Paletas e unitárias com alta pigmentação e fixação',
      icon: 'Palette',
      image: 'https://images.unsplash.com/photo-1512288094938-363287817259?w=900&h=600&fit=crop',
      color: 'purple',
      isActive: true,
    },
    {
      name: 'Base',
      description: 'Cobertura leve a alta para diferentes tipos de pele',
      icon: 'Droplets',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=900&h=600&fit=crop',
      color: 'blue',
      isActive: true,
    },
  ]

  // Limpar categorias existentes
  await prisma.category.deleteMany()
  console.log('🗑️ Categorias existentes removidas')

  // Criar novas categorias
  for (const category of categories) {
    await prisma.category.create({ data: category })
    console.log(`✅ Categoria criada: ${category.name}`)
  }

  // Criar produtos de exemplo (3 para cada categoria)
  const products = [
    {
      name: 'Batom Matte Premium',
      description: 'Batom de longa duração com acabamento matte. Formulado com ingredientes de alta qualidade, oferece cobertura intensa e durabilidade de até 8 horas.',
      price: 89.90,
      category: 'Batom',
      brand: 'BergasCosmeticos',
      image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=600&fit=crop'
      ]),
      features: JSON.stringify(['Acabamento matte', 'Alta pigmentação', 'Até 8h de duração']),
      inStock: true,
      featured: true
    },
    {
      name: 'Paleta de Sombras',
      description: 'Paleta com 12 cores vibrantes e pigmentadas. Cores intensas e duradouras para criar looks incríveis.',
      price: 149.90,
      category: 'Sombras',
      brand: 'BergasCosmeticos',
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=600&fit=crop',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop'
      ]),
      features: JSON.stringify(['12 cores', 'Alta fixação', 'Texturas matte e shimmer']),
      inStock: true,
      featured: true
    },
    {
      name: 'Base Líquida',
      description: 'Base de alta cobertura e longa duração. Proporciona acabamento natural e uniforme.',
      price: 129.90,
      category: 'Base',
      brand: 'BergasCosmeticos',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop'
      ]),
      features: JSON.stringify(['Alta cobertura', 'Acabamento natural', 'Longa duração']),
      inStock: true,
      featured: false
    },
    // Itens adicionais por categoria
    {
      name: 'Batom Cremoso Conforto',
      description: 'Textura cremosa que hidrata e colore os lábios com conforto.',
      price: 79.90,
      category: 'Batom',
      brand: 'BergasCosmeticos',
      image: 'https://images.unsplash.com/photo-1585238341647-7995b8cfb6fe?w=600&h=600&fit=crop',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1585238341647-7995b8cfb6fe?w=600&h=600&fit=crop'
      ]),
      features: JSON.stringify(['Hidratação', 'Brilho suave', 'Conforto extremo']),
      inStock: true,
      featured: false
    },
    {
      name: 'Batom Gloss Brilho Intenso',
      description: 'Efeito vinil com brilho intenso e sensação de lábios volumosos.',
      price: 69.90,
      category: 'Batom',
      brand: 'BergasCosmeticos',
      image: 'https://images.unsplash.com/photo-1617043983671-adaad6a3484a?w=600&h=600&fit=crop',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1617043983671-adaad6a3484a?w=600&h=600&fit=crop'
      ]),
      features: JSON.stringify(['Brilho vinil', 'Efeito volume', 'Não pegajoso']),
      inStock: true,
      featured: false
    },
    {
      name: 'Sombras Unitárias Ultra Pigmento',
      description: 'Sombras individuais com pigmentação intensa e toque aveludado.',
      price: 39.90,
      category: 'Sombras',
      brand: 'BergasCosmeticos',
      image: 'https://images.unsplash.com/photo-1512288094938-363287817259?w=600&h=600&fit=crop',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1512288094938-363287817259?w=600&h=600&fit=crop'
      ]),
      features: JSON.stringify(['Alta pigmentação', 'Aveludado', 'Longa duração']),
      inStock: true,
      featured: false
    },
    {
      name: 'Sombras Glitter Holo',
      description: 'Textura cremosa com glitter holográfico para looks ousados.',
      price: 59.90,
      category: 'Sombras',
      brand: 'BergasCosmeticos',
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=600&fit=crop',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=600&fit=crop'
      ]),
      features: JSON.stringify(['Efeito holográfico', 'Textura cremosa', 'Fácil aplicação']),
      inStock: true,
      featured: false
    },
    {
      name: 'Base Fluida Leve',
      description: 'Cobertura leve, uniformiza o tom e deixa a pele respirar.',
      price: 99.90,
      category: 'Base',
      brand: 'BergasCosmeticos',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop'
      ]),
      features: JSON.stringify(['Cobertura leve', 'Acabamento natural', 'Respirável']),
      inStock: true,
      featured: false
    },
    {
      name: 'Base Matte Antioleosidade',
      description: 'Controle de oleosidade por até 12h, toque seco e confortável.',
      price: 119.90,
      category: 'Base',
      brand: 'BergasCosmeticos',
      image: 'https://images.unsplash.com/photo-1597305877032-195ff2da2e8d?w=600&h=600&fit=crop',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1597305877032-195ff2da2e8d?w=600&h=600&fit=crop'
      ]),
      features: JSON.stringify(['Toque seco', 'Antioleosidade', 'Até 12h']),
      inStock: true,
      featured: false
    }
  ]

  // Limpar produtos existentes
  await prisma.product.deleteMany()
  console.log('🗑️ Produtos existentes removidos')

  // Criar novos produtos
  for (const product of products) {
    await prisma.product.create({
      data: product
    })
    console.log(`✅ Produto criado: ${product.name}`)
  }

  console.log('🎉 Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
