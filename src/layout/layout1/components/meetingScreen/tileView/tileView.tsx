import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from "pure-react-carousel"
import "pure-react-carousel/dist/react-carousel.es.css"
import { memo, useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import ParticipantTile from "./participantTile"

interface ITileView {
  isCall: boolean
}

const TileView = ({ isCall }: ITileView) => {
  const participantList = useSelector(
    (state: any) => state.Main.participantList
  )
  const maxTileinSlider = useSelector(
    (state: any) => state.Main.maxTileinSlider
  )
  const meetingSession = useSelector((state: any) => state.Main.meetingSession)
  const participantVideoState = useSelector(
    (state: any) => state.Main.participantVideoState
  )
  const idleState = useSelector((state: any) => state.Flag.idleState)
  // const participantListLength = useSelector((state: any) => state.Main.participantListLength);

  // useEffect(() => {
  let _ = require("lodash")
  const maxIndex = Math.ceil(participantList.length / maxTileinSlider)
  const sliderArray = _.range(0, maxIndex, 1)
  // }, [participantListLength, participantList])

  const [currentSlider, setCurrentSlider] = useState(0)

  useEffect(() => {
    pauseIdleSliderVideos(currentSlider)
    //
  }, [currentSlider, maxIndex, participantVideoState])

  const pauseIdleSliderVideos = (currentSlider: number) => {
    const videoOffParticipants: any = [],
      videoOnParticipants: any = [],
      videoQualityOfParticipant: any = []

    participantList.forEach((participant: any, index: any) => {
      let participantSlider = Math.floor(index / maxTileinSlider)
      //
      if (!participant.isPublisher) {
        if (participantSlider === currentSlider && participant.pause) {
          //
          if (!participant.participant_id.includes("Bot"))
            videoOnParticipants.push(participant.participant_id)
        } else if (participantSlider !== currentSlider && !participant.pause) {
          //
          if (!participant.participant_id.includes("Bot"))
            videoOffParticipants.push(participant.participant_id)
        }
        if (participantSlider === currentSlider && participant.video) {
          //
          if (!participant.participant_id.includes("Bot"))
            videoQualityOfParticipant.push(participant.participant_id)
        }
      }
    })

    if (meetingSession) {
      //
      //
      if (videoOnParticipants.length !== 0) {
        //
        meetingSession.pauseSubscriberVideo(videoOnParticipants, false)
      }
      if (videoOffParticipants.length !== 0) {
        //
        meetingSession.pauseSubscriberVideo(videoOffParticipants, true)
      }
      if (videoQualityOfParticipant.length !== 0) {
        //
        if (videoQualityOfParticipant.length <= 6) {
          meetingSession.remoteParticipantVideoQuality(
            videoQualityOfParticipant,
            2,
            2
          )
        } else if (videoQualityOfParticipant.length <= 12) {
          meetingSession.remoteParticipantVideoQuality(
            videoQualityOfParticipant,
            1,
            1
          )
        } else {
          meetingSession.remoteParticipantVideoQuality(
            videoQualityOfParticipant,
            0,
            0
          )
        }
      }
    }
  }

  return (
    // <div className=' w-32 h-28 bg-primary'>
    <CarouselProvider
      naturalSlideWidth={100}
      naturalSlideHeight={125}
      totalSlides={sliderArray.length}
      className="flex w-full h-[calc(100vh-56px)] tileView"
    >
      {!idleState ? (
        <ButtonBack>
          <div className=" w-9 h-9 rounded-full flex justify-center items-center mx-5 bg-[rgba(28,22,22,0.9)]">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M5.6146 8.4041L10.3959 3.62285C10.7263 3.29238 11.2607 3.29238 11.5876 3.62285L12.3822 4.41738C12.7126 4.74785 12.7126 5.28223 12.3822 5.60918L8.99663 9.00176L12.3857 12.3908C12.7162 12.7213 12.7162 13.2557 12.3857 13.5826L11.5912 14.3807C11.2607 14.7111 10.7263 14.7111 10.3994 14.3807L5.61812 9.59941C5.28413 9.26895 5.28413 8.73457 5.6146 8.4041Z"
                fill="#A7A9AB"
              />
            </svg>
          </div>
        </ButtonBack>
      ) : null}
      <div className="w-full">
        <Slider>
          {sliderArray.map((slide: any, index: number) => {
            // let startIndex = slide * maxTileinSlider;
            // let stopIndex = startIndex + maxTileinSlider - 1;
            return (
              <Slide index={slide} key={slide}>
                <ParticipantTile
                  isCall={isCall}
                  index={index}
                  start={slide * maxTileinSlider}
                  stop={slide * maxTileinSlider + maxTileinSlider - 1}
                  maxTileinslider={maxTileinSlider}
                  setCurrentSlider={setCurrentSlider}
                />
              </Slide>
            )
          })}
        </Slider>
      </div>
      {!idleState ? (
        <ButtonNext>
          <div className=" w-9 h-9 rounded-full flex justify-center items-center mx-5 bg-[rgba(28,22,22,0.9)]">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M12.3855 9.59941L7.6043 14.3807C7.27383 14.7111 6.73945 14.7111 6.4125 14.3807L5.61797 13.5861C5.2875 13.2557 5.2875 12.7213 5.61797 12.3943L9.00703 9.00527L5.61797 5.61621C5.2875 5.28574 5.2875 4.75137 5.61797 4.42441L6.40898 3.62285C6.73945 3.29238 7.27383 3.29238 7.60078 3.62285L12.382 8.4041C12.716 8.73457 12.716 9.26895 12.3855 9.59941Z"
                fill="#A7A9AB"
              />
            </svg>
          </div>
        </ButtonNext>
      ) : null}
    </CarouselProvider>
    // </div>
  )
}

export default memo(TileView)
