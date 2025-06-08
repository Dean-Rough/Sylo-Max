# Sylo-Max - AI-Powered Design Studio Management Dashboard

## Product Overview

Sylo-Max is a comprehensive AI-powered project management dashboard specifically built for design studios including interior design, architecture, branding, and creative agencies. Built with modern UI components including Horizon UI and Chakra UI, it provides a professional, modern interface for managing creative workflows from initial client briefing through to final delivery.

## Recent Updates (June 2025)

### UI Component Integration
- **Horizon UI Components**: Successfully installed and integrated `@horizon-ui-brijesh/horizon` for enhanced UI elements
- **Chakra UI Foundation**: Added Chakra UI (`@chakra-ui/react`) as the component foundation
- **TypeScript Fixes**: Resolved all compilation errors for production-ready deployment
- **Enhanced Styling**: Improved component styling with modern design patterns

### Technical Improvements
- **API Error Handling**: Fixed TypeScript errors in API response formatting
- **Database Types**: Updated User interface to handle nullable fields correctly
- **Build Optimization**: Lazy-loaded OpenAI client to prevent build-time failures
- **Environment Configuration**: Enhanced environment variable handling for development and production

## Key Features

- **AI-Powered Dashboard**: Modern UI-styled interface with real-time AI chat assistance
- **Natural Language Project Management**: Create, update, and manage clients, projects, tasks, and schedules using conversational AI
- **Design-Specific Workflows**: Built-in understanding of creative project phases and milestones
- **Real-time Chat Interface**: Always-accessible AI assistant for instant project guidance
- **Professional UI Components**: Horizon UI and Chakra UI design system with navy color scheme and gradient accents
- **Dark/Light Theme Support**: Seamless theme switching with consistent styling
- **Responsive Design**: Mobile-first approach with optimized layouts for all screen sizes

## Design System & UI

### UI Component Stack
- **Horizon UI Components**: Professional React components from `@horizon-ui-brijesh/horizon`
- **Chakra UI Foundation**: Core component library with `@chakra-ui/react`, `@emotion/react`, and `@emotion/styled`
- **Framer Motion**: Smooth animations and transitions
- **Radix UI Primitives**: Accessible component primitives for complex interactions
- **Shadcn/ui Components**: Custom-styled components built on Radix primitives

### Design Tokens
- **Color Palette**: Navy-based color scheme (navy-50 through navy-900) with blue gradient accents
- **Typography**: Poppins font family with proper weight hierarchy
- **Components**: Card-based layout with shadow system and backdrop blur effects
- **Navigation**: Professional sidebar with gradient active states and user profile section
- **Interactive Elements**: Hover effects, smooth transitions, and responsive design patterns

### Dashboard Features
- **Statistics Cards**: Real-time project metrics with colored icons and trend indicators
- **Project Management**: Visual progress tracking with gradient progress bars
- **Task Management**: Priority-based task lists with status indicators
- **Quick Actions**: Gradient action cards for common workflows
- **Search Integration**: Global search with backdrop blur header design

## Core Technologies

### Frontend Stack
- **Framework**: Next.js 14+ with App Router (TypeScript)
- **Styling**: TailwindCSS with Horizon UI design patterns
- **UI Components**: Shadcn UI with custom Horizon UI theming
- **Design System**: Custom navy color palette with gradient accents
- **Theme Support**: next-themes for dark/light mode switching
- **Icons**: Lucide React for consistent iconography

### Backend Stack
- **Database**: NeonDB (Serverless Postgres) with Prisma ORM
- **Authentication**: Supabase Auth integration
- **Hosting**: Vercel with edge functions and serverless API routes
- **AI Integration**: OpenAI GPT-4 with function calling for chat interface

### Key Components
- **SidebarNav**: Professional navigation with Horizon UI styling
- **DashboardHeader**: Breadcrumb navigation with search and controls
- **ChatInterface**: Real-time AI assistant with message history
- **Dashboard Cards**: Statistics and project tracking components

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL database (NeonDB recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/sylo-ai/sylo-max.git
cd sylo-max

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Set up database
npx prisma generate
npx prisma db push

# Start development server (automatically kills any process on port 3971)
npm run dev

# Alternative: Start on default Next.js port (3000)
npm run dev:default

# Manually kill process on port 3971 if needed
npm run kill-port
```

### Development Server

The development server runs on **port 3971** by default. The `npm run dev` command automatically:
1. Kills any existing process on port 3971
2. Starts the Next.js development server on port 3971

Available scripts:
- `npm run dev` - Start server on port 3971 (with automatic port cleanup)
- `npm run dev:default` - Start server on default port 3000
- `npm run kill-port` - Manually kill any process running on port 3971

### Environment Variables

Required environment variables:

```bash
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Authentication
SUPABASE_URL="https://..."
SUPABASE_ANON_KEY="..."

# AI Services
OPENAI_API_KEY="sk-..."

# App Configuration
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3971"  # Updated to use port 3971
```

## Project Structure

```
/
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # Dashboard layout and pages
│   │   ├── layout.tsx     # Dashboard layout with sidebar and chat
│   │   └── dashboard/     # Main dashboard page
│   ├── (auth)/           # Authentication pages
│   └── globals.css       # Global styles with Horizon UI theming
├── components/            # Reusable UI components
│   ├── dashboard/        # Dashboard-specific components
│   │   ├── sidebar-nav.tsx
│   │   └── dashboard-header.tsx
│   ├── chat/            # AI chat interface
│   │   └── chat-interface.tsx
│   ├── ui/              # Shadcn UI components
│   └── providers/       # Theme and context providers
├── lib/                 # Utility functions and configurations
│   └── utils.ts         # Tailwind utilities and helpers
├── prisma/              # Database schema and migrations
├── public/              # Static assets
└── types/               # TypeScript type definitions
```

## Dashboard Features

### Main Dashboard
- **Statistics Overview**: Active projects, tasks due today, client count, and revenue tracking
- **Project Management**: Recent projects with progress indicators and status tracking
- **Task Management**: Upcoming tasks with priority levels and due dates
- **Quick Actions**: AI-assisted project creation, task management, and scheduling

### AI Chat Interface
- **Real-time Assistance**: Always-visible chat panel for instant help
- **Message History**: Persistent conversation history with timestamps
- **Contextual Responses**: AI understanding of current dashboard context
- **Typing Indicators**: Visual feedback for AI response generation

### Navigation & UX
- **Professional Sidebar**: Horizon UI-styled navigation with active state indicators
- **Search Integration**: Global search with backdrop blur effects
- **Theme Switching**: Seamless dark/light mode with consistent styling
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## Development Workflow

### Git Workflow
- **Main Branch**: Production-ready code
- **Feature Branches**: `feature/description-of-feature`
- **Hotfix Branches**: `hotfix/description-of-fix`

### Code Standards
- TypeScript strict mode enabled
- ESLint + Prettier for code formatting
- Horizon UI design patterns for consistent styling
- Component composition with proper TypeScript typing

### Deployment
```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

## API Documentation

The main conversational API endpoint:

```typescript
POST /api/chat
{
  "message": "Create a new project for ABC Corp interior design",
  "userId": "user-uuid",
  "context": {
    "currentProject": "project-uuid",
    "timestamp": "2025-06-07T09:00:00Z"
  }
}
```

See `API_ROUTES.md` for complete endpoint documentation.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow Horizon UI design patterns for new components
4. Commit changes (`git commit -m 'feat: add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

MIT License - See LICENSE file for details

## Support

For technical support and feature requests, please open an issue in the repository or contact the development team.