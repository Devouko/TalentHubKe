'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { ArrowLeft, Phone, CheckCircle, CreditCard, ShoppingBag, MessageCircle } from 'lucide-react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface CheckoutProps {
  cart: any[]
  onBack: () => void
  onSuccess: () => void
  clearCart: () => void
}

export default function CheckoutComponent({ cart, onBack, onSuccess, clearCart }: CheckoutProps) {
  const { data: session } = useSession()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [phoneValid, setPhoneValid] = useState(false)
  const [phoneError, setPhoneError] = useState('')

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  useEffect(() => {
    const kenyanPhoneRegex = /^(254|0)[17]\d{8}$/
    if (phoneNumber) {
      const isValid = kenyanPhoneRegex.test(phoneNumber.replace(/\s/g, ''))
      setPhoneValid(isValid)
      setPhoneError(isValid ? '' : 'Enter a valid Kenyan phone number')
    } else {
      setPhoneValid(false)
      setPhoneError('')
    }
  }, [phoneNumber])

  const handleWhatsAppOrder = () => {
    const itemsList = cart.map(item => 
      `• ${item.title} (Qty: ${item.quantity}) - KES ${(item.price * item.quantity).toLocaleString()}`
    ).join('\n')
    
    const message = `Hi! I'd like to place an order:

📦 *ORDER DETAILS*
${itemsList}

💰 *Total: KES ${total.toLocaleString()}*

Please confirm availability and payment options.`
    
    const whatsappNumber = cart.find(item => item.whatsappNumber)?.whatsappNumber || '254712345678'
    const phoneNumber = whatsappNumber.replace(/[^0-9]/g, '')
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    
    window.open(whatsappUrl, '_blank')
  }

  const handleSubmit = async (e: React.FormEvent) => {
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
        alert('✅ Payment request sent! Check your phone and enter M-Pesa PIN to complete payment.')
        await clearCart()
        onSuccess()
      } else {
        throw new Error(mpesaData.error || 'Payment initiation failed')
      }
    } catch (error: any) {
      console.error('Checkout error:', error)
      alert(`❌ ${error.message || 'Checkout failed'}. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-medium">Processing your order...</p>
          <p className="text-muted-foreground">Please wait while we create your order</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </Button>
        <h2 className="text-2xl font-bold">Checkout</h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <CardTitle className="mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Information
              </CardTitle>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">M-Pesa Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className={`pl-10 ${phoneError ? 'border-destructive' : ''}`}
                      placeholder="254712345678"
                      required
                    />
                    {phoneValid && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                    )}
                  </div>
                  {phoneError && (
                    <p className="text-destructive text-sm">{phoneError}</p>
                  )}
                  <p className="text-muted-foreground text-sm flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Secure M-Pesa STK Push payment - Check your phone after clicking pay
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Order Notes (Optional)</Label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Any special requirements or delivery instructions..."
                    rows={3}
                  />
                </div>

                <div className="mt-6 space-y-3">
                  <Button
                    type="submit"
                    disabled={!phoneValid || loading}
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-lg py-4 shadow-lg hover:shadow-xl transition-all duration-200 border-0"
                    size="lg"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Processing Payment...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Pay KES {total.toLocaleString()} via M-Pesa
                      </div>
                    )}
                  </Button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>
                  
                  <Button
                    type="button"
                    onClick={handleWhatsAppOrder}
                    variant="outline"
                    className="w-full bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700"
                    size="lg"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Order via WhatsApp
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <CardTitle className="mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Order Summary
              </CardTitle>
              
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-start py-3 border-b border-border last:border-0">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-muted-foreground text-sm">Qty: {item.quantity}</p>
                      <Badge variant="secondary" className="mt-1">
                        {item.category}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        KES {(item.price * item.quantity).toLocaleString()}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        KES {item.price.toLocaleString()} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-border pt-4 mt-4 space-y-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>KES {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Processing Fee</span>
                  <span>KES 0</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold pt-2 border-t border-border">
                  <span>Total</span>
                  <span>KES {total.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <CardTitle className="mb-4">Payment Options</CardTitle>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Secure M-Pesa integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>WhatsApp direct ordering</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Instant order confirmation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Digital delivery within minutes</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}