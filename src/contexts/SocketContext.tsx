import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinUserRoom: (userId: string) => void;
  leaveUserRoom: (userId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
      const newSocket = io(socketUrl, {
        auth: {
          token: localStorage.getItem('token'),
          userId: user.id,
        },
      });

      newSocket.on('connect', () => {
        console.log(' Socket connected:', newSocket.id);
        setIsConnected(true);
        console.log(` Joining user room: user_${user.id}`);
        newSocket.emit('join-room', user.id);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      });
      newSocket.on('video-upload-complete', (data) => {
        toast.success(`Video "${data.title}" uploaded successfully!`);
        console.log('Video upload complete:', data);
      });
      newSocket.on('video-processing-progress', (data) => {
        console.log('Video processing progress:', data);
        if (data.progress === 100) {
          toast.success(`Video "${data.title || 'processing'}" completed!`);
        }
      });

      newSocket.on('video-processing-complete', (data) => {
        const message = data.sensitivityResult === 'flagged' 
          ? `Video "${data.title}" processed - Content flagged for review`
          : `Video "${data.title}" processed successfully`;
        
        const toastType = data.sensitivityResult === 'flagged' ? 'warning' : 'success';
        
        if (toastType === 'warning') {
          toast.warning(message);
        } else {
          toast.success(message);
        }
        
        console.log('Video processing complete:', data);
      });

      newSocket.on('video-processing-error', (data) => {
        toast.error(`Video processing failed: ${data.error}`);
        console.error('Video processing error:', data);
      });
      newSocket.on('sensitivity-analysis-progress', (data) => {
        console.log('Sensitivity analysis progress:', data);
      });

      newSocket.on('sensitivity-analysis-complete', (data) => {
        console.log('Sensitivity analysis complete:', data);
        
        const result = data.results?.result;
        if (result === 'flagged') {
          toast.warning('Content analysis flagged video for review');
        } else if (result === 'under-review') {
          toast('Video requires manual review');
        }
      });

      newSocket.on('sensitivity-analysis-error', (data) => {
        toast.error(`Content analysis failed: ${data.error}`);
        console.error('Sensitivity analysis error:', data);
      });
      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setIsConnected(false);
      });

      setSocket(newSocket);
      return () => {
        newSocket.close();
        setSocket(null);
        setIsConnected(false);
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [isAuthenticated, user]);

  const joinUserRoom = (userId: string) => {
    if (socket && isConnected) {
      socket.emit('join-room', userId);
    }
  };

  const leaveUserRoom = (userId: string) => {
    if (socket && isConnected) {
      socket.emit('leave-room', userId);
    }
  };

  const value: SocketContextType = {
    socket,
    isConnected,
    joinUserRoom,
    leaveUserRoom,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};