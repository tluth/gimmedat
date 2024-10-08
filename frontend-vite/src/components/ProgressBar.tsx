import { niceBytes } from "../utils"

type ProgressBarProps = {
  progress: number
  success: boolean
  fileSize: number | undefined
}

const ProgressBar = ({ progress, fileSize }: ProgressBarProps) => {
  return (
    <>
      <div className="flex justify-end mb-1">
        <span className="text-sm font-medium text-blue-700 dark:text-white">
          {Math.round(progress)}% {fileSize? `of ${niceBytes(fileSize)}` : null}
        </span>
      </div>
      <div className="w-full bg-main-200 rounded-full dark:bg-gray-700">
        <div
          className={"bg-main text-xs font-medium text-offWhite text-center p-0.5 leading-none rounded-full"}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </>
  )
}

export default ProgressBar
