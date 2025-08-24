export interface UploadRequest {
  file_name?: string
  byte_size?: number
  file_type?: string
  recipient_email?: string | null
  sender?: string | null
  [key: string]: string | number | boolean | null | undefined
}

export interface PresignedUploadData {
  url: string
  fields: Record<string, string>
  uuid?: string
}

export interface UploadResponse {
  presigned_upload_data: PresignedUploadData
  uuid?: string
}

export interface UploadOptions {
  endpoint: string
  file: File
  uploadRequest: UploadRequest
  headers?: Record<string, string>
  onProgress?: (progress: number) => void
  onSuccess?: (response: UploadResponse) => void
  onError?: (error: string) => void
}

export class UploadService {
  /**
   * Upload a file using presigned URL
   */
  static async uploadFile(options: UploadOptions): Promise<UploadResponse> {
    const {
      endpoint,
      file,
      uploadRequest,
      headers = {},
      onProgress,
      onSuccess,
      onError,
    } = options

    return new Promise((resolve, reject) => {
      // Step 1: Get presigned URL
      const xhr = new XMLHttpRequest()
      xhr.open("POST", endpoint)

      // Set default Content-Type
      xhr.setRequestHeader("Content-Type", "application/json")

      // Set custom headers (including auth tokens)
      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key])
      })

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            try {
              const response: UploadResponse = JSON.parse(xhr.responseText)

              // Step 2: Upload to S3 with progress tracking
              UploadService.uploadToS3(response.presigned_upload_data, file, {
                onProgress,
                onSuccess: () => {
                  onSuccess?.(response)
                  resolve(response)
                },
                onError: (error) => {
                  onError?.(error)
                  reject(new Error(error))
                },
              })
            } catch (parseError) {
              const errorMsg = "Failed to parse response"
              onError?.(errorMsg)
              reject(new Error(errorMsg))
            }
          } else if (xhr.status === 403) {
            const errorMsg =
              "Sorry, mate. I think you've had a few too many. Try again later."
            onError?.(errorMsg)
            reject(new Error(errorMsg))
          } else if (xhr.status === 401) {
            const errorMsg = "Authentication required. Please log in."
            onError?.(errorMsg)
            reject(new Error(errorMsg))
          } else {
            const errorMsg = "Problem submitting file."
            onError?.(errorMsg)
            reject(new Error(errorMsg))
          }
        }
      }

      xhr.onerror = function () {
        const errorMsg = "Network error occurred"
        onError?.(errorMsg)
        reject(new Error(errorMsg))
      }

      xhr.send(JSON.stringify(uploadRequest))
    })
  }

  /**
   * Upload file to S3 using presigned URL data
   */
  private static uploadToS3(
    presignedData: PresignedUploadData,
    file: File,
    callbacks: {
      onProgress?: (progress: number) => void
      onSuccess?: () => void
      onError?: (error: string) => void
    }
  ): void {
    const formData = new FormData()

    // Add presigned URL fields
    Object.keys(presignedData.fields).forEach((key: string) => {
      formData.append(key, presignedData.fields[key])
    })
    formData.append("file", file)

    const xhrUpload = new XMLHttpRequest()
    xhrUpload.open("POST", presignedData.url, true)

    // Progress tracking
    xhrUpload.upload.addEventListener(
      "progress",
      (evt) => {
        if (evt.lengthComputable) {
          const progress = (evt.loaded / evt.total) * 100
          callbacks.onProgress?.(progress)
        }
      },
      false
    )

    xhrUpload.onreadystatechange = function () {
      if (xhrUpload.readyState === 4) {
        if (xhrUpload.status === 204) {
          callbacks.onSuccess?.()
        } else {
          callbacks.onError?.(`Upload failed with status ${xhrUpload.status}`)
        }
      }
    }

    xhrUpload.onerror = function () {
      callbacks.onError?.("Upload failed due to network error")
    }

    xhrUpload.send(formData)
  }
}
