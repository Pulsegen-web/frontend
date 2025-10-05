import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface VideoCardSkeletonProps {
  className?: string;
}

export function VideoCardSkeleton({ className }: VideoCardSkeletonProps) {
  return (
    <div className={cn("p-4 border rounded-lg", className)}>
      {}
      <div className="block sm:hidden space-y-3">
        <Skeleton className="aspect-video w-full rounded" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <div className="flex gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
          <div className="flex gap-2 pt-1">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-12" />
          </div>
        </div>
      </div>
      
      {}
      <div className="hidden sm:flex items-center space-x-4">
        <Skeleton className="w-20 h-14 md:w-24 md:h-16 rounded" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-48" />
          <div className="flex items-center space-x-3">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <div className="hidden md:flex flex-col space-y-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-12" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  );
}

interface VideoGridSkeletonProps {
  count?: number;
  layout?: 'grid' | 'list';
  className?: string;
}

export function VideoGridSkeleton({ count = 6, layout = 'list', className }: VideoGridSkeletonProps) {
  if (layout === 'grid') {
    return (
      <div 
        className={cn(
          "grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4 xl:gap-6",
          className
        )}
      >
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3">
            <Skeleton className="aspect-video w-full rounded" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-3 sm:space-y-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <VideoCardSkeleton key={i} />
      ))}
    </div>
  );
}