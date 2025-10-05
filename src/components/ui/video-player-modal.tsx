import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VideoPlayer } from "@/components/VideoPlayer";
import { X, Download, Share, Calendar, Eye, HardDrive } from "lucide-react";

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: {
    _id: string;
    title: string;
    description?: string;
    thumbnailUrl?: string;
    fileUrl?: string;
    fileSize: number;
    viewCount: number;
    createdAt: string;
    status: string;
    sensitivityAnalysis: {
      result?: string;
    };
  } | null;
}

export function VideoPlayerModal({ isOpen, onClose, video }: VideoPlayerModalProps) {
  if (!video) return null;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSensitivityColor = (result?: string) => {
    switch (result) {
      case 'safe': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'sensitive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownload = () => {
    if (video.fileUrl) {
      const link = document.createElement('a');
      link.href = video.fileUrl;
      link.download = video.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/video/${video._id}`;
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: video.description || 'Check out this video',
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      console.log('Link copied to clipboard');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-4 pb-2 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold pr-8">{video.title}</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {}
          <div className="flex-1 bg-black flex items-center justify-center">
            <VideoPlayer
              videoId={video._id}
              title={video.title}
              poster={video.thumbnailUrl}
              className="w-full h-full max-h-[60vh] lg:max-h-none"
            />
          </div>
          
          {}
          <div className="w-full lg:w-80 border-l bg-background flex flex-col">
            <div className="p-4 space-y-4 flex-1 overflow-y-auto">
              {}
              <div className="flex gap-2 flex-wrap">
                <Badge className={getStatusColor(video.status)}>
                  {video.status}
                </Badge>
                {video.sensitivityAnalysis?.result && (
                  <Badge className={getSensitivityColor(video.sensitivityAnalysis.result)}>
                    {video.sensitivityAnalysis.result}
                  </Badge>
                )}
              </div>
              
              {}
              {video.description && (
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{video.description}</p>
                </div>
              )}
              
              {}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span>{video.viewCount.toLocaleString()} views</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(video.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <HardDrive className="h-4 w-4" />
                  <span>{formatFileSize(video.fileSize)}</span>
                </div>
              </div>
            </div>
            
            {}
            <div className="p-4 border-t space-y-2">
              <Button 
                onClick={handleShare} 
                variant="outline" 
                className="w-full"
              >
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              
              <Button 
                onClick={handleDownload} 
                variant="outline" 
                className="w-full"
                disabled={!video.fileUrl}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}