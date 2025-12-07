import React from 'react'

type StatusType = 'loading' | 'error' | 'info'

interface StatusMessageProps {
  type: StatusType
  message: string
  showSpinner?: boolean
}

/**
 * Generic status message component for displaying loading, error, and info states
 */
export const StatusMessage: React.FC<StatusMessageProps> = ({
  type,
  message,
  showSpinner = false
}) => {
  const getColorClass = () => {
    switch (type) {
      case 'error':
        return 'text-red-400'
      case 'loading':
        return 'text-offWhite'
      case 'info':
        return 'text-asparagus-300'
      default:
        return 'text-offWhite'
    }
  }

  return (
    <div className={`flex items-center justify-center h-64 bg-transparent ${getColorClass()}`}>
      <div className="text-center">
        {showSpinner && (
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-asparagus-400 mx-auto mb-4"></div>
        )}
        <p>{message}</p>
      </div>
    </div>
  )
}
