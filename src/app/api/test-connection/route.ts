import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    await prisma.$connect()
    const userCount = await prisma.user.count()
    
    return NextResponse.json({
      status: 'Connected',
      userCount,
      message: 'Database connection successful'
    })
  } catch (error: any) {
    console.error('Database connection error:', error)
    
    return NextResponse.json({
      status: 'Error',
      message: error.message || 'Database connection failed'
    }, { status: 500 })
  }
}