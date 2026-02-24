import { JWT } from 'next-auth/jwt'
import { UserType, SellerStatus } from '@prisma/client'

declare module 'next-auth/jwt' {
  interface JWT {
    userType?: UserType
    isVerified?: boolean
    sellerStatus?: SellerStatus
    profileImage?: string | null
  }
}