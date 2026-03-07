'use client'

import { CheckCircle, Download, Eye, ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface OrderSuccessProps {
  onContinueShopping: () => void
  onViewOrders: () => void
}

export default function OrderSuccess({ onContinueShopping, onViewOrders }: OrderSuccessProps) {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
        <p className="text-muted-foreground">Your order has been created and is being processed.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <CardTitle className="mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              What's Next?
            </CardTitle>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium">Payment Processing</p>
                  <p className="text-sm text-muted-foreground">Your M-Pesa payment is being verified</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium">Order Confirmation</p>
                  <p className="text-sm text-muted-foreground">You'll receive an email confirmation shortly</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">3</span>
                </div>
                <div>
                  <p className="font-medium">Digital Delivery</p>
                  <p className="text-sm text-muted-foreground">Access your products in "My Products" section</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <CardTitle className="mb-4">Quick Actions</CardTitle>
            <div className="space-y-3">
              <Button onClick={onViewOrders} className="w-full" variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                View My Orders
              </Button>
              <Button onClick={onContinueShopping} className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <CardTitle className="mb-4">Order Information</CardTitle>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Order ID</p>
              <p className="font-mono">ORDER-{Date.now()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Order Date</p>
              <p>{new Date().toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Payment Method</p>
              <p>M-Pesa</p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <Badge variant="secondary">Processing</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}