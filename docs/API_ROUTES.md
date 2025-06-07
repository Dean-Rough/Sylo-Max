# Sylo-Max API Routes Specification

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
  "message": "Show me the dashboard overview",
  "userId": "user_123",
  "context": {
    "activeView": "dashboard"
  }
}

Response:
{
  "success": true,
  "response": "Here's your dashboard overview with current stats and recent activity.",
  "actions": [
    {
      "type": "fetch",
      "entity": "dashboard_stats",
      "data": {
        "activeProjects": 12,
        "tasksDue": 8,
        "clientCount": 15,
        "revenue": 125000
      }
    }
  ],
  "suggestions": [
    "Review overdue tasks",
    "Check project timelines",
    "Schedule client meetings"
  ]
}
```

## Dashboard API Endpoints

### Dashboard Stats

**GET /api/dashboard/stats**
```typescript
// Get dashboard overview statistics
Response: {
  success: boolean;
  stats: {
    activeProjects: number;
    tasksDue: number;
    clientCount: number;
    revenue: number;
    completedTasks: number;
    teamUtilization: number;
  };
  trends: {
    projectsChange: number;     // % change from last period
    tasksChange: number;
    revenueChange: number;
  };
}
```

**GET /api/dashboard/recent-projects**
```typescript
// Get recent projects with progress
Query Parameters:
  limit?: number (default: 5)

Response: {
  success: boolean;
  projects: Array<{
    id: string;
    name: string;
    client: string;
    progress: number;
    status: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
  }>;
}
```

**GET /api/dashboard/tasks-due**
```typescript
// Get upcoming tasks and deadlines
Query Parameters:
  days?: number (default: 7)   // Look ahead days

Response: {
  success: boolean;
  tasks: Array<{
    id: string;
    title: string;
    project: string;
    dueDate: string;
    priority: string;
    assignee: string;
    status: string;
  }>;
  overdue: number;             // Count of overdue tasks
}
```

## Chat Interface API

### Chat Messages

**POST /api/chat/send**
```typescript
// Send message to AI assistant
Request: {
  message: string;
  sessionId?: string;          // Chat session ID
  context?: {
    currentPage?: string;
    selectedProject?: string;
    recentActions?: string[];
  };
}

Response: {
  success: boolean;
  reply: string;
  sessionId: string;
  timestamp: string;
  suggestions?: string[];      // Quick action suggestions
  actions?: Array<{           // Triggered actions
    type: string;
    description: string;
    result?: any;
  }>;
}
```

**GET /api/chat/history**
```typescript
// Get chat history for session
Query Parameters:
  sessionId: string
  limit?: number (default: 50)

Response: {
  success: boolean;
  messages: Array<{
    id: string;
    type: 'user' | 'assistant';
    content: string;
    timestamp: string;
    actions?: any[];
  }>;
}
```

**POST /api/chat/feedback**
```typescript
// Provide feedback on AI response
Request: {
  messageId: string;
  feedback: 'helpful' | 'not_helpful';
  comment?: string;
}

Response: {
  success: boolean;
  acknowledged: boolean;
}
```

## Theme and Preferences API

### User Preferences

**GET /api/preferences**
```typescript
// Get user preferences
Response: {
  success: boolean;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    sidebarCollapsed: boolean;
    dashboardLayout: string;
    notifications: {
      email: boolean;
      push: boolean;
      taskReminders: boolean;
      projectUpdates: boolean;
    };
    timezone: string;
    dateFormat: string;
  };
}
```

**PUT /api/preferences**
```typescript
// Update user preferences
Request: {
  theme?: 'light' | 'dark' | 'system';
  sidebarCollapsed?: boolean;
  dashboardLayout?: string;
  notifications?: {
    email?: boolean;
    push?: boolean;
    taskReminders?: boolean;
    projectUpdates?: boolean;
  };
  timezone?: string;
  dateFormat?: string;
}

Response: {
  success: boolean;
  preferences: UserPreferences;
}
```

## Navigation and Search API

### Global Search

**GET /api/search**
```typescript
// Global search across all entities
Query Parameters:
  q: string                    // Search query
  type?: 'projects' | 'tasks' | 'clients' | 'files' | 'all'
  limit?: number (default: 10)

Response: {
  success: boolean;
  results: Array<{
    id: string;
    type: string;
    title: string;
    description?: string;
    url: string;               // Navigation URL
    relevance: number;         // 0-1 relevance score
    context?: string;          // Matching context
  }>;
  suggestions?: string[];      // Search suggestions
}
```

### Quick Actions

**GET /api/quick-actions**
```typescript
// Get available quick actions for user
Response: {
  success: boolean;
  actions: Array<{
    id: string;
    label: string;
    description: string;
    icon: string;
    url?: string;              // Navigation URL
    action?: string;           // API action
    keyboard?: string;         // Keyboard shortcut
  }>;
}
```

## Horizon UI Specific Endpoints

### Component Data

**GET /api/components/sidebar-nav**
```typescript
// Get navigation menu items
Response: {
  success: boolean;
  menuItems: Array<{
    id: string;
    label: string;
    icon: string;
    url: string;
    badge?: {
      count: number;
      color: string;
    };
    children?: NavItem[];
  }>;
  userInfo: {
    name: string;
    email: string;
    avatar?: string;
    status: 'online' | 'away' | 'busy';
  };
}
```

**GET /api/components/breadcrumbs**
```typescript
// Get breadcrumb navigation
Query Parameters:
  path: string                 // Current page path

Response: {
  success: boolean;
  breadcrumbs: Array<{
    label: string;
    url?: string;
    isActive: boolean;
  }>;
}
```

## Error Handling

### Standard Error Response

```typescript
interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
  };
  suggestions?: string[];
}

// Common Error Codes
'VALIDATION_ERROR'    // 400 - Invalid request data
'UNAUTHORIZED'        // 401 - Authentication required
'FORBIDDEN'          // 403 - Access denied
'NOT_FOUND'          // 404 - Resource not found
'RATE_LIMITED'       // 429 - Too many requests
'SERVER_ERROR'       // 500 - Internal server error
```

## Authentication

All API routes require authentication via JWT tokens:

```typescript
Headers: {
  'Authorization': 'Bearer <jwt_token>',
  'Content-Type': 'application/json'
}
```

### Token Refresh

**POST /api/auth/refresh**
```typescript
Request: {
  refreshToken: string;
}

Response: {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
```

## WebSocket Events

### Real-time Updates

**Connection:** `wss://your-domain.com/api/ws`

```typescript
// Client sends
{
  type: 'subscribe',
  channels: ['dashboard', 'chat', 'notifications']
}

// Server sends
{
  type: 'dashboard_update',
  data: {
    stats: UpdatedStats,
    timestamp: string
  }
}

{
  type: 'chat_message',
  data: {
    message: ChatMessage,
    sessionId: string
  }
}

{
  type: 'notification',
  data: {
    id: string,
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error',
    timestamp: string
  }
}
```

## Rate Limiting

- **General API**: 100 requests per minute per user
- **Chat API**: 20 messages per minute per user  
- **Search API**: 30 requests per minute per user
- **File Upload**: 10 uploads per minute per user

Rate limit headers included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

This API specification covers the current Horizon UI dashboard implementation with proper endpoints for all dashboard functionality, chat interface, and theme management.