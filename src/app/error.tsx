'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <p className="text-gray-400 mb-6">An error occurred while loading this page.</p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-green-500 text-black rounded-lg hover:bg-green-600"
        >
          Try again
        </button>
      </div>
    </div>
  )
}