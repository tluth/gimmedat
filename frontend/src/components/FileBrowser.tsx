import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@/hooks/useAuth'
import { UploadButton } from './UploadButton'
import { API, COGNITO_CLIENT_ID } from '@/constants'
import { FileItem } from '@/services/types'

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
      const lastUserKey = `CognitoIdentityServiceProvider.${COGNITO_CLIENT_ID}.LastAuthUser`
      const lastUser = localStorage.getItem(lastUserKey)
      const accessTokenKey = `CognitoIdentityServiceProvider.${COGNITO_CLIENT_ID}.${lastUser}.accessToken`
      const accessToken = localStorage.getItem(accessTokenKey)
      try {
        const response = await axios.get(`${API}/files/list`, {
          params: { prefix },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        console.log(response)
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

  const handleDownload = async (key: string) => {
    if (!session?.tokens) return
    try {
      const response = await axios.get('/api/files/download', {
        params: { key },
        headers: {
          Authorization: `Bearer ${session.tokens.idToken?.toString()}`,
        },
      })
      window.open(response.data, '_blank')
    } catch (err) {
      setError('Failed to generate download URL.')
      console.error(err)
    }
  }

  if (loading) return <p className="text-offWhite">Loading files...</p>
  if (error) return <p className="text-red-400">Error: {error}</p>

  return (
    <div className="bg-night text-offWhite p-6 rounded-lg">
      <UploadButton currentPrefix={prefix} />

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
                // onClick={() => handleDownload(file)}
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
