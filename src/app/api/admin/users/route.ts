import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.userType !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const users = await prisma.users.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        userType: true,
        isVerified: true,
        createdAt: true,
        balance: true,
        phoneNumber: true,
        county: true,
        sellerStatus: true,
        sellerRating: true,
        _count: {
          select: {
            orders: true,
            gigs: true,
            products: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Users fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.userType !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { email, name, userType, password } = await request.json()
    
    const user = await prisma.users.create({
      data: { email, name, userType, password, id: crypto.randomUUID() }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('User creation error:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}
