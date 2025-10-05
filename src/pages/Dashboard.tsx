import React from 'react';
import { VideoManagement } from './VideoManagement';

export const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <VideoManagement />
    </div>
  );
};