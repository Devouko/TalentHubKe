/**
 * Root Layout Component
 * 
 * The main layout wrapper for the entire application. Provides:
 * - Session management with NextAuth
 * - User context for user state management
 * - Shopping cart context
 * - Theme provider for light/dark mode
 * - Sidebar navigation component
 * 
 * This component wraps all pages and provides shared functionality
 * across the entire application.
 */

'use client'

import './globals.css'
import '../styles/colors.css'
import { UserProvider } from './context/UserContext'
import { CartProvider } from './context/CartContext'
import { ThemeColorsProvider } from './context/ThemeContext'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from './components/theme-provider'
import Sidebar from './components/Sidebar'
import TopNavbar from './components/TopNavbar'
import { usePathname } from 'next/navigation'

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Pages that should NOT show the sidebar
  const noSidebarPages = ['/', '/auth', '/gig', '/products', '/seller', '/dashboard', '/admin']
  const shouldShowSidebar = !noSidebarPages.some(page => 
    page === '/' ? pathname === '/' : pathname.startsWith(page)
  )

  if (!shouldShowSidebar) {
    return (
      <div className="min-h-screen bg-gray-900">
        {children}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <TopNavbar />
        <div className="flex-1 p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <SessionProvider>
            <UserProvider>
              <CartProvider>
                <ThemeColorsProvider>
                  <LayoutContent>{children}</LayoutContent>
                </ThemeColorsProvider>
              </CartProvider>
            </UserProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}