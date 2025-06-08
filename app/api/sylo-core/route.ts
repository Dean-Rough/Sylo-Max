import { NextRequest } from 'next/server'
import { requireAuth, handleApiError, successResponse, AppError, ErrorCodes } from '@/lib/api-utils'
import { aiService } from '@/lib/ai'
import { db } from '@/lib/db'
import type { ChatAction } from '@/types'

// Service orchestrator for executing AI-parsed intents
class ServiceOrchestrator {
  constructor(private user: any) {}

  async executeIntent(intent: any): Promise<ChatAction[]> {
    const actions: ChatAction[] = []

    try {
      switch (intent.intent) {
        case 'create_project':
          actions.push(await this.createProject(intent.entities))
          break
        case 'create_task':
          actions.push(await this.createTask(intent.entities))
          break
        case 'create_client':
          actions.push(await this.createClient(intent.entities))
          break
        case 'get_project_status':
          actions.push(await this.getProjectStatus(intent.entities))
          break
        case 'search_entities':
          actions.push(await this.searchEntities(intent.entities))
          break
        default:
          actions.push({
            type: 'info',
            description: 'I understand your request but no specific action was needed.',
            data: { intent: intent.intent }
          })
      }
    } catch (error) {
      actions.push({
        type: 'error',
        description: `Failed to execute action: ${error instanceof Error ? error.message : 'Unknown error'}`,
        data: { error: error instanceof Error ? error.message : 'Unknown error' }
      })
    }

    return actions
  }

  private async createProject(entities: any[]): Promise<ChatAction> {
    // Extract project data from entities
    const projectData: any = {}
    entities.forEach(entity => {
      switch (entity.type) {
        case 'name':
          projectData.name = entity.value
          break
        case 'clientName':
          projectData.clientName = entity.value
          break
        case 'projectType':
          projectData.type = entity.value
          break
        case 'budget':
          projectData.budget = parseFloat(entity.value)
          break
        case 'description':
          projectData.description = entity.value
          break
        case 'deadline':
          projectData.timelineEnd = new Date(entity.value)
          break
      }
    })

    // Find or create client
    let client = await db.prisma.client.findFirst({
      where: {
        firmId: this.user.firmId,
        name: { contains: projectData.clientName, mode: 'insensitive' },
        deletedAt: null
      }
    })

    if (!client) {
      client = await db.prisma.client.create({
        data: {
          firmId: this.user.firmId,
          name: projectData.clientName,
          status: 'active',
          createdBy: this.user.id
        }
      })
    }

    // Create project
    const project = await db.prisma.project.create({
      data: {
        firmId: this.user.firmId,
        clientId: client.id,
        name: projectData.name,
        description: projectData.description,
        type: projectData.type,
        budget: projectData.budget,
        timelineEnd: projectData.timelineEnd,
        projectManagerId: this.user.id,
        createdBy: this.user.id
      },
      include: {
        client: true
      }
    })

    return {
      type: 'create_project',
      description: `Created project "${project.name}" for ${client.name}`,
      data: { project, client }
    }
  }

  private async createTask(entities: any[]): Promise<ChatAction> {
    const taskData: any = {}
    entities.forEach(entity => {
      switch (entity.type) {
        case 'title':
          taskData.title = entity.value
          break
        case 'projectId':
          taskData.projectId = entity.value
          break
        case 'description':
          taskData.description = entity.value
          break
        case 'priority':
          taskData.priority = entity.value
          break
        case 'dueDate':
          taskData.dueDate = new Date(entity.value)
          break
      }
    })

    // Verify project exists and user has access
    const project = await db.prisma.project.findFirst({
      where: {
        id: taskData.projectId,
        firmId: this.user.firmId,
        deletedAt: null
      }
    })

    if (!project) {
      throw new AppError(ErrorCodes.PROJECT_NOT_FOUND, 'Project not found')
    }

    const task = await db.prisma.task.create({
      data: {
        projectId: taskData.projectId,
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority || 'medium',
        dueDate: taskData.dueDate,
        assigneeId: this.user.id,
        createdBy: this.user.id
      },
      include: {
        project: { select: { name: true } }
      }
    })

    return {
      type: 'create_task',
      description: `Created task "${task.title}" in project ${task.project.name}`,
      data: { task }
    }
  }

  private async createClient(entities: any[]): Promise<ChatAction> {
    const clientData: any = {}
    entities.forEach(entity => {
      switch (entity.type) {
        case 'name':
          clientData.name = entity.value
          break
        case 'email':
          clientData.email = entity.value
          break
        case 'phone':
          clientData.phone = entity.value
          break
        case 'company':
          clientData.company = entity.value
          break
      }
    })

    const client = await db.prisma.client.create({
      data: {
        firmId: this.user.firmId,
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        company: clientData.company,
        status: 'active',
        createdBy: this.user.id
      }
    })

    return {
      type: 'create_client',
      description: `Created client record for ${client.name}`,
      data: { client }
    }
  }

  private async getProjectStatus(entities: any[]): Promise<ChatAction> {
    const filters: any = { firmId: this.user.firmId, deletedAt: null }
    
    entities.forEach(entity => {
      switch (entity.type) {
        case 'projectId':
          filters.id = entity.value
          break
        case 'clientName':
          filters.client = {
            name: { contains: entity.value, mode: 'insensitive' }
          }
          break
      }
    })

    const projects = await db.prisma.project.findMany({
      where: filters,
      include: {
        client: { select: { name: true } },
        tasks: {
          where: { deletedAt: null },
          select: { status: true }
        }
      },
      take: 10
    })

    const projectsWithProgress = projects.map(project => {
      const totalTasks = project.tasks.length
      const completedTasks = project.tasks.filter(t => t.status === 'complete').length
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

      return {
        id: project.id,
        name: project.name,
        client: project.client.name,
        status: project.status,
        stage: project.currentStage,
        progress: `${progress}%`,
        totalTasks,
        completedTasks
      }
    })

    return {
      type: 'get_project_status',
      description: `Found ${projects.length} project(s)`,
      data: { projects: projectsWithProgress }
    }
  }

  private async searchEntities(entities: any[]): Promise<ChatAction> {
    let query = ''
    let type = 'all'

    entities.forEach(entity => {
      switch (entity.type) {
        case 'query':
          query = entity.value
          break
        case 'type':
          type = entity.value
          break
      }
    })

    const results: any = {}

    if (type === 'all' || type === 'projects') {
      results.projects = await db.prisma.project.findMany({
        where: {
          firmId: this.user.firmId,
          deletedAt: null,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ]
        },
        include: { client: { select: { name: true } } },
        take: 5
      })
    }

    if (type === 'all' || type === 'clients') {
      results.clients = await db.prisma.client.findMany({
        where: {
          firmId: this.user.firmId,
          deletedAt: null,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { company: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: 5
      })
    }

    if (type === 'all' || type === 'tasks') {
      results.tasks = await db.prisma.task.findMany({
        where: {
          project: { firmId: this.user.firmId },
          deletedAt: null,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ]
        },
        include: { 
          project: { select: { name: true } },
          assignee: { select: { firstName: true, lastName: true } }
        },
        take: 5
      })
    }

    return {
      type: 'search_results',
      description: `Search results for "${query}"`,
      data: results
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()
    
    const { message, context = {} } = body

    if (!message) {
      throw new AppError(ErrorCodes.MISSING_REQUIRED_FIELD, 'Message is required')
    }

    // Add user's firm context
    const chatContext = {
      ...context,
      firmId: user.firmId,
      userId: user.id
    }

    // Parse user intent using AI
    const parsedIntent = await aiService.parseIntent(message, chatContext)
    
    // Execute actions based on intent
    const orchestrator = new ServiceOrchestrator(user)
    const actions = await orchestrator.executeIntent(parsedIntent)
    
    // Generate AI response
    const response = await aiService.generateResponse(parsedIntent, chatContext, actions)
    
    // Generate suggestions for next actions
    const suggestions = await aiService.generateSuggestions(chatContext)

    // Save chat message to history
    await db.prisma.chatHistory.create({
      data: {
        userId: user.id,
        sessionId: context.sessionId || `session_${Date.now()}`,
        messageType: 'user',
        content: message,
        intent: parsedIntent.intent,
        entities: parsedIntent.entities as any, // Convert to JSON-compatible format
        context: chatContext as any // Convert to JSON-compatible format
      }
    })

    await db.prisma.chatHistory.create({
      data: {
        userId: user.id,
        sessionId: context.sessionId || `session_${Date.now()}`,
        messageType: 'assistant',
        content: response,
        context: { actions, suggestions } as any // Convert to JSON-compatible format
      }
    })

    return successResponse({
      response,
      actions,
      suggestions,
      intent: parsedIntent.intent,
      confidence: parsedIntent.confidence
    })

  } catch (error) {
    return handleApiError(error as Error)
  }
}