'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function AdminRedirect() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || status === 'loading') return
    
    if (session?.user?.userType === 'ADMIN') {
      router.push('/admin')
    }
  }, [session, status, router, mounted])

  if (!mounted) return null
  return null
}