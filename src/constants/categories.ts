export const CATEGORIES = ['all', 'Accounts', 'Digital-products', 'Proxies', 'Bulk_Gmails', 'KYC'] as const

export const CATEGORY_OPTIONS = ['Accounts', 'Digital-products', 'Proxies', 'Bulk_Gmails', 'KYC'] as const

export type Category = typeof CATEGORY_OPTIONS[number]
export type CategoryWithAll = typeof CATEGORIES[number]

export const CATEGORY_DETAILS = {
  'Accounts': {
    name: 'Accounts',
    icon: '👤',
    description: 'Social media, gaming, and business accounts',
    subcategories: ['Social Media', 'Gaming', 'Streaming', 'Business']
  },
  'Digital-products': {
    name: 'Digital Products',
    icon: '💾',
    description: 'Software, templates, courses, and digital assets',
    subcategories: ['Software', 'Templates', 'Courses', 'E-books']
  },
  'Proxies': {
    name: 'Proxies',
    icon: '🔒',
    description: 'Proxy services and solutions',
    subcategories: ['Residential', 'Datacenter', 'Mobile', 'Rotating']
  },
  'Bulk_Gmails': {
    name: 'Bulk Gmails',
    icon: '📧',
    description: 'Gmail accounts in bulk quantities',
    subcategories: ['Fresh', 'Aged', 'Phone Verified', 'Custom']
  },
  'KYC': {
    name: 'KYC',
    icon: '🆔',
    description: 'Know Your Customer verification services',
    subcategories: ['Documents', 'Verification', 'Identity', 'Compliance']
  }
} as const