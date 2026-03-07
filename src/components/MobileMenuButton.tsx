'use client'

import { useSidebar } from '../context/SidebarContext'

export function MobileMenuButton() {
  const { isOpen, toggle } = useSidebar()
  
  return (
    <button
      onClick={toggle}
      className="lg:hidden p-2 hover:bg-[var(--surface)] rounded-xl transition-all duration-300"
    >
      <svg className="w-6 h-6 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  )
}