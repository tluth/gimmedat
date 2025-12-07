import React from 'react'
import { FileBrowser } from '@/components/FileBrowser/FileBrowser'

const DashboardPage: React.FC = () => {
  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 border-b border-main-700 flex-shrink-0">
      </div>
      <div className="flex-1 min-h-0">
        <FileBrowser />
      </div>
    </div>
  )
}

export { DashboardPage }
