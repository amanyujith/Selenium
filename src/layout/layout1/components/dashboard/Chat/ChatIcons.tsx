import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { actionCreators } from "../../../../../store"
import Selector from "./reactions/Selector"
import ToolTip from "../../../../../atom/ToolTip/Tooltip"
import AddMembersModal from "../../BreakOutRoom/addMembersModal"
import { t } from "i18next"

interface ChatIconsType {
  isOwnChat: boolean
  chat?: any
  lastChild: boolean
  hoverState?: string
  chatId?: string
  quadrant?: string
}

const ChatIcons = ({
  isOwnChat,
  chat,
  lastChild,
  hoverState,
  chatId,
  quadrant,
}: ChatIconsType) => {
  const dispatch = useDispatch()
  // const shouldShowEmoji = useSelector((state: any) => state.Chat.showEmoji);
  const showOption = useSelector((state: any) => state.Chat.showOption)
  const chatInstance = useSelector((state: any) => state.Chat.chatInstance)
  const addMember = useSelector((state: any) => state.Breakout.addMemberModal)
  const flagShareMsg = useSelector((state: any) => state.Chat.setShareMsgModal)
  const [shouldShowOptn, setShouldShowOptn] = useState<boolean>(false)
  const [shouldShowEmoji, setShouldShowEmoji] = useState<boolean>(false)
  const align = useSelector((state: any) => state.Chat.alignOneSide)
  const { data: activeChat, isGroup } = useSelector(
    (state: any) => state.Chat.activeChat
  )
  const loggedInUserInfo = useSelector(
    (state: any) => state.Main.loggedInUserInfo
  )
  const updateOptions = useSelector((state: any) => state.Chat.updateOptions)
  const hoveredMessage = useSelector((state: any) => state.Chat.hoveredMessage)
  const [section, setSection] = useState<string | undefined>("Top-Left")
  const showEmoji = () => {
    dispatch(actionCreators.updateOptions(true))
    dispatch(actionCreators.setOptionBox(chat.uuid))
  }

  useEffect(() => {
    if (updateOptions && setShouldShowEmoji && setShouldShowOptn) {
      setShouldShowEmoji(true)
      setShouldShowOptn(false)
      setSection(quadrant)
      dispatch(actionCreators.updateOptions(false))
    }
  }, [updateOptions])

  const showOptions = () => {
    if (setShouldShowOptn && setShouldShowEmoji) {
      setShouldShowOptn(!shouldShowOptn)
      setSection(quadrant)
      setShouldShowEmoji(false)
    }

    dispatch(actionCreators.setOptionBox(chat.uuid))
  }

  const setReply = (chat: any) => {
    setShouldShowEmoji(false)
    dispatch(actionCreators.setReplyMsg(chat))
    dispatch(actionCreators.setReplyFlag(true))
    dispatch(actionCreators.setEdit(""))
  }

  const setPin = (chat: any) => {
    if (setShouldShowEmoji) setShouldShowEmoji(false)

    chatInstance?.pinMessage(
      activeChat.uuid,
      isGroup,
      chat.uuid,
      !chat.pinned,
      chat
    )
    chatInstance?.grafanaLogger(["Client : Pin Messages"], {
      uuid: activeChat?.uuid,
      isGroup: isGroup,
      messageUUID: chat?.uuid,
      selfId: loggedInUserInfo?.sub,
    })
    // dispatch(
    //   actionCreators.pinMessage(
    //     activeChat.uuid,
    //     isGroup,
    //     chat.uuid,
    //     loggedInUserInfo?.sub,
    //     !chat.pinned,
    //     chat
    //   )
    // )
  }

  const resetFlags = () => {
    setShouldShowEmoji(false)
    setShouldShowOptn(false)
    setSection(quadrant)
  }

  const setShareMsg = () => {
    // dispatch(actionCreators.setAddMemberModal(true));
    // dispatch(actionCreators.setShareMsgModal(true));
  }

  const [childKey, setChildKey] = useState(1)

  useEffect(() => {
    return () => {
      if (setShouldShowOptn && setShouldShowOptn) {
        setShouldShowOptn(false)
        setSection(quadrant)
        setShouldShowOptn(false)
      }
      dispatch(actionCreators.setOptionBox(""))
    }
  }, [])

  return (
    <div className="mb-1">
      <div
        className={`invisible group-hover:visible content-center items-center flex flex-row justify-center gap-[8px] w-[144px]`}
      >
        <button
          onClick={showEmoji}
          className="p-[6px] bg-[#FFFFFF] shadow-[0_2px_8px_0px_rgba(0,0,0,0.2)] rounded-[50px]"
        >
          {showOption === chat.uuid && shouldShowEmoji ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 13.75C8.79021 13.75 10.5071 13.0388 11.773 11.773C13.0388 10.5071 13.75 8.79021 13.75 7C13.75 5.20979 13.0388 3.4929 11.773 2.22703C10.5071 0.961159 8.79021 0.25 7 0.25C5.20979 0.25 3.4929 0.961159 2.22703 2.22703C0.961159 3.4929 0.25 5.20979 0.25 7C0.25 8.79021 0.961159 10.5071 2.22703 11.773C3.4929 13.0388 5.20979 13.75 7 13.75ZM4.57686 8.83252C5.04883 9.37832 5.85566 9.95312 7 9.95312C8.14434 9.95312 8.95117 9.37832 9.42314 8.83252C9.57607 8.65586 9.84238 8.6374 10.019 8.79033C10.1957 8.94326 10.2142 9.20957 10.0612 9.38623C9.47324 10.0612 8.45283 10.7969 7 10.7969C5.54717 10.7969 4.52676 10.0612 3.93877 9.38623C3.78584 9.20957 3.8043 8.94326 3.98096 8.79033C4.15762 8.6374 4.42393 8.65586 4.57686 8.83252ZM4.05742 5.73438C4.05742 5.5106 4.14632 5.29599 4.30455 5.13775C4.46278 4.97952 4.6774 4.89062 4.90117 4.89062C5.12495 4.89062 5.33956 4.97952 5.49779 5.13775C5.65603 5.29599 5.74492 5.5106 5.74492 5.73438C5.74492 5.95815 5.65603 6.17276 5.49779 6.331C5.33956 6.48923 5.12495 6.57812 4.90117 6.57812C4.6774 6.57812 4.46278 6.48923 4.30455 6.331C4.14632 6.17276 4.05742 5.95815 4.05742 5.73438ZM9.11992 4.89062C9.3437 4.89062 9.55831 4.97952 9.71654 5.13775C9.87478 5.29599 9.96367 5.5106 9.96367 5.73438C9.96367 5.95815 9.87478 6.17276 9.71654 6.331C9.55831 6.48923 9.3437 6.57812 9.11992 6.57812C8.89614 6.57812 8.68153 6.48923 8.5233 6.331C8.36507 6.17276 8.27617 5.95815 8.27617 5.73438C8.27617 5.5106 8.36507 5.29599 8.5233 5.13775C8.68153 4.97952 8.89614 4.89062 9.11992 4.89062Z"
                fill="#5C6779"
              />
            </svg>
          ) : (
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.9062 7C12.9062 5.43357 12.284 3.93129 11.1763 2.82365C10.0687 1.71601 8.56643 1.09375 7 1.09375C5.43357 1.09375 3.93129 1.71601 2.82365 2.82365C1.71601 3.93129 1.09375 5.43357 1.09375 7C1.09375 8.56643 1.71601 10.0687 2.82365 11.1763C3.93129 12.284 5.43357 12.9062 7 12.9062C8.56643 12.9062 10.0687 12.284 11.1763 11.1763C12.284 10.0687 12.9062 8.56643 12.9062 7ZM0.25 7C0.25 5.20979 0.961159 3.4929 2.22703 2.22703C3.4929 0.961159 5.20979 0.25 7 0.25C8.79021 0.25 10.5071 0.961159 11.773 2.22703C13.0388 3.4929 13.75 5.20979 13.75 7C13.75 8.79021 13.0388 10.5071 11.773 11.773C10.5071 13.0388 8.79021 13.75 7 13.75C5.20979 13.75 3.4929 13.0388 2.22703 11.773C0.961159 10.5071 0.25 8.79021 0.25 7ZM4.57686 8.83252C5.04883 9.37832 5.85566 9.95312 7 9.95312C8.14434 9.95312 8.95117 9.37832 9.42314 8.83252C9.57607 8.65586 9.84238 8.6374 10.019 8.79033C10.1957 8.94326 10.2142 9.20957 10.0612 9.38623C9.47324 10.0612 8.45283 10.7969 7 10.7969C5.54717 10.7969 4.52676 10.0612 3.93877 9.38623C3.78584 9.20957 3.8043 8.94326 3.98096 8.79033C4.15762 8.6374 4.42393 8.65586 4.57686 8.83252ZM4.26836 5.73438C4.26836 5.56654 4.33503 5.40558 4.45371 5.28691C4.57238 5.16823 4.73334 5.10156 4.90117 5.10156C5.069 5.10156 5.22996 5.16823 5.34864 5.28691C5.46731 5.40558 5.53398 5.56654 5.53398 5.73438C5.53398 5.90221 5.46731 6.06317 5.34864 6.18184C5.22996 6.30052 5.069 6.36719 4.90117 6.36719C4.73334 6.36719 4.57238 6.30052 4.45371 6.18184C4.33503 6.06317 4.26836 5.90221 4.26836 5.73438ZM9.11992 5.10156C9.28775 5.10156 9.44871 5.16823 9.56739 5.28691C9.68606 5.40558 9.75273 5.56654 9.75273 5.73438C9.75273 5.90221 9.68606 6.06317 9.56739 6.18184C9.44871 6.30052 9.28775 6.36719 9.11992 6.36719C8.95209 6.36719 8.79113 6.30052 8.67246 6.18184C8.55378 6.06317 8.48711 5.90221 8.48711 5.73438C8.48711 5.56654 8.55378 5.40558 8.67246 5.28691C8.79113 5.16823 8.95209 5.10156 9.11992 5.10156Z"
                fill="#5C6779"
              />
            </svg>
          )}
        </button>
        <ToolTip
          content={chat.pinned ? t("Chat.UnPin") : t("Chat.Pin")}
          direction="top"
          onclick={true}
        >
          <button
            onClick={() => setPin(chat)}
            className={` ${
              chat.pinned ? "p-1 ml-[2px]" : "py-[6px] px-2"
            } bg-[#FFFFFF] shadow-[0_2px_8px_0px_rgba(0,0,0,0.2)] rounded-[50px] mt-[3px]`}
          >
            {chat.pinned ? (
              <svg
                className=""
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  d="M4.59495 3.09375C4.59495 2.62705 4.97157 2.25 5.43773 2.25H12.18C12.6461 2.25 13.0227 2.62705 13.0227 3.09375C13.0227 3.56045 12.6461 3.9375 12.18 3.9375H11.403L11.7033 7.84512C12.6698 8.36982 13.4336 9.24785 13.7971 10.3421L13.8234 10.4212C13.9103 10.6796 13.8655 10.9617 13.7075 11.1806C13.5495 11.3994 13.294 11.5312 13.0227 11.5312H4.59495C4.32368 11.5312 4.07085 11.4021 3.91019 11.1806C3.74954 10.9591 3.7074 10.677 3.79431 10.4212L3.82065 10.3421C4.1841 9.24785 4.94786 8.36982 5.91443 7.84512L6.21467 3.9375H5.43773C4.97157 3.9375 4.59495 3.56045 4.59495 3.09375ZM7.96607 12.375H9.65163V14.9062C9.65163 15.3729 9.27501 15.75 8.80885 15.75C8.34269 15.75 7.96607 15.3729 7.96607 14.9062V12.375Z"
                  fill="#5C6779"
                />
              </svg>
            ) : (
              <svg
                className="mt-[1px]"
                width="11"
                height="14"
                viewBox="0 0 11 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.91021 1.15967L3.59117 5.29668C3.57271 5.55244 3.4356 5.78711 3.22466 5.92949C2.51275 6.41201 1.97749 7.14766 1.75865 8.02832L1.59253 8.6875H5.38941V6.15625C5.38941 5.92422 5.57925 5.73438 5.81128 5.73438C6.04331 5.73438 6.23316 5.92422 6.23316 6.15625V8.6875H10.03L9.86656 8.02832C9.64771 7.14766 9.11245 6.41201 8.40054 5.92949C8.18697 5.78447 8.05249 5.55244 8.03404 5.29668L7.71236 1.15967C7.70972 1.13857 7.70972 1.11748 7.70972 1.09375H3.91285C3.91285 1.11484 3.91285 1.13594 3.91021 1.15967ZM5.38941 9.53125H1.59253C1.3315 9.53125 1.08628 9.4126 0.92808 9.20693C0.769877 9.00127 0.711869 8.73496 0.77515 8.48184L0.938627 7.82266C1.21021 6.73369 1.87203 5.82666 2.75005 5.23076L3.00318 1.9375L3.0691 1.09375H2.43628C2.35982 1.09375 2.28863 1.07266 2.22798 1.03838C2.09878 0.964551 2.01441 0.827441 2.01441 0.671875C2.01441 0.439844 2.20425 0.25 2.43628 0.25H3.0691H8.55347H9.18628C9.41831 0.25 9.60816 0.439844 9.60816 0.671875C9.60816 0.827441 9.52378 0.964551 9.39458 1.03838C9.33394 1.07266 9.26275 1.09375 9.18628 1.09375H8.55347L8.61939 1.9375L8.87251 5.23076C9.75054 5.82666 10.4124 6.73633 10.6839 7.82266L10.8474 8.48184C10.9107 8.73496 10.8527 9.00127 10.6945 9.20693C10.5363 9.4126 10.2884 9.53125 10.03 9.53125H6.23316V13.3281C6.23316 13.5602 6.04331 13.75 5.81128 13.75C5.57925 13.75 5.38941 13.5602 5.38941 13.3281V9.53125Z"
                  fill="#5C6779"
                />
              </svg>
            )}
          </button>
        </ToolTip>

        <ToolTip content={t("Chat.Reply")} direction="top" onclick={true}>
          <button
            onClick={() => setReply(chat)}
            className="p-[7px] bg-[#FFFFFF] shadow-[0_2px_8px_0px_rgba(0,0,0,0.2)] rounded-[50px] "
          >
            <svg
              width="14"
              height="12"
              viewBox="0 0 14 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.94531 3.37553C5.59463 3.37553 5.3125 3.0934 5.3125 2.74272V2.53178V2.10991V0.844281L1.09375 4.64116L5.3125 8.43803V7.17241V6.75053V6.53959C5.3125 6.18891 5.59463 5.90678 5.94531 5.90678H6.15625H8.6875C10.5517 5.90678 12.0625 7.41762 12.0625 9.28178C12.0625 9.50063 12.044 9.70629 12.0098 9.8935C12.4896 9.27651 12.9062 8.38793 12.9062 7.17241C12.9062 5.07621 11.2056 3.37553 9.10938 3.37553H6.15625H5.94531ZM6.15625 7.17241V7.59428V8.43803C6.15625 8.77026 5.96113 9.07348 5.65527 9.20795C5.34941 9.34243 4.99609 9.28705 4.74824 9.06557L0.529492 5.26869C0.352832 5.10785 0.25 4.8811 0.25 4.64116C0.25 4.40121 0.352832 4.17446 0.529492 4.01362L4.74824 0.216742C4.99609 -0.00737893 5.35205 -0.0627501 5.65527 0.0743593C5.9585 0.211469 6.15625 0.512055 6.15625 0.844281V1.68803V2.10991V2.53178H7H9.10938C11.6723 2.53178 13.75 4.60952 13.75 7.17241C13.75 10.1598 11.6011 11.494 11.108 11.7629C11.0421 11.7998 10.9683 11.813 10.8944 11.813C10.607 11.813 10.375 11.5784 10.375 11.2936C10.375 11.0958 10.4884 10.9139 10.6334 10.7794C10.8812 10.5474 11.2188 10.0833 11.2188 9.28442C11.2188 7.88696 10.085 6.75317 8.6875 6.75317H7H6.15625V7.17504V7.17241Z"
                fill="#5C6779"
              />
            </svg>
          </button>
        </ToolTip>
            <div
              onClick={showOptions}
              className="px-[6px] bg-[#FFFFFF] cursor-pointer shadow-[0_2px_8px_0px_rgba(0,0,0,0.2)] rounded-[50px]"
            >
              <button>
                <svg
                  className="mb-[4px]"
                  width="14"
                  height="3"
                  viewBox="0 0 14 3"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.75 1.375C13.75 1.67337 13.6315 1.95952 13.4205 2.17049C13.2095 2.38147 12.9234 2.5 12.625 2.5C12.3266 2.5 12.0405 2.38147 11.8295 2.17049C11.6185 1.95952 11.5 1.67337 11.5 1.375C11.5 1.07663 11.6185 0.790484 11.8295 0.579505C12.0405 0.368527 12.3266 0.25 12.625 0.25C12.9234 0.25 13.2095 0.368527 13.4205 0.579505C13.6315 0.790484 13.75 1.07663 13.75 1.375ZM8.125 1.375C8.125 1.67337 8.00647 1.95952 7.7955 2.17049C7.58452 2.38147 7.29837 2.5 7 2.5C6.70163 2.5 6.41548 2.38147 6.2045 2.17049C5.99353 1.95952 5.875 1.67337 5.875 1.375C5.875 1.07663 5.99353 0.790484 6.2045 0.579505C6.41548 0.368527 6.70163 0.25 7 0.25C7.29837 0.25 7.58452 0.368527 7.7955 0.579505C8.00647 0.790484 8.125 1.07663 8.125 1.375ZM1.375 2.5C1.07663 2.5 0.790483 2.38147 0.579505 2.17049C0.368526 1.95952 0.25 1.67337 0.25 1.375C0.25 1.07663 0.368526 0.790484 0.579505 0.579505C0.790483 0.368527 1.07663 0.25 1.375 0.25C1.67337 0.25 1.95952 0.368527 2.1705 0.579505C2.38147 0.790484 2.5 1.07663 2.5 1.375C2.5 1.67337 2.38147 1.95952 2.1705 2.17049C1.95952 2.38147 1.67337 2.5 1.375 2.5Z"
                    fill="#5C6779"
                  />
                </svg>
              </button>
            </div>
      </div>
      {showOption === chat.uuid ? (
        <div
          className={`flex flex-row-reverse ${
            !align && isOwnChat ? "mr-[-19px]" : ""
          } `}
        >
          {shouldShowOptn || shouldShowEmoji ? (
            <Selector
              id={chat.uuid}
              body={chat}
              lastChild={lastChild}
              shouldShowOptn={shouldShowOptn}
              closemodal={resetFlags}
              shouldshowEmoji={shouldShowEmoji}
              isOwnChat={isOwnChat}
              quadrant={section}
            />
          ) : null}
        </div>
      ) : null}
      {addMember === true && flagShareMsg === true ? (
        <AddMembersModal
          title={"Share Message"}
          chat={chat}
          buttonText={"Share"}
        />
      ) : null}
    </div>
  )
}

export default ChatIcons
