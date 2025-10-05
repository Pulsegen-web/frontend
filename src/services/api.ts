import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: 'viewer' | 'editor' | 'admin';
  organizationId: string;
  lastLogin?: string;
  profileImage?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  settings: {
    maxVideoSize: number;
    maxVideosPerUser: number;
    allowedVideoFormats: string[];
    enableSensitivityAnalysis: boolean;
  };
}

export interface Video {
  _id: string;
  title: string;
  description?: string;
  filename: string;
  originalName: string;
  fileSize: number;
  duration?: number;
  resolution?: {
    width: number;
    height: number;
  };
  status: 'uploading' | 'processing' | 'completed' | 'failed' | 'archived';
  processingProgress: number;
  sensitivityAnalysis: {
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'skipped';
    result?: 'safe' | 'flagged' | 'under-review';
    confidence?: number;
    flaggedContent?: {
      violence: boolean;
      adult: boolean;
      hate: boolean;
      drugs: boolean;
      weapons: boolean;
    };
    analysisDate?: string;
    notes?: string;
  };
  visibility: 'private' | 'organization' | 'public';
  tags: string[];
  viewCount: number;
  uploadedBy: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
  };
  fileUrl: string;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    organization: Organization;
    token: string;
  };
}

export interface VideoUploadData {
  title: string;
  description?: string;
  visibility?: 'private' | 'organization' | 'public';
  tags?: string[];
}
export const authAPI = {
  async register(userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    organizationName?: string;
    role?: string;
  }): Promise<AuthResponse> {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async login(credentials: { login: string; password: string }): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async getProfile(): Promise<{ success: boolean; data: { user: User; organization: Organization } }> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async refreshToken(): Promise<{ success: boolean; data: { token: string } }> {
    const response = await api.post('/auth/refresh');
    return response.data;
  }
};
export const videoAPI = {
  async uploadVideo(
    file: File, 
    data: VideoUploadData,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<{ success: boolean; data: { video: Video } }> {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.visibility) formData.append('visibility', data.visibility);
    if (data.tags) formData.append('tags', JSON.stringify(data.tags));

    const response = await api.post('/videos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return response.data;
  },

  async getVideos(params?: {
    page?: number;
    limit?: number;
    status?: string;
    sensitivity?: string;
    search?: string;
  }): Promise<{
    success: boolean;
    data: {
      videos: Video[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalVideos: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      };
    };
  }> {
    const response = await api.get('/videos', { params });
    return response.data;
  },

  async getVideo(id: string): Promise<{ success: boolean; data: { video: Video } }> {
    const response = await api.get(`/videos/${id}`);
    return response.data;
  },

  async updateVideo(id: string, data: Partial<VideoUploadData>): Promise<{ success: boolean; data: { video: Video } }> {
    const response = await api.put(`/videos/${id}`, data);
    return response.data;
  },

  async deleteVideo(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/videos/${id}`);
    return response.data;
  },

  getStreamUrl(id: string): string {
    const token = localStorage.getItem('token');
    return `${API_BASE_URL}/videos/${id}/stream${token ? `?token=${token}` : ''}`;
  }
};
export const userAPI = {
  async getProfile(): Promise<{
    success: boolean;
    data: {
      user: User;
      organization: Organization;
      statistics: {
        videos: {
          total: number;
          totalViews: number;
          totalSizeBytes: number;
          byStatus: Record<string, number>;
          bySensitivity: Record<string, number>;
        };
      };
    };
  }> {
    const response = await api.get('/users/profile');
    return response.data;
  },

  async updateProfile(data: {
    firstName?: string;
    lastName?: string;
    email?: string;
  }): Promise<{ success: boolean; data: { user: User } }> {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  async getOrganizationUsers(params?: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
  }): Promise<{
    success: boolean;
    data: {
      users: (User & { videoCount: number })[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalUsers: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      };
    };
  }> {
    const response = await api.get('/users/organization', { params });
    return response.data;
  },

  async updateUserRole(userId: string, role: string): Promise<{ success: boolean; data: { user: User } }> {
    const response = await api.put(`/users/${userId}/role`, { role });
    return response.data;
  },

  async deactivateUser(userId: string): Promise<{ success: boolean; message: string }> {
    const response = await api.put(`/users/${userId}/deactivate`);
    return response.data;
  },

  async activateUser(userId: string): Promise<{ success: boolean; message: string }> {
    const response = await api.put(`/users/${userId}/activate`);
    return response.data;
  }
};

export default api;