'use client'

import { Package } from 'lucide-react'
import AdminSidebarLayout from '../../AdminSidebarLayout'
import ProductForm from '@/components/admin/products/ProductForm'

export default function NewProductPage() {
  return (
    <AdminSidebarLayout>
      <div className="min-h-screen bg-[#0a192f] text-white p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Package className="w-8 h-8 text-[#10B981]" />
            <h1 className="text-3xl font-bold">Create New Product</h1>
          </div>
          <ProductForm mode="create" />
        </div>
      </div>
    </AdminSidebarLayout>
  )
}
