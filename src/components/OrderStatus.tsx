'use client'

import { Clock, CheckCircle, XCircle, Package, Truck } from 'lucide-react'

interface OrderStatusProps {
  status: 'PENDING' | 'PAID' | 'IN_PROGRESS' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED' | 'FAILED'
  className?: string
}

export default function OrderStatus({ status, className = '' }: OrderStatusProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PENDING':
        return { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/20', label: 'Pending' }
      case 'PAID':
        return { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/20', label: 'Paid' }
      case 'IN_PROGRESS':
        return { icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/20', label: 'In Progress' }
      case 'DELIVERED':
        return { icon: Truck, color: 'text-purple-500', bg: 'bg-purple-500/20', label: 'Delivered' }
      case 'COMPLETED':
        return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-600/20', label: 'Completed' }
      case 'CANCELLED':
        return { icon: XCircle, color: 'text-gray-500', bg: 'bg-gray-500/20', label: 'Cancelled' }
      case 'FAILED':
        return { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/20', label: 'Failed' }
      default:
        return { icon: Clock, color: 'text-gray-500', bg: 'bg-gray-500/20', label: 'Unknown' }
    }
  }

  const config = getStatusConfig(status)
  const Icon = config.icon

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${config.bg} ${className}`}>
      <Icon className={`w-4 h-4 ${config.color}`} />
      <span className={`text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    </div>
  )
}