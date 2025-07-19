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
        const fileId = "Topographic_Textures_After_Effects_Topographic_Design_Topographic_Map_Background_hd.mp4"
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
    <div className="video-player mx-auto">
      {downloadLink ? (
        <ReactPlayer src={downloadLink} controls={true} width="1080p"/>
      ) : (
        <div className="no-video-message">No video available.</div>
      )}
    </div>
  )
}

export default VideoPlayer
