export function calculateStockStatus(quantity: number, threshold: number) {
  if (quantity === 0) return 'OUT_OF_STOCK'
  if (quantity <= threshold) return 'LOW_STOCK'
  return 'IN_STOCK'
}

export function generateSKU() {
  return `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
}

export function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function calculateProfit(price: number, cost: number) {
  return ((price - cost) / cost * 100).toFixed(2)
}

export function formatPrice(amount: number) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES'
  }).format(amount)
}
