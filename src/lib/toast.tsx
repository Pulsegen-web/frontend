import React from 'react';
import { toast as sonnerToast } from 'sonner';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

interface NotificationOptions {
  title?: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const toast = {
  success: (message: string, options?: NotificationOptions) => {
    return sonnerToast.success(message, {
      icon: React.createElement(CheckCircle, { className: "h-4 w-4" }),
      duration: options?.duration || 4000,
      description: options?.description,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
      className: 'text-sm',
    });
  },

  error: (message: string, options?: NotificationOptions) => {
    return sonnerToast.error(message, {
      icon: React.createElement(AlertCircle, { className: "h-4 w-4" }),
      duration: options?.duration || 6000,
      description: options?.description,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
      className: 'text-sm',
    });
  },

  info: (message: string, options?: NotificationOptions) => {
    return sonnerToast.info(message, {
      icon: React.createElement(Info, { className: "h-4 w-4" }),
      duration: options?.duration || 4000,
      description: options?.description,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
      className: 'text-sm',
    });
  },

  loading: (message: string, options?: Omit<NotificationOptions, 'action'>) => {
    return sonnerToast.loading(message, {
      duration: options?.duration || Infinity,
      description: options?.description,
      className: 'text-sm',
    });
  },

  dismiss: (toastId?: string | number) => {
    return sonnerToast.dismiss(toastId);
  },
};
export const configureToast = () => {
  return {
    position: 'top-center' as const,
    expand: true,
    richColors: true,
    closeButton: true,
    style: {
      fontSize: '14px',
    },
    toastOptions: {
      classNames: {
        toast: 'max-w-[calc(100vw-2rem)] sm:max-w-md mx-auto',
        title: 'text-sm font-medium',
        description: 'text-xs text-muted-foreground',
        actionButton: 'text-xs',
        cancelButton: 'text-xs',
      },
    },
  };
};