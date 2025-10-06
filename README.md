# PulseGen Frontend

Modern React-based web application for video management and streaming with real-time features.

## Description

PulseGen Frontend is a responsive web application built with React and TypeScript that provides an intuitive interface for video upload, management, and streaming. It features a modern dashboard with real-time updates and comprehensive user management.

## Features

- Modern responsive dashboard interface
- Video upload and management system
- Real-time updates via Socket.io
- User authentication and profile management
- Dark/light theme support
- Drag and drop functionality
- Advanced data tables with sorting and filtering
- Form validation with React Hook Form and Zod
- Toast notifications and loading states
- Settings and configuration management

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Icons**: Tabler Icons, Lucide React
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Zod validation
- **Real-time**: Socket.io Client
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Themes**: next-themes

## Prerequisites

- Node.js (v18 or higher)
- pnpm package manager

## Installation

1. Clone the repository
2. Navigate to the frontend directory
3. Install dependencies:
   ```bash
   pnpm install
   ```

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

For production, create a `.env.production` file:

```env
VITE_API_URL=https://your-backend-api.com
VITE_SOCKET_URL=https://your-backend-api.com
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm build:prod` - Build for production with production environment
- `pnpm start` - Start production server
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

## Application Routes

- `/` - Redirects to dashboard
- `/login` - User login page
- `/signup` - User registration page
- `/dashboard` - Main dashboard
- `/dashboard/videos` - Video management
- `/dashboard/upload` - Video upload interface
- `/dashboard/settings` - Application settings
- `/dashboard/profile` - User profile management

## Key Components

- **Dashboard**: Main application interface with navigation
- **Video Management**: Upload, view, and manage videos
- **Authentication**: Login and signup forms with validation
- **Theme Provider**: Dark/light mode support
- **Socket Integration**: Real-time communication
- **Form Components**: Reusable form elements with validation

## UI Components

The application uses a comprehensive design system built on Radix UI:

- Buttons, inputs, and form controls
- Data tables with sorting and pagination
- Modal dialogs and dropdowns
- Progress indicators and loading states
- Toast notifications
- Accordion and collapsible components
- Tabs and navigation elements

## Development

The application is built with modern React patterns:

- Functional components with hooks
- Context providers for global state
- Custom hooks for data fetching
- TypeScript for type safety
- Responsive design with Tailwind CSS

## Deployed

Frontend Application: https://frontend-bqh3.onrender.com
