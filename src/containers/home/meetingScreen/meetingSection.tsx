import { memo, useEffect, useRef, useState } from "react"
import BottomPanel from "../../../layout/layout1/components/meetingScreen/bottomPanel"
import TopPanel from "../../../layout/layout1/components/meetingScreen/topPanel"
import JoinAproval from "../../../layout/layout1/components/meetingScreen/joinAproval/joinAproval"
import TileView from "../../../layout/layout1/components/meetingScreen/tileView/tileView"
import ScreenShare from "../../../layout/layout1/components/meetingScreen/screenShare/screenShare"
import { useDispatch, useSelector } from "react-redux"
import { actionCreators } from "../../../store"
import { fullScreenState } from "../../../utils"
import ReactionList from "../../../layout/layout1/components/meetingScreen/reactions/reactionList"
import { Multiplayer } from "./whiteBoard/multiplayer"
import FileSharePreview from "./fileShare/fileSharePreview"
import WhiteBoardModal from "../../../layout/layout1/components/modal/whiteboardModal"
import { enableMouseHover } from "../../../store/action-creators"
import { AnimatePresence } from "framer-motion"

interface IMeetingSection {
  isCall?: boolean
}

const MeetingSection = ({ isCall = false }: IMeetingSection) => {
  const dispatch = useDispatch()
  const maxTileinSlider = useSelector(
    (state: any) => state.Main.maxTileinSlider
  )
  const participantList = useSelector(
    (state: any) => state.Main.participantList
  )
  const waitingList = useSelector((state: any) => state.Main.waitingList)
  const meetingSession = useSelector((state: any) => state.Main.meetingSession)
  const selfTileIndex = useSelector((state: any) => state.Main.selfTileIndex)
  const idleState = useSelector((state: any) => state.Flag.idleState)
  const screenShare = useSelector((state: any) => state.Main.screenShare)
  const whiteBoardState = useSelector(
    (state: any) => state.Main.whiteBoardState
  )
  const fileShareState = useSelector((state: any) => state.Main.fileShareState)
  const shareList = useSelector((state: any) => state.Main.shareList)
  const isHost = useSelector((state: any) => state.Flag.isHost)
  const whiteboardSocketState = useSelector(
    (state: any) => state.Flag.whiteboardSocketState
  )
  const whiteBoardModal = useSelector(
    (state: any) => state.Flag.whiteBoardModal
  )
  const themePalette = useSelector((state: any) => state.Main.themePalette)
  const disableMouseHoverDetection = useSelector(
    (state: any) => state.Main.disableMouseHoverDetection
  )
  const isOpen = useSelector((state: any) => state.Main.isOpen)
  const meetingSectionLayoutRef = useRef(null)

  // const [mousePosition, setMousePosition] = useState({ x: null, y: null });
  // const [mousePositionLimit, setMousePositionLimit] = useState(500)
  const [isMouseInBottomArea, setIsMouseInBottomArea] = useState(false)

  useEffect(() => {
    if (screenShare?.length === 0) {
      fullScreenState(false)
      dispatch(actionCreators.setFullScreen(false))
    }
  }, [participantList])

  useEffect(() => {
    if (whiteBoardState !== "" && whiteBoardState !== "unrestricted") {
      meetingSession.createBroadcastChannel()
    }
  }, [whiteBoardState, whiteboardSocketState])

  const exitFullScreen = () => {
    if (document.fullscreenElement === null)
      dispatch(actionCreators.setFullScreen(false))
  }

  useEffect(() => {
    document.addEventListener("webkitfullscreenchange", function () {
      exitFullScreen()
    })
    document.addEventListener("fullscreenchange", function () {
      exitFullScreen()
    })
    document.addEventListener("mozfullscreenchange", function () {
      exitFullScreen()
    })
    document.addEventListener("msfullscreenchange", function () {
      exitFullScreen()
    })
  }, [])

  //Audio Rebinding
  const selfTile = participantList[selfTileIndex]
  useEffect(() => {
    const audioStream = document.getElementById(
      `mixedAudio`
    ) as HTMLAudioElement

    if (audioStream?.srcObject === null) {
      meetingSession.streamBind("audio", selfTile?.participant_id, `mixedAudio`)
    }
  }, [])

  const increaseTile = () => {
    if (maxTileinSlider < 24)
      dispatch(actionCreators.SetMaxTileinSlider(maxTileinSlider + 5))
  }
  const decreaseTile = () => {
    if (maxTileinSlider > 4)
      dispatch(actionCreators.SetMaxTileinSlider(maxTileinSlider - 5))
  }

  //mouse pointer coordinator
  // useEffect(() => {
  //   const elementHeight = document.getElementById(
  //     "meetingSectionLayout"
  //   )?.clientHeight;
  //
  //   const updateMousePosition = (ev: any) => {
  //     setMousePosition({
  //       x: ev.clientX,
  //       y: ev.clientY,
  //     });
  //     if (elementHeight) setMousePositionLimit(elementHeight / 3);
  //   };

  //   window.addEventListener("mousemove", updateMousePosition);

  //   return () => {
  //     window.removeEventListener("mousemove", updateMousePosition);
  //   };
  // }, []);

  useEffect(() => {
    if (disableMouseHoverDetection) {
      setIsMouseInBottomArea(true)
      if (isCall && isOpen) {
        setTimeout(() => {
          setIsMouseInBottomArea(false)
          dispatch(enableMouseHover(false))
        }, 8000)
      }
    }
    // else if(isCall) {

    // }
  }, [disableMouseHoverDetection, isOpen])

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!disableMouseHoverDetection) {
      const divHeight = event.currentTarget.clientHeight
      const mouseY = event.clientY
      const bottomAreaHeight = divHeight / 3

      if (mouseY >= divHeight - bottomAreaHeight && !isMouseInBottomArea) {
        console.log("time3333-", isMouseInBottomArea)
        setIsMouseInBottomArea(true)
      } else if (mouseY < divHeight - bottomAreaHeight && isMouseInBottomArea) {
        console.log("time44444-", isMouseInBottomArea)
        setIsMouseInBottomArea(false)
      }
    }
  }

  return (
    <div onMouseMove={handleMouseMove} id="meetingSectionLayout">
      <div
        className={`${
          participantList[selfTileIndex]?.screenshare
            ? "border-[1px] border-main"
            : ""
        }  w-screen h-screen absolute `}
        style={
          participantList[selfTileIndex]?.screenshare
            ? { border: `1px solid ${themePalette?.main}` }
            : {}
        }
      ></div>
      <TopPanel screenShare={screenShare?.length > 0} isCall={isCall} />
      {/* {isHost !== true ? (
        <div onClick={() => dispatch(actionCreators.setGuestJoinRoomModal(true))} className="h-fit w-[187px] mr-8 flex flex-row pt-2 z-10 cursor-pointer bg-[#ffffff1f] absolute top-0 right-0 mt-20 ">
          <svg
            className="ml-3 cursor-pointer"
            width="18"
            height="17"
            viewBox="0 0 18 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.5625 16.8184C5.9875 16.8184 5.472 16.6684 5.016 16.3684C4.5595 16.0684 4.20625 15.6559 3.95625 15.1309C3.75625 15.3934 3.50325 15.5964 3.19725 15.7399C2.89075 15.8839 2.575 15.9559 2.25 15.9559C1.6125 15.9559 1.07825 15.7371 0.64725 15.2996C0.21575 14.8621 0 14.3309 0 13.7059C0 13.1684 0.175 12.6839 0.525 12.2524C0.875 11.8214 1.31875 11.5746 1.85625 11.5121C1.68125 11.2621 1.547 10.9964 1.4535 10.7149C1.3595 10.4339 1.3125 10.1371 1.3125 9.82461C1.3125 9.32461 1.44075 8.85586 1.69725 8.41836C1.95325 7.98086 2.3125 7.62461 2.775 7.34961C2.8375 7.57461 2.92175 7.81511 3.02775 8.07111C3.13425 8.32761 3.25625 8.54961 3.39375 8.73711C3.21875 8.87461 3.08125 9.04011 2.98125 9.23361C2.88125 9.42761 2.83125 9.63086 2.83125 9.84336C2.83125 10.5434 3.11875 10.9746 3.69375 11.1371C4.26875 11.2996 4.8125 11.4309 5.325 11.5309L5.68125 12.1309C5.54375 12.5309 5.425 12.8716 5.325 13.1531C5.225 13.4341 5.175 13.6871 5.175 13.9121C5.175 14.2871 5.3095 14.6154 5.5785 14.8969C5.847 15.1779 6.175 15.3184 6.5625 15.3184C7.0375 15.3184 7.43125 15.1059 7.74375 14.6809C8.05625 14.2559 8.3125 13.7559 8.5125 13.1809C8.7125 12.6059 8.86575 12.0246 8.97225 11.4371C9.07825 10.8496 9.1625 10.3996 9.225 10.0871L10.6875 10.4809C10.575 11.0434 10.4375 11.6871 10.275 12.4121C10.1125 13.1371 9.8845 13.8276 9.591 14.4836C9.297 15.1401 8.9095 15.6934 8.4285 16.1434C7.947 16.5934 7.325 16.8184 6.5625 16.8184ZM7.575 11.4934C7 10.9809 6.47825 10.5026 6.00975 10.0586C5.54075 9.61511 5.1375 9.18411 4.8 8.76561C4.4625 8.34661 4.20325 7.92761 4.02225 7.50861C3.84075 7.09011 3.75 6.65586 3.75 6.20586C3.75 5.39336 4.02825 4.70886 4.58475 4.15236C5.14075 3.59636 5.825 3.31836 6.6375 3.31836C6.6875 3.31836 6.73125 3.32136 6.76875 3.32736C6.80625 3.33386 6.85 3.33711 6.9 3.33711C6.85 3.21211 6.8125 3.08711 6.7875 2.96211C6.7625 2.83711 6.75 2.70586 6.75 2.56836C6.75 1.94336 6.96875 1.41211 7.40625 0.974609C7.84375 0.537109 8.375 0.318359 9 0.318359C9.625 0.318359 10.1562 0.537109 10.5938 0.974609C11.0312 1.41211 11.25 1.94336 11.25 2.56836C11.25 2.70586 11.2375 2.83386 11.2125 2.95236C11.1875 3.07136 11.15 3.19336 11.1 3.31836H11.3625C12.1125 3.31836 12.75 3.55886 13.275 4.03986C13.8 4.52136 14.1125 5.11836 14.2125 5.83086C13.9875 5.79336 13.7345 5.77461 13.4535 5.77461C13.172 5.77461 12.9125 5.78711 12.675 5.81211C12.5875 5.52461 12.4283 5.28711 12.1973 5.09961C11.9658 4.91211 11.6875 4.81836 11.3625 4.81836C10.925 4.81836 10.5845 4.94661 10.341 5.20311C10.097 5.45911 9.7625 5.83086 9.3375 6.31836H8.64375C8.20625 5.80586 7.86575 5.42761 7.62225 5.18361C7.37825 4.94011 7.05 4.81836 6.6375 4.81836C6.2375 4.81836 5.90625 4.94961 5.64375 5.21211C5.38125 5.47461 5.25 5.80586 5.25 6.20586C5.25 6.49336 5.33125 6.79011 5.49375 7.09611C5.65625 7.40261 5.8845 7.72761 6.1785 8.07111C6.472 8.41511 6.82825 8.78086 7.24725 9.16836C7.66575 9.55586 8.13125 9.97461 8.64375 10.4246L7.575 11.4934ZM11.4188 16.8184C11.1438 16.8184 10.872 16.7809 10.6035 16.7059C10.3345 16.6309 10.075 16.5121 9.825 16.3496C9.9625 16.1746 10.1 15.9684 10.2375 15.7309C10.375 15.4934 10.5 15.2746 10.6125 15.0746C10.75 15.1621 10.8875 15.2246 11.025 15.2621C11.1625 15.2996 11.3 15.3184 11.4375 15.3184C11.8375 15.3184 12.1718 15.1779 12.4403 14.8969C12.7092 14.6154 12.8438 14.2809 12.8438 13.8934C12.8438 13.6559 12.7937 13.3996 12.6937 13.1246C12.5937 12.8496 12.475 12.5121 12.3375 12.1121L12.6937 11.5121C13.2187 11.4121 13.7658 11.2809 14.3348 11.1184C14.9033 10.9559 15.1875 10.5246 15.1875 9.82461C15.1875 9.32461 15.0033 8.96211 14.6348 8.73711C14.2657 8.51211 13.8625 8.39961 13.425 8.39961C12.9 8.39961 12.2875 8.49961 11.5875 8.69961C10.8875 8.89961 10.0688 9.15586 9.13125 9.46836L8.7375 8.00586C9.7125 7.69336 10.5813 7.43086 11.3438 7.21836C12.1062 7.00586 12.8062 6.89961 13.4437 6.89961C14.3062 6.89961 15.0625 7.15586 15.7125 7.66836C16.3625 8.18086 16.6875 8.89961 16.6875 9.82461C16.6875 10.1371 16.6405 10.4339 16.5465 10.7149C16.453 10.9964 16.3188 11.2621 16.1437 11.5121C16.6812 11.5746 17.125 11.8214 17.475 12.2524C17.825 12.6839 18 13.1684 18 13.7059C18 14.3309 17.7845 14.8621 17.3535 15.2996C16.922 15.7371 16.3875 15.9559 15.75 15.9559C15.425 15.9559 15.1095 15.8839 14.8035 15.7399C14.497 15.5964 14.2438 15.3934 14.0438 15.1309C13.7937 15.6559 13.4405 16.0684 12.984 16.3684C12.528 16.6684 12.0063 16.8184 11.4188 16.8184Z"
              fill="#A7A9AB"
            />
          </svg>
          <div className="text-sm ml-3 mb-2 text-[#FFFFFF]">Join Breakout Room</div>
        </div>
      ) : null} */}
      {isHost && waitingList.length > 0 ? <JoinAproval /> : null}
      <audio id={"mixedAudio"} autoPlay={true} />
      {shareList.length > 0 ? (
        shareList[0] === "whiteboard" ? (
          <div className="w-full h-[calc(100vh-56px)]">
            <Multiplayer />
          </div>
        ) : (
          <ScreenShare length={participantList.length} isCall={isCall} />
        )
      ) : (
        <TileView isCall={isCall} />
      )}
      <AnimatePresence mode="wait">
        <ReactionList
          isCall={isCall}
          participant_id={participantList[selfTileIndex]?.participant_id}
        />
      </AnimatePresence>
      {fileShareState?.status === "progress" && <FileSharePreview />}
      <AnimatePresence mode="wait">
        <ReactionList
          isCall={isCall}
          participant_id={participantList[selfTileIndex]?.participant_id}
        />
      </AnimatePresence>

      {!idleState || isCall ? (
        <BottomPanel
          screenShare={screenShare}
          increaseTile={increaseTile}
          decreaseTile={decreaseTile}
          show={isMouseInBottomArea}
          isCall={isCall}
        />
      ) : null}
      {whiteBoardModal && <WhiteBoardModal />}
    </div>
  );
}

export default memo(MeetingSection)
