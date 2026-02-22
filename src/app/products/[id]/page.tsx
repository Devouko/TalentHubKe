'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/app/context/CartContext'
import AddToCartButton from '@/components/AddToCartButton'

export default function ProductDetail({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/admin/products/${params.id}`)
      const data = await res.json()
      setProduct(data)
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Product not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {product.images?.[0] && (
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full rounded-lg"
              />
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">{product.description}</p>
            
            <div className="mb-6">
              <span className="text-3xl font-bold text-purple-500">
                KSh {product.price?.toLocaleString()}
              </span>
            </div>

            <div className="mb-6">
              <span className="text-sm text-slate-600">
                {product.stock} available
              </span>
            </div>

            <AddToCartButton 
              product={{
                id: product.id,
                title: product.title,
                price: product.price,
                images: product.images || []
              }}
              className="w-full py-3"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
