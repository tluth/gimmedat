import React from 'react'
import { TreeNode } from './types'
import { toast } from 'sonner'
import { MIN_FILE_SIZE, MAX_FILE_SIZE } from '../../constants'
import TreeNodeComponent from './TreeNode'

interface FileTreeProps {
  nodes: TreeNode[]
  selectedNode: TreeNode | null
  onNodeSelect: (node: TreeNode) => void
  onFolderToggle: (path: string) => void
  onUpload?: (file: File, prefix: string) => Promise<void>
  onCreateFolder?: () => void
  showCreateFolder?: boolean
  newFolderName?: string
  onNewFolderNameChange?: (name: string) => void
  creatingFolder?: boolean
  onToggleCreateFolder?: () => void
  onMoveFile?: (sourceKey: string, destinationKey: string) => Promise<void>
}

export const FileTree: React.FC<FileTreeProps> = ({
  nodes,
  selectedNode,
  onNodeSelect,
  onFolderToggle,
  onUpload,
  onCreateFolder,
  showCreateFolder,
  newFolderName,
  onNewFolderNameChange,
  creatingFolder,
  onToggleCreateFolder,
  onMoveFile
}) => {
  const [dragOver, setDragOver] = React.useState(false)
  const [uploading, setUploading] = React.useState(false)
  const [rootDragOver, setRootDragOver] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const validateFiles = (files: File[]): File[] => {
    const validFiles: File[] = []
    const invalidFiles: string[] = []

    files.forEach(file => {
      if (file.size < MIN_FILE_SIZE) {
        invalidFiles.push(`${file.name} (too small, minimum ${Math.round(MIN_FILE_SIZE / 1024)}KB)`)
      } else if (file.size > MAX_FILE_SIZE) {
        invalidFiles.push(`${file.name} (too large, maximum ${Math.round(MAX_FILE_SIZE / (1024 * 1024 * 1024))}GB)`)
      } else {
        validFiles.push(file)
      }
    })

    if (invalidFiles.length > 0) {
      toast.error(`Invalid files: ${invalidFiles.join(', ')}`)
    }

    return validFiles
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)

    if (!onUpload) return

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      const validFiles = validateFiles(files)
      if (validFiles.length > 0) {
        await uploadFiles(validFiles)
      }
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const validFiles = validateFiles(Array.from(files))
      if (validFiles.length > 0) {
        await uploadFiles(validFiles)
      }
    }
    // Reset the input so the same file can be selected again
    e.target.value = ''
  }

  const uploadFiles = async (files: File[]) => {
    if (!onUpload) return

    setUploading(true)

    try {
      // For folders, use the relative path (e.g., "folder1", "folder1/subfolder")
      // For root, use empty string
      const currentPath = selectedNode?.type === 'folder' ? selectedNode.path : ''
      const uploadLocation = selectedNode?.type === 'folder' ? selectedNode.name : 'Root'

      if (files.length === 1) {
        await toast.promise(
          onUpload(files[0], currentPath),
          {
            loading: `Uploading ${files[0].name} to ${uploadLocation}...`,
            success: `Successfully uploaded ${files[0].name}`,
            error: `Failed to upload ${files[0].name}`,
          }
        )
      } else {
        // Multiple files - upload sequentially with toast notifications
        toast.loading(`Uploading ${files.length} files to ${uploadLocation}...`)

        let successCount = 0
        for (const file of files) {
          try {
            await onUpload(file, currentPath)
            successCount++
          } catch (error) {
            console.error(`Failed to upload ${file.name}:`, error)
          }
        }

        toast.dismiss()
        if (successCount === files.length) {
          toast.success(`Successfully uploaded all ${files.length} files`)
        } else if (successCount > 0) {
          toast.warning(`Uploaded ${successCount} of ${files.length} files`)
        } else {
          toast.error('Failed to upload any files')
        }
      }
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDropzoneClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleRootDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setRootDragOver(true)
  }

  const handleRootDragLeave = () => {
    setRootDragOver(false)
  }

  const handleRootDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setRootDragOver(false)

    if (!onMoveFile) return

    try {
      const dragData = JSON.parse(e.dataTransfer.getData('text/plain'))

      // Don't allow dropping if already in root
      if (!dragData.path.includes('/')) return

      let sourceKey = dragData.path
      if (dragData.type === 'folder' && !sourceKey.endsWith('/')) {
        sourceKey += '/'
      }

      let destinationKey
      if (dragData.type === 'folder') {
        // For folders, destination should be: folder_name/
        destinationKey = `${dragData.name}/`
      } else {
        // For files, destination should be: filename
        destinationKey = dragData.name
      }

      console.log('Moving to root from:', sourceKey, 'to:', destinationKey)

      await onMoveFile(sourceKey, destinationKey)
    } catch (error) {
      console.error('Error moving to root:', error)
    }
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 border-b border-main-700">
        <h2 className="text-lg font-semibold text-asparagus-400">Files</h2>
        {selectedNode?.type === 'folder' && (
          <p className="text-xs text-asparagus-300 mt-1">
            Current folder: {selectedNode.name}
          </p>
        )}
      </div>

      {onUpload && (
        <div
          className={`m-4 p-4 border-2 border-dashed rounded-lg transition-colors duration-200 cursor-pointer ${
            dragOver
              ? 'border-asparagus-400 bg-asparagus-600 bg-opacity-10'
              : 'border-main-600 hover:border-asparagus-600 hover:bg-asparagus-600 hover:bg-opacity-5'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleDropzoneClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            accept="*/*"
          />
          <div className="text-center">
            <div className="text-3xl mb-3">
              {uploading ? '⏳' : dragOver ? '�' : '�📤'}
            </div>
            <p className="text-sm text-asparagus-300 font-medium">
              {uploading
                ? 'Uploading...'
                : dragOver
                  ? 'Drop files here!'
                  : 'Click to select or drag & drop files'
              }
            </p>
            <p className="text-xs text-asparagus-400 mt-2">
              Files: 1KB - 4GB • Multiple files supported
            </p>
            {selectedNode?.type === 'folder' && (
              <p className="text-xs text-asparagus-300 mt-2 px-3 py-1 bg-asparagus-600 bg-opacity-20 rounded-full inline-block">
                📁 {selectedNode.name}
              </p>
            )}
            {!selectedNode && (
              <p className="text-xs text-asparagus-300 mt-2 px-3 py-1 bg-main-600 bg-opacity-30 rounded-full inline-block">
                📁 Root folder
              </p>
            )}
          </div>
        </div>
      )}

      {onCreateFolder && (
        <div className="m-4 border-t border-main-700 pt-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-asparagus-400">Create Folder</h3>
            <button
              onClick={onToggleCreateFolder}
              className="text-xs text-asparagus-300 hover:text-asparagus-200 transition-colors duration-150"
            >
              {showCreateFolder ? 'Cancel' : 'New Folder'}
            </button>
          </div>

          {showCreateFolder && (
            <div className="space-y-3">
              <div className="text-xs text-asparagus-400">
                {selectedNode?.type === 'folder'
                  ? `Creating in: ${selectedNode.name}`
                  : 'Creating in: Root folder'
                }
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFolderName || ''}
                  onChange={(e) => onNewFolderNameChange?.(e.target.value)}
                  placeholder="Enter folder name"
                  className="flex-1 px-3 py-2 bg-main-700 bg-opacity-50 border border-main-600 rounded text-offWhite placeholder-asparagus-400 text-sm focus:outline-none focus:border-asparagus-500"
                  disabled={creatingFolder}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !creatingFolder && newFolderName?.trim()) {
                      onCreateFolder()
                    }
                  }}
                />
                <button
                  onClick={onCreateFolder}
                  disabled={creatingFolder || !newFolderName?.trim()}
                  className="bg-asparagus-600 hover:bg-asparagus-500 disabled:bg-asparagus-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-3 rounded text-sm transition-colors duration-150"
                >
                  {creatingFolder ? 'Creating...' : 'Create'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div
        className={`py-2 ${rootDragOver ? 'bg-asparagus-600 bg-opacity-20' : ''}`}
        onDragOver={handleRootDragOver}
        onDragLeave={handleRootDragLeave}
        onDrop={handleRootDrop}
      >
        {nodes.length === 0 ? (
          <div className="p-4 text-asparagus-300 italic text-center">
            No files or folders found
          </div>
        ) : (
          nodes.map((node) => (
            <TreeNodeComponent
              key={node.path}
              node={node}
              depth={0}
              selectedNode={selectedNode}
              onNodeSelect={onNodeSelect}
              onFolderToggle={onFolderToggle}
              onMoveFile={onMoveFile}
            />
          ))
        )}
      </div>
    </div>
  )
}
