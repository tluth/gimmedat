import React from 'react'
import { ModernFileBrowser } from '@/components'

const DashboardPage: React.FC = () => {
  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 border-b border-main-700 bg-main-900 bg-opacity-20">
        <h1 className="text-2xl font-bold text-asparagus-400">Your Files</h1>
      </div>
      <div className="flex-1 overflow-hidden">
        <ModernFileBrowser />
      </div>
    </div>
  )
}

export default DashboardPage
