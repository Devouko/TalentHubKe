/**
 * Enhanced Prisma Seed Script
 * 
 * Seeds the database with comprehensive test data including:
 * - Users (clients, freelancers, admins)
 * - Gigs with various categories and pricing
 * - Projects for the dual marketplace
 * - Reviews and ratings
 * - Seller applications
 * 
 * This data is used for development and testing purposes.
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@talenthub.ke' },
    update: {},
    create: {
      email: 'admin@talenthub.ke',
      name: 'Admin User',
      userType: 'ADMIN',
      balance: 0,
      isVerified: true,
      sellerStatus: 'NOT_APPLIED',
      phoneNumber: '254700000001',
      county: 'Nairobi'
    }
  })

  // Create client users
  const client1 = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'John Doe',
      userType: 'CLIENT',
      balance: 50000,
      isVerified: true,
      phoneNumber: '254700000002',
      county: 'Nairobi'
    }
  })

  const client2 = await prisma.user.upsert({
    where: { email: 'mary.client@gmail.com' },
    update: {},
    create: {
      email: 'mary.client@gmail.com',
      name: 'Mary Wanjiku',
      userType: 'CLIENT',
      balance: 75000,
      isVerified: true,
      phoneNumber: '254700000003',
      county: 'Mombasa'
    }
  })

  // Create freelancer users
  const freelancer1 = await prisma.user.upsert({
    where: { email: 'sarah.designer@gmail.com' },
    update: {},
    create: {
      email: 'sarah.designer@gmail.com',
      name: 'Sarah Wanjiru',
      userType: 'FREELANCER',
      balance: 125000,
      isVerified: true,
      sellerStatus: 'APPROVED',
      phoneNumber: '254700000004',
      county: 'Nairobi',
      kraPinNumber: 'A123456789B'
    }
  })

  const freelancer2 = await prisma.user.upsert({
    where: { email: 'david.developer@gmail.com' },
    update: {},
    create: {
      email: 'david.developer@gmail.com',
      name: 'David Kiprotich',
      userType: 'FREELANCER',
      balance: 89000,
      isVerified: true,
      sellerStatus: 'APPROVED',
      phoneNumber: '254700000005',
      county: 'Kisumu',
      kraPinNumber: 'A987654321C'
    }
  })

  const freelancer3 = await prisma.user.upsert({
    where: { email: 'grace.writer@gmail.com' },
    update: {},
    create: {
      email: 'grace.writer@gmail.com',
      name: 'Grace Muthoni',
      userType: 'FREELANCER',
      balance: 67000,
      isVerified: true,
      sellerStatus: 'APPROVED',
      phoneNumber: '254700000006',
      county: 'Nakuru'
    }
  })

  // Create pending freelancer
  const pendingFreelancer = await prisma.user.upsert({
    where: { email: 'james.pending@gmail.com' },
    update: {},
    create: {
      email: 'james.pending@gmail.com',
      name: 'James Ochieng',
      userType: 'FREELANCER',
      balance: 0,
      isVerified: false,
      sellerStatus: 'PENDING',
      phoneNumber: '254700000007',
      county: 'Eldoret'
    }
  })

  // Create seller application for pending freelancer
  await prisma.sellerApplication.upsert({
    where: { userId: pendingFreelancer.id },
    update: {},
    create: {
      userId: pendingFreelancer.id,
      businessName: 'James Digital Solutions',
      description: 'Experienced web developer specializing in React and Node.js applications.',
      skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Express'],
      experience: '5 years of full-stack development experience with various startups and SMEs.',
      portfolio: ['https://github.com/jamesochieng', 'https://jamesdev.portfolio.com'],
      status: 'PENDING'
    }
  })

  // Create gigs
  const gigs = [
    {
      title: 'Professional Logo Design with Unlimited Revisions',
      description: 'Get a stunning, professional logo that represents your brand perfectly. Includes multiple concepts, unlimited revisions, and all file formats (PNG, SVG, PDF, AI). Perfect for Kenyan businesses looking to establish their brand identity.',
      price: 2999,
      deliveryTime: 3,
      category: 'Design & Creative',
      subcategory: 'Logo Design',
      tags: ['Logo Design', 'Branding', 'Adobe Illustrator', 'Brand Identity', 'Kenya'],
      images: ['https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400'],
      sellerId: freelancer1.id,
      rating: 4.9,
      reviewCount: 47,
      orderCount: 47
    },
    {
      title: 'Complete Brand Identity Package',
      description: 'Full branding solution including logo, business cards, letterhead, and brand guidelines. Tailored for Kenyan SMEs and startups. Includes market research and competitor analysis.',
      price: 8500,
      deliveryTime: 7,
      category: 'Design & Creative',
      subcategory: 'Branding',
      tags: ['Branding', 'Logo Design', 'Business Cards', 'Brand Guidelines', 'SME'],
      images: ['https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400'],
      sellerId: freelancer1.id,
      rating: 4.8,
      reviewCount: 23,
      orderCount: 23
    },
    {
      title: 'Modern React Website Development',
      description: 'Build a fast, responsive website using React, TypeScript, and Tailwind CSS. Includes mobile optimization, SEO setup, and deployment. Perfect for Kenyan businesses going digital.',
      price: 15000,
      deliveryTime: 10,
      category: 'Programming & Tech',
      subcategory: 'Web Development',
      tags: ['React', 'TypeScript', 'Tailwind CSS', 'Responsive Design', 'SEO'],
      images: ['https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400'],
      sellerId: freelancer2.id,
      rating: 5.0,
      reviewCount: 32,
      orderCount: 32
    },
    {
      title: 'M-Pesa Integration for Websites',
      description: 'Integrate M-Pesa payments into your website or mobile app. Includes Safaricom Daraja API setup, testing, and documentation. Specialized for Kenyan payment solutions.',
      price: 12000,
      deliveryTime: 5,
      category: 'Programming & Tech',
      subcategory: 'API Integration',
      tags: ['M-Pesa', 'Safaricom API', 'Payment Integration', 'Kenya', 'Fintech'],
      images: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400'],
      sellerId: freelancer2.id,
      rating: 4.9,
      reviewCount: 18,
      orderCount: 18
    },
    {
      title: 'SEO Content Writing in English & Swahili',
      description: 'High-quality, SEO-optimized content in both English and Swahili. Perfect for Kenyan businesses targeting local and international markets. Includes keyword research and meta descriptions.',
      price: 3500,
      deliveryTime: 3,
      category: 'Writing & Content',
      subcategory: 'SEO Writing',
      tags: ['SEO', 'Content Writing', 'Swahili', 'English', 'Kenya', 'Copywriting'],
      images: ['https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400'],
      sellerId: freelancer3.id,
      rating: 4.8,
      reviewCount: 56,
      orderCount: 56
    },
    {
      title: 'Social Media Marketing Strategy for Kenyan Brands',
      description: 'Comprehensive social media strategy including content calendar, hashtag research, and engagement tactics for Facebook, Instagram, Twitter, and WhatsApp Business.',
      price: 7500,
      deliveryTime: 5,
      category: 'Digital Marketing',
      subcategory: 'Social Media Marketing',
      tags: ['Social Media', 'Marketing Strategy', 'Content Planning', 'Kenya', 'WhatsApp Business'],
      images: ['https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400'],
      sellerId: freelancer3.id,
      rating: 4.7,
      reviewCount: 34,
      orderCount: 34
    }
  ]

  for (const gigData of gigs) {
    await prisma.gig.upsert({
      where: { title: gigData.title },
      update: {},
      create: gigData
    })
  }

  // Create projects
  const projects = [
    {
      title: 'E-commerce Website for Kenyan Fashion Brand',
      description: 'Build a complete e-commerce platform for a Kenyan fashion brand. Must include M-Pesa integration, inventory management, and mobile-responsive design. Target audience is young Kenyan professionals.',
      budget: 150000,
      currency: 'KES',
      type: 'FIXED',
      category: 'Programming & Tech',
      skills: ['React', 'Node.js', 'M-Pesa API', 'E-commerce', 'MongoDB'],
      timeline: 30,
      location: 'Nairobi, Kenya',
      clientId: client1.id
    },
    {
      title: 'Mobile App for Matatu Booking System',
      description: 'Develop a mobile application for booking matatu rides in Nairobi. Should include real-time tracking, M-Pesa payments, and driver/passenger matching. Similar to Uber but for matatus.',
      budget: 300000,
      currency: 'KES',
      type: 'FIXED',
      category: 'Programming & Tech',
      skills: ['React Native', 'Firebase', 'M-Pesa API', 'GPS Tracking', 'Real-time'],
      timeline: 60,
      location: 'Nairobi, Kenya',
      clientId: client2.id
    },
    {
      title: 'Content Creation for Tourism Website',
      description: 'Create engaging content for a Kenyan tourism website. Need blog posts, destination guides, and social media content in both English and Swahili. Focus on promoting Kenyan attractions.',
      budget: 45000,
      currency: 'KES',
      type: 'HOURLY',
      category: 'Writing & Content',
      skills: ['Content Writing', 'Tourism', 'Swahili', 'SEO', 'Social Media'],
      timeline: 14,
      location: 'Remote',
      clientId: client1.id
    }
  ]

  for (const projectData of projects) {
    await prisma.project.upsert({
      where: { title: projectData.title },
      update: {},
      create: projectData
    })
  }

  // Create categories
  const categories = [
    { name: 'Programming & Tech', description: 'Web development, mobile apps, and technical services', icon: '💻' },
    { name: 'Design & Creative', description: 'Logo design, branding, and creative services', icon: '🎨' },
    { name: 'Writing & Content', description: 'Content writing, copywriting, and translation', icon: '✍️' },
    { name: 'Digital Marketing', description: 'Social media, SEO, and online marketing', icon: '📱' },
    { name: 'Video & Animation', description: 'Video editing, animation, and multimedia', icon: '🎬' },
    { name: 'Business & Consulting', description: 'Business strategy, consulting, and analysis', icon: '💼' }
  ]

  for (const categoryData of categories) {
    await prisma.category.upsert({
      where: { name: categoryData.name },
      update: {},
      create: categoryData
    })
  }

  console.log('✅ Database seeded successfully!')
  console.log(`👤 Created ${await prisma.user.count()} users`)
  console.log(`💼 Created ${await prisma.gig.count()} gigs`)
  console.log(`📋 Created ${await prisma.project.count()} projects`)
  console.log(`📂 Created ${await prisma.category.count()} categories`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })