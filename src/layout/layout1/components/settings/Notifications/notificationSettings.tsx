import React, { useCallback, useEffect, useState } from "react"
import RadioButton from "../../../../../atom/RadioButtons/radioButtons"
import DropDown from "../../../../../atom/DropDown/dropDown"
import CheckBox from "../../../../../atom/CheckBox/checkBox"
import { useDispatch, useSelector } from "react-redux"
import MenuNodeList from "../../dashboard/Chat/menuNodeList"
import { actionCreators } from "../../../../../store"
import { t } from "i18next"
import TimePicker from "rc-time-picker"
import moment from "moment"
import SearchDropDown from "../../dashboard/Chat/SearchDropDown"
import CustomDropdown from "../../../../../atom/DropDown/customDropdown"
import { notificationMode, notificationPopup } from "../utils/json"
import { playSound } from "../utils/functions"
import NotificationSounds from "./notificationSounds"
import NotificationTarget from "./notificationTarget"
const _ = require("lodash")

export interface chatSettingsProps {
  uuid: string
  type?: "all" | "direct" | "dnd"
  target?: Array<string>
  from_time?: {
    hour: number
    minutes: number
  }
  to_time?: {
    hour: number
    minutes: number
  }
  preview_msg?: boolean
  mute?: boolean
  exclude_flag: boolean
  incoming_chat_notftn_sound?: string
  outgoing_chat_notftn_sound?: string
  group_chat_notftn_sound?: string
  incoming_call_notftn_sound?: string
  outgoing_call_notftn_sound?: string
  reaction?: string
  meeting_incoming_chat_notftn_sound?: string
  meeting_outgoing_chat_notftn_sound?: string
  meeting_raise_hand_notftn_sound?: string
  meeting_reaction_notftn_sound?: string
  notification_popup_sound?: string
  pbx_call_notification?: string | null
}
const NotificationSettings = () => {
  const settings = useSelector((state: any) => state.Main.soundAndNotification)
  const chatInstance = useSelector((state: any) => state.Chat.chatInstance)
  const loggedInUserInfo = useSelector(
    (state: any) => state.Main.loggedInUserInfo
  )
  const [timeBox1, setTimeBox1] = useState(false)
  const [timeBox2, setTimeBox2] = useState(false)
  const dispatch = useDispatch()
  const [Groups, setGroups] = useState<any>([])
  const [targetUsers, setTargetUsers] = useState<any>([])
  const [groupsAndUsers, setGroupsAndUsers] = useState([])
  const [searchList, setSearchList] = useState([])
  const [open, setOpen] = useState({ from: false, to: false })
  const [time, setTime] = useState<any>({
    fromTime: moment(settings[0]?.from_time?.value),
    toTime: moment(settings[0]?.to_time?.value),
  })
  const notification_mode = notificationMode(settings)

  useEffect(() => {
    setTime({
      fromTime: moment(settings[0]?.from_time?.value),
      toTime: moment(settings[0]?.to_time?.value),
    })
  }, [settings[0]?.to_time?.value, settings[0]?.from_time?.value])
  const [searchbox, setSearchBox] = useState("")
  const [searchTextUser, setSearchTextUser] = useState<string>("")
  const [searchTextGroup, setSearchTextGroup] = useState<string>("")
  const [chatSettings, setChatSettings] = useState<chatSettingsProps[]>([
    {
      uuid: "",
      type: "all",
      target: [],
      from_time: {
        hour: 0,
        minutes: 0,
      },
      to_time: {
        hour: 0,
        minutes: 0,
      },
      preview_msg: false,
      exclude_flag: false,
      mute: false,
      incoming_chat_notftn_sound: "",
      outgoing_chat_notftn_sound: "",
      group_chat_notftn_sound: "",
      incoming_call_notftn_sound: "",
      outgoing_call_notftn_sound: "",
      reaction: "",
      meeting_incoming_chat_notftn_sound: "",
      meeting_outgoing_chat_notftn_sound: "",
      meeting_raise_hand_notftn_sound: "",
      meeting_reaction_notftn_sound: "",
      notification_popup_sound: "",
      pbx_call_notification: "",
    },
  ])

  useEffect(() => {
    setChatSettings(settings)
    chatInstance?.grafanaLogger(["Client : Current Chat Settings"])
  }, [settings])

  const updateSettings = (args: any) => {
    chatInstance
      ?.updateChatSettings(chatSettings[0]?.uuid, args)
      .then((res: any) => {
        chatInstance
          .getChatSettings(loggedInUserInfo?.sub)
          .then((data: chatSettingsProps[]) => {
            dispatch(actionCreators.soundAndNotification(data))

            // const selectedGroups = groupsList.filter((item: any) => {
            //  return data[0].target?.includes(item.uuid)
            // })
            //
            // setGroups(selectedGroups)
          })
      })
  }

  const removeSettings = (args: any) => {
    const updatedData = settings[0].target
      .filter((node: any) => {
        return node.uuid != args
      })
      .map((data: any) => data.uuid)
    chatInstance
      ?.updateChatSettings(chatSettings[0]?.uuid, {
        target: updatedData.reverse(),
      })
      .then((res: any) => {
        chatInstance
          ?.getChatSettings(loggedInUserInfo?.sub)
          .then((data: chatSettingsProps[]) => {
            dispatch(actionCreators.soundAndNotification(data))
            // const selectedGroups = groupsList.filter((item: any) => {
            //  return data[0].target?.includes(item.uuid)
            // })
            //
            // setGroups(selectedGroups)
          })
      })
  }
  const handleTime = (value: any, type: any) => {
    let x: any = { ...time }
    x[type] = value

    setTime(x)
    const data = value._d.getHours()

    if (type === "toTime") {
      updateSettings({
        to_time: {
          hour: value._d.getHours(),
          minutes: value._d.getMinutes(),
          value: value._d,
        },
      })
    } else if (type === "fromTime") {
      updateSettings({
        from_time: {
          hour: value._d.getHours(),
          minutes: value._d.getMinutes(),
          value: value._d,
        },
      })
    }
  }

  const handlepopUpDropdown = (event: any, type: string) => {
    event.stopPropagation()
    setSearchBox(type)
  }

  const handleDebounceFn = (searchText: string, type: string) => {
    const selectedChat = settings[0]?.target.map((item: any) => {
      return item.uuid
    })
    if (type === "user")
      chatInstance?.getTenantUsers(searchText.trim()).then((res: any) => {
        const result = res.filter((res: any) => {
          return !selectedChat.includes(res.uuid)
        })
        setSearchList(result)
      })
    else if (type === "group")
      chatInstance?.GroupSearchData(searchText.trim()).then((res: any) => {
        const result = res.filter((res: any) => {
          return !selectedChat.includes(res.uuid)
        })
        setSearchList(result)
      })
  }
  const handleSearch = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    if (type === "user") setSearchTextUser(e.target.value)
    else if (type === "group") setSearchTextGroup(e.target.value)

    if (e.target.value !== "" && !searchbox) {
      setSearchBox(type)
    }
    debounceFn(e.target.value, type)
    // if (searchActiveChat === "") debounceFn(e.target.value)
  }
  const debounceFn = useCallback(_.debounce(handleDebounceFn, 400), [
    settings?.[0]?.target,
  ])

  useEffect(() => {
    chatInstance?.tenantSearch("").then((res: any) => {
      setGroupsAndUsers(res)
    })
  }, [])

  useEffect(() => {
    const selectedGroups = settings[0]?.target.filter((item: any) => {
      if (item.type === "group") {
        return item
      }
    })
    const selectedUsers = settings[0]?.target.filter((item: any) => {
      if (item._type === "users") {
        return item
      }
    })
    setTargetUsers(selectedUsers)
    setGroups(selectedGroups)
  }, [settings[0]?.target, groupsAndUsers])

  const handleScroll = () => {
    setOpen((open: any) => {
      return (
        (open?.from || open?.to) && {
          from: false,
          to: false,
        }
      )
    })
  }

  return (
    <div
      className="mt-[24px] pl-[12px]  h-[calc(100vh-316px)] min-h-[400px] w-[580px] overflow-y-scroll overflow-x-hidden"
      onClick={() => {
        setSearchBox("")
        setTimeBox1(false)
        setTimeBox2(false)
      }}
      onScroll={handleScroll}
    >
      <span className="text-[18px] text-primary-200 font-bold ">
        {t("Dashboard.General")}
      </span>
      <div className="h-[calc(100%-50px)]  px-[12px] w-full ">
        <div className="mt-4 ">
          <span className="text-[16px] font-semibold w-[180px] mr-[2rem] ">
            {t("Notifications.Notify")}
          </span>
          <div className="text-base mt-2">
            <RadioButton
              radioData={notification_mode}
              name={"notifyMe"}
              restClass={"mr-10 text-base p-1"}
              onChange={(e: any) => {
                updateSettings({ type: e.target.id })
              }}
            />
          </div>
        </div>

        {settings[0]?.type === "custom" && (
          <div>
            <div className="text-[12px] text-[#A7A9AB] ml-[30px] pt-[12px]">
              You can allow notifications from only a select few chats by
              selecting them in the below fields. In case you need to restrict
              notification from select few chats instead, check the{" "}
              <span className="font-bold">Exclude </span>
              field.
            </div>
            <div className="w-full">
              <div className="pl-[30px]">
                <CheckBox
                  checked={chatSettings[0]?.exclude_flag}
                  onChange={(e: any) => {
                    setChatSettings((prevState: any) => {
                      const updateState = [...prevState]
                      updateState[0].exclude_flag = e.target.checked
                      return updateState
                    })
                    updateSettings({ exclude_flag: e.target.checked })
                  }}
                  color={""}
                  label={t("Notifications.exclude")}
                  id={"previewMessage"}
                  restClass={"ml-[-10px] mt-[12px] text-[#404041] text-sm"}
                />
              </div>
              {/* <span className="text-base w-[180px] mr-[2rem]">
                {t("Notifications.enableNotification")}
              </span> */}
              <div className="flex flex-col w-full">
                <span className="mt-2.5 ml-4 text-sm leading-[19px] text-[#404041]">
                  {t("Notifications.Groups")}
                </span>
                <div
                  onClick={(e: any) => handlepopUpDropdown(e, "group")}
                  className="relative "
                >
                  <div className=" h-9 flex items-center mt-2 mb-3 ml-5 py-2.5 pl-3.5 border-[1px] bg-[#ffffff14] border-[#0000001f] border-solid rounded-[10px]">
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
                    <input
                      type="text"
                      placeholder={t("Search Group")}
                      className=" ml-4 outline-none bg-[#ffffff01] text-[#B1B1B1] w-full"
                      value={searchTextGroup}
                      // onClick={(event: any) => event.stopPropagation()}
                      //   onClick={(event: any) => {dispatch(actionCreators.setPopUp("searchDropDown"))
                      // }}
                      //onClick={(event: any) => handlePopUpData(event)}

                      onChange={(e) => handleSearch(e, "group")}
                      onFocus={() => setSearchList([])}
                      // onChange={(e: any) =>
                      //   handleSearch(e.target.value, e, "searchDropDown")
                      // }
                      autoFocus
                    />
                    {/* )} */}
                  </div>
                  {searchbox === "group" && searchTextGroup !== "" ? (
                    <SearchDropDown
                      notification={true}
                      searchText={searchTextGroup}
                      userList={searchList}
                      updateSettings={updateSettings}
                      // setCloseDropdown={closeSearch}
                      // setSearchResultPage={setSearchResultPage}
                      setSearchText={setSearchTextGroup}
                      setSearchBox={setSearchBox}
                      // closeSearch={closeSearch}
                    />
                  ) : null}
                </div>
              </div>
              <NotificationTarget
                target={settings[0]?.target?.filter((item: any) => {
                  if (item.isGroup) {
                    return item
                  }
                })}
                removeSettings={removeSettings}
              />
              {/* {settings[0]?.type == "dnd" && ( */}
              <div className="flex flex-col ">
                <span className="mt-2.5 ml-4 text-sm leading-[19px] text-[#404041]">
                  {t("Notifications.DirectMsg")}
                </span>
                <div
                  onClick={(e: any) => handlepopUpDropdown(e, "user")}
                  className="relative"
                >
                  <div className=" h-9 flex items-center mt-2 mb-3 ml-5 py-2.5 pl-3.5 border-[1px] bg-[#ffffff14] border-[#0000001f] border-solid rounded-[10px]">
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
                    <input
                      type="text"
                      placeholder={t("Search People")}
                      className=" ml-4 outline-none bg-[#ffffff01] text-[#B1B1B1]"
                      value={searchTextUser}
                      // onClick={(event: any) => event.stopPropagation()}
                      //   onClick={(event: any) => {dispatch(actionCreators.setPopUp("searchDropDown"))
                      // }}
                      //onClick={(event: any) => handlePopUpData(event)}
                      onChange={(e) => handleSearch(e, "user")}
                      onFocus={() => setSearchList([])}
                      // onChange={(e: any) =>
                      //   handleSearch(e.target.value, e, "searchDropDown")
                      // }
                      autoFocus
                    />
                    {/* )} */}
                  </div>
                  {searchbox === "user" && searchTextUser !== "" ? (
                    <SearchDropDown
                      notification={true}
                      searchText={searchTextUser}
                      userList={searchList}
                      updateSettings={updateSettings}
                      setSearchText={setSearchTextUser}
                      // setCloseDropdown={closeSearch}
                      // setSearchResultPage={setSearchResultPage}
                      setSearchBox={setSearchBox}
                      // closeSearch={closeSearch}
                    />
                  ) : null}
                </div>
              </div>
              <NotificationTarget
                target={settings[0]?.target.filter((item: any) => {
                  if (!item.isGroup && item.uuid) {
                    return item
                  }
                })}
                removeSettings={removeSettings}
              />
            </div>
          </div>
        )}
        <div className="text-[16px] font-semibold w-[180px] mt-[20px] mr-[2rem]">
          {t("Notifications.allowNotification")}
        </div>
        <div className="flex flex-col">
          <div className="flex flex-wrap relative">
            <span className="mt-2.5 text-sm leading-[19px] w-[230px] text-primary-200">
              {t("Notifications.from")}
            </span>
            <div className="absolute mt-12 ml-[181px] z-[100]"></div>
            <span className="mt-2.5 ml-10 text-sm leading-[19px] text-primary-200">
              {t("Notifications.to")}
            </span>
            <div className="absolute mt-12 ml-[399px] z-[100]"></div>
            <div className=" flex gap-9 mt-1 w-[500px]">
              <div
                onClick={(e: any) => e.stopPropagation()}
                className="flex flex-row w-full items-center mr-[-18px] rounded-[7px] border-[1px] border-[#B1B1B1] h-[45px] text-[16px] text-center text-[293241]"
              >
                <TimePicker
                  className="rc-time-picker-input mb-1"
                  value={moment(
                    new Date().setHours(
                      settings[0]?.from_time?.hour,
                      settings[0]?.from_time?.minutes
                    )
                  )}
                  onChange={(e: any) => handleTime(e, "fromTime")}
                  showSecond={false}
                  use12Hours
                  open={open?.from || timeBox1}
                  onOpen={() => setOpen({ from: true, to: false })}
                  onClose={() => setOpen({ from: false, to: false })}
                />
                <svg id="clock-1"
                  onClick={(e: any) => {
                    setTimeBox1(!timeBox1)
                    setTimeBox2(false)
                    e.stopPropagation()
                  }}
                  className="mr-3 cursor-pointer"
                  width="20"
                  height="20"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    d="M9 2.25C10.7902 2.25 12.5071 2.96116 13.773 4.22703C15.0388 5.4929 15.75 7.20979 15.75 9C15.75 10.7902 15.0388 12.5071 13.773 13.773C12.5071 15.0388 10.7902 15.75 9 15.75C7.20979 15.75 5.4929 15.0388 4.22703 13.773C2.96116 12.5071 2.25 10.7902 2.25 9C2.25 7.20979 2.96116 5.4929 4.22703 4.22703C5.4929 2.96116 7.20979 2.25 9 2.25ZM8.36719 5.41406V9C8.36719 9.21094 8.47266 9.40869 8.64932 9.52734L11.1806 11.2148C11.4706 11.41 11.8635 11.3309 12.0586 11.0382C12.2537 10.7455 12.1746 10.3553 11.8819 10.1602L9.63281 8.6625V5.41406C9.63281 5.06338 9.35068 4.78125 9 4.78125C8.64932 4.78125 8.36719 5.06338 8.36719 5.41406Z"
                    fill="#5C6779"
                  />
                </svg>
              </div>
              <div
                onClick={(e: any) => e.stopPropagation()}
                className="flex flex-row w-full items-center mr-[-18px] rounded-[7px] border-[1px] border-[#B1B1B1] h-[45px] text-[16px] text-center text-[293241]"
              >
                <TimePicker
                  className="rc-time-picker-input mb-1"
                  value={moment(
                    new Date().setHours(
                      settings[0]?.to_time?.hour,
                      settings[0]?.to_time?.minutes
                    )
                  )}
                  onChange={(e: any) => {
                    handleTime(e, "toTime")
                  }}
                  showSecond={false}
                  use12Hours
                  open={open?.to || timeBox2}
                  onOpen={() => setOpen({ from: false, to: true })}
                  onClose={() => setOpen({ from: false, to: false })}
                />
                <svg id="clock-2"
                  onClick={(e: any) => {
                    setTimeBox2(!timeBox2)
                    setTimeBox1(false)
                    e.stopPropagation()
                  }}
                  className="mr-3 cursor-pointer"
                  width="20"
                  height="20"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    d="M9 2.25C10.7902 2.25 12.5071 2.96116 13.773 4.22703C15.0388 5.4929 15.75 7.20979 15.75 9C15.75 10.7902 15.0388 12.5071 13.773 13.773C12.5071 15.0388 10.7902 15.75 9 15.75C7.20979 15.75 5.4929 15.0388 4.22703 13.773C2.96116 12.5071 2.25 10.7902 2.25 9C2.25 7.20979 2.96116 5.4929 4.22703 4.22703C5.4929 2.96116 7.20979 2.25 9 2.25ZM8.36719 5.41406V9C8.36719 9.21094 8.47266 9.40869 8.64932 9.52734L11.1806 11.2148C11.4706 11.41 11.8635 11.3309 12.0586 11.0382C12.2537 10.7455 12.1746 10.3553 11.8819 10.1602L9.63281 8.6625V5.41406C9.63281 5.06338 9.35068 4.78125 9 4.78125C8.64932 4.78125 8.36719 5.06338 8.36719 5.41406Z"
                    fill="#5C6779"
                  />
                </svg>
              </div>
            </div>
            {/* <DropDown restClass={" w-[9rem] h-[2rem] mt-0.5 ml-1"}>
                {""}
              </DropDown> */}
          </div>
          <span className="text-[18px] mt-[24px] font-bold ml-[-24px]">
            {t("Dashboard.NotificationPopup")}
          </span>
          {/* <span className="text-base font-semibold mr-[2rem] mt-3">
            {t("Dashboard.NotificationPopup")}
          </span> */}
          <CheckBox
            checked={chatSettings[0]?.preview_msg}
            onChange={(e: any) => {
              setChatSettings((prevState: any) => {
                const updateState = [...prevState]
                updateState[0].preview_msg = e.target.checked
                return updateState
              })
              updateSettings({ preview_msg: e.target.checked })
            }}
            color={""}
            label={t("Notifications.previewMsg")}
            id={"previewMessage"}
            restClass={"ml-[-10px] mt-3 text-[#404041] text-sm"}
          />
          <div className=" text-[12px] mt-3 mb-1 leading-[19px] text-[#293241]">
            When Notification Received
          </div>
          <CustomDropdown
            options={notificationPopup}
            rest={"h-[44px]"}
            value={
              settings[0]?.notification_mode
                ? notificationPopup.filter((option: any) => {
                    return option.value === settings[0]?.notification_mode
                  })?.[0]
                : notificationPopup[0]
            }
            onChange={(event: any) => {
              setChatSettings((prevState: any) => {
                const updateState = [...prevState]
                updateState[0].notification_mode = event
                return updateState
              })
              updateSettings({ notification_mode: event })
            }}
          />
          <span className="text-[18px] mt-[24px] font-bold ml-[-24px]">
            {t("Dashboard.NotificationSound")}
          </span>
          <CheckBox
            color={""}
            label={t("Notifications.MuteNotification")}
            id={"muteSound"}
            restClass={"ml-[-10px] mt-5 mb-2 text-[#404041]"}
            checked={chatSettings[0]?.mute}
            onChange={(e: any) => {
              setChatSettings((prevState: any) => {
                const updateState = [...prevState]
                updateState[0].mute = e.target.checked
                return updateState
              })
              updateSettings({ mute: e.target.checked })
            }}
          />
          <NotificationSounds
            chatSettings={chatSettings}
            setChatSettings={setChatSettings}
            updateSettings={updateSettings}
          />
          <div className="mt-6">
            {/* <svg
              width="929"
              height="1"
              viewBox="0 0 929 1"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                y1="0.5"
                x2="929"
                y2="0.5"
                stroke="black"
                stroke-opacity="0.12"
              />
            </svg> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationSettings
