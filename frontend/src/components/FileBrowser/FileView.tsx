import React from 'react'
import { TreeNode } from './types'
import { formatDate, niceBytes } from '@/utils'
import { getFileIcon } from './utils'

interface FileViewProps {
  node: TreeNode
  tree: TreeNode[]
  onDownload: (filePath: string) => void
  onDelete: (filePath: string) => void
  onNodeSelect: (node: TreeNode) => void
  deletingFiles: Set<string>
}

const findFolderContents = (folderPath: string, tree: TreeNode[]): TreeNode[] => {
  const findInNodes = (nodes: TreeNode[]): TreeNode[] => {
    for (const node of nodes) {
      if (node.path === folderPath && node.type === 'folder' && node.children) {
        return node.children
      }
      if (node.children) {
        const found = findInNodes(node.children)
        if (found.length > 0) return found
      }
    }
    return []
  }

  return findInNodes(tree)
}

export const FileView: React.FC<FileViewProps> = ({
  node,
  tree,
  onDownload,
  onDelete,
  onNodeSelect,
  deletingFiles
}) => {
  const folderContents = findFolderContents(node.path, tree)
  const files = folderContents.filter(item => item.type === 'file')
  const folders = folderContents.filter(item => item.type === 'folder')

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-main-700 bg-main-900 bg-opacity-20">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">📁</span>
          <div>
            <h1 className="text-2xl font-semibold text-asparagus-400">{node.name}</h1>
            <p className="text-asparagus-300 text-sm">{node.path}</p>
          </div>
        </div>

        <div className="mt-4 flex space-x-6 text-sm text-asparagus-300">
          <span>{folders.length} folders</span>
          <span>{files.length} files</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {folderContents.length === 0 ? (
          <div className="text-center py-12 text-asparagus-300">
            <div className="text-6xl mb-4">📂</div>
            <p className="text-xl">This folder is empty</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Folders Section */}
            {folders.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-main-400 mb-3 flex items-center">
                  <span className="mr-2">📁</span>
                  Folders ({folders.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {folders.map((folder) => (
                    <div
                      key={folder.path}
                      className="flex items-center p-3 bg-main-900 bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all duration-150 cursor-pointer border border-main-700 hover:border-asparagus-600"
                      onClick={() => onNodeSelect(folder)}
                    >
                      <span className="mr-3 text-lg">📁</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-offWhite font-medium truncate">{folder.name}</p>
                        <p className="text-asparagus-300 text-xs">Folder</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Files Section */}
            {files.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-main-400 mb-3 flex items-center">
                  <span className="mr-2">📄</span>
                  Files ({files.length})
                </h3>
                <div className="space-y-2">
                  {files.map((file) => (
                    <div
                      key={file.path}
                      className="flex items-center p-4 bg-main-900 bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all duration-150 border border-main-700 hover:border-asparagus-600"
                    >
                      <div
                        className="flex items-center flex-1 min-w-0 cursor-pointer"
                        onClick={() => onNodeSelect(file)}
                      >
                        <span className="mr-4 text-xl">{getFileIcon(file.name)}</span>

                        <div className="flex-1 min-w-0">
                          <p className="text-offWhite font-medium truncate">{file.name}</p>
                          <div className="flex items-center space-x-4 text-sm text-asparagus-300 mt-1">
                            <span>{file.size ? niceBytes(parseInt(file.size)) : 'Unknown size'}</span>
                            <span>•</span>
                            <span>{file.lastModified ? formatDate(file.lastModified) : 'Unknown date'}</span>
                            {file.fileType && (
                              <>
                                <span>•</span>
                                <span className="capitalize">{file.fileType}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2 ml-4">
                        <button
                          className="px-3 py-1 bg-asparagus-600 hover:bg-asparagus-500 text-white text-sm rounded transition-colors duration-150"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDownload(file.path)
                          }}
                        >
                          Download
                        </button>
                        <button
                          className="px-3 py-1 bg-red-600 hover:bg-red-500 disabled:bg-red-400 disabled:cursor-not-allowed text-white text-sm rounded transition-colors duration-150"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDelete(file.path)
                          }}
                          disabled={deletingFiles.has(file.path)}
                        >
                          {deletingFiles.has(file.path) ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
