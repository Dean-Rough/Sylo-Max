import { PrismaClient } from '@prisma/client'
import type { User, DashboardStats } from '@/types'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Database operations class
class DatabaseOperations {
  constructor(public prisma: PrismaClient) {}

  // User operations
  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { 
        email,
        deletedAt: null
      },
      include: {
        firm: {
          select: { 
            id: true, 
            name: true, 
            slug: true, 
            subscriptionTier: true 
          }
        }
      }
    })

    if (!user) return null

    return {
      id: user.id,
      firmId: user.firmId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      avatarUrl: user.avatarUrl,
      firm: user.firm
    }
  }

  // Dashboard statistics
  async getDashboardStats(firmId: string): Promise<DashboardStats> {
    const [
      activeProjectsCount,
      tasksDueCount,
      clientCount,
      revenueSum
    ] = await Promise.all([
      // Active projects
      this.prisma.project.count({
        where: {
          firmId,
          status: { in: ['active', 'in_progress'] },
          deletedAt: null
        }
      }),
      
      // Tasks due in next 7 days
      this.prisma.task.count({
        where: {
          project: { firmId },
          dueDate: {
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          },
          status: { not: 'complete' },
          deletedAt: null
        }
      }),
      
      // Active clients
      this.prisma.client.count({
        where: {
          firmId,
          status: 'active',
          deletedAt: null
        }
      }),
      
      // Total revenue from completed projects
      this.prisma.project.aggregate({
        where: {
          firmId,
          status: 'complete',
          deletedAt: null
        },
        _sum: { budget: true }
      })
    ])

    return {
      activeProjects: activeProjectsCount,
      tasksDue: tasksDueCount,
      clientCount: clientCount,
      revenue: Number(revenueSum._sum.budget) || 0
    }
  }

  // Get recent projects
  async getProjectsForFirm(firmId: string, limit: number = 5) {
    return await this.prisma.project.findMany({
      where: {
        firmId,
        deletedAt: null
      },
      include: {
        client: {
          select: { name: true }
        },
        tasks: {
          where: { deletedAt: null },
          select: { status: true }
        },
        projectManager: {
          select: { 
            id: true, 
            firstName: true, 
            lastName: true 
          }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: limit
    })
  }

  // Get tasks due
  async getTasksDueForFirm(firmId: string, days: number = 7) {
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + days)

    return await this.prisma.task.findMany({
      where: {
        project: { firmId },
        dueDate: {
          gte: new Date(),
          lte: endDate
        },
        deletedAt: null
      },
      include: {
        project: {
          select: { name: true }
        },
        assignee: {
          select: { 
            firstName: true, 
            lastName: true 
          }
        }
      },
      orderBy: { dueDate: 'asc' }
    })
  }

  // Create project
  async createProject(data: {
    firmId: string
    clientId: string
    name: string
    description?: string
    type: string
    budget?: number
    timelineEnd?: Date
    projectManagerId: string
    createdBy: string
  }) {
    return await this.prisma.project.create({
      data: {
        ...data,
        status: 'active',
        currentStage: 'stage_0'
      },
      include: {
        client: true,
        projectManager: {
          select: { firstName: true, lastName: true }
        }
      }
    })
  }

  // Create task
  async createTask(data: {
    projectId: string
    title: string
    description?: string
    priority?: string
    dueDate?: Date
    assigneeId?: string
    createdBy: string
  }) {
    return await this.prisma.task.create({
      data: {
        ...data,
        status: 'pending',
        priority: data.priority || 'medium'
      },
      include: {
        project: { select: { name: true } },
        assignee: { 
          select: { firstName: true, lastName: true }
        }
      }
    })
  }

  // Create client
  async createClient(data: {
    firmId: string
    name: string
    email?: string
    phone?: string
    company?: string
    createdBy: string
  }) {
    return await this.prisma.client.create({
      data: {
        ...data,
        status: 'active'
      }
    })
  }

  // Search operations
  async searchProjects(firmId: string, query: string, limit: number = 5) {
    return await this.prisma.project.findMany({
      where: {
        firmId,
        deletedAt: null,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: {
        client: { select: { name: true } }
      },
      take: limit
    })
  }

  async searchClients(firmId: string, query: string, limit: number = 5) {
    return await this.prisma.client.findMany({
      where: {
        firmId,
        deletedAt: null,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { company: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: limit
    })
  }

  async searchTasks(firmId: string, query: string, limit: number = 5) {
    return await this.prisma.task.findMany({
      where: {
        project: { firmId },
        deletedAt: null,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: {
        project: { select: { name: true } },
        assignee: { 
          select: { firstName: true, lastName: true }
        }
      },
      take: limit
    })
  }
}

export const db = new DatabaseOperations(prisma)