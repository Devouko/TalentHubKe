import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding products...')

  // Get or create a seller
  const seller = await prisma.user.upsert({
    where: { email: 'seller@talenthub.ke' },
    update: {},
    create: {
      email: 'seller@talenthub.ke',
      name: 'Product Seller',
      userType: 'FREELANCER',
      balance: 0,
      isVerified: true,
      sellerStatus: 'APPROVED',
      phoneNumber: '254700000010',
      county: 'Nairobi'
    }
  })

  const products = [
    {
      title: 'Premium Gmail Accounts - Bulk Package',
      description: 'High-quality Gmail accounts perfect for business use. Verified and ready to use. Includes recovery email setup.',
      price: 500,
      category: 'Bulk_Gmails',
      stock: 100,
      images: ['https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400'],
      features: ['Verified accounts', 'Recovery email included', 'Instant delivery', '24/7 support'],
      sellerId: seller.id,
      rating: 4.5,
      reviewCount: 12,
      orderCount: 45
    },
    {
      title: 'Facebook Business Account',
      description: 'Verified Facebook business account with ad credits. Perfect for running marketing campaigns.',
      price: 2500,
      category: 'Accounts',
      stock: 25,
      images: ['https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400'],
      features: ['Verified business account', 'Ad credits included', 'Full access', 'Secure transfer'],
      sellerId: seller.id,
      rating: 4.8,
      reviewCount: 8,
      orderCount: 23
    },
    {
      title: 'Instagram Growth Package',
      description: 'Complete Instagram growth package with verified account and engagement tools.',
      price: 3500,
      category: 'Accounts',
      stock: 15,
      images: ['https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400'],
      features: ['Verified account', 'Growth tools', 'Analytics access', 'Support included'],
      sellerId: seller.id,
      rating: 4.6,
      reviewCount: 15,
      orderCount: 38
    },
    {
      title: 'Premium Residential Proxies - Kenya',
      description: 'High-speed residential proxies based in Kenya. Perfect for web scraping and automation.',
      price: 1500,
      category: 'Proxies',
      stock: 50,
      images: ['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400'],
      features: ['Kenya-based IPs', 'High speed', 'Unlimited bandwidth', '99.9% uptime'],
      sellerId: seller.id,
      rating: 4.7,
      reviewCount: 20,
      orderCount: 67
    },
    {
      title: 'KYC Verification Service',
      description: 'Fast and reliable KYC verification service for businesses. Compliant with Kenyan regulations.',
      price: 5000,
      category: 'KYC',
      stock: 100,
      images: ['https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400'],
      features: ['Fast verification', 'Compliant with regulations', 'Secure process', 'Detailed reports'],
      sellerId: seller.id,
      rating: 4.9,
      reviewCount: 35,
      orderCount: 89
    },
    {
      title: 'Website Template Bundle',
      description: 'Professional website templates for various industries. Fully customizable and responsive.',
      price: 4500,
      category: 'Digital-products',
      stock: 200,
      images: ['https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400'],
      features: ['10+ templates', 'Fully responsive', 'Easy customization', 'Documentation included'],
      sellerId: seller.id,
      rating: 4.4,
      reviewCount: 28,
      orderCount: 56
    },
    {
      title: 'SEO Tools Package',
      description: 'Complete SEO tools package including keyword research, backlink analysis, and rank tracking.',
      price: 3000,
      category: 'Digital-products',
      stock: 75,
      images: ['https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400'],
      features: ['Keyword research', 'Backlink analysis', 'Rank tracking', 'Competitor analysis'],
      sellerId: seller.id,
      rating: 4.6,
      reviewCount: 18,
      orderCount: 42
    },
    {
      title: 'Twitter Verified Account',
      description: 'Verified Twitter account with blue checkmark. Perfect for businesses and influencers.',
      price: 8000,
      category: 'Accounts',
      stock: 5,
      images: ['https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400'],
      features: ['Blue checkmark', 'Full access', 'Secure transfer', 'Support included'],
      sellerId: seller.id,
      rating: 5.0,
      reviewCount: 6,
      orderCount: 12
    }
  ]

  for (const product of products) {
    await prisma.product.create({
      data: product
    })
  }

  console.log(`✅ Created ${products.length} products`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
