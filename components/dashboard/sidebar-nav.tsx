"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  FolderOpen, 
  Users, 
  CheckSquare, 
  Calendar, 
  Package, 
  BarChart3,
  Settings,
  MessageSquare,
  Home,
  ChevronRight
} from "lucide-react"

const navigation = [
  {
    name: "Main Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Projects",
    href: "/dashboard/projects",
    icon: FolderOpen,
  },
  {
    name: "Tasks",
    href: "/dashboard/tasks", 
    icon: CheckSquare,
  },
  {
    name: "Clients",
    href: "/dashboard/clients",
    icon: Users,
  },
  {
    name: "Calendar",
    href: "/dashboard/calendar",
    icon: Calendar,
  },
  {
    name: "Products",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    name: "Chat History",
    href: "/dashboard/chat-history",
    icon: MessageSquare,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-full flex-col bg-white shadow-2xl shadow-gray-100 dark:!bg-navy-800 dark:shadow-none">
      {/* Logo Section - Horizon UI Style */}
      <div className="mt-[50px] flex items-center justify-center">
        <div className="ml-1 mt-1 h-2.5 font-poppins text-[26px] font-bold uppercase text-navy-700 dark:text-white">
          SYLO<span className="font-medium">-MAX</span>
        </div>
      </div>
      
      {/* Divider */}
      <div className="mt-[58px] mb-7 h-px bg-gray-300 dark:bg-white/30" />

      {/* Navigation Links - Horizon UI Style */}
      <ul className="mb-auto pt-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <li key={item.name} className="relative mb-3">
              <Link
                href={item.href}
                className={cn(
                  "relative flex hover:cursor-pointer items-center rounded-xl py-2 pl-4 pr-4",
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50"
                    : "text-gray-600 hover:bg-gray-50 dark:text-white dark:hover:bg-white/10"
                )}
              >
                <span className="font-bold text-inherit transition-all">
                  <item.icon className="h-4 w-4" />
                </span>
                <p className="leading-1 ml-4 flex font-medium text-inherit">
                  {item.name}
                </p>
                {isActive && (
                  <div className="absolute right-4 top-px h-9 w-1 rounded-lg bg-white" />
                )}
              </Link>
            </li>
          )
        })}
      </ul>

      {/* Profile Section - Horizon UI Style */}
      <div className="flex justify-center">
        <div className="flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 p-4">
          <div className="flex h-full w-full items-center rounded-full text-xl">
            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white font-bold text-sm">DN</span>
            </div>
            <div className="ml-3 text-white">
              <p className="text-sm font-bold">Dean Newton</p>
              <p className="text-xs opacity-80">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}