import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  FolderOpen, 
  CheckSquare, 
  Users, 
  TrendingUp, 
  Calendar,
  Clock,
  DollarSign,
  Activity
} from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="!bg-white shadow-sm shadow-gray-100 dark:!bg-navy-800 dark:shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Active Projects
            </CardTitle>
            <FolderOpen className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy-700 dark:text-white">12</div>
            <p className="text-xs text-green-500">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card className="!bg-white shadow-sm shadow-gray-100 dark:!bg-navy-800 dark:shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Tasks Due Today
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy-700 dark:text-white">8</div>
            <p className="text-xs text-orange-500">
              3 overdue
            </p>
          </CardContent>
        </Card>

        <Card className="!bg-white shadow-sm shadow-gray-100 dark:!bg-navy-800 dark:shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Active Clients
            </CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy-700 dark:text-white">24</div>
            <p className="text-xs text-green-500">
              +1 this week
            </p>
          </CardContent>
        </Card>

        <Card className="!bg-white shadow-sm shadow-gray-100 dark:!bg-navy-800 dark:shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Monthly Revenue
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy-700 dark:text-white">$45,230</div>
            <p className="text-xs text-green-500">
              +12% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Recent Projects */}
        <Card className="!bg-white shadow-sm shadow-gray-100 dark:!bg-navy-800 dark:shadow-none">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-navy-700 dark:text-white">
              Recent Projects
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Your latest design studio projects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Luxury Apartment Renovation", client: "Sarah Johnson", stage: "Design Development", progress: 65 },
              { name: "Modern Office Space", client: "Tech Corp", stage: "Concept Development", progress: 30 },
              { name: "Boutique Hotel Lobby", client: "Hotel Group", stage: "Production Information", progress: 85 },
            ].map((project, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-navy-900">
                <div className="flex-1">
                  <h4 className="font-medium text-navy-700 dark:text-white">{project.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{project.client} • {project.stage}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2 dark:bg-navy-700">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{project.progress}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="!bg-white shadow-sm shadow-gray-100 dark:!bg-navy-800 dark:shadow-none">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-navy-700 dark:text-white">
              Upcoming Tasks
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Tasks requiring your attention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { task: "Review bathroom tile selections", project: "Luxury Apartment", priority: "High", due: "Today" },
              { task: "Client presentation preparation", project: "Modern Office", priority: "Medium", due: "Tomorrow" },
              { task: "Furniture procurement quotes", project: "Boutique Hotel", priority: "Low", due: "Friday" },
              { task: "Site visit and measurements", project: "Residential Villa", priority: "High", due: "Monday" },
            ].map((task, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-navy-900">
                <div className="flex-1">
                  <h4 className="font-medium text-navy-700 dark:text-white">{task.task}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{task.project}</p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    task.priority === 'High' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                    task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {task.priority}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{task.due}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="!bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">
            Quick Actions
          </CardTitle>
          <CardDescription className="text-blue-100">
            Get started with common tasks using AI assistance
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer">
            <FolderOpen className="h-6 w-6 mb-2" />
            <h4 className="font-medium">Create New Project</h4>
            <p className="text-sm text-blue-100">Start a new design project with AI guidance</p>
          </div>
          <div className="p-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer">
            <CheckSquare className="h-6 w-6 mb-2" />
            <h4 className="font-medium">Add Tasks</h4>
            <p className="text-sm text-blue-100">Break down project phases into actionable tasks</p>
          </div>
          <div className="p-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer">
            <Calendar className="h-6 w-6 mb-2" />
            <h4 className="font-medium">Schedule Meeting</h4>
            <p className="text-sm text-blue-100">Book client meetings and site visits</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}