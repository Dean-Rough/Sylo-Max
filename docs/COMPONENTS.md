# Sylo-core Component Breakdown

## Frontend Component Architecture

### Core UI Components (Shadcn UI + Custom)

The frontend follows a modular component architecture built on Shadcn UI with custom extensions for design studio workflows.

```typescript
components/
├── ui/                         # Base Shadcn UI components
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── table.tsx
│   ├── tabs.tsx
│   └── ...
├── chat/                       # Conversational Interface
│   ├── ChatInterface.tsx       # Main chat container
│   ├── MessageBubble.tsx       # Individual message display
│   ├── CommandPalette.tsx      # Slash commands interface
│   ├── SuggestionPanel.tsx     # AI suggestions sidebar
│   ├── TypingIndicator.tsx     # Real-time typing status
│   └── VoiceInput.tsx          # Speech-to-text input
├── projects/                   # Project Management
│   ├── ProjectDashboard.tsx    # Main project overview
│   ├── KanbanBoard.tsx         # Task kanban interface
│   ├── GanttChart.tsx          # Timeline and dependencies
│   ├── TimelineView.tsx        # Project timeline
│   ├── MilestoneTracker.tsx    # Milestone progress
│   ├── BudgetTracker.tsx       # Budget monitoring
│   └── TeamWorkload.tsx        # Team capacity view
├── suppliers/                  # Product Catalog
│   ├── ProductGallery.tsx      # Pinterest-style grid
│   ├── SupplierDirectory.tsx   # Supplier management
│   ├── MoodBoardBuilder.tsx    # Drag-and-drop boards
│   ├── ColorPalette.tsx        # Color extraction tools
│   ├── ProductFilters.tsx      # Advanced filtering
│   └── ProductComparison.tsx   # Side-by-side comparison
├── collaboration/              # Team Features
│   ├── ActivityFeed.tsx        # Real-time activity
│   ├── LiveCursors.tsx         # Multi-user cursors
│   ├── CommentThread.tsx       # Task comments
│   ├── FileSharing.tsx         # File upload/management
│   ├── Notifications.tsx       # System notifications
│   └── UserPresence.tsx        # Online status
└── forms/                      # Form Components
    ├── ProjectForm.tsx         # Project creation/editing
    ├── TaskForm.tsx            # Task management
    ├── ClientForm.tsx          # Client information
    ├── SupplierForm.tsx        # Supplier management
    └── TimeEntryForm.tsx       # Time tracking
```

## Required Shadcn UI Components

### Core UI Components Installation

```bash
# Install required Shadcn UI components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
npx shadcn-ui@latest add table
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add command
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add tooltip
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add radio-group
npx shadcn-ui@latest add switch
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add label
npx shadcn-ui@latest add form
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add date-picker
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add skeleton
```

## Utility Functions

### Common Utility Functions

```typescript
// lib/utils/project-utils.ts
export function calculateProjectProgress(tasks: Task[]): number {
  if (tasks.length === 0) return 0;
  const completedTasks = tasks.filter(task => task.status === 'complete').length;
  return Math.round((completedTasks / tasks.length) * 100);
}

export function getProjectStageLabel(stage: string): string {
  const stageLabels: Record<string, string> = {
    'stage_0': 'Strategic Definition',
    'stage_1': 'Preparation & Briefing',
    'stage_2': 'Concept Design',
    'stage_3': 'Spatial Coordination',
    'stage_4': 'Technical Design',
    'stage_5': 'Manufacturing & Construction',
    'stage_6': 'Handover',
    'stage_7': 'Use'
  };
  return stageLabels[stage] || stage;
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function calculateBudgetUtilization(budgetUsed: number, totalBudget: number): {
  percentage: number;
  status: 'safe' | 'warning' | 'danger';
} {
  const percentage = (budgetUsed / totalBudget) * 100;
  let status: 'safe' | 'warning' | 'danger' = 'safe';
  
  if (percentage > 90) status = 'danger';
  else if (percentage > 75) status = 'warning';
  
  return { percentage, status };
}

// lib/utils/task-utils.ts
export function getTaskPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    'low': 'text-blue-600 bg-blue-50',
    'medium': 'text-yellow-600 bg-yellow-50',
    'high': 'text-orange-600 bg-orange-50',
    'urgent': 'text-red-600 bg-red-50'
  };
  return colors[priority] || colors['medium'];
}

export function getTaskStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'pending': 'text-gray-600 bg-gray-50',
    'in_progress': 'text-blue-600 bg-blue-50',
    'client_review': 'text-purple-600 bg-purple-50',
    'complete': 'text-green-600 bg-green-50',
    'blocked': 'text-red-600 bg-red-50'
  };
  return colors[status] || colors['pending'];
}

export function sortTasksByPriority(tasks: Task[]): Task[] {
  const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
  return tasks.sort((a, b) => 
    (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - 
    (priorityOrder[a.priority as keyof typeof priorityOrder] || 0)
  );
}

export function getOverdueTasks(tasks: Task[]): Task[] {
  const now = new Date();
  return tasks.filter(task => 
    task.due_date && 
    new Date(task.due_date) < now && 
    task.status !== 'complete'
  );
}

// lib/utils/date-utils.ts
export function formatRelativeDate(date: string | Date): string {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInMilliseconds = targetDate.getTime() - now.getTime();
  const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Tomorrow';
  if (diffInDays === -1) return 'Yesterday';
  if (diffInDays > 1 && diffInDays <= 7) return `In ${diffInDays} days`;
  if (diffInDays < -1 && diffInDays >= -7) return `${Math.abs(diffInDays)} days ago`;
  
  return targetDate.toLocaleDateString();
}

export function getDaysUntilDeadline(deadline: string | Date): number {
  const now = new Date();
  const targetDate = new Date(deadline);
  const diffInMilliseconds = targetDate.getTime() - now.getTime();
  return Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));
}

export function isOverdue(date: string | Date): boolean {
  return new Date(date) < new Date();
}

// lib/utils/color-utils.ts
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function getContrastColor(hexColor: string): string {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return '#000000';
  
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#FFFFFF';
}

export function generateColorPalette(colors: string[]): string[] {
  // Remove duplicates and invalid colors
  return colors
    .filter((color, index, self) => 
      self.indexOf(color) === index && 
      /^#[0-9A-F]{6}$/i.test(color)
    )
    .slice(0, 10); // Limit to 10 colors
}

// lib/utils/file-utils.ts
export function getFileIcon(mimeType: string): string {
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType.startsWith('video/')) return '🎥';
  if (mimeType === 'application/pdf') return '📄';
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return '📊';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return '📈';
  if (mimeType.includes('document') || mimeType.includes('word')) return '📝';
  return '📎';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

export function isVideoFile(mimeType: string): boolean {
  return mimeType.startsWith('video/');
}

// lib/utils/search-utils.ts
export function fuzzySearch<T>(
  items: T[], 
  query: string, 
  keys: (keyof T)[]
): T[] {
  if (!query.trim()) return items;
  
  const lowerQuery = query.toLowerCase();
  
  return items.filter(item =>
    keys.some(key => {
      const value = String(item[key]).toLowerCase();
      return value.includes(lowerQuery) || 
             levenshteinDistance(value, lowerQuery) <= 2;
    })
  );
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => 
    Array(str1.length + 1).fill(null)
  );
  
  for (let i = 0; i <= str1.length; i += 1) {
    matrix[0][i] = i;
  }
  
  for (let j = 0; j <= str2.length; j += 1) {
    matrix[j][0] = j;
  }
  
  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  
  return matrix[str2.length][str1.length];
}

// lib/utils/validation-utils.ts
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validateHexColor(color: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(color);
}

// lib/utils/id-utils.ts
export function generateId(prefix?: string): string {
  const id = Math.random().toString(36).substring(2, 15) + 
            Math.random().toString(36).substring(2, 15);
  return prefix ? `${prefix}_${id}` : id;
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
```

## Enhanced Hook Implementations

```typescript
// lib/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// lib/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(
  key: string, 
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

// lib/hooks/useKeyboard.ts
import { useEffect } from 'react';

export function useKeyboard(
  key: string, 
  callback: () => void, 
  deps: any[] = []
) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === key) {
        callback();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, deps);
}
```

## Backend Service Architecture

### Core Service Adapters

```typescript
// lib/services/ProjectService.ts
export class ProjectService {
  constructor(private db: PrismaClient, private aiService: AIService) {}

  async create(data: CreateProjectData): Promise<Project> {
    const project = await this.db.project.create({
      data: {
        ...data,
        currentStage: 'stage_0',
        status: 'active'
      },
      include: {
        client: true,
        team: true
      }
    });

    // Auto-generate initial tasks from template
    if (data.templateId) {
      await this.generateTasksFromTemplate(project.id, data.templateId);
    }

    return project;
  }

  async getByStage(stage: ProjectStage, firmId: string): Promise<Project[]> {
    return this.db.project.findMany({
      where: {
        firmId,
        currentStage: stage,
        status: 'active'
      },
      include: {
        client: true,
        tasks: {
          where: { status: { not: 'complete' } },
          orderBy: { dueDate: 'asc' }
        }
      }
    });
  }

  async getAnalytics(projectId: string): Promise<ProjectAnalytics> {
    const [tasks, timeEntries, expenses] = await Promise.all([
      this.db.task.findMany({ where: { projectId } }),
      this.db.timeEntry.findMany({ where: { projectId } }),
      this.db.projectExpense.findMany({ where: { projectId } })
    ]);

    return {
      tasksCompleted: tasks.filter(t => t.status === 'complete').length,
      tasksTotal: tasks.length,
      budgetUsed: timeEntries.reduce((sum, entry) => sum + entry.totalCost, 0),
      timelineProgress: this.calculateTimelineProgress(tasks),
      teamUtilization: await this.calculateTeamUtilization(projectId)
    };
  }

  private async generateTasksFromTemplate(projectId: string, templateId: string) {
    const template = await this.db.projectTemplate.findUnique({
      where: { id: templateId }
    });

    if (!template) return;

    const templateData = template.templateData as any;
    const tasks = templateData.defaultTasks || [];

    for (const taskData of tasks) {
      await this.db.task.create({
        data: {
          projectId,
          title: taskData.title,
          stage: taskData.stage,
          estimatedHours: taskData.estimatedHours,
          status: 'pending'
        }
      });
    }
  }
}

// lib/services/AIService.ts
export class AIService {
  constructor(private openai: OpenAI) {}

  async parseIntent(message: string, context: ChatContext): Promise<ParsedIntent> {
    const completion = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant for design studios. Parse the user's message and extract:
          1. Intent (create_project, update_task, schedule_meeting, etc.)
          2. Entities (client names, dates, amounts, etc.)
          3. Confidence score (0.0-1.0)
          
          Current context: ${JSON.stringify(context)}`
        },
        {
          role: "user",
          content: message
        }
      ],
      functions: [
        {
          name: "parse_intent",
          description: "Parse user intent and entities",
          parameters: {
            type: "object",
            properties: {
              intent: { type: "string" },
              entities: { type: "object" },
              confidence: { type: "number" },
              requiredParams: { type: "array", items: { type: "string" } }
            }
          }
        }
      ],
      function_call: { name: "parse_intent" }
    });

    const result = JSON.parse(completion.choices[0].message.function_call?.arguments || '{}');
    return result;
  }

  async extractProductData(url: string): Promise<ExtractedProductData> {
    // Web scraping and AI analysis logic
    const pageContent = await this.scrapeProductPage(url);
    
    const completion = await this.openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "system",
          content: "Extract product information from this webpage content"
        },
        {
          role: "user",
          content: [
            { type: "text", text: pageContent.text },
            ...pageContent.images.map(img => ({
              type: "image_url" as const,
              image_url: { url: img }
            }))
          ]
        }
      ]
    });

    return this.parseProductData(completion.choices[0].message.content);
  }

  private async scrapeProductPage(url: string) {
    // Implementation for web scraping
    // Returns text content and image URLs
  }
}
```

### External Integration Adapters

```typescript
// lib/integrations/GoogleCalendarAdapter.ts
export class GoogleCalendarAdapter {
  constructor(private auth: GoogleAuth) {}

  async createEvent(event: CalendarEventData): Promise<calendar_v3.Schema$Event> {
    const calendar = google.calendar({ version: 'v3', auth: this.auth });
    
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: event.title,
        description: event.description,
        start: {
          dateTime: event.startTime,
          timeZone: 'UTC'
        },
        end: {
          dateTime: event.endTime,
          timeZone: 'UTC'
        },
        attendees: event.attendees?.map(email => ({ email })),
        conferenceData: event.createMeetingLink ? {
          createRequest: {
            requestId: generateId(),
            conferenceSolutionKey: { type: 'hangoutsMeet' }
          }
        } : undefined
      },
      conferenceDataVersion: event.createMeetingLink ? 1 : 0
    });

    return response.data;
  }

  async getAvailability(userIds: string[], timeRange: TimeRange): Promise<UserAvailability[]> {
    const calendar = google.calendar({ version: 'v3', auth: this.auth });
    
    const freeBusyResponse = await calendar.freebusy.query({
      requestBody: {
        timeMin: timeRange.start,
        timeMax: timeRange.end,
        items: userIds.map(id => ({ id: `${id}@domain.com` }))
      }
    });

    return this.parseAvailabilityData(freeBusyResponse.data);
  }
}

// lib/integrations/XeroAdapter.ts
export class XeroAdapter {
  constructor(private xeroClient: XeroClient) {}

  async createInvoice(invoiceData: InvoiceData): Promise<Invoice> {
    const lineItems = invoiceData.lineItems.map(item => ({
      description: item.description,
      quantity: item.quantity,
      unitAmount: item.unitPrice,
      accountCode: '200' // Revenue account
    }));

    const invoice = {
      type: 'ACCREC' as const,
      contact: { contactID: invoiceData.contactId },
      date: new Date().toISOString().split('T')[0],
      dueDate: invoiceData.dueDate,
      lineItems,
      reference: invoiceData.reference,
      status: 'DRAFT' as const
    };

    const response = await this.xeroClient.accountingApi.createInvoices(
      process.env.XERO_TENANT_ID!,
      { invoices: [invoice] }
    );

    return response.body.invoices![0];
  }

  async syncContacts(): Promise<XeroContact[]> {
    const response = await this.xeroClient.accountingApi.getContacts(
      process.env.XERO_TENANT_ID!
    );

    return response.body.contacts || [];
  }
}
```

## State Management

### Zustand Store Structure

```typescript
// lib/stores/useAppStore.ts
interface AppState {
  // User & Authentication
  user: User | null;
  session: Session | null;
  
  // Project Context
  currentProject: Project | null;
  activeProjects: Project[];
  
  // Chat State
  chatHistory: Message[];
  currentContext: ChatContext;
  suggestions: string[];
  
  // UI State
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
  
  // Real-time Collaboration
  onlineUsers: User[];
  liveActivity: Activity[];
  
  // Actions
  setUser: (user: User | null) => void;
  setCurrentProject: (project: Project | null) => void;
  addChatMessage: (message: Message) => void;
  updateProjectList: (projects: Project[]) => void;
  toggleSidebar: () => void;
  addNotification: (notification: Notification) => void;
  updateOnlineUsers: (users: User[]) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  user: null,
  session: null,
  currentProject: null,
  activeProjects: [],
  chatHistory: [],
  currentContext: {},
  suggestions: [],
  sidebarOpen: true,
  theme: 'light',
  notifications: [],
  onlineUsers: [],
  liveActivity: [],

  // Actions
  setUser: (user) => set({ user }),
  setCurrentProject: (project) => set({ currentProject: project }),
  addChatMessage: (message) => set((state) => ({
    chatHistory: [...state.chatHistory, message]
  })),
  updateProjectList: (projects) => set({ activeProjects: projects }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  addNotification: (notification) => set((state) => ({
    notifications: [...state.notifications, notification]
  })),
  updateOnlineUsers: (users) => set({ onlineUsers: users })
}));
```

This component breakdown provides:

1. **Modular Architecture**: Clear separation of concerns with focused components
2. **TypeScript Integration**: Full type safety across all components
3. **Real-time Features**: Live collaboration and updates
4. **Accessibility**: Proper ARIA labels and keyboard navigation
5. **Performance**: Optimized rendering with React Query and lazy loading
6. **Extensibility**: Easy to add new features and modify existing ones

The architecture supports both MVP development and future scaling while maintaining code quality and developer experience.