# Sylo-core - Conversational Project Management for Design Studios

## Product Overview

Sylo-core is the orchestration engine behind Sylo — a conversational project management assistant specifically built for design studios including interior design, architecture, branding, and creative agencies. Unlike generic project management tools, Sylo understands the creative process from initial client briefing through to final delivery and post-project marketing.

## Key Features

- **Natural Language Project Management**: Create, update, and manage clients, projects, tasks, and schedules using conversational AI
- **Design-Specific Workflows**: Built-in understanding of RIBA Plan of Work 2020 and standard creative project phases
- **Intelligent Task Orchestration**: AI-powered task prioritization based on constraints, deadlines, and user intent
- **Supplier Directory & Product Intelligence**: AI-powered product cataloging with visual browsing and smart recommendations
- **Advanced Team Collaboration**: Real-time collaboration with live cursors, @mentions, and proofing workflows
- **Multi-Provider Video Generation**: Integrated video content creation for social media marketing
- **External Integrations**: Google Calendar, Gmail, Xero accounting, and social media platforms

## Core Technologies

### Backend Stack
- **Framework**: Next.js 14+ with App Router (TypeScript)
- **Database**: NeonDB (Serverless Postgres) with Prisma ORM
- **Authentication**: Supabase Auth or Clerk
- **Hosting**: Vercel with edge functions and serverless API routes
- **AI Integration**: OpenAI GPT-4 with function calling
- **Voice**: ElevenLabs TTS integration

### Frontend Stack
- **UI Framework**: Next.js + React 18+
- **Styling**: TailwindCSS with Shadcn UI components
- **Design System**: Custom design tokens with dark/light theme support
- **Real-time**: WebSocket connections for live collaboration
- **Charts**: Recharts for analytics and Gantt chart visualizations

### External Integrations
- **Calendar**: Google Calendar API
- **Email**: Gmail API
- **Accounting**: Xero API
- **Video Generation**: 
  - Primary: Wan2.1-I2V-14B-720P (self-hosted)
  - Fallback: Runway ML Gen-3 API
  - Budget: Wan2.1-I2V-14B-480P

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL database (NeonDB recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/sylo-ai/sylo-core.git
cd sylo-core

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Set up database
npx prisma generate
npx prisma db push

# Seed initial data (optional)
npm run db:seed

# Start development server
npm run dev
```

### Environment Variables

Required environment variables (see `.env.example`):

```bash
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Authentication
SUPABASE_URL="https://..."
SUPABASE_ANON_KEY="..."

# AI Services
OPENAI_API_KEY="sk-..."
ELEVENLABS_API_KEY="..."

# External APIs
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
XERO_CLIENT_ID="..."
XERO_CLIENT_SECRET="..."

# Video Generation
RUNWAY_API_KEY="..."
WAN21_API_ENDPOINT="..."
```

## Project Structure

```
/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── (dashboard)/       # Protected dashboard pages
│   └── (auth)/           # Authentication pages
├── components/            # Reusable UI components
│   ├── ui/               # Shadcn UI components
│   ├── charts/           # Chart components
│   └── forms/            # Form components
├── lib/                  # Utility functions and configurations
│   ├── db/               # Database utilities and Prisma client
│   ├── ai/               # AI service integrations
│   └── integrations/     # External API clients
├── prisma/               # Database schema and migrations
├── public/               # Static assets
└── types/                # TypeScript type definitions
```

## Development Workflow

### Git Workflow
- **Main Branch**: Production-ready code
- **Develop Branch**: Integration branch for features
- **Feature Branches**: `feature/description-of-feature`
- **Hotfix Branches**: `hotfix/description-of-fix`

### Code Standards
- TypeScript strict mode enabled
- ESLint + Prettier for code formatting
- Conventional commits for commit messages
- Pre-commit hooks for linting and testing

### Testing
```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run type checking
npm run type-check
```

## API Documentation

The main conversational API endpoint:

```typescript
POST /api/sylo-core
{
  "message": "Create a new project for ABC Corp interior design",
  "userId": "user-uuid",
  "context": {
    "currentProject": "project-uuid",
    "timeWindow": "2025-06-07T09:00:00Z"
  }
}
```

See `API_ROUTES.md` for complete endpoint documentation.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[License Type] - See LICENSE file for details

## Support

For technical support and feature requests, please open an issue in the repository or contact the development team.