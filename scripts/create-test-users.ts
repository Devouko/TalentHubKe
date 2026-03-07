import { prisma } from '../src/lib/prisma'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'

async function createTestUsers() {
  try {
    // Create test admin user
    const adminPassword = await bcrypt.hash('admin123', 12)
    const admin = await prisma.users.upsert({
      where: { email: 'admin@test.com' },
      update: {},
      create: {
        id: randomUUID(),
        email: 'admin@test.com',
        password: adminPassword,
        name: 'Test Admin',
        userType: 'ADMIN',
        isVerified: true,
        sellerStatus: 'NOT_APPLIED',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    // Create test freelancer user
    const freelancerPassword = await bcrypt.hash('freelancer123', 12)
    const freelancer = await prisma.users.upsert({
      where: { email: 'freelancer@test.com' },
      update: {},
      create: {
        id: randomUUID(),
        email: 'freelancer@test.com',
        password: freelancerPassword,
        name: 'Test Freelancer',
        userType: 'FREELANCER',
        isVerified: true,
        sellerStatus: 'APPROVED',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    // Create test client user
    const clientPassword = await bcrypt.hash('client123', 12)
    const client = await prisma.users.upsert({
      where: { email: 'client@test.com' },
      update: {},
      create: {
        id: randomUUID(),
        email: 'client@test.com',
        password: clientPassword,
        name: 'Test Client',
        userType: 'CLIENT',
        isVerified: true,
        sellerStatus: 'NOT_APPLIED',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    console.log('Test users created successfully:')
    console.log('Admin:', admin.email, 'Password: admin123')
    console.log('Freelancer:', freelancer.email, 'Password: freelancer123')
    console.log('Client:', client.email, 'Password: client123')

  } catch (error) {
    console.error('Error creating test users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestUsers()