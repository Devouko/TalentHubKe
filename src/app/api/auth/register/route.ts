import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, userType } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const validUserType = ['CLIENT', 'FREELANCER', 'AGENCY', 'ADMIN'].includes(userType) ? userType : 'CLIENT';
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        userType: validUserType
      }
    });

    return NextResponse.json({
      message: 'User created successfully',
      userId: user.id
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error.code === 'P1001') {
      return NextResponse.json(
        { error: 'Database connection failed. Please check your database configuration.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}