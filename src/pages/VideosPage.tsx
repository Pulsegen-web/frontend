import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VideoCard } from "@/components/ui/video-card";
import { VideoList } from "@/components/ui/video-grid";
import { LayoutSwitcher } from "@/components/ui/layout-switcher";
import { VideoGridSkeleton } from "@/components/ui/video-skeleton";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { SearchFilters } from "@/components/ui/search-filters";
import { VideoPlayerModal } from "@/components/ui/video-player-modal";
import { 
  Video, 
  Upload
} from 'lucide-react';
import { useVideoList } from '../hooks/useVideo';
import { useVideoEvents } from '../hooks/useVideoEvents';
import { DashboardLayout } from "@/components/DashboardLayout";

export function VideosPage() {
  const { videos, isLoading, pagination, fetchVideos, deleteVideo, refreshVideos } = useVideoList();
  const [searchTerm, setSearchTerm] = useState('');
  const [layout, setLayout] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'views' | 'size'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<{
    status?: string[];
    visibility?: string[];
  }>({});
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const handlePlayVideo = (video: any) => {
    setSelectedVideo(video);
    setIsVideoModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsVideoModalOpen(false);
    setSelectedVideo(null);
  };

  const filteredAndSortedVideos = useMemo(() => {
    let result = videos.filter(video => {
      const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (video.description && video.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = !filters.status?.length || 
        filters.status.includes(video.status);
      
      return matchesSearch && matchesStatus;
    });
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'views':
          comparison = a.viewCount - b.viewCount;
          break;
        case 'size':
          comparison = a.fileSize - b.fileSize;
          break;
        case 'date':
        default:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [videos, searchTerm, sortBy, sortOrder, filters]);

  useEffect(() => {
    fetchVideos({ page: 1, limit: 10 });
  }, [fetchVideos]);
  useVideoEvents({
    onVideoUploadComplete: (data) => {
      console.log(' VideosPage: Video upload completed, refreshing list:', data);
      refreshVideos();
    },
    onVideoProcessingComplete: (data) => {
      console.log(' VideosPage: Video processing completed, refreshing list:', data);
      refreshVideos();
    },
    onVideoProcessingProgress: (data) => {
      console.log(' VideosPage: Video processing progress:', data);
      if (data.progress === 100) {
        refreshVideos();
      }
    }
  });

  const handlePageChange = (page: number) => {
    fetchVideos({ page });
  };

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy as 'date' | 'title' | 'views' | 'size');
    setSortOrder(newSortOrder);
  };

  return (
    <DashboardLayout 
      title="Videos" 
      breadcrumbs={[{ label: "Videos" }]}
    >
      <div className="space-y-6 sm:space-y-8">
        {}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Videos</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage and monitor your video uploads
            </p>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <a href="/dashboard/upload">
              <Upload className="h-4 w-4 mr-2" />
              <span className="sm:hidden">Upload Video</span>
              <span className="hidden sm:inline">Upload Video</span>
            </a>
          </Button>
        </div>

        {}
        <SearchFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          filters={filters}
          onFiltersChange={setFilters}
        />

        {}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="text-lg sm:text-xl">
                  Your Videos ({pagination.totalVideos})
                </CardTitle>
                <CardDescription className="text-sm">
                  <span className="hidden sm:inline">All your uploaded videos with processing status and analytics</span>
                  <span className="sm:hidden">Manage your video library</span>
                </CardDescription>
              </div>
              <LayoutSwitcher
                layout={layout}
                onLayoutChange={setLayout}
                className="w-fit"
              />
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {isLoading ? (
              <VideoGridSkeleton count={5} layout={layout} />
            ) : filteredAndSortedVideos.length === 0 ? (
              <div className="text-center py-8 sm:py-12 px-4">
                <Video className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-base sm:text-lg font-semibold mb-2">No videos found</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 max-w-md mx-auto">
                  {searchTerm 
                    ? "No videos match your search. Try different keywords." 
                    : "Upload your first video to get started with your video library."
                  }
                </p>
                {!searchTerm && (
                  <Button asChild className="w-full sm:w-auto">
                    <a href="/dashboard/upload">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Video
                    </a>
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {}
                <VideoList layout={layout}>
                  {filteredAndSortedVideos.map((video) => (
                    <VideoCard
                      key={video._id}
                      video={video}
                      layout={layout}
                      onPlay={() => handlePlayVideo(video)}
                      onDelete={() => deleteVideo(video._id)}
                      onShare={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/video/${video._id}`);
                        console.log('Link copied to clipboard');
                      }}
                      onDownload={() => {
                        console.log('Download video:', video._id);
                      }}
                    />
                  ))}
                </VideoList>

                {}
                {pagination.totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t">
                    <div className="text-sm text-muted-foreground text-center sm:text-left">
                      Showing {videos.length} of {pagination.totalVideos} videos
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={!pagination.hasPrevPage}
                        className="min-w-[80px]"
                      >
                        Previous
                      </Button>
                      <span className="text-sm px-3 py-1.5 bg-muted rounded text-center min-w-[120px]">
                        Page {pagination.currentPage} of {pagination.totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={!pagination.hasNextPage}
                        className="min-w-[80px]"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {}
        <FloatingActionButton 
          href="/dashboard/upload"
        >
          <Upload className="h-5 w-5" />
        </FloatingActionButton>

        {}
        <VideoPlayerModal
          isOpen={isVideoModalOpen}
          onClose={handleCloseModal}
          video={selectedVideo}
        />
      </div>
    </DashboardLayout>
  );
}