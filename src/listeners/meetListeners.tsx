import ModalData from "../constructors/modal/modalData"
import NotificationData from "../constructors/notification/notificationData"
import { actionCreators, store } from "../store"
import { isJson, addReactions } from "../utils"
import path from "../navigation/routes.path"
import hoverTimer from "../utils/hoverTimer"
import { type } from "os"
import modal from "../layout/layout1/components/modal/modal"
import { t } from "i18next"
import sound from "../constants/audio/knocking.mp3"
// import { useDispatch } from "react-redux";
const Notify = require("../layout/layout1/components/dashboard/Chat/audio/incoming-outgoing-message/Notify.mp3")
const positiveNote = require("../layout/layout1/components/dashboard/Chat/audio/incoming-outgoing-message/Positive Notice.mp3")
const Connected = require("../layout/layout1/components/dashboard/Chat/audio/incoming-outgoing-message/ConnectedFinal.wav")

// import useTimer from "../layout/layout1/components/meetingScreen/tileView/Timer/useTimer";

const meetListeners = (
  dispatch: any,
  navigate: any,
  participant_list: any,
  user: any,
  isCall?: boolean,
  chatInstance?: any,
  meetingInfo?: any,
  callInfo?: any
) => {
  // const dispatch = useDispatch()
  let networkModalId = ""
  let timestamp = 0
  let selfParicipaniId: any = []
  let connection = false
  const redirectHome = () => {
    dispatch(actionCreators.setPublisherState(false))
    // dispatch(actionCreators.setRoomState(''))
    hoverTimer(false, dispatch)
    dispatch(actionCreators.clearMeetingStore())
    dispatch(actionCreators.clearMeetingFlags())
    dispatch(actionCreators.clearParticipantList())
    dispatch(actionCreators.setIsHost(false))
    // dispatch(actionCreators.clearParticipantList())
    // stopTimer();
    navigate(path.HOME)
  }

  user.addEventListener("roomState", (state: string) => {
    dispatch(actionCreators.setRoomState(state))
  })
  user.addEventListener("joinMeeting", (data: any) => {
    dispatch(actionCreators.setPublisherState(data.state))
    dispatch(actionCreators.setMembersCount(data.initialCount))
  })

  user.addEventListener("participantList", (participant: any) => {
    // if (participant.isPublisher) {
    //     dispatch(actionCreators.setPublisherId(participant.participant_id))
    // }
    if (participant.host) {
      dispatch(
        actionCreators.setHostName(participant.participant_id, participant.name)
      )
      if (participant.isPublisher) dispatch(actionCreators.setIsHost(true))
    }
    if (participant.isPublisher) {
      timestamp = participant.timestamp
      selfParicipaniId = participant.participant_id
    } else if (timestamp < participant.timestamp) {
      let notification = new NotificationData({
        message: `${participant.name} just joined`,
        type: "success",
        check: "joined",
      })
      dispatch(actionCreators.addNotification(notification))
      if (isCall) {
        const audio = new Audio(positiveNote)
        audio.play()
      }
    }

    dispatch(actionCreators.setParticipant(participant))
    // dispatch(actionCreators.setParticipantVideoChange())
    // dispatch(actionCreators.setParticipantListFlags('length'))
  })

  //audio, video stream reciever
  user.addEventListener("streamReceived", (state: any) => {
    // if (state.type === "video") {
    //
    //     user.bindVideoElement(state.participant_id)
    // }
    // else if (state.type === "audio") {
    //
    //     user.bindAudioElement(state.participant_id, "mixedAudio")
    // }

    const modal = store.getState().Main.modals
    if (modal?.type === "NetworkEvents") {
      dispatch(actionCreators.callReconnection(false))
      dispatch(actionCreators.removeModal(networkModalId))
    }
    const tileStreamId =
      state.type === "video"
        ? "video" + state.participant_id
        : state.type === "screenshare"
        ? "screenshare" + state.participant_id
        : state.type === "audio"
        ? "mixedAudio"
        : ""

    user.streamBind(state.type, state.participant_id, tileStreamId)

    if (isCall && (state.type === "screenshare" || state.type === "video")) {
      const stream = user.getStream([state.participant_id], state.type)
      dispatch(
        actionCreators.setMediaStream(
          stream[0].stream,
          state.type,
          state.participant_id
        )
      )
    }
  })

  user.addEventListener("leftparticipant", (participant: any) => {
    dispatch(actionCreators.removeParticipant(participant))

    if (selfParicipaniId !== participant.participant_id) {
      let notification = new NotificationData({
        message: `${participant.name} has left`,
        type: "error",
        check: "left",
      })
      dispatch(actionCreators.addNotification(notification))
    }
    // dispatch(actionCreators.setParticipantVideoChange())
    // dispatch(actionCreators.setParticipantListFlags('length'))
  })

  //particpant list updates.
  user.addEventListener("updateparticipantlist", (data: any) => {
    if (data.type === "raiseHand") {
    }
    // if (data.type === "audio" || data.type === "video") {
    //
    // }
    if (data.type === "screenshare" && data.state) {
      let audio = new Audio(Notify)
      audio.play()
    }
    dispatch(actionCreators.UpdateParticipantList(data))
    if (data.type === "video") {
      dispatch(actionCreators.setParticipantListFlags(data.type))
    }
    if (data.type === "pause") {
      dispatch(actionCreators.setParticipantListFlags(data.type))
    }
    if (data.type === "speaking") {
      dispatch(actionCreators.setSpeakingState(data))
    }
    if (data.type === "raiseHand" && data.state === true) {
      dispatch(actionCreators.setHandRaise(data))
    }
  })

  // //group chat
  // user.addEventListener("groupChat", (data: any) => {
  //
  //     const message = isJson(data.message);
  //
  //     if (message) {
  //         data.message = message
  //
  //         addReactions(dispatch, data, 10000)
  //         // dispatch(actionCreators.addReactions(data))
  //     }
  //     else
  //         dispatch(actionCreators.addGroupChat(data))
  // })
  // //Private Chat
  // user.addEventListener("privateChat", (data: any) => {
  //
  //     dispatch(actionCreators.addPrivateChat(data))
  // })

  //Chat
  user.addEventListener("chat", (data: any) => {
    if (data.isgroup) {
      const message = isJson(data.message)
      //
      if (message && message.type === "reaction") {
        if (data.status === "delivered") {
          data.message = message

          addReactions(dispatch, data, 10000)
        }
        // dispatch(actionCreators.addReactions(data))
      } else dispatch(actionCreators.addGroupChat(data))
    } else {
      if (data.participant_id != "undefined")
        dispatch(actionCreators.addPrivateChat(data))
    }
  })

  //Adding participants to waiting List
  user.addEventListener("peopleWaiting", (data: any) => {
    dispatch(actionCreators.setWaitingList(data))
  })
  //Removing participants from waiting List
  user.addEventListener("removeFromWaitingList", (data: any) => {
    dispatch(actionCreators.removeFromWaitingList(data))
  })

  // //host end meeting for all
  // user.addEventListener("hostEndForAll", (data: any) => {
  //     dispatch(actionCreators.setHostEndForAll(data))
  // })

  // //host mute participant mic
  // user.addEventListener("hostMuteorUnmute", (data: any) => {
  //
  //     const unMute = () => {
  //
  //         // dispatch(actionCreators.setHostMuteAudio(data))
  //     }
  //     let modal = new ModalData({
  //         message: data.state ? "Host muted your mic" : "Host want to unmute you",
  //         type: "HostMessage",
  //         closeButton: false,
  //         buttons: data.state ? [{
  //             buttonName: t("Dashboard.OK"),
  //             //   callback:
  //         }] :
  //             [{ buttonName: "Reject" }, { buttonName: "Accept", callback: unMute }],
  //     })
  //     dispatch(actionCreators.addModal(modal))
  //     if (data.state)
  //         dispatch(actionCreators.setHostMuteAudio(data))

  // })

  // //host turned of participant camera
  // user.addEventListener("hostCameraOnOff", (data: any) => {
  //
  //     dispatch(actionCreators.setHostTurnedOffVideo(data))
  // })

  // //host kickout participant
  // user.addEventListener("hostKickOut", (data: any) => {
  //
  //     dispatch(actionCreators.setHostKickout(data))
  // })

  user.addEventListener("host", (data: any) => {
    if (data.title === "hostEndForAll" && !isCall)
      dispatch(actionCreators.setHostEndForAll(data))
    else if (data.title === "hostKickOut") {
      const redirecttoFeedback = () => {
        hoverTimer(false, dispatch)
        dispatch(actionCreators.setPublisherState(false))
        dispatch(actionCreators.clearMeetingStore())
        dispatch(actionCreators.clearMeetingFlags())
        dispatch(actionCreators.setIsHost(false))
        dispatch(actionCreators.clearParticipantList())
        if (!isCall) navigate(path.FEEDBACK)
        // stopTimer();
      }
      let notification = new NotificationData({
        message: t("Meeting.YouRemovedFromMeeting"),
        type: "success",
        check: "networkEvents",
      })
      dispatch(actionCreators.addNotification(notification))
      let modal = new ModalData({
        message: isCall
          ? t("Meeting.YouRemovedFromCall")
          : t("Meeting.YouRemovedFromMeeting"),
        type: "HostMessage",
        closeButton: false,
        category: "modal",
        buttons: [
          {
            buttonName: t("Dashboard.OK"),
            callback: redirecttoFeedback,
          },
        ],
      })

      if (isCall) {
        dispatch(actionCreators.kickOut("kick"))
        user.leaveMeetingSession()
        dispatch(actionCreators.setPublisherState(false))
        dispatch(actionCreators.clearMeetingStore())
        dispatch(actionCreators.clearMeetingFlags())
        dispatch(actionCreators.clearParticipantList())
      }
      dispatch(actionCreators.addModal(modal))
    }
    // dispatch(actionCreators.setHostKickout(data))
    else if (data.title === "hostMuteUnmute") {
      if (data.stream === "audio") {
        const unMute = () => {
          user.muteStreamAction("mic", "unmute")
          // dispatch(actionCreators.setHostMuteAudio(data))
        }

        let modal = new ModalData({
          message: data.mute
            ? t("Meeting.HostMutedYourMicrophone")
            : t("Meeting.HostRequestingToUnmute"),
          type: data.mute ? "HostMessage" : "HostMessageAudio",
          closeButton: false,
          category: "modal",
          buttons: data.mute
            ? [
                {
                  buttonName: t("Dashboard.OK"),
                  //   callback:
                },
              ]
            : [
                { buttonName: t("Reject") },
                { buttonName: t("Accept"), callback: unMute },
              ],
        })
        dispatch(actionCreators.addModal(modal))
        if (data.mute) {
          user.muteStreamAction("mic", "mute")
        }
      } else if (data.stream === "video") {
        const unMute = () => {
          user.muteStreamAction("camera", "unmute")
          // dispatch(actionCreators.setHostMuteAudio(data))
        }
        let modal = new ModalData({
          message: data.mute
            ? t("Meeting.HostTurnedoffCamera")
            : t("Meeting.HostRequestingToStartCamera"),
          type: data.mute ? "HostMessage" : "HostMessageVideo",
          closeButton: false,
          category: "modal",
          buttons: data.mute
            ? [
                {
                  buttonName: t("Dashboard.OK"),
                  //   callback:
                },
              ]
            : [
                { buttonName: t("Reject") },
                { buttonName: t("Accept"), callback: unMute },
              ],
        })
        dispatch(actionCreators.addModal(modal))
        if (data.mute) {
          user.muteStreamAction("camera", "mute")
        }
      }
    }
  })

  //Locked meeting state
  user.addEventListener("meetingstate", (data: any) => {
    dispatch(actionCreators.setLockMeeting(data.state))
  })

  //SDK error handler
  user.addEventListener("errorhandler", (data: any) => {
    if (data.title === "websocket_drop") {
      let modal = new ModalData({
        message: t("Meeting.LostConnectionWithServer"),
        type: "SDK error",
        category: "modal",
        closeButton: false,
        buttons: [
          {
            buttonName: t("Dashboard.OK"),
          },
        ],
      })
      dispatch(actionCreators.addModal(modal))
    } else if (data.title == "device_error") {
      let modal = new ModalData({
        message: t("Meeting.SomethingWrongUsingMediaDevices"),
        type: "SDK error",
        category: "modal",
        closeButton: false,
        buttons: [
          {
            buttonName: t("Dashboard.OK"),
          },
        ],
      })
      dispatch(actionCreators.addModal(modal))
    } else if (data.title == "websocket_closed") {
      const redirecttoFeedback = () => {
        dispatch(actionCreators.setPublisherState(false))
        // dispatch(actionCreators.setRoomState(''))
        hoverTimer(false, dispatch)
        dispatch(actionCreators.clearMeetingStore())
        dispatch(actionCreators.clearMeetingFlags())
        dispatch(actionCreators.clearParticipantList())
        dispatch(actionCreators.setIsHost(false))
        dispatch(actionCreators.setScreensharePauseListener(""))
        dispatch(actionCreators.setScreensharePauseListener(""))
        dispatch(actionCreators.setChatCallInfo(null))
        // dispatch(actionCreators.clearParticipantList())
        // stopTimer();
        // navigate(path.HOME)
        if (!isCall) navigate(path.FEEDBACK)
      }
      if (networkModalId) {
        dispatch(actionCreators.removeModal(networkModalId))
      }
      let modal = new ModalData({
        message: t("Meeting.LostConnectionWithServerPleaseJoinAgain"),
        type: "SDK error",
        category: "modal",
        closeButton: false,
        buttons: [
          {
            buttonName: t("Dashboard.OK"),
            callback: redirecttoFeedback,
          },
        ],
      })
      dispatch(actionCreators.addModal(modal))
    } else if (data.title === "stream_capture_failure") {
      let modal = new ModalData({
        message: "Some issues with audio server. Please try again",
        category: "modal",
        type: "SDK error",
        closeButton: false,
        buttons: [
          {
            buttonName: t("Dashboard.OK"),
          },
        ],
      })
      dispatch(actionCreators.addModal(modal))
    } else if (data.title === "stream_attachment_failed") {
      let notification = new NotificationData({
        message: t("Meeting.ConnectionIsHavingIssues"),
        type: "success",
        check: "networkEvents",
      })
      dispatch(actionCreators.addNotification(notification))
      let modal = new ModalData({
        message: `Some issues with  ${
          data.stream.toLowerCase() === "mic" ? "audio" : "video"
        } server. Please try again`,
        category: "modal",
        type: "SDK error",
        closeButton: false,
        buttons: [
          {
            buttonName: t("Dashboard.OK"),
          },
        ],
      })
      dispatch(actionCreators.addModal(modal))
    }
    if (data.reason === "max_limit_reached") {
      let modal = new ModalData({
        message: t("Meeting.MaximumAllowedParticipantsLimitHasReached"),
        type: "SDK INFO",
        closeButton: false,
        buttons: [
          {
            buttonName: t("Dashboard.OK"),
            callback: redirectHome,
          },
        ],
      })

      dispatch(actionCreators.addModal(modal))
    }
    if (data.title === "max_participants_limit_reached") {
      let modal = new ModalData({
        message: t("Meeting.MeetingParticipantLimitReached"),
        category: "modal",
        type: "SDK INFO",
        closeButton: false,
        buttons: [
          {
            buttonName: t("Dashboard.OK"),
            callback: redirectHome,
          },
        ],
      })

      dispatch(actionCreators.addModal(modal))
    }
    // if (data.title === "max_participants_limit_reached") {
    //     let modal = new ModalData({
    //         message: 'Meeting participant limit reached for this meeting.',
    //         type: "SDK INFO",
    //         closeButton: false,
    //         buttons: [{
    //             buttonName: t("Dashboard.OK"),
    //             callback: redirectHome
    //         }]
    //     })
    //

    //     dispatch(actionCreators.addModal(modal))
    // }
    if (data.title === "max_concurrent_meeting_reached") {
      let modal = new ModalData({
        message: t("Meeting.AccountLimitReached"),
        type: "SDK INFO",
        closeButton: false,
        buttons: [
          {
            buttonName: t("Dashboard.OK"),
            callback: redirectHome,
          },
        ],
      })
      dispatch(actionCreators.addModal(modal))
    }
  })

  //Network stream messages
  user.addEventListener("networkState", (data: any) => {
    console.log(data, "networrkkkk")
    if (data.title === "networkStreamLost")
      console.log(data, "networkStreamLost")
    else if (data.title === "no_network") {
      connection = false
      console.log(data.reason, "no_network")
      // if (isCall) {
      //   user.leaveMeetingSession()
      //   dispatch(actionCreators.callToggleFlag(false))
      //   dispatch(actionCreators.setChatCallInfo(null))
      //   dispatch(actionCreators.setPublisherState(false))
      //   dispatch(actionCreators.clearMeetingStore())
      //   dispatch(actionCreators.clearMeetingFlags())
      //   dispatch(actionCreators.clearParticipantList())
      // }

      if (networkModalId) {
        dispatch(actionCreators.removeModal(networkModalId))
      }
      dispatch(actionCreators.callReconnection(true))
      let modal = new ModalData({
        message: t("Meeting.PleaseMakeSureConnectedToInternet"),
        type: "NetworkEvents",
        closeButton: false,
      })
      networkModalId = modal.id
      dispatch(actionCreators.addModal(modal))
    } else if (data.title === "connection_failed") {
      connection = false
      if (networkModalId) {
        dispatch(actionCreators.removeModal(networkModalId))
      }
      let notification = new NotificationData({
        message: t("Meeting.IdentifiedSomeProblems"),
        type: "success",
        check: "networkEvents",
      })
      dispatch(actionCreators.callReconnection(true))
      dispatch(actionCreators.addNotification(notification))
      let modal = new ModalData({
        message: t("Meeting.IdentifiedSomeProblems"),
        type: "NetworkEvents",
        closeButton: false,
      })
      networkModalId = modal.id
      dispatch(actionCreators.addModal(modal))
    } else if (data.title === "back_online") {
      if (networkModalId) {
        dispatch(actionCreators.removeModal(networkModalId))
      }
    } else if (data.title === "network_rejoin") {
      if (data.reason === "attempting to rejoin") {
        connection = false
        if (networkModalId) {
          dispatch(actionCreators.removeModal(networkModalId))
        }
        dispatch(actionCreators.callReconnection(true))
        let modal = new ModalData({
          message: t("Meeting.AttemptingToReconnect"),
          type: "NetworkEvents",
          closeButton: false,
          // buttons: [{
          //     buttonName: t("Dashboard.OK"),
          // }],
        })
        networkModalId = modal.id
        dispatch(actionCreators.addModal(modal))
      } else if (data.reason === "rejoined successfully") {
        dispatch(actionCreators.callReconnection(false))
        dispatch(actionCreators.removeModal(networkModalId))
        if (isCall && !connection) {
          const audio = new Audio(Connected)
          connection = true
          audio.currentTime = 0
          audio.play()
        }
      }
    }
  })

  //pause remote participants videos
  user.addEventListener("streammodified", (data: any) => {
    //
    if (data.title === "pause") {
      dispatch(actionCreators.pauseVideo(data))
    }
    if (data.title === "videoQuality") {
      let Quality: string = ""
      if (data.substream === 2 && data.temporal === 2) Quality = "High"
      else if (data.substream === 1 && data.temporal === 1) Quality = "Medium"
      else if (data.substream === 0 && data.temporal === 0) Quality = "Low"
      dispatch(actionCreators.setVideoQuality(Quality))
    }
  })

  //BroadCast Messages
  user.addEventListener("broadcast", (node: any) => {
    //
    if (node.message.title === "whiteboard") {
      if (
        node.message.type === "button" &&
        node.message.status !== selfParicipaniId
      ) {
        dispatch(actionCreators.clearWhiteBoardData())
        dispatch(actionCreators.setWhiteBoardState(node.message.status))
      } else {
        // dispatch(actionCreators.addWhiteBoardData(node.message.data))
      }
    } else if (node.message.title === "fileShare") {
      //
      if (node.message.action === "start") {
        const state = {
          modalState: false,
          base64: node.message.value,
          activeFile: 1,
          hostId: "",
          status: "progress",
        }
        //
        dispatch(actionCreators.setFileShareState(state))
      }
      if (node.message.action === "end") {
        const state = {
          modalState: false,
          base64: {},
          activeFile: "",
          hostId: "",
          status: "",
        }
        dispatch(actionCreators.setFileShareState(state))
      }
    }
  })

  //Limit participant
  user.addEventListener("notification", (data: any) => {
    const endMeeting = () => {
      user.clientAffirmation("concurrent_meet", { retain_session: false })
    }
    const continueMeeting = () => {
      user.clientAffirmation("concurrent_meet", { retain_session: true })
    }

    if (data.title === "start_record" && data.success === true) {
      dispatch(actionCreators.setRecording(true))
      hoverTimer(true, dispatch, "recording")
    }
    if (data.title === "stop_record") {
      hoverTimer(false, dispatch, "recording")
      dispatch(actionCreators.setRecording(false))
    }

    if (data.type === "response") {
      if (
        data.content.participant == selfParicipaniId &&
        data.content.type === "participant_stream_pause"
      ) {
        dispatch(actionCreators.setScreensharePausePublisher(data))
      }

      // if (data.pause) {
      //      dispatch(actionCreators.setScreensharePauseId(data?.participant_id))
      // } else {
      // dispatch(actionCreators.setScreensharePauseId(''))
      // }

      // data.pause
      //     ? dispatch(actionCreators.setScreensharePause(true))
      //     : dispatch(actionCreators.setScreensharePause(false))
    }
    if (data.type === "notification") {
      if (data.content.type === "participant_stream_pause") {
        dispatch(actionCreators.setScreensharePauseListener(data))
      }
    }
    // if (data.type === "concurrent_meet") {
    //     let modal = new ModalData({
    //         message: 'Already a participant, Do you want to end meeting in other device ?',
    //         type: "SDK INFO",
    //         closeButton: false,
    //          buttons: [{
    //              buttonName: "Yes",
    //              callback : endMeeting
    //          }, {
    //              buttonName: "No",
    //              callback: continueMeeting
    //              }]
    //     })
    //      dispatch(actionCreators.addModal(modal))
    // }
    if (
      data.title === "max_meeting_duration" &&
      data.reason === "duration_almost_reached" &&
      data.remaining_time === 3
    ) {
      let modal = new ModalData({
        message: t("Meeting.ThreeMinutesLeft"),
        type: "SDK INFO",
        closeButton: false,
        buttons: [
          {
            buttonName: t("Dashboard.OK"),
          },
        ],
      })
      dispatch(actionCreators.addModal(modal))
    }
    if (
      data.title === "max_meeting_duration" &&
      data.reason === "max_duration_reached"
    ) {
      let notification = new NotificationData({
        message: t("Meeting.MaximumAllowedDurationReached"),
        type: "success",
        check: "networkEvents",
      })
      dispatch(actionCreators.addNotification(notification))
      let modal = new ModalData({
        message: t("Meeting.MaximumAllowedDurationReached"),
        type: "SDK INFO",
        closeButton: false,
        buttons: [
          {
            buttonName: t("Dashboard.OK"),
            callback: redirectHome,
          },
        ],
      })
      dispatch(actionCreators.addModal(modal))
    }

    if (data.type === "broadcast_channel") {
      if (data.state === "open") {
        dispatch(actionCreators.setWhiteBoardSocket(true))
      } else {
        dispatch(actionCreators.setWhiteBoardSocket(false))
      }
    }
  })

  user.addEventListener("whiteboard", (node: any) => {
    dispatch(actionCreators.addWhiteBoardData(node.content))
  })

  return null
}

export default meetListeners
