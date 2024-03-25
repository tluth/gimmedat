type FileLinkProps = {
  sharingLink: string;
};
const FileLink = ({ sharingLink }: FileLinkProps) => {
  //trigger variable identifies if components visibility depends on time limit (for setTimeout) or
  //is set programmatically
  // trigger: "time" || "programmatical"

  return (
    <div className="text-custom-green font-mono select-all">{sharingLink}</div>
  );
};

export default FileLink;
