import { NextResponse } from 'next/server';
import { handleApiError, apiResponse } from '@/lib/api-utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, userType } = body;

    const response = await fetch(`${new URL(request.url).origin}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, userType }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return apiResponse({
      message: 'User created successfully',
      userId: data.id
    });

  } catch (error: any) {
    return handleApiError(error);
  }
}