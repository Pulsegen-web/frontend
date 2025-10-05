import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  X,
  Loader2,
  FileVideo,
  Cloud
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  selectedFile?: File | null;
  onRemoveFile?: () => void;
  isDragOver?: boolean;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  isUploading?: boolean;
  uploadProgress?: number;
  className?: string;
}

export function UploadZone({
  onFileSelect,
  selectedFile,
  onRemoveFile,
  isDragOver = false,
  onDragOver,
  onDragLeave,
  onDrop,
  isUploading = false,
  uploadProgress = 0,
  className
}: UploadZoneProps) {
  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Card className={className}>
      <CardContent className="p-3 sm:p-6">
        {!selectedFile ? (
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-4 sm:p-8 text-center transition-colors cursor-pointer",
              isDragOver 
                ? "border-primary bg-primary/5" 
                : "border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5"
            )}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <div className="flex flex-col items-center space-y-3 sm:space-y-4">
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10">
                <Cloud className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              
              <div className="space-y-1 sm:space-y-2">
                <h4 className="text-sm sm:text-base font-medium">
                  <span className="hidden sm:inline">Drop your video here, or </span>
                  <span className="text-primary">browse</span>
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  <span className="block sm:hidden">Tap to select video</span>
                  <span className="hidden sm:block">Supports MP4, AVI, MOV, FLV, WebM up to 1GB</span>
                </p>
              </div>

              <Badge variant="secondary" className="text-xs">
                Max 1GB
              </Badge>
            </div>

            <input
              id="file-input"
              type="file"
              accept="video/mp4,video/avi,video/quicktime,video/x-msvideo,video/x-flv,video/webm"
              onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            {}
            <div className="flex items-start space-x-3 p-3 sm:p-4 bg-muted/50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10">
                  <FileVideo className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatFileSize(selectedFile.size)}
                  <span className="hidden sm:inline"> • {selectedFile.type}</span>
                </p>
                
                {isUploading && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Uploading...</span>
                      <span className="font-medium">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-1.5 sm:h-2" />
                  </div>
                )}
              </div>

              {!isUploading && onRemoveFile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRemoveFile}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {}
            {isUploading && (
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing your video...</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface VideoFormProps {
  formData: {
    title: string;
    description: string;
    visibility: string;
    tags: string;
  };
  onFormChange: (data: any) => void;
  className?: string;
}

export function VideoForm({ formData, onFormChange, className }: VideoFormProps) {
  return (
    <Card className={className}>
      <CardContent className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        <div className="grid gap-4 sm:gap-6">
          {}
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => onFormChange({ ...formData, title: e.target.value })}
              placeholder="Enter video title..."
              className="h-9 sm:h-10"
            />
          </div>

          {}
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => onFormChange({ ...formData, description: e.target.value })}
              placeholder="Describe your video..."
              rows={3}
              className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
            />
          </div>

          {}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="visibility" className="text-sm font-medium">
                Visibility
              </Label>
              <select
                id="visibility"
                value={formData.visibility}
                onChange={(e) => onFormChange({ ...formData, visibility: e.target.value })}
                className="w-full h-9 sm:h-10 px-3 py-1 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
                <option value="unlisted">Unlisted</option>
              </select>
            </div>

            {}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="tags" className="text-sm font-medium">
                Tags
              </Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => onFormChange({ ...formData, tags: e.target.value })}
                placeholder="tag1, tag2, tag3..."
                className="h-9 sm:h-10"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}