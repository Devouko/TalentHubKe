import { PrismaClient } from '@prisma/client'
import { logger } from './logger'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'production' 
      ? ['error', 'warn']
      : ['query', 'info', 'warn', 'error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    errorFormat: 'pretty',
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Connection monitoring
prisma.$on('query', (e) => {
  if (process.env.NODE_ENV !== 'production') {
    logger.debug('Database Query', {
      query: e.query,
      params: e.params,
      duration: `${e.duration}ms`,
    })
  }
  
  // Log slow queries in production
  if (e.duration > 1000) {
    logger.error('Slow Database Query', {
      duration: `${e.duration}ms`,
      query: e.query.substring(0, 100) + '...'
    })
  }
})

prisma.$on('error', (e) => {
  logger.error('Database Error', {
    message: e.message,
    target: e.target,
  })
})

// Health check function
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    logger.error('Database health check failed', { error })
    return false
  }
}