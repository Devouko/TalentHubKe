'use client'

import { useState } from 'react'
import { useCart } from '../context/CartContext'
import CheckoutComponent from '@/components/CheckoutComponent'
import { Card, CardContent } from '@/components/ui/card'
import { ShoppingCart } from 'lucide-react'

export default function CheckoutPage() {
  const { cart, clearCart } = useCart()
  const [showSuccess, setShowSuccess] = useState(false)

  const handleBack = () => {
    window.history.back()
  }

  const handleSuccess = () => {
    setShowSuccess(true)
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
            <p className="text-muted-foreground mb-4">
              Your order has been placed and payment is being processed. You will receive a confirmation shortly.
            </p>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
            >
              Go to Dashboard
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-4">
              Add some products to your cart before proceeding to checkout.
            </p>
            <button
              onClick={() => window.location.href = '/products'}
              className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
            >
              Browse Products
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4">
        <CheckoutComponent
          cart={cart}
          onBack={handleBack}
          onSuccess={handleSuccess}
          clearCart={clearCart}
        />
      </div>
    </div>
  )
}