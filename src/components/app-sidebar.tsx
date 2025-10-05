import * as React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { 
  LayoutDashboard, 
  Video, 
  Upload, 
  BarChart3, 
  Settings, 
  Users, 
  Zap,
  LogOut,
  User
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/AuthContext"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, organization, isLoading, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getNavData = () => ({
    navMain: [
      {
        title: "Overview",
        items: [
          {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboard,
            isActive: location.pathname === "/dashboard",
          },
          {
            title: "Analytics",
            url: "/dashboard/analytics",
            icon: BarChart3,
            isActive: location.pathname === "/dashboard/analytics",
          },
        ],
      },
      {
        title: "Content Management",
        items: [
          {
            title: "Videos",
            url: "/dashboard/videos",
            icon: Video,
            isActive: location.pathname === "/dashboard/videos",
          },
          {
            title: "Upload",
            url: "/dashboard/upload",
            icon: Upload,
            isActive: location.pathname === "/dashboard/upload",
          },
        ],
      },
      {
        title: "Administration",
        items: [
          {
            title: "Users",
            url: "/dashboard/users",
            icon: Users,
            isActive: location.pathname === "/dashboard/users",
          },
          {
            title: "Settings",
            url: "/dashboard/settings",
            icon: Settings,
            isActive: location.pathname === "/dashboard/settings",
          },
        ],
      },
    ],
  })

  return (
    <Sidebar {...props}>
      <SidebarHeader className="p-3 sm:p-4">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 text-white flex aspect-square size-7 sm:size-8 items-center justify-center rounded-lg">
            <Zap className="size-3 sm:size-4" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-base sm:text-lg text-sidebar-foreground">
              Pulse<span className="text-blue-600">Gen</span>
            </span>
            <span className="text-xs text-muted-foreground">Video Platform</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {}
        {getNavData().navMain.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground group-data-[collapsible=icon]:hidden">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={item.isActive} className="h-9 sm:h-10">
                        <a href={item.url} className="flex items-center space-x-2">
                          <Icon className="size-4 flex-shrink-0" />
                          <span className="text-sm group-data-[collapsible=icon]:hidden">
                            {item.title}
                          </span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="p-3 sm:p-4">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 transition-colors"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.profileImage} alt={user.username} />
                  <AvatarFallback className="rounded-lg bg-blue-600 text-white">
                    {user.firstName?.[0]?.toUpperCase() || 'U'}{user.lastName?.[0]?.toUpperCase() || 'S'}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.firstName} {user.lastName}</span>
                  <span className="truncate text-xs text-muted-foreground">@{user.username}</span>
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side="bottom"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.profileImage} alt={user?.username} />
                  <AvatarFallback className="rounded-lg">
                    {user?.firstName?.[0]?.toUpperCase() || 'U'}{user?.lastName?.[0]?.toUpperCase() || 'S'}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.firstName} {user?.lastName}</span>
                  <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                  {organization && (
                    <span className="truncate text-xs text-muted-foreground/70">{organization.name}</span>
                  )}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/dashboard/profile')}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        ) : isLoading ? (
          <div className="px-2 py-1 text-center text-sm text-muted-foreground">
            <div className="animate-pulse flex items-center justify-center gap-2">
              <div className="h-2 w-2 bg-current rounded-full animate-bounce"></div>
              <span className="text-xs">Loading user...</span>
            </div>
          </div>
        ) : (
          <div className="px-2 py-1 text-center text-sm text-muted-foreground">
            <div className="text-xs">Guest User</div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
