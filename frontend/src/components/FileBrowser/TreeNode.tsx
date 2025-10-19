import React from 'react'
import { getFileIcon } from './utils'
import { TreeNode } from './types'

interface TreeNodeComponentProps {
  node: TreeNode
  depth: number
  selectedNode: TreeNode | null
  onNodeSelect: (node: TreeNode) => void
  onFolderToggle: (path: string) => void
  onMoveFile?: (sourceKey: string, destinationKey: string) => Promise<void>
}

const TreeNodeComponent: React.FC<TreeNodeComponentProps> = ({
  node,
  depth,
  selectedNode,
  onNodeSelect,
  onFolderToggle,
  onMoveFile
}) => {
  const isSelected = selectedNode?.path === node.path
  const indentStyle = { paddingLeft: `${depth * 20 + 12}px` }
  const [isDragOver, setIsDragOver] = React.useState(false)

  const handleClick = () => {
    if (node.type === 'folder') {
      onFolderToggle(node.path)
    }
    onNodeSelect(node)
  }

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (node.type === 'folder') {
      onFolderToggle(node.path)
    }
  }

  // Drag event handlers
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      type: node.type,
      path: node.path,
      name: node.name
    }))
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    if (node.type === 'folder') {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
      setIsDragOver(true)
    }
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    if (node.type !== 'folder' || !onMoveFile) return

    try {
      const dragData = JSON.parse(e.dataTransfer.getData('text/plain'))

      // Don't allow dropping onto self
      if (dragData.path === node.path) return

      // Don't allow dropping a folder into its own child
      if (dragData.type === 'folder' && node.path.startsWith(dragData.path + '/')) return

      // Calculate source path - for folders, ensure it has trailing slash
      let sourceKey = dragData.path
      if (dragData.type === 'folder' && !sourceKey.endsWith('/')) {
        sourceKey += '/'
      }

      // Calculate destination path
      let destinationKey
      if (dragData.type === 'folder') {
        // For folders, destination should be: target_folder/source_folder_name/
        const folderName = dragData.name
        if (node.path) {
          destinationKey = `${node.path}/${folderName}/`
        } else {
          destinationKey = `${folderName}/`
        }
      } else {
        // For files, destination should be: target_folder/filename
        const fileName = dragData.name
        if (node.path) {
          destinationKey = `${node.path}/${fileName}`
        } else {
          destinationKey = fileName
        }
      }

      await onMoveFile(sourceKey, destinationKey)
    } catch (error) {
      console.error('Error moving file:', error)
    }
  }

  return (
    <>
      <div
        className={`flex items-center py-1 px-2 cursor-pointer hover:bg-main-700 hover:bg-opacity-50 transition-colors duration-150 ${
          isSelected ? 'bg-asparagus-600 bg-opacity-30 text-asparagus-200' : 'text-offWhite'
        } ${isDragOver ? 'bg-asparagus-500 bg-opacity-50 border-2 border-asparagus-400 border-dashed' : ''}`}
        style={indentStyle}
        onClick={handleClick}
        draggable={true}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        title={node.type === 'folder' ? 'Drag to move • Drop here to move files into this folder' : 'Drag to move this file'}
      >
        {node.type === 'folder' && (
          <button
            className="mr-2 text-xs w-4 h-4 flex items-center justify-center hover:bg-main-600 rounded"
            onClick={handleToggleClick}
          >
            {node.loading ? '⟳' : node.expanded ? '▼' : '▶'}
          </button>
        )}

        <div className="flex items-center flex-1 min-w-0">
          <span className="mr-2 text-sm">
            {node.type === 'folder' ? '📁' : getFileIcon(node.name)}
          </span>
          <span className="truncate text-sm font-medium">{node.name}</span>
        </div>
      </div>

      {/* Render children if folder is expanded */}
      {node.type === 'folder' && node.expanded && (
        <>
          {node.loading && (
            <div
              className="text-asparagus-300 text-xs italic py-1"
              style={{ paddingLeft: `${(depth + 1) * 20 + 12}px` }}
            >
              Loading...
            </div>
          )}
          {node.children && node.children.map((child) => (
            <TreeNodeComponent
              key={child.path}
              node={child}
              depth={depth + 1}
              selectedNode={selectedNode}
              onNodeSelect={onNodeSelect}
              onFolderToggle={onFolderToggle}
              onMoveFile={onMoveFile}
            />
          ))}
        </>
      )}
    </>
  )
}

export default TreeNodeComponent
