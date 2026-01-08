// In-memory data store
export const users = [
  { id: '1', email: 'test@example.com', name: 'John Doe', userType: 'CLIENT', balance: 5000 },
  { id: '2', email: 'seller@example.com', name: 'Jane Smith', userType: 'FREELANCER', balance: 2500 },
  { id: '3', email: 'admin@example.com', name: 'Admin User', userType: 'ADMIN', balance: 0 }
];

export const gigs = [
  {
    id: '1',
    title: 'Professional Logo Design',
    description: 'I will create a modern, professional logo for your business with unlimited revisions.',
    price: 299,
    deliveryTime: 3,
    category: 'Design & Creative',
    tags: ['logo', 'branding', 'design'],
    images: ['https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400'],
    sellerId: '2',
    seller: { id: '2', name: 'Jane Smith', image: null },
    isActive: true,
    rating: 4.9,
    reviewCount: 42,
    orderCount: 89,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Full Stack Web Development',
    description: 'Complete web application development using React, Node.js, and modern technologies.',
    price: 1499,
    deliveryTime: 7,
    category: 'Programming & Tech',
    tags: ['website', 'react', 'nodejs'],
    images: ['https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400'],
    sellerId: '2',
    seller: { id: '2', name: 'Jane Smith', image: null },
    isActive: true,
    rating: 5.0,
    reviewCount: 28,
    orderCount: 67,
    createdAt: new Date('2024-01-10')
  }
];

export const orders = [
  {
    id: '1',
    gigId: '1',
    buyerId: '1',
    sellerId: '2',
    status: 'COMPLETED',
    totalAmount: 299,
    createdAt: new Date('2024-01-20')
  }
];

export const stats = {
  totalUsers: users.length,
  totalGigs: gigs.length,
  totalOrders: orders.length,
  totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
  activeGigs: gigs.filter(g => g.isActive).length
};