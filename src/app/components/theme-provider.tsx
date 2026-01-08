/**
 * Theme Provider Component
 * 
 * Provides theme context (light/dark mode) to the entire application using next-themes.
 * Handles theme persistence, system preference detection, and theme switching.
 * 
 * Features:
 * - Automatic system theme detection
 * - Theme persistence in localStorage
 * - Smooth theme transitions
 * - SSR-safe theme loading
 */

'use client'

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

/**
 * ThemeProvider wrapper component
 * 
 * @param children - React children components
 * @param props - Theme provider configuration props
 * @returns JSX element with theme context
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}