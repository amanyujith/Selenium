import { useEffect, useState, useMemo, useRef } from "react"
import { useSelector } from "react-redux"
import { Link, Navigate } from "react-router-dom"
import ToolTip from "../../../../../atom/ToolTip/Tooltip"
import { useDispatch } from "react-redux"
import MenuNodeList from "./menuNodeList"
import ExpandclosedIcon from "./Icons/ExpandclosedIcon"
import ExpandedIcon from "./Icons/ExpandedIcon"
import CreateChatIcon from "./Icons/CreateChatIcon"
import CreateGrpIcon from "./Icons/CreateGrpIcon"
import { RootState, actionCreators } from "../../../../../store"
import { ChatSession } from "hdmeet"
import ChatListeners from "./listeners/chatListener"
import ChatCallModal from "./call/ChatCallModal"
import SingleOptionModal from "./reusable/SingleOptionModal"
import { useNavigate } from "react-router-dom"
import path from "../../../../../navigation/routes.path"
import { IGroupData, IUserData, IChatRoot } from "./interfaces"
import CreateGrouppModal from "./CreateGroupModal"
import dataPicker from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { useNotification } from "./hooks/useNotification"
import meetListeners from "../../../../../listeners/meetListeners"
import hoverTimer from "../../../../../utils/hoverTimer"
import InviteUserModal from "./call/addMember"
import RenderInWindow from "./call/popOutCall"
import { t } from "i18next"
import UpdateNotification from "../Notification/updateNotification"
import SettingsItem from "../../../../../atom/SettingsItem/settingsItem"
import Lottiefy from "../../../../../atom/Lottie/lottie"
import * as Grp from "../../../../../atom/Lottie/grpLottie.json"
import * as Chat from "../../../../../atom/Lottie/chatLottie.json"
import UseEscape from "./hooks/useEscape"
const Connected = require("./audio/incoming-outgoing-message/Connected.mp3")
const reConnecting = require("./audio/incoming-outgoing-message/ReconnectingFinal.wav")
const _ = require("lodash")

interface IRoot {
  Chat: IChatRoot
}

const Chats = (props: any) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const keyCloakToken = useSelector((state: any) => state.Main.keyCloakToken)
  const groupadd = useSelector((state: any) => state.Chat.createGrpModal)
  const isReady = useSelector((state: any) => state.Chat.isReady)
  const incomingCall = useSelector((state: any) => state.Chat.incomingCall)
  const modalCustom = useSelector((state: any) => state.Chat.rejectReasonModal)
  const [isWaiting, setIsWaiting] = useState(true)
  const incomingCallModal = useSelector(
    (state: any) => state.Chat.setIncomingCallModal
  )
  const chatInstance = useSelector((state: any) => state.Chat.chatInstance)

  const meetingInstance = useSelector((state: any) => state.Main.meetingSession)

  const keyCloakLoggedInState = useSelector(
    (state: any) => state.Main.keyCloakLoggedInState
  )

  const loggedInUserInfo = useSelector(
    (state: any) => state.Main.loggedInUserInfo
  )
  const { data: activeChat } = useSelector(
    (state: any) => state.Chat.activeChat
  )
const setMultipleSelect = useSelector(
  (state: any) => state.Chat.setMultipleMsgList
);
console.log(setMultipleSelect, "setMultipleSelect");

  const loginState = useSelector((state: any) => state.Flag.loginState)

  const sendNotification = useNotification()
  const buttonRef = useRef<any>(null)
  const grpbuttonRef = useRef<any>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const callEndRoutine = () => {
    dispatch(actionCreators.setChatCallInfo(null))
    dispatch(actionCreators.setPublisherState(false))
    dispatch(actionCreators.clearMeetingStore())
    dispatch(actionCreators.clearMeetingFlags())
    dispatch(actionCreators.clearParticipantList())
    hoverTimer(false, dispatch)
  }

  useEffect(() => {
    return () => {
      chatInstance?.closeConnection()
    }
  }, [])

  const { setOpenTodayMeeting, setProfileSettingsClick } = props
  const usersList = useSelector((state: IRoot) => state.Chat.userData)
  const profileColors = ["#557BBB", "#B78931", "#91785B"]
  const groupsList = useSelector((state: IRoot) => state.Chat.groupData)
  const user = useSelector((state: any) => state.Main.meetingSession)

  const [custom, setCustom] = useState(false)
  const [open, setOpen] = useState(false)
  const [toggle, setToggle] = useState(false)
  const participantList = useSelector(
    (state: any) => state.Main.participantList
  )

  const [msgSubnav, setMsgSubnav] = useState(false)
  const showMsgSubnav = () => setMsgSubnav(!msgSubnav)
  const [grpSubnav, setGrpSubnav] = useState(false)
  const showGrpSubnav = () => setGrpSubnav(!grpSubnav)
  const [callWaiting, setCallWaiting] = useState(false)

  const handleClick = () => {
    dispatch(actionCreators.toggleLeftbar("hidden"))
    // setOpenTodayMeeting(true)mathew
    setOpenTodayMeeting(false)
    setProfileSettingsClick(false)
    dispatch(actionCreators.setChatscreen(false))
  }

  const callInfo = useSelector((state: any) => state.Chat.chatCallInfo)
  const group = useSelector((state: any) => state.Chat.createGrpOption)
  const chat = useSelector((state: any) => state.Chat.setNewChatOption)
  const userInviteModal = useSelector(
    (state: any) => state.Flag.userInviteModal
  )
  const brandingInfo = useSelector((state: any) => state.Main.brandingInfo)
  const meetingInfo = useSelector((state: any) => state.Main.meetingInfo)
  const kickOut = useSelector((state: any) => state.Chat.kickOut)
  const selfData = useSelector((state: RootState) => state.Chat.selfData)
  const scrollableRef = useRef<HTMLDivElement>(null)
  const callData = useSelector((state: any) => state.Chat.callData)
  const callConnected = useSelector((state: any) => state.Chat.callConnected)
  const callToggleFlag = useSelector((state: any) => state.Chat.callToggleFlag)
  const callReconnection = useSelector(
    (state: RootState) => state.Chat.callReconnection
  )
  const [endCall, setEndCall] = useState(false)
  const callMeetingData = useSelector(
    (state: any) => state.Chat.callMeetingData
  )
  useEffect(() => {
    if (kickOut == "kick") {
      chatInstance?.publishMessage("call", callInfo.uuid, callInfo.isGroup, {
        message: {
          action: "end",
          meetingId: callData.meetingId,
        },
      })
      chatInstance?.grafanaLogger(["Client : Kicked Out from Call"])
      setTimeout(() => {
        // chatInstance
        //   .UpdateCallInfo(callData.meetingId, callInfo.isGroup)
        //   .then((res: any) => {
        //     chatInstance?.grafanaLogger([
        //       "Client : Call Rejected",
        //       { from: incomingCall.from },
        //     ]);
        //
        //   })
        //   .catch((err: any) => {
        //
        //   });
        dispatch(actionCreators.setChatCallInfo(null))
      }, 2000)
    }
  }, [kickOut])

  useEffect(() => {
    if (callInfo === null) {
      dispatch(actionCreators.kickOut(""))
      dispatch(actionCreators.callToggleFlag(false))
    }
  }, [callInfo])

  useEffect(() => {
    if (isReady) {
      setMsgSubnav(true)
      setGrpSubnav(true)
    }
  }, [isReady])

  useEffect(() => {
    if (!incomingCall && participantList && callInfo === null) {
      meetingInstance.leaveMeetingSession()
      dispatch(actionCreators.callToggleFlag(false))
      dispatch(actionCreators.callConnected(false))
      callEndRoutine()
      chatInstance?.grafanaLogger(["Client : Left MeetingSession"])
    }
    if (incomingCall === null) {
      setCallWaiting(false)
    }
  }, [incomingCall])

  const createGroup = () => {
    dispatch(actionCreators.setCreateGrpModal(true))
    dispatch(actionCreators.setCreateGrpOption(false))
  }

  const routeChange = () => {
    dispatch(actionCreators.setChatscreen(true))
    navigate(`${path.CALLS}`)
  }

  const routeChangeToList = () => {
    // if (chatScreen === true) {
    //   dispatch(actionCreators.setChatscreen(true));
    //   props.searchBox();
    // }
    dispatch(actionCreators.setChatscreen(true))
    navigate(`${path.LIST}`)
  }

  const pastNav = () => {
    navigate(`${path.PAST}`)
    dispatch(actionCreators.setChatscreen(false))
  }

  const onclick = () => {
    dispatch(actionCreators.setChatscreen(true))
  }

  const newgrp = (e: any) => {
    e.stopPropagation()
    dispatch(actionCreators.setCreateGrpOption(!group))
  }

  const newChat = (e: any) => {
    e.stopPropagation()
    dispatch(actionCreators.setNewChatOption(!chat))
  }

  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (
        event.keyCode === 72 &&
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey
      ) {
        if (incomingCall) {
          onCallAccept(false)
        }
      }
    }
    window.addEventListener("keydown", handleKeyPress)

    return () => {
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [incomingCall])

  useEffect(() => {}, [usersList])

  useEffect(() => {
    if (isWaiting && participantList.length > 1) {
      setIsWaiting(false)
    }
    const participant_id = participantList.map((user: any) => {
      return user.participant_id
    })
    chatInstance?.grafanaLogger([
      "Client : Call ParticipantList",
      {
        participantData: participant_id,
      },
    ])
  }, [participantList.length])

  useEffect(() => {
    if (endCall && callConnected) {
      setEndCall(false)
      dispatch(actionCreators.callConnected(false))
      chatInstance?.publishMessage("call", callInfo.uuid, callInfo.isGroup, {
        message: {
          action: callToggleFlag ? "end" : "terminate",
          meetingId: callData.meetingId,
        },
        callAction: callToggleFlag ? "" : "terminate",
      })

      // chatInstance
      // .UpdateCallInfo(callData.meetingId, callInfo.isGroup)
      // .then((res: any) => {
      //
      // })
      // .catch((err: any) => {
      //
      // });

      const data = {
        audioCall: false,
        videoCall: false,
        profile_picture: null,
        name: null,
      }
      meetingInstance.leaveMeetingSession()
      dispatch(actionCreators.callToggleFlag(false))
      dispatch(actionCreators.setChatCallInfo(null))
      dispatch(actionCreators.setPublisherState(false))
      dispatch(actionCreators.clearMeetingStore())
      dispatch(actionCreators.clearMeetingFlags())
      dispatch(actionCreators.clearParticipantList())
      hoverTimer(false, dispatch)
    }
  }, [endCall, callConnected])

  useMemo(() => {
    if (callInfo) {
      if (callReconnection) {
        console.log("Reconnection")
        audioRef?.current?.play()
      } else {
        console.log("Reconnection.222")
        audioRef?.current?.pause()
      }
    } else {
      console.log("Reconnection.1111")
      audioRef?.current?.pause()
      dispatch(actionCreators.callReconnection(false))
    }
  }, [callReconnection, callInfo])

  // useEffect(() => {

  //
  // if(loginState === false) {
  //   navigate(path.HOME);
  // }

  // },[keyCloakLoggedInState, loginState])

  if (keyCloakLoggedInState === false) {
    return (
      <div
        className={`w-screen h-screen absolute top-0 left-0 flex justify-center items-center z-10 bg-[#000000]`}
      >
        <div className="top-0 left-0 flex justify-center flex-col items-center text-[#ffffff]">
          {t("Dashboard.UserIsLoggedout")}
          <button
            className="bg-[background] px-5 py-1 m-3"
            onClick={() => {
              navigate(path.HOME)
            }}
          >
            {t("Dashboard.OK")}
          </button>
        </div>
      </div>
    )
  }

  const onCallAccept = (video: boolean) => {
    dispatch(actionCreators.callToggle(incomingCall))
    dispatch(actionCreators.setIncomingCallModal(false))
    setCallWaiting(false)
    dispatch(actionCreators.unsetIncomingCall(true))
    if (callInfo) {
      meetingInstance.leaveMeetingSession()
      dispatch(actionCreators.callToggleFlag(false))
      dispatch(actionCreators.callConnected(false))
      // chatInstance?.grafanaLogger(["Client : Left MeetingSession",callInfo.uuid,])
      chatInstance?.publishMessage("call", callInfo.uuid, callInfo.isGroup, {
        message: {
          action:
            !callToggleFlag ||
            isWaiting ||
            incomingCall?.from === callInfo?.uuid
              ? "terminate"
              : "end",
          meetingId: callData.meetingId,
        },
        callAction:
          !callToggleFlag || isWaiting || incomingCall?.from === callInfo?.uuid
            ? "terminate"
            : "",
      })
      setTimeout(() => {
        // chatInstance
        //   .UpdateCallInfo(callData.meetingId, callInfo.isGroup)
        //   .then((res: any) => {
        //
        //   })
        //   .catch((err: any) => {
        //
        //   });
      }, 2000)
    }
    dispatch(actionCreators.setPublisherState(false))
    dispatch(actionCreators.clearMeetingStore())
    dispatch(actionCreators.clearMeetingFlags())
    dispatch(actionCreators.clearParticipantList())

    dispatch(actionCreators.setChatCallInfo(incomingCall.body.data))
    dispatch(actionCreators.setChatCallMic(incomingCall.body.data.audioCall))
    dispatch(actionCreators.setChatCallCamera(video))
    meetingInstance
      .preAuth({
        meetingId: incomingCall.body.meetingId,
        password: incomingCall.body.meetingData.password,
      })
      .then(async (response: any) => {
        dispatch(actionCreators.setIsHost(response.host))
        dispatch(actionCreators.setMeetingId(incomingCall.body.meetingId))
        dispatch(actionCreators.setMeetingInfo(response))
        dispatch(actionCreators.callData(_.cloneDeep(response)))

        hoverTimer(true, dispatch)
        await meetingInstance.startMeetingSession(
          incomingCall.body.data.audioCall,
          video,
          selfData?.display_name ?? loggedInUserInfo?.name
        )
        chatInstance?.publishMessage(
          "call",
          incomingCall.from,
          incomingCall.body.data.isGroup,
          {
            message: {
              action: "join",
              meetingId: incomingCall.body.meetingId,
              meetingData: response,
              type: incomingCall.body.action,
              data: {
                name: selfData?.display_name ?? loggedInUserInfo?.name,
                profile_picture:
                  selfData?.profile_picture ?? loggedInUserInfo?.picture,
                uuid: loggedInUserInfo?.sub,
                password: incomingCall.body.meetingData.password,
              },
            },
            callAction: "join",
          }
        )
        dispatch(actionCreators.callConnected(true))
        meetListeners(
          dispatch,
          navigate,
          participantList,
          user,
          true,
          chatInstance,
          meetingInfo,
          callInfo
        )
      })
      .catch((error: any) => {
        chatInstance?.grafanaLogger([
          "Client : Call Initialisation Failed",
          {
            error: error,
          },
        ])
        dispatch(actionCreators.setChatCallInfo(null))
        dispatch(actionCreators.setPublisherState(false))
        dispatch(actionCreators.clearMeetingStore())
        dispatch(actionCreators.clearMeetingFlags())
        dispatch(actionCreators.clearParticipantList())
        hoverTimer(false, dispatch)

        throw error
      })
  }

  const onReject = (hangup: boolean) => {
    if (hangup) {
      dispatch(actionCreators.callToggle(incomingCall))
      setCallWaiting(false)
      dispatch(actionCreators.setIncomingCallModal(false))
      dispatch(actionCreators.unsetIncomingCall(true))

      if (incomingCall.body.action === "initiate") {
        chatInstance?.publishMessage(
          "call",
          incomingCall.from,
          incomingCall.body.data.isGroup,
          {
            message: {
              action: "terminate",
              meetingId: incomingCall.body.meetingId,
              host: incomingCall.from,
            },
            callAction: "terminate",
          }
        )
        // chatInstance
        //   .UpdateCallInfo(incomingCall.body.meetingId, callInfo.isGroup)
        //   .then((res: any) => {
        //
        //   })
        //   .catch((err: any) => {
        //
        //   });
      }
    } else {
      setCallWaiting(true)
      dispatch(actionCreators.setIncomingCallModal(false))
    }
  }

  const handleToggleNext = () => {
    setOpen(true)
    setToggle(true)
  }
  const answerLater = () => {
    chatInstance?.publishMessage(
      "call",
      loggedInUserInfo.sub,
      incomingCall.body.data.isGroup,
      {
        message: {
          action: "answerlater",
          meetingId: incomingCall.body.meetingId,
        },
      }
    )
    dispatch(actionCreators.setIncomingCallModal(false))
  }

    


  return (
    <div>
      <audio ref={audioRef} src={reConnecting} loop={true} />
      <UpdateNotification sendNotification={sendNotification} />
      {/* second person Waiting Placeholder */}

      {/* <div className="border-solid border-[#f7931f] shadow-[0px_4px_12px_0px_rgba(0,_0,_0,_0.25)] bg-primary flex flex-row justify-center gap-1 w-full h-8 items-center self-stretch px-1 border-2 rounded-sm p-2">
        <div className="border-solid border-[#a7a9ab] bg-white flex flex-col justify-start w-5 shrink-0 items-center p-px border roundedtl-[44.4444465637207px] roundedtr-[44.4444465637207px] roundedbr-[44.4444465637207px]">
          <div className="bg-[#c4c4c4] flex flex-col justify-start w-4 items-center px-1 py-0 roundedtl-[44.4444465637207px] roundedtr-[44.4444465637207px] roundedbr-[44.4444465637207px]">
            <div className="text-center text-xs font-sans text-primary-200 w-full">
              S
            </div>
          </div>
        </div>
        <div className="whitespace-nowrap text-xs font-sans text-[#ffffff] w-full">
          Awaiting Sidharth to join
        </div>
        <div className="text-xs font-sans text-[#f65e1c] w-18 shrink-0">
          Disconnect
        </div>
      </div> */}

      {/* placeholder for call waiting */}
      {incomingCall && (
        <div className="border-solid border-main shadow-[0px_4px_12px_0px_rgba(0,_0,_0,_0.25)] bg-[#293241] flex flex-col justify-between gap-1 w-[97%] ml-2 h-[206px] mt-1 rounded-[7px]  p-4  ">
          <div className="flex flex-row">
            <div className="w-[22px] h-[22px] flex justify-center items-center rounded-bl-none rounded-[50%] border-[2px] border-[#E9EBF8] text-[white] bg-[#91785B] overflow-hidden shrink-0">
              {incomingCall.body?.data?.profile_picture &&
              incomingCall?.body?.data?.profile_picture !== "undefined" ? (
                <img
                  src={incomingCall?.body?.data?.profile_picture}
                  className="min-h-0 min-w-0 w-6"
                  alt=""
                />
              ) : incomingCall?.body?.data?.isGroup ? (
                <svg
                  className="min-h-0 min-w-0 w-4 "
                  viewBox="0 0 16 7"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.01927 3.33333C6.77483 3.33333 6.57216 3.23889 6.41127 3.05C6.24994 2.86111 6.19149 2.63889 6.23594 2.38333L6.4026 1.35C6.46927 0.961111 6.65549 0.638889 6.96127 0.383333C7.2666 0.127778 7.61371 0 8.0026 0C8.4026 0 8.75549 0.127778 9.06127 0.383333C9.3666 0.638889 9.5526 0.961111 9.61927 1.35L9.78594 2.38333C9.83038 2.63889 9.77216 2.86111 9.61127 3.05C9.44994 3.23889 9.24705 3.33333 9.0026 3.33333H7.01927ZM7.2526 2.33333H8.76927L8.63594 1.51667C8.61371 1.36111 8.54149 1.236 8.41927 1.14133C8.29705 1.04711 8.15816 1 8.0026 1C7.84705 1 7.71083 1.04711 7.59394 1.14133C7.47749 1.236 7.40816 1.36111 7.38594 1.51667L7.2526 2.33333ZM2.28594 3.88333C2.07483 3.89444 1.88883 3.85267 1.72794 3.758C1.5666 3.66378 1.46372 3.51667 1.41927 3.31667C1.39705 3.22778 1.39149 3.14156 1.4026 3.058C1.41372 2.97489 1.43594 2.89444 1.46927 2.81667C1.46927 2.82778 1.46372 2.80556 1.4526 2.75C1.44149 2.72778 1.39705 2.61667 1.31927 2.41667C1.29705 2.29444 1.31105 2.18333 1.36127 2.08333C1.41105 1.98333 1.46927 1.89444 1.53594 1.81667C1.54705 1.81667 1.55816 1.80556 1.56927 1.78333C1.59149 1.60556 1.6666 1.45556 1.7946 1.33333C1.92216 1.21111 2.08038 1.15 2.26927 1.15C2.29149 1.15 2.38038 1.16667 2.53594 1.2H2.58594C2.63038 1.14444 2.69149 1.10556 2.76927 1.08333C2.84705 1.06111 2.92483 1.05 3.0026 1.05C3.11372 1.05 3.21105 1.06667 3.2946 1.1C3.37772 1.13333 3.44149 1.18333 3.48594 1.25C3.49705 1.25 3.50549 1.25267 3.51127 1.258L3.51927 1.26667C3.6526 1.27778 3.76927 1.31933 3.86927 1.39133C3.96927 1.46378 4.04705 1.56111 4.1026 1.68333C4.11372 1.75 4.11927 1.81111 4.11927 1.86667C4.11927 1.92222 4.10816 1.98333 4.08594 2.05L4.1026 2.1C4.16927 2.17778 4.21927 2.25267 4.2526 2.32467C4.28594 2.39711 4.3026 2.47778 4.3026 2.56667C4.3026 2.6 4.27483 2.7 4.21927 2.86667V2.93333C4.23038 2.94444 4.24149 3.02222 4.2526 3.16667C4.2526 3.36667 4.16927 3.536 4.0026 3.67467C3.83594 3.81378 3.63594 3.88333 3.4026 3.88333H2.28594ZM13.1859 3.91667C12.8637 3.91667 12.5915 3.80556 12.3693 3.58333C12.147 3.36111 12.0359 3.09444 12.0359 2.78333C12.0359 2.66111 12.0526 2.55289 12.0859 2.45867C12.1193 2.364 12.1637 2.26667 12.2193 2.16667L11.8193 1.81667C11.7193 1.73889 11.7026 1.64444 11.7693 1.53333C11.8359 1.42222 11.9248 1.36667 12.0359 1.36667H13.1693C13.4915 1.36667 13.7637 1.47778 13.9859 1.7C14.2082 1.92222 14.3193 2.18889 14.3193 2.5V2.78333C14.3193 3.09444 14.2082 3.36111 13.9859 3.58333C13.7637 3.80556 13.497 3.91667 13.1859 3.91667ZM0.335938 6.86667V6.05C0.335938 5.59445 0.569271 5.22778 1.03594 4.95C1.5026 4.67222 2.1026 4.53333 2.83594 4.53333C2.98038 4.53333 3.11371 4.536 3.23594 4.54133C3.35816 4.54711 3.47483 4.56111 3.58594 4.58333C3.46372 4.78333 3.36927 4.99444 3.3026 5.21667C3.23594 5.43889 3.2026 5.67222 3.2026 5.91667V6.86667H0.335938ZM4.33594 6.86667V5.95C4.33594 5.30556 4.67483 4.79178 5.3526 4.40867C6.03038 4.02511 6.91371 3.83333 8.0026 3.83333C9.1026 3.83333 9.98883 4.02511 10.6613 4.40867C11.3333 4.79178 11.6693 5.30556 11.6693 5.95V6.86667H4.33594ZM13.1693 4.53333C13.9137 4.53333 14.5164 4.67222 14.9773 4.95C15.4386 5.22778 15.6693 5.59445 15.6693 6.05V6.86667H12.8026V5.91667C12.8026 5.67222 12.7719 5.43889 12.7106 5.21667C12.6497 4.99444 12.5582 4.78333 12.4359 4.58333C12.5582 4.56111 12.6804 4.54711 12.8026 4.54133C12.9248 4.536 13.047 4.53333 13.1693 4.53333ZM8.0026 4.83333C7.31371 4.83333 6.71927 4.92489 6.21927 5.108C5.71927 5.29156 5.44149 5.51667 5.38594 5.78333V5.86667H10.6359V5.78333C10.5693 5.51667 10.2888 5.29156 9.7946 5.108C9.29994 4.92489 8.7026 4.83333 8.0026 4.83333Z"
                    fill="#ffffff"
                  />
                </svg>
              ) : (
                <div className="bg-[#91785B] flex flex-col justify-start w-5 items-center py-[2px] pl-[3px] capitalize">
                  <div className="flex flex-col justify-start w-4 items-center px-1 py-0 ">
                    <div className="text-center text-xs font-sans font-semibold text-[#FFFFFF] w-full self-center mr-[6px]">
                      {incomingCall?.body?.data?.name?.slice(0, 1)}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="whitespace-nowrap text-[16px] ml-2 font-sans text-[#ffff] max-w-[170px] truncate ">
              {incomingCall?.body?.data?.isGroup
                ? incomingCall?.body?.data?.groupName
                : incomingCall?.body?.data?.name}{" "}
            </div>
          </div>
          <div className="text-[#B1B1B1] text-[16px] italic text-center">
            Calling you...
          </div>
          <div className="flex flex-row items-center justify-end">
            <button
              className="text-[14px] font-sans h-[35px] w-[100px]  text-[#F74B14] mr-1 rounded-[7px] shrink-0"
              onClick={() => onReject(true)}
            >
              Reject
            </button>
            <button
              className="bg-[#E57600] font-bold hover:bg-[#CC6900] text-[#FFFFFF] flex flex-col justify-center h-[35px] w-[100px] shrink-0 items-center  py-px rounded-[7px]"
              onClick={() => onCallAccept(false)}
            >
              <div className="text-[14px] font-sans text-[#293241] w-full">
                Answer
              </div>
            </button>
          </div>
        </div>
      )}

      <div className="p-1">
        {callInfo && !endCall ? (
          <ChatCallModal setEndCall={setEndCall} endCall={endCall} />
        ) : null}
        {incomingCallModal && incomingCall && (
          <RenderInWindow
            title="Incoming Call"
            onAccept={onCallAccept}
            onClose={onReject}
            existingCallInfo={callInfo}
            incomingCallData={incomingCall?.body?.data}
            answerLater={answerLater}
          />
        )}
      </div>
      {/* <div className="hover:bg-[#FEF3E6]">
        <Link to="">
          <SettingsItem label={"Dashboard"}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.75 11.1246V17.625C18.75 17.9234 18.6315 18.2095 18.4205 18.4205C18.2095 18.6315 17.9234 18.75 17.625 18.75H14.8125C14.5141 18.75 14.228 18.6315 14.017 18.4205C13.806 18.2095 13.6875 17.9234 13.6875 17.625V14.8125C13.6875 14.6633 13.6282 14.5203 13.5227 14.4148C13.4173 14.3093 13.2742 14.25 13.125 14.25H10.875C10.7258 14.25 10.5827 14.3093 10.4773 14.4148C10.3718 14.5203 10.3125 14.6633 10.3125 14.8125V17.625C10.3125 17.9234 10.194 18.2095 9.98299 18.4205C9.77202 18.6315 9.48587 18.75 9.1875 18.75H6.375C6.07663 18.75 5.79048 18.6315 5.5795 18.4205C5.36853 18.2095 5.25 17.9234 5.25 17.625V11.1246C5.24998 10.9689 5.28227 10.8149 5.34485 10.6723C5.40742 10.5298 5.4989 10.4017 5.61352 10.2964L11.2385 4.98917L11.2462 4.98143C11.4533 4.79309 11.7232 4.68872 12.0032 4.68872C12.2831 4.68872 12.553 4.79309 12.7601 4.98143C12.7625 4.98418 12.7651 4.98677 12.7678 4.98917L18.3928 10.2964C18.5063 10.4023 18.5966 10.5306 18.6581 10.6731C18.7195 10.8157 18.7508 10.9694 18.75 11.1246Z"
                fill="#5C6779"
              />
            </svg>
          </SettingsItem>
        </Link>
      </div> */}
      <div
        className={`${
          callInfo || incomingCall
            ? "h-[calc(100vh-400px)]"
            : "h-[calc(100vh-150px)]"
        } flex flex-col ml-[2px]`}
      >
        <div className={` ${msgSubnav ? "h-[55%] max-h-[24.5rem]" : "h-auto"}`}>
          <div className="h-full">
            <div className="text-sm font-normal text-[#293241] flex flex-row">
              <div className="px-3 pr-2.5 flex items-center w-full text-sm rounded-[8px] hover:bg-[#FEF3E6] py-2">
                <button
                  onClick={showMsgSubnav}
                  className="content-center flex justify-center "
                >
                  {msgSubnav === true ? <ExpandedIcon /> : <ExpandclosedIcon />}
                  <div className="ml-4 text-sm w-[150px] flex justify-start">
                    {t("Chat.Direct")}
                  </div>
                </button>
                <div className="inset-y-0 w-full flex flex-row-reverse justify-start">
                  <ToolTip
                    content={t("Chat.NewChat")}
                    direction="right"
                    onclick={!chat}
                  >
                    <button
                      className="w-[27px] h-[28px]  place-content-center"
                      onClick={routeChangeToList}
                      ref={buttonRef}
                    >
                      <div
                        className="text-xl border-[1px] rounded-[5px] border-[#EEEEEE] py-1 flex justify-center text-[#D9D9D9]"
                        ref={buttonRef}
                      >
                        <svg
                          ref={grpbuttonRef}
                          xmlns="http://www.w3.org/2000/svg"
                          width="17"
                          height="17"
                          viewBox="0 0 18 18"
                          fill="none"
                        >
                          <path
                            d="M10.0522 3.28846C10.0522 2.71406 9.58732 2.25 9.0119 2.25C8.43649 2.25 7.97161 2.71406 7.97161 3.28846V7.96154H3.29029C2.71488 7.96154 2.25 8.4256 2.25 9C2.25 9.5744 2.71488 10.0385 3.29029 10.0385H7.97161V14.7115C7.97161 15.2859 8.43649 15.75 9.0119 15.75C9.58732 15.75 10.0522 15.2859 10.0522 14.7115V10.0385H14.7335C15.3089 10.0385 15.7738 9.5744 15.7738 9C15.7738 8.4256 15.3089 7.96154 14.7335 7.96154H10.0522V3.28846Z"
                            fill="#5C6779"
                          />
                        </svg>
                      </div>
                    </button>
                  </ToolTip>
                </div>
              </div>
            </div>

            <div onClick={onclick} className="h-[calc(100%-44px)]">
              {msgSubnav && (
                <div
                  ref={scrollableRef}
                  className={`  ${
                    group
                      ? "overflow-y-clip "
                      : "overflow-y-auto overflow-x-clip"
                  }  h-full
                 mb-1`}
                >
                  {!isReady && Loader}
                  {usersList.length !== 0
                    ? usersList.map((item: IUserData, index: number) => {
                        if (item?.status !== "deleted") {
                          let colorIndex =
                            (item?.uuid.match(/\d/g).join("") +
                              new Date().getDate()) %
                            profileColors.length;
                          return (
                            <>
                              <MenuNodeList
                                messageRecieved={item.messageRecieved}
                                key={item.uuid}
                                uuid={item.uuid}
                                index={index}
                                name={
                                  item.display_name
                                    ? item?.display_name
                                    : item.firstname
                                    ? item.firstname + " " + item.lastname
                                    : null
                                }
                                isGroup={false}
                                profile_picture={item.profile_picture}
                                presence={item.presence}
                                callDetails={item.call_details}
                                unread={item.unread_msg_count}
                                isTyping={item?.isTyping}
                                status={item?.personal_status?.[0]}
                                color={profileColors[colorIndex]}
                              ></MenuNodeList>
                            </>
                          );
                        }
                      })
                    : isReady && (
                        <div className="py-5 pr-1 flex flex-col">
                          <Lottiefy
                            loop={true}
                            json={Chat}
                            height={100}
                            width={100}
                          />
                          <div
                            onClick={routeChangeToList}
                            className="self-center mt-3 cursor-pointer px-2 py-1 rounded-[8px] flex items-center border-[1px] w-fit border-[#B1B1B1] text-[#293241] bg-[#FEF4E9]"
                          >
                            New Chat
                          </div>
                        </div>
                      )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={`${grpSubnav ? "h-[45%]" : "h-auto"}`}>
          {/* groups section */}
          <div className="h-full">
            <div className="text-sm font-normal text-[#293241] flex flex-row">
              <div className="px-3 pr-2.5 flex items-center w-full text-sm rounded-[8px] hover:bg-[#FEF3E6] py-2">
                <button
                  onClick={showGrpSubnav}
                  className="content-center flex justify-center"
                >
                  {grpSubnav === true ? <ExpandedIcon /> : <ExpandclosedIcon />}
                  <div className="ml-4 text-sm w-4/5 flex justify-start">
                    {t("Chat.Groups")}
                  </div>
                </button>
                <div className="inset-y-0 right-0 w-full flex flex-row-reverse ">
                  <ToolTip
                    content={"New group"}
                    direction="right"
                    onclick={!group}
                  >
                    <button
                      className=" w-[27px] h-[28px] place-content-center"
                      onClick={createGroup}
                      ref={grpbuttonRef}
                    >
                      <div
                        className="text-xl border-[1px] rounded-[5px] border-[#EEEEEE] py-1 flex justify-center text-[#D9D9D9] "
                        ref={grpbuttonRef}
                      >
                        <svg
                          ref={grpbuttonRef}
                          xmlns="http://www.w3.org/2000/svg"
                          width="17"
                          height="17"
                          viewBox="0 0 18 18"
                          fill="none"
                        >
                          <path
                            d="M10.0522 3.28846C10.0522 2.71406 9.58732 2.25 9.0119 2.25C8.43649 2.25 7.97161 2.71406 7.97161 3.28846V7.96154H3.29029C2.71488 7.96154 2.25 8.4256 2.25 9C2.25 9.5744 2.71488 10.0385 3.29029 10.0385H7.97161V14.7115C7.97161 15.2859 8.43649 15.75 9.0119 15.75C9.58732 15.75 10.0522 15.2859 10.0522 14.7115V10.0385H14.7335C15.3089 10.0385 15.7738 9.5744 15.7738 9C15.7738 8.4256 15.3089 7.96154 14.7335 7.96154H10.0522V3.28846Z"
                            fill="#5C6779"
                          />
                        </svg>
                      </div>
                    </button>
                  </ToolTip>
                </div>
              </div>
            </div>

            <div onClick={onclick} className="h-[calc(100%-43px)]">
              {grpSubnav && (
                <div
                  ref={scrollableRef}
                  className="overflow-y-auto overflow-x-clip  h-full"
                >
                  {!isReady && Loader}
                  {groupsList.length !== 0
                    ? groupsList.map((item: IGroupData, index: number) => {
                        let colorIndex =
                          (item?.uuid.match(/\d/g).join("") +
                            new Date().getDate()) %
                          profileColors.length;
                        return (
                          <MenuNodeList
                            key={item.uuid}
                            messageRecieved={item.messageRecieved}
                            uuid={item.uuid}
                            name={item.name}
                            index={index}
                            isGroup={true}
                            profile_picture={item.profile_picture}
                            callDetails={item.call_details}
                            presence={item.status}
                            unread={item.unread_msg_count}
                            isTyping={item?.isTyping}
                            admin={item?.admin}
                            privategrp={item.private}
                            color={profileColors[colorIndex]}
                          ></MenuNodeList>
                        );
                      })
                    : isReady && (
                        <div className="py-5 pr-1 flex flex-col">
                          <Lottiefy
                            loop={true}
                            json={Grp}
                            height={100}
                            width={100}
                          />
                          <div
                            onClick={createGroup}
                            className="self-center mt-3 cursor-pointer px-2 py-1 rounded-[8px] flex items-center border-[1px] w-fit border-[#B1B1B1] text-[#293241] bg-[#FEF4E9]"
                          >
                            New Group
                          </div>
                        </div>
                      )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* <div className="mt-2">
        <SettingsItem label={"Meetings"}>
          <svg
            width="24"
            height="11"
            viewBox="0 0 24 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.5 10.8008V9.57578C0.5 8.89245 0.85 8.34245 1.55 7.92578C2.25 7.50911 3.15 7.30078 4.25 7.30078C4.46667 7.30078 4.66667 7.30478 4.85 7.31278C5.03333 7.32145 5.20833 7.34245 5.375 7.37578C5.19167 7.67578 5.05 7.99245 4.95 8.32578C4.85 8.65911 4.8 9.00911 4.8 9.37578V10.8008H0.5ZM6.5 10.8008V9.42578C6.5 8.45911 7.00833 7.68845 8.025 7.11378C9.04167 6.53845 10.3667 6.25078 12 6.25078C13.65 6.25078 14.9793 6.53845 15.988 7.11378C16.996 7.68845 17.5 8.45911 17.5 9.42578V10.8008H6.5ZM19.2 10.8008V9.37578C19.2 9.00911 19.154 8.65911 19.062 8.32578C18.9707 7.99245 18.8333 7.67578 18.65 7.37578C18.8333 7.34245 19.0167 7.32145 19.2 7.31278C19.3833 7.30478 19.5667 7.30078 19.75 7.30078C20.8667 7.30078 21.7707 7.50911 22.462 7.92578C23.154 8.34245 23.5 8.89245 23.5 9.57578V10.8008H19.2ZM4.25 6.32578C3.78333 6.32578 3.38333 6.15478 3.05 5.81278C2.71667 5.47145 2.55 5.06745 2.55 4.60078C2.55 4.13411 2.71667 3.73411 3.05 3.40078C3.38333 3.06745 3.78333 2.90078 4.25 2.90078C4.73333 2.90078 5.14167 3.06745 5.475 3.40078C5.80833 3.73411 5.975 4.13411 5.975 4.60078C5.975 5.06745 5.80833 5.47145 5.475 5.81278C5.14167 6.15478 4.73333 6.32578 4.25 6.32578ZM19.75 6.32578C19.2833 6.32578 18.8833 6.15478 18.55 5.81278C18.2167 5.47145 18.05 5.06745 18.05 4.60078C18.05 4.13411 18.2167 3.73411 18.55 3.40078C18.8833 3.06745 19.2833 2.90078 19.75 2.90078C20.2333 2.90078 20.6377 3.06745 20.963 3.40078C21.2877 3.73411 21.45 4.13411 21.45 4.60078C21.45 5.06745 21.2877 5.47145 20.963 5.81278C20.6377 6.15478 20.2333 6.32578 19.75 6.32578ZM12 5.50078C11.2833 5.50078 10.671 5.24678 10.163 4.73878C9.65433 4.23011 9.4 3.61745 9.4 2.90078C9.4 2.16745 9.65433 1.55078 10.163 1.05078C10.671 0.550781 11.2833 0.300781 12 0.300781C12.7333 0.300781 13.35 0.550781 13.85 1.05078C14.35 1.55078 14.6 2.16745 14.6 2.90078C14.6 3.61745 14.35 4.23011 13.85 4.73878C13.35 5.24678 12.7333 5.50078 12 5.50078Z"
              fill="#A7A9AB"
            />
          </svg>
        </SettingsItem>
      </div> */}
      {/* <div onClick={routeChange}>
        <SettingsItem label={"Calls"}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.4234 17.45C14.4901 17.45 12.5694 16.9873 10.6614 16.062C8.75277 15.1373 7.04844 13.925 5.54844 12.425C4.04844 10.925 2.8361 9.225 1.91144 7.325C0.986104 5.425 0.523438 3.5 0.523438 1.55C0.523438 1.25 0.623437 1 0.823437 0.8C1.02344 0.6 1.27344 0.5 1.57344 0.5H4.82344C5.0901 0.5 5.3191 0.579 5.51044 0.737C5.70244 0.895667 5.82344 1.1 5.87344 1.35L6.44844 4.3C6.48177 4.55 6.47344 4.775 6.42344 4.975C6.37344 5.175 6.2651 5.35 6.09844 5.5L3.82344 7.75C4.60677 9.08333 5.5441 10.2917 6.63544 11.375C7.72744 12.4583 8.96511 13.4 10.3484 14.2L12.5734 11.95C12.7401 11.7833 12.9361 11.6667 13.1614 11.6C13.3861 11.5333 13.6151 11.5167 13.8484 11.55L16.6234 12.125C16.8734 12.175 17.0778 12.2917 17.2364 12.475C17.3944 12.6583 17.4734 12.8833 17.4734 13.15V16.4C17.4734 16.7 17.3734 16.95 17.1734 17.15C16.9734 17.35 16.7234 17.45 16.4234 17.45Z"
              fill="#A7A9AB"
            />
          </svg>
        </SettingsItem>
      </div> */}
      {/* <div onClick={pastNav}>
        <SettingsItem label={"History"}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.97188 17.5C6.80521 17.5 4.91754 16.7877 3.30887 15.363C1.70087 13.9377 0.780208 12.15 0.546875 10H2.07187C2.32187 11.7333 3.09688 13.1667 4.39688 14.3C5.69688 15.4333 7.22188 16 8.97188 16C10.9219 16 12.5762 15.3207 13.9349 13.962C15.2929 12.604 15.9719 10.95 15.9719 9C15.9719 7.05 15.2929 5.39567 13.9349 4.037C12.5762 2.679 10.9219 2 8.97188 2C7.88854 2 6.86788 2.24167 5.90987 2.725C4.95121 3.20833 4.13021 3.875 3.44687 4.725H6.04688V6.225H0.971875V1.15H2.47187V3.525C3.28854 2.55833 4.26354 1.81233 5.39687 1.287C6.53021 0.762334 7.72188 0.5 8.97188 0.5C10.1552 0.5 11.2635 0.725 12.2969 1.175C13.3302 1.625 14.2302 2.23333 14.9969 3C15.7635 3.76667 16.3675 4.66267 16.8089 5.688C17.2509 6.71267 17.4719 7.81667 17.4719 9C17.4719 10.1833 17.2509 11.2873 16.8089 12.312C16.3675 13.3373 15.7635 14.2333 14.9969 15C14.2302 15.7667 13.3302 16.375 12.2969 16.825C11.2635 17.275 10.1552 17.5 8.97188 17.5ZM11.9719 13.025L8.24687 9.3V4H9.74687V8.7L13.0219 11.975L11.9719 13.025Z"
              fill="#A7A9AB"
            />
          </svg>
        </SettingsItem>
      </div> */}
      {/* <div>
        <SettingsItem label={"Draft"}>
          <svg
            width="16"
            height="19"
            viewBox="0 0 16 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.3077 19.5C1.80257 19.5 1.375 19.325 1.025 18.975C0.675 18.625 0.5 18.1974 0.5 17.6922V2.3077C0.5 1.80257 0.675 1.375 1.025 1.025C1.375 0.675 1.80257 0.5 2.3077 0.5H10.25L15.5 5.74995V17.6922C15.5 18.1974 15.325 18.625 14.975 18.975C14.625 19.325 14.1974 19.5 13.6922 19.5H2.3077ZM9.5 6.49995H14L9.5 1.99997V6.49995Z"
              fill="#A7A9AB"
            />
          </svg>
        </SettingsItem>
      </div> */}
      {groupadd === true ? <CreateGrouppModal /> : null}
      {userInviteModal ? <InviteUserModal /> : null}
      {modalCustom ? (
        <ReasonCustom data={incomingCall?.body?.data} reject={onReject} />
      ) : null}
    </div>
  );
}

export default Chats

const Loader = (
  <div
    className={`w-full relative top-0 left-0 flex justify-center items-center p-2 `}
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
)

export const ReasonCustom = (props: any) => {
  const { data, reject } = props
  const dispatch = useDispatch()
  const [isEmojiOpen, setIsEmojiOpen] = useState<boolean>(false)
  const [input, setInput] = useState("")
  const chatInstance = useSelector((state: any) => state.Chat.chatInstance)
  const pickerRef = useRef<HTMLDivElement>(null)

  const addEmoji = (e: any) => {
    let sym = e.native
    setInput(input + sym)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        // Clicked outside the picker, handle the event here
      }
    }

    // Bind the event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutside)

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const sendMsg = () => {
    if (input.length > 0) {
      chatInstance?.publishMessage("text", data.uuid, data.isGroup, {
        message: { plainText: input, type: "v1" },
      })
      dispatch(actionCreators.rejectReasonModal(false))
      reject(true)
    }
  }

  return (
    <div>
      <div className="bg-[#00000033] backdrop-blur fixed inset-0 z-[300]">
        <div className="flex  justify-center items-center place-content-center w-full h-full overflow-y-auto overflow-x-hidden">
          <div className="flex flex-col h-fit text-[#293241] w-[470px] rounded-[15px] bg-[white]">
            <div className="flex flex-row justify-between items-center mb-5 py-3 px-5 bg-[#EBEDEF] rounded-t-[15px] text-[#404041] ">
              Reject with custom message
              <svg
                onClick={() =>
                  dispatch(actionCreators.rejectReasonModal(false))
                }
                className="cursor-pointer"
                width="12"
                height="13"
                viewBox="0 0 12 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.8307 1.84102L10.6557 0.666016L5.9974 5.32435L1.33906 0.666016L0.164062 1.84102L4.8224 6.49935L0.164062 11.1577L1.33906 12.3327L5.9974 7.67435L10.6557 12.3327L11.8307 11.1577L7.1724 6.49935L11.8307 1.84102Z"
                  fill="#293241"
                />
              </svg>
            </div>
            <div className="py-2 px-4">
              <div
                className="w-full h-[1
                00px] rounded-[7px] border-[1px] border-[#B1B1B1] pt-2 px-2 flex flex-col"
              >
                <textarea
                  className=" w-full h-full outline-none border-none overflow-x-hidden"
                  placeholder="Type your message here..."
                  onChange={(e) => setInput(e.target.value)}
                  value={input}
                />

                <svg
                  className="mb-1 cursor-pointer"
                  onClick={() => setIsEmojiOpen(!isEmojiOpen)}
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    d="M14.25 9C14.25 7.60761 13.6969 6.27226 12.7123 5.28769C11.7277 4.30312 10.3924 3.75 9 3.75C7.60761 3.75 6.27226 4.30312 5.28769 5.28769C4.30312 6.27226 3.75 7.60761 3.75 9C3.75 10.3924 4.30312 11.7277 5.28769 12.7123C6.27226 13.6969 7.60761 14.25 9 14.25C10.3924 14.25 11.7277 13.6969 12.7123 12.7123C13.6969 11.7277 14.25 10.3924 14.25 9ZM3 9C3 7.4087 3.63214 5.88258 4.75736 4.75736C5.88258 3.63214 7.4087 3 9 3C10.5913 3 12.1174 3.63214 13.2426 4.75736C14.3679 5.88258 15 7.4087 15 9C15 10.5913 14.3679 12.1174 13.2426 13.2426C12.1174 14.3679 10.5913 15 9 15C7.4087 15 5.88258 14.3679 4.75736 13.2426C3.63214 12.1174 3 10.5913 3 9ZM6.84609 10.6289C7.26562 11.1141 7.98281 11.625 9 11.625C10.0172 11.625 10.7344 11.1141 11.1539 10.6289C11.2898 10.4719 11.5266 10.4555 11.6836 10.5914C11.8406 10.7273 11.857 10.9641 11.7211 11.1211C11.1984 11.7211 10.2914 12.375 9 12.375C7.70859 12.375 6.80156 11.7211 6.27891 11.1211C6.14297 10.9641 6.15937 10.7273 6.31641 10.5914C6.47344 10.4555 6.71016 10.4719 6.84609 10.6289ZM6.57187 7.875C6.57187 7.72582 6.63114 7.58274 6.73663 7.47725C6.84212 7.37176 6.98519 7.3125 7.13437 7.3125C7.28356 7.3125 7.42663 7.37176 7.53212 7.47725C7.63761 7.58274 7.69687 7.72582 7.69687 7.875C7.69687 8.02418 7.63761 8.16726 7.53212 8.27275C7.42663 8.37824 7.28356 8.4375 7.13437 8.4375C6.98519 8.4375 6.84212 8.37824 6.73663 8.27275C6.63114 8.16726 6.57187 8.02418 6.57187 7.875ZM10.8844 7.3125C11.0336 7.3125 11.1766 7.37176 11.2821 7.47725C11.3876 7.58274 11.4469 7.72582 11.4469 7.875C11.4469 8.02418 11.3876 8.16726 11.2821 8.27275C11.1766 8.37824 11.0336 8.4375 10.8844 8.4375C10.7352 8.4375 10.5921 8.37824 10.4866 8.27275C10.3811 8.16726 10.3219 8.02418 10.3219 7.875C10.3219 7.72582 10.3811 7.58274 10.4866 7.47725C10.5921 7.37176 10.7352 7.3125 10.8844 7.3125Z"
                    fill="#B1B1B1"
                  />
                </svg>
              </div>
            </div>
            {isEmojiOpen && (
              <div
                className={`z-[500] h-fit-content w-fit-content absolute overflow-visible bottom-[-2px]`}
              >
                <Picker
                  data={dataPicker}
                  ref={pickerRef}
                  onEmojiSelect={(e: any) => {
                    addEmoji(e);
                    setIsEmojiOpen(false);
                  }}
                  onClickOutside={() => {
                    setIsEmojiOpen(false);
                  }}
                  theme="light"
                  previewPosition="none"
                  exceptEmojis="SmilingFace"
                  categories={[
                    "frequent",
                    "people",
                    "objects",
                    "foods",
                    "nature",
                    "activity",
                  ]}
                  autoFocus={true}
                  perLine="8"
                  skinTonePosition="none"
                  searchPosition="sticky"
                />
              </div>
            )}
            <div className="flex flex-row-reverse h-full p-3">
              <button
                onClick={sendMsg}
                className={` ${
                  input.length > 0 ? "cursor-pointer" : "cursor-not-allowed"
                } h-[32px] w-[78px] mr-1 font-bold bg-[#E57600] hover:bg-[#CC6900] text-[#FFFFFF] rounded-[7px] ml-1 mb-1 disabled:opacity-50`}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
