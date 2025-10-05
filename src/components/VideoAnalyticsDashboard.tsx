import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Video, 
  Eye, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  HardDrive,
  TrendingUp,
  FileVideo
} from 'lucide-react';
import { videoAPI, userAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

interface VideoAnalytics {
  totalVideos: number;
  totalViews: number;
  totalStorageUsed: number;
  processingVideos: number;
  completedVideos: number;
  flaggedVideos: number;
  safeVideos: number;
  averageProcessingTime: number;
  uploadTrend: {
    thisWeek: number;
    lastWeek: number;
  };
  viewsTrend: {
    thisWeek: number;
    lastWeek: number;
  };
}

interface RecentActivity {
  id: string;
  type: 'upload' | 'processing' | 'completed' | 'flagged';
  title: string;
  timestamp: string;
  status?: string;
}

export const VideoAnalyticsDashboard: React.FC = () => {
  const { organization } = useAuth();
  const [analytics, setAnalytics] = useState<VideoAnalytics>({
    totalVideos: 0,
    totalViews: 0,
    totalStorageUsed: 0,
    processingVideos: 0,
    completedVideos: 0,
    flaggedVideos: 0,
    safeVideos: 0,
    averageProcessingTime: 0,
    uploadTrend: { thisWeek: 0, lastWeek: 0 },
    viewsTrend: { thisWeek: 0, lastWeek: 0 }
  });
  
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      const profileResponse = await userAPI.getProfile();
      if (profileResponse.success && profileResponse.data.statistics) {
        const stats = profileResponse.data.statistics.videos;
        
        setAnalytics({
          totalVideos: stats.total || 0,
          totalViews: stats.totalViews || 0,
          totalStorageUsed: stats.totalSizeBytes || 0,
          processingVideos: stats.byStatus?.processing || 0,
          completedVideos: stats.byStatus?.completed || 0,
          flaggedVideos: stats.bySensitivity?.flagged || 0,
          safeVideos: stats.bySensitivity?.safe || 0,
          averageProcessingTime: 0,
          uploadTrend: { thisWeek: stats.total || 0, lastWeek: 0 },
          viewsTrend: { thisWeek: stats.totalViews || 0, lastWeek: 0 }
        });
      }
      const videosResponse = await videoAPI.getVideos({ limit: 10 });
      if (videosResponse.success) {
        const activities: RecentActivity[] = videosResponse.data.videos.map(video => ({
          id: video._id,
          type: video.status === 'completed' ? 'completed' : 
                video.status === 'processing' ? 'processing' : 'upload',
          title: video.title,
          timestamp: video.createdAt,
          status: video.status
        }));
        
        setRecentActivity(activities);
      }
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'upload':
        return <Video className="w-4 h-4 text-blue-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'flagged':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <FileVideo className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendPercentage = (current: number, previous: number): { percentage: number; isIncrease: boolean } => {
    if (previous === 0) return { percentage: 0, isIncrease: true };
    const percentage = ((current - previous) / previous) * 100;
    return { percentage: Math.abs(percentage), isIncrease: percentage >= 0 };
  };

  const uploadTrend = getTrendPercentage(analytics.uploadTrend.thisWeek, analytics.uploadTrend.lastWeek);
  const viewsTrend = getTrendPercentage(analytics.viewsTrend.thisWeek, analytics.viewsTrend.lastWeek);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-20 animate-pulse" />
                <div className="h-4 w-4 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16 animate-pulse mb-2" />
                <div className="h-3 bg-muted rounded w-24 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your video performance and content insights
        </p>
      </div>

      {}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalVideos}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className={`w-3 h-3 mr-1 ${uploadTrend.isIncrease ? 'text-green-500' : 'text-red-500'}`} />
              {uploadTrend.percentage.toFixed(1)}% from last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className={`w-3 h-3 mr-1 ${viewsTrend.isIncrease ? 'text-green-500' : 'text-red-500'}`} />
              {viewsTrend.percentage.toFixed(1)}% from last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBytes(analytics.totalStorageUsed)}</div>
            <div className="text-xs text-muted-foreground">
              {organization?.settings?.maxVideoSize ? 
                `${((analytics.totalStorageUsed / organization.settings.maxVideoSize) * 100).toFixed(1)}% of limit` :
                'No limit set'
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.processingVideos}</div>
            <div className="text-xs text-muted-foreground">
              {analytics.completedVideos} completed today
            </div>
          </CardContent>
        </Card>
      </div>

      {}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Content Safety Status</CardTitle>
            <CardDescription>Video content analysis results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">Safe Content</span>
              </div>
              <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                {analytics.safeVideos}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="text-sm">Flagged Content</span>
              </div>
              <Badge variant="destructive">
                {analytics.flaggedVideos}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-yellow-500" />
                <span className="text-sm">Under Review</span>
              </div>
              <Badge variant="secondary">
                {analytics.processingVideos}
              </Badge>
            </div>

            {}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Safety Score</span>
                <span className="font-medium">
                  {analytics.totalVideos > 0 ? 
                    Math.round((analytics.safeVideos / analytics.totalVideos) * 100) : 0
                  }%
                </span>
              </div>
              <Progress 
                value={analytics.totalVideos > 0 ? (analytics.safeVideos / analytics.totalVideos) * 100 : 0} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Processing Status</CardTitle>
            <CardDescription>Current video processing pipeline</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Completed</span>
              <div className="flex items-center space-x-2">
                <Progress value={(analytics.completedVideos / analytics.totalVideos) * 100} className="w-16 h-2" />
                <span className="text-xs text-muted-foreground w-8">{analytics.completedVideos}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Processing</span>
              <div className="flex items-center space-x-2">
                <Progress value={(analytics.processingVideos / analytics.totalVideos) * 100} className="w-16 h-2" />
                <span className="text-xs text-muted-foreground w-8">{analytics.processingVideos}</span>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground pt-2">
              Average processing time: {analytics.averageProcessingTime > 0 ? `${analytics.averageProcessingTime}min` : 'N/A'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Latest video actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent activity
                </p>
              ) : (
                recentActivity.slice(0, 8).map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};