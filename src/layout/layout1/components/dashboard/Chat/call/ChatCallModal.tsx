import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useDispatch, useSelector } from "react-redux"
import ProfilePicture from "../reusable/profilePicture"
import HangUpIcon from "../Icons/HangUpIcon"
import ChatScreenshareButton from "../ChatCallButtons/ChatScreenshareButton"
import { RootState, actionCreators } from "../../../../../../store"
import ReactDOM from "react-dom"
import CallMainContainer from "./callMainContainer"
import ChatPage from "../ChatPage"
import MicButton from "../../../meetingButtons/micButton"
import VideoButton from "../../../meetingButtons/videoButton"
import hoverTimer from "../../../../../../utils/hoverTimer"
import InviteButton from "../../../meetingButtons/inviteButton"
import sessionListeners from "../../../../../../listeners/sessionListeners"
import { t } from "i18next"
import arrayManipulationUtil from "../../../../../../utils/arrayManipulation"
import FadeIn from "react-fade-in/lib/FadeIn"
import { setCallPopup } from "../../../../../../store/action-creators"
import ChatCallVideoElement from "./chatCallVideoElement"

interface ChatCallModalTypes {
  name?: string
  setEndCall?: Dispatch<SetStateAction<boolean>>
  endCall?: boolean
}

const ChatCallModal = ({ name, setEndCall, endCall }: ChatCallModalTypes) => {
  const chatInstance = useSelector((state: any) => state.Chat.chatInstance)
  const callInfo = useSelector((state: any) => state.Chat.chatCallInfo)
  const videoInfo = useSelector((state: any) => state.Chat.chatCallCamera)
  const selfTileIndex = useSelector((state: any) => state.Main.selfTileIndex)
  const screenShare = useSelector((state: any) => state.Main.screenShare)
  const screensharePausePublisher = useSelector(
    (state: any) => state.Main.screensharePausePublisher
  )
  const screensharePauseListener = useSelector(
    (state: any) => state.Main.screensharePauseListener
  )
  const [speaker, setSpeaker] = useState<any>()
  const [ssIndex, setssIndex] = useState(0)

  const meetingInstance = useSelector((state: any) => state.Main.meetingSession)
  const meetingInfo = useSelector((state: any) => state.Main.meetingInfo)
  const userInviteModal = useSelector(
    (state: any) => state.Flag.userInviteModal
  )
  const incomingCall = useSelector((state: any) => state.Chat.incomingCall)
  const participantList = useSelector(
    (state: any) => state.Main.participantList
  )
  const isOpen = useSelector((state: any) => state.Main.isOpen)
  // const [isOpen, setOpenState] = useState(false);
  const [isWaiting, setIsWaiting] = useState(true)
  const [visibleParticipants, setVisibleParticipants] = useState<any>([])
  const [videoCount, setVideoCount] = useState<any>(0)
  const loggedInUserInfo = useSelector(
    (state: any) => state.Main.loggedInUserInfo
  )
  const speakingList = useSelector((state: any) => state.Main.speakingList)
  const callData = useSelector((state: any) => state.Chat.callData)
  const callConnected = useSelector((state: any) => state.Chat.callConnected)
  const callReconnection = useSelector(
    (state: RootState) => state.Chat.callReconnection
  )

  //

  const dispatch = useDispatch()
  const callHangUp = () => {
    // meetingInstance.hostEndMeeting();
    meetingInstance.leaveMeetingSession()
    dispatch(actionCreators.callToggleFlag(false))
    dispatch(actionCreators.callConnected(false))

    dispatch(actionCreators.setChatCallInfo(null))
    // dispatch(actionCreators.setChatCallMic(false));
    // dispatch(actionCreators.setChatCallCamera(false));
    dispatch(actionCreators.setPublisherState(false))
    dispatch(actionCreators.clearMeetingStore())
    dispatch(actionCreators.clearMeetingFlags())
    dispatch(actionCreators.clearParticipantList())
    hoverTimer(false, dispatch)

    // dispatch(actionCreators.setTimer("clear"))
    // if (isHost) {
    //   dispatch(actionCreators.setIsHost(false))
    // }
    chatInstance.grafanaLogger(["Client : Left MeetingSession", callInfo?.uuid])
    chatInstance?.publishMessage("call", callInfo.uuid, callInfo.isGroup, {
      message: {
        action: "end",
        meetingId: callData.meetingId,
      },
    })

    // chatInstance
    // .UpdateCallInfo(callData.meetingId, callInfo.isGroup)
    // .then((res: any) => {
    //
    // })
    // .catch((err: any) => {
    //
    // });
  }

  useEffect(() => {
    const currentspeaker = speakingList
      .filter((speaker: any) => speaker.state === true)
      .map((speaker: any) =>
        participantList.find(
          (speaking: any) => speaker.participant_id === speaking.participant_id
        )
      )

    // if(speakingList.length > 0){
    setSpeaker(currentspeaker?.[currentspeaker.length - 1])
    // }
  }, [speakingList, participantList])

  const terminateCall = () => {
    if (setEndCall) setEndCall(true)
  }

  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (
        event.keyCode === 72 &&
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey
      ) {
        if (isWaiting) {
          terminateCall()
        } else if (callInfo && !incomingCall) {
          callHangUp()
        }
      } else if (
        event.keyCode === 32 &&
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey
      ) {
        handleAudio()
      }
    }
    window.addEventListener("keydown", handleKeyPress)

    return () => {
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [isWaiting, callInfo, incomingCall])

  useEffect(() => {
    meetingInstance.muteStreamAction("camera", videoInfo ? "unmute" : "mute")
  }, [videoInfo])

  const handleAudio = () => {
    //handling mic state.
    meetingInstance.muteStreamAction(
      "mic",
      participantList[selfTileIndex]?.audio ? "mute" : "unmute"
    )
    // dispatch(actionCreators.setAudio(!meetingAudio))
  }
  const handleVideo = () => {
    meetingInstance.muteStreamAction(
      "camera",
      participantList[selfTileIndex]?.video ? "mute" : "unmute"
    )
  }

  const startScreenShare = () => {
    dispatch(actionCreators.setPopUp("closeAll"))
    if (participantList[selfTileIndex].screenshare) {
      meetingInstance.contentShareAction(false, false)
      // setSharing(false)
      dispatch(actionCreators.setScreensharePause(false))
    } else {
      meetingInstance.contentShareAction(false, true)
      // setSharing(true)
    }
  }

  useEffect(() => {
    if (screenShare.length === 0 && ssIndex === 0) {
    } else if (screenShare.length <= ssIndex) {
      setssIndex((prev) => prev - 1)
    } else if (screenShare.length === 0) {
      setssIndex(0)
    }

    if (screenShare[ssIndex]) {
      const screenShareStream = document.getElementById(
        `screenshare${screenShare[ssIndex]?.participant_id}`
      ) as HTMLVideoElement
      if (screenShare[ssIndex] && screenShare[ssIndex]?.screenshare) {
        meetingInstance.streamBind(
          "screenshare",
          screenShare[ssIndex]?.participant_id,
          `screenshare${screenShare[ssIndex]?.participant_id}`
        )
      }
    }
  }, [ssIndex, isOpen, screenShare])

  // useEffect(() => {
  //
  //   if (screenShare.length > 0) {
  //     meetingInstance.streamBind(
  //       "screenshare",
  //       screenShare[ssIndex].participant_id,
  //       `screenshare${screenShare[ssIndex].participant_id}`
  //     );
  //   }
  // }, [ssIndex, isOpen]);

  useEffect(() => {
    return () => {
      setnewClose()
    }
  }, [])

  useLayoutEffect(() => {
    if (screenShare.length === 0) {
      participantList.forEach((node: any, index: number) => {
        const videoStream = document.getElementById(
          `video${participantList[index]?.participant_id}`
        ) as HTMLVideoElement

        if (node && node.video) {
          meetingInstance.streamBind(
            "video",
            node.participant_id,
            `video${node.participant_id}`
          )
        }
      })
    }
  }, [screenShare, isOpen, participantList.length, isWaiting])

  const onExpandClick = () => {
    //dispatch(actionCreators.createMeetingState(true))
    //LocalDb.set(deviceDB, "UserData", "createState", true)
    // window.open('/app/join', '_blank', 'width=500,height=500');

    const popupWindow = window.open("", "myPopup", "width=600,height=400")

    if (popupWindow) {
      popupWindow.document.write('<div id="popup-container"></div>')

      const popupContainer =
        popupWindow.document.getElementById("popup-container")

      ReactDOM.createPortal(<ChatPage />, document.body)
    } else {
      console.error("Failed to open popup window")
    }
  }

  const setnewOpen = () => {
    dispatch(setCallPopup(true))
  }

  const setnewClose = () => {
    dispatch(setCallPopup(false))
  }

  const togglePauseStream = () => {
    meetingInstance.pauseStream(
      "screenshare",
      !screensharePausePublisher.content?.pause
    )
  }

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

  const toggleInviteModal = () => {
    dispatch(actionCreators.setUserInviteModal(!userInviteModal))
  }

  useEffect(() => {
    sessionListeners(dispatch, meetingInstance)
    meetingInstance.listAvailableDevices().then((device: any) => {
      dispatch(actionCreators.setDeviceList(device))
    })
  }, [dispatch, meetingInstance])

  useEffect(() => {
    const tempList = [...participantList]
    let tempCount = 0
    tempList.map((node: any, index: any) => {
      if (node.video && tempCount < 2) {
        tempCount = tempCount + 1
        console.log(
          tempCount,
          videoCount,
          visibleParticipants,
          "tempCounttempCount"
        )
        return arrayManipulationUtil.sort(tempList, index, 0)
      } else return null
    })
    setVideoCount(tempCount)
    setVisibleParticipants([...tempList])
  }, [participantList])

  const translateAvatar = (index: number, video: boolean) => {
    const avatarPartcipants =
      participantList.length === 5 ? 4 : participantList.length - videoCount
    console.log(
      "avatarPartcipants",
      avatarPartcipants,
      index,
      participantList.length,
      videoCount
    )
    switch (avatarPartcipants) {
      case 1:
        return 0
      case 2: {
        if (index === 0 || video) return "-12"
        else return "12"
      }
      case 3:
        return index * 24 - 24
      default:
        return index * 24 - 48
    }
  }

  return (
    <div className="ease-in duration-300">
      <div className="border-[1px] flex flex-col border-main h-fit w-full rounded-[7px] bg-[#293241] shadow-[0_4px_6px_0px_rgba(0,0,0,0.25)] ">
        <audio id="mixedAudio" autoPlay={true} />
        {!isWaiting ? (
          <div className="min-h-[206px] h-fit py-1 flex flex-col justify-between">
            {" "}
            {isOpen && (
              <RenderInWindow
                close={setnewClose}
                callInfo={callInfo}
                callHangup={callHangUp}
                handleAudio={handleAudio}
              />
            )}
            {isOpen ? (
              <div className="text-[#ffffff] text-lg flex items-center h-[150px] p-3 text-center justify-center">
                {t("Call.CallPopupMsg")}
              </div>
            ) : (
              <>
                <div className="w-full h-[24px] flex content-center items-center p-4 ease-in duration-300">
                  <div
                    className={`w-[20px] h-[20px] flex items-center justify-center text-center rounded-bl-none rounded-[50%] border-[2px] border-[#E9EBF8] text-[#ffffff] text-[11px] bg-[#91785B] overflow-hidden shrink-0`}
                  >
                    {callInfo.profile_picture &&
                    callInfo.profile_picture !== "undefined" ? (
                      <img
                        className="w-full h-full  object-cover "
                        src={callInfo.profile_picture}
                        alt=""
                      />
                    ) : callInfo.isGroup ? (
                      <svg
                        width="14"
                        height="14"
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
                      <div className="capitalize">
                        {callInfo.name?.slice(0, 1)}
                      </div>
                    )}
                  </div>

                  {callReconnection ? (
                    <span className="w-fit font-medium text-md mt-1 ml-[5px] text-[#F74B14] shrink-0 max-w-[160px] truncate">
                      Reconnecting..
                    </span>
                  ) : (
                    <span className="w-fit font-normal text-sm ml-[5px] text-[#FFFFFF] shrink-0 max-w-[160px] truncate">
                      {speaker ? (
                        <div className="flex flex-row">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                          >
                            <path
                              d="M8.625 3C7.38281 3 6.375 4.00781 6.375 5.25V9C6.375 10.2422 7.38281 11.25 8.625 11.25C9.86719 11.25 10.875 10.2422 10.875 9V5.25C10.875 4.00781 9.86719 3 8.625 3ZM5.625 8.0625C5.625 7.75078 5.37422 7.5 5.0625 7.5C4.75078 7.5 4.5 7.75078 4.5 8.0625V9C4.5 11.0883 6.05156 12.8133 8.0625 13.0875V13.875H6.9375C6.62578 13.875 6.375 14.1258 6.375 14.4375C6.375 14.7492 6.62578 15 6.9375 15H8.625H10.3125C10.6242 15 10.875 14.7492 10.875 14.4375C10.875 14.1258 10.6242 13.875 10.3125 13.875H9.1875V13.0875C11.1984 12.8133 12.75 11.0883 12.75 9V8.0625C12.75 7.75078 12.4992 7.5 12.1875 7.5C11.8758 7.5 11.625 7.75078 11.625 8.0625V9C11.625 10.657 10.282 12 8.625 12C6.96797 12 5.625 10.657 5.625 9V8.0625Z"
                              fill="#76B947"
                            />
                          </svg>
                          <div className="text-[#76B947]">{speaker.name}</div>
                        </div>
                      ) : callInfo.isGroup ? (
                        callInfo.groupName
                      ) : (
                        callInfo.name
                      )}
                    </span>
                  )}
                  <div className="w-full flex flex-row-reverse">
                    <button onClick={callHangUp} id="callHangUp">
                      <HangUpIcon />
                    </button>
                  </div>
                </div>
                <div
                  className="w-full py-[12px] relative grid grid-rows-[120px] justify-items-center place-items-center gap-2 h-36  min-h-36 px-2"
                  style={{
                    gridTemplateColumns: `
                ${
                  screenShare.length > 0
                    ? "repeat(1, minmax(0, 1fr))"
                    : `repeat(${
                        participantList.length === videoCount
                          ? videoCount
                          : videoCount + 1
                      }, minmax(0, 1fr))`
                }
                `,
                  }}
                >
                  {screenShare.length > 0 ? (
                    <div className="relative w-full">
                      {/* {ssIndex === 0 ?   */}
                      {screensharePauseListener.includes(
                        screenShare[0].participant_id
                      ) ? (
                        <div
                          className={`absolute z-[1] flex flex-col w-full h-full max-h-[128px]  bg-[#404040] justify-center items-center `}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 32 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M30.2703 31.433L26.1857 27.3484H1.07803V25.0985H23.9126L22.4126 23.5985H5.46264C4.70494 23.5985 4.06359 23.336 3.53859 22.811C3.01359 22.286 2.75109 21.6446 2.75109 20.887V5.17164C2.75109 5.00817 2.79436 4.86152 2.88091 4.73169C2.96746 4.60189 3.07805 4.49852 3.21268 4.42157L0.570312 1.73308L2.15105 0.152344L31.8511 29.8523L30.2703 31.433ZM14.0588 15.2532L12.1001 13.2716C11.9367 13.4966 11.8088 13.7629 11.7165 14.0706C11.6242 14.3783 11.578 14.7177 11.578 15.0889V18.0889H13.828V15.8735C13.828 15.7388 13.8472 15.6235 13.8857 15.5273C13.9241 15.4311 13.9818 15.3398 14.0588 15.2532ZM29.6183 23.3446L20.3501 14.0764L22.3087 12.0889L18.703 8.48319V10.9639H17.2376L8.87229 2.59858H28.5395C29.2972 2.59858 29.9385 2.86108 30.4635 3.38608C30.9885 3.91108 31.251 4.55242 31.251 5.31009V20.887C31.251 21.4216 31.1082 21.9086 30.8227 22.348C30.5371 22.7874 30.1356 23.1196 29.6183 23.3446Z"
                              fill="#A7A9AB"
                            />
                          </svg>
                          <div className="text-[#C4C4C4] text-[14px] text-center mt-2 h-[19px]">
                            {t("Call.ScreenSharePausedBy")}
                            {`${screenShare[ssIndex]?.name}`}
                          </div>
                        </div>
                      ) : (
                        <div></div>
                      )}
                      <video
                        className={`relative w-full h-full min-h-[128px] max-h-[128px] object-contain {${
                          ssIndex === 0 ? "visible" : " hidden"
                        }} `}
                        id={
                          "screenshare" + screenShare[ssIndex]?.participant_id
                        }
                        autoPlay
                      />

                      {screenShare.length > 1 ? (
                        <div className="flex flex-row text-[#ffffff] gap-2  ">
                          {ssIndex}
                          <button
                            disabled={ssIndex === 0}
                            className="disabled:opacity-50"
                            onClick={() =>
                              setssIndex((prev: number) => prev - 1)
                            }
                          >
                            {"<"}
                          </button>
                          <button
                            disabled={ssIndex === screenShare.length - 1}
                            className="disabled:opacity-50"
                            onClick={() =>
                              setssIndex((prev: number) => prev + 1)
                            }
                          >
                            {">"}
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    visibleParticipants
                      .slice(0, 3)
                      .map((node: any, index: any) =>
                        node.video &&
                        (visibleParticipants.length > 3 ? index < 2 : true) ? (
                          <div className="w-full h-full">
                            <ChatCallVideoElement
                              participant_id={node.participant_id}
                              isPublisher={node.isPublisher}
                            />
                          </div>
                        ) : participantList.filter(
                            (node: any) => node.video === true
                          ).length ? (
                          <div
                            style={{
                              gridRow: 1 / 1,
                              transform: `translateX(${translateAvatar(
                                index,
                                index === participantList.length - 1
                                  ? false
                                  : true
                              )}px)`,
                              gridColumnStart: `${videoCount + 1}`,
                            }}
                            className={`w-[32px] col-start-3 h-[32px] text-center rounded-bl-none rounded-[50%] border-[2px] border-[#E9EBF8] text-[#ffffff] text-[16px] font-semibold bg-[#91785B] overflow-hidden shrink-0`}
                          >
                            {node.profile_picture &&
                            node.profile_picture !== "undefined" ? (
                              <img
                                src={node.profile_picture}
                                className={"w-[32px] h-[32px]  object-cover"}
                                alt="profilepic"
                              />
                            ) : (
                              <div className="mt-1">
                                {node.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                        ) : (
                          // <div
                          //   className="w-fit h-fit relative"
                          //   style={{
                          //     position: "relative",
                          //     right: `${index * 15 - 12}px`,
                          //   }}
                          // >
                          // {console.log("callWindow22222", node)}

                          <div
                            style={{
                              gridRow: 1 / 1,
                              transform: `translateX(${translateAvatar(
                                index,
                                false
                              )}px)`,
                            }}
                            className={`w-[32px] h-[32px] col-start-1	 text-center rounded-bl-none rounded-[50%] border-[2px] border-[#E9EBF8] text-[#ffffff] text-[16px] font-semibold bg-[#91785B] overflow-hidden shrink-0`}
                          >
                            {node.profile_picture &&
                            node.profile_picture !== "undefined" ? (
                              <img
                                src={node.profile_picture}
                                className={"w-[32px] h-[32px]  object-cover "}
                                alt="profilepic"
                              />
                            ) : (
                              <div className="mt-1">
                                {node.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          // </div>
                        )
                      )
                  )}
                  {participantList.length - 3 > 0 &&
                    screenShare.length === 0 && (
                      <div
                        style={{
                          gridRow: 1 / 1,
                          transform: `translateX(${translateAvatar(
                            3,
                            false
                          )}px)`,
                          gridColumnStart: `${videoCount + 1}`,
                        }}
                        className=" relative col-start-1  w-[32px] h-[32px] text-center rounded-bl-none rounded-[50%] border-[2px] border-[#E9EBF8]  text-[16px] font-semibold bg-[#EBEDEF] overflow-hidden shrink-0"
                        onClick={setnewOpen}
                      >
                        <div className=" font-sans text-[#293241] w-3/5 mt-1 ml-1">
                          +{participantList.length - 3}
                        </div>
                      </div>
                    )}
                </div>
              </>
            )}
            <div className="w-full h-[24px] flex flex-row justify-evenly px-3">
              <div className="flex flex-row gap-4 justify-start w-full">
                <MicButton
                  onClick={handleAudio}
                  audio={participantList[selfTileIndex]?.audio}
                  miniPlayer={true}
                />
                <VideoButton
                  onClick={handleVideo}
                  video={participantList[selfTileIndex]?.video}
                  miniPlayer={true}
                />
              </div>
              <div className="flex flex-row gap-4 justify-center  w-full">
                <ChatScreenshareButton
                  startScreenShare={startScreenShare}
                  screenShare={
                    participantList[selfTileIndex]?.screenshare ?? false
                  }
                  togglePauseStream={togglePauseStream}
                  isPaused={!!screensharePausePublisher.content?.pause}
                />
                {true && <InviteButton toggleInviteModal={toggleInviteModal} />}
              </div>
              <div className="flex flex-row gap-4 justify-end w-full">
                {participantList[selfTileIndex] ? (
                  isOpen ? (
                    <button
                      className="text-[#ffffff] p-1 ml-1 -mt-1"
                      onClick={setnewClose}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                      >
                        <path
                          d="M10.875 3C10.6687 3 10.5 3.16875 10.5 3.375C10.5 3.58125 10.6687 3.75 10.875 3.75H13.7203L7.98516 9.48516C7.83984 9.63047 7.83984 9.86953 7.98516 10.0148C8.13047 10.1602 8.36953 10.1602 8.51484 10.0148L14.25 4.27969V7.125C14.25 7.33125 14.4187 7.5 14.625 7.5C14.8313 7.5 15 7.33125 15 7.125V3.375C15 3.16875 14.8313 3 14.625 3H10.875ZM4.5 3.75C3.67266 3.75 3 4.42266 3 5.25V13.5C3 14.3273 3.67266 15 4.5 15H12.75C13.5773 15 14.25 14.3273 14.25 13.5V10.125C14.25 9.91875 14.0813 9.75 13.875 9.75C13.6687 9.75 13.5 9.91875 13.5 10.125V13.5C13.5 13.9148 13.1648 14.25 12.75 14.25H4.5C4.08516 14.25 3.75 13.9148 3.75 13.5V5.25C3.75 4.83516 4.08516 4.5 4.5 4.5H7.875C8.08125 4.5 8.25 4.33125 8.25 4.125C8.25 3.91875 8.08125 3.75 7.875 3.75H4.5Z"
                          fill="white"
                        />
                      </svg>
                    </button>
                  ) : (
                    <button
                      className="text-[#ffffff] p-1 ml-1 -mt-1"
                      onClick={setnewOpen}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                      >
                        <path
                          d="M10.875 3C10.6687 3 10.5 3.16875 10.5 3.375C10.5 3.58125 10.6687 3.75 10.875 3.75H13.7203L7.98516 9.48516C7.83984 9.63047 7.83984 9.86953 7.98516 10.0148C8.13047 10.1602 8.36953 10.1602 8.51484 10.0148L14.25 4.27969V7.125C14.25 7.33125 14.4187 7.5 14.625 7.5C14.8313 7.5 15 7.33125 15 7.125V3.375C15 3.16875 14.8313 3 14.625 3H10.875ZM4.5 3.75C3.67266 3.75 3 4.42266 3 5.25V13.5C3 14.3273 3.67266 15 4.5 15H12.75C13.5773 15 14.25 14.3273 14.25 13.5V10.125C14.25 9.91875 14.0813 9.75 13.875 9.75C13.6687 9.75 13.5 9.91875 13.5 10.125V13.5C13.5 13.9148 13.1648 14.25 12.75 14.25H4.5C4.08516 14.25 3.75 13.9148 3.75 13.5V5.25C3.75 4.83516 4.08516 4.5 4.5 4.5H7.875C8.08125 4.5 8.25 4.33125 8.25 4.125C8.25 3.91875 8.08125 3.75 7.875 3.75H4.5Z"
                          fill="white"
                        />
                      </svg>
                    </button>
                  )
                ) : null}
              </div>

              {/* <div className="mt-[8px] flex flex-row-reverse pr-4">
    <svg
      className="cursor-pointer"
      width="5"
      height="11"
      viewBox="0 0 4 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.0026 9.66537C1.68177 9.66537 1.40722 9.55123 1.17894 9.32295C0.950271 9.09428 0.835938 8.81953 0.835938 8.4987C0.835938 8.17787 0.950271 7.90311 1.17894 7.67445C1.40722 7.44617 1.68177 7.33203 2.0026 7.33203C2.32344 7.33203 2.59819 7.44617 2.82685 7.67445C3.05513 7.90311 3.16927 8.17787 3.16927 8.4987C3.16927 8.81953 3.05513 9.09428 2.82685 9.32295C2.59819 9.55123 2.32344 9.66537 2.0026 9.66537ZM2.0026 6.16537C1.68177 6.16537 1.40722 6.05103 1.17894 5.82236C0.950271 5.59409 0.835938 5.31953 0.835938 4.9987C0.835938 4.67787 0.950271 4.40311 1.17894 4.17445C1.40722 3.94617 1.68177 3.83203 2.0026 3.83203C2.32344 3.83203 2.59819 3.94617 2.82685 4.17445C3.05513 4.40311 3.16927 4.67787 3.16927 4.9987C3.16927 5.31953 3.05513 5.59409 2.82685 5.82236C2.59819 6.05103 2.32344 6.16537 2.0026 6.16537ZM2.0026 2.66536C1.68177 2.66536 1.40722 2.55103 1.17894 2.32236C0.950271 2.09409 0.835938 1.81953 0.835938 1.4987C0.835938 1.17786 0.950271 0.903309 1.17894 0.675031C1.40722 0.446364 1.68177 0.332031 2.0026 0.332031C2.32344 0.332031 2.59819 0.446364 2.82685 0.675031C3.05513 0.903309 3.16927 1.17786 3.16927 1.4987C3.16927 1.81953 3.05513 2.09409 2.82685 2.32236C2.59819 2.55103 2.32344 2.66536 2.0026 2.66536Z"
        fill="#A7A9AB"
      />
    </svg>
  </div> */}
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-between gap-1  bg-[#293241]  self-stretch w-full min-h-[206px] h-fit rounded-[7px] p-4">
            <div className="flex flex-row">
              <div className="w-[22px] h-[22px] rounded-bl-none rounded-[50%] border-[2px] border-[#E9EBF8] text-primary-200 bg-[#91785B] overflow-hidden shrink-0">
                {callInfo.profile_picture &&
                callInfo.profile_picture !== "undefined" ? (
                  <img
                    src={callInfo.profile_picture}
                    className="min-h-0 min-w-0 w-6"
                    alt=""
                  />
                ) : callInfo.isGroup ? (
                  <svg
                    className="min-h-0 min-w-0 w-4 mt-[6px] ml-[1px]"
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
                  <div className="w-[22px] h-[22px] rounded-bl-none rounded-[50%] -mt-[2px] -ml-[2px] border-[2px] border-[#E9EBF8] text-primary-200 bg-[#91785B] overflow-hidden shrink-0">
                    <div className="flex flex-col justify-start  items-center ">
                      <div className="text-center font-semibold text-xs font-sans text-[#FFFFFF] w-full	mt-[2px] capitalize">
                        {callInfo.name?.slice(0, 1)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="whitespace-nowrap text-[16px] ml-2 font-sans text-[#ffff]  max-w-[170px] truncate ">
                {callInfo.isGroup ? callInfo.groupName : callInfo.name}
              </div>
            </div>
            <div className="text-[#B1B1B1] text-[16px] italic text-center">
              {callInfo.outGoing ? "Calling..." : "Connecting..."}
            </div>
            <button
              id="terminateACall"
              className="text-[14px] font-sans text-[#F74B14] w-18 shrink-0 text-right"
              onClick={terminateCall}
            >
              {t("Call.Disconnect")}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatCallModal

// interface NewWindowProps {
//   children: React.ReactNode;
//   close: () => void;
// }

// const NewWindow = ({ children, close }: NewWindowProps) => {

//   const newWindow = useMemo(() =>
//     window.open(
//       "about:blank",
//       "newWin",
//       `width=400,height=300,left=${window.screen.availWidth / 2 - 200},top=${
//         window.screen.availHeight / 2 - 150
//       }`
//     )
//   , []);

//   useEffect(() => {
//     const link = newWindow?.document.createElement("link");
//     link?.setAttribute("rel", "stylesheet");
//     link?.setAttribute("href", "path/to/tailwind.css");
//     newWindow?.document.head.appendChild(link!);

//     // return () => {
//     //   link?.remove();
//     //   newWindow?.close();
//     // };
//   }, [newWindow, close]);

//   // if(newWindow) {
//   //   newWindow.onbeforeunload = () => {
//   //     close();
//   //   };
//   // }

//   // useEffect(() =>  {

//   //   return () => {
//   //     if(newWindow) {
//   //       newWindow.close()

//   //     }
//   //   }
//   // }
//   // , [newWindow]);
//   return ReactDOM.createPortal(children, newWindow?.document.body ?? document.createElement('div'));
// };

interface RenderInWindowProps {
  callInfo: any
  close: () => void
  callHangup: any
  handleAudio: any
}

const RenderInWindow: React.FC<RenderInWindowProps> = (props) => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null)
  const newWindow = useRef<Window | null>(null)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Create container element on client-side
    const newContainer = document.createElement("div")
    newContainer.id = "popout-container"
    setContainer(newContainer)
  }, [])

  function copyStyles(src: any, dest: any) {
    Array.from(src.styleSheets).forEach((styleSheet: any) => {
      const styleElement = styleSheet.ownerNode.cloneNode(true)
      styleElement.href = styleSheet.href
      dest.head.appendChild(styleElement)
    })
    //Array.from(src.fonts).forEach((font) => dest.fonts.add(font));

    Array.from(src.fonts).forEach((font: any) => {
      const isFromCSS = font.style !== ""
      if (!isFromCSS) {
        dest.fonts.add(font)
      }
    })
  }

  function debounce(callback: () => void, delay: number): () => void {
    let timeoutId: NodeJS.Timeout | undefined
    return function () {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(callback, delay)
    }
  }

  const handleResize: () => void = debounce(() => {
    if (
      newWindow.current &&
      (newWindow.current.outerWidth < 880 ||
        newWindow.current.outerHeight < 500)
    ) {
      newWindow?.current?.resizeTo(
        Math.max(newWindow?.current.outerWidth, 880),
        Math.max(newWindow?.current.outerHeight, 500)
      )
    }
  }, 200)

  const handleKeyPress = (event: any) => {
    if (
      event.keyCode === 72 &&
      (event.ctrlKey || event.metaKey) &&
      event.shiftKey
    ) {
      props.callHangup()
    } else if (
      event.keyCode === 32 &&
      (event.ctrlKey || event.metaKey) &&
      event.shiftKey
    ) {
      props.handleAudio()
    }
  }

  useEffect(() => {
    // When container is ready
    if (container) {
      // Create window

      newWindow.current = window.open(
        "",
        "popoutCall",
        "popup,width=4000,height=5000,left=200,top=200,resizable=0"
      )

      // if (window.Notification && window.Notification.permission === 'granted') {
      //   newWindow.current = window.open(
      //     "",
      //     "popout",
      //     "popup,width=600,height=400,left=200,top=200"
      //   );
      // } else if (window.Notification && window.Notification.permission !== 'denied') {
      //   window.Notification.requestPermission().then(permission => {
      //     if (permission === 'granted') {
      //       newWindow.current = window.open(
      //         "",
      //         "popout",
      //         "popup,width=600,height=400,left=200,top=200"
      //       );
      //     } else {
      //       alert('Please grant permission to open the pop-up window.');
      //     }
      //   });
      // } else {
      //   alert('Please grant permission to open the pop-up window.');
      // }

      // Append container
      if (newWindow.current) {
        copyStyles(window.document, newWindow.current.document)
        newWindow.current.document.body.appendChild(container)
        newWindow.current.document.title = "Call with -" + props.callInfo.name
        newWindow.current.addEventListener("resize", handleResize)
        newWindow.current.addEventListener("keydown", (event) => {
          handleKeyPress(event)
        })
      }

      // Save reference to window for cleanup
      const curWindow = newWindow.current
      // setTimeout(() => {
      //   bringParentIntoFocus()
      // }, 5000);
      window.onbeforeunload = () => {
        if (curWindow) {
          curWindow.close()
          props.close()
        } else {
          props.close()
        }
      }
      // Return cleanup function
      return () => {
        if (curWindow) {
          curWindow.close()
          props.close()
        } else {
          props.close()
        }
      }
    }
  }, [container])

  const onFocus = () => {}

  // User has switched away from the tab (AKA tab is hidden)
  const onBlur = () => {}

  // useEffect(() => {
  //   const handleBeforeUnload = () => {
  //     props.close()
  //

  //   };

  //   window.addEventListener('beforeunload', handleBeforeUnload);
  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, []);

  const bringParentIntoFocus = () => {
    if (newWindow.current) {
      //newWindow.current.blur()
      //newWindow.current.focus();
    }
  }

  if (newWindow.current) {
    newWindow.current.onbeforeunload = () => {
      props.close()
    }
  }

  return (
    container &&
    ReactDOM.createPortal(
      <div ref={elementRef} className="modal">
        <CallMainContainer elementRef={elementRef.current} />
      </div>,
      container
    )
  )
}
