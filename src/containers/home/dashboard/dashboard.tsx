import LeftBar from "../../../layout/layout1/components/dashboard/leftBar"
import TopBar from "../../../layout/layout1/components/dashboard/topBar"
import Meetings from "../../../layout/layout1/components/dashboard/MeetingsTab/meetings"
import { LegacyRef, useEffect, useRef, useState } from "react"
import ChatTopBar from "../../../layout/layout1/components/dashboard/Chat/ChatTopBar"
import {
  Routes,
  Route,
  Outlet,
  useNavigate,
  Link,
  useParams,
} from "react-router-dom"
import ChatPage from "../../../layout/layout1/components/dashboard/Chat/ChatPage"
import { useDispatch, useSelector } from "react-redux"
import { RootState, actionCreators } from "../../../store"
import jwt from "jwt-decode"
import PastMeetingPage from "../../../layout/layout1/components/dashboard/MeetingsTab/pastMeetingPage"
import MembersPage from "../../../layout/layout1/components/dashboard/Chat/MembersPage"
import path from "../../../navigation/routes.path"
import sessionListeners from "../../../listeners/sessionListeners"
import ThemeSettings from "../../../layout/layout1/components/settings/themeSettings"
import SearchResultPage from "../../../layout/layout1/components/dashboard/Chat/SearchResultPage"
import Modal from "../../../layout/layout1/components/modal/modal"
import SettingsPanel from "../../../layout/layout1/components/dashboard/settingsPanel"
import Chats from "../../../layout/layout1/components/dashboard/Chat/Chats"
import CallOverView from "../../../layout/layout1/components/dashboard/pbx-call/PbxDashboard/callOverView"
import LandingPage from "../../../layout/layout1/components/dashboard/landingPage"
import ScreenLoader from "../../../atom/ScreenLoader/screenLoader"
import { AnimatePresence, motion } from "framer-motion"
import UserLoggedOutpage from "../../../layout/layout1/components/home/login/userLoggedOutpage"
import UseEscape from "../../../layout/layout1/components/dashboard/Chat/hooks/useEscape"

const Dashboard = () => {
  const authInfo = useSelector((state: any) => state.Main.authInfo)
  const [profileSettingsClick, setProfileSettingsClick] = useState(false)
  const [profileSettingsClickValues, setProfileSettingsClickValues] =
    useState(false)
  const [apiLoader, setApiLoader] = useState(false)
  const [apiResponce, setApiResponce] = useState<any>([])
  const [searchData, setSearchData] = useState("")
  const [displayFilter, setDisplayFilter] = useState(false)
  const [searchDisplayFilter, setSearchDisplayFilter] = useState(false)
  const [settingsPanel, setSettingsPanel] = useState<boolean>(false)
  const [listAll, setListAll] = useState(false)
  const [searchFilter, setSearchFilter] = useState(false)
  const [sortedDate, setSortedDate] = useState([])

  const [meeting, setMeeting] = useState(false)

  const popUp = useSelector((state: any) => state.Flag.popUp)

  const [closeDropdown, setCloseDropdown] = useState(false)
  const [searchBox, setSearchBox] = useState(false)

  const [openTodayMeeting, setOpenTodayMeeting] = useState(false)
  const chatScreen = useSelector((state: any) => state.Chat.chatScreen)
  const keyCloakLoggedInState = useSelector(
    (state: any) => state.Main.keyCloakLoggedInState
  )
  const user = useSelector((state: any) => state.Main.meetingSession)
  const settings = useSelector((state: any) => state.Main.soundAndNotification)
  const [usermessageCount, setuserMessageCount] = useState(0)
  const [groupmessageCount, setgroupMessageCount] = useState(0)
  const usersList = useSelector((state: any) => state.Chat.userData)
  const groupsList = useSelector((state: any) => state.Chat.groupData)
  let domain = getSubDomain()
  const searchActiveChat = useSelector(
    (state: any) => state.Chat.searchActiveChat
  )
  const brandingInfo = useSelector((state: any) => state.Main.brandingInfo)
  const modals = useSelector((state: any) => state.Main.modals)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const searchRef = useRef<HTMLInputElement>(null)
  const dashboardRef: LegacyRef<HTMLInputElement> = useRef(null)
  const param = useParams()["*"]
  const { data: activeChat, isGroups } = useSelector(
    (state: any) => state.Chat.activeChat
  )
  const permissionSettings = useSelector(
    (state: RootState) => state.Main.permissionSettings
  )
  const loginState = useSelector((state: RootState) => state.Flag.loginState)
  const onReady = useSelector((state: any) => state.Flag.onReady)

  useEffect(() => {
    if (
      authInfo?.token_info?.access_token &&
      authInfo?.token_info?.access_token !== ""
    ) {
      const userInfo = jwt(authInfo?.token_info?.access_token)
      dispatch(actionCreators.setLoginState(true))
      dispatch(actionCreators.setLoggedInUserInfo(userInfo))
    }
  }, [authInfo?.token_info?.access_token])

  useEffect(() => {
    if (!searchBox) {
      dispatch(actionCreators.searchActiveChat(""))
    } else if (searchBox && searchRef.current) {
      searchRef.current.focus()
    }
  }, [searchBox])

  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.keyCode === 78 && (event.ctrlKey || event.metaKey)) {
        navigate("/app/dashboard/members")
      } else if (event.keyCode === 188 && (event.ctrlKey || event.metaKey)) {
        setSettingsPanel(!settingsPanel)
      } else if (event.keyCode === 71 && (event.ctrlKey || event.metaKey)) {
        setSearchBox(true)
      }
    }
    window.addEventListener("keydown", handleKeyPress)

    return () => {
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [])

  useEffect(() => {
    if (searchActiveChat) {
      setSearchBox(true)
    }
  }, [searchActiveChat])

  useEffect(() => {
    sessionListeners(dispatch, user)
    user.listAvailableDevices().then((device: any) => {
      dispatch(actionCreators.setDeviceList(device))
    })
  }, [])

  function capitalizeFirstLetter(string: any) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  function getSubDomain() {
    const host = window.location.hostname
    let real = "system"
    let sub = host.split(".")
    if (sub.length > 2) {
      real = sub[0]
    }
    return real
  }

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
    dispatch(actionCreators.setPopUp(type))
    dispatch(actionCreators.setShowEmoji(false))
    dispatch(actionCreators.setEmojiBox(false))
    dispatch(actionCreators.setCreateGrpOption(false))
    dispatch(actionCreators.setNewChatOption(false))
    if (searchData !== "" && type === "searchDropDown") {
      setSearchBox(true)
    } else {
      setSearchBox(false)
    }
  }

  const searchOpen = () => {
    setSearchBox(true)
  }

  const handleSearch = (
    data: any,
    event?: any,
    type?:
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
    if (!popUp.searchDropDown) {
      handlePopUp(event, "searchDropDown")
    }
    if (data === "") {
      handlePopUp(event, "closeAll")
      setCloseDropdown(false)
    }
    setSearchBox(true)
    setSearchData(data)
    setSearchDisplayFilter(false)
    setSearchFilter(true)
    setCloseDropdown(true)
  }

  useEffect(() => {
    if (searchData == "") {
      setSearchDisplayFilter(true)
    }
    setDisplayFilter(true)
  })

  useEffect(() => {
    window.addEventListener("message", (event: any) => {
      if (event.data === "focusWindow") {
        const notification = new Notification(
          "Screen share selection popup is in the background. Please click here to navigate.",
          {
            icon: brandingInfo?.data?.logos?.favicon,
          }
        )
        notification.onclick = () => {
          window.focus()
        }
      }
    })
  }, [])

  useEffect(() => {
    if (!authInfo?.token_info?.access_token && onReady) {
      navigate(path.HOME)
    }
  }, [authInfo?.token_info?.access_token, onReady])

  useEffect(() => {
    const date = new Date()
    const hour = date.getHours()
    const min = date.getMinutes()
    const currentTime = hour + min / 100
  }, [settings[0]?.from_time, settings[0]?.to_time])

  useEffect(() => {
    setuserMessageCount(
      usersList.reduce(
        (total: any, node: any) => total + node?.unread_msg_count,
        0
      )
    )
    setgroupMessageCount(
      groupsList.reduce(
        (total: any, node: any) => total + node?.unread_msg_count,
        0
      )
    )
  }, [usersList, groupsList])

  UseEscape(() => setSettingsPanel(false))

  useEffect(() => {
    domain = getSubDomain()
  }, [loginState])

  useEffect(() => {
    if (onReady) {
      document.title = `${
        usermessageCount + groupmessageCount != 0
          ? `(${usermessageCount + groupmessageCount}) `
          : ""
      }${capitalizeFirstLetter(
        authInfo?.tenant?.length ? authInfo?.tenant : domain
      )} | NCS`
    }
  }, [usermessageCount, groupmessageCount, domain, authInfo?.tenant, onReady])

  if (keyCloakLoggedInState === false) {
    return <UserLoggedOutpage />
  }

  return (
    <div>
      {" "}
      {brandingInfo?.data?.logos?.favicon ? (
        <div
          ref={dashboardRef}
          className={` w-screen h-screen flex flex-col items-start`}
        >
          <audio id="voipCall" />
          {chatScreen === false && param !== "pbx" ? (
            <TopBar
              searchRef={searchRef}
              settingsPanel={settingsPanel}
              setSettingsPanel={setSettingsPanel}
              searchBox={searchBox}
              setSearchBox={setSearchBox}
              closeDropdown={closeDropdown}
              setCloseDropdown={setCloseDropdown}
              searchFilter={searchFilter}
              setSearchFilter={setSearchFilter}
              listAll={listAll}
              setListAll={setListAll}
              handleSearch={handleSearch}
              setDisplayFilter={setSearchDisplayFilter}
              setSearchData={setSearchData}
              searchData={searchData}
              apiResponce={apiResponce}
              setApiResponce={setApiResponce}
              setApiLoader={setApiLoader}
              setMeeting={setMeeting}
              meeting={meeting}
              setOpenTodayMeeting={setOpenTodayMeeting}
              setProfileSettingsClick={setProfileSettingsClick}
              setSortedDate={setSortedDate}
              sortedDate={sortedDate}
              displayFilter={searchDisplayFilter}
            />
          ) : (
            <ChatTopBar
              searchRef={searchRef}
              settingsPanel={settingsPanel}
              setSettingsPanel={setSettingsPanel}
              searchBox={searchBox}
              setSearchBox={setSearchBox}
              closeDropdown={closeDropdown}
              setCloseDropdown={setCloseDropdown}
              searchFilter={searchFilter}
              setSearchFilter={setSearchFilter}
              listAll={listAll}
              setListAll={setListAll}
              handleSearch={handleSearch}
              setDisplayFilter={setSearchDisplayFilter}
              setSearchData={setSearchData}
              searchData={searchData}
              apiResponce={apiResponce}
              setApiResponce={setApiResponce}
              setApiLoader={setApiLoader}
              setMeeting={setMeeting}
              meeting={meeting}
              setOpenTodayMeeting={setOpenTodayMeeting}
              setProfileSettingsClick={setProfileSettingsClick}
              setSortedDate={setSortedDate}
              sortedDate={sortedDate}
              displayFilter={searchDisplayFilter}
            />
          )}
          <div className={`flex w-full`}>
            <motion.div
              className={`flex ${!chatScreen ? "w-[60px]" : "max-w-[334px]"}`}
            >
              <LeftBar
                dashboardRef={dashboardRef}
                searchBox={searchOpen}
                setOpenTodayMeeting={setOpenTodayMeeting}
                setProfileSettingsClick={setProfileSettingsClick}
                setProfileSettingsClickValues={setProfileSettingsClickValues}
                unread={usermessageCount + groupmessageCount}
              />
              <motion.div
                key="chatSection"
                className={`${!chatScreen && "hidden"}`}
              >
                <Chats
                  setOpenTodayMeeting={setOpenTodayMeeting}
                  searchBox={searchOpen}
                  setProfileSettingsClick={setProfileSettingsClick}
                />
              </motion.div>
            </motion.div>
            <div className={`${"w-full"}`}>
              <AnimatePresence mode="popLayout">
                {settingsPanel && (
                  <SettingsPanel
                    settingsPanel={settingsPanel}
                    setclose={setSettingsPanel}
                  />
                )}
              </AnimatePresence>
              {modals?.[0]?.category === "modal" && <Modal />}
              <Routes>
                {permissionSettings?.meeting?.length ? (
                  <Route
                    path="/meeting"
                    element={
                      <Meetings
                        apiLoader={apiLoader}
                        setApiLoader={setApiLoader}
                        setSortedDate={setSortedDate}
                        sortedDate={sortedDate}
                        searchFilter={searchFilter}
                        setSearchFilter={setSearchFilter}
                        listAll={listAll}
                        setListAll={setListAll}
                        handleSearch={handleSearch}
                        displayFilter={displayFilter}
                        setDisplayFilter={setDisplayFilter}
                        apiResponce={apiResponce}
                        setApiResponce={setApiResponce}
                        searchData={searchData}
                      />
                    }
                  />
                ) : null}
                {permissionSettings?.chat?.length ? (
                  <Route path="/chat/:id" element={<ChatPage />} />
                ) : null}
                {permissionSettings?.pbx?.length ? (
                  <Route path="/pbx" element={<CallOverView />} />
                ) : null}
                <Route path="/*" element={<LandingPage />} />
                <Route path="/past-meetings" element={<PastMeetingPage />} />
                {permissionSettings?.chat?.length ? (
                  <Route path="/chat/members" element={<MembersPage />} />
                ) : null}
                <Route path="/Themes" element={<ThemeSettings />} />
                <Route
                  path="/search-result/:value"
                  element={<SearchResultPage />}
                />
                <Route
                  path="/search-result/:value/:key"
                  element={<SearchResultPage />}
                />
              </Routes>
              <Outlet />
            </div>
          </div>
        </div>
      ) : (
        <ScreenLoader />
      )}
    </div>
  )
}

export default Dashboard
