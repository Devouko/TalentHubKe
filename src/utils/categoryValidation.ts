import { CATEGORY_OPTIONS, type Category } from '@/constants/categories'

export function isValidCategory(category: string): category is Category {
  return CATEGORY_OPTIONS.includes(category as Category)
}

export function validateCategory(category: string): Category {
  if (!isValidCategory(category)) {
    throw new Error(`Invalid category: ${category}. Must be one of: ${CATEGORY_OPTIONS.join(', ')}`)
  }
  return category
}

export function sanitizeCategory(category: string): Category {
  // Try to match the category to a valid one
  const normalized = category.toLowerCase().trim()
  
  // Direct matches
  for (const validCategory of CATEGORY_OPTIONS) {
    if (validCategory.toLowerCase() === normalized) {
      return validCategory
    }
  }
  
  // Fuzzy matching for common variations
  if (normalized.includes('account') || normalized.includes('social')) {
    return 'Accounts'
  }
  if (normalized.includes('digital') || normalized.includes('software') || normalized.includes('template')) {
    return 'Digital-products'
  }
  if (normalized.includes('proxy') || normalized.includes('proxies')) {
    return 'Proxies'
  }
  if (normalized.includes('gmail') || normalized.includes('email')) {
    return 'Bulk_Gmails'
  }
  if (normalized.includes('kyc') || normalized.includes('verification') || normalized.includes('identity')) {
    return 'KYC'
  }
  
  // Default fallback
  return 'Digital-products'
}