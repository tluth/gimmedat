import { useState } from "react";

import Dropzone from "react-dropzone";

type CustomDropzoneProps = {
  onDrop: (acceptedFiles: File[]) => void;
  dropzoneText: string;
};

function CustomDropzone({ onDrop, dropzoneText }: CustomDropzoneProps) {
  const [fileNames, setFileNames] = useState<string[]>([]);

  const handleDrop = (acceptedFiles: File[]) => {
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
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            {...getRootProps()}
            className={`p-7 bg-white text-black cursor-pointer transition-border ease-in-out border-4 rounded-md ${
              isDragActive ? "border-green-500 bg-gray-100" : "border-gray-300"
            }`}
          >
            <input {...getInputProps()} />
            <span>{isDragActive ? "📂" : "📁"}</span>
            <p>Drag'n'drop or select files</p>
          </div>
        )}
      </Dropzone>
      <div className="text-white">
        <span>{dropzoneText}</span>
        <ul>
          {fileNames.map((fileName, index) => (
            <li key={index} className="text-green-500">
              {fileName}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CustomDropzone;
