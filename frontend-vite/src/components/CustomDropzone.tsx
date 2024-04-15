import Dropzone from "react-dropzone";
import UploadIcon from "./UploadIcon";
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
            className={`pb-5 p-2 flex flex-col text-offWhite cursor-pointer transition-border ease-in-out border-2
              rounded-lg border-dashed ${isDragActive ? "border-main-300" : "border-offWhite"} 
              overflow-hidden`}
          >
            <input {...getInputProps()} />
            <p className="text-center overflow-hidden max-h-[120px]">
              <UploadIcon color="#FAEFDD" altColor="#4d8cff"/>
            </p>
            <p className="">
              {isDragActive ? "Drop it bra" : "Drag'n'drop or select files"}
            </p>
            <p className="text-center text-xs">
              {"(Up to 1GB per file)"}
            </p>
            <div
              className={`${
                isValid ? "text-main" : "text-imperialRed"
              } min-h-14 pt-4 break-words`}
            >
              {selectedFile && isValid ? selectedFile.name : !isValid && selectedFile ? 
                "Files must be bigger than 1kb and smaller than 1gb" : null}
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
