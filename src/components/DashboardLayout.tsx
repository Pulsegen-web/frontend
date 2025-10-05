import { AppSidebar } from "@/components/app-sidebar"
import { BottomNav } from "@/components/ui/bottom-nav"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { MobileMenu } from "@/components/ui/mobile-menu"

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  breadcrumbs?: Array<{
    label: string
    href?: string
  }>
}

export function DashboardLayout({ children, breadcrumbs = [] }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 sm:h-16 shrink-0 items-center gap-2 border-b px-3 sm:px-4">
          <div className="flex items-center gap-2">
            <MobileMenu currentPath={typeof window !== 'undefined' ? window.location.pathname : undefined} />
            <div className="hidden sm:block">
              <SidebarTrigger className="-ml-1" />
            </div>
          </div>
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden sm:block">
                <BreadcrumbLink href="/dashboard" className="text-sm">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center">
                  <BreadcrumbSeparator className="hidden sm:block" />
                  <BreadcrumbItem>
                    {crumb.href ? (
                      <BreadcrumbLink href={crumb.href} className="text-sm">
                        {crumb.label}
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage className="text-sm font-medium">
                        {crumb.label}
                      </BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 sm:gap-6 p-3 sm:p-6 pb-20 md:pb-6">
          {children}
        </div>
      </SidebarInset>
      <BottomNav />
    </SidebarProvider>
  )
}