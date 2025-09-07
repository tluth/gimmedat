import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@/hooks/useAuth'
import { UploadButton } from './UploadButton'
import { POCKETDAT_API } from '@/constants'
import { FileItem } from '@/services/types'
import { UploadService } from "@/services/uploadService"

interface FileBrowserProps {
  prefix?: string
}

export const FileBrowser: React.FC<FileBrowserProps> = ({ prefix }) => {
  const { session } = useAuth()
  const [files, setFiles] = useState<FileItem[]>([])
  const [folders, setFolders] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

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
          params: { prefix },
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
  }, [session, prefix])

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
      <UploadButton currentPrefix={prefix} uploadHandler={uploadFileToFolder} />

      <h2 className="text-2xl font-semibold text-main-400 mt-6 mb-4">Folders</h2>
      {folders.length === 0 ? (
        <p className="text-asparagus-300 italic">No folders found.</p>
      ) : (
        <ul className="space-y-2 mb-6">
          {folders.map((folder) => (
            <li
              key={folder}
              className="text-main-300 hover:text-main-200 cursor-pointer transition-colors duration-150 flex items-center"
            >
              <span className="mr-2">📁</span>
              {folder}
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
                {file.name}
              </span>
              <button
                onClick={() => handleDownload(file.key)}
                className="bg-main-700 hover:bg-main-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-150"
              >
                Download
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
