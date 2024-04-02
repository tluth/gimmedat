import CopyArea from "./CopyArea";

type FileLinkProps = {
  sharingLink: string;
};

const FileLink = ({ sharingLink }: FileLinkProps) => {
  //trigger variable identifies if components visibility depends on time limit (for setTimeout) or
  //is set programmatically
  // trigger: "time" || "programmatical"

  return (
    <>
      <div id="unique-sharing-link" className="text-main font-mono">
        Share it with a friend 🪲 
      </div>
      <div className="text-main font-mono mb-4 text-sm">
        {`(Expires in 48 hours)`}
      </div>
      <CopyArea text={sharingLink} />
    </>
  );
};

export default FileLink;
