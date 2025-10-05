import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  onClick?: () => void;
  href?: string;
  className?: string;
  children?: React.ReactNode;
}

export function FloatingActionButton({ 
  onClick, 
  href, 
  className, 
  children = <Plus className="h-6 w-6" />
}: FloatingActionButtonProps) {
  const baseClasses = cn(
    "fixed bottom-20 right-4 z-40 h-14 w-14 rounded-full shadow-lg",
    "md:hidden",
    "bg-primary text-primary-foreground hover:bg-primary/90",
    "transition-all duration-200 ease-in-out",
    "active:scale-95",
    className
  );

  if (href) {
    return (
      <Button asChild className={baseClasses} size="icon">
        <a href={href}>
          {children}
        </a>
      </Button>
    );
  }

  return (
    <Button 
      onClick={onClick} 
      className={baseClasses}
      size="icon"
    >
      {children}
    </Button>
  );
}