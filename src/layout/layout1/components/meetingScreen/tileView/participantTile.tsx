import "./videotile.css"
import VideoOverlay from "./videoOverlay"
import { memo, useContext, useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import VideoTileView from "./videoTileView"
import { CarouselContext } from "pure-react-carousel"
import { branding_logo_half } from "../../../../../constants/constantValues"
import { AnimatePresence, motion } from "framer-motion"

const ParticipantTile = (props: any) => {
  const participantList = useSelector(
    (state: any) => state.Main.participantList
  )
  const maxTileinSlider = useSelector(
    (state: any) => state.Main.maxTileinSlider
  )
  const membersList = useSelector((state: any) => state.Flag.membersList)
  const selfParticipantID = useSelector(
    (state: any) => state.Main.selfParticipantID
  )
  const [brokenImage, setBrokenImage] = useState(false)
  // const idleState = useSelector((state: any) => state.Flag.idleState);
  // const [profilePicture, setProfilePicture] = useState('');
  // const loggedInUserInfo = useSelector((state: any) => state.Main.loggedInUserInfo)

  const themePalette = useSelector((state: any) => state.Main.themePalette)

  // const participantListLength = useSelector((state: any) => state.Main.participantListLength);
  const [tileLayout, setTileLayout] = useState({
    tile: "participantGroupOne",
    avatar: "avatarSize1to12",
  })
  // const [avatarSize, setAvatarSize] = useState('avatarSize1to12')
  // const participantVideoState = useSelector((state: any) => state.Main.participantVideoState)

  // const [idileState, setIdileState] = useState(false)
  // const timerObject: { timer: NodeJS.Timeout | null } = useMemo(() => { return { timer: null } }, [])

  // let particpantArray = participantList.filter((participant: any, index: any) => {
  //   return (
  //     !(index < props.start || index > props.stop)
  //   );
  // })

  // const particpantArray =
  //   useMemo(() =>
  //     participantList.filter((participant: any, index: any) => {
  //       return (
  //         !(index < props.start || index > props.stop)
  //       );
  //     })
  //     , [participantList]);

  const carouselContext = useContext(CarouselContext)
  // const [currentSlide, setCurrentSlide] = useState(carouselContext.state.currentSlide);
  useEffect(() => {
    function onChange() {
      props.setCurrentSlider(carouselContext.state.currentSlide)
      // dispatch(Actions.setCurrentSlider(carouselContext.state.currentSlide));
    }
    carouselContext.subscribe(onChange)
    return () => {
      carouselContext.unsubscribe(onChange)
    }
  }, [participantList])

  const handleBrokenImage = () => {
    setBrokenImage(true)
  }

  // const selfTileData = participantList.find((participant: any) => {
  //   return participant.isPublisher === true;
  // })

  // useEffect(() => {
  //   const videoStream = document.getElementById(`video${selfTileData.participant_id}`)
  //   if (selfTileData.video && videoStream.srcObject) {
  //     user.streamBind('video', selfTileData.participant_id, `video${selfTileData.participant_id}`)
  //
  //   }
  // })

  // let avatarSize: any = 'avatarSize1to12';

  useEffect(() => {
    // setMembersTile(participantList.slice(0,props.noOfTiles));
    switch (
    props.stop >= participantList.length - 1
      ? participantList.length - props.start
      : participantList.length -
      props.start -
      (participantList.length - props.stop)
    ) {
      case 1:
        setTileLayout({
          tile: membersList
            ? "participantGroupOneWithPanel"
            : "participantGroupOne",
          avatar: "avatarSize1to12",
        })
        break
      case 2:
        setTileLayout({
          tile: membersList
            ? "participantGroupTwoWithPanel"
            : "participantGroupTwo",
          avatar: "avatarSize1to12",
        })
        break
      case 3:
      case 4:
        setTileLayout({
          tile: membersList
            ? "participantGroupThreeFourWithPanel"
            : "participantGroupThreeFour",
          avatar: "avatarSize1to12",
        })
        break
      case 5:
      case 6:
        setTileLayout({
          tile: membersList
            ? "participantGroupFiveSixWithPanel"
            : "participantGroupFiveSix",
          avatar: "avatarSize1to12",
        })
        break
      case 7:
      case 8:
      case 9:
        setTileLayout({
          tile: membersList
            ? "participantGroupSevenEightNineWithPanel"
            : "participantGroupSevenEightNine",
          avatar: "avatarSize1to12",
        })
        break
      case 10:
      case 11:
      case 12:
        setTileLayout({
          tile: membersList
            ? "participantGroupTenToTwelveWithPanel"
            : "participantGroupTenToTwelve",
          avatar: "avatarSize1to12",
        })
        break
      case 13:
      case 14:
      case 15:
        setTileLayout({
          tile: membersList
            ? "participantGroup13to15WithPanel"
            : "participantGroup13to15",
          avatar: "avatarSize13to15",
        })
        break
      case 16:
        setTileLayout({
          tile: membersList
            ? "participantGroup16WithPanel"
            : "participantGroup16",
          avatar: "avatarSize13to15",
        })
        break
      case 17:
      case 18:
      case 19:
      case 20:
        setTileLayout({
          tile: membersList
            ? "participantGroup17to20WithPanel"
            : "participantGroup17to20",
          avatar: "avatarSize17to24",
        })
        break
      case 21:
      case 22:
      case 23:
      case 24:
        setTileLayout({
          tile: membersList
            ? "participantGroup20to24WithPanel"
            : "participantGroup20to24",
          avatar: "avatarSize17to24",
        })
        break
    }
  }, [participantList, membersList, maxTileinSlider])

  /***********************************************************
   *   Hide videoOverlay on screen idile time.               *
   ***********************************************************/
  // const inactivityTime = () => {
  //
  //   let currSeconds = 0;
  //   const startIdleTimer = () => {
  //     currSeconds = currSeconds + 1;
  //     if (currSeconds > 2) {
  //       setIdileState(true)
  //     }
  //   }
  //   const resetTimer = () => {
  //     //

  //     if (timerObject.timer) {
  //       clearTimeout(timerObject.timer)
  //       setIdileState(false)
  //       currSeconds = 0;
  //       timerObject.timer = setInterval(startIdleTimer, 1000)
  //     }

  //   }
  //   if (!timerObject.timer) {
  //     timerObject.timer = setInterval(startIdleTimer, 1000)
  //   } else {
  //     resetTimer()
  //   }

  //   // window.onload = resetTimer;
  //   window.onmousemove = resetTimer;
  //   window.onmousedown = resetTimer;
  //   window.ontouchstart = resetTimer;
  //   window.onclick = resetTimer;
  //   window.onkeypress = resetTimer;
  // }

  // window.onload = inactivityTime;
  // useEffect(() => {
  //
  //   if (props.stop - props.start >= 3)
  //     inactivityTime()
  // }, [props.start, maxTileinSlider])
  //end

  return (
    <div className=" flex flex-wrap place-content-center h-[calc(100vh-56px)]">
      {participantList.map((participant: any, index: any) => {
        if (index < props.start || index > props.stop) {
          return
        }
        return (
          <motion.div
            key={participant.participant_id}
            layout={!props.isCall}
            initial={props.isCall ? {} : { scale: 0, translateX: '50px', opacity: 0 }}
            animate={
              props.isCall
                ? {}
                : {
                  scale: 1,
                  opacity: 1,
                  translateX: '0px',
                  transition: {
                    duration: 0.4,
                    ease: props.isCall ? "easeIn" : [0.65, 0, 0.35, 1],
                    type: "tween",
                  },
                }
            }
            exit={props.isCall ? {} : { scale: 0 }}
            transition={
              props.isCall
                ? {}
                : {
                  duration: 0.3,
                  ease: "circOut",
                  type: "tween",
                }
            }
            className={`${selfParticipantID === participant.participant_id ? "slefTile" : ""
              } participant inline-block rounded-[3px] mt-px mr-px relative ${tileLayout.tile
              } bg-[${themePalette?.primary500}]`}
            style={{ backgroundColor: themePalette?.primary500 }}
          >
            {!participant.video ? (
              <>
                <VideoOverlay index={index} hideName={false} />
                <div className="w-full h-full relative">
                  <div
                    className={`w-[100px] h-[100px] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center text-5xl text ${tileLayout.avatar} text-[${themePalette?.primary100}] bg-[${themePalette?.primary300}] `}
                    style={{
                      backgroundColor: themePalette?.primary300,
                      color: themePalette?.primary100,
                    }}
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
                </div>
              </>
            ) : (
              <VideoTileView
                participant={participant}
                index={index}
                isCall={props.isCall}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  )
}

export default memo(ParticipantTile)
