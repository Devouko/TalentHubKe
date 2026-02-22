import { NextRequest } from 'next/server'
import { ApiService } from '@/lib/api.service'

export async function GET(request: NextRequest) {
  return ApiService.handleRequest(async () => {
    const session = await ApiService.validateAuth()
    
    return {
      message: 'Authentication successful',
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        userType: session.user.userType,
        isVerified: session.user.isVerified,
        sellerStatus: session.user.sellerStatus
      }
    }
  }, 'Authentication test failed')
}