import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email, password, name, userType } = await request.json();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with specified type (including ADMIN)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        userType: userType || 'CLIENT',
        isVerified: userType === 'ADMIN' ? true : false,
        sellerStatus: userType === 'FREELANCER' ? 'APPROVED' : 'NOT_APPLIED'
      }
    });

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      userType: user.userType
    }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}