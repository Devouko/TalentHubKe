'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCart } from '../context/CartContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Textarea } from '@/app/components/ui/textarea'
import { ShoppingCart, ArrowLeft, Phone, CheckCircle, CreditCard, Trash2, Plus, Minus, Package, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

export default function CheckoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { cart, removeFromCart, updateQuantity, total, clearCart, refreshCart } = useCart()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [phoneValid, setPhoneValid] = useState(false)

  useEffect(() => {
    if (!session) {
      router.push('/auth')
      return
    }
    refreshCart()
  }, [session])

  useEffect(() => {
    const kenyanPhoneRegex = /^(254|0)[17]\d{8}$/
    const cleanPhone = phoneNumber.replace(/\s/g, '')
    setPhoneValid(kenyanPhoneRegex.test(cleanPhone))
  }, [phoneNumber])

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    await updateQuantity(productId, newQuantity)
    toast.success('Quantity updated')
  }

  const handleRemove = async (productId: string) => {
    await removeFromCart(productId)
    toast.success('Item removed from cart')
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phoneValid || loading) return

    setLoading(true)
    try {
      const cleanPhone = phoneNumber.replace(/\s/g, '')

      const orderResponse = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(item => ({
            id: item.id,
            productId: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity
          })),
          phoneNumber: cleanPhone,
          shippingAddress: notes || 'Digital delivery'
        })
      })

      const orderData = await orderResponse.json()

      if (!orderResponse.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to create order')
      }

      const mpesaResponse = await fetch('/api/mpesa/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone,
          amount: Math.round(total),
          orderId: orderData.order.id,
          description: `Order #${orderData.order.id.slice(-8)}`
        })
      })

      const mpesaData = await mpesaResponse.json()

      if (mpesaResponse.ok && mpesaData.success) {
        toast.success('Payment request sent! Check your phone for M-Pesa prompt.')
        await clearCart()
        router.push('/orders')
      } else {
        throw new Error(mpesaData.error || 'Payment initiation failed')
      }
    } catch (error: any) {
      console.error('Checkout error:', error)
      toast.error(error.message || 'Checkout failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return null
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Add some products to your cart before proceeding to checkout.
            </p>
            <Button onClick={() => router.push('/products')} className="w-full">
              Browse Products
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-muted-foreground mt-2">{cart.length} item(s) in cart</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Cart Items ({cart.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                    <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0">
                      {item.thumbnail ? (
                        <Image src={item.thumbnail} alt={item.title} width={80} height={80} className="w-full h-full object-cover rounded" />
                      ) : (
                        <Package className="w-full h-full p-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.category || 'Digital Product'}</p>
                      <p className="text-lg font-bold mt-1">KES {item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(item.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <div className="flex items-center gap-2 border rounded">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCheckout} className="space-y-4">
                  <div>
                    <Label htmlFor="phone">M-Pesa Phone Number *</Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="pl-10"
                        placeholder="254712345678"
                        required
                      />
                      {phoneValid && (
                        <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                      )}
                    </div>
                    {phoneNumber && !phoneValid && (
                      <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Enter a valid Kenyan phone number
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="notes">Order Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any special requirements..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={!phoneValid || loading}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Pay KES {total.toLocaleString()}
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>KES {total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Processing Fee</span>
                    <span>KES 0</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>KES {total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Secure M-Pesa payment</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Instant order confirmation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Digital delivery</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}