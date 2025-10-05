import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadZone, VideoForm } from "@/components/ui/upload-components";
import { 
  Upload, 
  CheckCircle,
  Loader2,
  Video
} from 'lucide-react';
import { useVideoUpload } from '../hooks/useVideo';
import { useSocket } from '../contexts/SocketContext';
import { toast } from 'sonner';
import { DashboardLayout } from "@/components/DashboardLayout";

export function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    visibility: 'private' as 'private' | 'organization' | 'public',
    tags: '',
  });
  const [isDragOver, setIsDragOver] = useState(false);

  const { uploadVideo, isUploading, uploadProgress, uploadedVideo } = useVideoUpload({
    onSuccess: () => {
      setSelectedFile(null);
      setFormData({
        title: '',
        description: '',
        visibility: 'private',
        tags: '',
      });
    }
  });

  const { isConnected } = useSocket();

  const handleFileSelect = (file: File) => {
    const allowedTypes = [
      'video/mp4',
      'video/avi', 
      'video/quicktime',
      'video/x-msvideo',
      'video/x-flv',
      'video/webm'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid video file (MP4, AVI, MOV, FLV, WebM)');
      return;
    }
    const maxSize = 1024 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File size must be less than 1GB');
      return;
    }

    setSelectedFile(file);
    if (!formData.title) {
      setFormData(prev => ({
        ...prev,
        title: file.name.replace(/\.[^/.]+$/, '')
      }));
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error('Please select a video file');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Please enter a title for your video');
      return;
    }

    const tags = formData.tags
      .split(',')
      .map((tag: string) => tag.trim())
      .filter((tag: string) => tag.length > 0);

    await uploadVideo(selectedFile, {
      title: formData.title,
      description: formData.description,
      visibility: formData.visibility,
      tags,
    });
  };

  return (
    <DashboardLayout 
      title="Upload Video" 
      breadcrumbs={[
        { label: "Videos", href: "/dashboard/videos" },
        { label: "Upload" }
      ]}
    >
      <div className="space-y-6 max-w-4xl">
        {}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Upload Video</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Share your content with the world
            </p>
          </div>
          
          {}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-xs text-muted-foreground">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        {}
        <form onSubmit={handleSubmit} className="space-y-6">
          {}
          <UploadZone
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
            onRemoveFile={handleRemoveFile}
            isDragOver={isDragOver}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
          />

          {}
          {selectedFile && (
            <>
              <VideoForm
                formData={formData}
                onFormChange={setFormData}
              />

              {}
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleRemoveFile}
                      disabled={isUploading}
                      className="w-full sm:w-auto order-2 sm:order-1"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isUploading || !selectedFile || !formData.title.trim()}
                      className="w-full sm:w-auto order-1 sm:order-2"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          <span className="hidden sm:inline">Uploading... {uploadProgress}%</span>
                          <span className="sm:hidden">{uploadProgress}%</span>
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Video
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </form>

        {}
        {uploadedVideo && (
          <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-1">
                    Upload Successful!
                  </h3>
                  <p className="text-sm text-green-800 dark:text-green-200 mb-3">
                    Your video "{uploadedVideo.title}" has been uploaded and is being processed.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button size="sm" asChild className="w-full sm:w-auto">
                      <a href="/dashboard/videos">
                        View All Videos
                      </a>
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => window.location.reload()} className="w-full sm:w-auto">
                      Upload Another
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {}
        <Card className="bg-muted/20">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Video className="h-5 w-5" />
              Upload Tips
            </CardTitle>
            <CardDescription>
              Get the best results from your video uploads
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium">Supported Formats</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• MP4 (recommended)</li>
                  <li>• AVI, MOV, WebM</li>
                  <li>• Max size: 1GB</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Best Practices</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Use descriptive titles</li>
                  <li>• Add relevant tags</li>
                  <li>• High-quality source files</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}