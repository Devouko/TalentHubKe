'use client'

import { useSession, signIn } from 'next-auth/react'
import { Bell, Search, LogIn } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import ProfileDropdown from './ProfileDropdown'
import AdminThemeControl from './AdminThemeControl'
import { ThemeToggle } from './theme-toggle'
import Link from 'next/link'

export default function TopNavbar() {
  const { data: session } = useSession()

  return (
    <nav className="h-16 bg-background border-b border-border px-6 flex items-center justify-between">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input placeholder="Search..." className="pl-10" />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {session?.user?.userType === 'ADMIN' && <AdminThemeControl />}
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </Button>
        {session ? (
          <ProfileDropdown />
        ) : (
          <div className="flex items-center space-x-2">
            <Link href="/auth/signup">
              <Button variant="outline" size="sm">
                Sign Up
              </Button>
            </Link>
            <Button onClick={() => signIn()} size="sm">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}