/* eslint-disable jsx-a11y/alt-text */
import React, { useCallback, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import ProfileBox from "./ProfileBox/ProfileBox"
import { RootState, actionCreators } from "../../../../store"
import JoinMeetingField from "./JoinMeetingField"
import { useNavigate } from "react-router-dom"
import path from "../../../../navigation/routes.path"
import "./Styles.css"
import LocalDb from "../../../../dbServices/dbServices"
import { branding_logo_half } from "../../../../constants/constantValues"
import SearchDropDown from "./Chat/SearchDropDown"
import { useTranslation } from "react-i18next"
import { t } from "i18next"
import { Menu } from "@headlessui/react"
import CustomNotification from "../../../../atom/CustomNotification/customNotification"
import BrandingBox from "./brandingBox"
import { AnimatePresence } from "framer-motion"
import MqttConnectionStatus from "./mqttConnectionStatus"
import { CLOSEBUTTON, SEARCHBARICON } from "./dashboardSvg"
const _ = require("lodash")

const TopBar = (props: any) => {
  const { i18n } = useTranslation()
  const [closeCard, setCloseCard] = useState(false)
  const deviceDB = LocalDb.loadLocalDB("hoolvaUser", "UserData", 2)
  const loggedInUserInfo = useSelector(
    (state: any) => state.Main.loggedInUserInfo
  )
  const chatInstance = useSelector((state: any) => state.Chat.chatInstance)
  const searchInput = useRef<HTMLInputElement>(null)
  const pickerRef = useRef<HTMLDivElement>(null)
  const callInfo = useSelector((state: any) => state.Chat.chatCallInfo)
  const mqttStatus = useSelector((state: any) => state.Chat.setMqttStatus)
  console.log(mqttStatus, "mqttStatus")
  const [userList, setUserList] = useState([])
  const [searchText, setSearchText] = useState<string>("")
  const audio = new Audio()
  const handleUserSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
    handleSearch(e.target.value, e, "searchDropDown")
    debounceFn(e.target.value)
  }

  const handleDebounceFn = (searchText: string) => {
    chatInstance
      ?.tenantSearch(searchText.trim(), { disabled: true })
      .then((res: any) => {
        setUserList(res)
      })
  }
  const debounceFn = useCallback(_.debounce(handleDebounceFn, 400), [])
  const {
    searchBox,
    setSearchBox,
    closeDropdown,
    setOpenTodayMeeting,
    setProfileSettingsClick,
    handleSearch,
    settingsPanel,
    setSettingsPanel,
    searchRef,
    setCloseDropdown,
  } = props

  const closeSearch = () => {
    setSearchText("")
    dispatch(actionCreators.setPopUp("searchDropDown"))
    setSearchBox(false)
    setCloseDropdown(false)
    if (searchInput.current) {
      searchInput.current.blur()
    }
  }

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const popUp = useSelector((state: any) => state.Flag.popUp)
  const [searchResultPage, setSearchResultPage] = useState<boolean>(false)
  const [brokenImage, setBrokenImage] = useState(false)
  const callMeetingData = useSelector(
    (state: any) => state.Chat.callMeetingData
  )
  const selfData = useSelector((state: any) => state.Chat.selfData)
  const [profile, setProfile] = useState("")
  const [status, setStatus] = useState("")
  const permissionSettings = useSelector(
    (state: RootState) => state.Main.permissionSettings
  )
  const { content: content, type } = useSelector(
    (state: any) => state.Chat.setNotification
  )
  const handleClick = (type: any) => {
    if (type === "START") {
      dispatch(actionCreators.createMeetingState(true))
      LocalDb.set(deviceDB, "UserData", "createState", true)
      window.open(path.JOIN, "_blank")
    } else {
      dispatch(actionCreators.setMeetingType(type))
      setOpenTodayMeeting(true)
      setProfileSettingsClick(false)
    }
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
    i18n.changeLanguage(
      selfData?.language === "English" ? "en" : selfData?.language
    )
  }, [selfData?.language])

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      if (searchText !== "") {
        event.stopPropagation()
        setSearchResultPage(true)
        setSearchBox(false)
        dispatch(actionCreators.setChatscreen(true))
        let text = encodeURIComponent(searchText)
        navigate(`${path.SEARCHRESULT}/${text}`)
        //dispatch(actionCreators.setPopUp("closeAll"));
        closeSearch()
      }
    }
  }

  const handlepopUpDropdown = (event: any) => {
    event.stopPropagation()
    setSearchBox(true)
  }

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

  const handleProfileBoxClick = () => {
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
      onClick={closeSearch}
      className=" sm:w-full w-screen h-14 flex justify-between items-cente relative bg-[#293241] py-[2px] "
    >
      <div className="flex">
        <BrandingBox
          setOpenTodayMeeting={setOpenTodayMeeting}
          setProfileSettingsClick={setProfileSettingsClick}
        />
        {permissionSettings?.chat?.length ? (
          <div
            className={`${
              popUp.searchDropDown && closeDropdown
                ? "px-4 pt-1 bg-[#ffffff] border-[1px] rounded-t-[15px]"
                : ""
            }`}
          >
            <div
              className="relative"
              onClick={(e: any) => handlepopUpDropdown(e)}
            >
              <div className="h-9 flex items-center mt-2  py-2.5 pl-3.5 border-[1px] bg-[#ffffff14] border-[#0000001f] border-solid rounded-[10px]">
                {SEARCHBARICON}
                <input
                  id="searchChatGroupsFilesTop"
                  ref={searchRef}
                  type="text"
                  placeholder={"Search Chat, Groups or files"}
                  className={`ml-4 outline-none bg-[#ffffff01] w-80 ${
                    popUp.searchDropDown && closeDropdown
                      ? "text-[#293241]"
                      : "text-[#ffffffe2]"
                  }`}
                  value={searchText}
                  onChange={handleUserSearch}
                  onKeyDown={handleKeyPress}
                  autoFocus
                />
                {popUp.searchDropDown && closeDropdown && (
                  <button
                    className="right-2 top-[8.5px] absolute cursor-pointer z-30 w-[20px]"
                    onClick={closeSearch}
                  >
                    {CLOSEBUTTON}
                  </button>
                )}
              </div>
              {popUp.searchDropDown && closeDropdown ? (
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
        ) : null}
      </div>
      <MqttConnectionStatus status={status} />
      <div className=" flex items-center">
        {permissionSettings?.meeting?.length ? (
          <>
            <div className="flex ml-2.5 mr-8">
              <JoinMeetingField />
            </div>

            <div className="mr-2 h-8 border-r-[0.2px] border-[#ffffff21]">
              {/* this is a line */}
            </div>
            <button
              id="startaMeeting"
              onClick={() => handleClick("START")}
              className="mx-6 flex justify-center font-bold bg-[#E57600] hover:bg-[#CC6900] text-[#FFFFFF] items-center w-[100px] h-[36px] rounded-[7px]"
            >
              {t("Dashboard.StartaMeeting")}
            </button>
          </>
        ) : null}
        <Menu>
          {(open) => (
            <>
              <Menu.Button onClick={handleProfileBoxClick}>
                <div className="flex items-center mr-6 ml-2 cursor-pointer" >
                  <button className="flex justify-center items-center w-7 h-7 mr-2 rounded-[33.3333px_33.3333px_33.3333px_0px] bg-[#91785B] ring-1 ring-offset-1 ring-[#A7A9AB] text-[#FFFFFF] p-[1px]">
                    {selfData?.profile_picture &&
                    selfData?.profile_picture !== "undefined" ? (
                      // eslint-disable-next-line jsx-a11y/alt-text
                      !brokenImage ? (
                        <img
                          src={profile}
                          onError={() => {
                            handleError();
                          }}
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
                    ) : selfData?.display_name ? (
                      selfData?.display_name?.charAt(0).toUpperCase()
                    ) : (
                      loggedInUserInfo?.given_name?.charAt(0).toUpperCase()
                    )}
                  </button>
                  <div className="ml-[20px] mt-[20px] absolute">
                    {" "}
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 13 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {" "}
                      <circle
                        cx="6.5"
                        cy="6.5"
                        r="5.75"
                        fill={
                          callInfo || callMeetingData?.[0]
                            ? "#EF4036"
                            : "#76B947"
                        }
                        stroke="white"
                        strokeWidth="1.5"
                      />{" "}
                    </svg>{" "}
                  </div>
                  <div  className="">
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
              <AnimatePresence mode="wait">
                <Menu.Items>
                  {open ? (
                    <ProfileBox
                      settingsPanel={settingsPanel}
                      setSettingsPanel={setSettingsPanel}
                      setCloseCard={setCloseCard}
                      closeCard={closeCard}
                      profilerOn={true}
                    />
                  ) : null}
                </Menu.Items>
              </AnimatePresence>
            </>
          )}
        </Menu>
      </div>
      {content !== "" && <CustomNotification />}
    </div>
  );
}

export default TopBar
