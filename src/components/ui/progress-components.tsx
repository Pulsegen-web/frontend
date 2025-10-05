import { cn } from "@/lib/utils"
import { Progress } from "./progress"
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface ProgressStepProps {
  title: string
  description?: string
  status: 'pending' | 'active' | 'completed' | 'error'
  progress?: number
  className?: string
}

export function ProgressStep({ 
  title, 
  description, 
  status, 
  progress, 
  className 
}: ProgressStepProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'active':
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'text-green-900 dark:text-green-100'
      case 'error':
        return 'text-red-900 dark:text-red-100'
      case 'active':
        return 'text-foreground'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-3">
        {getStatusIcon()}
        <div className="flex-1 min-w-0">
          <h4 className={cn("text-sm font-medium", getStatusColor())}>
            {title}
          </h4>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {description}
            </p>
          )}
        </div>
        {status === 'active' && typeof progress === 'number' && (
          <span className="text-xs font-medium text-primary">
            {progress}%
          </span>
        )}
      </div>
      
      {status === 'active' && typeof progress === 'number' && (
        <div className="ml-7">
          <Progress value={progress} className="h-1.5" />
        </div>
      )}
    </div>
  )
}

interface MultiStepProgressProps {
  steps: {
    title: string
    description?: string
    status: 'pending' | 'active' | 'completed' | 'error'
    progress?: number
  }[]
  className?: string
}

export function MultiStepProgress({ steps, className }: MultiStepProgressProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {steps.map((step, index) => (
        <div key={index} className="relative">
          <ProgressStep {...step} />
          {index < steps.length - 1 && (
            <div className="absolute left-2 top-8 w-0.5 h-4 bg-border" />
          )}
        </div>
      ))}
    </div>
  )
}

interface CircularProgressProps {
  value: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  className?: string
}

export function CircularProgress({ 
  value, 
  size = 'md', 
  showValue = true, 
  className 
}: CircularProgressProps) {
  const sizeClasses = {
    sm: { container: 'w-12 h-12', text: 'text-xs' },
    md: { container: 'w-16 h-16', text: 'text-sm' },
    lg: { container: 'w-20 h-20', text: 'text-base' }
  }

  const { container, text } = sizeClasses[size]
  const circumference = 2 * Math.PI * 45
  const strokeDasharray = `${(value / 100) * circumference} ${circumference}`

  return (
    <div className={cn("relative inline-flex items-center justify-center", container, className)}>
      <svg
        className="transform -rotate-90"
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
      >
        {}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-muted-foreground/20"
        />
        {}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          className="text-primary transition-all duration-300 ease-in-out"
        />
      </svg>
      
      {showValue && (
        <div className={cn("absolute inset-0 flex items-center justify-center", text)}>
          <span className="font-semibold">{Math.round(value)}%</span>
        </div>
      )}
    </div>
  )
}