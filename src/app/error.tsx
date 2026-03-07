'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Something went wrong!</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">An error occurred while loading this page.</p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}