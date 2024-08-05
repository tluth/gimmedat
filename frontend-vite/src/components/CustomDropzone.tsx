import Dropzone from "react-dropzone";
import UploadIcon from "./icons/UploadIcon";
import { MIN_FILE_SIZE, MAX_FILE_SIZE } from "../constants";
import { toast } from "sonner";
import ParticlesBackground from "./ParticlesBackground/ParticlesBackground";

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
    toast.error("Files must be bigger than 1kb and smaller than 4Gb");
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
            className={`pb-5 flex flex-col text-offWhite cursor-pointer transition-border ease-in-out border-2
          rounded-lg border-dashed ${
            isDragActive ? "border-main-300" : "border-offWhite"
          } overflow-hidden px-3 relative`}
          >
            <ParticlesBackground />
            <div
              id="repulse-div"
              className="m-auto text-center mt-5"
              style={{
                textShadow:
                  "1px -1px 10px black, 0px 0px 5px black, 0px 2px 15px black, -1px 1px 10px black",
              }}
            >
              <input {...getInputProps()} />
              <p className="text-center overflow-hidden max-h-[120px]">
                <UploadIcon color="#FAEFDD" altColor="#4d8cff" />
              </p>
              <p>
                {isDragActive ? "Drop it bra" : "Drag'n'drop or select files"}
              </p>
              <p className="text-center text-xs">{"(Up to 4GB per file)"}</p>
            </div>
            <div
              className={`${
                isValid ? "text-main" : "text-imperialRed"
              } min-h-14 pt-4 break-words`}
            >
              {selectedFile && isValid
                ? selectedFile.name
                : !isValid && selectedFile
                ? "Files must be bigger than 1kb and smaller than 4Gb"
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
