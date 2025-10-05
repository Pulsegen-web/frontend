import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { PublicRoute } from './components/PublicRoute';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { VideosPage } from './pages/VideosPage';
import { UploadPage } from './pages/UploadPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProfilePage } from './pages/ProfilePage';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="pulsegen-ui-theme">
        <AuthProvider>
          <SocketProvider>
            <Router>
              <div className="min-h-screen">
                <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                <Route 
                  path="/login" 
                  element={
                    <PublicRoute>
                      <LoginPage />
                    </PublicRoute>
                  } 
                />
                
                <Route 
                  path="/signup" 
                  element={
                    <PublicRoute>
                      <SignupPage />
                    </PublicRoute>
                  } 
                />
                
                <Route 
                  path="/dashboard" 
                  element={<DashboardPage />} 
                />
                
                <Route 
                  path="/dashboard/videos" 
                  element={<VideosPage />} 
                />
                
                <Route 
                  path="/dashboard/upload" 
                  element={<UploadPage />} 
                />
                
                <Route 
                  path="/dashboard/settings" 
                  element={<SettingsPage />} 
                />
                
                <Route 
                  path="/dashboard/profile" 
                  element={<ProfilePage />} 
                />
                
                {}
                <Route 
                  path="/dashboard/analytics" 
                  element={<Navigate to="/dashboard" replace />} 
                />
                
                <Route 
                  path="/dashboard/users" 
                  element={<Navigate to="/dashboard" replace />} 
                />
                
                {}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </SocketProvider>
      </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
