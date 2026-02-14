'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '../context/CartContext'
import { ArrowLeft, Phone, CheckCircle, MessageCircle } from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, total, clearCart } = useCart()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [phoneValid, setPhoneValid] = useState(false)
  const [phoneError, setPhoneError] = useState('')

  useEffect(() => {
    if (cart.length === 0) {
      router.push('/products')
    }
  }, [cart, router])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phoneValid) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          phoneNumber: phoneNumber.replace(/\s/g, '')
        })
      })
      
      if (response.ok) {
        await clearCart()
        router.push('/payment-status')
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleWhatsAppOrder = () => {
    const orderDetails = cart.map(item => 
      `• ${item.title} (Qty: ${item.quantity}) - KES ${(item.price * item.quantity).toLocaleString()}`
    ).join('\n')
    
    const message = `Hi! I'd like to place an order:\n\n${orderDetails}\n\nTotal: KES ${total.toLocaleString()}\n\nPhone: ${phoneNumber}\n${notes ? `Notes: ${notes}` : ''}`
    
    const whatsappUrl = `https://wa.me/254712345678?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="card-modern p-8 text-center max-w-sm mx-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground text-lg font-medium">Processing payment...</p>
          <p className="text-muted-foreground text-sm mt-2">Please check your phone for M-Pesa prompt</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors focus-ring rounded-lg p-2 -ml-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Payment Information */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Checkout</h1>
              <p className="text-muted-foreground">Complete your order securely</p>
            </div>

            {/* Payment Method Cards */}
            <div className="card-modern p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" />
                Payment Information
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    M-Pesa Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 bg-background border rounded-lg text-foreground placeholder-muted-foreground focus-ring transition-colors ${
                        phoneError ? 'border-destructive' : 'border-border'
                      }`}
                      placeholder="254712345678"
                      required
                    />
                    {phoneValid && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-success" />
                    )}
                  </div>
                  {phoneError && (
                    <p className="text-destructive text-sm mt-1">{phoneError}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <p className="text-muted-foreground text-sm">Secure M-Pesa STK Push payment</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus-ring transition-colors resize-none"
                    placeholder="Any special requirements or delivery instructions..."
                    rows={3}
                  />
                </div>

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={!phoneValid || loading}
                    className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground py-4 rounded-lg font-semibold transition-all focus-ring"
                  >
                    Pay KES {total.toLocaleString()}
                  </button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-background px-4 text-muted-foreground">OR</span>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleWhatsAppOrder}
                    disabled={!phoneNumber}
                    className="w-full bg-success hover:bg-success/90 disabled:opacity-50 disabled:cursor-not-allowed text-success-foreground py-4 rounded-lg font-semibold transition-all focus-ring flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Order via WhatsApp
                  </button>
                </div>
              </form>
            </div>

            {/* Payment Options */}
            <div className="card-modern p-6">
              <h3 className="font-semibold text-foreground mb-4">Payment Options</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-foreground">Secure M-Pesa integration</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-foreground">WhatsApp direct ordering</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-foreground">Instant order confirmation</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-foreground">Digital delivery within minutes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="card-modern p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-start py-3 border-b border-border last:border-0">
                    <div className="flex-1">
                      <h3 className="text-foreground font-medium">{item.title}</h3>
                      <p className="text-muted-foreground text-sm">Qty: {item.quantity}</p>
                      <p className="text-muted-foreground text-sm">KES {item.price.toLocaleString()} each</p>
                    </div>
                    <span className="text-foreground font-semibold ml-4">
                      KES {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>KES {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Processing Fee</span>
                  <span>KES 0</span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold text-foreground pt-3 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">KES {total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}