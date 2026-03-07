import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handleApiError, requireAdmin, apiResponse } from '@/lib/api-utils'

export async function GET() {
  try {
    const categories = await prisma.categories.findMany({
      orderBy: { name: 'asc' }
    })
    return apiResponse(categories)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const data = await req.json()
    const category = await prisma.categories.create({ 
      data: { ...data, id: crypto.randomUUID() } 
    })
    return apiResponse(category)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin()
    const { id, ...data } = await req.json()
    const category = await prisma.categories.update({ where: { id }, data })
    return apiResponse(category)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) throw new Error('ID required')

    await prisma.categories.delete({ where: { id } })
    return apiResponse({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}
