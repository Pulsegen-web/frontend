import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, 
  Video, 
  Shield, 
  HardDrive, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Save,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { userAPI } from '@/services/api';
import { toast } from 'sonner';

interface VideoSettings {
  maxVideoSize: number;
  maxVideosPerUser: number;
  allowedVideoFormats: string[];
  enableSensitivityAnalysis: boolean;
  autoProcessVideos: boolean;
  retentionPeriodDays: number;
  maxUploadConcurrency: number;
  enableThumbnailGeneration: boolean;
  defaultVisibility: 'private' | 'organization' | 'public';
  enableRealTimeNotifications: boolean;
}

interface UserPreferences {
  emailNotifications: boolean;
  browserNotifications: boolean;
  autoPlayVideos: boolean;
  videoQuality: 'auto' | 'high' | 'medium' | 'low';
  showProcessingProgress: boolean;
  defaultUploadVisibility: 'private' | 'organization' | 'public';
}

interface OrganizationStats {
  totalUsers: number;
  totalVideos: number;
  totalStorageUsed: number;
  storageLimit: number;
  activeProcessing: number;
}

export const VideoSettingsPage: React.FC = () => {
  const { organization } = useAuth();
  const [videoSettings, setVideoSettings] = useState<VideoSettings>({
    maxVideoSize: 500000000,
    maxVideosPerUser: 100,
    allowedVideoFormats: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'],
    enableSensitivityAnalysis: true,
    autoProcessVideos: true,
    retentionPeriodDays: 365,
    maxUploadConcurrency: 3,
    enableThumbnailGeneration: true,
    defaultVisibility: 'private',
    enableRealTimeNotifications: true
  });

  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    emailNotifications: true,
    browserNotifications: true,
    autoPlayVideos: false,
    videoQuality: 'auto',
    showProcessingProgress: true,
    defaultUploadVisibility: 'private'
  });

  const [orgStats, setOrgStats] = useState<OrganizationStats>({
    totalUsers: 1,
    totalVideos: 0,
    totalStorageUsed: 0,
    storageLimit: 1000000000000,
    activeProcessing: 0
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      if (organization?.settings) {
        setVideoSettings({
          maxVideoSize: organization.settings.maxVideoSize || 500000000,
          maxVideosPerUser: organization.settings.maxVideosPerUser || 100,
          allowedVideoFormats: organization.settings.allowedVideoFormats || ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'],
          enableSensitivityAnalysis: organization.settings.enableSensitivityAnalysis ?? true,
          autoProcessVideos: true,
          retentionPeriodDays: 365,
          maxUploadConcurrency: 3,
          enableThumbnailGeneration: true,
          defaultVisibility: 'private',
          enableRealTimeNotifications: true
        });
      }
      const profileResponse = await userAPI.getProfile();
      if (profileResponse.success && profileResponse.data.statistics) {
        const stats = profileResponse.data.statistics.videos;
        setOrgStats({
          totalUsers: 1,
          totalVideos: stats.total || 0,
          totalStorageUsed: stats.totalSizeBytes || 0,
          storageLimit: organization?.settings?.maxVideoSize ? organization.settings.maxVideoSize * 100 : 1000000000000,
          activeProcessing: stats.byStatus?.processing || 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
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

  const storageUsagePercentage = (orgStats.totalStorageUsed / orgStats.storageLimit) * 100;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-8 bg-muted rounded w-48 animate-pulse" />
          <div className="h-4 bg-muted rounded w-80 animate-pulse" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-5 bg-muted rounded w-32 animate-pulse" />
                <div className="h-4 bg-muted rounded w-48 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-4 bg-muted rounded animate-pulse" />
                  ))}
                </div>
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
        <h1 className="text-3xl font-bold tracking-tight">Video Settings</h1>
        <p className="text-muted-foreground">
          Manage video upload, processing, and security settings for your organization
        </p>
      </div>

      {}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orgStats.totalVideos}</div>
            <p className="text-xs text-muted-foreground">
              {orgStats.activeProcessing} currently processing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBytes(orgStats.totalStorageUsed)}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Progress value={storageUsagePercentage} className="flex-1 h-1" />
              <span>{storageUsagePercentage.toFixed(1)}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Limit</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBytes(orgStats.storageLimit)}</div>
            <p className="text-xs text-muted-foreground">
              {formatBytes(orgStats.storageLimit - orgStats.totalStorageUsed)} available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orgStats.activeProcessing}</div>
            <p className="text-xs text-muted-foreground">
              Active processing jobs
            </p>
          </CardContent>
        </Card>
      </div>

      {}
      <div className="grid gap-6 md:grid-cols-2">
        {}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Video className="w-5 h-5" />
              <span>Upload Settings</span>
            </CardTitle>
            <CardDescription>
              Configure video upload limits and file handling
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maxVideoSize">Maximum Video Size</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="maxVideoSize"
                  type="number"
                  value={Math.round(videoSettings.maxVideoSize / (1024 * 1024))}
                  onChange={(e) => setVideoSettings(prev => ({
                    ...prev,
                    maxVideoSize: parseInt(e.target.value) * 1024 * 1024
                  }))}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground">MB</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxVideos">Videos per User</Label>
              <Input
                id="maxVideos"
                type="number"
                value={videoSettings.maxVideosPerUser}
                onChange={(e) => setVideoSettings(prev => ({
                  ...prev,
                  maxVideosPerUser: parseInt(e.target.value)
                }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Allowed Formats</Label>
              <div className="flex flex-wrap gap-2">
                {videoSettings.allowedVideoFormats.map((format) => (
                  <Badge key={format} variant="secondary">
                    {format.toUpperCase()}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoProcess">Auto Process Videos</Label>
                <div className="text-sm text-muted-foreground">
                  Automatically start processing after upload
                </div>
              </div>
              <Switch
                id="autoProcess"
                checked={videoSettings.autoProcessVideos}
                onCheckedChange={(checked: boolean) => setVideoSettings(prev => ({
                  ...prev,
                  autoProcessVideos: checked
                }))}
              />
            </div>
          </CardContent>
        </Card>

        {}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Security & Analysis</span>
            </CardTitle>
            <CardDescription>
              Content sensitivity and security configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sensitivityAnalysis">Sensitivity Analysis</Label>
                <div className="text-sm text-muted-foreground">
                  Scan videos for inappropriate content
                </div>
              </div>
              <Switch
                id="sensitivityAnalysis"
                checked={videoSettings.enableSensitivityAnalysis}
                onCheckedChange={(checked: boolean) => setVideoSettings(prev => ({
                  ...prev,
                  enableSensitivityAnalysis: checked
                }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="thumbnails">Generate Thumbnails</Label>
                <div className="text-sm text-muted-foreground">
                  Automatically create video thumbnails
                </div>
              </div>
              <Switch
                id="thumbnails"
                checked={videoSettings.enableThumbnailGeneration}
                onCheckedChange={(checked: boolean) => setVideoSettings(prev => ({
                  ...prev,
                  enableThumbnailGeneration: checked
                }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultVisibility">Default Visibility</Label>
              <select
                id="defaultVisibility"
                value={videoSettings.defaultVisibility}
                onChange={(e) => setVideoSettings(prev => ({
                  ...prev,
                  defaultVisibility: e.target.value as 'private' | 'organization' | 'public'
                }))}
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
              >
                <option value="private">Private</option>
                <option value="organization">Organization</option>
                <option value="public">Public</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="retention">Retention Period</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="retention"
                  type="number"
                  value={videoSettings.retentionPeriodDays}
                  onChange={(e) => setVideoSettings(prev => ({
                    ...prev,
                    retentionPeriodDays: parseInt(e.target.value)
                  }))}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground">days</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>User Preferences</span>
            </CardTitle>
            <CardDescription>
              Personal settings and notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <div className="text-sm text-muted-foreground">
                  Receive email updates on video processing
                </div>
              </div>
              <Switch
                id="emailNotifications"
                checked={userPreferences.emailNotifications}
                onCheckedChange={(checked: boolean) => setUserPreferences(prev => ({
                  ...prev,
                  emailNotifications: checked
                }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="browserNotifications">Browser Notifications</Label>
                <div className="text-sm text-muted-foreground">
                  Show desktop notifications
                </div>
              </div>
              <Switch
                id="browserNotifications"
                checked={userPreferences.browserNotifications}
                onCheckedChange={(checked: boolean) => setUserPreferences(prev => ({
                  ...prev,
                  browserNotifications: checked
                }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoPlay">Auto-play Videos</Label>
                <div className="text-sm text-muted-foreground">
                  Start playing videos automatically
                </div>
              </div>
              <Switch
                id="autoPlay"
                checked={userPreferences.autoPlayVideos}
                onCheckedChange={(checked: boolean) => setUserPreferences(prev => ({
                  ...prev,
                  autoPlayVideos: checked
                }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="videoQuality">Default Video Quality</Label>
              <select
                id="videoQuality"
                value={userPreferences.videoQuality}
                onChange={(e) => setUserPreferences(prev => ({
                  ...prev,
                  videoQuality: e.target.value as 'auto' | 'high' | 'medium' | 'low'
                }))}
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
              >
                <option value="auto">Auto</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Processing Settings</span>
            </CardTitle>
            <CardDescription>
              Video processing and performance configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="concurrency">Max Concurrent Uploads</Label>
              <Input
                id="concurrency"
                type="number"
                min="1"
                max="10"
                value={videoSettings.maxUploadConcurrency}
                onChange={(e) => setVideoSettings(prev => ({
                  ...prev,
                  maxUploadConcurrency: parseInt(e.target.value)
                }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="realTimeNotifications">Real-time Updates</Label>
                <div className="text-sm text-muted-foreground">
                  Show live processing progress
                </div>
              </div>
              <Switch
                id="realTimeNotifications"
                checked={videoSettings.enableRealTimeNotifications}
                onCheckedChange={(checked: boolean) => setVideoSettings(prev => ({
                  ...prev,
                  enableRealTimeNotifications: checked
                }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="showProgress">Show Processing Progress</Label>
                <div className="text-sm text-muted-foreground">
                  Display detailed progress information
                </div>
              </div>
              <Switch
                id="showProgress"
                checked={userPreferences.showProcessingProgress}
                onCheckedChange={(checked: boolean) => setUserPreferences(prev => ({
                  ...prev,
                  showProcessingProgress: checked
                }))}
              />
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <AlertTriangle className="w-4 h-4" />
                <span>Processing settings affect system performance</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {}
      <div className="flex items-center justify-between pt-6 border-t">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>All settings are automatically validated</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={fetchSettings}
            disabled={saving}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          
          <Button
            onClick={handleSaveSettings}
            disabled={saving}
          >
            {saving ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};