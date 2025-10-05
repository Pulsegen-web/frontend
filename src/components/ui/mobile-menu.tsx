import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  Menu,
  Home,
  Video,
  Upload,
  Settings,
  User,
  BarChart3,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface MobileMenuProps {
  currentPath?: string;
}

export function MobileMenu({ currentPath }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  const menuItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <Home className="h-4 w-4" />,
    },
    {
      label: 'Videos',
      href: '/dashboard/videos',
      icon: <Video className="h-4 w-4" />,
    },
    {
      label: 'Upload',
      href: '/dashboard/upload',
      icon: <Upload className="h-4 w-4" />,
    },
    {
      label: 'Analytics',
      href: '/dashboard/analytics',
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      label: 'Settings',
      href: '/dashboard/settings',
      icon: <Settings className="h-4 w-4" />,
    },
    {
      label: 'Profile',
      href: '/dashboard/profile',
      icon: <User className="h-4 w-4" />,
    },
  ];

  const handleNavigation = (href: string) => {
    window.location.href = href;
    setOpen(false);
  };

  return (
    <div className="sm:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="p-2">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="text-left text-lg font-semibold">
              PulseGen
            </SheetTitle>
            <SheetDescription className="text-left text-sm text-muted-foreground">
              Video Content Platform
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex flex-col h-full">
            {}
            {user && (
              <div className="p-4 border-b bg-muted/20">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.username}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
              </div>
            )}
            
            {}
            <nav className="flex-1 p-2">
              <ul className="space-y-1">
                {menuItems.map((item) => (
                  <li key={item.href}>
                    <Button
                      variant={currentPath === item.href ? "secondary" : "ghost"}
                      className="w-full justify-start h-10 text-sm font-normal"
                      onClick={() => handleNavigation(item.href)}
                    >
                      {item.icon}
                      <span className="ml-3">{item.label}</span>
                    </Button>
                  </li>
                ))}
              </ul>
            </nav>
            
            {}
            <div className="p-2 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start h-10 text-sm font-normal text-destructive hover:text-destructive"
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
              >
                <LogOut className="h-4 w-4" />
                <span className="ml-3">Sign Out</span>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}