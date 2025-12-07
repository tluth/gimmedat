import React, { useState, useEffect, useCallback } from 'react'
import { FileTree } from './FileTree'
import { FileView } from './FileView'
import { FilePreview } from './FilePreview'
import { StatusMessage } from '@/components/StatusMessage'
import { useAuth } from '@/hooks/useAuth'
import { POCKETDAT_API } from '@/constants'
import { FileItem } from '@/services/types'
import { UploadService } from '@/services/uploadService'
import { PocketdatFileService } from '@/services/pocketdatFileService'
import { TreeNode } from './types'
import { validateFolderName } from './utils'



interface FileBrowserProps {
  // No props yet
}

export const FileBrowser: React.FC<FileBrowserProps> = () => {
  const { session, isLoading: isAuthLoading, isAuthenticated } = useAuth()
  const [tree, setTree] = useState<TreeNode[]>([])
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [loadingContent, setLoadingContent] = useState<boolean>(false)
  const [deletingFiles, setDeletingFiles] = useState<Set<string>>(new Set())
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [, setLoadingFolders] = useState<Set<string>>(new Set())
  const [showCreateFolder, setShowCreateFolder] = useState<boolean>(false)
  const [newFolderName, setNewFolderName] = useState<string>('')
  const [creatingFolder, setCreatingFolder] = useState<boolean>(false)

  const buildTreeFromData = useCallback((files: FileItem[], folders: string[]) => {
    const nodeMap = new Map<string, TreeNode>()
    const rootNodes: TreeNode[] = []

    folders.forEach(folderPath => {

      // Skip empty folders
      if (!folderPath || folderPath === '/') {
        return
      }

      const pathParts = folderPath.split('/').filter((part: string) => part.length > 0)
      let currentPath = ''

      pathParts.forEach((part: string, index: number) => {
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

    files.forEach(file => {
      if (!file.key) {
        return
      }

      const pathParts = file.key.split('/')
      const fileName = pathParts[pathParts.length - 1]
      const filePath = file.key

      // Create folders for nested files if they don't exist
      let currentPath = ''
      pathParts.slice(0, -1).forEach((part: string, index: number) => {
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

      const fileNode: TreeNode = {
        name: fileName,
        path: filePath,
        type: 'file',
        size: file.size,
        lastModified: file.last_modified,
        fileType: file.type
      }

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
    return rootNodes
  }, [])

  const buildFolderChildren = useCallback((files: FileItem[], folders: string[], parentFolderPath: string) => {
    const children: TreeNode[] = []

    folders.forEach(folderPath => {

      // Check if this folder is a direct child of the parent folder
      const expectedPrefix = parentFolderPath ? `${parentFolderPath}/` : ''

      if (folderPath.startsWith(expectedPrefix)) {
        const remainingPath = folderPath.substring(expectedPrefix.length)
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
        }
      }
    })

    files.forEach(file => {
      const expectedPrefix = parentFolderPath ? `${parentFolderPath}/` : ''

      if (file.key.startsWith(expectedPrefix)) {
        const remainingPath = file.key.substring(expectedPrefix.length)

        if (remainingPath && !remainingPath.includes('/')) {
          const node: TreeNode = {
            name: remainingPath,
            path: file.key,
            type: 'file',
            size: file.size,
            lastModified: file.last_modified,
            fileType: file.type
          }
          children.push(node)
        }
      }
    })

    return children
  }, [])

  const fetchData = useCallback(async () => {
    if (isAuthLoading || !session?.tokens) {
      return
    }

    setLoading(true)
    setError(null)

    const accessToken = session.tokens.accessToken?.toString()
    if (!accessToken) {
      setError('No access token available')
      setLoading(false)
      return
    }

    try {
      const { files, folders } = await PocketdatFileService.fetchRootFiles(accessToken)
      const treeNodes = buildTreeFromData(files, folders)
      setTree(treeNodes)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch files.')
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [session, buildTreeFromData, isAuthLoading])

  const fetchFolderContents = useCallback(async (folderPath: string) => {
    if (!session?.tokens) return

    const accessToken = session.tokens.accessToken?.toString()
    if (!accessToken) return

    setLoadingFolders(prev => new Set([...prev, folderPath]))

    try {
      const { files, folders } = await PocketdatFileService.fetchFolderContents(
        accessToken,
        folderPath
      )

      const folderChildren = buildFolderChildren(files, folders, folderPath)

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
      setError(err instanceof Error ? err.message : 'Failed to load folder contents.')
    } finally {
      setLoadingFolders(prev => {
        const newSet = new Set(prev)
        newSet.delete(folderPath)
        return newSet
      })
    }
  }, [session, buildFolderChildren, setLoadingFolders])

  const loadFileContent = useCallback(async (filePath: string, fileName: string) => {
    if (!session?.tokens) return

    setLoadingContent(true)
    const accessToken = session.tokens.accessToken?.toString()

    try {
      const { downloadUrl, content } = await PocketdatFileService.loadFileContent(
        accessToken!,
        filePath,
        fileName
      )
      setDownloadUrl(downloadUrl)
      setFileContent(content)
    } catch (err) {
      console.error('Failed to load file content:', err)
      setFileContent(err instanceof Error ? err.message : 'Failed to load file content')
      setDownloadUrl(null)
    } finally {
      setLoadingContent(false)
    }
  }, [session])

  const handleNodeSelect = useCallback((node: TreeNode) => {
    setSelectedNode(node)
    if (node.type === 'file') {
      loadFileContent(node.path, node.name)
    } else {
      // For folders, clear file content and ensure folder contents are loaded
      setFileContent(null)
      setDownloadUrl(null)

      // If folder contents haven't been loaded yet, fetch them
      if (!node.loaded && !node.loading) {
        // Update the tree to mark this folder as loading and fetch its contents
        setTree(prevTree => {
          const updateNode = (nodes: TreeNode[]): TreeNode[] => {
            return nodes.map(treeNode => {
              if (treeNode.path === node.path && treeNode.type === 'folder') {
                // Mark as expanded and loading, then fetch contents
                setTimeout(() => fetchFolderContents(node.path), 0)
                return { ...treeNode, expanded: true, loading: true }
              }
              if (treeNode.children) {
                return { ...treeNode, children: updateNode(treeNode.children) }
              }
              return treeNode
            })
          }
          return updateNode(prevTree)
        })
      }
    }
  }, [loadFileContent, fetchFolderContents])

  const handleFolderToggle = useCallback(async (path: string) => {
    setTree(prevTree => {
      const updateNode = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map(node => {
          if (node.path === path && node.type === 'folder') {
            const newExpanded = !node.expanded

            // If expanding and not loaded yet, we'll fetch contents
            if (newExpanded && !node.loaded && !node.loading) {
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

  const handleDownload = useCallback(async (filePath: string) => {
    if (!session?.tokens) return

    const accessToken = session.tokens.accessToken?.toString()
    if (!accessToken) return

    try {
      await PocketdatFileService.downloadFile(accessToken, filePath)
    } catch (err) {
      console.error('Download failed:', err)
      setError(err instanceof Error ? err.message : 'Failed to download file.')
    }
  }, [session])

  const handleDelete = useCallback(async (filePath: string) => {
    if (!session?.tokens) return

    const accessToken = session.tokens.accessToken?.toString()
    if (!accessToken) return

    if (!window.confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      return
    }

    setDeletingFiles(prev => new Set([...prev, filePath]))

    try {
      await PocketdatFileService.deleteFile(accessToken, filePath)

      // Refresh the tree after successful delete
      await fetchData()
      if (selectedNode && selectedNode.path === filePath) {
        setSelectedNode(null)
        setFileContent(null)
      }
    } catch (err) {
      console.error('Delete failed:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete file.')
    } finally {
      setDeletingFiles(prev => {
        const newSet = new Set(prev)
        newSet.delete(filePath)
        return newSet
      })
    }
  }, [session, fetchData, selectedNode])

  const handleCreateFolder = useCallback(async () => {
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
      const basePath = selectedNode?.type === 'folder' ? selectedNode.path : ''
      const folderPath = basePath ? `${basePath}/${trimmedName}/` : `${trimmedName}/`

      // Create a placeholder file to represent the folder
      // We'll create a .keep file inside the folder
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
          // Refresh the tree after successful folder creation
          if (selectedNode?.type === 'folder') {
            fetchFolderContents(selectedNode.path)
          } else {
            fetchData()
          }

          setNewFolderName('')
          setShowCreateFolder(false)
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
  }, [session, newFolderName, selectedNode, fetchFolderContents, fetchData])

  const toggleCreateFolder = useCallback(() => {
    setShowCreateFolder(prev => !prev)
    if (showCreateFolder) {
      setNewFolderName('')
      setError(null)
    }
  }, [showCreateFolder])

  const handleMoveFile = useCallback(async (sourceKey: string, destinationKey: string) => {
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
      await PocketdatFileService.moveFile(accessToken, sourceKey, destinationKey)

      // Refresh the tree after successful move
      fetchData()
    } catch (error) {
      console.error('Move failed:', error)
      setError(error instanceof Error ? error.message : 'Failed to move file. Please try again.')
    }
  }, [session, fetchData])

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
          if (folderPrefix) {
            fetchFolderContents(folderPrefix)
          } else {
            fetchData()
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

  if (isAuthLoading) {
    return <StatusMessage type="loading" message="Authenticating..." showSpinner />
  }

  if (loading) {
    return <StatusMessage type="loading" message="Loading files..." showSpinner />
  }

  if (!isAuthenticated || !session) {
    return <StatusMessage type="error" message="Please sign in to view your files." />
  }

  if (error) {
    return <StatusMessage type="error" message={`Error: ${error}`} />
  }

  return (
    <div className="flex h-full bg-transparent text-offWhite overflow-hidden">
      <div className="w-1/3 min-w-80 max-w-96 border-r border-main-700 bg-transparent flex-shrink-0">
        <FileTree
          nodes={tree}
          selectedNode={selectedNode}
          onNodeSelect={handleNodeSelect}
          onFolderToggle={handleFolderToggle}
          onUpload={handleUpload}
          onCreateFolder={handleCreateFolder}
          showCreateFolder={showCreateFolder}
          newFolderName={newFolderName}
          onNewFolderNameChange={setNewFolderName}
          creatingFolder={creatingFolder}
          onToggleCreateFolder={toggleCreateFolder}
          onMoveFile={handleMoveFile}
        />
      </div>

      {/* Right Panel - Content View */}
      <div className="flex-1 bg-transparent min-w-0 overflow-hidden">
        {selectedNode ? (
          selectedNode.type === 'file' ? (
            <FilePreview
              node={selectedNode}
              content={fileContent}
              loading={loadingContent}
              onDownload={handleDownload}
              onDelete={handleDelete}
              deleting={deletingFiles.has(selectedNode!.path)}
              downloadUrl={downloadUrl}
            />
          ) : (
            <FileView
              node={selectedNode}
              tree={tree}
              onDownload={handleDownload}
              onDelete={handleDelete}
              onNodeSelect={handleNodeSelect}
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
