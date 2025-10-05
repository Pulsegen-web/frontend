import { useState, useCallback } from 'react';
import { videoAPI, type Video, type VideoUploadData } from '../services/api';
import { toast } from 'sonner';

interface UseVideoUploadOptions {
  onSuccess?: (video: Video) => void;
  onError?: (error: string) => void;
}

export const useVideoUpload = (options?: UseVideoUploadOptions) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState<Video | null>(null);

  const uploadVideo = useCallback(async (file: File, data: VideoUploadData) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      const response = await videoAPI.uploadVideo(file, data, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      });

      if (response.success) {
        setUploadedVideo(response.data.video);
        options?.onSuccess?.(response.data.video);
        toast.success('Video uploaded successfully! Processing will begin shortly.');
      }
      
      return response.data.video;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to upload video';
      options?.onError?.(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [options]);

  const resetUpload = useCallback(() => {
    setUploadedVideo(null);
    setUploadProgress(0);
    setIsUploading(false);
  }, []);

  return {
    uploadVideo,
    isUploading,
    uploadProgress,
    uploadedVideo,
    resetUpload,
  };
};

export const useVideoList = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalVideos: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const fetchVideos = useCallback(async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    sensitivity?: string;
    search?: string;
  }) => {
    try {
      setIsLoading(true);
      const response = await videoAPI.getVideos(params);
      
      if (response.success) {
        setVideos(response.data.videos);
        setPagination(response.data.pagination);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch videos';
      toast.error(errorMessage);
      console.error('Error fetching videos:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateVideo = useCallback(async (id: string, data: Partial<VideoUploadData>) => {
    try {
      const response = await videoAPI.updateVideo(id, data);
      
      if (response.success) {
        setVideos(prev => prev.map(video => 
          video._id === id ? response.data.video : video
        ));
        toast.success('Video updated successfully');
        return response.data.video;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update video';
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  const deleteVideo = useCallback(async (id: string) => {
    try {
      const response = await videoAPI.deleteVideo(id);
      
      if (response.success) {
        setVideos(prev => prev.filter(video => video._id !== id));
        toast.success('Video deleted successfully');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete video';
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  const refreshVideos = useCallback(() => {
    fetchVideos({ page: pagination.currentPage });
  }, [fetchVideos, pagination.currentPage]);

  return {
    videos,
    isLoading,
    pagination,
    fetchVideos,
    updateVideo,
    deleteVideo,
    refreshVideos,
  };
};