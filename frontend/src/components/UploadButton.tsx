import React, { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface UploadButtonProps {
  currentPrefix?: string
  uploadHandler: (file: File, prefix: string) => Promise<void>
}

export const UploadButton: React.FC<UploadButtonProps> = ({ currentPrefix, uploadHandler }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState<boolean>(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])
      setUploadError(null)
      setUploadSuccess(false)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    console.log("oopospdofispodif")

    setUploading(true)
    setUploadError(null)
    setUploadSuccess(false)

    try {
      uploadHandler(selectedFile, currentPrefix || '')
      setUploadSuccess(true)
      setSelectedFile(null)
    } catch (err) {
      setUploadError('Failed to upload file.')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="mt-4 p-4 border rounded-lg">
      <h2 className="text-xl font-semibold mb-2">Upload File</h2>
      <input type="file" onChange={handleFileChange} className="mb-2" />
      <button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {uploadError && <p className="text-red-500 mt-2">{uploadError}</p>}
      {uploadSuccess && <p className="text-green-500 mt-2">Upload successful!</p>}
    </div>
  )
}
