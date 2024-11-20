import { useEffect, useRef, useMemo, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import MsgSendIcon from "./Icons/MsgSendIcon"
import { useParams } from "react-router-dom"
import RichTextDeleteicon from "./Icons/RichTextDeleteicon"
import ChatHeader from "./ChatHeader"
import RichTextBox from "./RichTextBox"
import ChatBubble from "./chatContainer/ChatBubble"
import { actionCreators } from "../../../../../store"
import useNotificationSound from "./hooks/useNotificationSound"
import ActiveMsgSendicon from "./Icons/ActiveMsgSendicon"
import SkeletonComponent from "./SkeletonComponent"
import { useNavigate } from "react-router-dom"
import path from "../../../../../navigation/routes.path"
import InviteUserModal from "./call/addMember"
import LogRocket from "logrocket"
import setupLogRocketReact from "logrocket-react"
import FadeIn from "react-fade-in/lib/FadeIn"
import TypingIndicator from "./hooks/typingIndicator"
import UseEscape from "./hooks/useEscape"
import MultiSelectTopBar from "./MultiSelectTopBar"
const Cabello = require("./audio/incoming-outgoing-message/Cabello.mp3")
const Incoming = require("./audio/incoming-outgoing-message/Incoming.mp3")
const LiveChat = require("./audio/incoming-outgoing-message/Live Chat.mp3")
const Messagetone = require("./audio/incoming-outgoing-message/Message Tone.mp3")
const Notify = require("./audio/incoming-outgoing-message/Notify.mp3")
const Outgoing = require("./audio/incoming-outgoing-message/Outgoing.mp3")
const ping = require("./audio/incoming-outgoing-message/Ping.mp3")
const positiveNote = require("./audio/incoming-outgoing-message/Positive Notice.mp3")
const serviceBell = require("./audio/incoming-outgoing-message/Service Bell.mp3")
const Shooting = require("./audio/incoming-outgoing-message/Shooting.mp3")
const theNotification = require("./audio/incoming-outgoing-message/The Notification.mp3")
const success = require("./audio/incoming-outgoing-message/Success.mp3")
const _ = require("lodash")

interface ChatBubbleRef {
  scrollIntoMessage: (id: string) => void
}

function ChatPage(item: any) {
  const emojibar = useSelector((state: any) => state.Chat.emojibar)
  const scroller = useRef<null | HTMLDivElement>(null)
  const ref = useRef<ChatBubbleRef>(null)
  const { id } = useParams()
  const navigate = useNavigate()
  const [viewMore, setViewMore] = useState(false);
  UseEscape(() => setViewMore(false));
  const dispatch = useDispatch()
  const { data: activeChat, isGroup } = useSelector(
    (state: any) => state.Chat.activeChat
  )
  // const [activeChat, setActiveChat] = useState<any | null>(null);
  // const [isGroup, setIsGroup] = useState<boolean>(false);
  const chatInstance = useSelector((state: any) => state.Chat.chatInstance)
  const personalInfo = useSelector((state: any) => state.Chat.personalInfo)
const setMultipleSelect = useSelector(
  (state: any) => state.Chat.setMultipleMsgSelect
);
const selectedList = useSelector(
  (state: any) => state.Chat.setMultipleMsgList
);
  const environmentLevel = useSelector(
    (state: any) => state.Main.environmentLevel
  )
  const loggedInUserInfo = useSelector(
    (state: any) => state.Main.loggedInUserInfo
  )
  const logRocketState = useSelector((state: any) => state.Flag.logRocketState)
  const settings = useSelector((state: any) => state.Main.soundAndNotification)
  const [audioFile, setAudioFile] = useState(Outgoing)
  const searchResultMessage = useSelector(
    (state: any) => state.Chat.searchResultMessage
  )
  const [validPin, setValidPin] = useState([])

  dispatch(actionCreators.setChatscreen(true))
  const arrayLength: number = activeChat?.messages?.length

  // useEffect(() => {
  //   if (
  //     id &&
  //     id !== "undefined" &&
  //     personalInfo &&
  //     searchResultMessage === ""
  //   ) {
  //     chatInstance
  //       ?.getChatDetails(id, 25)
  //       .then((data: any) => {
  //         dispatch(actionCreators.setChatByUUID(data.uuid, data))
  //       })
  //       .catch((err: any) => {
  //         navigate(`${path.DASHBOARD}`)
  //       })
  //   }
  // }, [personalInfo])

  useMemo(() => {
    if (!logRocketState && environmentLevel === "test") {
      LogRocket.init("bqvwvm/hoolva", {
        release: "20230428",
      })
      LogRocket.identify("Hoolva User", {
        name: loggedInUserInfo?.name,
        // email: `${userName}@${environmentLevel}.${meetingInfo.meetingId}`,
        email: loggedInUserInfo?.email,

        // Add your own custom user variables here, ie:
        subscriptionType: "pro",
      })
    }
    setupLogRocketReact(LogRocket)
    dispatch(actionCreators.setLogrocketState(true))
  }, [])

  useEffect(() => {
    if (!activeChat.uuid) {
      if (
        id &&
        id !== "undefined" &&
        personalInfo &&
        searchResultMessage === ""
      ) {
        chatInstance
          ?.getChatDetails(id, 25)
          .then((data: any) => {
            dispatch(actionCreators.setChatByUUID(data.uuid, data))
          })
          .catch((err: any) => {
            navigate(`${path.DASHBOARD}`)
          })
      }
    }
  }, [id])

  const scrollIntoMessage = (id: string) => {
    ref?.current?.scrollIntoMessage(id)
  }

  const playSound = (src: string) => {
    if (!settings[0]?.mute) {
      const audio = new Audio(src)
      audio.currentTime = 0
      //audio.loop = true
      audio.play()
    }
  }

  useEffect(() => {
    const file = settings[0]?.outgoing_chat_notftn_sound
    file === "cabello"
      ? setAudioFile(Cabello)
      : file === "livechat"
      ? setAudioFile(LiveChat)
      : file === "messagetone"
      ? setAudioFile(Messagetone)
      : file === "notify"
      ? setAudioFile(Notify)
      : file === "ping"
      ? setAudioFile(ping)
      : file === "positivenote"
      ? setAudioFile(positiveNote)
      : file === "servicebell"
      ? setAudioFile(serviceBell)
      : file === "shooting"
      ? setAudioFile(Shooting)
      : file === "thenotification"
      ? setAudioFile(theNotification)
      : file === "success"
      ? setAudioFile(success)
      : file === "incoming"
      ? setAudioFile(Incoming)
      : file === "turnedoff"
      ? setAudioFile("")
      : setAudioFile(Outgoing)
  }, [settings[0]?.outgoing_chat_notftn_sound])

  const [playNotificationSound] = useNotificationSound(audioFile)

  const sendMessage = (
    message: any,
    uuid?: string,
    to?: string,
    isGroup?: boolean,
    option?: any
  ) => {
    playSound(audioFile)
    // playNotificationSound(0.5, false);
    chatInstance?.publishMessage(
      message,
      "text",
      activeChat.uuid,
      isGroup,
      option
    )
  }

  const updateSeen = (len: number, unreadCount: number) => {
    let count = len - unreadCount
    for (let i = len - 1; i >= count; --i) {
      let item = activeChat.messages[i]
      chatInstance?.updateMessageSeenStatus(item.uuid, item.to)
      //
    }
  }

  if (activeChat === null) {
    return <div>Loading</div>
  }

  const handleClose = () => {
    dispatch(actionCreators.setOptionBox(""))
    dispatch(actionCreators.setEmojiBox(false))
  }

  const isMember = () => {
    if (isGroup) {
      let member = []
      member = activeChat?.members?.find(
        (member: any) => member.user_id === loggedInUserInfo?.sub
      )

      if (member?.length === 0 || member === undefined) {
        return false
      } else {
        return true
      }
    }
  }

  const getName = (from: string) => {
    const { display_name: username } =
      (activeChat?.members?.length > 0 &&
        activeChat?.members?.find((item: any) => item?.user_id === from)) ||
      {}

    const getInativeUsername = () => {
      let inactive_user = activeChat.inactive_members.find(
        (item: any) => item.user_id === from
      )
      if (inactive_user) {
        return inactive_user.name
      } else {
        return ""
      }
    }
    return username ?? getInativeUsername()
  }

  const fetchName = () => {
    if (isGroup) return activeChat.name
    else
      return activeChat.display_name
        ? activeChat?.display_name
        : activeChat.firstname
        ? activeChat.firstname + " " + activeChat.lastname
        : null
  }

  console.log()

  return (
    <div className="xl:w-fit h-fit p-3 bg-[#F1F1F1] ">
      <FadeIn>
        <div
          onClick={handleClose}
          className="xl:w-[calc(100vw-358px)] h-[calc(100vh-80px)] bg-[#FEFDFB] flex flex-col  relative rounded-[10px]"
        >
          <div>
            {isGroup ? (
              <ChatHeader
                name={activeChat?.name}
                members={
                  activeChat?.archive_members?.[0]
                    ? activeChat?.archive_members
                    : activeChat?.members
                }
                profile_picture={activeChat?.profile_picture}
                isGroup={isGroup}
                isAdmin={activeChat?.admin?.includes(personalInfo?.uuid)}
                uuid={activeChat?.uuid}
                lastSeen={activeChat?.last_seen}
                status={activeChat?.status}
                email={activeChat?.email}
                callDetail={activeChat?.call_details}
                pinned_messages={activeChat?.pinned_messages}
                scrollIntoMessage={scrollIntoMessage}
                inactive_members={activeChat?.inactive_members}
                setViewMore={setViewMore}
                viewMore={viewMore}
              />
            ) : (
              <ChatHeader
                name={
                  activeChat?.display_name
                    ? activeChat?.display_name
                    : activeChat?.firstname
                    ? activeChat?.firstname + " " + activeChat?.lastname
                    : null
                }
                members={
                  activeChat?.archive_members?.[0]
                    ? activeChat?.archive_members
                    : activeChat?.members
                }
                profile_picture={activeChat?.profile_picture}
                isGroup={isGroup}
                isAdmin={false}
                uuid={activeChat?.uuid}
                presence={activeChat?.presence}
                callDetail={activeChat?.call_details}
                lastSeen={activeChat?.last_seen}
                status={activeChat?.status}
                email={activeChat?.email}
                pinned_messages={activeChat?.pinned_messages}
                scrollIntoMessage={scrollIntoMessage}
                setViewMore={setViewMore}
                viewMore={viewMore}
              />
            )}
          </div>
          {activeChat.uuid || id ? (
            <>
            {setMultipleSelect && <MultiSelectTopBar/>}
              <div
                className="h-full relative overflow-x-hidden  flex flex-col-reverse"
                ref={scroller}
                onClick={handleClose}
              >
                <ChatBubble
                  ref={ref}
                  uuid={activeChat?.uuid ?? id}
                  profile_picture={activeChat?.profile_picture}
                  chat={activeChat?.messages}
                  name={fetchName()}
                  isGroup={isGroup}
                  status={activeChat?.status}
                  members={
                    activeChat?.archive_members?.[0]
                      ? activeChat?.archive_members
                      : activeChat?.members
                  }
                  isMember={isMember()}
                  inactive_members={activeChat?.inactive_members}
                  scrollPos={activeChat?.scrollPos}
                  unread_msg_count={activeChat?.unread_msg_count}
                  cachedMessages={activeChat?.cachedMessages}
                  isTyping={activeChat?.isTyping}
                  setViewMore={setViewMore}
                />
              </div>
              {activeChat?.isTyping &&
              activeChat.status !== "archive" &&
              (activeChat.uuid || id) ? (
                <div className="w-full flex place-self-center	h-[35px] bg-[#F9FAFA] pl-4">
                  {/* need to optimise */}
                  <TypingIndicator
                    name={isGroup ? null : fetchName()}
                    getName={getName}
                    uuid={activeChat?.isTyping}
                    profile_picture={activeChat?.profile_picture}
                    members={
                      activeChat?.archive_members?.[0]
                        ? activeChat?.archive_members
                        : activeChat?.members
                    }
                    inactive_members={activeChat?.inactive_members}
                    isGroup={isGroup}
                  />
                </div>
              ) : null}
              <div className="">
                {activeChat?.status === "inactive" ||
                activeChat?.status === "archive" ||
                activeChat?.status === "deleted" ||
                activeChat?.status === "disabled" ||
                (isGroup &&
                  !activeChat?.members?.find(
                    (member: any) => member?.user_id === loggedInUserInfo?.sub
                  )) ? (
                  <div className="mt-10"></div>
                ) : isGroup ? (
                  <RichTextBox
                    sendMessage={sendMessage}
                    setDeleteicon={<RichTextDeleteicon />}
                    setSendicon={<MsgSendIcon />}
                    activeSendicon={<ActiveMsgSendicon />}
                    name={activeChat?.name}
                    members={activeChat?.members}
                    inactive_members={activeChat?.inactive_members}
                    chatID={id}
                  />
                ) : (
                  <RichTextBox
                    sendMessage={sendMessage}
                    setDeleteicon={<RichTextDeleteicon />}
                    setSendicon={<MsgSendIcon />}
                    activeSendicon={<ActiveMsgSendicon />}
                    name={
                      activeChat?.display_name
                        ? activeChat?.display_name
                        : activeChat?.firstname
                        ? activeChat?.firstname + " " + activeChat?.lastname
                        : null
                    }
                    chatID={id}
                  />
                )}
              </div>
            </>
          ) : (
            <SkeletonComponent />
          )}
        </div>
      </FadeIn>
    </div>
  );
}

export default ChatPage
