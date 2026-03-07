'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Ignore Chrome extension errors
    if (error.message?.includes('chrome-extension://') || 
        error.message?.includes('InvalidCharacterError') ||
        errorInfo?.componentStack?.includes('chrome-extension://')) {
      this.setState({ hasError: false, error: null })
      return
    }
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError && this.state.error) {
      // Don't show error UI for extension errors
      if (this.state.error.message?.includes('chrome-extension://') || 
          this.state.error.message?.includes('InvalidCharacterError')) {
        return this.props.children
      }

      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <button 
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}