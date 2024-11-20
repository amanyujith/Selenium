import React, { memo, useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import MicButton from "../meetingButtons/micButton"
import MoreButton from "../meetingButtons/moreButton"
import VideoButton from "../meetingButtons/videoButton"
import ScreenShareButton from "../meetingButtons/screenshareButton"
import ReactionButton from "../meetingButtons/reactionButton"
import MemberButton from "../meetingButtons/memberButton"
import MoreOptions from "./moreOptions/moreOptions"
import Reactions from "./reactions/reactions"
import ReactionList from "./reactions/reactionList"
import { actionCreators } from "../../../../store"
import { useNavigate } from "react-router-dom"
import path from "../../../../navigation/routes.path"
import AudioAnalyser from "../join/audioPreview/audioAnalyser"
import ChatButton from "../meetingButtons/chatButton"
import WhiteBoardButton from "../meetingButtons/whiteBoardButton"
import ScreensharePauseandStop from "../meetingButtons/screensharePauseandStop"
import ShareOptions from "./shareOption/shareOptions"
import InviteUserModal from "../dashboard/Chat/call/addMember"
import InviteButton from "../meetingButtons/inviteButton"
import { AnimatePresence } from "framer-motion"

const BottomPanel = (props: any) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  // const { handlePopUp } = props;
  const popUp = useSelector((state: any) => state.Flag.popUp)
  // const meetingAudio = useSelector((state: any) => state.Flag.meetingAudio)
  // const meetingVideo = useSelector((state: any) => state.Flag.mettingVideo)
  const meetingSession = useSelector((state: any) => state.Main.meetingSession)
  const participantList = useSelector(
    (state: any) => state.Main.participantList
  )
  const fileShareState = useSelector((state: any) => state.Main.fileShareState)
  const selfTileIndex = useSelector((state: any) => state.Main.selfTileIndex)
  const currentDevice = useSelector((state: any) => state.Main.currentDevice)
  const idleState = useSelector((state: any) => state.Flag.idleState)
  const isHost = useSelector((state: any) => state.Flag.isHost)

  const time = useSelector((state: any) => state.Main.time)
  const themePalette = useSelector((state: any) => state.Main.themePalette)
  // const selfTileIndex = useSelector((state: any) => state.Main.selfTileIndex)
  // const participantListLength = useSelector((state: any) => state.Main.participantListLength)

  const [selfTileData, setSelfTileData] = useState<any>(null)
  const [inviteModal, ToggleInviteModal] = useState<boolean>(false)

  useEffect(() => {
    const data = [...participantList].find((participant: any) => {
      return participant.isPublisher === true
    })
    setSelfTileData({ ...data })
  }, [participantList])

  // const [moreButton, setMoreButton] = useState(false);
  // const [reaction, setReaction] = useState(false);
  // const [sharing, setSharing] = useState(false);
  // const [audio, setAudio] = useState(meetingAudio);
  // const [video, setVideo] = useState(mettingVideo)

  // const handleReactions = () => {
  //   setReaction(!reaction)
  // }

  const handleAudio = () => {
    //self participant id
    const participant_id = selfTileData.participant_id
    //handling mic state.
    meetingSession.muteStreamAction(
      "mic",
      selfTileData.audio ? "mute" : "unmute"
    )
    // dispatch(actionCreators.setAudio(!meetingAudio))
  }
  const handleVideo = () => {
    const participant_id = selfTileData.participant_id
    //handling camera state
    meetingSession.muteStreamAction(
      "camera",
      selfTileData.video ? "mute" : "unmute"
    )
  }

  const startScreenShare = () => {
    dispatch(actionCreators.setPopUp("closeAll"))

    //
    if (selfTileData.screenshare) {
      meetingSession.contentShareAction(false, false)
      // setSharing(false)
      dispatch(actionCreators.setScreensharePause(false))
    } else {
      window.parent.postMessage("focusWindow")
      meetingSession.contentShareAction(false, true)
      // setSharing(true)
      //  window.parent.postMessage('PopupClicked', '*');
    }
  }

  // const getMicrophone = async () => {
  //   const audioData = await navigator.mediaDevices.getUserMedia({
  //     audio: true,
  //     //  {
  //     //   deviceId: currentDevice?.audioInput
  //     // },
  //     video: false
  //   })
  //   setAudioData(audioData);
  // }

  //

  // useMemo(() => {
  //   getMicrophone()
  // }, [])

  return (
    // <div className={`${!idleState ? ' group-hover:transition-all group-hover:ease-linear group-hover:duration-300  group-hover:bottom-0 group-hover:absolute ' : 'absolute -bottom-32 transition-all ease-linear duration-300'} w-full flex justify-between items-center px-10 py-1 z-[2] bg-[rgba(28,22,22,0.8)]`}>
    // <div className='group-hover:transition-all group-hover:ease-linear group-hover:duration-300  group-hover:bottom-0 absolute -bottom-14 transition-all ease-linear duration-300 w-full flex justify-between items-center px-10 py-1 z-[2] bg-[rgba(28,22,22,0.8)]'>
    <>
      {inviteModal ? <InviteUserModal /> : null}
      <div
        className={` ${props.show
          ? "transition-all ease-linear duration-300 bottom-0"
          : "-bottom-16 transition-all ease-linear duration-300"
          }  absolute w-full flex justify-between items-center px-10 py-1 z-[2] bg-[rgba(28,22,22,0.8)]`}
      >
        <AnimatePresence>
          {popUp.reactionFlag ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className=" absolute left-0 bottom-0"
            >
              <Reactions isCall={props.isCall} />
            </div>
          ) : null}
        </AnimatePresence>
        <div className="flex">
          <ReactionButton />
          {/* <WhiteBoardButton onClick={handleWhiteBoard} /> */}
        </div>
        <div className="flex z-[2]">
          {/* {audioData ? <AudioAnalyser audio={audioData} /> : null} */}
          <MicButton onClick={handleAudio} audio={selfTileData?.audio} />
          <VideoButton onClick={handleVideo} video={selfTileData?.video} />
          <div className="">
            <div className="relative">
              <AnimatePresence>
                {popUp.sharePopup && (props.isCall || !idleState) ? (
                  <div
                    id="ShareOptions"
                    onClick={(e) => e.stopPropagation()}
                    className={`group-hover:visible absolute bottom-3`}
                  >
                    <ShareOptions
                      increaseTile={props.increaseTile}
                      decreaseTile={props.decreaseTile}
                      noOfTiles={props.noOfTiles}
                      isCall={props.isCall}
                      handleScreenshare={() => startScreenShare()}
                    />
                  </div>
                ) : null}
              </AnimatePresence>
            </div>
            {/* <div className='absolute'> */}
            <ScreenShareButton
              sharing={selfTileData?.screenshare}
              handleScreenshare={() => startScreenShare()}
            />
            {/* </div> */}
          </div>
          <ScreensharePauseandStop
            sharing={selfTileData?.screenshare}
            handleScreenshare={() => startScreenShare()}
          />
        </div>

        <div className="flex">
          {/* {props.isCall ? <InviteButton/> : null} */}
          {!props.isCall && <ChatButton />}
          <MemberButton length={participantList.length} />
          <AnimatePresence>
            {popUp.moreOptionFlag && (props.isCall || !idleState) ? (
              <div
                id="MoreOptions"
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-14 right-16"
              >
                <MoreOptions
                  isCall={props.isCall}
                  increaseTile={props.increaseTile}
                  decreaseTile={props.decreaseTile}
                  noOfTiles={props.noOfTiles}
                />
              </div>
            ) : null}
          </AnimatePresence>
          <MoreButton />
        </div>
      </div>
    </>
  );
}

export default memo(BottomPanel)
