import React from 'react'
import { FileBrowser } from '@/components'

const DashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Files</h1>
      <FileBrowser />
    </div>
  )
}

export default DashboardPage
