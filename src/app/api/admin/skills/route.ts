import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handleApiError, requireAdmin, apiResponse } from '@/lib/api-utils'

export async function GET() {
  try {
    await requireAdmin()

    // Skills table doesn't exist in current schema, returning empty array
    // To fix properly, add skills model to schema.prisma
    return apiResponse({ skills: [] })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    // const { name, category, description } = await request.json()
    // return apiResponse({ success: true, skill: {} })
    throw new Error('Skills feature not yet available in database schema')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin()
    throw new Error('Skills feature not yet available in database schema')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin()
    throw new Error('Skills feature not yet available in database schema')
  } catch (error) {
    return handleApiError(error)
  }
}
