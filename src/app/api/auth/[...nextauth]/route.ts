import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import type { JWT } from 'next-auth/jwt'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        try {
          const user = await prisma.users.findUnique({
            where: { email: credentials.email },
            select: {
              id: true,
              email: true,
              name: true,
              password: true,
              userType: true,
              image: true,
              profileImage: true,
              isVerified: true,
              sellerStatus: true
            }
          })

          if (!user?.password) {
            throw new Error('Invalid credentials')
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            throw new Error('Invalid credentials')
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            userType: user.userType,
            image: user.image || user.profileImage,
            profileImage: user.profileImage,
            isVerified: user.isVerified,
            sellerStatus: user.sellerStatus
          }
        } catch (error) {
          // Sanitize error for production
          if (process.env.NODE_ENV === 'development') {
            console.error('Auth error:', error)
          }
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt' as const,
    maxAge: 2 * 60 * 60
  },
  jwt: {
    maxAge: 2 * 60 * 60
  },
  callbacks: {
    async jwt({ token, user }): Promise<JWT> {
      if (user) {
        token.userType = user.userType
        token.isVerified = user.isVerified
        token.sellerStatus = user.sellerStatus
        token.profileImage = user.profileImage
      }
      return token
    },
    async session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub
        session.user.userType = token.userType
        session.user.isVerified = token.isVerified
        session.user.sellerStatus = token.sellerStatus
        session.user.profileImage = token.profileImage
      }
      return session
    },
    async redirect({ url, baseUrl, token }) {
      if (url === baseUrl || url === `${baseUrl}/` || url === `${baseUrl}/auth/signin`) {
        if (token?.userType === 'ADMIN') {
          return `${baseUrl}/admin`
        }
        if (token?.userType === 'FREELANCER' || token?.userType === 'AGENCY') {
          return `${baseUrl}/seller-dashboard`
        }
        return `${baseUrl}/dashboard`
      }
      
      if (url.startsWith('/')) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      
      return `${baseUrl}/dashboard`
    }
  },
  pages: {
    signIn: '/auth',
    error: '/auth'
  },
  secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
