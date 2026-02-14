import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`
    
    // Check Redis connection if configured
    let redisStatus = 'not_configured'
    if (process.env.UPSTASH_REDIS_REST_URL) {
      try {
        const { redis } = await import('@/lib/redis')
        await redis.ping()
        redisStatus = 'healthy'
      } catch {
        redisStatus = 'unhealthy'
      }
    }

    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'healthy',
        redis: redisStatus,
      },
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV,
    }

    return NextResponse.json(health, { status: 200 })
  } catch (error) {
    const health = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      services: {
        database: 'unhealthy',
        redis: 'unknown',
      },
    }

    return NextResponse.json(health, { status: 503 })
  }
}