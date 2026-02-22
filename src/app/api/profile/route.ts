import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { z } from 'zod'

const profileSelect = {
  id: true,
  name: true,
  email: true,
  phoneNumber: true,
  county: true,
  bio: true,
  profileImage: true,
  isVerified: true,
  sellerStatus: true,
  userType: true
} satisfies Prisma.UserSelect

const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional().nullable(),
  county: z.string().max(100).optional().nullable(),
  bio: z.string().max(500).optional().nullable(),
  profileImage: z.string().url().optional().nullable()
})

export async function GET() {
  const { error, session } = await requireAuth()
  if (error) return error

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: session!.user.id },
      select: profileSelect
    })

    return NextResponse.json(user)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const { error, session } = await requireAuth()
  if (error) return error

  try {
    const body = await req.json()
    const validatedData = updateProfileSchema.parse(body)

    const updatedUser = await prisma.user.update({
      where: { id: session!.user.id },
      data: validatedData,
      select: profileSelect
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
