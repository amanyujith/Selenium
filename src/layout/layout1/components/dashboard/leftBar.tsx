import React, { Reducer, useEffect, useState } from "react"
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom"
import Chats from "./Chat/Chats"
import SettingsPanel from "./settingsPanel"
import { useDispatch, useSelector } from "react-redux"
import path from "../../../../navigation/routes.path"
import { RootState, actionCreators } from "../../../../store"
import SettingsItem from "../../../../atom/SettingsItem/settingsItem"
import DialPad from "./pbx-call/Dialer/dialView"
import CallHub from "./pbx-call/callHub"
import { incoming_ring } from "./pbx-call/vault/svg"

const LeftBar = (props: any) => {
  const { data: activeChat } = useSelector(
    (state: RootState) => state.Chat.activeChat
  )
  const callStatus = useSelector((state: RootState) => state.Call.callStatus)
  const userData = useSelector((state: RootState) => state.Chat.userData)
  const { setOpenTodayMeeting, setProfileSettingsClick } = props
  const callInfo = useSelector((state: any) => state.Chat.chatCallInfo)
  const incomingCall = useSelector((state: any) => state.Chat.incomingCall)
  const permissionSettings = useSelector(
    (state: RootState) => state.Main.permissionSettings
  )

  const dispatch = useDispatch()
  const handleClick = (click?: string) => {
    dispatch(actionCreators.toggleLeftbar("hidden"))
    // setOpenTodayMeeting(true)mathew
    setOpenTodayMeeting(false)
    setProfileSettingsClick(false)
    if (click !== "chat") {
      dispatch(actionCreators.setChatscreen(false))
      dispatch(actionCreators.unsetAcitveChat())
    }
  }

  const params = useParams()["*"]?.split("/")[0]

  useEffect(() => {
    if (params === "pbx" && permissionSettings?.pbx?.length)
      dispatch(actionCreators.setCallStatus("active"))
  }, [])

  useEffect(() => {
    if (params === "chat" && permissionSettings?.chat?.length)
      dispatch(actionCreators.setChatscreen(true))
  }, [params])

  return (
    <div className="flex z-[50]">
      <div
        className={`w-[60px] shadow-[0_4px_10px_0px_rgba(0,0,0,0.20)] h-full bg-[#293241] sm:static sm:block `}
      >
        {permissionSettings?.phone?.length ? (
          <div
            id="PBXPHONE"
            onClick={() =>
              dispatch(actionCreators.setCallStatus(callStatus ? "" : "active"))
            }
            className={`hover:bg-[#FEF3E6]  ${
              callStatus ? "bg-[#dac0a3] text-[#293241]" : "text-[#FFFFFF]"
            }`}
          >
            <div
              className={`hover:bg-[#FEF3E6] hover:text-[#293241] pl-3  pr-2.5 flex items-center justify-center w-full text-sm rounded-[3px]  flex-col h-[60px] group cursor-pointer`}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.7437 12.5996C15.2312 12.3809 14.6375 12.5246 14.2844 12.9559L13.2469 14.2246C11.8094 13.3903 10.6094 12.1903 9.775 10.7528L11.0406 9.7184C11.4719 9.36527 11.6188 8.77152 11.3969 8.25902L9.89687 4.75902C9.6625 4.20902 9.07188 3.90277 8.4875 4.02777L4.9875 4.77777C4.4125 4.89965 4 5.40902 4 5.99965C4 13.3965 9.73438 19.4528 17 19.9653C17.1406 19.9746 17.2844 19.984 17.4281 19.9903C17.4281 19.9903 17.4281 19.9903 17.4312 19.9903C17.6219 19.9965 17.8094 20.0028 18.0031 20.0028C18.5938 20.0028 19.1031 19.5903 19.225 19.0153L19.975 15.5153C20.1 14.9309 19.7937 14.3403 19.2437 14.1059L15.7437 12.6059V12.5996ZM17.9906 18.9996C10.8156 18.9934 5 13.1778 5 5.99965C5 5.8809 5.08125 5.7809 5.19687 5.7559L8.69688 5.0059C8.8125 4.9809 8.93125 5.0434 8.97813 5.15277L10.4781 8.65277C10.5219 8.7559 10.4938 8.87465 10.4062 8.9434L9.1375 9.9809C8.75937 10.2903 8.65938 10.8309 8.90625 11.2559C9.82812 12.8465 11.1531 14.1715 12.7406 15.0903C13.1656 15.3371 13.7063 15.2371 14.0156 14.859L15.0531 13.5903C15.125 13.5028 15.2437 13.4746 15.3438 13.5184L18.8438 15.0184C18.9531 15.0653 19.0156 15.184 18.9906 15.2996L18.2406 18.7996C18.2156 18.9153 18.1125 18.9965 17.9969 18.9965C17.9937 18.9965 17.9906 18.9965 17.9875 18.9965L17.9906 18.9996Z"
                  fill={callStatus ? "#293241" : "#ffffff"}
                  className="group-hover:fill-[#293241]"
                />
              </svg>
              <span className="font-sans font-medium text-[10px]">Phone</span>
            </div>
          </div>
        ) : null}
        {permissionSettings?.pbx?.length ? (
          <div
            id="PBXSECTION"
            onClick={() => handleClick()}
            className={`hover:bg-[#FEF3E6] ${
              params === "pbx"
                ? "bg-[#FEF3E6] text-[#293241]"
                : "text-[#FFFFFF]"
            }`}
          >
            <Link to="/app/dashboard/pbx" id="PBXSECTION-LINK">
              <div
                className={`hover:bg-[#FEF3E6] hover:text-[#293241] pl-3  pr-2.5 flex items-center justify-center w-full text-sm rounded-[3px]  flex-col h-[60px] group cursor-pointer`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.375 1.31885C4.78984 1.31885 5.125 1.6959 5.125 2.1626V10.1782C5.125 10.6449 4.78984 11.022 4.375 11.022H3.625C3.21016 11.022 2.875 10.6449 2.875 10.1782V2.1626C2.875 1.6959 3.21016 1.31885 3.625 1.31885H4.375ZM3.625 0.475098C3.06953 0.475098 2.58437 0.815234 2.32656 1.31885H1.75C0.922656 1.31885 0.25 2.07559 0.25 3.00635V12.2876C0.25 13.2184 0.922656 13.9751 1.75 13.9751H12.25C13.0773 13.9751 13.75 13.2184 13.75 12.2876V3.00635C13.75 2.07559 13.0773 1.31885 12.25 1.31885H11.5H7.75H5.67344C5.41562 0.815234 4.93047 0.475098 4.375 0.475098H3.625ZM7 2.1626V3.8501C7 4.3168 7.33516 4.69385 7.75 4.69385H11.5C11.9148 4.69385 12.25 4.3168 12.25 3.8501V2.1626C12.6648 2.1626 13 2.53965 13 3.00635V12.2876C13 12.7543 12.6648 13.1313 12.25 13.1313H1.75C1.33516 13.1313 1 12.7543 1 12.2876V3.00635C1 2.53965 1.33516 2.1626 1.75 2.1626H2.125V10.1782C2.125 11.109 2.79766 11.8657 3.625 11.8657H4.375C5.20234 11.8657 5.875 11.109 5.875 10.1782V2.1626H7ZM11.5 2.1626V3.8501H7.75V2.1626H11.5ZM8.5 6.80322C8.5 6.91511 8.46049 7.02242 8.39017 7.10153C8.31984 7.18065 8.22446 7.2251 8.125 7.2251C8.02554 7.2251 7.93016 7.18065 7.85983 7.10153C7.78951 7.02242 7.75 6.91511 7.75 6.80322C7.75 6.69133 7.78951 6.58403 7.85983 6.50491C7.93016 6.4258 8.02554 6.38135 8.125 6.38135C8.22446 6.38135 8.31984 6.4258 8.39017 6.50491C8.46049 6.58403 8.5 6.69133 8.5 6.80322ZM8.125 5.5376C7.82663 5.5376 7.54048 5.67094 7.3295 5.90829C7.11853 6.14564 7 6.46756 7 6.80322C7 7.13889 7.11853 7.4608 7.3295 7.69815C7.54048 7.93551 7.82663 8.06885 8.125 8.06885C8.42337 8.06885 8.70952 7.93551 8.9205 7.69815C9.13147 7.4608 9.25 7.13889 9.25 6.80322C9.25 6.46756 9.13147 6.14564 8.9205 5.90829C8.70952 5.67094 8.42337 5.5376 8.125 5.5376ZM8.125 9.75635C8.22446 9.75635 8.31984 9.80079 8.39017 9.87991C8.46049 9.95903 8.5 10.0663 8.5 10.1782C8.5 10.2901 8.46049 10.3974 8.39017 10.4765C8.31984 10.5557 8.22446 10.6001 8.125 10.6001C8.02554 10.6001 7.93016 10.5557 7.85983 10.4765C7.78951 10.3974 7.75 10.2901 7.75 10.1782C7.75 10.0663 7.78951 9.95903 7.85983 9.87991C7.93016 9.80079 8.02554 9.75635 8.125 9.75635ZM7 10.1782C7 10.5139 7.11853 10.8358 7.3295 11.0732C7.54048 11.3105 7.82663 11.4438 8.125 11.4438C8.42337 11.4438 8.70952 11.3105 8.9205 11.0732C9.13147 10.8358 9.25 10.5139 9.25 10.1782C9.25 9.84256 9.13147 9.52064 8.9205 9.28329C8.70952 9.04594 8.42337 8.9126 8.125 8.9126C7.82663 8.9126 7.54048 9.04594 7.3295 9.28329C7.11853 9.52064 7 9.84256 7 10.1782ZM11.5 6.80322C11.5 6.91511 11.4605 7.02242 11.3902 7.10153C11.3198 7.18065 11.2245 7.2251 11.125 7.2251C11.0255 7.2251 10.9302 7.18065 10.8598 7.10153C10.7895 7.02242 10.75 6.91511 10.75 6.80322C10.75 6.69133 10.7895 6.58403 10.8598 6.50491C10.9302 6.4258 11.0255 6.38135 11.125 6.38135C11.2245 6.38135 11.3198 6.4258 11.3902 6.50491C11.4605 6.58403 11.5 6.69133 11.5 6.80322ZM11.125 5.5376C10.8266 5.5376 10.5405 5.67094 10.3295 5.90829C10.1185 6.14564 10 6.46756 10 6.80322C10 7.13889 10.1185 7.4608 10.3295 7.69815C10.5405 7.93551 10.8266 8.06885 11.125 8.06885C11.4234 8.06885 11.7095 7.93551 11.9205 7.69815C12.1315 7.4608 12.25 7.13889 12.25 6.80322C12.25 6.46756 12.1315 6.14564 11.9205 5.90829C11.7095 5.67094 11.4234 5.5376 11.125 5.5376ZM11.125 9.75635C11.2245 9.75635 11.3198 9.80079 11.3902 9.87991C11.4605 9.95903 11.5 10.0663 11.5 10.1782C11.5 10.2901 11.4605 10.3974 11.3902 10.4765C11.3198 10.5557 11.2245 10.6001 11.125 10.6001C11.0255 10.6001 10.9302 10.5557 10.8598 10.4765C10.7895 10.3974 10.75 10.2901 10.75 10.1782C10.75 10.0663 10.7895 9.95903 10.8598 9.87991C10.9302 9.80079 11.0255 9.75635 11.125 9.75635ZM10 10.1782C10 10.5139 10.1185 10.8358 10.3295 11.0732C10.5405 11.3105 10.8266 11.4438 11.125 11.4438C11.4234 11.4438 11.7095 11.3105 11.9205 11.0732C12.1315 10.8358 12.25 10.5139 12.25 10.1782C12.25 9.84256 12.1315 9.52064 11.9205 9.28329C11.7095 9.04594 11.4234 8.9126 11.125 8.9126C10.8266 8.9126 10.5405 9.04594 10.3295 9.28329C10.1185 9.52064 10 9.84256 10 10.1782Z"
                    fill="#293241"
                    className={`group-hover:fill-[#293241] ${
                      params === "pbx" ? " fill-[#293241]" : "fill-[#FFFFFF]"
                    }`}
                  />
                </svg>

                <span className="font-medium font-sans text-[10px]">PBX</span>
              </div>
            </Link>
          </div>
        ) : null}
        {permissionSettings?.chat?.length ? (
          <div
            id="CHATSECTION"
            onClick={() => handleClick("chat")}
            className={`hover:bg-[#FEF3E6] ${
              params === "chat"
                ? "bg-[#FEF3E6] text-[#293241]"
                : "text-[#FFFFFF]"
            }`}
          >
            <Link
              id="CHATSECTION-LINK"
              to={`/app/dashboard/chat/${activeChat?.uuid ?? ""}`}
            >
              <div
                className={`hover:bg-[#FEF3E6] hover:text-[#293241] pl-3  pr-2.5 flex items-center justify-center w-full text-sm rounded-[3px]  flex-col h-[60px] group cursor-pointer relative`}
              >
                {(() => {
                  if (props.unread > 0) {
                    return (
                      <div
                        className={`rounded-full w-fit text-[12px] px-1 h-[14px] flex items-center content-center text-[#FFFFFF] bg-[#AD6716]  absolute left-3 top-0.5  `}
                      >
                        {props.unread.toString()?.length <= 1
                          ? props.unread
                          : "9+"}
                      </div>
                    )
                  }
                })()}
                {(() => {
                  if (callInfo || incomingCall) {
                    return (
                      <div
                        className={`rounded-full w-[15px] text-[15px] px-1 h-[14px] flex items-center content-center text-[#FFFFFF] bg-[#76B947] border border-[#ffffff]  absolute left-8 top-5  `}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 18 18"
                          fill="none"
                          className="scale-150"
                        >
                          <path
                            d="M11.8078 9.44974C11.4234 9.28567 10.9781 9.39349 10.7133 9.71692L9.93516 10.6685C8.85703 10.0427 7.95703 9.1427 7.33125 8.06458L8.28047 7.2888C8.60391 7.02395 8.71406 6.57864 8.54766 6.19427L7.42266 3.56927C7.24687 3.15677 6.80391 2.92708 6.36563 3.02083L3.74063 3.58333C3.30938 3.67474 3 4.05677 3 4.49974C3 10.0474 7.30078 14.5896 12.75 14.974C12.8555 14.981 12.9633 14.988 13.0711 14.9927C13.0711 14.9927 13.0711 14.9927 13.0734 14.9927C13.2164 14.9974 13.357 15.0021 13.5023 15.0021C13.9453 15.0021 14.3273 14.6927 14.4188 14.2615L14.9813 11.6365C15.075 11.1982 14.8453 10.7552 14.4328 10.5794L11.8078 9.45442V9.44974ZM13.493 14.2497C8.11172 14.245 3.75 9.88333 3.75 4.49974C3.75 4.41067 3.81094 4.33567 3.89766 4.31692L6.52266 3.75442C6.60938 3.73567 6.69844 3.78255 6.73359 3.86458L7.85859 6.48958C7.89141 6.56692 7.87031 6.65599 7.80469 6.70755L6.85312 7.48567C6.56953 7.7177 6.49453 8.12317 6.67969 8.44192C7.37109 9.63489 8.36484 10.6286 9.55547 11.3177C9.87422 11.5029 10.2797 11.4279 10.5117 11.1443L11.2898 10.1927C11.3438 10.1271 11.4328 10.106 11.5078 10.1388L14.1328 11.2638C14.2148 11.299 14.2617 11.388 14.243 11.4747L13.6805 14.0997C13.6617 14.1865 13.5844 14.2474 13.4977 14.2474C13.4953 14.2474 13.493 14.2474 13.4906 14.2474L13.493 14.2497Z"
                            fill="#ffffff"
                          />
                        </svg>
                      </div>
                    )
                  }
                })()}

                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.625 16.5C9.24727 16.5 9.75 17.0027 9.75 17.625V19.3125L13.1988 16.725C13.3922 16.5773 13.6312 16.5 13.8738 16.5H18.75C19.3723 16.5 19.875 15.9973 19.875 15.375V5.25C19.875 4.62773 19.3723 4.125 18.75 4.125H5.25C4.62773 4.125 4.125 4.62773 4.125 5.25V15.375C4.125 15.9973 4.62773 16.5 5.25 16.5H8.625ZM3 5.25C3 4.00898 4.00898 3 5.25 3H18.75C19.991 3 21 4.00898 21 5.25V15.375C21 16.616 19.991 17.625 18.75 17.625H13.8738L9.525 20.8875C9.35625 21.0141 9.12773 21.0352 8.93438 20.9402C8.74102 20.8453 8.625 20.652 8.625 20.4375V18.75V17.625H7.5H5.25C4.00898 17.625 3 16.616 3 15.375V5.25Z"
                    fill={`${params === "chat" ? "#293241" : "#ffffff"}`}
                    className="group-hover:fill-[#293241]"
                  />
                </svg>

                <span className="font-medium font-sans text-[10px]">Chat</span>
              </div>
            </Link>
          </div>
        ) : null}

        {permissionSettings?.pbx?.length ? (
          <CallHub dashboardRef={props.dashboardRef} />
        ) : null}
        {permissionSettings?.meeting?.length ? (
          <div
            id="MEETINGSECTION"
            onClick={() => handleClick()}
            className={`hover:bg-[#FEF3E6] ${
              params === "meeting"
                ? "bg-[#FEF3E6] text-[#293241]"
                : "text-[#FFFFFF]"
            }`}
          >
            <Link to="/app/dashboard/meeting" id="MEETINGSECTION-LINK">
              <div
                className={`hover:bg-[#FEF3E6] hover:text-[#293241] pl-3  pr-2.5 flex items-center justify-center w-full text-sm rounded-[3px]  flex-col h-[60px] group cursor-pointer`}
              >
                <svg
                  width="17"
                  height="12"
                  viewBox="0 0 18 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 1C1.44687 1 1 1.44687 1 2V10C1 10.5531 1.44687 11 2 11H10C10.5531 11 11 10.5531 11 10V2C11 1.44687 10.5531 1 10 1H2ZM0 2C0 0.896875 0.896875 0 2 0H10C11.1031 0 12 0.896875 12 2V3.475V8.525V10C12 11.1031 11.1031 12 10 12H2C0.896875 12 0 11.1031 0 10V2ZM16.2313 10.8531L13 9.075V7.93437L16.7125 9.97812C16.7406 9.99375 16.7719 10.0031 16.8062 10.0031C16.9125 10.0031 17 9.91562 17 9.80937V2.19375C17 2.0875 16.9125 2 16.8062 2C16.775 2 16.7406 2.00938 16.7125 2.025L13 4.06563V2.925L16.2313 1.14687C16.4062 1.05 16.6062 1 16.8062 1C17.4656 1 18 1.53437 18 2.19375V9.80625C18 10.4656 17.4656 11 16.8062 11C16.6062 11 16.4062 10.95 16.2313 10.8531Z"
                    fill="#ffffff"
                    className={`group-hover:fill-[#293241] ${
                      params === "meeting"
                        ? " fill-[#293241]"
                        : "fill-[#FFFFFF]"
                    }`}
                  />
                </svg>
                <span className="font-medium font-sans text-[10px]">
                  Meeting
                </span>
              </div>
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default LeftBar
