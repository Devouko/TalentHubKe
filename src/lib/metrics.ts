export function measurePerformance(name: string) {
  if (typeof window === 'undefined') return

  const start = performance.now()

  return {
    end: () => {
      const duration = performance.now() - start
      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)
      
      // Send to analytics if needed
      if (duration > 1000) {
        console.warn(`[Performance Warning] ${name} took ${duration.toFixed(2)}ms`)
      }
    }
  }
}

export function reportWebVitals(metric: any) {
  if (metric.label === 'web-vital') {
    console.log(`[Web Vital] ${metric.name}:`, metric.value)
  }
}
