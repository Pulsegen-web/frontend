import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { VideoPlayer } from '@/components/VideoPlayer';
import { UploadVideoDialog } from '@/components/UploadVideoDialog';
import { 
  Upload, 
  Play, 
  Download, 
  Trash2, 
  Eye,
  Clock,
  FileVideo,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { videoAPI, type Video } from '@/services/api';
import { useVideoEvents } from '@/hooks/useVideoEvents';
import { toast } from 'sonner';
const formatTime = (timeInSeconds: number): string => {
  if (!timeInSeconds || isNaN(timeInSeconds)) return '0:00';
  
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

interface UploadProgress {
  [key: string]: {
    progress: number;
    status: string;
  };
}

export const VideoManagement: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});

  useEffect(() => {
    loadVideos();
  }, []);
  useVideoEvents({
    onVideoUploadComplete: (data) => {
      console.log(' VideoManagement: Video upload completed:', data);
      loadVideos();
    },
    onVideoProcessingComplete: (data) => {
      console.log(' VideoManagement: Video processing completed:', data);
      loadVideos();
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[data.videoId];
        return newProgress;
      });
    },
    onVideoProcessingProgress: (data) => {
      console.log(' VideoManagement: Video processing progress:', data);
      setUploadProgress(prev => ({
        ...prev,
        [data.videoId]: { progress: data.progress, status: data.step }
      }));
    }
  });

  const loadVideos = async () => {
    try {
      const response = await videoAPI.getVideos();
      setVideos(response.data.videos);
    } catch (error) {
      console.error('Failed to load videos:', error);
      toast.error('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUpload = (newVideo: Video) => {
    setVideos(prev => [newVideo, ...prev]);
    setUploadDialogOpen(false);
    toast.success('Video upload started');
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      await videoAPI.deleteVideo(videoId);
      setVideos(prev => prev.filter(video => video._id !== videoId));
      if (selectedVideo?._id === videoId) {
        setSelectedVideo(null);
      }
      toast.success('Video deleted successfully');
    } catch (error) {
      console.error('Failed to delete video:', error);
      toast.error('Failed to delete video');
    }
  };

  const formatFileSize = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const getStatusBadge = (video: Video) => {
    const progress = uploadProgress[video._id];
    
    if (progress) {
      return (
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            {progress.status}
          </Badge>
          <Progress value={progress.progress} className="w-20 h-2" />
          <span className="text-xs text-muted-foreground">{progress.progress}%</span>
        </div>
      );
    }

    switch (video.status) {
      case 'completed':
        return (
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1 animate-spin" />
            Processing
          </Badge>
        );
      case 'uploading':
        return (
          <Badge variant="secondary">
            <Upload className="w-3 h-3 mr-1" />
            Uploading
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <AlertCircle className="w-3 h-3 mr-1" />
            Unknown
          </Badge>
        );
    }
  };

  const getSensitivityBadge = (score?: number) => {
    if (score === undefined) return null;

    if (score < 0.3) {
      return (
        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
          Safe ({Math.round(score * 100)}%)
        </Badge>
      );
    } else if (score < 0.7) {
      return (
        <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-white">
          Moderate ({Math.round(score * 100)}%)
        </Badge>
      );
    } else {
      return (
        <Badge variant="destructive">
          Sensitive ({Math.round(score * 100)}%)
        </Badge>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading videos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Video Management</h1>
          <p className="text-muted-foreground">Upload, manage, and analyze your videos</p>
        </div>
        <Button onClick={() => setUploadDialogOpen(true)}>
          <Upload className="w-4 h-4 mr-2" />
          Upload Video
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Your Videos ({videos.length})</h2>
          
          {videos.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <div className="text-center">
                  <FileVideo className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No videos uploaded yet</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => setUploadDialogOpen(true)}
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    Upload your first video
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {videos.map((video) => (
                <Card 
                  key={video._id} 
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedVideo?._id === video._id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedVideo(video)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate mb-1">{video.originalName}</h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                          <span>{formatFileSize(video.fileSize)}</span>
                          {video.duration && (
                            <>
                              <span>•</span>
                              <span>{formatTime(video.duration)}</span>
                            </>
                          )}
                          <span>•</span>
                          <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          {getStatusBadge(video)}
                          {getSensitivityBadge(video.sensitivityAnalysis?.confidence)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 ml-2">
                        {video.status === 'completed' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedVideo(video);
                            }}
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteVideo(video._id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {}
        <div>
          <h2 className="text-lg font-semibold mb-4">Video Player</h2>
          {selectedVideo && selectedVideo.status === 'completed' ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{selectedVideo.originalName}</span>
                  <div className="flex items-center space-x-2">
                    {getSensitivityBadge(selectedVideo.sensitivityAnalysis?.confidence)}
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VideoPlayer
                  videoId={selectedVideo._id}
                  title={selectedVideo.originalName}
                  className="aspect-video"
                />
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>
                    <strong>Size:</strong> {formatFileSize(selectedVideo.fileSize)}
                  </div>
                  <div>
                    <strong>Duration:</strong> {selectedVideo.duration ? formatTime(selectedVideo.duration) : 'Unknown'}
                  </div>
                  <div>
                    <strong>Uploaded:</strong> {new Date(selectedVideo.createdAt).toLocaleString()}
                  </div>
                  <div>
                    <strong>Status:</strong> {selectedVideo.status}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : selectedVideo ? (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  {selectedVideo.status === 'processing' ? (
                    <>
                      <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2 animate-spin" />
                      <p className="text-sm text-muted-foreground">Video is being processed...</p>
                    </>
                  ) : selectedVideo.status === 'failed' ? (
                    <>
                      <XCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Video processing failed</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Video is uploading...</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Eye className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Select a video to play</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {}
      <UploadVideoDialog 
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onUpload={handleVideoUpload}
      />
    </div>
  );
};