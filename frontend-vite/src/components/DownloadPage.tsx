import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API } from "../constants";

const DownloadPage = () => {
  const [downloadLink, setDownloadLink] = useState();
  const params = useParams();
  const fileId = params.fileId;
  useEffect(() => {
    getPresignedDownloadURL(fileId!);
  }, []);

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
          <button>Download</button>
        </a>
      )}
    </div>
  );
};

export default DownloadPage;
