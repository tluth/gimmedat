#!/usr/bin/env npx tsx

import {
  getDownloadUrl,
  getFileInfo,
  getPresignedPost,
  uploadFile,
} from "./utils";

const main = async () => {
  const args = process.argv.slice(2); // Remove the first two elements
  if (args.length === 0) {
    console.log("Please provide a filename as an argument.");
    return;
  }
  const filename = args[0];
  const fileInfo = await getFileInfo(filename);

  if (!fileInfo) return;

  const { presigned_upload_url, uuid } = await getPresignedPost(fileInfo);

  if (!fileInfo) {
    console.log("Failed to get file info.");
    return;
  }

  await uploadFile(presigned_upload_url, filename, fileInfo.file_type);

  const downloadUrl = await getDownloadUrl(uuid);

  console.log("File can be downloaded from:");
  console.log(downloadUrl);
};

main();
