# Sylo-Max Component Architecture

## Horizon UI Dashboard Components

The frontend follows Horizon UI design principles with a modular component architecture built on Shadcn UI with custom styling for design studio workflows.

```typescript
components/
├── ui/                         # Base Shadcn UI components
│   ├── button.tsx              # Button with Horizon UI styling
│   ├── card.tsx                # Card component with navy theme
│   ├── input.tsx               # Form inputs with gradients
│   └── ...                     # Other Shadcn components
├── dashboard/                  # Dashboard-specific components
│   ├── sidebar-nav.tsx         # Professional navigation sidebar
│   ├── dashboard-header.tsx    # Header with search and breadcrumbs
│   └── dashboard-layout.tsx    # Main layout with sidebar and chat
├── chat/                       # AI Chat Interface
│   ├── chat-interface.tsx      # Main chat container
│   ├── message-bubble.tsx      # Individual message display
│   ├── typing-indicator.tsx    # Real-time typing status
│   └── chat-input.tsx          # Message input with suggestions
├── providers/                  # Context providers
│   ├── theme-provider.tsx      # Dark/light theme switching
│   └── auth-provider.tsx       # Authentication context
└── forms/                      # Form Components
    ├── project-form.tsx        # Project creation/editing
    ├── task-form.tsx           # Task management
    └── client-form.tsx         # Client information
```

## Core Dashboard Components

### SidebarNav (`components/dashboard/sidebar-nav.tsx`)

Professional navigation component with Horizon UI styling:

```typescript
interface SidebarNavProps {
  collapsed?: boolean;
}

// Features:
- Navy gradient background with blur effects
- Active state indicators with blue gradients
- User profile section with avatar and status
- Menu items with Lucide React icons
- Smooth transitions and hover effects
- Responsive design for mobile/desktop
```

**Key Styling Classes:**
- `bg-gradient-to-b from-navy-800 to-navy-900`
- `backdrop-blur-xl border-r border-white/10`
- Active states: `bg-gradient-to-r from-blue-500 to-blue-600`

### DashboardHeader (`components/dashboard/dashboard-header.tsx`)

Modern header with search and navigation:

```typescript
interface DashboardHeaderProps {
  title?: string;
  breadcrumbs?: BreadcrumbItem[];
}

// Features:
- Backdrop blur background
- Global search with keyboard shortcuts
- Breadcrumb navigation
- Theme toggle and user controls
- Responsive layout
```

**Key Styling Classes:**
- `backdrop-blur-md bg-white/80 dark:bg-navy-800/80`
- Search: `bg-gray-100 dark:bg-navy-700/50`

### ChatInterface (`components/chat/chat-interface.tsx`)

Always-visible AI assistant panel:

```typescript
interface ChatInterfaceProps {
  initialMessages?: Message[];
  onSendMessage?: (message: string) => void;
}

// Features:
- Real-time message streaming
- Typing indicators
- Message history with timestamps
- Auto-scroll to latest messages
- Gradient send button
- Context-aware responses
```

**Key Styling Classes:**
- Container: `bg-white dark:bg-navy-800 border-l border-gray-200 dark:border-navy-700`
- Messages: `bg-gray-50 dark:bg-navy-900 rounded-lg`
- Send button: `bg-gradient-to-r from-blue-500 to-blue-600`

### Dashboard Cards (`app/(dashboard)/dashboard/page.tsx`)

Statistics and content cards with Horizon UI design:

```typescript
// Stats Cards
- Active Projects, Tasks Due, Client Count, Revenue
- Colored icons with trend indicators
- Clean card layout with shadows

// Project Management Cards
- Recent Projects with progress bars
- Task lists with priority indicators
- Quick Actions with gradient backgrounds
```

**Key Styling Classes:**
- Cards: `!bg-white shadow-sm shadow-gray-100 dark:!bg-navy-800`
- Progress bars: `bg-gradient-to-r from-blue-500 to-blue-600`
- Priority badges: Color-coded with dark mode support

## Horizon UI Design System

### Color Palette

```typescript
// tailwind.config.js navy colors
navy: {
  50: '#e6f0ff',
  100: '#cce0ff',
  200: '#99c2ff',
  300: '#66a3ff',
  400: '#3385ff',
  500: '#0066ff',
  600: '#0052cc',
  700: '#003d99',
  800: '#002966',
  900: '#001433',
}
```

### Typography

```typescript
// Font configuration
fontFamily: {
  sans: ['Poppins', 'ui-sans-serif', 'system-ui'],
}
```

### Gradient System

```typescript
// Common gradients used throughout
- Primary: `bg-gradient-to-r from-blue-500 to-blue-600`
- Sidebar: `bg-gradient-to-b from-navy-800 to-navy-900`
- Active states: `bg-gradient-to-r from-blue-500/10 to-blue-600/10`
```

## Required Shadcn UI Components

### Installation Commands

```bash
# Core components for dashboard
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add tooltip
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add skeleton
```

## Component Features

### Theme Support
- Full dark/light mode with navy color variations
- Consistent styling across all components
- Smooth transitions between themes

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interactions

### Accessibility
- Proper ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader compatibility

### Performance
- Lazy loading for non-critical components
- Optimized re-renders with React.memo
- Efficient state management

## Layout Structure

### Dashboard Layout (`app/(dashboard)/layout.tsx`)

Three-column layout with fixed positioning:

```typescript
<div className="flex h-screen bg-gray-50 dark:bg-navy-900">
  {/* Sidebar - 300px fixed width */}
  <aside className="w-[300px] min-w-[300px]">
    <SidebarNav />
  </aside>
  
  {/* Main Content - flexible width */}
  <div className="flex-1 flex flex-col overflow-hidden">
    <DashboardHeader />
    <main className="flex-1 overflow-auto p-4">
      {children}
    </main>
  </div>
  
  {/* Chat Interface - 400px fixed width */}
  <aside className="w-[400px] min-w-[400px]">
    <ChatInterface />
  </aside>
</div>
```

### Page Structure

Each dashboard page follows this pattern:

```typescript
export default function DashboardPage() {
  return (
    <div className="space-y-4">
      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Stat cards */}
      </div>
      
      {/* Content grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Main content cards */}
      </div>
      
      {/* Action cards */}
      <Card className="!bg-gradient-to-r from-blue-500 to-blue-600">
        {/* Quick actions */}
      </Card>
    </div>
  )
}
```

## Development Guidelines

### Component Creation
1. Use Horizon UI color scheme (navy + blue gradients)
2. Include dark mode support
3. Add proper TypeScript interfaces
4. Implement responsive design
5. Follow accessibility best practices

### Styling Conventions
- Use `!bg-white` for card backgrounds (override default)
- Navy colors for text and backgrounds
- Blue gradients for interactive elements
- Consistent spacing with Tailwind classes
- Shadow system: `shadow-sm shadow-gray-100`

### State Management
- Use React hooks for component state
- Context providers for global state
- Proper cleanup in useEffect hooks
- Optimistic updates for better UX

This architecture provides a solid foundation for building out additional features while maintaining the professional Horizon UI aesthetic and ensuring consistent user experience across the application.