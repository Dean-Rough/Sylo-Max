# Sylo-core Modular Agent Build Plan

## Overview

This roadmap transforms the Sylo-core PRD into executable, one-shot directives for AI agents. Each task is designed to be autonomous, with clear outcomes and minimal dependencies on human intuition.

## Build Phases

### Phase 1: Core Infrastructure & Authentication (MVP Critical)

#### 1.1 Project Scaffolding
- **Task**: Scaffold Next.js 14 project with TypeScript, TailwindCSS, and Shadcn UI components
- **Outcome**: Complete project structure with configured linting, formatting, and build pipeline
- **Agent Directive**: `Create Next.js 14 project using create-next-app with TypeScript template, install TailwindCSS, Shadcn UI, Prisma, and configure prettier/eslint with design system tokens`

#### 1.2 Database Setup
- **Task**: Implement complete database schema with Prisma and NeonDB integration
- **Outcome**: All tables created with proper indexes, relationships, and seed data
- **Agent Directive**: `Create Prisma schema for firms, clients, projects, tasks, users, suppliers, and products tables with all relationships, indexes, and constraints as defined in DB_SCHEMA.md. Set up NeonDB connection and generate Prisma client`

#### 1.3 Authentication System
- **Task**: Implement Supabase Auth with role-based access control
- **Outcome**: Complete auth flow with firm-level multi-tenancy and user roles
- **Agent Directive**: `Integrate Supabase Auth with Next.js middleware for route protection, implement user roles (admin, designer, project_manager, client, freelancer), create firm-based data isolation, and build auth components (login, signup, password reset)`

#### 1.4 API Foundation
- **Task**: Create core API routes with error handling and validation
- **Outcome**: RESTful API with consistent response formats and request validation
- **Agent Directive**: `Build Next.js API routes for /api/auth, /api/firms, /api/users, /api/clients, /api/projects, and /api/tasks with Zod validation, error handling middleware, and OpenAPI documentation`

### Phase 2: Core Project Management Engine (MVP Critical)

#### 2.1 Client Management System
- **Task**: Build client CRUD operations with relationship management
- **Outcome**: Complete client lifecycle management with data validation
- **Agent Directive**: `Create React components for client list, detail view, and forms using Shadcn UI. Implement client API endpoints with firm-level isolation, Xero contact sync, and email validation. Add search and filtering capabilities`

#### 2.2 Project Creation & Management
- **Task**: Implement project lifecycle management with industry-specific stages
- **Outcome**: Project creation, stage progression, and timeline management
- **Agent Directive**: `Build project management system with RIBA/creative workflow stages, project templates for different design types (interior, architecture, branding), milestone tracking, and budget management with currency support`

#### 2.3 Task Management Core
- **Task**: Create hierarchical task system with dependencies and assignments
- **Outcome**: Complete task CRUD with subtasks, dependencies, and team assignment
- **Agent Directive**: `Implement task management with parent-child relationships, dependency tracking, time estimation/tracking, assignee management, and progress indicators. Create Kanban board and list views with drag-and-drop functionality`

#### 2.4 Time Tracking & Workload
- **Task**: Build time tracking system with automatic chat-based logging
- **Outcome**: Accurate time tracking with team capacity planning
- **Agent Directive**: `Create time entry system with manual and automatic logging, team workload visualization, capacity planning charts, and billable hours tracking. Integrate with task completion and project budgets`

### Phase 3: Conversational AI Engine (MVP Critical)

#### 3.1 Intent Parser Implementation
- **Task**: Build natural language processing for project management commands
- **Outcome**: AI system that understands design-specific workflows and converts natural language to actions
- **Agent Directive**: `Implement OpenAI function calling with design studio-specific prompts, entity extraction for clients/projects/tasks, confidence scoring, and intent classification for project management actions`

#### 3.2 Chat Interface Core
- **Task**: Create conversational UI with command history and smart suggestions
- **Outcome**: Interactive chat interface with context awareness and action buttons
- **Agent Directive**: `Build chat interface using Shadcn UI with message threading, rich media support, inline action buttons, command palette (/create-task, /schedule-meeting), and conversation history with search`

#### 3.3 Service Orchestrator
- **Task**: Implement central logic router for chaining complex operations
- **Outcome**: System that validates inputs, resolves dependencies, and triggers multi-step workflows
- **Agent Directive**: `Create orchestration engine that chains dependent operations (create client → project → tasks), validates business rules, manages transaction rollbacks, and provides detailed operation logging`

#### 3.4 State Management System
- **Task**: Build context-aware state management for chat sessions
- **Outcome**: Persistent chat context with project awareness and user preferences
- **Agent Directive**: `Implement Zustand-based state management for chat context, user session persistence, project switching, and real-time updates using WebSocket connections for live collaboration`

### Phase 4: External Integrations (MVP Critical)

#### 4.1 Google Calendar Integration
- **Task**: Sync project deadlines, tasks, and meetings with Google Calendar
- **Outcome**: Bidirectional calendar sync with conflict detection
- **Agent Directive**: `Integrate Google Calendar API with OAuth flow, sync project milestones and task deadlines, detect scheduling conflicts, create meeting invites with project context, and handle timezone management`

#### 4.2 Email Automation
- **Task**: Automated email workflows for project updates and client communication
- **Outcome**: Template-based email system with project context
- **Agent Directive**: `Implement Resend email service with project update templates, client notification workflows, attachment handling for mood boards and specifications, and email tracking/analytics`

#### 4.3 File Storage System
- **Task**: Implement design file management with categorization
- **Outcome**: Organized file storage with AI-powered categorization
- **Agent Directive**: `Set up Vercel Blob storage with file upload/download API, implement AI-powered file categorization (mood boards, specifications, presentations), create file versioning, and build file preview components`

### Phase 5: Design-Specific Features (Post-MVP)

#### 5.1 Supplier Directory & Product Intelligence
- **Task**: Build comprehensive supplier and product catalog system
- **Outcome**: Searchable product database with AI-powered tagging
- **Agent Directive**: `Create supplier management system with product catalog, implement web scraping for product data extraction, build AI-powered tagging system for colors/materials/styles, and create visual product browsing interface`

#### 5.2 URL-Based Product Import
- **Task**: AI system to extract product information from URLs
- **Outcome**: Automatic product cataloging from supplier websites
- **Agent Directive**: `Build web scraping service with AI content extraction, implement product specification parsing, create automatic categorization and tagging, handle multiple supplier website formats, and validate extracted data`

#### 5.3 Mood Board Creation Tools
- **Task**: Visual mood board creation with product integration
- **Outcome**: Pinterest-style mood board interface with product specifications
- **Agent Directive**: `Create drag-and-drop mood board builder with grid layouts, integrate product catalog for direct addition, implement color palette extraction, build sharing and collaboration features, and add client presentation mode`

#### 5.4 Project Templates System
- **Task**: Pre-built project templates for different design disciplines
- **Outcome**: Quick project setup with industry-standard workflows
- **Agent Directive**: `Build template management system with RIBA workflow templates, creative project templates, customizable task templates, milestone templates, and template sharing between firms`

### Phase 6: Advanced Project Features (Post-MVP)

#### 6.1 Advanced Analytics Dashboard
- **Task**: Comprehensive project performance and team analytics
- **Outcome**: Data-driven insights for project optimization
- **Agent Directive**: `Create analytics dashboard with project health metrics, team performance tracking, client satisfaction scoring, budget variance analysis, and predictive analytics for project risk assessment`

#### 6.2 Client Collaboration Portal
- **Task**: Read-only client interface for project updates
- **Outcome**: Client portal with controlled access to project information
- **Agent Directive**: `Build client portal with project timeline viewing, mood board approval workflow, progress updates with visual indicators, document sharing with access controls, and feedback collection system`

#### 6.3 Team Collaboration Features
- **Task**: Real-time collaboration tools for design teams
- **Outcome**: Live collaboration with conflict resolution
- **Agent Directive**: `Implement real-time collaboration with live cursors, simultaneous editing of project details, @mentions and notifications, activity feeds, and conflict resolution for concurrent edits`

#### 6.4 Resource Planning & Capacity Management
- **Task**: Advanced resource allocation and workload balancing
- **Outcome**: Optimized team utilization with skill-based assignment
- **Agent Directive**: `Create resource planning system with skill-based task assignment, workload balancing algorithms, capacity forecasting, freelancer management, and automated workload alerts`

### Phase 7: AI Content Generation (Optional)

#### 7.1 Social Media Content Generation
- **Task**: AI-powered social media content creation from project images
- **Outcome**: Automated social media marketing for completed projects
- **Agent Directive**: `Integrate video generation APIs (Runway ML, Wan2.1-I2V), implement content scheduling across platforms (Instagram, Facebook, LinkedIn), create template-based content generation, and build performance analytics`

#### 7.2 TTS Integration for Accessibility
- **Task**: Voice interface for hands-free project management
- **Outcome**: Voice commands and audio responses for accessibility
- **Agent Directive**: `Integrate ElevenLabs TTS for audio responses, implement speech-to-text for voice commands, create voice-optimized prompt formatting, and build accessibility-compliant audio controls`

#### 7.3 AI Writing Assistant
- **Task**: AI assistance for project documentation and client communication
- **Outcome**: Context-aware writing assistance for design professionals
- **Agent Directive**: `Build AI writing assistant for project proposals, client emails, specification documents, and project updates with design industry terminology and professional tone customization`

### Phase 8: Enterprise Features (Optional)

#### 8.1 Multi-Firm Management
- **Task**: Support for design agency networks and partnerships
- **Outcome**: Cross-firm collaboration and resource sharing
- **Agent Directive**: `Implement multi-firm support with shared projects, cross-firm team assignments, consolidated reporting, and partnership management with permission controls`

#### 8.2 Advanced Financial Integration
- **Task**: Comprehensive financial management and reporting
- **Outcome**: Complete financial oversight with profitability analysis
- **Agent Directive**: `Enhance Xero integration with automated invoicing, expense tracking, profitability analysis by project, cash flow forecasting, and financial reporting dashboards`

#### 8.3 API Platform for Third-Party Integrations
- **Task**: Public API for integrations with design software and tools
- **Outcome**: Ecosystem of integrations with design industry tools
- **Agent Directive**: `Create public API with rate limiting, webhook system for real-time updates, SDK development for popular design tools, developer documentation, and partner integration marketplace`

## Implementation Guidelines for AI Agents

### Task Execution Principles

1. **Autonomy**: Each task must be completable without human intervention
2. **Validation**: Include automated testing and error checking
3. **Documentation**: Generate inline documentation and comments
4. **Standards**: Follow established coding patterns and conventions
5. **Dependencies**: Clearly specify prerequisite tasks and external requirements

### Quality Assurance Checklist

For each completed task, verify:
- [ ] TypeScript compilation without errors
- [ ] ESLint and Prettier formatting compliance
- [ ] Database migrations run successfully
- [ ] API endpoints return expected responses
- [ ] UI components render correctly across viewports
- [ ] Authentication and authorization work as expected
- [ ] Error handling covers edge cases
- [ ] Performance meets acceptable thresholds

### Agent Communication Protocol

When completing tasks, agents should:
1. **Confirm Understanding**: Restate the task objective and expected outcome
2. **Report Progress**: Provide status updates for long-running operations
3. **Document Decisions**: Explain technical choices and trade-offs made
4. **Identify Issues**: Report any blockers or dependency conflicts
5. **Validate Results**: Confirm successful completion with evidence

### Continuous Integration Requirements

All agent-generated code must:
- Pass automated test suites
- Meet code coverage thresholds (minimum 80%)
- Pass security vulnerability scans
- Comply with accessibility standards (WCAG 2.1 AA)
- Include comprehensive error logging
- Maintain backward compatibility with existing APIs

## Success Metrics

### MVP Completion Criteria
- [ ] User authentication and firm-based multi-tenancy
- [ ] Complete project and task management with timeline visualization
- [ ] Functional chat interface with natural language processing
- [ ] Google Calendar integration with bidirectional sync
- [ ] Client and supplier management systems
- [ ] Basic file storage and organization
- [ ] Responsive UI across desktop and mobile devices

### Post-MVP Enhancement Targets
- [ ] Advanced analytics and reporting capabilities
- [ ] AI-powered content generation and social media automation
- [ ] Real-time collaboration features with conflict resolution
- [ ] Comprehensive client portal with approval workflows
- [ ] Enterprise-grade security and compliance features
- [ ] Third-party integration ecosystem and public API

### Performance Benchmarks
- API response times < 200ms for standard operations
- Database queries optimized with proper indexing
- UI interactions feel instantaneous (<100ms perceived delay)
- File uploads complete within 30 seconds for typical design files
- Chat responses generated within 3-5 seconds
- Real-time updates delivered within 1 second of changes