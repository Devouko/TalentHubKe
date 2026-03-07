'use client'

import React, { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import { UserProvider } from '../context/UserContext'
import { SidebarProvider } from '../context/SidebarContext'
import { CartProvider } from '../context/CartContext'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <UserProvider>
        <SidebarProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </SidebarProvider>
      </UserProvider>
    </SessionProvider>
  )
}