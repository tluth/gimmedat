import { useState } from "react";

import CustomDropzone from "./CustomDropzone.js";
import Expire from "./Expire.js";
import { API } from "../constants.js";
import FileLink from "./FileLink.js";

const UploadPage = () => {
  const [file, setFile] = useState<File>();
  const [progressVal, setProgressVal] = useState(0);
  const [fileId, setFileId] = useState(null);

  //event handlers
  const handleFileChange = (files: File[]) => {
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
    const upload_request = {
      file_name: file?.name,
      byte_size: file?.size,
      file_type: file?.type,
    };
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API}/file`);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);

          const xhrUpload = new XMLHttpRequest();
          // create event listener to update put progress so user wont refresh page during upload
          xhrUpload.open("PUT", response.presigned_upload_url);
          xhrUpload.upload.addEventListener(
            "progress",
            function (evt) {
              if (evt.lengthComputable) {
                setProgressVal((evt.loaded / evt.total) * 100);
              }
            },
            false
          );
          xhrUpload.setRequestHeader("Content-Type", file!.type);
          xhrUpload.setRequestHeader("x-amz-acl", "private");
          xhrUpload.onreadystatechange = function () {
            if (xhrUpload.readyState === 4) {
              if (xhrUpload.status === 200) {
                setFileId(response.uuid);
              }
            }
          };
          xhrUpload.send(file);
        } else {
          alert("Problem submitting file.");
        }
      }
    };
    xhr.send(JSON.stringify(upload_request));
  };

  return (
    <div className="mx-auto max-w-[70%] min-w-[50%] pt-[5%] inline-block">
      <div>
        <CustomDropzone onDrop={handleFileChange} dropzoneText={``} />
      </div>
      {file && (
        <button
          className="focus:outline-none mt-4 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          onClick={handleSubmit}
        >
          Submit
        </button>
      )}
      {progressVal ? (
        <div className="pb-6 max-w-[70%] min-w-[50%] text-custom-green">
          <Expire
            trigger={"programmatical"}
            delay={0}
            isVisible={progressVal === 100 ? false : true}
          >
            <div className="progress">
              <div
                className="progress-bar progress-bar-success progres
                s-bar-striped"
                role="progressbar"
                aria-valuenow={progressVal}
                aria-valuemin={0}
                aria-valuemax={100}
                style={{
                  width: progressVal + "%",
                }}
              ></div>
            </div>
          </Expire>
        </div>
      ) : null}
      {progressVal === 100 && (
        <div className="pb-6 max-w-[70%] min-w-[50%] text-custom-green">
          <Expire trigger={"time"} delay={3000} isVisible={false}>
            <div
              className="w-[20px] text-[1.4em] pl-[1%] text-center inline-block float-left text-custom-green"
              role="img"
              aria-label="ok"
            >
              👌 Upload complete
            </div>
          </Expire>
        </div>
      )}
      {fileId && (
        <FileLink sharingLink={`${window.location.origin}/sharing/${fileId}`} />
      )}
    </div>
  );
};

export default UploadPage;
