// Core entity types
export interface User {
  id: string
  firmId: string
  email: string
  firstName: string | null
  lastName: string | null
  role: string
  avatarUrl?: string | null
  firm?: {
    id: string
    name: string
    slug: string
    subscriptionTier: string
  }
}

export interface Client {
  id: string
  firmId: string
  name: string
  email?: string | null
  phone?: string | null
  company?: string | null
  status: string
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  firmId: string
  clientId: string
  name: string
  description?: string | null
  type: string
  status: string
  currentStage: string
  budget?: number | null
  timelineStart?: Date | null
  timelineEnd?: Date | null
  projectManagerId?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Task {
  id: string
  projectId: string
  title: string
  description?: string | null
  status: TaskStatus
  priority: string
  dueDate?: Date | null
  assigneeId?: string | null
  createdAt: Date
  updatedAt: Date
}

// Enums and constants
export const PROJECT_STAGES = {
  stage_0: 'Initial Brief',
  stage_1: 'Concept Development',
  stage_2: 'Design Development', 
  stage_3: 'Technical Design',
  stage_4: 'Implementation',
  stage_5: 'Completion'
} as const

export const TASK_STATUS = {
  pending: 'Pending',
  in_progress: 'In Progress',
  client_review: 'Client Review',
  complete: 'Complete',
  blocked: 'Blocked'
} as const

export type ProjectStage = keyof typeof PROJECT_STAGES
export type TaskStatus = keyof typeof TASK_STATUS

// API types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
    timestamp: string
    requestId: string
  }
  meta?: any
}

// Dashboard types
export interface DashboardStats {
  activeProjects: number
  tasksDue: number
  clientCount: number
  revenue: number
}

// Chat and AI types
export interface ChatMessage {
  id: string
  type: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  actions?: ChatAction[]
}

export interface ChatAction {
  type: string
  description: string
  data?: any
}

export type Intent = 
  | 'create_project'
  | 'create_task'
  | 'create_client'
  | 'get_project_status'
  | 'schedule_meeting'
  | 'search_entities'
  | 'unknown'

export interface Entity {
  type: string
  value: string
  confidence: number
}

export interface ParsedIntent {
  intent: Intent
  confidence: number
  entities: Entity[]
  originalText: string
}