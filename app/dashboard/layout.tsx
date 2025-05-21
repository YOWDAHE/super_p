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
  CheckCircle
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
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r shadow-sm">
          <SidebarHeader className="flex items-center p-4 pb-2">
            <div className="flex items-center justify-center w-full">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-md">
                <Building2 className="h-6 w-6" />
              </div>
              <div className="ml-3 flex flex-col">
                <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Pulcity</span>
                <span className="text-xs text-muted-foreground">Admin Dashboard</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarSeparator className="my-2" />
          <SidebarContent className="px-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === "/dashboard"}
                  className="transition-all duration-200 hover:pl-5"
                >
                  <a href="/dashboard" className="py-2">
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Organizations</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/pending"}
                  className="transition-all duration-200 hover:pl-5"
                >
                  <a href="/dashboard/pending" className="py-2">
                    <ClockIcon className="h-5 w-5" />
                    <span>Pending Verifications</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/approved"}
                  className="transition-all duration-200 hover:pl-5"
                >
                  <a href="/dashboard/approved" className="py-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>Approved Organizations</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarSeparator className="my-2" />
          <SidebarFooter className="mt-auto">
            <div className="px-4 py-2 mb-2">
              <div className="flex items-center p-2 rounded-lg bg-accent/10 shadow-sm">
                <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground">
                  <User className="h-4 w-4" />
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                </div>
              </div>
            </div>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="transition-all duration-200 hover:pl-5 hover:text-destructive py-2">
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-col w-full">
          <header className="flex h-14 items-center border-b bg-white px-4 lg:h-16">
            <SidebarTrigger className="hover:bg-accent/10 transition-colors" />
            <div className="ml-auto flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">Admin</span>
              </div>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 bg-accent/5">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
