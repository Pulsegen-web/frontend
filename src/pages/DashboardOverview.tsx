import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardStats } from '@/components/ui/dashboard-stats';
import { VideoManagement } from './VideoManagement';
import { VideoAnalyticsDashboard } from '../components/VideoAnalyticsDashboard';
import { useVideoList } from '../hooks/useVideo';
import { useMemo } from 'react';

export function DashboardOverview() {
  const { videos, isLoading } = useVideoList();

  const stats = useMemo(() => {
    if (isLoading || !videos.length) {
      return {
        totalVideos: 0,
        totalViews: 0,
        uploadsThisMonth: 0,
        storageUsed: '0 GB',
        processingTime: '0s',
      };
    }

    const totalViews = videos.reduce((sum, video) => sum + video.viewCount, 0);
    const totalSize = videos.reduce((sum, video) => sum + video.fileSize, 0);
    const storageGB = (totalSize / (1024 ** 3)).toFixed(1);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const uploadsThisMonth = videos.filter(video => {
      const uploadDate = new Date(video.createdAt);
      return uploadDate.getMonth() === currentMonth && uploadDate.getFullYear() === currentYear;
    }).length;

    return {
      totalVideos: videos.length,
      totalViews,
      uploadsThisMonth,
      storageUsed: `${storageGB} GB`,
      processingTime: '2.3s',
    };
  }, [videos, isLoading]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {}
      <div className="space-y-2">
        <h2 className="text-lg sm:text-xl font-semibold">Overview</h2>
        <DashboardStats stats={stats} />
      </div>

      {}
      <Tabs defaultValue="videos" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-10 items-center bg-muted p-1 rounded-md">
          <TabsTrigger 
            value="videos"
            className="h-8 rounded-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
          >
            <span className="hidden sm:inline">Video Management</span>
            <span className="sm:hidden">Videos</span>
          </TabsTrigger>
          <TabsTrigger 
            value="analytics"
            className="h-8 rounded-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
          >
            Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="videos" className="mt-6">
          <VideoManagement />
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <VideoAnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default DashboardOverview;