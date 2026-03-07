'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HireRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/all-talent')
  }, [router])

  return null
}
