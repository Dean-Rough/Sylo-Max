"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Bell,
  Search,
  Plus,
  Menu,
  MessageSquare,
  Settings,
  User,
  Moon,
  Sun,
} from "lucide-react"
import { useTheme } from "next-themes"

export function DashboardHeader() {
  const { theme, setTheme } = useTheme()
  const [notifications] = useState(3) // Mock notification count

  return (
    <header className="border-b border-gray-200 bg-white dark:border-navy-700 dark:bg-navy-800">
      <div className="flex h-16 w-full items-center justify-between px-6">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <Badge variant="secondary" className="ml-2">
              Free Plan
            </Badge>
          </div>
        </div>

        {/* Center - Search */}
        <div className="hidden max-w-lg flex-1 flex-col md:flex md:flex-row">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects, clients, tasks..."
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Quick Actions */}
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>

          {/* Chat Toggle */}
          <Button variant="ghost" size="sm" className="relative lg:hidden">
            <MessageSquare className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full p-0 text-xs"
              >
                {notifications}
              </Badge>
            )}
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 dark:border-navy-700 dark:bg-navy-800 dark:text-white"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="sm">
            <Settings className="h-5 w-5" />
          </Button>

          {/* User Menu */}
          <Button variant="ghost" size="sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
              <User className="h-4 w-4 text-white" />
            </div>
          </Button>
        </div>
      </div>
    </header>
  )
}