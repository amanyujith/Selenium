import copy from "copy-to-clipboard"
import React, { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import useFocus from "../Chat/hooks/useFocus"
import { actionCreators } from "../../../../../store"
import { t } from "i18next"
import Notification from "../Notification/Notification"
import { detect } from "detect-browser"
import Tooltip from "../../../../../atom/ToolTip/Tooltip"
import { getURL } from "../../../../../utils/linkManipulation"
import { motion } from "framer-motion"

const _ = require("lodash")

const MeetingModal = (props: any) => {
  const { setMeetingModal, data, setModal } = props
  const browser = detect()
  const [maskedPassword, setMaskedPassword] = useState(true)
  const [inviteData, setInviteData] = useState<any>([])
  const [invite, setInvite] = useState(false)
  const [dropdown, setDropdown] = useState(false)
  const meetingSessions = useSelector((state: any) => state.Main.meetingSession)
  const messengerslist = useSelector((state: any) => state.Chat.userData)
  //const members = useSelector((state: any) => state.Chat.grpMembers);
  const chatInstance = useSelector((state: any) => state.Chat.chatInstance)
  const [inputRef, setInputFocus] = useFocus()
  const [discription, setDiscription] = useState("")
  const [membersList, setMemebersList] = useState([])
  const [groupMembers, setGroupMembers] = useState<any>([])
  const meetingSession = useSelector((state: any) => state.Main.meetingSession)
  const [searchText, setSearchText] = useState<string>("")
  const [inviteMsg, setInviteMsg]: any = useState("")
  const [loader, setLoader] = useState(false)
  const [clipboardState, setClipboardState] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const profileColors = ["#557BBB", "#B78931", "#91785B"]

  const dispatch = useDispatch()

  const closeDropDown = (e: any) => {
    e.stopPropagation()
    setDropdown(false)
  }

  const updateMemberList = (messengerslist: any) => {
    let newMemberList = messengerslist.filter((el: any) =>
      groupMembers.every((f: any) => f.uuid !== el.uuid && el.type === "user")
    )
    return newMemberList
  }

  useEffect(() => {
    // const updatedList = updateMemberList();
    //setMemebersList(updatedList);
    handleDebounceFn(searchText)
  }, [groupMembers])

  const addMember = (item: any) => {
    if (!groupMembers.some((e: any) => e.uuid === item.uuid)) {
      setGroupMembers([...groupMembers, item])
      setSearchText("")
      setInputFocus()
    }
  }

  const removeMember = (item: any) => {
    let arr = groupMembers.filter((el: any) => el.uuid !== item.uuid)
    setGroupMembers(arr)
    setInputFocus()
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
    debounceFn(e.target.value)
  }

  const setMember = (e: any, item: any) => {
    e.stopPropagation()
    addMember(item)
  }

  const handleDebounceFn = (searchText: string) => {
    //const updatedList = updateMemberList();
    chatInstance?.tenantSearch(searchText, {email:"email"}).then((res: any) => {
      const updatedList = updateMemberList(
        res.filter((node: any) => node.type === "user")
      )
      // setUserList(res)
      // let arr = updatedList.filter((item: any) =>
      //   item.firstname.toLowerCase().includes(searchText.toLowerCase())
      // );
      setMemebersList(updatedList)
    })
  }

  const debounceFn = useCallback(_.debounce(handleDebounceFn, 500), [
    membersList,
  ])

  useEffect(() => {
    getData(data.meeting_uuid)
  }, [])

  const getData = (meeting_uuid: any) => {
    setLoader(true)
    meetingSessions.meetingInvite(meeting_uuid).then((res: any) => {
      setInviteData(res)
      setLoader(false)
    })
  }

  const formatEventTime = (start: any, end: any) => {
    const startDate = new Date(start * 1000)
    const endDate = new Date(end * 1000)

    const options: any = {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }

    const formattedStart = startDate.toLocaleString("en-US", options)
    const formattedEnd = endDate.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })

    return `${formattedStart} - ${formattedEnd}`
  }

  const generateUUID = () =>
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) =>
      ((Math.random() * 16) | 0).toString(16)
    )

  const handleKeyPress = (event: any) => {
    /* eslint-disable */
    const regEx =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!regEx.test(searchText)) {
      setEmailError(true)
    } else {
      if (emailError) setEmailError(false)
    }
    if (searchText !== "" && !emailError) {
      if (event.key === "Enter") {
        let temp = {
          email: searchText,
          display_name: searchText,
          profile_picture: null,
          uuid: generateUUID(),
        }
        addMember(temp)
      }
    }
  }

  const inviteToMeeting = async () => {
    if (groupMembers.length !== 0) {
      const emails = groupMembers.map((obj: any) => obj.email)
      await meetingSession
        .sendCalendarScheduleMeeting(data.uuid, emails, discription)
        .then((res: any) => {
          setInviteMsg(t("Dashboard.EmailSentSuccsessfully"))
          dispatch(
            actionCreators.setNotification({
              content: "Invitation send successfully",
              type: "success",
            })
          )
        })
        .catch((e: any) => {
          setInviteMsg(t("OopsSomethingWentWrong"))
          dispatch(
            actionCreators.setNotification({
              content: "Oops, Something Went Wrong",
              type: "error",
            })
          )
        })
      setDiscription("")
      setMeetingModal(false)
    }
  }

  const startMeet = (link: any) => {
    const newUrl = getURL(link)
    const result = newUrl.replace("/launch-meetings/?iuasdf", "/app/?rtdf")

    const newWindow = window.open(result, "_blank")
    if (
      browser?.name === "safari" &&
      (!newWindow || newWindow.closed || typeof newWindow.closed == "undefined")
    ) {
      setModal(true)
    }
  }

  return (
    <div>
      <div
        id="invitemodal"
        onClick={(e) => closeDropDown(e)}
        className="bg-[#00000033] bg-opacity-100  backdrop-blur fixed inset-0 z-50"
      >
        <div className="flex items-center place-content-center w-full h-full justify-center overflow-y-auto overflow-x-hidden">
          <motion.div
            key="invitemodal"
            initial={{ opacity: 0, translateY: "60px" }}
            animate={{
              opacity: 1,
              translateY: "0px",
              transition: { duration: 0.4 },
            }}
            className="flex flex-col relative w-[510px] min-h-[400px] bg-[white] p-[24px] rounded-[15px] shadow-[4px_4px_12px_0px_rgba(0,0,0,0.10)] "
          >
            {loader ? (
              <div
                className={`min-h-[300px] text-[#767676] text-xl flex flex-col justify-center items-center `}
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
            ) : (
              <div>
                <div className="  flex justify-between">
                  <span className="flex">
                    <div className="pt-[2px] text-[16px] font-bold text-[#404041]">
                      Invite Meeting
                    </div>
                  </span>
                  <span
                    id="closeModal"
                    onClick={() => setMeetingModal(false)}
                    className="cursor-pointer p-1"
                  >
                    <svg
                      width="19"
                      height="19"
                      viewBox="0 0 19 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14.5187 5.59653C14.8271 5.28819 14.8271 4.7896 14.5187 4.48454C14.2104 4.17948 13.7118 4.17619 13.4067 4.48454L9.50328 8.388L5.59653 4.48126C5.28819 4.17291 4.7896 4.17291 4.48454 4.48126C4.17948 4.7896 4.17619 5.28819 4.48454 5.59325L8.388 9.49672L4.48126 13.4035C4.17291 13.7118 4.17291 14.2104 4.48126 14.5155C4.7896 14.8205 5.28819 14.8238 5.59325 14.5155L9.49672 10.612L13.4035 14.5187C13.7118 14.8271 14.2104 14.8271 14.5155 14.5187C14.8205 14.2104 14.8238 13.7118 14.5155 13.4067L10.612 9.50328L14.5187 5.59653Z"
                        fill="#5C6779"
                      />
                    </svg>
                  </span>
                </div>
                <div className="">
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="w-full border-[1px] border-[#0000001f] mt-3 bg-[#ffffff14] focus:border-[#C4C4C4] focus:outline-none rounded-[10px] px-[6px] py-2 h-fit min-h-[20px]"
                  >
                    <div className="flex flex-row flex-wrap h-fit w-full max-h-[150px] overflow-y-auto overflow-x-hidden">
                      {groupMembers.map((item: any) => {
                        let colorIndex =
                          (item?.uuid.match(/\d/g).join("") +
                            new Date().getDate()) %
                          profileColors.length;
                        return (
                          <div className="h-[23px] w-fit  border-[1px] text-primary-200 m-1 flex items-center flex-row rounded-[50px] px-2 border-[#C4C4C4] bg-[#ECECEC]">
                            <div
                              style={{
                                backgroundColor: profileColors[colorIndex],
                              }}
                              className={` w-[19px] h-[19px] text-center shrink-0 rounded-[50px] text-[12px] text-[#FFFFFF] font-semibold overflow-hidden`}
                            >
                              {item.profile_picture ? (
                                <img
                                  className="w-full h-full  object-cover"
                                  src={item.profile_picture}
                                  alt=""
                                />
                              ) : (
                                <div className="capitalize">
                                  {item.display_name?.slice(0, 1)}
                                </div>
                              )}
                            </div>
                            <div className="text-sm ml-2 text-[#5C6779]">
                              {item.display_name}
                            </div>
                            <div
                              className="ml-3 mt-[2px] cursor-pointer"
                              id="removeMember"
                              onClick={() => {
                                removeMember(item);
                              }}
                            >
                              <svg
                                width="9"
                                height="9"
                                viewBox="0 0 9 9"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M1.22969 8.37943L0.617188 7.76693L3.88385 4.50026L0.617188 1.23359L1.22969 0.621094L4.49635 3.88776L7.76302 0.621094L8.37552 1.23359L5.10885 4.50026L8.37552 7.76693L7.76302 8.37943L4.49635 5.11276L1.22969 8.37943Z"
                                  fill="#A7A9AB"
                                />
                              </svg>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex flex-row content-center">
                      <input
                        id="CreateGroupSearch"
                        className="text-[#5C6779] px-1 border-0 focus:border-0 focus:outline-none w-full"
                        placeholder={"Search People"}
                        type="text"
                        name="CreateGroupSearch"
                        ref={inputRef}
                        value={searchText}
                        onClick={() => {
                          setDropdown(!dropdown);
                        }}
                        onChange={handleSearch}
                        onKeyDown={(event: any) => handleKeyPress(event)}
                      />
                    </div>
                    <div className="absolute right-0 -mt-[30px] mr-8">
                      <div
                        id="inviteToMeeting"
                        onClick={inviteToMeeting}
                        className={` ${
                          groupMembers.length === 0
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        } h-[36px] rounded-[8px] font-bold bg-[#E57600] hover:bg-[#CC6900] text-[#FFFFFF] border-[1px] border-[#B1B1B1] p-4 flex items-center`}
                      >
                        Invite
                      </div>
                    </div>
                  </div>
                </div>
                {dropdown && (
                  <div className=" bottom-auto absolute z-50 w-[441px] ml-2  max-h-[125px]  shadow-[0_4px_10px_0px_rgba(0,0,0,0.1)] bg-[#FFFFFF] overflow-y-scroll overflow-x-hidden rounded-[4px]">
                    {membersList &&
                      membersList.map((item: any) => {
                        let colorIndex =
                          (item?.uuid.match(/\d/g).join("") +
                            new Date().getDate()) %
                          profileColors.length;
                        return (
                          <div
                            className={
                              "pl-6 flex flex-row w-full z-50 h-[36px]"
                            }
                          >
                            <button
                              id="addMemberInvite"
                              onClick={(e: any) => setMember(e, item)}
                              className={`flex items-center w-full text-sm rounded-[3px]`}
                            >
                              <div
                                style={{
                                  backgroundColor: profileColors[colorIndex],
                                }}
                                className={`w-[22px] h-[22px] shrink-0 rounded-bl-none flex justify-center items-center rounded-[44%] border-[2px] border-[#E9EBF8] text-[12px] text-[white] overflow-hidden`}
                              >
                                {item.profile_picture ? (
                                  <img
                                    className="w-full h-full"
                                    src={item.profile_picture}
                                    alt=""
                                  />
                                ) : (
                                  <div className="capitalize">
                                    {item.display_name?.slice(0, 1)}
                                  </div>
                                )}
                              </div>
                              <div
                                className={`ml-[12px] flex flex-row w-full text-[16px] text-[#6d6e70]`}
                              >
                                <div className={`w-4/5 flex justify-start`}>
                                  {item.email}
                                </div>
                              </div>
                            </button>
                          </div>
                        );
                      })}
                  </div>
                )}
                <textarea
                  value={discription}
                  onChange={(e) => setDiscription(e.target.value)}
                  placeholder={"Send an optional message..."}
                  name={"Description"}
                  className=" w-full border-[1px] border-[#0000001f] focus:border-[#C4C4C4] focus:outline-none rounded-[7px] mt-4 mb-3 h-[88px] overflow-x-hidden overflow-y-auto p-3 text-primary-200"
                />
                <div className="text-[24px] text-[#293241] font-normal mt-4 capitalize">
                  {data.name}
                </div>
                <div className="text-[16px] text-[#404041] mt-4">
                  {formatEventTime(data.start_date_time, data.end_date_time)}
                </div>
                <div className="flex flex-row text-[14px] text-[#5C6779] gap-5 mt-6">
                  <div>Meeting url</div>
                  <div
                    id="meetingUrl"
                    onClick={() => startMeet(inviteData.meeting_url)}
                    className="text-[#1C64D8] w-[258px] cursor-pointer"
                  >
                    {inviteData.meeting_url}
                  </div>
                  <Tooltip
                    content={clipboardState === false ? "Copy" : "Copied"}
                    direction="top"
                    onclick={true}
                  >
                    <div
                      id="copyMeetingUrl"
                      onClick={() => {
                        copy(inviteData.meeting_url);
                        setClipboardState(inviteData.meeting_url);
                        setTimeout(() => {
                          setClipboardState(false);
                        }, 3000);
                      }}
                      className="cursor-pointer "
                    >
                      <svg
                        width="19"
                        height="19"
                        viewBox="0 0 19 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14.5 12.5H9.5C8.94688 12.5 8.5 12.0531 8.5 11.5V3.5C8.5 2.94687 8.94688 2.5 9.5 2.5H12.8781C13.0094 2.5 13.1375 2.55313 13.2312 2.64688L15.3531 4.76875C15.4469 4.8625 15.5 4.99063 15.5 5.12188V11.5C15.5 12.0531 15.0531 12.5 14.5 12.5ZM16.0594 4.05938L13.9406 1.94063C13.6594 1.65938 13.2781 1.5 12.8813 1.5H9.5C8.39687 1.5 7.5 2.39688 7.5 3.5V11.5C7.5 12.6031 8.39687 13.5 9.5 13.5H14.5C15.6031 13.5 16.5 12.6031 16.5 11.5V5.12188C16.5 4.725 16.3406 4.34375 16.0594 4.0625V4.05938ZM4.5 5.5C3.39688 5.5 2.5 6.39687 2.5 7.5V15.5C2.5 16.6031 3.39688 17.5 4.5 17.5H9.5C10.6031 17.5 11.5 16.6031 11.5 15.5V14.5H10.5V15.5C10.5 16.0531 10.0531 16.5 9.5 16.5H4.5C3.94687 16.5 3.5 16.0531 3.5 15.5V7.5C3.5 6.94688 3.94687 6.5 4.5 6.5H6.5V5.5H4.5Z"
                          fill="#5C6779"
                        />
                      </svg>
                    </div>
                  </Tooltip>
                </div>
                <div className="flex flex-row text-[14px] text-[#5C6779] gap-5 mt-3">
                  <div>Meeting ID</div>
                  <div className="">{inviteData.meeting_id}</div>
                </div>
                <div className="flex flex-row text-[14px] text-[#5C6779] gap-5 mt-3 items-center">
                  <div>Password</div>
                  <div
                    className={`${
                      maskedPassword ? "tracking-[4.5px]" : "text-xs"
                    } ml-[9px] tracking-widest`}
                  >
                    {!maskedPassword
                      ? inviteData.password
                      : "*".repeat(inviteData?.password?.length)}
                  </div>
                  <div
                    id="togglePassword"
                    onClick={() => setMaskedPassword(!maskedPassword)}
                    className="cursor-pointer"
                  >
                    {!maskedPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="15"
                        width="15"
                        viewBox="0 0 640 512"
                      >
                        <path d="M25.9 3.4C19-2 8.9-.8 3.4 6.1S-.8 23.1 6.1 28.6l608 480c6.9 5.5 17 4.3 22.5-2.6s4.3-17-2.6-22.5L25.9 3.4zM605.5 268.3c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-51.2 0-96 14.8-133.9 36.8l27.3 21.5C244.6 74.2 280.2 64 320 64c70.4 0 127.7 32 170.8 72c43.1 40 71.9 88 85.2 120c-9.2 22.1-25.9 52-49.5 81.5l25.1 19.8c25.6-32 43.7-64.4 53.9-89zM88.4 154.7c-25.6 32-43.7 64.4-53.9 89c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c51.2 0 96-14.8 133.9-36.8l-27.3-21.5C395.4 437.8 359.8 448 320 448c-70.4 0-127.7-32-170.8-72C106.1 336 77.3 288 64 256c9.2-22.1 25.9-52 49.5-81.5L88.4 154.7zM320 384c16.7 0 32.7-3.2 47.4-9.1l-30.9-24.4c-5.4 .9-10.9 1.4-16.5 1.4c-51 0-92.8-39.8-95.8-90.1l-30.9-24.4c-.9 6-1.3 12.2-1.3 18.5c0 70.7 57.3 128 128 128zM448 256c0-70.7-57.3-128-128-128c-16.7 0-32.7 3.2-47.4 9.1l30.9 24.4c5.4-.9 10.9-1.4 16.5-1.4c51 0 92.8 39.8 95.8 90.1l30.9 24.4c.9-6 1.3-12.2 1.3-18.5z" />
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.99912 3.0625C5.57893 3.0625 4.44173 3.70932 3.61387 4.47917C2.79128 5.242 2.24114 6.15598 1.981 6.78347C1.923 6.92232 1.923 7.077 1.981 7.21585C2.24114 7.84334 2.79128 8.75732 3.61387 9.52014C4.44173 10.29 5.57893 10.9368 6.99912 10.9368C8.41931 10.9368 9.55652 10.29 10.3844 9.52014C11.207 8.75556 11.7571 7.84334 12.019 7.21585C12.077 7.077 12.077 6.92232 12.019 6.78347C11.7571 6.15598 11.207 5.242 10.3844 4.47917C9.55652 3.70932 8.41931 3.0625 6.99912 3.0625ZM4.46809 6.99966C4.46809 6.32839 4.73475 5.68461 5.20941 5.20995C5.68407 4.73529 6.32785 4.46863 6.99912 4.46863C7.67039 4.46863 8.31417 4.73529 8.78883 5.20995C9.26349 5.68461 9.53015 6.32839 9.53015 6.99966C9.53015 7.67093 9.26349 8.31471 8.78883 8.78937C8.31417 9.26403 7.67039 9.53069 6.99912 9.53069C6.32785 9.53069 5.68407 9.26403 5.20941 8.78937C4.73475 8.31471 4.46809 7.67093 4.46809 6.99966ZM6.99912 5.87476C6.99912 6.49521 6.49467 6.99966 5.87422 6.99966C5.74943 6.99966 5.6299 6.97857 5.51741 6.94166C5.42074 6.91002 5.30825 6.96978 5.31177 7.07172C5.31704 7.193 5.33462 7.31428 5.36801 7.43556C5.60881 8.33548 6.5351 8.86981 7.43502 8.62901C8.33494 8.38821 8.86927 7.46192 8.62847 6.562C8.43337 5.83257 7.78831 5.34219 7.07119 5.3123C6.96924 5.30879 6.90948 5.41952 6.94112 5.51795C6.97803 5.63044 6.99912 5.74996 6.99912 5.87476Z"
                          fill="#5C6779"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default MeetingModal
