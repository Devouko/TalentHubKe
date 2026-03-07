import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

/**
 * PATCH /api/sellers/[id] - Update seller status
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json()
    const sellerId = params.id

    const updatedUser = await prisma.user.update({
      where: { id: sellerId },
      data: {
        sellerStatus: status.toUpperCase()
      }
    })

    return NextResponse.json({ 
      message: 'Seller status updated successfully',
      seller: {
        id: updatedUser.id,
        status: updatedUser.sellerStatus.toLowerCase()
      }
    })
  } catch (error) {
    console.error('Error updating seller status:', error)
    return NextResponse.json({ error: 'Failed to update seller status' }, { status: 500 })
  }
}