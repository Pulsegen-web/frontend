import { useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';

interface UseVideoEventsOptions {
  onVideoUploadComplete?: (data: any) => void;
  onVideoProcessingComplete?: (data: any) => void;
  onVideoProcessingProgress?: (data: any) => void;
}

export const useVideoEvents = (options: UseVideoEventsOptions = {}) => {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleVideoUploadComplete = (data: any) => {
      console.log(' useVideoEvents: Video upload completed:', data);
      options.onVideoUploadComplete?.(data);
    };

    const handleVideoProcessingComplete = (data: any) => {
      console.log(' useVideoEvents: Video processing completed:', data);
      options.onVideoProcessingComplete?.(data);
    };

    const handleVideoProcessingProgress = (data: any) => {
      console.log(' useVideoEvents: Video processing progress:', data);
      options.onVideoProcessingProgress?.(data);
    };
    socket.on('video-upload-complete', handleVideoUploadComplete);
    socket.on('video-processing-complete', handleVideoProcessingComplete);
    socket.on('video-processing-progress', handleVideoProcessingProgress);

    console.log(' useVideoEvents: Event listeners attached');
    return () => {
      console.log(' useVideoEvents: Cleaning up event listeners');
      socket.off('video-upload-complete', handleVideoUploadComplete);
      socket.off('video-processing-complete', handleVideoProcessingComplete);
      socket.off('video-processing-progress', handleVideoProcessingProgress);
    };
  }, [socket, options.onVideoUploadComplete, options.onVideoProcessingComplete, options.onVideoProcessingProgress]);
};