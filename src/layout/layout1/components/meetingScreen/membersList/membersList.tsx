import { memo, useState, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import HostControl from "./hostControl"
import { actionCreators } from "../../../../../store"
import { useEffect } from "react"
import FilterMenu from "./filterMenu/filterMenu"
import { branding_logo_half } from "../../../../../constants/constantValues"
import { t } from "i18next"

interface IMembersList {
  isCall: boolean
}

const MembersList = ({ isCall }: IMembersList) => {
  const dispatch = useDispatch()
  const privateChat = useSelector((state: any) => state.Main.privateChat)
  const meetingSession = useSelector((state: any) => state.Main.meetingSession)
  const [hostControlID, setHostControlID] = useState("")
  // const [filterMenu, setFilterMenu] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const popUp = useSelector((state: any) => state.Flag.popUp)
  const isHost = useSelector((state: any) => state.Flag.isHost)
  const participantList = useSelector(
    (state: any) => state.Main.participantList
  )
  const selfTileIndex = useSelector((state: any) => state.Main.selfTileIndex)
  const videoQuality = useSelector((state: any) => state.Main.videoQuality)
  const participantPauseState = useSelector(
    (state: any) => state.Main.participantPauseState
  )
  const [filterType, setFilterType] = useState("")
  const [brokenImage, setBrokenImage] = useState(false)
  const themePalette = useSelector((state: any) => state.Main.themePalette)
  // const [profilePicture, setProfilePicture] = useState('');
  // const loggedInUserInfo = useSelector((state: any) => state.Main.loggedInUserInfo)

  // const filteredParticipantList = useMemo(() => {
  //     // let tempParticipantList = participantList.filter((participant: any) =>
  //     //     !participant.isPublisher && !participant.ishost
  //     // )
  //     let tempParticipantList = [...participantList]
  //     switch (filterType) {
  //         case 'alphabets': {
  //             tempParticipantList.sort((firstItem: any, secondItem: any) =>
  //                 (firstItem.name.toLowerCase() > secondItem.name.toLowerCase()) ? 1 : ((secondItem.name.toLowerCase() > firstItem.name.toLowerCase()) ? -1 : 0)
  //             )
  //             break
  //         }
  //         case 'time': {
  //             tempParticipantList.sort((firstItem: any, secondItem: any) => firstItem.timestamp - secondItem.timestamp);
  //             break
  //         }
  //         case 'muted': {
  //             tempParticipantList = participantList.filter((participant: any) => !participant.audio)
  //
  //             break;
  //         }
  //         case 'videoOff': {
  //             tempParticipantList = participantList.filter((participant: any) => !participant.video)
  //             break;
  //         }
  //         default: break
  //     }
  //
  //     return tempParticipantList
  // }, [filterType, participantList])

  // useEffect(() => {
  //     if (Object.keys(loggedInUserInfo).length !== 0) {
  //         setProfilePicture(loggedinUserInfo?.picture)
  //     }
  // }, [loggedInUserInfo])

  const filteredParticipantList = useMemo(() => {
    let tempParticipantList = [...participantList]
    const compare: any = (a: any, b: any, type: any, initital: any) => {
      if ((a.host || a.isPublisher) && initital) {
        if (a.isPublisher) {
          return -1
        } else {
          if (b.isPublisher) {
            return 1
          } else if (b.host) {
            return compare(a, b, "alphabets", false)
          } else {
            return -1
          }
        }
      } else if (type === "alphabets") {
        if ((b.host || b.isPublisher) && initital) {
          return 1
        } else {
          if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1
          } else if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1
          } else {
            return 0
          }
        }
      } else if (type === "numbers") {
        return a.timestamp - b.timestamp
      } else if (type === "audio" || type === "video") {
        if (a[type] === b[type]) {
          return 0
        } else if (a) {
          return -1
        } else return 1
      }
    }
    switch (filterType) {
      case "alphabets": {
        tempParticipantList.sort((a, b) => compare(a, b, "alphabets", true))
        break
      }
      case "time": {
        tempParticipantList.sort((a, b) => compare(a, b, "number", true))
        break
      }
      case "muted": {
        // tempParticipantList.sort((a, b) => compare(a, b, "audio", true));
        tempParticipantList = participantList.filter(
          (participant: any) => participant.audio
        )
        break
      }
      case "videoOff": {
        // tempParticipantList.sort((a, b) => compare(a, b, "video", true));
        tempParticipantList = participantList.filter(
          (participant: any) => participant.video
        )
        break
      }
      default:
        break
    }

    return tempParticipantList
  }, [filterType, participantList, participantPauseState])

  const closeMembersList = () => {
    setSearchTerm("")
    dispatch(actionCreators.setMembersList(false))
  }
  const handlePrivateChat = (id: number, name: string, event: any) => {
    event.stopPropagation()
    dispatch(actionCreators.setPrivateChatParticipant(id, name))
    dispatch(actionCreators.setPrivateChatState(true))
    // dispatch(actionCreators.setUnReadPrivateChat(id))
  }

  const setHostControlMenu = (id: string, event?: any) => {
    event.stopPropagation()
    let newParticipantId = hostControlID === id ? "" : id
    setHostControlID(newParticipantId)
  }

  const handleHostMute = (muteAll: boolean) => {
    meetingSession.hostManageAllParticipantsAudio(muteAll)
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  const handleAudio = () => {
    //self participant id

    const participant_id = participantList[selfTileIndex].participant_id
    // if(isCall) {
    // handling chat-call case
    // meetingSession.muteStreamAction(participant_id, 'mic',  "mute" )

    // } else {
    //handling mic state.
    meetingSession.muteStreamAction(
      "mic",
      participantList[selfTileIndex].audio ? "mute" : "unmute"
    )
    // }
  }
  const handleVideo = () => {
    const participant_id = participantList[selfTileIndex].participant_id
    //handling camera state
    meetingSession.muteStreamAction(
      "camera",
      participantList[selfTileIndex].video ? "mute" : "unmute"
    )
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
  }

  const handleClearSearchTerm = () => {
    setSearchTerm("")
  }

  const handleRaiseHand = (id: string) => {
    meetingSession.hostManageRaiseHand(id)
  }

  const handleParticipantMic = (id: string, stop: boolean) => {
    if (!id.includes("Bot") && (!isCall || stop)) {
      meetingSession.hostManageParticipantStream(id, stop, "audio")
    }
  }

  const handleParticipantCam = (id: string, stop: boolean) => {
    if (!id.includes("Bot"))
      meetingSession.hostManageParticipantStream(id, stop, "video")
  }

  const handleBrokenImage = () => {
    setBrokenImage(true)
  }

  return (
    // <div onClick={(e) => { setHostControlMenu("", e) }} className=' w-[350px] h-[480px] rounded-2xl pl-[7px] pr-2.5 m-1 pt-2.5 bg-[#ffffff] '>
    <>
      <div className=" pl-[3px] py-2 pr-5 flex justify-between items-center">
        <div className="flex items-center">
          <div className=" w-56 flex  items-center py-2 px-2.5 rounded-[3px] box-border text-[16px] leading-5 mr-2.5 border-[0.2px]">
            <input
              onChange={(event: any) => handleSearch(event.target.value)}
              value={searchTerm}
              className=" w-full outline-0 outline-none"
              tabIndex={-1}
              type="text"
              placeholder={`(${t("Meeting.Members")}) (${
                participantList.length
              })`}
            />
            {searchTerm === "" ? (
              <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
                <path
                  d="M13.8086 12.1051L11.0824 9.37891C10.9594 9.25586 10.7926 9.1875 10.6176 9.1875H10.1719C10.9266 8.22227 11.375 7.0082 11.375 5.6875C11.375 2.5457 8.8293 0 5.6875 0C2.5457 0 0 2.5457 0 5.6875C0 8.8293 2.5457 11.375 5.6875 11.375C7.0082 11.375 8.22227 10.9266 9.1875 10.1719V10.6176C9.1875 10.7926 9.25586 10.9594 9.37891 11.0824L12.1051 13.8086C12.3621 14.0656 12.7777 14.0656 13.032 13.8086L13.8059 13.0348C14.0629 12.7777 14.0629 12.3621 13.8086 12.1051ZM5.6875 9.1875C3.7543 9.1875 2.1875 7.62344 2.1875 5.6875C2.1875 3.7543 3.75156 2.1875 5.6875 2.1875C7.6207 2.1875 9.1875 3.75156 9.1875 5.6875C9.1875 7.6207 7.62344 9.1875 5.6875 9.1875Z"
                  fill="#A7A9AB"
                />
              </svg>
            ) : (
              <svg
                onClick={() => handleClearSearchTerm()}
                className="cursor-pointer"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M15.8334 5.34102L14.6584 4.16602L10 8.82435L5.34169 4.16602L4.16669 5.34102L8.82502 9.99935L4.16669 14.6577L5.34169 15.8327L10 11.1743L14.6584 15.8327L15.8334 14.6577L11.175 9.99935L15.8334 5.34102Z"
                  fill="#A7A9AB"
                />
              </svg>
            )}
          </div>
          {isHost && !isCall ? (
            <svg
              onClick={() => dispatch(actionCreators.setInviteModal(true))}
              className="cursor-pointer"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                d="M17.55 7.85H15.75V6.05C15.75 5.8025 15.5475 5.6 15.3 5.6H14.4C14.1525 5.6 13.95 5.8025 13.95 6.05V7.85H12.15C11.9025 7.85 11.7 8.0525 11.7 8.3V9.2C11.7 9.4475 11.9025 9.65 12.15 9.65H13.95V11.45C13.95 11.6975 14.1525 11.9 14.4 11.9H15.3C15.5475 11.9 15.75 11.6975 15.75 11.45V9.65H17.55C17.7975 9.65 18 9.4475 18 9.2V8.3C18 8.0525 17.7975 7.85 17.55 7.85ZM6.3 9.2C8.28844 9.2 9.9 7.58844 9.9 5.6C9.9 3.61156 8.28844 2 6.3 2C4.31156 2 2.7 3.61156 2.7 5.6C2.7 7.58844 4.31156 9.2 6.3 9.2ZM8.82 10.1H8.35031C7.72594 10.3869 7.03125 10.55 6.3 10.55C5.56875 10.55 4.87688 10.3869 4.24969 10.1H3.78C1.69313 10.1 0 11.7931 0 13.88V15.05C0 15.7953 0.604688 16.4 1.35 16.4H11.25C11.9953 16.4 12.6 15.7953 12.6 15.05V13.88C12.6 11.7931 10.9069 10.1 8.82 10.1Z"
                fill="#A7A9AB"
              />
              Invite
            </svg>
          ) : null}
        </div>
        <svg
          onClick={(e) => handlePopUp(e, "filterMenuFlag")}
          className="cursor-pointer"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path
            d="M0.5 3.125H13.5C13.7762 3.125 14 2.90116 14 2.625V1.375C14 1.09884 13.7762 0.875 13.5 0.875H0.5C0.223844 0.875 0 1.09884 0 1.375V2.625C0 2.90116 0.223844 3.125 0.5 3.125ZM0.5 8.125H13.5C13.7762 8.125 14 7.90116 14 7.625V6.375C14 6.09884 13.7762 5.875 13.5 5.875H0.5C0.223844 5.875 0 6.09884 0 6.375V7.625C0 7.90116 0.223844 8.125 0.5 8.125ZM0.5 13.125H13.5C13.7762 13.125 14 12.9012 14 12.625V11.375C14 11.0988 13.7762 10.875 13.5 10.875H0.5C0.223844 10.875 0 11.0988 0 11.375V12.625C0 12.9012 0.223844 13.125 0.5 13.125Z"
            fill="#A7A9AB"
          />
          HambergerMenu
        </svg>
        {popUp.filterMenuFlag ? (
          <FilterMenu setFilterType={setFilterType} filterType={filterType} />
        ) : null}
      </div>
      {/** Filter menu start */}

      {/** Filter menu end */}
      {isHost && !isCall ? (
        <div className="relative pt-2 pb-4 pr-2 pl-[3px] flex justify-between items-center border-b border-[#A7A9AB]">
          {/* <span onClick={() => handleHostMute(false)} className='text-[14] leading-4 mr-2.5 cursor-pointer text-primary-200'>
                            Unmute All
                        </span> */}
          <span
            onClick={() => handleHostMute(true)}
            className="text-[14] leading-4 cursor-pointer text-primary-200"
          >
            {t("Meeting.MuteAll")}
          </span>
        </div>
      ) : null}

      {/* <div className='py-2.5 pl-[3px] flex border-b border-[#A7A9AB]'>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M13 7C13 4.2375 10.0906 2 6.5 2C2.90937 2 0 4.2375 0 7C0 8.07187 0.440625 9.05937 1.1875 9.875C0.76875 10.8187 0.078125 11.5687 0.06875 11.5781C0 11.65 -0.01875 11.7562 0.021875 11.85C0.0625 11.9437 0.15 12 0.25 12C1.39375 12 2.34062 11.6156 3.02187 11.2187C4.02812 11.7094 5.21875 12 6.5 12C10.0906 12 13 9.7625 13 7ZM16.8125 13.875C17.5594 13.0625 18 12.0719 18 11C18 8.90937 16.3281 7.11875 13.9594 6.37187C13.9875 6.57812 14 6.7875 14 7C14 10.3094 10.6344 13 6.5 13C6.1625 13 5.83437 12.975 5.50938 12.9406C6.49375 14.7375 8.80625 16 11.5 16C12.7812 16 13.9719 15.7125 14.9781 15.2187C15.6594 15.6156 16.6063 16 17.75 16C17.85 16 17.9406 15.9406 17.9781 15.85C18.0187 15.7594 18 15.6531 17.9312 15.5781C17.9219 15.5687 17.2313 14.8219 16.8125 13.875Z" fill="#404041" />
                </svg>
                <span
                    onClick={props.openChat}
                    className='text-[16px] cursor-pointer leading-5 ml-2.5 text-link'
                >
                    All chat
                </span> */}
      {/* <span className=' absolute right-5'>{videoQuality}</span> */}
      {/* </div> */}
      <div className=" mt-3 h-[calc(100vh-191px)] overflow-auto">
        {
          filteredParticipantList
            .filter((participant: any) => {
              return participant.name
                .trim()
                .toLowerCase()
                .includes(searchTerm.trim().toLowerCase())
            })
            .map((participant: any) => {
              return (
                // hostControlID === participant.participant_id && isHost ?
                // <HostControl handlePrivateChat={handlePrivateChat} participant={participant} setHostControlMenu={setHostControlMenu} /> :
                <div
                  key={participant.participant_id}
                  // onClick={(e) => (isHost && !participant.isPublisher ? setHostControlMenu(participant.participant_id, e) : null)}
                  className={` relative pl-[3px] pr-2 py-3 flex justify-between border-b border-solid border-b-[#000000]/[0.12] `}
                >
                  <div className=" w-2/3 flex items-center relative">
                    {/* {participant.participant_id === hostID ? */}
                    {participant.host ? (
                      <span
                        className=" absolute -top-2 flex items-center px-1 py-1 h-3 rounded-xl border-[1px] text-[10px] border-[#ffffff] bg-main text-[#FFFFFF]"
                        style={{ backgroundColor: themePalette?.main }}
                      >
                        {t("Meeting.Host")}
                      </span>
                    ) : null}
                    <div
                      className=" w-8 h-8 rounded-full mr-2.5 flex items-center justify-center text-[#ffffff] bg-primary-200"
                      style={{ backgroundColor: themePalette?.primary300 }}
                    >
                      {participant.profile_picture &&
                      participant.profile_picture != "undefined" ? (
                        !brokenImage ? (
                          <img
                            src={participant.profile_picture}
                            onError={handleBrokenImage}
                            className={"rounded-full"}
                          />
                        ) : (
                          <img
                            src={branding_logo_half}
                            className={"rounded-full"}
                          />
                        )
                      ) : (
                        participant.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <span className="text-[15px] leading-5 max-w-[60%] w-fit text-left overflow-hidden text-ellipsis whitespace-nowrap text-[#000000]">
                      {participant.name}
                    </span>
                    {participant.isPublisher ? (
                      <span className="text-[16px] leading-5 text-left text-[#000000]">
                        ({t("Meeting.You")})
                      </span>
                    ) : null}
                  </div>
                  <div className=" w-1/3 flex items-center justify-between">
                    <div className="w-3">
                      {participant.raiseHand &&
                      isHost &&
                      !participant.isPublisher ? (
                        <svg
                          onClick={() =>
                            handleRaiseHand(participant.participant_id)
                          }
                          className="cursor-pointer"
                          width="16"
                          height="16"
                          viewBox="0 0 18 16"
                          fill="none"
                        >
                          <path
                            d="M16.3406 1.81269C15.3949 1.79863 14.625 2.558 14.625 3.50019H14.3438V2.40332C14.3438 1.47871 13.609 0.70527 12.6844 0.687692C11.7387 0.67363 10.9688 1.433 10.9688 2.37519V3.50019H10.6875V1.84082C10.6875 0.916208 9.95273 0.14277 9.02812 0.125192C8.08242 0.11113 7.3125 0.870505 7.3125 1.81269V3.50019H7.03125V2.40332C7.03125 1.47871 6.29648 0.70527 5.37188 0.687692C4.42617 0.67363 3.65625 1.433 3.65625 2.37519V7.15644L3.375 6.90683V5.21582C3.375 4.29121 2.64023 3.51777 1.71562 3.50019C0.769922 3.48613 0 4.2455 0 5.18769V7.52207C0 8.48535 0.411328 9.40293 1.13203 10.0463L5.05898 13.5373C5.41758 13.8572 5.625 14.3178 5.625 14.7994V15.035C5.625 15.5025 6.00117 15.8787 6.46875 15.8787H14.9062C15.3738 15.8787 15.75 15.5025 15.75 15.035V14.933C15.75 14.483 15.8414 14.0365 16.0137 13.6217L17.7363 9.533C17.9121 9.11816 18 8.67168 18 8.22168V3.52832C18 2.60371 17.2652 1.82675 16.3406 1.81269Z"
                            fill="#9B9B9B"
                          />
                        </svg>
                      ) : null}
                      {/* {!participant.isPublisher ?
                                                <div
                                                    onClick={(e) => handlePrivateChat(participant.participant_id, participant.name, e)}
                                                    className=' relative z-10'
                                                >
                                                    {privateChat?.some((item: any) => item.participant_id == participant.participant_id && item.seen == false) ?

                                                        // 
                                                        <span className="flex h-2.5 w-2.5 absolute -right-[9px] -top-1 ">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-main opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 border-[1px] border-[#ffffff] bg-main"></span>
                                                        </span>
                                                        // < div className='animate-ping absolute -right-2 -top-0.5 inline-flex h-full w-full rounded-full bg-sky-400 opacity-75'></div>
                                                        // w-2 h-2 absolute -right-2 -top-0.5 rounded-[50%] border-[1px] border-[#ffffff] bg-main
                                                        : null
                                                    }

                                                    <svg width="16" height="16" viewBox="0 0 12 12" fill="none">
                                                        <path d="M10.5 0H1.5C0.672656 0 0 0.672656 0 1.5V8.25C0 9.07734 0.672656 9.75 1.5 9.75H3.75V11.7188C3.75 11.9484 4.0125 12.082 4.19766 11.9461L7.125 9.75H10.5C11.3273 9.75 12 9.07734 12 8.25V1.5C12 0.672656 11.3273 0 10.5 0Z" fill="#A7A9AB" />
                                                    </svg>
                                                </div>
                                                : null
                                            } */}
                    </div>

                    <div
                      className={isHost && "cursor-pointer"}
                      onClick={() =>
                        isHost &&
                        !participant.isPublisher &&
                        handleParticipantMic(
                          participant.participant_id,
                          participant.audio ? true : false
                        )
                      }
                    >
                      {participant.audio ? (
                        <svg
                          onClick={() =>
                            participant.isPublisher ? handleAudio() : null
                          }
                          width="16"
                          height="16"
                          viewBox="0 0 14 14"
                          fill="none"
                        >
                          <path
                            d="M7 9.625C8.44977 9.625 9.625 8.44977 9.625 7V2.625C9.625 1.17523 8.44977 0 7 0C5.55023 0 4.375 1.17523 4.375 2.625V7C4.375 8.44977 5.55023 9.625 7 9.625ZM11.375 5.25H10.9375C10.6958 5.25 10.5 5.44578 10.5 5.6875V7C10.5 9.04531 8.7366 10.6865 6.65027 10.483C4.83191 10.3056 3.5 8.67098 3.5 6.84414V5.6875C3.5 5.44578 3.30422 5.25 3.0625 5.25H2.625C2.38328 5.25 2.1875 5.44578 2.1875 5.6875V6.78562C2.1875 9.23672 3.93668 11.4218 6.34375 11.7537V12.6875H4.8125C4.57078 12.6875 4.375 12.8833 4.375 13.125V13.5625C4.375 13.8042 4.57078 14 4.8125 14H9.1875C9.42922 14 9.625 13.8042 9.625 13.5625V13.125C9.625 12.8833 9.42922 12.6875 9.1875 12.6875H7.65625V11.7641C9.99988 11.4425 11.8125 9.43086 11.8125 7V5.6875C11.8125 5.44578 11.6167 5.25 11.375 5.25Z"
                            fill="#A7A9AB"
                          />
                          micON
                        </svg>
                      ) : (
                        <svg
                          onClick={() =>
                            participant.isPublisher ? handleAudio() : null
                          }
                          width="16"
                          height="16"
                          fill="none"
                        >
                          <path
                            d="M17.8262 14.6848L13.388 11.2547C13.7421 10.5794 13.95 9.81669 13.95 9.00078V7.65078C13.95 7.40216 13.7486 7.20078 13.5 7.20078H13.05C12.8014 7.20078 12.6 7.40216 12.6 7.65078V9.00078C12.6 9.50478 12.4886 9.97953 12.2985 10.4127L11.5518 9.83553C11.6389 9.57116 11.7003 9.29497 11.7003 9.00106V4.50078C11.7003 3.00959 10.4914 1.80078 9.00026 1.80078C7.50907 1.80078 6.30026 3.00959 6.30026 4.50078V5.77653L1.27882 1.89556C1.08251 1.74312 0.799569 1.77828 0.647131 1.97459L0.0947563 2.68531C-0.0576812 2.88134 -0.0225249 3.164 0.173788 3.31672L16.7214 16.106C16.9177 16.2587 17.2004 16.2233 17.3531 16.027L17.9055 15.3162C18.0576 15.1202 18.0225 14.8376 17.8262 14.6848V14.6848ZM11.25 14.8508H9.67498V13.901C10.0029 13.856 10.3176 13.7733 10.6219 13.6673L9.2126 12.578C9.02388 12.5892 8.83544 12.6025 8.64026 12.5836C7.06948 12.4303 5.86319 11.2159 5.51332 9.71909L4.04998 8.58762V8.78028C4.04998 11.3014 5.84913 13.5489 8.32498 13.8903V14.8508H6.74998C6.50135 14.8508 6.29998 15.0522 6.29998 15.3008V15.7508C6.29998 15.9994 6.50135 16.2008 6.74998 16.2008H11.25C11.4986 16.2008 11.7 15.9994 11.7 15.7508V15.3008C11.7 15.0522 11.4986 14.8508 11.25 14.8508Z"
                            fill="#A7A9AB"
                          />
                          micOff
                        </svg>
                      )}
                    </div>

                    {isCall ? null : (
                      <div
                        className={isHost && "cursor-pointer"}
                        onClick={() =>
                          isHost &&
                          !participant.isPublisher &&
                          handleParticipantCam(
                            participant.participant_id,
                            participant.video ? true : false
                          )
                        }
                      >
                        {participant.video ? (
                          <div
                            onClick={() =>
                              participant.isPublisher ? handleVideo() : null
                            }
                            className="relative z-10"
                          >
                            {/* {!participant.pause ? <span className="flex h-2.5 w-2.5 absolute -right-[-13px] -top-1 ">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF00] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 border-[1px] border-[#ffffff] bg-[#00FF00]"></span>
            </span>
                :
                null} */}
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 14 10"
                              fill="none"
                            >
                              <path
                                d="M8.17153 0.333984H1.16181C0.520139 0.333984 0 0.854123 0 1.49579V8.50551C0 9.14718 0.520139 9.66732 1.16181 9.66732H8.17153C8.8132 9.66732 9.33333 9.14718 9.33333 8.50551V1.49579C9.33333 0.854123 8.8132 0.333984 8.17153 0.333984ZM12.775 1.2503L10.1111 3.0878V6.9135L12.775 8.74857C13.2903 9.10343 14 8.74128 14 8.12148V1.87739C14 1.26003 13.2927 0.895443 12.775 1.2503Z"
                                fill="#A7A9AB"
                              />
                              CamOn
                            </svg>
                          </div>
                        ) : (
                          <svg
                            onClick={() =>
                              participant.isPublisher ? handleVideo() : null
                            }
                            width="16"
                            height="16"
                            viewBox="0 0 25 21"
                            fill="none"
                          >
                            <path
                              d="M24.7576 18.3953L22.6092 16.7352C23.2108 16.6805 23.7498 16.2 23.7498 15.5203V5.48127C23.7498 4.48518 22.6131 3.90315 21.7811 4.47346L17.4998 7.42658V12.786L16.2498 11.8211V4.86799C16.2498 3.83674 15.4139 3.0008 14.3826 3.0008H4.83967L1.77717 0.633615C1.50373 0.422678 1.11311 0.469553 0.898264 0.74299L0.132639 1.72737C-0.0782988 2.0008 -0.0314238 2.39143 0.242014 2.60237L1.66779 3.70393L16.2498 14.9774L23.2225 20.368C23.4959 20.5789 23.8865 20.5321 24.1014 20.2586L24.867 19.2703C25.0819 19.0008 25.0311 18.6063 24.7576 18.3953ZM1.24983 16.1336C1.24983 17.1649 2.08576 18.0008 3.11701 18.0008H14.3826C14.8201 18.0008 15.2186 17.8446 15.5389 17.5906L1.24983 6.54377V16.1336Z"
                              fill="#A7A9AB"
                            />
                            CamOff
                          </svg>
                        )}
                      </div>
                    )}

                    {isHost && !participant.isPublisher ? (
                      <svg
                        className="cursor-pointer"
                        onClick={(e) =>
                          setHostControlMenu(participant.participant_id, e)
                        }
                        width="16"
                        height="16"
                        viewBox="0 0 18 18"
                        fill="none"
                      >
                        <path
                          d="M9 6.46875C10.3992 6.46875 11.5312 7.60078 11.5312 9C11.5312 10.3992 10.3992 11.5312 9 11.5312C7.60078 11.5312 6.46875 10.3992 6.46875 9C6.46875 7.60078 7.60078 6.46875 9 6.46875ZM6.46875 2.8125C6.46875 4.21172 7.60078 5.34375 9 5.34375C10.3992 5.34375 11.5312 4.21172 11.5312 2.8125C11.5312 1.41328 10.3992 0.28125 9 0.28125C7.60078 0.28125 6.46875 1.41328 6.46875 2.8125ZM6.46875 15.1875C6.46875 16.5867 7.60078 17.7188 9 17.7188C10.3992 17.7188 11.5312 16.5867 11.5312 15.1875C11.5312 13.7883 10.3992 12.6562 9 12.6562C7.60078 12.6562 6.46875 13.7883 6.46875 15.1875Z"
                          fill="#A7A9AB"
                        />
                        more
                      </svg>
                    ) : null}
                  </div>
                  {hostControlID === participant.participant_id && isHost ? (
                    <HostControl
                      handlePrivateChat={handlePrivateChat}
                      participant={participant}
                      setHostControlMenu={setHostControlMenu}
                    />
                  ) : null}
                </div>
              )
            })
          // :
          // <HostControl setHostControl={setHostControl} />
        }
      </div>
    </>
  )
}

export default memo(MembersList)
