import { Button } from "@/components/ui/button";
import { Grid3X3, List } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutSwitcherProps {
  layout: 'grid' | 'list';
  onLayoutChange: (layout: 'grid' | 'list') => void;
  className?: string;
}

export function LayoutSwitcher({ layout, onLayoutChange, className }: LayoutSwitcherProps) {
  return (
    <div className={cn(
      "flex items-center rounded-lg bg-muted p-1 shadow-sm",
      className
    )}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onLayoutChange('list')}
        className={cn(
          "h-8 px-3 relative transition-all duration-200",
          layout === 'list' 
            ? "bg-background text-foreground shadow-sm border border-border font-medium" 
            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
        )}
      >
        <List className={cn(
          "h-4 w-4 transition-colors",
          layout === 'list' ? "text-primary" : ""
        )} />
        <span className="hidden sm:ml-2 sm:inline text-xs font-medium">List</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onLayoutChange('grid')}
        className={cn(
          "h-8 px-3 relative transition-all duration-200",
          layout === 'grid' 
            ? "bg-background text-foreground shadow-sm border border-border font-medium" 
            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
        )}
      >
        <Grid3X3 className={cn(
          "h-4 w-4 transition-colors",
          layout === 'grid' ? "text-primary" : ""
        )} />
        <span className="hidden sm:ml-2 sm:inline text-xs font-medium">Grid</span>
      </Button>
    </div>
  );
}