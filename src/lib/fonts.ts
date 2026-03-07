import { Inter } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
})

export const fontConfig = {
  className: inter.className,
  variable: inter.variable,
}
