import { useState } from "react";

import CustomDropzone from "./CustomDropzone";
import { API } from "../constants.js";
import FileLink from "./FileLink.js";
import LoadingSpinner from "./LoadingSpinner";
import { toast } from "sonner";
import EmailForm from "./EmailForm.js";


const UploadPage = () => {
  const [file, setFile] = useState<File>();
  const [progressVal, setProgressVal] = useState(0);
  const [fileId, setFileId] = useState(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  //event handlers
  const handleFileChange = (files: File[]) => {
    setFileId(null);
    setIsValid(false);
    setSuccess(false);
    setIsUploading(false);
    setProgressVal(0);
    const reader = new FileReader();
    if (files && files.length > 0) {
      const file = files[0];
      reader.onloadend = () => {
        setFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    setIsUploading(true);
    const upload_request = {
      file_name: file?.name,
      byte_size: file?.size,
      file_type: file?.type,
      recipient_email: "tom.lutherborrow@gmail.com",
      sender: "tommmyu"
    };

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API}/file`);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          const formData = new FormData();
          Object.keys(response.presigned_upload_data.fields).forEach(
            (key: string) => {
              formData.append(key, response.presigned_upload_data.fields[key]);
            }
          );
          formData.append("file", file as Blob);
          const xhrUpload = new XMLHttpRequest();
          // create event listener to update put progress so user wont refresh page during upload
          xhrUpload.open("POST", response.presigned_upload_data.url, true);
          xhrUpload.upload.addEventListener(
            "progress",
            function (evt) {
              if (evt.lengthComputable) {
                setProgressVal((evt.loaded / evt.total) * 100);
              }
            },
            false
          );
          xhrUpload.onreadystatechange = function () {
            if (xhrUpload.readyState === 4) {
              if (xhrUpload.status === 204) {
                setFileId(response.uuid);
                setIsUploading(false);
                setSuccess(true);
              } else {
                setIsUploading(false);
                setSuccess(false);
              }
            }
          };
          xhrUpload.send(formData);
        } else if (xhr.status === 403) {
          toast.error(
            "Sorry, mate. I think you've had a few too many. Try again later."
          );
          setIsUploading(false);
          setSuccess(false);
        } else {
          alert("Problem submitting file.");
          setIsUploading(false);
          setSuccess(false);
        }
      }
    };
    xhr.send(JSON.stringify(upload_request));
  };

  return (
    <div className="text-center mx-auto sm:max-w-[70%] sm:min-w-[50%] min-w-[70%] max-w-[80%] pt-[5%] inline-block">
      <div className="bg-night-light bg-opacity-30">
        <CustomDropzone
          onDrop={handleFileChange}
          selectedFile={file}
          dropzoneText={``}
          isValid={isValid}
          setIsValid={setIsValid}
        />
      </div>
      {file && isValid && !success && (
        <div className="flex justify-between">
        {/* <EmailForm className="left-content"/> */}
        <button
          className="right-content max-h-10 focus:outline-none text-black bg-main hover:bg-main-300 focus:ring-4 focus:ring-main-300 font-medium rounded-lg text-sm px-8 py-2.5 me-2 mb-2 dark:bg-main dark:hover:bg-main-700 dark:focus:ring-main-800"
          onClick={handleSubmit}
        >
          <div className="min-w-12 flex items-center justify-center">
            {isUploading ? <LoadingSpinner /> : "Upload"}
          </div>
        </button>
        </div>
      )}
      {isValid && (
        <FileLink
          sharingLink={`${window.location.origin}/sharing/${fileId}`}
          progress={progressVal}
          success={success}
          isUploading={isUploading}
          fileSize={file?.size}
        />
      )}
    </div>
  );
};

export default UploadPage;
