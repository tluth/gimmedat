import { basename, extname, resolve } from "path"
import { API } from "./constants"
import { type Stats, promises } from "fs"
import { promises as fs } from "fs"
import mime from "mime"
import FormData from "form-data"
import fetch from "node-fetch"

export const getPresignedPost = async (fileInfo: FileInfo) => {
  const res = await fetch(`${API}/file`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fileInfo),
  })
  const data = await res.json()

  return data as { presigned_upload_data: string uuid: string }
}

export const buildUploadBody = async (fileInfo: FileInfo) => {
  const res = await fetch(`${API}/file`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fileInfo),
  })
  const data = await res.json()

  return data as { presigned_upload_data: string uuid: string }
}

export async function getFileInfo(filePath: string): Promise<FileInfo | null> {
  try {
    const resolvedPath = resolve(filePath)
    const stats: Stats = await promises.stat(resolvedPath) // Get file stats
    if (!stats.isFile()) {
      console.error("The path does not point to a regular file.")
      return null
    }
    return {
      file_name: basename(resolvedPath), // Get the filename from the path
      byte_size: stats.size, // File size in bytes
      file_type: getMimeType(resolvedPath), // File MIME type
    }
  } catch (error) {
    console.error("Error accessing the file:", error)
    return null // Or throw, depending on how you want to handle errors
  }
}

export function getMimeType(filePath: string): string {
  const resolvedPath = resolve(filePath)
  const mimeType = mime.getType(resolvedPath) || "application/octet-stream" // Default MIME type if unknown
  return mimeType
}

export async function uploadFile(
  presignedUploadData: any,
  filePath: string,
  fileType: string
) {
  try {
    // Asynchronously read the file content
    const fileContent = await fs.readFile(filePath)

    const formData = new FormData()

    Object.keys(presignedUploadData.fields).forEach((key: string) => {
      formData.append(key, presignedUploadData.fields[key])
    })
    formData.append("file", fileContent)

    const uploadResponse = await fetch(presignedUploadData.url, {
      method: "POST",
      headers: {
        // "Content-Type": "multipart/formdata", // Set the correct Content-Type for the file
        // "x-amz-acl": "private", // Set the file ACL
      },
      body: formData, // The file content to upload
    })

    if (uploadResponse.ok) {
      return uploadResponse
    } else {
      console.error("File upload failed:", await uploadResponse.text())
    }
  } catch (error) {
    console.error("Error uploading the file:", error)
  }
}

export const getDownloadUrl = async (uuid: string) => {
  const res = await fetch(`${API}/file/${uuid}`, {
    method: "GET",
  })

  const data = (await res.json()) as { presigned_url: string }
  return data.presigned_url
}
