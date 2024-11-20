import React, {
  useCallback,
  useRef,
  useEffect,
  useState,
  createRef,
} from "react"
import WaveSurfer from "wavesurfer.js"
// @ts-ignore
import MicrophonePlugin from "wavesurfer.js/src/plugin/microphone/index.js"
import { actionCreators } from "../../store"
import { useDispatch, useSelector } from "react-redux"
// import url from '../../assets/sample.mp3'
var timeinterval: any
var recorder, gumStream

const WaveSurferPlayer = (props: any) => {
  const dispatch = useDispatch()
  const activePlaying = useSelector((state: any) => state.Chat.activePlaying)

  let durration = 0
  let current = 0
  var waveSurfer: any = ""
  const { handlePastedFiles, setIsRecording, url, item, inlinePlayer } = props
  const waveSurferRef: any = useRef(() => createRef())
  const containerRef: any = useRef(() => createRef())
  // const [waveSurfer, setWaveSurfer] = useState<any>('')
  const [isPlaying, toggleIsPlaying] = useState(true)
  const [loading, setLoading] = useState<any>(-1)
  const [audioURL, setAudioURL] = useState("")
  const [currentState, setCurrentState] = useState<any>({
    duartion: 0,
    current: 0,
  })

  const audioWave = () => {
    if (waveSurfer) {
      setLoading(0)
      toggleIsPlaying(false)
      waveSurfer.load(url)

      // waveSurfer.setWaveColor(themeJSON?.primary)
      waveSurfer.on("ready", () => {
        waveSurferRef.current = waveSurfer
        setCurrentState({
          duartion: Math.round(waveSurfer.getDuration()),
          current: 0,
        })
        setLoading(1)
      })
      waveSurfer.on("audioprocess", () => {
        setCurrentState({
          duartion: Math.round(waveSurfer.getDuration()),
          current: Math.round(waveSurfer.getCurrentTime()),
        })
        if (
          Math.round(waveSurfer.getDuration()) ===
          Math.round(waveSurfer.getCurrentTime())
        ) {
          toggleIsPlaying(false)
        }
      })
    }
  }
  const handlePlayPause = () => {
    if (inlinePlayer) {
      if (item?.name === activePlaying?.name) {
      }
      dispatch(actionCreators.handleActivePlaying(item))
    }
    // if (waveSurfer) {
    waveSurferRef.current.playPause()
    toggleIsPlaying(waveSurferRef.current.isPlaying())
    // }
  }
  useEffect(() => {
    if (url) {
      setTimeout(() => {
        durration = 0
        current = 0
        waveSurfer = WaveSurfer.create({
          container: containerRef.current,
          barWidth: 2,
          barHeight: inlinePlayer ? 5 : 1, // the height of the wave
          barGap: 0,
        })
        audioWave()
      }, 200)
      return () => {
        if (waveSurfer) {
          waveSurfer.destroy()
        }
      }
    }
  }, [url])
  useEffect(() => {
    if (
      loading === 1 &&
      waveSurferRef?.current &&
      activePlaying?.name &&
      item?.name !== activePlaying?.name
    ) {
      try {
        if (waveSurferRef?.current.isPlaying()) {
          waveSurferRef.current.playPause()
          toggleIsPlaying(waveSurferRef.current.isPlaying())
        }
      } catch (e: any) {
        //
      }
    }
  }, [activePlaying, loading])
  function secondsToHms(d: any) {
    d = Number(d)
    var h = Math.floor(d / 3600)
    var m = Math.floor((d % 3600) / 60)
    var s = Math.floor((d % 3600) % 60)
    var hDisplay = h > 0 ? (h < 10 ? "" : "") + h : ""
    var mDisplay = m > 0 ? (m < 10 ? "" : "") + m : "0"
    var sDisplay = s > 0 ? (s < 10 ? "0" : "") + s : "00"
    return hDisplay ? hDisplay + ":" : "" + mDisplay + ":" + sDisplay
  }
  return (
    <div className="flex">
      <div className="inline-block px-1  w-[160px]">
        <div className=" mt-[-2px]">
          <div className="audioWave audioWaveLive" ref={containerRef} />
        </div>
      </div>
      <div className="inline-block px-1  w-[100px]  text-center text-[#979797]">
        {secondsToHms(currentState.current)} /{" "}
        {secondsToHms(currentState.duartion)}
      </div>
      <div
        id="playpauseAudio"
        onClick={() => handlePlayPause()}
        className={`${
          inlinePlayer ? "right-[6px] mt-[0px]" : "!right-[-4px] mt-[-4px]"
        } inline-block absolute right-[6px] bg-[#F7931F]  p-[2px] cursor-pointer h-[24px] w-[24px] rounded-[5px] border border-[#EEE]`}
      >
        {isPlaying ? (
          <svg
            className="mt-[2px] ml-[3px]"
            width="12"
            height="15"
            viewBox="0 0 12 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.73571 1.875C1.4175 1.875 1.15714 2.12812 1.15714 2.4375V12.5625C1.15714 12.8719 1.4175 13.125 1.73571 13.125H3.47143C3.78964 13.125 4.05 12.8719 4.05 12.5625V2.4375C4.05 2.12812 3.78964 1.875 3.47143 1.875H1.73571ZM0 2.4375C0 1.50586 0.777455 0.75 1.73571 0.75H3.47143C4.42969 0.75 5.20714 1.50586 5.20714 2.4375V12.5625C5.20714 13.4941 4.42969 14.25 3.47143 14.25H1.73571C0.777455 14.25 0 13.4941 0 12.5625V2.4375ZM8.1 1.875C7.78179 1.875 7.52143 2.12812 7.52143 2.4375V12.5625C7.52143 12.8719 7.78179 13.125 8.1 13.125H9.83571C10.1539 13.125 10.4143 12.8719 10.4143 12.5625V2.4375C10.4143 2.12812 10.1539 1.875 9.83571 1.875H8.1ZM6.36429 2.4375C6.36429 1.50586 7.14174 0.75 8.1 0.75H9.83571C10.794 0.75 11.5714 1.50586 11.5714 2.4375V12.5625C11.5714 13.4941 10.794 14.25 9.83571 14.25H8.1C7.14174 14.25 6.36429 13.4941 6.36429 12.5625V2.4375Z"
              fill="white"
            />
          </svg>
        ) : (
          <svg
            id="audioTick"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.75937 3.07255C4.60625 2.9788 4.4125 2.97567 4.25312 3.06317C4.09375 3.15067 3.99687 3.31942 3.99687 3.50067V14.5007C3.99687 14.6819 4.09375 14.8475 4.25312 14.9382C4.4125 15.0288 4.60312 15.0225 4.75937 14.9288L13.7594 9.4288C13.9094 9.33817 14 9.17567 14 9.00067C14 8.82567 13.9094 8.6663 13.7594 8.57255L4.75937 3.07255ZM3.76562 2.1913C4.24063 1.92567 4.81875 1.93817 5.28125 2.21942L14.2812 7.71942C14.7281 7.9913 15 8.47567 15 9.00067C15 9.52567 14.7281 10.0069 14.2812 10.2819L5.28125 15.7819C4.81875 16.0663 4.2375 16.0757 3.76562 15.81C3.29375 15.5444 3 15.0444 3 14.5007V3.50067C3 2.95692 3.29375 2.45692 3.76562 2.1913Z"
              fill="white"
            />
          </svg>
        )}
      </div>
    </div>
  )
}
export default WaveSurferPlayer
