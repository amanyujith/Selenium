import React, { memo, useContext, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import VideoOverlay from "../tileView/videoOverlay"
import VideoTileView from "../tileView/videoTileView"
import { CarouselContext } from "pure-react-carousel"
import { branding_logo_half } from "../../../../../constants/constantValues"

const ViewerTile = (props: any) => {
  //
  const { start, stop, isCall } = props
  const participantList = useSelector(
    (state: any) => state.Main.participantList
  )
  const [brokenImage, setBrokenImage] = useState(false)
  // const [profilePicture, setProfilePicture] = useState('');
  // const loggedInUserInfo = useSelector((state: any) => state.Main.loggedInUserInfo)
  const carouselContext = useContext(CarouselContext)
  const themePalette = useSelector((state: any) => state.Main.themePalette)

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
  // const [particpantArray, setParticipantArray] = useState<any>([]);

  // let particpantArray: any = [];

  // useEffect(() => {
  //   if (Object.keys(loggedInUserInfo).length !== 0) {
  //     setProfilePicture(loggedinUserInfo?.picture)
  //   }
  // }, [loggedInUserInfo])

  const handleBrokenImage = () => {
    setBrokenImage(true)
  }

  return (
    <div className=" flex justify-center">
      {participantList.map((participant: any, index: any) => {
        if (index < start || index > stop) {
          return
        }
        return (
          <div
            key={participant.participant_id}
            className={` relative w-48 h-[108px] rounded-[3px] mt-px mr-px bg-primary-500`}
            style={{ backgroundColor: themePalette?.primary500 }}
          >
            {!participant.video ? (
              <>
                <VideoOverlay index={index} hideName={false} isCall={isCall} />

                <div className="w-full h-full relative">
                  <div
                    className={` w-9 h-9 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center text-base text text-primary-100 bg-primary-200 `}
                    style={{
                      color: themePalette?.primary100,
                      backgroundColor: themePalette?.primary300,
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
                screenShareView={true}
                isCall={isCall}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default memo(ViewerTile)
