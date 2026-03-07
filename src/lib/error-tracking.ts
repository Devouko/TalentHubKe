import * as Sentry from '@sentry/nextjs'

export const trackError = (error: Error, context?: Record<string, any>) => {
  console.error('Error:', error)
  
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, {
      extra: context,
      tags: {
        section: context?.section || 'unknown'
      }
    })
  }
}

export const trackEvent = (eventName: string, data?: Record<string, any>) => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.addBreadcrumb({
      message: eventName,
      data,
      level: 'info'
    })
  }
}

export const setUserContext = (user: { id: string; email?: string; userType?: string }) => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      userType: user.userType
    })
  }
}