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
let durration = 0
let current = 0
let waveSurfer: any = ""
var timeinterval: any
var audioURL: any = ""
var recorder: any
var blobs: any = []

const WaveSurferPlayer = (props: any) => {
  const { handlePastedFiles, setIsRecording, focusEditor } = props
  const containerRef: any = useRef(() => createRef())
  // const [waveSurfer, setWaveSurfer] = useState<any>('')
  const [isPlaying, toggleIsPlaying] = useState(true)
  const [loading, setLoading] = useState<any>(false)
  // const [audioURL, setAudioURL] = useState('');
  const [currentState, setCurrentState] = useState<any>({
    duartion: 0,
    current: 0,
  })
  async function createFile(url: string) {
    let response = await fetch(url)
    let data = await response.blob()
    let metadata = {
      type: "audio/mp3",
    }
    let file = new File(
      [data],
      `recording_${new Date().getTime().toString()}.mp3`,
      metadata
    )
    return file
  }
  const handlePlayPause = () => {
    if (isPlaying) {
      // recorder.ondataavailable = function (e:any) {
      //     var url = URL.createObjectURL(e.data);
      //     blobs.push(url)
      //     var previewElm: any;
      //
      // }
      waveSurfer?.microphone?.stop()
    } else {
      waveSurfer?.microphone?.start()
    }
    toggleIsPlaying(!isPlaying)
    if (timeinterval) {
      clearInterval(timeinterval)
    }

    // waveSurferRef.current.playPause()
    // toggleIsPlaying(waveSurferRef.current.isPlaying())
  }
  const handleSubmit = async () => {
    await waveSurfer?.microphone?.stop()
    clearInterval(timeinterval)
    toggleIsPlaying(false)
    var data: any
    setTimeout(async () => {
      focusEditor()
      if (blobs.length > 1) {
        const blob = await blobs.reduce(
          (a: any, b: any) => new Blob([a, b], { type: "audio/mp3" })
        )
        var mainURL = URL.createObjectURL(blob)

        data = await createFile(mainURL)
      } else {
        data = await createFile(audioURL)
      }
      handlePastedFiles([data])
      setIsRecording(false)
    }, 1000)
  }
  const updateClock = () => {
    durration++
    current++
    setCurrentState({
      durration: durration,
      current: current,
    })
  }

  useEffect(() => {
    setTimeout(() => {
      durration = 0
      current = 0

      waveSurfer = WaveSurfer?.create({
        container: containerRef.current,
        barWidth: 2,
        barHeight: 2.5, // the height of the wave
        barGap: 0,
        plugins: [MicrophonePlugin?.create({ scrollingWaveform: true })],
        hideScrollbar: true,
      })
      blobs = []

      waveSurfer?.microphone?.start()
      waveSurfer?.microphone?.on("deviceReady", function (stream: any) {
        recorder = new MediaRecorder(stream)
        recorder.ondataavailable = function (e: any) {
          var previewElm: any
          var url = URL.createObjectURL(e.data)
          var preview: any = document.createElement("audio")
          preview.controls = true
          blobs.push(e.data)
          preview.src = url
          //document.body.appendChild(preview);
          audioURL = url
          previewElm = document.getElementById("preview")
          if (previewElm?.hasChildNodes()) {
            previewElm.replaceChild(preview, previewElm.childNodes[0])
          } else if (previewElm?.appendChild) {
            previewElm.appendChild(preview)
          }
        }
        recorder.start()
        if (timeinterval) {
          clearInterval(timeinterval)
        }
        timeinterval = setInterval(updateClock, 1000)
      })
      waveSurfer?.on("audioprocess", () => {})
      waveSurfer?.microphone?.on("deviceError", function (code: any) {
        console.warn("VTADevice error: " + code)
      })
    }, 200)
    return () => {
      // if (waveSurfer) {
      blobs = []
      waveSurfer?.destroy()
      // }
    }
    // audioWave()
  }, [])

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
    <>
      <div className="inline-block px-1  w-[160px]">
        <div className=" mt-[-2px]">
          <div className="audioWave audioWaveLive" ref={containerRef} />
          <div className="p-3 cursor-pointer"></div>
        </div>
      </div>
      <div className="hidden" id="preview" />
      <div className="inline-block px-1  w-[50px]  text-center text-[#979797]">
        {secondsToHms(currentState.current)}
      </div>
      <div
        onClick={() => handlePlayPause()}
        className="inline-block p-[2px] cursor-pointer h-[24px] w-[24px] rounded-[5px] border border-[#EEE]"
      >
        {isPlaying ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className=""
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              d="M4.73571 3.375C4.4175 3.375 4.15714 3.62812 4.15714 3.9375V14.0625C4.15714 14.3719 4.4175 14.625 4.73571 14.625H6.47143C6.78964 14.625 7.05 14.3719 7.05 14.0625V3.9375C7.05 3.62812 6.78964 3.375 6.47143 3.375H4.73571ZM3 3.9375C3 3.00586 3.77746 2.25 4.73571 2.25H6.47143C7.42969 2.25 8.20714 3.00586 8.20714 3.9375V14.0625C8.20714 14.9941 7.42969 15.75 6.47143 15.75H4.73571C3.77746 15.75 3 14.9941 3 14.0625V3.9375ZM11.1 3.375C10.7818 3.375 10.5214 3.62812 10.5214 3.9375V14.0625C10.5214 14.3719 10.7818 14.625 11.1 14.625H12.8357C13.1539 14.625 13.4143 14.3719 13.4143 14.0625V3.9375C13.4143 3.62812 13.1539 3.375 12.8357 3.375H11.1ZM9.36429 3.9375C9.36429 3.00586 10.1417 2.25 11.1 2.25H12.8357C13.794 2.25 14.5714 3.00586 14.5714 3.9375V14.0625C14.5714 14.9941 13.794 15.75 12.8357 15.75H11.1C10.1417 15.75 9.36429 14.9941 9.36429 14.0625V3.9375Z"
              fill="#5C6779"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              d="M10.4062 4.78125V9C10.4062 9.93076 9.64951 10.6875 8.71875 10.6875C7.78799 10.6875 7.03125 9.93076 7.03125 9V4.78125C7.03125 3.85049 7.78799 3.09375 8.71875 3.09375C9.64951 3.09375 10.4062 3.85049 10.4062 4.78125ZM6.1875 4.78125V9C6.1875 10.3975 7.32129 11.5312 8.71875 11.5312C10.1162 11.5312 11.25 10.3975 11.25 9V4.78125C11.25 3.38379 10.1162 2.25 8.71875 2.25C7.32129 2.25 6.1875 3.38379 6.1875 4.78125ZM5.34375 7.73438C5.34375 7.50234 5.15391 7.3125 4.92188 7.3125C4.68984 7.3125 4.5 7.50234 4.5 7.73438V9C4.5 11.1885 6.16377 12.9867 8.29688 13.1977V14.9062H6.60938C6.37734 14.9062 6.1875 15.0961 6.1875 15.3281C6.1875 15.5602 6.37734 15.75 6.60938 15.75H8.71875H10.8281C11.0602 15.75 11.25 15.5602 11.25 15.3281C11.25 15.0961 11.0602 14.9062 10.8281 14.9062H9.14062V13.1977C11.2737 12.9867 12.9375 11.1885 12.9375 9V7.73438C12.9375 7.50234 12.7477 7.3125 12.5156 7.3125C12.2836 7.3125 12.0938 7.50234 12.0938 7.73438V9C12.0938 10.8642 10.5829 12.375 8.71875 12.375C6.85459 12.375 5.34375 10.8642 5.34375 9V7.73438Z"
              fill="#5C6779"
            />
          </svg>
        )}
      </div>
      <div
        onClick={() => handleSubmit()}
        className="inline-block relative h-[24px] w-[24px] cursor-pointer p-1 ml-1 rounded-[5px] bg-[#dcc7af]"
      >
        <svg
        id="audioTick"
          className=""
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.6098 4.64015C15.7967 4.82703 15.7967 5.13446 15.6098 5.32133L7.41159 13.5196C7.22472 13.7065 6.91728 13.7065 6.73041 13.5196L2.39015 9.17934C2.20328 8.99247 2.20328 8.68503 2.39015 8.49816C2.57703 8.31129 2.88446 8.31129 3.07133 8.49816L7.071 12.4978L14.9287 4.64015C15.1155 4.45328 15.423 4.45328 15.6098 4.64015Z"
            fill="white"
          />
        </svg>
      </div>
    </>
  )
}
export default WaveSurferPlayer
