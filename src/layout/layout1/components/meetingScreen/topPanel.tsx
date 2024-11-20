import React, { memo, useEffect, useState } from "react"
import EndButton from "./endButton"
import MetingInfo from "./meetingInfo"
import * as constant from "../../../../constants/constantValues"
import { useDispatch, useSelector } from "react-redux"
import { actionCreators } from "../../../../store"
import Timer from "./tileView/Timer/timer"
import hoolvaLogo from "./topPanel/Hoolva-icons-white.png"
import ToolTip from "../../../../atom/ToolTip/Tooltip"
import RecordTimer from "./tileView/Timer/recordTimer"
import hoverTimer from "../../../../utils/hoverTimer"
import { t } from "i18next"
import { AnimatePresence } from "framer-motion"

const TopPanel = (props: any) => {
  const { screenShare, isCall } = props
  const dispatch = useDispatch()
  const popUp = useSelector((state: any) => state.Flag.popUp)
  const lockedMeetingState = useSelector(
    (state: any) => state.Flag.lockedMeetingState
  )
  const isHost = useSelector((state: any) => state.Flag.isHost)
  const flagRooms = useSelector((state: any) => state.Breakout.flagSetRoom)
  const meetingSession = useSelector((state: any) => state.Main.meetingSession)
  const participantList = useSelector(
    (state: any) => state.Main.participantList
  )
  const selfTileIndex = useSelector((state: any) => state.Main.selfTileIndex)
  const room = useSelector((state: any) => state.Breakout.setRoom)
  const shareList = useSelector((state: any) => state.Main.shareList)
  const { pauseRecording } = useSelector((state: any) => state.Flag)
  const { recording } = useSelector((state: any) => state.Flag)
  const user = useSelector((state: any) => state.Main.meetingSession)
  const meetingInfo = useSelector((state: any) => state.Main.meetingInfo)
  const chatInstance = useSelector((state: any) => state.Chat.chatInstance)
  const callInfo = useSelector((state: any) => state.Chat.chatCallInfo)
  const theme = useSelector((state: any) => state.Main.setTheme)
  const brandingInfo = useSelector((state: any) => state.Main.brandingInfo)
  const themePalette = useSelector((state: any) => state.Main.themePalette)
  const speakingList = useSelector((state: any) => state.Main.speakingList)
  const [speaker, setSpeaker] = useState<any>()
  const callData = useSelector((state: any) => state.Chat.callData)

  const handleMeetingLock = () => {
    meetingSession.hostLockMeetingAction(!lockedMeetingState)
    if (lockedMeetingState) dispatch(actionCreators.clearWaitingList())
  }

  const stopRecording = () => {
    const participant_id = participantList.map((list: any) => {
      return list.participant_id
    })

    user.streamRecord(false, participant_id)
    hoverTimer(false, dispatch, true)
    dispatch(actionCreators.setPauseRecording(false))
  }

  const handleLeaveMeeting = () => {
    meetingSession.leaveMeetingSession()

    dispatch(actionCreators.setChatCallInfo(null))
    dispatch(actionCreators.callToggleFlag(false))
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
    chatInstance?.grafanaLogger(["Client : Left MeetingSession", callInfo.uuid])
    chatInstance?.publishMessage("call", callInfo.uuid, callInfo.isGroup, {
      message: {
        action: "end",
        meetingId: callData.meetingId,
      },
    })

    // setTimeout(() => {
    //   chatInstance
    //     .UpdateCallInfo(callData.meetingId, callInfo.isGroup)
    //     .then((res: any) => {
    //
    //     })
    //     .catch((err: any) => {
    //
    //     })
    // }, 2000);
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

  const resumeRecord = () => {
    dispatch(actionCreators.setPauseRecording(false))
  }

  return (
    <div className="w-full flex justify-between pr-5 pl-10 py-3 relative">
      {isCall ? (
        <div className="w-20 h-6"></div>
      ) : (
        <div className="flex items-center w-36 h-6">
          {/* <ToolTip
            content={t("Meeting.MeetingInfo")}
            direction="bottom"
            onclick={true}
          >
            <div className="w-20 h-10 absolute top-[-10px] cursor-pointer bg-[green]"></div>
          </ToolTip> */}
          <ToolTip
            content={t("Meeting.MeetingInfo")}
            direction="bottom"
            onclick={true}
          >
            <div className="min-h-[80px] flex items-center">
              <img
                id="logo"
                onClick={(e) => handlePopUp(e, "meetingInfoFlag")}
                className=" w-fit h-fit max-h-20 relative top-[5px] cursor-pointer"
                src={brandingInfo?.data?.logos?.logoWhite}
                alt="avatar"
              ></img>
            </div>
          </ToolTip>
          {isHost ? (
            <div
              id="lock"
              onClick={() => handleMeetingLock()}
              className=" relative top-[5px] cursor-pointer"
            >
              {lockedMeetingState ? (
                <svg
                  className=" ml-5"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    d="M15.1875 7.875H14.3438V5.34375C14.3438 2.39766 11.9461 0 9 0C6.05391 0 3.65625 2.39766 3.65625 5.34375V7.875H2.8125C1.88086 7.875 1.125 8.63086 1.125 9.5625V16.3125C1.125 17.2441 1.88086 18 2.8125 18H15.1875C16.1191 18 16.875 17.2441 16.875 16.3125V9.5625C16.875 8.63086 16.1191 7.875 15.1875 7.875ZM11.5312 7.875H6.46875V5.34375C6.46875 3.94805 7.6043 2.8125 9 2.8125C10.3957 2.8125 11.5312 3.94805 11.5312 5.34375V7.875Z"
                    fill="#A7A9AB"
                  />
                  {t("Meeting.Locked")}
                </svg>
              ) : (
                <svg
                  className=" ml-5"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    d="M13.2344 1.38888C10.6094 1.39825 8.5 3.56075 8.5 6.18575V8.38888H1.5C0.671875 8.38888 0 9.06075 0 9.88888V15.8889C0 16.717 0.671875 17.3889 1.5 17.3889H12.5C13.3281 17.3889 14 16.717 14 15.8889V9.88888C14 9.06075 13.3281 8.38888 12.5 8.38888H11V6.167C11 4.9295 11.9906 3.90138 13.2281 3.88888C14.4781 3.87638 15.5 4.892 15.5 6.13888V8.63888C15.5 9.0545 15.8344 9.38888 16.25 9.38888H17.25C17.6656 9.38888 18 9.0545 18 8.63888V6.13888C18 3.51388 15.8594 1.3795 13.2344 1.38888Z"
                    fill="#A7A9AB"
                  />
                </svg>
              )}
            </div>
          ) : null}
          <AnimatePresence mode="wait">
            {popUp.meetingInfoFlag ? (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute mt-14 top-0 left-10 z-10"
              >
                <MetingInfo isCall={isCall} />
              </div>
            ) : null}
          </AnimatePresence>
        </div>
      )}
      <div
        className={`flex flex-row  px-7 absolute ${
          isCall ? "ml-[20px]" : "ml-[150px]"
        } mt-1`}
      >
        {speaker ? (
          <>
            <div
              className="flex w-7 h-7 rounded-r-[33.333px] rounded-tl-[33.333px] text-[#ffffff]  bg-gradient from-[#1D1D1D] to-[#404041] animate-pulse border-2 items-center justify-center"
              style={{
                border: `2px solid ${themePalette?.bgSecondary}`,
                color: themePalette?.bgSecondary,
              }}
            >
              {speaker?.profile_picture &&
              speaker?.profile_picture != "undefined" ? (
                <img
                  src={speaker?.profile_picture}
                  className={
                    "h-6 w-6 rounded-r-[33.333px] rounded-tl-[33.333px] animate-pulse "
                  }
                />
              ) : (
                <div className="h-6 w-6 rounded-r-[33.333px] rounded-tl-[33.333px]  bg-gradient-to-b from-[#1D1D1D] to-[#404041] animate-pulse">
                  <p className={`${isCall ? "ml-[6px]" : ""}`}>
                    {speaker?.name.charAt(0).toUpperCase()}
                  </p>
                </div>
              )}
            </div>
            <p
              className=" animate-pulse mt-[6px] text-secondary mr-6 ml-1 font-roboto truncate text-sm"
              style={{
                color: themePalette?.bgSecondary,
              }}
            >
              {speaker?.name} is talking
            </p>
          </>
        ) : (
          ""
        )}
      </div>

      {shareList.length > 1 && shareList[0] === "whiteboard" && (
        <svg
          id="whiteboardsvg"
          onClick={() => dispatch(actionCreators.switchShareList(shareList[1]))}
          className=" cursor-pointer"
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M21 3H3C1.89 3 1 3.89 1 5V19C1 20.11 1.89 21 3 21H21C22.11 21 23 20.11 23 19V5C23 3.89 22.11 3 21 3ZM21 19.02H3V4.98H21V19.02ZM10 12H8L12 8L16 12H14V16H10V12Z"
            fill="#A7A9AB"
          ></path>
        </svg>
      )}
      {flagRooms ? (
        <div className="w-fit h-fit font-normal text-base text-[#FFFFFF] mt-1">
          {t("Meeting.BreakoutRoom")} : {room}
        </div>
      ) : null}
      <div>
        {isHost ? (
          recording ? (
            pauseRecording ? (
              <span
                className={`text-secondary flex items-center ${
                  isCall && `text-[${themePalette?.bgSecondary}]`
                }`}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.5 1.5V6C14.5 6.55281 14.0528 7 13.5 7H9C8.44719 7 8 6.55281 8 6C8 5.44719 8.44719 5 9 5H10.9809C10.0444 3.75938 8.56687 3.00688 6.99344 3.00688C4.24062 3.00688 2 5.24687 2 8C2 10.7531 4.24031 12.9937 6.99375 12.9937C8.08375 12.9937 9.11969 12.6491 9.99 11.9956C10.4344 11.6666 11.0594 11.7534 11.3903 12.1948C11.7212 12.6373 11.6325 13.2642 11.1911 13.5952C9.97141 14.5102 8.52359 14.997 6.99734 14.997C3.14062 14.9969 0 11.8562 0 8C0 4.14375 3.14062 1.00312 6.99687 1.00312C9.15781 1.00312 11.1844 2.01781 12.5 3.69438V1.5C12.5 0.947187 12.9472 0.5 13.5 0.5C14.0528 0.5 14.5 0.947187 14.5 1.5Z"
                    fill="#A7A9AB"
                  />
                </svg>
                <span
                  id="resumeRecording"
                  className="mx-2 mt-1 cursor-pointer"
                  onClick={resumeRecord}
                >
                  {t("Meeting.Resume")}
                </span>
              </span>
            ) : (
              <span className="flex text-[#F65E1D] items-center">
                <span className="mr-2">{t("Meeting.Rec")}</span> <RecordTimer />
                <span
                  id="stopRecording"
                  onClick={stopRecording}
                  className="flex items-center cursor-pointer"
                >
                  <span className="mb-1 ml-2 mr-1.5 ">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14.1875 0.125H1.8125C0.880859 0.125 0.125 0.880859 0.125 1.8125V14.1875C0.125 15.1191 0.880859 15.875 1.8125 15.875H14.1875C15.1191 15.875 15.875 15.1191 15.875 14.1875V1.8125C15.875 0.880859 15.1191 0.125 14.1875 0.125Z"
                        fill="#F75E1D"
                      />
                    </svg>
                  </span>

                  <span
                    className={`text-secondary  ${
                      isCall && `text-[${themePalette?.bgSecondary}]`
                    }`}
                  >
                    {t("Meeting.StopRec")}
                  </span>
                </span>
              </span>
            )
          ) : null
        ) : null}
        {participantList[selfTileIndex]?.screenshare && !screenShare ? (
          <div className=" text-[#ffffff]">
            {t("Meeting.YourScreenIsBeingShared")}
          </div>
        ) : null}
      </div>
      <div className="flex items-center">
        {/* <span className=' text-[16px] mr-5 text-primary-100'>{time}</span> */}
        <Timer />
        {isCall ? (
          <div
            id="leaveIcon"
            onClick={handleLeaveMeeting}
            className=" w-fit h-fit border-2 rounded-full p-1 border-[#F75E1D]"
          >
            <svg
              className=" cursor-pointer"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                d="M17.4727 9.59766L11.5664 15.5039C11.0391 16.0312 10.125 15.6621 10.125 14.9062V11.5312H5.34375C4.87617 11.5312 4.5 11.1551 4.5 10.6875V7.3125C4.5 6.84492 4.87617 6.46875 5.34375 6.46875H10.125V3.09375C10.125 2.34141 11.0355 1.96875 11.5664 2.49609L17.4727 8.40234C17.7996 8.73281 17.7996 9.26719 17.4727 9.59766ZM6.75 15.3281V13.9219C6.75 13.6898 6.56016 13.5 6.32812 13.5H3.375C2.75273 13.5 2.25 12.9973 2.25 12.375V5.625C2.25 5.00273 2.75273 4.5 3.375 4.5H6.32812C6.56016 4.5 6.75 4.31016 6.75 4.07812V2.67188C6.75 2.43984 6.56016 2.25 6.32812 2.25H3.375C1.51172 2.25 0 3.76172 0 5.625V12.375C0 14.2383 1.51172 15.75 3.375 15.75H6.32812C6.56016 15.75 6.75 15.5602 6.75 15.3281Z"
                fill="#F75E1D"
              />
            </svg>{" "}
          </div>
        ) : (
          <div
            id="leaveIcon"
            onClick={(e) => handlePopUp(e, "endButtonFlag")}
            className=" w-fit h-fit border-2 rounded-full p-1 border-[#F75E1D]"
          >
            {/* group */}
            <svg
              className=" cursor-pointer"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                d="M17.4727 9.59766L11.5664 15.5039C11.0391 16.0312 10.125 15.6621 10.125 14.9062V11.5312H5.34375C4.87617 11.5312 4.5 11.1551 4.5 10.6875V7.3125C4.5 6.84492 4.87617 6.46875 5.34375 6.46875H10.125V3.09375C10.125 2.34141 11.0355 1.96875 11.5664 2.49609L17.4727 8.40234C17.7996 8.73281 17.7996 9.26719 17.4727 9.59766ZM6.75 15.3281V13.9219C6.75 13.6898 6.56016 13.5 6.32812 13.5H3.375C2.75273 13.5 2.25 12.9973 2.25 12.375V5.625C2.25 5.00273 2.75273 4.5 3.375 4.5H6.32812C6.56016 4.5 6.75 4.31016 6.75 4.07812V2.67188C6.75 2.43984 6.56016 2.25 6.32812 2.25H3.375C1.51172 2.25 0 3.76172 0 5.625V12.375C0 14.2383 1.51172 15.75 3.375 15.75H6.32812C6.56016 15.75 6.75 15.5602 6.75 15.3281Z"
                fill="#F75E1D"
              />
            </svg>
            {popUp.endButtonFlag ? (
              <div
                onClick={(e) => e.stopPropagation()}
                className="  absolute right-10 py-2.5 z-10"
              >
                <EndButton />
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(TopPanel)
