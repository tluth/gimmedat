import React from 'react'
import { TreeNode } from './ModernFileBrowser'

interface FilePreviewProps {
  node: TreeNode
  content: string | null
  loading: boolean
  onDownload: (filePath: string) => void
  onDelete: (filePath: string) => void
  deleting: boolean
  downloadUrl?: string | null
}

const formatFileSize = (sizeString: string): string => {
  // If already formatted, return as is
  if (sizeString.includes('KB') || sizeString.includes('MB') || sizeString.includes('GB')) {
    return sizeString
  }

  const bytes = parseInt(sizeString)
  if (isNaN(bytes)) return sizeString

  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}

const getFileIcon = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase()

  switch (extension) {
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
      return '⚡'
    case 'py':
      return '🐍'
    case 'json':
      return '📋'
    case 'md':
    case 'txt':
      return '📄'
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
      return '🖼️'
    case 'pdf':
      return '📕'
    case 'zip':
    case 'tar':
    case 'gz':
      return '📦'
    case 'css':
    case 'scss':
      return '🎨'
    case 'html':
      return '🌐'
    case 'xml':
      return '📰'
    case 'csv':
      return '📊'
    case 'mp4':
    case 'avi':
    case 'mov':
      return '🎬'
    case 'mp3':
    case 'wav':
    case 'flac':
      return '🎵'
    default:
      return '📄'
  }
}

const isTextFile = (fileName: string): boolean => {
  const textExtensions = [
    'txt', 'md', 'json', 'js', 'jsx', 'ts', 'tsx', 'py', 'html', 'css', 'scss',
    'xml', 'csv', 'yaml', 'yml', 'toml', 'ini', 'conf', 'log', 'sql', 'sh',
    'bat', 'dockerfile', 'gitignore', 'gitattributes', 'env', 'properties'
  ]

  const extension = fileName.split('.').pop()?.toLowerCase()
  return textExtensions.includes(extension || '') || !extension
}

const isImageFile = (fileName: string): boolean => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico']
  const extension = fileName.split('.').pop()?.toLowerCase()
  return imageExtensions.includes(extension || '')
}

const getLanguageFromExtension = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase()

  switch (extension) {
    case 'js':
    case 'jsx':
      return 'javascript'
    case 'ts':
    case 'tsx':
      return 'typescript'
    case 'py':
      return 'python'
    case 'json':
      return 'json'
    case 'html':
      return 'html'
    case 'css':
      return 'css'
    case 'scss':
      return 'scss'
    case 'xml':
      return 'xml'
    case 'sql':
      return 'sql'
    case 'sh':
      return 'bash'
    case 'yaml':
    case 'yml':
      return 'yaml'
    case 'md':
      return 'markdown'
    default:
      return 'text'
  }
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  node,
  content,
  loading,
  onDownload,
  onDelete,
  deleting,
  downloadUrl
}) => {
  console.log(node)
  const renderPreview = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-asparagus-400 mx-auto mb-4"></div>
            <p className="text-asparagus-300">Loading file content...</p>
          </div>
        </div>
      )
    }

    if (!content) {
      return (
        <div className="flex items-center justify-center h-64 text-asparagus-300">
          <div className="text-center">
            <div className="text-4xl mb-4">📄</div>
            <p>Unable to preview this file</p>
            <p className="text-sm mt-2">Click download to view the file</p>
          </div>
        </div>
      )
    }

    // Handle different file types
    if (isImageFile(node.name)) {
      // For images, use the download URL directly instead of trying to base64 encode
      if (downloadUrl) {
        return (
          <div className="flex items-center justify-center p-4">
            <img
              src={downloadUrl}
              alt={node.name}
              className="max-w-full max-h-96 object-contain rounded-lg shadow-lg"
              onError={(e) => {
                console.error('Failed to load image:', e)
                // Fallback to generic file icon
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
          </div>
        )
      } else {
        return (
          <div className="flex items-center justify-center h-64 text-asparagus-300">
            <div className="text-center">
              <div className="text-4xl mb-4">🖼️</div>
              <p>Loading image...</p>
            </div>
          </div>
        )
      }
    }

    if (isTextFile(node.name)) {
      const language = getLanguageFromExtension(node.name)

      return (
        <div className="h-full">
          <pre className={`language-${language} text-sm p-4 overflow-auto h-full bg-main-900 bg-opacity-30 rounded-lg`}>
            <code className="text-offWhite whitespace-pre-wrap break-words">
              {content}
            </code>
          </pre>
        </div>
      )
    }

    // For binary files or unknown types
    return (
      <div className="flex items-center justify-center h-64 text-asparagus-300">
        <div className="text-center">
          <div className="text-4xl mb-4">{getFileIcon(node.name)}</div>
          <p>Binary file - cannot preview</p>
          <p className="text-sm mt-2">Click download to view the file</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-main-700 bg-main-900 bg-opacity-20 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getFileIcon(node.name)}</span>
            <div>
              <h1 className="text-2xl font-semibold text-asparagus-400">{node.name}</h1>
              <p className="text-asparagus-300 text-sm">{node.path}</p>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              className="px-4 py-2 bg-asparagus-600 hover:bg-asparagus-500 text-white font-semibold rounded transition-colors duration-150"
              onClick={() => onDownload(node.fullS3Path || node.path)}
            >
              Download
            </button>
            <button
              className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-red-400 disabled:cursor-not-allowed text-white font-semibold rounded transition-colors duration-150"
              onClick={() => onDelete(node.fullS3Path || node.path)}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>

        <div className="mt-4 flex space-x-6 text-sm text-asparagus-300">
          <span>{node.size ? formatFileSize(node.size) : 'Unknown size'}</span>
          <span>•</span>
          <span>{node.lastModified ? formatDate(node.lastModified) : 'Unknown date'}</span>
          {node.fileType && (
            <>
              <span>•</span>
              <span className="capitalize">{node.fileType}</span>
            </>
          )}
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full p-6">
          {renderPreview()}
        </div>
      </div>
    </div>
  )
}
