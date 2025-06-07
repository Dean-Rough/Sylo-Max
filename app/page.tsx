import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Sylo-Max
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            AI-Powered Design Studio Management
          </p>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Conversational project management for design studios. Streamline your interior design and architecture projects with AI-powered workflows.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/dashboard">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🤖 AI-Powered Chat
              </CardTitle>
              <CardDescription>
                Natural language interface for project management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create projects, assign tasks, and manage your design studio through conversational AI. 
                Just describe what you need and let AI handle the workflow.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📋 Project Management
              </CardTitle>
              <CardDescription>
                RIBA-compliant project workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Industry-standard project stages from briefing to handover. 
                Track progress with Kanban boards, Gantt charts, and milestone management.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🏠 Design-Specific Tools
              </CardTitle>
              <CardDescription>
                Built for interior design and architecture
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Product catalogues, supplier management, mood boards, and color palette tools. 
                Everything you need for design projects.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📅 Calendar Integration
              </CardTitle>
              <CardDescription>
                Seamless Google Calendar sync
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Schedule meetings, block time for projects, and sync deadlines. 
                Your design studio schedule, perfectly organized.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                💰 Business Management
              </CardTitle>
              <CardDescription>
                Xero integration for invoicing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Track budgets, manage invoices, and monitor project profitability. 
                Connected to your existing accounting workflows.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎨 AI Content Creation
              </CardTitle>
              <CardDescription>
                Generate marketing content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create social media posts, project descriptions, and marketing materials. 
                AI-powered content for your design studio.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Ready to Transform Your Design Studio?</CardTitle>
              <CardDescription>
                Join forward-thinking design studios already using AI to streamline their workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/auth/signup">Start Free Trial</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}