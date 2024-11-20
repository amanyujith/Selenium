import { memo, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import copy from 'copy-to-clipboard';
import { actionCreators } from '../../../../../store';


const VideoOverlay = (props: any) => {

  // const dispatch = useDispatch()
  // const [participant, setParticipant] = useState(participant)
  const participantList = useSelector((state: any) => state.Main.participantList)
  const speakingList = useSelector((state: any) => state.Main.speakingList);
  const idleState = useSelector((state: any) => state.Flag.idleState);
  const { index, hideName } = props;
  const speaking = useMemo(() => speakingList.find((list: any) => participantList[index].participant_id == list.participant_id), [speakingList])
  const meetingSession = useSelector((state: any) => state.Main.meetingSession);
  const themePalette = useSelector((state: any) => state.Main.themePalette)
  const [selfTileData, setSelfTileData] = useState<any>(null)
  const isHost = useSelector((state: any) => state.Flag.isHost)

  useEffect(() => {
    const data = [...participantList].find((participant: any) => {
      return participant.isPublisher === true
    })
    setSelfTileData({ ...data })
  }, [participantList])


  // const participantAudioState = useSelector((state: any) => state.Main.participantAudioState)
  // const participantRaiseHandState = useSelector((state: any) => state.Main.participantRaiseHandState)
  // useEffect(() => {
  //     setParticipant({ ...participant })
  // }, [participantList])

  // const participant = useMemo(() => participant, [participantAudioState])

  // const name = props.name;
  // const audio = props.audio;
  // const id = props.id;
  // const participant = participant;

  const handleParticipantMic = (id: string, stop: boolean) => {
    if (!id.includes("Bot") && (!props.isCall || stop)) {

      meetingSession.hostManageParticipantStream(id, stop, "audio")
    }
  }

  const handleAudio = () => {
    //self participant id
    const participant_id = selfTileData.participant_id
    //handling mic state.
    if (participantList[index].participant_id === participant_id) {
      meetingSession.muteStreamAction(
        "mic",
        selfTileData.audio ? "mute" : "unmute"
      )
    } else if (isHost) {
      handleParticipantMic(
        participantList[index]?.participant_id,
        participantList[index]?.audio ? true : false
      )
    }
    // dispatch(actionCreators.setAudio(!meetingAudio))
  }


  const handleCopyID = () => {
    // copy(participantList[index].participant_id)
  }



  return (
    <div
      className={` videoOverlay w-full h-full absolute ${speaking?.state
          ? "border-2 border-main"
          : "border-2 border-[transparent]"
        } ${hideName ? "group z-10" : ""}`}
      style={
        speaking?.state
          ? { border: `2px solid ${themePalette?.main}` }
          : { border: "2px solid transparent" }
      }
    >
      {/* w-[calc(100%-2px)] h-[calc(100%-2px)] */}
      {/* <div className=' w-[72px] h-[26px] absolute right-2.5 top-4 rounded-[3px] flex justify-between px-2 py-1 z-10 bg-[rgba(28,22,22,0.9)]'>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M7.99995 11.6016C6.1037 11.6016 4.5687 10.1339 4.42745 8.27388L1.80495 6.24713C1.4602 6.67963 1.14295 7.13688 0.886946 7.63688C0.829756 7.75001 0.79996 7.87499 0.79996 8.00175C0.79996 8.12852 0.829756 8.2535 0.886946 8.36663C2.2427 11.0119 4.9267 12.8016 7.99995 12.8016C8.6727 12.8016 9.3217 12.7016 9.9472 12.5401L8.64995 11.5364C8.4357 11.5778 8.21814 11.5996 7.99995 11.6016ZM15.8454 13.0541L13.0817 10.9181C13.9212 10.2106 14.6117 9.3432 15.1129 8.36638C15.1701 8.25325 15.1999 8.12826 15.1999 8.0015C15.1999 7.87474 15.1701 7.74976 15.1129 7.63663C13.7572 4.99138 11.0732 3.20163 7.99995 3.20163C6.71282 3.20319 5.4466 3.52722 4.31695 4.14413L1.13645 1.68588C1.09497 1.65361 1.04754 1.62982 0.996874 1.61588C0.946204 1.60195 0.893285 1.59813 0.84114 1.60466C0.788995 1.61118 0.738646 1.62792 0.692971 1.65391C0.647297 1.6799 0.607191 1.71463 0.574946 1.75613L0.0841959 2.38788C0.0190956 2.47162 -0.0100755 2.5778 0.00309853 2.68305C0.0162726 2.7883 0.0707128 2.88401 0.154446 2.94913L14.8634 14.3174C14.9049 14.3497 14.9523 14.3734 15.003 14.3874C15.0537 14.4013 15.1066 14.4051 15.1588 14.3986C15.2109 14.3921 15.2612 14.3753 15.3069 14.3494C15.3526 14.3234 15.3927 14.2886 15.4249 14.2471L15.9159 13.6154C15.981 13.5316 16.0101 13.4254 15.9969 13.3202C15.9837 13.2149 15.9292 13.1192 15.8454 13.0541ZM11.2524 9.50413L10.2699 8.74463C10.3527 8.5055 10.3966 8.25465 10.3999 8.00163C10.4048 7.63119 10.3228 7.26478 10.1603 6.93181C9.99792 6.59885 9.75967 6.30862 9.46474 6.08443C9.1698 5.86025 8.8264 5.70836 8.46211 5.64096C8.09783 5.57357 7.72282 5.59255 7.3672 5.69638C7.51795 5.90065 7.5995 6.14775 7.59995 6.40163C7.59622 6.48611 7.58331 6.56994 7.56145 6.65163L5.7212 5.22938C6.36044 4.69518 7.16688 4.40224 7.99995 4.40163C8.47278 4.40137 8.94103 4.4943 9.37792 4.67513C9.81481 4.85595 10.2118 5.12111 10.5461 5.45546C10.8805 5.7898 11.1456 6.18677 11.3264 6.62366C11.5073 7.06055 11.6002 7.5288 11.5999 8.00163C11.5999 8.54238 11.4677 9.04638 11.2524 9.50438V9.50413Z" fill="#A7A9AB" />
                </svg>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M11.3134 6.69584L10.931 3H12.25C12.6642 3 13 2.66422 13 2.25V0.75C13 0.335781 12.6642 0 12.25 0H3.75C3.33578 0 3 0.335781 3 0.75V2.25C3 2.66422 3.33578 3 3.75 3H5.06897L4.68663 6.69584C3.17078 7.40062 2 8.66441 2 10.25C2 10.6642 2.33578 11 2.75 11H7V14.2502C7 14.289 7.00903 14.3273 7.02641 14.362L7.77641 15.862C7.86831 16.0458 8.13153 16.0462 8.22363 15.862L8.97363 14.362C8.99098 14.3273 9.00002 14.289 9.00003 14.2502V11H13.25C13.6643 11 14 10.6642 14 10.25C14 8.65053 12.8131 7.39313 11.3134 6.69584Z" fill="#A7A9AB" />
                </svg>
            </div> */}
      {participantList[index]?.raiseHand ? (
        <div className="absolute left-2.5 top-4 z-10">
          <span className=" text-2xl">🤚</span>
        </div>
      ) : null}
      {!idleState || true ? (
        <div
          onClick={handleCopyID}
          className={`videoOverlay-name ${hideName ? "invisible group-hover:visible" : ""
            } w-fit max-w-[98%] h-8 absolute z-10 left-[3px] bottom-[3px] rounded-[3px] flex justify-between items-center px-2 py-1 bg-[rgba(28,22,22,0.9)]`}
        >
          <span className={`w-[30px] ${(participantList[index]?.participant_id === selfTileData?.participant_id || isHost) && "cursor-pointer"}`}
            onClick={handleAudio}
          >
            {participantList[index]?.audio ? (
              <svg width="18" height="20" fill="none" >
                <g
                  transform="translate(3 2)
                            scale(0.81)"
                >
                  <path
                    d="M7 12.375C8.86398 12.375 10.375 10.864 10.375 9V3.375C10.375 1.51102 8.86398 0 7 0C5.13602 0 3.625 1.51102 3.625 3.375V9C3.625 10.864 5.13602 12.375 7 12.375ZM12.625 6.75H12.0625C11.7517 6.75 11.5 7.00172 11.5 7.3125V9C11.5 11.6297 9.23277 13.7398 6.55035 13.4782C4.21246 13.25 2.5 11.1484 2.5 8.79961V7.3125C2.5 7.00172 2.24828 6.75 1.9375 6.75H1.375C1.06422 6.75 0.8125 7.00172 0.8125 7.3125V8.72438C0.8125 11.8758 3.06145 14.6851 6.15625 15.1119V16.3125H4.1875C3.87672 16.3125 3.625 16.5642 3.625 16.875V17.4375C3.625 17.7483 3.87672 18 4.1875 18H9.8125C10.1233 18 10.375 17.7483 10.375 17.4375V16.875C10.375 16.5642 10.1233 16.3125 9.8125 16.3125H7.84375V15.1253C10.857 14.7118 13.1875 12.1254 13.1875 9V7.3125C13.1875 7.00172 12.9358 6.75 12.625 6.75Z"
                    fill="#A7A9AB"
                  />
                </g>
                micON
              </svg>
            ) : (
              <svg width="18" height="20" fill="none" onClick={handleAudio}>
                <path
                  d="M17.8262 15.1848L13.388 11.7547C13.7421 11.0794 13.95 10.3167 13.95 9.50078V8.15078C13.95 7.90216 13.7486 7.70078 13.5 7.70078H13.05C12.8014 7.70078 12.6 7.90216 12.6 8.15078V9.50078C12.6 10.0048 12.4886 10.4795 12.2985 10.9127L11.5518 10.3355C11.6389 10.0712 11.7003 9.79497 11.7003 9.50106V5.00078C11.7003 3.50959 10.4914 2.30078 9.00026 2.30078C7.50907 2.30078 6.30026 3.50959 6.30026 5.00078V6.27653L1.27882 2.39556C1.08251 2.24312 0.799569 2.27828 0.647131 2.47459L0.0947563 3.18531C-0.0576812 3.38134 -0.0225249 3.664 0.173788 3.81672L16.7214 16.606C16.9177 16.7587 17.2004 16.7233 17.3531 16.527L17.9055 15.8162C18.0576 15.6202 18.0225 15.3376 17.8262 15.1848ZM11.25 15.3508H9.67498V14.401C10.0029 14.356 10.3176 14.2733 10.6219 14.1673L9.2126 13.078C9.02388 13.0892 8.83544 13.1025 8.64026 13.0836C7.06948 12.9303 5.86319 11.7159 5.51332 10.2191L4.04998 9.08762V9.28028C4.04998 11.8014 5.84913 14.0489 8.32498 14.3903V15.3508H6.74998C6.50135 15.3508 6.29998 15.5522 6.29998 15.8008V16.2508C6.29998 16.4994 6.50135 16.7008 6.74998 16.7008H11.25C11.4986 16.7008 11.7 16.4994 11.7 16.2508V15.8008C11.7 15.5522 11.4986 15.3508 11.25 15.3508Z"
                  fill="#A7A9AB"
                />
                micOFF
              </svg>
            )}
          </span>
          <span
            className={` max-w-[221px] text-left ml-2 overflow-hidden text-ellipsis whitespace-nowrap text-[${themePalette?.primary100}]`}
            style={{ color: themePalette?.primary100 }}
          >
            {participantList[index]?.name}
          </span>
        </div>
      ) : null}
    </div>
  )
}

export default memo(VideoOverlay)