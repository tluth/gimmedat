import axios from 'axios'
import { POCKETDAT_API, TEXT_FILE_PREVIEW_SIZE_LIMIT } from '@/constants'
import { FileItem } from './types'
import { isImageFile, isTextFile } from '@/components/FileBrowser/utils'

/**
 * Response from the list files endpoint
 */
export interface ListFilesResponse {
  files: FileItem[]
  folders: string[]
}

/**
 * Response from the download endpoint
 */
export interface DownloadUrlResponse {
  url: string
}

/**
 * Response for file content with download URL
 */
export interface FileContentResponse {
  downloadUrl: string
  content: string | null
}

/**
 * Service for interacting with Pocketdat file storage backend
 * Handles authenticated file operations including listing, downloading, uploading, and deleting files
 */
export class PocketdatFileService {
  /**
   * Fetch root level files and folders for the authenticated user
   * @param accessToken - JWT access token for authentication
   * @returns List of files and folders
   */
  static async fetchRootFiles(accessToken: string): Promise<ListFilesResponse> {
    try {
      const response = await axios.get<ListFilesResponse>(`${POCKETDAT_API}/files/list`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })

      return {
        files: response.data.files || [],
        folders: response.data.folders || [],
      }
    } catch (error) {
      console.error('Failed to fetch root files:', error)
      throw new Error('Failed to fetch files')
    }
  }

  /**
   * Fetch files and folders within a specific folder path
   * @param accessToken - JWT access token for authentication
   * @param folderPath - The folder path prefix to list contents from
   * @returns List of files and folders within the specified path
   */
  static async fetchFolderContents(
    accessToken: string,
    folderPath: string
  ): Promise<ListFilesResponse> {
    try {
      const response = await axios.get<ListFilesResponse>(`${POCKETDAT_API}/files/list`, {
        params: { prefix: folderPath },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })

      return {
        files: response.data.files || [],
        folders: response.data.folders || [],
      }
    } catch (error) {
      console.error('Failed to fetch folder contents:', error)
      throw new Error('Failed to load folder contents')
    }
  }

  /**
   * Get presigned download URL for a file
   * @param accessToken - JWT access token for authentication
   * @param fileKey - The S3 key/path of the file
   * @returns Presigned download URL
   */
  static async getDownloadUrl(accessToken: string, fileKey: string): Promise<string> {
    try {
      const response = await axios.get<DownloadUrlResponse>(
        `${POCKETDAT_API}/files/download`,
        {
          params: { key: fileKey },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      if (!response.data?.url) {
        throw new Error('No download URL returned')
      }

      return response.data.url
    } catch (error) {
      console.error('Failed to get download URL:', error)
      throw new Error('Failed to load file')
    }
  }

  /**
   * Load file content for preview (text files) or get download URL (images)
   * @param accessToken - JWT access token for authentication
   * @param filePath - The S3 key/path of the file
   * @param fileName - Name of the file to determine type
   * @returns File content and download URL
   */
  static async loadFileContent(
    accessToken: string,
    filePath: string,
    fileName: string
  ): Promise<FileContentResponse> {
    const downloadUrl = await this.getDownloadUrl(accessToken, filePath)

    // For images, we don't need to fetch content, just use the URL
    if (isImageFile(fileName)) {
      return {
        downloadUrl,
        content: null,
      }
    }

    // For text files, fetch and return the content
    if (isTextFile(fileName)) {
      try {
        const contentResponse = await fetch(downloadUrl, {
          method: 'GET',
          mode: 'cors',
          credentials: 'omit',
        })

        if (!contentResponse.ok) {
          console.error(
            `Failed to fetch content: ${contentResponse.status} ${contentResponse.statusText}`
          )
          console.error(
            `Response headers:`,
            Object.fromEntries(contentResponse.headers.entries())
          )

          if (contentResponse.status === 403) {
            throw new Error(
              `Access denied (403). This could be due to: 1) Expired signed URL, 2) Incorrect file permissions, 3) CORS issues. Try refreshing the page.`
            )
          }

          throw new Error(`HTTP ${contentResponse.status}: ${contentResponse.statusText}`)
        }

        const contentLength = contentResponse.headers.get('content-length')
        const fileSize = contentLength ? parseInt(contentLength) : 0

        if (fileSize > TEXT_FILE_PREVIEW_SIZE_LIMIT) {
          console.log(`File too large for preview: ${fileSize} bytes`)
          return {
            downloadUrl,
            content: `File is too large to preview (${Math.round(fileSize / 1024)} KB). Please download to view.`,
          }
        }

        const content = await contentResponse.text()

        // Additional safety check for content length
        if (content.length > TEXT_FILE_PREVIEW_SIZE_LIMIT) {
          return {
            downloadUrl,
            content: `File is too large to preview (${Math.round(content.length / 1024)} KB). Please download to view.`,
          }
        }

        return {
          downloadUrl,
          content,
        }
      } catch (textError) {
        console.error('Failed to fetch text content:', textError)
        throw new Error(
          `Failed to load file content. ${textError instanceof Error ? textError.message : 'Unknown error'}`
        )
      }
    }

    // For binary files, don't fetch content
    return {
      downloadUrl,
      content: null,
    }
  }

  /**
   * Delete a file from storage
   * @param accessToken - JWT access token for authentication
   * @param fileKey - The S3 key/path of the file to delete
   */
  static async deleteFile(accessToken: string, fileKey: string): Promise<void> {
    try {
      await axios.delete(`${POCKETDAT_API}/files/delete`, {
        params: { key: fileKey },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })
    } catch (error) {
      console.error('Delete failed:', error)
      throw new Error('Failed to delete file')
    }
  }

  /**
   * Move/rename a file in storage
   * @param accessToken - JWT access token for authentication
   * @param sourceKey - The current S3 key/path of the file
   * @param destinationKey - The new S3 key/path for the file
   */
  static async moveFile(
    accessToken: string,
    sourceKey: string,
    destinationKey: string
  ): Promise<void> {
    try {
      await axios.put(
        `${POCKETDAT_API}/files/move`,
        {
          source_key: sourceKey,
          destination_key: destinationKey,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
    } catch (error) {
      console.error('Move failed:', error)
      throw new Error('Failed to move file')
    }
  }

  /**
   * Trigger a download of a file in the browser
   * @param accessToken - JWT access token for authentication
   * @param fileKey - The S3 key/path of the file to download
   */
  static async downloadFile(accessToken: string, fileKey: string): Promise<void> {
    try {
      const url = await this.getDownloadUrl(accessToken, fileKey)
      window.open(url, '_blank')
    } catch (error) {
      console.error('Download failed:', error)
      throw new Error('Failed to download file')
    }
  }
}
