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
  const [isLoadingCart, setIsLoadingCart] = useState(true)
  const [useEscrow, setUseEscrow] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  useEffect(() => {
    if (!session) {
      router.push('/auth')
      return
    }
    
    const loadCart = async () => {
      setIsLoadingCart(true)
      console.log('Loading cart on checkout page...')
      try {
        await refreshCart()
        console.log('Cart refreshed, items:', cart.length)
      } catch (error) {
        console.error('Failed to load cart:', error)
      } finally {
        // Add delay to ensure cart state updates
        setTimeout(() => {
          setIsLoadingCart(false)
        }, 500)
      }
    }
    
    loadCart()
  }, [session, refreshCart])

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
          shippingAddress: notes || 'Digital delivery',
          useEscrow
        })
      })

      const orderData = await orderResponse.json()

      if (!orderResponse.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to create order')
      }

      if (useEscrow) {
        const escrowResponse = await fetch('/api/escrow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: orderData.order.id,
            amount: Math.round(total),
            sellerId: orderData.order.sellerId || session.user.id
          })
        })

        const escrowData = await escrowResponse.json()
        if (!escrowResponse.ok) {
          throw new Error(escrowData.error || 'Failed to create escrow')
        }
      }

      const mpesaResponse = await fetch('/api/mpesa/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone,
          amount: Math.round(total),
          orderId: orderData.order.id,
          description: `Order #${orderData.order.id.slice(-8)}${useEscrow ? ' (Escrow)' : ''}`
        })
      })

      const mpesaData = await mpesaResponse.json()

      if (mpesaResponse.ok && mpesaData.success) {
        toast.success(useEscrow ? 'Payment sent to escrow! Funds will be released after delivery.' : 'Payment request sent! Check your phone for M-Pesa prompt.')
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

  if (!session || isLoadingCart) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your cart...</p>
        </div>
      </div>
    )
  }

  console.log('Rendering checkout with cart:', cart)

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

  const steps = [
    { number: 1, title: 'Review Cart', icon: ShoppingCart },
    { number: 2, title: 'Payment Details', icon: CreditCard },
    { number: 3, title: 'Confirm & Pay', icon: CheckCircle }
  ]

  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < currentStep) return 'completed'
    if (stepNumber === currentStep) return 'active'
    return 'pending'
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold mb-6">Checkout</h1>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between max-w-3xl mx-auto mb-8">
            {steps.map((step, index) => {
              const status = getStepStatus(step.number)
              const StepIcon = step.icon
              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                      status === 'active' 
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-200' 
                        : status === 'completed'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {status === 'completed' ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <StepIcon className="w-6 h-6" />
                      )}
                    </div>
                    <span className={`text-sm mt-2 font-medium text-center ${
                      status === 'active' ? 'text-emerald-600' : status === 'completed' ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-1 flex-1 mx-4 rounded transition-all ${
                      status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {currentStep === 1 && (
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Review Your Cart ({cart.length} items)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 border rounded-lg hover:border-emerald-500 transition-colors">
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
                        <p className="text-lg font-bold mt-1 text-emerald-600">KES {item.price.toLocaleString()}</p>
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
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
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
                  <Button onClick={() => setCurrentStep(2)} className="w-full" size="lg">
                    Continue to Payment
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === 2 && (
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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

                  <div className="flex items-start gap-3 p-4 border rounded-lg bg-emerald-50">
                    <input
                      type="checkbox"
                      id="escrow"
                      checked={useEscrow}
                      onChange={(e) => setUseEscrow(e.target.checked)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label htmlFor="escrow" className="cursor-pointer font-semibold">
                        Use Escrow Protection
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your payment will be held securely until you confirm delivery. Adds extra protection for your purchase.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
                      Back to Cart
                    </Button>
                    <Button onClick={() => setCurrentStep(3)} disabled={!phoneValid} className="flex-1">
                      Review Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === 3 && (
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Confirm Your Order
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold">Order Summary</h3>
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.title} x {item.quantity}</span>
                        <span className="font-medium">KES {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">Payment Method:</span>
                      <span>M-Pesa ({phoneNumber})</span>
                    </div>
                    {useEscrow && (
                      <div className="flex items-center gap-2 text-sm text-emerald-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>Escrow Protection Enabled</span>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleCheckout} className="space-y-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      size="lg"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                          Processing Payment...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          Pay KES {total.toLocaleString()} via M-Pesa
                        </div>
                      )}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setCurrentStep(2)} className="w-full">
                      Back to Payment Details
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

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
                  {useEscrow && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Escrow protection enabled</span>
                    </div>
                  )}
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