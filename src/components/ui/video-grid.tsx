import { cn } from "@/lib/utils";

interface VideoGridProps {
  children: React.ReactNode;
  className?: string;
}

export function VideoGrid({ children, className }: VideoGridProps) {
  return (
    <div 
      className={cn(
        "grid grid-cols-1 gap-3",
        "md:grid-cols-2 md:gap-4",
        "lg:grid-cols-3 lg:gap-5",
        "xl:grid-cols-4 xl:gap-6",
        className
      )}
    >
      {children}
    </div>
  );
}

interface VideoListProps {
  children: React.ReactNode;
  className?: string;
  layout?: 'grid' | 'list';
}

export function VideoList({ children, className, layout = 'list' }: VideoListProps) {
  if (layout === 'grid') {
    return <VideoGrid className={className}>{children}</VideoGrid>;
  }

  return (
    <div 
      className={cn(
        "space-y-3 sm:space-y-4",
        className
      )}
    >
      {children}
    </div>
  );
}