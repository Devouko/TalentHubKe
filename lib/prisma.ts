import { PrismaClient } from '@prisma/client'

/**
 * Global Prisma client instance
 * Prevents multiple instances in development due to hot reloading
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Prisma client singleton
 * Uses global instance in development, new instance in production
 */
export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

/**
 * Gracefully disconnect from database on process termination
 */
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})