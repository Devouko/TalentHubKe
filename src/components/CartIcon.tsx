'use client'

import { ShoppingCart } from 'lucide-react'
import { useCart } from '../app/context/CartContext'
import { useRouter } from 'next/navigation'

export default function CartIcon() {
  const { cart, goToCheckout } = useCart()
  const router = useRouter()

  if (cart.length === 0) return null

  return (
    <button
      onClick={goToCheckout}
      className="relative p-2 text-white hover:text-gray-300"
    >
      <ShoppingCart className="w-6 h-6" />
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
        {cart.length}
      </span>
    </button>
  )
}