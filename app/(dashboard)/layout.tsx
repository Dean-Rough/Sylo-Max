import { ChatInterface } from "@/components/chat/chat-interface"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <SidebarNav />
        </div>

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader />
          
          <main className="flex-1 overflow-y-auto">
            <div className="flex h-full">
              {/* Main Dashboard Content */}
              <div className="flex-1 p-6">
                {children}
              </div>
              
              {/* Chat Interface Sidebar */}
              <div className="hidden lg:flex lg:w-96 lg:flex-col border-l border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800">
                <div className="p-4 h-full">
                  <ChatInterface className="h-full" />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}