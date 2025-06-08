import { NextRequest } from 'next/server'
import { requireAuth, handleApiError, successResponse } from '@/lib/api-utils'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    
    // Get dashboard statistics for user's firm
    const stats = await db.getDashboardStats(user.firmId)
    
    return successResponse(stats)
  } catch (error) {
    return handleApiError(error as Error)
  }
}