import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handleApiError, requireAdmin, apiResponse } from '@/lib/api-utils'

export async function GET() {
  try {
    await requireAdmin()

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

    return apiResponse(users)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const { email, name, userType, password } = await request.json()
    
    const user = await prisma.users.create({
      data: { email, name, userType, password, id: crypto.randomUUID() }
    })

    return apiResponse(user)
  } catch (error) {
    return handleApiError(error)
  }
}
