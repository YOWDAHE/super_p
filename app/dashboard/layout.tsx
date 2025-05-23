"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { 
  Building2, 
  ClockIcon, 
  LogOut, 
  User, 
  Settings, 
  LayoutDashboard,
  CheckCircle,
  TicketIcon
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarSeparator,
} from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration errors
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    router.push("/login")
  }

  if (!mounted) {
    return null
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50">
        <Sidebar className="border-r border-slate-200 shadow-lg bg-gradient-to-b from-white to-slate-50">
          <SidebarHeader className="flex items-center p-6">
            <div className="flex items-center justify-center w-full">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md transform transition-transform hover:scale-105">
                <TicketIcon className="h-6 w-6 -rotate-45" />
              </div>
              <div className="ml-3 flex flex-col">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  Pulcity
                </span>
                <span className="text-xs text-slate-500 font-medium">Admin Dashboard</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarSeparator className="my-2 opacity-50" />
          <SidebarContent className="px-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === "/dashboard"}
                  className="transition-all duration-200 hover:pl-6 rounded-lg"
                >
                  <a href="/dashboard" className="py-3">
                    <LayoutDashboard className="h-5 w-5" />
                    <span className="font-medium">Organizations</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/pending"}
                  className="transition-all duration-200 hover:pl-6 rounded-lg"
                >
                  <a href="/dashboard/pending" className="py-3">
                    <ClockIcon className="h-5 w-5" />
                    <span className="font-medium">Pending Verifications</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/approved"}
                  className="transition-all duration-200 hover:pl-6 rounded-lg"
                >
                  <a href="/dashboard/approved" className="py-3">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Approved Organizations</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarSeparator className="my-2 opacity-50" />
          <SidebarFooter className="mt-auto px-4 pb-6">
            <div className="mb-4">
              <div className="flex items-center p-3 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-inner">
                  <User className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-semibold text-slate-900">Admin User</p>
                  <p className="text-xs text-slate-500">Administrator</p>
                </div>
              </div>
            </div>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={handleLogout}
                  className="w-full transition-all duration-200 hover:pl-6 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 py-3"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-col w-full">
          <header className="flex h-16 items-center border-b bg-white/80 backdrop-blur-sm px-6 sticky top-0 z-10 shadow-sm">
            <SidebarTrigger className="hover:bg-slate-100 transition-colors rounded-lg" />
            <div className="ml-auto flex items-center gap-4">
              {/* <div className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-100 transition-all duration-200 cursor-pointer">
                <Settings className="h-5 w-5 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">Settings</span>
              </div> */}
            </div>
          </header>
          <main className="flex-1 p-6 bg-slate-50">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
