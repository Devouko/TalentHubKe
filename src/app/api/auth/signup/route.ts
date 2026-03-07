import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { randomUUID } from 'crypto';
import { handleApiError, apiResponse } from '@/lib/api-utils';

export async function POST(request: Request) {
  try {
    const { email, password, name, userType } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with specified type (including ADMIN)
    const user = await prisma.users.create({
      data: {
        id: randomUUID(),
        email,
        password: hashedPassword,
        name: name || null,
        userType: userType || 'CLIENT',
        isVerified: userType === 'ADMIN' ? true : false,
        sellerStatus: userType === 'FREELANCER' ? 'APPROVED' : 'NOT_APPLIED',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    return apiResponse({
      id: user.id,
      email: user.email,
      name: user.name,
      userType: user.userType
    }, 201);

  } catch (error) {
    return handleApiError(error);
  }
}