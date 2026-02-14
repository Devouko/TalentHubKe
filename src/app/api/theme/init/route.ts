import { NextResponse } from 'next/server'
import { ThemeService } from '@/lib/theme.service'
import { ApiUtils } from '@/lib/api.utils'

export async function POST() {
  return ApiUtils.withErrorHandling(async () => {
    await ThemeService.initializeDefaultThemes()
    return { success: true, message: 'Default themes initialized' }
  })
}