import { basename, extname, resolve } from "path";
import { API } from "./constants";
import { type Stats, promises } from "fs";
import { promises as fs } from "fs";
import mime from "mime";

export const getPresignedPost = async (fileInfo: FileInfo) => {
  const res = await fetch(`${API}/file`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fileInfo),
  });
  const data = await res.json();
  //   console.log(data);
  return data as { presigned_upload_url: string; uuid: string };
};

export async function getFileInfo(filePath: string): Promise<FileInfo | null> {
  try {
    const resolvedPath = resolve(filePath);
    const stats: Stats = await promises.stat(resolvedPath); // Get file stats
    if (!stats.isFile()) {
      console.error("The path does not point to a regular file.");
      return null;
    }
    return {
      file_name: basename(resolvedPath), // Get the filename from the path
      size: stats.size, // File size in bytes
      file_type: getMimeType(resolvedPath), // File MIME type
    };
  } catch (error) {
    console.error("Error accessing the file:", error);
    return null; // Or throw, depending on how you want to handle errors
  }
}

export function getMimeType(filePath: string): string {
  const resolvedPath = resolve(filePath);
  const mimeType = mime.getType(resolvedPath) || "application/octet-stream"; // Default MIME type if unknown
  return mimeType;
}

export async function uploadFile(
  presignedUploadUrl: string,
  filePath: string,
  fileType: string
) {
  try {
    // Asynchronously read the file content
    const fileContent = await fs.readFile(filePath);

    const uploadResponse = await fetch(presignedUploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": fileType, // Set the correct Content-Type for the file
        "x-amz-acl": "private", // Set the file ACL
      },
      body: fileContent, // The file content to upload
    });

    if (uploadResponse.ok) {
      console.log("File uploaded successfully.");
      return uploadResponse;
    } else {
      console.error("File upload failed:", await uploadResponse.text());
    }
  } catch (error) {
    console.error("Error uploading the file:", error);
  }
}

export const getDownloadUrl = async (uuid: string) => {
  const res = await fetch(`${API}/file/${uuid}`, {
    method: "GET",
  });

  const data = await res.json();
  return data.presigned_url;
};
