import { Prisma } from '@prisma/client'

// Core entity types with relations
export type FirmWithUsers = Prisma.FirmGetPayload<{
  include: { users: true; clients: true; projects: true }
}>

export type UserWithFirm = Prisma.UserGetPayload<{
  include: { firm: true }
}>

export type ProjectWithDetails = Prisma.ProjectGetPayload<{
  include: {
    client: true
    firm: true
    projectManager: true
    tasks: {
      include: {
        assignee: true
        creator: true
      }
    }
    milestones: true
    files: true
    projectProducts: {
      include: {
        product: {
          include: {
            supplier: true
          }
        }
      }
    }
  }
}>

export type TaskWithDetails = Prisma.TaskGetPayload<{
  include: {
    project: {
      include: {
        client: true
      }
    }
    assignee: true
    creator: true
    subtasks: true
    parentTask: true
    files: true
  }
}>

export type ClientWithProjects = Prisma.ClientGetPayload<{
  include: {
    projects: {
      include: {
        tasks: true
        projectManager: true
      }
    }
  }
}>

export type ProductWithSupplier = Prisma.ProductGetPayload<{
  include: {
    supplier: true
    firm: true
  }
}>

// Chat and AI types
export type ChatMessage = {
  id: string
  type: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  intent?: string
  entities?: Record<string, any>
  context?: Record<string, any>
}

export type ChatSession = {
  id: string
  userId: string
  messages: ChatMessage[]
  context: {
    currentProject?: string
    timeWindow?: string
    firmId: string
  }
}

// AI Intent and Entity types
export type Intent = 
  | 'create_project'
  | 'create_task'
  | 'create_client'
  | 'update_project'
  | 'update_task'
  | 'schedule_meeting'
  | 'add_product'
  | 'get_status'
  | 'search'
  | 'unknown'

export type Entity = {
  type: string
  value: string
  confidence: number
  metadata?: Record<string, any>
}

export type ParsedIntent = {
  intent: Intent
  confidence: number
  entities: Entity[]
  originalText: string
}

// Project stage types for different project types
export type ProjectStage = 
  | 'stage_0' // Brief & Discovery
  | 'stage_1' // Concept Development
  | 'stage_2' // Design Development
  | 'stage_3' // Technical Design
  | 'stage_4' // Production Information
  | 'stage_5' // Manufacturing & Construction
  | 'stage_6' // Handover & Close Out
  | 'stage_7' // In Use

export type ProjectType = 'interior' | 'architecture' | 'branding' | 'web'

export type TaskStatus = 'pending' | 'in_progress' | 'client_review' | 'complete' | 'blocked'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export type ProjectStatus = 'active' | 'on_hold' | 'completed' | 'cancelled'

// API Response types
export type ApiResponse<T = any> = {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export type PaginatedResponse<T> = {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

// Form types for project management
export type CreateProjectForm = {
  name: string
  description?: string
  clientId: string
  type: ProjectType
  budget?: number
  currency: string
  timelineStart?: Date
  timelineEnd?: Date
  projectManagerId?: string
}

export type CreateTaskForm = {
  title: string
  description?: string
  projectId: string
  parentTaskId?: string
  stage?: string
  priority: TaskPriority
  dueDate?: Date
  estimatedHours?: number
  assigneeId?: string
  tags?: string[]
}

export type CreateClientForm = {
  name: string
  email?: string
  phone?: string
  company?: string
  address?: any
  contactPerson?: string
  notes?: string
}

// Integration types
export type IntegrationType = 'google' | 'xero' | 'runway' | 'elevenlabs'
export type IntegrationStatus = 'connected' | 'disconnected' | 'error' | 'pending'

export type Integration = {
  id: string
  serviceName: string
  serviceType: string
  isActive: boolean
  syncStatus: IntegrationStatus
  lastSyncAt?: Date
  errorMessage?: string
}

// File upload types
export type FileUpload = {
  id: string
  name: string
  originalName: string
  fileType: string
  fileSize: number
  mimeType: string
  storageUrl: string
  thumbnailUrl?: string
  isPublic: boolean
  metadata: Record<string, any>
}

// Analytics types
export type ProjectAnalytics = {
  tasksCompleted: number
  tasksTotal: number
  completionPercentage: number
  budgetUsed: number
  timelineProgress: number
  teamUtilization: number
}

export type DashboardMetrics = {
  activeProjects: number
  overdueTasks: number
  upcomingDeadlines: number
  teamUtilization: number
  monthlyRevenue: number
  clientSatisfaction: number
}

// Color palette types for AI color extraction
export type ColorPalette = {
  dominant: string[]
  accent: string[]
  neutral: string[]
  metadata: {
    temperature: 'warm' | 'cool' | 'neutral'
    saturation: 'high' | 'medium' | 'low'
    brightness: 'light' | 'medium' | 'dark'
  }
}

// Mood board types
export type MoodBoardItem = {
  id: string
  type: 'product' | 'image' | 'color' | 'text'
  content: any
  position: { x: number; y: number }
  size: { width: number; height: number }
  metadata?: Record<string, any>
}

export type MoodBoard = {
  id: string
  projectId: string
  name: string
  items: MoodBoardItem[]
  createdBy: string
  createdAt: Date
}

// Supplier and product types
export type ProductCategory = 
  | 'lighting'
  | 'furniture'
  | 'fabrics'
  | 'finishes'
  | 'hardware'
  | 'accessories'

export type ProductStyle = 
  | 'modern'
  | 'traditional'
  | 'industrial'
  | 'scandinavian'
  | 'minimalist'
  | 'rustic'
  | 'contemporary'

// Calendar integration types
export type CalendarEvent = {
  id: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  attendees: string[]
  location?: string
  isRecurring: boolean
  projectId?: string
  taskId?: string
}

// Notification types
export type NotificationType = 
  | 'task_assigned'
  | 'task_completed'
  | 'project_updated'
  | 'deadline_approaching'
  | 'client_message'
  | 'system_alert'

export type Notification = {
  id: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  userId: string
  entityId?: string
  entityType?: string
  createdAt: Date
}

// Error types for better error handling
export type AppError = {
  code: string
  message: string
  details?: Record<string, any>
  stack?: string
}

// Export commonly used Prisma types
export type {
  Firm,
  User,
  Client,
  Project,
  Task,
  TaskDependency,
  Milestone,
  Comment,
  File,
  Supplier,
  Product,
  ProjectProduct,
  ChatHistory,
  AuditLog
} from '@prisma/client'