"use client"

import { Search, Bell, Settings, User, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function DashboardHeader() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="relative flex h-[61px] w-full items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
      {/* Left side - Breadcrumb/Page title */}
      <div className="ml-[6px]">
        <div className="h-6 w-[224px] pt-1">
          <a className="text-sm font-normal text-navy-700 hover:underline dark:text-white dark:hover:text-white" href="#">
            Pages
            <span className="mx-1 text-sm text-navy-700 hover:text-navy-700 dark:text-white"> / </span>
          </a>
          <span className="text-sm font-normal text-navy-700 hover:underline dark:text-white dark:hover:text-white">
            Main Dashboard
          </span>
        </div>
        <p className="shrink text-[33px] capitalize text-navy-700 dark:text-white">
          <span className="font-medium">Main Dashboard</span>
        </p>
      </div>

      {/* Right side - Search and controls */}
      <div className="relative mt-[3px] flex h-[61px] w-[355px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-[365px] md:flex-grow-0 md:gap-1 xl:w-[365px] xl:gap-2">
        {/* Search */}
        <div className="flex h-full items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
          <p className="pl-3 pr-2 text-xl">
            <Search className="h-4 w-4 text-gray-400 dark:text-white" />
          </p>
          <input
            type="text"
            placeholder="Search..."
            className="block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
          />
        </div>

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

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon" 
          className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 dark:border-navy-700 dark:bg-navy-800 dark:text-white"
        >
          <Bell className="h-4 w-4" />
        </Button>

        {/* Profile */}
        <Button
          variant="ghost"
          size="icon"
          className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 dark:border-navy-700 dark:bg-navy-800 dark:text-white"
        >
          <User className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}