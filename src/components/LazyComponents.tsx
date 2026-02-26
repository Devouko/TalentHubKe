import dynamic from 'next/dynamic'

// Lazy load heavy components
export const LazyReviewSection = dynamic(
  () => import('@/components/reviews/ReviewSectionComplete').then(mod => ({ default: mod.ReviewSectionComplete })),
  { 
    loading: () => <div className="animate-pulse bg-slate-200 dark:bg-slate-700 h-64 rounded-lg" />,
    ssr: false 
  }
)

export const LazyChart = dynamic(
  () => import('recharts').then(mod => mod),
  { loading: () => <div className="animate-pulse bg-slate-200 h-64 rounded" /> }
)

export const LazyEditor = dynamic(
  () => import('@/components/Editor'),
  { loading: () => <div className="animate-pulse bg-slate-200 h-96 rounded" />, ssr: false }
)
