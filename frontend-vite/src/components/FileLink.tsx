import { useState } from "react";

type FileLinkProps = {
  sharingLink: string;
};

const FileLink = ({ sharingLink }: FileLinkProps) => {
  //trigger variable identifies if components visibility depends on time limit (for setTimeout) or
  //is set programmatically
  // trigger: "time" || "programmatical"
  const [copied, setCopied] = useState<boolean>(false);

  const copyToClipboard = (): void => {
    navigator.clipboard
      .writeText(sharingLink)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 1500);
      })
      .catch(() => {
        setCopied(false);
      });
  };

  return (
    <>
      <div id="unique-sharing-link" className="text-custom-green font-mono mb-4">
        Share it with a friend 🪲
      </div>
      <div
        id="unique-sharing-link"
        className="text-custom-green font-mono select-all border border-custom-green rounded-sm p-2"
      >
        {sharingLink}
      </div>
      <button
        className="focus:outline-none mt-4 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-8 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        onClick={copyToClipboard}
      >
        Copy to clipboard
      </button>
      {copied && <div className="text-custom-green font-mono">Copied! 🙌🏻</div>}
    </>
  );
};

export default FileLink;
