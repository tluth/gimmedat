import React, { useEffect, useRef } from 'react'
import { TreeNode } from './types'
import { formatDate, niceBytes } from '@/utils'
import { getFileIcon, getLanguageFromExtension, isImageFile, isTextFile } from './utils'

import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'

import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-markup'

interface FilePreviewProps {
  node: TreeNode
  content: string | null
  loading: boolean
  onDownload: (filePath: string) => void
  onDelete: (filePath: string) => void
  deleting: boolean
  downloadUrl?: string | null
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
  const codeRef = useRef<HTMLElement>(null)

  // Apply syntax highlighting after content changes
  useEffect(() => {
    if (content && isTextFile(node.name) && !loading && codeRef.current) {
      // Small delay to ensure DOM is updated
      const timer = setTimeout(() => {
        Prism.highlightElement(codeRef.current!)
      }, 10)

      return () => clearTimeout(timer)
    }
  }, [content, node.name, loading])

  const renderPreview = () => {
    if (loading) {
      return (
        <div className="flex-1 flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-asparagus-400 mx-auto mb-4"></div>
            <p className="text-asparagus-300">Loading file content...</p>
          </div>
        </div>
      )
    }

    // Handle images first - they use downloadUrl instead of content
    if (isImageFile(node.name)) {
      if (downloadUrl) {
        return (
          <div className="flex-1 flex items-center justify-center p-4">
            <img
              src={downloadUrl}
              alt={node.name}
              className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              onError={(e) => {
                console.error('Failed to load image:', e)
                // Replace with error message
                const container = e.currentTarget.parentElement
                if (container) {
                  container.innerHTML = `
                    <div class="text-center text-asparagus-300">
                      <div class="text-4xl mb-4">🖼️</div>
                      <p>Failed to load image</p>
                      <p class="text-sm mt-2">The image may be corrupted or unavailable</p>
                    </div>
                  `
                }
              }}
              onLoad={() => {
                console.log(`Successfully loaded image: ${node.name}`)
              }}
            />
          </div>
        )
      } else {
        return (
          <div className="flex-1 flex items-center justify-center min-h-64 text-asparagus-300">
            <div className="text-center">
              <div className="text-4xl mb-4">🖼️</div>
              <p>Loading image...</p>
            </div>
          </div>
        )
      }
    }

    // For non-image files, check if we have content
    if (!content) {
      if (isTextFile(node.name)) {
        return (
          <div className="flex-1 flex items-center justify-center min-h-64 text-asparagus-300">
            <div className="text-center">
              <div className="text-4xl mb-4">📄</div>
              <p>Unable to load text content</p>
              <p className="text-sm mt-2">The file may be empty, corrupted, or too large</p>
              <p className="text-sm">Click download to view the file</p>
            </div>
          </div>
        )
      } else {
        return (
          <div className="flex-1 flex items-center justify-center min-h-64 text-asparagus-300">
            <div className="text-center">
              <div className="text-4xl mb-4">{getFileIcon(node.name)}</div>
              <p>Binary file - no preview available</p>
              <p className="text-sm mt-2">Click download to view the file</p>
            </div>
          </div>
        )
      }
    }

    // For text files, render the content with syntax highlighting
    if (isTextFile(node.name)) {
      const language = getLanguageFromExtension(node.name)

      const isErrorMessage = content.startsWith('File is too large') || content.startsWith('Failed to load')

      if (isErrorMessage) {
        return (
          <div className="flex-1 flex items-center justify-center min-h-64 text-asparagus-300">
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <p className="text-yellow-400 font-medium">{content}</p>
              <p className="text-sm mt-2">Click download to access the full file</p>
            </div>
          </div>
        )
      }

      return (
        <div className="flex-1 flex flex-col">
          <pre className={`language-${language} text-sm p-4 overflow-auto flex-1 bg-main-900 bg-opacity-30 rounded-lg`}>
            <code ref={codeRef} className={`language-${language} text-offWhite whitespace-pre-wrap break-words`}>
              {content}
            </code>
          </pre>
        </div>
      )
    }

    // For binary files or unknown types that somehow still have content
    return (
      <div className="flex-1 flex items-center justify-center min-h-64 text-asparagus-300">
        <div className="text-center">
          <div className="text-4xl mb-4">{getFileIcon(node.name)}</div>
          <p>Preview not supported for this file type</p>
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
              onClick={() => onDownload(node.path)}
            >
              Download
            </button>
            <button
              className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-red-400 disabled:cursor-not-allowed text-white font-semibold rounded transition-colors duration-150"
              onClick={() => onDelete(node.path)}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>

        <div className="mt-4 flex space-x-6 text-sm text-asparagus-300">
          <span>{node.size ? niceBytes(parseInt(node.size)) : 'Unknown size'}</span>
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
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 p-6 flex flex-col">
          {renderPreview()}
        </div>
      </div>
    </div>
  )
}
