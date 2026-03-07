'use client'

import { useEffect } from 'react'

export function ExtensionBlocker() {
  useEffect(() => {
    // Prevent extensions from interfering with createElement
    if (typeof window !== 'undefined') {
      const originalCreateElement = document.createElement.bind(document)
      
      document.createElement = function(tagName: string, options?: ElementCreationOptions) {
        // Block empty tag names from extensions
        if (!tagName || tagName.trim() === '') {
          console.warn('Blocked invalid createElement call from extension')
          return document.createDocumentFragment() as any
        }
        return originalCreateElement(tagName, options)
      }
    }
  }, [])

  return null
}
