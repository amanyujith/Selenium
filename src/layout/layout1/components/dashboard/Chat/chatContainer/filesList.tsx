/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import pdfImage from "../../../../../../constants/images/pdfImage.svg"
import audoImage from "../../../../../../constants/images/audioImage.svg"
import docImage from "../../../../../../constants/images/docImage.svg"
import excelImage from "../../../../../../constants/images/excelImage.svg"
import mp3image from "../../../../../../constants/images/mp3image.svg"
import plainTextImage from "../../../../../../constants/images/plainTextImage.svg"
import pptImage from "../../../../../../constants/images/pptImage.svg"
import svgImage from "../../../../../../constants/images/svgImage.svg"
import wavImage from "../../../../../../constants/images/wavImage.svg"
import wordImage from "../../../../../../constants/images/wordImage.svg"
import zipImage from "../../../../../../constants/images/zipImage.svg"
import videoImage from "../../../../../../constants/images/videoImage.svg"
import file from "../images/description.svg"
import { actionCreators } from "../../../../../../store"
import { useNavigate } from "react-router-dom"
import { IChatRoot } from "../interfaces"
import path from "../../../../../../navigation/routes.path"
import emptyfile from "../../../../../../constants/images/emptyFile.jpg"
import { motion } from "framer-motion"
const _ = require("lodash")

interface IRoot {
  Chat: IChatRoot
}

const FilesList = (props: any) => {
  const { data, setViewMore, setMiniProfile } = props
  const [searchText, setSearchText] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [resultStatus, setResultStatus] = useState<any>(false)
  const [activeTab, setActiveTab] = useState(0)
  const [files, setFiles] = useState<any>()
  const [filteredfiles, setFilteredFiles] = useState([])
  const chatInstance = useSelector((state: any) => state.Chat.chatInstance)
  const usersList = useSelector((state: IRoot) => state.Chat.userData)
  const [totalFiles, setTotalFiles] = useState<any>(0)
  const { data: activeChat, isGroups } = useSelector(
    (state: any) => state.Chat.activeChat
  )
  const groupsList = useSelector((state: any) => state.Chat.groupData)
  const loggedInUserInfo = useSelector(
    (state: any) => state.Main.loggedInUserInfo
  )
  const [loader, setloader] = useState<any>(false)

  const getData = () => {
    setloader(true)
    chatInstance
      ?.getChatFile(data.uuid, data.members ? true : false)
      .then((res: any) => {
        setFiles(res)
        setSearchText("")
        setResultStatus(false)
        setTotalFiles(
          Object.values(res).reduce((acc: any, arr: any) => acc + arr.length, 0)
        )
        setloader(false)
      })
  }

  useEffect(() => {
    getData()
  }, [activeTab])

  const handleDebounceFn = async (searchText: string) => {
    let type: any = ""
    activeTab === 0
      ? (type = "doc")
      : activeTab === 1
      ? (type = "image")
      : (type = "media")
    setloader(true)
    if (searchText !== "") {
      await chatInstance
        ?.searchFile(searchText, data.uuid, type, data.members ? true : false)
        .then((res: any) => {
          setFiles(res)
          setloader(false)
        })
        .catch((e: any) => {
          setloader(false)
        })
    } else {
      onHandleClose()
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
    debounceFn(e.target.value)
  }

  const debounceFn = useCallback(_.debounce(handleDebounceFn, 500), [files])

  const onHandleClose = () => {
    setSearchText("")
    getData()
    setResultStatus(false)
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

  useEffect(() => {
    if (activeTab === 0) {
      setFilteredFiles(files?.document ? files?.document : files)
    } else if (activeTab === 1) {
      setFilteredFiles(files?.image ? files?.image : files)
    } else {
      setFilteredFiles(files?.media ? files?.media : files)
    }
  }, [activeTab, files])

  const goToFile = (item: any) => {
    let to: any = ""
    item.to === loggedInUserInfo?.sub ? (to = item.from) : (to = item.to)
    if (data?.members) {
      const hasGroup = groupsList.some((node: any) => node.uuid === to)
      if (hasGroup) {
        if (to === activeChat?.uuid) {
          dispatch(actionCreators.gotoFile(item.uuid))
          setViewMore(false)
          dispatch(actionCreators.setMiniProfile(false))
        } else {
          dispatch(actionCreators.setAcitveChat(to, true))
          dispatch(actionCreators.gotoFile(item.uuid))
          setViewMore(false)
          dispatch(actionCreators.setMiniProfile(false))
          navigate(`${path.CHAT}/${to}`)
        }
      } else {
        chatInstance
          ?.fetchUserChats(to, 25)
          .then((res: any) => {
            dispatch(
              actionCreators.addNewChat({ data: res, isGroup: true }, true)
            )
            dispatch(actionCreators.gotoFile(item.uuid))
            setViewMore(false)
            dispatch(actionCreators.setMiniProfile(false))
            navigate(`${path.CHAT}/${to}`)
          })
          .catch((err: any) => {})
      }
    } else {
      const hasUser = usersList.some((node: any) => node.uuid === to)
      if (hasUser) {
        if (to === activeChat?.uuid) {
          dispatch(actionCreators.gotoFile(item.uuid))
          setViewMore(false)
          dispatch(actionCreators.setMiniProfile(false))
        } else {
          dispatch(actionCreators.setAcitveChat(to, false))
          dispatch(actionCreators.gotoFile(item.uuid))
          setViewMore(false)
          dispatch(actionCreators.setMiniProfile(false))
          navigate(`${path.CHAT}/${to}`)
        }
      } else {
        chatInstance
          ?.fetchUserChats(to, 25)
          .then((res: any) => {
            dispatch(
              actionCreators.addNewChat({ data: res, isGroup: false }, true)
            )
            dispatch(actionCreators.gotoFile(item.uuid))
            setViewMore(false)
            dispatch(actionCreators.setMiniProfile(false))
            navigate(`${path.CHAT}/${to}`)
          })
          .catch((err: any) => {})
      }
    }
  }

  return (
    <motion.div
      key="files"
      initial={{ opacity: 0, translateY: "60px" }}
      animate={{
        opacity: 1,
        translateY: "0px",
        transition: { duration: 0.4 },
      }}
      className="p-1"
    >
      <div className="font-bold text-sm py-3">Shared Files ({totalFiles})</div>
      <ul className="flex justify-start h-fit text-center transition-all ease-in-out text-[#293241] pr-2 w-2/3">
        <li
          className={`inline-block w-[100%] ${
            activeTab === 0 ? "font-semibold" : ""
          }`}
        >
          <a
            onClick={() => setActiveTab(0)}
            className={`flex justify-center py-2 cursor-pointer items-center}`}
          >
            <div
              className={`${
                activeTab === 0 ? "text-primary-text" : ""
              } text-left capitalize`}
            >
              Documents
            </div>
          </a>
        </li>
        <li
          className={`inline-block w-[100%]  ${
            activeTab === 1 ? "font-semibold " : ""
          }`}
        >
          <a
            onClick={() => setActiveTab(1)}
            className={`flex justify-center py-2 cursor-pointer items-center }`}
          >
            <div
              className={`${
                activeTab === 1 ? "text-primary-text" : ""
              } text-left capitalize`}
            >
              Images
            </div>
          </a>
        </li>
        <li
          className={`inline-block w-[100%]  ${
            activeTab === 2 ? "font-semibold " : ""
          }`}
        >
          <a
            onClick={() => setActiveTab(2)}
            className={`flex justify-center py-2 cursor-pointer items-center }`}
          >
            <div
              className={`${
                activeTab === 2 ? "text-primary-text" : ""
              } text-left capitalize`}
            >
              Media
            </div>
          </a>
        </li>
      </ul>
      <div className="flex flex-row content-center border-[1px] rounded-[7px] mx-1 p-1 mt-2 border-[#0000001F]">
        <svg
          className="mt-[2px] mx-3"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
        >
          <g clip-path="url(#clip0_797_20343)">
            <path
              d="M14.625 7.3125C14.625 8.92617 14.1012 10.4168 13.2188 11.6262L17.6695 16.0805C18.109 16.5199 18.109 17.2336 17.6695 17.673C17.2301 18.1125 16.5164 18.1125 16.077 17.673L11.6262 13.2188C10.4168 14.1047 8.92617 14.625 7.3125 14.625C3.27305 14.625 0 11.352 0 7.3125C0 3.27305 3.27305 0 7.3125 0C11.352 0 14.625 3.27305 14.625 7.3125ZM7.3125 12.375C7.97732 12.375 8.63562 12.2441 9.24984 11.9896C9.86405 11.7352 10.4221 11.3623 10.8922 10.8922C11.3623 10.4221 11.7352 9.86405 11.9896 9.24984C12.2441 8.63562 12.375 7.97732 12.375 7.3125C12.375 6.64768 12.2441 5.98938 11.9896 5.37516C11.7352 4.76095 11.3623 4.20287 10.8922 3.73277C10.4221 3.26268 9.86405 2.88977 9.24984 2.63536C8.63562 2.38095 7.97732 2.25 7.3125 2.25C6.64768 2.25 5.98938 2.38095 5.37516 2.63536C4.76095 2.88977 4.20287 3.26268 3.73277 3.73277C3.26268 4.20287 2.88977 4.76095 2.63536 5.37516C2.38095 5.98938 2.25 6.64768 2.25 7.3125C2.25 7.97732 2.38095 8.63562 2.63536 9.24984C2.88977 9.86405 3.26268 10.4221 3.73277 10.8922C4.20287 11.3623 4.76095 11.7352 5.37516 11.9896C5.98938 12.2441 6.64768 12.375 7.3125 12.375Z"
              fill="#B1B1B1"
            />
          </g>
          <defs>
            <clipPath id="clip0_797_20343">
              <rect width="18" height="18" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <input
          className="text-primary-200 border-0 focus:border-0 focus:outline-none w-full"
          placeholder={"Search documents you need"}
          type="text"
          name="CreateGroupSearch"
          value={searchText}
          onChange={handleSearchChange}
        />
      </div>
      {loader ? (
        <div
          className={`w-full h-[calc(100vh-640px)] relative top-0 left-0 mb-1 mt-1 px-3 flex justify-center items-center p-2 `}
        >
          <svg
            aria-hidden="true"
            className={`inline ${
              // size === "sm" ? "w-6 h-6" : size === "md" ? "w-9 h-9" :
              "w-12 h-12"
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
      ) : filteredfiles?.length > 0 ? (
        <div className="h-[calc(100vh-640px)] mb-1 mt-1 px-3 overflow-y-auto overflow-x-hidden">
          {filteredfiles.map((file: any, index: number) => {
            return (
              <div
                onClick={() => goToFile(file)}
                key={index}
                className="hover:bg-[#868c962f] cursor-pointer"
              >
                <div className="flex flex-row items-center my-3">
                  <img
                    className={"h-[27px] w-[27px] p-1"}
                    src={mapIcons(file)}
                    alt={file.type}
                  />
                  <div className="text-sm text-[#5C6779] px-2 truncate">
                    {file.name}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="h-[calc(100vh-640px)] flex flex-col justify-center items-center mb-1 mt-1 px-3 overflow-y-auto overflow-x-hidden">
          <img src={emptyfile} className="" alt="" />
          <div className="text-[#C4C4C4] py-2">You have no shared files!</div>
        </div>
      )}
    </motion.div>
  );
}

export default FilesList
