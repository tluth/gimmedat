import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { UploadButton } from './UploadButton';

interface FileBrowserProps {
  prefix?: string;
}

export const FileBrowser: React.FC<FileBrowserProps> = ({ prefix }) => {
  const { user } = useAuth();
  const [files, setFiles] = useState<string[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/files/list', {
          params: { prefix },
          headers: {
            Authorization: `Bearer ${user.signInUserSession.idToken.jwtToken}`,
          },
        });
        setFiles(response.data.files);
        setFolders(response.data.folders);
      } catch (err) {
        setError('Failed to fetch files.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [user, prefix]);

  const handleDownload = async (key: string) => {
    if (!user) return;
    try {
      const response = await axios.get('/api/files/download', {
        params: { key },
        headers: {
          Authorization: `Bearer ${user.signInUserSession.idToken.jwtToken}`,
        },
      });
      window.open(response.data, '_blank');
    } catch (err) {
      setError('Failed to generate download URL.');
      console.error(err);
    }
  };

  if (loading) return <p>Loading files...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      <UploadButton currentPrefix={prefix} />
      <h2 className="text-xl font-semibold mt-4">Folders</h2>
      {folders.length === 0 ? (
        <p>No folders found.</p>
      ) : (
        <ul>
          {folders.map((folder) => (
            <li key={folder} className="text-blue-400 cursor-pointer">
              {folder}
            </li>
          ))}
        </ul>
      )}

      <h2 className="text-xl font-semibold mt-4">Files</h2>
      {files.length === 0 ? (
        <p>No files found.</p>
      ) : (
        <ul>
          {files.map((file) => (
            <li key={file} className="flex justify-between items-center">
              <span>{file}</span>
              <button
                onClick={() => handleDownload(file)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
              >
                Download
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
