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
        maxSize={1073741824}
        maxFiles={1}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            {...getRootProps()}
            className={`p-7 flex flex-col h-48 bg-offWhite text-night cursor-pointer transition-border ease-in-out border-4
              rounded-md shadow-md shadow-main-200 ${isDragActive ? "border-main bg-gray-100" : "border-gray-300"} overflow-hidden`}
          >
            <input {...getInputProps()} />
            <span>{isDragActive ? "📂" : "📁"}</span>
            <p>
              {isDragActive ? "Drop it bra" : "Drag'n'drop or select files"}
            </p>
            <ul className="">
              {fileNames.map((fileName, index) => (
                <li key={index} className="text-main min-h-14 pt-4">
                  {fileName}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Dropzone>
      <div className="text-offWhite">
        <span>{dropzoneText}</span>
      </div>
    </div>
  );
}

export default CustomDropzone;
