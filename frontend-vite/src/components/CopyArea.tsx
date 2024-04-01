import { useState } from "react";
import Checkicon from "./icons/CheckIcon";
import ClipboardIcon from "./icons/ClipboardIcon";

type CopyAreaProps = {
  text: string;
};

const CopyArea = ({ text }: CopyAreaProps) => {
  const [showCopy, setShowCopy] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div
      className="relative flex items-center justify-center rounded-md border text-main border-main p-2"
      onMouseEnter={() => setShowCopy(true)}
      onMouseLeave={() => setShowCopy(false)}
    >
      {/* Use a div to wrap the <code> element and control overflow */}
      <div className="flex-grow min-w-0">
        <code className="block overflow-hidden text-ellipsis whitespace-nowrap text-center text-xs md:text-lg w-10/12 3xl:w-full">
          {text}
        </code>
      </div>
      {showCopy && (
        <button
          className=" transition ease-in-out absolute top-1/2 right-0 mr-3 opacity-40 hover:opacity-100 -translate-y-1/2 transform rounded-md border border-main p-1"
          onClick={handleCopyClick}
        >
          {isCopied ? <Checkicon /> : <ClipboardIcon />}
        </button>
      )}
    </div>
  );
};

export default CopyArea;
