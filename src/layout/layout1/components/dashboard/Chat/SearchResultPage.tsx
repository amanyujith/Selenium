import { t } from "i18next"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { actionCreators } from "../../../../../store"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"
import { MultiSelectDropdown } from "../../../../../atom/MultiSelectDropDown/multiSelectDropDown"
import moment from "moment"
import path from "../../../../../navigation/routes.path"
import ScreenLoader from "../../../../../atom/ScreenLoader/screenLoader"
import Markdown from "markdown-to-jsx"
import linkifyHtml from "linkify-html"
import DraftParser from "./hooks/draftToHTMLParser"
import useQuadrant from "./hooks/useQuadrant"
import search from "../../../../../constants/images/search.jpg"

const SearchResultPage = () => {
  const { value } = useParams()
  const [prevId, setPrevId] = useState<any>()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const chatInstance = useSelector((state: any) => state.Chat.chatInstance)
  const groupsList = useSelector((state: any) => state.Chat.groupData)
  const userData = useSelector((state: any) => state.Chat.userData)
  const [userList, setUserList] = useState([])
  const [groupList, setGroupList] = useState([])
  const [messageList, setMessageList] = useState<any>([])
  const [userFullData, setUserFullData] = useState([])
  const [groupFullData, setGroupFullData] = useState([])
  const [type, setType] = useState("messages")
  const [membersList, setMemebersList] = useState(userData)
  const [groupsOptionList, setGroupsOptionList] = useState(groupsList)
  const [searchData, setSearchData] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [endOfSearch, setEndOfSearch] = useState<boolean>(false)
  const personalInfo = useSelector((state: any) => state.Chat.personalInfo)

  const { key } = useParams()
  const { data: activeChat, isGroup } = useSelector(
    (state: any) => state.Chat.activeChat
  )
  let preventElaborate = true
  useEffect(() => {
    if (key && preventElaborate) {
      let payload = { search: value?.trim(), to: [key] }
      setSearchData(payload)
      filterSearch([activeChat], activeChat.admin ? "In" : "With")

      activeChat.admin
        ? toggleOptionIn(activeChat, "In")
        : toggleOptionWith(activeChat, "With")
    } else {
      filterSearch()
    }
  }, [value, key])

  useEffect(() => {
    setPrevId(value)
  }, [value, key])

  const handleType = (value: string) => {
    if (type !== value) {
      setType(value)
    }
  }

  const dateOptions = [
    { label: "Any time", value: null },
    { label: "Today", value: 0 },
    { label: "Yesterday", value: 1 },
    { label: "Last 7 days", value: 6 },
    { label: "Last 30 days", value: 29 },
    { label: "Last 3 months", value: 90 },
    { label: "Last 12 months", value: 365 },
    { label: "Range", value: "custom" },
  ]
  const [selectedFrom, setSelectedFrom] = useState<any>([])
  const [selectedIn, setSelectedIn] = useState<any>([])
  const [selectedWith, setSelectedWith] = useState<any>([])
  const [selectedTo, setSelectedTo] = useState<any>([])
  const [selectedDate, setSelectedDate] = useState<any>(dateOptions[0])
  const [quadrant, setQuadrant] = useState("Top-Left")
  const setSelectedData = (
    prevSelected: any,
    id: any,
    type: any,
    merged: boolean
  ) => {
    const newArray: any = [...prevSelected]

    if (newArray.includes(id)) {
      let temp = newArray.filter((item: any) => item !== id)
      if (type === "In" || type === "With") {
        if (merged === true) {
          filterSearch(temp, type)
        }
      } else {
        filterSearch(temp, type)
      }
      return newArray.filter((item: any) => item !== id)
    } else {
      newArray.push(id)
      if (type === "In" || type === "With") {
        if (merged === true) {
          filterSearch(newArray, type)
        }
      } else {
        filterSearch(newArray, type)
      }
      return newArray
    }
  }

  const filterSearch = (dataArray: any = [], type: any = null) => {
    let lastData: any = messageList[messageList.length - 1]
    prevId !== value && setLoading(true)
    let arrayOfUuids = []
    if (type !== "Date") {
      arrayOfUuids = dataArray.map((obj: any) => obj.uuid)
    }
    if (dataArray.length === 0) dataArray = undefined
    let payload = {
      search:
        value !== undefined ? decodeURIComponent(value).trim() : undefined,
      limit: 10,
      a_ctime:
        lastData && prevId !== undefined && prevId === value
          ? lastData?.a_ctime
          : new Date().getTime(),
      from:
        type === "From"
          ? arrayOfUuids.length > 0
            ? arrayOfUuids
            : undefined
          : searchData.from === undefined
          ? undefined
          : searchData.from,
      to:
        type === "In" || type === "With"
          ? arrayOfUuids.length > 0
            ? arrayOfUuids
            : undefined
          : searchData.to === undefined
          ? undefined
          : searchData.to,
      startdate:
        type === "Date"
          ? dataArray?.startTime
          : searchData.startdate === undefined
          ? undefined
          : searchData.startdate,
      enddate:
        type === "Date"
          ? dataArray?.endTime
          : searchData.enddate === undefined
          ? undefined
          : searchData.enddate,
    }

    setSearchData(payload)
    chatInstance?.ElaborateSearch(payload).then((res: any) => {
      setUserList(res.users)
      setGroupList(res.groups)
      lastData && prevId !== undefined && prevId !== value
        ? setMessageList(res?.messages)
        : setMessageList([...messageList, ...res?.messages])
      setGroupFullData(res.group_data)
      setUserFullData(res.user_data)
      setEndOfSearch(res.end_of_search)
      setLoading(false)
    })
  }

  const toggleOptionFrom = (id: any, type: any) => {
    setSelectedFrom((prevSelected: any) => {
      return setSelectedData(prevSelected, id, type, false)
    })
  }

  const toggleOptionIn = (id: any, type: any) => {
    setSelectedIn((prevSelected: any) => {
      return setSelectedData(prevSelected, id, type, false)
    })
    setSelectedTo((prevSelected: any) => {
      return setSelectedData(prevSelected, id, type, true)
    })
  }

  const toggleOptionWith = (id: any, type: any) => {
    setSelectedWith((prevSelected: any) => {
      return setSelectedData(prevSelected, id, type, false)
    })
    setSelectedTo((prevSelected: any) => {
      return setSelectedData(prevSelected, id, type, true)
    })
  }

  const toggleOptionDate = (option: any, type: any, range: any = {}) => {
    setSelectedDate(option)
    let dateObj: any = {}
    let today: any = new Date().setHours(0, 0, 0, 0)
    today = new Date(today)
    let now = new Date()

    if (option.value === null) {
      dateObj.startTime = undefined
      dateObj.endTime = undefined
    } else if (option === "custom") {
      dateObj.endTime = range.end
      dateObj.startTime = range.start
    } else if (option.value === 1) {
      dateObj.endTime = today.getTime()
      dateObj.startTime = today.setDate(today.getDate() - option.value)
    } else {
      dateObj.endTime = now.getTime()
      dateObj.startTime = today.setDate(today.getDate() - option.value)
    }
    filterSearch(dateObj, type)
  }

  const handleClick = (data: any) => {
    if (data.type === "group") {
      const hasGroup = groupsList.some((node: any) => node.uuid === data.uuid)
      if (hasGroup) {
        dispatch(actionCreators.setAcitveChat(data.uuid, true))
        navigate(`${path.CHAT}/${data.uuid}`)
      } else {
        chatInstance
          ?.fetchGroupChats(data.uuid, 25)
          .then((res: any) => {
            dispatch(
              actionCreators.addNewChat({ data: res, isGroup: true }, true)
            )
            navigate(`${path.CHAT}/${data.uuid}`)
          })
          .catch((err: any) => {})
      }
    } else {
      const hasUser = userList.some((node: any) => node.uuid === data.uuid)
      if (hasUser) {
        dispatch(actionCreators.setAcitveChat(data.uuid, false))
        navigate(`${path.CHAT}/${data.uuid}`)
      } else {
        chatInstance
          ?.fetchUserChats(data.uuid, 25)
          .then((res: any) => {
            dispatch(
              actionCreators.addNewChat({ data: res, isGroup: false }, true)
            )
            navigate(`${path.CHAT}/${data.uuid}`)
          })
          .catch((err: any) => {})
      }
    }
  }

  const handleRedirectToChat = (
    reply_uuid: string,
    count: number,
    group: false,
    toID: string,
    from: string
  ) => {
    // const hasUser = userList.some((node: any) => node.uuid === to)
    // userList.map((node: any)=>{
    //
    // })

    const to = personalInfo.uuid === toID && !group ? from : toID
    chatInstance
      ?.GetSearchUserResultData({ reply_uuid, count, group, to })
      .then((res: any) => {
        let hasData: boolean = false
        if (group) hasData = groupsList.some((node: any) => node.uuid === toID)
        else hasData = userData.some((node: any) => node.uuid === res[0].uuid)
        if (hasData) {
          dispatch(
            actionCreators.setSearchResultChat(
              res[0].uuid,
              res[0].messages,
              group,
              reply_uuid
            )
          )
          dispatch(actionCreators.searchFlag(true))
          dispatch(actionCreators.handleMessageInLimbo(res[0], group))
          dispatch(actionCreators.setAcitveChat(res[0].uuid, group))
          navigate(`${path.CHAT}/${res[0].uuid}`)
        } else {
          dispatch(
            actionCreators.addNewChat({ data: res[0], isGroup: group }, true)
          )
          navigate(`${path.CHAT}/${res.uuid}`)
        }
      })
      .catch((err: any) => {})
  }

  useEffect(() => {
    dispatch(actionCreators.setChatscreen(true))
  }, [])

  const section = useRef(null)
  useQuadrant(section, setQuadrant)

  const linkifyOptions = {
    className: "text-[#004B91]",
    target: "_blank",
  }

  const handleScroll = (e: any) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop - 20 < e.target.clientHeight
    if (bottom) {
      !endOfSearch && filterSearch()
    }
  }

  const renderMessage = (chatMessage: any) => {
    return (
      <div id="chatMsg">
        {chatMessage.type && chatMessage.type === "v1" ? (
          <Markdown>
            {linkifyHtml(chatMessage.plainText ?? "", linkifyOptions)}
          </Markdown>
        ) : (
          <DraftParser
            rawObject={chatMessage}
            isSearch={true}
            quadrant={quadrant}
          />
        )}
      </div>
    )
  }

  return (
    <div className=" px-3 py-6 sm:w-[calc(100vw-312px)] w-screen h-[calc(100vh-56px)]">
      <div className=" text-lg font-bold text-primary-200">
        {t("Chat.SearchResultFor")} {value}
      </div>
      <div className=" mt-[18px]">
        {/* <span className=' text-sm px-4 pb-1 text-primary-200 border-b border-b-[#404041]'>All Messages ({'count'})</span> */}
        <span
          onClick={() => handleType("messages")}
          className={` cursor-pointer text-sm px-4 pb-1 text-primary-200 border-b ${
            type === "messages" ? "border-b-[#404041]" : "border-b-[#C4C4C4]"
          }`}
        >
          {t("Chat.AllMessages")} ({messageList?.length})
        </span>
        <span
          onClick={() => handleType("group")}
          className={`cursor-pointer text-sm px-4 pb-1 text-primary-200 border-b ${
            type === "group" ? "border-b-[#404041]" : "border-b-[#C4C4C4]"
          }`}
        >
          {t("Chat.Groups")} ({groupList?.length})
        </span>
        <span
          onClick={() => handleType("user")}
          className={`cursor-pointer text-sm px-4 pb-1 text-primary-200 border-b ${
            type === "user" ? "border-b-[#404041]" : "border-b-[#C4C4C4]"
          }`}
        >
          {t("Chat.Members")} ({userList.length})
        </span>
      </div>
      {type === "messages" && (
        <div className=" flex gap-2 cursor-pointer">
          <MultiSelectDropdown
            options={membersList}
            selected={selectedFrom}
            toggleOption={toggleOptionFrom}
            placeholder="From"
            setOptions={setMemebersList}
            setUserList={setMemebersList}
          />
          <MultiSelectDropdown
            options={groupsOptionList}
            selected={selectedIn}
            toggleOption={toggleOptionIn}
            placeholder="In"
            setOptions={setGroupsOptionList}
          />
          <MultiSelectDropdown
            options={membersList}
            selected={selectedWith}
            toggleOption={toggleOptionWith}
            placeholder="With"
            setOptions={setMemebersList}
            setUserList={setMemebersList}
          />
          <MultiSelectDropdown
            options={dateOptions}
            selected={selectedDate}
            toggleOption={toggleOptionDate}
            placeholder="Date"
          />
        </div>
      )}

      <div
        onScroll={(e) => handleScroll(e)}
        className="h-[calc(100vh-200px)] overflow-y-auto overflow-x-hidden"
        ref={section}
      >
        {!loading ? (
          <>
            {type === "messages" &&
              (messageList?.length > 0 ? (
                <div className="mt-3">
                  {messageList.map((item: any) => {
                    // item.type === "text" && (
                    let usersData: any = userFullData.find(
                      (user: any) => user.uuid === item.from
                    )
                    let groupsData: any = groupFullData.find(
                      (user: any) => user.uuid === item.to
                    )

                    return (
                      <div
                        key={item.uuid}
                        id="searchResultItem"
                        className=" flex flex-col w-full h-fit p-3 rounded-[10px] border-[1px] my-[12px] cursor-pointer border-[#0000001F]"
                        onClick={() =>
                          handleRedirectToChat(
                            item.uuid,
                            20,
                            item.group,
                            item.to,
                            item.from
                          )
                        }
                      >
                        <div className="mb-[8px] flex flex-row gap-2 items-center">
                          {item.group && (
                            <div>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                              >
                                <mask
                                  id="mask0_9531_37880"
                                  maskUnits="userSpaceOnUse"
                                  x="0"
                                  y="0"
                                  width="16"
                                  height="16"
                                >
                                  <rect width="16" height="16" fill="#D9D9D9" />
                                </mask>
                                <g mask="url(#mask0_9531_37880)">
                                  <path
                                    d="M7.01927 8.33333C6.77483 8.33333 6.57216 8.23889 6.41127 8.05C6.24994 7.86111 6.19149 7.63889 6.23594 7.38333L6.4026 6.35C6.46927 5.96111 6.65549 5.63889 6.96127 5.38333C7.2666 5.12778 7.61371 5 8.0026 5C8.4026 5 8.75549 5.12778 9.06127 5.38333C9.3666 5.63889 9.5526 5.96111 9.61927 6.35L9.78594 7.38333C9.83038 7.63889 9.77216 7.86111 9.61127 8.05C9.44994 8.23889 9.24705 8.33333 9.0026 8.33333H7.01927ZM7.2526 7.33333H8.76927L8.63594 6.51667C8.61371 6.36111 8.54149 6.236 8.41927 6.14133C8.29705 6.04711 8.15816 6 8.0026 6C7.84705 6 7.71083 6.04711 7.59394 6.14133C7.47749 6.236 7.40816 6.36111 7.38594 6.51667L7.2526 7.33333ZM2.28594 8.88333C2.07483 8.89444 1.88883 8.85267 1.72794 8.758C1.5666 8.66378 1.46372 8.51667 1.41927 8.31667C1.39705 8.22778 1.39149 8.14156 1.4026 8.058C1.41372 7.97489 1.43594 7.89444 1.46927 7.81667C1.46927 7.82778 1.46372 7.80556 1.4526 7.75C1.44149 7.72778 1.39705 7.61667 1.31927 7.41667C1.29705 7.29444 1.31105 7.18333 1.36127 7.08333C1.41105 6.98333 1.46927 6.89444 1.53594 6.81667C1.54705 6.81667 1.55816 6.80556 1.56927 6.78333C1.59149 6.60556 1.6666 6.45556 1.7946 6.33333C1.92216 6.21111 2.08038 6.15 2.26927 6.15C2.29149 6.15 2.38038 6.16667 2.53594 6.2H2.58594C2.63038 6.14444 2.69149 6.10556 2.76927 6.08333C2.84705 6.06111 2.92483 6.05 3.0026 6.05C3.11372 6.05 3.21105 6.06667 3.2946 6.1C3.37772 6.13333 3.44149 6.18333 3.48594 6.25C3.49705 6.25 3.50549 6.25267 3.51127 6.258L3.51927 6.26667C3.6526 6.27778 3.76927 6.31933 3.86927 6.39133C3.96927 6.46378 4.04705 6.56111 4.1026 6.68333C4.11372 6.75 4.11927 6.81111 4.11927 6.86667C4.11927 6.92222 4.10816 6.98333 4.08594 7.05L4.1026 7.1C4.16927 7.17778 4.21927 7.25267 4.2526 7.32467C4.28594 7.39711 4.3026 7.47778 4.3026 7.56667C4.3026 7.6 4.27483 7.7 4.21927 7.86667V7.93333C4.23038 7.94444 4.24149 8.02222 4.2526 8.16667C4.2526 8.36667 4.16927 8.536 4.0026 8.67467C3.83594 8.81378 3.63594 8.88333 3.4026 8.88333H2.28594ZM13.1859 8.91667C12.8637 8.91667 12.5915 8.80556 12.3693 8.58333C12.147 8.36111 12.0359 8.09444 12.0359 7.78333C12.0359 7.66111 12.0526 7.55289 12.0859 7.45867C12.1193 7.364 12.1637 7.26667 12.2193 7.16667L11.8193 6.81667C11.7193 6.73889 11.7026 6.64444 11.7693 6.53333C11.8359 6.42222 11.9248 6.36667 12.0359 6.36667H13.1693C13.4915 6.36667 13.7637 6.47778 13.9859 6.7C14.2082 6.92222 14.3193 7.18889 14.3193 7.5V7.78333C14.3193 8.09444 14.2082 8.36111 13.9859 8.58333C13.7637 8.80556 13.497 8.91667 13.1859 8.91667ZM0.335938 11.8667V11.05C0.335938 10.5944 0.569271 10.2278 1.03594 9.95C1.5026 9.67222 2.1026 9.53333 2.83594 9.53333C2.98038 9.53333 3.11371 9.536 3.23594 9.54133C3.35816 9.54711 3.47483 9.56111 3.58594 9.58333C3.46372 9.78333 3.36927 9.99444 3.3026 10.2167C3.23594 10.4389 3.2026 10.6722 3.2026 10.9167V11.8667H0.335938ZM4.33594 11.8667V10.95C4.33594 10.3056 4.67483 9.79178 5.3526 9.40867C6.03038 9.02511 6.91371 8.83333 8.0026 8.83333C9.1026 8.83333 9.98883 9.02511 10.6613 9.40867C11.3333 9.79178 11.6693 10.3056 11.6693 10.95V11.8667H4.33594ZM13.1693 9.53333C13.9137 9.53333 14.5164 9.67222 14.9773 9.95C15.4386 10.2278 15.6693 10.5944 15.6693 11.05V11.8667H12.8026V10.9167C12.8026 10.6722 12.7719 10.4389 12.7106 10.2167C12.6497 9.99444 12.5582 9.78333 12.4359 9.58333C12.5582 9.56111 12.6804 9.54711 12.8026 9.54133C12.9248 9.536 13.047 9.53333 13.1693 9.53333ZM8.0026 9.83333C7.31371 9.83333 6.71927 9.92489 6.21927 10.108C5.71927 10.2916 5.44149 10.5167 5.38594 10.7833V10.8667H10.6359V10.7833C10.5693 10.5167 10.2888 10.2916 9.7946 10.108C9.29994 9.92489 8.7026 9.83333 8.0026 9.83333Z"
                                    fill="#C4C4C4"
                                  />
                                </g>
                              </svg>
                            </div>
                          )}
                          {groupsData && groupsData.name && (
                            <div className=" text-sm text-[#C4C4C4]">
                              {" "}
                              {groupsData.name}{" "}
                            </div>
                          )}
                          <div className="text-xs text-[#404041]">
                            {moment(new Date(item.a_ctime)).format(
                              "MM/DD/YYYY"
                            )}
                          </div>
                        </div>
                        <div className="flex flex-row">
                          <div
                            className={`w-[28px] h-[28px] flex justify-center items-center shrink-0 rounded-bl-none rounded-[50%] text-[15px] border-[2px] border-[#E9EBF8] text-primary-200 bg-[#B8C46F] overflow-hidden`}
                          >
                            {usersData && usersData?.profile_picture ? (
                              <img
                                className="w-full h-full  object-cover "
                                src={usersData?.profile_picture}
                                alt=""
                              />
                            ) : item.type === "group" ? (
                              <svg
                                className=""
                                width="18"
                                height="12"
                                viewBox="0 0 16 7"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M7.01927 3.33333C6.77483 3.33333 6.57216 3.23889 6.41127 3.05C6.24994 2.86111 6.19149 2.63889 6.23594 2.38333L6.4026 1.35C6.46927 0.961111 6.65549 0.638889 6.96127 0.383333C7.2666 0.127778 7.61371 0 8.0026 0C8.4026 0 8.75549 0.127778 9.06127 0.383333C9.3666 0.638889 9.5526 0.961111 9.61927 1.35L9.78594 2.38333C9.83038 2.63889 9.77216 2.86111 9.61127 3.05C9.44994 3.23889 9.24705 3.33333 9.0026 3.33333H7.01927ZM7.2526 2.33333H8.76927L8.63594 1.51667C8.61371 1.36111 8.54149 1.236 8.41927 1.14133C8.29705 1.04711 8.15816 1 8.0026 1C7.84705 1 7.71083 1.04711 7.59394 1.14133C7.47749 1.236 7.40816 1.36111 7.38594 1.51667L7.2526 2.33333ZM2.28594 3.88333C2.07483 3.89444 1.88883 3.85267 1.72794 3.758C1.5666 3.66378 1.46372 3.51667 1.41927 3.31667C1.39705 3.22778 1.39149 3.14156 1.4026 3.058C1.41372 2.97489 1.43594 2.89444 1.46927 2.81667C1.46927 2.82778 1.46372 2.80556 1.4526 2.75C1.44149 2.72778 1.39705 2.61667 1.31927 2.41667C1.29705 2.29444 1.31105 2.18333 1.36127 2.08333C1.41105 1.98333 1.46927 1.89444 1.53594 1.81667C1.54705 1.81667 1.55816 1.80556 1.56927 1.78333C1.59149 1.60556 1.6666 1.45556 1.7946 1.33333C1.92216 1.21111 2.08038 1.15 2.26927 1.15C2.29149 1.15 2.38038 1.16667 2.53594 1.2H2.58594C2.63038 1.14444 2.69149 1.10556 2.76927 1.08333C2.84705 1.06111 2.92483 1.05 3.0026 1.05C3.11372 1.05 3.21105 1.06667 3.2946 1.1C3.37772 1.13333 3.44149 1.18333 3.48594 1.25C3.49705 1.25 3.50549 1.25267 3.51127 1.258L3.51927 1.26667C3.6526 1.27778 3.76927 1.31933 3.86927 1.39133C3.96927 1.46378 4.04705 1.56111 4.1026 1.68333C4.11372 1.75 4.11927 1.81111 4.11927 1.86667C4.11927 1.92222 4.10816 1.98333 4.08594 2.05L4.1026 2.1C4.16927 2.17778 4.21927 2.25267 4.2526 2.32467C4.28594 2.39711 4.3026 2.47778 4.3026 2.56667C4.3026 2.6 4.27483 2.7 4.21927 2.86667V2.93333C4.23038 2.94444 4.24149 3.02222 4.2526 3.16667C4.2526 3.36667 4.16927 3.536 4.0026 3.67467C3.83594 3.81378 3.63594 3.88333 3.4026 3.88333H2.28594ZM13.1859 3.91667C12.8637 3.91667 12.5915 3.80556 12.3693 3.58333C12.147 3.36111 12.0359 3.09444 12.0359 2.78333C12.0359 2.66111 12.0526 2.55289 12.0859 2.45867C12.1193 2.364 12.1637 2.26667 12.2193 2.16667L11.8193 1.81667C11.7193 1.73889 11.7026 1.64444 11.7693 1.53333C11.8359 1.42222 11.9248 1.36667 12.0359 1.36667H13.1693C13.4915 1.36667 13.7637 1.47778 13.9859 1.7C14.2082 1.92222 14.3193 2.18889 14.3193 2.5V2.78333C14.3193 3.09444 14.2082 3.36111 13.9859 3.58333C13.7637 3.80556 13.497 3.91667 13.1859 3.91667ZM0.335938 6.86667V6.05C0.335938 5.59445 0.569271 5.22778 1.03594 4.95C1.5026 4.67222 2.1026 4.53333 2.83594 4.53333C2.98038 4.53333 3.11371 4.536 3.23594 4.54133C3.35816 4.54711 3.47483 4.56111 3.58594 4.58333C3.46372 4.78333 3.36927 4.99444 3.3026 5.21667C3.23594 5.43889 3.2026 5.67222 3.2026 5.91667V6.86667H0.335938ZM4.33594 6.86667V5.95C4.33594 5.30556 4.67483 4.79178 5.3526 4.40867C6.03038 4.02511 6.91371 3.83333 8.0026 3.83333C9.1026 3.83333 9.98883 4.02511 10.6613 4.40867C11.3333 4.79178 11.6693 5.30556 11.6693 5.95V6.86667H4.33594ZM13.1693 4.53333C13.9137 4.53333 14.5164 4.67222 14.9773 4.95C15.4386 5.22778 15.6693 5.59445 15.6693 6.05V6.86667H12.8026V5.91667C12.8026 5.67222 12.7719 5.43889 12.7106 5.21667C12.6497 4.99444 12.5582 4.78333 12.4359 4.58333C12.5582 4.56111 12.6804 4.54711 12.8026 4.54133C12.9248 4.536 13.047 4.53333 13.1693 4.53333ZM8.0026 4.83333C7.31371 4.83333 6.71927 4.92489 6.21927 5.108C5.71927 5.29156 5.44149 5.51667 5.38594 5.78333V5.86667H10.6359V5.78333C10.5693 5.51667 10.2888 5.29156 9.7946 5.108C9.29994 4.92489 8.7026 4.83333 8.0026 4.83333Z"
                                  fill="#404041"
                                />
                              </svg>
                            ) : (
                              <div>
                                {usersData?.display_name
                                  ?.slice(0, 1)
                                  .toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="ml-[8px] flex flex-col">
                            <div className=" flex flex-row">
                              <div className=" text-[#404041] mr-[1px] text-sm font-bold">
                                {usersData?.display_name}
                              </div>
                              <div className="text-[10px] text-[#8D8D8D] p-1">
                                {moment(new Date(item.a_ctime)).format(
                                  "hh:mm A"
                                )}
                              </div>
                            </div>
                            <div className="text-[#404041] text-sm">
                              {renderMessage(item.body)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-left text-xl text-primary-100 mb-3 h-full flex flex-col justify-center items-center -ml-28">
                  <img src={search} className="" alt="" />
                  {t("NoResultsFound")}
                </div>
              ))}

            {type === "user" &&
              (userList.length > 0 ? (
                <div className=" mt-3">
                  {userList.map(
                    (item: any) =>
                      item.type === type && (
                        <div
                          key={item.uuid}
                          id="searchResultItem"
                          {...{ email: item.email }}
                          className="flex flex-row h-fit ml-1 py-2 px-3 cursor-pointer hover:bg-[#0000001f]"
                          onClick={() => handleClick(item)}
                        >
                          <div
                            className={`w-[30px] h-[30px] flex justify-center items-center shrink-0 rounded-bl-none rounded-[50%] text-[15px] border-[2px] border-[#E9EBF8] text-[white] bg-[#91785B] overflow-hidden`}
                          >
                            {item.profile_picture ? (
                              <img
                                className="w-full h-full  object-cover "
                                src={item.profile_picture}
                                alt=""
                              />
                            ) : item.type === "group" ? (
                              <svg
                                className=""
                                width="18"
                                height="12"
                                viewBox="0 0 16 7"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M7.01927 3.33333C6.77483 3.33333 6.57216 3.23889 6.41127 3.05C6.24994 2.86111 6.19149 2.63889 6.23594 2.38333L6.4026 1.35C6.46927 0.961111 6.65549 0.638889 6.96127 0.383333C7.2666 0.127778 7.61371 0 8.0026 0C8.4026 0 8.75549 0.127778 9.06127 0.383333C9.3666 0.638889 9.5526 0.961111 9.61927 1.35L9.78594 2.38333C9.83038 2.63889 9.77216 2.86111 9.61127 3.05C9.44994 3.23889 9.24705 3.33333 9.0026 3.33333H7.01927ZM7.2526 2.33333H8.76927L8.63594 1.51667C8.61371 1.36111 8.54149 1.236 8.41927 1.14133C8.29705 1.04711 8.15816 1 8.0026 1C7.84705 1 7.71083 1.04711 7.59394 1.14133C7.47749 1.236 7.40816 1.36111 7.38594 1.51667L7.2526 2.33333ZM2.28594 3.88333C2.07483 3.89444 1.88883 3.85267 1.72794 3.758C1.5666 3.66378 1.46372 3.51667 1.41927 3.31667C1.39705 3.22778 1.39149 3.14156 1.4026 3.058C1.41372 2.97489 1.43594 2.89444 1.46927 2.81667C1.46927 2.82778 1.46372 2.80556 1.4526 2.75C1.44149 2.72778 1.39705 2.61667 1.31927 2.41667C1.29705 2.29444 1.31105 2.18333 1.36127 2.08333C1.41105 1.98333 1.46927 1.89444 1.53594 1.81667C1.54705 1.81667 1.55816 1.80556 1.56927 1.78333C1.59149 1.60556 1.6666 1.45556 1.7946 1.33333C1.92216 1.21111 2.08038 1.15 2.26927 1.15C2.29149 1.15 2.38038 1.16667 2.53594 1.2H2.58594C2.63038 1.14444 2.69149 1.10556 2.76927 1.08333C2.84705 1.06111 2.92483 1.05 3.0026 1.05C3.11372 1.05 3.21105 1.06667 3.2946 1.1C3.37772 1.13333 3.44149 1.18333 3.48594 1.25C3.49705 1.25 3.50549 1.25267 3.51127 1.258L3.51927 1.26667C3.6526 1.27778 3.76927 1.31933 3.86927 1.39133C3.96927 1.46378 4.04705 1.56111 4.1026 1.68333C4.11372 1.75 4.11927 1.81111 4.11927 1.86667C4.11927 1.92222 4.10816 1.98333 4.08594 2.05L4.1026 2.1C4.16927 2.17778 4.21927 2.25267 4.2526 2.32467C4.28594 2.39711 4.3026 2.47778 4.3026 2.56667C4.3026 2.6 4.27483 2.7 4.21927 2.86667V2.93333C4.23038 2.94444 4.24149 3.02222 4.2526 3.16667C4.2526 3.36667 4.16927 3.536 4.0026 3.67467C3.83594 3.81378 3.63594 3.88333 3.4026 3.88333H2.28594ZM13.1859 3.91667C12.8637 3.91667 12.5915 3.80556 12.3693 3.58333C12.147 3.36111 12.0359 3.09444 12.0359 2.78333C12.0359 2.66111 12.0526 2.55289 12.0859 2.45867C12.1193 2.364 12.1637 2.26667 12.2193 2.16667L11.8193 1.81667C11.7193 1.73889 11.7026 1.64444 11.7693 1.53333C11.8359 1.42222 11.9248 1.36667 12.0359 1.36667H13.1693C13.4915 1.36667 13.7637 1.47778 13.9859 1.7C14.2082 1.92222 14.3193 2.18889 14.3193 2.5V2.78333C14.3193 3.09444 14.2082 3.36111 13.9859 3.58333C13.7637 3.80556 13.497 3.91667 13.1859 3.91667ZM0.335938 6.86667V6.05C0.335938 5.59445 0.569271 5.22778 1.03594 4.95C1.5026 4.67222 2.1026 4.53333 2.83594 4.53333C2.98038 4.53333 3.11371 4.536 3.23594 4.54133C3.35816 4.54711 3.47483 4.56111 3.58594 4.58333C3.46372 4.78333 3.36927 4.99444 3.3026 5.21667C3.23594 5.43889 3.2026 5.67222 3.2026 5.91667V6.86667H0.335938ZM4.33594 6.86667V5.95C4.33594 5.30556 4.67483 4.79178 5.3526 4.40867C6.03038 4.02511 6.91371 3.83333 8.0026 3.83333C9.1026 3.83333 9.98883 4.02511 10.6613 4.40867C11.3333 4.79178 11.6693 5.30556 11.6693 5.95V6.86667H4.33594ZM13.1693 4.53333C13.9137 4.53333 14.5164 4.67222 14.9773 4.95C15.4386 5.22778 15.6693 5.59445 15.6693 6.05V6.86667H12.8026V5.91667C12.8026 5.67222 12.7719 5.43889 12.7106 5.21667C12.6497 4.99444 12.5582 4.78333 12.4359 4.58333C12.5582 4.56111 12.6804 4.54711 12.8026 4.54133C12.9248 4.536 13.047 4.53333 13.1693 4.53333ZM8.0026 4.83333C7.31371 4.83333 6.71927 4.92489 6.21927 5.108C5.71927 5.29156 5.44149 5.51667 5.38594 5.78333V5.86667H10.6359V5.78333C10.5693 5.51667 10.2888 5.29156 9.7946 5.108C9.29994 4.92489 8.7026 4.83333 8.0026 4.83333Z"
                                  fill="#404041"
                                />
                              </svg>
                            ) : (
                              <div className="">
                                {item.display_name?.slice(0, 1).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="ml-3 text-primary-200 text-base">
                            {item.display_name}
                          </div>
                        </div>
                      )
                  )}
                </div>
              ) : (
                <div className="text-left text-xl text-primary-100 mb-3 h-full flex flex-col justify-center items-center -ml-28">
                  <img src={search} className="" alt="" />
                  {t("NoResultsFound")}
                </div>
              ))}

            {type === "group" &&
              (groupList.length > 0 ? (
                <div className=" mt-3">
                  {groupList.map((item: any) => {
                    if (item.type === type) {
                      return (
                        <div
                          key={item.uuid}
                          id="searchResultItem"
                          {...{ email: item.email }}
                          className="flex flex-row h-fit ml-1 py-2 px-3 cursor-pointer hover:bg-[#0000001f]"
                          onClick={() => handleClick(item)}
                        >
                          <div
                            className={`w-[28px] h-[28px] flex justify-center items-center shrink-0 rounded-bl-none rounded-[50%] text-[15px] border-[2px] border-[#E9EBF8] text-primary-200 bg-primary-100 overflow-hidden`}
                          >
                            {item.profile_picture ? (
                              <img
                                className="w-full h-full  object-cover "
                                src={item.profile_picture}
                                alt=""
                              />
                            ) : item.type === "group" ? (
                              <svg
                                className=""
                                width="18"
                                height="12"
                                viewBox="0 0 16 7"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M7.01927 3.33333C6.77483 3.33333 6.57216 3.23889 6.41127 3.05C6.24994 2.86111 6.19149 2.63889 6.23594 2.38333L6.4026 1.35C6.46927 0.961111 6.65549 0.638889 6.96127 0.383333C7.2666 0.127778 7.61371 0 8.0026 0C8.4026 0 8.75549 0.127778 9.06127 0.383333C9.3666 0.638889 9.5526 0.961111 9.61927 1.35L9.78594 2.38333C9.83038 2.63889 9.77216 2.86111 9.61127 3.05C9.44994 3.23889 9.24705 3.33333 9.0026 3.33333H7.01927ZM7.2526 2.33333H8.76927L8.63594 1.51667C8.61371 1.36111 8.54149 1.236 8.41927 1.14133C8.29705 1.04711 8.15816 1 8.0026 1C7.84705 1 7.71083 1.04711 7.59394 1.14133C7.47749 1.236 7.40816 1.36111 7.38594 1.51667L7.2526 2.33333ZM2.28594 3.88333C2.07483 3.89444 1.88883 3.85267 1.72794 3.758C1.5666 3.66378 1.46372 3.51667 1.41927 3.31667C1.39705 3.22778 1.39149 3.14156 1.4026 3.058C1.41372 2.97489 1.43594 2.89444 1.46927 2.81667C1.46927 2.82778 1.46372 2.80556 1.4526 2.75C1.44149 2.72778 1.39705 2.61667 1.31927 2.41667C1.29705 2.29444 1.31105 2.18333 1.36127 2.08333C1.41105 1.98333 1.46927 1.89444 1.53594 1.81667C1.54705 1.81667 1.55816 1.80556 1.56927 1.78333C1.59149 1.60556 1.6666 1.45556 1.7946 1.33333C1.92216 1.21111 2.08038 1.15 2.26927 1.15C2.29149 1.15 2.38038 1.16667 2.53594 1.2H2.58594C2.63038 1.14444 2.69149 1.10556 2.76927 1.08333C2.84705 1.06111 2.92483 1.05 3.0026 1.05C3.11372 1.05 3.21105 1.06667 3.2946 1.1C3.37772 1.13333 3.44149 1.18333 3.48594 1.25C3.49705 1.25 3.50549 1.25267 3.51127 1.258L3.51927 1.26667C3.6526 1.27778 3.76927 1.31933 3.86927 1.39133C3.96927 1.46378 4.04705 1.56111 4.1026 1.68333C4.11372 1.75 4.11927 1.81111 4.11927 1.86667C4.11927 1.92222 4.10816 1.98333 4.08594 2.05L4.1026 2.1C4.16927 2.17778 4.21927 2.25267 4.2526 2.32467C4.28594 2.39711 4.3026 2.47778 4.3026 2.56667C4.3026 2.6 4.27483 2.7 4.21927 2.86667V2.93333C4.23038 2.94444 4.24149 3.02222 4.2526 3.16667C4.2526 3.36667 4.16927 3.536 4.0026 3.67467C3.83594 3.81378 3.63594 3.88333 3.4026 3.88333H2.28594ZM13.1859 3.91667C12.8637 3.91667 12.5915 3.80556 12.3693 3.58333C12.147 3.36111 12.0359 3.09444 12.0359 2.78333C12.0359 2.66111 12.0526 2.55289 12.0859 2.45867C12.1193 2.364 12.1637 2.26667 12.2193 2.16667L11.8193 1.81667C11.7193 1.73889 11.7026 1.64444 11.7693 1.53333C11.8359 1.42222 11.9248 1.36667 12.0359 1.36667H13.1693C13.4915 1.36667 13.7637 1.47778 13.9859 1.7C14.2082 1.92222 14.3193 2.18889 14.3193 2.5V2.78333C14.3193 3.09444 14.2082 3.36111 13.9859 3.58333C13.7637 3.80556 13.497 3.91667 13.1859 3.91667ZM0.335938 6.86667V6.05C0.335938 5.59445 0.569271 5.22778 1.03594 4.95C1.5026 4.67222 2.1026 4.53333 2.83594 4.53333C2.98038 4.53333 3.11371 4.536 3.23594 4.54133C3.35816 4.54711 3.47483 4.56111 3.58594 4.58333C3.46372 4.78333 3.36927 4.99444 3.3026 5.21667C3.23594 5.43889 3.2026 5.67222 3.2026 5.91667V6.86667H0.335938ZM4.33594 6.86667V5.95C4.33594 5.30556 4.67483 4.79178 5.3526 4.40867C6.03038 4.02511 6.91371 3.83333 8.0026 3.83333C9.1026 3.83333 9.98883 4.02511 10.6613 4.40867C11.3333 4.79178 11.6693 5.30556 11.6693 5.95V6.86667H4.33594ZM13.1693 4.53333C13.9137 4.53333 14.5164 4.67222 14.9773 4.95C15.4386 5.22778 15.6693 5.59445 15.6693 6.05V6.86667H12.8026V5.91667C12.8026 5.67222 12.7719 5.43889 12.7106 5.21667C12.6497 4.99444 12.5582 4.78333 12.4359 4.58333C12.5582 4.56111 12.6804 4.54711 12.8026 4.54133C12.9248 4.536 13.047 4.53333 13.1693 4.53333ZM8.0026 4.83333C7.31371 4.83333 6.71927 4.92489 6.21927 5.108C5.71927 5.29156 5.44149 5.51667 5.38594 5.78333V5.86667H10.6359V5.78333C10.5693 5.51667 10.2888 5.29156 9.7946 5.108C9.29994 4.92489 8.7026 4.83333 8.0026 4.83333Z"
                                  fill="#404041"
                                />
                              </svg>
                            ) : (
                              <div className="">
                                {item.name?.slice(0, 1).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="ml-3 text-primary-200 text-base">
                            {item.name}
                          </div>
                          {/* {item.status === "archive" && (
                              <div className="ml-2 text-[#9f9d9d] text-base">
                                (archived)
                              </div>
                            )} */}
                        </div>
                      )
                    }
                  })}
                </div>
              ) : (
                <div className="text-left text-xl text-primary-100 mb-3 h-full flex flex-col justify-center items-center -ml-28">
                  <img src={search} className="" alt="" />
                  {t("NoResultsFound")}
                </div>
              ))}
          </>
        ) : (
          <div className="w-full h-full flex justify-center items-center">
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
        )}
      </div>
    </div>
  )
}

export default SearchResultPage
