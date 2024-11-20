import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { actionCreators } from "../../../../../store"
import meetListeners from "../../../../../listeners/meetListeners"
import { useNavigate } from "react-router-dom"
import hoverTimer from "../../../../../utils/hoverTimer"
import PinnedMessage from "./chatContainer/pinnedMessage"
import useOutsideClick from "./hooks/useOutsideClick "
import { t } from "i18next"
import HomeButton from "../../../../../atom/HomeButton/homeButton"
import ViewMore from "./chatContainer/viewMore"
import GroupIcon from "./Icons/groupIcon"
import { motion } from "framer-motion"
import CallActions from "./callActions"
const Cabello = require("./audio/incoming-outgoing-message/Cabello.mp3")
const _ = require("lodash")

const presenceColors: any = {
  online: "#76B947",
  call: "#EF4036",
  meeting: "#EF4036",
}

interface ChatHeaderType {
  name: string;
  profile_picture: any;
  lastSeen?: any;
  members?: any;
  inactive_members?: any;
  isGroup: boolean;
  presence?: any;
  restClass?: any;
  rest?: any;
  uuid: any;
  isAdmin: boolean;
  status: string;
  email: string;
  callDetail?: any;
  pinned_messages?: any;
  scrollIntoMessage: (id: string) => void;
  setViewMore?: any;
  viewMore?: any
}

const ChatHeader = ({
  name,
  profile_picture,
  lastSeen,
  members,
  isGroup,
  presence,
  uuid,
  isAdmin,
  status,
  email,
  callDetail,
  restClass,
  scrollIntoMessage,
  pinned_messages,
  inactive_members,
  setViewMore,
  viewMore,
  rest,
}: ChatHeaderType) => {
  const dispatch = useDispatch()
  const profileColors = ["#557BBB", "#B78931", "#91785B"]
  const addMember = useSelector((state: any) => state.Breakout.addMemberModal)
  const flagAddAdmin = useSelector((state: any) => state.Chat.setAddAdminModal)
  const meetingInstance = useSelector((state: any) => state.Main.meetingSession)
  const user = useSelector((state: any) => state.Main.meetingSession)
  const participantList = useSelector(
    (state: any) => state.Main.participantList
  )
  const chatInstance = useSelector((state: any) => state.Chat.chatInstance)
  const callInfo = useSelector((state: any) => state.Chat.chatCallInfo)
  //console.log(callInfo,participantList,"error call");
  const loggedInUserInfo = useSelector(
    (state: any) => state.Main.loggedInUserInfo
  )
  let colorIndex: any =
    (uuid?.match(/\d/g).join("") + new Date().getDate()) % profileColors.length
  const [attemptingToJoin, setAttempingtToJoin] = useState<boolean>(false)
  const [isOpenPinnedModal, setIsOpenPinnedModal] = useState<boolean>(false)
  const navigate = useNavigate()
  const pinnedModalRef = useRef<null | HTMLDivElement>(null)
  const miniProfileModal = useRef<null | HTMLDivElement>(null)
  const pinButton = useRef<null | HTMLDivElement>(null)
  const settings = useSelector((state: any) => state.Main.soundAndNotification)
  const callData = useSelector((state: any) => state.Chat.callData)
  const incomingCall = useSelector((state: any) => state.Chat.incomingCall)
  const { data: activeChat, isGroups } = useSelector(
    (state: any) => state.Chat.activeChat
  )
  const selfData = useSelector((state: any) => state.Chat.selfData)
  const callConnected = useSelector((state: any) => state.Chat.callConnected)
  const [grpinfo, setGrpinfo] = useState<any>({})
  const [endCall, setEndCall] = useState(false)
  const callToggleFlag = useSelector((state: any) => state.Chat.callToggleFlag)
  const [isWaiting, setIsWaiting] = useState(true)
  const [profile, setProfile] = useState("")

  const dispatchCall = (data: any) => {
    dispatch(actionCreators.clearParticipantList())
    dispatch(
      actionCreators.setChatCallInfo({
        audioCall: data.audioCall,
        videoCall: data.videoCall,
        profile_picture: profile_picture,
        name: name,
        groupName: isGroup ? name : null,
        uuid: uuid,
        isGroup: isGroup,
        outGoing: true,
      })
    )
    dispatch(actionCreators.setChatCallMic(data.audioCall))
    dispatch(actionCreators.setChatCallCamera(data.videoCall))

    meetingInstance
      .createInstantMeeting({ join_mode: "open", type: "huddle" })
      .then(async (response: any) => {
        meetingInstance
          .preAuth({ meetingId: response.id })
          .then(async (meetingData: any) => {
            dispatch(actionCreators.setIsHost(meetingData.host))
            dispatch(actionCreators.setMeetingId(response.id))
            dispatch(actionCreators.setMeetingInfo(meetingData))
            dispatch(actionCreators.callData(_.cloneDeep(meetingData)))
            dispatch(
              actionCreators.callToggle({
                to: uuid,
                from: uuid,
                body: {
                  meetingData: meetingData,
                  data: {
                    isGroup: isGroup,
                  },
                },
              })
            )

            chatInstance?.grafanaLogger([
              "Client : Call Initiated",
              {
                uuid: response.uuid,
              },
            ])
            hoverTimer(true, dispatch)
            await meetingInstance.startMeetingSession(
              data.audioCall,
              data.videoCall,
              data.name
            )
            await chatInstance?.publishMessage("call", uuid, isGroup, {
              message: {
                action: "initiate",
                meetingId: response.id,
                meetingData: meetingData,
                data: data,
              },
              meeting_id: response.id,
              init_participants: isGroup
                ? undefined
                : [uuid, loggedInUserInfo?.sub],
              group_members: isGroup
                ? members.map((member: any) => {
                  return member.uuid
                })
                : [],
            })

            setTimeout(() => {
              dispatch(actionCreators.callConnected(true))
            }, 1000)
          })
        return response
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
    //chatInstance?.publishMessage('message',"call", uuid, isGroup);

    meetListeners(
      dispatch,
      navigate,
      participantList,
      user,
      true,
      chatInstance,
      callData,
      callInfo
    )
  }

  const playSound = () => {
    if (!settings[0]?.mute) {
      const audio = new Audio(Cabello)
      audio.currentTime = 0
      //audio.loop = true
      audio.play()
    }
  }

  const setAudioCall = (item: any) => {
    playSound()
    const data = {
      audioCall: true,
      videoCall: false,
      profile_picture: isGroup ? GroupIcon : selfData?.profile_picture,
      name: selfData?.display_name ?? loggedInUserInfo?.name,
      groupName: isGroup ? name : null,
      uuid: isGroup ? uuid : loggedInUserInfo?.sub,
      isGroup: isGroup,
    }

    dispatchCall(data)
  }

  const setVideoCall = (profile_picture: any, name: any) => {
    playSound()

    const data = {
      audioCall: true,
      videoCall: true,
      profile_picture: selfData?.profile_picture,
      name: selfData?.display_name ?? loggedInUserInfo?.name,
      groupName: isGroup ? name : null,
      uuid: loggedInUserInfo?.sub,
      isGroup: isGroup,
    }
    dispatchCall(data)
  }

  const joinExistingCall = () => {
    setAttempingtToJoin(true)
    dispatch(actionCreators.callToggleFlag(true))
    dispatch(actionCreators.setIncomingCallModal(false))
    if (incomingCall) dispatch(actionCreators.unsetIncomingCall(true))
    if (callInfo) {
      meetingInstance.leaveMeetingSession()
      dispatch(actionCreators.callToggleFlag(false))
      dispatch(actionCreators.callConnected(false))
      chatInstance?.grafanaLogger([
        "Client : Left MeetingSession",
        callInfo.uuid,
      ])
      chatInstance?.publishMessage("call", callInfo.uuid, callInfo.isGroup, {
        message: {
          action: "end",
          meetingId: callData.meetingId,
        },
      })
    }
    dispatch(actionCreators.setPublisherState(false))
    dispatch(actionCreators.clearMeetingStore())
    dispatch(actionCreators.clearMeetingFlags())
    dispatch(actionCreators.clearParticipantList())
    dispatch(
      actionCreators.setChatCallInfo({
        audioCall: true,
        videoCall: false,
        profile_picture: callDetail?.profile_picture,
        name: callDetail?.name,
        groupName: name,
        uuid: uuid,
        isGroup: isGroup,
      })
    );
    dispatch(actionCreators.setChatCallMic(true))
    dispatch(actionCreators.setChatCallCamera(false))
    meetingInstance
      .preAuth({
        meetingId: callDetail?.meeting_id,
        password: callDetail?.password,
      })
      .then(async (response: any) => {
        dispatch(actionCreators.setIsHost(response.host))
        dispatch(actionCreators.setMeetingId(callDetail.meeting_id))
        dispatch(actionCreators.setMeetingInfo(response))
        dispatch(actionCreators.callData(_.cloneDeep(response)))
        setAttempingtToJoin(false)

        hoverTimer(true, dispatch)
        await meetingInstance.startMeetingSession(
          true,
          false,
          selfData?.display_name ?? loggedInUserInfo?.name
        )
        chatInstance?.publishMessage("call", uuid, activeChat.isGroup, {
          message: {
            action: "join",
            meetingId: callDetail?.meeting_id,
            data: {
              name: selfData?.display_name ?? loggedInUserInfo?.name,
              profile_picture:
                selfData?.profile_picture ?? loggedInUserInfo?.picture,
              uuid: loggedInUserInfo?.sub,
              password: callDetail?.password,
            },
          },
          callAction: "join",
        })
        dispatch(actionCreators.callConnected(true))
        meetListeners(
          dispatch,
          navigate,
          participantList,
          user,
          true,
          chatInstance,
          callData,
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

  useEffect(() => {
    if (callInfo !== null) getGroupInfo(callInfo.uuid)
  }, [profile_picture])

  const setGrpAdmin = () => {
    dispatch(actionCreators.setAddMemberModal(true))
    dispatch(actionCreators.setAddAdminModal(true))
  }

  const togglePinnedModal = (event: any) => {
    setIsOpenPinnedModal((prev) => !prev)
    event.stopPropagation()
  }

  const scrollToPinned = (id: string) => {
    scrollIntoMessage(id)
    setIsOpenPinnedModal(false)
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

  const handleUnpin = (e: any, id: string) => {
    e.stopPropagation()
    if (pinned_messages.length === 1) {
      setIsOpenPinnedModal(false)
    }
    chatInstance?.pinMessage(uuid, isGroup, id, false)
    // dispatch(actionCreators.pinMessage(uuid, isGroup, id, loggedInUserInfo?.sub, false));
    chatInstance?.grafanaLogger(["Client : Unpin Messages"], {
      uuid: uuid,
      isGroup: isGroup,
      messageUUID: id,
      selfId: loggedInUserInfo?.sub,
    })
  }

  const closePinnedModal = () => {
    setIsOpenPinnedModal(false)
  }

  const closeMiniProfile = () => {
    dispatch(actionCreators.setMiniProfile(false))
  }

  useOutsideClick(pinnedModalRef, closePinnedModal, pinButton)

  useOutsideClick(miniProfileModal, closeMiniProfile)

  const getGroupInfo = (uuid: any) => {
    chatInstance
      ?.getGroupData(uuid)
      .then((res: any) => {
        console.log(res, "grpinfo")
        setGrpinfo(res)
      })
      .catch((err: any) => { })
  }

  const postInvite = () => {
    const data = {
      audioCall: true,
      videoCall: false,
      profile_picture: selfData?.profile_picture,
      name: selfData?.display_name ?? loggedInUserInfo?.name,
      groupName: callInfo.isGroup ? callInfo.groupName : null,
      uuid: loggedInUserInfo?.sub,
      isGroup: false,
      guestMember: false,
      participants: participantList.map((participant: any) => {
        return {
          name: participant.name,
          picture: participant.profile_picture,
        }
      }),
    }

    let newData = data
    if (callInfo?.isGroup) {
      let member = grpinfo?.members?.find(
        (member: any) => member.user_id === activeChat.uuid
      )
      if (member) {
        newData.uuid = callInfo?.uuid
        newData.isGroup = true
        newData.profile_picture = GroupIcon
      } else {
        newData.guestMember = true
      }
    }
    chatInstance?.publishMessage("call", uuid, false, {
      message: {
        action: "invite",
        meetingId: callData.meetingId,
        meetingData: callData,
        data: newData,
      },
      meeting_id: callData.meetingId,
    })
    dispatch(actionCreators.setInviteState({ uuid: uuid, state: "waiting" }))
    setTimeout(() => {
      dispatch(actionCreators.setInviteState({ uuid: uuid, state: "invited" }))
    }, 6000)
    // setWaitingPersons([...waitingPersons, {
    //   id: uuid,
    //   count : 6
    // }])
    //   const currentIndex = [
    //     ...waitingPersons,
    //     {
    //       id: uuid,
    //       count: 6,
    //     },
    //   ].findIndex((person) => person?.id === uuid)
    //    const list = [...waitingPersons, {
    //     id: uuid,
    //     count : 6
    //    }]
    //        console.log(
    //          "count-decre0000",
    //          list[currentIndex].count,
    //          waitingPersons,
    //          list
    //        )
    // const invitedIndex = invitedPersons.findIndex((person: any) => person.id === uuid)
    // if (invitedIndex) {
    //   const inviteList = invitedPersons
    //   inviteList.splice(invitedIndex, 1)
    //   setInvitedPersons(inviteList)
    // }
    // setTimeout(() => {
    //   // clearTimeout(timeout)
    //   const list = waitingPersons
    //   setInvitedPersons([...invitedPersons,{id: uuid}])
    //   list.splice(currentIndex, 1)
    //   setWaitingPersons(list)
    // }, 6000);
  }
  // console.log(profile_picture, "profile_pic222")
  useEffect(() => {
    const newUrl = profile_picture?.replace(
      /\.(jpg|jpeg|png|gif)$/,
      "-low.webp"
    )
    setProfile(newUrl)
  }, [activeChat?.profile_picture, profile_picture])

  useEffect(() => {
    if (!callInfo) {
      dispatch(actionCreators.setInviteState(false))
      // setWaitingPersons([])
      // setInvitedPersons([])
    }
    const handleKeyPress = (event: any) => {
      if (
        event.keyCode === 72 &&
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        !callInfo &&
        !incomingCall &&
        !callDetail
      ) {
        setAudioCall(activeChat)
      }
    }
    window.addEventListener("keydown", handleKeyPress)

    return () => {
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [name, profile_picture, incomingCall, callInfo, callDetail])

  useEffect(() => {
    if (endCall && callConnected) {
      setEndCall(false)
      dispatch(actionCreators.callConnected(false))
      chatInstance?.publishMessage("call", callInfo.uuid, callInfo.isGroup, {
        message: {
          action: callToggleFlag || !isWaiting ? "end" : "terminate",
          meetingId: callData.meetingId,
        },
        callAction: callToggleFlag || !isWaiting ? "" : "terminate",
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

  return (
    <div
      className={`w-full h-fit min-h-[50px] py-2 flex flex-col justify-center
       rounded-t-[10px] border-b-[2px] border-b-[#F1F1F1] relative bg-[#FFFFFF]`}
    >
      <div className={`px-[25.5px] flex flex-row items-center w-full h-full`}>
        <div
          id="profileContainer"
          {...{ email: email }}
          className={` w-1/2 h-full flex items-center cursor-pointer`}
          onClick={(e: any) => {
            setViewMore(true)
          }}
        >
          <div
            style={{
              ...(isGroup === false && {
                backgroundColor: profileColors[colorIndex],
              }),
            }}
            className={` ${!isGroup
              ? "border-[2px] border-[#E9EBF8]"
              : "bg-[#E1E1E1] pl-[3px] pt-[2px]"
              } w-[36px] h-[36px] rounded-bl-none rounded-[50%] shrink-0 text-center text-[20px]  text-[white]  overflow-hidden relative`}
          >
            {profile_picture ? (
              <img
                className="w-[36px] h-[36px]  object-cover "
                src={profile}
                onError={() => setProfile(profile_picture)}
                alt=""
              />
            ) : isGroup ? (
              <svg
                className="mt-[4px] ml-[2px]"
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M4.25 6.75C4.25 6.28587 4.43437 5.84075 4.76256 5.51256C5.09075 5.18437 5.53587 5 6 5C6.46413 5 6.90925 5.18437 7.23744 5.51256C7.56563 5.84075 7.75 6.28587 7.75 6.75C7.75 7.21413 7.56563 7.65925 7.23744 7.98744C6.90925 8.31563 6.46413 8.5 6 8.5C5.53587 8.5 5.09075 8.31563 4.76256 7.98744C4.43437 7.65925 4.25 7.21413 4.25 6.75ZM4 11.6781C3.6875 12.0281 3.5 12.4938 3.5 13C3.5 13.5063 3.6875 13.9719 4 14.3219V11.6781ZM8.5125 10.1375C7.58437 10.9594 7 12.1625 7 13.5C7 14.5719 7.375 15.5562 8 16.3281V17C8 17.5531 7.55312 18 7 18H5C4.44688 18 4 17.5531 4 17V16.1625C2.81875 15.6 2 14.3969 2 13C2 11.0656 3.56562 9.5 5.5 9.5H6.5C7.25 9.5 7.94375 9.73438 8.5125 10.1344V10.1375ZM16 17V16.3281C16.625 15.5562 17 14.5719 17 13.5C17 12.1625 16.4156 10.9594 15.4875 10.1344C16.0563 9.73438 16.75 9.5 17.5 9.5H18.5C20.4344 9.5 22 11.0656 22 13C22 14.3969 21.1812 15.6 20 16.1625V17C20 17.5531 19.5531 18 19 18H17C16.4469 18 16 17.5531 16 17ZM16.25 6.75C16.25 6.28587 16.4344 5.84075 16.7626 5.51256C17.0908 5.18437 17.5359 5 18 5C18.4641 5 18.9092 5.18437 19.2374 5.51256C19.5656 5.84075 19.75 6.28587 19.75 6.75C19.75 7.21413 19.5656 7.65925 19.2374 7.98744C18.9092 8.31563 18.4641 8.5 18 8.5C17.5359 8.5 17.0908 8.31563 16.7626 7.98744C16.4344 7.65925 16.25 7.21413 16.25 6.75ZM20 11.6781V14.325C20.3125 13.9719 20.5 13.5094 20.5 13.0031C20.5 12.4969 20.3125 12.0312 20 11.6813V11.6781ZM12 5C12.5304 5 13.0391 5.21071 13.4142 5.58579C13.7893 5.96086 14 6.46957 14 7C14 7.53043 13.7893 8.03914 13.4142 8.41421C13.0391 8.78929 12.5304 9 12 9C11.4696 9 10.9609 8.78929 10.5858 8.41421C10.2107 8.03914 10 7.53043 10 7C10 6.46957 10.2107 5.96086 10.5858 5.58579C10.9609 5.21071 11.4696 5 12 5ZM9.5 13.5C9.5 14.0063 9.6875 14.4688 10 14.8219V12.1781C9.6875 12.5313 9.5 12.9938 9.5 13.5ZM14 12.1781V14.825C14.3125 14.4719 14.5 14.0094 14.5 13.5031C14.5 12.9969 14.3125 12.5312 14 12.1812V12.1781ZM16 13.5C16 14.8969 15.1812 16.1 14 16.6625V18C14 18.5531 13.5531 19 13 19H11C10.4469 19 10 18.5531 10 18V16.6625C8.81875 16.1 8 14.8969 8 13.5C8 11.5656 9.56563 10 11.5 10H12.5C14.4344 10 16 11.5656 16 13.5Z"
                  fill={profileColors[colorIndex]}
                />
              </svg>
            ) : (
              <div className="capitalize mt-[1px]">{name?.slice(0, 1)}</div>
            )}
          </div>
          {(() => {
            if (
              presence === "online" ||
              presence === "call" ||
              presence === "meeting"
            ) {
              return (
                <div className="ml-[23px] mt-[26px] absolute">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="6.5"
                      cy="6.5"
                      r="5.75"
                      fill={presenceColors[presence]}
                      stroke="white"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              )
            }
          })()}

          <div className={`mx-[11.5px] w-full flex flex-col`}>
            <div
              className={`w-auto h-[22px] text-[16px] text-left justify-start font-bold text-[#293241] truncate`}
            >
              {name}
            </div>
            {(() => {
              if (!isGroup) {
                return (
                  <div
                    className={`w-auto h-[15px] text-[14px] font-normal flex justify-start text-[#707070]`}
                  >
                    {presence !== "online"
                      ? presence === "call"
                        ? "Currently in a call"
                        : presence === "meeting"
                          ? "Currently in a meeting"
                          : lastSeen && <RelativeTime date={lastSeen} />
                      : "Online"}
                  </div>
                )
              } else if (status !== "archive") {
                return (
                  <div
                    className={`w-auto h-[14px] text-[12px] cursor-pointer font-normal flex justify-start text-[#C4C4C4]`}
                  >
                    {members.length ? (
                      <div>{members?.length} People</div>
                    ) : null}
                  </div>
                )
              }
            })()}
          </div>
        </div>
        {viewMore && (
          <div className="absolute top-[265px]">
            <ViewMore
              mention={activeChat}
              isGroup={isGroup}
              mentionFlag={false}
              setViewMore={setViewMore}
              setVideoCall={setVideoCall}
              setAudioCall={setAudioCall}
              grpHover={false}
            />
          </div>
        )}

        <div className={`w-full h-full flex flex-row-reverse`}>
          {(() => {
            if (
              isGroup &&
              !activeChat.private &&
              activeChat.status !== "inactive" &&
              activeChat.status !== "disabled" &&
              activeChat.status !== "deleted" &&
              activeChat?.members.length > 0 &&
              activeChat.status !== "archive" &&
              !activeChat?.members?.find(
                (member: any) => member.user_id === loggedInUserInfo?.sub
              )
            ) {
              return (
                <div>
                  <HomeButton
                    id="joinMeeting"
                    handleClick={() => {
                      chatInstance
                        ?.joinGroup(activeChat.uuid)
                        .then((res: any) => { })
                    }}
                    restClass={
                      "relative -left-0.5 min-w-[60px] py-1 rounded-r-[3px] text-[14px] text-[#B1B1B1] bg-[#293241] opacity-90 h-[36px] w-[60px] cursor-pointer px-1"
                    }
                  >
                    {t("Dashboard.Join")}
                  </HomeButton>
                </div>
              )
            }
          })()}
          <CallActions
            callDetail={callDetail}
            status={status}
            isGroup={isGroup}
            members={members}
            uuid={uuid}
            joinExistingCall={joinExistingCall}
            setAudioCall={setAudioCall}
            postInvite={postInvite}
            setEndCall={setEndCall}
            name={name}
          />
        </div>
      </div>
      {pinned_messages &&
        pinned_messages?.filter(
          (pin: any) => pin?.category !== "delete_message"
        ).length > 0 && (
          <div className="w-full h-[25px] mt-2 px-6 flex items-center rounded-t-[5px] border-t-[2px] border-t-[#F1F1F1]  justify-start gap-2.5">
            <div
              ref={pinButton}
              onClick={togglePinnedModal}
              className="px-1.5 mt-2 bg-[#FFE4E4] rounded-[5px] justify-start items-center gap-0.5 flex cursor-pointer"
            >
              <div className="w-[16.50px] h-[16.50px] relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M6.1279 4.125C6.1279 3.50273 6.63063 3 7.2529 3H16.2529C16.8752 3 17.3779 3.50273 17.3779 4.125C17.3779 4.74727 16.8752 5.25 16.2529 5.25H15.2158L15.6166 10.4602C16.9068 11.1598 17.9263 12.3305 18.4115 13.7895L18.4466 13.8949C18.5627 14.2395 18.5029 14.6156 18.292 14.9074C18.081 15.1992 17.74 15.375 17.3779 15.375H6.1279C5.76579 15.375 5.42829 15.2027 5.21384 14.9074C4.99938 14.6121 4.94313 14.2359 5.05915 13.8949L5.0943 13.7895C5.57946 12.3305 6.59899 11.1598 7.88923 10.4602L8.29001 5.25H7.2529C6.63063 5.25 6.1279 4.74727 6.1279 4.125ZM10.6279 16.5H12.8779V19.875C12.8779 20.4973 12.3752 21 11.7529 21C11.1306 21 10.6279 20.4973 10.6279 19.875V16.5Z"
                    fill="#5C6779"
                  />
                </svg>
                <div className="w-[16.50px] h-[16.50px] left-0 top-0 absolute " />
              </div>
              <div className="text-center text-[#A7A9AB] text-xs font-normal">
                {
                  pinned_messages?.filter(
                    (pin: any) => pin?.category !== "delete_message"
                  )?.length
                }{" "}
                Pinned
              </div>
            </div>
          </div>
        )}
      {isOpenPinnedModal && pinned_messages.length > 0 && (
        <motion.div
          key="pinnedhead"
          initial={{ opacity: 0, translateY: "-10px" }}
          animate={{
            opacity: 1,
            translateY: "0px",
            transition: { duration: 0.3 },
          }}
          ref={pinnedModalRef}
          className="absolute ml-6 top-[85px] bg-[#F1F1F1] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.10) z-[100] w-1/2 max-h-[500px] min-w-fit sm:min-w-[400px] overflow-y-auto overflow-x-hidden p-3   rounded-[5px] shadow flex-col justify-start items-start gap-2.5 flex"
        >
          {pinned_messages
            ?.filter((pin: any) => pin?.category !== "delete_message")
            ?.map((item: any, index: number) => (
              <div
                onClick={() => scrollToPinned(item?.uuid)}
                className="bg-[#ffffff] relative cursor-pointer self-stretch rounded-[5px] border border-[#0000001f] border-opacity-10 justify-start items-start inline-flex"
              >
                <button
                  onClick={(e: any) => handleUnpin(e, item?.uuid)}
                  className="absolute top-0 right-0 m-1 z-[3]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="26"
                    viewBox="0 0 26 26"
                    fill="none"
                  >
                    <g clip-path="url(#clip0_749_27404)">
                      <path
                        d="M15.123 6.03681L12.001 9.83633C11.8092 10.0721 11.5165 10.2067 11.215 10.2015C10.1958 10.186 9.17606 10.5364 8.36492 11.2426L7.75554 11.7696L11.4417 14.3507L13.1625 11.8933C13.3202 11.668 13.6336 11.6128 13.8588 11.7705C14.0841 11.9282 14.1393 12.2416 13.9816 12.4669L12.2609 14.9243L15.9471 17.5054L16.2365 16.7543C16.6227 15.7505 16.6031 14.6725 16.24 13.7201C16.1312 13.4341 16.1584 13.1174 16.3143 12.8566L18.8143 8.62149C18.8261 8.59922 18.8405 8.57874 18.8566 8.5557L15.1704 5.97461C15.1561 5.99509 15.1417 6.01556 15.123 6.03681ZM10.8682 15.1699L7.18197 12.5888C6.92854 12.4113 6.77113 12.1295 6.75735 11.8222C6.74357 11.515 6.86829 11.217 7.1018 11.0143L7.70862 10.4855C8.71255 9.61289 9.97167 9.1822 11.2292 9.20055L13.7137 6.17537L14.3513 5.40103L13.7369 4.97085C13.6627 4.91887 13.6079 4.84999 13.5723 4.77549C13.4971 4.61598 13.5083 4.42552 13.6141 4.27448C13.7718 4.04922 14.0852 3.99396 14.3105 4.1517L14.9248 4.58188L20.2493 8.31012L20.8637 8.74031C21.0889 8.89804 21.1442 9.2114 20.9865 9.43667C20.8807 9.5877 20.7056 9.66346 20.53 9.6473C20.4478 9.63935 20.3643 9.61144 20.2901 9.55946L19.6757 9.12928L19.1662 9.99324L17.1732 13.3626C17.6205 14.538 17.6446 15.871 17.1698 17.1103L16.8804 17.8614C16.7698 18.1501 16.5324 18.3693 16.239 18.4614C15.9456 18.5535 15.6244 18.5002 15.3735 18.3246L11.6873 15.7435L9.10621 19.4296C8.94847 19.6549 8.63511 19.7102 8.40984 19.5524C8.18458 19.3947 8.12932 19.0813 8.28706 18.8561L10.8682 15.1699Z"
                        fill="#5C6779"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_749_27404">
                        <rect
                          width="18"
                          height="18"
                          fill="white"
                          transform="translate(10.7896 0.465332) rotate(35)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
                <div className="w-full self-stretch p-1.5 bg-white rounded-[5px] justify-start items-start gap-1.5 flex">
                  <PinnedMessage
                    item={item}
                    own={item?.from === loggedInUserInfo?.sub}
                    profile_picture={
                      item?.from === loggedInUserInfo?.sub
                        ? selfData?.profile_picture
                        : profile_picture
                    }
                    index={index}
                    key={item?.uuid}
                    members={members}
                    inactive_members={inactive_members}
                    uuid={uuid}
                    status={status}
                    isGroup={isGroup}
                    lastChild={false}
                    name={
                      item?.from === loggedInUserInfo?.sub
                        ? loggedInUserInfo?.display_name
                        : name
                    }
                    chatUsername={name}
                    sameSource={false}
                    handleClick={() => { }}
                  />
                </div>
              </div>
            ))}
        </motion.div>
      )}
    </div>
  )
}

export default ChatHeader

const RelativeTime = (props: any) => {
  const [relativeTime, setRelativeTime] = useState(getRelativeTime(props.date))

  useEffect(() => {
    setRelativeTime(getRelativeTime(props.date))
    let secTimer = setInterval(() => {
      setRelativeTime(getRelativeTime(props.date))
    }, 5000)

    return () => clearInterval(secTimer)
  }, [props.date])

  return <div>{relativeTime}</div>
}

const getRelativeTime = (date: number) => {
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date) / 1000)

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ]

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds)

    if (count >= 1) {
      if (interval.label === "minute" && count >= 90) {
        return `${t("Chat.LastSeen")} ${Math.round(count / 60)} ${t(
          "Chat.HoursAgo"
        )}`
      } else {
        return `${t("Chat.LastSeen")} ${count} ${interval.label}${count > 1 ? "s" : ""
          } ${t("Chat.Ago")}`
      }
    }
  }

  return `${t("Chat.LastSeenAFewSecondsAgo")}`
}
