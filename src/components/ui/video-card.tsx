import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  Play,
  Eye,
  Calendar,
  HardDrive,
  MoreVertical,
  Download,
  Share,
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface VideoCardProps {
  video: {
    _id: string;
    title: string;
    description?: string;
    thumbnailUrl?: string;
    fileSize: number;
    viewCount: number;
    createdAt: string;
    status: string;
    sensitivityAnalysis: {
      result?: string;
    };
  };
  onPlay?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  onDownload?: () => void;
  className?: string;
  layout?: 'grid' | 'list';
}

export function VideoCard({ 
  video, 
  onPlay, 
  onDelete, 
  onShare, 
  onDownload,
  className,
  layout = 'list'
}: VideoCardProps) {
  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getThumbnailUrl = (thumbnailUrl?: string) => {
    if (!thumbnailUrl) return null;
    const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
    return `${baseUrl}${thumbnailUrl}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Completed</Badge>;
      case 'processing':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">Processing</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'uploading':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">Uploading</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSensitivityBadge = (result?: string) => {
    switch (result) {
      case 'safe':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Safe</Badge>;
      case 'flagged':
        return <Badge variant="destructive">Flagged</Badge>;
      case 'under-review':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">Under Review</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };
  const shouldUseCardLayout = layout === 'grid';

  return (
    <Card className={cn("group hover:shadow-md transition-all duration-200", className)}>
      <CardContent className="p-0">
        {}
        <div className={shouldUseCardLayout ? "block" : "block sm:hidden"}>
          {}
          <div className="relative aspect-video w-full bg-muted rounded-t-lg overflow-hidden">
            {getThumbnailUrl(video.thumbnailUrl) ? (
              <img 
                src={getThumbnailUrl(video.thumbnailUrl)!} 
                alt={video.title}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Video className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            
            {}
            {video.status === 'completed' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={onPlay}
                  className="bg-white/90 text-black hover:bg-white"
                >
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {}
          <div className="p-3 sm:p-4">
            {}
            <h4 className="font-semibold text-sm line-clamp-2 mb-2">{video.title}</h4>
            
            {}
            <div className="flex flex-col gap-1.5 text-xs text-muted-foreground mb-3">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <HardDrive className="h-3 w-3" />
                  {formatFileSize(video.fileSize)}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {video.viewCount}
                </span>
              </div>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(video.createdAt).toLocaleDateString()}
              </span>
            </div>

            {}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {getStatusBadge(video.status)}
              {getSensitivityBadge(video.sensitivityAnalysis.result)}
            </div>

            {}
            <div className="flex items-center justify-between gap-2">
              {}
              {video.status === 'completed' && (
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onPlay}
                    className="h-7 px-2 text-xs"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Play
                  </Button>
                </div>
              )}
              
              {}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 ml-auto">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  {video.status === 'completed' && (
                    <>
                      <DropdownMenuItem onClick={onPlay}>
                        <Play className="h-3 w-3 mr-2" />
                        Play
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={onShare}>
                        <Share className="h-3 w-3 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={onDownload}>
                        <Download className="h-3 w-3 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={onDelete} className="text-destructive">
                    <Trash2 className="h-3 w-3 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {}
        <div className={shouldUseCardLayout ? "hidden" : "hidden sm:flex items-center space-x-4 p-4"}>
          {}
          <div className="relative w-20 h-14 md:w-24 md:h-16 bg-muted rounded flex items-center justify-center flex-shrink-0 overflow-hidden group">
            {getThumbnailUrl(video.thumbnailUrl) ? (
              <img 
                src={getThumbnailUrl(video.thumbnailUrl)!} 
                alt={video.title}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <Video className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground" />
            )}
            
            {}
            {video.status === 'completed' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={onPlay}
                  className="h-6 w-6 p-0 bg-white/90 text-black hover:bg-white"
                >
                  <Play className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          {}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm md:text-base truncate mb-1">{video.title}</h4>
            <div className="flex items-center space-x-3 md:space-x-4 text-xs md:text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <HardDrive className="h-3 w-3" />
                <span className="hidden sm:inline">{formatFileSize(video.fileSize)}</span>
                <span className="sm:hidden">{formatFileSize(video.fileSize).replace(/\s/g, '')}</span>
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {video.viewCount}
              </span>
              <span className="hidden md:flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(video.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {}
          <div className="hidden md:flex flex-col space-y-1">
            {getStatusBadge(video.status)}
            {getSensitivityBadge(video.sensitivityAnalysis.result)}
          </div>

          {}
          <div className="flex items-center space-x-1 md:space-x-2">
            {video.status === 'completed' && (
              <Button size="sm" variant="outline" onClick={onPlay} className="hidden md:flex">
                <Play className="h-3 w-3 mr-1" />
                <span className="hidden lg:inline">Play</span>
              </Button>
            )}
            
            {}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {video.status === 'completed' && (
                    <>
                      <DropdownMenuItem onClick={onPlay}>
                        <Play className="h-4 w-4 mr-2" />
                        Play
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={onDelete} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {}
            <Button
              size="sm"
              variant="destructive"
              onClick={onDelete}
              className="hidden md:flex"
            >
              <span className="hidden lg:inline">Delete</span>
              <Trash2 className="h-3 w-3 lg:ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}