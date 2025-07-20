import { useEffect, useState } from "react"
import ReactPlayer from "react-player"
import { API } from "@/constants"

const VideoPlayer = () => {
  const [downloadLink, setDownloadLink] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDownloadUrl = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const fileId = "SampleVideo_720x480_30mb.mp4"
        const url = `${API}/video/${fileId}`

        const response = await fetch(url, { method: "GET" })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: "Unknown error" }))
          throw new Error(`Failed to fetch presigned URL: ${response.status} ${response.statusText} - ${errorData.message || "No message"}`)
        }

        const data = await response.json()

        if (data && typeof data.presigned_url === "string") {
          console.log(data.presigned_url)
          setDownloadLink(data.presigned_url)
        } else {
          throw new Error("Invalid response: presigned_url not found or not a string.")
        }
      } catch (err) {
        console.error("Error fetching presigned URL:", err)
        setError(err instanceof Error ? err.message : "An unexpected error occurred.")
        setDownloadLink(null) // Ensure downloadLink is null on error
      } finally {
        setIsLoading(false)
      }
    }

    fetchDownloadUrl()
  }, [])

  if (isLoading) {
    return (
      <div className="video-player">
        <div className="loading-spinner">Loading video...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="video-player">
        <div className="error-message">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="video-player w-[70vw] mx-auto">
      {downloadLink ? (
        <div className="relative pt-[56.25%]"> {/* 16:9 Aspect Ratio */}
          <ReactPlayer
            src={downloadLink}
            controls={true}
            width='100%'
            height='100%'
            className="absolute top-0 left-0"
          />
        </div>
      ) : (
        <div className="no-video-message">No video available.</div>
      )}
    </div>
  )
}

export default VideoPlayer
