import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">404 - Not Found</h2>
        <p className="mb-4 text-gray-400">Could not find requested resource</p>
        <Link href="/" className="px-4 py-2 bg-green-500 text-black rounded hover:bg-green-600">
          Return Home
        </Link>
      </div>
    </div>
  )
}