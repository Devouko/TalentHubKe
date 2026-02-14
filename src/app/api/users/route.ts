import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/users
 * Fetches all users or a specific user by ID from the database
 * @param {Request} request - Request object with optional id query parameter
 * @returns {Promise<NextResponse>} JSON response with users array or single user
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const type = searchParams.get('type')
    
    if (id) {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          userType: true,
          phoneNumber: true,
          createdAt: true,
          updatedAt: true
        }
      })
      
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
      
      return NextResponse.json(user)
    }
    
    let whereClause = {}
    if (type === 'talent') {
      whereClause = { userType: { in: ['FREELANCER', 'AGENCY'] } }
    }
    
    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        userType: true,
        phoneNumber: true,
        bio: true,
        profileImage: true,
        county: true,
        sellerStatus: true,
        createdAt: true,
        updatedAt: true,
        gigs: {
          select: {
            id: true,
            title: true,
            price: true,
            rating: true,
            reviewCount: true,
            orderCount: true,
            category: true,
            tags: true
          },
          where: { isActive: true },
          take: 3
        },
        _count: {
          select: {
            gigs: true,
            orders: true,
            reviews: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

/**
 * POST /api/users
 * Creates a new user in the database
 * @param {Request} request - Request object containing user data
 * @returns {Promise<NextResponse>} JSON response with created user
 */
export async function POST(request: Request) {
  try {
    const userData = await request.json()
    
    const newUser = await prisma.user.create({
      data: userData,
      select: {
        id: true,
        name: true,
        email: true,
        userType: true,
        createdAt: true
      }
    })
    
    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}

/**
 * PUT /api/users
 * Updates an existing user in the database
 * @param {Request} request - Request object with id query parameter and user data
 * @returns {Promise<NextResponse>} JSON response with updated user
 */
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }
    
    const userData = await request.json()
    
    const updatedUser = await prisma.user.update({
      where: { id },
      data: userData,
      select: {
        id: true,
        name: true,
        email: true,
        userType: true,
        updatedAt: true
      }
    })
    
    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

/**
 * DELETE /api/users
 * Deletes a user from the database
 * @param {Request} request - Request object with id query parameter
 * @returns {Promise<NextResponse>} JSON response confirming deletion
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }
    
    await prisma.user.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}