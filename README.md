# Sylo-Max - AI-Powered Design Studio Management Platform

> Conversational project management for design studios, powered by AI

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com)

## 🎯 Overview

Sylo-Max is the next-generation conversational project management platform specifically designed for design studios. Unlike generic PM tools, Sylo understands the creative process from initial client briefing through final delivery and post-project marketing.

### ✨ Key Features

- **🤖 AI-Powered Conversations**: Natural language project management with GPT-4 integration
- **🎨 Design-Specific Workflows**: Built-in RIBA Plan of Work 2020 and creative project phases
- **📋 Intelligent Task Orchestration**: AI-driven task prioritization and dependency management
- **🛍️ Smart Product Catalog**: AI-powered product discovery with visual browsing
- **👥 Real-Time Collaboration**: Live cursors, @mentions, and team coordination
- **🎬 Integrated Video Generation**: Multi-provider video content creation for marketing
- **🔗 Enterprise Integrations**: Google Calendar, Xero, social media platforms

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL (or NeonDB account)
- OpenAI API key

### Installation

```bash
# Clone the repository
git clone git@github.com:Dean-Rough/Sylo-Max.git
cd Sylo-Max

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Initialize database
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see Sylo-Max in action!

## 📁 Project Structure

```
Sylo-Max/
├── 📋 PRD                     # Product Requirements Document
├── 📚 docs/                   # Complete technical documentation
│   ├── README.md              # Product overview & setup
│   ├── SYSTEM_ARCHITECTURE.md # Technical architecture
│   ├── DB_SCHEMA.md           # Database design
│   ├── API_ROUTES.md          # API specifications
│   ├── COMPONENTS.md          # Frontend components
│   ├── DEPLOYMENT.md          # Deployment guides
│   ├── ROADMAP.md             # Development roadmap
│   └── AI_PROMPT.md           # AI personality guide
└── 🔧 .env.example            # Environment template
```

## 🏗️ Architecture

Sylo-Max is built with a modern, scalable architecture:

- **Frontend**: Next.js 14+ with TypeScript, TailwindCSS, Shadcn UI
- **Backend**: Next.js API routes with serverless functions
- **Database**: NeonDB (Serverless PostgreSQL) with Prisma ORM
- **AI**: OpenAI GPT-4 with function calling
- **Real-time**: WebSocket connections for collaboration
- **Deployment**: Vercel with edge functions

## 📖 Documentation

Our documentation is designed for both developers and AI agents:

| Document | Purpose | Audience |
|----------|---------|----------|
| [📖 README](docs/README.md) | Product overview & setup | Everyone |
| [🏗️ System Architecture](docs/SYSTEM_ARCHITECTURE.md) | Technical design | Developers |
| [🗄️ Database Schema](docs/DB_SCHEMA.md) | Data model | Backend developers |
| [🔌 API Routes](docs/API_ROUTES.md) | API specifications | Frontend/Backend |
| [🧩 Components](docs/COMPONENTS.md) | UI component guide | Frontend developers |
| [🚀 Deployment](docs/DEPLOYMENT.md) | Deployment guides | DevOps |
| [🗺️ Roadmap](docs/ROADMAP.md) | Development plan | Project managers |
| [🤖 AI Prompt](docs/AI_PROMPT.md) | AI behavior guide | AI developers |

## 🛠️ Development

### Getting Started
```bash
# Start development server
npm run dev

# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests
npm test

# Database operations
npx prisma studio    # Open database GUI
npx prisma db push   # Apply schema changes
```

### Environment Setup
Copy `.env.example` to `.env.local` and configure:
- Database connection
- OpenAI API key
- Google OAuth credentials
- Xero integration keys
- Social media API keys

## 🔐 Environment Variables

Key environment variables needed:

```bash
# Core Services
DATABASE_URL="postgresql://..."
OPENAI_API_KEY="sk-..."
SUPABASE_URL="https://..."

# Integrations
GOOGLE_CLIENT_ID="..."
XERO_CLIENT_ID="..."
RUNWAY_API_KEY="..."

# See .env.example for complete list
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Docker
```bash
docker build -t sylo-max .
docker run -p 3000:3000 sylo-max
```

### Kubernetes
See [Deployment Guide](docs/DEPLOYMENT.md) for enterprise deployment options.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention
We use [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

## 🎯 AI-First Development

Sylo-Max is designed to be built and maintained by AI agents. Our documentation includes:

- **🤖 Agent-Executable Tasks**: Atomic, well-defined development tasks
- **📝 Implementation-Ready Specs**: Complete TypeScript interfaces and schemas
- **🔧 Agent-Optimized Language**: Prompts designed for AI consumption
- **✅ Success Criteria**: Measurable outcomes for each development phase

## 📊 Project Status

- **Phase**: Documentation Complete ✅
- **Architecture**: Designed ✅
- **Database**: Schema Ready ✅
- **API**: Specified ✅
- **Components**: Planned ✅
- **Deployment**: Configured ✅

**Next**: Begin Phase 1 development (Core Foundation)

## 🏢 For Design Studios

Sylo-Max understands your unique workflows:

- **RIBA Stages**: Built-in support for architectural project phases
- **Design Terminology**: AI trained on interior design and architecture language
- **Supplier Management**: Integrated product catalogs and sourcing tools
- **Client Communication**: Automated updates and approval workflows
- **Team Coordination**: Role-based permissions and task assignments

## 🎨 Built for Creatives

- **Visual Product Discovery**: Pinterest-style product browsing
- **Mood Board Integration**: Drag-and-drop board creation
- **Color Palette Extraction**: AI-powered color analysis
- **Material Libraries**: Organized supplier directories
- **Social Media Automation**: Content creation and scheduling

## 📞 Support

- **Documentation**: Complete guides in `/docs`
- **Issues**: GitHub Issues for bug reports
- **Discussions**: GitHub Discussions for questions
- **Email**: support@sylo-max.com (coming soon)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ for the design community
- Powered by OpenAI GPT-4
- UI components from Shadcn UI
- Icons from Lucide React

---

**Ready to transform your design studio?** 🚀

[📖 Read the docs](docs/) • [🚀 Deploy now](docs/DEPLOYMENT.md) • [🤝 Contribute](CONTRIBUTING.md)