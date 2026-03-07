"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DashboardSidebar } from '@/components/ui/dashboard-sidebar'
import { Bell, Moon, Sun, User } from 'lucide-react'
import { useState, useEffect } from 'react'

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && status === 'unauthenticated') {
      router.push('/auth')
    }
  }, [status, mounted, router])

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle('dark', isDark)
    }
  }, [isDark, mounted])

  if (!mounted || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="flex min-h-screen w-full bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 font-sans antialiased">
        <DashboardSidebar
          userType={session?.user?.userType}
          userName={session?.user?.name || "User"}
          userPlan="Premium"
        />
        
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-16 flex items-center justify-between px-8 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
            <div className="flex items-center gap-4">
               <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">TalantaHub</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 bg-orange-500 rounded-full border-2 border-white dark:border-[#0f172a]"></span>
              </button>
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>
              <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                <span className="text-sm font-medium hidden sm:block">{session?.user?.name}</span>
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-orange-500 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-orange-500/20">
                  {session?.user?.name?.[0]}
                </div>
              </button>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-8 lg:p-12 max-w-[1600px] mx-auto w-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
