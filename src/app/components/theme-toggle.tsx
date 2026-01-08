/**
 * Theme Toggle Component
 * 
 * A button component that allows users to switch between light and dark themes.
 * Uses next-themes for theme management and lucide-react for icons.
 * 
 * Features:
 * - Visual feedback with sun/moon icons
 * - Smooth transitions between themes
 * - Accessible button with proper ARIA labels
 * - Responsive design
 */

"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/app/components/ui/button"

/**
 * ThemeToggle Component
 * 
 * Renders a button that toggles between light and dark themes.
 * Shows sun icon in dark mode and moon icon in light mode.
 * 
 * @returns JSX button element for theme switching
 */
export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative"
      aria-label="Toggle theme"
    >
      {/* Sun icon - visible in dark mode */}
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      
      {/* Moon icon - visible in light mode */}
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}