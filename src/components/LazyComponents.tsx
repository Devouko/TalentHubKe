import { lazy, Suspense } from 'react'

const LazyCheckoutComponent = lazy(() => import('@/components/CheckoutComponent'))
const LazyOrderSuccess = lazy(() => import('@/components/OrderSuccess'))
const LazyCartComponent = lazy(() => import('@/components/CartComponent'))
const LazyApplicationManager = lazy(() => import('@/components/ApplicationManager'))

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
)

export const CheckoutComponent = (props: any) => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyCheckoutComponent {...props} />
  </Suspense>
)

export const OrderSuccess = (props: any) => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyOrderSuccess {...props} />
  </Suspense>
)

export const CartComponent = (props: any) => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyCartComponent {...props} />
  </Suspense>
)

export const ApplicationManager = (props: any) => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyApplicationManager {...props} />
  </Suspense>
)