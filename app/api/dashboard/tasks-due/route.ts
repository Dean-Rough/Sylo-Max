import { NextRequest } from 'next/server'
import { requireAuth, handleApiError, successResponse } from '@/lib/api-utils'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '7')
    
    // Get tasks due within the specified number of days
    const tasks = await db.getTasksDueForFirm(user.firmId, days)
    
    // Count overdue tasks
    const now = new Date()
    const overdue = tasks.filter(task => 
      task.dueDate && task.dueDate < now
    ).length
    
    // Format tasks for response
    const formattedTasks = tasks.map(task => ({
      id: task.id,
      title: task.title,
      project: task.project?.name || 'Unknown Project',
      dueDate: task.dueDate,
      priority: task.priority,
      assignee: task.assignee 
        ? `${task.assignee.firstName} ${task.assignee.lastName}`.trim()
        : 'Unassigned',
      status: task.status
    }))
    
    return successResponse({
      tasks: formattedTasks,
      overdue
    })
  } catch (error) {
    return handleApiError(error as Error)
  }
}