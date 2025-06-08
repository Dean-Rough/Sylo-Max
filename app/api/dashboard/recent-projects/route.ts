import { NextRequest } from 'next/server'
import { requireAuth, handleApiError, successResponse } from '@/lib/api-utils'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '5')
    
    // Get recent projects for user's firm
    const projects = await db.getProjectsForFirm(user.firmId, limit)
    
    // Calculate progress for each project
    const projectsWithProgress = projects.map(project => {
      const totalTasks = project.tasks.length
      const completedTasks = project.tasks.filter(task => task.status === 'complete').length
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
      
      return {
        id: project.id,
        name: project.name,
        client: project.client?.name || 'Unknown Client',
        progress,
        status: project.status,
        dueDate: project.timelineEnd,
        priority: project.currentStage === 'stage_0' ? 'high' : 'medium',
        type: project.type
      }
    })
    
    return successResponse(projectsWithProgress)
  } catch (error) {
    return handleApiError(error as Error)
  }
}