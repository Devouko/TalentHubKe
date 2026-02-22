import NextAuth from 'next-auth'
import { UserType, SellerStatus } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      profileImage?: string | null
      userType: UserType
      isVerified: boolean
      sellerStatus: SellerStatus
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    userType: UserType
    image?: string | null
    profileImage?: string | null
    isVerified: boolean
    sellerStatus: SellerStatus
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userType: UserType
    isVerified: boolean
    sellerStatus: SellerStatus
    profileImage?: string | null
  }
}