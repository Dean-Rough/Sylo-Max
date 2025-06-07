# Sylo-core API Routes Specification

## Core Orchestrator API

### Main Chat Interface

**POST /api/sylo-core**
```typescript
// Primary endpoint for conversational project management
Request: {
  message: string;                // Natural language input
  userId: string;                 // Authenticated user ID
  context?: {                     // Optional context
    projectId?: string;
    activeView?: string;
    recentActions?: Action[];
  };
}

Response: {
  success: boolean;
  response: string;               // Formatted response text
  actions: Action[];              // Executed actions
  suggestions: string[];          // Follow-up suggestions
  data?: any;                     // Structured data (tasks, projects, etc.)
  requiresConfirmation?: boolean; // For destructive operations
}

// Example Usage
POST /api/sylo-core
{
  "message": "Create a new interior design project for Sarah Johnson with a $50k budget",
  "userId": "user_123",
  "context": {
    "activeView": "dashboard"
  }
}

Response:
{
  "success": true,
  "response": "I've created a new interior design project for Sarah Johnson with a $50,000 budget. The project is now in Stage 0 (Strategic Definition) and ready for initial briefing.",
  "actions": [
    {
      "type": "create",
      "entity": "project",
      "id": "proj_456",
      "data": {
        "name": "Sarah Johnson Interior Design",
        "clientId": "client_789",
        "budget": 50000,
        "type": "interior",
        "currentStage": "stage_0"
      }
    }
  ],
  "suggestions": [
    "Schedule an initial client briefing meeting",
    "Create project timeline and milestones",
    "Set up mood board for concept development"
  ],
  "data": {
    "projectId": "proj_456",
    "nextSteps": ["client_briefing", "site_analysis", "requirements_gathering"]
  }
}
```

## Project Management API

### Projects Endpoint

**GET /api/projects**
```typescript
// Query projects with filters
Query Parameters:
  stage?: 'stage_0' | 'stage_1' | 'stage_2' | 'stage_3' | 'stage_4' | 'stage_5' | 'stage_6' | 'stage_7'
  status?: 'active' | 'completed' | 'on_hold' | 'cancelled'
  type?: 'interior' | 'architecture' | 'branding' | 'web'
  clientId?: string
  limit?: number (default: 20)
  offset?: number (default: 0)

Response: {
  projects: Project[];
  total: number;
  hasMore: boolean;
}

// Example
GET /api/projects?stage=stage_2&status=active&limit=10

Response:
{
  "projects": [
    {
      "id": "proj_123",
      "name": "Modern Loft Renovation",
      "client": {
        "id": "client_456",
        "name": "Jennifer Davis",
        "company": "Davis Holdings"
      },
      "type": "interior",
      "currentStage": "stage_2",
      "budget": 75000,
      "timelineStart": "2025-06-01",
      "timelineEnd": "2025-09-30",
      "progress": 35,
      "team": ["user_789", "user_101"],
      "createdAt": "2025-05-15T10:00:00Z"
    }
  ],
  "total": 8,
  "hasMore": false
}
```

**POST /api/projects**
```typescript
// Create new project
Request: {
  clientId: string;
  name: string;
  type: 'interior' | 'architecture' | 'branding' | 'web';
  budget?: number;
  timelineStart?: string;      // ISO date
  timelineEnd?: string;        // ISO date
  description?: string;
  templateId?: string;         // Use project template
}

Response: {
  success: boolean;
  project: Project;
  initialTasks?: Task[];       // Auto-generated from template
}
```

**PUT /api/projects/[id]**
```typescript
// Update project
Request: {
  name?: string;
  currentStage?: string;
  status?: string;
  budget?: number;
  timelineStart?: string;
  timelineEnd?: string;
  description?: string;
}

Response: {
  success: boolean;
  project: Project;
  changedFields: string[];
}
```

### Advanced Project Endpoints

**GET /api/projects/[id]/dashboard**
```typescript
// Project health dashboard
Response: {
  project: Project;
  metrics: {
    tasksCompleted: number;
    tasksTotal: number;
    budgetUsed: number;
    budgetRemaining: number;
    timelineProgress: number;
    teamUtilization: number;
    clientSatisfaction?: number;
  };
  recentActivity: Activity[];
  upcomingDeadlines: Task[];
  riskIndicators: RiskAlert[];
}
```

**GET /api/projects/[id]/kanban**
```typescript
// Kanban board data
Query Parameters:
  groupBy?: 'status' | 'assignee' | 'priority'
  filterBy?: 'assignee' | 'dueDate' | 'stage'

Response: {
  columns: KanbanColumn[];
  tasks: Task[];
  totalTasks: number;
}

interface KanbanColumn {
  id: string;
  title: string;
  status: string;
  taskCount: number;
  wipLimit?: number;
}
```

**GET /api/projects/[id]/gantt**
```typescript
// Gantt chart data with dependencies
Query Parameters:
  startDate?: string           // ISO date
  endDate?: string            // ISO date
  includeSubtasks?: boolean

Response: {
  tasks: GanttTask[];
  dependencies: TaskDependency[];
  milestones: Milestone[];
  criticalPath: string[];      // Task IDs on critical path
  timeline: {
    start: string;
    end: string;
    duration: number;           // Days
  };
}

interface GanttTask {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  duration: number;
  progress: number;
  assignee: User;
  dependencies: string[];
  isCritical: boolean;
}
```

## Task Management API

### Tasks Endpoint

**GET /api/tasks**
```typescript
// Query tasks with advanced filtering
Query Parameters:
  projectId?: string
  assignee?: string
  status?: 'pending' | 'in_progress' | 'client_review' | 'complete' | 'blocked'
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  stage?: string
  dueBefore?: string          // ISO date
  dueAfter?: string           // ISO date
  search?: string             // Full-text search
  limit?: number
  offset?: number

Response: {
  tasks: Task[];
  total: number;
  hasMore: boolean;
  aggregations: {
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
    byAssignee: Record<string, number>;
  };
}
```

**POST /api/tasks**
```typescript
// Create new task
Request: {
  projectId: string;
  title: string;
  description?: string;
  assigneeId?: string;
  dueDate?: string;           // ISO date
  startDate?: string;         // ISO date
  estimatedHours?: number;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  stage?: string;
  parentTaskId?: string;      // For subtasks
  dependencies?: string[];    // Task IDs this depends on
  tags?: string[];
}

Response: {
  success: boolean;
  task: Task;
  generatedSubtasks?: Task[]; // Auto-generated based on task type
}
```

**PUT /api/tasks/[id]**
```typescript
// Update task
Request: {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  assigneeId?: string;
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  progress?: number;          // 0-100
}

Response: {
  success: boolean;
  task: Task;
  notifications: Notification[]; // Auto-generated notifications
}
```

**POST /api/tasks/[id]/comments**
```typescript
// Add comment to task
Request: {
  content: string;
  mentions?: string[];        // User IDs to mention
  attachments?: FileUpload[];
}

Response: {
  success: boolean;
  comment: TaskComment;
  notifications: Notification[];
}
```

**GET /api/tasks/[id]/dependencies**
```typescript
// Get task dependencies and impact analysis
Response: {
  predecessors: TaskDependency[];
  successors: TaskDependency[];
  impactAnalysis: {
    affectedTasks: string[];
    scheduleImpact: number;    // Days
    budgetImpact: number;
  };
}
```

## Supplier & Product Management API

### Suppliers Endpoint

**GET /api/suppliers**
```typescript
// List suppliers with filtering
Query Parameters:
  search?: string
  category?: string
  location?: string
  rating?: number             // Minimum rating
  hasTradeAccount?: boolean
  isActive?: boolean
  limit?: number
  offset?: number

Response: {
  suppliers: Supplier[];
  total: number;
  hasMore: boolean;
}
```

**POST /api/suppliers**
```typescript
// Add new supplier
Request: {
  name: string;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  tradeAccountInfo?: {
    accountNumber?: string;
    discountRate?: number;
    paymentTerms?: string;
  };
  notes?: string;
}

Response: {
  success: boolean;
  supplier: Supplier;
}
```

### Products Endpoint

**GET /api/products**
```typescript
// Search products with advanced filtering
Query Parameters:
  search?: string             // Full-text search
  categoryId?: string
  supplierId?: string
  minPrice?: number
  maxPrice?: number
  colors?: string[]           // Hex color codes
  materials?: string[]
  styles?: string[]
  availability?: 'available' | 'discontinued' | 'custom_order'
  tags?: string[]
  sortBy?: 'price' | 'name' | 'rating' | 'leadTime'
  sortOrder?: 'asc' | 'desc'
  limit?: number
  offset?: number

Response: {
  products: Product[];
  total: number;
  hasMore: boolean;
  facets: {
    categories: CategoryCount[];
    suppliers: SupplierCount[];
    priceRanges: PriceRange[];
    colors: ColorCount[];
    materials: MaterialCount[];
  };
}
```

**POST /api/products**
```typescript
// Add product (manual or via URL import)
Request: {
  sourceUrl?: string;         // Auto-import from URL
  supplierId: string;
  categoryId: string;
  name: string;
  modelNumber?: string;
  description?: string;
  price?: number;
  currency?: string;
  dimensions?: {
    width?: number;
    height?: number;
    depth?: number;
    weight?: number;
  };
  specifications?: Record<string, any>;
  images?: string[];          // Image URLs
  tags?: string[];
  colors?: string[];          // Hex codes
}

Response: {
  success: boolean;
  product: Product;
  extractedData?: {           // If imported from URL
    autoTags: string[];
    extractedColors: string[];
    suggestedCategory: string;
  };
}
```

**POST /api/products/import-url**
```typescript
// Import product from URL using AI extraction
Request: {
  url: string;
  autoDetectSupplier?: boolean;
  autoDetectCategory?: boolean;
}

Response: {
  success: boolean;
  extractedData: {
    name: string;
    description: string;
    price?: number;
    images: string[];
    specifications: Record<string, any>;
    suggestedSupplier?: Supplier;
    suggestedCategory?: ProductCategory;
    extractedColors: ColorExtraction[];
    autoTags: string[];
    confidence: number;        // 0.0 - 1.0
  };
  requiresReview: string[];    // Fields needing manual review
}
```

## Team & Collaboration API

### Users & Teams

**GET /api/users**
```typescript
// List team members
Query Parameters:
  role?: string
  skills?: string[]
  availability?: boolean
  projectId?: string

Response: {
  users: User[];
  total: number;
}
```

**GET /api/users/workload**
```typescript
// Team workload analysis
Query Parameters:
  startDate: string
  endDate: string
  userId?: string

Response: {
  workloadData: UserWorkload[];
  totalCapacity: number;
  totalAllocated: number;
  utilizationRate: number;
  alerts: WorkloadAlert[];
}

interface UserWorkload {
  userId: string;
  user: User;
  totalHours: number;
  allocatedHours: number;
  availableHours: number;
  utilizationRate: number;
  projects: ProjectAllocation[];
  overtimeRisk: boolean;
}
```

**POST /api/time-entries**
```typescript
// Log time entry
Request: {
  userId: string;
  taskId?: string;
  projectId: string;
  hours: number;
  date: string;              // ISO date
  description?: string;
  billable?: boolean;
  entryMethod?: 'manual' | 'chat_auto' | 'timer';
}

Response: {
  success: boolean;
  timeEntry: TimeEntry;
  projectUpdate: {
    totalHours: number;
    budgetUsed: number;
    progressUpdate: number;
  };
}
```

## External Integrations API

### Google Calendar Integration

**POST /api/integrations/google/events**
```typescript
// Create calendar event
Request: {
  title: string;
  description?: string;
  startTime: string;         // ISO datetime
  endTime: string;           // ISO datetime
  attendees?: string[];      // Email addresses
  location?: string;
  projectId?: string;        // Link to project
  taskId?: string;           // Link to task
}

Response: {
  success: boolean;
  event: CalendarEvent;
  meetingLink?: string;      // If video conference
}
```

**GET /api/integrations/google/availability**
```typescript
// Check team availability
Query Parameters:
  userIds: string[]
  startTime: string
  endTime: string
  duration: number           // Minutes

Response: {
  availability: UserAvailability[];
  suggestedTimes: TimeSlot[];
}
```

### Xero Financial Integration

**POST /api/integrations/xero/invoices**
```typescript
// Create invoice in Xero
Request: {
  projectId: string;
  contactId?: string;        // Xero contact ID
  lineItems: InvoiceLineItem[];
  dueDate?: string;
  reference?: string;
}

Response: {
  success: boolean;
  invoice: XeroInvoice;
  syloInvoiceId: string;
}
```

**GET /api/integrations/xero/contacts**
```typescript
// Sync contacts from Xero
Response: {
  contacts: XeroContact[];
  syncedAt: string;
  newContacts: number;
  updatedContacts: number;
}
```

## AI & Media Generation API

### Content Generation

**POST /api/ai/generate-content**
```typescript
// Generate social media content
Request: {
  projectId: string;
  contentType: 'social_post' | 'project_update' | 'client_report';
  platforms?: ('instagram' | 'linkedin' | 'tiktok')[];
  mediaUrls?: string[];      // Project images
  tone?: 'professional' | 'casual' | 'creative';
  includeHashtags?: boolean;
}

Response: {
  success: boolean;
  content: GeneratedContent[];
  suggestedSchedule?: ScheduleSuggestion[];
}

interface GeneratedContent {
  platform: string;
  caption: string;
  hashtags: string[];
  mediaRecommendations: string[];
  engagementPrediction: number;
}
```

**POST /api/ai/video-generation**
```typescript
// Generate video content from images
Request: {
  images: string[];          // URLs to source images
  style: 'modern' | 'traditional' | 'minimalist' | 'luxury';
  duration: number;          // Seconds
  provider?: 'wan2_1' | 'runway' | 'auto';
  outputQuality?: '480p' | '720p' | '1080p';
}

Response: {
  success: boolean;
  jobId: string;
  estimatedCompletionTime: number; // Minutes
  provider: string;
  cost?: number;
}
```

**GET /api/ai/video-generation/[jobId]**
```typescript
// Check video generation status
Response: {
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;          // 0-100
  videoUrl?: string;         // When completed
  thumbnailUrl?: string;
  error?: string;
}
```

## File Management API

**POST /api/files/upload**
```typescript
// Upload project files
Request: FormData {
  file: File;
  projectId: string;
  category?: 'mood_board' | 'specification' | 'client_asset' | 'deliverable';
  description?: string;
}

Response: {
  success: boolean;
  file: ProjectFile;
  autoDetectedCategory?: string;
  extractedMetadata?: FileMetadata;
}
```

**POST /api/files/categorize**
```typescript
// AI-powered file categorization
Request: {
  fileUrl: string;
  projectId: string;
  autoDetectType: boolean;
}

Response: {
  success: boolean;
  suggestedCategory: string;
  confidence: number;
  extractedText?: string;    // For PDFs/documents
  detectedColors?: string[]; // For images
  tags: string[];
}
```

## Error Handling

### Standard Error Responses

All API endpoints return consistent error formats:

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
    requestId: string;
  };
  suggestions?: string[];     // Recovery suggestions
}

// Common Error Codes
'VALIDATION_ERROR'          // 400 - Invalid input data
'UNAUTHORIZED'              // 401 - Authentication required
'FORBIDDEN'                 // 403 - Insufficient permissions
'NOT_FOUND'                 // 404 - Resource not found
'CONFLICT'                  // 409 - Resource conflict
'RATE_LIMITED'              // 429 - Too many requests
'INTEGRATION_ERROR'         // 500 - External service failure
'AI_PROCESSING_ERROR'       // 500 - AI service failure
'DATABASE_ERROR'            // 500 - Database operation failure
```

### Rate Limiting

```typescript
// Rate Limit Headers (included in all responses)
'X-RateLimit-Limit': '100'           // Requests per window
'X-RateLimit-Remaining': '95'        // Remaining requests
'X-RateLimit-Reset': '1640995200'    // Reset timestamp
'X-RateLimit-Window': '3600'         // Window size in seconds
```

## Authentication

All API endpoints require authentication via:
- **Bearer Token**: `Authorization: Bearer <jwt_token>`
- **API Key** (for integrations): `X-API-Key: <api_key>`

### Token Refresh
```typescript
POST /api/auth/refresh
{
  "refreshToken": "refresh_token_here"
}

Response:
{
  "accessToken": "new_jwt_token",
  "expiresIn": 3600,
  "refreshToken": "new_refresh_token"
}
```