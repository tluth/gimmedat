import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';

interface UploadButtonProps {
  currentPrefix?: string;
}

export const UploadButton: React.FC<UploadButtonProps> = ({ currentPrefix }) => {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setUploadError(null);
      setUploadSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const getUploadUrlResponse = await axios.get('/api/files/upload', {
        params: {
          file_name: selectedFile.name,
          file_type: selectedFile.type,
          file_size: selectedFile.size,
          prefix: currentPrefix,
        },
        headers: {
          Authorization: `Bearer ${user.signInUserSession.idToken.jwtToken}`,
        },
      });

      const { url, fields } = getUploadUrlResponse.data;

      const formData = new FormData();
      for (const key in fields) {
        formData.append(key, fields[key]);
      }
      formData.append('file', selectedFile);

      await axios.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUploadSuccess(true);
      setSelectedFile(null);
    } catch (err) {
      setUploadError('Failed to upload file.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

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
  );
};
