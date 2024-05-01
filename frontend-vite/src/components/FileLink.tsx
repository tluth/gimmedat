import CopyArea from "./CopyArea";
import ProgressBar from "./ProgressBar";

type FileLinkProps = {
  sharingLink: string;
  progress: number;
  success: boolean;
  isUploading: boolean;
};

const FileLink = ({
  sharingLink,
  progress,
  success,
  isUploading,
}: FileLinkProps) => {
  return (
    <>
      {progress === 100 && success ? (
        <>
          <div id="unique-sharing-link" className="text-main font-mono">
            Share it with a friend 🪲
          </div>
          <div className="text-main font-mono mb-4 text-sm">
            {`(Expires in 4 days)`}
          </div>
          <CopyArea text={sharingLink} />
        </>
      ) : isUploading ? (
        <ProgressBar progress={progress} success={success} />
      ) : null}
    </>
  );
};

export default FileLink;
