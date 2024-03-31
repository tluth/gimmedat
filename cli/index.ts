#!/usr/bin/env npx tsx

import ora from "ora";
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

  if (!fileInfo) {
    console.log("Failed to get file info.");
    return;
  }

  const spinner = ora("Uploading file").start();
  const { presigned_upload_url, uuid } = await getPresignedPost(fileInfo);

  await uploadFile(presigned_upload_url, filename, fileInfo.file_type);

  spinner.text = "Getting download url";
  const downloadUrl = await getDownloadUrl(uuid);

  spinner.succeed("File can be downloaded from:");
  console.log(downloadUrl);
};

main();