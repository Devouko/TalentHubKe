'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { 
  Shield, 
  LogOut, 
  Settings, 
  Users, 
  BarChart3, 
  Palette, 
  DollarSign,
  Package,
  AlertTriangle
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (status === 'loading') return

    if (!session || session.user?.userType !== 'ADMIN') {
      router.push('/auth')
      return
    }
  }, [session, status, router])

  const handleLogout = async () => {
    const { signOut } = await import('next-auth/react')
    await signOut({ callbackUrl: '/auth' })
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-green-400 text-xl">Loading Admin Panel...</div>
      </div>
    )
  }

  if (!session || session.user?.userType !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-red-400 text-xl">Access Denied</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {/* Admin Header */}
      <header className="border-b border-green-400/30 bg-black/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="w-8 h-8 text-green-400" />
              <div>
                <h1 className="text-xl font-bold text-green-400">ADMIN CONTROL PANEL</h1>
                <p className="text-xs text-green-400/60">SYSTEM ADMINISTRATOR ACCESS</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-green-400">
                  {currentTime.toLocaleTimeString()}
                </div>
                <div className="text-xs text-green-400/60">
                  {currentTime.toLocaleDateString()}
                </div>
              </div>
              
              <Badge variant="outline" className="border-green-400 text-green-400">
                <Shield className="w-3 h-3 mr-1" />
                ADMIN
              </Badge>
              
              <div className="text-right">
                <div className="text-sm text-green-400">{session.user?.name}</div>
                <div className="text-xs text-green-400/60">{session.user?.email}</div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-red-400 text-red-400 hover:bg-red-400/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                LOGOUT
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Navigation */}
      <nav className="border-b border-green-400/30 bg-black/50">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              size="sm"
              className="text-green-400 hover:bg-green-400/10"
              onClick={() => router.push('/admin')}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              DASHBOARD
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-green-400 hover:bg-green-400/10"
              onClick={() => router.push('/admin/users')}
            >
              <Users className="w-4 h-4 mr-2" />
              USER CONTROL
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-green-400 hover:bg-green-400/10"
              onClick={() => router.push('/admin/products')}
            >
              <Package className="w-4 h-4 mr-2" />
              PRODUCT MGMT
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-green-400 hover:bg-green-400/10"
              onClick={() => router.push('/admin/escrow')}
            >
              <DollarSign className="w-4 h-4 mr-2" />
              ESCROW CONTROL
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-green-400 hover:bg-green-400/10"
              onClick={() => router.push('/admin/theme')}
            >
              <Palette className="w-4 h-4 mr-2" />
              THEME CONFIG
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-green-400 hover:bg-green-400/10"
              onClick={() => router.push('/admin/settings')}
            >
              <Settings className="w-4 h-4 mr-2" />
              SYSTEM CONFIG
            </Button>
          </div>
        </div>
      </nav>

      {/* System Status Bar */}
      <div className="border-b border-green-400/30 bg-green-400/5">
        <div className="container mx-auto px-6 py-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-6">
              <span className="text-green-400">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                SYSTEM ONLINE
              </span>
              <span className="text-green-400/60">
                SERVER: OPERATIONAL
              </span>
              <span className="text-green-400/60">
                DATABASE: CONNECTED
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-green-400/60">
                SECURITY LEVEL: MAXIMUM
              </span>
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>

      {/* Admin Footer */}
      <footer className="border-t border-green-400/30 bg-black/90 mt-auto">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-xs text-green-400/60">
            <div>
              © 2024 TalentHub Admin Panel - Restricted Access
            </div>
            <div className="flex items-center space-x-4">
              <span>Session Active</span>
              <span>•</span>
              <span>All Actions Logged</span>
              <span>•</span>
              <span>Secure Connection</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}