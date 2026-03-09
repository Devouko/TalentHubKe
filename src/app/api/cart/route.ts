import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { addToCartSchema, removeFromCartSchema } from '@/lib/validations/cart'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ cart: [] })
    }

    const cart = await prisma.cart.findMany({
      where: { userId: session.user.id },
      include: {
        products: {
          select: {
            id: true,
            title: true,
            price: true,
            images: true,
            stock: true
          }
        }
      }
    }).catch(() => [])

    return NextResponse.json({ cart: cart || [] })
  } catch (error) {
    console.error('Cart fetch error:', error)
    return NextResponse.json({ cart: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    console.log('Cart POST request body:', body)
    
    const validatedData = addToCartSchema.parse(body)
    console.log('Validated data:', validatedData)
    
    const product = await prisma.products.findUnique({
      where: { id: validatedData.productId },
      select: { id: true, stock: true, title: true, price: true, category: true }
    })
    
    console.log('Product found:', product)
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    // For digital products (Accounts, fashion, etc.), skip stock check
    // Only check stock for physical products with actual inventory
    const isDigitalProduct = ['Accounts', 'fashion', 'Digital Products'].includes(product.category || '')
    
    if (!isDigitalProduct && product.stock !== null && product.stock !== undefined && product.stock < validatedData.quantity) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 })
    }

    const cartItem = await prisma.cart.upsert({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: validatedData.productId
        }
      },
      update: { 
        quantity: validatedData.quantity,
        updatedAt: new Date()
      },
      create: {
        id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: session.user.id,
        productId: validatedData.productId,
        quantity: validatedData.quantity,
        updatedAt: new Date()
      },
      include: {
        products: {
          select: {
            id: true,
            title: true,
            price: true,
            images: true
          }
        }
      }
    })

    console.log('Cart item created:', cartItem)

    return NextResponse.json({ 
      success: true,
      cartItem,
      message: 'Item added to cart'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors)
      return NextResponse.json({ 
        error: 'Validation failed',
        details: error.errors
      }, { status: 400 })
    }
    
    console.error('Cart add error:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json({ 
      error: 'Failed to add to cart',
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    const validatedData = removeFromCartSchema.parse({ productId })

    await prisma.cart.delete({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: validatedData.productId
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation failed',
        details: error.errors
      }, { status: 400 })
    }
    
    console.error('Cart remove error:', error)
    return NextResponse.json({ 
      error: 'Failed to remove from cart',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 })
  }
}
