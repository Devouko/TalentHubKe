'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Star, Heart, ShoppingCart, Shield, Truck, Award, Phone } from 'lucide-react'

interface Product {
  id: string
  title: string
  description: string
  price: number
  discountPrice?: number
  discountPercent?: number
  images: string[]
  category: string
  brand?: string
  stock: number
  rating: number
  reviewCount: number
  features: string[]
  materials?: string
  warranty?: string
  specifications?: any
  seller?: {
    id: string
    name: string
    email: string
  }
  reviews: Array<{
    id: string
    rating: number
    title?: string
    comment: string
    isVerified: boolean
    createdAt: string
    user: {
      name: string
      image?: string
    }
  }>
  ratingBreakdown: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

export default function ProductDetails({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('details')
  const [inWishlist, setInWishlist] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products?action=details&id=${productId}`)
      const data = await response.json()
      setProduct(data)
    } catch (error) {
      console.error('Failed to fetch product:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async () => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addToCart',
          productId: product?.id,
          quantity
        })
      })
      
      if (response.ok) {
        alert('Added to cart!')
      }
    } catch (error) {
      console.error('Failed to add to cart:', error)
    }
  }

  const toggleWishlist = async () => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'wishlist',
          productId: product?.id
        })
      })
      
      const data = await response.json()
      setInWishlist(data.inWishlist)
    } catch (error) {
      console.error('Failed to update wishlist:', error)
    }
  }

  if (loading) return <div className="p-8">Loading...</div>
  if (!product) return <div className="p-8">Product not found</div>

  const discountedPrice = product.discountPrice || product.price
  const savings = product.price - discountedPrice

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Product Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Image Gallery */}
        <div className="space-y-3">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
            {product.discountPercent && (
              <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium z-10">
                -{product.discountPercent}%
              </div>
            )}
            <Image
              src={product.images[selectedImage] || '/placeholder.jpg'}
              alt={product.title}
              width={400}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border ${selectedImage === index ? 'border-orange-500' : 'border-gray-200'}`}
              >
                <Image
                  src={image || '/placeholder.jpg'}
                  alt={`${product.title} ${index + 1}`}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{product.title}</h1>
            {product.brand && (
              <button className="text-sm text-orange-600 font-medium mt-1 hover:underline">
                {product.brand}
              </button>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">
              {product.rating.toFixed(1)} ({product.reviewCount} verified ratings)
            </span>
          </div>

          {/* Price */}
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">
                KES {discountedPrice.toLocaleString()}
              </span>
              {savings > 0 && (
                <>
                  <span className="text-lg text-gray-500 line-through">
                    KES {product.price.toLocaleString()}
                  </span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                    -{product.discountPercent}%
                  </span>
                </>
              )}
            </div>
            {savings > 0 && (
              <p className="text-green-600 font-medium text-sm">
                You save KES {savings.toLocaleString()}
              </p>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={`font-medium text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} units left` : 'Out of stock'}
            </span>
          </div>

          {/* Add to Cart */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="flex items-center border rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100 text-sm"
                >
                  -
                </button>
                <span className="px-3 py-2 border-x text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 hover:bg-gray-100 text-sm"
                >
                  +
                </button>
              </div>
              <button
                onClick={addToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-orange-500 text-white px-4 py-2 rounded font-medium hover:bg-orange-600 disabled:bg-gray-300 flex items-center justify-center space-x-2 text-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={toggleWishlist}
                className={`p-2 rounded border ${inWishlist ? 'bg-red-50 border-red-200 text-red-600' : 'bg-gray-50 border-gray-200 text-gray-600'} hover:bg-red-50 hover:border-red-200 hover:text-red-600`}
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Promotions */}
          <div className="bg-orange-50 p-3 rounded space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Phone className="w-3 h-3 text-orange-600" />
                <span className="text-xs font-medium">Call to Order</span>
              </div>
              <span className="text-orange-600 font-bold text-sm">0700-000-000</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-3 h-3 text-orange-600" />
              <span className="text-xs">Secure Payment Guaranteed</span>
            </div>
            <div className="flex items-center space-x-2">
              <Truck className="w-3 h-3 text-orange-600" />
              <span className="text-xs">Fast Digital Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-4">
        <nav className="flex space-x-6">
          {['details', 'specifications', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold mb-2">Product Description</h3>
                <p className="text-gray-700 leading-relaxed text-sm">{product.description}</p>
              </div>
              
              {product.features.length > 0 && (
                <div>
                  <h3 className="text-base font-semibold mb-2">Key Features</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                    {product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              {product.materials && (
                <div>
                  <h3 className="text-base font-semibold mb-2">Materials</h3>
                  <p className="text-gray-700 text-sm">{product.materials}</p>
                </div>
              )}

              {product.warranty && (
                <div>
                  <h3 className="text-base font-semibold mb-2">Warranty Information</h3>
                  <p className="text-gray-700 text-sm">{product.warranty}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'specifications' && (
            <div>
              <h3 className="text-base font-semibold mb-3">Product Specifications</h3>
              <div className="bg-gray-50 rounded p-3">
                <table className="w-full">
                  <tbody className="space-y-1">
                    <tr className="border-b border-gray-200">
                      <td className="py-2 font-medium text-gray-900 w-1/3 text-sm">Brand</td>
                      <td className="py-2 text-gray-700 text-sm">{product.brand || 'N/A'}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 font-medium text-gray-900 text-sm">Category</td>
                      <td className="py-2 text-gray-700 text-sm">{product.category}</td>
                    </tr>
                    {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                      <tr key={key} className="border-b border-gray-200">
                        <td className="py-2 font-medium text-gray-900 capitalize text-sm">{key.replace(/([A-Z])/g, ' $1')}</td>
                        <td className="py-2 text-gray-700 text-sm">{String(value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {/* Customer Feedback Summary */}
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="text-base font-semibold mb-3">Customer Feedback</h3>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-center">
                    <span className="text-2xl font-bold text-orange-600">{product.rating.toFixed(1)}</span>
                    <div className="flex items-center justify-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{product.reviewCount} verified ratings</p>
                  </div>
                  
                  {/* Rating Breakdown */}
                  <div className="flex-1 space-y-1">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <span className="text-xs w-2">{rating}</span>
                        <Star className="w-2 h-2 text-yellow-400 fill-current" />
                        <div className="flex-1 bg-gray-200 rounded-full h-1">
                          <div
                            className="bg-yellow-400 h-1 rounded-full"
                            style={{
                              width: `${product.reviewCount > 0 ? (product.ratingBreakdown[rating as keyof typeof product.ratingBreakdown] / product.reviewCount) * 100 : 0}%`
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 w-6">
                          {product.ratingBreakdown[rating as keyof typeof product.ratingBreakdown]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold">Customer Reviews</h3>
                {product.reviews.length > 0 ? (
                  product.reviews.map((review) => (
                    <div key={review.id} className="border border-gray-200 rounded p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          {review.isVerified && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {review.title && (
                        <h4 className="font-medium text-gray-900 mb-1 text-sm">{review.title}</h4>
                      )}
                      <p className="text-gray-700 mb-2 text-sm">{review.comment}</p>
                      <p className="text-xs text-gray-500">By {review.user.name}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-6 text-sm">No reviews yet. Be the first to review!</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Seller Performance Sidebar */}
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="text-base font-semibold mb-3">Seller Performance</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Seller</span>
                <span className="font-medium text-orange-600 text-sm">{product.seller?.name || 'Digital Store'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Shipping Speed</span>
                <div className="flex items-center space-x-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-2 h-2 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-green-600 font-medium text-xs">Excellent</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Product Quality</span>
                <div className="flex items-center space-x-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-2 h-2 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-green-600 font-medium text-xs">Excellent</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Customer Rating</span>
                <div className="flex items-center space-x-1">
                  <div className="flex">
                    {[...Array(4)].map((_, i) => (
                      <Star key={i} className="w-2 h-2 text-yellow-400 fill-current" />
                    ))}
                    <Star className="w-2 h-2 text-gray-300" />
                  </div>
                  <span className="text-green-600 font-medium text-xs">Excellent</span>
                </div>
              </div>
            </div>
          </div>

          {/* Flash Sale Banner */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-3 rounded">
            <div className="text-center">
              <h4 className="font-bold text-sm">⚡ Flash Sale!</h4>
              <p className="text-xs opacity-90">Limited time offer</p>
              <div className="mt-1 text-lg font-bold">
                {product.discountPercent}% OFF
              </div>
            </div>
          </div>

          {/* Security Badges */}
          <div className="bg-blue-50 p-3 rounded">
            <h4 className="font-semibold text-blue-900 mb-2 text-sm">Security & Trust</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Shield className="w-3 h-3 text-blue-600" />
                <span className="text-xs text-blue-800">SSL Secured Payment</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-3 h-3 text-blue-600" />
                <span className="text-xs text-blue-800">Verified Seller</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="w-3 h-3 text-blue-600" />
                <span className="text-xs text-blue-800">Fast Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}