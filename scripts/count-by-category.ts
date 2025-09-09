import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const categories = ['Batom', 'Sombras', 'Base']
  for (const c of categories) {
    const count = await prisma.product.count({ where: { category: c } })
    console.log(`${c}: ${count}`)
  }
  const total = await prisma.product.count()
  console.log(`Total: ${total}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
