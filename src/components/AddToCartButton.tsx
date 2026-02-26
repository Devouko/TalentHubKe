'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Check, Loader2 } from 'lucide-react'
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
  redirectToCheckout?: boolean
}

export default function AddToCartButton({ product, className = '', redirectToCheckout = false }: AddToCartButtonProps) {
  const { addToCart, refreshCart } = useCart()
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isAdding || isAdded) return
    
    setIsAdding(true)
    
    try {
      const cartItem: CartItem = {
        id: product.id,
        gigId: product.id,
        title: product.title,
        seller: 'Digital Store',
        price: product.price,
        quantity: 1,
        deliveryTime: 0,
        thumbnail: product.images[0] || '',
        tier: 'basic',
        category: 'Digital Products'
      }
      
      await addToCart(cartItem)
      await refreshCart()
      
      setIsAdded(true)
      
      if (redirectToCheckout) {
        setTimeout(() => {
          router.push('/checkout')
        }, 1000)
      } else {
        setTimeout(() => {
          setIsAdded(false)
        }, 2000)
      }
    } catch (error: any) {
      console.error('Add to cart failed:', error)
      if (!error.message?.includes('authenticated')) {
        toast.error('Failed to add to cart')
      }
      setIsAdded(false)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={isAdding || isAdded}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isAdded ? 'bg-green-600 hover:bg-green-600' : 'bg-blue-600 hover:bg-blue-700'} text-white ${className}`}
    >
      {isAdding ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Adding...</span>
        </>
      ) : isAdded ? (
        <>
          <Check className="w-4 h-4" />
          <span>Added!</span>
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4" />
          <span>Add to Cart</span>
        </>
      )}
    </button>
  )
}