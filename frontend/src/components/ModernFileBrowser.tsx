import React, { useState, useEffect, useCallback } from 'react'
import { FileTree } from './FileTree'
import { FileView } from './FileView'
import { FilePreview } from './FilePreview'
import { useAuth } from '@/hooks/useAuth'
import { POCKETDAT_API } from '@/constants'
import { FileItem } from '@/services/types'
import { UploadService } from '@/services/uploadService'
import axios from 'axios'

export interface TreeNode {
  name: string
  path: string
  type: 'file' | 'folder'
  children?: TreeNode[]
  expanded?: boolean
  size?: string
  lastModified?: string
  fileType?: string
  fullS3Path?: string // Store the full S3 path for backend operations
  loaded?: boolean // Whether folder contents have been loaded
  loading?: boolean // Whether folder is currently loading
}

interface ModernFileBrowserProps {
  // No props needed since we determine user folder from auth context
}

export const ModernFileBrowser: React.FC<ModernFileBrowserProps> = () => {
  const { session } = useAuth()
  const [tree, setTree] = useState<TreeNode[]>([])
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [loadingContent, setLoadingContent] = useState<boolean>(false)
  const [deletingFiles, setDeletingFiles] = useState<Set<string>>(new Set())
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [loadingFolders, setLoadingFolders] = useState<Set<string>>(new Set())

  // Build tree structure from files and folders
  const buildTreeFromData = useCallback((files: FileItem[], folders: string[]) => {
    const nodeMap = new Map<string, TreeNode>()
    const rootNodes: TreeNode[] = []

    console.log('Building tree from API data')
    console.log('Sample raw folders from API:', folders.slice(0, 3))
    console.log('Sample raw files from API:', files.slice(0, 3).map(f => f.key))

    // Helper function to extract relative path from full S3 path
    const extractRelativePath = (fullPath: string): string => {
      // If the path contains a UUID-like pattern at the start, remove it
      // UUID pattern: 8-4-4-4-12 characters (e.g., "730488e2-d051-703a-e0be-19f7e50a6262")
      const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\//i

      if (uuidPattern.test(fullPath)) {
        // Remove the UUID prefix and return the relative path
        return fullPath.replace(uuidPattern, '')
      }

      // If no UUID pattern found, return the path as-is
      return fullPath
    }

    // Add folders first
    folders.forEach(folderPath => {
      console.log('Processing folder:', folderPath)

      const relativePath = extractRelativePath(folderPath)
      console.log('Extracted relative path:', relativePath)

      // Skip empty folders
      if (!relativePath || relativePath === '/') {
        console.log('Skipping empty folder:', folderPath)
        return
      }

      const pathParts = relativePath.split('/').filter(part => part.length > 0)
      let currentPath = ''

      pathParts.forEach((part, index) => {
        currentPath += (currentPath ? '/' : '') + part

        if (!nodeMap.has(currentPath)) {
          const node: TreeNode = {
            name: part,
            path: currentPath,
            type: 'folder',
            children: [],
            expanded: false,
            loaded: false, // Mark as not loaded initially
            loading: false
          }
          nodeMap.set(currentPath, node)
          console.log('Created folder node:', part, 'at relative path:', currentPath)

          // Add to parent or root
          if (index === 0) {
            rootNodes.push(node)
          } else {
            const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/' + part))
            const parent = nodeMap.get(parentPath)
            if (parent && parent.children) {
              parent.children.push(node)
            }
          }
        }
      })
    })

    // Add files
    files.forEach(file => {
      console.log('Processing file:', file.key)

      const relativePath = extractRelativePath(file.key)
      console.log('Extracted relative file path:', relativePath)

      // Skip if no file path
      if (!relativePath) {
        console.log('Skipping file with empty relative path:', file.key)
        return
      }

      const pathParts = relativePath.split('/')
      const fileName = pathParts[pathParts.length - 1]
      const filePath = relativePath // Use relative path for the file too

      // Create folders for nested files if they don't exist
      let currentPath = ''
      pathParts.slice(0, -1).forEach((part, index) => {
          if (part) { // Skip empty parts
            currentPath += (currentPath ? '/' : '') + part

            if (!nodeMap.has(currentPath)) {
              const node: TreeNode = {
                name: part,
                path: currentPath,
                type: 'folder',
                children: [],
                expanded: false,
                loaded: false,
                loading: false
              }
              nodeMap.set(currentPath, node)
              console.log('Created folder node for file path:', part, 'at relative path:', currentPath)

              if (index === 0) {
                rootNodes.push(node)
              } else {
                const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/' + part))
                const parent = nodeMap.get(parentPath)
                if (parent && parent.children) {
                  parent.children.push(node)
                }
              }
            }
          }
      })

      // Add the file
      const fileNode: TreeNode = {
        name: fileName,
        path: filePath, // Use relative path
        type: 'file',
        size: file.size,
        lastModified: file.last_modified,
        fileType: file.type,
        fullS3Path: file.key // Store the original full S3 path for backend operations
      }
      console.log('Created file node:', fileName, 'at relative path:', filePath)

      if (pathParts.length === 1) {
        // File in root
        rootNodes.push(fileNode)
      } else {
        // File in folder
        const parentPath = pathParts.slice(0, -1).join('/')
        const parent = nodeMap.get(parentPath)
        if (parent && parent.children) {
          parent.children.push(fileNode)
        } else {
          console.log('Could not find parent for file:', fileName, 'expected parent path:', parentPath)
        }
      }
    })

    console.log('Final root nodes:', rootNodes.length)
    return rootNodes
  }, [])

  // Build direct children for a specific folder
  const buildFolderChildren = useCallback((files: FileItem[], folders: string[], parentFolderPath: string) => {
    const children: TreeNode[] = []

    console.log('Building children for folder:', parentFolderPath)
    console.log('Raw files:', files.map(f => f.key))
    console.log('Raw folders:', folders)

    // Helper function to extract relative path from full S3 path
    const extractRelativePath = (fullPath: string): string => {
      const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\//i
      if (uuidPattern.test(fullPath)) {
        return fullPath.replace(uuidPattern, '')
      }
      return fullPath
    }

    // Process folders - only direct children
    folders.forEach(folderPath => {
      const relativePath = extractRelativePath(folderPath)
      console.log('Processing folder:', folderPath, '-> relative:', relativePath)

      // Check if this folder is a direct child of the parent folder
      const expectedPrefix = parentFolderPath ? `${parentFolderPath}/` : ''

      if (relativePath.startsWith(expectedPrefix)) {
        const remainingPath = relativePath.substring(expectedPrefix.length)
        // Remove trailing slashes and check if it's a direct child (no more slashes)
        const cleanPath = remainingPath.replace(/\/+$/, '')

        if (cleanPath && !cleanPath.includes('/')) {
          const node: TreeNode = {
            name: cleanPath,
            path: parentFolderPath ? `${parentFolderPath}/${cleanPath}` : cleanPath,
            type: 'folder',
            children: [],
            expanded: false,
            loaded: false,
            loading: false
          }
          children.push(node)
          console.log('Added folder child:', cleanPath)
        }
      }
    })

    // Process files - only direct children
    files.forEach(file => {
      const relativePath = extractRelativePath(file.key)
      console.log('Processing file:', file.key, '-> relative:', relativePath)

      const expectedPrefix = parentFolderPath ? `${parentFolderPath}/` : ''

      if (relativePath.startsWith(expectedPrefix)) {
        const remainingPath = relativePath.substring(expectedPrefix.length)

        // Check if it's a direct child (no more slashes in the remaining path)
        if (remainingPath && !remainingPath.includes('/')) {
          const node: TreeNode = {
            name: remainingPath,
            path: relativePath,
            type: 'file',
            size: file.size,
            lastModified: file.last_modified,
            fileType: file.type,
            fullS3Path: file.key
          }
          children.push(node)
          console.log('Added file child:', remainingPath)
        }
      }
    })

    console.log('Final children count:', children.length)
    return children
  }, [])

  // Fetch files and folders for the entire tree
  const fetchData = useCallback(async () => {
    if (!session?.tokens) return

    setLoading(true)
    setError(null)

    const accessToken = session.tokens.accessToken?.toString()
    if (!accessToken) {
      setError('No access token available')
      setLoading(false)
      return
    }

    try {
      // Fetch only root level files - no prefix means root level for this user
      const response = await axios.get(`${POCKETDAT_API}/files/list`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const files: FileItem[] = response.data.files || []
      const folders: string[] = response.data.folders || []

      console.log('Root API response - files:', files.length, 'folders:', folders.length)
      console.log('Sample files:', files.slice(0, 3).map(f => f.key))
      console.log('Sample folders:', folders.slice(0, 3))

      const treeNodes = buildTreeFromData(files, folders)
      console.log('Built root tree nodes:', treeNodes.length)
      setTree(treeNodes)
    } catch (err) {
      setError('Failed to fetch files.')
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [session, buildTreeFromData])

  // Fetch contents of a specific folder
  const fetchFolderContents = useCallback(async (folderPath: string) => {
    if (!session?.tokens) return

    const accessToken = session.tokens.accessToken?.toString()
    if (!accessToken) return

    setLoadingFolders(prev => new Set([...prev, folderPath]))

    try {
      console.log('Fetching folder contents for:', folderPath)

      // Call the list endpoint with the folder prefix
      const response = await axios.get(`${POCKETDAT_API}/files/list`, {
        params: { prefix: folderPath },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const files: FileItem[] = response.data.files || []
      const folders: string[] = response.data.folders || []

      console.log(`Folder ${folderPath} contents - files:`, files.length, 'folders:', folders.length)

      // Build nodes for this folder's contents using the specialized function
      const folderChildren = buildFolderChildren(files, folders, folderPath)

      // Update the tree to add these contents to the correct folder
      setTree(prevTree => {
        const updateNode = (nodes: TreeNode[]): TreeNode[] => {
          return nodes.map(node => {
            if (node.path === folderPath && node.type === 'folder') {
              return {
                ...node,
                children: folderChildren,
                loaded: true,
                loading: false
              }
            }
            if (node.children) {
              return { ...node, children: updateNode(node.children) }
            }
            return node
          })
        }
        return updateNode(prevTree)
      })

    } catch (err) {
      console.error('Failed to fetch folder contents:', err)
      setError('Failed to load folder contents.')
    } finally {
      setLoadingFolders(prev => {
        const newSet = new Set(prev)
        newSet.delete(folderPath)
        return newSet
      })
    }
  }, [session, buildFolderChildren, setLoadingFolders])

  // Load file content for preview
  const loadFileContent = useCallback(async (filePath: string, fileName: string) => {
    if (!session?.tokens) return

    setLoadingContent(true)
    const accessToken = session.tokens.accessToken?.toString()

    // Helper function to check if file is an image
    const isImageFile = (name: string): boolean => {
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico']
      const extension = name.split('.').pop()?.toLowerCase()
      return imageExtensions.includes(extension || '')
    }

    try {
      const response = await axios.get(`${POCKETDAT_API}/files/download`, {
        params: { key: filePath },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.data?.url) {
        setDownloadUrl(response.data.url)

        // For images, we don't need to fetch content, just use the URL
        if (isImageFile(fileName)) {
          setFileContent(null) // We'll use downloadUrl for images
        } else {
          // For text files, fetch the content
          try {
            const contentResponse = await fetch(response.data.url)
            const content = await contentResponse.text()
            setFileContent(content)
          } catch (textError) {
            console.error('Failed to fetch text content:', textError)
            setFileContent(null)
          }
        }
      }
    } catch (err) {
      console.error('Failed to load file content:', err)
      setFileContent(null)
      setDownloadUrl(null)
    } finally {
      setLoadingContent(false)
    }
  }, [session])

  // Handle node selection
  const handleNodeSelect = useCallback((node: TreeNode) => {
    setSelectedNode(node)

    if (node.type === 'file') {
      // Use fullS3Path for backend operations, fallback to path if not available
      const backendPath = node.fullS3Path || node.path
      loadFileContent(backendPath, node.name)
    } else {
      setFileContent(null)
      setDownloadUrl(null)
    }
  }, [loadFileContent])

  // Handle folder toggle
  const handleFolderToggle = useCallback(async (path: string) => {
    setTree(prevTree => {
      const updateNode = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map(node => {
          if (node.path === path && node.type === 'folder') {
            const newExpanded = !node.expanded

            // If expanding and not loaded yet, we'll fetch contents
            if (newExpanded && !node.loaded && !node.loading) {
              // Mark as loading and fetch contents
              setTimeout(() => fetchFolderContents(path), 0)
              return { ...node, expanded: newExpanded, loading: true }
            }

            return { ...node, expanded: newExpanded }
          }
          if (node.children) {
            return { ...node, children: updateNode(node.children) }
          }
          return node
        })
      }
      return updateNode(prevTree)
    })
  }, [fetchFolderContents])

  // Handle download
  const handleDownload = useCallback(async (filePath: string) => {
    if (!session?.tokens) return

    const accessToken = session.tokens.accessToken?.toString()
    if (!accessToken) return

    try {
      const response = await axios.get(`${POCKETDAT_API}/files/download`, {
        params: { key: filePath },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.data?.url) {
        window.open(response.data.url, '_blank')
      }
    } catch (err) {
      console.error('Download failed:', err)
      setError('Failed to download file.')
    }
  }, [session])

  // Handle delete
  const handleDelete = useCallback(async (filePath: string) => {
    if (!session?.tokens) return

    const accessToken = session.tokens.accessToken?.toString()
    if (!accessToken) return

    // Show confirmation dialog
    if (!window.confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      return
    }

    setDeletingFiles(prev => new Set([...prev, filePath]))

    try {
      await axios.delete(`${POCKETDAT_API}/files/delete`, {
        params: { key: filePath },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Refresh the tree after successful delete
      await fetchData()

      // Clear selection if deleted file was selected
      if (selectedNode && (selectedNode.fullS3Path === filePath || selectedNode.path === filePath)) {
        setSelectedNode(null)
        setFileContent(null)
      }
    } catch (err) {
      console.error('Delete failed:', err)
      setError('Failed to delete file.')
    } finally {
      setDeletingFiles(prev => {
        const newSet = new Set(prev)
        newSet.delete(filePath)
        return newSet
      })
    }
  }, [session, fetchData, selectedNode])

  // Handle upload
  const handleUpload = useCallback(async (file: File, folderPrefix: string) => {
    if (!session?.tokens) {
      setError('No authentication session available')
      return
    }

    const accessToken = session.tokens.accessToken?.toString()

    if (!accessToken) {
      setError('No access token available')
      return
    }

    console.log('Uploading file:', file.name, 'to folder prefix:', folderPrefix)

    try {
      // Backend will handle adding user prefix internally, just send the folder path
      await UploadService.uploadFile({
        endpoint: `${POCKETDAT_API}/files/upload`,
        file,
        uploadRequest: {
          file_name: file.name,
          byte_size: file.size,
          file_type: file.type,
          folder_prefix: folderPrefix, // Send the folder path as-is (e.g., "", "folder1", "folder1/subfolder")
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
          // Refresh the specific folder or root after successful upload
          if (folderPrefix) {
            fetchFolderContents(folderPrefix)
          } else {
            fetchData() // Refresh root
          }
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
  }, [session, fetchData, fetchFolderContents])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-night text-offWhite">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-asparagus-400 mx-auto mb-4"></div>
          <p>Loading files...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-night text-red-400">
        <p>Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="flex h-full bg-night text-offWhite">
      {/* Left Sidebar - File Tree */}
      <div className="w-1/3 min-w-80 border-r border-main-700 bg-main-900 bg-opacity-30">
        <FileTree
          nodes={tree}
          selectedNode={selectedNode}
          onNodeSelect={handleNodeSelect}
          onFolderToggle={handleFolderToggle}
          onUpload={handleUpload}
        />
      </div>

      {/* Right Panel - Content View */}
      <div className="flex-1 bg-night">
        {selectedNode ? (
          selectedNode.type === 'file' ? (
            <FilePreview
              node={selectedNode}
              content={fileContent}
              loading={loadingContent}
              onDownload={handleDownload}
              onDelete={handleDelete}
              deleting={deletingFiles.has(selectedNode!.fullS3Path || selectedNode!.path)}
              downloadUrl={downloadUrl}
            />
          ) : (
            <FileView
              node={selectedNode}
              tree={tree}
              onDownload={handleDownload}
              onDelete={handleDelete}
              deletingFiles={deletingFiles}
            />
          )
        ) : (
          <div className="flex items-center justify-center h-full text-asparagus-300">
            <div className="text-center">
              <div className="text-6xl mb-4">📁</div>
              <p className="text-xl">Select a file or folder to view its contents</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
