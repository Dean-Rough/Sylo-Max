# Sylo-Max - AI-Powered Design Studio Dashboard

> **Next.js 14 + Horizon UI + TypeScript + AI** | Professional dashboard with conversational AI for creative professionals

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14.2.4-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.2-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Horizon UI](https://img.shields.io/badge/UI-Horizon%20Design-blue)](https://horizon-ui.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 🎯 Overview

Sylo-Max is a **professional dashboard application** built with **Next.js 14**, **TypeScript**, and **Horizon UI design principles**. It features an always-visible AI chat interface, modern navy-themed styling, and responsive design optimized for creative professionals.

## ✨ Key Features

**🎨 Professional Horizon UI Design**
- Navy gradient color scheme with blue accents
- Glassmorphism effects with backdrop blur
- Professional sidebar navigation with smooth animations
- Responsive three-column layout (Sidebar + Content + Chat)

**🤖 Always-Visible AI Assistant**
- Fixed chat panel on the right side
- Real-time messaging with typing indicators
- Context-aware responses
- Gradient styling with professional appearance

**📊 Dashboard Components**
- Stats cards with trend indicators
- Recent projects with progress tracking
- Task management with priority badges
- Quick actions with gradient backgrounds

**🌙 Dark/Light Theme Support**
- Seamless theme switching
- Navy color variations for dark mode
- Consistent styling across all components

## 🚀 Tech Stack

**Frontend Framework:**
- ⚡ **Next.js 14.2.4** - React framework with App Router
- 🔷 **TypeScript 5.5.2** - Type-safe development
- ⚛️ **React 18.3.1** - UI library

**Styling & UI:**
- 🎨 **TailwindCSS 3.4.4** - Utility-first CSS with custom navy colors
- 🧩 **Shadcn UI** - Headless components with Horizon UI styling
- 🎭 **Lucide React** - Beautiful icons
- 🌙 **Next Themes** - Dark/light mode support

**Component Features:**
- 🔧 **Horizon UI Components** - Professional dashboard elements
- 📱 **Responsive Design** - Mobile-first approach
- ♿ **Accessibility** - ARIA labels and keyboard navigation
- ⚡ **Performance** - Optimized re-renders and lazy loading

## 📁 Project Structure

```
Sylo Final/
├── 📋 PRD                     # Product Requirements Document
├── 📚 docs/                   # Updated technical documentation
│   ├── README.md              # Product overview
│   ├── COMPONENTS.md          # Horizon UI component guide
│   ├── API_ROUTES.md          # Dashboard API specifications
│   └── ...                    # Other documentation
├── 🎨 app/                    # Next.js App Router
│   ├── globals.css            # Global styles with navy theme
│   ├── layout.tsx             # Root layout with theme provider
│   ├── page.tsx               # Landing page
│   └── (dashboard)/           # Dashboard routes
│       ├── layout.tsx         # Three-column dashboard layout
│       └── dashboard/
│           └── page.tsx       # Main dashboard with stats
├── 🧩 components/             # Reusable components
│   ├── ui/                    # Shadcn UI with Horizon styling
│   ├── dashboard/             # Dashboard-specific components
│   ├── chat/                  # AI chat interface
│   └── providers/             # Context providers
├── 🎨 styles/                 # Additional styling
├── 📋 types/                  # TypeScript definitions
└── 🔧 Configuration files
```

## 🎨 Horizon UI Design System

**Color Palette:**
```typescript
// Navy color scheme (tailwind.config.js)
navy: {
  50: '#e6f0ff',   // Light accents
  100: '#cce0ff',  // Subtle backgrounds
  200: '#99c2ff',  // Light elements
  300: '#66a3ff',  // Interactive elements
  400: '#3385ff',  // Primary actions
  500: '#0066ff',  // Brand primary
  600: '#0052cc',  // Hover states
  700: '#003d99',  // Active states
  800: '#002966',  // Dark backgrounds
  900: '#001433',  // Deepest navy
}
```

**Key Styling Patterns:**
- **Sidebar**: `bg-gradient-to-b from-navy-800 to-navy-900` with backdrop blur
- **Cards**: `!bg-white dark:!bg-navy-800` with subtle shadows
- **Active States**: `bg-gradient-to-r from-blue-500 to-blue-600`
- **Buttons**: Blue gradients with hover animations
- **Typography**: Poppins font family for professional appearance

## 🛠️ Development

### Quick Start
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Key Commands
```bash
npm run dev          # Development server
npm run build        # Production build
npm run type-check   # TypeScript validation
npm run lint         # ESLint checking
```

### Component Development
```bash
# Add new Shadcn UI components
npx shadcn-ui@latest add [component-name]

# Available components used:
# button, card, input, badge, avatar, separator
# dropdown-menu, tooltip, progress, skeleton
```

## 📊 Dashboard Features

**Stats Overview:**
- Active Projects counter with trend indicators
- Tasks Due with priority breakdown
- Client Count tracking
- Revenue metrics with percentage changes

**Project Management:**
- Recent Projects list with progress bars
- Priority-based task organization
- Quick action buttons with gradients
- Responsive card layouts

**AI Chat Interface:**
- Always-visible right panel (400px width)
- Real-time message streaming
- Professional navy-themed styling
- Smooth animations and transitions

**Navigation:**
- Professional sidebar (300px width)
- User profile section with avatar
- Menu items with active state indicators
- Breadcrumb navigation in header

## 🌙 Theme Support

**Light Mode:**
- Clean white backgrounds
- Navy accents and blue gradients
- Subtle gray borders and shadows

**Dark Mode:**
- Navy backgrounds with depth
- Consistent blue accent colors
- Enhanced readability with proper contrast

**Theme Toggle:**
- Smooth transitions between modes
- Persistent user preference
- System theme detection

## 📱 Responsive Design

**Desktop (1200px+):**
- Three-column layout (Sidebar + Content + Chat)
- Full feature visibility
- Optimal spacing and typography

**Tablet (768px - 1199px):**
- Collapsible sidebar
- Adjusted chat panel width
- Responsive grid layouts

**Mobile (< 768px):**
- Stacked layout with navigation drawer
- Full-width content area
- Touch-optimized interactions

## 🔧 Configuration

**Tailwind Config:**
- Custom navy color palette
- Poppins font family
- Extended spacing and shadows
- Dark mode class strategy

**TypeScript:**
- Strict type checking
- Path aliases (@/ for src)
- Component prop interfaces
- API response types

## 📚 Documentation

| Document | Description | Updated |
|----------|-------------|---------|
| [🧩 COMPONENTS.md](docs/COMPONENTS.md) | Horizon UI component guide | ✅ Latest |
| [🔌 API_ROUTES.md](docs/API_ROUTES.md) | Dashboard API specifications | ✅ Latest |
| [🎯 PRD](PRD) | Product requirements | ✅ Current |

## 🚀 Deployment

**Vercel (Recommended):**
```bash
# Deploy to Vercel
npm install -g vercel
vercel --prod
```

**Build Process:**
```bash
# Create production build
npm run build

# Start production server
npm start
```

## 🎯 AI Integration Ready

The dashboard is prepared for AI integration with:
- **Chat Interface**: Ready for OpenAI API integration
- **Context Awareness**: Component state accessible to AI
- **Action Triggers**: UI prepared for AI-driven actions
- **Real-time Updates**: WebSocket-ready architecture

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Follow** Horizon UI design principles
4. **Test** responsive behavior and dark mode
5. **Commit** with conventional commits (`feat:`, `fix:`, `docs:`)
6. **Push** and create a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Horizon UI** - Professional dashboard design system
- **Shadcn UI** - Excellent headless components
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icon system
- **Next.js Team** - Amazing React framework

---

**Experience professional dashboard design** 🎨 **with conversational AI** 🤖

[📊 View Dashboard](http://localhost:3000/dashboard) • [📚 Read Docs](docs/) • [🎨 Design System](docs/COMPONENTS.md)