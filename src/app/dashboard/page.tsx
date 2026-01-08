'use client'

import { AuthGuard } from '@/components/auth/AuthGuard'
import DashboardContent from './DashboardContent'

export default function Dashboard() {
  return (
    <AuthGuard allowedRoles={['CLIENT', 'FREELANCER', 'AGENCY']}>
      <DashboardContent />
    </AuthGuard>
  )
}