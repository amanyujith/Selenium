/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useCallback, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import ProfileBox from "../ProfileBox/ProfileBox"
import { RootState, actionCreators } from "../../../../../store"
import "../Styles.css"
import SearchDropDown from "./SearchDropDown"
import { branding_logo_half } from "../../../../../constants/constantValues"
import { useNavigate } from "react-router-dom"
import path from "../../../../../navigation/routes.path"
import { t } from "i18next"
import { Menu } from "@headlessui/react"
import FadeIn from "react-fade-in/lib/FadeIn"
import CustomNotification from "../../../../../atom/CustomNotification/customNotification"
import BrandingBox from "../brandingBox"
import { motion } from "framer-motion"
const _ = require("lodash")

const ChatTopBar = (props: any) => {
  const [profilerOn, setProfilerOn] = useState(false)
  const [closeCard, setCloseCard] = useState(false)
  const [brokenImage, setBrokenImage] = useState(false)
  const [searchResultPage, setSearchResultPage] = useState<boolean>(false)
  const [profile, setProfile] = useState("")
  const navigate = useNavigate()
  const { content: content, type } = useSelector(
    (state: any) => state.Chat.setNotification
  )
  const pickerRef = useRef<HTMLDivElement>(null)

  const loggedInUserInfo = useSelector(
    (state: any) => state.Main.loggedInUserInfo
  )
  const callInfo = useSelector((state: any) => state.Chat.chatCallInfo)
  const callMeetingData = useSelector(
    (state: any) => state.Chat.callMeetingData
  )
  const selfData = useSelector((state: any) => state.Chat.selfData)
  const permissionSettings = useSelector(
    (state: RootState) => state.Main.permissionSettings
  )

  const {
    searchBox,
    setSearchBox,
    settingsPanel,
    setSettingsPanel,
    searchRef,
  } = props

  const dispatch = useDispatch()
  const popUp = useSelector((state: any) => state.Flag.popUp)
  const chatInstance = useSelector((state: any) => state.Chat.chatInstance)
  const mqttStatus = useSelector((state: any) => state.Chat.setMqttStatus)
  console.log(mqttStatus, "mqttStatus")
  const [userList, setUserList] = useState([])
  const [searchText, setSearchText] = useState<string>("")
  const searchActiveChat = useSelector(
    (state: any) => state.Chat.searchActiveChat
  )
  const { data: activeChat, isGroup } = useSelector(
    (state: any) => state.Chat.activeChat
  )
  const [status, setStatus] = useState("")

  const handleUserSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
    if (e.target.value !== "" && !popUp.searchDropDown) {
      dispatch(actionCreators.setPopUp("searchDropDown"))
    }
    if (searchActiveChat === "") debounceFn(e.target.value)
  }
  //New result page when search enter
  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      if (searchText !== "") {
        event.stopPropagation()
        setSearchResultPage(true)
        dispatch(actionCreators.setChatscreen(true))
        let text = encodeURIComponent(searchText)
        searchActiveChat
          ? navigate(`${path.SEARCHRESULT}/${text}/${activeChat.uuid}`)
          : navigate(`${path.SEARCHRESULT}/${text}/`)
        setSearchBox(false)
        //dispatch(actionCreators.setPopUp("closeAll"));
        closeSearch()
      }
    }
  }

  const handleDebounceFn = (searchText: string) => {
    chatInstance
      ?.tenantSearch(searchText.trim(), { disabled: true })
      .then((res: any) => {
        setUserList(res)
      })
  }

  useEffect(() => {
    if (mqttStatus === "mqtt_online") {
      if (status === "mqtt_offline" || status === "mqtt_reconnect") {
        setStatus("mqtt_online")
      }
      setTimeout(() => {
        setStatus("")
        dispatch(actionCreators.setMqttStatus(""))
      }, 3000)
    } else {
      setStatus(mqttStatus)
    }
  }, [mqttStatus])

  const closeSearch = () => {
    setSearchText("")
    dispatch(actionCreators.setPopUp("searchDropDown"))
    setSearchBox(false)
  }

  const handleClose = () => {
    dispatch(actionCreators.setOptionBox(""))
    dispatch(actionCreators.setEmojiBox(false))
  }

  const debounceFn = useCallback(_.debounce(handleDebounceFn, 400), [])

  const handlePopUp = (
    event: any,
    type:
      | "meetingInfoFlag"
      | "endButtonFlag"
      | "moreOptionFlag"
      | "reactionFlag"
      | "meetingOpenFlag"
      | "profilerOpenFlag"
      | "calenderFlag"
      | "calenderFlag1"
      | "calenderFlag2"
      | "calenderFlag3"
      | "searchDropDown"
      | "closeAll"
  ) => {
    event.stopPropagation()

    if (type === "meetingOpenFlag") {
      dispatch(actionCreators.setPopUp(type))
    } else if (type === "profilerOpenFlag") {
      dispatch(actionCreators.setPopUp(type))
      setProfilerOn(true)
    } else if (type === "searchDropDown") {
      dispatch(actionCreators.setPopUp(type))
    }
  }
  const handlePopUpData = (event: any) => {
    event.stopPropagation()
    setSearchBox(true)
  }

  const handlepopUpDropdown = (event: any) => {
    event.stopPropagation()
    setSearchBox(true)
  }
  const handleBrokenImage = () => {
    setBrokenImage(true)
  }

  const handleError = () => {
    setProfile(selfData?.profile_picture)
  }

  useEffect(() => {
    const newUrl = selfData?.profile_picture?.replace(
      /\.(jpg|jpeg|png|gif)$/,
      "-low.webp"
    )
    setProfile(newUrl)
  }, [selfData?.profile_picture])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        // Clicked outside the picker, handle the event here
        closeSearch()
      }
    }
    setUserList([])
    if (searchBox) {
      // Bind the event listener when the component mounts
      document.addEventListener("mousedown", handleClickOutside)
    }

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [searchBox])
  const meetingSession = useSelector((state: any) => state.Main.meetingSession)

  const handleProfileBoxClick = () => {
    console.log(meetingSession, "MeetingSessionLogged")
    chatInstance?.GetUser(loggedInUserInfo?.sub).then((res: any) => {
      const selfData = res.filter((user: any) => {
        return user.uuid == loggedInUserInfo?.sub
      })
      dispatch(actionCreators.selfData(selfData))
    })
  }

  return (
    <div
      ref={pickerRef}
      onClick={handleClose}
      className=" sm:w-full w-screen h-14 flex justify-between items-center  relative bg-[#293241]"
    >
      <BrandingBox
        setOpenTodayMeeting={props.setOpenTodayMeeting}
        setProfileSettingsClick={props.setProfileSettingsClick}
      />
      <div className="flex justify-between w-[calc(100vw-358px)] h-full">
        {permissionSettings?.chat?.length ? (
          <div
            className={`${
              popUp.searchDropDown && searchText !== ""
                ? "px-4 pt-1 mt-1 bg-[#ffffff] border-[1px] rounded-t-[15px]"
                : " "
            }`}
          >
            <div
              className="relative"
              onClick={(e: any) => handlepopUpDropdown(e)}
            >
              <div className="h-9 flex items-center mt-2  py-2.5 pl-3.5 border-[1px] bg-[#ffffff14] border-[#0000001f] border-solid rounded-[10px]">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_10_664)">
                    <path
                      d="M14.625 7.3125C14.625 8.92617 14.1012 10.4168 13.2188 11.6262L17.6695 16.0805C18.109 16.5199 18.109 17.2336 17.6695 17.673C17.2301 18.1125 16.5164 18.1125 16.077 17.673L11.6262 13.2188C10.4168 14.1047 8.92617 14.625 7.3125 14.625C3.27305 14.625 0 11.352 0 7.3125C0 3.27305 3.27305 0 7.3125 0C11.352 0 14.625 3.27305 14.625 7.3125ZM7.3125 12.375C7.97732 12.375 8.63562 12.2441 9.24984 11.9896C9.86405 11.7352 10.4221 11.3623 10.8922 10.8922C11.3623 10.4221 11.7352 9.86405 11.9896 9.24984C12.2441 8.63562 12.375 7.97732 12.375 7.3125C12.375 6.64768 12.2441 5.98938 11.9896 5.37516C11.7352 4.76095 11.3623 4.20287 10.8922 3.73277C10.4221 3.26268 9.86405 2.88977 9.24984 2.63536C8.63562 2.38095 7.97732 2.25 7.3125 2.25C6.64768 2.25 5.98938 2.38095 5.37516 2.63536C4.76095 2.88977 4.20287 3.26268 3.73277 3.73277C3.26268 4.20287 2.88977 4.76095 2.63536 5.37516C2.38095 5.98938 2.25 6.64768 2.25 7.3125C2.25 7.97732 2.38095 8.63562 2.63536 9.24984C2.88977 9.86405 3.26268 10.4221 3.73277 10.8922C4.20287 11.3623 4.76095 11.7352 5.37516 11.9896C5.98938 12.2441 6.64768 12.375 7.3125 12.375Z"
                      fill="#B1B1B1"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_10_664">
                      <rect width="18" height="18" fill="white" />
                    </clipPath>
                  </defs>
                </svg>

                {searchActiveChat ? (
                  <div className=" text-sm text-primary-200 flex items-center justify-between w-full pr-3 ">
                    <p className="truncate min-w-[30px] max-w-[60px] ml-4 mr-1 text-[#B1B1B1]">
                      {searchActiveChat.display_name
                        ? searchActiveChat.display_name
                        : searchActiveChat.name}
                    </p>{" "}
                    <input
                      type="text"
                      placeholder={t("Search")}
                      className=" ml-4 outline-none bg-[#ffffff01] text-[#293241] w-80 "
                      value={searchText}
                      onChange={handleUserSearch}
                      onKeyDown={handleKeyPress}
                      autoFocus
                    />
                    <svg
                      onClick={() =>
                        dispatch(actionCreators.searchActiveChat(""))
                      }
                      className=" cursor-pointer"
                      width="10"
                      height="11"
                      viewBox="0 0 8 9"
                      fill="none"
                    >
                      <path
                        d="M0.733594 8.37943L0.121094 7.76693L3.38776 4.50026L0.121094 1.23359L0.733594 0.621094L4.00026 3.88776L7.26693 0.621094L7.87943 1.23359L4.61276 4.50026L7.87943 7.76693L7.26693 8.37943L4.00026 5.11276L0.733594 8.37943Z"
                        fill="#A7A9AB"
                      />
                    </svg>
                  </div>
                ) : (
                  <input
                    ref={searchRef}
                    type="text"
                    id="searchChatGroupsFilesChat"
                    placeholder={"Search Chat, Groups or files"}
                    className={`ml-4 outline-none bg-[#ffffff01] w-80 ${
                      popUp.searchDropDown && searchText
                        ? "text-[#293241]"
                        : "text-[#ffffffe2]"
                    }`}
                    value={searchText}
                    onChange={handleUserSearch}
                    onKeyDown={handleKeyPress}
                    autoFocus={searchBox}
                  />
                )}
                {popUp.searchDropDown && searchText !== "" && (
                  <button
                    className="right-2 top-[8.5px] absolute cursor-pointer z-30 w-[20px]"
                    onClick={closeSearch}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <path
                        d="M14.0187 5.09653C14.3271 4.78819 14.3271 4.2896 14.0187 3.98454C13.7104 3.67948 13.2118 3.67619 12.9067 3.98454L9.00328 7.888L5.09653 3.98126C4.78819 3.67291 4.2896 3.67291 3.98454 3.98126C3.67948 4.2896 3.67619 4.78819 3.98454 5.09325L7.888 8.99672L3.98126 12.9035C3.67291 13.2118 3.67291 13.7104 3.98126 14.0155C4.2896 14.3205 4.78819 14.3238 5.09325 14.0155L8.99672 10.112L12.9035 14.0187C13.2118 14.3271 13.7104 14.3271 14.0155 14.0187C14.3205 13.7104 14.3238 13.2118 14.0155 12.9067L10.112 9.00328L14.0187 5.09653Z"
                        fill="#B1B1B1"
                      />
                    </svg>
                  </button>
                )}
              </div>
              {popUp.searchDropDown && searchText !== "" ? (
                <div className="absolute z-[60] -ml-4">
                  <SearchDropDown
                    searchText={searchText}
                    userList={userList}
                    setCloseDropdown={closeSearch}
                    setSearchResultPage={setSearchResultPage}
                    setSearchBox={setSearchBox}
                    closeSearch={closeSearch}
                  />
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div></div>
        )}

        {status !== "" && (
          <motion.div
            key="chatBarStatus"
            initial={{ opacity: 0, translateY: "-40px" }}
            animate={{
              opacity: 1,
              backgroundColor:
                mqttStatus === "mqtt_offline"
                  ? "#F74B14"
                  : mqttStatus === "mqtt_reconnect"
                  ? "#F7931F"
                  : "#76B947",
              translateY: "0px",
              transition: {
                duration: 0.5,
                ease: "easeOut",
              },
            }}
            exit={{
              opacity: 0,
              translateY: "-40px",
              transition: { duration: 0.5 },
            }}
            className={`mqttStatus z-[500] text-[white] gap-2 flex justify-center items-center h-full w-full 2xl:w-[calc(100%-1012px)]`}
          >
            {mqttStatus === "mqtt_offline" ? (
              <svg
                width="18"
                height="15"
                viewBox="0 0 18 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.72892 0.0952785C0.534881 -0.0570324 0.250854 -0.0231855 0.0961853 0.171434C-0.058483 0.366053 -0.0219251 0.650931 0.172113 0.806063L17.27 14.3448C17.464 14.4999 17.7481 14.4661 17.9027 14.2715C18.0574 14.0769 18.0237 13.792 17.8296 13.6368L0.72892 0.0952785ZM17.9983 9.92779C17.9983 8.54289 17.2194 7.33851 16.0776 6.73491C16.1564 6.45849 16.1986 6.16797 16.1986 5.86617C16.1986 4.12023 14.7897 2.70713 13.049 2.70713C12.5653 2.70713 12.1069 2.81713 11.6991 3.01175C10.802 1.73403 9.32286 0.901962 7.64963 0.901962C6.65131 0.901962 5.72049 1.19812 4.94434 1.70865L5.69799 2.30661C6.2773 1.98788 6.94097 1.80455 7.64963 1.80455C9.01915 1.80455 10.2284 2.4843 10.9623 3.53074C11.2154 3.88895 11.6879 4.01587 12.0844 3.8269C12.374 3.68869 12.7003 3.60971 13.049 3.60971C14.2919 3.60971 15.2987 4.61948 15.2987 5.86617C15.2987 6.08335 15.2677 6.28925 15.2143 6.48669C15.099 6.89568 15.2846 7.33287 15.6586 7.53313C16.5163 7.98724 17.0985 8.88982 17.0985 9.92779C17.0985 10.3537 17 10.757 16.8257 11.1181L17.5456 11.6878C17.8324 11.166 17.9983 10.5652 17.9983 9.92779ZM2.84928 4.6505C2.76773 4.96923 2.71992 5.30206 2.70586 5.64334C1.13106 6.20182 0.000572144 7.70518 0.000572144 9.4765C0.000572144 11.7189 1.81441 13.5381 4.05007 13.5381H14.0726L12.9337 12.6355H4.05007C2.30935 12.6355 0.900461 11.2224 0.900461 9.4765C0.900461 8.10006 1.77785 6.92953 3.00395 6.49516C3.34985 6.37387 3.58888 6.05233 3.60294 5.68283C3.60856 5.54462 3.62262 5.40924 3.64231 5.27667L2.84928 4.6505Z"
                  fill="white"
                />
              </svg>
            ) : mqttStatus === "mqtt_reconnect" ? (
              <svg
                width="19"
                height="13"
                viewBox="0 0 19 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.4631 2.62386C10.7291 1.57938 9.51969 0.900896 8.15 0.900896C5.97312 0.900896 4.19844 2.61823 4.10281 4.77194C4.08594 5.13793 3.84969 5.45887 3.50375 5.58274C2.2775 6.0163 1.4 7.18465 1.4 8.55852C1.4 10.3012 2.80906 11.7117 4.55 11.7117H14.9C16.3906 11.7117 17.6 10.5011 17.6 9.00896C17.6 7.97293 17.0178 7.07204 16.16 6.61877C15.7831 6.41889 15.5975 5.98533 15.7156 5.5743C15.7719 5.38004 15.8 5.17171 15.8 4.95493C15.8 3.71057 14.7931 2.70269 13.55 2.70269C13.2041 2.70269 12.8778 2.78152 12.5853 2.91947C12.1888 3.10809 11.7162 2.98422 11.4631 2.62386ZM8.15 0C9.82344 0 11.3028 0.830514 12.2 2.10585C12.6078 1.91159 13.0662 1.80179 13.55 1.80179C15.2909 1.80179 16.7 3.21226 16.7 4.95493C16.7 5.25617 16.6578 5.54614 16.5791 5.82204C17.7209 6.42452 18.5 7.62665 18.5 9.00896C18.5 10.9994 16.8884 12.6126 14.9 12.6126H4.55C2.31406 12.6126 0.5 10.7967 0.5 8.55852C0.5 6.79051 1.63062 5.28995 3.20562 4.73252C3.32094 2.10022 5.48938 0 8.15 0ZM6.93219 5.98815L9.18219 3.7359C9.35656 3.56136 9.64344 3.56136 9.81781 3.7359L12.0678 5.98815C12.2422 6.16269 12.2422 6.44986 12.0678 6.6244C11.8934 6.79895 11.6066 6.79895 11.4322 6.6244L9.95 5.14074V9.45941C9.95 9.70716 9.7475 9.90986 9.5 9.90986C9.2525 9.90986 9.05 9.70716 9.05 9.45941V5.14074L7.56781 6.6244C7.39344 6.79895 7.10656 6.79895 6.93219 6.6244C6.75781 6.44986 6.75781 6.16269 6.93219 5.98815Z"
                  fill="white"
                />
              </svg>
            ) : (
              <svg
                width="20"
                height="14"
                viewBox="0 0 20 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.1812 2.9125C11.3656 1.75312 10.0219 1 8.5 1C6.08125 1 4.10938 2.90625 4.00313 5.29688C3.98438 5.70312 3.72188 6.05938 3.3375 6.19688C1.975 6.67812 1 7.975 1 9.5C1 11.4344 2.56562 13 4.5 13H16C17.6562 13 19 11.6562 19 10C19 8.85 18.3531 7.85 17.4 7.34688C16.9812 7.125 16.775 6.64375 16.9062 6.1875C16.9688 5.97188 17 5.74062 17 5.5C17 4.11875 15.8813 3 14.5 3C14.1156 3 13.7531 3.0875 13.4281 3.24062C12.9875 3.45 12.4625 3.3125 12.1812 2.9125ZM8.5 0C10.3594 0 12.0031 0.921875 13 2.3375C13.4531 2.12188 13.9625 2 14.5 2C16.4344 2 18 3.56562 18 5.5C18 5.83437 17.9531 6.15625 17.8656 6.4625C19.1344 7.13125 20 8.46562 20 10C20 12.2094 18.2094 14 16 14H4.5C2.01562 14 0 11.9844 0 9.5C0 7.5375 1.25625 5.87188 3.00625 5.25313C3.13437 2.33125 5.54375 0 8.5 0ZM13.3531 6.35313L9.35312 10.3531C9.15937 10.5469 8.84063 10.5469 8.64688 10.3531L6.64687 8.35312C6.45312 8.15937 6.45312 7.84063 6.64687 7.64688C6.84062 7.45313 7.15938 7.45313 7.35313 7.64688L9 9.29375L12.6469 5.64687C12.8406 5.45312 13.1594 5.45312 13.3531 5.64687C13.5469 5.84062 13.5469 6.15938 13.3531 6.35313Z"
                  fill="white"
                />
              </svg>
            )}

            {mqttStatus === "mqtt_offline" ? (
              <div className=" flex shrink-0 gap-1">
                Connection lost
                <div
                  className="text-[11px] cursor-pointer underline mt-1"
                  onClick={() => window.location.reload()}
                >
                  Refresh
                </div>
              </div>
            ) : mqttStatus === "mqtt_reconnect" ? (
              "Reconnecting..."
            ) : (
              "Connected"
            )}
          </motion.div>
        )}
        <div className=" flex items-center">
          <Menu>
            <Menu.Button onClick={handleProfileBoxClick}>
              <div id="ProfileBoxButtonTopBar"
                // onClick={(e) => handlePopUp(e, "profilerOpenFlag")}
                className="flex items-center mr-6 ml-2 cursor-pointer"
              >
                <button className="flex justify-center items-center w-7 h-7 mr-2 rounded-[33.3333px_33.3333px_33.3333px_0px] bg-[#91785B] ring-1 ring-offset-1 ring-[#A7A9AB] text-[#FFFFFF] p-[1px]">
                  {selfData?.profile_picture &&
                  selfData?.profile_picture !== "undefined" ? (
                    // eslint-disable-next-line jsx-a11y/alt-text
                    !brokenImage ? (
                      <img
                        src={profile}
                        onError={handleError}
                        className={
                          "rounded-[33.3333px_33.3333px_33.3333px_0px]"
                        }
                      />
                    ) : (
                      <img
                        src={branding_logo_half}
                        className={
                          "rounded-[33.3333px_33.3333px_33.3333px_0px]"
                        }
                      />
                    )
                  ) : (
                    selfData?.display_name?.charAt(0).toUpperCase() ??
                    loggedInUserInfo?.given_name?.charAt(0).toUpperCase()
                  )}
                </button>
                <div className="ml-[20px] mt-[20px] absolute">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="6.5"
                      cy="6.5"
                      r="5.75"
                      fill={
                        callInfo || callMeetingData?.[0] ? "#EF4036" : "#76B947"
                      }
                      stroke="white"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
                <div className="">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.0234 7.14797L9.39841 12.773C9.34617 12.8253 9.28413 12.8668 9.21585 12.8951C9.14756 12.9234 9.07437 12.9379 9.00044 12.9379C8.92652 12.9379 8.85333 12.9234 8.78504 12.8951C8.71675 12.8668 8.65472 12.8253 8.60247 12.773L2.97747 7.14797C2.89872 7.0693 2.84507 6.96903 2.82333 6.85986C2.80159 6.75069 2.81273 6.63752 2.85534 6.53468C2.89795 6.43184 2.97012 6.34396 3.0627 6.28216C3.15529 6.22036 3.26413 6.18741 3.37544 6.1875H14.6254C14.7368 6.18741 14.8456 6.22036 14.9382 6.28216C15.0308 6.34396 15.1029 6.43184 15.1455 6.53468C15.1882 6.63752 15.1993 6.75069 15.1776 6.85986C15.1558 6.96903 15.1022 7.0693 15.0234 7.14797Z"
                      fill="#5C6779"
                    />
                  </svg>
                </div>
              </div>
            </Menu.Button>
            <Menu.Items>
              {/* {popUp.profilerOpenFlag && profilerOn ? ( */}
              <ProfileBox
                settingsPanel={settingsPanel}
                setSettingsPanel={setSettingsPanel}
                setProfilerOn={setProfilerOn}
                setCloseCard={setCloseCard}
                closeCard={closeCard}
                profilerOn={true}
              />
              {/* // ) : null} */}
            </Menu.Items>
          </Menu>
        </div>
        {content !== "" && <CustomNotification />}
      </div>
    </div>
  );
}

export default ChatTopBar
