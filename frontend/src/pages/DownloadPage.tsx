import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { API } from "../constants"
import LoadingSpinner from "../components/LoadingSpinner"

const DownloadPage = () => {
  const [downloadLink, setDownloadLink] = useState()
  const [ttl, setTtl] = useState()
  const [expired, setExpired] = useState(false)

  const params = useParams()
  const fileId = params.fileId
  useEffect(() => {
    getPresignedDownloadURL(fileId as string)
  }, [fileId])

  const getPresignedDownloadURL = (fileId: string) => {
    const url = `${API}/file/${fileId}`
    return new Promise(function () {
      fetch(url, { method: "GET" })
        .then((response) => {
          if (!response.ok) {
            setExpired(true)
          } else {
            return response.json()
          }
        })
        .then((json) => {
          setDownloadLink(json.presigned_url)
          setTtl(json.ttl)
        })
    })
  }

  return (
    <div className="mx-auto sm:max-w-[80%] sm:min-w-[50%] min-w-[75%] pt-[2%] inline-block">
      <div
        className={`p-7 flex flex-col items-center justify-center h-48 text-offWhite
        cursor-pointer transition-border ease-in-out border-2 rounded-md border-dashed pt-14
        bg-night-light bg-opacity-30`}
      >
        {expired ? (
          <>
            <div className="text-main min-h-14">
              Looks like we can't find that one...
            </div>
            <div className="text-offWhite min-h-14">
              The file has likely expired 😔
            </div>
          </>
        ) : !downloadLink && !ttl ? (
          <LoadingSpinner />
        ) : (
          <>
            <a href={downloadLink} download>
              <button className="focus:outline-none text-offWhite bg-main hover:bg-main-800 focus:ring-4 focus:ring-main-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-main-600 dark:hover:bg-main-700 dark:focus:ring-main-800">
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
  )
}

export { DownloadPage }
