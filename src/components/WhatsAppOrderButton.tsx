'use client'

import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface WhatsAppOrderButtonProps {
  product: {
    id: string
    title: string
    price: number
    whatsappNumber?: string
  }
  className?: string
}

export default function WhatsAppOrderButton({ product, className }: WhatsAppOrderButtonProps) {
  if (!product.whatsappNumber) return null

  const handleWhatsAppOrder = () => {
    const message = `Hi! I'm interested in ordering:

📦 *${product.title}*
💰 Price: KES ${product.price.toLocaleString()}
🔗 Product Link: ${window.location.origin}/products?id=${product.id}

Please let me know about availability and payment options.`

    const phoneNumber = product.whatsappNumber.replace(/[^0-9]/g, '')
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    
    window.open(whatsappUrl, '_blank')
  }

  return (
    <Button
      onClick={handleWhatsAppOrder}
      variant="outline"
      size="sm"
      className={`bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700 ${className}`}
    >
      <MessageCircle className="w-4 h-4 mr-1" />
      WhatsApp
    </Button>
  )
}