'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to auth page with signup mode
    router.replace('/auth?mode=signup')
  }, [router])
  
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">Redirecting to signup...</div>
    </div>
  )
}
