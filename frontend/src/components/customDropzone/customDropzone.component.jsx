import { styles } from "./customDropzone.styles";
import React, { useState } from "react";

import Dropzone from "react-dropzone";

function CustomDropzone(props) {
  const [fileNames, setFileNames] = useState([]);
  const { onDrop, dropzoneText } = props;
  const classes = styles

  const handleDrop = (acceptedFiles) => {
    setFileNames(acceptedFiles.map((file) => file.name));
    onDrop(acceptedFiles);
  };

  return (
    <div>
      <Dropzone
        onDrop={handleDrop}
        minSize={1024}
        maxSize={262144000}
        maxFiles={1}
      >
        {({
          getRootProps,
          getInputProps,
          isDragActive,
          isDragAccept,
          isDragReject,
        }) => {
          const additionalClass = isDragAccept
            ? classes.accept
            : isDragReject
            ? classes.reject
            : "";

          return (
            <div
              {...getRootProps({
                style: classes.dropzone,
              })}
            >
              <input {...getInputProps()} />
              <span>{isDragActive ? "📂" : "📁"}</span>
              <p>Drag'n'drop or select files</p>
            </div>
          );
        }}
      </Dropzone>
      <div>
        <span className={classes.dropZoneText}>{dropzoneText}</span>
        <ul>
          {fileNames.map((fileName) => (
            <span style={styles.filename}>{fileName}</span>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CustomDropzone;
