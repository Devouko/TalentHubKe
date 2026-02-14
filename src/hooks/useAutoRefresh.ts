import { useEffect, useRef, useCallback } from 'react'

interface UseAutoRefreshOptions {
  interval?: number // in milliseconds
  enabled?: boolean
  onRefresh: () => void | Promise<void>
}

export const useAutoRefresh = ({ 
  interval = 30000, // 30 seconds default
  enabled = true, 
  onRefresh 
}: UseAutoRefreshOptions) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isActiveRef = useRef(true)

  const startRefresh = useCallback(() => {
    if (!enabled || intervalRef.current) return

    intervalRef.current = setInterval(async () => {
      if (isActiveRef.current && document.visibilityState === 'visible') {
        try {
          await onRefresh()
        } catch (error) {
          console.error('Auto-refresh error:', error)
        }
      }
    }, interval)
  }, [enabled, interval, onRefresh])

  const stopRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const manualRefresh = useCallback(async () => {
    try {
      await onRefresh()
    } catch (error) {
      console.error('Manual refresh error:', error)
    }
  }, [onRefresh])

  useEffect(() => {
    const handleVisibilityChange = () => {
      isActiveRef.current = document.visibilityState === 'visible'
      if (isActiveRef.current && enabled) {
        startRefresh()
      } else {
        stopRefresh()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    if (enabled) {
      startRefresh()
    }

    return () => {
      stopRefresh()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [enabled, startRefresh, stopRefresh])

  return { manualRefresh, stopRefresh, startRefresh }
}