'use client'

import { useSession } from 'next-auth/react'

export default function AuthTest() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (status === 'unauthenticated') {
    return <div>Not authenticated</div>
  }

  return (
    <div className="p-4 bg-green-100 rounded">
      <h3>Auth Working ✅</h3>
      <p>User: {session?.user?.name}</p>
      <p>Email: {session?.user?.email}</p>
      <p>Type: {session?.user?.userType}</p>
    </div>
  )
}