import React, { useState } from "react";
import CustomDropzone from "../customDropzone/customDropzone.component";
import { styles } from "./uploadPage.styles.js";
import { API } from "../../constants.js";
import Expire from "../expire/expire.component.jsx";
import FileLink from "../../fileLink/fileLink.jsx";


const UploadPage = (props) => {
  const classes = styles;
  const [file, setFile] = useState("");
  const [progressVal, setProgressVal] = useState(0);
  const [fileId, setFileId] = useState(null);

  //event handlers
  const handleFileChange = (files) => {
    let reader = new FileReader();
    if (files && files.length > 0) {
      const file = files[0];
      reader.onloadend = () => {
        setFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    let upload_request = {
      file_name: file.name,
      byte_size: file.size,
      file_type: file.type,
    };
    var xhr = new XMLHttpRequest();
    xhr.open("POST", `${API}/file`);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var response = JSON.parse(xhr.responseText);

          var xhrUpload = new XMLHttpRequest();
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
          xhrUpload.setRequestHeader("Content-Type", file.type);
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
    <div style={classes.container}>
      <div>
        <CustomDropzone onDrop={handleFileChange} dropzoneText={``} />
      </div>
      <button onClick={handleSubmit}>Submit</button>
      {progressVal ? (
        <div item sm={12} md={12} lg={12} style={classes.pb}>
          <Expire
            trigger={"programmatical"}
            delay={null}
            isVisible={progressVal === 100 ? false : true}
          >
            <div className="progress">
              <div
                className="progress-bar progress-bar-success progress-bar-striped"
                role="progressbar"
                aria-valuenow={progressVal}
                aria-valuemin="0"
                aria-valuemax="100"
                style={{
                  width: progressVal + "%",
                }}
              ></div>
            </div>
          </Expire>
        </div>
      ) : null}
      {progressVal === 100 && (
        <div item sm={12} md={12} lg={12} style={classes.pb}>
          <Expire trigger={"time"} delay={3000} isVisible={null}>
            <div style={classes.uploadComplete} role="img" aria-label="ok">
              👌 Upload complete
            </div>
          </Expire>
        </div>
      )}
      {
        fileId && (
        <FileLink sharing_link={`${window.location.origin}/sharing/${fileId}`}/>
      )}
    </div>
  );
};

export default UploadPage;
