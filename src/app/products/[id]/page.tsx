'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'
import AddToCartButton from '@/components/AddToCartButton'
import ProductRating from '@/components/ProductRating'

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
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
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full rounded-lg border"
              />
            ) : (
              <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-semibold mb-3">{product.title}</h1>
            <p className="text-sm text-gray-600 mb-4">{product.description}</p>
            
            <div className="mb-4">
              <span className="text-2xl font-semibold text-emerald-600">
                KES {product.price?.toLocaleString()}
              </span>
            </div>

            <div className="mb-4">
              <span className="text-sm text-gray-600">
                {product.stock} in stock
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

        <div className="border-t pt-8">
          <h2 className="text-lg font-semibold mb-4">Customer Reviews</h2>
          <ProductRating
            productId={params.id}
            canReview={!!session}
          />
        </div>
      </div>
    </div>
  )
}
