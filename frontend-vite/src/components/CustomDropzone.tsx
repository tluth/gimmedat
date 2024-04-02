import Dropzone from "react-dropzone";
import { MIN_FILE_SIZE, MAX_FILE_SIZE } from "../constants";

type CustomDropzoneProps = {
  onDrop: (acceptedFiles: File[]) => void;
  selectedFile?: File;
  dropzoneText: string;
  isValid: boolean;
  setIsValid: (valid: boolean) => void;
};

function CustomDropzone({
  onDrop,
  selectedFile,
  dropzoneText,
  isValid,
  setIsValid,
}: CustomDropzoneProps) {
  const onRejection = () => {
    setIsValid(false);
  };

  const onAcceptance = () => {
    setIsValid(true);
  };

  return (
    <div>
      <Dropzone
        onDropAccepted={onAcceptance}
        onDropRejected={onRejection}
        onDrop={(acceptedFiles) => onDrop(acceptedFiles)}
        minSize={MIN_FILE_SIZE}
        maxSize={MAX_FILE_SIZE}
        maxFiles={1}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            {...getRootProps()}
            className={`p-7 flex flex-col h-48 bg-offWhite text-night cursor-pointer transition-border ease-in-out border-4
              rounded-md shadow-md shadow-main-200 ${
                isDragActive ? "border-main bg-gray-100" : "border-gray-300"
              } overflow-hidden`}
          >
            <input {...getInputProps()} />
            <span>{isDragActive ? "📂" : "📁"}</span>
            <p>
              {isDragActive ? "Drop it bra" : "Drag'n'drop or select files"}
            </p>
            <div
              className={`${
                isValid ? "text-main" : "text-imperialRed"
              } min-h-14 pt-4`}
            >
              {selectedFile && isValid ? selectedFile.name : null}
              {!isValid
                ? "Files must be bigger than 1kb and smaller than 1gb"
                : null}
            </div>
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
