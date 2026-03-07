import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    userType: string;
  };
}

export async function requireAuth(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error('Authentication required');
  }
  
  return session.user;
}

export async function requireRole(request: NextRequest, allowedRoles: string[]) {
  const user = await requireAuth(request);
  
  if (!allowedRoles.includes(user.userType)) {
    throw new Error(`Access denied. Required roles: ${allowedRoles.join(', ')}`);
  }
  
  return user;
}

export async function requireOwnership(request: NextRequest, resourceOwnerId: string) {
  const user = await requireAuth(request);
  
  if (user.id !== resourceOwnerId && user.userType !== 'ADMIN') {
    throw new Error('Access denied. You can only access your own resources.');
  }
  
  return user;
}