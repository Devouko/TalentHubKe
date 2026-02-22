const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkProducts() {
  try {
    const count = await prisma.product.count()
    console.log('Total products in DB:', count)
    
    const activeCount = await prisma.product.count({ where: { isActive: true } })
    console.log('Active products:', activeCount)
    
    const products = await prisma.product.findMany({ take: 5 })
    console.log('\nFirst 5 products:')
    products.forEach(p => {
      console.log(`- ${p.title} (${p.category}) - Active: ${p.isActive}`)
    })
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkProducts()
