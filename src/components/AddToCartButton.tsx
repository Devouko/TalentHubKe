'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Check } from 'lucide-react'
import { useCart } from '@/app/context/CartContext'
import { CartItem } from '@/app/types/cart.types'
import { toast } from 'sonner'

interface AddToCartButtonProps {
  product: {
    id: string
    title: string
    price: number
    images: string[]
  }
  className?: string
}

export default function AddToCartButton({ product, className = '' }: AddToCartButtonProps) {
  const { addToCart } = useCart()
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = async () => {
    try {
      setIsAdding(true)
      
      const cartItem: CartItem = {
        id: product.id,
        gigId: product.id,
        title: product.title,
        seller: 'Digital Store',
        price: product.price,
        quantity: 1,
        deliveryTime: 0,
        thumbnail: product.images[0] || '',
        tier: 'basic'
      }
      
      await addToCart(cartItem)
      setIsAdding(false)
      setIsAdded(true)
      
      toast.success('Added to cart!')
      
      setTimeout(() => {
        setIsAdded(false)
        router.push('/checkout')
      }, 1000)
    } catch (error) {
      console.error('Add to cart failed:', error)
      setIsAdding(false)
      toast.error('Failed to add to cart. Please try again.')
    }
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding}
      className={`flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 ${className} ${isAdded ? 'bg-green-600 hover:bg-green-600' : ''}`}
    >
      {isAdding ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
      ) : isAdded ? (
        <Check className="w-4 h-4" />
      ) : (
        <ShoppingCart className="w-4 h-4" />
      )}
      {isAdding ? 'Adding...' : isAdded ? 'Added!' : 'Add to Cart'}
    </button>
  )
}