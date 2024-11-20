import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import file from "./images/description.svg"
import AudioPlayer from "./audioPlayer"
import pdfImage from "../../../../../constants/images/pdfImage.svg"
import audoImage from "../../../../../constants/images/audioImage.svg"
import docImage from "../../../../../constants/images/docImage.svg"
import excelImage from "../../../../../constants/images/excelImage.svg"
import mp3image from "../../../../../constants/images/mp3image.svg"
import plainTextImage from "../../../../../constants/images/plainTextImage.svg"
import pptImage from "../../../../../constants/images/pptImage.svg"
import svgImage from "../../../../../constants/images/svgImage.svg"
import wavImage from "../../../../../constants/images/wavImage.svg"
import wordImage from "../../../../../constants/images/wordImage.svg"
import zipImage from "../../../../../constants/images/zipImage.svg"
import videoImage from "../../../../../constants/images/videoImage.svg"
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch"
import { t } from "i18next"
import WaveSurfer from "../../../../../atom/AudioElements/waveSurferPlayer"
import WaveSurferPlayer from "../../../../../atom/AudioElements/waveSurferPlayer"
import Tooltip from "../../../../../atom/ToolTip/Tooltip"
import { DocumentRoot } from "../../../../../config/environmentConfigs/config"
import { getURL } from "../../../../../utils/linkManipulation"
import UseEscape from "./hooks/useEscape"

const UNSUPPORTEDIMAGETYPE = [
  "image/tiff",
  "image/x-icon",
  "image/x-pict",
  "image/x-rgb",
  "image/x-xbitmap",
  "image/x-xpixmap",
  "image/x-xwindowdump",
  "image/x-eps",
]
interface Props {
  files: any
  handleFileRemove: (index: number) => void
  handleRetry: (index: number) => void
}
const mapIcons = (item: any) => {
  const iconMap: any = {
    "application/pdf": pdfImage,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      wordImage,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      excelImage,
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      pptImage,
    "image/png": item.url,
    "image/jpeg": item.url,
    "image/gif": item.url,
    "image/webp": item.url,
    "image/svg+xml": svgImage,
    "audio/mpeg": mp3image,
    "audio/mp3": audoImage,
    "audio/wav": wavImage,
    "video/mp4": videoImage,
    "video/avi": videoImage,
    "application/vnd.ms-powerpoint": pptImage,
    "application/vnd.ms-excel": excelImage,
    "application/zip": zipImage,
    "application/x-compressed": zipImage,
    "application/x-zip-compressed": zipImage,
    "text/plain": plainTextImage,
  }

  return iconMap[item.type] || file
}
const AttachmentList: React.FC<Props> = ({
  files,
  handleFileRemove,
  handleRetry,
}) => {
  return (
    <div className="flex flex-row space-x-2 pb-2 overflow-x-auto overflow-y-hidden chatbox">
      {files &&
        files.map((file: any, index: number) =>
          !file.cancelled ? (
            <div key={index}>
              <UploadAttachment
                progress={file.progress}
                name={file.name}
                path={URL.createObjectURL(file.data)}
                size={file.size}
                type={file.type}
                handleFileRemove={handleFileRemove}
                index={index}
                url={file.url}
                failed={file.failed}
                handleRetry={handleRetry}
              />
            </div>
          ) : null
        )}
    </div>
  )
}

interface IUploadAttachment {
  name: string
  size: number
  type: string
  path: string
  handleFileRemove: (index: number) => void
  index: number
  progress: number
  failed: boolean
  handleRetry: (index: number) => void
  url: string
}

interface IDownloadAttachment {
  attachments: any[]
  shouldPreview?: boolean
  chatMessage?: any
  isPinned?: boolean
  replay?: boolean
  info?: boolean
}

const UploadAttachment: React.FC<IUploadAttachment> = ({
  name,
  size,
  type,
  path,
  handleFileRemove,
  index,
  progress,
  url,
  failed,
  handleRetry,
}) => {
  const iconMap: any = {
    "application/pdf": pdfImage,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      wordImage,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      excelImage,
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      pptImage,
    "image/png": path,
    "image/jpeg": path,
    "image/gif": path,
    "image/webp": path,
    "audio/mpeg": mp3image,
    "audio/mp3": audoImage,
    "audio/wav": wavImage,
    "image/svg+xml": svgImage,
    "video/mp4": videoImage,
    "video/avi": videoImage,
    "application/vnd.ms-powerpoint": pptImage,
    "application/vnd.ms-excel": excelImage,
    "application/zip": zipImage,
    "application/x-compressed": zipImage,
    "application/x-zip-compressed": zipImage,
    "text/plain": plainTextImage,
  }

  const iconUrl = iconMap[type] || file

  const contentStyles = `flex-1 min-w-0 ml-2 truncate pr-[20px] ${
    url === "" ? "opacity-40" : ""
  }`
  const nameStyles = "text-[14px] text-[#293241] truncate -mt-1"
  const typeStyles =
    "text-[8px] text-[#293241] mr-2 w-4/5 inline-block overflow-hidden text-ellipsis"
  const sizeStyles = "text-[8px] text-[#B1B1B1]"
  const iconStyles = "h-[44px] w-[44px] rounded-[5px] object-cover "

  return (
    <div
      key={index}
      className="relative p-2 border-[1px] border-solid rounded-[7px] h-[65px] w-fit box-border border-[#FCD3A3] mt-1"
    >
      {url === "" && !failed ? Loader : null}
      {failed ? (
        <div
          className={` w-full h-full absolute  top-0 left-0 flex justify-center items-center p-2 z-[6] `}
        >
          <div>{t("Chat.UploadFailed")}</div>
          <button onClick={() => handleRetry(index)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="24"
              height="24"
              viewBox="0,0,255.99057,255.99057"
            >
              <g
                fill="#ff1111"
                fillRule="nonzero"
                stroke="none"
                strokeWidth="1"
                strokeLinecap="butt"
                strokeLinejoin="miter"
                strokeMiterlimit="10"
                strokeDasharray=""
                stroke-dashoffset="0"
                font-family="none"
                fontWeight="none"
                fontSize="none"
                textAnchor="none"
              >
                <g transform="scale(10.66667,10.66667)">
                  <path d="M2,2l2.93945,2.93945c-1.81318,1.80876 -2.93945,4.30325 -2.93945,7.06055c0,5.514 4.486,10 10,10c5.514,0 10,-4.486 10,-10c0,-5.514 -4.486,-10 -10,-10v2c4.411,0 8,3.589 8,8c0,4.411 -3.589,8 -8,8c-4.411,0 -8,-3.589 -8,-8c0,-2.20599 0.90048,-4.20272 2.34961,-5.65039l2.65039,2.65039v-7z"></path>
                </g>
              </g>
            </svg>
          </button>
        </div>
      ) : null}
      <div
        className={`bg-[#f7921f77] absolute opacity-50 h-full top-0 left-0`}
        style={{ width: `${progress}%` }}
      ></div>

      <div className="flex flex-row relative ">
        <img className={iconStyles} src={iconUrl} alt={type} />
        <div className={contentStyles}>
          <div className="flex justify-between ">
            <p className={nameStyles}>{name}</p>
          </div>
          <div className="flex">
            <span className={typeStyles}>{type}</span>
            <span className={sizeStyles}>{formatBytes(size)}</span>
          </div>
          <div>{type === "audio/mp3" && <WaveSurfer url={getURL(url)} />}</div>
        </div>
        <button
          className="mb-7 absolute top-0 right-0 ml-3 z-[8]"
          onClick={() => handleFileRemove(index)}
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 11 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.917969 10.9323L0.0703125 10.0846L4.59115 5.5638L0.0703125 1.04297L0.917969 0.195312L5.4388 4.71615L9.95964 0.195312L10.8073 1.04297L6.28646 5.5638L10.8073 10.0846L9.95964 10.9323L5.4388 6.41146L0.917969 10.9323Z"
              fill="#5C6779"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

const DownloadAttachment: React.FC<IDownloadAttachment> = ({
  attachments,
  shouldPreview = false,
  chatMessage,
  isPinned,
  replay,
  info,
}) => {
  const containerStyles = "flex items-center m-1"
  const contentStyles = "flex-1 min-w-0 ml-2 relative"
  const nameStyles = "text-[14px] text-primary-200 truncate  max-w-[150px] "
  const sizeStyles = "text-[10px] text-[#C4C4C4]"
  const iconStyles = "h-[24px] w-[24px] mb-5 "
  const chatInstance = useSelector((state: any) => state.Chat.chatInstance)
  const [isHovering, setIsHovering] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedAttachment, setSelectedAttachment] = useState<any>(null)
  const [imageUrls, setImageUrls] = useState(
    attachments.map((item) => `${item.url}-low.webp`)
  )
  const videoRef = useRef<HTMLVideoElement>(null)
  const downloadFile = (path: string, filename: string) => {
    fetch(path)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", filename)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
  }

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause()
    }
  }, [isExpanded])

  const handleImageError = (index: number) => {
    const newImageUrls = [...imageUrls]
    newImageUrls[index] = attachments[index].url // Change the URL to the original one
    setImageUrls(newImageUrls)
  }

  const toggleExpand = (type: string, item: any) => {
    if (
      type === "application/pdf" ||
      type === "text/plain" ||
      type.startsWith("video") ||
      type.startsWith("image/")
    ) {
      setIsExpanded(() => !isExpanded)
      setSelectedAttachment(item)
      setIsHovering(false)
    }
  }

  const closeExpanded = () => {
    setIsExpanded(false)
    setIsHovering(false)
    setSelectedAttachment(null)
  }

  UseEscape(() => closeExpanded())

  let content: any
  const conditionSwitch = (item: any, index: any) => {
    if (item.type.startsWith("video") && !replay && !info) {
      content = (
        <div className="group-files">
          <div className="group-files-hover:cursor-zoom-in">
            <div className="text-[10px] text-[#293241] truncate">
              {item.name}
            </div>
            <video
              ref={videoRef}
              controls={true}
              disablePictureInPicture
              controlsList="nodownload  noplaybackrate nofullscreen"
              style={{
                width: "250px",
                height: "150px",
                borderWidth: 1,
                borderColor: "#FFFFFF",
                borderRadius: 7,
              }}
              src={item.url}
            ></video>
            {isPinned
              ? null
              : icons(item, true, chatMessage, chatInstance, false)}
          </div>
        </div>
      )
    } else if (item.type.startsWith("audio") && !replay && !info) {
      content = (
        <div
          className={"flex w-[330px] relative items-center  p-1 bg-[#FEF4E9]"}
        >
          <div className="">
            <img
              className={"h-[34px] w-[34px]  bg-[#FCD3A3] p-1"}
              src={mapIcons(item)}
              alt={item.type}
            />
          </div>
          <WaveSurferPlayer
            item={item}
            url={getURL(item.url)}
            inlinePlayer={true}
          />
        </div>
      )
    } else if (item.type.startsWith("image") && !replay && !info) {
      content = (
        <div className="group-files">
          <div className="text-[10px] text-[#293241] max-w-[170px] truncate">
            {item.name}
          </div>
          <div
            className="max-w-xs group-files-hover:cursor-zoom-in"
            onClick={() => toggleExpand(item.type, item)}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div
              className={` min-w-[150px] w-full h-48 relative rounded-lg text-[#ffffff]  ${
                isExpanded ? "cursor-pointer" : ""
              }`}
            >
              {UNSUPPORTEDIMAGETYPE.includes(item.type) ? (
                <div className="flex flex-col items-center justify-center w-full h-full border-[#FFFFFF] border-[1px] text-[#293241] text-sm">
                  <svg
                    className="-mt-5"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 4.125C14.0886 4.125 16.0916 4.95468 17.5685 6.43153C19.0453 7.90838 19.875 9.91142 19.875 12C19.875 14.0886 19.0453 16.0916 17.5685 17.5685C16.0916 19.0453 14.0886 19.875 12 19.875C9.91142 19.875 7.90838 19.0453 6.43153 17.5685C4.95468 16.0916 4.125 14.0886 4.125 12C4.125 9.91142 4.95468 7.90838 6.43153 6.43153C7.90838 4.95468 9.91142 4.125 12 4.125ZM12 21C14.3869 21 16.6761 20.0518 18.364 18.364C20.0518 16.6761 21 14.3869 21 12C21 9.61305 20.0518 7.32387 18.364 5.63604C16.6761 3.94821 14.3869 3 12 3C9.61305 3 7.32387 3.94821 5.63604 5.63604C3.94821 7.32387 3 9.61305 3 12C3 14.3869 3.94821 16.6761 5.63604 18.364C7.32387 20.0518 9.61305 21 12 21ZM10.3125 15.375C10.0031 15.375 9.75 15.6281 9.75 15.9375C9.75 16.2469 10.0031 16.5 10.3125 16.5H13.6875C13.9969 16.5 14.25 16.2469 14.25 15.9375C14.25 15.6281 13.9969 15.375 13.6875 15.375H12.5625V11.4375C12.5625 11.1281 12.3094 10.875 12 10.875H10.5938C10.2844 10.875 10.0312 11.1281 10.0312 11.4375C10.0312 11.7469 10.2844 12 10.5938 12H11.4375V15.375H10.3125ZM12 9.46875C12.2238 9.46875 12.4384 9.37986 12.5966 9.22162C12.7549 9.06339 12.8438 8.84878 12.8438 8.625C12.8438 8.40122 12.7549 8.18661 12.5966 8.02838C12.4384 7.87014 12.2238 7.78125 12 7.78125C11.7762 7.78125 11.5616 7.87014 11.4034 8.02838C11.2451 8.18661 11.1562 8.40122 11.1562 8.625C11.1562 8.84878 11.2451 9.06339 11.4034 9.22162C11.5616 9.37986 11.7762 9.46875 12 9.46875Z"
                      fill="#A1A1A1"
                    />
                  </svg>
                  <span className="text-[#A1A1A1]">Preview not available</span>
                </div>
              ) : (
                <img
                  src={imageUrls[index]}
                  onError={() => {
                    handleImageError(index)
                  }}
                  alt={item.type}
                  className="object-contain w-full h-full rounded-lg border-[#FFFFFF] border-[1px]"
                />
              )}
              {isPinned
                ? null
                : icons(item, false, chatMessage, chatInstance, false)}
            </div>
          </div>
          {/* {isExpanded && (
              <ImageModal
                attachmentList={attachments}
                attachment={item}
                imageUrl={item.url}
                onClose={closeExpanded}
                setSelectedAttachment={setSelectedAttachment}
              />
            )} */}
        </div>
      )
    } else if (item.type === "application/pdf" && !replay && !info) {
      content = (
        <div className="relative group-files max-w-[225px]">
          <div className="text-[10px] text-[#293241] truncate pb-2 pr-5">
            <div className="flex flex-row items-center p-1">
              <img className="rounded-[7px]" src={pdfImage} alt={item.type} />
              <div className="flex flex-col">
                <div className="ml-2 break-all w-[180px] truncate">
                  {item.name}
                </div>
                <p className={`text-[10px] text-[#C4C4C4] ml-2`}>
                  {formatBytes(item.size)}
                </p>
              </div>
            </div>
          </div>
          {/* <iframe src={item.url} width="250px" height="150px"></iframe> */}
          {isPinned
            ? null
            : icons(item, false, chatMessage, chatInstance, true)}
        </div>
      )
    } else {
      content = (
        <div className={containerStyles}>
          <img className={iconStyles} src={mapIcons(item)} alt={item.type} />

          <div className={contentStyles}>
            <div className="flex justify-between">
              <Tooltip content={item.name} direction="top" onclick={true}>
                <p className={nameStyles}>{item.name}</p>
              </Tooltip>
            </div>
            <p className={sizeStyles}>{formatBytes(item.size)}</p>
          </div>
          {!info && (
            <div className={`flex-shrink-0 mb-5 ${replay ? "ml-8" : "ml-3"}`}>
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                download
              >
                <div className="rounded-[50px] p-1 border-[#C4C4C4] border-[0.5px] bg-[#f7931f1f]">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.73077 11.6259C1.35193 11.6259 1.03125 11.4946 0.76875 11.2321C0.50625 10.9696 0.375 10.6489 0.375 10.2701V8.25088H1.49998V10.2701C1.49998 10.3278 1.52402 10.3807 1.57209 10.4288C1.62018 10.4768 1.67308 10.5009 1.73077 10.5009H10.2692C10.3269 10.5009 10.3798 10.4768 10.4279 10.4288C10.4759 10.3807 10.5 10.3278 10.5 10.2701V8.25088H11.625V10.2701C11.625 10.6489 11.4937 10.9696 11.2312 11.2321C10.9687 11.4946 10.648 11.6259 10.2692 11.6259H1.73077ZM5.99998 8.71239L2.7981 5.51051L3.58847 4.69708L5.4375 6.54611V0.246094H6.56246V6.54611L8.41149 4.69708L9.20186 5.51051L5.99998 8.71239Z"
                      fill="#F7931F"
                    />
                  </svg>
                </div>
              </a>
            </div>
          )}
        </div>
      )
    }
    return content
  }

  return (
    <>
      {attachments.map((item: any, index: number) => (
        <div
          key={index}
          className={`${
            (item.type.startsWith("video") || item.type.startsWith("image")) &&
            "border-none"
          } ${
            !item.type.startsWith("video") &&
            !item.type.startsWith("image") &&
            !item.type.startsWith("audio") &&
            "bg-[#FEF4E9] border-[#FCD3A3]"
          } ${
            item.type.startsWith("audio")
              ? "group-hover:cursor-pointer p-1 border-[#FCD3A3] bg-[#FEF4E9] "
              : "px-1 relative pt-2  mt-1 "
          } border-[1px] border-solid rounded-[7px] box-border h-fit ${
            (item.type === "application/pdf" ||
              item.type.startsWith("video") ||
              item.type.startsWith("image")) &&
            "group-hover:cursor-pointer"
          } `}
          onClick={() =>
            item.type.startsWith("audio") ? null : toggleExpand(item.type, item)
          }
        >
          {conditionSwitch(item, index)}
        </div>
      ))}

      {isExpanded &&
        selectedAttachment &&
        !UNSUPPORTEDIMAGETYPE.includes(selectedAttachment.type) &&
        (selectedAttachment.type.startsWith("image") ? (
          <ImageModal
            attachmentList={attachments}
            attachment={selectedAttachment}
            imageUrl={selectedAttachment?.url}
            onClose={closeExpanded}
            setSelectedAttachment={setSelectedAttachment}
            chatMessage={chatMessage}
          />
        ) : (
          <PreviewModal
            attachmentList={attachments}
            url={selectedAttachment?.url}
            attachment={selectedAttachment}
            onClose={closeExpanded}
            type={selectedAttachment?.type?.split("/", 1)}
            name={selectedAttachment.name}
            setSelectedAttachment={setSelectedAttachment}
            chatMessage={chatMessage}
          />
        ))}
    </>
  )
}

export { AttachmentList, UploadAttachment, DownloadAttachment }

interface PreviewModalProps {
  url: string
  onClose: () => void
  type: string
  name: string
  attachmentList: any
  setSelectedAttachment: any
  attachment: any
  chatMessage?: any
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  url,
  onClose,
  type,
  name,
  attachmentList,
  setSelectedAttachment,
  attachment,
  chatMessage,
}) => {
  const mainContainerRef = useRef<HTMLDivElement>(null)

  const [item, setItem] = useState(-1)
  const [filteredAttachments, setFilteredAttachments] = useState<any>()

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      onClose()
    }
  }

  useEffect(() => {
    const filter = attachmentList.filter(
      (item: any) =>
        item.type === "application/pdf" ||
        item.type.startsWith("video") ||
        item.type.startsWith("image")
    )
    setFilteredAttachments(filter)
  }, [])

  const rightNav = () => {
    let nextItem = item
    do {
      nextItem = (nextItem + 1) % attachmentList?.length

      if (
        attachmentList[nextItem].type === "application/pdf" ||
        // attachmentList[nextItem].type.startsWith("audio") ||
        attachmentList[nextItem].type.startsWith("video") ||
        (attachmentList[nextItem].type.startsWith("image") &&
          !UNSUPPORTEDIMAGETYPE.includes(attachmentList[nextItem].type))
      ) {
        setItem(nextItem)
        setSelectedAttachment(attachmentList[nextItem])
        return
      }
    } while (nextItem !== item)
  }

  const leftNav = () => {
    let prevItem = item

    do {
      prevItem =
        (prevItem - 1 + attachmentList?.length) % attachmentList?.length

      if (
        attachmentList[prevItem].type === "application/pdf" ||
        // attachmentList[prevItem].type.startsWith("audio") ||
        attachmentList[prevItem].type.startsWith("video") ||
        (attachmentList[prevItem].type.startsWith("image") &&
          !UNSUPPORTEDIMAGETYPE.includes(attachmentList[prevItem].type))
      ) {
        setItem(prevItem)
        setSelectedAttachment(attachmentList[prevItem])
        return
      }
    } while (prevItem !== item)
  }

  useEffect(() => {
    // Focus on the main container div when the component mounts
    // Using this to get the onKeyDown event
    if (mainContainerRef.current) {
      mainContainerRef.current.focus()
    }
    let index = attachmentList.findIndex(
      (item: any) => item.url === attachment.url
    )
    setItem(index)
  }, [])

  return (
    <div
      ref={mainContainerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={(event: any) => event.stopPropagation()}
      className="fixed outline-none w-full h-full	 inset-0 z-[50] flex items-center justify-center bg-[black] bg-opacity-20 backdrop-filter backdrop-blur-sm"
    >
      <div
        className={`relative h-full max-h-[calc(100%-200px)] w-[calc(100%-200px)] bg-white rounded-lg overflow-hidden flex items-center justify-center`}
      >
        <div
          className={`flex w-full h-[calc(100%-100px)] items-center bg-primary-100 rounded-[20px] justify-center`}
        >
          {type[0] === "video" ? (
            <video
              controls={true}
              disablePictureInPicture
              controlsList="nodownload  noplaybackrate "
              style={{ width: "100%", height: "100%", borderRadius: "20px" }}
              src={url}
            ></video>
          ) : (
            type[0] !== "audio" && (
              <div className="flex flex-col w-full h-full">
                <div className="flex justify-between items-center pl-4 bg-[#060505] ">
                  <span className=" text-xs text-[#ffffff]  whitespace-nowrap overflow-hidden text-ellipsis">
                    {name}
                  </span>
                  <button
                    className="p-1 text-white bg-gray-600 rounded hover:bg-gray-700 bg-[#000000] bg-opacity-50"
                    onClick={onClose}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      viewBox="0 0 20 20"
                      fill="#ffffff"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M14.354 14.354a.5.5 0 0 1-.708 0L10 10.707l-3.646 3.647a.5.5 0 0 1-.708-.708L9.293 10l-3.647-3.646a.5.5 0 0 1 .708-.708L10 9.293l3.646-3.647a.5.5 0 0 1 .708.708L10.707 10l3.647 3.646a.5.5 0 0 1 0 .708z"
                      />
                    </svg>
                  </button>
                </div>
                <iframe
                  className=" w-full h-[calc(100vh-200px)]"
                  src={`${url}#toolbar=0`}
                ></iframe>
              </div>
            )
          )}
        </div>
        {chatMessage?.body?.plainText && (
          <div className="absolute rounded-[10px] bottom-0 bg-[#0000004D] w-full py-1 px-3 text-[20px] text-[#ffffff] truncate">
            {chatMessage?.body?.plainText ?? ""}
          </div>
        )}
      </div>
      <div className="absolute top-6 left-6 px-3 py-1 text-[#FEFDFB] rounded-[50px] bg-[#00000080] bg-opacity-50">
        {attachment.name}
      </div>
      {type[0] !== "audio" && type[0] === "video" ? (
        <button
          className="absolute top-6 right-6 p-1 text-white bg-gray-600 rounded hover:bg-gray-700 bg-[#000000] bg-opacity-50"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 20 20"
            fill="#ffffff"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M14.354 14.354a.5.5 0 0 1-.708 0L10 10.707l-3.646 3.647a.5.5 0 0 1-.708-.708L9.293 10l-3.647-3.646a.5.5 0 0 1 .708-.708L10 9.293l3.646-3.647a.5.5 0 0 1 .708.708L10.707 10l3.647 3.646a.5.5 0 0 1 0 .708z"
            />
          </svg>
        </button>
      ) : null}
      {filteredAttachments?.length > 1 && (
        <div
          onClick={leftNav}
          className="bg-[#00000033] rounded-[8.279px] p-7 absolute left-5 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="20"
            viewBox="0 0 23 20"
            fill="none"
          >
            <g transform="scale(-1, 1) translate(-23, 0)">
              <path
                d="M22.2084 11.1267C22.8321 10.5033 22.8321 9.49083 22.2084 8.8674L14.2249 0.887494C13.6012 0.264064 12.5883 0.264064 11.9646 0.887494C11.3409 1.51092 11.3409 2.52337 11.9646 3.1468L17.2287 8.40357H1.92042C1.03725 8.40357 0.32373 9.11677 0.32373 9.99955C0.32373 10.8823 1.03725 11.5955 1.92042 11.5955H17.2237L11.9696 16.8523C11.3459 17.4757 11.3459 18.4882 11.9696 19.1116C12.5933 19.735 13.6062 19.735 14.2299 19.1116L22.2134 11.1317L22.2084 11.1267Z"
                fill="white"
              />
            </g>
          </svg>
        </div>
      )}
      {filteredAttachments?.length > 1 && (
        <div
          onClick={rightNav}
          className="bg-[#00000033] rounded-[8.279px] p-7 absolute right-5 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="20"
            viewBox="0 0 23 20"
            fill="none"
          >
            <path
              d="M22.2084 11.1267C22.8321 10.5033 22.8321 9.49083 22.2084 8.8674L14.2249 0.887494C13.6012 0.264064 12.5883 0.264064 11.9646 0.887494C11.3409 1.51092 11.3409 2.52337 11.9646 3.1468L17.2287 8.40357H1.92042C1.03725 8.40357 0.32373 9.11677 0.32373 9.99955C0.32373 10.8823 1.03725 11.5955 1.92042 11.5955H17.2237L11.9696 16.8523C11.3459 17.4757 11.3459 18.4882 11.9696 19.1116C12.5933 19.735 13.6062 19.735 14.2299 19.1116L22.2134 11.1317L22.2084 11.1267Z"
              fill="white"
            />
          </svg>
        </div>
      )}
      <div className="absolute bottom-3 right-6 text-[white] text-[23px] font-bold">
        {attachmentList.findIndex((item: any) => item === attachment) + 1}/
        {attachmentList.length}
      </div>
    </div>
  )
}

interface ImageModalProps {
  attachment: any
  attachmentList: any
  imageUrl: string
  onClose: () => void
  setSelectedAttachment: any
  chatMessage?: any
}
const ImageModal: React.FC<ImageModalProps> = ({
  imageUrl,
  onClose,
  attachment,
  attachmentList,
  setSelectedAttachment,
  chatMessage,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1)
  const [item, setItem] = useState(-1)
  const imageRef = useRef<HTMLImageElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const mainContainerRef = useRef<HTMLDivElement>(null)
  const [filteredAttachments, setFilteredAttachments] = useState<any>()

  useEffect(() => {
    const filter = attachmentList.filter(
      (item: any) =>
        item.type === "application/pdf" ||
        item.type.startsWith("video") ||
        item.type.startsWith("image")
    )
    setFilteredAttachments(filter)
  }, [])

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  useEffect(() => {
    // Focus on the main container div when the component mounts
    // Using this to get the onKeyDown event
    if (mainContainerRef.current) {
      mainContainerRef.current.focus()
    }
    let index = attachmentList.findIndex(
      (item: any) => item.url === attachment.url
    )
    setItem(index)
  }, [])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      onClose()
    }
  }

  const rightNav = () => {
    let nextItem = item
    do {
      nextItem = (nextItem + 1) % attachmentList.length

      if (
        attachmentList[nextItem].type === "application/pdf" ||
        // attachmentList[nextItem].type.startsWith("audio") ||
        attachmentList[nextItem].type.startsWith("video") ||
        (attachmentList[nextItem].type.startsWith("image") &&
          !UNSUPPORTEDIMAGETYPE.includes(attachmentList[nextItem].type))
      ) {
        setItem(nextItem)
        setSelectedAttachment(attachmentList[nextItem])
        return
      }
    } while (nextItem !== item)
  }

  const leftNav = () => {
    let prevItem = item

    do {
      prevItem = (prevItem - 1 + attachmentList.length) % attachmentList.length

      if (
        attachmentList[prevItem].type === "application/pdf" ||
        // attachmentList[prevItem].type.startsWith("audio") ||
        attachmentList[prevItem].type.startsWith("video") ||
        (attachmentList[prevItem].type.startsWith("image") &&
          !UNSUPPORTEDIMAGETYPE.includes(attachmentList[prevItem].type))
      ) {
        setItem(prevItem)
        setSelectedAttachment(attachmentList[prevItem])
        return
      }
    } while (prevItem !== item)
  }

  const Controls = () => {
    const { zoomIn, zoomOut, resetTransform } = useControls()
    const [zoomInClicks, setZoomInClicks] = useState(0)
    const [zoomOutClicks, setZoomOutClicks] = useState(0)
    const maxClicks = 5
    const handleZoomIn = () => {
      if (zoomInClicks < maxClicks) {
        zoomIn()
        setZoomInClicks((prev) => prev + 1)
        if (zoomOutClicks > 0) {
          setZoomOutClicks((prev) => prev - 1)
        }
      }
    }

    const handleZoomOut = () => {
      if (zoomOutClicks < maxClicks) {
        zoomOut()
        setZoomOutClicks((prev) => prev + 1)
        if (zoomInClicks > 0) {
          setZoomInClicks((prev) => prev - 1)
        }
      }
    }

    useEffect(() => {
      setZoomInClicks(0)
      setZoomOutClicks(0)
    }, [])

    return (
      <>
        <div
          onClick={() => handleZoomOut()}
          style={{
            opacity: zoomOutClicks >= maxClicks ? 0.5 : 1,
            pointerEvents: zoomOutClicks >= maxClicks ? "none" : "auto",
          }}
          className="bg-[#00000050] rounded-[5px] p-2 mr-20  absolute bottom-3 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              d="M13.2193 7.73464C13.2193 8.94496 12.8264 10.063 12.1645 10.9701L15.5028 14.3109C15.8324 14.6405 15.8324 15.1758 15.5028 15.5054C15.1732 15.835 14.6379 15.835 14.3083 15.5054L10.9701 12.1645C10.063 12.829 8.94496 13.2193 7.73464 13.2193C4.70491 13.2193 2.25 10.7644 2.25 7.73464C2.25 4.70491 4.70491 2.25 7.73464 2.25C10.7644 2.25 13.2193 4.70491 13.2193 7.73464ZM5.83611 7.1018C5.48541 7.1018 5.20327 7.38394 5.20327 7.73464C5.20327 8.08534 5.48541 8.36749 5.83611 8.36749H9.63317C9.98387 8.36749 10.266 8.08534 10.266 7.73464C10.266 7.38394 9.98387 7.1018 9.63317 7.1018H5.83611Z"
              fill="white"
            />
          </svg>
        </div>
        <div
          style={{
            opacity: zoomInClicks >= maxClicks ? 0.5 : 1,
            pointerEvents: zoomInClicks >= maxClicks ? "none" : "auto",
          }}
          onClick={handleZoomIn}
          className="bg-[#00000050] rounded-[5px] p-2  absolute bottom-3 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              d="M13.2193 7.73464C13.2193 8.94496 12.8264 10.063 12.1645 10.9701L15.5028 14.3109C15.8324 14.6405 15.8324 15.1758 15.5028 15.5054C15.1732 15.835 14.6379 15.835 14.3083 15.5054L10.9701 12.1645C10.063 12.829 8.94496 13.2193 7.73464 13.2193C4.70491 13.2193 2.25 10.7644 2.25 7.73464C2.25 4.70491 4.70491 2.25 7.73464 2.25C10.7644 2.25 13.2193 4.70491 13.2193 7.73464ZM7.1018 10.0551C7.1018 10.4058 7.38394 10.6879 7.73464 10.6879C8.08534 10.6879 8.36749 10.4058 8.36749 10.0551V8.36749H10.0551C10.4058 8.36749 10.6879 8.08534 10.6879 7.73464C10.6879 7.38394 10.4058 7.1018 10.0551 7.1018H8.36749V5.41422C8.36749 5.06352 8.08534 4.78137 7.73464 4.78137C7.38394 4.78137 7.1018 5.06352 7.1018 5.41422V7.1018H5.41422C5.06352 7.1018 4.78137 7.38394 4.78137 7.73464C4.78137 8.08534 5.06352 8.36749 5.41422 8.36749H7.1018V10.0551Z"
              fill="white"
            />
          </svg>
        </div>
        <a
          href={attachment.url}
          download
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="bg-[#00000050] rounded-[5px] p-2 absolute ml-20 bottom-3 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              d="M3.375 16.294C2.75273 16.294 2.25 15.8191 2.25 15.2313C2.25 14.6435 2.75273 14.1686 3.375 14.1686H14.625C15.2473 14.1686 15.75 14.6435 15.75 15.2313C15.75 15.8191 15.2473 16.294 14.625 16.294H3.375ZM9.79453 11.731C9.35508 12.1461 8.64141 12.1461 8.20195 11.731L3.70195 7.48014C3.2625 7.06502 3.2625 6.39086 3.70195 5.97573C4.14141 5.56061 4.85508 5.56061 5.29453 5.97573L7.875 8.41334V2.47873C7.875 1.89092 8.37773 1.41602 9 1.41602C9.62227 1.41602 10.125 1.89092 10.125 2.47873V8.41334L12.7055 5.97573C13.1449 5.56061 13.8586 5.56061 14.298 5.97573C14.7375 6.39086 14.7375 7.06502 14.298 7.48014L9.79805 11.731H9.79453Z"
              fill="white"
            />
          </svg>
        </a>
      </>
    )
  }

  return (
    <div
      ref={mainContainerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="fixed outline-none inset-0 z-[50] flex items-center justify-center bg-[black]  bg-opacity-20 backdrop-filter  backdrop-blur-sm"
    >
      <div className="relative rounded-lg overflow-hidden w-max  max-w-[calc(100vw-200px)]  h-full  flex items-center justify-center">
        <div className=" flex items-center justify-center relative w-full h-full">
          {/* <div className={isLoading ?'block' : "hidden"}> <svg className="animate-spin" width="70" height="70" viewBox="0 0 22 22" fill="none">
          <path d="M21.896 11C21.896 17.0177 17.0177 21.896 11 21.896C4.9823 21.896 0.104004 17.0177 0.104004 11C0.104004 4.9823 4.9823 0.104004 11 0.104004C17.0177 0.104004 21.896 4.9823 21.896 11ZM2.29842 11C2.29842 15.8057 6.19424 19.7016 11 19.7016C15.8057 19.7016 19.7016 15.8057 19.7016 11C19.7016 6.19424 15.8057 2.29842 11 2.29842C6.19424 2.29842 2.29842 6.19424 2.29842 11Z" fill="url(#paint0_linear_2993_206634)" />
          <defs>
            <linearGradient id="paint0_linear_2993_206634" x1="8.03545" y1="1.24821" x2="26.5768" y2="13.5484" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" />
              <stop offset="1" stopColor="#D9D9D9" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg></div> */}
          <TransformWrapper>
            <TransformComponent>
              <img
                ref={imageRef}
                src={imageUrl}
                alt="Uploaded"
                className="object-contain rounded-[20px] mb-12  min-h-[250px] min-w-[400px] max-h-[calc(100vh-200px)] max-w-[calc(100vw-200px)] transition-transform duration-300 ease-in-out"
                // style={{ transform: `scale(${zoomLevel})` }}
                onLoad={handleImageLoad}
              />
              {chatMessage?.body?.plainText && (
                <div className="absolute rounded-[10px] bottom-0 bg-[#0000004D] w-full py-1 px-3 text-[20px] text-[#ffffff] truncate">
                  {chatMessage?.body?.plainText ?? ""}
                </div>
              )}
            </TransformComponent>
            <Controls />
          </TransformWrapper>
        </div>
      </div>
      <div className="absolute top-6 left-6 px-3 py-1 text-[#FEFDFB] rounded-[50px] bg-[#00000080] bg-opacity-50">
        {attachment.name}
      </div>
      <button
        className="absolute top-6 right-6 p-1 text-white bg-gray-600 rounded hover:bg-gray-700 bg-[#000000] bg-opacity-50"
        onClick={onClose}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          viewBox="0 0 20 20"
          fill="#ffffff"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M14.354 14.354a.5.5 0 0 1-.708 0L10 10.707l-3.646 3.647a.5.5 0 0 1-.708-.708L9.293 10l-3.647-3.646a.5.5 0 0 1 .708-.708L10 9.293l3.646-3.647a.5.5 0 0 1 .708.708L10.707 10l3.647 3.646a.5.5 0 0 1 0 .708z"
          />
        </svg>
      </button>
      {filteredAttachments?.length > 1 && (
        <div
          onClick={leftNav}
          className="bg-[#00000033] rounded-[8.279px] p-7 absolute left-5 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="20"
            viewBox="0 0 23 20"
            fill="none"
          >
            <g transform="scale(-1, 1) translate(-23, 0)">
              <path
                d="M22.2084 11.1267C22.8321 10.5033 22.8321 9.49083 22.2084 8.8674L14.2249 0.887494C13.6012 0.264064 12.5883 0.264064 11.9646 0.887494C11.3409 1.51092 11.3409 2.52337 11.9646 3.1468L17.2287 8.40357H1.92042C1.03725 8.40357 0.32373 9.11677 0.32373 9.99955C0.32373 10.8823 1.03725 11.5955 1.92042 11.5955H17.2237L11.9696 16.8523C11.3459 17.4757 11.3459 18.4882 11.9696 19.1116C12.5933 19.735 13.6062 19.735 14.2299 19.1116L22.2134 11.1317L22.2084 11.1267Z"
                fill="white"
              />
            </g>
          </svg>
        </div>
      )}
      {filteredAttachments?.length > 1 && (
        <div
          onClick={rightNav}
          className="bg-[#00000033] rounded-[8.279px] p-7 absolute right-5 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="20"
            viewBox="0 0 23 20"
            fill="none"
          >
            <path
              d="M22.2084 11.1267C22.8321 10.5033 22.8321 9.49083 22.2084 8.8674L14.2249 0.887494C13.6012 0.264064 12.5883 0.264064 11.9646 0.887494C11.3409 1.51092 11.3409 2.52337 11.9646 3.1468L17.2287 8.40357H1.92042C1.03725 8.40357 0.32373 9.11677 0.32373 9.99955C0.32373 10.8823 1.03725 11.5955 1.92042 11.5955H17.2237L11.9696 16.8523C11.3459 17.4757 11.3459 18.4882 11.9696 19.1116C12.5933 19.735 13.6062 19.735 14.2299 19.1116L22.2134 11.1317L22.2084 11.1267Z"
              fill="white"
            />
          </svg>
        </div>
      )}
      <div className="absolute bottom-3 right-6 text-[white] text-[23px] font-bold">
        {attachmentList.findIndex((item: any) => item === attachment) + 1}/
        {attachmentList.length}
      </div>
    </div>
  )
}

const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return "0 Bytes"

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

const icons = (
  item: any,
  video: any,
  chatMessage: any,
  chatInstance: any,
  pdf: boolean
) => {
  const DeleteFile = (item: any) => {
    // const modifiedArray = chatMessage.attachments.map((obj:any) => {
    //   if (obj.url === item.url) {
    //     return {
    //       ...obj,
    //       deleted: true,
    //       url: undefined,
    //     };
    //   }
    //   return obj;
    // });
    //   chatInstance?.editMessage(
    //     chatMessage.uuid,
    //     chatMessage.to,
    //     chatMessage.group,
    //     {
    //       attachments: modifiedArray,
    //     }
    //   );
  }

  return (
    <>
      {!UNSUPPORTEDIMAGETYPE.includes(item.type) && (
        <div
          className={`top-2 absolute z-[5] cursor-pointer right-2 bg-[#FFFFFF] p-1 rounded-md hidden  group-files-hover:block`}
        >
          <div className="p-1 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <g clip-path="url(#clip0_836_19275)">
                <path
                  d="M1.28571 0C0.574554 0 0 0.574554 0 1.28571V5.14286C0 5.85402 0.574554 6.42857 1.28571 6.42857C1.99688 6.42857 2.57143 5.85402 2.57143 5.14286V2.57143H5.14286C5.85402 2.57143 6.42857 1.99688 6.42857 1.28571C6.42857 0.574554 5.85402 0 5.14286 0H1.28571ZM2.57143 12.8571C2.57143 12.146 1.99688 11.5714 1.28571 11.5714C0.574554 11.5714 0 12.146 0 12.8571V16.7143C0 17.4254 0.574554 18 1.28571 18H5.14286C5.85402 18 6.42857 17.4254 6.42857 16.7143C6.42857 16.0031 5.85402 15.4286 5.14286 15.4286H2.57143V12.8571ZM12.8571 0C12.146 0 11.5714 0.574554 11.5714 1.28571C11.5714 1.99688 12.146 2.57143 12.8571 2.57143H15.4286V5.14286C15.4286 5.85402 16.0031 6.42857 16.7143 6.42857C17.4254 6.42857 18 5.85402 18 5.14286V1.28571C18 0.574554 17.4254 0 16.7143 0H12.8571ZM18 12.8571C18 12.146 17.4254 11.5714 16.7143 11.5714C16.0031 11.5714 15.4286 12.146 15.4286 12.8571V15.4286H12.8571C12.146 15.4286 11.5714 16.0031 11.5714 16.7143C11.5714 17.4254 12.146 18 12.8571 18H16.7143C17.4254 18 18 17.4254 18 16.7143V12.8571Z"
                  fill="#5C6779"
                />
              </g>
              <defs>
                <clipPath id="clip0_836_19275">
                  <rect width="18" height="18" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
      )}
      <div
        className={` ${
          UNSUPPORTEDIMAGETYPE.includes(item.type) ? "right-[10px]" : "right-12"
        } absolute z-[5] top-2 bg-[#FFFFFF] py-1 rounded-md hidden  group-files-hover:block`}
      >
        <a
          href={getURL(item.url)}
          download
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className=" px-2 block text-white text-x rounded"
        >
          <div className="py-1 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                d="M3.375 16.294C2.75273 16.294 2.25 15.8191 2.25 15.2313C2.25 14.6435 2.75273 14.1686 3.375 14.1686H14.625C15.2473 14.1686 15.75 14.6435 15.75 15.2313C15.75 15.8191 15.2473 16.294 14.625 16.294H3.375ZM9.79453 11.731C9.35508 12.1461 8.64141 12.1461 8.20195 11.731L3.70195 7.48014C3.2625 7.06502 3.2625 6.39086 3.70195 5.97573C4.14141 5.56061 4.85508 5.56061 5.29453 5.97573L7.875 8.41334V2.47873C7.875 1.89092 8.37773 1.41602 9 1.41602C9.62227 1.41602 10.125 1.89092 10.125 2.47873V8.41334L12.7055 5.97573C13.1449 5.56061 13.8586 5.56061 14.298 5.97573C14.7375 6.39086 14.7375 7.06502 14.298 7.48014L9.79805 11.731H9.79453Z"
                fill="#5C6779"
              />
            </svg>
          </div>
        </a>
      </div>
      {/* <div
          className={`${
            !video ? "-top-4" : "top-2"
          }  absolute z-[5] cursor-pointer top-2 right-[89px] bg-[#FFFFFF] p-1 rounded-md hidden  group-files-hover:block`}
        >
          <div onClick={()=>DeleteFile(item)} className="p-1 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                d="M6.62143 2.69077L6.42857 3.04688H3.85714C3.38304 3.04688 3 3.40298 3 3.84375C3 4.28452 3.38304 4.64062 3.85714 4.64062H14.1429C14.617 4.64062 15 4.28452 15 3.84375C15 3.40298 14.617 3.04688 14.1429 3.04688H11.5714L11.3786 2.69077C11.2339 2.41934 10.9366 2.25 10.6125 2.25H7.3875C7.06339 2.25 6.76607 2.41934 6.62143 2.69077ZM14.1429 5.4375H3.85714L4.425 13.8794C4.46786 14.5094 5.03036 15 5.70804 15H12.292C12.9696 15 13.5321 14.5094 13.575 13.8794L14.1429 5.4375Z"
                fill="#5C6779"
              />
            </svg>
          </div>
        </div> */}
    </>
  )
}

const Loader = (
  <div
    className={`w-full h-full absolute  top-0 left-0 flex justify-center items-center p-2 `}
  >
    <svg
      aria-hidden="true"
      className={`inline ${
        // size === "sm" ? "w-6 h-6" : size === "md" ? "w-9 h-9" :
        "w-5 h-5"
      } mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600`}
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="#ccc"
      />

      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="#222"
      />
    </svg>
  </div>
)
