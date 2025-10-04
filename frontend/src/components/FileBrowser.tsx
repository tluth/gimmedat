import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { useAuth } from '@/hooks/useAuth'
import { UploadButton } from './UploadButton'
import { POCKETDAT_API } from '@/constants'
import { FileItem } from '@/services/types'
import { UploadService } from "@/services/uploadService"
import { useNavigate, useLocation } from 'react-router-dom'

interface FileBrowserProps {
  prefix?: string
}

export const FileBrowser: React.FC<FileBrowserProps> = ({ prefix: propPrefix }) => {
  const { session } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  // Get current path from URL params or use propPrefix as fallback
  const getCurrentPath = useCallback((): string => {
    const params = new URLSearchParams(location.search)
    return params.get('path') || propPrefix || ''
  }, [location.search, propPrefix])
  
  const [currentPath, setCurrentPath] = useState<string>(getCurrentPath())
  const [files, setFiles] = useState<FileItem[]>([])
  const [folders, setFolders] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingFiles, setDeletingFiles] = useState<Set<string>>(new Set())
  const [showCreateFolder, setShowCreateFolder] = useState<boolean>(false)
  const [newFolderName, setNewFolderName] = useState<string>('')
  const [creatingFolder, setCreatingFolder] = useState<boolean>(false)

  // Utility function to extract display name from path
  const getDisplayName = (path: string): string => {
    if (!path) return ''
    
    // Remove trailing slash if present
    const cleanPath = path.replace(/\/$/, '')
    
    // Split by '/' and get the last part
    const parts = cleanPath.split('/')
    return parts[parts.length - 1] || path
  }

  useEffect(() => {
    const fetchFiles = async () => {
      if (!session?.tokens) return
      setLoading(true)
      setError(null)

      // Get access token from session instead of localStorage
      const accessToken = session.tokens.accessToken?.toString()

      if (!accessToken) {
        setError('No access token available')
        setLoading(false)
        return
      }
      try {
        const response = await axios.get(`${POCKETDAT_API}/files/list`, {
          params: { prefix: currentPath },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        setFiles(response.data.files || [])
        setFolders(response.data.folders || [])
      } catch (err) {
        setError('Failed to fetch files.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchFiles()
  }, [session, currentPath])

  // Navigate to folder
  const navigateToFolder = (folderPath: string) => {
    navigate(`/dashboard?path=${encodeURIComponent(folderPath)}`)
  }

  // Navigate back to parent folder
  const navigateToParent = () => {
    if (!currentPath) return
    
    // Remove trailing slash and get parent path
    const cleanPath = currentPath.replace(/\/$/, '')
    const lastSlashIndex = cleanPath.lastIndexOf('/')
    const parentPath = lastSlashIndex > 0 ? cleanPath.substring(0, lastSlashIndex + 1) : ''
    
    if (parentPath) {
      navigate(`/dashboard?path=${encodeURIComponent(parentPath)}`)
    } else {
      navigate('/dashboard')
    }
  }

  // Create breadcrumb navigation
  const getBreadcrumbs = () => {
    if (!currentPath) return []
    
    const parts = currentPath.split('/').filter(part => part.length > 0)
    const breadcrumbs = []
    let currentBreadcrumbPath = ''
    
    for (const part of parts) {
      currentBreadcrumbPath += part + '/'
      breadcrumbs.push({
        name: part,
        path: currentBreadcrumbPath
      })
    }
    
    return breadcrumbs
  }

  // Update current path when URL changes
  useEffect(() => {
    const newPath = getCurrentPath()
    setCurrentPath(newPath)
  }, [location.search, getCurrentPath])

  // commenting out because its unused for now (23.08.25)
  const handleDownload = async (key: string) => {
    if (!session?.tokens) return
    const accessToken = session.tokens.accessToken?.toString()
    try {
      const response = await axios.get(`${POCKETDAT_API}/files/download`, {
        params: { key },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })
      window.open(response.data?.url, '_blank')
    } catch (err) {
      setError('Failed to generate download URL.')
      console.error(err)
    }
  }

  const handleDelete = async (key: string) => {
    if (!session?.tokens) {
      setError('No authentication session available')
      return
    }

    const accessToken = session.tokens.accessToken?.toString()

    if (!accessToken) {
      setError('No access token available')
      return
    }

    // Show confirmation dialog
    if (!window.confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      return
    }

    // Add file to deleting set
    setDeletingFiles(prev => new Set([...prev, key]))
    setError(null)

    try {
      await axios.delete(`${POCKETDAT_API}/files/delete`, {
        params: { key },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Remove the file from the local state
      setFiles(prevFiles => prevFiles.filter(file => file.key !== key))

      console.log(`File ${key} deleted successfully`)
    } catch (err) {
      console.error('Delete failed:', err)
      setError('Failed to delete file.')
    } finally {
      // Remove file from deleting set
      setDeletingFiles(prev => {
        const newSet = new Set(prev)
        newSet.delete(key)
        return newSet
      })
    }
  }

  // Validate folder name
  const validateFolderName = (name: string): string | null => {
    if (!name.trim()) {
      return 'Folder name cannot be empty'
    }

    // Check for invalid characters for S3/file systems
    const invalidChars = /[<>:"/\\|?*]/
    const hasControlChars = name.split('').some(char => char.charCodeAt(0) < 32)

    if (invalidChars.test(name) || hasControlChars) {
      return 'Folder name contains invalid characters'
    }

    // Check length
    if (name.length > 255) {
      return 'Folder name is too long (max 255 characters)'
    }

    // Check for reserved names
    const reservedNames = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9']
    if (reservedNames.includes(name.toUpperCase())) {
      return 'Folder name is reserved'
    }

    return null // Valid
  }

  // Create folder method
  const handleCreateFolder = async () => {
    if (!session?.tokens) {
      setError('No authentication session available')
      return
    }

    const accessToken = session.tokens.accessToken?.toString()

    if (!accessToken) {
      setError('No access token available')
      return
    }

    const trimmedName = newFolderName.trim()
    const validationError = validateFolderName(trimmedName)

    if (validationError) {
      setError(validationError)
      return
    }

    setCreatingFolder(true)
    setError(null)

    try {
      // Create a placeholder file to represent the folder
      // We'll create a .keep file inside the folder
      const folderPath = `${currentPath || ''}${trimmedName}/`
      const placeholderContent = '# This file represents a folder\n'
      const placeholderFile = new File([placeholderContent], '.keep', { type: 'text/plain' })

      await UploadService.uploadFile({
        endpoint: `${POCKETDAT_API}/files/upload`,
        file: placeholderFile,
        uploadRequest: {
          file_name: '.keep',
          byte_size: placeholderFile.size,
          file_type: 'text/plain',
          folder_prefix: folderPath,
          recipient_email: null,
          sender: null
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        onSuccess: () => {
          // Add folder to local state
          setFolders(prevFolders => [...prevFolders, folderPath])
          setNewFolderName('')
          setShowCreateFolder(false)
          console.log(`Folder ${trimmedName} created successfully`)
        },
        onError: (error) => {
          console.error('Folder creation failed:', error)
          setError(`Failed to create folder: ${error}`)
        }
      })
    } catch (error) {
      console.error('Folder creation error:', error)
      setError('Failed to create folder due to network error')
    } finally {
      setCreatingFolder(false)
    }
  }

  // In your FileBrowser.tsx uploadFileToFolder method
  const uploadFileToFolder = async (file: File, folderPrefix: string) => {
    if (!session?.tokens) {
      setError('No authentication session available')
      return
    }

    const accessToken = session.tokens.accessToken?.toString()

    if (!accessToken) {
      setError('No access token available')
      return
    }

    try {
      await UploadService.uploadFile({
        endpoint: `${POCKETDAT_API}/files/upload`,
        file,
        uploadRequest: {
          file_name: file.name,
          byte_size: file.size,
          file_type: file.type,
          folder_prefix: folderPrefix,
          recipient_email: null,
          sender: null
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        onProgress: (progress) => {
          console.log(`Upload progress: ${progress}%`)
        },
        onSuccess: () => {
          window.location.reload()
        },
        onError: (error) => {
          console.error("Upload failed:", error)
          setError(`Upload failed: ${error}`)
        }
      })
    } catch (error) {
      console.error("Upload error:", error)
      setError('Upload failed due to network error')
    }
  }

  if (loading) return <p className="text-offWhite">Loading files...</p>
  if (error) return <p className="text-red-400">Error: {error}</p>

  return (
    <div className="bg-night text-offWhite p-6 rounded-lg">
      {/* Breadcrumb Navigation */}
      {currentPath && (
        <div className="mb-4 flex items-center space-x-2 text-sm">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-asparagus-400 hover:text-asparagus-300 transition-colors duration-150"
          >
            Home
          </button>
          {getBreadcrumbs().map((breadcrumb) => (
            <React.Fragment key={breadcrumb.path}>
              <span className="text-main-500">/</span>
              <button
                onClick={() => navigate(`/dashboard?path=${encodeURIComponent(breadcrumb.path)}`)}
                className="text-asparagus-400 hover:text-asparagus-300 transition-colors duration-150"
              >
                {breadcrumb.name}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Back Button */}
      {currentPath && (
        <button
          onClick={navigateToParent}
          className="mb-4 bg-main-700 hover:bg-main-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-150"
        >
          ← Back
        </button>
      )}

      <UploadButton currentPrefix={currentPath} uploadHandler={uploadFileToFolder} />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-main-400 mt-6">Folders</h2>
        <button
          onClick={() => setShowCreateFolder(!showCreateFolder)}
          className="bg-main-700 hover:bg-main-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-150"
        >
          {showCreateFolder ? 'Cancel' : 'New Folder'}
        </button>
      </div>

      {showCreateFolder && (
        <div className="mb-4 p-4 bg-main-900 bg-opacity-20 rounded-lg">
          <div className="flex gap-2">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Enter folder name"
              className="flex-1 px-3 py-2 bg-night border border-main-600 rounded text-offWhite placeholder-asparagus-400"
              disabled={creatingFolder}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !creatingFolder) {
                  handleCreateFolder()
                }
              }}
            />
            <button
              onClick={handleCreateFolder}
              disabled={creatingFolder || !newFolderName.trim()}
              className="bg-asparagus-600 hover:bg-asparagus-500 disabled:bg-asparagus-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded transition-colors duration-150"
            >
              {creatingFolder ? 'Creating...' : 'Create'}
            </button>
          </div>
        </div>
      )}

      {folders.length === 0 ? (
        <p className="text-asparagus-300 italic">No folders found.</p>
      ) : (
        <ul className="space-y-2 mb-6">
          {folders.map((folder) => (
            <li
              key={folder}
              className="text-main-300 hover:text-main-200 cursor-pointer transition-colors duration-150 flex items-center"
              onClick={() => navigateToFolder(folder)}
            >
              <span className="mr-2">📁</span>
              {getDisplayName(folder)}
            </li>
          ))}
        </ul>
      )}

      <h2 className="text-2xl font-semibold text-main-400 mt-6 mb-4">Files</h2>
      {files.length === 0 ? (
        <p className="text-asparagus-300 italic">No files found.</p>
      ) : (
        <ul className="space-y-3">
          {files.map((file) => (
            <li
              key={file.key}
              className="flex justify-between items-center bg-main-900 bg-opacity-20 p-3 rounded-lg hover:bg-opacity-30 transition-all duration-150"
            >
              <span className="text-offWhite font-medium flex items-center">
                <span className="mr-2">📄</span>
                {getDisplayName(file.name)}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(file.key)}
                  className="bg-main-700 hover:bg-main-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-150"
                >
                  Download
                </button>
                <button
                  onClick={() => handleDelete(file.key)}
                  disabled={deletingFiles.has(file.key)}
                  className="bg-red-600 hover:bg-red-500 disabled:bg-red-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded transition-colors duration-150"
                >
                  {deletingFiles.has(file.key) ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
