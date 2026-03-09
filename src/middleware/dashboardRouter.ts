/**
 * Dashboard Router Middleware
 * Redirects users to appropriate dashboard based on their role
 */

import { UserType } from '@prisma/client'

export interface DashboardRoute {
  path: string
  label: string
  icon: string
}

export const DASHBOARD_ROUTES: Record<UserType, DashboardRoute> = {
  CLIENT: {
    path: '/client-dashboard',
    label: 'Client Dashboard',
    icon: 'briefcase'
  },
  FREELANCER: {
    path: '/freelancer-dashboard',
    label: 'Freelancer Dashboard',
    icon: 'user'
  },
  SELLER: {
    path: '/seller-dashboard',
    label: 'Seller Dashboard',
    icon: 'store'
  },
  ADMIN: {
    path: '/admin',
    label: 'Admin Dashboard',
    icon: 'shield'
  }
}

export function getDashboardPath(userType: UserType | null | undefined): string {
  if (!userType) return '/dashboard' // Default fallback
  return DASHBOARD_ROUTES[userType]?.path || '/dashboard'
}

export function getDashboardLabel(userType: UserType | null | undefined): string {
  if (!userType) return 'Dashboard'
  return DASHBOARD_ROUTES[userType]?.label || 'Dashboard'
}

export function canAccessDashboard(userType: UserType | null | undefined, dashboardPath: string): boolean {
  if (!userType) return false
  
  // Admin can access all dashboards
  if (userType === 'ADMIN') return true
  
  // Users can only access their own dashboard
  return getDashboardPath(userType) === dashboardPath
}
