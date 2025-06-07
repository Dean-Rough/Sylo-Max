# System Architecture - Sylo-core

## Overview

Sylo-core is built as a modular, scalable system with a conversational AI interface at its core. The architecture follows a microservices-inspired approach with clear separation of concerns, enabling independent scaling and testing of individual components.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                      │
│  ┌─────────────────┐ ┌─────────────────┐ ┌──────────────┐  │
│  │   Chat Interface │ │   Dashboard UI  │ │  Admin Panel │  │
│  │                 │ │                 │ │              │  │
│  └─────────────────┘ └─────────────────┘ └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
                                │
                    ┌───────────▼───────────┐
                    │    API Gateway        │
                    │  (Next.js API Routes) │
                    └───────────┬───────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
┌───────▼────────┐    ┌─────────▼─────────┐    ┌───────▼────────┐
│  Intent Parser │    │   Orchestrator    │    │ Output Generator│
│                │    │                   │    │                │
│ - NLP Engine   │    │ - Business Logic  │    │ - Response     │
│ - Entity Ext.  │    │ - Workflow Mgmt   │    │   Formatting   │
│ - Confidence   │    │ - State Mgmt      │    │ - TTS Ready    │
└────────────────┘    └─────────┬─────────┘    └────────────────┘
                                │
                    ┌───────────▼───────────┐
                    │   Service Adapters    │
                    └───────────┬───────────┘
                                │
    ┌───────────────────────────┼───────────────────────────┐
    │                           │                           │
┌───▼────┐  ┌─────────┐  ┌─────▼──────┐  ┌──────────┐  ┌──▼───┐
│Database│  │External │  │    AI      │  │Calendar/ │  │Video │
│(NeonDB)│  │APIs     │  │ Services   │  │Email     │  │Gen   │
│        │  │(Xero)   │  │(OpenAI)    │  │(Google)  │  │      │
└────────┘  └─────────┘  └────────────┘  └──────────┘  └──────┘
```

## Core Components

### 1. Intent Parser

**Purpose**: Converts natural language input into structured, actionable intents

**Technology Stack**:
- OpenAI GPT-4 with function calling
- Custom prompt engineering for design industry terminology
- Entity extraction and validation

**Key Features**:
- Multi-intent recognition (can handle complex, compound requests)
- Design-specific entity recognition (project types, design phases, materials)
- Confidence scoring with fallback to clarification prompts
- Context awareness from conversation history

**Input/Output**:
```typescript
Input: "Create a modern kitchen project for Sarah Johnson, budget 45k, deadline end of August"

Output: {
  intent: "create_project",
  entities: {
    clientName: "Sarah Johnson",
    projectType: "interior_design",
    room: "kitchen",
    style: "modern",
    budget: 45000,
    deadline: "2025-08-31",
    currency: "USD"
  },
  confidence: 0.95,
  requiresConfirmation: false
}
```

### 2. Orchestrator

**Purpose**: Central business logic coordinator that validates, processes, and executes user intents

**Architecture Pattern**: Command Pattern with dependency resolution

**Key Responsibilities**:
- Intent validation and business rule enforcement
- Multi-step workflow coordination
- Dependency resolution (e.g., client must exist before creating project)
- Error handling and rollback mechanisms
- Permission and authorization checks

**Workflow Example**:
```typescript
// Complex workflow: "Create ABC Corp project and schedule kickoff meeting"
1. Validate user permissions
2. Check if client "ABC Corp" exists (create if needed)
3. Create project with generated ID
4. Create default project tasks based on type
5. Schedule kickoff meeting in Google Calendar
6. Send notification emails
7. Update project status to "initiated"
8. Generate confirmation response
```

### 3. Service Adapters

**Purpose**: Standardized interfaces to internal and external services

**Design Pattern**: Adapter Pattern with common interface

**Internal Services**:
- **Database Adapter**: Prisma ORM wrapper with connection pooling
- **File Storage**: Vercel Blob for design assets and documents
- **Search Engine**: Vector search for product and project discovery

**External Services**:
- **Google Workspace**: Calendar, Gmail, Drive integration
- **Xero Accounting**: Invoice generation, expense tracking
- **Social Media**: Automated content posting and scheduling
- **Video Generation**: Multi-provider video creation pipeline

**Common Interface**:
```typescript
interface ServiceAdapter {
  execute(action: string, params: any): Promise<ServiceResponse>
  validate(params: any): ValidationResult
  healthCheck(): Promise<boolean>
}
```

### 4. State Manager

**Purpose**: Maintains conversational context and user session state

**Storage Strategy**:
- **Redis**: Session state, chat context, temporary data
- **Database**: Persistent user preferences, project context
- **Local Storage**: UI state, draft inputs, user preferences

**State Types**:
```typescript
interface ConversationState {
  userId: string
  sessionId: string
  currentProject?: string
  timeWindow: DateRange
  pendingActions: Action[]
  contextHistory: ChatMessage[]
  userPreferences: UserPreferences
}
```

### 5. Output Generator

**Purpose**: Formats AI responses for optimal user experience

**Features**:
- Multi-format output (text, markdown, structured cards)
- TTS-optimized text formatting
- Interactive element generation (buttons, quick actions)
- Error message humanization
- Response personalization based on user role

## Database Architecture

### Design Principles
- **Normalized Structure**: Minimizing data redundancy while maintaining performance
- **Audit Trail**: Complete change history for all entities
- **Soft Deletes**: Preserve data integrity for reporting and recovery
- **Multi-tenancy**: Firm-level data isolation with shared infrastructure

### Core Entity Relationships

```
Firms (1) ──── (Many) Users
  │
  ├─── (Many) Clients ──── (Many) Projects
  │                           │
  └─── (Many) Products        ├─── (Many) Tasks
       (Supplier Directory)   │       │
                              │       └─── (Many) Comments
                              │       └─── (Many) Dependencies
                              │
                              ├─── (Many) Milestones
                              └─── (Many) Product Selections
```

### Performance Optimizations
- **Connection Pooling**: NeonDB with connection pooling for scalability
- **Read Replicas**: Separate read queries for analytics and reporting
- **Caching Strategy**: Redis for frequently accessed data
- **Database Branching**: NeonDB branching for development and testing

## Integration Architecture

### API Gateway Pattern
All external requests flow through Next.js API routes acting as an API gateway:

```typescript
// API Route Structure
/api/
├── sylo-core/          # Main conversational endpoint
├── auth/               # Authentication endpoints
├── projects/           # Project CRUD operations
├── tasks/              # Task management
├── integrations/       # External service webhooks
│   ├── google/
│   ├── xero/
│   └── social/
└── admin/              # Administrative endpoints
```

### External Service Integration

**Google Workspace Integration**:
- OAuth 2.0 authentication with incremental consent
- Calendar API for scheduling and availability
- Gmail API for automated email communications
- Drive API for file storage and sharing

**Xero Accounting Integration**:
- OAuth 2.0 with tenant selection
- Automated invoice generation from project milestones
- Expense tracking and categorization
- Real-time financial reporting

**AI Service Integration**:
- OpenAI GPT-4 for natural language processing
- ElevenLabs for text-to-speech conversion
- Custom video generation pipeline with fallback providers

## Security Architecture

### Authentication & Authorization
- **Authentication**: Supabase Auth with social providers
- **Authorization**: Role-based access control (RBAC)
- **Session Management**: JWT tokens with refresh rotation
- **API Security**: Rate limiting and request validation

### Data Protection
- **Encryption**: AES-256 for data at rest, TLS 1.3 in transit
- **Data Isolation**: Firm-level data segregation
- **Audit Logging**: Complete audit trail for all data changes
- **Backup Strategy**: Automated daily backups with point-in-time recovery

### Compliance
- **GDPR Compliance**: Data portability and right to deletion
- **SOC 2 Type II**: Security and availability controls
- **Data Retention**: Configurable retention policies
- **Privacy by Design**: Minimal data collection principles

## Scalability & Performance

### Horizontal Scaling
- **Stateless Architecture**: No server-side session storage
- **Load Balancing**: Vercel edge functions with global distribution
- **Database Scaling**: NeonDB autoscaling with read replicas
- **Caching Strategy**: Multi-layer caching (CDN, Redis, browser)

### Performance Monitoring
- **Application Metrics**: Response times, error rates, throughput
- **Database Metrics**: Query performance, connection pool usage
- **User Experience**: Page load times, interaction responsiveness
- **Business Metrics**: Feature usage, conversion rates, user satisfaction

### Disaster Recovery
- **High Availability**: 99.9% uptime SLA with automatic failover
- **Backup Strategy**: Automated backups with geographic distribution
- **Recovery Procedures**: Documented disaster recovery protocols
- **Testing**: Regular disaster recovery drills and testing

## Development & Deployment

### Environment Strategy
- **Development**: Local development with Docker containers
- **Staging**: Production-like environment for testing
- **Production**: Multi-region deployment with CDN

### CI/CD Pipeline
```
Code Push → GitHub Actions → Testing → Build → Deploy → Monitor
     │                          │        │        │        │
     └─ Linting              Unit Tests  Docker   Vercel   Datadog
        Type Checking        E2E Tests   Image    Edge     Alerts
        Security Scan       Integration          Functions
```

### Monitoring & Observability
- **Logging**: Structured logging with correlation IDs
- **Metrics**: Custom business metrics and system health
- **Tracing**: Distributed tracing for request flow analysis
- **Alerting**: Proactive alerting for system anomalies

## Performance Requirements & SLAs

### Response Time Targets

```typescript
// Performance thresholds for monitoring and alerting
export const PERFORMANCE_THRESHOLDS = {
  // API Response Times (95th percentile)
  API_RESPONSE_TIME: {
    CHAT_ENDPOINT: 3000,      // 3 seconds for AI processing
    CRUD_OPERATIONS: 200,     // 200ms for database operations
    SEARCH_QUERIES: 500,      // 500ms for complex searches
    FILE_UPLOADS: 30000,      // 30 seconds for file processing
    REPORTS: 5000            // 5 seconds for analytics
  },
  
  // Database Query Performance
  DATABASE_QUERY_TIME: {
    SIMPLE_SELECT: 50,        // 50ms for indexed queries
    COMPLEX_JOIN: 200,        // 200ms for multi-table joins
    AGGREGATION: 500,         // 500ms for analytics queries
    FULL_TEXT_SEARCH: 1000   // 1 second for search operations
  },
  
  // Frontend Performance
  FRONTEND_METRICS: {
    FIRST_CONTENTFUL_PAINT: 1500,  // 1.5 seconds
    LARGEST_CONTENTFUL_PAINT: 2500, // 2.5 seconds
    CUMULATIVE_LAYOUT_SHIFT: 0.1,   // CLS score
    FIRST_INPUT_DELAY: 100          // 100ms interaction delay
  },
  
  // Real-time Features
  REALTIME_LATENCY: {
    WEBSOCKET_MESSAGE: 100,    // 100ms for live updates
    CURSOR_POSITION: 50,       // 50ms for cursor tracking
    TYPING_INDICATOR: 200      // 200ms for typing status
  }
};

// Memory and Resource Limits
export const RESOURCE_LIMITS = {
  MAX_CONCURRENT_USERS: 1000,
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  MAX_REQUEST_SIZE: 10 * 1024 * 1024, // 10MB
  DATABASE_CONNECTION_POOL: 20,
  RATE_LIMIT_PER_MINUTE: 100
};
```

### Error Handling & Status Codes

```typescript
// Standardized error codes for API responses
export enum ErrorCodes {
  // Authentication & Authorization (1000-1999)
  INVALID_TOKEN = 1001,
  TOKEN_EXPIRED = 1002,
  INSUFFICIENT_PERMISSIONS = 1003,
  FIRM_ACCESS_DENIED = 1004,
  
  // Validation Errors (2000-2999)
  INVALID_INPUT = 2001,
  MISSING_REQUIRED_FIELD = 2002,
  INVALID_EMAIL_FORMAT = 2003,
  INVALID_DATE_RANGE = 2004,
  BUDGET_EXCEEDS_LIMIT = 2005,
  
  // Resource Errors (3000-3999)
  RESOURCE_NOT_FOUND = 3001,
  PROJECT_NOT_FOUND = 3002,
  CLIENT_NOT_FOUND = 3003,
  TASK_NOT_FOUND = 3004,
  SUPPLIER_NOT_FOUND = 3005,
  
  // Business Logic Errors (4000-4999)
  PROJECT_ALREADY_COMPLETED = 4001,
  TASK_DEPENDENCY_CYCLE = 4002,
  BUDGET_EXCEEDED = 4003,
  TIMELINE_CONFLICT = 4004,
  STAGE_PROGRESSION_INVALID = 4005,
  
  // External Service Errors (5000-5999)
  OPENAI_API_ERROR = 5001,
  GOOGLE_CALENDAR_ERROR = 5002,
  XERO_API_ERROR = 5003,
  EMAIL_SERVICE_ERROR = 5004,
  FILE_STORAGE_ERROR = 5005,
  
  // System Errors (6000-6999)
  DATABASE_CONNECTION_ERROR = 6001,
  REDIS_CONNECTION_ERROR = 6002,
  WEBSOCKET_CONNECTION_ERROR = 6003,
  RATE_LIMIT_EXCEEDED = 6004,
  INTERNAL_SERVER_ERROR = 6999
}

// Error response structure
interface ErrorResponse {
  error: {
    code: ErrorCodes;
    message: string;
    details?: Record<string, any>;
    timestamp: string;
    requestId: string;
  };
}

// Error handling middleware
export class ErrorHandler {
  static formatError(error: Error, code: ErrorCodes, details?: any): ErrorResponse {
    return {
      error: {
        code,
        message: error.message,
        details,
        timestamp: new Date().toISOString(),
        requestId: generateRequestId()
      }
    };
  }
  
  static isRetryableError(code: ErrorCodes): boolean {
    const retryableCodes = [
      ErrorCodes.DATABASE_CONNECTION_ERROR,
      ErrorCodes.REDIS_CONNECTION_ERROR,
      ErrorCodes.OPENAI_API_ERROR,
      ErrorCodes.RATE_LIMIT_EXCEEDED
    ];
    return retryableCodes.includes(code);
  }
}
```

### Monitoring & Alerting Configuration

```typescript
// Alert thresholds for production monitoring
export const ALERT_THRESHOLDS = {
  // Performance Alerts
  HIGH_RESPONSE_TIME: {
    WARNING: 1000,    // 1 second
    CRITICAL: 3000    // 3 seconds
  },
  
  // Error Rate Alerts
  ERROR_RATE: {
    WARNING: 0.05,    // 5% error rate
    CRITICAL: 0.10    // 10% error rate
  },
  
  // Resource Usage Alerts
  CPU_USAGE: {
    WARNING: 0.70,    // 70% CPU usage
    CRITICAL: 0.85    // 85% CPU usage
  },
  
  MEMORY_USAGE: {
    WARNING: 0.75,    // 75% memory usage
    CRITICAL: 0.90    // 90% memory usage
  },
  
  // Database Alerts
  DATABASE_CONNECTIONS: {
    WARNING: 15,      // 75% of pool size
    CRITICAL: 18      // 90% of pool size
  },
  
  SLOW_QUERY_THRESHOLD: 2000, // 2 seconds
  
  // Business Metrics
  FAILED_AI_REQUESTS: {
    WARNING: 0.02,    // 2% failure rate
    CRITICAL: 0.05    // 5% failure rate
  }
};

// Monitoring dashboard configuration
export const MONITORING_CONFIG = {
  healthCheckInterval: 30000,     // 30 seconds
  metricsCollectionInterval: 5000, // 5 seconds
  alertCheckInterval: 60000,      // 1 minute
  logRetentionDays: 30,
  metricsRetentionDays: 90
};
```

## Scalability Architecture