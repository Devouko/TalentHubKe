'use client'

import { useEffect, useState } from 'react'
import { Package } from 'lucide-react'
import { useParams } from 'next/navigation'
import AdminSidebarLayout from '../../../AdminSidebarLayout'
import ProductForm from '@/components/admin/products/ProductForm'

export default function EditProductPage() {
  const params = useParams()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProduct()
  }, [])

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/admin/products/${params.id}`)
      if (res.ok) setProduct(await res.json())
    } catch (error) {
      console.error('Failed to fetch product:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminSidebarLayout>
        <div className="min-h-screen bg-[#0a192f] text-white p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981]"></div>
        </div>
      </AdminSidebarLayout>
    )
  }

  if (!product) {
    return (
      <AdminSidebarLayout>
        <div className="min-h-screen bg-[#0a192f] text-white p-6 flex items-center justify-center">
          <p className="text-[#94a3b8]">Product not found</p>
        </div>
      </AdminSidebarLayout>
    )
  }

  return (
    <AdminSidebarLayout>
      <div className="min-h-screen bg-[#0a192f] text-white p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Package className="w-8 h-8 text-[#10B981]" />
            <h1 className="text-3xl font-bold">Edit Product</h1>
          </div>
          <ProductForm mode="edit" initialData={product} />
        </div>
      </div>
    </AdminSidebarLayout>
  )
}
