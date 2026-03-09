'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SigninRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to auth page with signin mode (default)
    router.replace('/auth')
  }, [router])
  
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">Redirecting to signin...</div>
    </div>
  )
}
