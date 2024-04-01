import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API } from "../constants";
import LoadingSpinner from "./LoadingSpinner";

const DownloadPage = () => {
  const [downloadLink, setDownloadLink] = useState();
  const [ttl, setTtl] = useState();

  const params = useParams();
  const fileId = params.fileId;
  useEffect(() => {
    getPresignedDownloadURL(fileId as string);
  }, [fileId]);

  const getPresignedDownloadURL = (fileId: string) => {
    const url = `${API}/file/${fileId}`;
    return new Promise(function () {
      fetch(url, { method: "GET" })
        .then((result) => result.json())
        .then((json) => {
          setDownloadLink(json.presigned_url);
          setTtl(json.ttl);
        });
    });
  };

  return (
    <div className="mx-auto max-w-[60%] min-w-[30%] pt-[5%] inline-block">
      <div
        className={`p-7 opacity-80 flex flex-col items-center justify-center h-48 bg-white text-night cursor-pointer transition-border ease-in-out border-4  rounded-md `}
      >
        {!downloadLink && !ttl ? (
          <LoadingSpinner />
        ) : (
          <>
            <a href={downloadLink} download>
              <button className="focus:outline-none text-white bg-main hover:bg-main-800 focus:ring-4 focus:ring-main-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-main-600 dark:hover:bg-main-700 dark:focus:ring-main-800">
                Download
              </button>
            </a>
            <div className="text-main min-h-14">
              {`This file will expire in ${Math.round(ttl! / 60 / 60)} hours`}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DownloadPage;
