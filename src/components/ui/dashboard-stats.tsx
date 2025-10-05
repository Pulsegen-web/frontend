import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Video, 
  Eye, 
  Upload, 
  TrendingUp,
  Clock,
  HardDrive,
  Activity
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  className 
}: StatCardProps) {
  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 sm:p-6 pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground truncate flex-1 mr-2">
          {title}
        </CardTitle>
        <div className="flex-shrink-0 text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="space-y-1 sm:space-y-2">
          <div className="text-xl sm:text-2xl font-bold">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          
          <div className="flex items-center justify-between">
            {description && (
              <p className="text-xs text-muted-foreground truncate flex-1">
                {description}
              </p>
            )}
            
            {trend && (
              <div className={cn(
                "flex items-center text-xs font-medium ml-2 flex-shrink-0",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}>
                <TrendingUp className={cn(
                  "h-3 w-3 mr-1",
                  !trend.isPositive && "rotate-180"
                )} />
                {Math.abs(trend.value)}%
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface DashboardStatsProps {
  stats: {
    totalVideos: number;
    totalViews: number;
    uploadsThisMonth: number;
    storageUsed: string;
    processingTime: string;
    activeUsers?: number;
  };
  className?: string;
}

export function DashboardStats({ stats, className }: DashboardStatsProps) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6", className)}>
      <StatCard
        title="Total Videos"
        value={stats.totalVideos}
        description="All uploaded videos"
        icon={<Video className="h-4 w-4" />}
        trend={{ value: 12, isPositive: true }}
        className="sm:col-span-1"
      />
      
      <StatCard
        title="Total Views"
        value={stats.totalViews}
        description="Across all videos"
        icon={<Eye className="h-4 w-4" />}
        trend={{ value: 8, isPositive: true }}
        className="sm:col-span-1"
      />
      
      <StatCard
        title="This Month"
        value={stats.uploadsThisMonth}
        description="New uploads"
        icon={<Upload className="h-4 w-4" />}
        trend={{ value: 5, isPositive: true }}
        className="sm:col-span-1 xl:col-span-1"
      />
      
      <StatCard
        title="Storage Used"
        value={stats.storageUsed}
        description="Of available space"
        icon={<HardDrive className="h-4 w-4" />}
        className="sm:col-span-1 xl:col-span-1"
      />
      
      <StatCard
        title="Avg Processing"
        value={stats.processingTime}
        description="Time per video"
        icon={<Clock className="h-4 w-4" />}
        trend={{ value: 15, isPositive: false }}
        className="sm:col-span-1 xl:col-span-1"
      />
      
      {stats.activeUsers && (
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          description="Last 24 hours"
          icon={<Activity className="h-4 w-4" />}
          trend={{ value: 3, isPositive: true }}
          className="sm:col-span-1 xl:col-span-1"
        />
      )}
    </div>
  );
}