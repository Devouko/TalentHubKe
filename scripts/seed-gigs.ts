import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedGigs() {
  try {
    // Create a system user first
    let systemUser = await prisma.user.findFirst({
      where: { email: 'system@marketplace.com' }
    })

    if (!systemUser) {
      systemUser = await prisma.user.create({
        data: {
          email: 'system@marketplace.com',
          name: 'System',
          userType: 'ADMIN'
        }
      })
    }

    // Sample gigs data
    const sampleGigs = [
      {
        title: 'Professional Logo Design',
        description: 'I will create a modern, professional logo for your business with unlimited revisions.',
        price: 5000,
        deliveryTime: 3,
        category: 'design',
        tags: ['logo', 'branding', 'design'],
        images: ['https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400'],
        sellerId: systemUser.id
      },
      {
        title: 'Full Stack Web Development',
        description: 'I will develop a complete web application using React, Node.js, and MongoDB.',
        price: 25000,
        deliveryTime: 14,
        category: 'development',
        tags: ['react', 'nodejs', 'mongodb', 'fullstack'],
        images: ['https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400'],
        sellerId: systemUser.id
      },
      {
        title: 'Content Writing & SEO',
        description: 'I will write engaging, SEO-optimized content for your website or blog.',
        price: 3000,
        deliveryTime: 2,
        category: 'writing',
        tags: ['content', 'seo', 'writing', 'blog'],
        images: ['https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400'],
        sellerId: systemUser.id
      },
      {
        title: 'Social Media Marketing',
        description: 'I will create and manage your social media campaigns across all platforms.',
        price: 8000,
        deliveryTime: 7,
        category: 'marketing',
        tags: ['social media', 'marketing', 'campaigns'],
        images: ['https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400'],
        sellerId: systemUser.id
      },
      {
        title: 'Video Editing & Motion Graphics',
        description: 'I will edit your videos and add professional motion graphics and effects.',
        price: 12000,
        deliveryTime: 5,
        category: 'video',
        tags: ['video editing', 'motion graphics', 'effects'],
        images: ['https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400'],
        sellerId: systemUser.id
      },
      {
        title: 'Mobile App UI/UX Design',
        description: 'I will design beautiful and user-friendly mobile app interfaces.',
        price: 15000,
        deliveryTime: 7,
        category: 'design',
        tags: ['ui', 'ux', 'mobile', 'app design'],
        images: ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400'],
        sellerId: systemUser.id
      }
    ]

    // Create gigs
    for (const gigData of sampleGigs) {
      await prisma.gig.create({
        data: gigData
      })
    }

    console.log('✅ Sample gigs created successfully!')
  } catch (error) {
    console.error('❌ Error seeding gigs:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedGigs()