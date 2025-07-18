import { useState } from "react"
import { toast } from "sonner"
import CustomDropzone from "./CustomDropzone"
import { API } from "../constants.js"
import FileLink from "./FileLink.js"
import EmailForm from "./EmailForm.js"
import { UploadService } from "../services/uploadService"

const UploadPage = () => {
  const [file, setFile] = useState<File>()
  const [progressVal, setProgressVal] = useState(0)
  const [fileId, setFileId] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [isValid, setIsValid] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [isEmailChecked, setIsChecked] = useState<boolean>(false)

  // Event handlers
  const handleFileChange = (files: File[]) => {
    setFileId(null)
    setIsValid(false)
    setSuccess(false)
    setIsUploading(false)
    setProgressVal(0)
    const reader = new FileReader()
    if (files && files.length > 0) {
      const file = files[0]
      reader.onloadend = () => {
        setFile(file)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (formData: { sender: string; recipient: string }) => {
    if (!file) return

    setIsUploading(true)

    try {
      await UploadService.uploadFile({
        endpoint: `${API}/file`,
        file,
        uploadRequest: {
          file_name: file.name,
          byte_size: file.size,
          file_type: file.type,
          recipient_email: formData.recipient || null,
          sender: formData.sender || null
        },
        onProgress: (progress) => {
          setProgressVal(progress)
        },
        onSuccess: (response) => {
          setFileId(response.uuid)
          setIsUploading(false)
          setSuccess(true)
        },
        onError: (error) => {
          if (error.includes("few too many")) {
            toast.error(error)
          } else {
            alert(error)
          }
          setIsUploading(false)
          setSuccess(false)
        }
      })
    } catch (error) {
      // Error already handled in onError callback
      console.error("Upload failed:", error)
    }
  }

  return (
    <div className="text-center mx-auto sm:max-w-[70%] sm:min-w-[50%] min-w-[70%] max-w-[80%] pt-[2%] inline-block">
      <div className="bg-night-light bg-opacity-30">
        <CustomDropzone
          onDrop={handleFileChange}
          selectedFile={file}
          dropzoneText={``}
          isValid={isValid}
          setIsValid={setIsValid}
        />
      </div>
      {file && isValid && !success && (
        <div className="flex justify-between">
          <EmailForm
            className="left-content"
            isChecked={isEmailChecked}
            setIsChecked={setIsChecked}
            handleSubmit={handleSubmit}
          />
        </div>
      )}
      {isValid && (
        <FileLink
          sharingLink={`${window.location.origin}/sharing/${fileId}`}
          progress={progressVal}
          success={success}
          isUploading={isUploading}
          fileSize={file?.size}
        />
      )}
    </div>
  )
}

export default UploadPage
