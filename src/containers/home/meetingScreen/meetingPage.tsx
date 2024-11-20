import { memo, useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import MeetingSection from "./meetingSection"
import MembersList from "../../../layout/layout1/components/meetingScreen/membersList/membersList"
import Chat from "../../../layout/layout1/components/meetingScreen/chat/chat"
import Notification from "../../../layout/layout1/components/notification/notification"
import { actionCreators } from "../../../store"
import Modal from "../../../layout/layout1/components/modal/modal"
import FileShareModal from "../../../layout/layout1/components/modal/fileShareModal"
import ModalData from "../../../constructors/modal/modalData"
import { useNavigate } from "react-router-dom"
import path from "../../../navigation/routes.path"
import Invite from "../../../layout/layout1/components/meetingScreen/invite/invite"
import LogRocket from "logrocket"
import setupLogRocketReact from "logrocket-react"
import hoverTimer from "../../../utils/hoverTimer"
import RightSidePanel from "../../../layout/layout1/components/meetingScreen/rightSidePanel/rightSidePanel"
import PushNotifications from "../../../constructors/notification/pushNotifications"
import DialInDialOutModal from "../../../layout/layout1/components/DialInDialOut/DialInDialOutModal"
import { t } from "i18next"

const MeetingPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const membersList = useSelector((state: any) => state.Flag.membersList)
  const privateChatState = useSelector(
    (state: any) => state.Flag.privateChatState
  )
  const isHost = useSelector((state: any) => state.Flag.isHost)
  const hostEndForAll = useSelector((state: any) => state.Flag.hostEndForAll)
  const createMeeting = useSelector((state: any) => state.Flag.createMeeting)
  const groupChatState = useSelector((state: any) => state.Flag.groupChatState)
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
  const logRocketState = useSelector((state: any) => state.Flag.logRocketState)

  //LogRocket configuration

  useMemo(() => {
    if (
      environmentLevel === "testing" ||
      (environmentLevel === "loadtest" && logRocketState)
    ) {
      LogRocket.init("bqvwvm/hoolva", {
        release: "20230428",
      })
      LogRocket.identify("Hoolva User", {
        name: userName,
        // email: `${userName}@${environmentLevel}.${meetingInfo.meetingId}`,
        email: `${userName}_${environmentLevel}_${meetingInfo.meetingId}@hoolva.com`,

        // Add your own custom user variables here, ie:
        subscriptionType: "pro",
      })
    } else if (
      environmentLevel === "production" ||
      environmentLevel === "codetest"
    ) {
      LogRocket.init("xmu5tz/hoolva-web-prod", {
        release: "20221202",
      })
      LogRocket.identify("Hoolva User", {
        name: userName,
        email: `${userName}_${environmentLevel}_${meetingInfo.meetingId}@hoolva.com`,
        // Add your own custom user variables here, ie:
        subscriptionType: "pro",
      })
    }
    setupLogRocketReact(LogRocket)
  }, [])

  useEffect(() => {
    if (Object.keys(meetingInfo).length === 0) {
      navigate(path.AUTHSCREEN)
      // window.location.reload()
    }
  }, [meetingInfo])

  useEffect(() => {
    if (hostEndForAll) {
      let modal = new ModalData({
        message: t("Meeting.TheHostHasEndedTheMeeting"),
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
    hoverTimer(false, dispatch)
    dispatch(actionCreators.clearMeetingStore())
    dispatch(actionCreators.setPublisherState(false))
    dispatch(actionCreators.clearMeetingFlags())
    dispatch(actionCreators.clearParticipantList())
    if (isHost) {
      dispatch(actionCreators.setIsHost(false))
    }
    navigate(path.FEEDBACK)
  }

  const closeChat = () => {
    if (groupChatState) {
      dispatch(actionCreators.setGroupChat(false))
      dispatch(actionCreators.setUnReadGroupChat())
      dispatch(actionCreators.setActiveChat(""))
    }
    if (privateChatState) {
      dispatch(actionCreators.setPrivateChatState(false))
      dispatch(actionCreators.setActiveChat(""))
    }
  }

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
      id="MeetingPage"
      onClick={(e) => handlePopUp(e, "closeAll")}
      className={`w-screen h-screen flex text-center bg-primary`}
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
        <Notification />
        <Modal />
        <MeetingSection />
      </div>
      {dialModal ? <DialInDialOutModal /> : ""}
      <div
        className={
          membersList
            ? `absolute right-0  transition-all ease-linear duration-300 z-[1]`
            : ` absolute -right-96 transition-all ease-linear duration-300`
        }
      >
        {
          groupChatState ? (
            <Chat groupChatState={groupChatState} closeChat={closeChat} />
          ) : privateChatState ? (
            <Chat groupChatState={false} closeChat={closeChat} />
          ) : (
            <RightSidePanel />
          )
          // <MembersList openChat={openChat} setInviteModal={setInviteModal} inviteModal={inviteModal} />
        }
      </div>
      {inviteModal ? <Invite /> : null}
      {fileShareState.modalState && <FileShareModal />}
    </div>
  )
}

export default memo(MeetingPage)
