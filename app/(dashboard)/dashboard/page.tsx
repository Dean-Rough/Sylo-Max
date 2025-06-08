'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  Building2, 
  CheckSquare, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Plus,
  ArrowRight
} from "lucide-react"

interface DashboardStats {
  activeProjects: number
  tasksDue: number
  clientCount: number
  revenue: number
}

interface RecentProject {
  id: string
  name: string
  client: string
  progress: number
  status: string
  dueDate: string | null
  priority: 'low' | 'medium' | 'high' | 'urgent'
  type: string
}

interface TaskDue {
  id: string
  title: string
  project: string
  dueDate: string | null
  priority: string
  assignee: string
  status: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([])
  const [tasksDue, setTasksDue] = useState<{ tasks: TaskDue[], overdue: number } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, projectsRes, tasksRes] = await Promise.all([
          fetch('/api/dashboard/stats'),
          fetch('/api/dashboard/recent-projects'),
          fetch('/api/dashboard/tasks-due')
        ])

        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(statsData.data)
        }

        if (projectsRes.ok) {
          const projectsData = await projectsRes.json()
          setRecentProjects(projectsData.data)
        }

        if (tasksRes.ok) {
          const tasksData = await tasksRes.json()
          setTasksDue(tasksData.data)
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive'
      case 'high': return 'default'
      case 'medium': return 'secondary'
      case 'low': return 'outline'
      default: return 'secondary'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-green-500'
      case 'in_progress': return 'bg-blue-500'
      case 'client_review': return 'bg-purple-500'
      case 'blocked': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="!bg-white shadow-sm shadow-gray-100 dark:!bg-navy-800">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="!bg-white shadow-sm shadow-gray-100 dark:!bg-navy-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-bold">{stats?.activeProjects || 0}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="!bg-white shadow-sm shadow-gray-100 dark:!bg-navy-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tasks Due</p>
                <p className="text-2xl font-bold">{stats?.tasksDue || 0}</p>
              </div>
              <CheckSquare className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="!bg-white shadow-sm shadow-gray-100 dark:!bg-navy-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Clients</p>
                <p className="text-2xl font-bold">{stats?.clientCount || 0}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="!bg-white shadow-sm shadow-gray-100 dark:!bg-navy-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">
                  ${((stats?.revenue || 0) / 1000).toFixed(0)}k
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Recent Projects */}
        <Card className="!bg-white shadow-sm shadow-gray-100 dark:!bg-navy-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Recent Projects</CardTitle>
              <CardDescription>Your latest active projects</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-navy-900">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{project.name}</h4>
                    <Badge variant={getPriorityColor(project.priority)} className="text-xs">
                      {project.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{project.client}</p>
                  <div className="flex items-center space-x-2">
                    <Progress value={project.progress} className="flex-1 h-2" />
                    <span className="text-sm font-medium">{project.progress}%</span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground ml-4" />
              </div>
            ))}
            {recentProjects.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No projects yet. Create your first project to get started!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Tasks Due */}
        <Card className="!bg-white shadow-sm shadow-gray-100 dark:!bg-navy-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Upcoming Tasks</CardTitle>
              <CardDescription>
                Tasks due in the next 7 days
                {tasksDue && tasksDue.overdue > 0 && (
                  <span className="text-red-500 ml-2">({tasksDue.overdue} overdue)</span>
                )}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasksDue?.tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-navy-900">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(task.status)}`} />
                  <div>
                    <h4 className="font-medium text-sm">{task.title}</h4>
                    <p className="text-xs text-muted-foreground">{task.project} • {task.assignee}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={getPriorityColor(task.priority)} className="text-xs mb-1">
                    {task.priority}
                  </Badge>
                  {task.dueDate && (
                    <p className="text-xs text-muted-foreground">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {(!tasksDue?.tasks || tasksDue.tasks.length === 0) && (
              <p className="text-center text-muted-foreground py-8">
                No upcoming tasks. Great job staying on top of things!
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="!bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Ready to get started?</h3>
              <p className="text-blue-100">
                Use the AI assistant to create projects, schedule meetings, or manage your design studio workflow.
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="secondary" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
              <Button variant="outline" size="sm" className="border-white text-white hover:bg-white/10">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}