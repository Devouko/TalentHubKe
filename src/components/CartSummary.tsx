'use client'

import { useCart } from '../app/context/CartContext'
import { ShoppingCart, X } from 'lucide-react'

export default function CartSummary() {
  const { cart, total, removeFromCart, updateQuantity, goToCheckout } = useCart()

  if (cart.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 border border-gray-700 rounded-lg p-4 max-w-sm z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold flex items-center gap-2">
          <ShoppingCart className="w-4 h-4" />
          Cart ({cart.length})
        </h3>
      </div>
      
      <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
        {cart.slice(0, 3).map((item) => (
          <div key={item.id} className="flex items-center justify-between text-sm">
            <span className="truncate flex-1">{item.title}</span>
            <div className="flex items-center gap-2">
              <span>x{item.quantity}</span>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-400 hover:text-red-300"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
        {cart.length > 3 && (
          <div className="text-xs text-gray-400">
            +{cart.length - 3} more items
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-700 pt-3">
        <div className="flex justify-between items-center mb-3">
          <span className="font-semibold">Total: KES {total.toLocaleString()}</span>
        </div>
        <button
          onClick={goToCheckout}
          className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded text-sm font-medium"
        >
          Checkout
        </button>
      </div>
    </div>
  )
}