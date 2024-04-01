import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API } from "../constants";

const DownloadPage = () => {
  const [downloadLink, setDownloadLink] = useState();
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
        });
    });
  };

  return (
    <div>
      {downloadLink && (
        <a href={downloadLink} download>
          <button className="focus:outline-none text-white bg-blue hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Download
          </button>
        </a>
      )}
    </div>
  );
};

export default DownloadPage;
