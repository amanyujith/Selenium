import { memo, useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import MeetingSection from "../../../../../../containers/home/meetingScreen/meetingSection"
//import Chat from '../../../layout/layout1/components/meetingScreen/chat/chat';
import Chat from "../../../meetingScreen/chat/chat"
import Notification from "../../../notification/notification"
import { actionCreators } from "../../../../../../store"
import Modal from "../../../modal/modal"
import FileShareModal from "../../../modal/fileShareModal"
import ModalData from "../../../../../../constructors/modal/modalData"
import { useNavigate } from "react-router-dom"
import path from "../../../../../../navigation/routes.path"
import Invite from "../../../meetingScreen/invite/invite"
import LogRocket from "logrocket"
import setupLogRocketReact from "logrocket-react"
import hoverTimer from "../../../../../../utils/hoverTimer"
import RightSidePanel from "../../../meetingScreen/rightSidePanel/rightSidePanel"
import PushNotifications from "../../../../../../constructors/notification/pushNotifications"
import DialInDialOutModal from "../../../DialInDialOut/DialInDialOutModal"
import { t } from "i18next"
import sound from "../audio/call1.mp3"

interface ICallMainContainer {
  elementRef: any
}

const CallMainContainer = ({ elementRef }: ICallMainContainer) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // const { stopTimer } = useTimer()
  // const [groupChatState, setGroupChatState] = useState(false);
  const membersList = useSelector((state: any) => state.Flag.membersList)
  const privateChatState = useSelector(
    (state: any) => state.Flag.privateChatState
  )
  const isHost = useSelector((state: any) => state.Flag.isHost)
  const hostEndForAll = useSelector((state: any) => state.Flag.hostEndForAll)
  const createMeeting = useSelector((state: any) => state.Flag.createMeeting)
  const groupChatState = useSelector((state: any) => state.Flag.groupChatState)

  const privateChatParticipant = useSelector(
    (state: any) => state.Main.privateChatParticipant
  )
  const meetingSession = useSelector((state: any) => state.Main.meetingSession)
  const meetingInvite = useSelector((state: any) => state.Main.meetingInvite)
  const meetingInfo = useSelector((state: any) => state.Main.meetingInfo)
  const userName = useSelector((state: any) => state.Main.userName)
  const environmentLevel = useSelector(
    (state: any) => state.Main.environmentLevel
  )
  const dialModal = useSelector((state: any) => state.Flag.DialModal)
  const inviteModal = useSelector((state: any) => state.Flag.InviteModal)
  const fileShareState = useSelector((state: any) => state.Main.fileShareState)
  const participantList = useSelector(
    (state: any) => state.Main.participantList
  )
  const themePalette = useSelector((state: any) => state.Main.themePalette)
  // useEffect(() => {
  //  // hoverTimer(true, dispatch)

  //   return () => {
  //     hoverTimer(false, dispatch)

  //   }

  // },[])
  //LogRocket configuration

  useMemo(() => {
    if (environmentLevel === "testing") {
      LogRocket.init("bqvwvm/hoolva", {
        release: "20221202",
      })
      LogRocket.identify("Hoolva User", {
        name: userName,
        email: `${userName}@example.com`,
        // Add your own custom user variables here, ie:
        subscriptionType: "pro",
      })
    }
    // else if (environmentLevel === "production" || environmentLevel === "codetest") {
    //   LogRocket.init("xmu5tz/hoolva-web-prod", {
    //     release: "20221202",
    //   })
    //   LogRocket.identify("Hoolva User", {
    //     name: userName,
    //     email: `${userName}@example.com`,
    //     // Add your own custom user variables here, ie:
    //     subscriptionType: "pro",
    //   })
    // }
    setupLogRocketReact(LogRocket)
  }, [])

  useEffect(() => {
    if (!meetingSession) {
      navigate(path.AUTHSCREEN)
      // window.location.reload()
    }
  }, [meetingSession])

  useEffect(() => {
    if (hostEndForAll) {
      let modal = new ModalData({
        message: t("Call.HostMsg"),
        type: "HostMessage",
        closeButton: false,
        buttons: [
          {
            buttonName: t("Dashboard.OK"),
            callback: endMeeting,
          },
        ],
      })
      dispatch(actionCreators.addModal(modal))
    }
  }, [hostEndForAll])

  useEffect(() => {
    if (Object.keys(meetingInvite).length === 0) {
      meetingSession
        .meetingInvite(meetingInfo.roomuuid)
        .then((response: any) => {
          dispatch(actionCreators.setMeetingInvite(response))
        })
    }
    if (createMeeting) {
      dispatch(actionCreators.createMeetingState(false))
    }
  })
  const endMeeting = () => {
    // stopTimer();
    dispatch(actionCreators.clearMeetingStore())
    dispatch(actionCreators.setPublisherState(false))
    dispatch(actionCreators.clearMeetingFlags())
    dispatch(actionCreators.clearParticipantList())
    hoverTimer(false, dispatch)

    if (isHost) {
      dispatch(actionCreators.setIsHost(false))
    }
    //navigate(path.FEEDBACK)
    // window.location.reload();
  }

  const closeChat = () => {
    // setGroupChatState(false)
    if (groupChatState) {
      dispatch(actionCreators.setGroupChat(false))
      dispatch(actionCreators.setUnReadGroupChat())
      dispatch(actionCreators.setActiveChat(""))
    }
    if (privateChatState) {
      dispatch(actionCreators.setPrivateChatState(false))
      // dispatch(actionCreators.setUnReadPrivateChat(privateChatParticipant))
      dispatch(actionCreators.setActiveChat(""))
    }
  }
  // const openChat = () => {
  //   dispatch(actionCreators.setGroupChat(true))
  // }

  const handlePopUp = (
    event: any,
    type:
      | "meetingInfoFlag"
      | "endButtonFlag"
      | "moreOptionFlag"
      | "reactionFlag"
      | "filterMenuFlag"
      | "viewFlag"
      | "newChat"
      | "closeAll"
  ) => {
    event.stopPropagation()
    dispatch(actionCreators.setPopUp(type))
    dispatch(actionCreators.setHostControlId(""))
  }

  //leave meeting while closing the tab.
  window.addEventListener("unload", () => {
    meetingSession.leaveMeetingSession()

    hoverTimer(false, dispatch)
  })

  return (
    <div
      id="handlePopupClose"
      onClick={(e) => handlePopUp(e, "closeAll")}
      className={`w-screen h-screen relative overflow-hidden flex  bg-[${themePalette?.primary}]`}
      style={{ backgroundColor: themePalette?.primary }}
    >
      <div
        id="MeetingSection"
        className={
          membersList
            ? "w-[calc(100%-354px)] relative  transition-all ease-linear duration-300"
            : ` w-full relative transition-all ease-linear duration-300`
        }
      >
        <PushNotifications />
        {/* <Notification /> */}
        <Modal isCall={true} />
        <MeetingSection isCall={true} />
      </div>
      {dialModal ? <DialInDialOutModal /> : ""}
      <div
        onClick={() => {}}
        className={
          membersList
            ? `absolute right-0  transition-all ease-linear duration-300 z-[1]`
            : ` absolute -right-96 transition-all ease-linear duration-300`
        }
      >
        {
          <RightSidePanel isCall={true} />
          // <MembersList openChat={openChat} setInviteModal={setInviteModal} inviteModal={inviteModal} />
        }
      </div>
      {inviteModal ? <Invite /> : null}
      {fileShareState.modalState && <FileShareModal />}
    </div>
  )
}

export default memo(CallMainContainer)
