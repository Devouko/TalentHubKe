export function validateStockAdjustment(currentStock: number, change: number) {
  const newStock = currentStock + change
  return newStock >= 0
}

export function calculateNewStock(currentStock: number, change: number) {
  return Math.max(0, currentStock + change)
}

export function getStockStatusColor(status: string) {
  const colors = {
    IN_STOCK: 'bg-green-500',
    LOW_STOCK: 'bg-yellow-500',
    OUT_OF_STOCK: 'bg-red-500',
    DISCONTINUED: 'bg-gray-500'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-500'
}

export function getChangeTypeLabel(type: string) {
  const labels = {
    INITIAL: 'Initial Stock',
    PURCHASE: 'Purchase',
    SALE: 'Sale',
    RETURN: 'Return',
    ADJUSTMENT: 'Adjustment',
    DAMAGE: 'Damage',
    TRANSFER: 'Transfer'
  }
  return labels[type as keyof typeof labels] || type
}
