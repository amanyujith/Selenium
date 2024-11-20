/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from "react"
import PinnedMessage from "./pinnedMessage"
import { useDispatch, useSelector } from "react-redux"
import { actionCreators } from "../../../../../../store"
import FilesList from "./filesList"
import { IChatRoot } from "../interfaces"
import { useNavigate } from "react-router-dom"
import path from "../../../../../../navigation/routes.path"
import GrpInfo from "./grpInfo"
import AddMemberModal from "../../Modal/addGroupMember"
import { t } from "i18next"
import InputFields from "../../../../../../atom/InputField/inputField"
import Picker from "@emoji-mart/react"
import data from "@emoji-mart/data"
import noPinned from "../../../../../../constants/images/noPinned.jpg"
import { motion } from "framer-motion"
import Tooltip from "../../../../../../atom/ToolTip/Tooltip"
const maxNameLength = 30
const maxDiscriptionLength = 120
const minNameLength = 1

const presenceColors: any = {
  online: "#76B947",
  call: "#EF4036",
}
interface Props {
  mention: any
  isGroup: any
  routeChange?: any
  setVideoCall: any
  setAudioCall: any
  setViewMore: any
  mentionFlag: boolean
  grpHover: boolean
  setModal?: any
}

interface IRoot {
  Chat: IChatRoot
}
const ViewMore = ({
  mention,
  isGroup,
  routeChange,
  setVideoCall,
  setAudioCall,
  setViewMore,
  mentionFlag,
  grpHover,
  setModal,
}: Props) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)
  const loggedInUserInfo = useSelector(
    (state: any) => state.Main.loggedInUserInfo
  )
  const profileColors = ["#557BBB", "#B78931", "#91785B"]
  let colorIndex: any =
    (mention?.uuid?.match(/\d/g).join("") + new Date().getDate()) %
    profileColors.length
  const personalInfo = useSelector((state: any) => state.Chat.personalInfo)
  const [isEmojiOpen1, setIsEmojiOpen1] = useState<boolean>(false)
  const [edit, setEdit] = useState<boolean>(false)
  const chatInstance = useSelector((state: any) => state.Chat.chatInstance)
  const [userData, setUserData] = useState<any>({})
  const usersList = useSelector((state: IRoot) => state.Chat.userData)
  const selfData = useSelector((state: any) => state.Chat.selfData)
  const { data: activeChat, isGroups } = useSelector(
    (state: any) => state.Chat.activeChat
  )
  const [errMsg, setErrMsg] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const groupsList = useSelector((state: any) => state.Chat.groupData)
  const [errorMsg, setErrorMsg] = useState<string>("")
  const [addMemberModal, setAddMemberModal] = useState<boolean>(false)
  const [name, setName] = useState<any>(
    mention.display_name ? mention.display_name : mention.name
  )
  const [status, setStatus] = useState<any>(
    mention.members ? mention.description : mention.personal_status
  )
  const [isEmojiOpen2, setIsEmojiOpen2] = useState<boolean>(false)
  const pickerRef = useRef<HTMLDivElement>(null)
  const miniProfile = useSelector((state: any) => state.Chat.setMiniProfile)
  const callInfo = useSelector((state: any) => state.Chat.chatCallInfo)

  const options: Intl.DateTimeFormatOptions = {
    timeZone: mention?.time_zone?.country,
    hour12: true,
    hour: "numeric",
    minute: "numeric",
  }
  const scrollToPinned = (item: any) => {
    let to: any = ""
    item.to === loggedInUserInfo?.sub ? (to = item.from) : (to = item.to)
    if (mention?.members) {
      const hasGroup = groupsList.some((node: any) => node.uuid === to)
      if (hasGroup) {
        if (to === activeChat?.uuid) {
          dispatch(actionCreators.pinnedChat(item.uuid))
          setViewMore(false)
          dispatch(actionCreators.setMiniProfile(false))
        } else {
          dispatch(actionCreators.setAcitveChat(to, true))
          dispatch(actionCreators.pinnedChat(item.uuid))
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
            dispatch(actionCreators.pinnedChat(item.uuid))
            setViewMore(false)
            dispatch(actionCreators.setMiniProfile(false))
            navigate(`${path.CHAT}/${to}`)
          })
          .catch((err: any) => {
            console.log("User Not Found")
          })
      }
    } else {
      const hasUser = usersList.some((node: any) => node.uuid === to)
      if (hasUser) {
        if (to === activeChat?.uuid) {
          dispatch(actionCreators.pinnedChat(item.uuid))
          setViewMore(false)
          dispatch(actionCreators.setMiniProfile(false))
        } else {
          dispatch(actionCreators.setAcitveChat(to, false))
          dispatch(actionCreators.pinnedChat(item.uuid))
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
            dispatch(actionCreators.pinnedChat(item.uuid))
            setViewMore(false)
            dispatch(actionCreators.setMiniProfile(false))
            navigate(`${path.CHAT}/${to}`)
          })
          .catch((err: any) => {
            console.log("User Not Found")
          })
      }
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        // Clicked outside the picker, handle the event here
        console.log("Clicked outside the picker")
      }
    }

    // Bind the event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutside)

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleUpdate = () => {
    if (
      status.length <= maxDiscriptionLength &&
      name.length <= maxNameLength &&
      name.length >= minNameLength
    ) {
      setEdit(!edit);
      let data: any = { description: status };
      let title = mention.display_name ? mention.display_name : mention.name;
      if (title !== name) data.name = name;
      chatInstance
        ?.updateGroup(mention.uuid, data)
        .then((res: any) => {})
        .catch((err: any) => {
          console.log("User Not Found", err.reason.reason);
          setErrorMsg(err.reason.reason);
        });
    }
  }

  const addEmoji = (e: any) => {
    let sym = e.native
    if (isEmojiOpen1) setName(name + sym)
    if (isEmojiOpen2) setStatus(status + sym)
  }

  const handleUnpin = (e: any, id: string) => {
    e.stopPropagation()
    // if (mention.pinned_messages.length === 1) {
    //   setViewMore(false);
    //   dispatch(actionCreators.setMiniProfile(false));
    // }
    chatInstance?.pinMessage(mention.uuid, isGroup, id, false)
    // dispatch(
    //   actionCreators.pinMessage(
    //     mention.uuid,
    //     isGroup,
    //     id,
    //     loggedInUserInfo?.sub,
    //     false
    //   )
    // );
    chatInstance?.grafanaLogger(["Client : Unpin Messages"], {
      uuid: mention.uuid,
      isGroup: isGroup,
      messageUUID: id,
      selfId: loggedInUserInfo?.sub,
    })
  }

  const toggleAddMemberModal = () => {
    setAddMemberModal((prev) => !prev)
  }

  useEffect(() => {
    if (mentionFlag || grpHover) {
      chatInstance
        ?.fetchUserChats(mention.uuid, 25)
        .then((res: any) => {
          setUserData(res.api_response)
        })
        .catch((err: any) => {})
    } else {
      setUserData(mention)
    }
  }, [])

  const handleErrorMessage = (msg: string) => {
    // clearTimeout(timeoutRef.current!);
    // setMaxSize(true);

    if (msg) {
      setErrMsg(msg)
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        setErrMsg(null)
      }, 5000)
    } else {
      setErrMsg(null)
    }
  }

  useEffect(() => {
    if (errMsg) {
      timeoutRef.current = setTimeout(() => {
        setErrMsg(null)
      }, 5000)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current!)
      }
    }
  }, [errMsg])

  const leaveGroup = () => {
    chatInstance
      ?.deleteGroupMember(mention.uuid, personalInfo.uuid)
      .then((res: any) => {
        setViewMore(false)
        dispatch(actionCreators.setMiniProfile(false))
      })
      .catch((err: any) => {
        handleErrorMessage(err.response.data.reason)
      })
  }

  const archiveGroup = () => {
    chatInstance
      ?.archiveGroup(activeChat.uuid)
      .then((res: any) => {
        setViewMore(false)
        dispatch(actionCreators.setMiniProfile(false))
      })
      .catch((err: any) => {
        //handleErrorMessage(err.response.data.reason);
      })
  }

  return (
    <div
      onClick={() => dispatch(actionCreators.setTwoOptionModal(-1))}
      className="bg-[#00000033] backdrop-blur fixed inset-0 z-[300]"
    >
      <div className="flex justify-center items-center w-full h-full overflow-x-hidden overflow-y-auto">
        <motion.div
          key="veiwMore"
          initial={{ opacity: 0, translateY: "60px" }}
          animate={{
            opacity: 1,
            translateY: "0px",
            transition: { duration: 0.4 },
          }}
          className="flex flex-col max-h-[calc(100vh-100px)] h-fit text-[#293241] w-[500px] rounded-[15px] bg-[white]  "
        >
          <div className="min-h-[calc(100%-130px)] h-fit bg-[#EBEDEF] p-[12px] rounded-t-[15px] flex flex-col gap-3 items-center relative">
            <svg
              className="place-self-end cursor-pointer"
              onClick={() => {
                setViewMore(false);
                if (setModal) setModal("");
                dispatch(actionCreators.setMiniProfile(false));
              }}
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <g clip-path="url(#clip0_1384_8661)">
                <path
                  d="M15.8337 5.34102L14.6587 4.16602L10.0003 8.82435L5.34199 4.16602L4.16699 5.34102L8.82533 9.99935L4.16699 14.6577L5.34199 15.8327L10.0003 11.1743L14.6587 15.8327L15.8337 14.6577L11.1753 9.99935L15.8337 5.34102Z"
                  fill="#A7A9AB"
                />
              </g>
              <defs>
                <clipPath id="clip0_1384_8661">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <div
              style={{
                ...(isGroup === false && {
                  backgroundColor: profileColors[colorIndex],
                }),
              }}
              className={`${
                !isGroup
                  ? "border-[2px] border-[#E9EBF8] text-[white]"
                  : "bg-[#ffffff]"
              } w-[80px] h-[80px] text-center shrink-0 capitalize rounded-bl-none rounded-[50%] text-[52px] text-[white] overflow-hidden`}
            >
              {mention.profile_picture ? (
                <img
                  className="w-full h-full  object-cover"
                  src={mention.profile_picture}
                  alt=""
                />
              ) : mention.members ? (
                <svg
                  className="mt-7 ml-4"
                  width="44"
                  height="30"
                  viewBox="0 0 38 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.90927 3.45526C4.90927 2.61139 5.2445 1.80208 5.8412 1.20537C6.43791 0.608664 7.24722 0.273438 8.09109 0.273438C8.93496 0.273438 9.74427 0.608664 10.341 1.20537C10.9377 1.80208 11.2729 2.61139 11.2729 3.45526C11.2729 4.29913 10.9377 5.10843 10.341 5.70514C9.74427 6.30185 8.93496 6.63707 8.09109 6.63707C7.24722 6.63707 6.43791 6.30185 5.8412 5.70514C5.2445 5.10843 4.90927 4.29913 4.90927 3.45526ZM4.45472 12.4155C3.88654 13.0518 3.54563 13.8984 3.54563 14.8189C3.54563 15.7393 3.88654 16.5859 4.45472 17.2223V12.4155ZM12.6593 9.61435C10.9718 11.1087 9.90927 13.2962 9.90927 15.728C9.90927 17.6768 10.5911 19.4666 11.7275 20.87V22.0916C11.7275 23.0973 10.915 23.9098 9.90927 23.9098H6.27291C5.26722 23.9098 4.45472 23.0973 4.45472 22.0916V20.5689C2.307 19.5462 0.818359 17.3587 0.818359 14.8189C0.818359 11.3018 3.66495 8.45526 7.182 8.45526H9.00018C10.3638 8.45526 11.6252 8.88139 12.6593 9.60867V9.61435ZM26.2729 22.0916V20.87C27.4093 19.4666 28.0911 17.6768 28.0911 15.728C28.0911 13.2962 27.0286 11.1087 25.3411 9.60867C26.3752 8.88139 27.6365 8.45526 29.0002 8.45526H30.8184C34.3354 8.45526 37.182 11.3018 37.182 14.8189C37.182 17.3587 35.6934 19.5462 33.5456 20.5689V22.0916C33.5456 23.0973 32.7331 23.9098 31.7275 23.9098H28.0911C27.0854 23.9098 26.2729 23.0973 26.2729 22.0916ZM26.7275 3.45526C26.7275 2.61139 27.0627 1.80208 27.6594 1.20537C28.2561 0.608664 29.0654 0.273438 29.9093 0.273438C30.7531 0.273438 31.5624 0.608664 32.1592 1.20537C32.7559 1.80208 33.0911 2.61139 33.0911 3.45526C33.0911 4.29913 32.7559 5.10843 32.1592 5.70514C31.5624 6.30185 30.7531 6.63707 29.9093 6.63707C29.0654 6.63707 28.2561 6.30185 27.6594 5.70514C27.0627 5.10843 26.7275 4.29913 26.7275 3.45526ZM33.5456 12.4155V17.228C34.1138 16.5859 34.4547 15.745 34.4547 14.8246C34.4547 13.9041 34.1138 13.0575 33.5456 12.4212V12.4155ZM19.0002 0.273438C19.9646 0.273438 20.8895 0.656553 21.5715 1.3385C22.2534 2.02045 22.6365 2.94538 22.6365 3.9098C22.6365 4.87423 22.2534 5.79915 21.5715 6.4811C20.8895 7.16305 19.9646 7.54617 19.0002 7.54617C18.0358 7.54617 17.1108 7.16305 16.4289 6.4811C15.7469 5.79915 15.3638 4.87423 15.3638 3.9098C15.3638 2.94538 15.7469 2.02045 16.4289 1.3385C17.1108 0.656553 18.0358 0.273438 19.0002 0.273438ZM14.4547 15.728C14.4547 16.6484 14.7956 17.4893 15.3638 18.1314V13.3246C14.7956 13.9666 14.4547 14.8075 14.4547 15.728ZM22.6365 13.3246V18.1371C23.2047 17.495 23.5456 16.6541 23.5456 15.7337C23.5456 14.8132 23.2047 13.9666 22.6365 13.3303V13.3246ZM26.2729 15.728C26.2729 18.2678 24.7843 20.4553 22.6365 21.478V23.9098C22.6365 24.9155 21.824 25.728 20.8184 25.728H17.182C16.1763 25.728 15.3638 24.9155 15.3638 23.9098V21.478C13.2161 20.4553 11.7275 18.2678 11.7275 15.728C11.7275 12.2109 14.574 9.36435 18.0911 9.36435H19.9093C23.4263 9.36435 26.2729 12.2109 26.2729 15.728Z"
                    fill={profileColors[colorIndex]}
                  />
                </svg>
              ) : (
                <div className="mt-[2px] capitalize">
                  {mention?.name
                    ? mention?.name?.slice(0, 1)
                    : mention?.display_name?.slice(0, 1)}
                </div>
              )}
            </div>
            {(() => {
              if (
                mention.presence === "online" ||
                mention.presence === "call"
              ) {
                return (
                  <div className="ml-[45px] mt-[93px] absolute">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 13 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="6.5"
                        cy="6.5"
                        r="5.75"
                        fill={presenceColors[mention.presence]}
                        stroke="white"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                );
              }
            })()}
            <div className="text-[20px] w-[450px]  font-bold text-[#293241] flex flex-row justify-center items-center gap-3 truncate">
              {mention.members && edit ? (
                <div className="w-full rounded-[7px] border-[1px] border-[#B1B1B1] px-1 flex flex-row items-center">
                  <InputFields
                    restClass={`w-full text-[16px] text-[#293241] bg-[#E9EBF8] border-none focus:outline-none`}
                    label={"Group Name"}
                    value={name}
                    name={"title"}
                    onChange={(e: any) => setName(e.target.value)}
                    maxLength={maxNameLength}
                  />
                  <svg
                    className="mb-1 cursor-pointer"
                    onClick={() => setIsEmojiOpen1(!isEmojiOpen1)}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M19 12C19 10.1435 18.2625 8.36301 16.9497 7.05025C15.637 5.7375 13.8565 5 12 5C10.1435 5 8.36301 5.7375 7.05025 7.05025C5.7375 8.36301 5 10.1435 5 12C5 13.8565 5.7375 15.637 7.05025 16.9497C8.36301 18.2625 10.1435 19 12 19C13.8565 19 15.637 18.2625 16.9497 16.9497C18.2625 15.637 19 13.8565 19 12ZM4 12C4 9.87827 4.84285 7.84344 6.34315 6.34315C7.84344 4.84285 9.87827 4 12 4C14.1217 4 16.1566 4.84285 17.6569 6.34315C19.1571 7.84344 20 9.87827 20 12C20 14.1217 19.1571 16.1566 17.6569 17.6569C16.1566 19.1571 14.1217 20 12 20C9.87827 20 7.84344 19.1571 6.34315 17.6569C4.84285 16.1566 4 14.1217 4 12ZM9.12813 14.1719C9.6875 14.8188 10.6438 15.5 12 15.5C13.3562 15.5 14.3125 14.8188 14.8719 14.1719C15.0531 13.9625 15.3687 13.9406 15.5781 14.1219C15.7875 14.3031 15.8094 14.6187 15.6281 14.8281C14.9313 15.6281 13.7219 16.5 12 16.5C10.2781 16.5 9.06875 15.6281 8.37187 14.8281C8.19062 14.6187 8.2125 14.3031 8.42188 14.1219C8.63125 13.9406 8.94688 13.9625 9.12813 14.1719ZM8.7625 10.5C8.7625 10.3011 8.84152 10.1103 8.98217 9.96967C9.12282 9.82902 9.31359 9.75 9.5125 9.75C9.71141 9.75 9.90218 9.82902 10.0428 9.96967C10.1835 10.1103 10.2625 10.3011 10.2625 10.5C10.2625 10.6989 10.1835 10.8897 10.0428 11.0303C9.90218 11.171 9.71141 11.25 9.5125 11.25C9.31359 11.25 9.12282 11.171 8.98217 11.0303C8.84152 10.8897 8.7625 10.6989 8.7625 10.5ZM14.5125 9.75C14.7114 9.75 14.9022 9.82902 15.0428 9.96967C15.1835 10.1103 15.2625 10.3011 15.2625 10.5C15.2625 10.6989 15.1835 10.8897 15.0428 11.0303C14.9022 11.171 14.7114 11.25 14.5125 11.25C14.3136 11.25 14.1228 11.171 13.9822 11.0303C13.8415 10.8897 13.7625 10.6989 13.7625 10.5C13.7625 10.3011 13.8415 10.1103 13.9822 9.96967C14.1228 9.82902 14.3136 9.75 14.5125 9.75Z"
                      fill="#5C6779"
                    />
                  </svg>
                </div>
              ) : mention.display_name ? (
                mention.display_name
              ) : (
                mention.name
              )}
              {mention.members &&
                !edit &&
                mention?.status === "active" &&
                mention.admin.includes(chatInstance?.globalInfo.user_token) && (
                  <svg
                    onClick={() => setEdit(true)}
                    className="cursor-pointer"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <path
                      d="M14.3273 3.3512L14.6488 3.67266C14.9809 4.00475 14.9809 4.54406 14.6488 4.87614L13.9395 5.58548L12.4145 4.06054L13.1239 3.3512C13.4559 3.01911 13.9953 3.01911 14.3273 3.3512ZM7.27115 9.2039L11.8141 4.66095L13.339 6.18589L8.7961 10.7288C8.68452 10.8404 8.54106 10.9201 8.38697 10.9573L6.64417 11.3585L7.04534 9.61303C7.07987 9.45894 7.15957 9.31548 7.27381 9.2039H7.27115ZM12.5234 2.74813L6.67074 8.60349C6.44492 8.82931 6.28818 9.11357 6.21645 9.42441L5.6612 11.8314C5.62932 11.9748 5.67182 12.1236 5.77544 12.2272C5.87905 12.3308 6.02782 12.3733 6.17128 12.3415L8.57825 11.7862C8.88908 11.7145 9.17335 11.5577 9.39917 11.3319L15.2519 5.47656C15.916 4.81238 15.916 3.73642 15.2519 3.07225L14.9304 2.74813C14.2662 2.08396 13.1903 2.08396 12.5261 2.74813H12.5234ZM4.37536 3.848C3.2011 3.848 2.25 4.7991 2.25 5.97336V13.6246C2.25 14.7989 3.2011 15.75 4.37536 15.75H12.0266C13.2009 15.75 14.152 14.7989 14.152 13.6246V10.2241C14.152 9.99028 13.9607 9.799 13.7269 9.799C13.4931 9.799 13.3019 9.99028 13.3019 10.2241V13.6246C13.3019 14.3287 12.7307 14.8999 12.0266 14.8999H4.37536C3.67133 14.8999 3.10014 14.3287 3.10014 13.6246V5.97336C3.10014 5.26933 3.67133 4.69815 4.37536 4.69815H7.77593C8.00972 4.69815 8.201 4.50686 8.201 4.27307C8.201 4.03928 8.00972 3.848 7.77593 3.848H4.37536Z"
                      fill="#5C6779"
                    />
                  </svg>
                )}
            </div>
            <div className="text-[14px] w-[450px] text-[#00000059] flex flex-row justify-center items-center gap-2">
              {mention.members && edit ? (
                <div className="w-full rounded-[7px] border-[1px] border-[#B1B1B1] px-1 flex flex-row items-center">
                  <InputFields
                    restClass={`w-full text-[16px] text-[#293241] bg-[#E9EBF8] border-none focus:outline-none`}
                    label={"Description"}
                    value={status}
                    name={"status"}
                    maxLength={maxDiscriptionLength}
                    onChange={(e: any) => setStatus(e.target.value)}
                  />
                  <svg
                    className="mb-1 cursor-pointer"
                    onClick={() => setIsEmojiOpen2(!isEmojiOpen2)}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M19 12C19 10.1435 18.2625 8.36301 16.9497 7.05025C15.637 5.7375 13.8565 5 12 5C10.1435 5 8.36301 5.7375 7.05025 7.05025C5.7375 8.36301 5 10.1435 5 12C5 13.8565 5.7375 15.637 7.05025 16.9497C8.36301 18.2625 10.1435 19 12 19C13.8565 19 15.637 18.2625 16.9497 16.9497C18.2625 15.637 19 13.8565 19 12ZM4 12C4 9.87827 4.84285 7.84344 6.34315 6.34315C7.84344 4.84285 9.87827 4 12 4C14.1217 4 16.1566 4.84285 17.6569 6.34315C19.1571 7.84344 20 9.87827 20 12C20 14.1217 19.1571 16.1566 17.6569 17.6569C16.1566 19.1571 14.1217 20 12 20C9.87827 20 7.84344 19.1571 6.34315 17.6569C4.84285 16.1566 4 14.1217 4 12ZM9.12813 14.1719C9.6875 14.8188 10.6438 15.5 12 15.5C13.3562 15.5 14.3125 14.8188 14.8719 14.1719C15.0531 13.9625 15.3687 13.9406 15.5781 14.1219C15.7875 14.3031 15.8094 14.6187 15.6281 14.8281C14.9313 15.6281 13.7219 16.5 12 16.5C10.2781 16.5 9.06875 15.6281 8.37187 14.8281C8.19062 14.6187 8.2125 14.3031 8.42188 14.1219C8.63125 13.9406 8.94688 13.9625 9.12813 14.1719ZM8.7625 10.5C8.7625 10.3011 8.84152 10.1103 8.98217 9.96967C9.12282 9.82902 9.31359 9.75 9.5125 9.75C9.71141 9.75 9.90218 9.82902 10.0428 9.96967C10.1835 10.1103 10.2625 10.3011 10.2625 10.5C10.2625 10.6989 10.1835 10.8897 10.0428 11.0303C9.90218 11.171 9.71141 11.25 9.5125 11.25C9.31359 11.25 9.12282 11.171 8.98217 11.0303C8.84152 10.8897 8.7625 10.6989 8.7625 10.5ZM14.5125 9.75C14.7114 9.75 14.9022 9.82902 15.0428 9.96967C15.1835 10.1103 15.2625 10.3011 15.2625 10.5C15.2625 10.6989 15.1835 10.8897 15.0428 11.0303C14.9022 11.171 14.7114 11.25 14.5125 11.25C14.3136 11.25 14.1228 11.171 13.9822 11.0303C13.8415 10.8897 13.7625 10.6989 13.7625 10.5C13.7625 10.3011 13.8415 10.1103 13.9822 9.96967C14.1228 9.82902 14.3136 9.75 14.5125 9.75Z"
                      fill="#5C6779"
                    />
                  </svg>
                </div>
              ) : mention.members ? (
                <div className="w-[430px] break-words text-center">
                  {mention.description}
                </div>
              ) : mention?.personal_status ? (
                <>
                  {mention?.personal_status[0]?.emoji} &nbsp;
                  {mention?.personal_status[0]?.name}
                </>
              ) : null}
            </div>
            <div className="font-normal -ml-5">
              <span className="text-xs text-[#ff4747] ">{errorMsg}</span>
            </div>
            {name?.length > maxNameLength ? (
              <div className="font-normal -ml-10 -mb-8">
                <span className="text-xs text-[#ff4747] ">
                  {t("Chat.GrpNameErrorMsg")}
                </span>
              </div>
            ) : null}
            {status?.length > maxDiscriptionLength ? (
              <div className="font-normal -ml-10 -mb-8 ">
                <span className="text-xs text-[#ff4747] ">
                  Maximum character allowed for description is 120.
                </span>
              </div>
            ) : null}
            {(isEmojiOpen1 || isEmojiOpen2) && (
              <div
                className={`${
                  isEmojiOpen1 ? "top-[170px]" : "top-[234px] "
                } z-[500] h-fit-content w-fit-content absolute overflow-visible right-0`}
              >
                <Picker
                  data={data}
                  ref={pickerRef}
                  onEmojiSelect={(e: any) => {
                    addEmoji(e);
                    setIsEmojiOpen1(false);
                    setIsEmojiOpen2(false);
                  }}
                  onClickOutside={() => {
                    setIsEmojiOpen1(false);
                    setIsEmojiOpen2(false);
                  }}
                  theme="light"
                  previewPosition="none"
                  exceptEmojis="SmilingFace"
                  categories={[
                    "frequent",
                    "people",
                    "objects",
                    "foods",
                    "nature",
                    "activity",
                  ]}
                  perLine="8"
                  autoFocus={true}
                  skinTonePosition="none"
                  searchPosition="sticky"
                />
              </div>
            )}
            {!edit ? (
              <div className="flex flex-row items-center gap-8 mt-3">
                {mention?.members?.length !== 1 &&
                  callInfo === null &&
                  mention?.members?.find(
                    (member: any) => member.user_id === loggedInUserInfo?.sub
                  ) &&
                  mention?.status !== "inactive" &&
                  mention?.status !== "archive" &&
                  mention?.status !== "disabled" &&
                  mention?.status !== "deleted" &&
                  !mention?.call_details && (
                    <>
                      <Tooltip
                        content={"Only 1 person in this group"}
                        direction="top"
                        onclick={mention?.members?.length === 1}
                      >
                        <svg
                          onClick={() => {
                            if (mention?.members?.length !== 1) {
                              setAudioCall(mention);
                              setViewMore(false);
                              dispatch(actionCreators.setMiniProfile(false));
                            }
                          }}
                          className={`${
                            mention?.members?.length !== 1
                              ? "cursor-pointer"
                              : "cursor-not-allowed"
                          }`}
                          width="14"
                          height="14"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.80781 6.44974C8.42344 6.28567 7.97813 6.39349 7.71328 6.71692L6.93516 7.66849C5.85703 7.0427 4.95703 6.1427 4.33125 5.06458L5.28047 4.2888C5.60391 4.02395 5.71406 3.57864 5.54766 3.19427L4.42266 0.569268C4.24687 0.156768 3.80391 -0.0729199 3.36563 0.0208301L0.740625 0.58333C0.309375 0.674736 0 1.05677 0 1.49974C0 7.04739 4.30078 11.5896 9.75 11.974C9.85547 11.981 9.96328 11.988 10.0711 11.9927C10.0711 11.9927 10.0711 11.9927 10.0734 11.9927C10.2164 11.9974 10.357 12.0021 10.5023 12.0021C10.9453 12.0021 11.3273 11.6927 11.4188 11.2615L11.9813 8.63645C12.075 8.19817 11.8453 7.7552 11.4328 7.57942L8.80781 6.45442V6.44974ZM10.493 11.2497C5.11172 11.245 0.75 6.88333 0.75 1.49974C0.75 1.41067 0.810937 1.33567 0.897656 1.31692L3.52266 0.754424C3.60938 0.735674 3.69844 0.782549 3.73359 0.86458L4.85859 3.48958C4.89141 3.56692 4.87031 3.65599 4.80469 3.70755L3.85312 4.48567C3.56953 4.7177 3.49453 5.12317 3.67969 5.44192C4.37109 6.63489 5.36484 7.62864 6.55547 8.3177C6.87422 8.50286 7.27969 8.42786 7.51172 8.14427L8.28984 7.1927C8.34375 7.12708 8.43281 7.10599 8.50781 7.1388L11.1328 8.2638C11.2148 8.29895 11.2617 8.38802 11.243 8.47474L10.6805 11.0997C10.6617 11.1865 10.5844 11.2474 10.4977 11.2474C10.4953 11.2474 10.493 11.2474 10.4906 11.2474L10.493 11.2497Z"
                            fill="#5C6779"
                          />
                        </svg>
                      </Tooltip>
                    </>
                  )}
                {activeChat.uuid !== mention.uuid && (
                  <svg
                    onClick={() => {
                      routeChange(mention);
                      setViewMore(false);
                      dispatch(actionCreators.setMiniProfile(false));
                    }}
                    className="cursor-pointer"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.46875 10.375C4.93545 10.375 5.3125 10.7521 5.3125 11.2188V12.4844L7.89912 10.5438C8.04414 10.433 8.22344 10.375 8.40537 10.375H12.0625C12.5292 10.375 12.9062 9.99795 12.9062 9.53125V1.9375C12.9062 1.4708 12.5292 1.09375 12.0625 1.09375H1.9375C1.4708 1.09375 1.09375 1.4708 1.09375 1.9375V9.53125C1.09375 9.99795 1.4708 10.375 1.9375 10.375H4.46875ZM0.25 1.9375C0.25 1.00674 1.00674 0.25 1.9375 0.25H12.0625C12.9933 0.25 13.75 1.00674 13.75 1.9375V9.53125C13.75 10.462 12.9933 11.2188 12.0625 11.2188H8.40537L5.14375 13.6656C5.01719 13.7605 4.8458 13.7764 4.70078 13.7052C4.55576 13.634 4.46875 13.489 4.46875 13.3281V12.0625V11.2188H3.625H1.9375C1.00674 11.2188 0.25 10.462 0.25 9.53125V1.9375Z"
                      fill="#5C6779"
                    />
                  </svg>
                )}

                {(mention.members &&
                  !mention.private &&
                  mention?.status === "active" &&
                  mention?.members?.find(
                    (member: any) => member.user_id === loggedInUserInfo?.sub
                  )) ||
                (mention?.status === "active" &&
                  mention?.admin?.find(
                    (member: any) => member === loggedInUserInfo?.sub
                  )) ? (
                  <svg
                    onClick={toggleAddMemberModal}
                    className="cursor-pointer"
                    width="16"
                    height="12"
                    viewBox="0 0 16 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.75 0.75C6.04547 0.75 6.33806 0.808198 6.61104 0.921271C6.88402 1.03434 7.13206 1.20008 7.34099 1.40901C7.54992 1.61794 7.71566 1.86598 7.82873 2.13896C7.9418 2.41194 8 2.70453 8 3C8 3.29547 7.9418 3.58806 7.82873 3.86104C7.71566 4.13402 7.54992 4.38206 7.34099 4.59099C7.13206 4.79992 6.88402 4.96566 6.61104 5.07873C6.33806 5.1918 6.04547 5.25 5.75 5.25C5.45453 5.25 5.16194 5.1918 4.88896 5.07873C4.61598 4.96566 4.36794 4.79992 4.15901 4.59099C3.95008 4.38206 3.78434 4.13402 3.67127 3.86104C3.5582 3.58806 3.5 3.29547 3.5 3C3.5 2.70453 3.5582 2.41194 3.67127 2.13896C3.78434 1.86598 3.95008 1.61794 4.15901 1.40901C4.36794 1.20008 4.61598 1.03434 4.88896 0.921271C5.16194 0.808198 5.45453 0.75 5.75 0.75ZM5.75 6C6.54565 6 7.30871 5.68393 7.87132 5.12132C8.43393 4.55871 8.75 3.79565 8.75 3C8.75 2.20435 8.43393 1.44129 7.87132 0.87868C7.30871 0.316071 6.54565 0 5.75 0C4.95435 0 4.19129 0.316071 3.62868 0.87868C3.06607 1.44129 2.75 2.20435 2.75 3C2.75 3.79565 3.06607 4.55871 3.62868 5.12132C4.19129 5.68393 4.95435 6 5.75 6ZM4.67891 7.875H6.82109C8.69609 7.875 10.2195 9.38203 10.25 11.25H1.25C1.27812 9.38203 2.80156 7.875 4.67891 7.875ZM4.67891 7.125C2.37031 7.125 0.5 8.99531 0.5 11.3039C0.5 11.6883 0.811719 12 1.19609 12H10.3039C10.6883 12 11 11.6883 11 11.3039C11 8.99531 9.12969 7.125 6.82109 7.125H4.67891ZM12.5 7.125C12.5 7.33125 12.6687 7.5 12.875 7.5C13.0813 7.5 13.25 7.33125 13.25 7.125V5.25H15.125C15.3313 5.25 15.5 5.08125 15.5 4.875C15.5 4.66875 15.3313 4.5 15.125 4.5H13.25V2.625C13.25 2.41875 13.0813 2.25 12.875 2.25C12.6687 2.25 12.5 2.41875 12.5 2.625V4.5H10.625C10.4187 4.5 10.25 4.66875 10.25 4.875C10.25 5.08125 10.4187 5.25 10.625 5.25H12.5V7.125Z"
                      fill="#5C6779"
                    />
                  </svg>
                ) : null}
              </div>
            ) : (
              <div
                onClick={handleUpdate}
                className={`${
                  name.length < minNameLength
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                } text-[#293241] flex place-self-end mr-4 bg-[#FEF4E9] px-5 border-[1px] border-[#B1B1B1] rounded-[7px]`}
              >
                Update
              </div>
            )}
          </div>
          <div className="h-[calc(100vh-400px)] p-[12px]">
            <ul className="flex justify-between h-fit text-center transition-all ease-in-out text-[#293241] pr-2">
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
                    Contact Info
                  </div>
                </a>
                {activeTab === 0 && <hr className="text-[#F7931F]" />}
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
                    Files
                  </div>
                </a>
                {activeTab === 1 && <hr className="text-[#F7931F]" />}
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
                    Pinned Messages
                  </div>
                </a>
                {activeTab === 2 && <hr className="text-[#F7931F]" />}
              </li>
            </ul>
            {activeTab === 0 && !mention.members && (
              <motion.div
                key="contactInfo"
                initial={{ opacity: 0, translateY: "60px" }}
                animate={{
                  opacity: 1,
                  translateY: "0px",
                  transition: { duration: 0.4 },
                }}
                className="p-3 mt-2 flex flex-col gap-2 text-[14px]"
              >
                <div className="text-[#293241]">Email Address</div>
                <div className="text-[#5C6779]">{mention?.email}</div>
                <div className="text-[#293241] mt-4">Phone</div>
                <div className="text-[#5C6779]">
                  {mention?.phone !== undefined && mention?.phone !== "undefined" && mention?.phone}
                </div>
                <div className="text-[#293241] mt-4">Local Time</div>
                <div className="text-[#5C6779]">
                  {new Intl.DateTimeFormat("en-US", options).format(new Date())}
                </div>
              </motion.div>
            )}
            {activeTab === 0 && mention.members && (
              <GrpInfo
                userData={mention}
                errMsg={errMsg}
                handleErrorMessage={handleErrorMessage}
              />
            )}
            {activeTab === 2 && (
              <motion.div
                key="pinned"
                initial={{ opacity: 0, translateY: "60px" }}
                animate={{
                  opacity: 1,
                  translateY: "0px",
                  transition: { duration: 0.4 },
                }}
                className="p-1"
              >
                <div className="font-bold text-sm py-3">
                  Pinned Messages (
                  {
                    userData.pinned_messages?.filter(
                      (pin: any) => pin?.category !== "delete_message"
                    )?.length
                  }
                  )
                </div>
                {userData.pinned_messages?.length > 0 ? (
                  <div className="bg-[#F1F1F1] h-[calc(100vh-570px)] mb-6 overflow-y-auto overflow-x-hidden p-3   rounded-[5px] shadow flex-col justify-start items-start gap-2.5 flex">
                    {userData.pinned_messages
                      ?.filter((pin: any) => pin?.category !== "delete_message")
                      ?.map((item: any, index: number) => (
                        <div
                          onClick={() => scrollToPinned(item)}
                          className="bg-[#ffffff] relative cursor-pointer self-stretch rounded-[5px] border border-[#0000001f] border-opacity-10 justify-start items-start inline-flex"
                        >
                          <button
                            onClick={(e: any) => handleUnpin(e, item?.uuid)}
                            className="absolute top-0 right-0 m-1 z-[3]"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="26"
                              height="26"
                              viewBox="0 0 26 26"
                              fill="none"
                            >
                              <g clip-path="url(#clip0_749_27404)">
                                <path
                                  d="M15.123 6.03681L12.001 9.83633C11.8092 10.0721 11.5165 10.2067 11.215 10.2015C10.1958 10.186 9.17606 10.5364 8.36492 11.2426L7.75554 11.7696L11.4417 14.3507L13.1625 11.8933C13.3202 11.668 13.6336 11.6128 13.8588 11.7705C14.0841 11.9282 14.1393 12.2416 13.9816 12.4669L12.2609 14.9243L15.9471 17.5054L16.2365 16.7543C16.6227 15.7505 16.6031 14.6725 16.24 13.7201C16.1312 13.4341 16.1584 13.1174 16.3143 12.8566L18.8143 8.62149C18.8261 8.59922 18.8405 8.57874 18.8566 8.5557L15.1704 5.97461C15.1561 5.99509 15.1417 6.01556 15.123 6.03681ZM10.8682 15.1699L7.18197 12.5888C6.92854 12.4113 6.77113 12.1295 6.75735 11.8222C6.74357 11.515 6.86829 11.217 7.1018 11.0143L7.70862 10.4855C8.71255 9.61289 9.97167 9.1822 11.2292 9.20055L13.7137 6.17537L14.3513 5.40103L13.7369 4.97085C13.6627 4.91887 13.6079 4.84999 13.5723 4.77549C13.4971 4.61598 13.5083 4.42552 13.6141 4.27448C13.7718 4.04922 14.0852 3.99396 14.3105 4.1517L14.9248 4.58188L20.2493 8.31012L20.8637 8.74031C21.0889 8.89804 21.1442 9.2114 20.9865 9.43667C20.8807 9.5877 20.7056 9.66346 20.53 9.6473C20.4478 9.63935 20.3643 9.61144 20.2901 9.55946L19.6757 9.12928L19.1662 9.99324L17.1732 13.3626C17.6205 14.538 17.6446 15.871 17.1698 17.1103L16.8804 17.8614C16.7698 18.1501 16.5324 18.3693 16.239 18.4614C15.9456 18.5535 15.6244 18.5002 15.3735 18.3246L11.6873 15.7435L9.10621 19.4296C8.94847 19.6549 8.63511 19.7102 8.40984 19.5524C8.18458 19.3947 8.12932 19.0813 8.28706 18.8561L10.8682 15.1699Z"
                                  fill="#5C6779"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_749_27404">
                                  <rect
                                    width="18"
                                    height="18"
                                    fill="white"
                                    transform="translate(10.7896 0.465332) rotate(35)"
                                  />
                                </clipPath>
                              </defs>
                            </svg>
                          </button>
                          <div className="w-full self-stretch p-1.5 bg-white rounded-[5px] justify-start items-start gap-1.5 flex">
                            <PinnedMessage
                              item={item}
                              own={item?.from === loggedInUserInfo?.sub}
                              profile_picture={
                                item.from === loggedInUserInfo?.sub
                                  ? selfData?.profile_picture
                                  : mention?.profile_picture
                              }
                              index={index}
                              key={item?.uuid}
                              members={
                                userData?.archive_members?.[0]
                                  ? userData?.archive_members
                                  : userData?.members
                              }
                              inactive_members={userData?.inactive_members}
                              uuid={userData?.uuid}
                              status={userData?.status}
                              isGroup={isGroup}
                              lastChild={false}
                              name={
                                item.from === loggedInUserInfo?.sub
                                  ? loggedInUserInfo?.display_name
                                  : userData?.display_name
                              }
                              chatUsername={userData?.display_name}
                              sameSource={false}
                              handleClick={() => {}}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className=" h-[calc(100vh-570px)] flex flex-col justify-center items-center mb-1 mt-1 px-3 overflow-y-auto overflow-x-hidden">
                    <img src={noPinned} className="" alt="" />
                    <div className="text-[#C4C4C4] py-2">
                      You have no pinned messages!
                    </div>
                  </div>
                )}
              </motion.div>
            )}
            {activeTab === 1 && (
              <FilesList data={mention} setViewMore={setViewMore} />
            )}
            <div
              className={`${
                errMsg !== null ? "-mt-6" : ""
              } flex justify-center text-[#f21a1a] text-sm  w-full`}
            >
              {errMsg}
            </div>
            {mention.members && (
              <div className="flex flex-row justify-center items-center gap-3">
                {mention.admin.includes(chatInstance?.globalInfo.user_token) &&
                  mention.status !== "archive" && (
                    <div
                      onClick={archiveGroup}
                      className="text-[#293241] flex place-self-end  bg-[#FEF4E9] px-5 py-1 border-[1px] border-[#B1B1B1] cursor-pointer rounded-[7px]"
                    >
                      Archive Group
                    </div>
                  )}
                {mention.status !== "inactive" &&
                  mention.status !== "archive" &&
                  mention?.members?.find(
                    (member: any) => member.user_id === loggedInUserInfo?.sub
                  ) && (
                    <div
                      onClick={leaveGroup}
                      className="text-[#293241] flex place-self-end  bg-[#FEF4E9] px-5 py-1 border-[1px] border-[#B1B1B1] cursor-pointer rounded-[7px]"
                    >
                      Leave Group
                    </div>
                  )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
      {addMemberModal ? (
        <AddMemberModal
          title={t("Chat.AddMembers")}
          toggleModal={toggleAddMemberModal}
          uuid={userData.uuid}
          buttonText={t("Add")}
        />
      ) : null}
    </div>
  );
}

export default ViewMore
