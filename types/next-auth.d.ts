import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      userType: string;
      image?: string;
      profileImage?: string;
      isVerified?: boolean;
      sellerStatus?: string;
    };
  }

  interface User {
    userType: string;
    profileImage?: string;
    isVerified?: boolean;
    sellerStatus?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userType: string;
    isVerified?: boolean;
    sellerStatus?: string;
    profileImage?: string;
  }
}