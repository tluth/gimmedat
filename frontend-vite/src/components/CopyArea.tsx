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
      className="l:3/5 relative flex h-14 items-center justify-center rounded-md border text-custom-green border-custom-green "
      onMouseEnter={() => setShowCopy(true)}
      onMouseLeave={() => setShowCopy(false)}
    >
      <code className="text-center text-xs md:text-lg">{text}</code>
      {showCopy && (
        <button
          className="absolute top-1/2 right-0 mr-3 -translate-y-1/2 transform rounded-md border border-custom-green p-2"
          onClick={handleCopyClick}
        >
          {isCopied ? <Checkicon /> : <ClipboardIcon />}
        </button>
      )}
    </div>
  );
};

export default CopyArea;
