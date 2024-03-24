import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API } from "../../constants";


const DownloadPage = (props) => {
    const [downloadLink, setDownloadLink] = useState(false)
    let params = useParams();
    const fileId = params.fileId
    useEffect(() => {
        getPresignedDownloadURL(fileId)
    }, []);


    const getPresignedDownloadURL = (file_id) => {
        let url = `${API}/file/${file_id}`;
        return new Promise(function (resolve, reject) {
          fetch(url, {method: "GET"})
            .then((result) => result.json())
            .then((json) => {
                setDownloadLink(json.presigned_url)
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
    )
}

export default DownloadPage