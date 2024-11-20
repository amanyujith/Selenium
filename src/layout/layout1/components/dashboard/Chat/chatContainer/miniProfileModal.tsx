import { useDispatch, useSelector } from "react-redux"
import { actionCreators } from "../../../../../../store"
import hoverTimer from "../../../../../../utils/hoverTimer"
import meetListeners from "../../../../../../listeners/meetListeners"
import { useNavigate } from "react-router-dom"
import path from "../../../../../../navigation/routes.path"
import { useEffect, useState } from "react"
import ViewMore from "./viewMore"
import { IChatRoot } from "../interfaces"
import Tooltip from "../../../../../../atom/ToolTip/Tooltip"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

const Cabello = require("../audio/incoming-outgoing-message/Cabello.mp3")
const _ = require("lodash")
const presenceColors: any = {
  online: "#76B947",
  call: "#EF4036",
}
interface Props {
  mention: any
  isGroup: any
  mentionFlag: boolean
  grpHover: boolean
  quadrant?: string
  setmodal?: any
}
const MiniProfileModal = ({
  mention,
  isGroup,
  mentionFlag,
  grpHover,
  quadrant,
  setmodal,
}: Props) => {
  const user = useSelector((state: any) => state.Main.meetingSession)
  const callInfo = useSelector((state: any) => state.Chat.chatCallInfo)
  const meetingInfo = useSelector((state: any) => state.Main.meetingInfo)
  const settings = useSelector((state: any) => state.Main.soundAndNotification)
  const [viewMore, setViewMore] = useState(false)
  const [loader, setLoader] = useState(true)
  const miniProfile = useSelector((state: any) => state.Chat.setMiniProfile)
  const meetingInstance = useSelector((state: any) => state.Main.meetingSession)
  const profileColors = ["#557BBB", "#B78931", "#91785B"]
  const { data: activeChat, isGroups } = useSelector(
    (state: any) => state.Chat.activeChat
  )
  const chatInstance = useSelector((state: any) => state.Chat.chatInstance)
  const loggedInUserInfo = useSelector(
    (state: any) => state.Main.loggedInUserInfo
  )
  const navigate = useNavigate()
  const selfData = useSelector((state: any) => state.Chat.selfData)
  const participantList = useSelector(
    (state: any) => state.Main.participantList
  )
  const [data, setData] = useState<any>({})
  let colorIndex: any =
    (data?.uuid?.match(/\d/g).join("") + new Date().getDate()) %
    profileColors.length
  const dispatch = useDispatch()
  const [profile, setProfile] = useState("")

  const dispatchCall = (data: any, mention: any) => {
    dispatch(actionCreators.clearParticipantList())
    dispatch(
      actionCreators.setChatCallInfo({
        audioCall: data.audioCall,
        videoCall: data.videoCall,
        profile_picture: mention.profile_picture,
        name: mention.name ? mention.name : mention.display_name,
        groupName: isGroup ? mention.name : null,
        uuid: mention.uuid,
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
                to: mention.uuid,
                from: mention.uuid,
                body: {
                  meetingData: meetingData,
                  data: {
                    isGroup: isGroup,
                  },
                },
              })
            )

            hoverTimer(true, dispatch)
            await meetingInstance.startMeetingSession(
              data.audioCall,
              data.videoCall,
              data.name
            )
            await chatInstance?.publishMessage("call", mention.uuid, isGroup, {
              message: {
                action: "initiate",
                meetingId: response.id,
                meetingData: meetingData,
                data: data,
              },
              meeting_id: response.id,
              init_participants: isGroup
                ? undefined
                : [mention.uuid, loggedInUserInfo?.sub],
            })
            dispatch(actionCreators.callConnected(true))
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
      meetingInfo,
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

  useEffect(() => {
    Object.keys(data).length === 0 ? setLoader(true) : setLoader(false)
  }, [data])

  useEffect(() => {
    const newUrl = data.profile_picture?.replace(
      /\.(jpg|jpeg|png|gif)$/,
      "-low.webp"
    )
    setProfile(newUrl)
  }, [data.profile_picture])

  const setAudioCall = (mention: any) => {
    playSound()
    const data = {
      audioCall: true,
      videoCall: false,
      profile_picture: selfData?.profile_picture ?? loggedInUserInfo?.picture,
      name: selfData?.display_name ?? loggedInUserInfo?.name,
      groupName: isGroup ? mention.name : null,
      uuid: loggedInUserInfo?.sub,
      isGroup: isGroup,
    }
    dispatchCall(data, mention)
  }

  const getData = (id: any) => {
    setLoader(true)
    chatInstance?.GetUser(id).then((res: any) => {
      const selfData = res.filter((user: any) => {
        return user.uuid === id
      })
      setData(selfData[0] ? selfData[0] : selfData)
    })
    setLoader(false)
  }

  useEffect(() => {
    let id = mention.user_id ? mention.user_id : mention.uuid
    if (mentionFlag === true) {
      setTimeout(() => {
        getData(id)
      }, 1000)
    } else {
      getData(id)
    }
  }, [])

  const routeChange = (mention: any) => {
    dispatch(
      actionCreators.setAcitveChat(mention.uuid, mention.members ? true : false)
    )
    dispatch(actionCreators.setMiniProfile(false))
    navigate(`${path.CHAT}/${mention.uuid}`)
  }

  const setVideoCall = (mention: any) => {
    playSound()

    const data = {
      audioCall: true,
      videoCall: true,
      profile_picture: selfData?.profile_picture ?? loggedInUserInfo?.picture,
      name: selfData?.display_name ?? loggedInUserInfo?.name,
      groupName: isGroup ? mention.name : null,
      uuid: loggedInUserInfo?.sub,
      isGroup: isGroup,
    }
    dispatchCall(data, mention)
  }

  return (
    <div
      className={`absolute rounded-[15px] shadow-md z-10 font-sans
      ${
        // quadrant === 'Top-Left' ? " -bottom-[190px]" :
        quadrant === "Top-Left"
          ? " left-0 bottom-auto"
          : // quadrant === 'Top-Right' ? "-bottom-[190px] -left-64" :
          quadrant === "Top-Right"
          ? " bottom-auto -left-64"
          : quadrant === "Bottom-Left"
          ? " left-0 bottom-5"
          : " bottom-5 -left-[260px]"
      }
      `}
    >
      {loader ? (
        Loader
      ) : (
        <div className="bg-[#ffffff] w-[330px] rounded-[15px] shadow-lg relative group-mention flex flex-col">
          <div className="bg-[#E9EBF8] px-4 pt-4 pb-2 rounded-t-[15px] flex flex-col">
            <div
              style={{
                ...(isGroup === false && {
                  backgroundColor: profileColors[colorIndex],
                }),
              }}
              className={` ${
                !isGroup
                  ? "border-[2px] border-[#E9EBF8] text-[white] "
                  : "bg-[#ffffff]"
              } w-[70px] h-[70px] shrink-0 text-center rounded-bl-none rounded-[50%] text-[50px] text-[white] overflow-hidden relative`}
            >
              {data?.profile_picture ? (
                <img
                  className="w-[70px] h-[70px]  object-cover "
                  src={profile}
                  onError={() => setProfile(data?.profile_picture)}
                  alt=""
                />
              ) : data?.members ? (
                <svg
                  className="mt-6 ml-4"
                  width="38"
                  height="26"
                  viewBox="0 0 38 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.90927 3.45526C4.90927 2.61139 5.2445 1.80208 5.8412 1.20537C6.43791 0.608664 7.24722 0.273438 8.09109 0.273438C8.93496 0.273438 9.74427 0.608664 10.341 1.20537C10.9377 1.80208 11.2729 2.61139 11.2729 3.45526C11.2729 4.29913 10.9377 5.10843 10.341 5.70514C9.74427 6.30185 8.93496 6.63707 8.09109 6.63707C7.24722 6.63707 6.43791 6.30185 5.8412 5.70514C5.2445 5.10843 4.90927 4.29913 4.90927 3.45526ZM4.45472 12.4155C3.88654 13.0518 3.54563 13.8984 3.54563 14.8189C3.54563 15.7393 3.88654 16.5859 4.45472 17.2223V12.4155ZM12.6593 9.61435C10.9718 11.1087 9.90927 13.2962 9.90927 15.728C9.90927 17.6768 10.5911 19.4666 11.7275 20.87V22.0916C11.7275 23.0973 10.915 23.9098 9.90927 23.9098H6.27291C5.26722 23.9098 4.45472 23.0973 4.45472 22.0916V20.5689C2.307 19.5462 0.818359 17.3587 0.818359 14.8189C0.818359 11.3018 3.66495 8.45526 7.182 8.45526H9.00018C10.3638 8.45526 11.6252 8.88139 12.6593 9.60867V9.61435ZM26.2729 22.0916V20.87C27.4093 19.4666 28.0911 17.6768 28.0911 15.728C28.0911 13.2962 27.0286 11.1087 25.3411 9.60867C26.3752 8.88139 27.6365 8.45526 29.0002 8.45526H30.8184C34.3354 8.45526 37.182 11.3018 37.182 14.8189C37.182 17.3587 35.6934 19.5462 33.5456 20.5689V22.0916C33.5456 23.0973 32.7331 23.9098 31.7275 23.9098H28.0911C27.0854 23.9098 26.2729 23.0973 26.2729 22.0916ZM26.7275 3.45526C26.7275 2.61139 27.0627 1.80208 27.6594 1.20537C28.2561 0.608664 29.0654 0.273438 29.9093 0.273438C30.7531 0.273438 31.5624 0.608664 32.1592 1.20537C32.7559 1.80208 33.0911 2.61139 33.0911 3.45526C33.0911 4.29913 32.7559 5.10843 32.1592 5.70514C31.5624 6.30185 30.7531 6.63707 29.9093 6.63707C29.0654 6.63707 28.2561 6.30185 27.6594 5.70514C27.0627 5.10843 26.7275 4.29913 26.7275 3.45526ZM33.5456 12.4155V17.228C34.1138 16.5859 34.4547 15.745 34.4547 14.8246C34.4547 13.9041 34.1138 13.0575 33.5456 12.4212V12.4155ZM19.0002 0.273438C19.9646 0.273438 20.8895 0.656553 21.5715 1.3385C22.2534 2.02045 22.6365 2.94538 22.6365 3.9098C22.6365 4.87423 22.2534 5.79915 21.5715 6.4811C20.8895 7.16305 19.9646 7.54617 19.0002 7.54617C18.0358 7.54617 17.1108 7.16305 16.4289 6.4811C15.7469 5.79915 15.3638 4.87423 15.3638 3.9098C15.3638 2.94538 15.7469 2.02045 16.4289 1.3385C17.1108 0.656553 18.0358 0.273438 19.0002 0.273438ZM14.4547 15.728C14.4547 16.6484 14.7956 17.4893 15.3638 18.1314V13.3246C14.7956 13.9666 14.4547 14.8075 14.4547 15.728ZM22.6365 13.3246V18.1371C23.2047 17.495 23.5456 16.6541 23.5456 15.7337C23.5456 14.8132 23.2047 13.9666 22.6365 13.3303V13.3246ZM26.2729 15.728C26.2729 18.2678 24.7843 20.4553 22.6365 21.478V23.9098C22.6365 24.9155 21.824 25.728 20.8184 25.728H17.182C16.1763 25.728 15.3638 24.9155 15.3638 23.9098V21.478C13.2161 20.4553 11.7275 18.2678 11.7275 15.728C11.7275 12.2109 14.574 9.36435 18.0911 9.36435H19.9093C23.4263 9.36435 26.2729 12.2109 26.2729 15.728Z"
                    fill={profileColors[colorIndex]}
                  />
                </svg>
              ) : (
                <div className="mt-[1px] capitalize  h-full flex items-center justify-center">
                  {data?.name
                    ? data?.name?.slice(0, 1)
                    : data?.display_name?.slice(0, 1)}
                </div>
              )}
            </div>
            {(() => {
              if (data?.presence === "online" || data?.presence === "call") {
                return (
                  <div className="ml-[55px] mt-[50px] absolute">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 13 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="6.5"
                        cy="6.5"
                        r="5.75"
                        fill={presenceColors[data.presence]}
                        stroke="white"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                );
              }
            })()}
            <div className="flex flex-row w-full justify-between mt-2">
              <div className="text-[20px] font-bold w-2/3 truncate text-[#293241]">
                {data?.display_name ? data?.display_name : data?.name}
              </div>
              <div className="flex flex-row gap-5 items-center">
                {data?.members?.length !== 1 &&
                  callInfo === null &&
                  data?.status !== "inactive" &&
                  data?.status !== "archive" &&
                  data?.status !== "disabled" &&
                  data?.status !== "deleted" &&
                  !data?.call_details && (
                    <>
                      <Tooltip
                        content={"Only 1 person in this group"}
                        direction="top"
                        onclick={data?.members?.length === 1}
                      >
                        <svg
                          onClick={() => {
                            if (data?.members?.length !== 1) setAudioCall(data);
                          }}
                          className={`${
                            data?.members?.length !== 1
                              ? "cursor-pointer"
                              : "cursor-not-allowed"
                          } `}
                          width="13"
                          height="13"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.80781 6.44974C8.42344 6.28567 7.97813 6.39349 7.71328 6.71692L6.93516 7.66849C5.85703 7.0427 4.95703 6.1427 4.33125 5.06458L5.28047 4.2888C5.60391 4.02395 5.71406 3.57864 5.54766 3.19427L4.42266 0.569268C4.24687 0.156768 3.80391 -0.0729199 3.36563 0.0208301L0.740625 0.58333C0.309375 0.674736 0 1.05677 0 1.49974C0 7.04739 4.30078 11.5896 9.75 11.974C9.85547 11.981 9.96328 11.988 10.0711 11.9927C10.0711 11.9927 10.0711 11.9927 10.0734 11.9927C10.2164 11.9974 10.357 12.0021 10.5023 12.0021C10.9453 12.0021 11.3273 11.6927 11.4188 11.2615L11.9813 8.63645C12.075 8.19817 11.8453 7.7552 11.4328 7.57942L8.80781 6.45442V6.44974ZM10.493 11.2497C5.11172 11.245 0.75 6.88333 0.75 1.49974C0.75 1.41067 0.810937 1.33567 0.897656 1.31692L3.52266 0.754424C3.60938 0.735674 3.69844 0.782549 3.73359 0.86458L4.85859 3.48958C4.89141 3.56692 4.87031 3.65599 4.80469 3.70755L3.85312 4.48567C3.56953 4.7177 3.49453 5.12317 3.67969 5.44192C4.37109 6.63489 5.36484 7.62864 6.55547 8.3177C6.87422 8.50286 7.27969 8.42786 7.51172 8.14427L8.28984 7.1927C8.34375 7.12708 8.43281 7.10599 8.50781 7.1388L11.1328 8.2638C11.2148 8.29895 11.2617 8.38802 11.243 8.47474L10.6805 11.0997C10.6617 11.1865 10.5844 11.2474 10.4977 11.2474C10.4953 11.2474 10.493 11.2474 10.4906 11.2474L10.493 11.2497Z"
                            fill="#5C6779"
                          />
                        </svg>
                      </Tooltip>
                    </>
                  )}
                {activeChat.uuid !== data?.uuid && (
                  <svg
                    onClick={(e) => {
                      e.stopPropagation();
                      routeChange(data);
                    }}
                    className="cursor-pointer"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.46875 10.375C4.93545 10.375 5.3125 10.7521 5.3125 11.2188V12.4844L7.89912 10.5438C8.04414 10.433 8.22344 10.375 8.40537 10.375H12.0625C12.5292 10.375 12.9062 9.99795 12.9062 9.53125V1.9375C12.9062 1.4708 12.5292 1.09375 12.0625 1.09375H1.9375C1.4708 1.09375 1.09375 1.4708 1.09375 1.9375V9.53125C1.09375 9.99795 1.4708 10.375 1.9375 10.375H4.46875ZM0.25 1.9375C0.25 1.00674 1.00674 0.25 1.9375 0.25H12.0625C12.9933 0.25 13.75 1.00674 13.75 1.9375V9.53125C13.75 10.462 12.9933 11.2188 12.0625 11.2188H8.40537L5.14375 13.6656C5.01719 13.7605 4.8458 13.7764 4.70078 13.7052C4.55576 13.634 4.46875 13.489 4.46875 13.3281V12.0625V11.2188H3.625H1.9375C1.00674 11.2188 0.25 10.462 0.25 9.53125V1.9375Z"
                      fill="#5C6779"
                    />
                  </svg>
                )}
              </div>
            </div>
            <div className="text-sm text-[#00000059] truncate">
              {data?.personal_status?.[0]?.emoji} &nbsp;
              {data?.personal_status?.[0]?.name}
            </div>
          </div>
          <div className="p-4 bg-[#FEFDFB] rounded-b-[15px] flex flex-row justify-between ">
            <div className="text-[#5C6779] text-sm">{data?.email}</div>
            <div
              onClick={() => setViewMore(true)}
              className="text-[#1C64D8] text-[14px] cursor-pointer"
            >
              View more
            </div>
          </div>
          {viewMore && (
            <ViewMore
              setViewMore={setViewMore}
              mention={data}
              routeChange={routeChange}
              setVideoCall={setVideoCall}
              setAudioCall={setAudioCall}
              isGroup={isGroup}
              mentionFlag={mentionFlag}
              grpHover={grpHover}
              setModal={setmodal}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default MiniProfileModal

const Loader = (
  <section>
    <div className="bg-[#ffffff] w-[330px] rounded-[15px] shadow-lg relative group-mention flex flex-col">
      <div className="bg-[#E9EBF8] p-4 rounded-t-[15px] flex flex-col">
        <Skeleton
          height={70}
          width={70}
          baseColor={"#DDDDDD"}
          style={{
            borderRadius: "44.4444px 44.4444px 44.4444px 0px",
          }}
        />
        <div className="flex mt-2 justify-between">
          <Skeleton
            height={19}
            width={97}
            borderRadius={"5px"}
            baseColor={"#DDDDDD"}
          />
          <Skeleton
            height={19}
            width={27}
            borderRadius={"5px"}
            baseColor={"#DDDDDD"}
          />
        </div>
      </div>
      <div className="p-4 bg-[#FEFDFB] rounded-b-[15px] flex flex-row justify-between ">
        <Skeleton
          height={10}
          width={157}
          borderRadius={"5px"}
          baseColor={"#DDDDDD"}
        />
        <Skeleton
          height={10}
          width={57}
          borderRadius={"5px"}
          baseColor={"#DDDDDD"}
        />
      </div>
    </div>
  </section>
)
