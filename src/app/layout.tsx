import './globals.css'
import { Toaster } from 'sonner'
import Providers from '@/app/components/Providers'
import { Inter } from 'next/font/google'
import ErrorBoundary from '@/app/components/ErrorBoundary'

const inter = Inter({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-inter'
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning className={`${inter.className} bg-white min-h-screen antialiased`}>
        <ErrorBoundary>
          <Providers>
            {children}
          </Providers>
        </ErrorBoundary>
        <Toaster richColors position="top-right" duration={3000} />
      </body>
    </html>
  )
}