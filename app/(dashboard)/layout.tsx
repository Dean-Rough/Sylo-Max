import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { ChatInterface } from "@/components/chat/chat-interface"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-navy-900">
      {/* Sidebar */}
      <aside className="w-[300px] min-w-[300px]">
        <SidebarNav />
      </aside>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4">
          <DashboardHeader />
        </div>
        
        {/* Content */}
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
      
      {/* Chat Interface - Always visible */}
      <aside className="w-[400px] min-w-[400px]">
        <ChatInterface />
      </aside>
    </div>
  )
}